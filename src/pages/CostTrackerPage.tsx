import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  PieChart as PieIcon,
  Edit2
} from 'lucide-react';
import { useAppStore, generateId } from '../hooks/useAppStore';
import { useTranslation } from '../hooks/useTranslation';
import { useToast } from '../hooks/useToast';
import {
  calculateTotalCost,
  calculateCostByCategory,
  calculateCostDifference,
  calculateRevenue,
  calculateNetReturn,
  formatCurrency
} from '../lib/calculations';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import type { CostEntry, CostScenario } from '../types';

export function CostTrackerPage() {
  const { state, dispatch } = useAppStore();
  const { t } = useTranslation();
  const { addToast } = useToast();

  // Pick or initialize current vs proposed scenario
  const currentScenario =
    state.costScenarios.find((s) => s.type === 'current') ||
    state.costScenarios[0] || {
      id: 'current-default',
      name: 'Current Conventional Practice',
      type: 'current',
      crop: state.profile?.primaryCrop || 'Soybean',
      season: 'Kharif 2026',
      farmArea: state.profile?.farmArea || 2.5,
      farmAreaUnit: 'acres',
      entries: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

  const proposedScenario =
    state.costScenarios.find((s) => s.type === 'proposed') || {
      id: 'proposed-default',
      name: 'Proposed Natural Farming Plan',
      type: 'proposed',
      crop: state.profile?.primaryCrop || 'Soybean',
      season: 'Kharif 2026',
      farmArea: state.profile?.farmArea || 2.5,
      farmAreaUnit: 'acres',
      entries: [
        {
          id: 'p-entry-1',
          scenarioId: 'proposed-default',
          category: 'natural-inputs',
          description: 'Jeevamrit preparation materials (local cow dung, jaggery, besan)',
          quantity: 4,
          unit: 'batches',
          pricePerUnit: 250,
          totalCost: 1000,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'p-entry-2',
          scenarioId: 'proposed-default',
          category: 'natural-inputs',
          description: 'Beejamrit seed treatment',
          quantity: 1,
          unit: 'application',
          pricePerUnit: 150,
          totalCost: 150,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'p-entry-3',
          scenarioId: 'proposed-default',
          category: 'labour',
          description: 'Mulching and manual bio-spray applications',
          quantity: 10,
          unit: 'days',
          pricePerUnit: 350,
          totalCost: 3500,
          createdAt: new Date().toISOString(),
        },
      ],
      harvestedQty: 11.5,
      harvestedUnit: 'quintals',
      soldQty: 11,
      sellingPrice: 5200, // Potential organic premium
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

  // State for Add / Edit Entry Modal
  const [modalTargetScenario, setModalTargetScenario] = useState<'current' | 'proposed'>('current');
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  const [entryCategory, setEntryCategory] = useState<CostEntry['category']>('seeds');
  const [entryDesc, setEntryDesc] = useState('');
  const [entryQty, setEntryQty] = useState<number>(1);
  const [entryUnit, setEntryUnit] = useState('kg');
  const [entryPrice, setEntryPrice] = useState<number>(0);

  const [entryToDelete, setEntryToDelete] = useState<{ id: string; scenarioType: 'current' | 'proposed' } | null>(null);

  // Totals calculations
  const currentTotal = calculateTotalCost(currentScenario.entries);
  const proposedTotal = calculateTotalCost(proposedScenario.entries);
  const costDiff = calculateCostDifference(currentTotal, proposedTotal);

  const currentRevenue = calculateRevenue(currentScenario);
  const proposedRevenue = calculateRevenue(proposedScenario);
  const currentNetReturn = calculateNetReturn(currentScenario);
  const proposedNetReturn = calculateNetReturn(proposedScenario);

  const currentCategoryTotals = calculateCostByCategory(currentScenario.entries);
  const proposedCategoryTotals = calculateCostByCategory(proposedScenario.entries);

  // Handle Open Add Entry
  const handleOpenAddEntry = (target: 'current' | 'proposed') => {
    setModalTargetScenario(target);
    setEditingEntryId(null);
    setEntryCategory(target === 'proposed' ? 'natural-inputs' : 'fertilizers');
    setEntryDesc('');
    setEntryQty(1);
    setEntryUnit('units');
    setEntryPrice(0);
    setIsEntryModalOpen(true);
  };

  // Handle Edit Entry
  const handleOpenEditEntry = (target: 'current' | 'proposed', entry: CostEntry) => {
    setModalTargetScenario(target);
    setEditingEntryId(entry.id);
    setEntryCategory(entry.category);
    setEntryDesc(entry.description);
    setEntryQty(entry.quantity);
    setEntryUnit(entry.unit);
    setEntryPrice(entry.pricePerUnit);
    setIsEntryModalOpen(true);
  };

  // Handle Save Entry
  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryDesc.trim()) {
      addToast('Description is required.', 'error');
      return;
    }

    const calculatedTotal = (Number(entryQty) || 0) * (Number(entryPrice) || 0);

    const target = modalTargetScenario === 'current' ? currentScenario : proposedScenario;
    let updatedEntries: CostEntry[];

    if (editingEntryId) {
      updatedEntries = target.entries.map((item) =>
        item.id === editingEntryId
          ? {
              ...item,
              category: entryCategory,
              description: entryDesc.trim(),
              quantity: Number(entryQty) || 0,
              unit: entryUnit.trim(),
              pricePerUnit: Number(entryPrice) || 0,
              totalCost: calculatedTotal,
            }
          : item
      );
    } else {
      const newEntry: CostEntry = {
        id: generateId(),
        scenarioId: target.id,
        category: entryCategory,
        description: entryDesc.trim(),
        quantity: Number(entryQty) || 0,
        unit: entryUnit.trim(),
        pricePerUnit: Number(entryPrice) || 0,
        totalCost: calculatedTotal,
        createdAt: new Date().toISOString(),
      };
      updatedEntries = [...target.entries, newEntry];
    }

    const updatedScenario: CostScenario = {
      ...target,
      entries: updatedEntries,
      updatedAt: new Date().toISOString(),
    };

    // If scenario exists in state, update it; otherwise add it
    if (state.costScenarios.some((s) => s.id === target.id)) {
      dispatch({ type: 'UPDATE_COST_SCENARIO', payload: updatedScenario });
    } else {
      dispatch({ type: 'ADD_COST_SCENARIO', payload: updatedScenario });
    }

    setIsEntryModalOpen(false);
    addToast(editingEntryId ? 'Entry updated.' : 'Expense entry recorded!', 'success');
  };

  // Confirm delete entry
  const confirmDeleteEntry = () => {
    if (!entryToDelete) return;

    const target = entryToDelete.scenarioType === 'current' ? currentScenario : proposedScenario;
    const updatedEntries = target.entries.filter((e) => e.id !== entryToDelete.id);
    const updatedScenario: CostScenario = {
      ...target,
      entries: updatedEntries,
      updatedAt: new Date().toISOString(),
    };

    if (state.costScenarios.some((s) => s.id === target.id)) {
      dispatch({ type: 'UPDATE_COST_SCENARIO', payload: updatedScenario });
    } else {
      dispatch({ type: 'ADD_COST_SCENARIO', payload: updatedScenario });
    }

    addToast('Cost entry deleted.', 'info');
    setEntryToDelete(null);
  };

  const categoriesList = [
    { key: 'seeds', label: t.cost.categories.seeds },
    { key: 'fertilizers', label: t.cost.categories.fertilizers },
    { key: 'natural-inputs', label: t.cost.categories['natural-inputs'] },
    { key: 'crop-protection', label: t.cost.categories['crop-protection'] },
    { key: 'labour', label: t.cost.categories.labour },
    { key: 'irrigation', label: t.cost.categories.irrigation },
    { key: 'transportation', label: t.cost.categories.transportation },
    { key: 'other', label: t.cost.categories.other },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">{t.cost.title}</h1>
            <StatusBadge status="verified" />
          </div>
          <p className="text-sm text-gray-500 mt-1">{t.cost.subtitle}</p>
        </div>
      </div>

      {/* Comparison Summary Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Current Cost */}
          <div className="text-center md:text-left space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {t.cost.currentPractice}
            </span>
            <div className="text-2xl font-extrabold text-gray-900">
              {formatCurrency(currentTotal)}
            </div>
            <p className="text-xs text-gray-500">
              {currentScenario.entries.length} items recorded • {currentScenario.crop} ({currentScenario.season})
            </p>
          </div>

          {/* Difference Metric */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-ivory/60 border border-forest-100 text-center">
            <span className="text-xs font-semibold text-forest-900 uppercase tracking-wider mb-1">
              {t.cost.difference}
            </span>
            <div className="flex items-center gap-2">
              {costDiff.isLower ? (
                <TrendingDown className="w-6 h-6 text-emerald-600" />
              ) : (
                <TrendingUp className="w-6 h-6 text-amber-600" />
              )}
              <span className={`text-2xl font-black ${costDiff.isLower ? 'text-emerald-700' : 'text-amber-700'}`}>
                {formatCurrency(Math.abs(costDiff.difference))}
              </span>
            </div>
            <p className="text-xs font-medium text-gray-600 mt-1">
              {costDiff.percentageDifference !== null
                ? `${costDiff.percentageDifference.toFixed(1)}% ${costDiff.isLower ? t.cost.lowerCost : t.cost.higherCost}`
                : 'Enter current costs to compare percentage'}
            </p>
          </div>

          {/* Proposed Cost */}
          <div className="text-center md:text-right space-y-1">
            <span className="text-xs font-semibold text-forest-800 uppercase tracking-wider">
              {t.cost.proposedPlan}
            </span>
            <div className="text-2xl font-extrabold text-forest-900">
              {formatCurrency(proposedTotal)}
            </div>
            <p className="text-xs text-gray-500">
              {proposedScenario.entries.length} items recorded • {proposedScenario.crop} ({proposedScenario.season})
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-side Scenarios Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scenario 1: Current Conventional Practice */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">{currentScenario.name}</h3>
                <p className="text-xs text-gray-500">
                  {currentScenario.crop} • {currentScenario.farmArea} {currentScenario.farmAreaUnit}
                </p>
              </div>
              <button
                onClick={() => handleOpenAddEntry('current')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                {t.cost.addEntry}
              </button>
            </div>

            {/* Entries List */}
            <div className="mt-4 space-y-2">
              {currentScenario.entries.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-xs">
                  {t.cost.noEntries}
                </div>
              ) : (
                currentScenario.entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 rounded-xl border border-gray-100 hover:border-gray-200 bg-gray-50/50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 truncate">
                          {entry.description}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-200 text-gray-700 capitalize">
                          {entry.category}
                        </span>
                      </div>
                      <span className="text-gray-500">
                        {entry.quantity} {entry.unit} × {formatCurrency(entry.pricePerUnit)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-gray-900">
                        {formatCurrency(entry.totalCost)}
                      </span>
                      <button
                        onClick={() => handleOpenEditEntry('current', entry)}
                        className="text-gray-400 hover:text-gray-700"
                        title={t.cost.editEntry}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEntryToDelete({ id: entry.id, scenarioType: 'current' })}
                        className="text-gray-400 hover:text-red-600"
                        title={t.cost.deleteEntry}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between font-bold text-sm text-gray-900">
            <span>{t.cost.totalCultivationCost}</span>
            <span>{formatCurrency(currentTotal)}</span>
          </div>
        </div>

        {/* Scenario 2: Proposed Natural Farming Plan */}
        <div className="bg-white rounded-2xl border border-forest-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-forest-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-forest-950">{proposedScenario.name}</h3>
                <p className="text-xs text-forest-700">
                  {proposedScenario.crop} • {proposedScenario.farmArea} {proposedScenario.farmAreaUnit}
                </p>
              </div>
              <button
                onClick={() => handleOpenAddEntry('proposed')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-forest-100 hover:bg-forest-200 text-forest-900 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                {t.cost.addEntry}
              </button>
            </div>

            {/* Entries List */}
            <div className="mt-4 space-y-2">
              {proposedScenario.entries.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-xs">
                  {t.cost.noEntries}
                </div>
              ) : (
                proposedScenario.entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 rounded-xl border border-forest-100 hover:border-forest-200 bg-forest-50/30 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 truncate">
                          {entry.description}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-forest-200 text-forest-900 capitalize">
                          {entry.category}
                        </span>
                      </div>
                      <span className="text-gray-500">
                        {entry.quantity} {entry.unit} × {formatCurrency(entry.pricePerUnit)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-forest-950">
                        {formatCurrency(entry.totalCost)}
                      </span>
                      <button
                        onClick={() => handleOpenEditEntry('proposed', entry)}
                        className="text-gray-400 hover:text-forest-700"
                        title={t.cost.editEntry}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEntryToDelete({ id: entry.id, scenarioType: 'proposed' })}
                        className="text-gray-400 hover:text-red-600"
                        title={t.cost.deleteEntry}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-forest-100 flex items-center justify-between font-bold text-sm text-forest-950">
            <span>{t.cost.totalCultivationCost}</span>
            <span>{formatCurrency(proposedTotal)}</span>
          </div>
        </div>
      </div>

      {/* Yield & Net Return Summary (when available) */}
      {(currentRevenue !== null || proposedRevenue !== null) && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-gray-900">{t.cost.harvestYield} & Estimated Returns</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {currentRevenue !== null && (
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-1.5">
                <p className="font-bold text-gray-900">{currentScenario.name}</p>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t.cost.revenue}:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(currentRevenue)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-1 font-bold">
                  <span className="text-gray-700">{t.cost.netReturn}:</span>
                  <span className={currentNetReturn && currentNetReturn > 0 ? 'text-emerald-700' : 'text-gray-900'}>
                    {currentNetReturn !== null ? formatCurrency(currentNetReturn) : '--'}
                  </span>
                </div>
              </div>
            )}
            {proposedRevenue !== null && (
              <div className="p-4 rounded-xl border border-forest-100 bg-forest-50/40 space-y-1.5">
                <p className="font-bold text-forest-950">{proposedScenario.name}</p>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t.cost.revenue}:</span>
                  <span className="font-semibold text-forest-950">{formatCurrency(proposedRevenue)}</span>
                </div>
                <div className="flex justify-between border-t border-forest-200 pt-1 font-bold">
                  <span className="text-forest-900">{t.cost.netReturn}:</span>
                  <span className={proposedNetReturn && proposedNetReturn > 0 ? 'text-emerald-700' : 'text-forest-900'}>
                    {proposedNetReturn !== null ? formatCurrency(proposedNetReturn) : '--'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category Breakdown Table */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <PieIcon className="w-4 h-4 text-forest-700" />
          {t.cost.costBreakdown} by Category
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 font-semibold bg-gray-50/50">
                <th className="py-2.5 px-3">{t.cost.category}</th>
                <th className="py-2.5 px-3 text-right">{t.cost.currentPractice}</th>
                <th className="py-2.5 px-3 text-right">{t.cost.proposedPlan}</th>
                <th className="py-2.5 px-3 text-right">{t.cost.difference}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {categoriesList.map((cat) => {
                const cur = currentCategoryTotals[cat.key] || 0;
                const prop = proposedCategoryTotals[cat.key] || 0;
                const diff = cur - prop;

                if (cur === 0 && prop === 0) return null;

                return (
                  <tr key={cat.key} className="hover:bg-gray-50/60">
                    <td className="py-2.5 px-3 font-medium text-gray-900">{cat.label}</td>
                    <td className="py-2.5 px-3 text-right">{formatCurrency(cur)}</td>
                    <td className="py-2.5 px-3 text-right">{formatCurrency(prop)}</td>
                    <td className="py-2.5 px-3 text-right font-semibold">
                      <span className={diff > 0 ? 'text-emerald-700' : diff < 0 ? 'text-amber-700' : 'text-gray-500'}>
                        {diff > 0 ? '-' : diff < 0 ? '+' : ''}{formatCurrency(Math.abs(diff))}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200 font-bold text-gray-900 bg-gray-50/80">
                <td className="py-3 px-3">Total Cost</td>
                <td className="py-3 px-3 text-right">{formatCurrency(currentTotal)}</td>
                <td className="py-3 px-3 text-right">{formatCurrency(proposedTotal)}</td>
                <td className="py-3 px-3 text-right text-emerald-800">
                  {costDiff.isLower ? `Savings: ${formatCurrency(costDiff.difference)}` : formatCurrency(costDiff.difference)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 text-xs flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
        <p className="leading-relaxed">{t.cost.disclaimer}</p>
      </div>

      {/* Add / Edit Entry Modal */}
      <Modal
        open={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        title={editingEntryId ? t.cost.editEntry : t.cost.addEntry}
        size="md"
      >
        <form onSubmit={handleSaveEntry} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t.cost.category}
            </label>
            <select
              value={entryCategory}
              onChange={(e) => setEntryCategory(e.target.value as any)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600"
            >
              {categoriesList.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t.cost.description} *
            </label>
            <input
              type="text"
              required
              value={entryDesc}
              onChange={(e) => setEntryDesc(e.target.value)}
              placeholder="e.g. Jeevamrit ingredients or Urea"
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {t.cost.quantity}
              </label>
              <input
                type="number"
                step="any"
                min="0.01"
                required
                value={entryQty}
                onChange={(e) => setEntryQty(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {t.cost.unitLabel}
              </label>
              <input
                type="text"
                required
                value={entryUnit}
                onChange={(e) => setEntryUnit(e.target.value)}
                placeholder="kg, litre, days"
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t.cost.pricePerUnit} (₹) *
            </label>
            <input
              type="number"
              step="any"
              min="0"
              required
              value={entryPrice}
              onChange={(e) => setEntryPrice(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600"
            />
          </div>

          <div className="p-3 bg-gray-50 rounded-xl text-xs flex justify-between font-semibold text-gray-900">
            <span>{t.cost.totalCost}:</span>
            <span>{formatCurrency((Number(entryQty) || 0) * (Number(entryPrice) || 0))}</span>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEntryModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-forest-800 text-white font-semibold text-sm rounded-xl hover:bg-forest-700"
            >
              {t.cost.save}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Entry Confirmation */}
      <ConfirmDialog
        open={!!entryToDelete}
        title={t.cost.deleteEntry}
        message="Are you sure you want to delete this cost entry?"
        confirmLabel={t.common.delete}
        cancelLabel={t.common.cancel}
        onConfirm={confirmDeleteEntry}
        onCancel={() => setEntryToDelete(null)}
      />
    </div>
  );
}
