import { Clock, Heart, Flame, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { Dish, Language } from '../types';
import { DICTIONARY, DIETARY_LABELS } from '../data';

interface DishCardProps {
  key?: string;
  dish: Dish;
  lang: Language;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenDetails: (dish: Dish) => void;
}

export default function DishCard({
  dish,
  lang,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
}: DishCardProps) {
  return (
    <motion.div
      id={`dish-card-${dish.id}`}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 350, damping: 25 } }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onOpenDetails(dish)}
      className="bg-white dark:bg-[#142318] border border-bistro-gold/15 dark:border-white/10 rounded-2xl p-5 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer group"
    >
      <div>
        {/* Top line metadata */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 font-mono text-bistro-muted dark:text-emerald-200/70 text-xs">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-bistro-gold-dark dark:text-emerald-400" />
              {dish.prepTime} {DICTIONARY.minutes[lang]}
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              {dish.calories} kcal
            </span>
          </div>
          <div className="flex items-center gap-2">
            {dish.featured && (
              <span className="bg-bistro-gold/20 dark:bg-emerald-900/60 text-bistro-gold-dark dark:text-emerald-300 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-bistro-gold/30 dark:border-emerald-600/40">
                {lang === 'sr' ? 'Preporuka' : 'Featured'}
              </span>
            )}
            <motion.button
              id={`fav-btn-noimg-${dish.id}`}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 1.35, rotate: 12 }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(dish.id);
              }}
              className="p-1.5 rounded-full hover:bg-bistro-sand dark:hover:bg-emerald-900/40 text-bistro-dark dark:text-slate-100 hover:text-red-600 transition-all cursor-pointer"
              title={lang === 'sr' ? 'Omiljeno' : 'Favorite'}
            >
              <Heart
                className={`w-4 h-4 transition-colors duration-200 ${
                  isFavorite ? 'fill-red-600 text-red-600' : 'text-bistro-dark dark:text-slate-200'
                }`}
              />
            </motion.button>
          </div>
        </div>

        {/* Dish Name */}
        <h3
          id={`dish-name-${dish.id}`}
          className="font-serif font-bold text-lg text-bistro-dark dark:text-white group-hover:text-bistro-gold-dark dark:group-hover:text-emerald-400 transition-colors leading-tight"
        >
          {dish.name[lang]}
        </h3>

        {/* Dish Description */}
        <p className="text-xs text-bistro-muted dark:text-gray-300 line-clamp-2 mt-2 leading-relaxed">
          {dish.description[lang]}
        </p>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-bistro-sand dark:border-white/10 pt-4 mt-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-bistro-muted dark:text-emerald-200/70 block uppercase tracking-wider font-semibold">
            {lang === 'sr' ? 'Cena' : 'Price'}
          </span>
          <span className="font-mono font-bold text-lg text-bistro-gold-dark dark:text-emerald-400">
            €{dish.price.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick view / details */}
          <span
            className="text-xs px-3.5 py-2 bg-bistro-sand dark:bg-emerald-900/40 group-hover:bg-bistro-gold/15 dark:group-hover:bg-emerald-800/60 border border-bistro-gold/15 dark:border-white/10 text-bistro-dark dark:text-white rounded-xl transition-all font-semibold"
          >
            {lang === 'sr' ? 'Pogledaj detalje' : 'View details'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
