import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle2,
  UploadCloud,
  X,
  Search,
  Send,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { SupportTicket, TicketUrgency } from '../types/volt';
import { StorageService, StorageQuotaError } from '../utils/storage';
import { compressImage } from '../utils/imageCompressor';

interface SupportSectionProps {
  tickets: SupportTicket[];
  onTicketCreated: (ticket: SupportTicket) => void;
}

export const SupportSection: React.FC<SupportSectionProps> = ({
  tickets,
  onTicketCreated
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'lookup'>('create');

  // Form state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [generatorModel, setGeneratorModel] = useState('VOLT VillaPower 15D');
  const [address, setAddress] = useState('');
  const [problemCategory, setProblemCategory] = useState<SupportTicket['problemCategory']>(
    'Starting Failure'
  );
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<TicketUrgency>('High');

  // Photo state
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoCompressing, setPhotoCompressing] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Submission & Validation
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successTicket, setSuccessTicket] = useState<SupportTicket | null>(null);
  const [quotaWarning, setQuotaWarning] = useState<string | null>(null);

  // Lookup state
  const [lookupEmail, setLookupEmail] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Email search results
  const matchingTickets = tickets.filter(
    (t) => t.clientEmail.toLowerCase().trim() === lookupEmail.toLowerCase().trim()
  );

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError(null);
    setPhotoCompressing(true);
    try {
      // Compress to max 800px width/height and 0.6 jpeg quality
      const compressed = await compressImage(file, 800, 0.6);
      setPhotoBase64(compressed);
    } catch (err: unknown) {
      console.error(err);
      setPhotoError(
        err instanceof Error ? err.message : 'Error during photo compression.'
      );
    } finally {
      setPhotoCompressing(false);
    }
  };

  const removePhoto = () => {
    setPhotoBase64(null);
    setPhotoError(null);
  };

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!clientName.trim()) errors.clientName = 'Full name is required.';
    if (!clientPhone.trim()) errors.clientPhone = 'Phone number is required.';
    if (!clientEmail.trim()) {
      errors.clientEmail = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(clientEmail)) {
      errors.clientEmail = 'Invalid email address.';
    }
    if (!address.trim()) errors.address = 'Service address in Greater Tunis is required.';
    if (!description.trim()) {
      errors.description = 'Problem description is required.';
    } else if (description.trim().length < 20) {
      errors.description = `Please provide more details (at least 20 characters, currently ${description.trim().length}).`;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (allowNoPhoto = false) => {
    if (!validate()) return;
    setIsSubmitting(true);
    setQuotaWarning(null);

    try {
      const ticketId = StorageService.getNextTicketId();
      const newTicket: SupportTicket = {
        id: ticketId,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim(),
        generatorModel: generatorModel.trim(),
        address: address.trim(),
        problemCategory,
        description: description.trim(),
        urgency,
        photoBase64: allowNoPhoto ? undefined : photoBase64 || undefined,
        status: 'Open',
        notes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const existingTickets = StorageService.getSupportTickets();
      StorageService.saveSupportTickets([newTicket, ...existingTickets]);

      setSuccessTicket(newTicket);
      onTicketCreated(newTicket);

      // Reset form
      setClientName('');
      setClientPhone('');
      setClientEmail('');
      setAddress('');
      setDescription('');
      setPhotoBase64(null);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof StorageQuotaError) {
        setQuotaWarning(
          'Browser local storage is full due to photo size. Would you like to submit your ticket without the photo so our technicians can dispatch immediately?'
        );
      } else {
        alert('An error occurred while saving the support ticket.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUrgencyBadge = (lvl: TicketUrgency) => {
    switch (lvl) {
      case 'Emergency':
      case 'Urgence':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
            STEG Emergency (&lt; 2h)
          </span>
        );
      case 'High':
      case 'Urgent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
            High Priority (&lt; 8h)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            Standard (&lt; 48h)
          </span>
        );
    }
  };

  const getStatusBadge = (status: SupportTicket['status']) => {
    switch (status) {
      case 'Open':
      case 'Ouvert':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            Open
          </span>
        );
      case 'Assigned':
      case 'Assigné':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-900 border border-blue-200">
            Assigned
          </span>
        );
      case 'In Progress':
      case 'En cours':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-100 text-indigo-900 border border-indigo-200">
            In Progress
          </span>
        );
      case 'Resolved':
      case 'Résolu':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-200">
            Resolved
          </span>
        );
      case 'Closed':
      case 'Fermé':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
            Closed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs font-bold mb-3">
          <Wrench className="w-3.5 h-3.5 text-red-600" />
          <span>Technical Assistance &amp; 24/7 On-Call Greater Tunis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0D0D0D]">
          Technical Support &amp; Emergency Breakdown
        </h1>
        <p className="text-gray-600 text-base mt-2 max-w-3xl leading-relaxed">
          Starting failure, overheating alarm, stuck ATS switch, or routine maintenance.
          Our electromechanical technicians arrive with specialized diagnostic tools and genuine replacement parts.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-4">
        <button
          onClick={() => setActiveTab('create')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === 'create'
              ? 'text-[#0D0D0D]'
              : 'text-gray-500 hover:text-[#0D0D0D]'
          }`}
        >
          Report an Incident / Breakdown
          {activeTab === 'create' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('lookup')}
          className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-2 ${
            activeTab === 'lookup'
              ? 'text-[#0D0D0D]'
              : 'text-gray-500 hover:text-[#0D0D0D]'
          }`}
        >
          <span>Track Existing Tickets</span>
          {tickets.length > 0 && (
            <span className="text-[11px] font-bold px-2 py-0.2 rounded-full bg-gray-200 text-gray-800">
              {tickets.length}
            </span>
          )}
          {activeTab === 'lookup' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
          )}
        </button>
      </div>

      {/* TAB 1: CREATE TICKET FORM */}
      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Form */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
            {successTicket ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-[#0D0D0D]">Ticket Created Successfully!</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                  Your support request has been queued in the Greater Tunis emergency dispatch priority queue.
                </p>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-left max-w-md mx-auto text-xs space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-amber-200">
                    <span className="text-gray-500">Unique Ticket ID:</span>
                    <span className="font-mono font-extrabold text-sm text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                      {successTicket.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Urgency Level:</span>
                    <span>{getUrgencyBadge(successTicket.urgency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estimated Response Time:</span>
                    <span className="font-bold text-gray-900">
                      {successTicket.urgency === 'Emergency' || successTicket.urgency === 'Urgence'
                        ? 'Under 2 hours'
                        : successTicket.urgency === 'High' || successTicket.urgency === 'Urgent'
                        ? 'Under 8 hours'
                        : 'Within 48 hours'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Notification Email:</span>
                    <span className="font-semibold text-gray-800">{successTicket.clientEmail}</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => {
                      setLookupEmail(successTicket.clientEmail);
                      setSuccessTicket(null);
                      setActiveTab('lookup');
                      setHasSearched(true);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-all"
                  >
                    View Status of This Ticket
                  </button>
                  <button
                    onClick={() => setSuccessTicket(null)}
                    className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:text-black font-semibold text-sm transition-all"
                  >
                    Create Another Ticket
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(false);
                }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-[#0D0D0D]">Breakdown Incident Report</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    All fields marked with an asterisk (*) are required to dispatch our technicians.
                  </p>
                </div>

                {quotaWarning && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{quotaWarning}</span>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-amber-200">
                      <button
                        type="button"
                        onClick={() => removePhoto()}
                        className="px-3 py-1 bg-white border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Remove Photo
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSubmit(true)}
                        className="px-3 py-1 bg-amber-600 text-white rounded font-bold hover:bg-amber-700"
                      >
                        Send Without Photo
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Client Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sami Riahi"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 ${
                          formErrors.clientName ? 'border-red-400 bg-red-50/50' : 'border-gray-300 focus:ring-amber-500'
                        }`}
                      />
                      {formErrors.clientName && (
                        <span className="text-xs text-red-500 mt-1 block">{formErrors.clientName}</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Phone Number (+216) *
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 98 765 432"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
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
                        Email Address for Updates *
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. sami.riahi@gmail.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 ${
                          formErrors.clientEmail ? 'border-red-400 bg-red-50/50' : 'border-gray-300 focus:ring-amber-500'
                        }`}
                      />
                      {formErrors.clientEmail && (
                        <span className="text-xs text-red-500 mt-1 block">{formErrors.clientEmail}</span>
                      )}
                    </div>
                  </div>

                  {/* Model & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Generator Model
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. VOLT VillaPower 15D or other"
                        value={generatorModel}
                        onChange={(e) => setGeneratorModel(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Issue Category
                      </label>
                      <select
                        value={problemCategory}
                        onChange={(e) =>
                          setProblemCategory(e.target.value as SupportTicket['problemCategory'])
                        }
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      >
                        <option value="Starting Failure">Starting Failure (Engine will not crank)</option>
                        <option value="ATS Transfer Switch Issue">ATS Transfer Switch Issue (No automatic takeover)</option>
                        <option value="Overheating / Alarm">Overheating / Audio alarm on panel</option>
                        <option value="Fuel or Oil Leak">Fuel leak or oil seepage</option>
                        <option value="Abnormal Noise">Abnormal noise or severe vibration</option>
                        <option value="Maintenance & Service">Periodic Service (Oil drain, 100h / 250h inspection)</option>
                        <option value="Other">Other technical inquiry</option>
                      </select>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full On-Site Address (Greater Tunis) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 22 Rue Sidi Dhrif, Sidi Bou Said"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 ${
                        formErrors.address ? 'border-red-400 bg-red-50/50' : 'border-gray-300 focus:ring-amber-500'
                      }`}
                    />
                    {formErrors.address && (
                      <span className="text-xs text-red-500 mt-1 block">{formErrors.address}</span>
                    )}
                  </div>

                  {/* Urgency Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Service Urgency Level
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label
                        className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                          urgency === 'Emergency' || urgency === 'Urgence'
                            ? 'border-red-500 bg-red-50/70 ring-2 ring-red-400/20'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-red-700">Critical Emergency</span>
                          <input
                            type="radio"
                            name="urgency"
                            checked={urgency === 'Emergency' || urgency === 'Urgence'}
                            onChange={() => setUrgency('Emergency')}
                            className="text-red-600 focus:ring-red-500"
                          />
                        </div>
                        <span className="text-xs font-extrabold text-red-900 mt-1">Arrival &lt; 2h</span>
                        <span className="text-[11px] text-red-600 mt-0.5">
                          Active STEG blackout, perishable supplies, or medical equipment at stake.
                        </span>
                      </label>

                      <label
                        className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                          urgency === 'High' || urgency === 'Urgent'
                            ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-400/20'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-800">High Priority</span>
                          <input
                            type="radio"
                            name="urgency"
                            checked={urgency === 'High' || urgency === 'Urgent'}
                            onChange={() => setUrgency('High')}
                            className="text-amber-600 focus:ring-amber-500"
                          />
                        </div>
                        <span className="text-xs font-extrabold text-amber-900 mt-1">Arrival &lt; 8h</span>
                        <span className="text-[11px] text-amber-700 mt-0.5">
                          Failure observed ahead of planned neighborhood outages.
                        </span>
                      </label>

                      <label
                        className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                          urgency === 'Standard' || urgency === 'Normal'
                            ? 'border-gray-500 bg-gray-50 ring-2 ring-gray-400/20'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-700">Standard</span>
                          <input
                            type="radio"
                            name="urgency"
                            checked={urgency === 'Standard' || urgency === 'Normal'}
                            onChange={() => setUrgency('Standard')}
                            className="text-gray-600 focus:ring-gray-500"
                          />
                        </div>
                        <span className="text-xs font-extrabold text-gray-900 mt-1">Within 48h</span>
                        <span className="text-[11px] text-gray-500 mt-0.5">
                          Periodic servicing, oil drain, battery inspection.
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-gray-700">
                        Detailed Description of Symptoms *
                      </label>
                      <span
                        className={`text-xs ${
                          description.trim().length >= 20 ? 'text-emerald-600 font-semibold' : 'text-gray-400'
                        }`}
                      >
                        {description.trim().length}/20 chars min.
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      placeholder="Describe what occurs (e.g. the starter cranks 3 times then the red alarm lamp flashes with error code E04...)"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 ${
                        formErrors.description ? 'border-red-400 bg-red-50/50' : 'border-gray-300 focus:ring-amber-500'
                      }`}
                    />
                    {formErrors.description && (
                      <span className="text-xs text-red-500 mt-1 block">{formErrors.description}</span>
                    )}
                  </div>

                  {/* Photo Upload with Client-Side Canvas Compression */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Photo of Control Panel or Issue (Optional)
                    </label>
                    <p className="text-[11px] text-gray-500 mb-2">
                      Image will be automatically compressed in your browser before upload.
                    </p>

                    {photoBase64 ? (
                      <div className="relative inline-block border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                        <img
                          src={photoBase64}
                          alt="Captured breakdown"
                          className="max-h-48 max-w-full object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 shadow"
                          title="Remove photo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-gray-300 hover:border-amber-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50 hover:bg-amber-50/30">
                        <UploadCloud className="w-6 h-6 text-gray-400 mb-1" />
                        <span className="text-xs font-semibold text-gray-700">
                          {photoCompressing ? 'Optimizing and compressing...' : 'Click to attach photo'}
                        </span>
                        <span className="text-[10px] text-gray-400 mt-0.5">JPEG, PNG · Resized to max 800px</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          disabled={photoCompressing}
                          className="hidden"
                        />
                      </label>
                    )}
                    {photoError && (
                      <span className="text-xs text-red-500 mt-1 block">{photoError}</span>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || photoCompressing}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md active:scale-97 transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Info Box */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>VOLT Service Commitments</span>
              </h4>
              <ul className="text-xs space-y-3 text-gray-600">
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-gray-900">Emergency &lt; 2 hours</strong>: Technician dispatched immediately
                    to restore your backup system during active power cuts.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-gray-900">High Priority &lt; 8 hours</strong>: Handled within half a day.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-gray-900">Standard &lt; 48 hours</strong>: Scheduled preventive maintenance
                    or routine diagnostics.
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-[#0D0D0D] text-white p-6 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Phone className="w-4 h-4" />
                <span>Direct Hotline</span>
              </div>
              <p className="text-xs text-gray-300">
                In case of fire, suspicious odor, or immediate hazard, turn off the emergency stop button on the unit
                and call on-call dispatch directly:
              </p>
              <a
                href="tel:+21671888999"
                className="block text-center py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-colors"
              >
                +216 71 888 999
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LOOKUP MY TICKETS */}
      {activeTab === 'lookup' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="max-w-xl">
            <h3 className="text-xl font-bold text-[#0D0D0D]">Track Your Support Tickets</h3>
            <p className="text-xs text-gray-500 mt-1">
              Enter the email address used when filing your ticket to retrieve all your service records.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setHasSearched(true);
              }}
              className="mt-4 flex gap-2"
            >
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. hedi.mansour@gmail.com"
                  value={lookupEmail}
                  onChange={(e) => {
                    setLookupEmail(e.target.value);
                    setHasSearched(false);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-sm transition-all"
              >
                Search
              </button>
            </form>
          </div>

          {/* Results list */}
          {hasSearched && (
            <div className="pt-6 border-t border-gray-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">
                  {matchingTickets.length} ticket(s) found for &quot;{lookupEmail}&quot;
                </span>
              </div>

              {matchingTickets.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200 p-6 space-y-2">
                  <Search className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="text-sm font-semibold text-gray-700">No tickets found for this email address</p>
                  <p className="text-xs text-gray-500">
                    Check your email spelling or submit a new ticket in the tab above.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {matchingTickets.map((t) => (
                    <div
                      key={t.id}
                      className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-sm text-gray-900 bg-gray-200 px-2 py-0.5 rounded">
                            {t.id}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(t.createdAt).toLocaleDateString('en-US', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getUrgencyBadge(t.urgency)}
                          {getStatusBadge(t.status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400 block">Model:</span>
                          <span className="font-semibold text-gray-800">{t.generatorModel}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block">Reported Issue:</span>
                          <span className="font-semibold text-gray-800">{t.problemCategory}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-gray-400 block">Address:</span>
                          <span className="text-gray-700">{t.address}</span>
                        </div>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-xs text-gray-700 leading-relaxed">
                        <div className="font-semibold text-gray-900 mb-1">Description:</div>
                        {t.description}
                      </div>

                      {t.photoBase64 && (
                        <div>
                          <span className="text-xs font-semibold text-gray-500 block mb-1">
                            Attached Photo:
                          </span>
                          <img
                            src={t.photoBase64}
                            alt="Incident attachment"
                            className="max-h-36 rounded-lg border border-gray-200 shadow-sm"
                          />
                        </div>
                      )}

                      {/* Technician assignment and timeline notes */}
                      <div className="pt-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <span className="text-gray-500">Assigned Technician: </span>
                          <span className="font-bold text-gray-900">
                            {t.technician || 'Pending dispatcher assignment'}
                          </span>
                        </div>

                        {t.notes && t.notes.length > 0 && (
                          <div className="text-amber-700 font-semibold">
                            {t.notes.length} service note(s) recorded
                          </div>
                        )}
                      </div>

                      {/* Notes history */}
                      {t.notes && t.notes.length > 0 && (
                        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 space-y-2 text-xs">
                          <div className="font-bold text-amber-900 flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                            <span>VOLT Technician Service Log:</span>
                          </div>
                          {t.notes.map((note) => (
                            <div key={note.id} className="text-gray-700 pl-2 border-l-2 border-amber-300">
                              <span className="font-semibold text-gray-900">{note.author}</span>{' '}
                              <span className="text-gray-400 text-[10px]">
                                ({new Date(note.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}) :
                              </span>{' '}
                              {note.text}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
