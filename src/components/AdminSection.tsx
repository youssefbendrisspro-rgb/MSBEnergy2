import React, { useState } from 'react';
import {
  Package,
  Truck,
  ShoppingCart,
  Wrench,
  Plus,
  Trash2,
  Edit,
  Search,
  LogOut,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon
} from 'lucide-react';
import {
  Generator,
  RentalUnit,
  PurchaseRequest,
  RentalRequest,
  SupportTicket,
  PurchaseStatus,
  RentalStatus,
  TicketStatus
} from '../types/volt';
import { StorageService } from '../utils/storage';

export type AdminTab = 'generators' | 'rental_units' | 'purchases' | 'rentals' | 'tickets';

interface AdminSectionProps {
  generators: Generator[];
  rentalUnits: RentalUnit[];
  purchaseRequests: PurchaseRequest[];
  rentalRequests: RentalRequest[];
  tickets: SupportTicket[];
  onUpdateGenerators: (generators: Generator[]) => void;
  onUpdateRentalUnits: (units: RentalUnit[]) => void;
  onUpdatePurchaseRequests: (requests: PurchaseRequest[]) => void;
  onUpdateRentalRequests: (requests: RentalRequest[]) => void;
  onUpdateTickets: (tickets: SupportTicket[]) => void;
  onExitAdmin: () => void;
}

