import type { FarmerProfile, SoilTestRecord, ActivityRecord, SoilObservation, CostScenario } from '../types';

export const demoProfile: FarmerProfile = {
  id: 'demo-farmer-001',
  name: 'Ramesh Patil',
  village: 'Wadgaon',
  district: 'Pune',
  state: 'Maharashtra',
  primaryCrop: 'Soybean',
  farmArea: 2.5,
  farmAreaUnit: 'acres',
  farmingType: 'mixed',
  createdAt: '2026-06-15T10:00:00Z',
  updatedAt: '2026-06-15T10:00:00Z',
};

export const demoSoilTests: SoilTestRecord[] = [
  {
    id: 'demo-soil-001',
    farmName: 'Main Field',
    village: 'Wadgaon',
    state: 'Maharashtra',
    crop: 'Soybean',
    season: 'kharif',
    farmArea: 2.5,
    farmAreaUnit: 'acres',
    testDate: '2026-06-01',
    notes: 'Soil sample from north-east corner of the field. Demo data for illustration.',
    isDemo: true,
    parameters: {
      pH: 7.2,
      ec: 0.45,
      organicCarbon: 0.52,
      nitrogen: 245,
      phosphorus: 18.5,
      potassium: 195,
      sulphur: 12.3,
      zinc: 0.48,
      iron: 5.2,
    },
    createdAt: '2026-06-05T10:00:00Z',
    updatedAt: '2026-06-05T10:00:00Z',
  },
  {
    id: 'demo-soil-002',
    farmName: 'Main Field',
    village: 'Wadgaon',
    state: 'Maharashtra',
    crop: 'Wheat',
    season: 'rabi',
    farmArea: 2.5,
    farmAreaUnit: 'acres',
    testDate: '2026-01-10',
    notes: 'Pre-season Rabi test. Demo data for illustration.',
    isDemo: true,
    parameters: {
      pH: 7.4,
      ec: 0.52,
      organicCarbon: 0.48,
      nitrogen: 230,
      phosphorus: 20.1,
      potassium: 185,
      zinc: 0.45,
    },
    createdAt: '2026-01-12T10:00:00Z',
    updatedAt: '2026-01-12T10:00:00Z',
  },
];

export const demoActivities: ActivityRecord[] = [
  {
    id: 'demo-act-001',
    date: '2026-06-05',
    type: 'soil-test',
    title: 'Soil test recorded',
    description: 'Kharif season soil test results for Main Field (demo data).',
    relatedId: 'demo-soil-001',
  },
  {
    id: 'demo-act-002',
    date: '2026-06-01',
    type: 'profile-updated',
    title: 'Farm profile created',
    description: 'Initial farm profile setup (demo data).',
  },
  {
    id: 'demo-act-003',
    date: '2026-01-12',
    type: 'soil-test',
    title: 'Rabi soil test recorded',
    description: 'Pre-season soil test for Rabi wheat (demo data).',
    relatedId: 'demo-soil-002',
  },
];

export const demoObservations: SoilObservation[] = [
  {
    id: 'demo-obs-001',
    date: '2026-06-10',
    type: 'observation',
    title: 'Earthworm activity noted',
    description: 'Observed moderate earthworm presence in the top 15cm of soil after applying compost. This is a demo observation for illustration purposes.',
    relatedPractice: 'Composting',
    createdAt: '2026-06-10T10:00:00Z',
  },
  {
    id: 'demo-obs-002',
    date: '2026-03-15',
    type: 'note',
    title: 'Mulching applied to wheat field',
    description: 'Applied dried crop residue mulch to wheat field. Thickness approximately 3-4 inches. Demo note.',
    relatedPractice: 'Mulching',
    createdAt: '2026-03-15T10:00:00Z',
  },
];

export const demoCostScenarios: CostScenario[] = [
  {
    id: 'demo-cost-current',
    name: 'Current Practice - Soybean',
    type: 'current',
    crop: 'Soybean',
    season: 'Kharif 2026',
    farmArea: 2.5,
    farmAreaUnit: 'acres',
    entries: [
      { id: 'demo-ce-001', scenarioId: 'demo-cost-current', category: 'seeds', description: 'Soybean seeds (JS-335)', quantity: 30, unit: 'kg', pricePerUnit: 80, totalCost: 2400, createdAt: '2026-06-01T10:00:00Z' },
      { id: 'demo-ce-002', scenarioId: 'demo-cost-current', category: 'fertilizers', description: 'DAP', quantity: 50, unit: 'kg', pricePerUnit: 27, totalCost: 1350, createdAt: '2026-06-01T10:00:00Z' },
      { id: 'demo-ce-003', scenarioId: 'demo-cost-current', category: 'fertilizers', description: 'Urea', quantity: 25, unit: 'kg', pricePerUnit: 6, totalCost: 150, createdAt: '2026-06-01T10:00:00Z' },
      { id: 'demo-ce-004', scenarioId: 'demo-cost-current', category: 'crop-protection', description: 'Pesticide spray', quantity: 2, unit: 'applications', pricePerUnit: 800, totalCost: 1600, createdAt: '2026-06-01T10:00:00Z' },
      { id: 'demo-ce-005', scenarioId: 'demo-cost-current', category: 'labour', description: 'Field preparation and sowing', quantity: 8, unit: 'days', pricePerUnit: 350, totalCost: 2800, createdAt: '2026-06-01T10:00:00Z' },
      { id: 'demo-ce-006', scenarioId: 'demo-cost-current', category: 'labour', description: 'Weeding and maintenance', quantity: 6, unit: 'days', pricePerUnit: 350, totalCost: 2100, createdAt: '2026-06-01T10:00:00Z' },
      { id: 'demo-ce-007', scenarioId: 'demo-cost-current', category: 'irrigation', description: 'Irrigation (2 supplementary)', quantity: 2, unit: 'sessions', pricePerUnit: 500, totalCost: 1000, createdAt: '2026-06-01T10:00:00Z' },
    ],
    harvestedQty: 12,
    harvestedUnit: 'quintals',
    soldQty: 11,
    sellingPrice: 4600,
    sellingPriceUnit: 'per quintal',
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z',
  },
];

export function getInitialDemoData() {
  return {
    profile: demoProfile,
    soilTests: demoSoilTests,
    activities: demoActivities,
    observations: demoObservations,
    costScenarios: demoCostScenarios,
    farmingPlans: [],
    savedArticles: [] as string[],
    savedPractices: [] as string[],
  };
}
