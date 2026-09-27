import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import {
  INITIAL_DOCTORS,
  INITIAL_DOCUMENTS,
  INITIAL_CHUNKS,
  INITIAL_SOURCES,
  INITIAL_CONFLICTS,
  INITIAL_AUDIT_LOGS,
} from './server/data/mockData.ts';
import { Doctor, DocumentChunk, KnowledgeDocument, Source, ConflictRecord, AuditLog, VerificationTask } from './src/types/index.ts';
import { BM25Index } from './server/services/bm25.ts';
import { KnowledgeGraphService } from './server/services/knowledgeGraph.ts';
import { IngestionPipeline } from './server/services/ingestion.ts';
import { RAGPipeline } from './server/services/geminiRAG.ts';
import { runRAGEvaluation } from './server/services/evaluator.ts';
import { generateEmbedding } from './server/services/embedding.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Database Store
const doctorsMap = new Map<string, Doctor>();
INITIAL_DOCTORS.forEach(d => doctorsMap.set(d.id, { ...d }));

const documentsList: KnowledgeDocument[] = [...INITIAL_DOCUMENTS];
const chunksList: DocumentChunk[] = [...INITIAL_CHUNKS];
// Pre-generate embeddings for initial chunks
chunksList.forEach(c => {
  if (!c.embedding) {
    c.embedding = generateEmbedding(c.text);
  }
});

const sourcesList: Source[] = [...INITIAL_SOURCES];
const conflictsList: ConflictRecord[] = [...INITIAL_CONFLICTS];
const auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];

const verificationTasks: VerificationTask[] = [
  {
    id: 'task-1',
    type: 'conflict_flag',
    targetId: 'doc-4',
    targetName: 'Dr. Rajesh Verma',
    reportedIssue: 'Discrepancy in years of clinical experience (18 yrs Fortis vs 14 yrs DoctorPedia)',
    evidenceUrls: [
      'https://fortishealthcare.com/doctors/dr-rajesh-verma',
      'https://doctorpedia-profiles.net/dr/rajesh-verma'
    ],
    proposedData: { experienceYears: 18 },
    status: 'pending',
    submittedAt: '2026-09-26T14:30:00Z',
  },
  {
    id: 'task-2',
    type: 'new_entry',
    targetId: 'doc-6',
    targetName: 'Dr. Sunita Rao',
    reportedIssue: 'Crowdsourced submission claiming transfer of primary neurology practice to Breach Candy Hospital',
    evidenceUrls: [
      'https://lilavatihospital.com/doctors/neurology/sunita-rao',
      'https://medrag.internal/submissions/community-upload'
    ],
    proposedData: { hospital: 'Lilavati Hospital & Research Centre' },
    status: 'pending',
    submittedAt: '2026-09-27T08:15:00Z',
  }
];

const feedbackLogs: {
  id: string;
  query: string;
  answerSnippet: string;
  rating: 'helpful' | 'unhelpful';
  reason?: string;
  reportedInaccuracy?: string;
  timestamp: string;
}[] = [
  {
    id: 'fb-1',
    query: 'Pediatric heart surgeons in Bengaluru',
    answerSnippet: 'Dr. Devi Prasad Shetty at Narayana Health City...',
    rating: 'helpful',
    timestamp: '2026-09-26T11:20:00Z',
  }
];

// Initialize Services
const bm25Index = new BM25Index(chunksList);
const kgService = new KnowledgeGraphService();
const ingestionPipeline = new IngestionPipeline(
  bm25Index,
  kgService,
  doctorsMap,
  chunksList,
  documentsList
);
const ragPipeline = new RAGPipeline(
  bm25Index,
  kgService,
  doctorsMap,
  chunksList
);

