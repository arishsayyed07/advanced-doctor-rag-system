import React, { useState } from 'react';
import { X, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';

interface ReportInaccuracyModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  answerSnippet: string;
}

export const ReportInaccuracyModal: React.FC<ReportInaccuracyModalProps> = ({
  isOpen,
  onClose,
  query,
  answerSnippet,
}) => {
  if (!isOpen) return null;

  const [reason, setReason] = useState('Incorrect Experience or Hospital');
  const [details, setDetails] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          answerSnippet,
          rating: 'unhelpful',
          reason,
          reportedInaccuracy: details || reason,
          doctorName: doctorName || 'Entity under review',
        }),
      });

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 1800);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Report Inaccurate or Outdated Information</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-slate-900 text-sm">Verification Task Generated</h4>
            <p className="text-xs text-slate-500">
              Thank you. This report has been dispatched to the Medical Verification Queue for administrator review and source reconciliation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Doctor / Entity Name</label>
              <input
                type="text"
                placeholder="e.g. Dr. Rajesh Verma"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Type of Discrepancy</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none bg-white"
              >
                <option value="Incorrect Experience or Hospital">Incorrect Experience or Hospital</option>
                <option value="Outdated Clinical Information">Outdated Clinical Information</option>
                <option value="Conflicting Specialization Claim">Conflicting Specialization Claim</option>
                <option value="Missing or Contested Credentials">Missing or Contested Credentials</option>
                <option value="Other Discrepancy">Other Discrepancy</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Correction Details or Supporting Link</label>
              <textarea
                rows={3}
                required
                placeholder="Describe what appears incorrect and optionally provide a link to the official hospital directory or journal..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold cursor-pointer transition-all shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'Dispatch Review Task'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
