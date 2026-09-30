import React from 'react';
import { Zap, Phone, Mail, MapPin, ShieldCheck, Lock } from 'lucide-react';
import { NavTab } from './Navbar';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenAdmin: () => void;
  isAdmin: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenAdmin, isAdmin }) => {
  return (
    <footer className="bg-[#0D0D0D] text-white pt-16 pb-20 border-t border-gray-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-white">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-1">
                VOLT
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block mb-1"></span>
              </span>
            </div>

            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              VOLT is the leading Tunisian backup power specialist for residences, villas, and single-family homes during STEG grid outages. Sales, rentals, ATS switchboard installation, and 24/7 emergency repair.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>NFC 15-100 Electrical Compliance &amp; CE Certified</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Navigation</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button
                  onClick={() => onSelectTab('home')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Home &amp; Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('sales')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Sales Catalog (7 to 28 kVA)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('rental')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Rental &amp; Rate Simulator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('support')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Incident Report &amp; Support
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Secteurs desservis */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Service Area (&lt; 4h Response)</h4>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              All Greater Tunis: La Marsa, Gammarth, Carthage, Sidi Bou Said, La Soukra, Les Berges du Lac 1 &amp; 2, Ennasr 1 &amp; 2, El Menzah, El Manar, Ariana, Ben Arous, Megrine, Rades, Hammam Lif.
            </p>
            <div className="text-[11px] text-amber-400 font-medium">
              Pre-positioned emergency service vans
            </div>
          </div>

          {/* Col 4: Contact direct */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Emergency &amp; Headquarters</h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Charguia II Industrial Zone &amp; La Soukra Branch, Tunis</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="tel:+21671888999" className="text-amber-400 font-bold hover:underline">
                  +216 71 888 999
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>contact@volt-energie.tn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            &copy; 2026 VOLT Tunisia. All rights reserved. Residential Silent Diesel Generators.
          </div>
          <div className="flex items-center gap-4">
            <span>Emergency response for STEG power outages</span>
            <span>·</span>
            <button
              onClick={onOpenAdmin}
              className="text-gray-400 hover:text-amber-400 transition-colors flex items-center gap-1 font-medium"
            >
              <Lock className="w-3 h-3" />
              <span>{isAdmin ? 'Admin Mode Active' : 'Admin Portal Access'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Admin Button in Bottom-Right Corner (as specified in Brief §4) */}
      <button
        onClick={onOpenAdmin}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-[#0D0D0D] text-amber-400 hover:text-white hover:bg-amber-500 shadow-2xl border border-amber-500/40 transition-all hover:scale-110 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-amber-500"
        title="VOLT Administration (PIN 1234)"
        aria-label="VOLT Administration Access"
      >
        <Lock className="w-5 h-5 group-hover:rotate-12 transition-transform" />
      </button>
    </footer>
  );
};
