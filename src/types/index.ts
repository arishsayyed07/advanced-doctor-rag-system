export interface Qualification {
  degree: string;
  institute: string;
  year: number;
}

export interface Publication {
  title: string;
  journal: string;
  year: number;
  doi?: string;
  pmid?: string;
}

export interface PublicProfile {
  platform: string;
  url: string;
}

export type TrustTier = 1 | 2 | 3 | 4 | 5;
export type VerificationStatus = 'verified' | 'unverified' | 'pending' | 'conflicting';

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialization: string;
  subSpecialization: string;
  qualifications: Qualification[];
  hospital: string;
  hospitalDepartment: string;
  city: string;
  state: string;
  country: string;
  experienceYears: number;
  areasOfExpertise: string[];
  publications: Publication[];
  memberships: string[];
  languages: string[];
  publicProfiles: PublicProfile[];
  verificationStatus: VerificationStatus;
  trustTier: TrustTier;
  primarySourceUrl: string;
  primarySourceTitle: string;
  dateCollected: string;
  lastVerifiedDate: string;
  confidenceScore: number;
  conflicts?: ConflictRecord[];
  bio?: string;
}

export interface Source {
  id: string;
  name: string;
  url: string;
  tier: TrustTier;
  reliabilityScore: number;
  recordsCount: number;
  lastScrapedOrIngested: string;
  status: 'active' | 'under_review' | 'blocked';
  tierDescription: string;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  text: string;
  metadata: {
    doctorId?: string;
    doctorName?: string;
    specialization?: string;
    hospital?: string;
    city?: string;
    sourceUrl: string;
    sourceTitle: string;
    tier: TrustTier;
    verificationStatus: VerificationStatus;
    chunkIndex: number;
    parentDocTitle: string;
  };
  embedding?: number[];
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  type: 'pdf' | 'docx' | 'txt' | 'csv' | 'json' | 'url' | 'manual';
  sourceUrl?: string;
  tier: TrustTier;
  uploadDate: string;
  status: 'processed' | 'pending' | 'failed' | 'conflicting';
  chunkCount: number;
  piiRedactedCount: number;
  extractedDoctors: string[];
  rawContent?: string;
  sizeBytes?: number;
}

export interface ConflictRecord {
  id: string;
  doctorId: string;
  doctorName: string;
  field: 'experienceYears' | 'hospital' | 'qualifications' | 'specialization' | 'certifications';
  sourceA: {
    sourceName: string;
    sourceUrl: string;
    tier: TrustTier;
    value: string | number;
    date: string;
  };
  sourceB: {
    sourceName: string;
    sourceUrl: string;
    tier: TrustTier;
    value: string | number;
    date: string;
  };
  status: 'unresolved' | 'resolved';
  resolutionNotes?: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: 'Doctor' | 'Hospital' | 'Specialization' | 'City' | 'Qualification' | 'Publication' | 'Organization';
  properties: Record<string, any>;
}

export interface KnowledgeGraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: 'specializes_in' | 'works_at' | 'located_in' | 'has_qualification' | 'published' | 'member_of' | 'offers';
}

export interface Citation {
  id: number;
  text: string;
  sourceTitle: string;
  sourceUrl: string;
  tier: TrustTier;
  verifiedDate: string;
  confidence: number;
}

export interface RetrievedChunk {
  id: string;
  text: string;
  score: number;
  vectorScore: number;
  bm25Score: number;
  rrfScore: number;
  rerankScore: number;
  source: string;
  sourceUrl: string;
  tier: TrustTier;
  verified: boolean;
  lastVerified: string;
  doctorName?: string;
}

export interface RAGQueryResponse {
  answer: string;
  intent: string;
  rewrittenQuery: string;
  extractedEntities: {
    doctors: string[];
    specializations: string[];
    locations: string[];
    hospitals: string[];
  };
  retrievedChunks: RetrievedChunk[];
  citations: Citation[];
  conflictsDetected: ConflictRecord[];
  graphEvidence: {
    nodes: string[];
    relations: string[];
  };
  latencyMs: number;
  tokenCount: number;
  modelUsed: string;
  faithfulnessScore: number;
}

export interface RAGEvaluationMetric {
  retrievalPrecision: number;
  retrievalRecall: number;
  contextRelevance: number;
  answerFaithfulness: number;
  citationAccuracy: number;
  citationCoverage: number;
  hallucinationRate: number;
  avgLatencyMs: number;
  testCases: {
    id: string;
    query: string;
    groundTruthDoctor: string;
    retrievedRelevant: boolean;
    faithful: boolean;
    latencyMs: number;
  }[];
}

export interface VerificationTask {
  id: string;
  type: 'new_entry' | 'user_report' | 'conflict_flag';
  targetId: string;
  targetName: string;
  reportedIssue?: string;
  evidenceUrls: string[];
  proposedData: Partial<Doctor>;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  submittedAt: string;
  reviewerId?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  piiDetected?: boolean;
}

export interface UserRole {
  role: 'admin' | 'reviewer' | 'doctor' | 'public_user';
  name: string;
  email: string;
}
