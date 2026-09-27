import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Layers,
  ShieldCheck,
  RotateCcw,
  Copy,
  Check,
  Share2,
  FileText,
  Clock,
  Zap,
} from 'lucide-react';
import { RAGQueryResponse, Citation, RetrievedChunk, ConflictRecord } from '../types/index.ts';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  ragResponse?: RAGQueryResponse;
  timestamp: string;
  feedbackGiven?: 'helpful' | 'unhelpful';
}

interface RAGChatProps {
  initialQuery?: string;
  onOpenReportModal: (query: string, answerSnippet: string) => void;
}

export const RAGChat: React.FC<RAGChatProps> = ({
  initialQuery = '',
  onOpenReportModal,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am **MedRAG**, your Clinical Intelligence & Evidence Verification Platform.\n\nI answer **any medical or healthcare question** (symptoms, clinical guidelines, emergency red flags, treatments, diagnostic protocols) and provide **verified doctor intelligence** from official medical registries.\n\n**Try asking any question:**\n- *"What are the warning signs of a heart attack and emergency triage protocol?"*\n- *"What is the difference between Type 1 and Type 2 diabetes and their treatments?"*\n- *"What are the BE-FAST early signs of an acute stroke and the thrombolysis window?"*\n- *"How is Chronic Kidney Disease staged and what are the indications for dialysis?"*\n- *"Tell me about Dr. Devi Prasad Shetty and his pediatric cardiac surgery experience."*\n- *"Show me nephrologists specializing in kidney transplants in New Delhi."*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);
  const [expandedEvidenceId, setExpandedEvidenceId] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuery) {
      setInputQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (queryToSend?: string) => {
    const q = (queryToSend || inputQuery).trim();
    if (!q || isLoading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      if (!res.ok) {
        throw new Error('RAG query endpoint failed');
      }

      const data: RAGQueryResponse = await res.json();

      const assistantMessage: Message = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: data.answer,
        ragResponse: data,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ Failed to execute RAG pipeline: ${err.message || 'Server error'}. Please check if the backend service is running.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (message: Message, rating: 'helpful' | 'unhelpful') => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: messages.find(m => m.id === message.id) ? 'Clinical RAG Query' : '',
          answerSnippet: message.content.slice(0, 100),
          rating,
        }),
      });

      setMessages((prev) =>
        prev.map((m) =>
          m.id === message.id ? { ...m, feedbackGiven: rating } : m
        )
      );

      if (rating === 'unhelpful') {
        onOpenReportModal('Clinical RAG Query', message.content);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const copyToClipboard = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(msgId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Conversation reset. MedRAG is ready for doctor intelligence retrieval and multi-source verification inquiries.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const suggestedPrompts = [
    'Appendicitis symptoms & Alvarado score',
    'How to manage a seizure (first aid steps)',
    'Surviving Sepsis Hour-1 bundle resuscitation',
    'Metformin safety & eGFR contraindications',
    'Tell me about Dr. Devi Shetty at Narayana Health',
    'Cardiologists in Mumbai for cardiac surgery',
    'Difference between Type 1 & Type 2 diabetes',
    'Preeclampsia warning signs in pregnancy',
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Top Chat Bar */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700">
            <Sparkles className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-800">
              Active RAG Reasoning Session
            </h3>
            <span className="text-[11px] text-slate-400">
              Hybrid Dense Cosine + Okapi BM25 + KG Traversal + Gemini Reranking
            </span>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Session</span>
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl mx-auto w-full">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          const rag = message.ragResponse;
          const isTraceOpen = expandedTraceId === message.id;
          const isEvidenceOpen = expandedEvidenceId === message.id;

          return (
            <div
              key={message.id}
              className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-teal-600 text-white rounded-tr-none shadow-sm'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                    {message.content}
                  </div>

                  {/* Conflict Radar Callout inside message if present */}
                  {rag && rag.conflictsDetected && rag.conflictsDetected.length > 0 && (
                    <div className="mt-3 p-3 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Conflicting Information Flagged Across Sources</span>
                      </div>
                      <p className="text-[11px] text-amber-800">
                        The knowledge engine detected discrepancies between sources. Discrepancies are held under peer review.
                      </p>
                    </div>
                  )}

                  {/* Latency & Provenance Footer on Assistant message */}
                  {!isUser && rag && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 font-medium text-teal-700">
                          <Zap className="w-3 h-3" />
                          {rag.latencyMs} ms
                        </span>
                        <span>•</span>
                        <span>{rag.modelUsed}</span>
                        <span>•</span>
                        <span>{rag.citations.length} Citations</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => copyToClipboard(message.content, message.id)}
                          className="hover:text-slate-600 p-1 cursor-pointer"
                          title="Copy message"
                        >
                          {copiedMessageId === message.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Citations & Evidence Pill Bar */}
                {!isUser && rag && rag.citations.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <button
                      onClick={() => setExpandedEvidenceId(isEvidenceOpen ? null : message.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-semibold cursor-pointer transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-teal-600" />
                      <span>Supporting Evidence ({rag.retrievedChunks.length})</span>
                      {isEvidenceOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    <button
                      onClick={() => setExpandedTraceId(isTraceOpen ? null : message.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5 text-slate-500" />
                      <span>RAG Execution Trace</span>
                      {isTraceOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {/* Feedback Buttons */}
                    <div className="flex items-center gap-1 ml-auto">
                      <button
                        onClick={() => handleFeedback(message, 'helpful')}
                        className={`p-1 rounded hover:bg-slate-200 transition-colors cursor-pointer ${
                          message.feedbackGiven === 'helpful' ? 'text-teal-600 font-bold' : 'text-slate-400'
                        }`}
                        title="Helpful & Accurate"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleFeedback(message, 'unhelpful')}
                        className={`p-1 rounded hover:bg-slate-200 transition-colors cursor-pointer ${
                          message.feedbackGiven === 'unhelpful' ? 'text-rose-600 font-bold' : 'text-slate-400'
                        }`}
                        title="Report Inaccuracy"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Expandable Supporting Evidence Drawer */}
                {isEvidenceOpen && rag && (
                  <div className="p-4 rounded-xl bg-white border border-teal-200 shadow-sm space-y-3 w-full text-xs">
                    <div className="font-bold text-slate-800 flex items-center justify-between border-b border-slate-100 pb-2">
                      <span>Retrieved Evidence & Grounding Chunks</span>
                      <span className="text-[11px] text-teal-700 font-semibold">
                        Grounded with {rag.citations.length} Verified Sources
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {rag.retrievedChunks.map((chunk, idx) => (
                        <div key={chunk.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-800">
                              [{idx + 1}] {chunk.source}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Tier {chunk.tier}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            {chunk.text}
                          </p>
                          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                            <span>Doctor: {chunk.doctorName || 'N/A'}</span>
                            <a
                              href={chunk.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-teal-600 hover:underline flex items-center gap-1 font-semibold"
                            >
                              <span>Inspect Source</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expandable RAG Trace Inspector */}
                {isTraceOpen && rag && (
                  <div className="p-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 shadow-sm space-y-3 w-full text-xs font-mono">
                    <div className="font-bold text-teal-400 flex items-center justify-between border-b border-slate-800 pb-2">
                      <span>Multi-Stage Pipeline Diagnostic Trace</span>
                      <span className="text-[10px] text-slate-400">RRF (k=60) + CE Reranking</span>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      <div>
                        <span className="text-teal-300 font-bold">Intent Classified:</span> {rag.intent}
                      </div>
                      <div>
                        <span className="text-teal-300 font-bold">Query Rewritten:</span> {rag.rewrittenQuery}
                      </div>
                      <div>
                        <span className="text-teal-300 font-bold">Extracted Entities:</span>{' '}
                        {JSON.stringify(rag.extractedEntities)}
                      </div>
                      <div>
                        <span className="text-teal-300 font-bold">Knowledge Graph Context:</span>{' '}
                        {rag.graphEvidence.relations[0] || 'No multi-hop traversal triggered.'}
                      </div>
                      <div>
                        <span className="text-teal-300 font-bold">Faithfulness Score:</span>{' '}
                        {(rag.faithfulnessScore * 100).toFixed(1)}% (Evidence grounded)
                      </div>
                      <div>
                        <span className="text-teal-300 font-bold">Total Chunks Reranked:</span>{' '}
                        {rag.retrievedChunks.length} chunks
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3.5 items-start">
            <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shrink-0 shadow-sm animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-600 rounded-tl-none shadow-sm space-y-2 max-w-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-700">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Executing Multi-Stage RAG Pipeline...</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Rewriting query → Dense vector cosine + BM25 keyword search → Traversing Knowledge Graph → Cross-checking conflicting claims.
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-6 py-2 border-t border-slate-200/80 bg-white flex flex-wrap items-center gap-2 shrink-0">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Suggested:
        </span>
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 border border-slate-200 font-medium transition-colors cursor-pointer truncate max-w-xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Bottom Input Field */}
      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 max-w-4xl mx-auto"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask anything about verified doctors, qualifications, hospital departments, or clinical trials..."
            className="flex-1 py-3 px-4 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[11px] text-center text-slate-400 mt-2">
          Strict Medical Safety: All doctor assertions are cited directly from registered medical sources. MedRAG does not diagnose or prescribe.
        </p>
      </div>
    </div>
  );
};
