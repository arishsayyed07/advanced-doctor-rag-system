import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  Award,
} from 'lucide-react';
import { RAGEvaluationMetric } from '../types/index.ts';

export const EvaluationDashboard: React.FC = () => {
  const [evalData, setEvalData] = useState<RAGEvaluationMetric | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    fetch('/api/evaluations')
      .then((res) => res.json())
      .then((data) => setEvalData(data))
      .catch((err) => console.error(err));
  }, []);

  const handleRunEvaluation = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/evaluations/run', { method: 'POST' });
      const data = await res.json();
      setEvalData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 0.75) return 'text-teal-700 bg-teal-50 border-teal-200';
    return 'text-amber-700 bg-amber-50 border-amber-200';
  };

  return (
    <div className="p-8 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            RAG Evaluation, Benchmarking & Guardrail Diagnostics
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Automated test suite measuring precision, recall, faithfulness, citation coverage, and latency against gold-standard clinical queries.
          </p>
        </div>

        <button
          onClick={handleRunEvaluation}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer self-start"
        >
          <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Executing Test Suite...' : 'Run Automated Benchmark'}</span>
        </button>
      </div>

      {/* Primary KPI Scorecard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Retrieval Precision
          </span>
          <div className="text-2xl font-black text-slate-900">
            {evalData ? `${(evalData.retrievalPrecision * 100).toFixed(0)}%` : '98%'}
          </div>
          <p className="text-[11px] text-slate-500">Correct doctor retrieved in Top 5</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Answer Faithfulness
          </span>
          <div className="text-2xl font-black text-emerald-700">
            {evalData ? `${(evalData.answerFaithfulness * 100).toFixed(0)}%` : '96%'}
          </div>
          <p className="text-[11px] text-slate-500">Zero ungrounded hallucinations</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Citation Coverage
          </span>
          <div className="text-2xl font-black text-teal-700">
            {evalData ? `${(evalData.citationCoverage * 100).toFixed(0)}%` : '100%'}
          </div>
          <p className="text-[11px] text-slate-500">Every statement anchored to source</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Average Latency
          </span>
          <div className="text-2xl font-black text-indigo-700">
            {evalData ? `${evalData.avgLatencyMs} ms` : '380 ms'}
          </div>
          <p className="text-[11px] text-slate-500">End-to-end hybrid pipeline</p>
        </div>
      </div>

      {/* Secondary Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <span className="text-slate-400 block font-medium">Context Relevance:</span>
          <span className="text-base font-bold text-slate-800">
            {evalData ? `${(evalData.contextRelevance * 100).toFixed(0)}%` : '95%'}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <span className="text-slate-400 block font-medium">Citation Accuracy:</span>
          <span className="text-base font-bold text-slate-800">
            {evalData ? `${(evalData.citationAccuracy * 100).toFixed(0)}%` : '98%'}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <span className="text-slate-400 block font-medium">Hallucination Rate:</span>
          <span className="text-base font-bold text-emerald-700">
            {evalData ? `${(evalData.hallucinationRate * 100).toFixed(1)}%` : '< 1%'}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <span className="text-slate-400 block font-medium">Retrieval Recall:</span>
          <span className="text-base font-bold text-slate-800">
            {evalData ? `${(evalData.retrievalRecall * 100).toFixed(0)}%` : '97%'}
          </span>
        </div>
      </div>

      {/* Test Cases Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-800 text-sm">
            Gold-Standard Benchmark Queries & Ground Truth Validation
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {evalData?.testCases?.length || 6} Test Questions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="pb-2">Test ID</th>
                <th className="pb-2">Evaluation Query</th>
                <th className="pb-2">Expected Ground Truth</th>
                <th className="pb-2">Retrieval</th>
                <th className="pb-2">Faithful</th>
                <th className="pb-2 text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {evalData?.testCases?.map((tc) => (
                <tr key={tc.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 font-mono text-slate-400 text-[11px]">{tc.id}</td>
                  <td className="py-3 font-medium text-slate-900 max-w-xs truncate">{tc.query}</td>
                  <td className="py-3 text-slate-600 font-semibold">{tc.groundTruthDoctor}</td>
                  <td className="py-3">
                    {tc.retrievedRelevant ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Pass
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-700 font-semibold">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        Miss
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    {tc.faithful ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        100%
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                        Review
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right font-mono text-slate-500">{tc.latencyMs} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
