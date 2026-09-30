import React from 'react';
import { Zap, Phone, ShieldCheck, Lock, Menu, X } from 'lucide-react';

export type NavTab = 'home' | 'sales' | 'rental' | 'support';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isAdmin: boolean;
  onOpenAdminModal: () => void;
  onExitAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isAdmin,
  onOpenAdminModal,
  onExitAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleNav = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
      {/* Top emergency announcement bar for Greater Tunis */}
      <div className="bg-[#0D0D0D] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-medium text-gray-200">
              Greater Tunis On-Call: 24/7 Emergency Dispatch for STEG Power Cuts
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-gray-300">
            <a
              href="tel:+21671888999"
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+216 71 888 999</span>
            </a>
            <span className="text-gray-600">|</span>
            <span className="flex items-center gap-1 text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Manufacturer Warranty &amp; ATS Included
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-white shadow-sm group-hover:bg-amber-600 transition-colors">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <div>
                <span className="text-2xl font-extrabold tracking-tight text-[#0D0D0D] flex items-center gap-1">
                  VOLT
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block mb-1"></span>
                </span>
                <span className="block text-[10px] tracking-wider uppercase font-semibold text-gray-500 -mt-1">
                  Residential &amp; Backup Power
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => handleNav('home')}
              className={`px-3.5 py-2 text-sm font-medium transition-colors relative ${
                currentTab === 'home' && !isAdmin
                  ? 'text-[#0D0D0D] font-bold'
                  : 'text-gray-600 hover:text-[#0D0D0D]'
              }`}
            >
              Home
              {currentTab === 'home' && !isAdmin && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => handleNav('sales')}
              className={`px-3.5 py-2 text-sm font-medium transition-colors relative ${
                currentTab === 'sales' && !isAdmin
                  ? 'text-[#0D0D0D] font-bold'
                  : 'text-gray-600 hover:text-[#0D0D0D]'
              }`}
            >
              Generator Sales
              {currentTab === 'sales' && !isAdmin && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => handleNav('rental')}
              className={`px-3.5 py-2 text-sm font-medium transition-colors relative ${
                currentTab === 'rental' && !isAdmin
                  ? 'text-[#0D0D0D] font-bold'
                  : 'text-gray-600 hover:text-[#0D0D0D]'
              }`}
            >
              Rental &amp; Calculator
              {currentTab === 'rental' && !isAdmin && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => handleNav('support')}
              className={`px-3.5 py-2 text-sm font-medium transition-colors relative ${
                currentTab === 'support' && !isAdmin
                  ? 'text-[#0D0D0D] font-bold'
                  : 'text-gray-600 hover:text-[#0D0D0D]'
              }`}
            >
              Support &amp; Ticket Tracker
              {currentTab === 'support' && !isAdmin && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
              )}
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-amber-100 text-amber-900 rounded-md border border-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                  Admin Mode Active
                </span>
                <button
                  onClick={onExitAdmin}
                  className="text-xs text-gray-600 hover:text-red-600 font-medium px-2 py-1 border border-gray-300 rounded hover:bg-red-50 transition-colors"
                >
                  Exit Admin
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminModal}
                className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                title="Admin Portal Access (PIN 1234)"
                aria-label="Admin Portal Access"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => handleNav('sales')}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-amber-500 text-white hover:bg-amber-600 shadow-sm active:scale-97 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Get a Generator
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-black rounded-lg focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-3 py-2.5 rounded-md text-base font-medium ${
              currentTab === 'home' && !isAdmin
                ? 'bg-amber-50 text-amber-900 font-bold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNav('sales')}
            className={`w-full text-left px-3 py-2.5 rounded-md text-base font-medium ${
              currentTab === 'sales' && !isAdmin
                ? 'bg-amber-50 text-amber-900 font-bold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Generator Sales (7 to 28 kVA)
          </button>
          <button
            onClick={() => handleNav('rental')}
            className={`w-full text-left px-3 py-2.5 rounded-md text-base font-medium ${
              currentTab === 'rental' && !isAdmin
                ? 'bg-amber-50 text-amber-900 font-bold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Rental &amp; Calculator
          </button>
          <button
            onClick={() => handleNav('support')}
            className={`w-full text-left px-3 py-2.5 rounded-md text-base font-medium ${
              currentTab === 'support' && !isAdmin
                ? 'bg-amber-50 text-amber-900 font-bold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Support &amp; Ticket Tracker
          </button>

          <div className="pt-3 border-t border-gray-200 flex flex-col gap-2">
            <a
              href="tel:+21671888999"
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-amber-400 bg-amber-50 text-amber-900 font-semibold text-sm"
            >
              <Phone className="w-4 h-4 text-amber-600" />
              Emergency Call: +216 71 888 999
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminModal();
              }}
              className="flex items-center justify-center gap-2 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Lock className="w-4 h-4" />
              {isAdmin ? 'Admin Mode Active' : 'Admin Login (PIN 1234)'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
