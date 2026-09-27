// Cross-Source Medical Conflict Detection Service
import { Doctor, ConflictRecord, TrustTier } from '../../src/types/index.ts';

export interface FactPayload {
  doctorName: string;
  specialization?: string;
  experienceYears?: number;
  hospital?: string;
  qualifications?: string;
  sourceName: string;
  sourceUrl: string;
  tier: TrustTier;
  date: string;
}

export function detectConflicts(
  existingDoctor: Doctor,
  incomingFact: FactPayload
): ConflictRecord[] {
  const conflicts: ConflictRecord[] = [];

  // Check 1: Experience Years Discrepancy
  if (
    incomingFact.experienceYears !== undefined &&
    existingDoctor.experienceYears !== undefined &&
    Math.abs(existingDoctor.experienceYears - incomingFact.experienceYears) >= 3
  ) {
    conflicts.push({
      id: `conf-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      doctorId: existingDoctor.id,
      doctorName: existingDoctor.name,
      field: 'experienceYears',
      sourceA: {
        sourceName: `${existingDoctor.primarySourceTitle} (Tier ${existingDoctor.trustTier})`,
        sourceUrl: existingDoctor.primarySourceUrl,
        tier: existingDoctor.trustTier,
        value: existingDoctor.experienceYears,
        date: existingDoctor.lastVerifiedDate || existingDoctor.dateCollected,
      },
      sourceB: {
        sourceName: `${incomingFact.sourceName} (Tier ${incomingFact.tier})`,
        sourceUrl: incomingFact.sourceUrl,
        tier: incomingFact.tier,
        value: incomingFact.experienceYears,
        date: incomingFact.date,
      },
      status: 'unresolved',
      resolutionNotes: `Discrepancy detected: Existing verified record lists ${existingDoctor.experienceYears} years, but new incoming source claims ${incomingFact.experienceYears} years.`,
    });
  }

  // Check 2: Hospital Affiliation Mismatch
  if (
    incomingFact.hospital &&
    existingDoctor.hospital &&
    incomingFact.hospital.trim().length > 3
  ) {
    const existingHospClean = existingDoctor.hospital.toLowerCase().replace(/[^a-z0-9]/g, '');
    const incomingHospClean = incomingFact.hospital.toLowerCase().replace(/[^a-z0-9]/g, '');

    const isDifferent =
      !existingHospClean.includes(incomingHospClean) &&
      !incomingHospClean.includes(existingHospClean);

    if (isDifferent) {
      conflicts.push({
        id: `conf-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        doctorId: existingDoctor.id,
        doctorName: existingDoctor.name,
        field: 'hospital',
        sourceA: {
          sourceName: `${existingDoctor.primarySourceTitle} (Tier ${existingDoctor.trustTier})`,
          sourceUrl: existingDoctor.primarySourceUrl,
          tier: existingDoctor.trustTier,
          value: existingDoctor.hospital,
          date: existingDoctor.lastVerifiedDate || existingDoctor.dateCollected,
        },
        sourceB: {
          sourceName: `${incomingFact.sourceName} (Tier ${incomingFact.tier})`,
          sourceUrl: incomingFact.sourceUrl,
          tier: incomingFact.tier,
          value: incomingFact.hospital,
          date: incomingFact.date,
        },
        status: 'unresolved',
        resolutionNotes: `Affiliation discrepancy: Primary source lists "${existingDoctor.hospital}", whereas source "${incomingFact.sourceName}" reports "${incomingFact.hospital}".`,
      });
    }
  }

  return conflicts;
}
