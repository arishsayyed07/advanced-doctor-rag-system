// End-to-End Data Ingestion Pipeline
import { Doctor, DocumentChunk, KnowledgeDocument, TrustTier, VerificationStatus } from '../../src/types/index.ts';
import { detectAndScrubPII } from './pii.ts';
import { generateEmbedding } from './embedding.ts';
import { BM25Index } from './bm25.ts';
import { KnowledgeGraphService } from './knowledgeGraph.ts';
import { detectConflicts } from './conflictDetector.ts';

export interface IngestionOptions {
  title: string;
  type: 'pdf' | 'docx' | 'txt' | 'csv' | 'json' | 'url' | 'manual';
  content: string;
  sourceUrl?: string;
  tier?: TrustTier;
  targetDoctor?: Partial<Doctor>;
}

export interface IngestionResult {
  document: KnowledgeDocument;
  chunks: DocumentChunk[];
  extractedDoctors: Doctor[];
  conflictsFound: number;
  piiRedacted: number;
}

export class IngestionPipeline {
  private bm25Index: BM25Index;
  private kgService: KnowledgeGraphService;
  private doctorsMap: Map<string, Doctor>;
  private chunksList: DocumentChunk[];
  private documentsList: KnowledgeDocument[];

  constructor(
    bm25Index: BM25Index,
    kgService: KnowledgeGraphService,
    doctorsMap: Map<string, Doctor>,
    chunksList: DocumentChunk[],
    documentsList: KnowledgeDocument[]
  ) {
    this.bm25Index = bm25Index;
    this.kgService = kgService;
    this.doctorsMap = doctorsMap;
    this.chunksList = chunksList;
    this.documentsList = documentsList;
  }

  public async processUpload(options: IngestionOptions): Promise<IngestionResult> {
    const docId = `doc-${Date.now()}`;
    const rawContent = options.content;
    const tier: TrustTier = options.tier || (options.type === 'manual' ? 5 : 4);

    // Step 1: PII Detection & Sensitive Patient Information Scrubbing
    const piiResult = detectAndScrubPII(rawContent);
    const cleanedContent = piiResult.cleanedText;

    // Step 2: Extract or Synthesize Doctor Entities
    const extractedDoctors: Doctor[] = [];
    let conflictsCount = 0;

    if (options.targetDoctor && options.targetDoctor.name) {
      const doc = this.buildDoctorFromPayload(options.targetDoctor, options.sourceUrl, tier);
      
      // Check for conflicts with existing doctors
      const existingMatch = Array.from(this.doctorsMap.values()).find(
        d => d.name.toLowerCase() === doc.name.toLowerCase()
      );

      if (existingMatch) {
        const conflicts = detectConflicts(existingMatch, {
          doctorName: doc.name,
          specialization: doc.specialization,
          experienceYears: doc.experienceYears,
          hospital: doc.hospital,
          sourceName: options.title,
          sourceUrl: options.sourceUrl || 'user_manual_entry',
          tier,
          date: new Date().toISOString().split('T')[0],
        });

        if (conflicts.length > 0) {
          conflictsCount += conflicts.length;
          doc.verificationStatus = 'conflicting';
          existingMatch.verificationStatus = 'conflicting';
          if (!existingMatch.conflicts) existingMatch.conflicts = [];
          existingMatch.conflicts.push(...conflicts);
          doc.conflicts = conflicts;
        }
      }

      this.doctorsMap.set(doc.id, doc);
      this.kgService.addDoctorToGraph(doc);
      extractedDoctors.push(doc);
    } else {
      // Regex & pattern fact extraction from text
      const extracted = this.extractFactsFromText(cleanedContent, options.title, options.sourceUrl, tier);
      for (const doc of extracted) {
        this.doctorsMap.set(doc.id, doc);
        this.kgService.addDoctorToGraph(doc);
        extractedDoctors.push(doc);
      }
    }

    // Step 3: Contextual Chunking
    const chunks = this.createContextualChunks(docId, options.title, cleanedContent, extractedDoctors, tier, options.sourceUrl);

    // Step 4: Embedding generation for each chunk
    for (const chunk of chunks) {
      chunk.embedding = generateEmbedding(chunk.text);
      this.chunksList.push(chunk);
    }

    // Step 5: Update BM25 Inverted Index
    this.bm25Index.rebuild(this.chunksList);

    // Step 6: Create Document Record
    const verificationStatus: VerificationStatus =
      conflictsCount > 0 ? 'conflicting' : tier <= 2 ? 'verified' : 'pending';

    const documentRecord: KnowledgeDocument = {
      id: docId,
      title: options.title,
      type: options.type,
      sourceUrl: options.sourceUrl,
      tier,
      uploadDate: new Date().toISOString(),
      status: verificationStatus === 'conflicting' ? 'conflicting' : 'processed',
      chunkCount: chunks.length,
      piiRedactedCount: piiResult.piiCount,
      extractedDoctors: extractedDoctors.map(d => d.name),
      rawContent: cleanedContent.slice(0, 1000),
      sizeBytes: rawContent.length,
    };

    this.documentsList.unshift(documentRecord);

    return {
      document: documentRecord,
      chunks,
      extractedDoctors,
      conflictsFound: conflictsCount,
      piiRedacted: piiResult.piiCount,
    };
  }