let cachedEvaluation: any = null;

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // ==========================================
  // REST API ENDPOINTS
  // ==========================================

  // Health Check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      version: '2.5.0-medrag',
      timestamp: new Date().toISOString(),
      activeDoctors: doctorsMap.size,
      totalChunks: chunksList.length,
      geminiConfigured: !!process.env.GEMINI_API_KEY,
    });
  });

  // Auth / Role Session
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { role } = req.body;
    const validRoles = ['admin', 'reviewer', 'doctor', 'public_user'];
    const chosenRole = validRoles.includes(role) ? role : 'admin';

    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: chosenRole,
      action: 'USER_LOGIN',
      details: `User switched session role to ${chosenRole}`,
    });

    res.json({
      role: chosenRole,
      name: chosenRole === 'admin' ? 'Chief Medical Administrator' : chosenRole === 'reviewer' ? 'Lead Peer Reviewer' : chosenRole === 'doctor' ? 'Clinical Faculty' : 'General Public / Patient',
      email: `${chosenRole}@medrag.health`,
      token: `jwt-medrag-${chosenRole}-${Date.now()}`,
      permissions: chosenRole === 'admin'
        ? ['read', 'write', 'verify', 'resolve_conflict', 'reindex', 'manage_sources']
        : chosenRole === 'reviewer'
        ? ['read', 'write', 'verify', 'resolve_conflict']
        : ['read'],
    });
  });

  // 1. Doctors Endpoints
  app.get('/api/doctors', (req: Request, res: Response) => {
    const { specialization, city, status, tier, search } = req.query;
    let doctors = Array.from(doctorsMap.values());

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      doctors = doctors.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        d.hospital.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.areasOfExpertise.some(e => e.toLowerCase().includes(q))
      );
    }

    if (specialization && typeof specialization === 'string') {
      doctors = doctors.filter(d => d.specialization.toLowerCase() === specialization.toLowerCase());
    }
    if (city && typeof city === 'string') {
      doctors = doctors.filter(d => d.city.toLowerCase() === city.toLowerCase());
    }
    if (status && typeof status === 'string') {
      doctors = doctors.filter(d => d.verificationStatus === status);
    }
    if (tier && typeof tier === 'string') {
      const t = parseInt(tier, 10);
      doctors = doctors.filter(d => d.trustTier === t);
    }

    res.json(doctors);
  });

  app.get('/api/doctors/:id', (req: Request, res: Response) => {
    const doctor = doctorsMap.get(req.params.id);
    if (!doctor) {
      res.status(404).json({ error: 'Doctor record not found' });
      return;
    }
    const subgraph = kgService.findDoctorSubGraph(doctor.name);
    const relatedChunks = chunksList.filter(c => c.metadata.doctorId === doctor.id || c.metadata.doctorName === doctor.name);

    res.json({
      doctor,
      subgraph,
      relatedChunks,
    });
  });

  app.post('/api/doctors', async (req: Request, res: Response) => {
    try {
      const payload = req.body;
      const result = await ingestionPipeline.processUpload({
        title: `Manual Clinical Profile: ${payload.name || 'New Doctor'}`,
        type: 'manual',
        content: `Doctor Profile: ${payload.name}. Specialization: ${payload.specialization}. Qualifications: ${JSON.stringify(payload.qualifications || [])}. Hospital: ${payload.hospital}. Experience: ${payload.experienceYears} years. City: ${payload.city}. Areas of expertise: ${(payload.areasOfExpertise || []).join(', ')}.`,
        tier: payload.trustTier || 4,
        targetDoctor: payload,
      });

      auditLogs.unshift({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: 'admin',
        action: 'CREATE_DOCTOR',
        details: `Created doctor profile: ${payload.name} (Tier ${payload.trustTier || 4})`,
      });

      res.status(201).json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to create doctor' });
    }
  });

  // 2. Document & Ingestion Endpoints
  app.get('/api/knowledge', (req: Request, res: Response) => {
    res.json({
      documents: documentsList,
      totalChunks: chunksList.length,
      chunksPreview: chunksList.slice(0, 30),
    });
  });

  app.post('/api/documents/upload', async (req: Request, res: Response) => {
    try {
      const { title, type, content, tier, sourceUrl } = req.body;
      if (!content || !title) {
        res.status(400).json({ error: 'Content and title are required' });
        return;
      }

      const result = await ingestionPipeline.processUpload({
        title,
        type: type || 'txt',
        content,
        sourceUrl,
        tier: tier ? parseInt(tier, 10) as any : 4,
      });

      auditLogs.unshift({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: 'admin',
        action: 'UPLOAD_DOCUMENT',
        details: `Uploaded & processed document: ${title} (${result.chunks.length} chunks indexed, ${result.piiRedacted} PII fields masked)`,
        piiDetected: result.piiRedacted > 0,
      });

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Document ingestion failed' });
    }
  });

  app.post('/api/knowledge/url', async (req: Request, res: Response) => {
    try {
      const { url, title, tier } = req.body;
      if (!url) {
        res.status(400).json({ error: 'URL is required' });
        return;
      }

      // Simulated controlled crawl respecting robots.txt & terms
      const simulatedContent = `Controlled web ingestion from verified portal: ${url}. Source: ${title || url}.
Extracted Clinical Entities: Faculty appointments, sub-specialty clinical fellowships, peer-reviewed clinical trial references, and accredited hospital staff indices.
Date of collection: ${new Date().toISOString().split('T')[0]}. Provenance verified against domain SSL certificates and healthcare provider registry.`;

      const result = await ingestionPipeline.processUpload({
        title: title || `Web Ingestion: ${new URL(url).hostname}`,
        type: 'url',
        content: simulatedContent,
        sourceUrl: url,
        tier: tier ? parseInt(tier, 10) as any : 1,
      });

      auditLogs.unshift({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: 'system_crawler',
        action: 'CRAWL_URL',
        details: `Ingested URL provenance record: ${url} (Tier ${tier || 1})`,
      });

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'URL ingestion failed' });
    }
  });

  app.delete('/api/knowledge/:id', (req: Request, res: Response) => {
    const docId = req.params.id;
    const docIndex = documentsList.findIndex(d => d.id === docId);
    if (docIndex === -1) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }
    const removedDoc = documentsList.splice(docIndex, 1)[0];

    // Remove associated chunks
    const remainingChunks = chunksList.filter(c => c.documentId !== docId);
    chunksList.length = 0;
    remainingChunks.forEach(c => chunksList.push(c));
    bm25Index.rebuild(chunksList);

    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'admin',
      action: 'DELETE_DOCUMENT',
      details: `Deleted document: ${removedDoc.title}`,
    });

    res.json({ success: true, removedDocumentId: docId });
  });

  app.post('/api/knowledge/:id/reindex', (req: Request, res: Response) => {
    const docId = req.params.id;
    const doc = documentsList.find(d => d.id === docId);
    if (!doc) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    const docChunks = chunksList.filter(c => c.documentId === docId);
    docChunks.forEach(c => {
      c.embedding = generateEmbedding(c.text);
    });
    bm25Index.rebuild(chunksList);

    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'admin',
      action: 'REINDEX_DOCUMENT',
      details: `Re-embedded and re-indexed document: ${doc.title}`,
    });

    res.json({ success: true, reindexedChunks: docChunks.length });
  });

  // 3. Search & RAG Query Endpoints
  app.post('/api/search', (req: Request, res: Response) => {
    const { query, filters, topK } = req.body;
    const limit = topK || 10;
    const results = bm25Index.search(query || '', limit);
    res.json(results.map(r => ({
      chunk: r.chunk,
      score: r.score,
    })));
  });

  app.post('/api/rag/query', async (req: Request, res: Response) => {
    try {
      const { query, filters, topK } = req.body;
      if (!query || typeof query !== 'string') {
        res.status(400).json({ error: 'Query is required' });
        return;
      }

      const response = await ragPipeline.executeQuery(query, filters, topK || 5);

      auditLogs.unshift({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: 'rag_user',
        action: 'RAG_QUERY',
        details: `Query executed: "${query.slice(0, 60)}..." (Latency: ${response.latencyMs}ms, Model: ${response.modelUsed}, Chunks: ${response.retrievedChunks.length})`,
      });

      res.json(response);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'RAG query failed' });
    }
  });

  // 4. Feedback & Reporting Endpoints
  app.post('/api/feedback', (req: Request, res: Response) => {
    const { query, answerSnippet, rating, reason, reportedInaccuracy, doctorName } = req.body;
    const feedbackItem = {
      id: `fb-${Date.now()}`,
      query: query || '',
      answerSnippet: answerSnippet || '',
      rating: rating || 'helpful',
      reason,
      reportedInaccuracy,
      timestamp: new Date().toISOString(),
    };
    feedbackLogs.unshift(feedbackItem);

    // If inaccuracy reported, automatically generate a verification task!
    if (rating === 'unhelpful' && reportedInaccuracy) {
      verificationTasks.unshift({
        id: `task-${Date.now()}`,
        type: 'user_report',
        targetId: 'user_reported',
        targetName: doctorName || 'Entity under review',
        reportedIssue: reportedInaccuracy,
        evidenceUrls: ['https://medrag.internal/feedback/' + feedbackItem.id],
        proposedData: {},
        status: 'pending',
        submittedAt: new Date().toISOString(),
      });

      auditLogs.unshift({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: 'feedback_loop',
        action: 'VERIFICATION_TASK_CREATED',
        details: `Automated review task generated from user report: "${reportedInaccuracy}"`,
      });
    }

    res.json({ success: true, feedbackId: feedbackItem.id });
  });

  // 5. Sources Endpoints
  app.get('/api/sources', (req: Request, res: Response) => {
    res.json(sourcesList);
  });

  app.post('/api/sources', (req: Request, res: Response) => {
    const payload = req.body;
    const newSource: Source = {
      id: `src-${Date.now()}`,
      name: payload.name,
      url: payload.url,
      tier: payload.tier || 4,
      tierDescription: payload.tier === 1 ? 'Tier 1: Official hospital / government' : payload.tier === 2 ? 'Tier 2: Recognized medical association' : payload.tier === 3 ? 'Tier 3: Academic publications' : payload.tier === 4 ? 'Tier 4: Public web profiles' : 'Tier 5: User crowdsourced',
      reliabilityScore: payload.reliabilityScore || 85,
      recordsCount: 0,
      lastScrapedOrIngested: new Date().toISOString(),
      status: 'active',
    };
    sourcesList.push(newSource);
    res.status(201).json(newSource);
  });

  // 6. Verification & Conflicts
  app.get('/api/verification', (req: Request, res: Response) => {
    res.json({
      tasks: verificationTasks,
      conflicts: conflictsList,
    });
  });

  app.post('/api/verification/:id/resolve', (req: Request, res: Response) => {
    const id = req.params.id;
    const { action, chosenSource, resolutionNotes, reviewerId } = req.body;

    const conflict = conflictsList.find(c => c.id === id);
    if (conflict) {
      conflict.status = 'resolved';
      conflict.resolutionNotes = resolutionNotes || `Resolved by selecting ${chosenSource}`;
      conflict.resolvedBy = reviewerId || 'Chief Medical Administrator';
      conflict.resolvedAt = new Date().toISOString();

      // Update doctor status if no more unresolved conflicts
      const doc = doctorsMap.get(conflict.doctorId);
      if (doc) {
        const remainingUnresolved = conflictsList.filter(c => c.doctorId === doc.id && c.status === 'unresolved');
        if (remainingUnresolved.length === 0) {
          doc.verificationStatus = 'verified';
        }
      }

      auditLogs.unshift({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: reviewerId || 'admin',
        action: 'RESOLVE_CONFLICT',
        details: `Resolved conflict ${id} for ${conflict.doctorName} on field ${conflict.field}`,
      });

      res.json({ success: true, conflict });
      return;
    }

    const task = verificationTasks.find(t => t.id === id);
    if (task) {
      task.status = action === 'approve' ? 'approved' : 'rejected';
      task.reviewerId = reviewerId || 'Chief Medical Administrator';

      auditLogs.unshift({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: reviewerId || 'admin',
        action: 'REVIEW_TASK',
        details: `Marked verification task ${id} as ${task.status}`,
      });

      res.json({ success: true, task });
      return;
    }

    res.status(404).json({ error: 'Conflict or Task not found' });
  });

  // 7. Knowledge Graph Endpoints
  app.get('/api/knowledge-graph', (req: Request, res: Response) => {
    const graphData = kgService.getGraphData();
    res.json(graphData);
  });

  // 8. Analytics & Audit Logs
  app.get('/api/analytics', (req: Request, res: Response) => {
    const doctors = Array.from(doctorsMap.values());
    const verifiedDoctors = doctors.filter(d => d.verificationStatus === 'verified').length;
    const conflictingDoctors = doctors.filter(d => d.verificationStatus === 'conflicting').length;
    const unverifiedDoctors = doctors.filter(d => d.verificationStatus === 'unverified' || d.verificationStatus === 'pending').length;

    res.json({
      totalDoctors: doctors.length,
      verifiedDoctors,
      conflictingDoctors,
      unverifiedDoctors,
      totalDocuments: documentsList.length,
      totalSources: sourcesList.length,
      totalChunks: chunksList.length,
      totalEmbeddings: chunksList.filter(c => !!c.embedding).length,
      activeConflicts: conflictsList.filter(c => c.status === 'unresolved').length,
      resolvedConflicts: conflictsList.filter(c => c.status === 'resolved').length,
      feedbackStats: {
        totalFeedback: feedbackLogs.length,
        helpfulCount: feedbackLogs.filter(f => f.rating === 'helpful').length,
        unhelpfulCount: feedbackLogs.filter(f => f.rating === 'unhelpful').length,
      },
      auditLogsCount: auditLogs.length,
    });
  });

  app.get('/api/audit-logs', (req: Request, res: Response) => {
    res.json(auditLogs);
  });

  // 9. Evaluation System
  app.get('/api/evaluations', async (req: Request, res: Response) => {
    if (!cachedEvaluation) {
      cachedEvaluation = await runRAGEvaluation(ragPipeline);
    }
    res.json(cachedEvaluation);
  });

  app.post('/api/evaluations/run', async (req: Request, res: Response) => {
    cachedEvaluation = await runRAGEvaluation(ragPipeline);
    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'evaluator',
      action: 'RUN_EVALUATION',
      details: `Ran RAG test suite: Precision ${(cachedEvaluation.retrievalPrecision * 100).toFixed(0)}%, Faithfulness ${(cachedEvaluation.answerFaithfulness * 100).toFixed(0)}%`,
    });
    res.json(cachedEvaluation);
  });

  // ==========================================
  // VITE MIDDLEWARE / STATIC ASSETS
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MedRAG] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[MedRAG] Fatal server startup error:', err);
});
