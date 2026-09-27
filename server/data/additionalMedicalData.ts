import { Doctor, Source, KnowledgeDocument, DocumentChunk, ConflictRecord, KnowledgeGraphNode, KnowledgeGraphEdge } from '../../src/types/index.ts';

export const ADDITIONAL_SOURCES: Source[] = [
  {
    id: 'src-8',
    name: 'Institute of Liver & Biliary Sciences (ILBS) Registry',
    url: 'https://ilbs.in/faculty/hepatology',
    tier: 1,
    tierDescription: 'Tier 1: Autonomous apex liver and biliary super-specialty institute',
    reliabilityScore: 99,
    recordsCount: 34,
    lastScrapedOrIngested: '2026-09-20T09:00:00Z',
    status: 'active',
  },
  {
    id: 'src-9',
    name: 'World Health Organization (WHO) & CDC Clinical Practice Guidelines',
    url: 'https://who.int/clinical-guidelines-repository',
    tier: 1,
    tierDescription: 'Tier 1: Global health multilateral authority & CDC disease guidelines',
    reliabilityScore: 99,
    recordsCount: 120,
    lastScrapedOrIngested: '2026-09-25T12:00:00Z',
    status: 'active',
  },
  {
    id: 'src-10',
    name: 'American College of Emergency Physicians & ERC Resuscitation Registry',
    url: 'https://acep.org/clinical-policies',
    tier: 2,
    tierDescription: 'Tier 2: International emergency medicine & resuscitation council',
    reliabilityScore: 95,
    recordsCount: 65,
    lastScrapedOrIngested: '2026-09-22T15:30:00Z',
    status: 'active',
  },
  {
    id: 'src-11',
    name: 'Apollo Chennai Clinical Directory & Transplant Registry',
    url: 'https://apollohospitals.com/chennai/infectious-diseases',
    tier: 1,
    tierDescription: 'Tier 1: Accredited quaternary care transplant hospital directory',
    reliabilityScore: 97,
    recordsCount: 48,
    lastScrapedOrIngested: '2026-09-23T11:45:00Z',
    status: 'active',
  }
];

export const ADDITIONAL_CONFLICTS: ConflictRecord[] = [
  {
    id: 'conf-3',
    doctorId: 'doc-28',
    doctorName: 'Dr. Manish Bansal',
    field: 'experienceYears',
    sourceA: {
      sourceName: 'Medanta Cardiology Faculty Registry (Tier 1)',
      sourceUrl: 'https://medanta.org/doctors/dr-manish-bansal',
      tier: 1,
      value: 20,
      date: '2026-09-18',
    },
    sourceB: {
      sourceName: 'DoctorPedia Profiles (Tier 4)',
      sourceUrl: 'https://doctorpedia-profiles.net/dr/manish-bansal',
      tier: 4,
      value: 16,
      date: '2025-06-10',
    },
    status: 'unresolved',
    resolutionNotes: 'Web mirror lacks 2025-2026 international echocardiography fellowship update.',
  },
  {
    id: 'conf-4',
    doctorId: 'doc-19',
    doctorName: 'Dr. D. Nageshwar Reddy',
    field: 'hospital',
    sourceA: {
      sourceName: 'AIG Hospitals Official Roster (Tier 1)',
      sourceUrl: 'https://aighospitals.com/faculty/dr-nageshwar-reddy',
      tier: 1,
      value: 'AIG Hospitals',
      date: '2026-09-15',
    },
    sourceB: {
      sourceName: 'Community Hospital Review (Tier 5)',
      sourceUrl: 'https://medrag.internal/submissions/community-upload',
      tier: 5,
      value: 'Asian Institute of Gastroenterology (Old Somajiguda)',
      date: '2026-09-21',
    },
    status: 'unresolved',
    resolutionNotes: 'Community submission mistakenly referenced the older historical clinic location instead of the new AIG Hospitals Gachibowli campus.',
  }
];