  private buildDoctorFromPayload(data: Partial<Doctor>, sourceUrl?: string, tier: TrustTier = 4): Doctor {
    const id = data.id || `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const status: VerificationStatus = tier <= 2 ? 'verified' : tier === 5 ? 'unverified' : 'pending';

    return {
      id,
      name: data.name || 'Unknown Doctor',
      title: data.title || 'Dr.',
      specialization: data.specialization || 'General Medicine',
      subSpecialization: data.subSpecialization || 'Clinical Practice',
      qualifications: data.qualifications || [{ degree: 'MBBS', institute: 'Medical College', year: 2010 }],
      hospital: data.hospital || 'Hospital',
      hospitalDepartment: data.hospitalDepartment || 'Department of Medicine',
      city: data.city || 'Mumbai',
      state: data.state || 'Maharashtra',
      country: data.country || 'India',
      experienceYears: data.experienceYears !== undefined ? data.experienceYears : 10,
      areasOfExpertise: data.areasOfExpertise || ['Consultation', 'Diagnosis'],
      publications: data.publications || [],
      memberships: data.memberships || [],
      languages: data.languages || ['English'],
      publicProfiles: data.publicProfiles || [],
      verificationStatus: status,
      trustTier: tier,
      primarySourceUrl: sourceUrl || data.primarySourceUrl || 'https://medrag.internal/records/' + id,
      primarySourceTitle: data.primarySourceTitle || `Source Record (Tier ${tier})`,
      dateCollected: new Date().toISOString().split('T')[0],
      lastVerifiedDate: new Date().toISOString().split('T')[0],
      confidenceScore: tier === 1 ? 98 : tier === 2 ? 92 : tier === 3 ? 90 : tier === 4 ? 75 : 55,
      bio: data.bio || `Practicing ${data.specialization} specialist affiliated with ${data.hospital}.`,
    };
  }

  private extractFactsFromText(text: string, title: string, sourceUrl?: string, tier: TrustTier = 4): Doctor[] {
    const doctors: Doctor[] = [];
    // Identify doctor names starting with Dr.
    const doctorMatch = text.match(/Dr\.\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/);
    if (!doctorMatch) return doctors;

    const name = `Dr. ${doctorMatch[1]}`;
    
    // Extract specialization heuristic
    let specialization = 'General Medicine';
    const specKeywords = [
      'Cardiology', 'Neurology', 'Oncology', 'Pulmonology', 'Pediatrics',
      'Orthopedics', 'Gastroenterology', 'Endocrinology', 'Dermatology', 'Nephrology'
    ];
    for (const spec of specKeywords) {
      if (new RegExp(`\\b${spec}\\b`, 'i').test(text)) {
        specialization = spec;
        break;
      }
    }

    // Extract experience
    let expYears = 12;
    const expMatch = text.match(/(\d+)\s+(?:years|yrs)\s+(?:of\s+)?(?:experience|practice)/i);
    if (expMatch) {
      expYears = parseInt(expMatch[1], 10);
    }

    // Extract hospital
    let hospital = 'Tertiary Care Hospital';
    const hospMatch = text.match(/at\s+([A-Z][A-Za-z0-9\s&,-]+(?:Hospital|Institute|Clinic|Medical Centre|Health))/i);
    if (hospMatch) {
      hospital = hospMatch[1].trim();
    }

    // Extract city
    let city = 'Mumbai';
    const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Gurugram', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Pune'];
    for (const c of cities) {
      if (new RegExp(`\\b${c}\\b`, 'i').test(text)) {
        city = c;
        break;
      }
    }

    const doc = this.buildDoctorFromPayload({
      name,
      specialization,
      experienceYears: expYears,
      hospital,
      city,
      primarySourceTitle: title,
      primarySourceUrl: sourceUrl || 'https://medrag.internal/source/' + encodeURIComponent(name),
      bio: text.slice(0, 300),
    }, sourceUrl, tier);

    doctors.push(doc);
    return doctors;
  }

  private createContextualChunks(
    docId: string,
    docTitle: string,
    content: string,
    extractedDoctors: Doctor[],
    tier: TrustTier,
    sourceUrl?: string
  ): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    // Split text into paragraphs or sentence groups (~250-400 characters)
    const rawParagraphs = content.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 30);

    const paragraphs = rawParagraphs.length > 0 ? rawParagraphs : [content];
    let chunkIndex = 0;

    for (const p of paragraphs) {
      const associatedDoctor = extractedDoctors[0];

      chunks.push({
        id: `chunk-${docId}-${chunkIndex}`,
        documentId: docId,
        text: p,
        metadata: {
          doctorId: associatedDoctor?.id,
          doctorName: associatedDoctor?.name,
          specialization: associatedDoctor?.specialization,
          hospital: associatedDoctor?.hospital,
          city: associatedDoctor?.city,
          sourceUrl: sourceUrl || associatedDoctor?.primarySourceUrl || 'https://medrag.internal/docs',
          sourceTitle: docTitle,
          tier,
          verificationStatus: associatedDoctor?.verificationStatus || (tier <= 2 ? 'verified' : 'pending'),
          chunkIndex,
          parentDocTitle: docTitle,
        },
      });
      chunkIndex++;
    }

    return chunks;
  }
}
