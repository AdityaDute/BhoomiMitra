export interface FarmerProfile {
  id: string;
  name: string;
  village: string;
  district: string;
  state: string;
  primaryCrop: string;
  farmArea: number;
  farmAreaUnit: 'acres' | 'hectares' | 'bigha';
  farmingType: 'conventional' | 'organic' | 'natural' | 'mixed';
  createdAt: string;
  updatedAt: string;
}

export interface SoilTestRecord {
  id: string;
  farmName: string;
  village: string;
  state: string;
  crop: string;
  season: 'kharif' | 'rabi' | 'zaid' | 'annual';
  farmArea: number;
  farmAreaUnit: 'acres' | 'hectares' | 'bigha';
  testDate: string;
  notes: string;
  isDemo: boolean;
  parameters: SoilParameters;
  createdAt: string;
  updatedAt: string;
}

export interface SoilParameters {
  pH?: number;
  ec?: number; // dS/m
  organicCarbon?: number; // %
  nitrogen?: number; // kg/ha
  phosphorus?: number; // kg/ha
  potassium?: number; // kg/ha
  sulphur?: number; // mg/kg
  zinc?: number; // mg/kg
  iron?: number; // mg/kg
  manganese?: number; // mg/kg
  copper?: number; // mg/kg
  boron?: number; // mg/kg
}

export type SoilParameterKey = keyof SoilParameters;

export type InterpretationLevel = 'low' | 'medium' | 'high' | 'very-high' | 'acidic' | 'neutral' | 'alkaline' | 'saline' | 'normal' | 'deficient' | 'sufficient' | 'excessive' | 'pending';

export interface SoilInterpretation {
  parameter: string;
  value: number;
  unit: string;
  level: InterpretationLevel;
  label: string;
  description: string;
  recommendation: string;
  source: string;
  reviewStatus: 'verified' | 'pending-review' | 'demo';
}

export interface FarmingPractice {
  id: string;
  name: string;
  category: 'composting' | 'soil-amendment' | 'pest-management' | 'crop-management' | 'water-management' | 'seed-treatment';
  system: 'organic' | 'zbnf' | 'both';
  purpose: string;
  description: string;
  preparation: string;
  application: string;
  resources: string[];
  timing: string;
  precautions: string[];
  expectedBenefits: string[];
  source: string;
  verificationStatus: 'verified' | 'pending-review' | 'demo';
  suitableCrops: string[];
  suitableSeasons: string[];
}

export interface FarmingPlan {
  id: string;
  name: string;
  crop: string;
  season: string;
  practices: string[]; // practice IDs
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CostEntry {
  id: string;
  scenarioId: string;
  category: 'seeds' | 'fertilizers' | 'natural-inputs' | 'labour' | 'irrigation' | 'crop-protection' | 'transportation' | 'other';
  description: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalCost: number;
  createdAt: string;
}

export interface CostScenario {
  id: string;
  name: string;
  type: 'current' | 'proposed';
  crop: string;
  season: string;
  farmArea: number;
  farmAreaUnit: string;
  entries: CostEntry[];
  harvestedQty?: number;
  harvestedUnit?: string;
  soldQty?: number;
  sellingPrice?: number;
  sellingPriceUnit?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SoilObservation {
  id: string;
  date: string;
  type: 'measurement' | 'observation' | 'note';
  title: string;
  description: string;
  relatedTestId?: string;
  relatedPractice?: string;
  createdAt: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'soil-health' | 'organic-farming' | 'natural-farming' | 'composting' | 'crop-rotation' | 'soil-testing' | 'farm-economics';
  sourceOrg: string;
  sourceTitle: string;
  sourceUrl?: string;
  lastReviewed?: string;
  reviewStatus: 'verified' | 'pending-review' | 'demo';
  isSaved?: boolean;
}

export interface ActivityRecord {
  id: string;
  date: string;
  type: 'soil-test' | 'plan-created' | 'cost-entry' | 'observation' | 'practice-added' | 'profile-updated';
  title: string;
  description: string;
  relatedId?: string;
}

export type Language = 'en' | 'mr';

export interface AppState {
  language: Language;
  profile: FarmerProfile | null;
  soilTests: SoilTestRecord[];
  farmingPlans: FarmingPlan[];
  costScenarios: CostScenario[];
  observations: SoilObservation[];
  activities: ActivityRecord[];
  savedArticles: string[];
  savedPractices: string[];
}
