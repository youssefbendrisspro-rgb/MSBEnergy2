import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Volume2,
  Zap,
  Clock,
  Sparkles,
  X,
  Send,
  Fuel
} from 'lucide-react';
import { Generator, HabitationType, PurchaseRequest } from '../types/volt';
import { StorageService } from '../utils/storage';

interface SalesSectionProps {
  generators: Generator[];
  selectedGeneratorForDetails: Generator | null;
  selectedGeneratorForPurchase: Generator | null;
  onOpenDetails: (generator: Generator) => void;
  onCloseDetails: () => void;
  onOpenPurchase: (generator: Generator) => void;
  onClosePurchase: () => void;
  onPurchaseSuccess: (request: PurchaseRequest) => void;
}

export const SalesSection: React.FC<SalesSectionProps> = ({
  generators,
  selectedGeneratorForDetails,
  selectedGeneratorForPurchase,
  onOpenDetails,
  onCloseDetails,
  onOpenPurchase,
  onClosePurchase,
  onPurchaseSuccess
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [kvaFilter, setKvaFilter] = useState<string>('all');

  // Purchase Form State
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    city: 'La Marsa',
    habitationType: 'Villa' as HabitationType,
    message: ''
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<PurchaseRequest | null>(null);

  // Filter logic
  const filteredGenerators = generators.filter((gen) => {
    const matchesSearch =
      gen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gen.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gen.engine.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' ||
      gen.category === categoryFilter ||
      (categoryFilter === 'Compact Home' && (gen.category === 'Compact Home' || gen.category === 'Domestique Compact')) ||
      (categoryFilter === 'Residential Villa' && (gen.category === 'Residential Villa' || gen.category === 'Résidentiel Villa')) ||
      (categoryFilter === 'Estate & Large Duplex' && (gen.category === 'Estate & Large Duplex' || gen.category === 'Grand Domaine & Duplex'));

    const matchesKva =
      kvaFilter === 'all' ||
      (kvaFilter === 'under10' && gen.kva <= 10) ||
      (kvaFilter === '10to20' && gen.kva > 10 && gen.kva <= 20) ||
      (kvaFilter === 'above20' && gen.kva > 20);

    return matchesSearch && matchesCategory && matchesKva;
  });

  const validatePurchaseForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.clientName.trim()) errors.clientName = 'Full name is required.';
    if (!formData.clientPhone.trim()) {
      errors.clientPhone = 'Phone number is required.';
    } else if (formData.clientPhone.trim().length < 8) {
      errors.clientPhone = 'Please enter a valid phone number.';
    }
    if (!formData.clientEmail.trim()) {
      errors.clientEmail = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
      errors.clientEmail = 'Invalid email address format.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGeneratorForPurchase) return;
    if (!validatePurchaseForm()) return;

    setIsSubmitting(true);
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const newRequest: PurchaseRequest = {
        id: `VP-${timestamp}`,
        generatorId: selectedGeneratorForPurchase.id,
        generatorName: selectedGeneratorForPurchase.name,
        generatorKva: selectedGeneratorForPurchase.kva,
        totalPriceTnd: selectedGeneratorForPurchase.priceTnd,
        clientName: formData.clientName.trim(),
        clientPhone: formData.clientPhone.trim(),
        clientEmail: formData.clientEmail.trim(),
        city: formData.city,
        habitationType: formData.habitationType,
        message: formData.message.trim(),
        createdAt: new Date().toISOString(),
        status: 'Pending'
      };

      const existingRequests = StorageService.getPurchaseRequests();
      StorageService.savePurchaseRequests([newRequest, ...existingRequests]);

      setSubmittedRequest(newRequest);
      onPurchaseSuccess(newRequest);
      // Reset form
      setFormData({
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        city: 'La Marsa',
        habitationType: 'Villa',
        message: ''
      });
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving your request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Direct Sales &amp; Turnkey Installation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0D0D0D]">
          Residential Diesel Generators
        </h1>
        <p className="text-gray-600 text-base mt-2 max-w-3xl leading-relaxed">
          Engineered for quiet operation in villas and single-family residences across Greater Tunis.
          Equipped with automatic ATS transfer switches to restore power in seconds, preventing food spoilage and water pump interruption.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search text */}
          <div className="lg:col-span-6 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by model, engine, or kVA (e.g. 15 kVA, HomeSilent)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Category filter */}
          <div className="lg:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700"
            >
              <option value="all">All categories</option>
              <option value="Compact Home">Compact Home (7-11 kVA)</option>
              <option value="Residential Villa">Residential Villa (15 kVA)</option>
              <option value="Estate & Large Duplex">Estate &amp; Large Duplex (28 kVA)</option>
            </select>
          </div>

          {/* Power filter */}
          <div className="lg:col-span-3">
            <select
              value={kvaFilter}
              onChange={(e) => setKvaFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700"
            >
              <option value="all">All power ratings</option>
              <option value="under10">Up to 10 kVA (Compact House)</option>
              <option value="10to20">11 to 20 kVA (Standard Villa)</option>
              <option value="above20">Over 20 kVA (Large Villa / Three-Phase)</option>
            </select>
          </div>
        </div>

        {/* Active counter & Reset */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>{filteredGenerators.length} diesel generator model(s) available</span>
          {(searchTerm || categoryFilter !== 'all' || kvaFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setKvaFilter('all');
              }}
              className="text-amber-600 hover:text-amber-700 font-semibold"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Generator Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredGenerators.map((gen) => (
          <div
            key={gen.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col group"
          >
            {/* Realistic Image */}
            <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
              <img
                src={gen.imageUrl}
                alt={gen.name}
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-amber-500 text-black shadow-sm">
                  {gen.kva} kVA · {gen.kw} kW
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md shadow-sm border ${
                    gen.availability === 'In Stock' || gen.availability === 'En stock'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {gen.availability}
                </span>
              </div>
              <div className="absolute bottom-3 right-3">
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-black/75 backdrop-blur text-white flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-amber-400" />
                  {gen.soundLevelDb} dB(A)
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs text-gray-500 font-medium">{gen.category}</span>
                <h3 className="text-xl font-bold text-[#0D0D0D] mt-0.5">{gen.name}</h3>
                <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                  {gen.description}
                </p>

                {/* Specs pill list */}
                <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Fuel className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Usage: {gen.consumptionLitersPerHour} L/h</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Autonomy: {gen.autonomyHours}h</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{gen.voltage}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Automatic ATS</span>
                  </div>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-gray-400">Price incl. VAT (Tunis)</span>
                    <div className="text-2xl font-black text-[#0D0D0D]">
                      {gen.priceTnd.toLocaleString('en-US')}{' '}
                      <span className="text-sm font-semibold text-gray-500">TND</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {gen.warrantyYears}-Year Warranty
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onOpenDetails(gen)}
                    className="px-3 py-2.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-center transition-colors focus:ring-2 focus:ring-gray-300"
                  >
                    View details
                  </button>
                  <button
                    onClick={() => onOpenPurchase(gen)}
                    className="px-3 py-2.5 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg text-center transition-all shadow-sm active:scale-97 focus:ring-2 focus:ring-amber-500"
                  >
                    Request purchase
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGenerators.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 space-y-3">
          <Filter className="w-8 h-8 text-gray-400 mx-auto" />
          <h3 className="text-lg font-bold text-gray-800">No generators match your search criteria</h3>
          <p className="text-sm text-gray-500">
            Try adjusting your power rating filter or reach out to our team for custom sizing.
          </p>
        </div>
      )}

      {/* MODAL: Generator Details */}
      {selectedGeneratorForDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-200 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={onCloseDetails}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-black shadow-sm"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo header */}
            <div className="relative aspect-16/9 sm:aspect-21/9 bg-gray-900 overflow-hidden">
              <img
                src={selectedGeneratorForDetails.imageUrl}
                alt={selectedGeneratorForDetails.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                  {selectedGeneratorForDetails.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {selectedGeneratorForDetails.name}
                </h2>
                <p className="text-sm text-gray-300 mt-1">
                  Rated capacity: {selectedGeneratorForDetails.kva} kVA ({selectedGeneratorForDetails.kw} kW)
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Description */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                  Product Overview
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {selectedGeneratorForDetails.description}
                </p>
              </div>

              {/* Technical Specifications Table */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                  Full Technical Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between py-1.5 border-b border-gray-200">
                    <span className="text-gray-500">Engine Type:</span>
                    <span className="font-semibold text-gray-800 text-right">{selectedGeneratorForDetails.engine}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-200">
                    <span className="text-gray-500">Fuel Grade:</span>
                    <span className="font-semibold text-gray-800 text-right">{selectedGeneratorForDetails.fuel}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-200">
                    <span className="text-gray-500">Tank Capacity:</span>
                    <span className="font-semibold text-gray-800 text-right">{selectedGeneratorForDetails.tankCapacityLiters} Liters</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-200">
                    <span className="text-gray-500">Fuel Consumption:</span>
                    <span className="font-semibold text-gray-800 text-right">{selectedGeneratorForDetails.consumptionLitersPerHour} L/h @ 75% load</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-200">
                    <span className="text-gray-500">Sound Level:</span>
                    <span className="font-semibold text-emerald-700 text-right">{selectedGeneratorForDetails.soundLevelDb} dB(A) @ 7m</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-200">
                    <span className="text-gray-500">Output Voltage:</span>
                    <span className="font-semibold text-gray-800 text-right">{selectedGeneratorForDetails.voltage}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-200">
                    <span className="text-gray-500">Automatic ATS Switch:</span>
                    <span className="font-bold text-amber-700 text-right">Included &amp; Pre-wired</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-200">
                    <span className="text-gray-500">Dimensions (L x W x H):</span>
                    <span className="font-semibold text-gray-800 text-right">{selectedGeneratorForDetails.dimensions}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-500">Net Weight:</span>
                    <span className="font-semibold text-gray-800 text-right">{selectedGeneratorForDetails.weightKg} kg</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-500">Manufacturer Warranty:</span>
                    <span className="font-semibold text-gray-800 text-right">{selectedGeneratorForDetails.warrantyYears} years parts &amp; labor</span>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                  VOLT Advantages &amp; Included Features
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                  {selectedGeneratorForDetails.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer CTA */}
              <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-gray-500">Retail price (incl. VAT Greater Tunis)</span>
                  <div className="text-2xl font-black text-[#0D0D0D]">
                    {selectedGeneratorForDetails.priceTnd.toLocaleString('en-US')} TND
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={onCloseDetails}
                    className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-black border border-gray-300 rounded-xl"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const gen = selectedGeneratorForDetails;
                      onCloseDetails();
                      onOpenPurchase(gen);
                    }}
                    className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-md transition-all active:scale-97"
                  >
                    Request Purchase
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Purchase Request Form */}
      {selectedGeneratorForPurchase && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                onClosePurchase();
                setSubmittedRequest(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {submittedRequest ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-[#0D0D0D]">Purchase Request Received!</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                  Your purchase inquiry for the <strong>{submittedRequest.generatorName}</strong> ({submittedRequest.generatorKva} kVA)
                  has been routed to our Greater Tunis technical sales team.
                </p>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left max-w-md mx-auto text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Reference Number:</span>
                    <span className="font-mono font-bold text-amber-800">{submittedRequest.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Customer:</span>
                    <span className="font-semibold text-gray-800">{submittedRequest.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-semibold text-gray-800">{submittedRequest.city} ({submittedRequest.habitationType})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Callback Commitment:</span>
                    <span className="font-semibold text-emerald-700">Within 2 business hours</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmittedRequest(null);
                      onClosePurchase();
                    }}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-all"
                  >
                    Back to Catalog
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePurchaseSubmit} className="space-y-5">
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-amber-600">
                    Quote Request &amp; Purchase
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0D0D0D]">
                    {selectedGeneratorForPurchase.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>Power: <strong>{selectedGeneratorForPurchase.kva} kVA</strong></span>
                    <span>·</span>
                    <span>Price: <strong className="text-amber-600">{selectedGeneratorForPurchase.priceTnd.toLocaleString('en-US')} TND</strong></span>
                    <span>·</span>
                    <span>Automatic ATS Included</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mohamed Ben Mahmoud"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 ${
                        formErrors.clientName ? 'border-red-400 focus:ring-red-400 bg-red-50/50' : 'border-gray-300 focus:ring-amber-500'
                      }`}
                    />
                    {formErrors.clientName && (
                      <span className="text-xs text-red-500 mt-1 block">{formErrors.clientName}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Phone Number (+216) *
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 98 123 456"
                        value={formData.clientPhone}
                        onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                        className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 ${
                          formErrors.clientPhone ? 'border-red-400 focus:ring-red-400 bg-red-50/50' : 'border-gray-300 focus:ring-amber-500'
                        }`}
                      />
                      {formErrors.clientPhone && (
                        <span className="text-xs text-red-500 mt-1 block">{formErrors.clientPhone}</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. mohamed@gmail.com"
                        value={formData.clientEmail}
                        onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                        className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 ${
                          formErrors.clientEmail ? 'border-red-400 focus:ring-red-400 bg-red-50/50' : 'border-gray-300 focus:ring-amber-500'
                        }`}
                      />
                      {formErrors.clientEmail && (
                        <span className="text-xs text-red-500 mt-1 block">{formErrors.clientEmail}</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        City / Neighborhood (Greater Tunis)
                      </label>
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      >
                        <option value="La Marsa">La Marsa</option>
                        <option value="Gammarth">Gammarth</option>
                        <option value="Carthage">Carthage</option>
                        <option value="Sidi Bou Said">Sidi Bou Said</option>
                        <option value="La Soukra">La Soukra</option>
                        <option value="Ennasr 1 & 2">Ennasr 1 &amp; 2</option>
                        <option value="Menzah (1 à 9)">Menzah (1 to 9)</option>
                        <option value="Manar">Manar</option>
                        <option value="Ariana Ville">Ariana</option>
                        <option value="Les Berges du Lac 1 & 2">Les Berges du Lac 1 &amp; 2</option>
                        <option value="Ben Arous / Megrine">Ben Arous / Megrine</option>
                        <option value="Autre région">Other area</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Property Type
                      </label>
                      <select
                        value={formData.habitationType}
                        onChange={(e) => setFormData({ ...formData, habitationType: e.target.value as HabitationType })}
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      >
                        <option value="Villa">Villa with garden / courtyard</option>
                        <option value="Detached House">Detached single-family house</option>
                        <option value="Duplex">Residential duplex</option>
                        <option value="Small Business">Small business / Medical clinic</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Installation notes or questions (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Scheduled location in backyard, we have a three-phase electrical box..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClosePurchase}
                    className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md active:scale-97 transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Submitting...' : 'Confirm Request'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
