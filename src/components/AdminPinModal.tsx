import React, { useState, useEffect, useRef } from 'react';
import { Lock, X, AlertCircle } from 'lucide-react';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') {
      onSuccess();
      onClose();
    } else {
      setError(true);
      setPin('');
      inputRef.current?.focus();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-black rounded-lg"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6" />
        </div>

        <div className="text-center space-y-1 mb-6">
          <h3 className="text-xl font-bold text-[#0D0D0D]">Accès Espace Administrateur</h3>
          <p className="text-xs text-gray-500">
            Saisissez votre code PIN pour gérer le catalogue et les tickets.
          </p>
          <div className="mt-2 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 py-1 px-2.5 rounded-lg inline-block">
            Code démo : <strong>1234</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              ref={inputRef}
              type="password"
              maxLength={8}
              placeholder="PIN à 4 chiffres"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              className={`w-full text-center tracking-widest text-2xl font-mono py-2.5 px-4 border rounded-xl focus:outline-none focus:ring-2 ${
                error
                  ? 'border-red-500 bg-red-50/50 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-amber-500'
              }`}
            />
            {error && (
              <div className="flex items-center justify-center gap-1.5 text-red-600 text-xs font-semibold mt-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>PIN incorrect. Veuillez réessayer.</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              Déverrouiller
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
