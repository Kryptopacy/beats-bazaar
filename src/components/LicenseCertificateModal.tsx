'use client';

import React from 'react';
import { LicenseCertificate } from '@/types';
import { Logo } from '@/components/Logo';
import { X, Download, Printer, ShieldCheck, Award, Sparkles, CheckCircle2 } from 'lucide-react';

interface LicenseCertificateModalProps {
  certificate: LicenseCertificate | null;
  audioDownloadUrl?: string;
  onClose: () => void;
}

export function LicenseCertificateModal({ 
  certificate, 
  audioDownloadUrl, 
  onClose 
}: LicenseCertificateModalProps) {
  if (!certificate) return null;

  const handleDownloadAudio = () => {
    if (!audioDownloadUrl) {
      alert('Generating audio file download...');
      return;
    }
    const a = document.createElement('a');
    a.href = audioDownloadUrl;
    a.download = `${certificate.beatTitle.replace(/\s+/g, '_')}_Master_Untagged.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-b from-[#141A23] via-[#0F141B] to-[#0A0D12] border border-amber-400/40 p-4 sm:p-10 shadow-2xl my-auto sm:my-8 max-h-[92vh] overflow-y-auto">
        
        {/* Certificate Watermark / Background Accent */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-accent-gold/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Controls */}
        <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent-gold to-yellow-500 flex items-center justify-center shadow-lg shadow-accent-gold/20 ring-1 ring-white/20">
              <Award className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Digital License Certificate</h2>
              <p className="text-xs text-gray-400 mt-0.5">Commercial synchronization rights agreement</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-white rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Document Card */}
        <div className="mt-6 p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-6 font-sans">
          
          {/* Brand Seal Header */}
          <div className="flex items-center justify-between border-b border-border/80 pb-4">
            <Logo size="sm" showWordmark={true} />
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">OFFICIAL SEAL</span>
              <p className="text-xs text-amber-400 font-bold">DIGITALLY NOTARIZED</p>
            </div>
          </div>

          {/* Certificate Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-4">
            <div>
              <span className="text-[11px] text-gray-500 font-mono">CERTIFICATE ID</span>
              <p className="text-sm font-mono font-bold text-accent-green">{certificate.certificateId}</p>
            </div>
            <div>
              <span className="text-[11px] text-gray-500 font-mono">TRANSACTION REF</span>
              <p className="text-xs font-mono text-gray-400">{certificate.transactionRef}</p>
            </div>
            <div>
              <span className="text-[11px] text-gray-500 font-mono">DATE ISSUED</span>
              <p className="text-xs text-gray-300 font-medium">
                {new Date(certificate.issuedAt).toLocaleDateString()} {new Date(certificate.issuedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Contracting Parties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-border/80 pb-4">
            <div className="p-3 rounded-xl bg-surface border border-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Licensor (Producer)</span>
              <p className="text-base font-extrabold text-white mt-0.5">{certificate.licensor}</p>
              <p className="text-xs text-gray-400">Beats Bazaar Verified Producer</p>
            </div>

            <div className="p-3 rounded-xl bg-surface border border-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Licensee (Artist / Buyer)</span>
              <p className="text-base font-extrabold text-accent-green mt-0.5">{certificate.licensee}</p>
              <p className="text-xs text-gray-400">Authorized Rights Holder</p>
            </div>
          </div>

          {/* Track Details & Tier */}
          <div className="p-4 rounded-xl bg-surface/60 border border-border flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent-gold">Licensed Beat</span>
              <h3 className="text-lg font-black text-white">{certificate.beatTitle}</h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">License Tier</span>
              <p className="text-sm font-extrabold text-white bg-accent-gold/20 text-accent-yellow px-3 py-1 rounded-lg border border-accent-gold/40">
                {certificate.tier}
              </p>
            </div>
          </div>

          {/* Legal Grant of Rights */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">Grant of Commercial Rights</h4>
            <ul className="space-y-1.5 text-xs text-gray-300">
              {certificate.terms.map((term, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-green flex-shrink-0 mt-0.5" />
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full border border-white/[0.08] text-sm font-bold text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save Certificate</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadAudio}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-accent-green via-emerald-400 to-[#00E599] text-black text-sm font-black shadow-xl shadow-accent-green/25 hover:shadow-accent-green/40 hover:scale-[1.02] active:scale-95 transition-all ring-1 ring-white/20"
          >
            <Download className="w-4 h-4" />
            <span>Download Untagged Master (.wav)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
