import { Doctor, Source, KnowledgeDocument, DocumentChunk, ConflictRecord, KnowledgeGraphNode, KnowledgeGraphEdge, AuditLog } from '../../src/types/index.ts';
import {
  ADDITIONAL_SOURCES,
  ADDITIONAL_CONFLICTS,
  ADDITIONAL_DOCTORS,
  ADDITIONAL_DOCUMENTS,
  ADDITIONAL_CHUNKS,
  ADDITIONAL_KG_NODES,
  ADDITIONAL_KG_EDGES
} from './additionalMedicalData.ts';

export const INITIAL_SOURCES: Source[] = [
  {
    id: 'src-1',
    name: 'Tata Memorial Centre Official Registry',
    url: 'https://tmc.gov.in/faculty/oncology',
    tier: 1,
    tierDescription: 'Tier 1: Official hospital / government medical institution',
    reliabilityScore: 98,
    recordsCount: 42,
    lastScrapedOrIngested: '2026-09-15T08:00:00Z',
    status: 'active',
  },
  {
    id: 'src-2',
    name: 'All India Institute of Medical Sciences (AIIMS) Portal',
    url: 'https://aiims.edu/directory/cardiology',
    tier: 1,
    tierDescription: 'Tier 1: Premier government medical research institution',
    reliabilityScore: 99,
    recordsCount: 56,
    lastScrapedOrIngested: '2026-09-18T10:30:00Z',
    status: 'active',
  },
  {
    id: 'src-3',
    name: 'Cardiological Society of India (CSI)',
    url: 'https://csi.org.in/fellows/directory',
    tier: 2,
    tierDescription: 'Tier 2: Recognized professional medical organization',
    reliabilityScore: 92,
    recordsCount: 38,
    lastScrapedOrIngested: '2026-08-20T14:15:00Z',
    status: 'active',
  },
  {
    id: 'src-4',
    name: 'National Library of Medicine (PubMed / NCBI)',
    url: 'https://pubmed.ncbi.nlm.nih.gov/?term=author',
    tier: 3,
    tierDescription: 'Tier 3: Peer-reviewed academic publications & clinical trials',
    reliabilityScore: 95,
    recordsCount: 110,
    lastScrapedOrIngested: '2026-09-22T11:00:00Z',
    status: 'active',
  },
  {
    id: 'src-5',
    name: 'Apollo Hospitals Clinical Staff Directory',
    url: 'https://apollohospitals.com/doctors/cardiac-sciences',
    tier: 1,
    tierDescription: 'Tier 1: Accredited multi-specialty healthcare network',
    reliabilityScore: 96,
    recordsCount: 84,
    lastScrapedOrIngested: '2026-09-24T09:40:00Z',
    status: 'active',
  },
  {
    id: 'src-6',
    name: 'DoctorPedia Public Professional Directory',
    url: 'https://doctorpedia-profiles.net/dr/rajesh-verma',
    tier: 4,
    tierDescription: 'Tier 4: Public professional profile & web directory',
    reliabilityScore: 71,
    recordsCount: 29,
    lastScrapedOrIngested: '2026-07-12T16:20:00Z',
    status: 'under_review',
  },
  {
    id: 'src-7',
    name: 'Community Patient Submissions (Crowdsourced)',
    url: 'https://medrag.internal/submissions/community-upload',
    tier: 5,
    tierDescription: 'Tier 5: User-provided / crowdsourced submission',
    reliabilityScore: 54,
    recordsCount: 15,
    lastScrapedOrIngested: '2026-09-25T18:00:00Z',
    status: 'under_review',
  },
  ...ADDITIONAL_SOURCES
];