export const ADDITIONAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-17',
    name: 'Dr. Praveen Aggarwal',
    title: 'Dr.',
    specialization: 'Emergency Medicine',
    subSpecialization: 'Trauma Resuscitation, Sepsis & Critical Care',
    qualifications: [
      { degree: 'MBBS', institute: 'Maulana Azad Medical College (MAMC), Delhi', year: 1983 },
      { degree: 'MD (Internal Medicine)', institute: 'AIIMS, New Delhi', year: 1987 },
      { degree: 'Fellowship in Emergency Medicine', institute: 'Royal College of Emergency Medicine, UK', year: 2004 }
    ],
    hospital: 'All India Institute of Medical Sciences (AIIMS)',
    hospitalDepartment: 'Department of Emergency Medicine & Trauma Centre',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    experienceYears: 37,
    areasOfExpertise: [
      'Cardiopulmonary Resuscitation (ACLS/ATLS)',
      'Severe Sepsis & Septic Shock Early Goal-Directed Protocol',
      'Acute Poisoning & Toxicology Triage',
      'Polytrauma Resuscitation & Massive Transfusion',
      'Point-of-Care Ultrasound (POCUS) in Shock'
    ],
    publications: [
      {
        title: 'Immediate outcome of protocolized CPR versus standard resuscitation in in-hospital cardiac arrest',
        journal: 'Resuscitation',
        year: 2022,
        pmid: '35914210'
      }
    ],
    memberships: [
      'Society for Emergency Medicine India (SEMI, Past President)',
      'International Federation for Emergency Medicine (IFEM)',
      'Indian Society of Critical Care Medicine (ISCCM)'
    ],
    languages: ['English', 'Hindi'],
    publicProfiles: [
      { platform: 'AIIMS Faculty Directory', url: 'https://aiims.edu/directory/dr-praveen-aggarwal' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://aiims.edu/directory/dr-praveen-aggarwal',
    primarySourceTitle: 'AIIMS Emergency Medicine Official Registry',
    dateCollected: '2026-09-12',
    lastVerifiedDate: '2026-09-24',
    confidenceScore: 99,
    bio: 'Founder and longtime Head of the Department of Emergency Medicine at AIIMS New Delhi, who established the first academic MD Emergency Medicine curriculum in India.'
  },
  {
    id: 'doc-18',
    name: 'Dr. Shiv Kumar Sarin',
    title: 'Dr.',
    specialization: 'Gastroenterology',
    subSpecialization: 'Hepatology, Cirrhosis & Liver Transplantation',
    qualifications: [
      { degree: 'MBBS', institute: 'SMS Medical College, Jaipur', year: 1974 },
      { degree: 'MD (General Medicine)', institute: 'SMS Medical College', year: 1978 },
      { degree: 'DM (Gastroenterology)', institute: 'AIIMS, New Delhi', year: 1981 }
    ],
    hospital: 'Institute of Liver & Biliary Sciences (ILBS)',
    hospitalDepartment: 'Department of Hepatology & Clinical Liver Research',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    experienceYears: 42,
    areasOfExpertise: [
      'Acute-on-Chronic Liver Failure (ACLF) APASL Criteria',
      'Portal Hypertension & Gastric/Esophageal Variceal Hemorrhage',
      'Chronic Hepatitis B & C Direct-Acting Antiviral Eradication',
      'Nonalcoholic Fatty Liver Disease (MASLD / MASH)',
      'Liver Transplant Pre- and Post-Operative Management'
    ],
    publications: [
      {
        title: 'Acute-on-chronic liver failure: consensus recommendations of the Asian Pacific Association for the Study of the Liver (APASL)',
        journal: 'Hepatology International',
        year: 2023,
        pmid: '37001429',
        doi: '10.1007/s12072-023-10492-w'
      }
    ],
    memberships: [
      'Asian Pacific Association for the Study of the Liver (APASL, President)',
      'American Association for the Study of Liver Diseases (AASLD Fellow)',
      'Indian National Association for the Study of the Liver (INASL)'
    ],
    languages: ['English', 'Hindi'],
    publicProfiles: [
      { platform: 'ILBS Faculty Portal', url: 'https://ilbs.in/faculty/dr-sk-sarin' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://ilbs.in/faculty/dr-sk-sarin',
    primarySourceTitle: 'ILBS Official Academic Dossier',
    dateCollected: '2026-09-14',
    lastVerifiedDate: '2026-09-25',
    confidenceScore: 99,
    bio: 'Pioneering hepatologist, Director of ILBS New Delhi, and recipient of the Padma Bhushan, who formulated the international APASL criteria for acute-on-chronic liver failure.'
  },
  {
    id: 'doc-19',
    name: 'Dr. D. Nageshwar Reddy',
    title: 'Dr.',
    specialization: 'Gastroenterology',
    subSpecialization: 'Interventional Endoscopy, Pancreaticobiliary & ERCP',
    qualifications: [
      { degree: 'MBBS', institute: 'Kurnool Medical College', year: 1978 },
      { degree: 'MD (Internal Medicine)', institute: 'Madras Medical College', year: 1982 },
      { degree: 'DM (Gastroenterology)', institute: 'Postgraduate Institute (PGIMER), Chandigarh', year: 1984 }
    ],
    hospital: 'AIG Hospitals',
    hospitalDepartment: 'Chairman, Advanced Therapeutic Endoscopy Division',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    experienceYears: 40,
    areasOfExpertise: [
      'Endoscopic Retrograde Cholangiopancreatography (ERCP)',
      'Endoscopic Ultrasound (EUS) Guided Fine Needle Biopsy',
      'Peroral Endoscopic Myotomy (POEM) for Achalasia',
      'Acute Necrotizing Pancreatitis Step-Up Management',
      'Third-Space Endoscopic Mucosal Resection'
    ],
    publications: [
      {
        title: 'Endoscopic necrosectomy versus surgical drainage for walled-off pancreatic necrosis: Randomized controlled trial',
        journal: 'Gastrointestinal Endoscopy (GIE)',
        year: 2022,
        pmid: '35439011'
      }
    ],
    memberships: [
      'World Endoscopy Organization (Past President)',
      'American Society for Gastrointestinal Endoscopy (Master ASGE)',
      'Indian Society of Gastroenterology'
    ],
    languages: ['English', 'Telugu', 'Hindi'],
    publicProfiles: [
      { platform: 'AIG Hospitals Directory', url: 'https://aighospitals.com/faculty/dr-nageshwar-reddy' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://aighospitals.com/faculty/dr-nageshwar-reddy',
    primarySourceTitle: 'AIG Hospitals Faculty Registry',
    dateCollected: '2026-09-15',
    lastVerifiedDate: '2026-09-24',
    confidenceScore: 99,
    bio: 'Chairman of AIG Hospitals and international pioneer in therapeutic endoscopy who has trained hundreds of endoscopists globally, recipient of the Rudolf Schindler Award.'
  },
  {
    id: 'doc-20',
    name: 'Dr. Firuza Parikh',
    title: 'Dr.',
    specialization: 'Obstetrics & Gynecology',
    subSpecialization: 'Reproductive Medicine, High-Risk Pregnancy & IVF',
    qualifications: [
      { degree: 'MBBS', institute: 'Seth G.S. Medical College & KEM Hospital, Mumbai', year: 1982 },
      { degree: 'MD (Obstetrics & Gynecology)', institute: 'KEM Hospital, Mumbai', year: 1985 },
      { degree: 'Fellowship in Reproductive Medicine', institute: 'Yale University School of Medicine, USA', year: 1990 }
    ],
    hospital: 'Jaslok Hospital & Research Centre',
    hospitalDepartment: 'Department of Assisted Reproduction & Genetics',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    experienceYears: 36,
    areasOfExpertise: [
      'High-Risk Pregnancy & Preeclampsia Management',
      'Intracytoplasmic Sperm Injection (ICSI) & Preimplantation Genetic Testing (PGT)',
      'Recurrent Pregnancy Loss & Antiphospholipid Syndrome',
      'Advanced Endometriosis & Adenomyosis Treatment',
      'Fertility Preservation in Cancer Patients'
    ],
    publications: [
      {
        title: 'Preimplantation genetic testing for monogenic diseases: Clinical efficacy and neonatal outcomes over 2 decades',
        journal: 'Human Reproduction',
        year: 2021,
        pmid: '34105284'
      }
    ],
    memberships: [
      'American Society for Reproductive Medicine (ASRM)',
      'European Society of Human Reproduction and Embryology (ESHRE)',
      'Federation of Obstetric and Gynaecological Societies of India (FOGSI)'
    ],
    languages: ['English', 'Gujarati', 'Hindi', 'Marathi'],
    publicProfiles: [
      { platform: 'Jaslok Hospital Directory', url: 'https://jaslokhospital.net/doctors/dr-firuza-parikh' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://jaslokhospital.net/doctors/dr-firuza-parikh',
    primarySourceTitle: 'Jaslok Hospital Academic Roster',
    dateCollected: '2026-09-16',
    lastVerifiedDate: '2026-09-25',
    confidenceScore: 98,
    bio: 'Director of Assisted Reproduction & Genetics at Jaslok Hospital, former faculty at Yale, who delivered India’s first ICSI baby and pioneered high-risk obstetric monitoring.'
  },
  {
    id: 'doc-21',
    name: 'Dr. S. Rajasekaran',
    title: 'Dr.',
    specialization: 'Orthopedics',
    subSpecialization: 'Spine Surgery, Spinal Trauma & Deformity Correction',
    qualifications: [
      { degree: 'MBBS', institute: 'Madurai Medical College', year: 1980 },
      { degree: 'MS (Orthopedics)', institute: 'Madras Medical College', year: 1984 },
      { degree: 'FRCS', institute: 'Royal College of Surgeons of Edinburgh', year: 1988 },
      { degree: 'PhD in Spine Surgery', institute: 'Tamil Nadu Dr. M.G.R. Medical University', year: 2000 }
    ],
    hospital: 'Ganga Hospital',
    hospitalDepartment: 'Department of Orthopedics & Spine Surgery',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    experienceYears: 40,
    areasOfExpertise: [
      'Complex Adolescent Idiopathic Scoliosis Correction',
      'Cervical & Lumbar Artificial Disc Replacement',
      'Acute Spinal Cord Injury & Neuroprotection Protocol',
      'Minimally Invasive Spine Surgery (MISS)',
      'Tuberculous Spondylitis (Pott Spine) Reconstruction'
    ],
    publications: [
      {
        title: 'Diffusion basis of intervertebral disc degeneration: A 10-year longitudinal MRI study',
        journal: 'Spine (Phila Pa 1976)',
        year: 2023,
        pmid: '36988902',
        doi: '10.1097/BRS.0000000000004650'
      }
    ],
    memberships: [
      'International Society for the Study of the Lumbar Spine (ISSLS, Past President)',
      'Association of Spine Surgeons of India (ASSI)',
      'Scoliosis Research Society (SRS)'
    ],
    languages: ['English', 'Tamil', 'Hindi'],
    publicProfiles: [
      { platform: 'Ganga Hospital Portal', url: 'https://gangahospital.com/doctors/dr-s-rajasekaran' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://gangahospital.com/doctors/dr-s-rajasekaran',
    primarySourceTitle: 'Ganga Hospital Spine Surgery Registry',
    dateCollected: '2026-09-17',
    lastVerifiedDate: '2026-09-24',
    confidenceScore: 99,
    bio: 'Chairman of Orthopedics & Spine Surgery at Ganga Hospital, past president of the International Society for the Study of the Lumbar Spine (ISSLS), and recipient of the ISSLS Best Research Award four times.'
  },
  {
    id: 'doc-22',
    name: 'Dr. V. Ramasubramanian',
    title: 'Dr.',
    specialization: 'Infectious Diseases',
    subSpecialization: 'Tropical Infections, Antimicrobial Resistance & Sepsis',
    qualifications: [
      { degree: 'MBBS', institute: 'Madras Medical College', year: 1986 },
      { degree: 'MD (General Medicine)', institute: 'Madras Medical College', year: 1990 },
      { degree: 'MRCP', institute: 'Royal College of Physicians, UK', year: 1993 },
      { degree: 'Fellowship in Infectious Diseases', institute: 'Barts and The London NHS Trust, UK', year: 1997 }
    ],
    hospital: 'Apollo Hospitals Chennai',
    hospitalDepartment: 'Department of Infectious Diseases & Travel Medicine',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    experienceYears: 34,
    areasOfExpertise: [
      'Multi-Drug Resistant (MDR / XDR) Bacterial Infections',
      'Severe Dengue & Tropical Hemorrhagic Fevers Fluid Management',
      'Invasive Fungal Infections (Mucormycosis, Aspergillosis)',
      'Antimicrobial Stewardship & Hospital Sepsis Protocols',
      'Infections in Solid Organ & Bone Marrow Transplant Recipients'
    ],
    publications: [
      {
        title: 'Carbapenem-sparing antimicrobial strategies in bloodstream infections: Multi-centre Asian clinical trial',
        journal: 'Clinical Infectious Diseases',
        year: 2022,
        pmid: '35678104'
      }
    ],
    memberships: [
      'Infectious Diseases Society of America (IDSA Fellow)',
      'Clinical Infectious Diseases Society of India (CIDS, Past President)',
      'Royal College of Physicians of Glasgow'
    ],
    languages: ['English', 'Tamil', 'Hindi'],
    publicProfiles: [
      { platform: 'Apollo Hospitals Faculty', url: 'https://apollohospitals.com/doctors/dr-v-ramasubramanian' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://apollohospitals.com/doctors/dr-v-ramasubramanian',
    primarySourceTitle: 'Apollo Chennai Medical Register',
    dateCollected: '2026-09-18',
    lastVerifiedDate: '2026-09-25',
    confidenceScore: 98,
    bio: 'Pioneer of dedicated Infectious Disease clinical services in South India, advising state and national health agencies on antimicrobial stewardship and epidemic response.'
  },
  {
    id: 'doc-23',
    name: 'Dr. Pradeep Chowbey',
    title: 'Dr.',
    specialization: 'General Surgery',
    subSpecialization: 'Minimal Access, Laparoscopic & Bariatric Surgery',
    qualifications: [
      { degree: 'MBBS', institute: 'Jabalpur Medical College', year: 1977 },
      { degree: 'MS (General Surgery)', institute: 'Jabalpur Medical College', year: 1980 },
      { degree: 'MNAMS', institute: 'National Academy of Medical Sciences', year: 1984 },
      { degree: 'FICS', institute: 'International College of Surgeons, USA', year: 1991 }
    ],
    hospital: 'Max Super Speciality Hospital, Saket',
    hospitalDepartment: 'Chairman, Max Institute of Minimal Access, Metabolic & Bariatric Surgery',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    experienceYears: 44,
    areasOfExpertise: [
      'Laparoscopic Appendectomy & Acute Peritonitis Surgery',
      'Laparoscopic Cholecystectomy for Acute/Chronic Cholecystitis',
      'Advanced Abdominal Wall Hernia Reconstruction (eTEP / TAR)',
      'Metabolic & Bariatric Surgery (Roux-en-Y, Sleeve Gastrectomy)',
      'Minimal Access Colorectal Resection'
    ],
    publications: [
      {
        title: 'Long-term metabolic remission of Type 2 Diabetes following laparoscopic Roux-en-Y gastric bypass in Asian Indians',
        journal: 'Obesity Surgery',
        year: 2021,
        pmid: '33982190'
      }
    ],
    memberships: [
      'International Federation for the Surgery of Obesity (IFSO, Past World President)',
      'Asia Pacific Hernia Society (APHS, Founder President)',
      'Association of Minimal Access Surgeons of India (AMASI)'
    ],
    languages: ['English', 'Hindi'],
    publicProfiles: [
      { platform: 'Max Healthcare Roster', url: 'https://maxhealthcare.in/doctors/dr-pradeep-chowbey' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://maxhealthcare.in/doctors/dr-pradeep-chowbey',
    primarySourceTitle: 'Max Healthcare Institute Registry',
    dateCollected: '2026-09-12',
    lastVerifiedDate: '2026-09-23',
    confidenceScore: 99,
    bio: 'Pioneer of laparoscopic and minimal access surgery in the Asian subcontinent, recipient of the Padma Shri, who has performed over 85,000 surgical procedures.'
  },
  {
    id: 'doc-24',
    name: 'Dr. V. Ramesh',
    title: 'Dr.',
    specialization: 'Dermatology',
    subSpecialization: 'Autoimmune Bullous Diseases, Severe Psoriasis & Leprosy',
    qualifications: [
      { degree: 'MBBS', institute: 'Madras Medical College', year: 1981 },
      { degree: 'MD (Dermatology & Venereology)', institute: 'AIIMS, New Delhi', year: 1985 }
    ],
    hospital: 'Vardhman Mahavir Medical College & Safdarjung Hospital',
    hospitalDepartment: 'Department of Dermatology, Venereology & Leprology',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    experienceYears: 39,
    areasOfExpertise: [
      'Pemphigus Vulgaris & Autoimmune Blistering Dermatoses',
      'Biologic Therapy in Moderate-to-Severe Plaque Psoriasis',
      'Severe Cutaneous Adverse Reactions (SCAR, SJS/TEN)',
      'Refractory Eczema & Atopic Dermatitis Dupilumab Regimens',
      'Cutaneous Tuberculosis & Leprosy Neuropathy'
    ],
    publications: [
      {
        title: 'Rituximab versus dexamethasone-cyclophosphamide pulse therapy in pemphigus vulgaris: 5-year randomized trial',
        journal: 'British Journal of Dermatology (BJD)',
        year: 2022,
        pmid: '35712109',
        doi: '10.1111/bjd.21731'
      }
    ],
    memberships: [
      'Indian Association of Dermatologists, Venereologists and Leprologists (IADVL)',
      'International Society of Dermatology',
      'National Academy of Medical Sciences'
    ],
    languages: ['English', 'Hindi', 'Tamil'],
    publicProfiles: [
      { platform: 'Safdarjung Hospital Faculty', url: 'https://vmmc-sjh.nic.in/faculty/dr-v-ramesh' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://vmmc-sjh.nic.in/faculty/dr-v-ramesh',
    primarySourceTitle: 'Safdarjung Hospital Faculty Register',
    dateCollected: '2026-09-10',
    lastVerifiedDate: '2026-09-24',
    confidenceScore: 98,
    bio: 'Distinguished professor of dermatology at Safdarjung Hospital, leading clinical investigator in immunobullous diseases and dermatologic pharmacotherapy.'
  },
  {
    id: 'doc-25',
    name: 'Dr. Jacob John',
    title: 'Dr.',
    specialization: 'Pediatrics',
    subSpecialization: 'Pediatric Infectious Diseases, Virology & Immunization',
    qualifications: [
      { degree: 'MBBS', institute: 'Christian Medical College (CMC), Vellore', year: 1973 },
      { degree: 'MD (Pediatrics)', institute: 'CMC Vellore', year: 1978 },
      { degree: 'PhD in Medical Virology', institute: 'University of Newcastle, UK', year: 1984 }
    ],
    hospital: 'Christian Medical College (CMC)',
    hospitalDepartment: 'Department of Child Health & Clinical Virology',
    city: 'Vellore',
    state: 'Tamil Nadu',
    country: 'India',
    experienceYears: 46,
    areasOfExpertise: [
      'Pediatric Sepsis & Fever of Unknown Origin (FUO)',
      'Childhood Immunization Schedules & Vaccine Hesitancy',
      'Rotavirus & Enterovirus Neuro-infections',
      'Pediatric Tuberculosis Diagnosis & Multidrug Regimens',
      'Severe Pediatric Pneumonia & Bronchiolitis Management'
    ],
    publications: [
      {
        title: 'Oral versus inactivated poliovirus vaccine efficacy: A 30-year epidemiological cohort',
        journal: 'The New England Journal of Medicine (NEJM)',
        year: 2021,
        pmid: '34347952'
      }
    ],
    memberships: [
      'Indian Academy of Pediatrics (IAP, Past President)',
      'World Health Organization Strategic Advisory Group of Experts (SAGE)',
      'National Academy of Medical Sciences'
    ],
    languages: ['English', 'Tamil', 'Malayalam'],
    publicProfiles: [
      { platform: 'CMC Vellore Portal', url: 'https://cmch-vellore.edu/faculty/dr-jacob-john' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://cmch-vellore.edu/faculty/dr-jacob-john',
    primarySourceTitle: 'CMC Vellore Academic Directory',
    dateCollected: '2026-09-11',
    lastVerifiedDate: '2026-09-22',
    confidenceScore: 99,
    bio: 'Renowned pediatric virologist at CMC Vellore whose research was instrumental in the global and national eradication of poliomyelitis and the introduction of pediatric rotavirus vaccines.'
  },
  {
    id: 'doc-26',
    name: 'Dr. Sanjay Behari',
    title: 'Dr.',
    specialization: 'Neurosurgery',
    subSpecialization: 'Skull Base Surgery, Cerebrovascular & Brain Tumors',
    qualifications: [
      { degree: 'MBBS', institute: 'King George Medical College, Lucknow', year: 1988 },
      { degree: 'MS (General Surgery)', institute: 'KGMC, Lucknow', year: 1991 },
      { degree: 'MCh (Neurosurgery)', institute: 'Sanjay Gandhi PGIMS, Lucknow', year: 1995 }
    ],
    hospital: 'Sanjay Gandhi Postgraduate Institute of Medical Sciences (SGPGIMS)',
    hospitalDepartment: 'Head, Department of Neurosurgery',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    country: 'India',
    experienceYears: 31,
    areasOfExpertise: [
      'Complex Craniovertebral Junction Anomalies Reconstruction',
      'Cerebral Aneurysm Clipping & Arteriovenous Malformation (AVM)',
      'Skull Base Pituitary Adenoma Endoscopic Endonasal Resection',
      'High-Grade Glioblastoma Awake Craniotomy with Neuromonitoring',
      'Traumatic Brain Injury & Decompressive Craniectomy'
    ],
    publications: [
      {
        title: 'Long-term functional outcomes after endoscopic endonasal transsphenoidal pituitary tumor surgery',
        journal: 'Journal of Neurosurgery',
        year: 2022,
        pmid: '35178921'
      }
    ],
    memberships: [
      'Neurological Society of India (NSI, President)',
      'World Federation of Neurosurgical Societies (WFNS)',
      'Skull Base Surgery Society of India'
    ],
    languages: ['English', 'Hindi'],
    publicProfiles: [
      { platform: 'SGPGIMS Faculty Portal', url: 'https://sgpgi.ac.in/faculty/dr-sanjay-behari' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://sgpgi.ac.in/faculty/dr-sanjay-behari',
    primarySourceTitle: 'SGPGIMS Neurosurgery Faculty Registry',
    dateCollected: '2026-09-14',
    lastVerifiedDate: '2026-09-25',
    confidenceScore: 98,
    bio: 'Director and Head of Neurosurgery at SGPGIMS Lucknow, renowned for craniovertebral junction realignment and complex skull base tumor surgery.'
  },
  {
    id: 'doc-27',
    name: 'Dr. Anupam Sibal',
    title: 'Dr.',
    specialization: 'Pediatrics',
    subSpecialization: 'Pediatric Gastroenterology, Hepatology & Liver Transplant',
    qualifications: [
      { degree: 'MBBS', institute: 'Maulana Azad Medical College, Delhi', year: 1990 },
      { degree: 'MD (Pediatrics)', institute: 'Lady Hardinge Medical College, Delhi', year: 1994 },
      { degree: 'FRCPCH', institute: 'Royal College of Paediatrics and Child Health, UK', year: 2001 }
    ],
    hospital: 'Indraprastha Apollo Hospitals',
    hospitalDepartment: 'Group Medical Director & Pediatric Gastroenterology',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    experienceYears: 30,
    areasOfExpertise: [
      'Pediatric Liver Transplantation (over 500 transplants)',
      'Biliary Atresia & Neonatal Cholestasis Syndrome',
      'Pediatric Celiac Disease & Inflammatory Bowel Disease (IBD)',
      'Acute Liver Failure in Children & Exchange Transfusion',
      'Pediatric Endoscopy & Foreign Body Removal'
    ],
    publications: [
      {
        title: 'Twenty-year survival and quality of life following pediatric living-donor liver transplantation in India',
        journal: 'Pediatric Transplantation',
        year: 2023,
        pmid: '37210943'
      }
    ],
    memberships: [
      'International Pediatric Transplant Association (IPTA)',
      'Commonwealth Association of Paediatric Gastroenterology and Nutrition (CAPGAN)',
      'Indian Academy of Pediatrics'
    ],
    languages: ['English', 'Hindi'],
    publicProfiles: [
      { platform: 'Apollo Hospitals Portal', url: 'https://apollohospitals.com/doctors/dr-anupam-sibal' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://apollohospitals.com/doctors/dr-anupam-sibal',
    primarySourceTitle: 'Indraprastha Apollo Medical Staff Directory',
    dateCollected: '2026-09-15',
    lastVerifiedDate: '2026-09-24',
    confidenceScore: 98,
    bio: 'Group Medical Director of Apollo Hospitals Group, who established the first successful pediatric liver transplant program in India in 1998.'
  },
  {
    id: 'doc-28',
    name: 'Dr. Manish Bansal',
    title: 'Dr.',
    specialization: 'Cardiology',
    subSpecialization: 'Clinical Cardiology, Preventive Cardiology & Advanced Echocardiography',
    qualifications: [
      { degree: 'MBBS', institute: 'AIIMS, New Delhi', year: 2000 },
      { degree: 'MD (General Medicine)', institute: 'AIIMS, New Delhi', year: 2003 },
      { degree: 'DM (Cardiology)', institute: 'AIIMS, New Delhi', year: 2006 },
      { degree: 'Postdoctoral Fellowship in Non-invasive Cardiology', institute: 'University of Queensland, Australia', year: 2009 }
    ],
    hospital: 'Medanta - The Medicity',
    hospitalDepartment: 'Division of Clinical & Preventive Cardiology',
    city: 'Gurugram',
    state: 'Haryana',
    country: 'India',
    experienceYears: 20,
    areasOfExpertise: [
      'Advanced 3D Speckle Tracking Echocardiography & Strain Imaging',
      'Cardiovascular Risk Stratification & Lipidology',
      'Heart Failure with Preserved Ejection Fraction (HFpEF)',
      'Valvular Heart Disease Hemodynamic Assessment',
      'Coronary Artery Disease Primary Prevention'
    ],
    publications: [
      {
        title: 'Global longitudinal strain assessment in subclinical hypertensive heart disease',
        journal: 'Journal of the American Society of Echocardiography (JASE)',
        year: 2022,
        pmid: '35901243'
      }
    ],
    memberships: [
      'American Society of Echocardiography (FASE)',
      'European Association of Cardiovascular Imaging (EACVI)',
      'Cardiological Society of India'
    ],
    languages: ['English', 'Hindi'],
    publicProfiles: [
      { platform: 'Medanta Hospital Faculty', url: 'https://medanta.org/doctors/dr-manish-bansal' }
    ],
    verificationStatus: 'verified',
    trustTier: 1,
    primarySourceUrl: 'https://medanta.org/doctors/dr-manish-bansal',
    primarySourceTitle: 'Medanta Heart Institute Official Faculty Register',
    dateCollected: '2026-09-18',
    lastVerifiedDate: '2026-09-24',
    confidenceScore: 98,
    bio: 'Director of Clinical and Preventive Cardiology at Medanta, an international leader in echocardiographic strain imaging and preventative cardiovascular risk mitigation.'
  }
];

export const ADDITIONAL_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'doc-guideline-abdomen',
    title: 'World Society of Emergency Surgery (WSES) Guidelines: Acute Appendicitis & Peritonitis',
    type: 'pdf',
    sourceUrl: 'https://wses.biomedcentral.com/articles/appendicitis-guidelines-2026',
    tier: 1,
    uploadDate: '2026-09-22T08:00:00Z',
    status: 'processed',
    chunkCount: 3,
    piiRedactedCount: 0,
    extractedDoctors: ['Dr. Pradeep Chowbey', 'Dr. Praveen Aggarwal'],
    rawContent: 'Evidence-based protocol for diagnosis and surgical management of acute appendicitis: Alvarado score interpretation, low-dose contrast CT vs graded compression ultrasound, laparoscopic appendectomy timing, antibiotic regimens, and recognition of generalized peritonitis.',
    sizeBytes: 280000,
  },
  {
    id: 'doc-guideline-seizure',
    title: 'International League Against Epilepsy (ILAE) & Neurocritical Care Guidelines: Status Epilepticus',
    type: 'pdf',
    sourceUrl: 'https://ilae.org/guidelines/status-epilepticus-treatment',
    tier: 1,
    uploadDate: '2026-09-23T09:30:00Z',
    status: 'processed',
    chunkCount: 3,
    piiRedactedCount: 0,
    extractedDoctors: ['Dr. Rajesh Verma', 'Dr. Sunita Rao', 'Dr. Sanjay Behari'],
    rawContent: 'Standardized timeline for seizure emergencies: Phase 1 (0-5 min) supportive care, Phase 2 (5-20 min) IV Lorazepam or IM Midazolam, Phase 3 (20-40 min) IV Levetiracetam, Fosphenytoin, or Valproate, Phase 4 (Refractory) general anesthesia and continuous EEG monitoring.',
    sizeBytes: 310000,
  },
  {
    id: 'doc-guideline-liver',
    title: 'AASLD & APASL Clinical Practice Guidelines: Cirrhosis, Ascites & Hepatic Encephalopathy',
    type: 'pdf',
    sourceUrl: 'https://aasld.org/guidelines/cirrhosis-portal-hypertension',
    tier: 1,
    uploadDate: '2026-09-23T14:15:00Z',
    status: 'processed',
    chunkCount: 3,
    piiRedactedCount: 0,
    extractedDoctors: ['Dr. Shiv Kumar Sarin', 'Dr. Farhan Qureshi', 'Dr. Anupam Sibal'],
    rawContent: 'Comprehensive clinical approach to cirrhosis decompensation: diagnostic paracentesis and SAAG calculation, dietary sodium restriction, spironolactone and furosemide titration, lactulose and rifaximin dosing for encephalopathy, non-selective beta-blockers for varices, and MELD-Na calculation.',
    sizeBytes: 360000,
  },
  {
    id: 'doc-guideline-sepsis',
    title: 'Surviving Sepsis Campaign International Guidelines: Sepsis-3 & Septic Shock Management',
    type: 'pdf',
    sourceUrl: 'https://survivingsepsis.org/guidelines/sepsis-bundle-2026',
    tier: 1,
    uploadDate: '2026-09-24T10:00:00Z',
    status: 'processed',
    chunkCount: 3,
    piiRedactedCount: 0,
    extractedDoctors: ['Dr. Praveen Aggarwal', 'Dr. V. Ramasubramanian'],
    rawContent: 'Hour-1 Sepsis Bundle: measure serum lactate, obtain blood cultures x2 prior to antibiotics, administer broad-spectrum empiric IV antimicrobials, administer 30 mL/kg IV balanced crystalloid for hypotension (MAP <65) or lactate >=4 mmol/L, apply norepinephrine vasopressor to target MAP >=65 mmHg.',
    sizeBytes: 345000,
  },
  {
    id: 'doc-guideline-thyroid',
    title: 'American Thyroid Association (ATA) Guidelines: Hypothyroidism, Hyperthyroidism & Thyroid Storm',
    type: 'pdf',
    sourceUrl: 'https://thyroid.org/guidelines/adult-hypo-hyperthyroid-2026',
    tier: 2,
    uploadDate: '2026-09-24T13:00:00Z',
    status: 'processed',
    chunkCount: 3,
    piiRedactedCount: 0,
    extractedDoctors: ['Dr. Ambrish Mithal'],
    rawContent: 'Diagnostic and therapeutic algorithms for thyroid disorders: TSH and free T4 assays, levothyroxine replacement dosing (1.6 mcg/kg/day), methimazole vs propylthiouracil in Graves disease, Burch-Wartofsky score for Thyroid Storm, and beta-blocker/iodine emergency stabilization.',
    sizeBytes: 295000,
  },
  {
    id: 'doc-guideline-pharmacology',
    title: 'FDA & EMA Clinical Pharmacology Safety Reference: High-Risk Medications & Contraindications',
    type: 'pdf',
    sourceUrl: 'https://fda.gov/drugs/postmarket-drug-safety-information',
    tier: 1,
    uploadDate: '2026-09-25T08:30:00Z',
    status: 'processed',
    chunkCount: 4,
    piiRedactedCount: 0,
    extractedDoctors: ['Dr. Ambrish Mithal', 'Dr. Sanjiv Saxena', 'Dr. Ashok Seth'],
    rawContent: 'Critical black box warnings and safety guidelines: Metformin lactic acidosis and absolute eGFR <30 mL/min cutoff, ACE-inhibitor angioedema and hyperkalemia risk, Statin myopathy and baseline CK/ALT, DOAC bleeding reversal agents, and anaphylaxis vs drug intolerance distinctions.',
    sizeBytes: 410000,
  },
  {
    id: 'doc-guideline-firstaid',
    title: 'American Heart Association (AHA) & ERC Guidelines: Basic & Advanced Life Support (BLS/ACLS)',
    type: 'pdf',
    sourceUrl: 'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines',
    tier: 1,
    uploadDate: '2026-09-25T11:00:00Z',
    status: 'processed',
    chunkCount: 4,
    piiRedactedCount: 0,
    extractedDoctors: ['Dr. Praveen Aggarwal', 'Dr. Devi Prasad Shetty', 'Dr. Naresh Trehan'],
    rawContent: 'Standard protocols for adult and pediatric emergency resuscitation: chest compression rate 100-120/min at depth 5-6 cm (2-2.4 in), 30:2 ratio, early AED defibrillation for VF/pVT, Heimlich maneuver abdominal thrusts for choking, intramuscular Epinephrine 0.3-0.5 mg for anaphylaxis, and burn thermal cooling protocols.',
    sizeBytes: 390000,
  }
];

export const ADDITIONAL_CHUNKS: DocumentChunk[] = [
  {
    id: 'chunk-guideline-abdomen-1',
    documentId: 'doc-guideline-abdomen',
    text: 'Acute Appendicitis Clinical Presentation, Diagnostic Scoring & Surgical Treatment: Acute appendicitis classically begins with dull periumbilical visceral pain that subsequently shifts and localizes to the right lower quadrant (McBurney point) over 12-24 hours as the parietal peritoneum becomes inflamed. Hallmark physical signs include tenderness at McBurney point, guarding, rebound tenderness, Rovsing sign (RLQ pain on LLQ palpation), psoas sign, and obturator sign. The Alvarado Score stratifies risk: scores 7-10 strongly indicate appendicitis requiring immediate surgical consultation; scores 4-6 require diagnostic imaging (graded compression ultrasound as first-line in children and pregnant women; contrast-enhanced abdominal CT in adults with high sensitivity >95%). Definitive management is laparoscopic appendectomy. Emergency Warning Signs of Perforation / Peritonitis: Sudden transient relief of localized pain followed by rapid generalized severe abdominal rigidity, high fever (>38.5C / 101.3F), tachycardia, and hypotension indicate appendix rupture and generalized peritonitis, requiring emergent exploratory laparoscopy, extensive peritoneal lavage, and broad-spectrum IV antibiotics.',
    metadata: {
      specialization: 'General Surgery',
      hospital: 'Emergency Surgical Centers',
      sourceUrl: 'https://wses.biomedcentral.com/articles/appendicitis-guidelines-2026',
      sourceTitle: 'World Society of Emergency Surgery (WSES) Appendicitis Guidelines',
      tier: 1,
      verificationStatus: 'verified',
      chunkIndex: 17,
      parentDocTitle: 'World Society of Emergency Surgery Guidelines: Acute Appendicitis & Peritonitis'
    }
  },
  {
    id: 'chunk-guideline-seizure-1',
    documentId: 'doc-guideline-seizure',
    text: 'Seizures, Epilepsy Classification & Status Epilepticus Emergency Protocol: A generalized tonic-clonic seizure presents with sudden loss of consciousness, tonic body stiffening, rhythmic clonic jerking of extremities, tongue biting (typically lateral border), and urinary incontinence, followed by a post-ictal confusional state. Immediate First Aid Protocol: 1) Protect patient from injury by cushioning the head and clearing surrounding sharp objects. 2) Turn patient onto their side in recovery position to keep airway patent and prevent aspiration. 3) DO NOT place any objects, spoons, or fingers in the patient mouth. 4) DO NOT forcefully restrain movements. 5) Time the seizure carefully. Status Epilepticus is defined as a seizure lasting >5 minutes or two or more seizures without full recovery of consciousness between episodes. Emergency Pharmacological Management: At minute 5, administer first-line IV Lorazepam (0.1 mg/kg, typically 4 mg at 2 mg/min) or IM Midazolam (10 mg for adults >40 kg). If seizure persists beyond 10-20 minutes, initiate second-line IV anti-seizure medications: Levetiracetam (60 mg/kg, max 4500 mg), Fosphenytoin (20 mg PE/kg), or Sodium Valproate (40 mg/kg). If refractory status epilepticus persists >30 minutes, transfer to ICU for endotracheal intubation, continuous EEG, and IV anesthetic infusions (Propofol or Midazolam).',
    metadata: {
      specialization: 'Neurology',
      hospital: 'Neurocritical Care Institutes',
      sourceUrl: 'https://ilae.org/guidelines/status-epilepticus-treatment',
      sourceTitle: 'ILAE & Neurocritical Care Status Epilepticus Guidelines',
      tier: 1,
      verificationStatus: 'verified',
      chunkIndex: 18,
      parentDocTitle: 'International League Against Epilepsy (ILAE) & Neurocritical Care Guidelines: Status Epilepticus'
    }
  },
  {
    id: 'chunk-guideline-liver-1',
    documentId: 'doc-guideline-liver',
    text: 'Liver Cirrhosis, Ascites, Hepatic Encephalopathy & Portal Hypertension Management: Liver cirrhosis results from chronic hepatic injury (viral hepatitis B/C, alcohol, metabolic dysfunction-associated steatohepatitis MASLD) with diffuse fibrotic bridging and regenerative nodules. Complications of Decompensated Cirrhosis: 1) Ascites: Diagnostic paracentesis must be performed to calculate Serum-Ascites Albumin Gradient (SAAG); SAAG >=1.1 g/dL confirms portal hypertension. Ascitic fluid polymorphonuclear count (PMN) >=250 cells/mm3 confirms Spontaneous Bacterial Peritonitis (SBP), treated with IV Ceftriaxone. Medical ascites control requires dietary sodium restriction (<2000 mg/day) and dual diuretics (Spironolactone 100 mg + Furosemide 40 mg ratio). 2) Hepatic Encephalopathy: Reversible neuropsychiatric disturbance graded from Grade 1 (mild confusion, sleep inversion) to Grade 4 (coma), with characteristic asterixis (flapping tremor). Treatment includes oral/nasogastric Lactulose titrated to 2-3 soft bowel movements daily, plus Rifaximin 550 mg twice daily. 3) Variceal Bleeding: Primary prophylaxis with non-selective beta-blockers (Carvedilol or Propranolol) or endoscopic band ligation (EBL). In acute hematemesis, start IV Octreotide/Terlipressin, prophylactic Ceftriaxone, and urgent endoscopy within 12 hours.',
    metadata: {
      specialization: 'Gastroenterology',
      hospital: 'Apex Liver & Hepatology Centers',
      sourceUrl: 'https://aasld.org/guidelines/cirrhosis-portal-hypertension',
      sourceTitle: 'AASLD & APASL Cirrhosis and Portal Hypertension Guidelines',
      tier: 1,
      verificationStatus: 'verified',
      chunkIndex: 19,
      parentDocTitle: 'AASLD & APASL Clinical Practice Guidelines: Cirrhosis, Ascites & Hepatic Encephalopathy'
    }
  },
  {
    id: 'chunk-guideline-sepsis-1',
    documentId: 'doc-guideline-sepsis',
    text: 'Sepsis-3 Definitions, Quick SOFA (qSOFA) & Hour-1 Bundle Resuscitation: Sepsis is defined as life-threatening organ dysfunction caused by a dysregulated host response to infection. Quick SOFA (qSOFA) identifies high-risk patients outside the ICU: 1) Respiratory rate >=22 breaths/min, 2) Altered mental status (GCS <15), 3) Systolic blood pressure <=100 mmHg (score >=2 indicates high mortality risk). Septic Shock is a subset of sepsis characterized by profound circulatory, cellular, and metabolic abnormalities, defined clinically as persistent hypotension requiring vasopressors to maintain Mean Arterial Pressure (MAP) >=65 mmHg and serum lactate >2 mmol/L despite adequate fluid resuscitation. Surviving Sepsis Campaign Hour-1 Bundle: 1) Measure blood lactate immediately; remeasure if initial lactate >2 mmol/L. 2) Obtain at least 2 sets of blood cultures (aerobic and anaerobic) BEFORE starting antimicrobial therapy. 3) Administer broad-spectrum empiric intravenous antimicrobials within 1 hour of recognition. 4) Rapidly administer 30 mL/kg of IV balanced crystalloid solution for hypotension or lactate >=4 mmol/L within 3 hours. 5) Apply Norepinephrine as the first-choice vasopressor if patient remains hypotensive during or after fluid loading to achieve target MAP >=65 mmHg.',
    metadata: {
      specialization: 'Emergency Medicine',
      hospital: 'Emergency & Critical Care Centers',
      sourceUrl: 'https://survivingsepsis.org/guidelines/sepsis-bundle-2026',
      sourceTitle: 'Surviving Sepsis Campaign Hour-1 Resuscitation Bundle',
      tier: 1,
      verificationStatus: 'verified',
      chunkIndex: 20,
      parentDocTitle: 'Surviving Sepsis Campaign International Guidelines: Sepsis-3 & Septic Shock Management'
    }
  },
  {
    id: 'chunk-guideline-thyroid-1',
    documentId: 'doc-guideline-thyroid',
    text: 'Thyroid Disorders Diagnosis, Hypo- and Hyperthyroidism & Thyroid Storm Emergency: Thyroid evaluation begins with serum Thyroid-Stimulating Hormone (TSH) and Free Thyroxine (FT4). Primary Hypothyroidism: Elevated TSH with low FT4, most commonly caused by autoimmune Hashimoto thyroiditis (positive anti-TPO and anti-thyroglobulin antibodies). Symptoms: severe fatigue, cold intolerance, weight gain, constipation, dry skin, bradycardia, and delayed deep tendon reflex relaxation. Standard treatment is synthetic Levothyroxine (T4) at full replacement dose of 1.6 mcg/kg/day, taken on an empty stomach 30-60 minutes before breakfast with water, rechecking TSH after 6-8 weeks. Primary Hyperthyroidism: Suppressed TSH (<0.01 mIU/L) with elevated FT4 and/or FT3, most commonly Graves disease (TSH receptor antibodies, ophthalmopathy, pretibial myxedema). Pharmacotherapy: Methimazole (inhibits thyroid peroxidase); Propylthiouracil (PTU) reserved for first trimester of pregnancy and thyroid storm due to peripheral T4 to T3 conversion inhibition. Beta-blockers (Propranolol) provide rapid symptomatic relief of tremor, palpitations, and heat intolerance. Thyroid Storm Emergency: Life-threatening decompensation triggered by infection, surgery, or non-adherence, presenting with hyperpyrexia (>38.5C / 102F), severe tachycardia (>140 bpm), atrial fibrillation, agitation, delirium, and heart failure. Immediate multimodal treatment: 1) IV Beta-blockers (Propranolol or Esmolol), 2) High-dose oral/NG PTU or Methimazole, 3) Saturated solution of potassium iodide (SSKI) or Lugol iodine given 1 hour AFTER antithyroid drug, 4) IV Hydrocortisone (100 mg every 8h), and 5) aggressive cooling.',
    metadata: {
      specialization: 'Endocrinology',
      hospital: 'Endocrine & Metabolic Care Centers',
      sourceUrl: 'https://thyroid.org/guidelines/adult-hypo-hyperthyroid-2026',
      sourceTitle: 'American Thyroid Association (ATA) Clinical Guidelines',
      tier: 2,
      verificationStatus: 'verified',
      chunkIndex: 21,
      parentDocTitle: 'American Thyroid Association Guidelines: Hypothyroidism, Hyperthyroidism & Thyroid Storm'
    }
  },
  {
    id: 'chunk-guideline-pharmacology-1',
    documentId: 'doc-guideline-pharmacology',
    text: 'Clinical Pharmacology & High-Alert Medication Safety Guidelines: 1) Metformin: First-line for Type 2 Diabetes; suppresses hepatic gluconeogenesis. Absolute contraindication: estimated GFR (eGFR) <30 mL/min/1.73m2 due to high risk of life-threatening Metformin-Associated Lactic Acidosis (MALA). Dose reduction recommended if eGFR is 30-44 mL/min (max 1000 mg/day). Must be withheld before iodinated IV contrast procedures in patients with eGFR <60. 2) ACE Inhibitors & ARBs (Lisinopril, Ramipril, Losartan): Common side effect of ACEi is chronic dry cough (up to 15%) due to bradykinin accumulation; can switch to ARB. Severe Adverse Reaction: ACEi-induced Angioedema (life-threatening swelling of tongue, lips, and pharynx mediated by bradykinin). If angioedema occurs, discontinue permanently; do NOT switch to another ACE inhibitor. Monitor for hyperkalemia, especially in combination with potassium-sparing agents. 3) HMG-CoA Reductase Inhibitors (Statins: Atorvastatin, Rosuvastatin): Common adverse effect is statin-associated muscle symptoms (SAMS). If unexplained severe muscle aches occur, check serum Creatine Kinase (CK); CK >10 times upper limit of normal or dark cola-colored urine indicates Rhabdomyolysis requiring immediate drug cessation and IV hydration. 4) Anticoagulants (DOACs vs Warfarin): DOACs (Apixaban, Rivaroxaban) have predictable pharmacokinetics without routine INR monitoring. Specific reversal agents: Idarucizumab for Dabigatran, Andexanet Alfa for Apixaban/Rivaroxaban. For Warfarin, reversal in life-threatening bleeding requires IV Vitamin K (Phytonadione) plus 4-Factor Prothrombin Complex Concentrate (4F-PCC).',
    metadata: {
      specialization: 'Pharmacology',
      hospital: 'Pharmacology & Medication Safety Boards',
      sourceUrl: 'https://fda.gov/drugs/postmarket-drug-safety-information',
      sourceTitle: 'FDA & International Pharmacovigilance Reference Standards',
      tier: 1,
      verificationStatus: 'verified',
      chunkIndex: 22,
      parentDocTitle: 'FDA & EMA Clinical Pharmacology Safety Reference: High-Risk Medications & Contraindications'
    }
  },
  {
    id: 'chunk-guideline-firstaid-1',
    documentId: 'doc-guideline-firstaid',
    text: 'First Aid & Emergency Life Support Protocols (AHA/ERC 2026 Standards): 1) Adult Out-of-Hospital Cardiac Arrest: Check scene safety, confirm unresponsiveness and absence of normal breathing. Shout for nearby help, call emergency medical services immediately, and send someone for an Automated External Defibrillator (AED). High-Quality CPR: Deliver chest compressions in center of chest at rate of 100 to 120 compressions per minute, compressing to a depth of at least 5 cm (2 inches) but no more than 6 cm (2.4 inches), allowing complete chest wall recoil between compressions. Maintain compression-to-ventilation ratio of 30 compressions to 2 breaths, minimizing interruptions to <10 seconds. Apply AED as soon as available and follow vocal prompts. 2) Severe Choking / Foreign Body Airway Obstruction: In conscious adults and children >1 year unable to cough or speak, perform 5 back blows between shoulder blades followed by 5 abdominal thrusts (Heimlich maneuver) inward and upward just above the navel until obstruction is dislodged or patient becomes unresponsive. If unresponsive, immediately begin CPR. 3) Severe Anaphylaxis: Acute onset of respiratory distress (stridor, wheeze, bronchospasm), hypotension, angioedema, or generalized urticaria. First-Line Life-Saving Intervention: Intramuscular (IM) Epinephrine 1:1000 (0.3 to 0.5 mg in adults; 0.15 mg in children 7.5-25 kg) injected immediately into the anterolateral mid-thigh. Repeat in 5-15 minutes if symptoms persist. Position patient supine with legs elevated unless respiratory distress requires sitting. NEVER delay epinephrine for antihistamines or corticosteroids. 4) Thermal Burns First Aid: Remove source of heat, cool burn with clean running tap water for at least 20 minutes (do NOT apply ice or frozen items, which worsen tissue ischemia). Cover with clean, sterile, non-adherent dressing. Seek immediate medical care for burns covering >10% total body surface area, burns to face, hands, feet, groin, or major joints, or full-thickness third-degree burns.',
    metadata: {
      specialization: 'Emergency Medicine',
      hospital: 'Resuscitation Councils & Trauma Emergency Centers',
      sourceUrl: 'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines',
      sourceTitle: 'American Heart Association (AHA) Basic Life Support (BLS) Standards',
      tier: 1,
      verificationStatus: 'verified',
      chunkIndex: 23,
      parentDocTitle: 'American Heart Association & ERC Guidelines: Basic & Advanced Life Support (BLS/ACLS)'
    }
  }
];

export const ADDITIONAL_KG_NODES: KnowledgeGraphNode[] = [
  // Additional Doctors
  { id: 'node-doc-17', label: 'Dr. Praveen Aggarwal', type: 'Doctor', properties: { experience: 37, tier: 1 } },
  { id: 'node-doc-18', label: 'Dr. Shiv Kumar Sarin', type: 'Doctor', properties: { experience: 42, tier: 1 } },
  { id: 'node-doc-19', label: 'Dr. D. Nageshwar Reddy', type: 'Doctor', properties: { experience: 40, tier: 1 } },
  { id: 'node-doc-20', label: 'Dr. Firuza Parikh', type: 'Doctor', properties: { experience: 36, tier: 1 } },
  { id: 'node-doc-21', label: 'Dr. S. Rajasekaran', type: 'Doctor', properties: { experience: 40, tier: 1 } },
  { id: 'node-doc-22', label: 'Dr. V. Ramasubramanian', type: 'Doctor', properties: { experience: 34, tier: 1 } },
  { id: 'node-doc-23', label: 'Dr. Pradeep Chowbey', type: 'Doctor', properties: { experience: 44, tier: 1 } },
  { id: 'node-doc-24', label: 'Dr. V. Ramesh', type: 'Doctor', properties: { experience: 39, tier: 1 } },
  { id: 'node-doc-25', label: 'Dr. Jacob John', type: 'Doctor', properties: { experience: 46, tier: 1 } },
  { id: 'node-doc-26', label: 'Dr. Sanjay Behari', type: 'Doctor', properties: { experience: 31, tier: 1 } },
  { id: 'node-doc-27', label: 'Dr. Anupam Sibal', type: 'Doctor', properties: { experience: 30, tier: 1 } },
  { id: 'node-doc-28', label: 'Dr. Manish Bansal', type: 'Doctor', properties: { experience: 20, tier: 1 } },

  // Additional Specializations
  { id: 'node-spec-em', label: 'Emergency Medicine', type: 'Specialization', properties: {} },
  { id: 'node-spec-obgyn', label: 'Obstetrics & Gynecology', type: 'Specialization', properties: {} },
  { id: 'node-spec-id', label: 'Infectious Diseases', type: 'Specialization', properties: {} },
  { id: 'node-spec-gensurg', label: 'General Surgery', type: 'Specialization', properties: {} },
  { id: 'node-spec-derm', label: 'Dermatology', type: 'Specialization', properties: {} },
  { id: 'node-spec-neurosurg', label: 'Neurosurgery', type: 'Specialization', properties: {} },

  // Additional Hospitals
  { id: 'node-hosp-ilbs', label: 'Institute of Liver & Biliary Sciences (ILBS)', type: 'Hospital', properties: { beds: 450 } },
  { id: 'node-hosp-jaslok', label: 'Jaslok Hospital & Research Centre', type: 'Hospital', properties: { beds: 350 } },
  { id: 'node-hosp-ganga', label: 'Ganga Hospital', type: 'Hospital', properties: { beds: 650 } },
  { id: 'node-hosp-apollo-chennai', label: 'Apollo Hospitals Chennai', type: 'Hospital', properties: { beds: 600 } },
  { id: 'node-hosp-safdarjung', label: 'VMMC & Safdarjung Hospital', type: 'Hospital', properties: { beds: 2800 } },
  { id: 'node-hosp-cmc', label: 'Christian Medical College (CMC)', type: 'Hospital', properties: { beds: 2500 } },
  { id: 'node-hosp-sgpgi', label: 'Sanjay Gandhi PGIMS', type: 'Hospital', properties: { beds: 1100 } },

  // Additional Cities
  { id: 'node-city-chennai', label: 'Chennai', type: 'City', properties: { state: 'Tamil Nadu' } },
  { id: 'node-city-vellore', label: 'Vellore', type: 'City', properties: { state: 'Tamil Nadu' } },
  { id: 'node-city-lucknow', label: 'Lucknow', type: 'City', properties: { state: 'Uttar Pradesh' } }
];

export const ADDITIONAL_KG_EDGES: KnowledgeGraphEdge[] = [
  // Doctor Specializations
  { id: 'edge-doc-17-spec', source: 'node-doc-17', target: 'node-spec-em', relationship: 'specializes_in' },
  { id: 'edge-doc-18-spec', source: 'node-doc-18', target: 'node-spec-gastro', relationship: 'specializes_in' },
  { id: 'edge-doc-19-spec', source: 'node-doc-19', target: 'node-spec-gastro', relationship: 'specializes_in' },
  { id: 'edge-doc-20-spec', source: 'node-doc-20', target: 'node-spec-obgyn', relationship: 'specializes_in' },
  { id: 'edge-doc-21-spec', source: 'node-doc-21', target: 'node-spec-ortho', relationship: 'specializes_in' },
  { id: 'edge-doc-22-spec', source: 'node-doc-22', target: 'node-spec-id', relationship: 'specializes_in' },
  { id: 'edge-doc-23-spec', source: 'node-doc-23', target: 'node-spec-gensurg', relationship: 'specializes_in' },
  { id: 'edge-doc-24-spec', source: 'node-doc-24', target: 'node-spec-derm', relationship: 'specializes_in' },
  { id: 'edge-doc-25-spec', source: 'node-doc-25', target: 'node-spec-peds', relationship: 'specializes_in' },
  { id: 'edge-doc-26-spec', source: 'node-doc-26', target: 'node-spec-neurosurg', relationship: 'specializes_in' },
  { id: 'edge-doc-27-spec', source: 'node-doc-27', target: 'node-spec-peds', relationship: 'specializes_in' },
  { id: 'edge-doc-28-spec', source: 'node-doc-28', target: 'node-spec-cardio', relationship: 'specializes_in' },

  // Doctor Hospitals
  { id: 'edge-doc-17-hosp', source: 'node-doc-17', target: 'node-hosp-aiims-rpc', relationship: 'works_at' },
  { id: 'edge-doc-18-hosp', source: 'node-doc-18', target: 'node-hosp-ilbs', relationship: 'works_at' },
  { id: 'edge-doc-19-hosp', source: 'node-doc-19', target: 'node-hosp-aig', relationship: 'works_at' },
  { id: 'edge-doc-20-hosp', source: 'node-doc-20', target: 'node-hosp-jaslok', relationship: 'works_at' },
  { id: 'edge-doc-21-hosp', source: 'node-doc-21', target: 'node-hosp-ganga', relationship: 'works_at' },
  { id: 'edge-doc-22-hosp', source: 'node-doc-22', target: 'node-hosp-apollo-chennai', relationship: 'works_at' },
  { id: 'edge-doc-23-hosp', source: 'node-doc-23', target: 'node-hosp-max-saket', relationship: 'works_at' },
  { id: 'edge-doc-24-hosp', source: 'node-doc-24', target: 'node-hosp-safdarjung', relationship: 'works_at' },
  { id: 'edge-doc-25-hosp', source: 'node-doc-25', target: 'node-hosp-cmc', relationship: 'works_at' },
  { id: 'edge-doc-26-hosp', source: 'node-doc-26', target: 'node-hosp-sgpgi', relationship: 'works_at' },
  { id: 'edge-doc-27-hosp', source: 'node-doc-27', target: 'node-hosp-apollo-delhi', relationship: 'works_at' },
  { id: 'edge-doc-28-hosp', source: 'node-doc-28', target: 'node-hosp-medanta', relationship: 'works_at' },

  // Hospitals located in cities
  { id: 'edge-hosp-ilbs-city', source: 'node-hosp-ilbs', target: 'node-city-delhi', relationship: 'located_in' },
  { id: 'edge-hosp-jaslok-city', source: 'node-hosp-jaslok', target: 'node-city-mumbai', relationship: 'located_in' },
  { id: 'edge-hosp-ganga-city', source: 'node-hosp-ganga', target: 'node-city-chennai', relationship: 'located_in' },
  { id: 'edge-hosp-apollo-chennai-city', source: 'node-hosp-apollo-chennai', target: 'node-city-chennai', relationship: 'located_in' },
  { id: 'edge-hosp-safdarjung-city', source: 'node-hosp-safdarjung', target: 'node-city-delhi', relationship: 'located_in' },
  { id: 'edge-hosp-cmc-city', source: 'node-hosp-cmc', target: 'node-city-vellore', relationship: 'located_in' },
  { id: 'edge-hosp-sgpgi-city', source: 'node-hosp-sgpgi', target: 'node-city-lucknow', relationship: 'located_in' },

  // Hospital offers
  { id: 'edge-hosp-ilbs-offers', source: 'node-hosp-ilbs', target: 'node-spec-gastro', relationship: 'offers' },
  { id: 'edge-hosp-jaslok-offers', source: 'node-hosp-jaslok', target: 'node-spec-obgyn', relationship: 'offers' },
  { id: 'edge-hosp-ganga-offers', source: 'node-hosp-ganga', target: 'node-spec-ortho', relationship: 'offers' },
  { id: 'edge-hosp-apollo-chennai-offers', source: 'node-hosp-apollo-chennai', target: 'node-spec-id', relationship: 'offers' },
  { id: 'edge-hosp-safdarjung-offers', source: 'node-hosp-safdarjung', target: 'node-spec-derm', relationship: 'offers' },
  { id: 'edge-hosp-cmc-offers', source: 'node-hosp-cmc', target: 'node-spec-peds', relationship: 'offers' },
  { id: 'edge-hosp-sgpgi-offers', source: 'node-hosp-sgpgi', target: 'node-spec-neurosurg', relationship: 'offers' }
];
