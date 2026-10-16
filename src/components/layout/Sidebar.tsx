import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FlaskConical,
  Leaf,
  Calculator,
  TrendingUp,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sprout,
  X,
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onClose?: () => void;
}

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' as const },
  { path: '/soil-health', icon: FlaskConical, labelKey: 'soilHealth' as const },
  { path: '/farming-planner', icon: Leaf, labelKey: 'farmingPlanner' as const },
  { path: '/cost-tracker', icon: Calculator, labelKey: 'costTracker' as const },
  { path: '/soil-journey', icon: TrendingUp, labelKey: 'soilJourney' as const },
  { path: '/knowledge', icon: BookOpen, labelKey: 'knowledge' as const },
];

export function Sidebar({ collapsed, onToggleCollapse, onClose }: SidebarProps) {
  const { t } = useTranslation();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-forest-900 text-white transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo area */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-forest-800">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-forest-700 shrink-0">
          <Sprout className="w-6 h-6 text-forest-300" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-white leading-tight truncate">{t.appName}</h1>
            <p className="text-xs text-forest-400 truncate">{t.tagline}</p>
          </div>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto lg:hidden p-1 rounded-lg hover:bg-forest-800 transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-forest-700 text-white shadow-sm'
                  : 'text-forest-300 hover:bg-forest-800 hover:text-white'
              }`
            }
            title={collapsed ? t.nav[item.labelKey] : undefined}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="truncate">{t.nav[item.labelKey]}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 border-t border-forest-800 space-y-1">
        <NavLink
          to="/settings"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-forest-300 hover:bg-forest-800 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!collapsed && <span>{t.nav.settings}</span>}
        </NavLink>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-forest-400 hover:bg-forest-800 hover:text-white transition-colors w-full"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
