import React, { useState } from 'react';
import {
  User,
  Globe,
  RotateCcw,
  Save,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useAppStore } from '../hooks/useAppStore';
import { useTranslation } from '../hooks/useTranslation';
import { useToast } from '../hooks/useToast';
import { StatusBadge } from '../components/common/StatusBadge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import type { FarmerProfile } from '../types';

export function SettingsPage() {
  const { state, dispatch } = useAppStore();
  const { t, lang, setLanguage } = useTranslation();
  const { addToast } = useToast();

  const [profile, setProfile] = useState<FarmerProfile>(
    state.profile || {
      id: 'default-profile',
      name: 'Ramesh Patil',
      village: 'Wadgaon',
      district: 'Pune',
      state: 'Maharashtra',
      primaryCrop: 'Soybean',
      farmArea: 2.5,
      farmAreaUnit: 'acres',
      farmingType: 'mixed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'SET_PROFILE',
      payload: { ...profile, updatedAt: new Date().toISOString() },
    });
    dispatch({
      type: 'ADD_ACTIVITY',
      payload: {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        type: 'profile-updated',
        title: 'Farm profile updated',
        description: `Updated profile details for ${profile.name}.`,
      },
    });
    addToast('Farm profile updated successfully!', 'success');
  };

  const handleResetData = () => {
    dispatch({ type: 'RESET_DATA' });
    addToast(t.common.resetSuccess, 'info');
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">{t.nav.settings} & Profile</h1>
          <StatusBadge status="verified" />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Manage your farm profile, regional language preferences, and prototype data.
        </p>
      </div>

      {/* Language Preferences */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <Globe className="w-5 h-5 text-forest-700" />
          {t.common.language} / भाषा निवडा
        </h3>
        <p className="text-xs text-gray-500">
          Select interface language for menus, forms, and recommendations.
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              lang === 'en'
                ? 'bg-forest-800 text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {lang === 'en' && <CheckCircle2 className="w-4 h-4" />}
            English
          </button>

          <button
            onClick={() => setLanguage('mr')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              lang === 'mr'
                ? 'bg-forest-800 text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {lang === 'mr' && <CheckCircle2 className="w-4 h-4" />}
            मराठी (Marathi)
          </button>
        </div>
      </div>

      {/* Farmer Profile Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5 text-forest-700" />
          Farmer Profile Information
        </h3>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Farmer Full Name *
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Primary Crop *
              </label>
              <input
                type="text"
                required
                value={profile.primaryCrop}
                onChange={(e) => setProfile({ ...profile, primaryCrop: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Village *
              </label>
              <input
                type="text"
                required
                value={profile.village}
                onChange={(e) => setProfile({ ...profile, village: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                District *
              </label>
              <input
                type="text"
                required
                value={profile.district}
                onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                required
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Farming System Approach
              </label>
              <select
                value={profile.farmingType}
                onChange={(e) => setProfile({ ...profile, farmingType: e.target.value as any })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600"
              >
                <option value="conventional">Conventional (Chemical fertilizer based)</option>
                <option value="mixed">Mixed / Transitioning</option>
                <option value="organic">Organic Farming</option>
                <option value="natural">Zero Budget Natural Farming (ZBNF)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Total Land Holding Area
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={profile.farmArea}
                  onChange={(e) => setProfile({ ...profile, farmArea: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600"
                />
                <select
                  value={profile.farmAreaUnit}
                  onChange={(e) => setProfile({ ...profile, farmAreaUnit: e.target.value as any })}
                  className="px-3 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none"
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                  <option value="bigha">Bigha</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-forest-800 hover:bg-forest-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{t.common.save} Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* Reset Demo Data Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-amber-600" />
          Prototype Data Management
        </h3>
        <p className="text-xs text-gray-500">
          Reset all entered soil tests, farming plans, observations, and cost items back to the default demonstration seed dataset.
        </p>

        <button
          onClick={() => setIsResetConfirmOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors"
        >
          {t.common.resetDemo}
        </button>
      </div>

      {/* Prototype Credits & Legal Disclaimer */}
      <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/70 text-xs text-gray-600 space-y-2">
        <div className="flex items-center gap-2 font-bold text-gray-800">
          <Info className="w-4 h-4 text-forest-700" />
          <span>BhoomiMitra AI — SEVA First 2026 Innovation Challenge Prototype</span>
        </div>
        <p className="leading-relaxed">
          Designed and built for Indian small and marginal farmers exploring Organic and Zero Budget Natural Farming with Soil Health card awareness. All models are client-side LocalStorage driven with zero external API key requirements.
        </p>
      </div>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        open={isResetConfirmOpen}
        title={t.common.resetDemo}
        message={t.common.resetConfirm}
        confirmLabel={t.common.resetDemo}
        cancelLabel={t.common.cancel}
        variant="warning"
        onConfirm={handleResetData}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
}
