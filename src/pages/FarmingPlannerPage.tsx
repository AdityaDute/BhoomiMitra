import React, { useState } from 'react';
import {
  Leaf,
  Search,
  Bookmark,
  BookmarkCheck,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useAppStore, generateId } from '../hooks/useAppStore';
import { useTranslation } from '../hooks/useTranslation';
import { useToast } from '../hooks/useToast';
import { farmingPractices } from '../data/farmingPractices';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import type { FarmingPractice, FarmingPlan } from '../types';

export function FarmingPlannerPage() {
  const { state, dispatch } = useAppStore();
  const { t } = useTranslation();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'library' | 'my-plans'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSystem, setSelectedSystem] = useState<string>('all');

  // Selected practice for detail modal
  const [detailPractice, setDetailPractice] = useState<FarmingPractice | null>(null);

  // Active plan creation / editing state
  const [activePlanId, setActivePlanId] = useState<string | null>(
    state.farmingPlans[0]?.id || null
  );
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  // Draft plan form
  const [planName, setPlanName] = useState(
    state.farmingPlans[0]?.name || `${state.profile?.primaryCrop || 'Soybean'} Natural Transition Plan`
  );
  const [planCrop, setPlanCrop] = useState(state.profile?.primaryCrop || 'Soybean');
  const [planSeason, setPlanSeason] = useState('Kharif 2026');
  const [planNotes, setPlanNotes] = useState(
    state.farmingPlans[0]?.notes || 'Focus on biological soil activation and reducing synthetic inputs.'
  );
  const [planPractices, setPlanPractices] = useState<string[]>(
    state.farmingPlans[0]?.practices || ['practice-001', 'practice-002', 'practice-005']
  );

  // Filtering practices
  const filteredPractices = farmingPractices.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;

    const matchesSystem =
      selectedSystem === 'all' ||
      p.system === selectedSystem ||
      p.system === 'both';

    return matchesSearch && matchesCategory && matchesSystem;
  });

  // Toggle practice in active plan
  const togglePracticeInPlan = (practiceId: string) => {
    setPlanPractices((prev) => {
      const exists = prev.includes(practiceId);
      if (exists) {
        addToast('Removed from active plan draft.', 'info');
        return prev.filter((id) => id !== practiceId);
      } else {
        addToast('Added to active plan draft!', 'success');
        return [...prev, practiceId];
      }
    });
  };

  // Toggle bookmark saved practice
  const handleToggleSaved = (practiceId: string) => {
    dispatch({ type: 'TOGGLE_SAVED_PRACTICE', payload: practiceId });
    const isSaved = state.savedPractices.includes(practiceId);
    addToast(isSaved ? 'Practice unsaved.' : 'Practice saved to your bookmarks!', 'info');
  };

  // Save or Update Plan
  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (planPractices.length === 0) {
      addToast('Please select at least one practice for your plan.', 'warning');
      return;
    }

    if (activePlanId && state.farmingPlans.some((p) => p.id === activePlanId)) {
      // Update existing
      const updatedPlan: FarmingPlan = {
        id: activePlanId,
        name: planName.trim(),
        crop: planCrop.trim(),
        season: planSeason.trim(),
        practices: planPractices,
        notes: planNotes.trim(),
        createdAt: state.farmingPlans.find((p) => p.id === activePlanId)?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: 'UPDATE_FARMING_PLAN', payload: updatedPlan });
      addToast('Farming plan updated successfully!', 'success');
    } else {
      // Create new
      const newPlanId = generateId();
      const newPlan: FarmingPlan = {
        id: newPlanId,
        name: planName.trim(),
        crop: planCrop.trim(),
        season: planSeason.trim(),
        practices: planPractices,
        notes: planNotes.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_FARMING_PLAN', payload: newPlan });
      dispatch({
        type: 'ADD_ACTIVITY',
        payload: {
          id: generateId(),
          date: new Date().toISOString().split('T')[0],
          type: 'plan-created',
          title: `Plan created: ${newPlan.name}`,
          description: `Includes ${newPlan.practices.length} natural farming practices for ${newPlan.crop}.`,
          relatedId: newPlanId,
        },
      });
      setActivePlanId(newPlanId);
      addToast('New farming plan created and saved!', 'success');
    }

    setActiveTab('my-plans');
  };

  const confirmDeletePlan = () => {
    if (planToDelete) {
      dispatch({ type: 'DELETE_FARMING_PLAN', payload: planToDelete });
      addToast('Plan deleted.', 'info');
      setPlanToDelete(null);
      if (activePlanId === planToDelete) {
        const remaining = state.farmingPlans.filter((p) => p.id !== planToDelete);
        setActivePlanId(remaining[0]?.id || null);
      }
    }
  };

  // Aggregated plan resources
  const aggregatedResources = Array.from(
    new Set(
      farmingPractices
        .filter((p) => planPractices.includes(p.id))
        .flatMap((p) => p.resources)
    )
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">{t.planner.title}</h1>
            <StatusBadge status="verified" />
          </div>
          <p className="text-sm text-gray-500 mt-1">{t.planner.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === 'library'
                ? 'bg-forest-800 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {t.planner.practiceLibrary}
          </button>
          <button
            onClick={() => setActiveTab('my-plans')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors relative ${
              activeTab === 'my-plans'
                ? 'bg-forest-800 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {t.planner.myPlan}
            {planPractices.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-forest-500 text-forest-950 font-bold">
                {planPractices.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* System Distinction Notice */}
      <div className="bg-forest-50/60 rounded-2xl border border-forest-200/80 p-4 text-xs text-forest-900 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-forest-700 mt-0.5 shrink-0" />
        <div className="leading-relaxed">
          <strong className="font-semibold text-forest-950">Organic vs. Zero Budget Natural Farming (ZBNF): </strong>
          Organic farming replaces synthetic inputs with certified organic composts and bio-inputs, while ZBNF is a specific system founded on on-farm microbial cultures (Jeevamrit, Beejamrit), mulching (Acchadana), and moisture management (Whapasa). BhoomiMitra AI clearly distinguishes both systems so you can pick appropriate methods without confusion.
        </div>
      </div>

      {activeTab === 'library' ? (
        <div className="space-y-6">
          {/* Search & Filters */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.planner.searchPractices}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600 focus:ring-1 focus:ring-forest-600"
                />
              </div>

              {/* Category Dropdown */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-forest-600"
              >
                <option value="all">{t.planner.allCategories}</option>
                <option value="soil-amendment">{t.planner.categories['soil-amendment']}</option>
                <option value="seed-treatment">{t.planner.categories['seed-treatment']}</option>
                <option value="composting">{t.planner.categories['composting']}</option>
                <option value="crop-management">{t.planner.categories['crop-management']}</option>
                <option value="pest-management">{t.planner.categories['pest-management']}</option>
              </select>

              {/* System Dropdown */}
              <select
                value={selectedSystem}
                onChange={(e) => setSelectedSystem(e.target.value)}
                className="px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-forest-600"
              >
                <option value="all">{t.planner.allSystems}</option>
                <option value="organic">{t.planner.organic}</option>
                <option value="zbnf">{t.planner.zbnf}</option>
                <option value="both">{t.planner.both}</option>
              </select>
            </div>
          </div>

          {/* Practices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPractices.map((practice) => {
              const inPlan = planPractices.includes(practice.id);
              const isSaved = state.savedPractices.includes(practice.id);

              return (
                <div
                  key={practice.id}
                  className="bg-white rounded-2xl border border-gray-200 hover:border-forest-300 shadow-xs hover:shadow-sm transition-all p-5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1 ${
                          practice.system === 'zbnf'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : practice.system === 'organic'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            : 'bg-blue-100 text-blue-900 border border-blue-200'
                        }`}>
                          {practice.system === 'zbnf' ? 'ZBNF' : practice.system === 'organic' ? 'Organic' : 'Organic & ZBNF'}
                        </span>
                        <h3 className="text-base font-bold text-gray-900 leading-snug">
                          {practice.name}
                        </h3>
                      </div>

                      <button
                        onClick={() => handleToggleSaved(practice.id)}
                        className="p-1.5 text-gray-400 hover:text-forest-700 rounded-lg hover:bg-forest-50 transition-colors"
                        title={isSaved ? t.planner.unsavePractice : t.planner.savePractice}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-5 h-5 text-forest-700" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {practice.purpose}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs">
                      <div className="text-gray-500">
                        <strong className="text-gray-700">Resources: </strong>
                        <span className="line-clamp-1">{practice.resources.slice(0, 3).join(', ')}...</span>
                      </div>
                      <div className="text-gray-500">
                        <strong className="text-gray-700">Timing: </strong>
                        <span className="line-clamp-1">{practice.timing}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setDetailPractice(practice)}
                      className="text-xs font-semibold text-forest-800 hover:text-forest-600 transition-colors"
                    >
                      {t.planner.viewDetails}
                    </button>

                    <button
                      onClick={() => togglePracticeInPlan(practice.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        inPlan
                          ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                          : 'bg-forest-800 text-white hover:bg-forest-700 shadow-xs'
                      }`}
                    >
                      {inPlan ? t.planner.removeFromPlan : t.planner.addToPlan}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPractices.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <Leaf className="w-10 h-10 text-gray-400 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-gray-700">{t.planner.noPractices}</p>
            </div>
          )}
        </div>
      ) : (
        /* My Farming Plan View */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Plan Builder & Selected Practices */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                <form onSubmit={handleSavePlan} className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <h2 className="text-lg font-bold text-gray-900">{t.planner.myPlan}</h2>
                    <span className="text-xs text-forest-800 font-semibold bg-forest-50 px-2.5 py-1 rounded-full border border-forest-200">
                      {planPractices.length} practices included
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t.planner.planName}
                      </label>
                      <input
                        type="text"
                        required
                        value={planName}
                        onChange={(e) => setPlanName(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t.planner.planCrop}
                      </label>
                      <input
                        type="text"
                        required
                        value={planCrop}
                        onChange={(e) => setPlanCrop(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t.planner.planSeason}
                      </label>
                      <input
                        type="text"
                        required
                        value={planSeason}
                        onChange={(e) => setPlanSeason(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {t.planner.planNotes}
                    </label>
                    <textarea
                      rows={2}
                      value={planNotes}
                      onChange={(e) => setPlanNotes(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-forest-800 hover:bg-forest-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs"
                    >
                      {t.planner.savePlan}
                    </button>
                  </div>
                </form>
              </div>

              {/* Practices in this Plan */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-gray-900">
                  {t.planner.selectedPractices} ({planPractices.length})
                </h3>

                {planPractices.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-3">{t.planner.noPlan}</p>
                    <button
                      onClick={() => setActiveTab('library')}
                      className="px-4 py-2 bg-forest-800 text-white rounded-xl text-xs font-semibold"
                    >
                      Browse Practice Library
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {planPractices.map((pid) => {
                      const practice = farmingPractices.find((p) => p.id === pid);
                      if (!practice) return null;

                      return (
                        <div
                          key={practice.id}
                          className="p-4 rounded-xl border border-gray-200 bg-white hover:border-forest-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-gray-900">{practice.name}</h4>
                              <StatusBadge status={practice.verificationStatus} />
                            </div>
                            <p className="text-xs text-gray-600">{practice.purpose}</p>
                            <p className="text-[11px] text-forest-800 font-medium">
                              <strong>Schedule:</strong> {practice.timing}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => setDetailPractice(practice)}
                              className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                            >
                              {t.planner.viewDetails}
                            </button>
                            <button
                              onClick={() => togglePracticeInPlan(practice.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                              title={t.planner.removeFromPlan}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right 1 Col: Required Resources & Farm Protocol Checklist */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-forest-700" />
                  {t.planner.resources}
                </h3>
                <p className="text-xs text-gray-500">
                  Materials required across all practices in this plan:
                </p>

                {aggregatedResources.length > 0 ? (
                  <ul className="space-y-2">
                    {aggregatedResources.map((res, i) => (
                      <li key={i} className="text-xs text-gray-700 flex items-start gap-2 bg-ivory/60 p-2 rounded-lg border border-forest-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-forest-600 mt-0.5 shrink-0" />
                        <span>{res}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-400 italic">No resources to show</p>
                )}
              </div>

              {/* Safety notice */}
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-950">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Important Agricultural Safety</span>
                </div>
                <p className="leading-relaxed">
                  Never invent input dosages or preparation recipes. Organic and natural preparations must follow verified guidelines and field tests. If you notice signs of severe crop stress, consult an agricultural university or extension officer.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Practice Details Modal */}
      {detailPractice && (
        <Modal
          open={!!detailPractice}
          onClose={() => setDetailPractice(null)}
          title={detailPractice.name}
          size="lg"
        >
          <div className="space-y-4 text-sm">
            <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-forest-100 text-forest-900">
                System: {detailPractice.system.toUpperCase()}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                Category: {detailPractice.category}
              </span>
              <StatusBadge status={detailPractice.verificationStatus} />
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase">{t.planner.purpose}</h4>
              <p className="text-gray-900 mt-1">{detailPractice.purpose}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase">Description</h4>
              <p className="text-gray-700 mt-1 leading-relaxed">{detailPractice.description}</p>
            </div>

            <div className="bg-forest-50/50 p-4 rounded-xl border border-forest-100 space-y-2">
              <h4 className="text-xs font-bold text-forest-950 uppercase">{t.planner.preparation}</h4>
              <p className="text-gray-800 leading-relaxed text-xs">{detailPractice.preparation}</p>
            </div>

            <div className="bg-ivory/70 p-4 rounded-xl border border-forest-100 space-y-2">
              <h4 className="text-xs font-bold text-forest-950 uppercase">{t.planner.application}</h4>
              <p className="text-gray-800 leading-relaxed text-xs">{detailPractice.application}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">{t.planner.resources}</h4>
                <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                  {detailPractice.resources.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">{t.planner.precautions}</h4>
                <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                  {detailPractice.precautions.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 text-xs text-gray-500">
              <strong>Source:</strong> {detailPractice.source}
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                onClick={() => setDetailPractice(null)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-xl"
              >
                {t.common.close}
              </button>
              <button
                onClick={() => {
                  togglePracticeInPlan(detailPractice.id);
                  setDetailPractice(null);
                }}
                className="px-5 py-2 bg-forest-800 text-white text-sm font-semibold rounded-xl hover:bg-forest-700"
              >
                {planPractices.includes(detailPractice.id) ? t.planner.removeFromPlan : t.planner.addToPlan}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!planToDelete}
        title="Delete Farming Plan"
        message="Are you sure you want to remove this farming plan?"
        confirmLabel={t.common.delete}
        cancelLabel={t.common.cancel}
        onConfirm={confirmDeletePlan}
        onCancel={() => setPlanToDelete(null)}
      />
    </div>
  );
}
