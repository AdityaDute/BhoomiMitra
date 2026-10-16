import type { SoilParameters } from '../types';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateSoilParameters(params: Partial<SoilParameters>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (params.pH !== undefined) {
    if (params.pH < 0 || params.pH > 14) {
      errors.push({ field: 'pH', message: 'pH must be between 0 and 14' });
    }
  }

  if (params.ec !== undefined) {
    if (params.ec < 0 || params.ec > 20) {
      errors.push({ field: 'ec', message: 'EC must be between 0 and 20 dS/m' });
    }
  }

  if (params.organicCarbon !== undefined) {
    if (params.organicCarbon < 0 || params.organicCarbon > 10) {
      errors.push({ field: 'organicCarbon', message: 'Organic carbon must be between 0% and 10%' });
    }
  }

  if (params.nitrogen !== undefined) {
    if (params.nitrogen < 0 || params.nitrogen > 1000) {
      errors.push({ field: 'nitrogen', message: 'Nitrogen must be between 0 and 1000 kg/ha' });
    }
  }

  if (params.phosphorus !== undefined) {
    if (params.phosphorus < 0 || params.phosphorus > 500) {
      errors.push({ field: 'phosphorus', message: 'Phosphorus must be between 0 and 500 kg/ha' });
    }
  }

  if (params.potassium !== undefined) {
    if (params.potassium < 0 || params.potassium > 1000) {
      errors.push({ field: 'potassium', message: 'Potassium must be between 0 and 1000 kg/ha' });
    }
  }

  const micronutrients: Array<{ key: keyof SoilParameters; name: string; max: number }> = [
    { key: 'sulphur', name: 'Sulphur', max: 200 },
    { key: 'zinc', name: 'Zinc', max: 50 },
    { key: 'iron', name: 'Iron', max: 200 },
    { key: 'manganese', name: 'Manganese', max: 200 },
    { key: 'copper', name: 'Copper', max: 50 },
    { key: 'boron', name: 'Boron', max: 20 },
  ];

  for (const mn of micronutrients) {
    const val = params[mn.key];
    if (val !== undefined) {
      if (val < 0 || val > mn.max) {
        errors.push({ field: mn.key, message: `${mn.name} must be between 0 and ${mn.max} mg/kg` });
      }
    }
  }

  return errors;
}

export function validateRequired(value: string | undefined | null, fieldName: string): ValidationError | null {
  if (!value || value.trim() === '') {
    return { field: fieldName, message: `${fieldName} is required` };
  }
  return null;
}

export function validatePositiveNumber(value: number | undefined | null, fieldName: string): ValidationError | null {
  if (value === undefined || value === null) return null;
  if (isNaN(value) || value < 0) {
    return { field: fieldName, message: `${fieldName} must be a positive number` };
  }
  return null;
}
