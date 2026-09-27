import React, { useState } from 'react';
import {
  Database,
  FileText,
  Upload,
  RefreshCw,
  Trash2,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Plus,
  Search,
  ExternalLink,
  Code,
  Eye,
} from 'lucide-react';
import { KnowledgeDocument, DocumentChunk } from '../types/index.ts';

interface KnowledgeBaseProps {
  documents: KnowledgeDocument[];
  chunks: DocumentChunk[];
  onOpenAddKnowledge: () => void;
  onRefresh: () => void;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  documents,
  chunks,
  onOpenAddKnowledge,
  onRefresh,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [selectedChunk, setSelectedChunk] = useState<DocumentChunk | null>(null);
  const [searchDocQuery, setSearchDocQuery] = useState('');
  const [isReindexing, setIsReindexing] = useState<string | null>(null);

  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchDocQuery.toLowerCase())
  );

  const displayedChunks = selectedDocId
    ? chunks.filter(c => c.documentId === selectedDocId)
    : chunks;

  const handleDeleteDoc = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document and remove its chunks from the vector database?')) return;
    try {
      await fetch(`/api/knowledge/${id}`, { method: 'DELETE' });
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReindexDoc = async (id: string) => {
    setIsReindexing(id);
    try {
      await fetch(`/api/knowledge/${id}/reindex`, { method: 'POST' });
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsReindexing(null);
    }
  };

  return (
    <div className="p-8 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Knowledge Base & Chunks Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage ingested documents, inspect 128-dimensional dense vector embeddings, and audit PII masks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            title="Refresh Knowledge Base"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenAddKnowledge}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Knowledge</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Documents</span>
          <div className="text-xl font-bold text-slate-900 mt-1">{documents.length}</div>
          <span className="text-[11px] text-slate-500">PDF, CSV, JSON, URLs</span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Chunks</span>
          <div className="text-xl font-bold text-teal-700 mt-1">{chunks.length}</div>
          <span className="text-[11px] text-slate-500">Indexed in Vector DB & BM25</span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Embeddings Active</span>
          <div className="text-xl font-bold text-emerald-700 mt-1">{chunks.filter(c => !!c.embedding).length}</div>
          <span className="text-[11px] text-slate-500">100% Vectorized</span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">PII Masked</span>
          <div className="text-xl font-bold text-indigo-700 mt-1">
            {documents.reduce((acc, d) => acc + (d.piiRedactedCount || 0), 0)}
          </div>
          <span className="text-[11px] text-slate-500">Phone numbers / IDs sanitized</span>
        </div>
      </div>

      {/* Main Two Columns: Document Catalog & Chunk Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Document List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Document Registry</h3>
            {selectedDocId && (
              <button
                onClick={() => setSelectedDocId(null)}
                className="text-[11px] text-teal-700 font-semibold hover:underline cursor-pointer"
              >
                Clear Filter
              </button>
            )}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search documents by name or format..."
              value={searchDocQuery}
              onChange={(e) => setSearchDocQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2.5 max-h-[520px] overflow-y-auto">
            {filteredDocs.map((doc) => {
              const isSelected = selectedDocId === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/40 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-bold text-slate-900 leading-snug line-clamp-1">{doc.title}</span>
                    <span className="px-1.5 py-0.2 rounded uppercase text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                      {doc.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                    <span>{doc.chunkCount} chunks • Tier {doc.tier}</span>
                    {doc.piiRedactedCount > 0 && (
                      <span className="text-amber-700 font-medium">{doc.piiRedactedCount} PII Redacted</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 truncate max-w-[160px]">
                      {doc.extractedDoctors?.join(', ') || 'General Knowledge'}
                    </span>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleReindexDoc(doc.id)}
                        disabled={isReindexing === doc.id}
                        className="p-1 text-slate-400 hover:text-teal-700 rounded transition-colors"
                        title="Re-embed document chunks"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isReindexing === doc.id ? 'animate-spin' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleDeleteDoc(doc.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Delete document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Chunks & Embedding Inspector (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                Document Chunks ({displayedChunks.length})
              </h3>
              <p className="text-[11px] text-slate-400">
                {selectedDocId ? 'Filtered by selected document' : 'Showing all knowledge chunks'}
              </p>
            </div>
            <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Embedding: 128-dim Cosine L2
            </span>
          </div>

          <div className="space-y-3 max-h-[520px] overflow-y-auto">
            {displayedChunks.map((chunk, idx) => (
              <div
                key={chunk.id}
                onClick={() => setSelectedChunk(chunk)}
                className={`p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                  selectedChunk?.id === chunk.id
                    ? 'border-teal-500 bg-teal-50/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px]">
                  <span className="font-mono text-slate-500 font-semibold">Chunk #{idx + 1} ({chunk.id.slice(0, 16)}...)</span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Tier {chunk.metadata.tier}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                      {chunk.metadata.verificationStatus}
                    </span>
                  </div>
                </div>

                <p className="text-slate-700 text-xs leading-relaxed mb-2 font-sans line-clamp-3">
                  {chunk.text}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                  <span className="truncate max-w-[200px]">Doc: {chunk.metadata.parentDocTitle}</span>
                  <span className="font-mono text-teal-600 font-semibold">
                    Embedding: [ {chunk.embedding ? chunk.embedding.slice(0, 3).map(v => v.toFixed(3)).join(', ') : 'Generated'} ... ]
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chunk Detail Inspection Modal */}
      {selectedChunk && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Chunk Vector & Metadata Inspector</h3>
              <button
                onClick={() => setSelectedChunk(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium mb-1">Full Raw Content:</span>
                <p className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed font-sans">
                  {selectedChunk.text}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block">Doctor Entity:</span>
                  <span className="font-bold text-slate-800">{selectedChunk.metadata.doctorName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Specialization:</span>
                  <span className="font-bold text-slate-800">{selectedChunk.metadata.specialization || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Hospital:</span>
                  <span className="font-bold text-slate-800">{selectedChunk.metadata.hospital || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Source URL:</span>
                  <span className="font-mono text-teal-700 truncate block">{selectedChunk.metadata.sourceUrl}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-medium mb-1">Dense 128-Dimensional Vector Sample:</span>
                <div className="p-3 bg-slate-900 rounded-xl font-mono text-[10px] text-teal-300 max-h-24 overflow-y-auto leading-relaxed">
                  [{selectedChunk.embedding?.map(n => n.toFixed(4)).join(', ')}]
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedChunk(null)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
