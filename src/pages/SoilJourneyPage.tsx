import React, { useState } from 'react';
import {
  TrendingUp,
  Plus,
  Trash2,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  Clock,
  Eye,
  FlaskConical
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useAppStore, generateId } from '../hooks/useAppStore';
import { useTranslation } from '../hooks/useTranslation';
import { useToast } from '../hooks/useToast';
import { formatDate } from '../lib/calculations';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { SoilJourneyChatbot } from '../components/common/SoilJourneyChatbot';
import type { SoilObservation, SoilTestRecord } from '../types';

export function SoilJourneyPage() {
  const { state, dispatch } = useAppStore();
  const { t } = useTranslation();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'timeline' | 'compare' | 'charts'>('timeline');

  // Comparison selection
  const [record1Id, setRecord1Id] = useState<string>(state.soilTests[1]?.id || state.soilTests[0]?.id || '');
  const [record2Id, setRecord2Id] = useState<string>(state.soilTests[0]?.id || '');

  // Add observation modal state
  const [isAddObsModalOpen, setIsAddObsModalOpen] = useState(false);
  const [obsTitle, setObsTitle] = useState('');
  const [obsDate, setObsDate] = useState(new Date().toISOString().split('T')[0]);
  const [obsType, setObsType] = useState<SoilObservation['type']>('observation');
  const [obsDesc, setObsDesc] = useState('');
  const [obsPractice, setObsPractice] = useState('');

  const [obsToDelete, setObsToDelete] = useState<string | null>(null);

  // Selected chart parameter
  const [selectedChartParam, setSelectedChartParam] = useState<'pH' | 'organicCarbon' | 'nitrogen' | 'phosphorus' | 'potassium'>('organicCarbon');

  // Prepare chart data chronologically (oldest to newest)
  const sortedTests = [...state.soilTests].sort(
    (a, b) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime()
  );

  const chartData = sortedTests.map((t) => ({
    date: formatDate(t.testDate),
    rawDate: t.testDate,
    farm: t.farmName,
    crop: t.crop,
    pH: t.parameters.pH,
    organicCarbon: t.parameters.organicCarbon,
    nitrogen: t.parameters.nitrogen,
    phosphorus: t.parameters.phosphorus,
    potassium: t.parameters.potassium,
  }));

  const record1 = state.soilTests.find((r) => r.id === record1Id);
  const record2 = state.soilTests.find((r) => r.id === record2Id);

  const handleAddObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!obsTitle.trim() || !obsDesc.trim()) {
      addToast('Please enter both a title and description.', 'error');
      return;
    }

    const newObs: SoilObservation = {
      id: generateId(),
      date: obsDate,
      type: obsType,
      title: obsTitle.trim(),
      description: obsDesc.trim(),
      relatedPractice: obsPractice.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_OBSERVATION', payload: newObs });
    dispatch({
      type: 'ADD_ACTIVITY',
      payload: {
        id: generateId(),
        date: obsDate,
        type: 'observation',
        title: `Observation recorded: ${newObs.title}`,
        description: newObs.description,
      },
    });

    addToast('Observation logged successfully!', 'success');
    setIsAddObsModalOpen(false);
    setObsTitle('');
    setObsDesc('');
    setObsPractice('');
  };

  const confirmDeleteObs = () => {
    if (obsToDelete) {
      dispatch({ type: 'DELETE_OBSERVATION', payload: obsToDelete });
      addToast('Observation removed.', 'info');
      setObsToDelete(null);
    }
  };

  const compareParams = [
    { key: 'pH', label: 'Soil pH', unit: '' },
    { key: 'ec', label: 'EC', unit: 'dS/m' },
    { key: 'organicCarbon', label: 'Organic Carbon', unit: '%' },
    { key: 'nitrogen', label: 'Nitrogen (N)', unit: 'kg/ha' },
    { key: 'phosphorus', label: 'Phosphorus (P)', unit: 'kg/ha' },
    { key: 'potassium', label: 'Potassium (K)', unit: 'kg/ha' },
    { key: 'zinc', label: 'Zinc (Zn)', unit: 'mg/kg' },
  ] as const;

  // Prepare combined timeline items
  const combinedTimeline = [
    ...state.soilTests.map((t) => ({ ...t, itemDate: t.testDate, feedType: 'test' as const })),
    ...state.observations.map((o) => ({ ...o, itemDate: o.date, feedType: 'observation' as const })),
  ].sort((a, b) => new Date(b.itemDate).getTime() - new Date(a.itemDate).getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">{t.journey.title}</h1>
            <StatusBadge status="verified" />
          </div>
          <p className="text-sm text-gray-500 mt-1">{t.journey.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'timeline'
                ? 'bg-forest-800 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {t.journey.timeline}
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'compare'
                ? 'bg-forest-800 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {t.journey.comparison}
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'charts'
                ? 'bg-forest-800 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {t.journey.charts}
          </button>
          <button
            onClick={() => setIsAddObsModalOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-forest-600 hover:bg-forest-700 text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {t.journey.addObservation}
          </button>
        </div>
      </div>

      {/* Honest Tracking Notice */}
      <div className="bg-ivory rounded-2xl border border-forest-200/80 p-4 text-xs text-forest-900 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-forest-700 mt-0.5 shrink-0" />
        <div className="leading-relaxed">
          <strong>Scientific Observation Principle: </strong>
          {t.journey.chartNote} Demo records are preserved separately and clearly tagged.
        </div>
      </div>

      {activeTab === 'timeline' && (
        <div className="space-y-6">
          {/* Combined Chronological Feed */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-forest-700" />
              Soil Health & Field Action Timeline
            </h3>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-forest-100">
              {combinedTimeline.map((item) => {
                const isTest = item.feedType === 'test';
                const date = item.itemDate;

                return (
                  <div key={item.id} className="relative group">
                    {/* Timeline dot */}
                    <div
                      className={`absolute -left-[27px] top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs ${
                        isTest ? 'bg-forest-700 text-white' : 'bg-emerald-500 text-white'
                      }`}
                    >
                      {isTest ? (
                        <FlaskConical className="w-2.5 h-2.5" />
                      ) : (
                        <Eye className="w-2.5 h-2.5" />
                      )}
                    </div>

                    <div className="p-4 rounded-xl border border-gray-200 bg-white group-hover:border-forest-300 transition-all space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-800 capitalize">
                            {isTest ? 'Laboratory Soil Test' : (item as SoilObservation).type}
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {isTest ? (item as SoilTestRecord).farmName : (item as SoilObservation).title}
                          </span>
                          {isTest && (item as SoilTestRecord).isDemo && <StatusBadge status="demo" />}
                        </div>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(date)}
                        </span>
                      </div>

                      {isTest ? (
                        <div className="space-y-2">
                          <p className="text-xs text-gray-600">
                            Target crop: {(item as SoilTestRecord).crop} ({(item as SoilTestRecord).season}) • Area: {(item as SoilTestRecord).farmArea} {(item as SoilTestRecord).farmAreaUnit}
                          </p>
                          <div className="flex flex-wrap gap-2 pt-1 text-xs font-medium">
                            <span className="px-2 py-1 rounded bg-forest-50 text-forest-800 border border-forest-100">
                              pH: {(item as SoilTestRecord).parameters.pH || '--'}
                            </span>
                            <span className="px-2 py-1 rounded bg-forest-50 text-forest-800 border border-forest-100">
                              OC: {(item as SoilTestRecord).parameters.organicCarbon ? `${(item as SoilTestRecord).parameters.organicCarbon}%` : '--'}
                            </span>
                            <span className="px-2 py-1 rounded bg-forest-50 text-forest-800 border border-forest-100">
                              N: {(item as SoilTestRecord).parameters.nitrogen ? `${(item as SoilTestRecord).parameters.nitrogen} kg/ha` : '--'}
                            </span>
                            <span className="px-2 py-1 rounded bg-forest-50 text-forest-800 border border-forest-100">
                              P: {(item as SoilTestRecord).parameters.phosphorus ? `${(item as SoilTestRecord).parameters.phosphorus} kg/ha` : '--'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-xs text-gray-700 leading-relaxed">
                            {(item as SoilObservation).description}
                          </p>
                          {(item as SoilObservation).relatedPractice && (
                            <p className="text-[11px] text-forest-800 font-semibold">
                              Related Practice: {(item as SoilObservation).relatedPractice}
                            </p>
                          )}
                          <div className="flex justify-end pt-1">
                            <button
                              onClick={() => setObsToDelete(item.id)}
                              className="text-gray-400 hover:text-red-600 text-xs flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'compare' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-gray-900">{t.journey.compareRecords}</h3>
            <p className="text-xs text-gray-500 mt-1">
              Select two test records to observe changes in key soil health indicators side by side.
            </p>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Baseline (Earlier Record)
              </label>
              <select
                value={record1Id}
                onChange={(e) => setRecord1Id(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600"
              >
                {state.soilTests.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.farmName} - {formatDate(t.testDate)} ({t.crop})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Comparison (Later Record)
              </label>
              <select
                value={record2Id}
                onChange={(e) => setRecord2Id(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600"
              >
                {state.soilTests.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.farmName} - {formatDate(t.testDate)} ({t.crop})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Table */}
          {record1 && record2 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-semibold bg-gray-50">
                    <th className="py-2.5 px-3">Parameter</th>
                    <th className="py-2.5 px-3">
                      {record1.farmName} ({formatDate(record1.testDate)})
                    </th>
                    <th className="py-2.5 px-3">
                      {record2.farmName} ({formatDate(record2.testDate)})
                    </th>
                    <th className="py-2.5 px-3 text-right">{t.journey.change}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {compareParams.map((param) => {
                    const val1 = record1.parameters[param.key as keyof typeof record1.parameters];
                    const val2 = record2.parameters[param.key as keyof typeof record2.parameters];

                    let diffNode: React.ReactNode = (
                      <span className="text-gray-400">{t.journey.missingValue}</span>
                    );

                    if (val1 !== undefined && val2 !== undefined) {
                      const diff = Number((val2 - val1).toFixed(2));
                      if (diff > 0) {
                        diffNode = (
                          <span className="inline-flex items-center gap-0.5 text-emerald-700 font-bold">
                            <ArrowUpRight className="w-3.5 h-3.5" /> +{diff} {param.unit}
                          </span>
                        );
                      } else if (diff < 0) {
                        diffNode = (
                          <span className="inline-flex items-center gap-0.5 text-amber-700 font-bold">
                            <ArrowDownRight className="w-3.5 h-3.5" /> {diff} {param.unit}
                          </span>
                        );
                      } else {
                        diffNode = (
                          <span className="inline-flex items-center gap-0.5 text-gray-500">
                            <Minus className="w-3.5 h-3.5" /> {t.journey.noChange}
                          </span>
                        );
                      }
                    }

                    return (
                      <tr key={param.key} className="hover:bg-gray-50/60">
                        <td className="py-2.5 px-3 font-semibold text-gray-900">{param.label}</td>
                        <td className="py-2.5 px-3">
                          {val1 !== undefined ? `${val1} ${param.unit}` : t.journey.missingValue}
                        </td>
                        <td className="py-2.5 px-3">
                          {val2 !== undefined ? `${val2} ${param.unit}` : t.journey.missingValue}
                        </td>
                        <td className="py-2.5 px-3 text-right">{diffNode}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-8 text-gray-400 text-xs">{t.journey.noRecords}</p>
          )}
        </div>
      )}

      {activeTab === 'charts' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">{t.journey.charts}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Visualise measured laboratory parameter progression across recorded test dates.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { key: 'organicCarbon', label: 'Organic Carbon (%)' },
                  { key: 'pH', label: 'Soil pH' },
                  { key: 'nitrogen', label: 'Nitrogen (kg/ha)' },
                  { key: 'phosphorus', label: 'Phosphorus (kg/ha)' },
                  { key: 'potassium', label: 'Potassium (kg/ha)' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedChartParam(tab.key)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    selectedChartParam === tab.key
                      ? 'bg-forest-800 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {chartData.length >= 2 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={selectedChartParam}
                    name={selectedChartParam}
                    stroke="#1B4332"
                    strokeWidth={2.5}
                    dot={{ fill: '#2D6A4F', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 text-xs">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
              {t.journey.noDataForChart}
            </div>
          )}
        </div>
      )}

      {/* Add Observation Modal */}
      <Modal
        open={isAddObsModalOpen}
        onClose={() => setIsAddObsModalOpen(false)}
        title={t.journey.addObservation}
        size="md"
      >
        <form onSubmit={handleAddObservation} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t.journey.observationTitle} *
            </label>
            <input
              type="text"
              required
              value={obsTitle}
              onChange={(e) => setObsTitle(e.target.value)}
              placeholder="e.g. Earthworm count or Mulch decomposition"
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {t.journey.observationDate}
              </label>
              <input
                type="date"
                required
                value={obsDate}
                onChange={(e) => setObsDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {t.journey.observationType}
              </label>
              <select
                value={obsType}
                onChange={(e) => setObsType(e.target.value as any)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600"
              >
                <option value="observation">{t.journey.observation}</option>
                <option value="measurement">{t.journey.measurement}</option>
                <option value="note">{t.journey.note}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t.journey.relatedPractice}
            </label>
            <input
              type="text"
              value={obsPractice}
              onChange={(e) => setObsPractice(e.target.value)}
              placeholder="e.g. Jeevamrit or Vermicomposting"
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t.journey.observationDescription} *
            </label>
            <textarea
              rows={3}
              required
              value={obsDesc}
              onChange={(e) => setObsDesc(e.target.value)}
              placeholder="Describe physical changes in soil moisture, compaction, or biological life..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddObsModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-forest-800 text-white font-semibold text-sm rounded-xl hover:bg-forest-700"
            >
              {t.journey.saveObservation}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Observation Confirmation */}
      <ConfirmDialog
        open={!!obsToDelete}
        title={t.journey.deleteObservation}
        message="Are you sure you want to delete this observation?"
        confirmLabel={t.common.delete}
        cancelLabel={t.common.cancel}
        onConfirm={confirmDeleteObs}
        onCancel={() => setObsToDelete(null)}
      />

      {/* Floating Portable Soil Advisor Chatbot (Bottom Right) */}
      <SoilJourneyChatbot />
    </div>
  );
}
