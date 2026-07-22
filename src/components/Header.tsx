import { Globe, Clock, MapPin, ShoppingBag, Heart, QrCode, Sparkles, Instagram, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DICTIONARY } from '../data';
import { Language } from '../types';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  favoritesCount: number;
  scrollToReviews: () => void;
  onOpenQrCode: () => void;
}

export default function Header({
  lang,
  setLang,
  theme,
  toggleTheme,
  favoritesCount,
  scrollToReviews,
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
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-wide font-semibold text-white">
              {DICTIONARY.restaurantName[lang]}
            </h1>
            <p className="text-sm font-sans tracking-widest text-white/80 uppercase mt-1">
              {DICTIONARY.tagline[lang]}
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Language Selection */}
            <div className="flex bg-bistro-charcoal border border-white/20 rounded-full p-1 shadow-inner">
              <button
                id="lang-sr"
                onClick={() => setLang('sr')}
                className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider transition-all uppercase duration-300 ${
                  lang === 'sr'
                    ? 'bg-white text-bistro-dark font-bold shadow-sm'
                    : 'text-bistro-cream hover:text-white'
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
                    ? 'bg-white text-bistro-dark font-bold shadow-sm'
                    : 'text-bistro-cream hover:text-white'
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
                    ? 'bg-white text-bistro-dark font-bold shadow-sm'
                    : 'text-bistro-cream hover:text-white'
                }`}
                title="English"
              >
                🇬🇧 EN
              </button>
            </div>

            {/* Theme Toggle Button */}
            <motion.button
              id="theme-toggle-btn"
              whileTap={{ scale: 0.88, rotate: 45 }}
              whileHover={{ scale: 1.08 }}
              onClick={toggleTheme}
              className="p-2 bg-bistro-charcoal hover:bg-white/15 border border-white/20 rounded-full transition-all text-white cursor-pointer flex items-center justify-center gap-1 shadow-xs"
              title={theme === 'dark' ? 'Svetli režim (Light mode)' : 'Tamni režim (Dark mode)'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-4 h-4 text-amber-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-4 h-4 text-emerald-300" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* QR Code Trigger */}
            <motion.button
              id="qr-code-trigger-btn"
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.08 }}
              onClick={onOpenQrCode}
              className="p-2 bg-bistro-charcoal hover:bg-white/15 border border-white/20 rounded-full transition-all text-white cursor-pointer"
              title="Meni QR Code"
            >
              <QrCode className="w-4 h-4" />
            </motion.button>

            {/* Instagram Link Button */}
            <motion.a
              href="https://www.instagram.com/coffeeandfood.cafe?igsh=MWF6NXI4aGJ6N2ZzMg=="
              target="_blank"
              rel="noopener noreferrer"
              id="instagram-top-btn"
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.08 }}
              className="p-2 bg-emerald-800 hover:bg-emerald-700 border border-white/20 rounded-full transition-all text-white cursor-pointer flex items-center justify-center"
              title="Instagram Porudžbine @coffeeandfood.cafe"
            >
              <Instagram className="w-4 h-4" />
            </motion.a>

            {/* Quick scrolls */}
            <motion.button
              id="scroll-to-reviews"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.04 }}
              onClick={scrollToReviews}
              className="text-xs px-3 py-2 bg-bistro-charcoal hover:bg-white/10 border border-white/20 rounded-full transition-all text-white cursor-pointer font-medium"
            >
              ⭐ {DICTIONARY.guestReviews[lang]}
            </motion.button>

            {/* Favorites Badge */}
            <AnimatePresence>
              {favoritesCount > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex items-center gap-1 bg-red-950/40 border border-red-500/30 px-2.5 py-1.5 rounded-full text-xs text-red-400"
                >
                  <Heart className="w-3.5 h-3.5 fill-current animate-pulse" />
                  <motion.span
                    key={favoritesCount}
                    initial={{ scale: 1.4 }}
                    animate={{ scale: 1 }}
                    className="font-bold"
                  >
                    {favoritesCount}
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Quick Restaurant Metadata Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-white/90 font-sans">
          <motion.a
            href="https://www.google.com/maps/search/?api=1&query=Coffee+%26+Food+Ugostiteljska+radnja+Kodre+Ulcinj"
            target="_blank"
            rel="noopener noreferrer"
            id="location-header-link"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center md:justify-start gap-2.5 bg-bistro-charcoal/40 hover:bg-bistro-charcoal/70 p-3 rounded-lg border border-bistro-cream/10 hover:border-bistro-gold/40 transition-all cursor-pointer group"
            title={lang === 'sr' ? 'Otvori lokaciju na Google Mapi' : lang === 'sq' ? 'Hap vendndodhjen në Google Maps' : 'Open location in Google Maps'}
          >
            <div className="p-1.5 bg-white/10 rounded-full group-hover:bg-bistro-gold group-hover:text-bistro-dark transition-colors">
              <MapPin className="w-4 h-4 text-white group-hover:text-bistro-dark shrink-0 transition-colors" />
            </div>
            <div>
              <p className="font-medium text-bistro-cream flex items-center gap-1.5">
                <span>{lang === 'sq' ? 'Kodre p.n.' : 'Kodre bb'}</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-sans group-hover:bg-bistro-gold group-hover:text-bistro-dark transition-colors">↗ Google Maps</span>
              </p>
              <p className="text-[10px] text-white/70">
                {lang === 'sq' ? 'Ulqin, Mal i Zi' : lang === 'sr' ? 'Ulcinj, Crna Gora' : 'Ulcinj, Montenegro'}
              </p>
            </div>
          </motion.a>
          <div className="flex items-center justify-center md:justify-start gap-2.5 bg-bistro-charcoal/40 p-3 rounded-lg border border-bistro-cream/5">
            <Clock className="w-4 h-4 text-white shrink-0" />
            <div>
              <p className="font-medium text-bistro-cream">
                {lang === 'sr' ? 'Svaki dan: 07:00 - 23:00' : lang === 'sq' ? 'Çdo ditë: 07:00 - 23:00' : 'Every day: 07:00 AM - 11:00 PM'}
              </p>
              <p className="text-[10px] text-white/70">
                {lang === 'sr' ? 'Kuhinja se zatvara u 22:30' : lang === 'sq' ? 'Kuzhina mbyllet në 22:30' : 'Kitchen closes at 10:30 PM'}
              </p>
            </div>
          </div>
          <a
            href="https://www.instagram.com/coffeeandfood.cafe?igsh=MWF6NXI4aGJ6N2ZzMg=="
            target="_blank"
            rel="noopener noreferrer"
            id="instagram-order-card"
            className="flex items-center justify-center md:justify-start gap-2.5 bg-emerald-800/80 hover:bg-emerald-700 p-3 rounded-lg border border-white/20 transition-all cursor-pointer group shadow-sm"
          >
            <div className="p-1.5 bg-white/10 rounded-full group-hover:scale-110 transition-transform">
              <Instagram className="w-4 h-4 text-white shrink-0" />
            </div>
            <div>
              <p className="font-semibold text-white tracking-wide flex items-center gap-1.5">
                <span>
                  {lang === 'sr' && 'Poručite hranu (Instagram)'}
                  {lang === 'sq' && 'Porositni ushqim (Instagram)'}
                  {lang === 'en' && 'Order Food (Instagram)'}
                </span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-sans">↗</span>
              </p>
              <p className="text-[10px] text-white/80">
                {lang === 'sr' && 'Kliknite za porudžbine @coffeeandfood.cafe'}
                {lang === 'sq' && 'Kliko për porosi @coffeeandfood.cafe'}
                {lang === 'en' && 'Click to order @coffeeandfood.cafe'}
              </p>
            </div>
          </a>
        </div>
      </div>
    </header>
  );
}
