// PII (Personally Identifiable Information) and Sensitive Patient Health Data Masking Service

export interface PIIAnalysisResult {
  cleanedText: string;
  piiCount: number;
  detections: {
    type: 'phone' | 'email' | 'id_number' | 'mrn' | 'patient_name';
    original: string;
    replacement: string;
    index: number;
  }[];
}

export function detectAndScrubPII(rawText: string): PIIAnalysisResult {
  const detections: PIIAnalysisResult['detections'] = [];
  let cleaned = rawText;

  // 1. Phone numbers: e.g. +91 98765 43210, (555) 123-4567, 9876543210
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4,5}\b/g;
  cleaned = cleaned.replace(phoneRegex, (match, offset) => {
    // Avoid replacing years like 2021-2024 or PMIDs
    if (match.length === 4 && /^(19|20)\d\d$/.test(match)) return match;
    detections.push({
      type: 'phone',
      original: match,
      replacement: '[PHONE REDACTED]',
      index: offset,
    });
    return '[PHONE REDACTED]';
  });

  // 2. Email addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  cleaned = cleaned.replace(emailRegex, (match, offset) => {
    detections.push({
      type: 'email',
      original: match,
      replacement: '[EMAIL REDACTED]',
      index: offset,
    });
    return '[EMAIL REDACTED]';
  });

  // 3. Medical Record Numbers (MRN) & Patient identifiers
  const mrnRegex = /\b(MRN|Patient ID|PID|Hospital No|UHID)[:#\s]+([A-Z0-9-]{4,15})\b/gi;
  cleaned = cleaned.replace(mrnRegex, (match, p1, p2, offset) => {
    detections.push({
      type: 'mrn',
      original: match,
      replacement: `${p1}: [MRN REDACTED]`,
      index: offset,
    });
    return `${p1}: [MRN REDACTED]`;
  });

  // 4. National IDs / SSN / Aadhaar numbers (e.g., XXXX-XXXX-XXXX or 9-digit SSN)
  const idRegex = /\b(\d{4}[-\s]\d{4}[-\s]\d{4}|\d{3}[-\s]\d{2}[-\s]\d{4})\b/g;
  cleaned = cleaned.replace(idRegex, (match, offset) => {
    detections.push({
      type: 'id_number',
      original: match,
      replacement: '[GOVT-ID REDACTED]',
      index: offset,
    });
    return '[GOVT-ID REDACTED]';
  });

  // 5. Patient personal references: "Patient John Doe was seen...", "Mr/Mrs/Ms [Name] age 45 admitted"
  const patientRefRegex = /\b(Patient\s+(?:Name\s*:\s*)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+))/g;
  cleaned = cleaned.replace(patientRefRegex, (match, p1, p2, offset) => {
    detections.push({
      type: 'patient_name',
      original: match,
      replacement: 'Patient [NAME REDACTED]',
      index: offset,
    });
    return 'Patient [NAME REDACTED]';
  });

  return {
    cleanedText: cleaned,
    piiCount: detections.length,
    detections,
  };
}
