export type HabitationType =
  | 'Villa'
  | 'Detached House'
  | 'Duplex'
  | 'Small Business'
  | 'Other'
  | 'Maison individuelle'
  | 'Petit commerce'
  | 'Autre';

export type GeneratorAvailability =
  | 'In Stock'
  | 'On Order (48h)'
  | 'Temporarily Out of Stock'
  | 'En stock'
  | 'Sur commande (48h)'
  | 'Rupture temporaire';

export interface Generator {
  id: string;
  name: string;
  category:
    | 'Compact Home'
    | 'Residential Villa'
    | 'Estate & Large Duplex'
    | 'Domestique Compact'
    | 'Résidentiel Villa'
    | 'Grand Domaine & Duplex';
  kva: number;
  kw: number;
  engine: string;
  fuel: string;
  tankCapacityLiters: number;
  consumptionLitersPerHour: number;
  autonomyHours: number;
  soundLevelDb: number; // e.g. 62 dB(A) @ 7m
  dimensions: string; // e.g. 960 x 560 x 780 mm
  weightKg: number;
  atsIncluded: boolean; // Automatic Transfer Switch (ATS)
  voltage:
    | '230V Single-Phase'
    | '230V / 400V Three-Phase'
    | '230V Monophasé'
    | '230V / 400V Triphasé';
  warrantyYears: number;
  priceTnd: number;
  availability: GeneratorAvailability;
  description: string;
  features: string[];
  imageUrl: string;
}

export interface RentalUnit {
  id: string;
  name: string;
  kva: number;
  dailyRateTnd: number;
  weeklyRateTnd: number;
  available: boolean;
  soundLevelDb: number;
  fuelType: string;
  idealFor: string;
  description: string;
  imageUrl: string;
}

export type PurchaseStatus =
  | 'Pending'
  | 'Contacted'
  | 'Confirmed'
  | 'Completed'
  | 'Rejected'
  | 'En attente'
  | 'Contacté'
  | 'Confirmé'
  | 'Terminé'
  | 'Rejeté';

export interface PurchaseRequest {
  id: string; // VP-[timestamp]
  generatorId: string;
  generatorName: string;
  generatorKva: number;
  totalPriceTnd: number;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  city: string; // e.g. La Marsa, Carthage, Ariana, etc.
  habitationType: HabitationType;
  message?: string;
  createdAt: string;
  status: PurchaseStatus;
}

export type RentalStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Active'
  | 'Completed'
  | 'Rejected'
  | 'En attente'
  | 'Confirmé'
  | 'Actif'
  | 'Terminé'
  | 'Rejeté';

export interface RentalRequest {
  id: string; // VR-[timestamp]
  unitId: string;
  unitName: string;
  unitKva: number;
  startDate: string;
  endDate: string;
  durationDays: number;
  totalPriceTnd: number;
  includeAtsCable: boolean;
  includeFuelTank: boolean;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  deliveryAddress: string;
  notes?: string;
  createdAt: string;
  status: RentalStatus;
}

export type TicketUrgency =
  | 'Standard'
  | 'High'
  | 'Emergency'
  | 'Normal'
  | 'Urgent'
  | 'Urgence';

export type TicketStatus =
  | 'Open'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Closed'
  | 'Ouvert'
  | 'Assigné'
  | 'En cours'
  | 'Résolu'
  | 'Fermé';

export interface TicketNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string; // VOLT-2026-XXXXX
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  generatorModel: string;
  address: string;
  problemCategory:
    | 'Starting Failure'
    | 'ATS Transfer Switch Issue'
    | 'Fuel or Oil Leak'
    | 'Overheating / Alarm'
    | 'Abnormal Noise'
    | 'Maintenance & Service'
    | 'Other'
    | 'Panne de démarrage'
    | 'Inverseur ATS défaillant'
    | 'Fuite carburant ou huile'
    | 'Surchauffe / Alarme'
    | 'Bruit anormal'
    | 'Entretien & Révision'
    | 'Autre';
  description: string;
  urgency: TicketUrgency;
  photoBase64?: string;
  status: TicketStatus;
  technician?: string;
  notes: TicketNote[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  salesCount: number;
  availableRentalsCount: number;
  pendingPurchasesCount: number;
  openTicketsCount: number;
}
