import React from 'react';
import { UserRole } from '../types/index.ts';
import { ShieldCheck, Plus, Sparkles, UserCheck, Shield } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  userRole: UserRole;
  onRoleChange: (role: UserRole['role']) => void;
  onOpenAddKnowledge: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  userRole,
  onRoleChange,
  onOpenAddKnowledge,
}) => {
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'System Overview & RAG Observability';
      case 'chat':
        return 'Advanced Clinical RAG Chat & Provenance Reasoning';
      case 'search':
        return 'AI-Powered Doctor Intelligence Search';
      case 'knowledge':
        return 'Knowledge Management & Automated Ingestion';
      case 'verification':
        return 'Provenance Verification & Conflict Resolution';
      case 'graph':
        return 'Clinical Knowledge Graph Explorer';
      case 'sources':
        return 'Source Trust Hierarchy & Whitelist Registry';
      case 'evaluations':
        return 'RAG Benchmark & Evaluation Suite';
      case 'audit':
        return 'Security, Privacy & PII Audit Logs';
      default:
        return 'Doctor Intelligence & Medical Knowledge';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-10">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">
          {getTabTitle(currentTab)}
        </h1>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Hybrid Retrieval Ready
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Ingest Button */}
        {(userRole.role === 'admin' || userRole.role === 'reviewer') && (
          <button
            onClick={onOpenAddKnowledge}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ingest Knowledge</span>
          </button>
        )}

        {/* Role Switcher */}
        <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-slate-50 text-xs">
          <div className="flex items-center gap-1.5 px-2 py-1 text-slate-600 font-medium">
            <Shield className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden md:inline">Role:</span>
          </div>
          <select
            value={userRole.role}
            onChange={(e) => onRoleChange(e.target.value as UserRole['role'])}
            className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
          >
            <option value="admin">Admin (Full Control)</option>
            <option value="reviewer">Medical Reviewer</option>
            <option value="doctor">Clinical Faculty</option>
            <option value="public_user">Public Patient / User</option>
          </select>
        </div>

        {/* User Identity Pill */}
        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800 text-xs font-bold">
            {userRole.name.charAt(0)}
          </div>
          <div className="text-left text-xs leading-tight">
            <span className="font-semibold text-slate-800 block">{userRole.name}</span>
            <span className="text-[11px] text-slate-400 capitalize">{userRole.role.replace('_', ' ')}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
