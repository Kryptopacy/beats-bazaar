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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-b from-[#141A23] via-[#0F141B] to-[#0A0D12] border border-white/[0.1] p-4 sm:p-10 shadow-2xl my-auto sm:my-8 max-h-[92vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent-green to-emerald-400 flex items-center justify-center shadow-lg shadow-accent-green/20 ring-1 ring-white/20">
              <Zap className="w-6 h-6 text-black font-black" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">
                {mode === 'license' ? `License: ${tier}` : `Tip ${beat.producer}`}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Secure payment processing</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-white rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Beat Details Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
          <div className="min-w-0 pr-4">
            <h4 className="text-sm font-bold text-white truncate">{beat.title}</h4>
            <p className="text-xs text-gray-400 mt-0.5">Prod. by {beat.producer} • {beat.genre}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Total Due</div>
            <div className="text-2xl font-black text-accent-green tracking-tight">${price}</div>
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
                  className={`py-2.5 rounded-full text-sm font-bold border transition-all active:scale-95 ${
                    tipAmount === amt
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-black border-amber-400 shadow-md font-black'
                      : 'bg-white/[0.03] border-white/[0.08] text-gray-300 hover:text-white hover:bg-white/[0.08]'
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
            <label className="block text-xs font-bold text-gray-300 mb-1.5">
              Licensee Legal Name / Stage Name *
            </label>
            <input
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="e.g. Burna / Rema / Independent Artist"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-white focus:border-accent-green focus:ring-4 focus:ring-accent-green/10 outline-none transition-all"
            />
            <p className="text-[11px] text-gray-500 mt-1">This name will be permanently stamped on your digital license certificate.</p>
          </div>
        )}

        {/* Payment Rails Selector (Fiat vs Crypto) */}
        <div className="mt-6">
          <label className="block text-xs font-bold text-gray-300 mb-2">Select Payment Method</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('fiat')}
              className={`p-4 rounded-2xl border text-left flex items-center space-x-3 transition-all active:scale-[0.98] ${
                paymentMethod === 'fiat'
                  ? 'bg-accent-green/10 border-accent-green text-white shadow-lg shadow-accent-green/10 ring-1 ring-accent-green/30'
                  : 'bg-white/[0.03] border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <CreditCard className="w-5 h-5 text-accent-green" />
              <div>
                <div className="text-xs font-bold text-white">Fiat (Card / MoMo)</div>
                <div className="text-[10px] text-gray-400">NGN, GHS, KES, USD</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('crypto')}
              className={`p-4 rounded-2xl border text-left flex items-center space-x-3 transition-all active:scale-[0.98] ${
                paymentMethod === 'crypto'
                  ? 'bg-amber-400/10 border-amber-400 text-white shadow-lg shadow-amber-400/10 ring-1 ring-amber-400/30'
                  : 'bg-white/[0.03] border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Coins className="w-5 h-5 text-accent-yellow" />
              <div>
                <div className="text-xs font-bold text-white">Crypto (Web3)</div>
                <div className="text-[10px] text-gray-400">USDT, USDC, BTC, ETH</div>
              </div>
            </button>
          </div>
        </div>

        {/* Security / Terms Notice */}
        <div className="mt-5 p-3.5 rounded-2xl bg-white/[0.02] text-[11px] text-gray-400 flex items-center space-x-2 border border-white/[0.06]">
          <ShieldCheck className="w-4 h-4 text-accent-green flex-shrink-0" />
          <span>Encrypted checkout. Direct instant payout to {beat.producer}&apos;s wallet.</span>
        </div>

        {/* Submit */}
        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-full border border-white/[0.08] text-sm font-bold text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handlePay}
            className="flex items-center space-x-2 px-8 py-3 rounded-full bg-gradient-to-r from-accent-green via-emerald-400 to-[#00E599] text-black text-sm font-black shadow-xl shadow-accent-green/25 hover:shadow-accent-green/40 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all ring-1 ring-white/20"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Payment...</span>
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
