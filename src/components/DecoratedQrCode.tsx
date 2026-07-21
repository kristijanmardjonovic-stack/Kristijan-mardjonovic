import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, Printer, Share2, Sparkles, QrCode } from 'lucide-react';
import { Language } from '../types';

interface DecoratedQrCodeProps {
  lang: Language;
}

export default function DecoratedQrCode({ lang }: DecoratedQrCodeProps) {
  const [copied, setCopied] = useState(false);

  const menuUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Translation helper
  const t = (key: string) => {
    const data: Record<string, Record<Language, string>> = {
      title: {
        en: 'Scan Digital Menu',
        sq: 'Skeno Menunë Digitale',
        sr: 'Skenirajte Digitalni Meni',
      },
      subtitle: {
        en: 'Point your camera to view instantly on your phone',
        sq: 'Drejtoni kamerën për ta parë menjëherë në celular',
        sr: 'Uperite kameru da biste odmah videli na telefonu',
      },
      share: {
        en: 'Share Menu Link',
        sq: 'Shpërndaj Linkun',
        sr: 'Podelite Link Menija',
      },
      copied: {
        en: 'Link Copied!',
        sq: 'Linku u Kopjua!',
        sr: 'Link je Kopiran!',
      },
      print: {
        en: 'Print QR Code',
        sq: 'Pronto QR Kodin',
        sr: 'Odštampajte QR Kod',
      },
      tableLabel: {
        en: 'Table Service',
        sq: 'Shërbim Tavoline',
        sr: 'Usluga za Stolom',
      }
    };
    return data[key]?.[lang] || '';
  };

  return (
    <div className="relative bg-bistro-dark border-2 border-bistro-gold/40 p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-sm mx-auto text-center overflow-hidden">
      {/* Decorative Ornaments in corners */}
      <div className="absolute top-2 left-2 text-bistro-gold/20 text-xl font-serif">✥</div>
      <div className="absolute top-2 right-2 text-bistro-gold/20 text-xl font-serif">✥</div>
      <div className="absolute bottom-2 left-2 text-bistro-gold/20 text-xl font-serif">✥</div>
      <div className="absolute bottom-2 right-2 text-bistro-gold/20 text-xl font-serif">✥</div>

      {/* Decorative Wreath Overlay background */}
      <div className="absolute -inset-10 opacity-5 pointer-events-none border-4 border-dashed border-bistro-gold rounded-full animate-spin-slow" />

      {/* Header */}
      <div className="mb-4 z-10">
        <span className="text-xxs uppercase tracking-widest text-bistro-gold font-bold flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-bistro-gold animate-pulse" />
          Caffee & Food
        </span>
        <h3 className="font-serif text-lg font-semibold text-bistro-cream mt-1">{t('title')}</h3>
        <p className="text-[11px] text-bistro-muted leading-tight max-w-xs mt-1">{t('subtitle')}</p>
      </div>

      {/* Premium Decorated QR Frame */}
      <div className="relative p-5 bg-white rounded-2xl border-4 border-bistro-gold/30 shadow-inner flex items-center justify-center mb-5 group">
        {/* Double Inner Thin Border */}
        <div className="absolute inset-1.5 border border-bistro-gold/15 rounded-xl pointer-events-none" />

        {/* Outer Corner Brackets */}
        <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-bistro-gold" />
        <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-bistro-gold" />
        <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-bistro-gold" />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-bistro-gold" />

        {/* QR Code SVG */}
        <svg
          className="w-40 h-40 text-bistro-dark group-hover:scale-102 transition-transform duration-500"
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          {/* Top Left Finder Pattern */}
          <path d="M 0 0 L 28 0 L 28 28 L 0 28 Z M 4 4 L 4 24 L 24 24 L 24 4 Z M 8 8 L 20 8 L 20 20 L 8 20 Z" />
          {/* Top Right Finder Pattern */}
          <path d="M 72 0 L 100 0 L 100 28 L 72 28 Z M 76 4 L 76 24 L 96 24 L 96 4 Z M 80 8 L 92 8 L 92 20 L 80 20 Z" />
          {/* Bottom Left Finder Pattern */}
          <path d="M 0 72 L 28 72 L 28 100 L 0 100 Z M 4 76 L 4 96 L 24 96 L 24 76 Z M 8 80 L 20 80 L 20 92 L 8 92 Z" />
          
          {/* Real looking randomized QR module patterns (Aesthetic & Dense) */}
          <rect x="36" y="0" width="4" height="4" />
          <rect x="44" y="0" width="8" height="4" />
          <rect x="56" y="0" width="4" height="8" />
          <rect x="64" y="4" width="4" height="4" />
          <rect x="36" y="8" width="8" height="4" />
          <rect x="48" y="8" width="4" height="12" />
          <rect x="60" y="8" width="8" height="4" />
          
          <rect x="32" y="16" width="4" height="4" />
          <rect x="40" y="16" width="4" height="4" />
          <rect x="56" y="16" width="12" height="4" />
          <rect x="36" y="24" width="12" height="4" />
          <rect x="52" y="24" width="4" height="4" />
          <rect x="64" y="24" width="8" height="4" />

          <rect x="0" y="32" width="4" height="8" />
          <rect x="8" y="36" width="8" height="4" />
          <rect x="20" y="32" width="4" height="12" />
          <rect x="28" y="36" width="12" height="4" />
          <rect x="44" y="32" width="4" height="4" />
          <rect x="52" y="36" width="8" height="8" />
          <rect x="64" y="32" width="12" height="4" />
          <rect x="80" y="32" width="4" height="8" />
          <rect x="88" y="36" width="12" height="4" />

          <rect x="4" y="44" width="4" height="4" />
          <rect x="12" y="48" width="8" height="4" />
          <rect x="24" y="44" width="4" height="8" />
          <rect x="32" y="48" width="12" height="4" />
          <rect x="48" y="44" width="4" height="4" />
          <rect x="60" y="48" width="4" height="8" />
          <rect x="68" y="44" width="8" height="4" />
          <rect x="80" y="48" width="8" height="4" />
          <rect x="92" y="44" width="4" height="8" />

          <rect x="0" y="56" width="12" height="4" />
          <rect x="16" y="56" width="4" height="4" />
          <rect x="28" y="56" width="8" height="8" />
          <rect x="40" y="56" width="4" height="4" />
          <rect x="48" y="60" width="12" height="4" />
          <rect x="64" y="56" width="4" height="4" />
          <rect x="72" y="60" width="12" height="4" />
          <rect x="88" y="56" width="8" height="4" />

          <rect x="36" y="68" width="4" height="8" />
          <rect x="44" y="72" width="8" height="4" />
          <rect x="56" y="68" width="4" height="4" />
          <rect x="64" y="72" width="8" height="8" />
          
          <rect x="32" y="80" width="8" height="4" />
          <rect x="48" y="80" width="4" height="12" />
          <rect x="56" y="84" width="12" height="4" />
          <rect x="36" y="92" width="12" height="4" />
          <rect x="52" y="88" width="4" height="8" />
          
          {/* Central Ornamented Emblem Logo Badge */}
          <rect x="40" y="40" width="20" height="20" fill="white" rx="4" />
          <rect x="42" y="42" width="16" height="16" fill="#D4AF37" rx="3" />
          <text
            x="50"
            y="53.5"
            fontSize="10"
            fontFamily="serif"
            fontWeight="bold"
            fill="#12161A"
            textAnchor="middle"
          >
            C&F
          </text>
        </svg>
      </div>

      {/* Table Suffix */}
      <div className="mb-6 flex items-center gap-1.5 px-3 py-1 bg-bistro-charcoal rounded-full border border-bistro-gold/20 text-xxs font-mono text-bistro-gold tracking-wider uppercase z-10">
        <span>🛎️</span>
        <span>{t('tableLabel')} #3</span>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3 w-full z-10">
        <button
          id="qr-copy-btn"
          onClick={handleCopy}
          className="flex items-center justify-center gap-1.5 text-xs py-2 px-3 bg-bistro-charcoal hover:bg-bistro-gold/10 border border-bistro-gold/20 hover:border-bistro-gold text-bistro-cream hover:text-bistro-gold rounded-xl transition-all font-semibold cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? t('copied') : t('share')}</span>
        </button>

        <button
          id="qr-print-btn"
          onClick={handlePrint}
          className="flex items-center justify-center gap-1.5 text-xs py-2 px-3 bg-bistro-gold hover:bg-bistro-gold-dark text-bistro-dark rounded-xl transition-all font-bold cursor-pointer shadow-md"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>{t('print')}</span>
        </button>
      </div>
    </div>
  );
}
