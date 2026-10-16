import type { KnowledgeArticle } from '../types';

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: 'article-001',
    title: 'Understanding Your Soil Health Card',
    summary: 'Learn how to read and interpret the parameters on your Soil Health Card issued by the government.',
    content: `The Soil Health Card (SHC) is a scheme of the Government of India that provides farmers with information about the nutrient status of their soil, along with recommendations for appropriate nutrient dosage. Understanding the card helps you make informed decisions about soil management.\n\n## Key Parameters on the Soil Health Card\n\n**Primary Nutrients (Macronutrients)**\n- **Nitrogen (N):** Essential for vegetative growth. Measured as available N in kg/ha.\n- **Phosphorus (P):** Important for root development and flowering. Measured as available P in kg/ha.\n- **Potassium (K):** Vital for disease resistance and crop quality. Measured as available K in kg/ha.\n\n**Secondary Nutrients**\n- **Sulphur (S):** Required for protein synthesis. Measured in mg/kg.\n\n**Micronutrients**\n- **Zinc (Zn), Iron (Fe), Manganese (Mn), Copper (Cu), Boron (B):** Required in small amounts but essential for various plant functions.\n\n**Physical Properties**\n- **pH:** Indicates soil acidity or alkalinity (scale 0-14). Most crops prefer pH 6.5-7.5.\n- **Electrical Conductivity (EC):** Indicates soil salinity in dS/m. Normal soils have EC below 1.0 dS/m.\n- **Organic Carbon (OC):** Percentage of carbon from organic matter. Higher values generally indicate healthier soil.\n\n## How to Use Your Soil Health Card\n\n1. Compare your values against the rating provided (Low, Medium, High).\n2. Focus on parameters rated as "Low"—these need attention.\n3. Follow the fertiliser/amendment recommendations given on the card.\n4. Get your soil tested every 2-3 years to track changes.\n5. For organic and natural farming, use the card to guide organic input selection.\n\n## Important Notes\n\n- Soil test results represent a point-in-time snapshot of one sample location.\n- Results can vary across a single field.\n- Laboratory methods and reporting formats may differ between testing centres.\n- Always use soil test results alongside field observations and local knowledge.`,
    category: 'soil-testing',
    sourceOrg: 'Soil Health Card Scheme, Government of India',
    sourceTitle: 'Soil Health Card Scheme Overview',
    sourceUrl: 'https://soilhealth.dac.gov.in/',
    lastReviewed: '2026-01-15',
    reviewStatus: 'pending-review',
  },
  {
    id: 'article-002',
    title: 'Introduction to Zero Budget Natural Farming (ZBNF)',
    summary: 'An overview of ZBNF principles, its four pillars, and how it differs from conventional and organic farming.',
    content: `Zero Budget Natural Farming (ZBNF) is a farming practice that aims to reduce the cost of cultivation to near-zero by eliminating purchased external inputs. It was developed by Padma Shri Subhash Palekar and has been adopted by several Indian states as part of their agricultural policy.\n\n## The Four Pillars of ZBNF\n\n**1. Jeevamrit (Living Soil Amendment)**\nA fermented microbial culture made from cow dung, cow urine, jaggery, pulse flour, and undisturbed soil. Applied to enhance soil biological activity.\n\n**2. Beejamrit (Seed Treatment)**\nA natural seed coating made from cow dung, cow urine, and lime to protect seeds from soil-borne pathogens.\n\n**3. Acchadana (Mulching)**\nCovering the soil surface with organic matter to conserve moisture, suppress weeds, and regulate soil temperature. Three types: straw mulch, live mulch (cover crops), and soil mulch.\n\n**4. Whapasa (Moisture Management)**\nMaintaining optimal soil moisture—not too wet, not too dry. Reducing irrigation frequency and letting roots access deeper moisture.\n\n## ZBNF vs Organic Farming\n\nWhile both avoid synthetic chemicals, they differ:\n- **ZBNF** emphasizes zero external costs and uses specific preparations (Jeevamrit, Beejamrit). It is a specific system with defined practices.\n- **Organic farming** may use purchased organic inputs (vermicompost, bio-fertilisers, rock phosphate) and follows standards set by certification bodies.\n- Both aim to improve soil health and reduce chemical dependency.\n- They are not identical systems, and not all organic practices are part of ZBNF, and vice versa.\n\n## Important Considerations\n\n- Transitioning to ZBNF may take 2-3 seasons for the soil biology to establish.\n- Yields during transition may vary—this is normal and expected.\n- Success depends on local conditions, soil type, climate, and farmer skill.\n- Formal scientific research on ZBNF efficacy is ongoing; results from large-scale studies will help validate field observations.\n- Training from experienced ZBNF practitioners is recommended before adoption.`,
    category: 'natural-farming',
    sourceOrg: 'General ZBNF Literature',
    sourceTitle: 'Zero Budget Natural Farming Overview',
    reviewStatus: 'pending-review',
  },
  {
    id: 'article-003',
    title: 'Organic Carbon: The Heart of Soil Health',
    summary: 'Why organic carbon matters, how it is measured, and practical ways to increase it in your soil.',
    content: `Organic carbon (OC) is one of the most important indicators of soil health. It represents the carbon stored in soil organic matter—decomposed plant material, animal waste, and microbial biomass.\n\n## Why Organic Carbon Matters\n\n- **Nutrient cycling:** Organic matter releases nutrients (N, P, S, micronutrients) as it decomposes.\n- **Water retention:** Soils high in organic matter hold more water, reducing irrigation needs.\n- **Soil structure:** Organic matter binds soil particles into aggregates, improving aeration and root penetration.\n- **Biological activity:** Organic carbon feeds soil organisms—bacteria, fungi, earthworms—that maintain soil health.\n- **Carbon sequestration:** Building soil organic carbon removes CO₂ from the atmosphere.\n\n## Organic Carbon Levels in Indian Soils\n\n- **Low:** Below 0.5% (common in many Indian agricultural soils)\n- **Medium:** 0.5% to 0.75%\n- **High:** Above 0.75%\n\nMany Indian soils have OC below 0.5% due to continuous cropping, residue burning, and limited organic matter addition.\n\n## How to Increase Soil Organic Carbon\n\n1. **Add compost or vermicompost** regularly (5-10 tonnes/ha/year)\n2. **Practice mulching** with crop residues\n3. **Grow green manure** crops and incorporate them\n4. **Stop burning crop residues**\n5. **Include legumes** in crop rotation\n6. **Apply Jeevamrit** (in ZBNF) to enhance biological activity\n7. **Reduce tillage** where possible\n8. **Grow cover crops** during fallow periods\n\n## Important Notes\n\n- Building organic carbon is a slow process—expect gradual improvement over seasons and years, not instant results.\n- The rate of increase depends on climate, soil type, and the amount and type of organic inputs.\n- Regular soil testing (every 2-3 years) helps track changes objectively.`,
    category: 'soil-health',
    sourceOrg: 'General soil science literature',
    sourceTitle: 'Soil Organic Carbon Management',
    reviewStatus: 'pending-review',
  },
  {
    id: 'article-004',
    title: 'Getting Started with Vermicomposting',
    summary: 'A practical guide to setting up and maintaining a vermicompost unit on your farm.',
    content: `Vermicomposting is one of the most effective and accessible organic composting methods. It uses earthworms to convert organic waste into nutrient-rich vermicompost.\n\n## Setting Up a Vermicompost Unit\n\n**Location:** Choose a cool, shaded area protected from direct sunlight and rain. Under a tree or a simple shade structure works well.\n\n**Size:** A standard bed is 1m wide × 3m long × 0.3m deep. One bed can process approximately 1 tonne of organic waste over 60-90 days.\n\n**Materials Needed:**\n- Earthworms (Eisenia fetida recommended, or local red wrigglers)\n- Cow dung (partially decomposed, 2-3 weeks old)\n- Crop residues and farm waste\n- Dried leaves and straw\n- Jute sacking or gunny bags for covering\n- Water source\n\n## Step-by-Step Process\n\n1. Create a 3-inch base layer of dried leaves and straw\n2. Add a layer of partially decomposed cow dung (2-3 inches)\n3. Add a layer of chopped crop waste and kitchen waste (2-3 inches)\n4. Release earthworms (approximately 1 kg per bed, ~1000 worms)\n5. Cover with jute sacking\n6. Sprinkle water regularly to maintain moisture (40-50%)\n7. Do not disturb for 2-3 weeks\n8. After initial period, add new waste in thin layers every week\n9. Harvest after 60-90 days when compost is dark and crumbly\n\n## Harvesting\n\n- Stop adding new material 2 weeks before harvest\n- Heap the compost in a cone shape in sunlight—worms will move to the bottom\n- Collect the top layer of finished vermicompost\n- Return worms to the bed for the next batch\n\n## Common Problems and Solutions\n\n- **Foul smell:** Too wet or anaerobic. Add dry materials and improve aeration.\n- **Worms escaping:** Check for excess moisture, overheating, or unsuitable waste.\n- **Ants:** The bed may be too dry. Increase moisture slightly.\n- **Slow composting:** Chop waste into smaller pieces and ensure adequate moisture.`,
    category: 'composting',
    sourceOrg: 'ICAR - Indian Institute of Soil Science',
    sourceTitle: 'Vermicomposting Technology',
    reviewStatus: 'pending-review',
  },
  {
    id: 'article-005',
    title: 'Crop Rotation Strategies for Indian Farmers',
    summary: 'Practical crop rotation plans for common Indian cropping systems to maintain soil health.',
    content: `Crop rotation is one of the simplest and most effective ways to maintain soil health, break pest cycles, and improve farm productivity. Here are practical rotation strategies for common Indian farming situations.\n\n## Principles of Good Crop Rotation\n\n1. **Alternate between cereals and legumes** — Legumes fix nitrogen that benefits the following cereal crop.\n2. **Alternate between shallow and deep-rooted crops** — This utilises nutrients from different soil depths.\n3. **Avoid growing the same crop family consecutively** — This breaks pest and disease cycles.\n4. **Include a soil-building crop** — Green manure or a cover crop in the rotation.\n\n## Example Rotation Plans\n\n**For Western Maharashtra (Dryland):**\nYear 1: Soybean (Kharif) → Wheat (Rabi)\nYear 2: Pearl millet/Sorghum (Kharif) → Chickpea/Safflower (Rabi)\nYear 3: Green gram/Pigeon pea (Kharif) → Wheat (Rabi)\n\n**For Indo-Gangetic Plains (Irrigated):**\nYear 1: Rice (Kharif) → Wheat (Rabi) → Green manure (Zaid)\nYear 2: Rice (Kharif) → Potato/Mustard (Rabi) → Moong (Zaid)\n\n**For Vegetable Growers:**\nSeason 1: Tomato/Brinjal (Solanaceae)\nSeason 2: Beans/Peas (Leguminosae)\nSeason 3: Cabbage/Cauliflower (Cruciferae)\nSeason 4: Cucurbits (Cucurbitaceae)\n\n## Benefits Observed by Farmers\n\n- Reduced pest and disease pressure\n- Better nutrient utilisation\n- Improved soil structure\n- Reduced weed pressure\n- Potentially more stable farm income through crop diversification\n\n## Important Note\n\nThese are general examples. The best rotation for your farm depends on your local climate, soil type, water availability, and market conditions. Consult your local agricultural extension office for specific recommendations.`,
    category: 'crop-rotation',
    sourceOrg: 'General agronomic practice',
    sourceTitle: 'Crop Rotation for Soil Health',
    reviewStatus: 'pending-review',
  },
  {
    id: 'article-006',
    title: 'Understanding Farm Economics: Input Costs and Returns',
    summary: 'How to track farming costs, calculate returns, and evaluate the economics of different farming practices.',
    content: `Understanding the economics of your farm is essential for making informed decisions about farming practices, including the transition to organic or natural farming.\n\n## Why Track Farm Costs?\n\n- Know your actual cost of production per quintal/kg\n- Compare costs across seasons and methods\n- Identify your largest expense categories\n- Make informed decisions about input changes\n- Evaluate whether new practices are economically viable\n\n## Key Cost Categories\n\n**Variable Costs (change each season):**\n- Seeds\n- Fertilisers and soil amendments\n- Crop protection (pesticides or biological alternatives)\n- Labour (hired and family)\n- Irrigation\n- Transportation\n\n**Fixed Costs (remain relatively constant):**\n- Land rent or lease\n- Equipment depreciation\n- Infrastructure maintenance\n\n## Calculating Returns\n\n**Total Cost** = Sum of all variable and fixed costs\n**Gross Revenue** = Quantity sold × Selling price\n**Net Return** = Gross Revenue − Total Cost\n**Cost of Production per unit** = Total Cost ÷ Total production\n\n## Economics of Transitioning to Natural/Organic Farming\n\nImportant considerations:\n- Input costs may decrease (reduced purchase of fertilisers and pesticides)\n- Labour costs may increase initially (more manual practices)\n- Yields may change during the transition period (this is normal)\n- Premium prices may be available for certified organic produce\n- Soil health improvements may reduce costs in the long term\n\n**Caution:** Do not assume that natural/organic farming is automatically cheaper or more profitable. The economics depend on your specific situation, crops, market access, and transition management. Track your actual costs and compare honestly.`,
    category: 'farm-economics',
    sourceOrg: 'General farm management literature',
    sourceTitle: 'Farm Economics Basics',
    reviewStatus: 'pending-review',
  },
  {
    id: 'article-007',
    title: 'Organic Farming Certification in India',
    summary: 'Overview of organic farming certification processes, standards, and benefits for Indian farmers.',
    content: `If you are practising or transitioning to organic farming, understanding the certification process can help you access premium markets and verify your practices.\n\n## Certification Standards in India\n\n**National Programme for Organic Production (NPOP)**\n- India's official organic standard, operated by APEDA (Agricultural & Processed Food Products Export Development Authority).\n- Required for organic produce exports.\n- Aligns with international standards (EU, USDA equivalence agreements).\n\n**Participatory Guarantee System (PGS-India)**\n- A peer-review based certification system for the domestic market.\n- More accessible and affordable for small farmers.\n- Operated by local groups with support from the Ministry of Agriculture.\n- Suitable for direct sales and domestic retail.\n\n## Certification Process (General)\n\n1. **Application:** Register with a certification body or PGS group.\n2. **Conversion period:** Typically 2-3 years of following organic practices.\n3. **Documentation:** Maintain records of all inputs, practices, and sales.\n4. **Inspection:** Regular inspections by certifying body or peer group.\n5. **Certification:** Granted after successful completion of conversion period and inspection.\n\n## Key Requirements\n\n- No synthetic chemical pesticides or fertilisers\n- Maintenance of soil fertility through organic methods\n- Proper record-keeping\n- Buffer zones from conventional farming areas\n- Use of organic seeds where available\n\n## Important Notes\n\n- Certification has costs (fees, documentation, inspection)—evaluate the economic benefit for your situation.\n- Group certification can reduce individual costs.\n- PGS is more accessible for small farmers selling in local markets.\n- ZBNF practices may qualify for organic certification but this depends on the specific certifying body and standards applied.\n- Consult your local agriculture office or KVK for guidance on certification options in your area.`,
    category: 'organic-farming',
    sourceOrg: 'APEDA and PGS-India',
    sourceTitle: 'Organic Certification Overview',
    sourceUrl: 'https://pgsindia-ncof.gov.in/',
    reviewStatus: 'pending-review',
  },
];

export function getArticlesByCategory(category: string): KnowledgeArticle[] {
  return knowledgeArticles.filter(a => a.category === category);
}

export function searchArticles(query: string): KnowledgeArticle[] {
  const lower = query.toLowerCase();
  return knowledgeArticles.filter(a =>
    a.title.toLowerCase().includes(lower) ||
    a.summary.toLowerCase().includes(lower) ||
    a.content.toLowerCase().includes(lower) ||
    a.category.toLowerCase().includes(lower)
  );
}
