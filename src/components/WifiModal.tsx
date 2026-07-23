import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, Copy, Check, QrCode, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Language } from '../types';

interface WifiModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  showToast: (msg: string, type?: 'info' | 'success') => void;
}

export default function WifiModal({ isOpen, onClose, lang, showToast }: WifiModalProps) {
  const [copied, setCopied] = useState(false);

  const wifiSSID = "Coffee&Food";
  const wifiPass = "coffee&food";
  // Standard Wi-Fi QR Code format recognized natively by iOS Camera and Android
  const wifiQrString = `WIFI:S:${wifiSSID};T:WPA;P:${wifiPass};;`;

  const copyPassword = () => {
    navigator.clipboard.writeText(wifiPass);
    setCopied(true);
    showToast(
      lang === 'sr'
        ? 'Šifra za Wi-Fi je kopirana!'
        : lang === 'sq'
        ? 'Fjalëkalimi i Wi-Fi u kopjua!'
        : 'Wi-Fi password copied to clipboard!',
      'success'
    );
    setTimeout(() => setCopied(false), 2500);
  };

  const labels = {
    title: {
      sr: 'Wi-Fi Internet za Goste',
      sq: 'Wi-Fi Internet për Musafirët',
      en: 'Guest Wi-Fi Internet',
    },
    subtitle: {
      sr: 'Skenirajte QR kod kamerom telefona za automatsko povezivanje ili kopirajte šifru',
      sq: 'Skanoni kodin QR me kamerën e telefonit për lidhje automatike ose kopjoni fjalëkalimin',
      en: 'Scan QR code with phone camera for auto-connect or copy the password',
    },
    networkLabel: {
      sr: 'Naziv mreže (SSID):',
      sq: 'Emri i rrjetit (SSID):',
      en: 'Network Name (SSID):',
    },
    passLabel: {
      sr: 'Šifra (Password):',
      sq: 'Fjalëkalimi:',
      en: 'Password:',
    },
    copyBtn: {
      sr: 'Kopiraj Šifru',
      sq: 'Kopjo Fjalëkalimin',
      en: 'Copy Password',
    },
    copiedBtn: {
      sr: 'Šifra Kopirana!',
      sq: 'Fjalëkalimi u Kopjua!',
      en: 'Password Copied!',
    },
    qrHint: {
      sr: 'Otvorite kameru na telefonu i usmerite je ka QR kodu iznad za brzu vezu bez kucanja!',
      sq: 'Hapni kamerën në telefon dhe drejtojeni te kodi QR për lidhje të shpejtë pa shkruar!',
      en: 'Open your phone camera and point at the QR code above for instant 1-tap connection!',
    },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div id="wifi-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-bistro-dark/75 backdrop-blur-sm"
        />

        {/* Modal Body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          className="relative z-10 w-full max-w-sm rounded-2xl bg-bistro-dark border border-bistro-gold/30 p-6 shadow-2xl text-bistro-cream overflow-hidden"
        >
          {/* Close button */}
          <button
            id="close-wifi-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-bistro-charcoal hover:bg-bistro-gold/20 text-bistro-cream hover:text-bistro-gold border border-bistro-gold/20 transition-colors cursor-pointer"
          >
            ✕
          </button>

          {/* Header Icon & Title */}
          <div className="text-center mb-5">
            <div className="w-12 h-12 rounded-full bg-emerald-900/50 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-2 shadow-lg">
              <Wifi className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" /> Coffee & Food Wi-Fi
            </span>
            <h3 className="font-serif text-xl font-bold text-bistro-gold mt-1">
              {labels.title[lang]}
            </h3>
            <p className="text-xs text-bistro-muted mt-1 max-w-xs mx-auto">
              {labels.subtitle[lang]}
            </p>
          </div>

          {/* Native Auto-Connect QR Code Frame */}
          <div className="bg-bistro-charcoal border border-bistro-gold/20 rounded-xl p-4 mb-5 text-center flex flex-col items-center">
            <div className="p-2 bg-white rounded-lg shadow-inner mb-2 border border-bistro-gold/20">
              <QRCodeSVG
                value={wifiQrString}
                size={160}
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="M"
              />
            </div>
            <p className="text-[11px] text-emerald-300 font-medium flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{labels.qrHint[lang]}</span>
            </p>
          </div>

          {/* Network Details & Copy Button */}
          <div className="space-y-3 bg-bistro-charcoal/60 border border-white/10 rounded-xl p-3.5 mb-2 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-bistro-muted font-medium">{labels.networkLabel[lang]}</span>
              <span className="font-bold text-white font-mono bg-white/10 px-2 py-0.5 rounded text-xs">
                {wifiSSID}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-bistro-muted font-medium flex items-center gap-1">
                <Lock className="w-3 h-3 text-bistro-gold" /> {labels.passLabel[lang]}
              </span>
              <span className="font-bold text-bistro-gold font-mono bg-bistro-gold/10 px-2 py-0.5 rounded text-xs tracking-wider">
                {wifiPass}
              </span>
            </div>
          </div>

          {/* One click Copy Button */}
          <motion.button
            id="wifi-copy-pass-btn"
            whileTap={{ scale: 0.95 }}
            onClick={copyPassword}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-bistro-gold hover:bg-amber-400 text-bistro-dark'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>{labels.copiedBtn[lang]}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{labels.copyBtn[lang]}</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
