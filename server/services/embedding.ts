// Deterministic Semantic Embedding and Cosine Similarity Service
// Produces 128-dimensional dense vectors reflecting semantic, morphological, and clinical token distributions

export function generateEmbedding(text: string): number[] {
  const dim = 128;
  const vector = new Array(dim).fill(0);
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const tokens = normalized.split(/\s+/).filter(t => t.length > 1);

  if (tokens.length === 0) {
    return vector;
  }

  // Domain concept boosts for medical specialties and clinical roles
  const clinicalWeights: Record<string, number[]> = {
    cardiology: [0, 4, 8, 12, 16],
    cardiac: [0, 4, 8, 12, 16],
    heart: [0, 4, 8, 12, 16],
    angioplasty: [1, 5, 9, 13, 17],
    bypass: [1, 5, 9, 13, 17],
    tavr: [1, 5, 9, 13, 17],
    neurology: [2, 6, 10, 14, 18],
    brain: [2, 6, 10, 14, 18],
    stroke: [2, 6, 10, 14, 18],
    parkinson: [3, 7, 11, 15, 19],
    dementia: [3, 7, 11, 15, 19],
    alzheimer: [3, 7, 11, 15, 19],
    oncology: [20, 24, 28, 32, 36],
    cancer: [20, 24, 28, 32, 36],
    leukemia: [21, 25, 29, 33, 37],
    chemotherapy: [21, 25, 29, 33, 37],
    bone: [22, 26, 30, 34, 38],
    transplant: [22, 26, 30, 34, 38],
    pulmonology: [40, 44, 48, 52, 56],
    lung: [40, 44, 48, 52, 56],
    asthma: [41, 45, 49, 53, 57],
    copd: [41, 45, 49, 53, 57],
    respiratory: [40, 44, 48, 52, 56],
    pediatrics: [60, 64, 68, 72, 76],
    child: [60, 64, 68, 72, 76],
    juvenile: [60, 64, 68, 72, 76],
    diabetes: [61, 65, 69, 73, 77],
    orthopedics: [80, 84, 88, 92, 96],
    knee: [81, 85, 89, 93, 97],
    joint: [81, 85, 89, 93, 97],
    arthroplasty: [82, 86, 90, 94, 98],
    gastroenterology: [100, 104, 108, 112, 116],
    liver: [101, 105, 109, 113, 117],
    endoscopy: [102, 106, 110, 114, 118],
    nephrology: [103, 107, 111, 115],
    kidney: [103, 107, 111, 115],
    dialysis: [103, 107, 111, 115],
    ophthalmology: [23, 27, 31, 35],
    eye: [23, 27, 31, 35],
    retina: [23, 27, 31, 35],
    cataract: [23, 27, 31, 35],
    endocrinology: [61, 65, 69, 73, 77],
    thyroid: [62, 66, 70, 74],
    hormone: [62, 66, 70, 74],
    insulin: [61, 65, 69, 73, 77],
    gynecology: [42, 46, 50, 54],
    obstetrics: [42, 46, 50, 54],
    pregnancy: [42, 46, 50, 54],
    psychiatry: [63, 67, 71, 75],
    depression: [63, 67, 71, 75],
    anxiety: [63, 67, 71, 75],
    dermatology: [83, 87, 91, 95],
    skin: [83, 87, 91, 95],
    psoriasis: [83, 87, 91, 95],
    rheumatology: [81, 85, 89, 93],
    arthritis: [81, 85, 89, 93],
    lupus: [81, 85, 89, 93],
    urology: [103, 107, 111, 115],
    prostate: [103, 107, 111, 115],
    fever: [43, 47, 51, 55],
    infection: [43, 47, 51, 55],
    antibiotic: [43, 47, 51, 55],
    symptom: [3, 7, 11, 15],
    emergency: [1, 5, 9, 13],
    pain: [2, 6, 10, 14],
    hypertension: [0, 4, 8, 12, 16],
    pressure: [0, 4, 8, 12, 16],
    mumbai: [120, 121],
    delhi: [122, 123],
    bengaluru: [124, 125],
    gurugram: [126, 127],
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    // Hash-based feature placement
    let hash = 0;
    for (let c = 0; c < token.length; c++) {
      hash = (hash << 5) - hash + token.charCodeAt(c);
      hash |= 0;
    }

    const idx = Math.abs(hash) % dim;
    vector[idx] += 1.0;

    // Apply clinical ontology projection
    if (clinicalWeights[token]) {
      clinicalWeights[token].forEach(dimIndex => {
        vector[dimIndex] += 2.5;
      });
    }

    // Substring partial matching
    for (const [key, indices] of Object.entries(clinicalWeights)) {
      if (token.includes(key) || key.includes(token)) {
        indices.forEach(idx => {
          vector[idx] += 1.2;
        });
      }
    }
  }

  // L2 Normalization
  let norm = 0;
  for (let i = 0; i < dim; i++) {
    norm += vector[i] * vector[i];
  }
  norm = Math.sqrt(norm);

  if (norm > 0) {
    for (let i = 0; i < dim; i++) {
      vector[i] /= norm;
    }
  }

  return vector;
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;
  return Math.max(0, Math.min(1, dotProduct / denominator));
}
