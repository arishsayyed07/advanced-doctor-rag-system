import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Building2,
  GraduationCap,
  Calendar,
  ExternalLink,
  MessageSquare,
  Sparkles,
  BookOpen,
  Award,
  RotateCcw,
} from 'lucide-react';
import { Doctor } from '../types/index.ts';

interface DoctorSearchProps {
  doctors: Doctor[];
  onSelectDoctor: (doctor: Doctor) => void;
  onAskDoctor: (query: string) => void;
}

export const DoctorSearch: React.FC<DoctorSearchProps> = ({
  doctors,
  onSelectDoctor,
  onAskDoctor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const [minExperience, setMinExperience] = useState<number>(0);

  // Extract unique options
  const specialties = useMemo(() => {
    return Array.from(new Set(doctors.map(d => d.specialization))).sort();
  }, [doctors]);

  const cities = useMemo(() => {
    return Array.from(new Set(doctors.map(d => d.city))).sort();
  }, [doctors]);

  // Filter doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      // Text match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = doc.name.toLowerCase().includes(q);
        const matchesSpec = doc.specialization.toLowerCase().includes(q) || doc.subSpecialization.toLowerCase().includes(q);
        const matchesHosp = doc.hospital.toLowerCase().includes(q);
        const matchesCity = doc.city.toLowerCase().includes(q);
        const matchesExpertise = doc.areasOfExpertise.some(e => e.toLowerCase().includes(q));
        const matchesQual = doc.qualifications.some(qual => qual.degree.toLowerCase().includes(q) || qual.institute.toLowerCase().includes(q));

        if (!matchesName && !matchesSpec && !matchesHosp && !matchesCity && !matchesExpertise && !matchesQual) {
          return false;
        }
      }

      // Specialty filter
      if (selectedSpecialty !== 'all' && doc.specialization !== selectedSpecialty) {
        return false;
      }

      // City filter
      if (selectedCity !== 'all' && doc.city !== selectedCity) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && doc.verificationStatus !== selectedStatus) {
        return false;
      }

      // Tier filter
      if (selectedTier !== 'all' && doc.trustTier !== parseInt(selectedTier, 10)) {
        return false;
      }

      // Min Experience
      if (doc.experienceYears < minExperience) {
        return false;
      }

      return true;
    });
  }, [doctors, searchQuery, selectedSpecialty, selectedCity, selectedStatus, selectedTier, minExperience]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('all');
    setSelectedCity('all');
    setSelectedStatus('all');
    setSelectedTier('all');
    setMinExperience(0);
  };

  return (
    <div className="p-8 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Header and Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Faceted Doctor Directory & Semantic Search
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Search verified specialists with multi-tier source provenance and qualification auditing.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-600">
            Showing <span className="text-teal-700 font-bold">{filteredDoctors.length}</span> of {doctors.length} Doctors
          </span>
          {(searchQuery || selectedSpecialty !== 'all' || selectedCity !== 'all' || selectedStatus !== 'all' || selectedTier !== 'all' || minExperience > 0) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-1 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by doctor name, specialty, hospital, procedure, qualification (e.g. 'Dr. Devi Shetty', 'Pediatric Cardiology', 'TAVR')..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-sm transition-all"
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
        {/* Specialty Filter */}
        <div>
          <label className="block text-slate-500 font-semibold mb-1">Specialization</label>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-teal-500 focus:outline-none cursor-pointer"
          >
            <option value="all">All Specialties</option>
            {specialties.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* City Filter */}
        <div>
          <label className="block text-slate-500 font-semibold mb-1">City / Region</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-teal-500 focus:outline-none cursor-pointer"
          >
            <option value="all">All Cities</option>
            {cities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-slate-500 font-semibold mb-1">Verification Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-teal-500 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="verified">Verified Only</option>
            <option value="conflicting">Conflicting Discrepancies</option>
            <option value="pending">Pending Review</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>

        {/* Tier Filter */}
        <div>
          <label className="block text-slate-500 font-semibold mb-1">Source Tier</label>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-teal-500 focus:outline-none cursor-pointer"
          >
            <option value="all">All Tiers (1 - 5)</option>
            <option value="1">Tier 1: Official Hospital / Govt</option>
            <option value="2">Tier 2: Medical Societies</option>
            <option value="3">Tier 3: Academic / PubMed</option>
            <option value="4">Tier 4: Public Profiles</option>
            <option value="5">Tier 5: User Crowdsourced</option>
          </select>
        </div>

        {/* Experience Slider */}
        <div>
          <div className="flex justify-between text-slate-500 font-semibold mb-1">
            <span>Min. Experience:</span>
            <span className="text-teal-700 font-bold">{minExperience} yrs</span>
          </div>
          <input
            type="range"
            min="0"
            max="45"
            step="5"
            value={minExperience}
            onChange={(e) => setMinExperience(parseInt(e.target.value, 10))}
            className="w-full accent-teal-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No Matching Doctors Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Try broadening your search keywords, lowering the experience filter, or selecting "All Specialties".
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700 transition-all cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDoctors.map((doc) => {
            const hasConflict = doc.verificationStatus === 'conflicting';
            return (
              <div
                key={doc.id}
                className={`p-5 rounded-2xl bg-white border transition-all hover:shadow-md flex flex-col justify-between ${
                  hasConflict
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top Bar with Badges */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 font-bold text-sm shrink-0">
                        {doc.name.replace(/^Dr\.\s+/, '').charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm hover:text-teal-700 transition-colors">
                          {doc.name}
                        </h3>
                        <span className="text-xs text-teal-700 font-semibold block">
                          {doc.specialization}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {hasConflict ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Conflicting
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Tier {doc.trustTier}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">
                        {doc.confidenceScore}% trust
                      </span>
                    </div>
                  </div>

                  {/* Sub-specialty */}
                  <p className="text-xs text-slate-600 font-medium line-clamp-1 mb-2">
                    {doc.subSpecialization}
                  </p>

                  {/* Hospital & Location */}
                  <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{doc.hospital}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{doc.city}, {doc.state}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{doc.experienceYears} Years Clinical Experience</span>
                    </div>
                  </div>

                  {/* Expertise Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {doc.areasOfExpertise.slice(0, 3).map((area, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                      >
                        {area}
                      </span>
                    ))}
                    {doc.areasOfExpertise.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-400 text-[10px] font-medium">
                        +{doc.areasOfExpertise.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectDoctor(doc)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer text-center"
                  >
                    View Full Dossier
                  </button>
                  <button
                    onClick={() => onAskDoctor(`Tell me about ${doc.name}, including qualifications and publications at ${doc.hospital}`)}
                    className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 transition-colors cursor-pointer"
                    title="Ask MedRAG AI Chat about this doctor"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
