/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Generator,
  RentalUnit,
  PurchaseRequest,
  RentalRequest,
  SupportTicket
} from './types/volt';
import { StorageService } from './utils/storage';
import { Navbar, NavTab } from './components/Navbar';
import { HomeSection } from './components/HomeSection';
import { SalesSection } from './components/SalesSection';
import { RentalSection } from './components/RentalSection';
import { SupportSection } from './components/SupportSection';
import { AdminSection } from './components/AdminSection';
import { AdminPinModal } from './components/AdminPinModal';
import { Footer } from './components/Footer';

export default function App() {
  // State from Storage with robust fallback
  const [generators, setGenerators] = useState<Generator[]>(() =>
    StorageService.getGenerators()
  );
  const [rentalUnits, setRentalUnits] = useState<RentalUnit[]>(() =>
    StorageService.getRentalUnits()
  );
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>(() =>
    StorageService.getPurchaseRequests()
  );
  const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>(() =>
    StorageService.getRentalRequests()
  );
  const [tickets, setTickets] = useState<SupportTicket[]>(() =>
    StorageService.getSupportTickets()
  );

  // Navigation & Admin State
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [isAdmin, setIsAdmin] = useState<boolean>(() =>
    StorageService.isAdminAuthenticated()
  );
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);

  // Modal interaction states across sections
  const [selectedGenForDetails, setSelectedGenForDetails] = useState<Generator | null>(null);
  const [selectedGenForPurchase, setSelectedGenForPurchase] = useState<Generator | null>(null);

  // Synchronize state changes to Storage
  const handleUpdateGenerators = (newGenerators: Generator[]) => {
    setGenerators(newGenerators);
    StorageService.saveGenerators(newGenerators);
  };

  const handleUpdateRentalUnits = (newUnits: RentalUnit[]) => {
    setRentalUnits(newUnits);
    StorageService.saveRentalUnits(newUnits);
  };

  const handleUpdatePurchaseRequests = (newRequests: PurchaseRequest[]) => {
    setPurchaseRequests(newRequests);
    StorageService.savePurchaseRequests(newRequests);
  };

  const handleUpdateRentalRequests = (newRequests: RentalRequest[]) => {
    setRentalRequests(newRequests);
    StorageService.saveRentalRequests(newRequests);
  };

  const handleUpdateTickets = (newTickets: SupportTicket[]) => {
    setTickets(newTickets);
    StorageService.saveSupportTickets(newTickets);
  };

  // Handlers for public interactions
  const handlePurchaseSuccess = (request: PurchaseRequest) => {
    setPurchaseRequests((prev) => [request, ...prev]);
  };

  const handleRentalSuccess = (request: RentalRequest) => {
    setRentalRequests((prev) => [request, ...prev]);
  };

  const handleTicketCreated = (ticket: SupportTicket) => {
    setTickets((prev) => [ticket, ...prev]);
  };

  // Open Details Modal & Switch to Sales if needed
  const handleOpenDetails = (gen: Generator) => {
    setSelectedGenForDetails(gen);
    if (currentTab !== 'sales') {
      setCurrentTab('sales');
    }
  };

  // Open Purchase Modal & Switch to Sales if needed
  const handleOpenPurchase = (gen: Generator) => {
    setSelectedGenForPurchase(gen);
    if (currentTab !== 'sales') {
      setCurrentTab('sales');
    }
  };

  // Admin login / logout
  const handleAdminSuccess = () => {
    setIsAdmin(true);
    StorageService.setAdminAuthenticated(true);
  };

  const handleExitAdmin = () => {
    setIsAdmin(false);
    StorageService.setAdminAuthenticated(false);
  };

  // Keyboard shortcut ESC to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedGenForDetails(null);
        setSelectedGenForPurchase(null);
        setIsAdminPinModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#0D0D0D] font-sans">
      {/* Top sticky Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (isAdmin) {
            // keep admin available but show public tab if clicked
          }
        }}
        isAdmin={isAdmin}
        onOpenAdminModal={() => setIsAdminPinModalOpen(true)}
        onExitAdmin={handleExitAdmin}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {isAdmin ? (
          <AdminSection
            generators={generators}
            rentalUnits={rentalUnits}
            purchaseRequests={purchaseRequests}
            rentalRequests={rentalRequests}
            tickets={tickets}
            onUpdateGenerators={handleUpdateGenerators}
            onUpdateRentalUnits={handleUpdateRentalUnits}
            onUpdatePurchaseRequests={handleUpdatePurchaseRequests}
            onUpdateRentalRequests={handleUpdateRentalRequests}
            onUpdateTickets={handleUpdateTickets}
            onExitAdmin={handleExitAdmin}
          />
        ) : (
          <>
            {currentTab === 'home' && (
              <HomeSection
                generators={generators}
                onSelectTab={setCurrentTab}
                onOpenDetails={handleOpenDetails}
                onOpenPurchase={handleOpenPurchase}
              />
            )}

            {currentTab === 'sales' && (
              <SalesSection
                generators={generators}
                selectedGeneratorForDetails={selectedGenForDetails}
                selectedGeneratorForPurchase={selectedGenForPurchase}
                onOpenDetails={handleOpenDetails}
                onCloseDetails={() => setSelectedGenForDetails(null)}
                onOpenPurchase={handleOpenPurchase}
                onClosePurchase={() => setSelectedGenForPurchase(null)}
                onPurchaseSuccess={handlePurchaseSuccess}
              />
            )}

            {currentTab === 'rental' && (
              <RentalSection
                rentalUnits={rentalUnits}
                onRentalSuccess={handleRentalSuccess}
              />
            )}

            {currentTab === 'support' && (
              <SupportSection
                tickets={tickets}
                onTicketCreated={handleTicketCreated}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={(tab) => {
          if (isAdmin) setIsAdmin(false);
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => setIsAdminPinModalOpen(true)}
        isAdmin={isAdmin}
      />

      {/* Admin PIN Authentication Modal */}
      <AdminPinModal
        isOpen={isAdminPinModalOpen}
        onClose={() => setIsAdminPinModalOpen(false)}
        onSuccess={handleAdminSuccess}
      />
    </div>
  );
}
