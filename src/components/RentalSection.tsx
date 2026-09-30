import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Volume2,
  CheckCircle2,
  Calculator,
  Truck,
  ArrowRight,
  X,
  Send,
  Fuel,
  Info
} from 'lucide-react';
import { RentalUnit, RentalRequest } from '../types/volt';
import { StorageService } from '../utils/storage';

interface RentalSectionProps {
  rentalUnits: RentalUnit[];
  onRentalSuccess: (request: RentalRequest) => void;
}

export const RentalSection: React.FC<RentalSectionProps> = ({
  rentalUnits,
  onRentalSuccess
}) => {
  // Today formatted as YYYY-MM-DD
  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }, []);

  // Tomorrow formatted as YYYY-MM-DD
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  // One week from today
  const nextWeekStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  }, []);

  // Calculator State
  const [selectedUnitId, setSelectedUnitId] = useState<string>(
    rentalUnits[0]?.id || ''
  );
  const [startDate, setStartDate] = useState<string>(tomorrowStr);
  const [endDate, setEndDate] = useState<string>(nextWeekStr);
  const [includeAtsCable, setIncludeAtsCable] = useState(true);
  const [includeFuelTank, setIncludeFuelTank] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientForm, setClientForm] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    deliveryAddress: '',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<RentalRequest | null>(null);

  // Selected Unit Object
  const currentUnit = useMemo(() => {
    return rentalUnits.find((u) => u.id === selectedUnitId) || rentalUnits[0];
  }, [rentalUnits, selectedUnitId]);

  // Duration in days calculation with date validation
  const { durationDays, calculationError } = useMemo(() => {
    if (!startDate || !endDate) {
      return { durationDays: 0, calculationError: 'Please select both dates.' };
    }
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { durationDays: 0, calculationError: 'Invalid date.' };
    }

    if (start < new Date(todayStr)) {
      return { durationDays: 0, calculationError: 'Start date cannot be in the past.' };
    }

    const diffMs = end.getTime() - start.getTime();
    const days = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      return {
        durationDays: 0,
        calculationError: 'Return date must be after the start date.'
      };
    }

    return { durationDays: days, calculationError: null };
  }, [startDate, endDate, todayStr]);

  // Pricing calculation according to formula:
  // If < 7 days: dailyRate * duration
  // If >= 7 days: weeklyRate * fullWeeks + dailyRate * remainingDays
  const { baseRentalPrice, fullWeeks, remainingDays, extrasTotal, finalTotalPrice } = useMemo(() => {
    if (!currentUnit || durationDays <= 0) {
      return {
        baseRentalPrice: 0,
        fullWeeks: 0,
        remainingDays: 0,
        extrasTotal: 0,
        finalTotalPrice: 0
      };
    }

    let base = 0;
    let weeks = 0;
    let rem = 0;

    if (durationDays < 7) {
      base = currentUnit.dailyRateTnd * durationDays;
      rem = durationDays;
    } else {
      weeks = Math.floor(durationDays / 7);
      rem = durationDays % 7;
      base = weeks * currentUnit.weeklyRateTnd + rem * currentUnit.dailyRateTnd;
    }

    let extras = 0;
    if (includeAtsCable) extras += 50; // Rapid transfer switch and cabling kit
    if (includeFuelTank) extras += 80; // Full initial diesel tank
    return {
      baseRentalPrice: base,
      fullWeeks: weeks,
      remainingDays: rem,
      extrasTotal: extras,
      finalTotalPrice: base + extras
    };
  }, [currentUnit, durationDays, includeAtsCable, includeFuelTank]);

  const handleSelectUnitForCalculator = (unitId: string) => {
    setSelectedUnitId(unitId);
    const calculatorEl = document.getElementById('rental-calculator');
    if (calculatorEl) {
      calculatorEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const validateBookingForm = () => {
    const errors: { [key: string]: string } = {};
    if (!clientForm.clientName.trim()) errors.clientName = 'Full name is required.';
    if (!clientForm.clientPhone.trim()) {
      errors.clientPhone = 'Phone number is required.';
    } else if (clientForm.clientPhone.trim().length < 8) {
      errors.clientPhone = 'Incomplete phone number.';
    }
    if (!clientForm.clientEmail.trim()) {
      errors.clientEmail = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(clientForm.clientEmail)) {
      errors.clientEmail = 'Invalid email format.';
    }
    if (!clientForm.deliveryAddress.trim()) {
      errors.deliveryAddress = 'Delivery address in Greater Tunis is required.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUnit || durationDays <= 0) return;
    if (!validateBookingForm()) return;

    setIsSubmitting(true);
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const newRequest: RentalRequest = {
        id: `VR-${timestamp}`,
        unitId: currentUnit.id,
        unitName: currentUnit.name,
        unitKva: currentUnit.kva,
        startDate,
        endDate,
        durationDays,
        totalPriceTnd: finalTotalPrice,
        includeAtsCable,
        includeFuelTank,
        clientName: clientForm.clientName.trim(),
        clientPhone: clientForm.clientPhone.trim(),
        clientEmail: clientForm.clientEmail.trim(),
        deliveryAddress: clientForm.deliveryAddress.trim(),
        notes: clientForm.notes.trim(),
        createdAt: new Date().toISOString(),
        status: 'Pending'
      };

      const existingRequests = StorageService.getRentalRequests();
      StorageService.saveRentalRequests([newRequest, ...existingRequests]);

      setSubmittedBooking(newRequest);
      onRentalSuccess(newRequest);
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving your rental booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-3">
          <Truck className="w-3.5 h-3.5 text-amber-600" />
          <span>Express Delivery Within 24h Across Greater Tunis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0D0D0D]">
          Residential Diesel Generator Rental
        </h1>
        <p className="text-gray-600 text-base mt-2 max-w-3xl leading-relaxed">
          Cope with prolonged grid outages, power outdoor private events, or secure home renovation work.
          Our rental fleet is whisper-quiet, mounted on mobile rolling chassis, and supplied with heavy-duty connection cables.
        </p>
      </div>

      {/* Rental Catalog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {rentalUnits.map((unit) => {
          const isSelected = unit.id === selectedUnitId;
          return (
            <div
              key={unit.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col group ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                  : 'border-gray-200 hover:shadow-lg'
              }`}
            >
              <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
                <img
                  src={unit.imageUrl}
                  alt={unit.name}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-amber-500 text-black shadow-sm">
                    {unit.kva} kVA
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md shadow-sm border ${
                      unit.available
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-red-50 text-red-800 border-red-200'
                    }`}
                  >
                    {unit.available ? 'Available Immediately' : 'Currently Rented'}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-black/75 backdrop-blur text-white flex items-center gap-1">
                    <Volume2 className="w-3 h-3 text-amber-400" />
                    {unit.soundLevelDb} dB(A)
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-[#0D0D0D]">{unit.name}</h3>
                  <div className="mt-1 text-xs text-amber-700 font-medium">
                    {unit.idealFor}
                  </div>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                    {unit.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-3">
                  {/* Tarifs */}
                  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                    <div>
                      <span className="text-[11px] text-gray-400 block">Daily Rate</span>
                      <span className="text-lg font-extrabold text-[#0D0D0D]">
                        {unit.dailyRateTnd} <span className="text-xs font-normal text-gray-500">TND</span>
                      </span>
                    </div>
                    <div className="border-l border-gray-200">
                      <span className="text-[11px] text-gray-400 block">Weekly Rate</span>
                      <span className="text-lg font-extrabold text-amber-600">
                        {unit.weeklyRateTnd} <span className="text-xs font-normal text-gray-500">TND</span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectUnitForCalculator(unit.id)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    <span>{isSelected ? '✓ Selected for calculation' : 'Select this unit'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* LIVE CALCULATOR SECTION */}
      <section
        id="rental-calculator"
        className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-lg relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
                <Calculator className="w-4 h-4" />
                <span>Official VOLT Simulator</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D]">
                Rental Rate Calculator
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Automatic discounted weekly package applied for 7 days or more</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Config Controls */}
            <div className="lg:col-span-7 space-y-5">
              {/* Unit selection dropdown */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  1. Choose diesel generator
                </label>
                <select
                  value={selectedUnitId}
                  onChange={(e) => setSelectedUnitId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {rentalUnits.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} — {u.kva} kVA ({u.dailyRateTnd} TND/day · {u.weeklyRateTnd} TND/week)
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    2. Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      min={todayStr}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    3. Return Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      min={startDate || todayStr}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              {calculationError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                  {calculationError}
                </div>
              )}

              {/* Options & Services additionnels */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  4. Connection Options &amp; Fuel Service
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={includeAtsCable}
                      onChange={(e) => setIncludeAtsCable(e.target.checked)}
                      className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                    />
                    <div className="flex-1 text-xs">
                      <span className="font-semibold text-gray-800 block">
                        25m Power Cabling &amp; Rapid Transfer Switch Kit (+50 TND)
                      </span>
                      <span className="text-gray-500">
                        Connects generator to your villa main panel safely with no risk of back-feeding the grid.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={includeFuelTank}
                      onChange={(e) => setIncludeFuelTank(e.target.checked)}
                      className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                    />
                    <div className="flex-1 text-xs">
                      <span className="font-semibold text-gray-800 block">
                        Full Tank of Gasoil 50 at Delivery (+80 TND)
                      </span>
                      <span className="text-gray-500">
                        Generator delivered with a full fuel tank, ready for immediate startup.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Live Calculation Summary Box */}
            <div className="lg:col-span-5 bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-5">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Live Price Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-500">Selected Model:</span>
                  <span className="font-bold text-gray-900 text-right">{currentUnit?.name}</span>
                </div>

                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-500">Calculated Duration:</span>
                  <span className="font-bold text-gray-900 text-right">
                    {durationDays > 0 ? `${durationDays} day(s)` : '—'}
                  </span>
                </div>

                {/* Calculation formula details */}
                {durationDays > 0 && (
                  <div className="p-3 rounded-xl bg-white border border-gray-200 space-y-1.5 text-gray-600">
                    <div className="text-[11px] font-semibold text-amber-800">
                      Applied pricing formula:
                    </div>
                    {durationDays < 7 ? (
                      <div className="text-[11px]">
                        {durationDays} day(s) × {currentUnit?.dailyRateTnd} TND/day ={' '}
                        <strong>{baseRentalPrice} TND</strong>
                      </div>
                    ) : (
                      <div className="text-[11px] space-y-1">
                        <div>
                          • {fullWeeks} full week(s) × {currentUnit?.weeklyRateTnd} TND ={' '}
                          <strong>{fullWeeks * (currentUnit?.weeklyRateTnd || 0)} TND</strong>
                        </div>
                        {remainingDays > 0 && (
                          <div>
                            • + {remainingDays} extra day(s) × {currentUnit?.dailyRateTnd} TND ={' '}
                            <strong>{remainingDays * (currentUnit?.dailyRateTnd || 0)} TND</strong>
                          </div>
                        )}
                        <div className="text-emerald-700 font-semibold pt-1">
                          Savings from weekly discount package applied!
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {extrasTotal > 0 && (
                  <div className="flex justify-between pb-2 border-b border-gray-200">
                    <span className="text-gray-500">Selected Options:</span>
                    <span className="font-semibold text-gray-900">+{extrasTotal} TND</span>
                  </div>
                )}
              </div>

              {/* Total display */}
              <div className="pt-3 border-t border-gray-300">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase font-bold text-gray-500">Estimated Total (incl. VAT)</span>
                  <div className="text-3xl font-black text-amber-600">
                    {finalTotalPrice.toLocaleString('en-US')}{' '}
                    <span className="text-sm font-semibold text-gray-500">TND</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  On-site delivery and retrieval across Greater Tunis included.
                </p>
              </div>

              {/* Submit CTA */}
              <button
                type="button"
                disabled={durationDays <= 0 || !!calculationError}
                onClick={() => {
                  setSubmittedBooking(null);
                  setIsModalOpen(true);
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md active:scale-97 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                <span>Request This Rental</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL: Rental Request Booking */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSubmittedBooking(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {submittedBooking ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-[#0D0D0D]">Rental Booking Confirmed!</h3>
                <p className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
                  Your reservation request for the <strong>{submittedBooking.unitName}</strong> has been received.
                  Our logistics team will contact you within 2 hours to confirm your delivery schedule.
                </p>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Booking Reference:</span>
                    <span className="font-mono font-bold text-amber-800">{submittedBooking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Rental Period:</span>
                    <span className="font-semibold text-gray-800">
                      {submittedBooking.startDate} to {submittedBooking.endDate} ({submittedBooking.durationDays} days)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total payable upon delivery:</span>
                    <span className="font-bold text-amber-700">{submittedBooking.totalPriceTnd} TND</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Delivery Commitment:</span>
                    <span className="font-semibold text-emerald-700">Guaranteed within 24h</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setSubmittedBooking(null);
                    }}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-amber-600">
                    Complete Rental Booking
                  </span>
                  <h3 className="text-xl font-bold text-[#0D0D0D]">
                    {currentUnit?.name} ({durationDays} days)
                  </h3>
                  <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
                    <span>{startDate} to {endDate}</span>
                    <span>·</span>
                    <span className="font-bold text-amber-600">{finalTotalPrice} TND</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tarak Ghrab"
                      value={clientForm.clientName}
                      onChange={(e) => setClientForm({ ...clientForm, clientName: e.target.value })}
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 ${
                        formErrors.clientName ? 'border-red-400 bg-red-50/50' : 'border-gray-300 focus:ring-amber-500'
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
                        placeholder="e.g. 55 123 456"
                        value={clientForm.clientPhone}
                        onChange={(e) => setClientForm({ ...clientForm, clientPhone: e.target.value })}
                        className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 ${
                          formErrors.clientPhone ? 'border-red-400 bg-red-50/50' : 'border-gray-300 focus:ring-amber-500'
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
                        placeholder="e.g. tarak@topnet.tn"
                        value={clientForm.clientEmail}
                        onChange={(e) => setClientForm({ ...clientForm, clientEmail: e.target.value })}
                        className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 ${
                          formErrors.clientEmail ? 'border-red-400 bg-red-50/50' : 'border-gray-300 focus:ring-amber-500'
                        }`}
                      />
                      {formErrors.clientEmail && (
                        <span className="text-xs text-red-500 mt-1 block">{formErrors.clientEmail}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Delivery Address (Greater Tunis) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Villa 14, Rue de l'Olivier, Gammarth Supérieur"
                      value={clientForm.deliveryAddress}
                      onChange={(e) => setClientForm({ ...clientForm, deliveryAddress: e.target.value })}
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 ${
                        formErrors.deliveryAddress ? 'border-red-400 bg-red-50/50' : 'border-gray-300 focus:ring-amber-500'
                      }`}
                    />
                    {formErrors.deliveryAddress && (
                      <span className="text-xs text-red-500 mt-1 block">{formErrors.deliveryAddress}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Specific driver directions or instructions (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. White sliding gate, ring the intercom..."
                      value={clientForm.notes}
                      onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
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
                    <span>{isSubmitting ? 'Registering...' : 'Confirm Reservation'}</span>
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
