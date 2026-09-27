import React, { useState } from 'react';
import {
  BookmarkCheck,
  ShieldCheck,
  Plus,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Award,
} from 'lucide-react';
import { Source, TrustTier } from '../types/index.ts';

interface SourceManagerProps {
  sources: Source[];
  onRefresh: () => void;
}

export const SourceManager: React.FC<SourceManagerProps> = ({
  sources,
  onRefresh,
}) => {
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceTier, setNewSourceTier] = useState<number>(1);
  const [reliabilityScore, setReliabilityScore] = useState<number>(95);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName || !newSourceUrl) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSourceName,
          url: newSourceUrl,
          tier: Number(newSourceTier),
          reliabilityScore: Number(reliabilityScore),
        }),
      });

      setNewSourceName('');
      setNewSourceUrl('');
      setIsAddingSource(false);
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTierBadge = (tier: TrustTier) => {
    switch (tier) {
      case 1:
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 2:
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 3:
        return 'bg-purple-50 text-purple-800 border-purple-300';
      case 4:
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 5:
        return 'bg-amber-50 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="p-8 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Source Provenance & Multi-Tier Trust Registry
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Strict ranking of authoritative registers. MedRAG prioritizes Tier 1 & 2 hospital dossiers over web directories.
          </p>
        </div>

        <button
          onClick={() => setIsAddingSource(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Source</span>
        </button>
      </div>

      {/* Tier Explanation Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
        <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-1">
          <span className="font-bold text-emerald-900 block">Tier 1: Official Hospital / Govt</span>
          <p className="text-[11px] text-emerald-700">Official hospital rosters, AIIMS, Tata Memorial, accredited faculties.</p>
        </div>
        <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/60 space-y-1">
          <span className="font-bold text-blue-900 block">Tier 2: Medical Societies</span>
          <p className="text-[11px] text-blue-700">Cardiological Society, Indian Academy of Neurology, specialty boards.</p>
        </div>
        <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/60 space-y-1">
          <span className="font-bold text-purple-900 block">Tier 3: Academic / PubMed</span>
          <p className="text-[11px] text-purple-700">PubMed, Lancet, NEJM peer-reviewed clinical research indexes.</p>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-100/60 space-y-1">
          <span className="font-bold text-slate-900 block">Tier 4: Public Profiles</span>
          <p className="text-[11px] text-slate-600">Web directories, public clinician profiles, institutional public bios.</p>
        </div>
        <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 space-y-1">
          <span className="font-bold text-amber-900 block">Tier 5: User Crowdsourced</span>
          <p className="text-[11px] text-amber-700">Patient community uploads (Unverified until peer review).</p>
        </div>
      </div>

      {/* Add Source Modal/Drawer */}
      {isAddingSource && (
        <div className="p-6 bg-white rounded-2xl border border-teal-300 shadow-md space-y-4 text-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Register New Authoritative Source</h3>
            <button
              onClick={() => setIsAddingSource(false)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleAddSource} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Source Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Johns Hopkins Medicine Faculty Directory"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Source Base URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://hopkinsmedicine.org/faculty"
                  value={newSourceUrl}
                  onChange={(e) => setNewSourceUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Assigned Trust Tier</label>
                <select
                  value={newSourceTier}
                  onChange={(e) => setNewSourceTier(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none bg-white"
                >
                  <option value="1">Tier 1: Official Hospital / Government</option>
                  <option value="2">Tier 2: Recognized Medical Association</option>
                  <option value="3">Tier 3: Academic Publication (PubMed)</option>
                  <option value="4">Tier 4: Public Directory</option>
                  <option value="5">Tier 5: User Crowdsourced</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Reliability Rating ({reliabilityScore}%)
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={reliabilityScore}
                  onChange={(e) => setReliabilityScore(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingSource(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold cursor-pointer transition-all shadow-sm"
              >
                {isSubmitting ? 'Registering...' : 'Save Source to Registry'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sources Grid */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-800 text-sm">Active Whitelisted Registries ({sources.length})</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sources.map((src) => (
            <div
              key={src.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 text-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{src.name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getTierBadge(src.tier)} shrink-0`}>
                    Tier {src.tier}
                  </span>
                </div>

                <p className="text-slate-500 text-[11px] mb-3">{src.tierDescription}</p>

                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Reliability Score:</span>
                    <span className="font-bold text-emerald-700">{src.reliabilityScore}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Indexed Records:</span>
                    <span className="font-bold text-slate-800">{src.recordsCount} Profiles</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block">Last Ingestion / Audit:</span>
                    <span className="text-slate-600">{new Date(src.lastScrapedOrIngested).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Active Ingest Pipeline
                </span>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