export const INITIAL_CONFLICTS: ConflictRecord[] = [
  {
    id: 'conf-1',
    doctorId: 'doc-4',
    doctorName: 'Dr. Rajesh Verma',
    field: 'experienceYears',
    sourceA: {
      sourceName: 'Fortis Healthcare Hospital Directory (Tier 1)',
      sourceUrl: 'https://fortishealthcare.com/doctors/dr-rajesh-verma',
      tier: 1,
      value: 18,
      date: '2026-08-15',
    },
    sourceB: {
      sourceName: 'DoctorPedia Public Directory (Tier 4)',
      sourceUrl: 'https://doctorpedia-profiles.net/dr/rajesh-verma',
      tier: 4,
      value: 14,
      date: '2025-04-10',
    },
    status: 'unresolved',
    resolutionNotes: 'Discrepancy between latest hospital roster (18 yrs) and older web directory profile (14 yrs). Requires verification committee sign-off.',
  },
  {
    id: 'conf-2',
    doctorId: 'doc-6',
    doctorName: 'Dr. Sunita Rao',
    field: 'hospital',
    sourceA: {
      sourceName: 'Lilavati Hospital Staff Directory (Tier 1)',
      sourceUrl: 'https://lilavatihospital.com/doctors/neurology/sunita-rao',
      tier: 1,
      value: 'Lilavati Hospital & Research Centre',
      date: '2026-09-01',
    },
    sourceB: {
      sourceName: 'Community Patient Submissions (Tier 5)',
      sourceUrl: 'https://medrag.internal/submissions/community-upload',
      tier: 5,
      value: 'Breach Candy Hospital',
      date: '2026-09-20',
    },
    status: 'unresolved',
    resolutionNotes: 'User submitted form claims primary practice shifted to Breach Candy, but official Lilavati portal still lists her as active Chief of Neurology.',
  },
  ...ADDITIONAL_CONFLICTS
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Devi Prasad Shetty',
    title: 'Dr.',
    specialization: 'Cardiology',
    subSpecialization: 'Cardiothoracic Surgery & Pediatric Cardiac Surgery',
    qualifications: [
      { degree: 'MBBS', institute: 'Kasturba Medical College, Mangalore', year: 1979 },
      { degree: 'MS (General Surgery)', institute: 'Kasturba Medical College', year: 1982 },
      { degree: 'FRCS', institute: 'Royal College of Surgeons of England', year: 1989 }
    ],
    hospital: 'Narayana Health City',
    hospitalDepartment: 'Department of Cardiothoracic & Vascular Surgery',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    experienceYears: 42,
    areasOfExpertise: [
      'Neonatal Cardiac Surgery',
      'Coronary Artery Bypass Graft (CABG)',
      'Valve Repair & Replacement',
      'Minimally Invasive Cardiac Surgery',
      'Affordable Healthcare Systems'
    ],
    publications: [
      {
        title: 'Outcomes of low-cost off-pump coronary artery bypass graft in emerging economies',
        journal: 'The Lancet Global Health',
        year: 2021,
        pmid: '33824109',
        doi: '10.1016/S2214-109X(21)00102-1'
      },
      {
        title: 'Pediatric heart surgery outcomes in complex congenital heart disease',
        journal: 'Annals of Thoracic Surgery',
        year: 2023,
        pmid: '37128901'
      }
    ],
    memberships: [
      'Cardiological Society of India',
      'Indian Association of Cardiovascular-Thoracic Surgeons',
      'Royal College of Surgeons of England'
    ],
    languages: ['English', 'Kannada', 'Hindi', 'Bengali'],
    publicProfiles: [
      { platform: 'Narayana Health Portal', url: 'https://narayanahealth.org/doctors/dr-devi-shetty' },
      { platform: 'Google Scholar', url: 'https://scholar.google.com/citations?user=devi_shetty' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://narayanahealth.org/doctors/dr-devi-shetty',
    primarySourceTitle: 'Narayana Health Institutional Faculty Registry',
    dateCollected: '2026-09-10',
    lastVerifiedDate: '2026-09-20',
    confidenceScore: 99,
    bio: 'Renowned cardiac surgeon who has performed over 15,000 heart surgeries, pioneering high-volume, cost-effective surgical care in pediatric cardiology.'
  },
  {
    id: 'doc-2',
    name: 'Dr. Naresh Trehan',
    title: 'Dr.',
    specialization: 'Cardiology',
    subSpecialization: 'Cardiovascular and Cardiothoracic Surgery',
    qualifications: [
      { degree: 'MBBS', institute: 'King George Medical College, Lucknow', year: 1968 },
      { degree: 'Diplomate', institute: 'American Board of Surgery, USA', year: 1977 },
      { degree: 'Diplomate', institute: 'American Board of Cardiothoracic Surgery, USA', year: 1979 }
    ],
    hospital: 'Medanta - The Medicity',
    hospitalDepartment: 'Heart Institute',
    city: 'Gurugram',
    state: 'Haryana',
    country: 'India',
    experienceYears: 52,
    areasOfExpertise: [
      'Robotic Heart Surgery',
      'Transcatheter Aortic Valve Replacement (TAVR)',
      'Total Arterial Revascularization',
      'Heart Transplant Evaluation',
      'Cardiothoracic Critical Care'
    ],
    publications: [
      {
        title: 'Long-term patency of bilateral internal thoracic artery grafts in diabetic patients',
        journal: 'Journal of the American College of Cardiology',
        year: 2022,
        pmid: '35142103'
      },
      {
        title: 'Evolution of robotic cardiac surgery in Asia: A 15-year retrospective registry',
        journal: 'Asian Cardiovascular and Thoracic Annals',
        year: 2024,
        doi: '10.1177/021849232411098'
      }
    ],
    memberships: [
      'Society of Thoracic Surgeons (STS, USA)',
      'European Association for Cardio-Thoracic Surgery (EACTS)',
      'Medical Council of India'
    ],
    languages: ['English', 'Hindi', 'Punjabi'],
    publicProfiles: [
      { platform: 'Medanta Hospital Faculty', url: 'https://medanta.org/doctors/dr-naresh-trehan' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://medanta.org/doctors/dr-naresh-trehan',
    primarySourceTitle: 'Medanta Institutional Medical Directory',
    dateCollected: '2026-09-08',
    lastVerifiedDate: '2026-09-22',
    confidenceScore: 98,
    bio: 'Pioneer of cardiovascular surgery with decades of clinical practice in New York and India, holding leadership roles in the Society of Thoracic Surgeons.'
  },
  {
    id: 'doc-3',
    name: 'Dr. Suresh Advani',
    title: 'Dr.',
    specialization: 'Oncology',
    subSpecialization: 'Medical Oncology & Hematology / Bone Marrow Transplant',
    qualifications: [
      { degree: 'MBBS', institute: 'Grant Medical College & Sir JJ Group of Hospitals, Mumbai', year: 1969 },
      { degree: 'MD (General Medicine)', institute: 'Grant Medical College, Mumbai', year: 1973 },
      { degree: 'Fellowship (BMT)', institute: 'Fred Hutchinson Cancer Research Center, Seattle, USA', year: 1982 }
    ],
    hospital: 'Tata Memorial Hospital & Jaslok Hospital',
    hospitalDepartment: 'Department of Medical Oncology',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    experienceYears: 48,
    areasOfExpertise: [
      'Bone Marrow Transplantation',
      'Acute Leukemia and Lymphoma Therapy',
      'Targeted Cancer Therapy',
      'Immunotherapy',
      'Pediatric Hematologic Oncology'
    ],
    publications: [
      {
        title: 'Allogeneic bone marrow transplantation in chronic myeloid leukemia: Indian trial data',
        journal: 'Bone Marrow Transplantation (Nature Group)',
        year: 2020,
        pmid: '32015502'
      },
      {
        title: 'Safety and efficacy of generic biosimilars in solid tumors and lymphoma in South Asia',
        journal: 'Journal of Clinical Oncology',
        year: 2023,
        doi: '10.1200/JCO.2023.41.16_suppl'
      }
    ],
    memberships: [
      'American Society of Clinical Oncology (ASCO)',
      'Indian Society of Oncology',
      'European Society for Medical Oncology (ESMO)'
    ],
    languages: ['English', 'Hindi', 'Marathi', 'Gujarati'],
    publicProfiles: [
      { platform: 'Tata Memorial Centre', url: 'https://tmc.gov.in/faculty/dr-suresh-advani' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://tmc.gov.in/faculty/dr-suresh-advani',
    primarySourceTitle: 'Tata Memorial Hospital Official Senior Faculty Directory',
    dateCollected: '2026-09-02',
    lastVerifiedDate: '2026-09-18',
    confidenceScore: 99,
    bio: 'Regarded as the father of medical oncology in India, first oncologist to successfully perform hematopoietic stem cell transplant in the country.'
  },
  {
    id: 'doc-4',
    name: 'Dr. Rajesh Verma',
    title: 'Dr.',
    specialization: 'Neurology',
    subSpecialization: 'Movement Disorders & Stroke Intervention',
    qualifications: [
      { degree: 'MBBS', institute: 'Maulana Azad Medical College, New Delhi', year: 2004 },
      { degree: 'MD (Internal Medicine)', institute: 'Lady Hardinge Medical College, Delhi', year: 2008 },
      { degree: 'DM (Neurology)', institute: 'All India Institute of Medical Sciences (AIIMS), New Delhi', year: 2012 }
    ],
    hospital: 'Fortis Memorial Research Institute',
    hospitalDepartment: 'Neurosciences Division',
    city: 'Gurugram',
    state: 'Haryana',
    country: 'India',
    experienceYears: 18,
    areasOfExpertise: [
      'Acute Stroke Thrombolysis',
      'Deep Brain Stimulation (DBS) for Parkinson Disease',
      'Epilepsy Monitoring',
      'Neuro-critical Care',
      'Peripheral Neuropathy Management'
    ],
    publications: [
      {
        title: 'Tenecteplase versus Alteplase within 4.5 hours of acute ischemic stroke: An observational study',
        journal: 'Neurology India',
        year: 2023,
        pmid: '37418902'
      }
    ],
    memberships: [
      'Indian Academy of Neurology',
      'Movement Disorders Society (MDS)',
      'American Academy of Neurology'
    ],
    languages: ['English', 'Hindi'],
    publicProfiles: [
      { platform: 'Fortis Healthcare Portal', url: 'https://fortishealthcare.com/doctors/dr-rajesh-verma' },
      { platform: 'DoctorPedia', url: 'https://doctorpedia-profiles.net/dr/rajesh-verma' }
    ],
    verificationStatus: 'conflicting',
    trustTier: 1,
    primarySourceUrl: 'https://fortishealthcare.com/doctors/dr-rajesh-verma',
    primarySourceTitle: 'Fortis Healthcare Verified Roster',
    dateCollected: '2026-08-15',
    lastVerifiedDate: '2026-08-15',
    confidenceScore: 78,
    conflicts: [INITIAL_CONFLICTS[0]],
    bio: 'Specialist in hyper-acute stroke intervention and neuromodulation. Currently flagged with conflicting years of clinical experience across data sources.'
  },
  {
    id: 'doc-5',
    name: 'Dr. Ashok Seth',
    title: 'Dr.',
    specialization: 'Cardiology',
    subSpecialization: 'Interventional Cardiology',
    qualifications: [
      { degree: 'MBBS', institute: 'Jawaharlal Nehru Medical College, AMU, Aligarh', year: 1979 },
      { degree: 'MRCP', institute: 'Royal College of Physicians, UK', year: 1984 },
      { degree: 'FRCP', institute: 'Royal College of Physicians, London', year: 1995 },
      { degree: 'FACC', institute: 'American College of Cardiology', year: 2002 }
    ],
    hospital: 'Fortis Escorts Heart Institute',
    hospitalDepartment: 'Chairman, Interventional Cardiology',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    experienceYears: 40,
    areasOfExpertise: [
      'Complex Coronary Angioplasty (PTCA)',
      'Bioresorbable Vascular Scaffolds (BVS)',
      'Transcatheter Aortic Valve Implantation (TAVI/TAVR)',
      'Directional Coronary Atherectomy',
      'Rotablation'
    ],
    publications: [
      {
        title: 'Safety profile of second-generation drug-eluting stents in multi-vessel diffuse disease',
        journal: 'European Heart Journal',
        year: 2021,
        pmid: '34190822',
        doi: '10.1093/eurheartj/ehab412'
      },
      {
        title: 'TAVR vs surgical aortic valve replacement in high-risk Asian cohort',
        journal: 'Indian Heart Journal',
        year: 2024,
        pmid: '38210344'
      }
    ],
    memberships: [
      'Cardiological Society of India',
      'Society for Cardiovascular Angiography and Interventions (SCAI, USA)',
      'American College of Cardiology'
    ],
    languages: ['English', 'Hindi', 'Urdu'],
    publicProfiles: [
      { platform: 'Fortis Escorts Institute', url: 'https://fortisescorts.com/doctors/dr-ashok-seth' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://fortisescorts.com/doctors/dr-ashok-seth',
    primarySourceTitle: 'Fortis Escorts Heart Institute Medical Board Registry',
    dateCollected: '2026-09-12',
    lastVerifiedDate: '2026-09-24',
    confidenceScore: 98,
    bio: 'One of the most prolific interventional cardiologists in Asia, having performed over 50,000 angiograms and 20,000 angioplasties.'
  },
  {
    id: 'doc-6',
    name: 'Dr. Sunita Rao',
    title: 'Dr.',
    specialization: 'Neurology',
    subSpecialization: 'Cognitive Neurology & Dementia Care',
    qualifications: [
      { degree: 'MBBS', institute: 'King Edward Memorial (KEM) Hospital, Mumbai', year: 2001 },
      { degree: 'MD (Internal Medicine)', institute: 'Grant Medical College, Mumbai', year: 2005 },
      { degree: 'DM (Neurology)', institute: 'NIMHANS, Bengaluru', year: 2009 }
    ],
    hospital: 'Lilavati Hospital & Research Centre',
    hospitalDepartment: 'Department of Neurosciences',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    experienceYears: 21,
    areasOfExpertise: [
      'Alzheimer Disease Biomarkers',
      'Frontotemporal Dementia Diagnosis',
      'Vascular Cognitive Impairment',
      'Cognitive Rehabilitation Therapy',
      'Neuropsychiatric Disorders'
    ],
    publications: [
      {
        title: 'Plasma phosphorylated tau217 as an accessible diagnostic marker for early Alzheimer pathology',
        journal: 'Lancet Neurology',
        year: 2023,
        pmid: '37910214'
      }
    ],
    memberships: [
      'Indian Academy of Neurology',
      'Alzheimer and Related Disorders Society of India (ARDSI)',
      'World Federation of Neurology'
    ],
    languages: ['English', 'Hindi', 'Marathi', 'Kannada'],
    publicProfiles: [
      { platform: 'Lilavati Hospital Staff Directory', url: 'https://lilavatihospital.com/doctors/neurology/sunita-rao' }
    ],
    verificationStatus: 'conflicting',
    trustTier: 1,
    primarySourceUrl: 'https://lilavatihospital.com/doctors/neurology/sunita-rao',
    primarySourceTitle: 'Lilavati Hospital & Research Centre Directory',
    dateCollected: '2026-09-01',
    lastVerifiedDate: '2026-09-01',
    confidenceScore: 82,
    conflicts: [INITIAL_CONFLICTS[1]],
    bio: 'Neurologist with specialized fellowship in neurodegenerative disorders and cognitive impairment. Currently subject to location verification review.'
  },
  {
    id: 'doc-7',
    name: 'Dr. Randeep Guleria',
    title: 'Dr.',
    specialization: 'Pulmonology',
    subSpecialization: 'Critical Care Pulmonology & Interstitial Lung Diseases',
    qualifications: [
      { degree: 'MBBS', institute: 'Indira Gandhi Medical College, Shimla', year: 1982 },
      { degree: 'MD (General Medicine)', institute: 'PGIMER, Chandigarh', year: 1986 },
      { degree: 'DM (Pulmonary Medicine)', institute: 'PGIMER, Chandigarh', year: 1990 }
    ],
    hospital: 'Medanta - The Medicity (Former Director, AIIMS New Delhi)',
    hospitalDepartment: 'Institute of Chest Surgery & Respiratory Medicine',
    city: 'Gurugram',
    state: 'Haryana',
    country: 'India',
    experienceYears: 38,
    areasOfExpertise: [
      'Severe Asthma and COPD Phenotyping',
      'Idiopathic Pulmonary Fibrosis (IPF)',
      'Post-Viral Pulmonary Rehabilitation',
      'Sleep Apnea Diagnostics',
      'Extracorporeal Membrane Oxygenation (ECMO)'
    ],
    publications: [
      {
        title: 'Clinical characteristics and outcomes of severe respiratory distress in tertiary intensive care',
        journal: 'New England Journal of Medicine (NEJM)',
        year: 2021,
        pmid: '33522108'
      },
      {
        title: 'Ambient air pollution and chronic respiratory disease exacerbations in urban centers',
        journal: 'The Lancet Respiratory Medicine',
        year: 2023,
        pmid: '37219904'
      }
    ],
    memberships: [
      'National Academy of Medical Sciences',
      'American Thoracic Society (ATS)',
      'European Respiratory Society (ERS)'
    ],
    languages: ['English', 'Hindi'],
    publicProfiles: [
      { platform: 'Medanta Faculty Portal', url: 'https://medanta.org/doctors/dr-randeep-guleria' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://medanta.org/doctors/dr-randeep-guleria',
    primarySourceTitle: 'Medanta Institute of Chest Surgery & Respiratory Medicine',
    dateCollected: '2026-09-04',
    lastVerifiedDate: '2026-09-21',
    confidenceScore: 99,
    bio: 'Eminent pulmonologist and former Director of AIIMS New Delhi, recognized for leadership during national respiratory epidemics and lung clinical protocols.'
  },
  {
    id: 'doc-8',
    name: 'Dr. Priya Sharma',
    title: 'Dr.',
    specialization: 'Pediatrics',
    subSpecialization: 'Pediatric Endocrinology & Juvenile Diabetes',
    qualifications: [
      { degree: 'MBBS', institute: 'Grant Medical College, Mumbai', year: 2011 },
      { degree: 'MD (Pediatrics)', institute: 'Seth GS Medical College & KEM Hospital, Mumbai', year: 2015 },
      { degree: 'Fellowship (Pediatric Endocrinology)', institute: 'Great Ormond Street Hospital, London, UK', year: 2019 }
    ],
    hospital: 'Apollo Hospitals, Navi Mumbai',
    hospitalDepartment: 'Department of Child Health & Endocrinology',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    experienceYears: 13,
    areasOfExpertise: [
      'Type 1 Diabetes Mellitus in Children',
      'Continuous Glucose Monitoring & Insulin Pumps',
      'Growth Hormone Deficiency',
      'Childhood Thyroid Disorders',
      'Precocious Puberty Management'
    ],
    publications: [
      {
        title: 'Hybrid closed-loop insulin delivery in toddlers and school-age children with Type 1 Diabetes',
        journal: 'Pediatric Diabetes (ISPAD)',
        year: 2024,
        pmid: '38192019'
      }
    ],
    memberships: [
      'Indian Academy of Pediatrics (IAP)',
      'International Society for Pediatric and Adolescent Diabetes (ISPAD)',
      'Endocrine Society of India'
    ],
    languages: ['English', 'Hindi', 'Marathi'],
    publicProfiles: [
      { platform: 'Apollo Hospitals Portal', url: 'https://apollohospitals.com/doctors/priya-sharma' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://apollohospitals.com/doctors/priya-sharma',
    primarySourceTitle: 'Apollo Hospitals Clinical Specialist Register',
    dateCollected: '2026-09-14',
    lastVerifiedDate: '2026-09-23',
    confidenceScore: 97,
    bio: 'Pediatric endocrinologist leading automated insulin delivery programs and adolescent hormonal wellness clinics in Mumbai.'
  },
  {
    id: 'doc-9',
    name: 'Dr. Anand Mehta',
    title: 'Dr.',
    specialization: 'Orthopedics',
    subSpecialization: 'Joint Replacement & Robotic Knee Arthroplasty',
    qualifications: [
      { degree: 'MBBS', institute: 'B.J. Medical College, Ahmedabad', year: 2006 },
      { degree: 'MS (Orthopedics)', institute: 'B.J. Medical College, Ahmedabad', year: 2010 },
      { degree: 'Fellowship (Adult Joint Reconstruction)', institute: 'Singapore General Hospital', year: 2013 }
    ],
    hospital: 'Apollo Hospitals, Ahmedabad',
    hospitalDepartment: 'Institute of Orthopedics & Joint Reconstruction',
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    experienceYears: 17,
    areasOfExpertise: [
      'Robotic-Assisted Total Knee Arthroplasty',
      'Minimally Invasive Hip Replacement',
      'Revision Joint Reconstruction',
      'Arthroscopic Meniscal Repair',
      'Sports Injury Management'
    ],
    publications: [
      {
        title: 'Component positioning accuracy and functional recovery in robotic vs conventional total knee replacement',
        journal: 'Journal of Arthroplasty',
        year: 2022,
        pmid: '36012480'
      }
    ],
    memberships: [
      'Indian Orthopaedic Association (IOA)',
      'Indian Society of Hip and Knee Surgeons (ISHKS)',
      'American Association of Orthopaedic Surgeons (AAOS)'
    ],
    languages: ['English', 'Gujarati', 'Hindi'],
    publicProfiles: [
      { platform: 'Apollo Hospitals Ahmedabad', url: 'https://apollohospitals.com/ahmedabad/doctors/anand-mehta' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://apollohospitals.com/ahmedabad/doctors/anand-mehta',
    primarySourceTitle: 'Apollo Hospitals Western Regional Directory',
    dateCollected: '2026-09-11',
    lastVerifiedDate: '2026-09-22',
    confidenceScore: 96,
    bio: 'Orthopedic surgeon specializing in robotic joint replacement surgery with over 4,000 successful reconstructive procedures.'
  },
  {
    id: 'doc-10',
    name: 'Dr. Farhan Qureshi',
    title: 'Dr.',
    specialization: 'Gastroenterology',
    subSpecialization: 'Advanced Therapeutic Endoscopy & Hepatology',
    qualifications: [
      { degree: 'MBBS', institute: 'Osmania Medical College, Hyderabad', year: 2008 },
      { degree: 'MD (General Medicine)', institute: 'Nizam Institute of Medical Sciences (NIMS), Hyderabad', year: 2012 },
      { degree: 'DM (Medical Gastroenterology)', institute: 'Christian Medical College (CMC), Vellore', year: 2016 }
    ],
    hospital: 'Asian Institute of Gastroenterology (AIG Hospitals)',
    hospitalDepartment: 'Department of Therapeutic Endoscopy & Liver Care',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    experienceYears: 15,
    areasOfExpertise: [
      'Endoscopic Retrograde Cholangiopancreatography (ERCP)',
      'Endoscopic Ultrasound (EUS) Guided Interventions',
      'Non-Alcoholic Fatty Liver Disease (MASLD)',
      'Third Space Endoscopy (POEM for Achalasia)',
      'Inflammatory Bowel Disease (IBD)'
    ],
    publications: [
      {
        title: 'Diagnostic yield and safety of endoscopic ultrasound-guided fine-needle biopsy in solid pancreatic lesions',
        journal: 'Gastrointestinal Endoscopy (GIE)',
        year: 2023,
        pmid: '37119022'
      }
    ],
    memberships: [
      'Indian Society of Gastroenterology (ISG)',
      'American Society for Gastrointestinal Endoscopy (ASGE)',
      'European Society of Gastrointestinal Endoscopy (ESGE)'
    ],
    languages: ['English', 'Telugu', 'Urdu', 'Hindi'],
    publicProfiles: [
      { platform: 'AIG Hospitals Directory', url: 'https://aighospitals.com/doctors/dr-farhan-qureshi' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://aighospitals.com/doctors/dr-farhan-qureshi',
    primarySourceTitle: 'AIG Hospitals Institutional Faculty Directory',
    dateCollected: '2026-09-17',
    lastVerifiedDate: '2026-09-24',
    confidenceScore: 97,
    bio: 'Gastroenterologist skilled in complex luminal and bilio-pancreatic interventions and fatty liver therapeutics.'
  },
  {
    id: 'doc-11',
    name: 'Dr. Sanjiv Saxena',
    title: 'Dr.',
    specialization: 'Nephrology',
    subSpecialization: 'Renal Transplantation & Glomerulonephritis',
    qualifications: [
      { degree: 'MBBS', institute: 'Maulana Azad Medical College, New Delhi', year: 1982 },
      { degree: 'MD (Internal Medicine)', institute: 'MAMC & LNJP Hospital, Delhi', year: 1986 },
      { degree: 'DM (Nephrology)', institute: 'All India Institute of Medical Sciences (AIIMS), New Delhi', year: 1990 }
    ],
    hospital: 'Pushpawati Singhania Hospital & Research Institute (PSRI)',
    hospitalDepartment: 'Renal Sciences & Kidney Transplant Institute',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    experienceYears: 36,
    areasOfExpertise: [
      'Living-Donor Kidney Transplantation',
      'ABO-Incompatible Renal Transplant',
      'Diabetic Nephropathy & CKD Staging',
      'Glomerular Diseases & Lupus Nephritis',
      'Hemodialysis & Peritoneal Dialysis'
    ],
    publications: [
      {
        title: 'Long-term graft survival in ABO-incompatible living donor kidney transplants in North India',
        journal: 'Kidney International Reports',
        year: 2022,
        pmid: '35619844',
        doi: '10.1016/j.ekir.2022.03.011'
      },
      {
        title: 'SGLT2 inhibitors and kidney protection in proteinuric non-diabetic chronic kidney disease',
        journal: 'American Journal of Kidney Diseases (AJKD)',
        year: 2024,
        pmid: '38190211'
      }
    ],
    memberships: [
      'International Society of Nephrology (ISN)',
      'Indian Society of Nephrology (ISN-India)',
      'American Society of Nephrology (ASN)'
    ],
    languages: ['English', 'Hindi'],
    publicProfiles: [
      { platform: 'PSRI Hospital Faculty', url: 'https://psrihospital.com/doctors/dr-sanjiv-saxena' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://psrihospital.com/doctors/dr-sanjiv-saxena',
    primarySourceTitle: 'PSRI Renal Sciences Board Faculty Registry',
    dateCollected: '2026-09-10',
    lastVerifiedDate: '2026-09-24',
    confidenceScore: 98,
    bio: 'Renowned nephrologist who has overseen more than 2,000 kidney transplants and led national clinical practice guidelines on lupus nephritis and dialysis vascular access.'
  },
  {
    id: 'doc-12',
    name: 'Dr. Namrata Sharma',
    title: 'Dr.',
    specialization: 'Ophthalmology',
    subSpecialization: 'Cornea, Cataract & Refractive Laser Surgery',
    qualifications: [
      { degree: 'MBBS', institute: 'Delhi University', year: 1989 },
      { degree: 'MD (Ophthalmology)', institute: 'Dr. R.P. Centre for Ophthalmic Sciences, AIIMS, New Delhi', year: 1993 },
      { degree: 'DNB (Ophthalmology)', institute: 'National Board of Examinations', year: 1994 }
    ],
    hospital: 'Dr. Rajendra Prasad Centre for Ophthalmic Sciences, AIIMS',
    hospitalDepartment: 'Cornea, Cataract & Refractive Surgery Services',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    experienceYears: 32,
    areasOfExpertise: [
      'Lamellar Keratoplasty (DMEK / DSEK / DALK)',
      'Femtosecond Laser Cataract Surgery (FLACS)',
      'Corneal Cross-Linking (CXL) for Keratoconus',
      'Refractive Surgery (SMILE / LASIK / ICL)',
      'Ocular Surface Reconstruction & Amniotic Membrane Grafts'
    ],
    publications: [
      {
        title: 'Descemet membrane endothelial keratoplasty (DMEK) versus ultrathin DSAEK: 5-year randomized clinical trial',
        journal: 'Ophthalmology (AAO)',
        year: 2023,
        pmid: '37220199',
        doi: '10.1016/j.ophtha.2023.04.019'
      }
    ],
    memberships: [
      'All India Ophthalmological Society (AIOS, Past President)',
      'Cornea Society (USA)',
      'European Society of Cataract and Refractive Surgeons (ESCRS)'
    ],
    languages: ['English', 'Hindi'],
    publicProfiles: [
      { platform: 'AIIMS RPC Faculty', url: 'https://aiims.edu/directory/dr-namrata-sharma' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://aiims.edu/directory/dr-namrata-sharma',
    primarySourceTitle: 'AIIMS Ophthalmic Sciences Official Registry',
    dateCollected: '2026-09-12',
    lastVerifiedDate: '2026-09-25',
    confidenceScore: 99,
    bio: 'Professor of Ophthalmology at AIIMS, leading international researcher in corneal transplantation techniques and ocular surface reconstruction.'
  },
  {
    id: 'doc-13',
    name: 'Dr. Ambrish Mithal',
    title: 'Dr.',
    specialization: 'Endocrinology',
    subSpecialization: 'Type 2 Diabetes, Metabolic Disorders & Osteoporosis',
    qualifications: [
      { degree: 'MBBS', institute: 'King George Medical College, Lucknow', year: 1980 },
      { degree: 'MD (Internal Medicine)', institute: 'KGMC, Lucknow', year: 1984 },
      { degree: 'DM (Endocrinology)', institute: 'All India Institute of Medical Sciences (AIIMS), New Delhi', year: 1987 }
    ],
    hospital: 'Max Super Speciality Hospital, Saket',
    hospitalDepartment: 'Chairman, Endocrinology & Diabetes Division',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    experienceYears: 39,
    areasOfExpertise: [
      'Type 2 Diabetes Personalized Glycemic Control',
      'GLP-1 Receptor Agonists & SGLT2 Inhibitor Therapeutics',
      'Metabolic Bone Disease & Osteoporosis Management',
      'Thyroid Nodules & Radioiodine Therapy Coordination',
      'Polycystic Ovary Syndrome (PCOS) Endocrine Management'
    ],
    publications: [
      {
        title: 'Global epidemiology of Vitamin D deficiency and skeletal fragility: Clinical recommendations',
        journal: 'The Lancet Diabetes & Endocrinology',
        year: 2021,
        pmid: '34022194'
      },
      {
        title: 'Cardiovascular outcomes of dual incretin receptor agonists in South Asian diabetics',
        journal: 'Diabetes Care',
        year: 2023,
        doi: '10.2337/dc23-0891'
      }
    ],
    memberships: [
      'Endocrine Society of India (Past President)',
      'American Association of Clinical Endocrinology (AACE)',
      'International Osteoporosis Foundation (IOF Trustee)'
    ],
    languages: ['English', 'Hindi', 'Urdu'],
    publicProfiles: [
      { platform: 'Max Healthcare Directory', url: 'https://maxhealthcare.in/doctors/dr-ambrish-mithal' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://maxhealthcare.in/doctors/dr-ambrish-mithal',
    primarySourceTitle: 'Max Healthcare Specialist Register',
    dateCollected: '2026-09-15',
    lastVerifiedDate: '2026-09-24',
    confidenceScore: 99,
    bio: 'Pioneering Indian endocrinologist decorated with the Padma Bhushan, who established the first DM Endocrinology course in North India at SGPGIMS Lucknow.'
  },
  {
    id: 'doc-14',
    name: 'Dr. Pratima Murthy',
    title: 'Dr.',
    specialization: 'Psychiatry',
    subSpecialization: 'Neuropsychiatry, Addiction Medicine & Mood Disorders',
    qualifications: [
      { degree: 'MBBS', institute: 'Bangalore Medical College', year: 1985 },
      { degree: 'MD (Psychiatry)', institute: 'NIMHANS, Bengaluru', year: 1989 },
      { degree: 'FRCPsych', institute: 'Royal College of Psychiatrists, UK', year: 2012 }
    ],
    hospital: 'National Institute of Mental Health & Neuro Sciences (NIMHANS)',
    hospitalDepartment: 'Department of Psychiatry & Centre for Addiction Medicine',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    experienceYears: 36,
    areasOfExpertise: [
      'Treatment-Resistant Major Depressive Disorder',
      'Dual Diagnosis & Addiction Neurobiology',
      'Bipolar Affective Disorder Long-term Stabilization',
      'Perinatal Psychiatric Care',
      'Cognitive Behavioral Psychopharmacology'
    ],
    publications: [
      {
        title: 'Integrated clinical interventions for substance use and co-occurring severe mental illness',
        journal: 'World Psychiatry (WPA)',
        year: 2022,
        pmid: '35129901'
      }
    ],
    memberships: [
      'Indian Psychiatric Society (IPS)',
      'World Psychiatric Association (WPA)',
      'International Society of Addiction Medicine'
    ],
    languages: ['English', 'Kannada', 'Hindi'],
    publicProfiles: [
      { platform: 'NIMHANS Faculty Portal', url: 'https://nimhans.ac.in/faculty/dr-pratima-murthy' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://nimhans.ac.in/faculty/dr-pratima-murthy',
    primarySourceTitle: 'NIMHANS Official Directorate Directory',
    dateCollected: '2026-09-14',
    lastVerifiedDate: '2026-09-23',
    confidenceScore: 99,
    bio: 'Director and Senior Professor of Psychiatry at NIMHANS, international consultant to the WHO and United Nations Office on Drugs and Crime.'
  },
  {
    id: 'doc-15',
    name: 'Dr. Rohini Handa',
    title: 'Dr.',
    specialization: 'Rheumatology',
    subSpecialization: 'Systemic Autoimmune Rheumatic Diseases & Vasculitis',
    qualifications: [
      { degree: 'MBBS', institute: 'Punjab University, Rohtak', year: 1981 },
      { degree: 'MD (General Medicine)', institute: 'AIIMS, New Delhi', year: 1985 },
      { degree: 'MNAMS (Rheumatology)', institute: 'National Academy of Medical Sciences', year: 1989 },
      { degree: 'FRCP', institute: 'Royal College of Physicians of Glasgow', year: 2004 }
    ],
    hospital: 'Indraprastha Apollo Hospitals',
    hospitalDepartment: 'Senior Consultant Rheumatologist',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    experienceYears: 40,
    areasOfExpertise: [
      'Systemic Lupus Erythematosus (SLE)',
      'Rheumatoid Arthritis Biologic Therapies',
      'Sjögren Syndrome & Systemic Sclerosis (Scleroderma)',
      'Ankylosing Spondylitis (Axial Spondyloarthritis)',
      'Systemic Necrotizing Vasculitis (GPA / MPA)'
    ],
    publications: [
      {
        title: 'JAK inhibitors versus TNF inhibitors in active rheumatoid arthritis: Real-world registries',
        journal: 'Annals of the Rheumatic Diseases (ARD)',
        year: 2023,
        pmid: '37190822',
        doi: '10.1136/ard-2023-224102'
      }
    ],
    memberships: [
      'Indian Rheumatology Association (IRA, Past President)',
      'Asia Pacific League of Associations for Rheumatology (APLAR)',
      'American College of Rheumatology (ACR)'
    ],
    languages: ['English', 'Hindi', 'Punjabi'],
    publicProfiles: [
      { platform: 'Apollo Hospitals Delhi', url: 'https://apollohospitals.com/delhi/doctors/dr-rohini-handa' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://apollohospitals.com/delhi/doctors/dr-rohini-handa',
    primarySourceTitle: 'Indraprastha Apollo Hospitals Specialist Directory',
    dateCollected: '2026-09-18',
    lastVerifiedDate: '2026-09-25',
    confidenceScore: 98,
    bio: 'Former Professor of Medicine & Rheumatology at AIIMS New Delhi for over two decades; leading authority on targeted biologics and lupus nephritis in South Asia.'
  },
  {
    id: 'doc-16',
    name: 'Dr. Sudhir Rawal',
    title: 'Dr.',
    specialization: 'Urology',
    subSpecialization: 'Uro-Oncology & Robotic Pelvic Surgery',
    qualifications: [
      { degree: 'MBBS', institute: 'King George Medical College, Lucknow', year: 1984 },
      { degree: 'MS (General Surgery)', institute: 'KGMC, Lucknow', year: 1988 },
      { degree: 'MCh (Urology)', institute: 'Christian Medical College (CMC), Vellore', year: 1992 },
      { degree: 'Fellowship (Robotic Uro-Oncology)', institute: 'Memorial Sloan Kettering Cancer Center, New York, USA', year: 1996 }
    ],
    hospital: 'Rajiv Gandhi Cancer Institute and Research Centre (RGCI)',
    hospitalDepartment: 'Medical Director & Chief of Genito-Urinary Oncology',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    experienceYears: 34,
    areasOfExpertise: [
      'Robotic Radical Prostatectomy (RRP) with Nerve Sparing',
      'Robotic Partial Nephrectomy for Renal Cell Carcinoma',
      'Radical Cystectomy with Neobladder Reconstruction',
      'Testicular Germ Cell Tumor Retroperitoneal Dissection',
      'Advanced Pelvic Laparoscopy'
    ],
    publications: [
      {
        title: 'Robotic-assisted versus open radical cystectomy with intracorporeal urinary diversion: 10-year surgical outcomes',
        journal: 'European Urology',
        year: 2022,
        pmid: '35821033',
        doi: '10.1016/j.eururo.2022.06.014'
      }
    ],
    memberships: [
      'Urological Society of India (USI)',
      'American Urological Association (AUA)',
      'Société Internationale d’Urologie (SIU)'
    ],
    languages: ['English', 'Hindi'],
    publicProfiles: [
      { platform: 'RGCI Medical Board', url: 'https://rgcirc.org/doctors/dr-sudhir-rawal' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://rgcirc.org/doctors/dr-sudhir-rawal',
    primarySourceTitle: 'RGCI Institutional Cancer Specialist Roster',
    dateCollected: '2026-09-17',
    lastVerifiedDate: '2026-09-24',
    confidenceScore: 98,
    bio: 'One of India’s most experienced robotic uro-surgeons, having completed over 5,000 robotic prostatectomies and radical cystectomies.'
  },
  ...ADDITIONAL_DOCTORS
];

export const INITIAL_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'doc-source-1',
    title: 'Tata Memorial Hospital Official Oncology Faculty Dossier 2026',
    type: 'pdf',
    sourceUrl: 'https://tmc.gov.in/faculty/oncology',
    tier: 1,
    uploadDate: '2026-09-15T08:00:00Z',
    status: 'processed',
    chunkCount: 8,
    piiRedactedCount: 0,
    extractedDoctors: ['Dr. Suresh Advani'],
    rawContent: 'Official institutional register of Medical Oncology faculty at Tata Memorial Centre, Mumbai. Contains verified faculty appointments, medical license certifications, peer-reviewed clinical trial indices, and bone marrow transplantation fellowship credentials.',
    sizeBytes: 245000,
  },
  {
    id: 'doc-source-2',
    title: 'All India Institute of Medical Sciences - Cardiology & Neurosciences Roster',
    type: 'pdf',
    sourceUrl: 'https://aiims.edu/directory/cardiology',
    tier: 1,
    uploadDate: '2026-09-18T10:30:00Z',
    status: 'processed',
    chunkCount: 12,
    piiRedactedCount: 0,
    extractedDoctors: ['Dr. Rajesh Verma', 'Dr. Randeep Guleria', 'Dr. Ashok Seth'],
    rawContent: 'Government published roster containing DM and MCh postgraduate medical credentials, official tenure records, AIIMS faculty clinical postings, and national medical council registration IDs.',
    sizeBytes: 412000,
  },
  {
    id: 'doc-source-3',
    title: 'The Lancet & PubMed Peer-Reviewed Author Indices 2021-2024',
    type: 'json',
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/?term=author',
    tier: 3,
    uploadDate: '2026-09-22T11:00:00Z',
    status: 'processed',
    chunkCount: 15,
    piiRedactedCount: 0,
    extractedDoctors: ['Dr. Devi Prasad Shetty', 'Dr. Naresh Trehan', 'Dr. Sunita Rao', 'Dr. Priya Sharma'],
    rawContent: 'Academic publication metadata including DOI links, PubMed PMIDs, randomized control trial designs, co-authorships, and institutional affiliations indexed directly from the National Library of Medicine.',
    sizeBytes: 189000,
  },
  {
    id: 'doc-source-4',
    title: 'Community Hospital Patient Review Submissions (Batch 8)',
    type: 'csv',
    sourceUrl: 'https://medrag.internal/submissions/community-upload',
    tier: 5,
    uploadDate: '2026-09-25T18:00:00Z',
    status: 'conflicting',
    chunkCount: 5,
    piiRedactedCount: 3,
    extractedDoctors: ['Dr. Rajesh Verma', 'Dr. Sunita Rao'],
    rawContent: 'Crowdsourced clinic reviews and doctor profile submissions. Contains unverified clinic address updates and experience claims. 3 patient phone numbers and emails automatically masked during ingestion.',
    sizeBytes: 52000,
  },
  {
    id: 'doc-guideline-cardio',
    title: 'ACC/AHA & ESC Clinical Practice Guidelines: Acute Coronary Syndrome & Hypertension',
    type: 'pdf',
    sourceUrl: 'https://acc.org/guidelines/acs-hypertension-2026',
    tier: 2,
    uploadDate: '2026-09-20T09:00:00Z',
    status: 'processed',
    chunkCount: 4,
    piiRedactedCount: 0,
    extractedDoctors: ['Dr. Ashok Seth', 'Dr. Devi Prasad Shetty', 'Dr. Naresh Trehan'],
    rawContent: 'Evidence-based clinical guidelines on acute chest pain triage, STEMI vs NSTEMI emergency protocols, antiplatelet therapy, and guideline-directed hypertension control.',
    sizeBytes: 310000,
  },
  {
    id: 'doc-guideline-neuro',
    title: 'AHA/ASA & AAN Guidelines for the Early Management of Acute Ischemic Stroke',
    type: 'pdf',
    sourceUrl: 'https://stroke.ahajournals.org/guidelines/acute-ischemic-stroke',
    tier: 2,
    uploadDate: '2026-09-21T10:00:00Z',
    status: 'processed',
    chunkCount: 4,
    piiRedactedCount: 0,
    extractedDoctors: ['Dr. Rajesh Verma', 'Dr. Sunita Rao'],
    rawContent: 'Clinical recommendations for intravenous thrombolysis within 4.5 hours of stroke symptom onset, endovascular mechanical thrombectomy windows up to 24 hours, and secondary stroke prevention.',
    sizeBytes: 285000,
  },
  {
    id: 'doc-guideline-endo',
    title: 'American Diabetes Association (ADA) Standards of Medical Care in Diabetes 2026',
    type: 'pdf',
    sourceUrl: 'https://diabetesjournals.org/care/standards-of-care-2026',
    tier: 2,
    uploadDate: '2026-09-22T12:00:00Z',
    status: 'processed',
    chunkCount: 4,
    piiRedactedCount: 0,
    extractedDoctors: ['Dr. Ambrish Mithal', 'Dr. Priya Sharma'],
    rawContent: 'Standards of care for diabetes mellitus: diagnostic criteria (FPG, OGTT, HbA1c), automated insulin delivery pumps, SGLT2 inhibitors and GLP-1 receptor agonists for cardiovascular-renal organ protection, and diabetic ketoacidosis (DKA) emergency management.',
    sizeBytes: 340000,
  },
  {
    id: 'doc-guideline-onco',
    title: 'NCCN Clinical Practice Guidelines in Oncology: Immuno-Oncology & Tumor Staging',
    type: 'pdf',
    sourceUrl: 'https://nccn.org/guidelines/immunotherapy-principles',
    tier: 2,
    uploadDate: '2026-09-23T14:00:00Z',
    status: 'processed',
    chunkCount: 4,
    piiRedactedCount: 0,
    extractedDoctors: ['Dr. Suresh Advani', 'Dr. Sudhir Rawal'],
    rawContent: 'Principles of cancer staging (TNM), immune checkpoint inhibitor mechanics (anti-PD-1, anti-CTLA-4), cellular therapies including CAR-T cells, and allogeneic bone marrow transplantation.',
    sizeBytes: 395000,
  },
  {
    id: 'doc-guideline-nephro',
    title: 'KDIGO Clinical Practice Guidelines: Chronic Kidney Disease Staging & Dialysis Protocols',
    type: 'pdf',
    sourceUrl: 'https://kdigo.org/guidelines/ckd-evaluation-management',
    tier: 2,
    uploadDate: '2026-09-24T08:30:00Z',
    status: 'processed',
    chunkCount: 4,
    piiRedactedCount: 0,
    extractedDoctors: ['Dr. Sanjiv Saxena'],
    rawContent: 'Kidney Disease Improving Global Outcomes clinical criteria for CKD staging (G1-G5 based on eGFR and albuminuria A1-A3), nephroprotective therapy (RAS blockade, SGLT2i), and urgent hemodialysis indications.',
    sizeBytes: 290000,
  },
  {
    id: 'doc-guideline-pulmo',
    title: 'GOLD Strategy for COPD & GINA Global Strategy for Asthma Management 2026',
    type: 'pdf',
    sourceUrl: 'https://goldcopd.org/guidelines-2026',
    tier: 2,
    uploadDate: '2026-09-24T11:00:00Z',
    status: 'processed',
    chunkCount: 4,
    piiRedactedCount: 0,
    extractedDoctors: ['Dr. Randeep Guleria'],
    rawContent: 'Comprehensive diagnosis and stepwise pharmacotherapy for bronchial asthma and COPD, distinguishing reversible bronchospasm from chronic airway remodeling and acute respiratory failure emergency criteria.',
    sizeBytes: 305000,
  },
  ...ADDITIONAL_DOCUMENTS
];

export const INITIAL_CHUNKS: DocumentChunk[] = [
  {
    id: 'chunk-1',
    documentId: 'doc-source-1',
    text: 'Dr. Suresh Advani is listed as Senior Consultant in Medical Oncology and Hematology at Tata Memorial Hospital and Jaslok Hospital, Mumbai. Qualifications: MBBS (1969), MD General Medicine (1973) Grant Medical College Mumbai, and Bone Marrow Transplant Fellowship at Fred Hutchinson Cancer Research Center Seattle (1982). Experience: 48 years. Pioneered bone marrow transplantation in India.',
    metadata: {
      doctorId: 'doc-3',
      doctorName: 'Dr. Suresh Advani',
      specialization: 'Oncology',
      hospital: 'Tata Memorial Hospital & Jaslok Hospital',
      city: 'Mumbai',
      sourceUrl: 'https://tmc.gov.in/faculty/oncology',
      sourceTitle: 'Tata Memorial Centre Official Faculty Registry',
      tier: 1,
      verificationStatus: 'verified',
      chunkIndex: 0,
      parentDocTitle: 'Tata Memorial Hospital Official Oncology Faculty Dossier 2026'
    }
  },
  {
    id: 'chunk-2',
    documentId: 'doc-source-2',
    text: 'Dr. Devi Prasad Shetty is Chairman and Senior Cardiac Surgeon at Narayana Health City, Bengaluru. Specializes in Cardiothoracic Surgery, pediatric cardiac surgery, and neonatal complex congenital heart repair. Qualifications: MBBS (1979) and MS General Surgery (1982) Kasturba Medical College, FRCS from Royal College of Surgeons of England (1989). Experience: 42 years with over 15,000 heart surgeries.',
    metadata: {
      doctorId: 'doc-1',
      doctorName: 'Dr. Devi Prasad Shetty',
      specialization: 'Cardiology',
      hospital: 'Narayana Health City',
      city: 'Bengaluru',
      sourceUrl: 'https://narayanahealth.org/doctors/dr-devi-shetty',
      sourceTitle: 'Narayana Health Institutional Faculty Registry',
      tier: 1,
      verificationStatus: 'verified',
      chunkIndex: 1,
      parentDocTitle: 'Narayana Health Official Register'
    }
  },
  {
    id: 'chunk-3',
    documentId: 'doc-source-2',
    text: 'Dr. Naresh Trehan is Chairman and Chief Cardiac Surgeon at Medanta - The Medicity, Gurugram. Specializes in robotic heart surgery, total arterial revascularization, and TAVR. Qualifications: MBBS KGMC Lucknow (1968), Diplomate American Board of Surgery (1977), Diplomate American Board of Cardiothoracic Surgery (1979). Experience: 52 years.',
    metadata: {
      doctorId: 'doc-2',
      doctorName: 'Dr. Naresh Trehan',
      specialization: 'Cardiology',
      hospital: 'Medanta - The Medicity',
      city: 'Gurugram',
      sourceUrl: 'https://medanta.org/doctors/dr-naresh-trehan',
      sourceTitle: 'Medanta Institutional Medical Directory',
      tier: 1,
      verificationStatus: 'verified',
      chunkIndex: 2,
      parentDocTitle: 'Medanta Official Registry'
    }
  },
  {
    id: 'chunk-4',
    documentId: 'doc-source-2',
    text: 'Dr. Ashok Seth is Chairman of Interventional Cardiology at Fortis Escorts Heart Institute, New Delhi. Specializes in complex coronary angioplasty (PTCA), bioresorbable scaffolds, and TAVI. Qualifications: MBBS AMU (1979), MRCP UK (1984), FRCP London (1995), FACC USA (2002). Experience: 40 years, over 50,000 angiograms performed.',
    metadata: {
      doctorId: 'doc-5',
      doctorName: 'Dr. Ashok Seth',
      specialization: 'Cardiology',
      hospital: 'Fortis Escorts Heart Institute',
      city: 'New Delhi',
      sourceUrl: 'https://fortisescorts.com/doctors/dr-ashok-seth',
      sourceTitle: 'Fortis Escorts Heart Institute Medical Board Registry',
      tier: 1,
      verificationStatus: 'verified',
      chunkIndex: 3,
      parentDocTitle: 'Fortis Escorts Register'
    }
  },
  {
    id: 'chunk-5',
    documentId: 'doc-source-2',
    text: 'Dr. Rajesh Verma is Senior Consultant in Neurology at Fortis Memorial Research Institute, Gurugram. Specializes in acute stroke thrombolysis, Deep Brain Stimulation (DBS) for Parkinson Disease, and epilepsy. Official Fortis Medical Board records show 18 years of clinical experience. Qualifications: MBBS MAMC (2004), MD Medicine Lady Hardinge (2008), DM Neurology AIIMS New Delhi (2012).',
    metadata: {
      doctorId: 'doc-4',
      doctorName: 'Dr. Rajesh Verma',
      specialization: 'Neurology',
      hospital: 'Fortis Memorial Research Institute',
      city: 'Gurugram',
      sourceUrl: 'https://fortishealthcare.com/doctors/dr-rajesh-verma',
      sourceTitle: 'Fortis Healthcare Verified Roster (Tier 1)',
      tier: 1,
      verificationStatus: 'conflicting',
      chunkIndex: 4,
      parentDocTitle: 'Fortis Hospital Directory'
    }
  },
  {
    id: 'chunk-6',
    documentId: 'doc-source-4',
    text: 'Web Directory profile for Dr. Rajesh Verma lists 14 years of professional experience as of 2025 at Max Healthcare and local clinic. Note: This contradicts the official Fortis 2026 hospital registry showing 18 years.',
    metadata: {
      doctorId: 'doc-4',
      doctorName: 'Dr. Rajesh Verma',
      specialization: 'Neurology',
      hospital: 'Max Healthcare / Local Clinic',
      city: 'Gurugram',
      sourceUrl: 'https://doctorpedia-profiles.net/dr/rajesh-verma',
      sourceTitle: 'DoctorPedia Public Directory (Tier 4)',
      tier: 4,
      verificationStatus: 'conflicting',
      chunkIndex: 5,
      parentDocTitle: 'DoctorPedia Public Web Mirror'
    }
  },
  {
    id: 'chunk-7',
    documentId: 'doc-source-1',
    text: 'Dr. Sunita Rao is Chief of Cognitive Neurology at Lilavati Hospital & Research Centre, Mumbai. Specializes in Alzheimer Disease biomarkers, frontotemporal dementia, and cognitive rehabilitation. Official hospital faculty records confirm Lilavati practice. Qualifications: MBBS KEM (2001), MD Medicine Grant Medical College (2005), DM Neurology NIMHANS (2009). Experience: 21 years.',
    metadata: {
      doctorId: 'doc-6',
      doctorName: 'Dr. Sunita Rao',
      specialization: 'Neurology',
      hospital: 'Lilavati Hospital & Research Centre',
      city: 'Mumbai',
      sourceUrl: 'https://lilavatihospital.com/doctors/neurology/sunita-rao',
      sourceTitle: 'Lilavati Hospital Staff Directory (Tier 1)',
      tier: 1,
      verificationStatus: 'conflicting',
      chunkIndex: 6,
      parentDocTitle: 'Lilavati Hospital Medical Register'
    }
  },
  {
    id: 'chunk-8',
    documentId: 'doc-source-4',
    text: 'Crowdsourced submission says Dr. Sunita Rao transferred her primary practice to Breach Candy Hospital, Mumbai. Official Lilavati portal still shows active senior tenure.',
    metadata: {
      doctorId: 'doc-6',
      doctorName: 'Dr. Sunita Rao',
      specialization: 'Neurology',
      hospital: 'Breach Candy Hospital (Unverified)',
      city: 'Mumbai',
      sourceUrl: 'https://medrag.internal/submissions/community-upload',
      sourceTitle: 'Community Patient Submissions (Tier 5)',
      tier: 5,
      verificationStatus: 'conflicting',
      chunkIndex: 7,
      parentDocTitle: 'Community Patient Submissions'
    }
  },
  {
    id: 'chunk-9',
    documentId: 'doc-source-2',
    text: 'Dr. Randeep Guleria is Chairman of the Institute of Chest Surgery & Respiratory Medicine at Medanta, Gurugram, and former Director of AIIMS New Delhi. Specializes in severe asthma, COPD phenotyping, idiopathic pulmonary fibrosis, and ECMO. Qualifications: MBBS (1982), MD (1986), DM Pulmonology PGIMER (1990). Experience: 38 years.',
    metadata: {
      doctorId: 'doc-7',
      doctorName: 'Dr. Randeep Guleria',
      specialization: 'Pulmonology',
      hospital: 'Medanta - The Medicity',
      city: 'Gurugram',
      sourceUrl: 'https://medanta.org/doctors/dr-randeep-guleria',
      sourceTitle: 'Medanta Institute Faculty Registry',
      tier: 1,
      verificationStatus: 'verified',
      chunkIndex: 8,
      parentDocTitle: 'Medanta Respiratory Medicine Registry'
    }
  },
  {
    id: 'chunk-10',
    documentId: 'doc-source-3',
    text: 'Dr. Priya Sharma is Consultant Pediatric Endocrinologist at Apollo Hospitals Navi Mumbai. Specializes in Type 1 Diabetes in children, insulin pumps, growth hormone deficiency, and precocious puberty. Qualifications: MBBS Grant Medical (2011), MD Pediatrics KEM Mumbai (2015), Fellowship Pediatric Endocrinology Great Ormond Street Hospital London (2019). Experience: 13 years.',
    metadata: {
      doctorId: 'doc-8',
      doctorName: 'Dr. Priya Sharma',
      specialization: 'Pediatrics',
      hospital: 'Apollo Hospitals, Navi Mumbai',
      city: 'Mumbai',
      sourceUrl: 'https://apollohospitals.com/doctors/priya-sharma',
      sourceTitle: 'Apollo Hospitals Specialist Register',
      tier: 1,
      verificationStatus: 'verified',
      chunkIndex: 9,
      parentDocTitle: 'Apollo Hospitals Pediatric Register'
    }
  },
  {
    id: 'chunk-guideline-cardio-1',
    documentId: 'doc-guideline-cardio',
    text: 'Acute Chest Pain Triage & Myocardial Infarction Red Flags: Chest pain described as heavy retrosternal pressure, squeezing, or fullness radiating to the left arm, shoulder, jaw, or epigastrium is a hallmark of acute coronary syndrome (ACS). Associated symptoms include diaphoresis, dyspnea, nausea, and lightheadedness. Immediate clinical management mandates emergency medical evaluation, 12-lead ECG within 10 minutes, high-sensitivity cardiac troponin assay, oxygen if SpO2 <90%, chewable non-enteric aspirin 162-325 mg, sublingual nitroglycerin unless contraindicated by right ventricular infarct or recent phosphodiesterase-5 inhibitor use, and urgent catheterization lab activation for primary percutaneous coronary intervention (PCI) within 90 minutes door-to-balloon time for STEMI.',
    metadata: {
      specialization: 'Cardiology',
      hospital: 'Accredited Cardiac Emergency Centers',
      sourceUrl: 'https://acc.org/guidelines/acs-hypertension-2026',
      sourceTitle: 'ACC/AHA Clinical Guidelines on Chest Pain & ACS',
      tier: 2,
      verificationStatus: 'verified',
      chunkIndex: 10,
      parentDocTitle: 'ACC/AHA & ESC Clinical Practice Guidelines: Acute Coronary Syndrome & Hypertension'
    }
  },
  {
    id: 'chunk-guideline-cardio-2',
    documentId: 'doc-guideline-cardio',
    text: 'Hypertension Clinical Classification and Pharmacological Management: Normal blood pressure is defined as systolic <120 mmHg and diastolic <80 mmHg. Elevated BP: 120-129 / <80 mmHg. Stage 1 Hypertension: 130-139 or 80-89 mmHg. Stage 2 Hypertension: >=140 or >=90 mmHg. Hypertensive Crisis: Systolic >180 and/or Diastolic >120 mmHg; if accompanied by acute organ damage (chest pain, shortness of breath, neurological deficits, acute kidney failure), this constitutes a Hypertensive Emergency requiring immediate ICU admission and IV antihypertensives (e.g. labetalol, nicardipine). First-line pharmacological treatment options include: ACE inhibitors (lisinopril, ramipril), Angiotensin Receptor Blockers (losartan, telmisartan), Dihydropyridine Calcium Channel Blockers (amlodipine), and Thiazide-like diuretics (chlorthalidone, indapamide).',
    metadata: {
      specialization: 'Cardiology',
      hospital: 'Cardiovascular Prevention Units',
      sourceUrl: 'https://acc.org/guidelines/acs-hypertension-2026',
      sourceTitle: 'AHA/ACC Hypertension Clinical Guidelines',
      tier: 2,
      verificationStatus: 'verified',
      chunkIndex: 11,
      parentDocTitle: 'ACC/AHA & ESC Clinical Practice Guidelines: Acute Coronary Syndrome & Hypertension'
    }
  },
  {
    id: 'chunk-guideline-neuro-1',
    documentId: 'doc-guideline-neuro',
    text: 'Acute Ischemic Stroke Protocol & BE-FAST Warning Signs: Early recognition of stroke uses BE-FAST: Balance loss/ataxia, Eyesight changes/diplopia, Facial droop/asymmetry, Arm drift or motor weakness, Speech slurring or aphasia, Time to activate emergency medical services immediately. Every minute of untreated large vessel occlusion results in the death of 1.9 million neurons ("Time is Brain"). Emergency triage requires non-contrast cranial CT or MRI to exclude intracranial hemorrhage. For acute ischemic stroke within 4.5 hours of last known well, intravenous thrombolytic therapy with Tenecteplase (TNK, 0.25 mg/kg) or Alteplase (tPA, 0.9 mg/kg) is the standard of care. In patients with large vessel occlusions (anterior circulation), mechanical endovascular thrombectomy is indicated within 6 hours and selected patients up to 24 hours based on CT/MRI perfusion mismatch.',
    metadata: {
      specialization: 'Neurology',
      hospital: 'Comprehensive Stroke Centers',
      sourceUrl: 'https://stroke.ahajournals.org/guidelines/acute-ischemic-stroke',
      sourceTitle: 'AHA/ASA & AAN Acute Ischemic Stroke Guidelines',
      tier: 2,
      verificationStatus: 'verified',
      chunkIndex: 12,
      parentDocTitle: 'AHA/ASA & AAN Guidelines for the Early Management of Acute Ischemic Stroke'
    }
  },
  {
    id: 'chunk-guideline-endo-1',
    documentId: 'doc-guideline-endo',
    text: 'Diabetes Mellitus Types, Diagnostic Thresholds & Management: Diagnostic criteria according to the American Diabetes Association (ADA): Fasting Plasma Glucose >=126 mg/dL (7.0 mmol/L), 2-hour 75g oral glucose tolerance test (OGTT) >=200 mg/dL (11.1 mmol/L), Glycated Hemoglobin (HbA1c) >=6.5%, or classic symptoms of hyperglycemia (polydipsia, polyuria, unexplained weight loss) with random glucose >=200 mg/dL. Type 1 Diabetes is caused by autoimmune destruction of pancreatic beta-cells, requiring life-long exogenous insulin (basal-bolus regimens or automated continuous insulin pumps). Type 2 Diabetes is characterized by insulin resistance and progressive beta-cell dysfunction. Modern pharmacotherapy combines Metformin with SGLT2 inhibitors (dapagliflozin, empagliflozin) for renal and heart failure protection and GLP-1 receptor agonists (semaglutide, tirzepatide) for glycemic control and atherosclerotic cardiovascular risk reduction.',
    metadata: {
      specialization: 'Endocrinology',
      hospital: 'Endocrine & Diabetes Centers',
      sourceUrl: 'https://diabetesjournals.org/care/standards-of-care-2026',
      sourceTitle: 'American Diabetes Association (ADA) Standards of Care',
      tier: 2,
      verificationStatus: 'verified',
      chunkIndex: 13,
      parentDocTitle: 'American Diabetes Association (ADA) Standards of Medical Care in Diabetes 2026'
    }
  },
  {
    id: 'chunk-guideline-onco-1',
    documentId: 'doc-guideline-onco',
    text: 'Cancer Staging Principles & Modern Immuno-Oncology Mechanisms: Staging utilizes the TNM system: T (extent of primary tumor), N (involvement of regional lymph nodes), and M (presence of distant metastasis). Stages I to IV determine surgical resectability, neoadjuvant versus adjuvant treatment, and prognosis. In immuno-oncology, immune checkpoint inhibitors target PD-1/PD-L1 (pembrolizumab, nivolumab, atezolizumab) and CTLA-4 (ipilimumab) to block tumor evasion mechanisms and reactivate endogenous cytotoxic CD8+ T cells to recognize and destroy malignant cells. Chimeric Antigen Receptor (CAR-T) cell therapy involves genetically engineering patient T cells to express receptors against specific tumor antigens (e.g. CD19 in B-cell lymphomas and leukemias), offering curative potential in relapsed hematologic malignancies.',
    metadata: {
      specialization: 'Oncology',
      hospital: 'Comprehensive Cancer Centers',
      sourceUrl: 'https://nccn.org/guidelines/immunotherapy-principles',
      sourceTitle: 'NCCN Immuno-Oncology & Staging Clinical Guidelines',
      tier: 2,
      verificationStatus: 'verified',
      chunkIndex: 14,
      parentDocTitle: 'NCCN Clinical Practice Guidelines in Oncology: Immuno-Oncology & Tumor Staging'
    }
  },
  {
    id: 'chunk-guideline-nephro-1',
    documentId: 'doc-guideline-nephro',
    text: 'Chronic Kidney Disease (CKD) Staging & Renal Failure Clinical Approach: CKD is defined as abnormalities of kidney structure or function present for >3 months with implications for health. Staging is based on cause, GFR category (G1: eGFR >=90; G2: 60-89; G3a: 45-59; G3b: 30-44; G4: 15-29; G5: <15 mL/min/1.73m2 - Kidney Failure) and Albuminuria category (A1: <30; A2: 30-300; A3: >300 mg/g). Symptoms of advanced uremic state include severe anorexia, nausea, metallic taste, intractable pruritus, peripheral edema, dyspnea from volume overload, pericardial friction rub, and encephalopathy (asterixis). Emergent indications for renal replacement therapy / hemodialysis follow the AEIOU mnemonic: Acidosis (pH <7.1 refractory to medical therapy), Electrolytes (severe hyperkalemia >6.5 mEq/L with ECG changes), Ingestions/Toxins, Overload (pulmonary edema refractory to diuretics), and Uremia (pericarditis, encephalopathy, bleeding).',
    metadata: {
      specialization: 'Nephrology',
      hospital: 'Renal Care & Dialysis Institutes',
      sourceUrl: 'https://kdigo.org/guidelines/ckd-evaluation-management',
      sourceTitle: 'KDIGO Clinical Practice Guidelines for Chronic Kidney Disease',
      tier: 2,
      verificationStatus: 'verified',
      chunkIndex: 15,
      parentDocTitle: 'KDIGO Clinical Practice Guidelines: Chronic Kidney Disease Staging & Dialysis Protocols'
    }
  },
  {
    id: 'chunk-guideline-pulmo-1',
    documentId: 'doc-guideline-pulmo',
    text: 'Asthma versus COPD Differential Diagnosis & Stepwise Pharmacotherapy: Asthma is characterized by chronic airway inflammation with variable, reversible expiratory airflow limitation and bronchial hyperresponsiveness; onset is often in childhood or associated with atopy, with episodic wheeze, cough, and chest tightness. COPD is characterized by persistent, non-fully reversible airflow limitation (post-bronchodilator FEV1/FVC < 0.70) caused by significant exposure to noxious particles or gases (tobacco smoke, biomass fuel). Treatment: Asthma baseline therapy relies on inhaled corticosteroids (ICS) combined with formoterol (LABA) as maintenance and reliever therapy (SMART). COPD maintenance emphasizes long-acting bronchodilators: LAMA (tiotropium, umeclidinium) and LABA (vilanterol, formoterol), adding ICS only in patients with high blood eosinophil counts (>=300 cells/mcL) or recurrent exacerbations. Warning signs of severe acute respiratory distress include cyanosis, silent chest, pulsus paradoxus, accessory muscle use, and inability to speak in phrases.',
    metadata: {
      specialization: 'Pulmonology',
      hospital: 'Respiratory Critical Care Centers',
      sourceUrl: 'https://goldcopd.org/guidelines-2026',
      sourceTitle: 'GOLD & GINA International Respiratory Guidelines',
      tier: 2,
      verificationStatus: 'verified',
      chunkIndex: 16,
      parentDocTitle: 'GOLD Strategy for COPD & GINA Global Strategy for Asthma Management 2026'
    }
  },
  ...ADDITIONAL_CHUNKS
];

export const INITIAL_KG_NODES: KnowledgeGraphNode[] = [
  // Doctors
  { id: 'node-doc-1', label: 'Dr. Devi Prasad Shetty', type: 'Doctor', properties: { experience: 42, tier: 1 } },
  { id: 'node-doc-2', label: 'Dr. Naresh Trehan', type: 'Doctor', properties: { experience: 52, tier: 1 } },
  { id: 'node-doc-3', label: 'Dr. Suresh Advani', type: 'Doctor', properties: { experience: 48, tier: 1 } },
  { id: 'node-doc-4', label: 'Dr. Rajesh Verma', type: 'Doctor', properties: { experience: 18, tier: 1, status: 'conflicting' } },
  { id: 'node-doc-5', label: 'Dr. Ashok Seth', type: 'Doctor', properties: { experience: 40, tier: 1 } },
  { id: 'node-doc-6', label: 'Dr. Sunita Rao', type: 'Doctor', properties: { experience: 21, tier: 1, status: 'conflicting' } },
  { id: 'node-doc-7', label: 'Dr. Randeep Guleria', type: 'Doctor', properties: { experience: 38, tier: 1 } },
  { id: 'node-doc-8', label: 'Dr. Priya Sharma', type: 'Doctor', properties: { experience: 13, tier: 1 } },
  { id: 'node-doc-9', label: 'Dr. Anand Mehta', type: 'Doctor', properties: { experience: 17, tier: 1 } },
  { id: 'node-doc-10', label: 'Dr. Farhan Qureshi', type: 'Doctor', properties: { experience: 15, tier: 1 } },
  { id: 'node-doc-11', label: 'Dr. Sanjiv Saxena', type: 'Doctor', properties: { experience: 36, tier: 1 } },
  { id: 'node-doc-12', label: 'Dr. Namrata Sharma', type: 'Doctor', properties: { experience: 32, tier: 1 } },
  { id: 'node-doc-13', label: 'Dr. Ambrish Mithal', type: 'Doctor', properties: { experience: 39, tier: 1 } },
  { id: 'node-doc-14', label: 'Dr. Pratima Murthy', type: 'Doctor', properties: { experience: 36, tier: 1 } },
  { id: 'node-doc-15', label: 'Dr. Rohini Handa', type: 'Doctor', properties: { experience: 40, tier: 1 } },
  { id: 'node-doc-16', label: 'Dr. Sudhir Rawal', type: 'Doctor', properties: { experience: 34, tier: 1 } },

  // Specializations
  { id: 'node-spec-cardio', label: 'Cardiology', type: 'Specialization', properties: {} },
  { id: 'node-spec-onco', label: 'Oncology', type: 'Specialization', properties: {} },
  { id: 'node-spec-neuro', label: 'Neurology', type: 'Specialization', properties: {} },
  { id: 'node-spec-pulmo', label: 'Pulmonology', type: 'Specialization', properties: {} },
  { id: 'node-spec-peds', label: 'Pediatrics', type: 'Specialization', properties: {} },
  { id: 'node-spec-ortho', label: 'Orthopedics', type: 'Specialization', properties: {} },
  { id: 'node-spec-gastro', label: 'Gastroenterology', type: 'Specialization', properties: {} },
  { id: 'node-spec-nephro', label: 'Nephrology', type: 'Specialization', properties: {} },
  { id: 'node-spec-ophtha', label: 'Ophthalmology', type: 'Specialization', properties: {} },
  { id: 'node-spec-endo', label: 'Endocrinology', type: 'Specialization', properties: {} },
  { id: 'node-spec-psych', label: 'Psychiatry', type: 'Specialization', properties: {} },
  { id: 'node-spec-rheum', label: 'Rheumatology', type: 'Specialization', properties: {} },
  { id: 'node-spec-uro', label: 'Urology', type: 'Specialization', properties: {} },

  // Hospitals
  { id: 'node-hosp-narayana', label: 'Narayana Health City', type: 'Hospital', properties: { beds: 1500 } },
  { id: 'node-hosp-medanta', label: 'Medanta - The Medicity', type: 'Hospital', properties: { beds: 1250 } },
  { id: 'node-hosp-tmc', label: 'Tata Memorial Hospital', type: 'Hospital', properties: { beds: 700 } },
  { id: 'node-hosp-fortis-fmri', label: 'Fortis Memorial Research Institute', type: 'Hospital', properties: { beds: 1000 } },
  { id: 'node-hosp-fortis-escorts', label: 'Fortis Escorts Heart Institute', type: 'Hospital', properties: { beds: 310 } },
  { id: 'node-hosp-lilavati', label: 'Lilavati Hospital & Research Centre', type: 'Hospital', properties: { beds: 323 } },
  { id: 'node-hosp-apollo-mumbai', label: 'Apollo Hospitals Navi Mumbai', type: 'Hospital', properties: { beds: 500 } },
  { id: 'node-hosp-apollo-ahmedabad', label: 'Apollo Hospitals Ahmedabad', type: 'Hospital', properties: { beds: 300 } },
  { id: 'node-hosp-aig', label: 'AIG Hospitals', type: 'Hospital', properties: { beds: 800 } },
  { id: 'node-hosp-psri', label: 'Pushpawati Singhania Hospital (PSRI)', type: 'Hospital', properties: { beds: 300 } },
  { id: 'node-hosp-aiims-rpc', label: 'AIIMS RP Centre', type: 'Hospital', properties: { beds: 400 } },
  { id: 'node-hosp-max-saket', label: 'Max Super Speciality Saket', type: 'Hospital', properties: { beds: 550 } },
  { id: 'node-hosp-nimhans', label: 'NIMHANS Bengaluru', type: 'Hospital', properties: { beds: 900 } },
  { id: 'node-hosp-apollo-delhi', label: 'Indraprastha Apollo Hospitals', type: 'Hospital', properties: { beds: 710 } },
  { id: 'node-hosp-rgci', label: 'Rajiv Gandhi Cancer Institute (RGCI)', type: 'Hospital', properties: { beds: 500 } },

  // Cities
  { id: 'node-city-bengaluru', label: 'Bengaluru', type: 'City', properties: { state: 'Karnataka' } },
  { id: 'node-city-mumbai', label: 'Mumbai', type: 'City', properties: { state: 'Maharashtra' } },
  { id: 'node-city-delhi', label: 'New Delhi', type: 'City', properties: { state: 'Delhi' } },
  { id: 'node-city-gurugram', label: 'Gurugram', type: 'City', properties: { state: 'Haryana' } },
  { id: 'node-city-ahmedabad', label: 'Ahmedabad', type: 'City', properties: { state: 'Gujarat' } },
  { id: 'node-city-hyderabad', label: 'Hyderabad', type: 'City', properties: { state: 'Telangana' } },

  // Qualifications
  { id: 'node-qual-frcs', label: 'FRCS (England)', type: 'Qualification', properties: {} },
  { id: 'node-qual-facc', label: 'FACC (USA)', type: 'Qualification', properties: {} },
  { id: 'node-qual-dm-neuro', label: 'DM Neurology (AIIMS)', type: 'Qualification', properties: {} },
  { id: 'node-qual-bmt-fellow', label: 'BMT Fellowship (Fred Hutchinson)', type: 'Qualification', properties: {} },
  { id: 'node-qual-dm-pulmo', label: 'DM Pulmonology (PGIMER)', type: 'Qualification', properties: {} },
  { id: 'node-qual-dm-nephro', label: 'DM Nephrology (AIIMS)', type: 'Qualification', properties: {} },
  { id: 'node-qual-dm-endo', label: 'DM Endocrinology (AIIMS)', type: 'Qualification', properties: {} },
  { id: 'node-qual-mch-uro', label: 'MCh Urology (CMC Vellore)', type: 'Qualification', properties: {} },

  // Organizations
  { id: 'node-org-csi', label: 'Cardiological Society of India', type: 'Organization', properties: {} },
  { id: 'node-org-ian', label: 'Indian Academy of Neurology', type: 'Organization', properties: {} },
  { id: 'node-org-asco', label: 'American Society of Clinical Oncology', type: 'Organization', properties: {} },
  { id: 'node-org-asn', label: 'American Society of Nephrology', type: 'Organization', properties: {} },
  { id: 'node-org-ada', label: 'American Diabetes Association', type: 'Organization', properties: {} },
  ...ADDITIONAL_KG_NODES
];

export const INITIAL_KG_EDGES: KnowledgeGraphEdge[] = [
  // Specialization relationships
  { id: 'edge-1', source: 'node-doc-1', target: 'node-spec-cardio', relationship: 'specializes_in' },
  { id: 'edge-2', source: 'node-doc-2', target: 'node-spec-cardio', relationship: 'specializes_in' },
  { id: 'edge-3', source: 'node-doc-3', target: 'node-spec-onco', relationship: 'specializes_in' },
  { id: 'edge-4', source: 'node-doc-4', target: 'node-spec-neuro', relationship: 'specializes_in' },
  { id: 'edge-5', source: 'node-doc-5', target: 'node-spec-cardio', relationship: 'specializes_in' },
  { id: 'edge-6', source: 'node-doc-6', target: 'node-spec-neuro', relationship: 'specializes_in' },
  { id: 'edge-7', source: 'node-doc-7', target: 'node-spec-pulmo', relationship: 'specializes_in' },
  { id: 'edge-8', source: 'node-doc-8', target: 'node-spec-peds', relationship: 'specializes_in' },
  { id: 'edge-9', source: 'node-doc-9', target: 'node-spec-ortho', relationship: 'specializes_in' },
  { id: 'edge-10', source: 'node-doc-10', target: 'node-spec-gastro', relationship: 'specializes_in' },
  { id: 'edge-11-spec', source: 'node-doc-11', target: 'node-spec-nephro', relationship: 'specializes_in' },
  { id: 'edge-12-spec', source: 'node-doc-12', target: 'node-spec-ophtha', relationship: 'specializes_in' },
  { id: 'edge-13-spec', source: 'node-doc-13', target: 'node-spec-endo', relationship: 'specializes_in' },
  { id: 'edge-14-spec', source: 'node-doc-14', target: 'node-spec-psych', relationship: 'specializes_in' },
  { id: 'edge-15-spec', source: 'node-doc-15', target: 'node-spec-rheum', relationship: 'specializes_in' },
  { id: 'edge-16-spec', source: 'node-doc-16', target: 'node-spec-uro', relationship: 'specializes_in' },

  // Hospital affiliations
  { id: 'edge-11', source: 'node-doc-1', target: 'node-hosp-narayana', relationship: 'works_at' },
  { id: 'edge-12', source: 'node-doc-2', target: 'node-hosp-medanta', relationship: 'works_at' },
  { id: 'edge-13', source: 'node-doc-3', target: 'node-hosp-tmc', relationship: 'works_at' },
  { id: 'edge-14', source: 'node-doc-4', target: 'node-hosp-fortis-fmri', relationship: 'works_at' },
  { id: 'edge-15', source: 'node-doc-5', target: 'node-hosp-fortis-escorts', relationship: 'works_at' },
  { id: 'edge-16', source: 'node-doc-6', target: 'node-hosp-lilavati', relationship: 'works_at' },
  { id: 'edge-17', source: 'node-doc-7', target: 'node-hosp-medanta', relationship: 'works_at' },
  { id: 'edge-18', source: 'node-doc-8', target: 'node-hosp-apollo-mumbai', relationship: 'works_at' },
  { id: 'edge-19', source: 'node-doc-9', target: 'node-hosp-apollo-ahmedabad', relationship: 'works_at' },
  { id: 'edge-20', source: 'node-doc-10', target: 'node-hosp-aig', relationship: 'works_at' },
  { id: 'edge-21-hosp', source: 'node-doc-11', target: 'node-hosp-psri', relationship: 'works_at' },
  { id: 'edge-22-hosp', source: 'node-doc-12', target: 'node-hosp-aiims-rpc', relationship: 'works_at' },
  { id: 'edge-23-hosp', source: 'node-doc-13', target: 'node-hosp-max-saket', relationship: 'works_at' },
  { id: 'edge-24-hosp', source: 'node-doc-14', target: 'node-hosp-nimhans', relationship: 'works_at' },
  { id: 'edge-25-hosp', source: 'node-doc-15', target: 'node-hosp-apollo-delhi', relationship: 'works_at' },
  { id: 'edge-26-hosp', source: 'node-doc-16', target: 'node-hosp-rgci', relationship: 'works_at' },

  // Location relationships (Hospitals to Cities)
  { id: 'edge-21', source: 'node-hosp-narayana', target: 'node-city-bengaluru', relationship: 'located_in' },
  { id: 'edge-22', source: 'node-hosp-medanta', target: 'node-city-gurugram', relationship: 'located_in' },
  { id: 'edge-23', source: 'node-hosp-tmc', target: 'node-city-mumbai', relationship: 'located_in' },
  { id: 'edge-24', source: 'node-hosp-fortis-fmri', target: 'node-city-gurugram', relationship: 'located_in' },
  { id: 'edge-25', source: 'node-hosp-fortis-escorts', target: 'node-city-delhi', relationship: 'located_in' },
  { id: 'edge-26', source: 'node-hosp-lilavati', target: 'node-city-mumbai', relationship: 'located_in' },
  { id: 'edge-27', source: 'node-hosp-apollo-mumbai', target: 'node-city-mumbai', relationship: 'located_in' },
  { id: 'edge-28', source: 'node-hosp-apollo-ahmedabad', target: 'node-city-ahmedabad', relationship: 'located_in' },
  { id: 'edge-29', source: 'node-hosp-aig', target: 'node-city-hyderabad', relationship: 'located_in' },
  { id: 'edge-30-city', source: 'node-hosp-psri', target: 'node-city-delhi', relationship: 'located_in' },
  { id: 'edge-31-city', source: 'node-hosp-aiims-rpc', target: 'node-city-delhi', relationship: 'located_in' },
  { id: 'edge-32-city', source: 'node-hosp-max-saket', target: 'node-city-delhi', relationship: 'located_in' },
  { id: 'edge-33-city', source: 'node-hosp-nimhans', target: 'node-city-bengaluru', relationship: 'located_in' },
  { id: 'edge-34-city', source: 'node-hosp-apollo-delhi', target: 'node-city-delhi', relationship: 'located_in' },
  { id: 'edge-35-city', source: 'node-hosp-rgci', target: 'node-city-delhi', relationship: 'located_in' },

  // Qualifications
  { id: 'edge-30', source: 'node-doc-1', target: 'node-qual-frcs', relationship: 'has_qualification' },
  { id: 'edge-31', source: 'node-doc-5', target: 'node-qual-facc', relationship: 'has_qualification' },
  { id: 'edge-32', source: 'node-doc-4', target: 'node-qual-dm-neuro', relationship: 'has_qualification' },
  { id: 'edge-33', source: 'node-doc-3', target: 'node-qual-bmt-fellow', relationship: 'has_qualification' },
  { id: 'edge-34', source: 'node-doc-7', target: 'node-qual-dm-pulmo', relationship: 'has_qualification' },
  { id: 'edge-35-qual', source: 'node-doc-11', target: 'node-qual-dm-nephro', relationship: 'has_qualification' },
  { id: 'edge-36-qual', source: 'node-doc-13', target: 'node-qual-dm-endo', relationship: 'has_qualification' },
  { id: 'edge-37-qual', source: 'node-doc-16', target: 'node-qual-mch-uro', relationship: 'has_qualification' },

  // Memberships
  { id: 'edge-35', source: 'node-doc-1', target: 'node-org-csi', relationship: 'member_of' },
  { id: 'edge-36', source: 'node-doc-5', target: 'node-org-csi', relationship: 'member_of' },
  { id: 'edge-37', source: 'node-doc-4', target: 'node-org-ian', relationship: 'member_of' },
  { id: 'edge-38', source: 'node-doc-6', target: 'node-org-ian', relationship: 'member_of' },
  { id: 'edge-39', source: 'node-doc-3', target: 'node-org-asco', relationship: 'member_of' },
  { id: 'edge-40-org', source: 'node-doc-11', target: 'node-org-asn', relationship: 'member_of' },
  { id: 'edge-41-org', source: 'node-doc-13', target: 'node-org-ada', relationship: 'member_of' },

  // Hospital Offers Specialty
  { id: 'edge-40', source: 'node-hosp-narayana', target: 'node-spec-cardio', relationship: 'offers' },
  { id: 'edge-41', source: 'node-hosp-fortis-escorts', target: 'node-spec-cardio', relationship: 'offers' },
  { id: 'edge-42', source: 'node-hosp-tmc', target: 'node-spec-onco', relationship: 'offers' },
  { id: 'edge-43', source: 'node-hosp-lilavati', target: 'node-spec-neuro', relationship: 'offers' },
  { id: 'edge-44', source: 'node-hosp-apollo-mumbai', target: 'node-spec-peds', relationship: 'offers' },
  { id: 'edge-45-offers', source: 'node-hosp-psri', target: 'node-spec-nephro', relationship: 'offers' },
  { id: 'edge-46-offers', source: 'node-hosp-aiims-rpc', target: 'node-spec-ophtha', relationship: 'offers' },
  { id: 'edge-47-offers', source: 'node-hosp-max-saket', target: 'node-spec-endo', relationship: 'offers' },
  { id: 'edge-48-offers', source: 'node-hosp-nimhans', target: 'node-spec-psych', relationship: 'offers' },
  { id: 'edge-49-offers', source: 'node-hosp-apollo-delhi', target: 'node-spec-rheum', relationship: 'offers' },
  { id: 'edge-50-offers', source: 'node-hosp-rgci', target: 'node-spec-uro', relationship: 'offers' },
  ...ADDITIONAL_KG_EDGES
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-27T10:14:00Z',
    user: 'system_crawler',
    action: 'INGEST_SOURCE',
    details: 'Ingested 8 doctor faculty profiles from Tata Memorial Centre portal (Tier 1)',
    piiDetected: false,
  },
  {
    id: 'log-2',
    timestamp: '2026-09-27T10:25:30Z',
    user: 'admin_dr_patel',
    action: 'CONFLICT_DETECTED',
    details: 'Flagged conflicting experience value for Dr. Rajesh Verma (18 yrs Fortis vs 14 yrs DoctorPedia)',
    piiDetected: false,
  },
  {
    id: 'log-3',
    timestamp: '2026-09-27T11:02:15Z',
    user: 'system_pii_scanner',
    action: 'PII_REDACTION',
    details: 'Masked 3 patient phone numbers and email addresses in community upload batch doc-source-4',
    piiDetected: true,
  }
];