export const AdminSection: React.FC<AdminSectionProps> = ({
  generators,
  rentalUnits,
  purchaseRequests,
  rentalRequests,
  tickets,
  onUpdateGenerators,
  onUpdateRentalUnits,
  onUpdatePurchaseRequests,
  onUpdateRentalRequests,
  onUpdateTickets,
  onExitAdmin
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('generators');

  // Search & filters inside admin
  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketStatusFilter, setTicketStatusFilter] = useState<string>('all');
  const [purchaseStatusFilter, setPurchaseStatusFilter] = useState<string>('all');
  const [rentalStatusFilter, setRentalStatusFilter] = useState<string>('all');

  // Modals for CRUD
  const [editingGenerator, setEditingGenerator] = useState<Generator | null>(null);
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);
  const [genForm, setGenForm] = useState<Partial<Generator>>({});

  const [editingRentalUnit, setEditingRentalUnit] = useState<RentalUnit | null>(null);
  const [isRentalUnitModalOpen, setIsRentalUnitModalOpen] = useState(false);
  const [rentForm, setRentForm] = useState<Partial<RentalUnit>>({});

  // Confirm delete modal state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'generator' | 'rentalUnit' | 'ticket' | 'purchase' | 'rental';
    id: string;
    name: string;
  } | null>(null);

  // Expanded ticket IDs
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState<{ [ticketId: string]: string }>({});

  // 4 Clickable Dashboard Statistics
  const pendingPurchases = purchaseRequests.filter(
    (p) => p.status === 'Pending' || p.status === 'En attente'
  ).length;
  const availableRentals = rentalUnits.filter((u) => u.available).length;
  const openTickets = tickets.filter(
    (t) => t.status === 'Open' || t.status === 'Ouvert' || t.status === 'In Progress' || t.status === 'En cours'
  ).length;

  // GENERATORS CRUD
  const handleOpenAddGenerator = () => {
    setEditingGenerator(null);
    setGenForm({
      name: '',
      category: 'Compact Home',
      kva: 10,
      kw: 8,
      engine: '4-stroke diesel',
      fuel: 'Low-Sulfur Diesel (Gasoil 50)',
      tankCapacityLiters: 20,
      consumptionLitersPerHour: 1.5,
      autonomyHours: 12,
      soundLevelDb: 62,
      dimensions: '950 x 550 x 750 mm',
      weightKg: 160,
      atsIncluded: true,
      voltage: '230V Single-Phase',
      warrantyYears: 2,
      priceTnd: 9500,
      availability: 'In Stock',
      description: '',
      features: ['Automatic ATS transfer switch included', 'Soundproof acoustic canopy'],
      imageUrl: '/src/assets/images/gen_home_compact_1790543060063.jpg'
    });
    setIsGeneratorModalOpen(true);
  };

  const handleOpenEditGenerator = (gen: Generator) => {
    setEditingGenerator(gen);
    setGenForm({ ...gen });
    setIsGeneratorModalOpen(true);
  };

  const handleSaveGenerator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!genForm.name || !genForm.priceTnd) return;

    if (editingGenerator) {
      // Edit
      const updated = generators.map((g) =>
        g.id === editingGenerator.id ? ({ ...g, ...genForm } as Generator) : g
      );
      onUpdateGenerators(updated);
      StorageService.saveGenerators(updated);
    } else {
      // Add
      const newGen: Generator = {
        id: `gen-${Date.now()}`,
        name: genForm.name || 'VOLT Generator',
        category: genForm.category || 'Compact Home',
        kva: Number(genForm.kva) || 10,
        kw: Number(genForm.kw) || 8,
        engine: genForm.engine || 'Diesel',
        fuel: genForm.fuel || 'Low-Sulfur Diesel (Gasoil 50)',
        tankCapacityLiters: Number(genForm.tankCapacityLiters) || 15,
        consumptionLitersPerHour: Number(genForm.consumptionLitersPerHour) || 1.5,
        autonomyHours: Number(genForm.autonomyHours) || 10,
        soundLevelDb: Number(genForm.soundLevelDb) || 62,
        dimensions: genForm.dimensions || '1000 x 600 x 800 mm',
        weightKg: Number(genForm.weightKg) || 180,
        atsIncluded: genForm.atsIncluded ?? true,
        voltage: genForm.voltage || '230V Single-Phase',
        warrantyYears: Number(genForm.warrantyYears) || 2,
        priceTnd: Number(genForm.priceTnd) || 10000,
        availability: genForm.availability || 'In Stock',
        description: genForm.description || '',
        features: genForm.features || ['Automatic ATS transfer switch'],
        imageUrl: genForm.imageUrl || '/src/assets/images/gen_home_compact_1790543060063.jpg'
      };
      const updated = [newGen, ...generators];
      onUpdateGenerators(updated);
      StorageService.saveGenerators(updated);
    }
    setIsGeneratorModalOpen(false);
  };

  // RENTAL UNITS CRUD
  const handleOpenAddRental = () => {
    setEditingRentalUnit(null);
    setRentForm({
      name: '',
      kva: 10,
      dailyRateTnd: 120,
      weeklyRateTnd: 650,
      available: true,
      soundLevelDb: 62,
      fuelType: 'Low-Sulfur Diesel (Gasoil 50)',
      idealFor: 'Villa, private reception',
      description: '',
      imageUrl: '/src/assets/images/gen_rental_unit_1790543090833.jpg'
    });
    setIsRentalUnitModalOpen(true);
  };

  const handleOpenEditRental = (unit: RentalUnit) => {
    setEditingRentalUnit(unit);
    setRentForm({ ...unit });
    setIsRentalUnitModalOpen(true);
  };

  const handleSaveRentalUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rentForm.name || !rentForm.dailyRateTnd) return;

    if (editingRentalUnit) {
      const updated = rentalUnits.map((u) =>
        u.id === editingRentalUnit.id ? ({ ...u, ...rentForm } as RentalUnit) : u
      );
      onUpdateRentalUnits(updated);
      StorageService.saveRentalUnits(updated);
    } else {
      const newUnit: RentalUnit = {
        id: `rent-${Date.now()}`,
        name: rentForm.name || 'VOLT Rent',
        kva: Number(rentForm.kva) || 10,
        dailyRateTnd: Number(rentForm.dailyRateTnd) || 100,
        weeklyRateTnd: Number(rentForm.weeklyRateTnd) || 600,
        available: rentForm.available ?? true,
        soundLevelDb: Number(rentForm.soundLevelDb) || 62,
        fuelType: rentForm.fuelType || 'Low-Sulfur Diesel (Gasoil 50)',
        idealFor: rentForm.idealFor || 'Detached House',
        description: rentForm.description || '',
        imageUrl: rentForm.imageUrl || '/src/assets/images/gen_rental_unit_1790543090833.jpg'
      };
      const updated = [newUnit, ...rentalUnits];
      onUpdateRentalUnits(updated);
      StorageService.saveRentalUnits(updated);
    }
    setIsRentalUnitModalOpen(false);
  };

  // Generic Deletion
  const confirmDeletion = () => {
    if (!deleteConfirmation) return;
    const { type, id } = deleteConfirmation;

    if (type === 'generator') {
      const updated = generators.filter((g) => g.id !== id);
      onUpdateGenerators(updated);
      StorageService.saveGenerators(updated);
    } else if (type === 'rentalUnit') {
      const updated = rentalUnits.filter((u) => u.id !== id);
      onUpdateRentalUnits(updated);
      StorageService.saveRentalUnits(updated);
    } else if (type === 'purchase') {
      const updated = purchaseRequests.filter((p) => p.id !== id);
      onUpdatePurchaseRequests(updated);
      StorageService.savePurchaseRequests(updated);
    } else if (type === 'rental') {
      const updated = rentalRequests.filter((r) => r.id !== id);
      onUpdateRentalRequests(updated);
      StorageService.saveRentalRequests(updated);
    } else if (type === 'ticket') {
      const updated = tickets.filter((t) => t.id !== id);
      onUpdateTickets(updated);
      StorageService.saveSupportTickets(updated);
    }

    setDeleteConfirmation(null);
  };

  // Status updates
  const handleUpdatePurchaseStatus = (id: string, newStatus: PurchaseStatus) => {
    const updated = purchaseRequests.map((p) =>
      p.id === id ? { ...p, status: newStatus } : p
    );
    onUpdatePurchaseRequests(updated);
    StorageService.savePurchaseRequests(updated);
  };

  const handleUpdateRentalStatus = (id: string, newStatus: RentalStatus) => {
    const updated = rentalRequests.map((r) =>
      r.id === id ? { ...r, status: newStatus } : r
    );
    onUpdateRentalRequests(updated);
    StorageService.saveRentalRequests(updated);
  };

  const handleUpdateTicketStatus = (id: string, newStatus: TicketStatus) => {
    const updated = tickets.map((t) =>
      t.id === id ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
    );
    onUpdateTickets(updated);
    StorageService.saveSupportTickets(updated);
  };

  const handleAssignTechnician = (ticketId: string, technician: string) => {
    const updated = tickets.map((t) =>
      t.id === ticketId
        ? {
            ...t,
            technician,
            status:
              t.status === 'Open' || t.status === 'Ouvert'
                ? ('Assigned' as TicketStatus)
                : t.status,
            updatedAt: new Date().toISOString()
          }
        : t
    );
    onUpdateTickets(updated);
    StorageService.saveSupportTickets(updated);
  };

  const handleAddTicketNote = (ticketId: string) => {
    const noteContent = newNoteText[ticketId]?.trim();
    if (!noteContent) return;

    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        const newNote = {
          id: `note-${Date.now()}`,
          author: 'VOLT Admin',
          text: noteContent,
          createdAt: new Date().toISOString()
        };
        return {
          ...t,
          notes: [...(t.notes || []), newNote],
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    });

    onUpdateTickets(updated);
    StorageService.saveSupportTickets(updated);
    setNewNoteText({ ...newNoteText, [ticketId]: '' });
  };

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    const matchSearch =
      t.id.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.clientName.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.clientEmail.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.generatorModel.toLowerCase().includes(ticketSearch.toLowerCase());

    const matchStatus =
      ticketStatusFilter === 'all' ||
      t.status === ticketStatusFilter ||
      (ticketStatusFilter === 'Open' && (t.status === 'Open' || t.status === 'Ouvert')) ||
      (ticketStatusFilter === 'Assigned' && (t.status === 'Assigned' || t.status === 'Assigné')) ||
      (ticketStatusFilter === 'In Progress' && (t.status === 'In Progress' || t.status === 'En cours')) ||
      (ticketStatusFilter === 'Resolved' && (t.status === 'Resolved' || t.status === 'Résolu')) ||
      (ticketStatusFilter === 'Closed' && (t.status === 'Closed' || t.status === 'Fermé'));

    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-700">
              VOLT Administration Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D] mt-1">
            Greater Tunis Operations Management
          </h1>
        </div>

        <button
          onClick={onExitAdmin}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700 border border-gray-300 text-xs font-bold transition-colors w-fit"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Admin Mode</span>
        </button>
      </div>

      {/* 4 Clickable Dashboard Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Vente */}
        <div
          onClick={() => setActiveTab('generators')}
          className={`cursor-pointer p-5 rounded-2xl border transition-all ${
            activeTab === 'generators'
              ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
              : 'bg-white border-gray-200 hover:border-amber-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Sales Inventory
            </span>
            <Package className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-[#0D0D0D]">{generators.length}</div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            {generators.filter((g) => g.availability === 'In Stock' || g.availability === 'En stock').length} available in stock
          </span>
        </div>

        {/* Stat 2: Location */}
        <div
          onClick={() => setActiveTab('rental_units')}
          className={`cursor-pointer p-5 rounded-2xl border transition-all ${
            activeTab === 'rental_units'
              ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
              : 'bg-white border-gray-200 hover:border-amber-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Rental Fleet
            </span>
            <Truck className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-[#0D0D0D]">{rentalUnits.length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            {availableRentals} ready to deploy
          </span>
        </div>

        {/* Stat 3: Demandes d'Achat */}
        <div
          onClick={() => setActiveTab('purchases')}
          className={`cursor-pointer p-5 rounded-2xl border transition-all ${
            activeTab === 'purchases'
              ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
              : 'bg-white border-gray-200 hover:border-amber-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Purchase Inquiries
            </span>
            <ShoppingCart className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-[#0D0D0D]">{purchaseRequests.length}</div>
          <span className="text-[11px] text-amber-700 font-bold mt-1 block">
            {pendingPurchases} pending follow-up
          </span>
        </div>

        {/* Stat 4: Tickets Support */}
        <div
          onClick={() => setActiveTab('tickets')}
          className={`cursor-pointer p-5 rounded-2xl border transition-all ${
            activeTab === 'tickets'
              ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
              : 'bg-white border-gray-200 hover:border-amber-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Support Tickets
            </span>
            <Wrench className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-black text-[#0D0D0D]">{tickets.length}</div>
          <span className="text-[11px] text-red-600 font-bold mt-1 block">
            {openTickets} active / emergency
          </span>
        </div>
      </div>

      {/* Admin Sub-navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveTab('generators')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'generators'
              ? 'bg-[#0D0D0D] text-white shadow-sm'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          Sales Catalog ({generators.length})
        </button>

        <button
          onClick={() => setActiveTab('rental_units')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'rental_units'
              ? 'bg-[#0D0D0D] text-white shadow-sm'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          Rental Fleet ({rentalUnits.length})
        </button>

        <button
          onClick={() => setActiveTab('purchases')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'purchases'
              ? 'bg-[#0D0D0D] text-white shadow-sm'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          Purchase Inquiries ({purchaseRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('rentals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'rentals'
              ? 'bg-[#0D0D0D] text-white shadow-sm'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          Rental Bookings ({rentalRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'tickets'
              ? 'bg-[#0D0D0D] text-white shadow-sm'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          Support Tickets ({tickets.length})
        </button>
      </div>

      {/* SECTION 1: GENERATORS CRUD */}
      {activeTab === 'generators' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#0D0D0D]">Sales Generator Inventory</h3>
              <p className="text-xs text-gray-500">Add, adjust pricing, or manage generator models.</p>
            </div>
            <button
              onClick={handleOpenAddGenerator}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Generator</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Model &amp; Photo</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4">Noise</th>
                  <th className="py-3 px-4">Price (incl. VAT)</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {generators.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-gray-900 flex items-center gap-3">
                      <img
                        src={g.imageUrl}
                        alt={g.name}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-200"
                        referrerPolicy="no-referrer"
                      />
                      <span>{g.name}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{g.category}</td>
                    <td className="py-3 px-4 font-bold text-gray-800">{g.kva} kVA</td>
                    <td className="py-3 px-4 text-gray-600">{g.soundLevelDb} dB(A)</td>
                    <td className="py-3 px-4 font-extrabold text-amber-600">
                      {g.priceTnd.toLocaleString('en-US')} TND
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-800">
                        {g.availability}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditGenerator(g)}
                        className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirmation({
                            type: 'generator',
                            id: g.id,
                            name: g.name
                          })
                        }
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: RENTAL UNITS CRUD */}
      {activeTab === 'rental_units' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#0D0D0D]">Rental Fleet Management</h3>
              <p className="text-xs text-gray-500">Manage units available for immediate on-site delivery.</p>
            </div>
            <button
              onClick={handleOpenAddRental}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Rental Unit</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Unit &amp; Photo</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4">Daily Rate</th>
                  <th className="py-3 px-4">Weekly Rate</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rentalUnits.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-gray-900 flex items-center gap-3">
                      <img
                        src={u.imageUrl}
                        alt={u.name}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div>{u.name}</div>
                        <div className="text-[10px] text-gray-400 font-normal">{u.idealFor}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-800">{u.kva} kVA</td>
                    <td className="py-3 px-4 font-bold text-gray-900">{u.dailyRateTnd} TND</td>
                    <td className="py-3 px-4 font-bold text-amber-600">{u.weeklyRateTnd} TND</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          u.available ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {u.available ? 'Available' : 'On Rent'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditRental(u)}
                        className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirmation({
                            type: 'rentalUnit',
                            id: u.id,
                            name: u.name
                          })
                        }
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: PURCHASE REQUESTS */}
      {activeTab === 'purchases' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#0D0D0D]">Client Purchase Inquiries</h3>
              <p className="text-xs text-gray-500">Follow up with prospective buyers and schedule on-site site surveys.</p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">Filter by status:</span>
              <select
                value={purchaseStatusFilter}
                onChange={(e) => setPurchaseStatusFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white"
              >
                <option value="all">All</option>
                <option value="Pending">Pending</option>
                <option value="Contacted">Contacted</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Ref &amp; Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Location &amp; Property</th>
                  <th className="py-3 px-4">Desired Model</th>
                  <th className="py-3 px-4">Client Message</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {purchaseRequests
                  .filter((p) => {
                    if (purchaseStatusFilter === 'all') return true;
                    if (purchaseStatusFilter === 'Pending') return p.status === 'Pending' || p.status === 'En attente';
                    if (purchaseStatusFilter === 'Contacted') return p.status === 'Contacted' || p.status === 'Contacté';
                    if (purchaseStatusFilter === 'Confirmed') return p.status === 'Confirmed' || p.status === 'Confirmé';
                    if (purchaseStatusFilter === 'Completed') return p.status === 'Completed' || p.status === 'Terminé';
                    if (purchaseStatusFilter === 'Rejected') return p.status === 'Rejected' || p.status === 'Rejeté';
                    return p.status === purchaseStatusFilter;
                  })
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-gray-900">{p.id}</div>
                        <div className="text-[10px] text-gray-400">
                          {new Date(p.createdAt).toLocaleDateString('en-US')}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900">{p.clientName}</div>
                        <div className="text-gray-500">{p.clientPhone}</div>
                        <div className="text-[10px] text-gray-400">{p.clientEmail}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-800">{p.city}</div>
                        <div className="text-gray-500">{p.habitationType}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900">{p.generatorName}</div>
                        <div className="text-amber-600 font-semibold">{p.totalPriceTnd.toLocaleString('en-US')} TND</div>
                      </td>
                      <td className="py-3 px-4 max-w-xs text-gray-600">
                        {p.message || <span className="text-gray-300 italic">No message</span>}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={p.status}
                          onChange={(e) => handleUpdatePurchaseStatus(p.id, e.target.value as PurchaseStatus)}
                          className="px-2 py-1 border border-gray-200 rounded-md font-semibold text-xs bg-white"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() =>
                            setDeleteConfirmation({
                              type: 'purchase',
                              id: p.id,
                              name: `Request ${p.id} (${p.clientName})`
                            })
                          }
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4: RENTAL REQUESTS */}
      {activeTab === 'rentals' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#0D0D0D]">Rental Reservations</h3>
              <p className="text-xs text-gray-500">Schedule deliveries and pickups with service drivers.</p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">Filter by status:</span>
              <select
                value={rentalStatusFilter}
                onChange={(e) => setRentalStatusFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white"
              >
                <option value="all">All</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Active">Active (On Site)</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Ref &amp; Period</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Delivery Address</th>
                  <th className="py-3 px-4">Unit &amp; Options</th>
                  <th className="py-3 px-4">Total TND</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rentalRequests
                  .filter((r) => {
                    if (rentalStatusFilter === 'all') return true;
                    if (rentalStatusFilter === 'Pending') return r.status === 'Pending' || r.status === 'En attente';
                    if (rentalStatusFilter === 'Confirmed') return r.status === 'Confirmed' || r.status === 'Confirmé';
                    if (rentalStatusFilter === 'Active') return r.status === 'Active' || r.status === 'Actif';
                    if (rentalStatusFilter === 'Completed') return r.status === 'Completed' || r.status === 'Terminé';
                    if (rentalStatusFilter === 'Rejected') return r.status === 'Rejected' || r.status === 'Rejeté';
                    return r.status === rentalStatusFilter;
                  })
                  .map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-gray-900">{r.id}</div>
                        <div className="text-[10px] text-gray-500">
                          {r.startDate} to {r.endDate} ({r.durationDays}d)
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900">{r.clientName}</div>
                        <div className="text-gray-500">{r.clientPhone}</div>
                      </td>
                      <td className="py-3 px-4 max-w-xs text-gray-700">
                        {r.deliveryAddress}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900">{r.unitName}</div>
                        <div className="text-[10px] text-gray-500">
                          {r.includeAtsCable && '• ATS Cable '}
                          {r.includeFuelTank && '• Diesel Tank'}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-black text-amber-600">
                        {r.totalPriceTnd} TND
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={r.status}
                          onChange={(e) => handleUpdateRentalStatus(r.id, e.target.value as RentalStatus)}
                          className="px-2 py-1 border border-gray-200 rounded-md font-semibold text-xs bg-white"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Active">Active</option>
                          <option value="Completed">Completed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() =>
                            setDeleteConfirmation({
                              type: 'rental',
                              id: r.id,
                              name: `Rental ${r.id} (${r.clientName})`
                            })
                          }
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 5: TICKETS MANAGEMENT */}
      {activeTab === 'tickets' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#0D0D0D]">Support &amp; Emergency Tickets</h3>
              <p className="text-xs text-gray-500">
                Dispatch technicians, record timestamped logs, and track issue resolution.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:bg-white"
                />
              </div>

              <select
                value={ticketStatusFilter}
                onChange={(e) => setTicketStatusFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:bg-white"
              >
                <option value="all">All statuses</option>
                <option value="Open">Open</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredTickets.map((t) => {
              const isExpanded = expandedTicketId === t.id;
              return (
                <div
                  key={t.id}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors"
                >
                  {/* Ticket Header Row */}
                  <div className="p-4 bg-gray-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setExpandedTicketId(isExpanded ? null : t.id)}
                        className="p-1 text-gray-500 hover:text-black rounded"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                            {t.id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              t.urgency === 'Emergency' || t.urgency === 'Urgence'
                                ? 'bg-red-100 text-red-800'
                                : t.urgency === 'High' || t.urgency === 'Urgent'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {t.urgency === 'Urgence' ? 'Emergency' : t.urgency === 'Urgent' ? 'High' : t.urgency === 'Normal' ? 'Standard' : t.urgency}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-gray-800 mt-1">
                          {t.clientName} · {t.generatorModel}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Status select */}
                      <select
                        value={t.status}
                        onChange={(e) => handleUpdateTicketStatus(t.id, e.target.value as TicketStatus)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-gray-300 bg-white"
                      >
                        <option value="Open">Open</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>

                      <button
                        onClick={() =>
                          setDeleteConfirmation({
                            type: 'ticket',
                            id: t.id,
                            name: `Ticket ${t.id} (${t.clientName})`
                          })
                        }
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Ticket Details */}
                  {isExpanded && (
                    <div className="p-5 border-t border-gray-200 bg-white space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div>
                          <span className="text-gray-400 block">Phone:</span>
                          <a href={`tel:${t.clientPhone}`} className="font-semibold text-amber-700 hover:underline">
                            {t.clientPhone}
                          </a>
                        </div>
                        <div>
                          <span className="text-gray-400 block">Email:</span>
                          <span className="font-medium text-gray-800">{t.clientEmail}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block">Address:</span>
                          <span className="font-medium text-gray-800">{t.address}</span>
                        </div>
                      </div>

                      <div>
                        <div className="font-semibold text-gray-900 mb-1">
                          Category: <span className="font-bold text-amber-700">{t.problemCategory}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 leading-relaxed">
                          {t.description}
                        </div>
                      </div>

                      {t.photoBase64 && (
                        <div>
                          <div className="font-semibold text-gray-900 mb-1 flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-gray-500" />
                            <span>Client Incident Photo:</span>
                          </div>
                          <img
                            src={t.photoBase64}
                            alt="Incident attachment"
                            className="max-h-56 rounded-xl border border-gray-200 shadow-sm"
                          />
                        </div>
                      )}

                      {/* Technician assignment */}
                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                        <label className="font-semibold text-gray-700 shrink-0">
                          Assigned On-Call Technician:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Firas Belhaj / Nidhal Jlassi"
                          value={t.technician || ''}
                          onChange={(e) => handleAssignTechnician(t.id, e.target.value)}
                          className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs max-w-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      {/* Notes journal */}
                      <div className="pt-3 border-t border-gray-200 space-y-3">
                        <div className="font-bold text-gray-900 flex items-center gap-1.5">
                          <Wrench className="w-3.5 h-3.5 text-amber-600" />
                          <span>Service Log &amp; Workshop Notes</span>
                        </div>

                        {t.notes && t.notes.length > 0 ? (
                          <div className="space-y-2">
                            {t.notes.map((n) => (
                              <div key={n.id} className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs">
                                <div className="flex items-center justify-between text-[10px] text-gray-500 mb-0.5">
                                  <span className="font-bold text-amber-900">{n.author}</span>
                                  <span>{new Date(n.createdAt).toLocaleString('en-US')}</span>
                                </div>
                                <div className="text-gray-800">{n.text}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-400 italic">No notes recorded yet.</div>
                        )}

                        {/* Add note input */}
                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Add service note (e.g. coil diagnostic completed...)"
                            value={newNoteText[t.id] || ''}
                            onChange={(e) =>
                              setNewNoteText({ ...newNoteText, [t.id]: e.target.value })
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTicketNote(t.id);
                              }
                            }}
                            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddTicketNote(t.id)}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs"
                          >
                            Add Note
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit Generator */}
      {isGeneratorModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-200">
            <h3 className="text-xl font-bold text-[#0D0D0D] mb-4">
              {editingGenerator ? `Edit ${editingGenerator.name}` : 'Add New Diesel Generator'}
            </h3>

            <form onSubmit={handleSaveGenerator} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Model Name *</label>
                  <input
                    type="text"
                    required
                    value={genForm.name || ''}
                    onChange={(e) => setGenForm({ ...genForm, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={genForm.category}
                    onChange={(e) => setGenForm({ ...genForm, category: e.target.value as Generator['category'] })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="Compact Home">Compact Home</option>
                    <option value="Residential Villa">Residential Villa</option>
                    <option value="Estate & Large Duplex">Estate &amp; Large Duplex</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Capacity kVA *</label>
                  <input
                    type="number"
                    required
                    value={genForm.kva || ''}
                    onChange={(e) => setGenForm({ ...genForm, kva: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Output kW</label>
                  <input
                    type="number"
                    step="0.1"
                    value={genForm.kw || ''}
                    onChange={(e) => setGenForm({ ...genForm, kw: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Price TND (incl. VAT) *</label>
                  <input
                    type="number"
                    required
                    value={genForm.priceTnd || ''}
                    onChange={(e) => setGenForm({ ...genForm, priceTnd: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg font-bold text-amber-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Sound dB(A) @ 7m</label>
                  <input
                    type="number"
                    value={genForm.soundLevelDb || ''}
                    onChange={(e) => setGenForm({ ...genForm, soundLevelDb: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Fuel Usage L/h</label>
                  <input
                    type="number"
                    step="0.1"
                    value={genForm.consumptionLitersPerHour || ''}
                    onChange={(e) => setGenForm({ ...genForm, consumptionLitersPerHour: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Autonomy (hrs)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={genForm.autonomyHours || ''}
                    onChange={(e) => setGenForm({ ...genForm, autonomyHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Engine &amp; Displacement</label>
                <input
                  type="text"
                  value={genForm.engine || ''}
                  onChange={(e) => setGenForm({ ...genForm, engine: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={genForm.imageUrl || ''}
                  onChange={(e) => setGenForm({ ...genForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-gray-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={genForm.description || ''}
                  onChange={(e) => setGenForm({ ...genForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsGeneratorModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold"
                >
                  Save Generator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit Rental Unit */}
      {isRentalUnitModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-200">
            <h3 className="text-xl font-bold text-[#0D0D0D] mb-4">
              {editingRentalUnit ? `Edit ${editingRentalUnit.name}` : 'Add Rental Unit'}
            </h3>

            <form onSubmit={handleSaveRentalUnit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Unit Name *</label>
                <input
                  type="text"
                  required
                  value={rentForm.name || ''}
                  onChange={(e) => setRentForm({ ...rentForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Capacity kVA</label>
                  <input
                    type="number"
                    value={rentForm.kva || ''}
                    onChange={(e) => setRentForm({ ...rentForm, kva: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Daily Rate (TND) *</label>
                  <input
                    type="number"
                    required
                    value={rentForm.dailyRateTnd || ''}
                    onChange={(e) => setRentForm({ ...rentForm, dailyRateTnd: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Weekly Rate (TND) *</label>
                  <input
                    type="number"
                    required
                    value={rentForm.weeklyRateTnd || ''}
                    onChange={(e) => setRentForm({ ...rentForm, weeklyRateTnd: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg font-bold text-amber-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Ideal Usage</label>
                <input
                  type="text"
                  value={rentForm.idealFor || ''}
                  onChange={(e) => setRentForm({ ...rentForm, idealFor: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={rentForm.description || ''}
                  onChange={(e) => setRentForm({ ...rentForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="avail"
                  checked={rentForm.available ?? true}
                  onChange={(e) => setRentForm({ ...rentForm, available: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded"
                />
                <label htmlFor="avail" className="font-semibold text-gray-800">
                  Unit available for immediate dispatch
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsRentalUnitModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold"
                >
                  Save Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL WITH EXPLICIT ITEM NAME */}
      {deleteConfirmation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-gray-900">
                Confirm Deletion
              </h3>
              <p className="text-xs text-gray-600">
                Are you sure you want to delete <strong>&quot;{deleteConfirmation.name}&quot;</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeletion}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
