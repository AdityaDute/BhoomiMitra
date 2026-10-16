import { createContext, useContext, useReducer, useEffect, type ReactNode, type Dispatch } from 'react';
import type { AppState, Language, SoilTestRecord, FarmingPlan, CostScenario, SoilObservation, ActivityRecord, FarmerProfile } from '../types';
import { saveToStorage, loadFromStorage, clearAllStorage, generateId } from '../lib/storage';
import { getInitialDemoData } from '../data/demoFarm';

type Action =
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_PROFILE'; payload: FarmerProfile }
  | { type: 'ADD_SOIL_TEST'; payload: SoilTestRecord }
  | { type: 'UPDATE_SOIL_TEST'; payload: SoilTestRecord }
  | { type: 'DELETE_SOIL_TEST'; payload: string }
  | { type: 'ADD_FARMING_PLAN'; payload: FarmingPlan }
  | { type: 'UPDATE_FARMING_PLAN'; payload: FarmingPlan }
  | { type: 'DELETE_FARMING_PLAN'; payload: string }
  | { type: 'ADD_COST_SCENARIO'; payload: CostScenario }
  | { type: 'UPDATE_COST_SCENARIO'; payload: CostScenario }
  | { type: 'DELETE_COST_SCENARIO'; payload: string }
  | { type: 'ADD_OBSERVATION'; payload: SoilObservation }
  | { type: 'DELETE_OBSERVATION'; payload: string }
  | { type: 'ADD_ACTIVITY'; payload: ActivityRecord }
  | { type: 'TOGGLE_SAVED_ARTICLE'; payload: string }
  | { type: 'TOGGLE_SAVED_PRACTICE'; payload: string }
  | { type: 'RESET_DATA' }
  | { type: 'LOAD_STATE'; payload: AppState };

function getInitialState(): AppState {
  const demo = getInitialDemoData();
  return {
    language: loadFromStorage<Language>('language', 'en'),
    profile: loadFromStorage<FarmerProfile | null>('profile', demo.profile),
    soilTests: loadFromStorage<SoilTestRecord[]>('soilTests', demo.soilTests),
    farmingPlans: loadFromStorage<FarmingPlan[]>('farmingPlans', demo.farmingPlans),
    costScenarios: loadFromStorage<CostScenario[]>('costScenarios', demo.costScenarios),
    observations: loadFromStorage<SoilObservation[]>('observations', demo.observations),
    activities: loadFromStorage<ActivityRecord[]>('activities', demo.activities),
    savedArticles: loadFromStorage<string[]>('savedArticles', demo.savedArticles),
    savedPractices: loadFromStorage<string[]>('savedPractices', demo.savedPractices),
  };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'ADD_SOIL_TEST':
      return { ...state, soilTests: [...state.soilTests, action.payload] };
    case 'UPDATE_SOIL_TEST':
      return { ...state, soilTests: state.soilTests.map(t => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE_SOIL_TEST':
      return { ...state, soilTests: state.soilTests.filter(t => t.id !== action.payload) };
    case 'ADD_FARMING_PLAN':
      return { ...state, farmingPlans: [...state.farmingPlans, action.payload] };
    case 'UPDATE_FARMING_PLAN':
      return { ...state, farmingPlans: state.farmingPlans.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'DELETE_FARMING_PLAN':
      return { ...state, farmingPlans: state.farmingPlans.filter(p => p.id !== action.payload) };
    case 'ADD_COST_SCENARIO':
      return { ...state, costScenarios: [...state.costScenarios, action.payload] };
    case 'UPDATE_COST_SCENARIO':
      return { ...state, costScenarios: state.costScenarios.map(s => s.id === action.payload.id ? action.payload : s) };
    case 'DELETE_COST_SCENARIO':
      return { ...state, costScenarios: state.costScenarios.filter(s => s.id !== action.payload) };
    case 'ADD_OBSERVATION':
      return { ...state, observations: [...state.observations, action.payload] };
    case 'DELETE_OBSERVATION':
      return { ...state, observations: state.observations.filter(o => o.id !== action.payload) };
    case 'ADD_ACTIVITY':
      return { ...state, activities: [action.payload, ...state.activities] };
    case 'TOGGLE_SAVED_ARTICLE': {
      const id = action.payload;
      const saved = state.savedArticles.includes(id)
        ? state.savedArticles.filter(a => a !== id)
        : [...state.savedArticles, id];
      return { ...state, savedArticles: saved };
    }
    case 'TOGGLE_SAVED_PRACTICE': {
      const id = action.payload;
      const saved = state.savedPractices.includes(id)
        ? state.savedPractices.filter(p => p !== id)
        : [...state.savedPractices, id];
      return { ...state, savedPractices: saved };
    }
    case 'RESET_DATA': {
      clearAllStorage();
      const demo = getInitialDemoData();
      return {
        language: state.language,
        profile: demo.profile,
        soilTests: demo.soilTests,
        farmingPlans: demo.farmingPlans,
        costScenarios: demo.costScenarios,
        observations: demo.observations,
        activities: demo.activities,
        savedArticles: demo.savedArticles,
        savedPractices: demo.savedPractices,
      };
    }
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: Dispatch<Action>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);
  
  // Persist state changes to localStorage
  useEffect(() => {
    saveToStorage('language', state.language);
    saveToStorage('profile', state.profile);
    saveToStorage('soilTests', state.soilTests);
    saveToStorage('farmingPlans', state.farmingPlans);
    saveToStorage('costScenarios', state.costScenarios);
    saveToStorage('observations', state.observations);
    saveToStorage('activities', state.activities);
    saveToStorage('savedArticles', state.savedArticles);
    saveToStorage('savedPractices', state.savedPractices);
  }, [state]);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}

export { generateId };
