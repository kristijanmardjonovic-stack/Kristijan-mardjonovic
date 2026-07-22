/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles, Utensils, Heart, Check, Info, ArrowUp, QrCode, ArrowLeft, Languages, MapPin } from 'lucide-react';
import Header from './components/Header';
import MenuGrid from './components/MenuGrid';
import DishModal from './components/DishModal';
import ReviewSection from './components/ReviewSection';
import DecoratedQrCode from './components/DecoratedQrCode';
import { DISHES, REVIEWS, DICTIONARY } from './data';
import { Dish, Review, Language } from './types';

export default function App() {
  // 1. Splash & Landing States
  const [showSplash, setShowSplash] = useState(true);
  const [isLanding, setIsLanding] = useState(() => {
    // Check if user has chosen a language before to bypass landing if they prefer
    const saved = localStorage.getItem('amfora_lang');
    return !saved;
  });

  const [showQrModal, setShowQrModal] = useState(false);

  // 2. Core States with local storage integration
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('caffee_food_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('amfora_lang');
    return (saved === 'sr' || saved === 'en' || saved === 'sq') ? (saved as Language) : 'sr';
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('amfora_favs');
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('amfora_reviews');
    if (saved) {
      try {
        const parsed: Review[] = JSON.parse(saved);
        // Filter out old mock reviews
        return parsed.filter((r) => !['rev_1', 'rev_2', 'rev_3'].includes(r.id));
      } catch {
        return [];
      }
    }
    return REVIEWS;
  });

  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Custom Toast State
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'info' }>({
    show: false,
    message: '',
    type: 'success',
  });

  // Splash timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3800); // Give plenty of time for beautiful slow staggered welcome transitions
    return () => clearTimeout(timer);
  }, []);

  // 3. Synchronization with Local Storage & Document Root
  useEffect(() => {
    localStorage.setItem('caffee_food_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    localStorage.setItem('amfora_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('amfora_favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('amfora_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Scroll target refs
  const reviewsSectionRef = useRef<HTMLDivElement>(null);

  // 4. Action Helpers & Multi-Language Toasts
  const triggerToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const getToastMsg = (key: 'favRemoved' | 'favAdded' | 'cartAdded' | 'cartRemoved' | 'reviewThanks', params?: any) => {
    const dictionary: Record<string, Record<Language, string>> = {
      favRemoved: {
        en: `Removed "${params?.name}" from favorites`,
        sq: `U hoq "${params?.name}" nga të preferuarat`,
        sr: `Uklonjeno "${params?.name}" iz omiljenih`,
      },
      favAdded: {
        en: `Added "${params?.name}" to favorites!`,
        sq: `U shtua "${params?.name}" tek të preferuarat!`,
        sr: `Dodato "${params?.name}" u omiljena jela!`,
      },
      reviewThanks: {
        en: 'Thank you for your feedback!',
        sq: 'Ju faleminderit për vlerësimin tuaj!',
        sr: 'Hvala na vašem utisku!',
      }
    };
    return dictionary[key]?.[lang] || '';
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(id);
      const next = isFav ? prev.filter((favId) => favId !== id) : [...prev, id];
      const dishName = DISHES.find((d) => d.id === id)?.name[lang] || 'Dish';
      
      if (isFav) {
        triggerToast(getToastMsg('favRemoved', { name: dishName }), 'info');
      } else {
        triggerToast(getToastMsg('favAdded', { name: dishName }), 'success');
      }
      return next;
    });
  };

  const handleAddReview = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
    triggerToast(getToastMsg('reviewThanks'), 'success');
  };

  const handleScrollToReviews = () => {
    reviewsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Welcome page buttons handler
  const selectLanguageAndEnter = (selectedLang: Language) => {
    setLang(selectedLang);
    setIsLanding(false);
    // Smooth scroll to top of viewport
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="restaurant-root-applet" className="min-h-screen bg-white dark:bg-[#0f1210] flex flex-col justify-between selection:bg-bistro-gold selection:text-bistro-dark font-sans text-bistro-dark dark:text-gray-100 overflow-x-hidden transition-colors duration-300">
      
      {/* 1. Splash Screen Overlay */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            id="splash-screen-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 bg-bistro-dark text-bistro-cream flex flex-col items-center justify-center z-50 p-6"
          >
            {/* Visual glow background orbits */}
            <div className="absolute w-[400px] h-[400px] rounded-full bg-bistro-gold/5 blur-3xl pointer-events-none" />
            <div className="absolute w-[250px] h-[250px] rounded-full bg-amber-500/5 blur-2xl pointer-events-none translate-x-20 -translate-y-10" />

            {/* Main branding container */}
            <div className="text-center space-y-8 max-w-lg relative z-10">
              {/* Gold Ornament Emblem */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0, rotate: -45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 1, ease: 'easeOut' }}
                className="w-16 h-16 border-2 border-bistro-gold/40 rounded-full flex items-center justify-center mx-auto mb-2 text-bistro-gold"
              >
                <Utensils className="w-6 h-6 animate-pulse" />
              </motion.div>

              {/* Title Restaurant Name */}
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wider text-bistro-gold"
              >
                Coffee & Food
              </motion.h1>

              {/* Elegant Welcome translations list cascading down */}
              <div className="space-y-2 pt-2 border-t border-bistro-cream/10 max-w-xs mx-auto">
                {/* 1. English Welcome */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                  className="text-sm font-sans tracking-widest text-bistro-muted uppercase"
                >
                  ✨ Welcome ✨
                </motion.p>
                {/* 2. Albanian Welcome */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.7, duration: 0.6 }}
                  className="text-sm font-sans tracking-widest text-bistro-gold/80 font-semibold uppercase"
                >
                  ⚜️ Mirëseerdhët ⚜️
                </motion.p>
                {/* 3. Serbian/Montenegrin Welcome */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.3, duration: 0.6 }}
                  className="text-sm font-sans tracking-widest text-bistro-cream/80 uppercase"
                >
                  🥂 Dobrodošli 🥂
                </motion.p>
              </div>
            </div>

            {/* Bottom loading hint decor */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 2.8, duration: 0.8 }}
              className="absolute bottom-10 text-[10px] uppercase tracking-widest text-bistro-muted font-mono"
            >
              Coffee & Food Digital Platform
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Welcome Landing & Language Selector (If isLanding is true) */}
      {(!showSplash && isLanding) && (
        <motion.div
          id="welcome-landing-screen"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="min-h-screen bg-bistro-dark text-bistro-cream flex flex-col justify-between py-12 px-4 sm:px-6 relative w-full overflow-x-hidden"
        >
          {/* Background hero asset blur texture */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: `url('/src/assets/images/restaurant_hero_banner_1784588858619.jpg')` }}
          />

          {/* Top Logo and Tagline */}
          <div className="text-center relative z-10 pt-4 space-y-2">
            <div className="w-12 h-12 border border-bistro-gold/30 rounded-full flex items-center justify-center mx-auto text-bistro-gold text-sm font-serif">
              C&F
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl tracking-wide font-bold text-bistro-gold">
              Coffee & Food
            </h2>
            <div className="h-px bg-gradient-to-r from-transparent via-bistro-gold/20 to-transparent w-40 mx-auto" />
            <p className="text-xxs uppercase tracking-widest text-bistro-muted font-mono">
              Digital Dining & Table Service
            </p>
          </div>

          {/* Core Interactive Centerpiece: Buttons & QR Code */}
          <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center justify-center relative z-10 my-8">
            {/* Left side: Beautiful language selection buttons */}
            <div className="space-y-6 flex flex-col justify-center">
              <div className="text-center md:text-left space-y-1">
                <span className="text-xxs uppercase tracking-widest text-bistro-gold font-bold">
                  Select Language / Izaberite Jezik / Zgjidhni Gjuhën
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-bistro-cream">
                  Enter Dining Menu
                </h3>
              </div>

              <div className="flex flex-col gap-4 max-w-md w-full mx-auto md:mx-0">
                {/* 1. English Menu Button */}
                <button
                  id="entry-lang-en-btn"
                  onClick={() => selectLanguageAndEnter('en')}
                  className="group relative flex items-center justify-between p-4 bg-bistro-charcoal hover:bg-bistro-gold hover:text-bistro-dark border border-bistro-gold/25 rounded-xl transition-all duration-300 shadow-md cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">🇬🇧</span>
                    <div>
                      <h4 className="font-serif font-bold text-sm tracking-wide">Menu</h4>
                      <p className="text-xxs text-bistro-muted group-hover:text-bistro-dark/80 font-mono">ENGLISH LANGUAGE</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-bistro-gold group-hover:text-bistro-dark pl-2 transition-colors">
                    Explore →
                  </span>
                </button>

                {/* 2. Montenegrin / Serbian Menu Button */}
                <button
                  id="entry-lang-sr-btn"
                  onClick={() => selectLanguageAndEnter('sr')}
                  className="group relative flex items-center justify-between p-4 bg-bistro-charcoal hover:bg-bistro-gold hover:text-bistro-dark border border-bistro-gold/25 rounded-xl transition-all duration-300 shadow-md cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">🇲🇪</span>
                    <div>
                      <h4 className="font-serif font-bold text-sm tracking-wide">Meni</h4>
                      <p className="text-xxs text-bistro-muted group-hover:text-bistro-dark/80 font-mono">CRNOGORSKI / SRPSKI</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-bistro-gold group-hover:text-bistro-dark pl-2 transition-colors">
                    Pregledaj →
                  </span>
                </button>

                {/* 3. Albanian Menu Button */}
                <button
                  id="entry-lang-sq-btn"
                  onClick={() => selectLanguageAndEnter('sq')}
                  className="group relative flex items-center justify-between p-4 bg-bistro-charcoal hover:bg-bistro-gold hover:text-bistro-dark border border-bistro-gold/25 rounded-xl transition-all duration-300 shadow-md cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">🇦🇱</span>
                    <div>
                      <h4 className="font-serif font-bold text-sm tracking-wide">Menu</h4>
                      <p className="text-xxs text-bistro-muted group-hover:text-bistro-dark/80 font-mono">GJUHA SHQIPE (ALBANIAN)</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-bistro-gold group-hover:text-bistro-dark pl-2 transition-colors">
                    Shfleto →
                  </span>
                </button>
              </div>
            </div>

            {/* Right side: Decorated scan QR Code component */}
            <div className="flex justify-center items-center">
              <DecoratedQrCode lang={lang} />
            </div>
          </div>

          {/* Slogan Footer */}
          <div className="text-center text-[10px] text-bistro-muted font-sans relative z-10">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Coffee+%26+Food+Ugostiteljska+radnja+Kodre+Ulcinj"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-bistro-cream/90 hover:text-bistro-gold transition-colors cursor-pointer group"
              title="Otvori lokaciju na Google Mapi"
            >
              <MapPin className="w-3 h-3 text-bistro-gold shrink-0 group-hover:scale-110 transition-transform" />
              <span>{lang === 'sq' ? 'Kodre p.n., Ulqin, Mal i Zi' : 'Kodre bb, Ulcinj, Montenegro'}</span>
              <span className="text-bistro-gold">↗</span>
            </a>
            <p className="mt-1 text-bistro-gold/50">Coffee & Food © 2026. All rights reserved.</p>
          </div>
        </motion.div>
      )}

      {/* 3. Main Interactive Menu (When not showing splash or landing) */}
      {(!showSplash && !isLanding) && (
        <div id="active-menu-workspace" className="flex flex-col justify-between min-h-screen w-full overflow-x-hidden bg-white dark:bg-[#08120a] text-bistro-dark dark:text-slate-100 transition-colors duration-300">
          {/* Header section */}
          <Header
            lang={lang}
            setLang={setLang}
            theme={theme}
            toggleTheme={toggleTheme}
            favoritesCount={favorites.length}
            scrollToReviews={handleScrollToReviews}
            onOpenQrCode={() => setShowQrModal(true)}
          />

          {/* Quick Return to Language Landing Selector */}
          <div className="bg-bistro-sand/40 dark:bg-emerald-950/40 border-b border-bistro-gold/10 dark:border-white/10 py-2.5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center sm:justify-between gap-3 text-xs text-center">
              <button
                id="back-to-landing-btn"
                onClick={() => setIsLanding(true)}
                className="flex items-center gap-1.5 text-bistro-muted dark:text-emerald-300/80 hover:text-bistro-gold-dark dark:hover:text-emerald-200 font-medium transition-colors cursor-pointer justify-center"
              >
                <ArrowLeft className="w-3.5 h-3.5 animate-pulse" />
                <span>
                  {lang === 'sr' && 'Promeni jezik / Početna'}
                  {lang === 'en' && 'Change language / Home'}
                  {lang === 'sq' && 'Ndrysho gjuhën / Fillimi'}
                </span>
              </button>
              <div className="flex items-center gap-1.5 text-bistro-muted dark:text-emerald-300/80 text-xxs font-mono justify-center">
                <Languages className="w-3.5 h-3.5 text-bistro-gold" />
                <span>
                  {lang === 'sr' && 'Aktivan jezik: CRNOGORSKI'}
                  {lang === 'en' && 'Active language: ENGLISH'}
                  {lang === 'sq' && 'Gjuha aktive: SHQIP'}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 flex-1 overflow-hidden">
            
            {/* Promos Section */}
            <section id="promo-hero-cards" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative rounded-2xl overflow-hidden bg-bistro-dark border border-bistro-gold/15 p-6 sm:p-8 text-bistro-cream flex flex-col justify-between min-h-[220px] shadow-sm">
                <div className="absolute right-0 bottom-0 opacity-15 text-9xl select-none translate-x-4 translate-y-4 font-serif">
                  🍇
                </div>
                <div className="space-y-2 z-10">
                  <span className="text-xxs uppercase tracking-widest text-bistro-gold font-bold">
                    {lang === 'sr' && 'Lokalna tradicija'}
                    {lang === 'en' && 'Local Tradition'}
                    {lang === 'sq' && 'Traditë Lokale'}
                  </span>
                  <h2 className="font-serif font-semibold text-2xl sm:text-3xl leading-tight">
                    {lang === 'sr' && 'Spoj tradicije i mediteranskog duha'}
                    {lang === 'en' && 'Authentic taste of the Adriatic coastline'}
                    {lang === 'sq' && 'Gërshetim i traditës dhe frymës mesdhetare'}
                  </h2>
                  <p className="text-xs text-bistro-muted leading-relaxed max-w-sm">
                    {lang === 'sr' && 'Pažljivo birana jela spremljena od strane lokalnih kuvara, koristeći isključivo sveže i domaće namirnice iz Ulcinja i okoline.'}
                    {lang === 'en' && 'Sourced with care from regional producers, showcasing organic olive oils, locally dry-aged cheese, and seafood caught fresh off the shores of Ulcinj.'}
                    {lang === 'sq' && 'Pjata të përzgjedhura me kujdes të përgatitura nga shefa lokalë, duke përdorur ekskluzivisht përbërës të freskët dhe lokalë nga Ulqini dhe rrethinat.'}
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-1.5 text-xs font-semibold text-bistro-gold z-10">
                  <span>🏺</span>
                  <span>
                    {lang === 'sr' && '100% Prirodno & Sveže'}
                    {lang === 'en' && '100% Raw & Organic Sourcing'}
                    {lang === 'sq' && '100% Natyrale & e Freskët'}
                  </span>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-[#142318] border border-bistro-gold/10 dark:border-white/10 p-6 sm:p-8 flex flex-col justify-between min-h-[220px] shadow-sm">
                <div className="absolute right-0 bottom-0 opacity-10 text-9xl select-none translate-x-4 translate-y-4 font-serif">
                  🍽️
                </div>
                <div className="space-y-2 z-10">
                  <span className="text-xxs uppercase tracking-widest text-bistro-gold-dark dark:text-emerald-400 font-bold">
                    {lang === 'sr' && 'Digitalni Koncept'}
                    {lang === 'en' && 'Digital Concept'}
                    {lang === 'sq' && 'Koncepti Digjital'}
                  </span>
                  <h2 className="font-serif font-semibold text-2xl sm:text-3xl text-bistro-dark dark:text-white leading-tight">
                    {lang === 'sr' && 'Skenirajte, Naručite & Uživajte'}
                    {lang === 'en' && 'Summon services directly from your seat'}
                    {lang === 'sq' && 'Skenoni, Porositni & Shijoni'}
                  </h2>
                  <p className="text-xs text-bistro-muted dark:text-gray-300 leading-relaxed max-w-sm">
                    {lang === 'sr' && 'Bez čekanja u redu! Izaberite jela, podesite posebne instrukcije za kuhinju, pošaljite porudžbinu ili pozovite konobara jednim klikom.'}
                    {lang === 'en' && 'Bypass wait times! Browse ingredients, customize kitchen notes, call the service table waiter, and view your live billing estimates instantly.'}
                    {lang === 'sq' && 'Pa pritje në radhë! Zgjidhni pjatat, rregulloni udhëzimet për kuzhinën, dërgoni porosinë ose thirrni kamerierin me një klikim.'}
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-1.5 text-xs font-semibold text-bistro-gold-dark dark:text-emerald-400 z-10">
                  <span>🛎️</span>
                  <span>
                    {lang === 'sr' && 'Pametna digitalna daska'}
                    {lang === 'en' && 'Active table service integrated'}
                    {lang === 'sq' && 'Pjatë digjitale e zgjuar'}
                  </span>
                </div>
              </div>
            </section>

            {/* Menu Grid section */}
            <section id="menu-selector-block" className="space-y-6">
              <div className="border-b border-bistro-sand dark:border-white/10 pb-4 text-center md:text-left">
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-bistro-dark dark:text-white flex items-center justify-center md:justify-start gap-2">
                  <Utensils className="w-5.5 h-5.5 text-bistro-gold shrink-0" />
                  {lang === 'sr' && 'Pregledajte Naš Meni'}
                  {lang === 'en' && 'Explore Our Culinary Menu'}
                  {lang === 'sq' && 'Shfletoni Menunë Tonë'}
                </h2>
                <p className="text-xs text-bistro-muted mt-1">
                  {lang === 'sr' && 'Koristite pretragu ili filtere ishrane da lakše odaberete'}
                  {lang === 'en' && 'Utilize keyword search or dietary parameters below'}
                  {lang === 'sq' && 'Përdorni kërkimin ose filtrat ushqimorë për të zgjedhur më lehtë'}
                </p>
              </div>

              <MenuGrid
                lang={lang}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onOpenDetails={(dish) => setSelectedDish(dish)}
              />
            </section>

            {/* Reviews list section */}
            <div ref={reviewsSectionRef} className="scroll-mt-10">
              <ReviewSection
                lang={lang}
                reviews={reviews}
                onAddReview={handleAddReview}
              />
            </div>

          </main>

          {/* Footer bar */}
          <footer id="restaurant-footer-block" className="bg-bistro-dark text-bistro-muted text-xs py-8 border-t border-bistro-gold/20 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left font-sans">
              <div>
                <h4 className="font-serif font-semibold text-bistro-gold text-sm mb-2">
                  {DICTIONARY.restaurantName[lang]}
                </h4>
                <p className="text-[11px] leading-relaxed">
                  {lang === 'sr' && 'Autentičan bistro spojen sa jadranskom tradicijom i modernim doživljajem.'}
                  {lang === 'en' && 'An authentic coastal bistro blending deep Adriatic heritage with a smooth, smart dining experience.'}
                  {lang === 'sq' && 'Një bistro autentik bregdetar që ndërthur trashëgiminë e thellë të Adriatikut me një përvojë të zgjuar ngrënieje.'}
                </p>
              </div>
              <div>
                <h4 className="font-serif font-semibold text-bistro-gold text-sm mb-2">
                  {lang === 'sr' && 'Radno Vreme'}
                  {lang === 'en' && 'Opening Hours'}
                  {lang === 'sq' && 'Orari i Punës'}
                </h4>
                <p className="text-[11px] font-mono">
                  {lang === 'sr' && 'Ponedeljak - Nedelja: 07:00 - 23:00'}
                  {lang === 'en' && 'Monday - Sunday: 07:00 AM - 11:00 PM'}
                  {lang === 'sq' && 'E hënë - E diel: 07:00 - 23:00'}
                </p>
                <p className="text-[10px] mt-1 text-bistro-muted">
                  {lang === 'sr' && '*Kuhinja prima porudžbine do 22:30'}
                  {lang === 'en' && '*Kitchen accepts active orders until 10:30 PM'}
                  {lang === 'sq' && '*Kuzhina pranon porosi deri në orën 22:30'}
                </p>
              </div>
              <div>
                <h4 className="font-serif font-semibold text-bistro-gold text-sm mb-2">
                  {lang === 'sr' && 'Lokacija'}
                  {lang === 'en' && 'Our Location'}
                  {lang === 'sq' && 'Vendndodhja'}
                </h4>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Coffee+%26+Food+Ugostiteljska+radnja+Kodre+Ulcinj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] text-bistro-cream hover:text-bistro-gold transition-colors cursor-pointer group"
                  title={lang === 'sr' ? 'Otvori na Google Mapi' : lang === 'sq' ? 'Hap në Google Maps' : 'Open in Google Maps'}
                >
                  <MapPin className="w-3.5 h-3.5 text-bistro-gold shrink-0 group-hover:scale-110 transition-transform" />
                  <span>
                    {lang === 'sq' ? 'Kodre p.n., Ulqin' : 'Kodre bb, Ulcinj'}
                  </span>
                  <span className="text-[10px] text-bistro-gold opacity-80">↗</span>
                </a>
                <p className="text-[11px] text-bistro-muted mt-1">kristijanmardjonovic@gmail.com</p>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-bistro-cream/5 mt-6 pt-4 text-center text-[10px] text-bistro-muted">
              <p>© 2026 {DICTIONARY.restaurantName[lang]}. All rights reserved.</p>
            </div>
          </footer>

          {/* Detailed Dish Details Modal */}
          <AnimatePresence>
            {selectedDish && (
              <DishModal
                dish={selectedDish}
                isOpen={selectedDish !== null}
                onClose={() => setSelectedDish(null)}
                lang={lang}
                isFavorite={favorites.includes(selectedDish.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 4. Elegant Ornamented QR Code Modal (Triggered from Header) */}
      <AnimatePresence>
        {showQrModal && (
          <div id="qr-code-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQrModal(false)}
              className="absolute inset-0 bg-bistro-dark/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Double decorated dismiss container */}
              <button
                id="close-qr-modal-btn"
                onClick={() => setShowQrModal(false)}
                className="absolute top-4 right-4 z-30 p-1.5 rounded-full bg-bistro-charcoal hover:bg-bistro-gold/20 text-bistro-cream hover:text-bistro-gold shadow-md transition-colors cursor-pointer border border-bistro-gold/10"
              >
                ✕
              </button>
              <DecoratedQrCode lang={lang} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Scroll To Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            id="scroll-to-top-btn"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-bistro-dark dark:bg-emerald-800 text-bistro-gold dark:text-white border border-bistro-gold/40 dark:border-emerald-500/40 shadow-xl cursor-pointer flex items-center justify-center transition-colors hover:bg-bistro-charcoal dark:hover:bg-emerald-700"
            title={lang === 'sr' ? 'Nazad na vrh' : lang === 'sq' ? 'Kthehu lart' : 'Back to top'}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Action Toast Notifications banner */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            id="action-toast-banner"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-6 z-50 max-w-sm bg-bistro-dark border border-bistro-gold/30 text-bistro-cream p-4 rounded-xl shadow-2xl flex items-center gap-3"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              toast.type === 'success' ? 'bg-green-950/40 border border-green-500/30 text-green-400' : 'bg-bistro-charcoal border border-bistro-gold/20 text-bistro-gold'
            }`}>
              {toast.type === 'success' ? <Check className="w-4 h-4" /> : <Info className="w-4 h-4" />}
            </div>
            <p className="text-xs sm:text-sm font-semibold pr-2">
              {toast.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
