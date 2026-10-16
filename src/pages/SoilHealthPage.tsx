import React, { useState } from 'react';
import {
  FlaskConical,
  Upload,
  Plus,
  Trash2,
  FileText,
  Calendar,
  Sparkles,
  Info,
  ChevronRight,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { useAppStore, generateId } from '../hooks/useAppStore';
import { useTranslation } from '../hooks/useTranslation';
import { useToast } from '../hooks/useToast';
import { validateSoilParameters, type ValidationError } from '../lib/validation';
import { interpretSoilParameter, formatDate } from '../lib/calculations';
import { soilParameterInfo } from '../data/soilReferenceData';
import { StatusBadge } from '../components/common/StatusBadge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import type { SoilTestRecord, SoilParameters } from '../types';

export function SoilHealthPage() {
  const { state, dispatch } = useAppStore();
  const { t } = useTranslation();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'records' | 'new'>('records');
  const [selectedRecordId, setSelectedRecordId] = useState<string>(
    state.soilTests[0]?.id || ''
  );

  // Form state
  const [farmName, setFarmName] = useState(state.profile?.name ? `${state.profile.name}'s Field` : 'Main Field');
  const [village, setVillage] = useState(state.profile?.village || 'Wadgaon');
  const [soilState, setSoilState] = useState(state.profile?.state || 'Maharashtra');
  const [crop, setCrop] = useState(state.profile?.primaryCrop || 'Soybean');
  const [season, setSeason] = useState<'kharif' | 'rabi' | 'zaid' | 'annual'>('kharif');
  const [farmArea, setFarmArea] = useState<number>(state.profile?.farmArea || 2.5);
  const [farmAreaUnit, setFarmAreaUnit] = useState<'acres' | 'hectares' | 'bigha'>('acres');
  const [testDate, setTestDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Numerical parameters state (strings to allow empty state properly without coercing to 0)
  const [paramInputs, setParamInputs] = useState<Record<string, string>>({
    pH: '',
    ec: '',
    organicCarbon: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    sulphur: '',
    zinc: '',
    iron: '',
    manganese: '',
    copper: '',
    boron: '',
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showDemoExtractionNotice, setShowDemoExtractionNotice] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  const currentRecord = state.soilTests.find((r) => r.id === selectedRecordId) || state.soilTests[0];

  const handleInputChange = (key: string, val: string) => {
    setParamInputs((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => prev.filter((e) => e.field !== key));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setShowDemoExtractionNotice(true);
      // Simulate demonstration extraction values with realistic card data
      setParamInputs({
        pH: '7.1',
        ec: '0.42',
        organicCarbon: '0.55',
        nitrogen: '260',
        phosphorus: '22',
        potassium: '210',
        sulphur: '14',
        zinc: '0.52',
        iron: '6.1',
        manganese: '',
        copper: '',
        boron: '',
      });
      addToast('Demonstration values pre-filled from sample report. Please review.', 'info');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse entered values without treating blanks as 0
    const parsedParams: Partial<SoilParameters> = {};
    for (const [k, v] of Object.entries(paramInputs)) {
      if (v.trim() !== '') {
        const num = parseFloat(v);
        if (!isNaN(num)) {
          parsedParams[k as keyof SoilParameters] = num;
        }
      }
    }

    // Validate
    const validationErrors = validateSoilParameters(parsedParams);
    if (!farmName.trim()) {
      validationErrors.push({ field: 'farmName', message: 'Farm name is required' });
    }
    if (!testDate) {
      validationErrors.push({ field: 'testDate', message: 'Test date is required' });
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      addToast('Please fix validation errors before saving.', 'error');
      return;
    }

    const newRecordId = generateId();
    const newRecord: SoilTestRecord = {
      id: newRecordId,
      farmName: farmName.trim(),
      village: village.trim(),
      state: soilState.trim(),
      crop: crop.trim(),
      season,
      farmArea: Number(farmArea) || 1,
      farmAreaUnit,
      testDate,
      notes: notes.trim(),
      isDemo: false,
      parameters: parsedParams as SoilParameters,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_SOIL_TEST', payload: newRecord });
    dispatch({
      type: 'ADD_ACTIVITY',
      payload: {
        id: generateId(),
        date: new Date().toISOString().split('T')[0],
        type: 'soil-test',
        title: `Soil test recorded for ${newRecord.farmName}`,
        description: `Logged test results for ${newRecord.crop} (${newRecord.season}).`,
        relatedId: newRecordId,
      },
    });

    addToast('Soil test record successfully saved!', 'success');
    setSelectedRecordId(newRecordId);
    setActiveTab('records');

    // Reset inputs
    setParamInputs({
      pH: '',
      ec: '',
      organicCarbon: '',
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      sulphur: '',
      zinc: '',
      iron: '',
      manganese: '',
      copper: '',
      boron: '',
    });
    setUploadedFile(null);
    setShowDemoExtractionNotice(false);
  };

  const confirmDeleteRecord = () => {
    if (recordToDelete) {
      dispatch({ type: 'DELETE_SOIL_TEST', payload: recordToDelete });
      addToast('Soil record deleted.', 'info');
      setRecordToDelete(null);
      if (selectedRecordId === recordToDelete) {
        const remaining = state.soilTests.filter((r) => r.id !== recordToDelete);
        setSelectedRecordId(remaining[0]?.id || '');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">{t.soil.title}</h1>
            <StatusBadge status="verified" />
          </div>
          <p className="text-sm text-gray-500 mt-1">{t.soil.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === 'records'
                ? 'bg-forest-800 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {t.soil.savedRecords} ({state.soilTests.length})
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === 'new'
                ? 'bg-forest-800 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            {t.soil.newRecord}
          </button>
        </div>
      </div>

      {/* Main Tabs View */}
      {activeTab === 'records' ? (
        <div className="space-y-6">
          {state.soilTests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <FlaskConical className="w-12 h-12 text-forest-700 mx-auto mb-3 opacity-60" />
              <h3 className="text-lg font-semibold text-gray-900">{t.soil.noRecords}</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mt-1 mb-6">
                Enter parameters from your laboratory Soil Health Card to unlock biological organic recommendations.
              </p>
              <button
                onClick={() => setActiveTab('new')}
                className="px-5 py-2.5 bg-forest-800 text-white font-medium text-sm rounded-xl hover:bg-forest-700"
              >
                {t.soil.newRecord}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Record Selector Sidebar */}
              <div className="lg:col-span-1 space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
                  {t.soil.savedRecords}
                </h3>
                <div className="space-y-2">
                  {state.soilTests.map((rec) => {
                    const isSelected = rec.id === (currentRecord?.id || selectedRecordId);
                    return (
                      <div
                        key={rec.id}
                        onClick={() => setSelectedRecordId(rec.id)}
                        className={`cursor-pointer p-3.5 rounded-xl border transition-all text-left ${
                          isSelected
                            ? 'bg-forest-50/60 border-forest-600 shadow-xs'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-gray-900 truncate">
                            {rec.farmName}
                          </span>
                          {rec.isDemo && <StatusBadge status="demo" />}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(rec.testDate)}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-forest-800 font-medium mt-2 pt-2 border-t border-gray-100">
                          <span className="capitalize">{rec.crop} • {rec.season}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Analysis & Results Display (3 cols) */}
              {currentRecord && (
                <div className="lg:col-span-3 space-y-6">
                  {/* Record Overview Card */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-bold text-gray-900">{currentRecord.farmName}</h2>
                          {currentRecord.isDemo ? <StatusBadge status="demo" /> : <StatusBadge status="verified" />}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {currentRecord.village}, {currentRecord.state} • {currentRecord.farmArea} {currentRecord.farmAreaUnit} • Crop: {currentRecord.crop} ({currentRecord.season})
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Tested: {formatDate(currentRecord.testDate)}</span>
                        <button
                          onClick={() => setRecordToDelete(currentRecord.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title={t.soil.delete}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {currentRecord.notes && (
                      <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg mt-4 border border-gray-100">
                        <span className="font-semibold text-gray-700">Notes:</span> {currentRecord.notes}
                      </p>
                    )}

                    {/* Measured Values Grid */}
                    <div className="mt-6">
                      <h3 className="text-sm font-bold text-gray-900 mb-3">{t.soil.primaryNutrients}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        {(['pH', 'ec', 'organicCarbon', 'nitrogen', 'phosphorus', 'potassium'] as const).map((key) => {
                          const val = currentRecord.parameters[key];
                          const interpretation = interpretSoilParameter(key, val);
                          const info = soilParameterInfo[key];

                          return (
                            <div key={key} className="bg-ivory/60 rounded-xl p-3 border border-forest-100 flex flex-col justify-between">
                              <span className="text-[11px] font-semibold text-gray-600 truncate">{info.name}</span>
                              <div className="my-1.5">
                                <span className="text-xl font-bold text-gray-900">
                                  {val !== undefined ? val : '--'}
                                </span>
                                {info.unit && <span className="text-[10px] text-gray-500 ml-1">{info.unit}</span>}
                              </div>
                              {interpretation ? (
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded text-center truncate ${
                                  interpretation.level === 'neutral' || interpretation.level === 'high' || interpretation.level === 'normal'
                                    ? 'bg-forest-100 text-forest-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {interpretation.label}
                                </span>
                              ) : (
                                <span className="text-[10px] text-gray-400 text-center">{t.journey.missingValue}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Secondary & Micronutrients */}
                    <div className="mt-6">
                      <h3 className="text-sm font-bold text-gray-900 mb-3">{t.soil.secondaryMicronutrients}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        {(['sulphur', 'zinc', 'iron', 'manganese', 'copper', 'boron'] as const).map((key) => {
                          const val = currentRecord.parameters[key];
                          const interpretation = interpretSoilParameter(key, val);
                          const info = soilParameterInfo[key];

                          return (
                            <div key={key} className="bg-gray-50 rounded-xl p-3 border border-gray-200/80 flex flex-col justify-between">
                              <span className="text-[11px] font-semibold text-gray-600 truncate">{info.name}</span>
                              <div className="my-1.5">
                                <span className="text-lg font-bold text-gray-900">
                                  {val !== undefined ? val : '--'}
                                </span>
                                {info.unit && <span className="text-[10px] text-gray-500 ml-1">{info.unit}</span>}
                              </div>
                              {interpretation ? (
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded text-center truncate ${
                                  interpretation.level === 'sufficient'
                                    ? 'bg-forest-100 text-forest-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {interpretation.label}
                                </span>
                              ) : (
                                <span className="text-[10px] text-gray-400 text-center">{t.journey.missingValue}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Interpretations and Traceable Recommendations */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-forest-700" />
                        {t.soil.recommendations}
                      </h3>
                      <StatusBadge status="pending-review" />
                    </div>

                    <div className="space-y-4">
                      {Object.entries(currentRecord.parameters).map(([key, val]) => {
                        const interp = interpretSoilParameter(key, val);
                        if (!interp || interp.level === 'normal' || interp.level === 'neutral' || interp.level === 'sufficient') {
                          return null;
                        }

                        return (
                          <div key={key} className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-600" />
                                <span className="text-sm font-bold text-gray-900">{interp.parameter}: {interp.label}</span>
                              </div>
                              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                                Attention Required
                              </span>
                            </div>

                            <p className="text-xs text-gray-700">
                              <strong className="text-gray-900">{t.soil.whatObserved}:</strong> Measured {interp.value} {interp.unit}. {interp.description}
                            </p>

                            <p className="text-xs text-forest-900 bg-white/80 p-2.5 rounded-lg border border-amber-200/80">
                              <strong className="text-forest-950">{t.soil.suggestedAction}:</strong> {interp.recommendation}
                            </p>

                            <div className="flex items-center justify-between pt-1 text-[11px] text-gray-500">
                              <span><strong>{t.soil.source}:</strong> {interp.source}</span>
                              <span className="italic">Review status: {interp.reviewStatus}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Missing parameters reminder */}
                    <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50">
                      <div className="flex items-start gap-2.5">
                        <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-blue-900">{t.soil.missingParams}</h4>
                          <p className="text-xs text-blue-700 mt-0.5">{t.soil.missingParamsNote}</p>
                        </div>
                      </div>
                    </div>

                    {/* Educational Disclaimer */}
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 text-xs flex items-start gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                      <p className="leading-relaxed">{t.soil.disclaimer}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Form for entering new test record */
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Report Upload Demo Section */}
            <div className="p-5 rounded-2xl border-2 border-dashed border-forest-200 bg-forest-50/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-forest-700" />
                    <h3 className="text-sm font-bold text-gray-900">{t.soil.uploadReport}</h3>
                    <StatusBadge status="demo" />
                  </div>
                  <p className="text-xs text-gray-500 max-w-xl">{t.soil.uploadHint}</p>
                </div>

                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-semibold transition-colors self-start md:self-auto shrink-0">
                  <FileText className="w-4 h-4" />
                  <span>{uploadedFile ? uploadedFile.name : t.soil.selectFile}</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {showDemoExtractionNotice && (
                <div className="mt-4 p-3 bg-white rounded-xl border border-forest-200 text-xs text-forest-900 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-forest-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold">{t.soil.demoExtraction}: </span>
                    {t.soil.demoExtractionNote}
                  </div>
                </div>
              )}
            </div>

            {/* Farm Context Details */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
                {t.soil.farmContext}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t.soil.farmName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="e.g. North Plot"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600 focus:ring-1 focus:ring-forest-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t.soil.village}
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600 focus:ring-1 focus:ring-forest-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t.soil.state}
                  </label>
                  <input
                    type="text"
                    value={soilState}
                    onChange={(e) => setSoilState(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600 focus:ring-1 focus:ring-forest-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t.soil.crop}
                  </label>
                  <input
                    type="text"
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600 focus:ring-1 focus:ring-forest-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t.soil.seasonLabel}
                  </label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600 focus:ring-1 focus:ring-forest-600"
                  >
                    <option value="kharif">{t.soil.kharif}</option>
                    <option value="rabi">{t.soil.rabi}</option>
                    <option value="zaid">{t.soil.zaid}</option>
                    <option value="annual">{t.soil.annual}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t.soil.farmArea}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={farmArea}
                      onChange={(e) => setFarmArea(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600 focus:ring-1 focus:ring-forest-600"
                    />
                    <select
                      value={farmAreaUnit}
                      onChange={(e) => setFarmAreaUnit(e.target.value as any)}
                      className="px-2 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none"
                    >
                      <option value="acres">{t.soil.acres}</option>
                      <option value="hectares">{t.soil.hectares}</option>
                      <option value="bigha">{t.soil.bigha}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t.soil.testDate} *
                  </label>
                  <input
                    type="date"
                    required
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600 focus:ring-1 focus:ring-forest-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t.soil.notes}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Sample collected after summer ploughing"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600 focus:ring-1 focus:ring-forest-600"
                  />
                </div>
              </div>
            </div>

            {/* Primary Soil Parameters Inputs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="text-base font-bold text-gray-900">{t.soil.primaryNutrients}</h3>
                <span className="text-xs text-gray-400">Leave blank if not on report</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: 'pH', label: 'Soil pH', placeholder: '0.0 - 14.0', unit: '' },
                  { key: 'ec', label: 'Electrical Conductivity (EC)', placeholder: 'e.g. 0.45', unit: 'dS/m' },
                  { key: 'organicCarbon', label: 'Organic Carbon (OC)', placeholder: 'e.g. 0.55', unit: '%' },
                  { key: 'nitrogen', label: 'Available Nitrogen (N)', placeholder: 'e.g. 240', unit: 'kg/ha' },
                  { key: 'phosphorus', label: 'Available Phosphorus (P)', placeholder: 'e.g. 18.5', unit: 'kg/ha' },
                  { key: 'potassium', label: 'Available Potassium (K)', placeholder: 'e.g. 195', unit: 'kg/ha' },
                ].map((item) => {
                  const error = errors.find((e) => e.field === item.key);
                  return (
                    <div key={item.key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-700">
                          {item.label}
                        </label>
                        {item.unit && <span className="text-[11px] text-gray-400">{item.unit}</span>}
                      </div>
                      <input
                        type="number"
                        step="any"
                        placeholder={item.placeholder}
                        value={paramInputs[item.key] || ''}
                        onChange={(e) => handleInputChange(item.key, e.target.value)}
                        className={`w-full px-3 py-2 text-sm rounded-xl border ${
                          error ? 'border-red-400 bg-red-50/20' : 'border-gray-200'
                        } focus:outline-none focus:border-forest-600 focus:ring-1 focus:ring-forest-600`}
                      />
                      {error && <p className="text-[11px] text-red-500">{error.message}</p>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Micronutrients Inputs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="text-base font-bold text-gray-900">{t.soil.secondaryMicronutrients}</h3>
                <span className="text-xs text-gray-400">Optional</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { key: 'sulphur', label: 'Sulphur (S)', unit: 'mg/kg' },
                  { key: 'zinc', label: 'Zinc (Zn)', unit: 'mg/kg' },
                  { key: 'iron', label: 'Iron (Fe)', unit: 'mg/kg' },
                  { key: 'manganese', label: 'Manganese', unit: 'mg/kg' },
                  { key: 'copper', label: 'Copper (Cu)', unit: 'mg/kg' },
                  { key: 'boron', label: 'Boron (B)', unit: 'mg/kg' },
                ].map((item) => (
                  <div key={item.key} className="space-y-1">
                    <label className="block text-[11px] font-medium text-gray-700 truncate">
                      {item.label}
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder={item.unit}
                      value={paramInputs[item.key] || ''}
                      onChange={(e) => handleInputChange(item.key, e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-forest-600"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveTab('records')}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-forest-800 hover:bg-forest-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-xs"
              >
                {t.soil.save}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Record Confirmation Dialog */}
      <ConfirmDialog
        open={!!recordToDelete}
        title="Delete Soil Test Record"
        message="Are you sure you want to delete this soil record? This action cannot be undone."
        confirmLabel={t.common.delete}
        cancelLabel={t.common.cancel}
        variant="danger"
        onConfirm={confirmDeleteRecord}
        onCancel={() => setRecordToDelete(null)}
      />
    </div>
  );
}
