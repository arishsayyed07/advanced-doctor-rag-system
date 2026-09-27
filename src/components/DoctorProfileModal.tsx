import React from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Building2,
  MapPin,
  Calendar,
  GraduationCap,
  BookOpen,
  Award,
  Globe,
  ExternalLink,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { Doctor } from '../types/index.ts';

interface DoctorProfileModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onAskAboutDoctor: (doctorName: string) => void;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  doctor,
  onClose,
  onAskAboutDoctor,
}) => {
  if (!doctor) return null;

  const hasConflicts = doctor.verificationStatus === 'conflicting';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between relative">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold text-2xl shadow-lg">
              {doctor.name.replace(/^Dr\.\s+/, '').charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold tracking-tight text-white">{doctor.name}</h2>
                {hasConflicts ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Conflict Flagged
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Tier {doctor.trustTier} Verified
                  </span>
                )}
              </div>
              <p className="text-teal-300 text-sm font-semibold">{doctor.specialization} — {doctor.subSpecialization}</p>
              <p className="text-xs text-slate-400 mt-0.5">{doctor.hospital} • {doctor.city}, {doctor.state}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm">
          {/* Active Conflict Banner if present */}
          {hasConflicts && doctor.conflicts && doctor.conflicts.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Conflicting Evidence Detected Across Data Sources</span>
              </div>
              <p className="text-amber-800">
                This doctor's dossier contains discrepancies between authoritative registers and external directory listings:
              </p>
              {doctor.conflicts.map((c) => (
                <div key={c.id} className="p-3 bg-white/80 rounded-xl border border-amber-200 space-y-1">
                  <div className="font-semibold text-slate-800">Contested Field: {c.field}</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-slate-500 block">Source A ({c.sourceA.sourceName}):</span>
                      <span className="font-bold text-slate-900">{String(c.sourceA.value)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Source B ({c.sourceB.sourceName}):</span>
                      <span className="font-bold text-rose-700">{String(c.sourceB.value)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Biography */}
          {doctor.bio && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Clinical Overview
              </h3>
              <p className="text-slate-700 leading-relaxed text-xs sm:text-sm bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                {doctor.bio}
              </p>
            </div>
          )}

          {/* Key Clinical Credentials & Hospital Affiliation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-teal-600" />
                <span>Degrees & Qualifications</span>
              </h3>
              <div className="space-y-2">
                {doctor.qualifications.map((q, idx) => (
                  <div key={idx} className="text-xs">
                    <span className="font-bold text-slate-900">{q.degree}</span>
                    <span className="text-slate-500 block">{q.institute} ({q.year})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-teal-600" />
                <span>Hospital & Practice</span>
              </h3>
              <div className="text-xs space-y-1.5">
                <div>
                  <span className="text-slate-400 block font-medium">Institution:</span>
                  <span className="font-bold text-slate-900">{doctor.hospital}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Department:</span>
                  <span className="text-slate-700">{doctor.hospitalDepartment}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Clinical Experience:</span>
                  <span className="text-slate-700 font-semibold">{doctor.experienceYears} Years</span>
                </div>
              </div>
            </div>
          </div>

          {/* Areas of Expertise */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Areas of Special Clinical Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {doctor.areasOfExpertise.map((area, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Peer-Reviewed Publications */}
          {doctor.publications && doctor.publications.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                <BookOpen className="w-4 h-4 text-teal-600" />
                <span>Indexed Peer-Reviewed Publications</span>
              </h3>
              <div className="space-y-2">
                {doctor.publications.map((pub, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <p className="font-bold text-slate-800 leading-snug">"{pub.title}"</p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                      <span>{pub.journal} ({pub.year})</span>
                      {pub.pmid && <span className="font-mono text-teal-700">PMID: {pub.pmid}</span>}
                      {pub.doi && <span className="font-mono text-slate-500">DOI: {pub.doi}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Source Provenance Footer */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Multi-Tier Provenance & Audit Trail</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 block">Trust Level:</span>
                <span className="font-bold text-slate-800">Tier {doctor.trustTier} (Accredited)</span>
              </div>
              <div>
                <span className="text-slate-400 block">Confidence Score:</span>
                <span className="font-bold text-emerald-700">{doctor.confidenceScore}%</span>
              </div>
              <div>
                <span className="text-slate-400 block">First Ingested:</span>
                <span className="text-slate-700">{doctor.dateCollected}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Last Verified:</span>
                <span className="text-slate-700">{doctor.lastVerifiedDate}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 truncate">Source: {doctor.primarySourceTitle}</span>
              <a
                href={doctor.primarySourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-teal-600 hover:underline flex items-center gap-1 font-semibold shrink-0"
              >
                <span>External Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              onClose();
              onAskAboutDoctor(doctor.name);
            }}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <span>Ask RAG Chat About {doctor.name}</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
