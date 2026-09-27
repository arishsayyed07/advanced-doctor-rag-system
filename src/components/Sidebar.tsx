import React from 'react';
import {
  Activity,
  Search,
  MessageSquareText,
  Database,
  ShieldAlert,
  Share2,
  BookmarkCheck,
  BarChart3,
  FileCheck2,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export type NavigationTab =
  | 'dashboard'
  | 'chat'
  | 'search'
  | 'knowledge'
  | 'verification'
  | 'graph'
  | 'sources'
  | 'evaluations'
  | 'audit';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  conflictCount: number;
  pendingCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  conflictCount,
  pendingCount,
}) => {
  const navItems: {
    id: NavigationTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: 'Dashboard & Metrics', icon: Activity },
    { id: 'chat', label: 'RAG Clinical Chat', icon: MessageSquareText },
    { id: 'search', label: 'AI Doctor Search', icon: Search },
    { id: 'knowledge', label: 'Knowledge Base & Ingestion', icon: Database },
    {
      id: 'verification',
      label: 'Verification & Conflicts',
      icon: ShieldAlert,
      badge: conflictCount + pendingCount,
      badgeColor: 'bg-amber-500 text-white',
    },
    { id: 'graph', label: 'Knowledge Graph', icon: Share2 },
    { id: 'sources', label: 'Source Provenance', icon: BookmarkCheck },
    { id: 'evaluations', label: 'RAG Evaluation Suite', icon: BarChart3 },
    { id: 'audit', label: 'Audit & Compliance', icon: FileCheck2 },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-200 flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20 text-slate-950 font-bold">
          <Stethoscope className="w-5 h-5 text-slate-950" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white tracking-tight text-lg">MedRAG</span>
            <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
              v2.5 Pro
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Doctor Intel & Evidence RAG</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Core Workflows
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      item.badgeColor || 'bg-teal-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-teal-400" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Safety & Guardrail Badge */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-start gap-2.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200 block mb-0.5">
              Verified Evidence Shield
            </span>
            <span className="text-[11px] leading-tight block text-slate-400">
              Zero hallucination guardrails. Multi-tier provenance & automated conflict flags.
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
