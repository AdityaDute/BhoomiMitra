import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  FlaskConical,
  Leaf,
  Calculator,
  TrendingUp,
  ArrowRight,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { useAppStore } from '../hooks/useAppStore';
import { useTranslation } from '../hooks/useTranslation';
import { interpretSoilParameter, formatCurrency, formatDate } from '../lib/calculations';
import { StatusBadge } from '../components/common/StatusBadge';

export function DashboardPage() {
  const navigate = useNavigate();
  const { state } = useAppStore();
  const { t } = useTranslation();

  const profile = state.profile;
  const latestTest = state.soilTests[0]; // Most recent soil test
  const activePlan = state.farmingPlans[0];
  const latestObservation = state.observations[0];

  // Calculate total expenses from all recorded cost scenarios
  const totalRecordedExpenses = state.costScenarios.reduce((acc, scenario) => {
    return acc + scenario.entries.reduce((sum, e) => sum + (e.totalCost || 0), 0);
  }, 0);

  // Key soil parameters for snapshot
  const snapshotParams = latestTest
    ? [
        { key: 'pH', label: 'pH', val: latestTest.parameters.pH, unit: '' },
        { key: 'ec', label: 'EC', val: latestTest.parameters.ec, unit: 'dS/m' },
        { key: 'organicCarbon', label: 'Organic Carbon', val: latestTest.parameters.organicCarbon, unit: '%' },
        { key: 'nitrogen', label: 'Nitrogen (N)', val: latestTest.parameters.nitrogen, unit: 'kg/ha' },
        { key: 'phosphorus', label: 'Phosphorus (P)', val: latestTest.parameters.phosphorus, unit: 'kg/ha' },
        { key: 'potassium', label: 'Potassium (K)', val: latestTest.parameters.potassium, unit: 'kg/ha' },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* A. Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-forest-900 via-forest-800 to-forest-700 text-white p-6 md:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-forest-600/60 text-forest-200 border border-forest-500/40">
                <Sparkles className="w-3.5 h-3.5 text-forest-300" />
                BhoomiMitra AI
              </span>
              {latestTest?.isDemo && <StatusBadge status="demo" />}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t.dashboard.welcome}, {profile?.name || 'Farmer'}!
            </h1>
            <p className="text-forest-200 text-sm md:text-base max-w-2xl leading-relaxed">
              {t.dashboard.subtitle}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs md:text-sm text-forest-200/90">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-forest-300" />
                {profile?.village || 'Wadgaon'}, {profile?.district || 'Pune'}, {profile?.state || 'Maharashtra'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-forest-300" />
                {profile?.primaryCrop || 'Soybean'} ({profile?.farmArea || 2.5} {profile?.farmAreaUnit || 'acres'})
              </span>
              <span className="inline-flex items-center gap-1.5 capitalize px-2 py-0.5 rounded bg-forest-700/80">
                {profile?.farmingType || 'mixed'} farming
              </span>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/soil-health')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-forest-500 hover:bg-forest-400 text-forest-900 transition-colors shadow-sm"
            >
              <FlaskConical className="w-4 h-4" />
              {t.dashboard.analyseSoilReport}
            </button>
            <button
              onClick={() => navigate('/farming-planner')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
            >
              <Leaf className="w-4 h-4" />
              {t.dashboard.explorePractices}
            </button>
          </div>
        </div>

        {/* Decorative background foliage leaf */}
        <div className="absolute -bottom-8 -right-8 w-48 h-48 opacity-10 pointer-events-none">
          <Leaf className="w-full h-full text-white" />
        </div>
      </div>

      {/* B. Farm Overview Cards */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-forest-700" />
          {t.dashboard.farmOverview}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Primary Crop & Season */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-medium">{t.dashboard.primaryCrop}</span>
              <Sprout className="w-4 h-4 text-forest-700" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{profile?.primaryCrop || 'Soybean'}</p>
              <p className="text-xs text-gray-500 capitalize">{latestTest?.season || 'Kharif'} Season</p>
            </div>
          </div>

          {/* Card 2: Latest Soil-Test Date */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-medium">{t.dashboard.lastSoilTest}</span>
              <FlaskConical className="w-4 h-4 text-forest-700" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">
                {latestTest ? formatDate(latestTest.testDate) : t.dashboard.noSoilTest}
              </p>
              <p className="text-xs text-forest-700 font-medium">
                {latestTest ? `${latestTest.farmName}` : 'Add first test record'}
              </p>
            </div>
          </div>

          {/* Card 3: Active Farming Plan */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-medium">{t.dashboard.activePlan}</span>
              <Leaf className="w-4 h-4 text-forest-700" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 truncate">
                {activePlan ? activePlan.name : t.dashboard.noPlan}
              </p>
              <p className="text-xs text-gray-500">
                {activePlan ? `${activePlan.practices.length} practices active` : 'Build a custom plan'}
              </p>
            </div>
          </div>

          {/* Card 4: Cultivation Expenses Recorded */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-medium">{t.dashboard.expensesRecorded}</span>
              <Calculator className="w-4 h-4 text-forest-700" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(totalRecordedExpenses)}
              </p>
              <p className="text-xs text-gray-500">
                {state.costScenarios.length} scenario{state.costScenarios.length !== 1 ? 's' : ''} tracked
              </p>
            </div>
          </div>

          {/* Card 5: Recent Observation */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-medium">{t.dashboard.recentObservation}</span>
              <TrendingUp className="w-4 h-4 text-forest-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {latestObservation ? latestObservation.title : t.dashboard.noObservation}
              </p>
              <p className="text-xs text-gray-500">
                {latestObservation ? formatDate(latestObservation.date) : 'Log field changes'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* C. Soil Health Snapshot */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">{t.dashboard.soilHealthSnapshot}</h2>
              {latestTest?.isDemo && <StatusBadge status="demo" />}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {latestTest
                ? `Results from ${latestTest.farmName} (${formatDate(latestTest.testDate)}) • Target crop: ${latestTest.crop}`
                : 'No soil test data recorded yet'}
            </p>
          </div>
          <button
            onClick={() => navigate('/soil-health')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-800 hover:text-forest-600 transition-colors self-start sm:self-auto"
          >
            {t.soil.viewRecord} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {latestTest ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {snapshotParams.map((param) => {
              const interpretation = interpretSoilParameter(param.key, param.val);
              const isAlert = interpretation?.level === 'low' || interpretation?.level === 'acidic' || interpretation?.level === 'saline' || interpretation?.level === 'deficient';
              const isOptimal = interpretation?.level === 'neutral' || interpretation?.level === 'high' || interpretation?.level === 'normal' || interpretation?.level === 'sufficient';

              return (
                <div
                  key={param.key}
                  className="bg-ivory/50 rounded-xl p-3.5 border border-forest-100 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600">{param.label}</span>
                    {isAlert && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                    {isOptimal && <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />}
                  </div>

                  <div className="my-2">
                    <span className="text-xl font-bold text-gray-900">
                      {param.val !== undefined ? param.val : '--'}
                    </span>
                    {param.unit && (
                      <span className="text-xs text-gray-500 ml-1">{param.unit}</span>
                    )}
                  </div>

                  <div>
                    {interpretation ? (
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          isOptimal
                            ? 'bg-forest-100 text-forest-800'
                            : isAlert
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {interpretation.label}
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400">{t.soil.interpretationPending}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <FlaskConical className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">No soil test record entered</p>
            <p className="text-xs text-gray-500 mb-3">Add laboratory report values to unlock interpretations.</p>
            <button
              onClick={() => navigate('/soil-health')}
              className="px-4 py-2 bg-forest-800 text-white rounded-lg text-xs font-semibold hover:bg-forest-700"
            >
              Add Soil Test Record
            </button>
          </div>
        )}
      </div>

      {/* D. Recommended Next Steps & E. Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Next Steps (2 cols on large) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-forest-700" />
            {t.dashboard.recommendedNextSteps}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Step 1: Review Soil Report */}
            <div
              onClick={() => navigate('/soil-health')}
              className="group cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-forest-400 bg-white hover:bg-forest-50/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-forest-100 text-forest-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-forest-900">
                  {t.dashboard.reviewLatestReport}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Inspect nitrogen and organic carbon levels with reference advice.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-medium text-forest-800 group-hover:translate-x-0.5 transition-transform">
                <span>View analysis</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>

            {/* Step 2: Natural Farming Plan */}
            <div
              onClick={() => navigate('/farming-planner')}
              className="group cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-forest-400 bg-white hover:bg-forest-50/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-forest-100 text-forest-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Leaf className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-forest-900">
                  {t.dashboard.explorePractices}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Browse Jeevamrit, green manuring, vermicompost & mulching protocols.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-medium text-forest-800 group-hover:translate-x-0.5 transition-transform">
                <span>Build plan</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>

            {/* Step 3: Record Expenses */}
            <div
              onClick={() => navigate('/cost-tracker')}
              className="group cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-forest-400 bg-white hover:bg-forest-50/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-forest-100 text-forest-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Calculator className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-forest-900">
                  {t.dashboard.recordExpenses}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Compare conventional input costs against zero-budget organic models.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-medium text-forest-800 group-hover:translate-x-0.5 transition-transform">
                <span>Track costs</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>

            {/* Step 4: Farm Profile */}
            <div
              onClick={() => navigate('/settings')}
              className="group cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-forest-400 bg-white hover:bg-forest-50/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-forest-100 text-forest-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Sprout className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-forest-900">
                  {t.dashboard.completeFarmProfile}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Update your acreage, village details, language preference, and crops.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-medium text-forest-800 group-hover:translate-x-0.5 transition-transform">
                <span>Manage profile</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* E. Recent Activity (1 col on large) */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-forest-700" />
              {t.dashboard.recentActivity}
            </h2>

            {state.activities.length > 0 ? (
              <div className="space-y-4">
                {state.activities.slice(0, 5).map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-left">
                    <div className="w-7 h-7 rounded-full bg-forest-100 flex items-center justify-center shrink-0 mt-0.5 text-forest-800">
                      {act.type === 'soil-test' && <FlaskConical className="w-3.5 h-3.5" />}
                      {act.type === 'plan-created' && <Leaf className="w-3.5 h-3.5" />}
                      {act.type === 'cost-entry' && <Calculator className="w-3.5 h-3.5" />}
                      {act.type === 'observation' && <TrendingUp className="w-3.5 h-3.5" />}
                      {act.type === 'profile-updated' && <Sprout className="w-3.5 h-3.5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-gray-900 truncate">{act.title}</p>
                      <p className="text-[11px] text-gray-500 line-clamp-2">{act.description}</p>
                      <span className="text-[10px] text-gray-400 mt-0.5 block flex items-center gap-1">
                        <Calendar className="w-3 h-3 inline" /> {formatDate(act.date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-400">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-gray-500">{t.dashboard.noActivity}</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 mt-4">
            <button
              onClick={() => navigate('/soil-journey')}
              className="w-full py-2 text-center text-xs font-semibold text-forest-800 hover:bg-forest-50 rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <span>{t.nav.soilJourney}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
