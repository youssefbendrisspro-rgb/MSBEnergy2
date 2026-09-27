import { Generator, RentalUnit, PurchaseRequest, RentalRequest, SupportTicket } from '../types/volt';
import heroHomeImg from '../assets/images/volt_hero_home_1790543048628.jpg';
import genCompactImg from '../assets/images/gen_home_compact_1790543060063.jpg';
import genVillaImg from '../assets/images/gen_villa_silent_1790543069095.jpg';
import genEstateImg from '../assets/images/gen_estate_power_1790543079687.jpg';
import genRentalImg from '../assets/images/gen_rental_unit_1790543090833.jpg';

export const HERO_IMAGE_URL = heroHomeImg;

export const DEFAULT_GENERATORS: Generator[] = [
  {
    id: 'gen-volt-7d',
    name: 'VOLT HomeSilent 7D',
    category: 'Domestique Compact',
    kva: 7,
    kw: 5.6,
    engine: 'Diesel monocylindre 4 temps injection directe 498cc',
    fuel: 'Gasoil 50 / Diesel ordinaire',
    tankCapacityLiters: 15,
    consumptionLitersPerHour: 1.2,
    autonomyHours: 12.5,
    soundLevelDb: 62,
    dimensions: '940 x 540 x 720 mm',
    weightKg: 155,
    atsIncluded: true,
    voltage: '230V Monophasé',
    warrantyYears: 2,
    priceTnd: 7850,
    availability: 'En stock',
    description: 'Le groupe électrogène diesel silencieux idéal pour maison individuelle et duplex. Alimente éclairage complet, réfrigérateur, congélateur, téléviseurs, box internet et 1 climatiseur 12000 BTU.',
    features: [
      'Capotage ultra-silencieux insonorisé mousse haute densité (62 dB à 7m)',
      'Inverseur automatique ATS inclus (démarrage automatique en < 8s lors de coupure STEG)',
      'Démarreur électrique avec clé et batterie scellée sans entretien',
      'Régulateur de tension électronique AVR protégeant ordinateurs et électroménagers',
      'Châssis compact avec 4 roulettes pivotantes freinées pour déplacement aisé en cour ou garage'
    ],
    imageUrl: genCompactImg
  },
  {
    id: 'gen-volt-11d',
    name: 'VOLT HomeMaster 11D',
    category: 'Domestique Compact',
    kva: 11,
    kw: 8.8,
    engine: 'Diesel bi-cylindre en V refroidi par air 870cc',
    fuel: 'Gasoil 50 / Diesel ordinaire',
    tankCapacityLiters: 25,
    consumptionLitersPerHour: 1.8,
    autonomyHours: 14,
    soundLevelDb: 64,
    dimensions: '1080 x 650 x 840 mm',
    weightKg: 215,
    atsIncluded: true,
    voltage: '230V Monophasé',
    warrantyYears: 2,
    priceTnd: 12400,
    availability: 'En stock',
    description: 'Solution de secours robuste pour grandes maisons individuelles et rez-de-chaussée de villa. Maintient 2 climatiseurs, pompe de forage/piscine, réfrigérateurs et électroménagers sensibles.',
    features: [
      'Inverseur ATS automatique mural pré-câblé avec temporisateur de sécurité',
      'Tableau de bord digital LCD multifonction (Tension, Fréquence, Heures, Niveau huile)',
      'Système d\'arrêt automatique d\'urgence sur bas niveau d\'huile ou surchauffe',
      'Pré-chauffage moteur automatique pour démarrage hivernal instantané',
      'Prise extérieure 32A industrielle et 2 prises domestiques étanches IP44'
    ],
    imageUrl: genCompactImg
  },
  {
    id: 'gen-volt-15d',
    name: 'VOLT VillaPower 15D',
    category: 'Résidentiel Villa',
    kva: 15,
    kw: 12,
    engine: 'Diesel 3 cylindres en ligne refroidi par eau 1500 tr/min',
    fuel: 'Gasoil 50',
    tankCapacityLiters: 45,
    consumptionLitersPerHour: 2.4,
    autonomyHours: 18.5,
    soundLevelDb: 58,
    dimensions: '1450 x 780 x 980 mm',
    weightKg: 490,
    atsIncluded: true,
    voltage: '230V / 400V Triphasé',
    warrantyYears: 3,
    priceTnd: 18900,
    availability: 'En stock',
    description: 'Le choix référence pour les villas du Grand Tunis (La Marsa, Gammarth, Ennasr). Moteur basse rotation 1500 tr/min ultra-durable, inaudible depuis l\'intérieur de la maison.',
    features: [
      'Moteur diesel 1500 RPM à refroidissement liquide (très faible usure et endurance 24/7)',
      'Niveau sonore exceptionnel de seulement 58 dB(A) grâce au caisson acoustique double paroi',
      'Compatible installation extérieure jardin ou local technique aéré',
      'Inverseur de source triphasé ATS automatique avec chargeur d\'entretien flottant permanent',
      'Raccordement direct au tableau électrique principal de la villa avec protection différentielle'
    ],
    imageUrl: genVillaImg
  },
  {
    id: 'gen-volt-28d',
    name: 'VOLT EstateGuard 28D',
    category: 'Grand Domaine & Duplex',
    kva: 28,
    kw: 22.4,
    engine: 'Diesel 4 cylindres turbo refroidi par eau 1500 tr/min',
    fuel: 'Gasoil 50',
    tankCapacityLiters: 80,
    consumptionLitersPerHour: 3.8,
    autonomyHours: 21,
    soundLevelDb: 60,
    dimensions: '1850 x 860 x 1120 mm',
    weightKg: 780,
    atsIncluded: true,
    voltage: '230V / 400V Triphasé',
    warrantyYears: 3,
    priceTnd: 27500,
    availability: 'Sur commande (48h)',
    description: 'Groupe résidentiel haut de gamme pour grandes demeures, domaines privés, ascenseur privatif et climatisation intégrale centralisée VRV. Confort sans aucune interruption.',
    features: [
      'Garantit l\'alimentation intégrale d\'une grande propriété sans délestage partiel',
      'Régulateur électronique haute précision ±0.5% pour domotique et électronique de pointe',
      'Bac de rétention anti-pollution intégré pour une propreté absolue dans la cour',
      'Supervision connectée avec rapport d\'autonomie et compteur de cycles de coupures',
      'Capotage galvanisé et peinture époxy résistant aux embruns marins côtiers'
    ],
    imageUrl: genEstateImg
  }
];

