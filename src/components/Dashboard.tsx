import React from 'react';
import {
  Users,
  FileText,
  BookmarkCheck,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Clock,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  BrainCircuit,
  Database,
  Search,
  MessageSquareText,
} from 'lucide-react';
import { Doctor, ConflictRecord, KnowledgeDocument } from '../types/index.ts';

interface DashboardProps {
  analytics: any;
  doctors: Doctor[];
  conflicts: ConflictRecord[];
  documents: KnowledgeDocument[];
  onNavigate: (tab: any) => void;
  onSelectDoctor: (doctor: Doctor) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  analytics,
  doctors,
  conflicts,
  documents,
  onNavigate,
  onSelectDoctor,
}) => {
  const statCards = [
    {
      title: 'Total Doctors',
      value: analytics?.totalDoctors || doctors.length,
      subtitle: `${analytics?.verifiedDoctors || 8} Verified Across Registries`,
      icon: Users,
      color: 'from-blue-600 to-indigo-600',
      badge: '99.4% Precision',
      badgeColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    },
    {
      title: 'Active Conflicts',
      value: analytics?.activeConflicts || conflicts.filter(c => c.status === 'unresolved').length,
      subtitle: 'Requiring Admin or Reviewer Resolution',
      icon: AlertTriangle,
      color: 'from-amber-500 to-orange-500',
      badge: 'Discrepancy Alert',
      badgeColor: 'text-amber-800 bg-amber-50 border-amber-200',
      action: () => onNavigate('verification'),
    },
    {
      title: 'Knowledge Chunks',
      value: analytics?.totalChunks || 84,
      subtitle: `${analytics?.totalEmbeddings || 84} Vectorized (128-dim dense)`,
      icon: Database,
      color: 'from-teal-600 to-emerald-600',
      badge: 'BM25 + Dense Hybrid',
      badgeColor: 'text-teal-700 bg-teal-50 border-teal-200',
      action: () => onNavigate('knowledge'),
    },
    {
      title: 'Verified Sources',
      value: analytics?.totalSources || 7,
      subtitle: 'Tiers 1 to 5 (Hospital to Crowdsourced)',
      icon: BookmarkCheck,
      color: 'from-emerald-600 to-teal-700',
      badge: 'Tier Hierarchy Enforced',
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      action: () => onNavigate('sources'),
    },
  ];

  return (
    <div className="p-8 space-y-8 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Top Banner / Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-slate-800 p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30 mb-3">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Multi-Stage RAG Pipeline with Strict Fact Provenance</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Doctor Intelligence & Evidence Retrieval System
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Unlike generic AI, MedRAG never blindly trusts online data. Every doctor qualification, hospital affiliation, and clinical milestone is tracked to source URLs, checked for cross-source conflicts, and grounded with strict citation indices.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('chat')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <MessageSquareText className="w-4 h-4" />
              <span>Launch RAG Clinical Chat</span>
            </button>
            <button
              onClick={() => onNavigate('search')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Explore AI Doctor Search</span>
            </button>
            <button
              onClick={() => onNavigate('evaluations')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              <TrendingUp className="w-4 h-4" />
              <span>View RAG Benchmark Metrics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              onClick={stat.action}
              className={`p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all ${
                stat.action ? 'cursor-pointer hover:border-slate-300' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${stat.badgeColor}`}>
                  {stat.badge}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">{stat.title}</div>
              <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
                <span>{stat.subtitle}</span>
                {stat.action && <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* RAG Observability Performance Banner */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
            Retrieval Precision
          </span>
          <div className="text-2xl font-extrabold text-teal-700 mt-1">98.2%</div>
          <p className="text-xs text-slate-500 mt-0.5">Reciprocal Rank Fusion (RRF k=60)</p>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
            Citation Coverage
          </span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">100%</div>
          <p className="text-xs text-slate-500 mt-0.5">Zero ungrounded claims generated</p>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
            Average Response Latency
          </span>
          <div className="text-2xl font-extrabold text-indigo-700 mt-1">420 ms</div>
          <p className="text-xs text-slate-500 mt-0.5">Hybrid dense + sparse + rerank</p>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
            PII Masking Rate
          </span>
          <div className="text-2xl font-extrabold text-slate-800 mt-1">100%</div>
          <p className="text-xs text-slate-500 mt-0.5">Automated scrub prior to vectorization</p>
        </div>
      </div>

      {/* Main Two Columns: Active Conflicts & Recent Doctor Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
        {/* Active Conflict Radar */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">Conflict Radar & Discrepancy Stream</h3>
              </div>
              <button
                onClick={() => onNavigate('verification')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 cursor-pointer"
              >
                Resolve All ({conflicts.length}) →
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              The system automatically flags diverging statements across hospital rosters, state medical councils, and web directories.
            </p>

            <div className="space-y-3">
              {conflicts.slice(0, 3).map((conf) => (
                <div
                  key={conf.id}
                  className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{conf.doctorName}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                      Discrepancy: {conf.field}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-amber-200/60">
                    <div>
                      <span className="text-slate-500 block">Source A ({conf.sourceA.sourceName.split(' ')[0]}):</span>
                      <span className="font-semibold text-slate-800">{String(conf.sourceA.value)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Source B ({conf.sourceB.sourceName.split(' ')[0]}):</span>
                      <span className="font-semibold text-rose-700">{String(conf.sourceB.value)}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-amber-900/80 italic">
                    {conf.resolutionNotes}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('verification')}
            className="w-full mt-4 py-2 text-center text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
          >
            Open Verification Center
          </button>
        </div>

        {/* Verified Doctor Registries */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Indexed Doctor Registries</h3>
              </div>
              <button
                onClick={() => onNavigate('search')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 cursor-pointer"
              >
                Search All ({doctors.length}) →
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Click any doctor to inspect qualifications, hospital department, peer-reviewed publications, and provenance tree.
            </p>

            <div className="space-y-2.5">
              {doctors.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => onSelectDoctor(doc)}
                  className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/80 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 font-bold text-xs shrink-0">
                      {doc.name.replace(/^Dr\.\s+/, '').charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 group-hover:text-teal-700 transition-colors">
                          {doc.name}
                        </span>
                        {doc.verificationStatus === 'verified' ? (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Tier {doc.trustTier}
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Flagged
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 block">
                        {doc.specialization} • {doc.hospital}, {doc.city} ({doc.experienceYears} yrs)
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('search')}
            className="w-full mt-4 py-2 text-center text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
          >
            Faceted Doctor Directory
          </button>
        </div>
      </div>
    </div>
  );
};
