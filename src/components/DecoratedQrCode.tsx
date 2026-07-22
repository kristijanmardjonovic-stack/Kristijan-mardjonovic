import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, Printer, Share2, Sparkles, QrCode, Instagram, Globe } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Language } from '../types';

const menuQrUrl = new URL('../assets/images/user_menu_qr.svg', import.meta.url).href;

interface DecoratedQrCodeProps {
  lang: Language;
}

export default function DecoratedQrCode({ lang }: DecoratedQrCodeProps) {
  const [copied, setCopied] = useState(false);
  const [qrType, setQrType] = useState<'menu' | 'instagram'>('menu');

  const instagramUrl = "https://www.instagram.com/coffeeandfood.cafe?igsh=MWF6NXI4aGJ6N2ZzMg==";
  const menuUrl = typeof window !== 'undefined' ? window.location.href : 'https://coffeeandfood.com';

  const currentUrl = qrType === 'instagram' ? instagramUrl : menuUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
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
        en: 'Scan QR Code',
        sq: 'Skeno QR Kodin',
        sr: 'Skenirajte QR Kod',
      },
      subtitle: {
        en: 'Point your camera to scan instantly on your phone',
        sq: 'Drejtoni kamerën për ta skenuar menjëherë',
        sr: 'Uperite kameru telefona da biste odmah skenirali',
      },
      share: {
        en: 'Share Link',
        sq: 'Shpërndaj Linkun',
        sr: 'Podelite Link',
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
      instagramTab: {
        en: 'Instagram',
        sq: 'Instagram',
        sr: 'Instagram',
      },
      menuTab: {
        en: 'Digital Menu',
        sq: 'Menuja Digitale',
        sr: 'Digitalni Meni',
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
    <div className="relative bg-bistro-dark border-2 border-emerald-600/40 p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-sm mx-auto text-center overflow-hidden">
      {/* Decorative Ornaments in corners */}
      <div className="absolute top-2 left-2 text-emerald-500/30 text-xl font-serif">✥</div>
      <div className="absolute top-2 right-2 text-emerald-500/30 text-xl font-serif">✥</div>
      <div className="absolute bottom-2 left-2 text-emerald-500/30 text-xl font-serif">✥</div>
      <div className="absolute bottom-2 right-2 text-emerald-500/30 text-xl font-serif">✥</div>

      {/* Decorative Wreath Overlay background */}
      <div className="absolute -inset-10 opacity-5 pointer-events-none border-4 border-dashed border-emerald-500 rounded-full animate-spin-slow" />

      {/* Header */}
      <div className="mb-3 z-10">
        <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
          Coffee & Food
        </span>
        <h3 className="font-serif text-lg font-semibold text-bistro-cream mt-0.5">{t('title')}</h3>
        <p className="text-[11px] text-emerald-100/70 leading-tight max-w-xs mt-0.5">{t('subtitle')}</p>
      </div>

      {/* QR Code Mode Selector Tabs */}
      <div className="flex bg-bistro-charcoal border border-white/10 p-1 rounded-full mb-4 z-10 w-full max-w-[240px]">
        <button
          onClick={() => setQrType('menu')}
          className={`flex-1 py-1 px-2 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            qrType === 'menu'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{t('menuTab')}</span>
        </button>
        <button
          onClick={() => setQrType('instagram')}
          className={`flex-1 py-1 px-2 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            qrType === 'instagram'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <Instagram className="w-3.5 h-3.5" />
          <span>{t('instagramTab')}</span>
        </button>
      </div>

      {/* Premium Decorated QR Frame */}
      <div className="relative p-4 bg-white rounded-2xl border-4 border-emerald-600/30 shadow-2xl flex items-center justify-center mb-4 group">
        {/* Double Inner Thin Border */}
        <div className="absolute inset-1.5 border border-emerald-800/15 rounded-xl pointer-events-none" />

        {/* Outer Corner Brackets */}
        <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-emerald-600" />
        <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-emerald-600" />
        <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-emerald-600" />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-emerald-600" />

        {/* Real Dynamic Scannable QR Code */}
        <div className="p-1 bg-white rounded-lg flex items-center justify-center">
          {qrType === 'menu' ? (
            <img
              src={menuQrUrl}
              alt="Coffee & Food Digital Menu QR Code"
              className="w-[160px] h-[160px] object-contain rounded"
            />
          ) : (
            <QRCodeSVG
              value={currentUrl}
              size={160}
              bgColor="#FFFFFF"
              fgColor="#000000"
              level="H"
              marginSize={1}
            />
          )}
        </div>
      </div>

      {/* Table / Instagram Badge */}
      <div className="mb-5 flex items-center gap-1.5 px-3 py-1 bg-bistro-charcoal rounded-full border border-white/10 text-[11px] text-emerald-300 font-medium tracking-wide z-10">
        {qrType === 'instagram' ? (
          <>
            <Instagram className="w-3.5 h-3.5 text-pink-400" />
            <span>@coffeeandfood.cafe</span>
          </>
        ) : (
          <>
            <span>🛎️</span>
            <span>{t('tableLabel')} #3</span>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 w-full z-10">
        <button
          id="qr-copy-btn"
          onClick={handleCopy}
          className="flex items-center justify-center gap-1.5 text-xs py-2.5 px-3 bg-bistro-charcoal hover:bg-emerald-950/60 border border-white/10 hover:border-emerald-500 text-white rounded-xl transition-all font-semibold cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? t('copied') : t('share')}</span>
        </button>

        <button
          id="qr-print-btn"
          onClick={handlePrint}
          className="flex items-center justify-center gap-1.5 text-xs py-2.5 px-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl transition-all font-bold cursor-pointer shadow-md"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>{t('print')}</span>
        </button>
      </div>
    </div>
  );
}
