/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, NavigationTab } from './components/Sidebar.tsx';
import { Header } from './components/Header.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { DoctorSearch } from './components/DoctorSearch.tsx';
import { RAGChat } from './components/RAGChat.tsx';
import { KnowledgeBase } from './components/KnowledgeBase.tsx';
import { VerificationCenter } from './components/VerificationCenter.tsx';
import { KnowledgeGraphView } from './components/KnowledgeGraphView.tsx';
import { SourceManager } from './components/SourceManager.tsx';
import { EvaluationDashboard } from './components/EvaluationDashboard.tsx';
import { AuditLogsView } from './components/AuditLogsView.tsx';
import { DoctorProfileModal } from './components/DoctorProfileModal.tsx';
import { AddKnowledgeModal } from './components/AddKnowledgeModal.tsx';
import { ReportInaccuracyModal } from './components/ReportInaccuracyModal.tsx';

import {
  Doctor,
  KnowledgeDocument,
  DocumentChunk,
  Source,
  ConflictRecord,
  VerificationTask,
  UserRole,
} from './types/index.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>({
    role: 'admin',
    name: 'Chief Medical Administrator',
    email: 'admin@medrag.health',
  });

  // Core Data State
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [chunks, setChunks] = useState<DocumentChunk[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [conflicts, setConflicts] = useState<ConflictRecord[]>([]);
  const [tasks, setTasks] = useState<VerificationTask[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  // Modal State
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isAddKnowledgeOpen, setIsAddKnowledgeOpen] = useState(false);
  const [reportModalData, setReportModalData] = useState<{
    isOpen: boolean;
    query: string;
    answerSnippet: string;
  }>({
    isOpen: false,
    query: '',
    answerSnippet: '',
  });

  // Pre-populated Chat Query
  const [chatInitialQuery, setChatInitialQuery] = useState('');

  // Data Fetching
  const refreshAllData = useCallback(async () => {
    try {
      const [docsRes, knowRes, sourcesRes, verifRes, analRes] = await Promise.all([
        fetch('/api/doctors').then((r) => r.json()),
        fetch('/api/knowledge').then((r) => r.json()),
        fetch('/api/sources').then((r) => r.json()),
        fetch('/api/verification').then((r) => r.json()),
        fetch('/api/analytics').then((r) => r.json()),
      ]);

      if (Array.isArray(docsRes)) setDoctors(docsRes);
      if (knowRes.documents) setDocuments(knowRes.documents);
      if (knowRes.chunksPreview) setChunks(knowRes.chunksPreview);
      if (Array.isArray(sourcesRes)) setSources(sourcesRes);
      if (verifRes.conflicts) setConflicts(verifRes.conflicts);
      if (verifRes.tasks) setTasks(verifRes.tasks);
      if (analRes) setAnalytics(analRes);
    } catch (err) {
      console.error('Error fetching MedRAG data:', err);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Handle Role Switch
  const handleRoleChange = async (newRole: UserRole['role']) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      setUserRole({
        role: data.role,
        name: data.name,
        email: data.email,
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Bridge from Doctor Search / Profile to RAG Chat
  const handleAskAboutDoctor = (query: string) => {
    setChatInitialQuery(query);
    setCurrentTab('chat');
  };

  const handleSelectDoctorByName = (name: string) => {
    const doc = doctors.find(
      (d) => d.name.toLowerCase() === name.toLowerCase() || d.name.includes(name)
    );
    if (doc) {
      setSelectedDoctor(doc);
    }
  };

  const conflictCount = conflicts.filter((c) => c.status === 'unresolved').length;
  const pendingCount = tasks.filter((t) => t.status === 'pending').length;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        conflictCount={conflictCount}
        pendingCount={pendingCount}
      />

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          currentTab={currentTab}
          userRole={userRole}
          onRoleChange={handleRoleChange}
          onOpenAddKnowledge={() => setIsAddKnowledgeOpen(true)}
        />

        <main className="flex-1 overflow-hidden relative">
          {currentTab === 'dashboard' && (
            <Dashboard
              analytics={analytics}
              doctors={doctors}
              conflicts={conflicts}
              documents={documents}
              onNavigate={setCurrentTab}
              onSelectDoctor={setSelectedDoctor}
            />
          )}

          {currentTab === 'chat' && (
            <RAGChat
              initialQuery={chatInitialQuery}
              onOpenReportModal={(query, answerSnippet) =>
                setReportModalData({
                  isOpen: true,
                  query,
                  answerSnippet,
                })
              }
            />
          )}

          {currentTab === 'search' && (
            <DoctorSearch
              doctors={doctors}
              onSelectDoctor={setSelectedDoctor}
              onAskDoctor={handleAskAboutDoctor}
            />
          )}

          {currentTab === 'knowledge' && (
            <KnowledgeBase
              documents={documents}
              chunks={chunks}
              onOpenAddKnowledge={() => setIsAddKnowledgeOpen(true)}
              onRefresh={refreshAllData}
            />
          )}

          {currentTab === 'verification' && (
            <VerificationCenter
              conflicts={conflicts}
              tasks={tasks}
              onRefresh={refreshAllData}
            />
          )}

          {currentTab === 'graph' && (
            <KnowledgeGraphView
              onSelectDoctorByName={handleSelectDoctorByName}
            />
          )}

          {currentTab === 'sources' && (
            <SourceManager
              sources={sources}
              onRefresh={refreshAllData}
            />
          )}

          {currentTab === 'evaluations' && <EvaluationDashboard />}

          {currentTab === 'audit' && <AuditLogsView />}
        </main>
      </div>

      {/* Modals and Drawers */}
      <DoctorProfileModal
        doctor={selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        onAskAboutDoctor={handleAskAboutDoctor}
      />

      <AddKnowledgeModal
        isOpen={isAddKnowledgeOpen}
        onClose={() => setIsAddKnowledgeOpen(false)}
        onSuccess={refreshAllData}
      />

      <ReportInaccuracyModal
        isOpen={reportModalData.isOpen}
        onClose={() =>
          setReportModalData({ isOpen: false, query: '', answerSnippet: '' })
        }
        query={reportModalData.query}
        answerSnippet={reportModalData.answerSnippet}
      />
    </div>
  );
}
