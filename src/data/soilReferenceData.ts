import type { InterpretationLevel } from '../types';

interface ReferenceRange {
  min: number;
  max: number;
  level: InterpretationLevel;
  label: string;
  description: string;
  recommendation: string;
}

interface ParameterReference {
  name: string;
  key: string;
  unit: string;
  ranges: ReferenceRange[];
  source: string;
  reviewStatus: 'verified' | 'pending-review' | 'demo';
}

export const soilReferenceRanges: Record<string, ParameterReference> = {
  pH: {
    name: 'Soil pH',
    key: 'pH',
    unit: '',
    ranges: [
      { min: 0, max: 4.5, level: 'acidic', label: 'Strongly Acidic', description: 'Soil is strongly acidic. Most nutrients become less available. Aluminium toxicity may occur.', recommendation: 'Liming may be necessary. Consider crops tolerant to acidic soils. Consult a soil scientist for specific liming recommendations.' },
      { min: 4.5, max: 5.5, level: 'acidic', label: 'Moderately Acidic', description: 'Soil is moderately acidic. Phosphorus and some micronutrients may be less available.', recommendation: 'Consider lime application and organic matter addition to gradually raise pH. Crops like tea, potato, and rice tolerate moderate acidity.' },
      { min: 5.5, max: 6.5, level: 'acidic', label: 'Slightly Acidic', description: 'Soil is slightly acidic. Good for most crops. Many nutrients are readily available.', recommendation: 'Generally suitable for most crops. Regular organic matter addition helps maintain this pH range.' },
      { min: 6.5, max: 7.5, level: 'neutral', label: 'Neutral', description: 'Soil pH is in the ideal neutral range. Most nutrients are available to plants.', recommendation: 'Excellent pH range. Maintain through regular addition of organic matter and balanced nutrient management.' },
      { min: 7.5, max: 8.5, level: 'alkaline', label: 'Moderately Alkaline', description: 'Soil is moderately alkaline. Iron, zinc and manganese may become less available.', recommendation: 'Add organic matter (compost, FYM) to help buffer pH. Consider using sulphur-containing amendments. Choose crops tolerant to alkaline conditions.' },
      { min: 8.5, max: 14, level: 'alkaline', label: 'Strongly Alkaline', description: 'Soil is strongly alkaline. Severe nutrient availability issues likely. May indicate sodicity.', recommendation: 'Requires significant amendment. Consult a soil scientist. Gypsum application may be needed for sodic soils. Heavy organic matter addition recommended.' },
    ],
    source: 'Soil Health Card guidelines, Government of India',
    reviewStatus: 'pending-review',
  },
  ec: {
    name: 'Electrical Conductivity',
    key: 'ec',
    unit: 'dS/m',
    ranges: [
      { min: 0, max: 1.0, level: 'normal', label: 'Normal (Non-saline)', description: 'Soil salinity is within normal range. No salinity-related growth restrictions expected for most crops.', recommendation: 'No salinity management needed. Continue regular practices.' },
      { min: 1.0, max: 2.0, level: 'medium', label: 'Slightly Saline', description: 'Slight salinity. Sensitive crops may show reduced growth.', recommendation: 'Monitor salinity. Ensure good drainage. Consider salt-tolerant crop varieties if salinity persists.' },
      { min: 2.0, max: 4.0, level: 'high', label: 'Moderately Saline', description: 'Moderate salinity. Many crops will show reduced yields.', recommendation: 'Improve drainage. Apply gypsum if sodic. Use organic mulches. Choose salt-tolerant crops. Leach salts with good quality irrigation water.' },
      { min: 4.0, max: 20, level: 'very-high', label: 'Highly Saline', description: 'High salinity. Only salt-tolerant crops will survive.', recommendation: 'Urgent reclamation needed. Consult soil scientist. Install drainage. Apply amendments as recommended by lab.' },
    ],
    source: 'Soil Health Card guidelines, Government of India',
    reviewStatus: 'pending-review',
  },
  organicCarbon: {
    name: 'Organic Carbon',
    key: 'organicCarbon',
    unit: '%',
    ranges: [
      { min: 0, max: 0.5, level: 'low', label: 'Low', description: 'Organic carbon is low. Soil may have poor structure, low water-holding capacity and reduced biological activity.', recommendation: 'Priority: increase organic matter through composting, vermicomposting, green manuring, crop residue incorporation and farmyard manure application.' },
      { min: 0.5, max: 0.75, level: 'medium', label: 'Medium', description: 'Organic carbon is in the medium range. There is room for improvement for better soil health.', recommendation: 'Continue and increase organic matter additions. Practice mulching and residue recycling. Consider green manure crops in rotation.' },
      { min: 0.75, max: 10, level: 'high', label: 'High', description: 'Good organic carbon content. Soil likely has good structure, water retention and biological activity.', recommendation: 'Maintain current organic matter management practices. Continue composting and mulching to sustain this level.' },
    ],
    source: 'Soil Health Card guidelines, Government of India',
    reviewStatus: 'pending-review',
  },
  nitrogen: {
    name: 'Available Nitrogen',
    key: 'nitrogen',
    unit: 'kg/ha',
    ranges: [
      { min: 0, max: 280, level: 'low', label: 'Low', description: 'Available nitrogen is below recommended levels for most crops.', recommendation: 'Apply nitrogen through organic sources: FYM, compost, vermicompost, Jeevamrit, green manure crops (dhaincha, sunhemp). For ZBNF, Jeevamrit provides nitrogen through biological activity.' },
      { min: 280, max: 560, level: 'medium', label: 'Medium', description: 'Available nitrogen is in the medium range. Adequate for moderate-demand crops.', recommendation: 'Maintain through regular organic matter addition and biological nitrogen fixation. Include legumes in crop rotation.' },
      { min: 560, max: 1000, level: 'high', label: 'High', description: 'Available nitrogen is high. Sufficient for most high-demand crops.', recommendation: 'Reduce external nitrogen additions. Monitor for potential excess which can affect crop quality and groundwater.' },
    ],
    source: 'Soil Health Card guidelines, Government of India',
    reviewStatus: 'pending-review',
  },
  phosphorus: {
    name: 'Available Phosphorus',
    key: 'phosphorus',
    unit: 'kg/ha',
    ranges: [
      { min: 0, max: 25, level: 'low', label: 'Low', description: 'Available phosphorus is low. May limit root development and flowering.', recommendation: 'Apply rock phosphate (for organic farming), bone meal or well-composted organic matter. Phosphorus-solubilising bio-fertilisers can help make soil phosphorus available.' },
      { min: 25, max: 56, level: 'medium', label: 'Medium', description: 'Available phosphorus is in the medium range.', recommendation: 'Maintain through regular composting and organic matter management. Mycorrhizal fungi enhance phosphorus uptake.' },
      { min: 56, max: 500, level: 'high', label: 'High', description: 'Available phosphorus is high. Sufficient for crop needs.', recommendation: 'No additional phosphorus needed. Excess phosphorus can cause environmental issues.' },
    ],
    source: 'Soil Health Card guidelines, Government of India',
    reviewStatus: 'pending-review',
  },
  potassium: {
    name: 'Available Potassium',
    key: 'potassium',
    unit: 'kg/ha',
    ranges: [
      { min: 0, max: 140, level: 'low', label: 'Low', description: 'Available potassium is low. May affect disease resistance and crop quality.', recommendation: 'Apply wood ash (potash-rich), banana stem compost, or crop residue ash. Crop residue recycling returns significant potassium to soil.' },
      { min: 140, max: 280, level: 'medium', label: 'Medium', description: 'Available potassium is in the medium range.', recommendation: 'Maintain through crop residue management and regular compost application.' },
      { min: 280, max: 1000, level: 'high', label: 'High', description: 'Available potassium is high. Adequate for most crops.', recommendation: 'No additional potassium inputs needed. Continue good residue management practices.' },
    ],
    source: 'Soil Health Card guidelines, Government of India',
    reviewStatus: 'pending-review',
  },
  sulphur: {
    name: 'Available Sulphur',
    key: 'sulphur',
    unit: 'mg/kg',
    ranges: [
      { min: 0, max: 10, level: 'deficient', label: 'Deficient', description: 'Sulphur is deficient. May affect protein synthesis in crops.', recommendation: 'Apply gypsum or organic matter rich in sulphur. Compost and FYM provide sulphur.' },
      { min: 10, max: 200, level: 'sufficient', label: 'Sufficient', description: 'Sulphur levels are adequate.', recommendation: 'Maintain through organic matter management.' },
    ],
    source: 'Soil Health Card guidelines, Government of India',
    reviewStatus: 'pending-review',
  },
  zinc: {
    name: 'Available Zinc',
    key: 'zinc',
    unit: 'mg/kg',
    ranges: [
      { min: 0, max: 0.6, level: 'deficient', label: 'Deficient', description: 'Zinc is deficient. Common in alkaline and calcareous soils. Affects crop growth and grain quality.', recommendation: 'Apply zinc sulphate as recommended. Organic matter addition improves zinc availability. Vermicompost contains bioavailable zinc.' },
      { min: 0.6, max: 50, level: 'sufficient', label: 'Sufficient', description: 'Zinc levels are adequate.', recommendation: 'Maintain through balanced organic matter management.' },
    ],
    source: 'Soil Health Card guidelines, Government of India',
    reviewStatus: 'pending-review',
  },
  iron: {
    name: 'Available Iron',
    key: 'iron',
    unit: 'mg/kg',
    ranges: [
      { min: 0, max: 4.5, level: 'deficient', label: 'Deficient', description: 'Iron is deficient. May cause chlorosis (yellowing) in sensitive crops.', recommendation: 'Lower soil pH through organic amendments. Organic matter improves iron availability. Foliar application may provide quick relief.' },
      { min: 4.5, max: 200, level: 'sufficient', label: 'Sufficient', description: 'Iron levels are adequate.', recommendation: 'No action needed. Maintain organic matter for continued availability.' },
    ],
    source: 'Soil Health Card guidelines, Government of India',
    reviewStatus: 'pending-review',
  },
};

