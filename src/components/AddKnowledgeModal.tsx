import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  Globe,
  UserPlus,
  FileText,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { TrustTier } from '../types/index.ts';

interface AddKnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddKnowledgeModal: React.FC<AddKnowledgeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'doctor' | 'upload' | 'url' | 'raw'>('doctor');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Doctor Form State
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialization: 'Cardiology',
    subSpecialization: '',
    hospital: '',
    city: 'Mumbai',
    experienceYears: 10,
    qualifications: 'MBBS, MD',
    expertise: '',
    primarySourceTitle: '',
    primarySourceUrl: '',
    trustTier: 4,
  });

  // File Upload State
  const [fileTitle, setFileTitle] = useState('');
  const [fileType, setFileType] = useState<'pdf' | 'docx' | 'txt' | 'csv' | 'json'>('txt');
  const [fileContent, setFileContent] = useState('');
  const [fileTier, setFileTier] = useState<number>(4);

  // URL Ingest State
  const [urlAddress, setUrlAddress] = useState('');
  const [urlTitle, setUrlTitle] = useState('');
  const [urlTier, setUrlTier] = useState<number>(1);

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorForm.name || !doctorForm.hospital) {
      setErrorMessage('Please provide both Doctor Name and Hospital.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const qualificationsArray = doctorForm.qualifications.split(',').map(q => ({
        degree: q.trim(),
        institute: 'Accredited Medical Institute',
        year: 2012,
      }));

      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: doctorForm.name.startsWith('Dr.') ? doctorForm.name : `Dr. ${doctorForm.name}`,
          specialization: doctorForm.specialization,
          subSpecialization: doctorForm.subSpecialization || `${doctorForm.specialization} Clinical Practice`,
          hospital: doctorForm.hospital,
          hospitalDepartment: `Department of ${doctorForm.specialization}`,
          city: doctorForm.city,
          state: 'Maharashtra',
          country: 'India',
          experienceYears: Number(doctorForm.experienceYears),
          qualifications: qualificationsArray,
          areasOfExpertise: doctorForm.expertise.split(',').map(e => e.trim()).filter(Boolean),
          primarySourceTitle: doctorForm.primarySourceTitle || 'User Submitted Clinical Profile',
          primarySourceUrl: doctorForm.primarySourceUrl || 'https://medrag.internal/submissions',
          trustTier: Number(doctorForm.trustTier) as TrustTier,
        }),
      });

      if (!res.ok) throw new Error('Submission failed');
      const data = await res.json();
      setSuccessMessage(`Successfully ingested ${doctorForm.name}! Vector embeddings and graph nodes generated.`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error creating doctor record');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileTitle || !fileContent) {
      setErrorMessage('Please enter title and document content.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: fileTitle,
          type: fileType,
          content: fileContent,
          tier: Number(fileTier),
        }),
      });

      if (!res.ok) throw new Error('Ingestion failed');
      const data = await res.json();
      setSuccessMessage(`Document "${fileTitle}" processed into ${data.chunks?.length || 0} chunks! PII masked: ${data.piiRedacted || 0}.`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Ingestion failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUrlCrawl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlAddress) {
      setErrorMessage('Please provide a URL to crawl.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/knowledge/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlAddress,
          title: urlTitle || `Web Roster: ${new URL(urlAddress).hostname}`,
          tier: Number(urlTier),
        }),
      });

      if (!res.ok) throw new Error('Crawl failed');
      setSuccessMessage(`Controlled crawl finished! Extracted provenance and indexed in Knowledge Graph.`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'URL crawl failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-base">Ingest Clinical Knowledge</h2>
              <p className="text-xs text-slate-500">Automated cleaning, PII masking, embedding & graph indexing</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 px-5 pt-3 gap-3 bg-white text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('doctor')}
            className={`pb-2.5 flex items-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'doctor' ? 'border-teal-600 text-teal-800 font-bold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Structured Doctor</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 flex items-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'upload' ? 'border-teal-600 text-teal-800 font-bold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Document / Batch (PDF, CSV, JSON)</span>
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`pb-2.5 flex items-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'url' ? 'border-teal-600 text-teal-800 font-bold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Web URL Ingestion</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {successMessage && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form 1: Structured Doctor Entry */}
          {activeTab === 'doctor' && (
            <form onSubmit={handleDoctorSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Doctor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ramesh Gupta"
                    value={doctorForm.name}
                    onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Specialization</label>
                  <select
                    value={doctorForm.specialization}
                    onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none bg-white"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Oncology">Oncology</option>
                    <option value="Pulmonology">Pulmonology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Gastroenterology">Gastroenterology</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Sub-Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Interventional Cardiology, TAVR"
                    value={doctorForm.subSpecialization}
                    onChange={(e) => setDoctorForm({ ...doctorForm, subSpecialization: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Hospital / Clinic *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apollo Hospitals"
                    value={doctorForm.hospital}
                    onChange={(e) => setDoctorForm({ ...doctorForm, hospital: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Mumbai"
                    value={doctorForm.city}
                    onChange={(e) => setDoctorForm({ ...doctorForm, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={doctorForm.experienceYears}
                    onChange={(e) => setDoctorForm({ ...doctorForm, experienceYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Trust Tier</label>
                  <select
                    value={doctorForm.trustTier}
                    onChange={(e) => setDoctorForm({ ...doctorForm, trustTier: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none bg-white"
                  >
                    <option value="1">Tier 1: Official Hospital</option>
                    <option value="2">Tier 2: Medical Society</option>
                    <option value="3">Tier 3: Academic Publication</option>
                    <option value="4">Tier 4: Public Directory</option>
                    <option value="5">Tier 5: User Crowdsourced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Qualifications (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. MBBS, MD (General Medicine), DM (Cardiology)"
                  value={doctorForm.qualifications}
                  onChange={(e) => setDoctorForm({ ...doctorForm, qualifications: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Areas of Expertise (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Coronary Angioplasty, Valve Replacement, Preventive Cardiology"
                  value={doctorForm.expertise}
                  onChange={(e) => setDoctorForm({ ...doctorForm, expertise: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Source Title / Register</label>
                  <input
                    type="text"
                    placeholder="e.g. Official Hospital Medical Registry 2026"
                    value={doctorForm.primarySourceTitle}
                    onChange={(e) => setDoctorForm({ ...doctorForm, primarySourceTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Source URL</label>
                  <input
                    type="url"
                    placeholder="https://hospital.org/doctors/dr-name"
                    value={doctorForm.primarySourceUrl}
                    onChange={(e) => setDoctorForm({ ...doctorForm, primarySourceUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-sm cursor-pointer"
              >
                {isSubmitting ? 'Validating & Indexing...' : 'Validate, Vectorize & Index Doctor'}
              </button>
            </form>
          )}

          {/* Form 2: Document / File Upload */}
          {activeTab === 'upload' && (
            <form onSubmit={handleFileUpload} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Document Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Clinical Trial & Faculty Dossier 2026"
                    value={fileTitle}
                    onChange={(e) => setFileTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Format Type</label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none bg-white"
                  >
                    <option value="txt">TXT Document</option>
                    <option value="pdf">PDF Clinical Report</option>
                    <option value="docx">DOCX File</option>
                    <option value="csv">CSV Dataset</option>
                    <option value="json">JSON Registry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Document Content / Text Extract *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Paste document text, research abstract, or CSV rows here. Note: Any detected patient phone numbers, SSNs, or MRNs will be automatically masked during ingestion."
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Trust Tier</label>
                <select
                  value={fileTier}
                  onChange={(e) => setFileTier(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none bg-white"
                >
                  <option value="1">Tier 1: Official Hospital / Government</option>
                  <option value="2">Tier 2: Medical Association</option>
                  <option value="3">Tier 3: Academic Publication (PubMed)</option>
                  <option value="4">Tier 4: Public Professional Profile</option>
                  <option value="5">Tier 5: User Crowdsourced</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-sm cursor-pointer"
              >
                {isSubmitting ? 'Processing Pipeline (PII Scrub → Chunking → Embedding)...' : 'Run Ingestion Pipeline'}
              </button>
            </form>
          )}

          {/* Form 3: URL Crawl */}
          {activeTab === 'url' && (
            <form onSubmit={handleUrlCrawl} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Source URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://aiims.edu/directory/cardiology"
                  value={urlAddress}
                  onChange={(e) => setUrlAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Source Title</label>
                <input
                  type="text"
                  placeholder="e.g. AIIMS Departmental Faculty Directory"
                  value={urlTitle}
                  onChange={(e) => setUrlTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Assigned Source Tier</label>
                <select
                  value={urlTier}
                  onChange={(e) => setUrlTier(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none bg-white"
                >
                  <option value="1">Tier 1: Official Hospital / Government</option>
                  <option value="2">Tier 2: Professional Medical Organization</option>
                  <option value="3">Tier 3: Academic / Clinical Trial Repository</option>
                  <option value="4">Tier 4: Public Directory</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-[11px] leading-relaxed">
                Notice: Controlled web data ingestion strictly complies with robots.txt, website copyright, and privacy rate limits. Extracted provenance records will maintain source timestamping.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-sm cursor-pointer"
              >
                {isSubmitting ? 'Connecting & Ingesting...' : 'Crawl & Index Public Source'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
