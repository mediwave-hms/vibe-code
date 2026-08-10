export const SPECIALTIES: string[] = [
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Internal Medicine',
  'Family Medicine',
  'Emergency Medicine',
  'Orthopedics',
  'Dermatology',
  'Ophthalmology',
  'Psychiatry',
  'Radiology',
  'Anesthesiology',
];

export const ROOMS: string[] = [
  'Cardiology Suite',
  'Exam Room 1',
  'Exam Room 2',
  'Exam Room 3',
  'Exam Room 4',
  'Exam Room 5',
  'ICU Bay 3',
  'Neurology Suite',
  'Pediatrics Clinic A',
  'Treatment Room B',
];

export const COMMON_DIAGNOSES: string[] = [
  'Essential (primary) hypertension',
  'Type 2 diabetes mellitus without complications',
  'Asthma, unspecified',
  'Chronic obstructive pulmonary disease',
  'Major depressive disorder, single episode',
  'Generalized anxiety disorder',
  'Acute upper respiratory infection',
  'Gastroesophageal reflux disease',
  'Osteoarthritis of knee',
  'Migraine, intractable, without status migrainosus',
  'Atrial fibrillation, unspecified',
  'Hypothyroidism, unspecified',
  'Hyperlipidemia, unspecified',
  'Low back pain, unspecified',
  'Attention-deficit hyperactivity disorder',
];

export const COMMON_MEDICATIONS: string[] = [
  'Lisinopril',
  'Metformin',
  'Atorvastatin',
  'Amlodipine',
  'Metoprolol succinate',
  'Omeprazole',
  'Losartan',
  'Albuterol',
  'Gabapentin',
  'Hydrochlorothiazide',
  'Sertraline',
  'Levothyroxine',
  'Acetaminophen/Hydrocodone',
  'Aripiprazole',
  'Prednisone',
];

export interface ICD10Snippet {
  code: string;
  description: string;
}

export const ICD10_SNIPPETS: ICD10Snippet[] = [
  { code: 'I10', description: 'Essential (primary) hypertension' },
  { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
  { code: 'J45.909', description: 'Asthma, unspecified, uncomplicated' },
  { code: 'F41.1', description: 'Generalized anxiety disorder' },
  { code: 'M25.561', description: 'Pain in right knee' },
  { code: 'G43.909', description: 'Migraine, unspecified, not intractable, without status migrainosus' },
  { code: 'I48.91', description: 'Unspecified atrial fibrillation' },
  { code: 'E03.9', description: 'Hypothyroidism, unspecified' },
  { code: 'E78.5', description: 'Hyperlipidemia, unspecified' },
  { code: 'M54.5', description: 'Low back pain' },
];
