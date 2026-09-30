import {
  Generator,
  RentalUnit,
  PurchaseRequest,
  RentalRequest,
  SupportTicket
} from '../types/volt';
import {
  DEFAULT_GENERATORS,
  DEFAULT_RENTAL_UNITS,
  DEFAULT_PURCHASE_REQUESTS,
  DEFAULT_RENTAL_REQUESTS,
  DEFAULT_TICKETS,
  INITIAL_TICKET_COUNTER
} from '../data/defaultData';

export const STORAGE_KEYS = {
  GENERATORS: 'volt_generators',
  RENTAL_UNITS: 'volt_rental_units',
  PURCHASE_REQUESTS: 'volt_purchase_requests',
  RENTAL_REQUESTS: 'volt_rental_requests',
  SUPPORT_TICKETS: 'volt_support_tickets',
  TICKET_COUNTER: 'volt_ticket_counter',
  ADMIN_AUTH: 'volt_admin_logged_in'
} as const;

export class StorageQuotaError extends Error {
  constructor(message = 'Local storage space is full.') {
    super(message);
    this.name = 'StorageQuotaError';
  }
}

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Error reading ${key}, using default data.`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): boolean {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (err: unknown) {
    console.error(`Error writing to localStorage for key ${key}:`, err);
    // Detect quota exceeded error
    const isQuota =
      err instanceof DOMException &&
      (err.code === 22 ||
        err.code === 1014 ||
        err.name === 'QuotaExceededError' ||
        err.name === 'NS_ERROR_DOM_QUOTA_REACHED');
    if (isQuota) {
      throw new StorageQuotaError(
        'Browser local storage is full. Please reduce the size of attached photos or clear previous tickets.'
      );
    }
    throw err;
  }
}

export const StorageService = {
  getGenerators(): Generator[] {
    return safeGet<Generator[]>(STORAGE_KEYS.GENERATORS, DEFAULT_GENERATORS);
  },

  saveGenerators(generators: Generator[]): boolean {
    return safeSet(STORAGE_KEYS.GENERATORS, generators);
  },

  getRentalUnits(): RentalUnit[] {
    return safeGet<RentalUnit[]>(STORAGE_KEYS.RENTAL_UNITS, DEFAULT_RENTAL_UNITS);
  },

  saveRentalUnits(units: RentalUnit[]): boolean {
    return safeSet(STORAGE_KEYS.RENTAL_UNITS, units);
  },

  getPurchaseRequests(): PurchaseRequest[] {
    return safeGet<PurchaseRequest[]>(STORAGE_KEYS.PURCHASE_REQUESTS, DEFAULT_PURCHASE_REQUESTS);
  },

  savePurchaseRequests(requests: PurchaseRequest[]): boolean {
    return safeSet(STORAGE_KEYS.PURCHASE_REQUESTS, requests);
  },

  getRentalRequests(): RentalRequest[] {
    return safeGet<RentalRequest[]>(STORAGE_KEYS.RENTAL_REQUESTS, DEFAULT_RENTAL_REQUESTS);
  },

  saveRentalRequests(requests: RentalRequest[]): boolean {
    return safeSet(STORAGE_KEYS.RENTAL_REQUESTS, requests);
  },

  getSupportTickets(): SupportTicket[] {
    return safeGet<SupportTicket[]>(STORAGE_KEYS.SUPPORT_TICKETS, DEFAULT_TICKETS);
  },

  saveSupportTickets(tickets: SupportTicket[]): boolean {
    return safeSet(STORAGE_KEYS.SUPPORT_TICKETS, tickets);
  },

  getNextTicketId(): string {
    let currentCounter = safeGet<number>(STORAGE_KEYS.TICKET_COUNTER, INITIAL_TICKET_COUNTER);
    if (typeof currentCounter !== 'number' || isNaN(currentCounter)) {
      currentCounter = INITIAL_TICKET_COUNTER;
    }
    const nextNumber = currentCounter + 1;
    safeSet(STORAGE_KEYS.TICKET_COUNTER, nextNumber);
    const padded = String(nextNumber).padStart(5, '0');
    return `VOLT-2026-${padded}`;
  },

  isAdminAuthenticated(): boolean {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  },

  setAdminAuthenticated(auth: boolean): void {
    try {
      if (auth) {
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      } else {
        sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      }
    } catch (err) {
      console.warn('Session storage error:', err);
    }
  }
};
