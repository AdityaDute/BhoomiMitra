import { Menu, Bell, Globe, User } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppStore } from '../../hooks/useAppStore';
import { useState, useRef, useEffect } from 'react';

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { t, lang, setLanguage } = useTranslation();
  const { state } = useAppStore();
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 md:px-6 h-14">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        {/* Spacer for desktop */}
        <div className="hidden lg:block" />

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Select language"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'en' ? 'EN' : 'मर'}</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                <button
                  onClick={() => { setLanguage('en'); setLangOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${lang === 'en' ? 'text-forest-800 font-semibold' : 'text-gray-700'}`}
                >
                  {t.common.english}
                </button>
                <button
                  onClick={() => { setLanguage('mr'); setLangOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${lang === 'mr' ? 'text-forest-800 font-semibold' : 'text-gray-700'}`}
                >
                  {t.common.marathi}
                </button>
              </div>
            )}
          </div>

          {/* Notifications */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600" />
          </button>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="User profile"
            >
              <div className="w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center">
                <User className="w-4 h-4 text-forest-800" />
              </div>
              <span className="hidden sm:inline text-sm font-medium text-gray-700">
                {state.profile?.name || 'Farmer'}
              </span>
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{state.profile?.name}</p>
                  <p className="text-xs text-gray-500">{state.profile?.village}, {state.profile?.district}</p>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  {t.nav.profile}
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  {t.nav.settings}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
