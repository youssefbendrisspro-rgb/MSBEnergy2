import React from 'react';
import {
  Shield,
  Clock,
  Volume2,
  CheckCircle2,
  ArrowRight,
  Wrench,
  Truck,
  Zap,
  PhoneCall,
  Flame,
  Award
} from 'lucide-react';
import { Generator } from '../types/volt';
import { HERO_IMAGE_URL } from '../data/defaultData';
import { NavTab } from './Navbar';

interface HomeSectionProps {
  generators: Generator[];
  onSelectTab: (tab: NavTab) => void;
  onOpenDetails: (generator: Generator) => void;
  onOpenPurchase: (generator: Generator) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  generators,
  onSelectTab,
  onOpenDetails,
  onOpenPurchase
}) => {
  const featuredGenerators = generators.slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0D0D0D] text-white">
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #F59E0B 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-semibold">
                <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>Spécialiste Groupes Diesel Résidentiels &amp; Domestiques</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Une énergie fiable.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">
                  Quand vous en avez besoin.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
                Face aux coupures et délestages récurrents de la STEG dans le Grand Tunis,
                VOLT protège votre villa, maison individuelle ou duplex avec des groupes électrogènes
                diesel insonorisés de <strong>7 à 28 kVA</strong>.
                Basculement automatique par inverseur ATS en moins de 8 secondes.
              </p>

              {/* 3 Main Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-3 sm:gap-4">
                <button
                  onClick={() => onSelectTab('sales')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-amber-500 text-black font-bold text-sm sm:text-base hover:bg-amber-400 transition-all shadow-md active:scale-97"
                >
                  <span>Acheter un générateur</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onSelectTab('rental')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/20 transition-all active:scale-97"
                >
                  <span>Calculer une location</span>
                </button>

                <button
                  onClick={() => onSelectTab('support')}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-gray-300 hover:text-amber-400 font-medium text-sm sm:text-base transition-colors"
                >
                  <Wrench className="w-4 h-4 text-amber-400" />
                  <span>Dépannage d&apos;urgence</span>
                </button>
              </div>

              {/* Quick specs pill */}
              <div className="pt-4 border-t border-gray-800 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-2xl font-bold text-amber-400">&lt; 8 sec</div>
                  <div className="text-xs text-gray-400">Relais automatique ATS</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-400">58 à 64 dB</div>
                  <div className="text-xs text-gray-400">Silence résidentiel</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-400">&lt; 4h</div>
                  <div className="text-xs text-gray-400">Intervention Grand Tunis</div>
                </div>
              </div>
            </div>

            {/* Right Photo showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gray-900 aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 group">
                <img
                  src={HERO_IMAGE_URL}
                  alt="Installation d'un groupe électrogène diesel domestique silencieux VOLT dans une villa à Tunis"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-black/70 backdrop-blur border border-white/15 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                        Installation résidentielle certifiée
                      </p>
                      <p className="text-sm font-bold text-white">
                        VOLT VillaPower 15D · Cour pavée La Marsa
                      </p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                      Silencieux 58 dB
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Band (4 cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onSelectTab('sales')}
            className="cursor-pointer bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#0D0D0D] text-lg mb-1">Vente Certifiée</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Groupes diesel insonorisés neufs de 7 à 28 kVA avec garantie jusqu&apos;à 3 ans pièces et main d&apos;œuvre.
            </p>
            <div className="mt-3 text-xs font-semibold text-amber-600 flex items-center gap-1">
              Explorer le catalogue <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => onSelectTab('rental')}
            className="cursor-pointer bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#0D0D0D] text-lg mb-1">Location Flexible</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Formules jour ou semaine avec tarification dégressive. Idéal pour réceptions ou dépannage temporaire.
            </p>
            <div className="mt-3 text-xs font-semibold text-amber-600 flex items-center gap-1">
              Simulateur de devis <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#0D0D0D] text-lg mb-1">Inverseur ATS Inclus</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Raccordement propre à votre coffret principal. Bascule automatique sans coupure perceptible.
            </p>
            <div className="mt-3 text-xs text-gray-500 font-medium">
              Normes sécurité NFC 15-100
            </div>
          </div>

          <div
            onClick={() => onSelectTab('support')}
            className="cursor-pointer bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#0D0D0D] text-lg mb-1">Dépannage &amp; Urgence</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Astreinte technique 24/7 sur le Grand Tunis. Déplacement d&apos;urgence en moins de 2 à 4h.
            </p>
            <div className="mt-3 text-xs font-semibold text-red-600 flex items-center gap-1">
              Ouvrir un ticket d&apos;urgence <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Why VOLT Section (3 columns) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-wider text-amber-600">
            Conçu pour l&apos;habitat individuel
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0D0D0D] mt-2">
            Pourquoi choisir un groupe diesel domestique VOLT ?
          </h2>
          <p className="text-gray-600 mt-3 text-sm sm:text-base">
            Les groupes électrogènes de chantier ou industriels sont trop bruyants et inadaptés aux lotissements.
            Nos modèles domestiques sont pensés pour cohabiter paisiblement avec votre voisinage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
              <Clock className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="text-xl font-bold text-[#0D0D0D]">Intervention Rapide (&lt; 4h)</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Nos équipes d&apos;électromécaniciens patrouillent quotidiennement sur le Grand Tunis :
              La Marsa, Carthage, Gammarth, La Soukra, Ennasr, Menzah, Ariana et banlieue sud.
              Livraison de carburant d&apos;urgence disponible.
            </p>
            <ul className="text-xs text-gray-500 space-y-2 pt-2 border-t border-gray-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Délai d&apos;astreinte contractuel garanti
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Véhicules d&apos;intervention équipés de pièces détachées
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
              <Volume2 className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="text-xl font-bold text-[#0D0D0D]">Insonorisation Résidentielle</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Canopy acoustique double épaisseur, mousses ignifuges et silencieux d&apos;échappement à chicane.
              Nos générateurs n&apos;émettent que 58 à 64 dB(A), soit le bruit d&apos;une conversation normale.
            </p>
            <ul className="text-xs text-gray-500 space-y-2 pt-2 border-t border-gray-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Installation discrète en jardin ou cour latérale
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Vibration amortie par silentblocs renforcés
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
              <Shield className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="text-xl font-bold text-[#0D0D0D]">Service Clé en Main</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Nous gérons l&apos;ensemble du projet : visite technique préalable, dépose sur socle anti-vibratile,
              câblage cuivre avec protection différentielle, premier plein de Gasoil 50 et formation à l&apos;usage.
            </p>
            <ul className="text-xs text-gray-500 space-y-2 pt-2 border-t border-gray-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Test de bascule automatique en conditions réelles
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Contrat d&apos;entretien périodique disponible
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Featured Generators Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-amber-600">
              Notre Gamme Domestique
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D] mt-1">
              Générateurs diesel pour villas et maisons individuelles
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Des modèles diesel ultra-réalistes, économiques à l&apos;usage et insonorisés.
            </p>
          </div>
          <button
            onClick={() => onSelectTab('sales')}
            className="inline-flex items-center gap-1 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors"
          >
            Voir tous les modèles ({generators.length}) <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredGenerators.map((gen) => (
            <div
              key={gen.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group"
            >
              {/* Product Photo */}
              <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
                <img
                  src={gen.imageUrl}
                  alt={gen.name}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white/90 backdrop-blur text-gray-900 shadow-sm border border-gray-200">
                    {gen.availability}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-amber-500 text-black shadow-sm">
                    {gen.kva} kVA · {gen.kw} kW
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-xs text-gray-500 font-medium">{gen.category}</div>
                  <h3 className="text-xl font-bold text-[#0D0D0D] mt-0.5">{gen.name}</h3>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                    {gen.description}
                  </p>

                  {/* Technical quick specs */}
                  <div className="grid grid-cols-2 gap-2 mt-4 py-3 border-y border-gray-100 text-xs">
                    <div>
                      <span className="text-gray-400 block">Niveau sonore</span>
                      <span className="font-semibold text-gray-800">{gen.soundLevelDb} dB(A) @ 7m</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Autonomie</span>
                      <span className="font-semibold text-gray-800">{gen.autonomyHours} h</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Consommation</span>
                      <span className="font-semibold text-gray-800">{gen.consumptionLitersPerHour} L/h</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Inverseur ATS</span>
                      <span className="font-semibold text-emerald-600">Inclus &amp; Câblé</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-xs text-gray-400">Prix public TTC</span>
                      <div className="text-2xl font-black text-[#0D0D0D]">
                        {gen.priceTnd.toLocaleString('fr-TN')} <span className="text-sm font-semibold text-gray-500">TND</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      Garantie {gen.warrantyYears} ans
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onOpenDetails(gen)}
                      className="px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-center transition-colors"
                    >
                      Fiche technique
                    </button>
                    <button
                      onClick={() => onOpenPurchase(gen)}
                      className="px-3 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg text-center transition-colors shadow-sm active:scale-97"
                    >
                      Demander achat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STEG Emergency Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-white text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-200" />
              <span>Coupure de courant en cours sur votre secteur ?</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-black">
              Besoin immédiat d&apos;un groupe de secours ?
            </h3>
            <p className="text-black/80 text-sm max-w-xl">
              Notre équipe d&apos;astreinte est mobilisable 24h/24 pour une livraison express ou un dépannage
              d&apos;urgence sur l&apos;ensemble du Grand Tunis.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <a
              href="tel:+21671888999"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-black text-white hover:bg-gray-900 font-bold text-sm shadow-md transition-all text-center"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>Appeler le +216 71 888 999</span>
            </a>
            <button
              onClick={() => onSelectTab('rental')}
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white text-black hover:bg-amber-50 font-bold text-sm shadow-md transition-all text-center"
            >
              <span>Louer une unité mobile</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
