import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  FileText,
  UserCheck,
} from 'lucide-react';
import { ConflictRecord, VerificationTask } from '../types/index.ts';

interface VerificationCenterProps {
  conflicts: ConflictRecord[];
  tasks: VerificationTask[];
  onRefresh: () => void;
}

export const VerificationCenter: React.FC<VerificationCenterProps> = ({
  conflicts,
  tasks,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'conflicts' | 'tasks'>('conflicts');
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [selectedResolution, setSelectedResolution] = useState<'sourceA' | 'sourceB' | 'custom'>('sourceA');
  const [customResolutionText, setCustomResolutionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const unresolvedConflicts = conflicts.filter(c => c.status === 'unresolved');
  const resolvedConflicts = conflicts.filter(c => c.status === 'resolved');

  const handleResolveConflict = async (conflict: ConflictRecord) => {
    setIsSubmitting(true);
    try {
      const chosenSource = selectedResolution === 'sourceA'
        ? conflict.sourceA.sourceName
        : selectedResolution === 'sourceB'
        ? conflict.sourceB.sourceName
        : 'Custom Admin Assessment';

      const res = await fetch(`/api/verification/${conflict.id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resolve_conflict',
          chosenSource,
          resolutionNotes: customResolutionText || `Verified against ${chosenSource}. Discrepancy reconciled.`,
          reviewerId: 'Chief Medical Administrator',
        }),
      });

      if (!res.ok) throw new Error('Resolution failed');
      setResolvingId(null);
      setCustomResolutionText('');
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTaskAction = async (taskId: string, action: 'approve' | 'reject') => {
    try {
      await fetch(`/api/verification/${taskId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          reviewerId: 'Chief Medical Administrator',
        }),
      });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Provenance Verification & Conflict Resolution Center
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Reconcile conflicting claims across medical registers, inspect user reported inaccuracies, and audit multi-tier provenance.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('conflicts')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'conflicts' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Active Conflicts ({unresolvedConflicts.length})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'tasks' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Review Queue ({tasks.filter(t => t.status === 'pending').length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'conflicts' && (
        <div className="space-y-6">
          {/* Active Conflicts List */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Unresolved Cross-Source Discrepancies ({unresolvedConflicts.length})</span>
            </h3>

            {unresolvedConflicts.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800 text-sm">All Conflicts Reconciled</h4>
                <p className="text-xs text-slate-500 mt-1">
                  No active discrepancies between hospital faculty dossiers and external registries.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {unresolvedConflicts.map((conf) => (
                  <div
                    key={conf.id}
                    className="p-5 rounded-2xl bg-white border border-amber-300 shadow-sm space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-base">{conf.doctorName}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase">
                            Conflict on: {conf.field}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{conf.resolutionNotes}</p>
                      </div>

                      <button
                        onClick={() => setResolvingId(resolvingId === conf.id ? null : conf.id)}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                      >
                        {resolvingId === conf.id ? 'Cancel Review' : 'Resolve Discrepancy'}
                      </button>
                    </div>

                    {/* Side-by-side Source Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Source A */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">Source A (Primary Reference)</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            Tier {conf.sourceA.tier}
                          </span>
                        </div>
                        <p className="text-slate-600">{conf.sourceA.sourceName}</p>
                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Reported Value:</span>
                          <span className="text-base font-extrabold text-teal-800">
                            {String(conf.sourceA.value)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                          <span>Dated: {conf.sourceA.date}</span>
                          <a
                            href={conf.sourceA.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-teal-600 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>Inspect</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      {/* Source B */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">Source B (Contesting Claim)</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-700">
                            Tier {conf.sourceB.tier}
                          </span>
                        </div>
                        <p className="text-slate-600">{conf.sourceB.sourceName}</p>
                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Reported Value:</span>
                          <span className="text-base font-extrabold text-rose-700">
                            {String(conf.sourceB.value)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                          <span>Dated: {conf.sourceB.date}</span>
                          <a
                            href={conf.sourceB.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-teal-600 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>Inspect</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Resolution Form (if toggled open) */}
                    {resolvingId === conf.id && (
                      <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3 text-xs animate-in fade-in duration-150">
                        <h5 className="font-bold text-slate-900">Administrator Adjudication Decision:</h5>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-slate-800 cursor-pointer">
                            <input
                              type="radio"
                              name={`res-${conf.id}`}
                              checked={selectedResolution === 'sourceA'}
                              onChange={() => setSelectedResolution('sourceA')}
                              className="accent-teal-600"
                            />
                            <span>
                              Accept Source A: <strong className="text-teal-800">{String(conf.sourceA.value)}</strong> ({conf.sourceA.sourceName})
                            </span>
                          </label>

                          <label className="flex items-center gap-2 text-slate-800 cursor-pointer">
                            <input
                              type="radio"
                              name={`res-${conf.id}`}
                              checked={selectedResolution === 'sourceB'}
                              onChange={() => setSelectedResolution('sourceB')}
                              className="accent-teal-600"
                            />
                            <span>
                              Accept Source B: <strong className="text-rose-700">{String(conf.sourceB.value)}</strong> ({conf.sourceB.sourceName})
                            </span>
                          </label>

                          <label className="flex items-center gap-2 text-slate-800 cursor-pointer">
                            <input
                              type="radio"
                              name={`res-${conf.id}`}
                              checked={selectedResolution === 'custom'}
                              onChange={() => setSelectedResolution('custom')}
                              className="accent-teal-600"
                            />
                            <span>Custom Resolution / Clinical Committee Ruling</span>
                          </label>
                        </div>

                        {selectedResolution === 'custom' && (
                          <textarea
                            rows={2}
                            placeholder="Enter justification and reconciled value..."
                            value={customResolutionText}
                            onChange={(e) => setCustomResolutionText(e.target.value)}
                            className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        )}

                        <div className="flex items-center justify-end gap-2 pt-2">
                          <button
                            onClick={() => setResolvingId(null)}
                            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleResolveConflict(conf)}
                            disabled={isSubmitting}
                            className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold cursor-pointer transition-all shadow-sm"
                          >
                            {isSubmitting ? 'Saving Resolution...' : 'Confirm Resolution & Update RAG'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resolved History */}
          {resolvedConflicts.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-slate-200">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Resolved Conflicts History ({resolvedConflicts.length})</span>
              </h3>
              <div className="space-y-2">
                {resolvedConflicts.map((c) => (
                  <div key={c.id} className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">{c.doctorName} ({c.field})</span>
                      <p className="text-slate-500 text-[11px]">{c.resolutionNotes}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Resolved
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Review Queue */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-teal-600" />
            <span>Pending Clinical Verification Tasks</span>
          </h3>

          {tasks.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="font-bold text-slate-800 text-sm">Review Queue Empty</h4>
              <p className="text-xs text-slate-500 mt-1">No pending crowdsourced reports or new doctor submissions.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{task.targetName}</span>
                      <span className={`px-2 py-0.2 rounded uppercase text-[9px] font-bold ${
                        task.type === 'conflict_flag'
                          ? 'bg-amber-100 text-amber-800'
                          : task.type === 'user_report'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}>
                        {task.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-slate-600">{task.reportedIssue || 'Submitted for peer verification.'}</p>
                    <span className="text-[10px] text-slate-400 block">
                      Submitted on {task.submittedAt.split('T')[0]}
                    </span>
                  </div>

                  {task.status === 'pending' ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleTaskAction(task.id, 'approve')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs cursor-pointer shadow-sm"
                      >
                        Approve & Verify
                      </button>
                      <button
                        onClick={() => handleTaskAction(task.id, 'reject')}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-semibold text-xs cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      {task.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
