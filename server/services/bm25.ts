// Okapi BM25 Search Implementation for Medical Lexical Retrieval
import { DocumentChunk } from '../../src/types/index.ts';

const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'could', 'did',
  'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
  'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into',
  'is', 'it', 'its', 'itself', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on',
  'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she',
  'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then',
  'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was',
  'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you',
  'your', 'yours', 'yourself', 'yourselves'
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOPWORDS.has(token));
}

export class BM25Index {
  private k1: number = 1.5;
  private b: number = 0.75;
  private docCount: number = 0;
  private avgDocLength: number = 0;
  private docLengths: Map<string, number> = new Map();
  private termDocFrequencies: Map<string, number> = new Map();
  private docTermFrequencies: Map<string, Map<string, number>> = new Map();
  private chunks: DocumentChunk[] = [];

  constructor(chunks: DocumentChunk[] = []) {
    this.rebuild(chunks);
  }

  public rebuild(chunks: DocumentChunk[]) {
    this.chunks = chunks;
    this.docCount = chunks.length;
    this.docLengths.clear();
    this.termDocFrequencies.clear();
    this.docTermFrequencies.clear();

    if (this.docCount === 0) return;

    let totalLength = 0;

    for (const chunk of chunks) {
      const tokens = tokenize(chunk.text + ' ' + (chunk.metadata.doctorName || '') + ' ' + (chunk.metadata.specialization || '') + ' ' + (chunk.metadata.hospital || '') + ' ' + (chunk.metadata.city || ''));
      const length = tokens.length;
      this.docLengths.set(chunk.id, length);
      totalLength += length;

      const tfMap = new Map<string, number>();
      const uniqueTerms = new Set<string>();

      for (const token of tokens) {
        tfMap.set(token, (tfMap.get(token) || 0) + 1);
        uniqueTerms.add(token);
      }

      this.docTermFrequencies.set(chunk.id, tfMap);

      for (const term of uniqueTerms) {
        this.termDocFrequencies.set(term, (this.termDocFrequencies.get(term) || 0) + 1);
      }
    }

    this.avgDocLength = totalLength / (this.docCount || 1);
  }

  public search(query: string, topK: number = 10): { chunk: DocumentChunk; score: number }[] {
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0 || this.docCount === 0) {
      return this.chunks.slice(0, topK).map(chunk => ({ chunk, score: 0 }));
    }

    const scores: { chunk: DocumentChunk; score: number }[] = [];

    for (const chunk of this.chunks) {
      const docLength = this.docLengths.get(chunk.id) || 1;
      const tfMap = this.docTermFrequencies.get(chunk.id) || new Map();
      let docScore = 0;

      for (const term of queryTokens) {
        const tf = tfMap.get(term) || 0;
        if (tf === 0) continue;

        const df = this.termDocFrequencies.get(term) || 0;
        // IDF with floor smoothing
        const idf = Math.log(1 + (this.docCount - df + 0.5) / (df + 0.5));

        const numerator = tf * (this.k1 + 1);
        const denominator = tf + this.k1 * (1 - this.b + this.b * (docLength / (this.avgDocLength || 1)));

        docScore += idf * (numerator / denominator);
      }

      // Bonus for exact name match in metadata
      if (chunk.metadata.doctorName) {
        const docNameLower = chunk.metadata.doctorName.toLowerCase();
        if (query.toLowerCase().includes(docNameLower) || docNameLower.includes(query.toLowerCase())) {
          docScore += 3.0;
        }
      }

      scores.push({ chunk, score: docScore });
    }

    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, topK);
  }
}
