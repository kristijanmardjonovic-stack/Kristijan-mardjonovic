import React from 'react';
import { motion } from 'motion/react';
import { X, Clock, Flame, ShieldAlert, CheckCircle2, Heart, AlertCircle } from 'lucide-react';
import { Dish, Language } from '../types';
import { DICTIONARY, DIETARY_LABELS, ALLERGENS_LABELS } from '../data';

interface DishModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function DishModal({
  dish,
  isOpen,
  onClose,
  lang,
  isFavorite,
  onToggleFavorite,
}: DishModalProps) {
  if (!isOpen || !dish) return null;

  return (
    <div id="dish-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        id="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-bistro-dark/60 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        id="modal-content-container"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 320 }}
        className="bg-white dark:bg-[#142318] border border-bistro-gold/15 dark:border-white/10 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl relative z-10 max-h-[90vh] flex flex-col"
      >
        {/* Close Button */}
        <motion.button
          id="close-modal-btn"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-1.5 rounded-full bg-bistro-sand/80 dark:bg-emerald-900/80 text-bistro-dark dark:text-white hover:bg-bistro-sand dark:hover:bg-emerald-800 shadow-md transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </motion.button>

        {/* Rich Details, Ingredients & Customizer */}
        <div className="w-full p-6 sm:p-8 overflow-y-auto flex flex-col justify-between max-h-[85vh]">
          <div>
            {/* Top row with stats and fav icon for text-only layout */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-bistro-gold/10 dark:border-white/10">
              <div className="flex items-center gap-4 text-xs font-mono text-bistro-muted dark:text-emerald-200/70">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-bistro-gold-dark dark:text-emerald-400" />
                  <span>{dish.prepTime} {DICTIONARY.minutes[lang]}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>{dish.calories} kcal</span>
                </span>
              </div>
              <button
                id={`modal-fav-btn-noimg-${dish.id}`}
                onClick={() => onToggleFavorite(dish.id)}
                className="p-2 rounded-full hover:bg-bistro-sand dark:hover:bg-emerald-900/40 text-bistro-dark dark:text-white hover:text-red-600 transition-all cursor-pointer"
                title={lang === 'sr' ? 'Omiljeno' : 'Favorite'}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorite ? 'fill-red-600 text-red-600' : 'text-bistro-dark dark:text-white'
                  }`}
                />
              </button>
            </div>

            {/* Title & Description */}
            <h2 id="modal-dish-title" className="font-serif font-bold text-2xl sm:text-3xl text-bistro-dark dark:text-white tracking-tight">
              {dish.name[lang]}
            </h2>
            <p className="text-sm text-bistro-muted dark:text-gray-300 mt-2.5 leading-relaxed">
              {dish.description[lang]}
            </p>

            {/* Price section */}
            <div className="my-5 p-3.5 bg-bistro-sand/30 dark:bg-emerald-950/40 border border-bistro-gold/10 dark:border-white/10 rounded-xl flex justify-between items-center">
              <span className="text-xs uppercase tracking-wider font-bold text-bistro-muted dark:text-emerald-200/70">
                {lang === 'sr' ? 'Cena jela' : 'Price'}
              </span>
              <span className="font-mono font-extrabold text-xl text-bistro-gold-dark dark:text-emerald-400">
                €{dish.price.toFixed(2)}
              </span>
            </div>

            {/* Ingredients */}
            {dish.ingredients && (
              <div className="mb-5">
                <h4 className="text-xs uppercase tracking-wider font-bold text-bistro-muted dark:text-emerald-200/70 mb-2">
                  🌿 {lang === 'sr' ? 'Sastojci' : 'Ingredients'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {dish.ingredients[lang]?.map((ing, i) => (
                    <span
                      key={i}
                      className="bg-bistro-cream dark:bg-[#192b1e] border border-bistro-gold/10 dark:border-white/10 text-xs text-bistro-dark dark:text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-bistro-gold-dark dark:text-emerald-400 shrink-0" />
                      <span>{ing}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dietary Tags */}
            {dish.dietary.length > 0 && (
              <div className="mb-5">
                <h4 className="text-xs uppercase tracking-wider font-bold text-bistro-muted dark:text-emerald-200/70 mb-2">
                  🥗 {lang === 'sr' ? 'Tip ishrane' : 'Dietary Options'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {dish.dietary.map((diet) => (
                    <span
                      key={diet}
                      className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/40 font-medium"
                    >
                      {DIETARY_LABELS[diet] ? DIETARY_LABELS[diet][lang] : diet}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Allergens Warn */}
            <div className="mb-5">
              <h4 className="text-xs uppercase tracking-wider font-bold text-bistro-muted dark:text-emerald-200/70 mb-2">
                ⚠️ {lang === 'sr' ? 'Alergeni' : 'Allergens'}
              </h4>
              {dish.allergens && dish.allergens.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {dish.allergens.map((alg) => (
                    <span
                      key={alg}
                      className="bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-100 dark:border-red-800/40 text-xxs uppercase tracking-wider font-bold px-2 py-0.5 rounded"
                    >
                      {ALLERGENS_LABELS[alg] ? ALLERGENS_LABELS[alg][lang] : alg}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-amber-600 dark:text-amber-400 italic">
                  {DICTIONARY.noAllergens[lang]}
                </p>
              )}
            </div>
          </div>

          {/* Friendly Takeaway notice block */}
          <div className="border-t border-bistro-sand dark:border-white/10 pt-5 mt-3">
            <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 rounded-xl flex gap-3 text-amber-950 dark:text-amber-100 text-xs items-start">
              <AlertCircle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  {lang === 'sr' ? 'Poručite kod našeg osoblja' : lang === 'sq' ? 'Porositni me stafin tonë' : 'Order with our staff'}
                </p>
                <p className="text-[11px] leading-relaxed mt-0.5 text-amber-950/85 dark:text-amber-200/80">
                  {lang === 'sr' && 'Sva jela sa menija možete poručiti direktno kod konobara, telefonom, ili upakovano za ponijeti!'}
                  {lang === 'en' && 'All menu items can be ordered directly with your waiter, via phone, or prepared fresh as a takeaway!'}
                  {lang === 'sq' && 'Të gjitha jela nga menu mund t\'i porositni direkt me kamerierin, me telefon, ose të paketuara për t\'u marrë!'}
                </p>
              </div>
            </div>

            <motion.button
              id="close-modal-confirm"
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
              onClick={onClose}
              className="w-full bg-bistro-gold dark:bg-emerald-700 hover:bg-bistro-gold-dark dark:hover:bg-emerald-600 text-bistro-dark dark:text-white font-bold py-3 px-4 rounded-xl mt-4 text-xs transition-colors cursor-pointer shadow-sm"
            >
              {lang === 'sr' ? 'Zatvori detalje' : lang === 'sq' ? 'Mbyll detajet' : 'Close details'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
