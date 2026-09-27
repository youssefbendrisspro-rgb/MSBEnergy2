import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Truck,
  ShoppingCart,
  Wrench,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  MessageSquare,
  Search,
  Filter,
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
  const pendingPurchases = purchaseRequests.filter((p) => p.status === 'En attente').length;
  const availableRentals = rentalUnits.filter((u) => u.available).length;
  const openTickets = tickets.filter((t) => t.status === 'Ouvert' || t.status === 'En cours').length;

  // GENERATORS CRUD
  const handleOpenAddGenerator = () => {
    setEditingGenerator(null);
    setGenForm({
      name: '',
      category: 'Domestique Compact',
      kva: 10,
      kw: 8,
      engine: 'Diesel 4 temps',
      fuel: 'Gasoil 50',
      tankCapacityLiters: 20,
      consumptionLitersPerHour: 1.5,
      autonomyHours: 12,
      soundLevelDb: 62,
      dimensions: '950 x 550 x 750 mm',
      weightKg: 160,
      atsIncluded: true,
      voltage: '230V Monophasé',
      warrantyYears: 2,
      priceTnd: 9500,
      availability: 'En stock',
      description: '',
      features: ['Inverseur automatique ATS inclus', 'Capotage insonorisé'],
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
        category: genForm.category || 'Domestique Compact',
        kva: Number(genForm.kva) || 10,
        kw: Number(genForm.kw) || 8,
        engine: genForm.engine || 'Diesel',
        fuel: genForm.fuel || 'Gasoil 50',
        tankCapacityLiters: Number(genForm.tankCapacityLiters) || 15,
        consumptionLitersPerHour: Number(genForm.consumptionLitersPerHour) || 1.5,
        autonomyHours: Number(genForm.autonomyHours) || 10,
        soundLevelDb: Number(genForm.soundLevelDb) || 62,
        dimensions: genForm.dimensions || '1000 x 600 x 800 mm',
        weightKg: Number(genForm.weightKg) || 180,
        atsIncluded: genForm.atsIncluded ?? true,
        voltage: genForm.voltage || '230V Monophasé',
        warrantyYears: Number(genForm.warrantyYears) || 2,
        priceTnd: Number(genForm.priceTnd) || 10000,
        availability: genForm.availability || 'En stock',
        description: genForm.description || '',
        features: genForm.features || ['Inverseur ATS automatique'],
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
      fuelType: 'Diesel / Gasoil 50',
      idealFor: 'Villa, réception privée',
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
        fuelType: rentForm.fuelType || 'Diesel',
        idealFor: rentForm.idealFor || 'Maison individuelle',
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
            status: t.status === 'Ouvert' ? ('Assigné' as TicketStatus) : t.status,
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
          author: 'Admin VOLT',
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
    const matchStatus = ticketStatusFilter === 'all' || t.status === ticketStatusFilter;
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
              Console d&apos;Administration VOLT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D] mt-1">
            Gestion Opérationnelle Grand Tunis
          </h1>
        </div>

        <button
          onClick={onExitAdmin}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700 border border-gray-300 text-xs font-bold transition-colors w-fit"
        >
          <LogOut className="w-4 h-4" />
          <span>Fermer le mode Admin</span>
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
              Générateurs en Vente
            </span>
            <Package className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-[#0D0D0D]">{generators.length}</div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            {generators.filter((g) => g.availability === 'En stock').length} en stock immédiat
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
              Unités en Location
            </span>
            <Truck className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-[#0D0D0D]">{rentalUnits.length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            {availableRentals} prête(s) à livrer
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
              Demandes d&apos;Achat
            </span>
            <ShoppingCart className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-[#0D0D0D]">{purchaseRequests.length}</div>
          <span className="text-[11px] text-amber-700 font-bold mt-1 block">
            {pendingPurchases} en attente de contact
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
              Tickets Support
            </span>
            <Wrench className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-black text-[#0D0D0D]">{tickets.length}</div>
          <span className="text-[11px] text-red-600 font-bold mt-1 block">
            {openTickets} actif(s) / urgence
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
          Catalogue Vente ({generators.length})
        </button>

        <button
          onClick={() => setActiveTab('rental_units')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'rental_units'
              ? 'bg-[#0D0D0D] text-white shadow-sm'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          Parc de Location ({rentalUnits.length})
        </button>

        <button
          onClick={() => setActiveTab('purchases')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'purchases'
              ? 'bg-[#0D0D0D] text-white shadow-sm'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          Demandes d&apos;Achat ({purchaseRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('rentals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'rentals'
              ? 'bg-[#0D0D0D] text-white shadow-sm'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          Réservations Location ({rentalRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'tickets'
              ? 'bg-[#0D0D0D] text-white shadow-sm'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          Tickets Support ({tickets.length})
        </button>
      </div>

      {/* SECTION 1: GENERATORS CRUD */}
      {activeTab === 'generators' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#0D0D0D]">Gestion des Générateurs en Vente</h3>
              <p className="text-xs text-gray-500">Ajoutez, modifiez les tarifs ou supprimez des modèles.</p>
            </div>
            <button
              onClick={handleOpenAddGenerator}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Générateur</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Modèle &amp; Photo</th>
                  <th className="py-3 px-4">Catégorie</th>
                  <th className="py-3 px-4">Puissance</th>
                  <th className="py-3 px-4">Bruit</th>
                  <th className="py-3 px-4">Prix TTC</th>
                  <th className="py-3 px-4">Disponibilité</th>
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
                      {g.priceTnd.toLocaleString('fr-TN')} TND
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
                        title="Modifier"
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
                        title="Supprimer"
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
              <h3 className="text-lg font-bold text-[#0D0D0D]">Gestion des Unités de Location</h3>
              <p className="text-xs text-gray-500">Gérez le parc disponible pour livraison immédiate.</p>
            </div>
            <button
              onClick={handleOpenAddRental}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une Unité</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Unité &amp; Photo</th>
                  <th className="py-3 px-4">Puissance</th>
                  <th className="py-3 px-4">Tarif Jour</th>
                  <th className="py-3 px-4">Tarif Semaine</th>
                  <th className="py-3 px-4">État</th>
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
                        {u.available ? 'Disponible' : 'En location'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditRental(u)}
                        className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded"
                        title="Modifier"
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
                        title="Supprimer"
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
              <h3 className="text-lg font-bold text-[#0D0D0D]">Demandes d&apos;Achat Client</h3>
              <p className="text-xs text-gray-500">Traitement des prospects et programmation des visites techniques.</p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">Filtrer statut :</span>
              <select
                value={purchaseStatusFilter}
                onChange={(e) => setPurchaseStatusFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white"
              >
                <option value="all">Tous</option>
                <option value="En attente">En attente</option>
                <option value="Contacté">Contacté</option>
                <option value="Confirmé">Confirmé</option>
                <option value="Terminé">Terminé</option>
                <option value="Rejeté">Rejeté</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Réf &amp; Date</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Localisation &amp; Habitat</th>
                  <th className="py-3 px-4">Modèle Souhaité</th>
                  <th className="py-3 px-4">Message Client</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {purchaseRequests
                  .filter((p) => purchaseStatusFilter === 'all' || p.status === purchaseStatusFilter)
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-gray-900">{p.id}</div>
                        <div className="text-[10px] text-gray-400">
                          {new Date(p.createdAt).toLocaleDateString('fr-FR')}
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
                        <div className="text-amber-600 font-semibold">{p.totalPriceTnd.toLocaleString('fr-TN')} TND</div>
                      </td>
                      <td className="py-3 px-4 max-w-xs text-gray-600">
                        {p.message || <span className="text-gray-300 italic">Aucun message</span>}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={p.status}
                          onChange={(e) => handleUpdatePurchaseStatus(p.id, e.target.value as PurchaseStatus)}
                          className="px-2 py-1 border border-gray-200 rounded-md font-semibold text-xs bg-white"
                        >
                          <option value="En attente">En attente</option>
                          <option value="Contacté">Contacté</option>
                          <option value="Confirmé">Confirmé</option>
                          <option value="Terminé">Terminé</option>
                          <option value="Rejeté">Rejeté</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() =>
                            setDeleteConfirmation({
                              type: 'purchase',
                              id: p.id,
                              name: `Demande ${p.id} (${p.clientName})`
                            })
                          }
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Supprimer"
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
              <h3 className="text-lg font-bold text-[#0D0D0D]">Réservations de Location</h3>
              <p className="text-xs text-gray-500">Planification des livraisons et retraits par nos chauffeurs.</p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">Filtrer statut :</span>
              <select
                value={rentalStatusFilter}
                onChange={(e) => setRentalStatusFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white"
              >
                <option value="all">Tous</option>
                <option value="En attente">En attente</option>
                <option value="Confirmé">Confirmé</option>
                <option value="Actif">Actif (Sur site)</option>
                <option value="Terminé">Terminé</option>
                <option value="Rejeté">Rejeté</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Réf &amp; Période</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Adresse de livraison</th>
                  <th className="py-3 px-4">Unité &amp; Options</th>
                  <th className="py-3 px-4">Total TND</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rentalRequests
                  .filter((r) => rentalStatusFilter === 'all' || r.status === rentalStatusFilter)
                  .map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-gray-900">{r.id}</div>
                        <div className="text-[10px] text-gray-500">
                          {r.startDate} au {r.endDate} ({r.durationDays}j)
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
                          {r.includeAtsCable && '• Câble ATS '}
                          {r.includeFuelTank && '• Plein gasoil'}
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
                          <option value="En attente">En attente</option>
                          <option value="Confirmé">Confirmé</option>
                          <option value="Actif">Actif</option>
                          <option value="Terminé">Terminé</option>
                          <option value="Rejeté">Rejeté</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() =>
                            setDeleteConfirmation({
                              type: 'rental',
                              id: r.id,
                              name: `Location ${r.id} (${r.clientName})`
                            })
                          }
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Supprimer"
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
              <h3 className="text-lg font-bold text-[#0D0D0D]">Gestion des Tickets de Support</h3>
              <p className="text-xs text-gray-500">
                Assignation des techniciens, notes horodatées et suivi de résolution.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher ticket..."
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
                <option value="all">Tous statuts</option>
                <option value="Ouvert">Ouvert</option>
                <option value="Assigné">Assigné</option>
                <option value="En cours">En cours</option>
                <option value="Résolu">Résolu</option>
                <option value="Fermé">Fermé</option>
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
                              t.urgency === 'Urgence'
                                ? 'bg-red-100 text-red-800'
                                : t.urgency === 'Urgent'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {t.urgency}
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
                        <option value="Ouvert">Ouvert</option>
                        <option value="Assigné">Assigné</option>
                        <option value="En cours">En cours</option>
                        <option value="Résolu">Résolu</option>
                        <option value="Fermé">Fermé</option>
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
                        title="Supprimer"
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
                          <span className="text-gray-400 block">Téléphone :</span>
                          <a href={`tel:${t.clientPhone}`} className="font-semibold text-amber-700 hover:underline">
                            {t.clientPhone}
                          </a>
                        </div>
                        <div>
                          <span className="text-gray-400 block">Email :</span>
                          <span className="font-medium text-gray-800">{t.clientEmail}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block">Adresse :</span>
                          <span className="font-medium text-gray-800">{t.address}</span>
                        </div>
                      </div>

                      <div>
                        <div className="font-semibold text-gray-900 mb-1">
                          Catégorie : <span className="font-bold text-amber-700">{t.problemCategory}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 leading-relaxed">
                          {t.description}
                        </div>
                      </div>

                      {t.photoBase64 && (
                        <div>
                          <div className="font-semibold text-gray-900 mb-1 flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-gray-500" />
                            <span>Photo transmise par le client :</span>
                          </div>
                          <img
                            src={t.photoBase64}
                            alt="Photo incident"
                            className="max-h-56 rounded-xl border border-gray-200 shadow-sm"
                          />
                        </div>
                      )}

                      {/* Technician assignment */}
                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                        <label className="font-semibold text-gray-700 shrink-0">
                          Technicien d&apos;astreinte assigné :
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Firas Belhaj / Nidhal Jlassi"
                          value={t.technician || ''}
                          onChange={(e) => handleAssignTechnician(t.id, e.target.value)}
                          className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs max-w-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      {/* Notes journal */}
                      <div className="pt-3 border-t border-gray-200 space-y-3">
                        <div className="font-bold text-gray-900 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                          <span>Journal des interventions &amp; Notes d&apos;atelier</span>
                        </div>

                        {t.notes && t.notes.length > 0 ? (
                          <div className="space-y-2">
                            {t.notes.map((n) => (
                              <div key={n.id} className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs">
                                <div className="flex items-center justify-between text-[10px] text-gray-500 mb-0.5">
                                  <span className="font-bold text-amber-900">{n.author}</span>
                                  <span>{new Date(n.createdAt).toLocaleString('fr-FR')}</span>
                                </div>
                                <div className="text-gray-800">{n.text}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-400 italic">Aucune note enregistrée pour l&apos;instant.</div>
                        )}

                        {/* Add note input */}
                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Ajouter une note d'intervention (ex: diagnostic bobine effectué...)"
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
                            Ajouter
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
              {editingGenerator ? `Modifier ${editingGenerator.name}` : 'Ajouter un Nouveau Générateur Diesel'}
            </h3>

            <form onSubmit={handleSaveGenerator} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Nom du modèle *</label>
                  <input
                    type="text"
                    required
                    value={genForm.name || ''}
                    onChange={(e) => setGenForm({ ...genForm, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={genForm.category}
                    onChange={(e) => setGenForm({ ...genForm, category: e.target.value as Generator['category'] })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="Domestique Compact">Domestique Compact</option>
                    <option value="Résidentiel Villa">Résidentiel Villa</option>
                    <option value="Grand Domaine & Duplex">Grand Domaine &amp; Duplex</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Puissance kVA *</label>
                  <input
                    type="number"
                    required
                    value={genForm.kva || ''}
                    onChange={(e) => setGenForm({ ...genForm, kva: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Puissance kW</label>
                  <input
                    type="number"
                    step="0.1"
                    value={genForm.kw || ''}
                    onChange={(e) => setGenForm({ ...genForm, kw: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Prix TND (TTC) *</label>
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
                  <label className="block font-semibold text-gray-700 mb-1">Bruit dB(A) à 7m</label>
                  <input
                    type="number"
                    value={genForm.soundLevelDb || ''}
                    onChange={(e) => setGenForm({ ...genForm, soundLevelDb: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Conso L/h</label>
                  <input
                    type="number"
                    step="0.1"
                    value={genForm.consumptionLitersPerHour || ''}
                    onChange={(e) => setGenForm({ ...genForm, consumptionLitersPerHour: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Autonomie (h)</label>
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
                <label className="block font-semibold text-gray-700 mb-1">Motorisation &amp; Cylindrée</label>
                <input
                  type="text"
                  value={genForm.engine || ''}
                  onChange={(e) => setGenForm({ ...genForm, engine: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">URL de l&apos;image</label>
                <input
                  type="text"
                  value={genForm.imageUrl || ''}
                  onChange={(e) => setGenForm({ ...genForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-gray-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description commerciale</label>
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
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold"
                >
                  Sauvegarder
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
              {editingRentalUnit ? `Modifier ${editingRentalUnit.name}` : 'Ajouter une Unité de Location'}
            </h3>

            <form onSubmit={handleSaveRentalUnit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nom de l&apos;unité *</label>
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
                  <label className="block font-semibold text-gray-700 mb-1">Puissance kVA</label>
                  <input
                    type="number"
                    value={rentForm.kva || ''}
                    onChange={(e) => setRentForm({ ...rentForm, kva: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Tarif Jour (TND) *</label>
                  <input
                    type="number"
                    required
                    value={rentForm.dailyRateTnd || ''}
                    onChange={(e) => setRentForm({ ...rentForm, dailyRateTnd: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Tarif Semaine (TND) *</label>
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
                <label className="block font-semibold text-gray-700 mb-1">Usage Idéal</label>
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
                  Unité disponible immédiatement
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsRentalUnitModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:text-black"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold"
                >
                  Sauvegarder
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
                Confirmer la suppression
              </h3>
              <p className="text-xs text-gray-600">
                Supprimer <strong>&quot;{deleteConfirmation.name}&quot;</strong> ? Cette action est irréversible.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDeletion}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
