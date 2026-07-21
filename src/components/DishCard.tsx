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
      whileHover={{ y: -4 }}
      onClick={() => onOpenDetails(dish)}
      className="bg-white border border-bistro-gold/15 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer group"
    >
      <div>
        {/* Top line metadata */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 font-mono text-bistro-muted text-xs">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-bistro-gold-dark" />
              {dish.prepTime} {DICTIONARY.minutes[lang]}
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              {dish.calories} kcal
            </span>
          </div>
          <div className="flex items-center gap-2">
            {dish.featured && (
              <span className="bg-bistro-gold/20 text-bistro-gold-dark text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-bistro-gold/30">
                {lang === 'sr' ? 'Preporuka' : 'Featured'}
              </span>
            )}
            <button
              id={`fav-btn-noimg-${dish.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(dish.id);
              }}
              className="p-1.5 rounded-full hover:bg-bistro-sand text-bistro-dark hover:text-red-600 transition-all cursor-pointer"
              title={lang === 'sr' ? 'Omiljeno' : 'Favorite'}
            >
              <Heart
                className={`w-4 h-4 transition-transform duration-200 active:scale-130 ${
                  isFavorite ? 'fill-red-600 text-red-600' : 'text-bistro-dark'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Dish Name */}
        <h3
          id={`dish-name-${dish.id}`}
          className="font-serif font-bold text-lg text-bistro-dark group-hover:text-bistro-gold-dark transition-colors leading-tight"
        >
          {dish.name[lang]}
        </h3>

        {/* Dish Description */}
        <p className="text-xs text-bistro-muted line-clamp-2 mt-2 leading-relaxed">
          {dish.description[lang]}
        </p>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-bistro-sand pt-4 mt-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-bistro-muted block uppercase tracking-wider font-semibold">
            {lang === 'sr' ? 'Cena' : 'Price'}
          </span>
          <span className="font-mono font-bold text-lg text-bistro-gold-dark">
            €{dish.price.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick view / details */}
          <span
            className="text-xs px-3.5 py-2 bg-bistro-sand group-hover:bg-bistro-gold/15 border border-bistro-gold/15 text-bistro-dark rounded-xl transition-all font-semibold"
          >
            {lang === 'sr' ? 'Pogledaj detalje' : 'View details'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
