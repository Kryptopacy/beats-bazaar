'use client';

import React, { useState } from 'react';
import { Beat, LicenseTier } from '@/types';
import { X, CreditCard, Coins, CheckCircle, ShieldCheck, Loader2, Zap, ArrowRight } from 'lucide-react';

interface BachsModalProps {
  isOpen: boolean;
  beat: Beat | null;
  mode: 'license' | 'tip';
  tier?: LicenseTier;
  onClose: () => void;
  onSuccess: (txRef: string, method: 'fiat' | 'crypto', amount: number) => void;
}

export function BachsModal({ 
  isOpen, 
  beat, 
  mode, 
  tier = 'Standard Lease', 
  onClose, 
  onSuccess 
}: BachsModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'fiat' | 'crypto'>('fiat');
  const [tipAmount, setTipAmount] = useState(5);
  const [artistName, setArtistName] = useState('Independent Artist');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !beat) return null;

  const price = mode === 'license' 
    ? (tier === 'Standard Lease' ? beat.leasePrice : beat.exclusivePrice)
    : tipAmount;

  const handlePay = () => {
    setIsProcessing(true);
    setErrorMsg('');

    // Simulate / execute the Bachs inline gateway
    setTimeout(() => {
      setIsProcessing(false);
      const txRef = `BACHS-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 8999 + 1000)}`;
      onSuccess(txRef, paymentMethod, price);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-surface border border-border p-6 sm:p-8 shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-green to-accent-gold flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5 text-black font-black" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-accent-yellow bg-accent-gold/10 px-2 py-0.5 rounded">
                  Bachs Inline Checkout
                </span>
              </div>
              <h3 className="text-xl font-black text-white mt-0.5">
                {mode === 'license' ? `License: ${tier}` : `Tip ${beat.producer}`}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-surface-light">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Beat Details Banner */}
        <div className="mt-5 p-4 rounded-2xl bg-[#090D10] border border-border flex items-center justify-between">
          <div className="min-w-0 pr-4">
            <h4 className="text-sm font-bold text-white truncate">{beat.title}</h4>
            <p className="text-xs text-gray-400">Prod. by {beat.producer} • {beat.genre}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-[11px] text-gray-400 uppercase font-semibold">Total Due</div>
            <div className="text-2xl font-black text-accent-green">${price}</div>
          </div>
        </div>

        {/* Tip selection if mode is tip */}
        {mode === 'tip' && (
          <div className="mt-5 space-y-2">
            <label className="block text-xs font-bold text-gray-300">Select Tip Amount ($)</label>
            <div className="grid grid-cols-4 gap-2">
              {[2, 5, 10, 25].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTipAmount(amt)}
                  className={`py-2 rounded-xl text-sm font-bold border transition-all ${
                    tipAmount === amt
                      ? 'bg-accent-gold text-black border-accent-gold shadow-md'
                      : 'bg-surface border-border text-gray-300 hover:text-white'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Buyer / Artist Name if licensing */}
        {mode === 'license' && (
          <div className="mt-5">
            <label className="block text-xs font-bold text-gray-300 mb-1">
              Licensee Legal Name / Stage Name *
            </label>
            <input
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="e.g. Burna / Rema / Independent Artist"
              className="w-full bg-[#0B0F12] border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:border-accent-green outline-none"
            />
            <p className="text-[11px] text-gray-500 mt-1">This name will be permanently stamped on your digital license certificate.</p>
          </div>
        )}

        {/* Payment Rails Selector (Fiat vs Crypto) */}
        <div className="mt-6">
          <label className="block text-xs font-bold text-gray-300 mb-2">Select Payment Rail (Bachs Dual Rail)</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('fiat')}
              className={`p-3.5 rounded-2xl border text-left flex items-center space-x-3 transition-all ${
                paymentMethod === 'fiat'
                  ? 'bg-accent-green/10 border-accent-green text-white shadow-md'
                  : 'bg-surface border-border text-gray-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-5 h-5 text-accent-green" />
              <div>
                <div className="text-xs font-bold">Fiat (Card / MoMo)</div>
                <div className="text-[10px] text-gray-400">NGN, GHS, KES, USD</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('crypto')}
              className={`p-3.5 rounded-2xl border text-left flex items-center space-x-3 transition-all ${
                paymentMethod === 'crypto'
                  ? 'bg-accent-gold/10 border-accent-gold text-white shadow-md'
                  : 'bg-surface border-border text-gray-400 hover:text-white'
              }`}
            >
              <Coins className="w-5 h-5 text-accent-yellow" />
              <div>
                <div className="text-xs font-bold">Crypto (Web3)</div>
                <div className="text-[10px] text-gray-400">USDT, USDC, BTC, ETH</div>
              </div>
            </button>
          </div>
        </div>

        {/* Security / Terms Notice */}
        <div className="mt-5 p-3 rounded-xl bg-[#090D10] text-[11px] text-gray-400 flex items-center space-x-2 border border-border">
          <ShieldCheck className="w-4 h-4 text-accent-green flex-shrink-0" />
          <span>Encrypted inline checkout. Direct instant payout to {beat.producer}&apos;s wallet.</span>
        </div>

        {/* Submit */}
        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-gray-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handlePay}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-green to-emerald-400 text-black text-sm font-black shadow-lg shadow-accent-green/20 hover:opacity-95 active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing via Bachs...</span>
              </>
            ) : (
              <>
                <span>Pay ${price}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