export const DEFAULT_RENTAL_UNITS: RentalUnit[] = [
  {
    id: 'rent-volt-8d',
    name: 'VOLT Compact Rent 8D',
    kva: 8,
    dailyRateTnd: 95,
    weeklyRateTnd: 520,
    available: true,
    soundLevelDb: 63,
    fuelType: 'Diesel / Gasoil 50',
    idealFor: 'Maison individuelle, dépannage express coupure STEG, travaux domestiques',
    description: 'Groupe diesel monophasé monté sur roues avec capot insonorisé. Idéal pour sauver le contenu des congélateurs, alimenter le réseau de base et 1 climatiseur.',
    imageUrl: genCompactImg
  },
  {
    id: 'rent-volt-12d',
    name: 'VOLT MobileSilent 12D',
    kva: 12,
    dailyRateTnd: 145,
    weeklyRateTnd: 780,
    available: true,
    soundLevelDb: 61,
    fuelType: 'Diesel / Gasoil 50',
    idealFor: 'Villa, réception privée, événement familial, chantier résidentiel',
    description: 'Unité diesel tractable et maniable, très silencieuse. Fournie avec kit inverseur rapide et câbles de raccordement sécurisés 25 mètres.',
    imageUrl: genRentalImg
  },
  {
    id: 'rent-volt-20d',
    name: 'VOLT VillaPro Rent 20D',
    kva: 20,
    dailyRateTnd: 220,
    weeklyRateTnd: 1190,
    available: true,
    soundLevelDb: 59,
    fuelType: 'Diesel / Gasoil 50',
    idealFor: 'Grande villa triphasée, pompes de relevage, ascenseur domestique',
    description: 'Puissance triphasée complète de 20 kVA pour villa avec piscine et climatisation centrale. Raccordement et mise en service inclus par technicien VOLT.',
    imageUrl: genVillaImg
  }
];

