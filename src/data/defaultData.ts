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
    category: 'Compact Home',
    kva: 7,
    kw: 5.6,
    engine: '4-stroke direct injection single-cylinder diesel 498cc',
    fuel: 'Low-Sulfur Diesel (Gasoil 50)',
    tankCapacityLiters: 15,
    consumptionLitersPerHour: 1.2,
    autonomyHours: 12.5,
    soundLevelDb: 62,
    dimensions: '940 x 540 x 720 mm',
    weightKg: 155,
    atsIncluded: true,
    voltage: '230V Single-Phase',
    warrantyYears: 2,
    priceTnd: 7850,
    availability: 'In Stock',
    description: 'The premier silent residential diesel generator for single-family homes and duplexes. Powers complete lighting, refrigerator, deep freezer, TVs, internet routers, and a 12,000 BTU air conditioner.',
    features: [
      'Ultra-silent acoustic canopy with high-density sound dampening foam (62 dB @ 7m)',
      'Automatic Transfer Switch (ATS) included (seamless startup in < 8s during STEG power cuts)',
      'Electric key ignition starter with maintenance-free sealed battery',
      'AVR electronic voltage regulator safeguarding sensitive electronics and home appliances',
      'Compact rolling chassis with 4 heavy-duty braked swivel caster wheels for easy yard positioning'
    ],
    imageUrl: genCompactImg
  },
  {
    id: 'gen-volt-11d',
    name: 'VOLT HomeMaster 11D',
    category: 'Compact Home',
    kva: 11,
    kw: 8.8,
    engine: 'Air-cooled V-twin 4-stroke diesel 870cc',
    fuel: 'Low-Sulfur Diesel (Gasoil 50)',
    tankCapacityLiters: 25,
    consumptionLitersPerHour: 1.8,
    autonomyHours: 14,
    soundLevelDb: 64,
    dimensions: '1080 x 650 x 840 mm',
    weightKg: 215,
    atsIncluded: true,
    voltage: '230V Single-Phase',
    warrantyYears: 2,
    priceTnd: 12400,
    availability: 'In Stock',
    description: 'Heavy-duty backup solution for large single-family homes and villa ground floors. Powers up to 2 air conditioners, pool/borehole pump, refrigerators, and essential home circuits.',
    features: [
      'Pre-wired wall-mountable automatic ATS switchboard with built-in safety timer',
      'Digital LCD multi-function display (Voltage, Frequency, Running Hours, Oil Level)',
      'Automatic safety shutdown for low oil pressure or high engine temperature',
      'Instant glow plug preheating system for reliable winter cold starts',
      'One 32A industrial outdoor socket and two IP44 weather-resistant household outlets'
    ],
    imageUrl: genCompactImg
  },
  {
    id: 'gen-volt-15d',
    name: 'VOLT VillaPower 15D',
    category: 'Residential Villa',
    kva: 15,
    kw: 12,
    engine: 'Water-cooled inline 3-cylinder diesel 1500 RPM',
    fuel: 'Low-Sulfur Diesel (Gasoil 50)',
    tankCapacityLiters: 45,
    consumptionLitersPerHour: 2.4,
    autonomyHours: 18.5,
    soundLevelDb: 58,
    dimensions: '1450 x 780 x 980 mm',
    weightKg: 490,
    atsIncluded: true,
    voltage: '230V / 400V Three-Phase',
    warrantyYears: 3,
    priceTnd: 18900,
    availability: 'In Stock',
    description: 'The gold standard for villas across Greater Tunis (La Marsa, Gammarth, Ennasr). Low-speed 1500 RPM engine engineered for extreme durability, virtually inaudible from inside the house.',
    features: [
      '1500 RPM liquid-cooled diesel engine (minimal mechanical wear, rated for continuous 24/7 duty)',
      'Exceptional noise suppression at just 58 dB(A) via double-wall acoustic sound enclosure',
      'Engineered for outdoor garden installation or well-ventilated technical utility rooms',
      'Three-phase automatic ATS transfer switch with permanent battery trickle float charger',
      'Direct integration to your villa main electrical panel with dedicated differential protection'
    ],
    imageUrl: genVillaImg
  },
  {
    id: 'gen-volt-28d',
    name: 'VOLT EstateGuard 28D',
    category: 'Estate & Large Duplex',
    kva: 28,
    kw: 22.4,
    engine: 'Water-cooled 4-cylinder turbocharged diesel 1500 RPM',
    fuel: 'Low-Sulfur Diesel (Gasoil 50)',
    tankCapacityLiters: 80,
    consumptionLitersPerHour: 3.8,
    autonomyHours: 21,
    soundLevelDb: 60,
    dimensions: '1850 x 860 x 1120 mm',
    weightKg: 780,
    atsIncluded: true,
    voltage: '230V / 400V Three-Phase',
    warrantyYears: 3,
    priceTnd: 27500,
    availability: 'On Order (48h)',
    description: 'High-capacity residential power station for luxury estates, expansive properties, private elevators, and central VRV air conditioning. True whole-home continuous power.',
    features: [
      'Powers large luxury residences with zero load shedding or appliance compromise',
      'High-precision electronic AVR voltage regulation (±0.5%) for sensitive smart home automation',
      'Integrated anti-leak environmental containment basin protecting lawns and paved courtyards',
      'Smart digital monitoring module with fuel autonomy telemetry and outage history logging',
      'Galvanized steel enclosure and marine-grade anti-corrosion epoxy coating against coastal air'
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
    idealFor: 'Single-family homes, emergency outage backup, home renovations',
    description: 'Single-phase mobile diesel generator on wheels with soundproof canopy. Keeps freezers cold, powers lighting circuits, and runs 1 air conditioner.',
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
    idealFor: 'Villas, private outdoor gatherings, family events, residential sites',
    description: 'Towable and ultra-quiet mobile diesel unit. Supplied with rapid transfer switch kit and heavy-duty 25m protected power cabling.',
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
    idealFor: 'Large three-phase villas, drainage pumps, residential elevators',
    description: 'Full 20 kVA three-phase power for large villas with swimming pools and central HVAC. On-site setup and technical commissioning included.',
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
    message: 'Frequent STEG outages in our neighborhood. Requesting a site survey to install the unit in our backyard with automatic transfer switch.',
    createdAt: '2026-03-22T10:15:00.000Z',
    status: 'Contacted'
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
    message: 'Need a compact generator to maintain power on our upper floor, refrigerator, and security alarm/CCTV system.',
    createdAt: '2026-03-24T14:30:00.000Z',
    status: 'Pending'
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
    notes: 'Family gathering in the garden, requiring maximum acoustic discretion.',
    createdAt: '2026-03-21T09:00:00.000Z',
    status: 'Confirmed'
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
    problemCategory: 'ATS Transfer Switch Issue',
    description: 'During yesterday evening STEG power cut at 9 PM, the generator started automatically but the ATS contactor failed to transfer power to the villa panel. We had to switch manually.',
    urgency: 'High',
    status: 'In Progress',
    technician: 'Firas Belhaj (Electromechanical Specialist)',
    notes: [
      {
        id: 'n-1',
        author: 'VOLT Support',
        text: 'Customer contacted. Preliminary diagnosis: 12V control fuse on the ATS coil potentially tripped.',
        createdAt: '2026-03-26T08:30:00.000Z'
      },
      {
        id: 'n-2',
        author: 'Firas Belhaj',
        text: 'On-site service scheduled this afternoon at 2:30 PM with replacement ATS control module.',
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
    address: 'Les Jasmins Residence, Menzah 9',
    problemCategory: 'Maintenance & Service',
    description: 'The unit has reached 100 running hours after the summer outages. Requesting routine engine oil drain, fuel filter replacement, and battery load test.',
    urgency: 'Standard',
    status: 'Assigned',
    technician: 'Nidhal Jlassi',
    notes: [
      {
        id: 'n-3',
        author: 'VOLT Support',
        text: '100-hour service kit prepared (15W40 synthetic oil + fuel cartridge). Appointment confirmed for Saturday morning.',
        createdAt: '2026-03-27T11:00:00.000Z'
      }
    ],
    createdAt: '2026-03-27T10:15:00.000Z',
    updatedAt: '2026-03-27T11:00:00.000Z'
  }
];

export const INITIAL_TICKET_COUNTER = 103;
