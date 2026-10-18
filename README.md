# BhoomiMitra AI

BhoomiMitra AI is a smart farm management and soil intelligence prototype designed for Indian farmers to improve decision-making through soil health tracking, crop planning, cost visibility, and practical agronomy guidance.

Built for the SEVA First 2026 Innovation Challenge, this app brings together a farmer dashboard, soil analysis tools, farming recommendations, and educational resources into one simple and actionable experience.

## Why BhoomiMitra?

Small and marginal farmers often make critical crop and soil decisions without reliable, localized, and easy-to-understand data. BhoomiMitra addresses this by giving farmers a digital assistant that helps them:

- understand soil fertility and nutrient balance
- monitor progression through field observations and test records
- create and refine farm plans based on sustainable practices
- estimate expenses and compare crop economics
- learn practical farming methods from trusted, localized guidance

## Key Features

### 1. Farm Dashboard
A personalized overview of the farm, with:

- primary crop and farm profile
- latest soil test summary
- active farming plan
- seasonal insights
- expense and productivity indicators

### 2. Soil Health Analysis
Track and interpret soil test data for parameters such as:

- pH
- EC
- organic carbon
- nitrogen, phosphorus, potassium
- micronutrients and secondary nutrients

The dashboard interprets these values and gives clear guidance around health status, deficiencies, and next actions.

### 3. Farming Planner
Plan sustainable farming decisions with a curated library of practices, including:

- composting and soil amendments
- crop rotation strategies
- mulching and residue retention
- organic and natural farming methods
- seasonal recommendations

### 4. Cost Tracker
Monitor crop input costs and compare scenarios to understand the economics of farm operations.

- seed and fertilizer costs
- labour and irrigation entries
- harvest and sales tracking
- cost breakdown by category

### 5. Soil Journey Timeline
See how soil health and field activity evolve over time through historical records and observations.

### 6. Knowledge Center
Access a focused library of agronomy articles, practice explanations, and practical recommendations relevant to soil and farm health.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Recharts
- Tailwind CSS
- Lucide React

## Project Structure

```text
prototype/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   └── layout/
│   ├── data/
│   ├── hooks/
│   ├── i18n/
│   ├── lib/
│   ├── pages/
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── README.md
└── index.html
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Run the app locally

```bash
npm run dev
```

Then open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

### Production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Demo Scenario

The app includes demo farm data for a sample farmer profile in Maharashtra, allowing the interface to showcase realistic soil health, planning, and cost-tracking workflows without requiring a live backend.

This includes sample fields like:

- soybean crop planning
- soil test history
- cost entries by input category
- sustainable farming suggestions

## App Pages

- Dashboard
- Soil Health
- Farming Planner
- Cost Tracker
- Soil Journey
- Knowledge
- Settings

## Design Goals

BhoomiMitra is designed to be:

- practical for real farm use
- understandable for non-technical farmers
- fast and lightweight for browser-based access
- useful for both advisory and self-management workflows
- aligned with sustainable and regenerative agriculture principles

## Future Enhancements

Potential next steps for the product include:

- AI-powered recommendations in regional language support
- multilingual UI and voice interactions
- offline mobile-first functionality
- real soil report upload and OCR
- farmer community features and advisory workflows
- integration with government schemes and extension services

## License

This project is currently a prototype and is intended for demo and innovation challenge use.

## Repository Notes

This repository contains the frontend prototype for BhoomiMitra AI. It is designed to demonstrate an end-to-end farming intelligence experience focused on soil health, crop planning, and agricultural decision support.

## Acknowledgements

This project was developed with a focus on making agricultural technology more actionable, practical, and farmer-friendly.

---

If you want, I can also turn this into a more premium version with:

- a project logo header
- badges for React / Vite / TypeScript
- a screenshot section
- a shorter “executive summary” version for GitHub
- a fully polished README tailored for a hackathon submission