export const DEFAULT_PURCHASE_REQUESTS: PurchaseRequest[] = [
  {
    id: 'VP-1743019200',
    generatorId: 'gen-volt-15d',
    generatorName: 'VOLT VillaPower 15D',
    generatorKva: 15,
    totalPriceTnd: 18900,
    clientName: 'Karim Ben Salem',
    clientPhone: '+216 98 421 890',
    clientEmail: 'karim.bensalem@gmail.com',
    city: 'La Marsa (Neffati)',
    habitationType: 'Villa',
    message: 'Coupures répétées de la STEG ces dernières semaines. Nous souhaitons une visite technique pour installer le groupe dans la cour arrière avec inverseur automatique.',
    createdAt: '2026-03-22T10:15:00.000Z',
    status: 'Contacté'
  },
  {
    id: 'VP-1743105600',
    generatorId: 'gen-volt-7d',
    generatorName: 'VOLT HomeSilent 7D',
    generatorKva: 7,
    totalPriceTnd: 7850,
    clientName: 'Sonia Trabelsi',
    clientPhone: '+216 22 554 112',
    clientEmail: 'sonia.trabelsi.tn@yahoo.fr',
    city: 'Ennasr 2',
    habitationType: 'Duplex',
    message: 'Besoin d\'un groupe compact pour alimenter notre étage et le système d\'alarme/caméras.',
    createdAt: '2026-03-24T14:30:00.000Z',
    status: 'En attente'
  }
];

export const DEFAULT_RENTAL_REQUESTS: RentalRequest[] = [
  {
    id: 'VR-1742932800',
    unitId: 'rent-volt-12d',
    unitName: 'VOLT MobileSilent 12D',
    unitKva: 12,
    startDate: '2026-04-02',
    endDate: '2026-04-09',
    durationDays: 7,
    totalPriceTnd: 780,
    includeAtsCable: true,
    includeFuelTank: true,
    clientName: 'Mehdi Chaabane',
    clientPhone: '+216 55 901 234',
    clientEmail: 'm.chaabane@topnet.tn',
    deliveryAddress: 'Avenue Habib Bourguiba, Carthage Dermech',
    notes: 'Réception familiale dans le jardin, besoin de discrétion sonore maximale.',
    createdAt: '2026-03-21T09:00:00.000Z',
    status: 'Confirmé'
  }
];

export const DEFAULT_TICKETS: SupportTicket[] = [
  {
    id: 'VOLT-2026-00101',
    clientName: 'Hedi Mansour',
    clientPhone: '+216 97 123 456',
    clientEmail: 'hedi.mansour@gmail.com',
    generatorModel: 'VOLT VillaPower 15D',
    address: 'Rue des Orangers, La Soukra',
    problemCategory: 'Inverseur ATS défaillant',
    description: 'Lors de la dernière coupure de secteur STEG hier soir à 21h, le groupe a démarré mais l\'inverseur automatique ATS n\'a pas basculé le contacteur de la villa. Nous avons dû basculer manuellement.',
    urgency: 'Urgent',
    status: 'En cours',
    technician: 'Firas Belhaj (Électromécanicien)',
    notes: [
      {
        id: 'n-1',
        author: 'Support VOLT',
        text: 'Appel client effectué. Diagnostic préliminaire : fusible de commande 12V de la bobine ATS possiblement sauté.',
        createdAt: '2026-03-26T08:30:00.000Z'
      },
      {
        id: 'n-2',
        author: 'Firas Belhaj',
        text: 'Intervention planifiée cet après-midi à 14h30 avec module ATS de rechange.',
        createdAt: '2026-03-26T09:10:00.000Z'
      }
    ],
    createdAt: '2026-03-25T21:40:00.000Z',
    updatedAt: '2026-03-26T09:10:00.000Z'
  },
  {
    id: 'VOLT-2026-00102',
    clientName: 'Ines Khemir',
    clientPhone: '+216 29 887 654',
    clientEmail: 'ines.khemir@outlook.com',
    generatorModel: 'VOLT HomeSilent 7D',
    address: 'Résidence Les Jasmins, Menzah 9',
    problemCategory: 'Entretien & Révision',
    description: 'Le groupe a franchi les 100 heures de fonctionnement après les pannes d\'été. Demande de vidange d\'huile moteur, remplacement du filtre à gasoil et contrôle de la batterie.',
    urgency: 'Normal',
    status: 'Assigné',
    technician: 'Nidhal Jlassi',
    notes: [
      {
        id: 'n-3',
        author: 'Support VOLT',
        text: 'Kit révision 100h préparé (Huile synthétique 15W40 + cartouche filtre). Rendez-vous convenu pour samedi matin.',
        createdAt: '2026-03-27T11:00:00.000Z'
      }
    ],
    createdAt: '2026-03-27T10:15:00.000Z',
    updatedAt: '2026-03-27T11:00:00.000Z'
  }
];

export const INITIAL_TICKET_COUNTER = 103;
