import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FlaskConical, Leaf, Calculator, BookOpen } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const mobileNavItems = [
  { path: '/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' as const },
  { path: '/soil-health', icon: FlaskConical, labelKey: 'soilHealth' as const },
  { path: '/farming-planner', icon: Leaf, labelKey: 'farmingPlanner' as const },
  { path: '/cost-tracker', icon: Calculator, labelKey: 'costTracker' as const },
  { path: '/knowledge', icon: BookOpen, labelKey: 'knowledge' as const },
];

export function MobileNavigation() {
  const { t } = useTranslation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors min-w-0 ${
                isActive
                  ? 'text-forest-800'
                  : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="truncate text-[10px]">{t.nav[item.labelKey]}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