export const soilParameterInfo: Record<string, { name: string; unit: string; description: string }> = {
  pH: { name: 'Soil pH', unit: '', description: 'Measure of soil acidity or alkalinity (0-14 scale). Affects nutrient availability.' },
  ec: { name: 'Electrical Conductivity (EC)', unit: 'dS/m', description: 'Indicates soil salinity. Higher values suggest more dissolved salts.' },
  organicCarbon: { name: 'Organic Carbon', unit: '%', description: 'Percentage of carbon from organic matter. Key indicator of soil health and fertility.' },
  nitrogen: { name: 'Available Nitrogen (N)', unit: 'kg/ha', description: 'Nitrogen available for plant uptake. Essential for vegetative growth.' },
  phosphorus: { name: 'Available Phosphorus (P)', unit: 'kg/ha', description: 'Phosphorus available for plants. Important for root development and flowering.' },
  potassium: { name: 'Available Potassium (K)', unit: 'kg/ha', description: 'Potassium available for plants. Important for disease resistance and crop quality.' },
  sulphur: { name: 'Available Sulphur (S)', unit: 'mg/kg', description: 'Sulphur available in soil. Required for protein synthesis.' },
  zinc: { name: 'Available Zinc (Zn)', unit: 'mg/kg', description: 'Zinc micronutrient availability. Common deficiency in Indian soils.' },
  iron: { name: 'Available Iron (Fe)', unit: 'mg/kg', description: 'Iron micronutrient availability. Deficiency causes leaf chlorosis.' },
  manganese: { name: 'Available Manganese (Mn)', unit: 'mg/kg', description: 'Manganese micronutrient. Important for photosynthesis.' },
  copper: { name: 'Available Copper (Cu)', unit: 'mg/kg', description: 'Copper micronutrient. Required for enzyme activation.' },
  boron: { name: 'Available Boron (B)', unit: 'mg/kg', description: 'Boron micronutrient. Important for flowering and fruit set.' },
};
