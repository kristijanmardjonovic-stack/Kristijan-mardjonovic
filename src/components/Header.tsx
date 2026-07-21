import { Globe, Clock, MapPin, Phone, ShoppingBag, Heart, QrCode } from 'lucide-react';
import { DICTIONARY } from '../data';
import { Language } from '../types';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  favoritesCount: number;
  scrollToReviews: () => void;
  scrollToMeze: () => void;
  onOpenQrCode: () => void;
}

export default function Header({
  lang,
  setLang,
  favoritesCount,
  scrollToReviews,
  scrollToMeze,
  onOpenQrCode,
}: HeaderProps) {
  return (
    <header id="restaurant-header" className="relative bg-bistro-dark text-bistro-cream border-b border-bistro-gold/20 overflow-hidden">
      {/* Background overlay with subtle opacity */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay scale-105 pointer-events-none"
        style={{ backgroundImage: `url('/src/assets/images/restaurant_hero_banner_1784588858619.jpg')` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-6 sm:py-10">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-bistro-cream/10 pb-4 mb-6">
          {/* Brand Info */}
          <div className="text-center sm:text-left">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-wide font-semibold text-bistro-gold">
              {DICTIONARY.restaurantName[lang]}
            </h1>
            <p className="text-sm font-sans tracking-widest text-bistro-muted uppercase mt-1">
              {DICTIONARY.tagline[lang]}
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Language Selection */}
            <div className="flex bg-bistro-charcoal border border-bistro-gold/20 rounded-full p-1 shadow-inner">
              <button
                id="lang-sr"
                onClick={() => setLang('sr')}
                className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider transition-all uppercase duration-300 ${
                  lang === 'sr'
                    ? 'bg-bistro-gold text-bistro-dark font-bold shadow-sm'
                    : 'text-bistro-cream hover:text-bistro-gold'
                }`}
                title="Crnogorski / Srpski"
              >
                🇲🇪 SR
              </button>
              <button
                id="lang-sq"
                onClick={() => setLang('sq')}
                className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider transition-all uppercase duration-300 ${
                  lang === 'sq'
                    ? 'bg-bistro-gold text-bistro-dark font-bold shadow-sm'
                    : 'text-bistro-cream hover:text-bistro-gold'
                }`}
                title="Shqip"
              >
                🇦🇱 SQ
              </button>
              <button
                id="lang-en"
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider transition-all uppercase duration-300 ${
                  lang === 'en'
                    ? 'bg-bistro-gold text-bistro-dark font-bold shadow-sm'
                    : 'text-bistro-cream hover:text-bistro-gold'
                }`}
                title="English"
              >
                🇬🇧 EN
              </button>
            </div>

            {/* QR Code Trigger */}
            <button
              id="qr-code-trigger-btn"
              onClick={onOpenQrCode}
              className="p-2 bg-bistro-charcoal hover:bg-bistro-gold/15 border border-bistro-gold/20 rounded-full transition-all text-bistro-gold cursor-pointer"
              title="Meni QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* Quick scrolls */}
            <button
              id="scroll-to-meze"
              onClick={scrollToMeze}
              className="text-xs px-3 py-2 bg-bistro-charcoal hover:bg-bistro-gold/10 border border-bistro-gold/20 rounded-full transition-all text-bistro-gold cursor-pointer"
            >
              🛠️ {DICTIONARY.customMeze[lang]}
            </button>

            <button
              id="scroll-to-reviews"
              onClick={scrollToReviews}
              className="text-xs px-3 py-2 bg-bistro-charcoal hover:bg-bistro-gold/10 border border-bistro-gold/20 rounded-full transition-all text-bistro-gold cursor-pointer"
            >
              ⭐ {DICTIONARY.guestReviews[lang]}
            </button>

            {/* Favorites Badge */}
            {favoritesCount > 0 && (
              <div className="flex items-center gap-1 bg-red-950/40 border border-red-500/30 px-2.5 py-1.5 rounded-full text-xs text-red-400">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span className="font-bold">{favoritesCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Restaurant Metadata Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-bistro-muted font-sans">
          <div className="flex items-center justify-center md:justify-start gap-2.5 bg-bistro-charcoal/40 p-3 rounded-lg border border-bistro-cream/5">
            <MapPin className="w-4 h-4 text-bistro-gold shrink-0" />
            <div>
              <p className="font-medium text-bistro-cream">
                {lang === 'sq' ? 'Bulevardi Teuta p.n.' : 'Bulevar Teuta bb'}
              </p>
              <p className="text-[10px]">
                {lang === 'sq' ? 'Ulqin, Mal i Zi' : lang === 'sr' ? 'Ulcinj, Crna Gora' : 'Ulcinj, Montenegro'}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-2.5 bg-bistro-charcoal/40 p-3 rounded-lg border border-bistro-cream/5">
            <Clock className="w-4 h-4 text-bistro-gold shrink-0" />
            <div>
              <p className="font-medium text-bistro-cream">
                {lang === 'sr' ? 'Svaki dan: 07:00 - 00:00' : lang === 'sq' ? 'Çdo ditë: 07:00 - 00:00' : 'Every day: 07:00 AM - 12:00 AM'}
              </p>
              <p className="text-[10px]">
                {lang === 'sr' ? 'Kuhinja zatvara u 23:30' : lang === 'sq' ? 'Kuzhina mbyllet në 23:30' : 'Kitchen closes at 11:30 PM'}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-2.5 bg-bistro-charcoal/40 p-3 rounded-lg border border-bistro-cream/5">
            <Phone className="w-4 h-4 text-bistro-gold shrink-0" />
            <div>
              <p className="font-medium text-bistro-cream">+382 69 771 616</p>
              <p className="text-[10px]">
                {lang === 'sr' ? 'Samo rezervacije' : lang === 'sq' ? 'Vetëm rezervime' : 'Reservations only'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
