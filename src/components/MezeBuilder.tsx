import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, RotateCcw, Sparkles, AlertCircle, Check, X, Printer } from 'lucide-react';
import { MEZE_INGREDIENTS, DICTIONARY, MezeIngredient } from '../data';
import { Dish, Category, Language } from '../types';

interface MezeBuilderProps {
  lang: Language;
}

export default function MezeBuilder({ lang }: MezeBuilderProps) {
  // Store quantities of each ingredient by id
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [showInstructions, setShowInstructions] = useState(false);

  const handleAdd = (id: string) => {
    setSelections((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleRemove = (id: string) => {
    setSelections((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return {
        ...prev,
        [id]: current - 1,
      };
    });
  };

  const handleReset = () => {
    setSelections({});
    setShowInstructions(false);
  };

  // Calculations
  const selectedItems = Object.entries(selections).map(([id, quantity]) => {
    const item = MEZE_INGREDIENTS.find((ing) => ing.id === id)!;
    return { item, quantity: Number(quantity) };
  });

  const totalWeight = selectedItems.reduce((acc, current) => acc + (current.item?.weight || 0) * current.quantity, 0);
  const totalPrice = selectedItems.reduce((acc, current) => acc + (current.item?.price || 0) * current.quantity, 0);
  const totalCalories = selectedItems.reduce((acc, current) => acc + (current.item?.calories || 0) * current.quantity, 0);

  const hasItems = selectedItems.length > 0;

  return (
    <section id="custom-meze-builder" className="bg-bistro-sand/40 border border-bistro-gold/10 rounded-2xl p-6 sm:p-8 shadow-sm relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🪵</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-bistro-dark">
              {DICTIONARY.customMeze[lang]}
            </h2>
            <Sparkles className="w-5 h-5 text-bistro-gold animate-bounce" />
          </div>
          <p className="text-sm text-bistro-muted mt-1 max-w-2xl">
            {DICTIONARY.mezeDesc[lang]}
          </p>
        </div>

        {hasItems && (
          <motion.button
            id="reset-meze-builder"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 bg-white border border-red-200 px-3 py-1.5 rounded-full shadow-sm font-medium transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {DICTIONARY.resetMeze[lang]}
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ingredient selectors (Col: 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Meat */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-bistro-gold mb-3 flex items-center gap-2">
              🥓 {lang === 'sr' ? 'Mesni delikatesi' : 'Cured Meats'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MEZE_INGREDIENTS.filter((i) => i.category === 'meat').map((ing) => {
                const count = selections[ing.id] || 0;
                return (
                  <div
                    key={ing.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      count > 0
                        ? 'bg-white border-bistro-gold shadow-sm'
                        : 'bg-transparent border-bistro-gold/10 hover:border-bistro-gold/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl select-none">{ing.icon}</span>
                      <div>
                        <p className="font-semibold text-sm text-bistro-dark">{ing.name[lang]}</p>
                        <p className="text-xs text-bistro-muted font-mono">
                          {ing.weight}g · €{ing.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {count > 0 && (
                        <button
                          id={`remove-meze-${ing.id}`}
                          onClick={() => handleRemove(ing.id)}
                          className="w-7 h-7 bg-bistro-sand hover:bg-bistro-gold/10 text-bistro-dark rounded-full flex items-center justify-center transition-all cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {count > 0 && <span className="font-bold text-sm w-4 text-center text-bistro-dark">{count}</span>}
                      <button
                        id={`add-meze-${ing.id}`}
                        onClick={() => handleAdd(ing.id)}
                        className="w-7 h-7 bg-bistro-gold hover:bg-bistro-gold-dark text-bistro-dark rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cheese */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-bistro-gold mb-3 flex items-center gap-2">
              🧀 {lang === 'sr' ? 'Autohtoni sirevi' : 'Local Cheeses'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MEZE_INGREDIENTS.filter((i) => i.category === 'cheese').map((ing) => {
                const count = selections[ing.id] || 0;
                return (
                  <div
                    key={ing.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      count > 0
                        ? 'bg-white border-bistro-gold shadow-sm'
                        : 'bg-transparent border-bistro-gold/10 hover:border-bistro-gold/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl select-none">{ing.icon}</span>
                      <div>
                        <p className="font-semibold text-sm text-bistro-dark">{ing.name[lang]}</p>
                        <p className="text-xs text-bistro-muted font-mono">
                          {ing.weight}g · €{ing.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {count > 0 && (
                        <button
                          id={`remove-meze-${ing.id}`}
                          onClick={() => handleRemove(ing.id)}
                          className="w-7 h-7 bg-bistro-sand hover:bg-bistro-gold/10 text-bistro-dark rounded-full flex items-center justify-center transition-all cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {count > 0 && <span className="font-bold text-sm w-4 text-center text-bistro-dark">{count}</span>}
                      <button
                        id={`add-meze-${ing.id}`}
                        onClick={() => handleAdd(ing.id)}
                        className="w-7 h-7 bg-bistro-gold hover:bg-bistro-gold-dark text-bistro-dark rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sides */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-bistro-gold mb-3 flex items-center gap-2">
              🫒 {lang === 'sr' ? 'Prilozi & Mazalice' : 'Sides & Condiments'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MEZE_INGREDIENTS.filter((i) => i.category === 'sides').map((ing) => {
                const count = selections[ing.id] || 0;
                return (
                  <div
                    key={ing.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      count > 0
                        ? 'bg-white border-bistro-gold shadow-sm'
                        : 'bg-transparent border-bistro-gold/10 hover:border-bistro-gold/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl select-none">{ing.icon}</span>
                      <div>
                        <p className="font-semibold text-sm text-bistro-dark">{ing.name[lang]}</p>
                        <p className="text-xs text-bistro-muted font-mono">
                          {ing.weight}g · €{ing.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {count > 0 && (
                        <button
                          id={`remove-meze-${ing.id}`}
                          onClick={() => handleRemove(ing.id)}
                          className="w-7 h-7 bg-bistro-sand hover:bg-bistro-gold/10 text-bistro-dark rounded-full flex items-center justify-center transition-all cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {count > 0 && <span className="font-bold text-sm w-4 text-center text-bistro-dark">{count}</span>}
                      <button
                        id={`add-meze-${ing.id}`}
                        onClick={() => handleAdd(ing.id)}
                        className="w-7 h-7 bg-bistro-gold hover:bg-bistro-gold-dark text-bistro-dark rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Board visualizer workspace (Col: 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white border border-bistro-gold/15 rounded-2xl p-6 shadow-sm min-h-[380px]">
          {/* Header info */}
          <div className="text-center pb-4 border-b border-bistro-sand">
            <h4 className="font-serif font-bold text-lg text-bistro-dark">
              {lang === 'sr' ? 'Drvena daska za predjelo' : 'Artisan Wooden Board'}
            </h4>
            <p className="text-xs text-bistro-muted">
              {lang === 'sr' ? 'Sastojci se aranžiraju sveže pred serviranje' : 'Ingredients arranged fresh upon ordering'}
            </p>
          </div>

          {/* Wooden board preview container */}
          <div className="relative flex items-center justify-center py-6">
            {/* Round wooden board style background */}
            <div className="w-64 h-64 rounded-full bg-[#bf8e54] border-8 border-[#9e7039] shadow-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-2 border-2 border-dashed border-[#855a28]/40 rounded-full" />
              {/* Wooden texture streaks */}
              <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-transparent via-black to-transparent pointer-events-none" />

              {/* Centered plate info if empty */}
              {!hasItems ? (
                <div className="text-center p-4 z-10">
                  <span className="text-4xl block mb-2 select-none">🪵</span>
                  <p className="text-xs font-bold text-amber-950">
                    {lang === 'sr' ? 'Prazna daska' : 'Empty Platter'}
                  </p>
                  <p className="text-[10px] text-amber-950/75 mt-0.5">
                    {lang === 'sr' ? 'Izaberite sastojke levo' : 'Add ingredients from left'}
                  </p>
                </div>
              ) : (
                /* Arranged pieces scattered around the plate circular layout */
                <div className="absolute inset-0 z-10 p-6 flex flex-wrap items-center justify-center gap-3">
                  <AnimatePresence>
                    {selectedItems.map(({ item, quantity }) => (
                      <motion.div
                        key={item.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="bg-[#faf8f5]/90 px-2 py-1 rounded-full border border-amber-950/20 shadow-sm flex items-center gap-1 cursor-default text-xs font-bold text-bistro-dark"
                      >
                        <span>{item.icon}</span>
                        <span className="text-xxs uppercase tracking-tight">{item.name[lang].split(' ')[0]}</span>
                        <span className="bg-bistro-gold/30 text-bistro-dark font-black text-[10px] px-1 rounded-full">
                          {quantity}x
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Calculations Footer */}
          <div className="border-t border-bistro-sand pt-4">
            <div className="grid grid-cols-3 gap-2 text-center mb-5">
              <div className="bg-bistro-cream p-2 rounded-lg border border-bistro-gold/10">
                <span className="text-xxs uppercase tracking-wider text-bistro-muted block">
                  {DICTIONARY.totalWeight[lang]}
                </span>
                <span className="font-mono font-bold text-sm text-bistro-dark">{totalWeight}g</span>
              </div>
              <div className="bg-bistro-cream p-2 rounded-lg border border-bistro-gold/10">
                <span className="text-xxs uppercase tracking-wider text-bistro-muted block">
                  {DICTIONARY.calories[lang]}
                </span>
                <span className="font-mono font-bold text-sm text-bistro-dark">{totalCalories} kcal</span>
              </div>
              <div className="bg-bistro-cream p-2 rounded-lg border border-bistro-gold/10">
                <span className="text-xxs uppercase tracking-wider text-bistro-muted block">
                  {DICTIONARY.totalPrice[lang]}
                </span>
                <span className="font-mono font-bold text-sm text-bistro-gold-dark">€{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit button */}
            <button
              id="show-custom-meze-instructions"
              onClick={() => setShowInstructions(true)}
              disabled={!hasItems}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                hasItems
                  ? 'bg-bistro-gold hover:bg-bistro-gold-dark text-bistro-dark shadow-md cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>📋</span>
              <span>
                {lang === 'sr' ? 'Prikaži sastojke osoblju' : lang === 'sq' ? 'Tregoni përbërësit stafit' : 'Show ingredients to staff'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Local Instructions Modal */}
      <AnimatePresence>
        {showInstructions && (
          <div id="meze-instructions-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInstructions(false)}
              className="absolute inset-0 bg-bistro-dark/65 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-bistro-gold/20 w-full max-w-md rounded-2xl p-6 shadow-2xl relative z-10"
            >
              <button
                id="close-meze-instructions"
                onClick={() => setShowInstructions(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-bistro-sand text-bistro-dark transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-5">
                <span className="text-3xl">🪵</span>
                <h3 className="font-serif font-bold text-xl text-bistro-dark mt-2">
                  {lang === 'sr' ? 'Vaša Prilagođena Daska' : lang === 'sq' ? 'Mezeja Juaj e Personalizuar' : 'Your Custom Board'}
                </h3>
                <p className="text-xxs uppercase tracking-widest text-bistro-gold-dark font-bold font-mono mt-1">
                  {lang === 'sr' ? 'DOSTUPNO I ZA PONIJETI!' : lang === 'sq' ? 'E DISPONUESHME EDHE PËR MARRJE!' : 'TAKEAWAY AVAILABLE!'}
                </p>
              </div>

              <div className="bg-bistro-sand/30 border border-bistro-gold/10 rounded-xl p-4 mb-5 space-y-3 font-sans">
                <p className="text-xs text-bistro-muted uppercase tracking-wider font-bold">
                  {lang === 'sr' ? 'Odabrani sastojci:' : lang === 'sq' ? 'Përbërësit e zgjedhur:' : 'Selected ingredients:'}
                </p>
                <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedItems.map(({ item, quantity }) => (
                    <li key={item.id} className="flex justify-between items-center text-xs text-bistro-dark border-b border-bistro-gold/5 pb-1.5 last:border-0 last:pb-0 font-medium">
                      <span className="flex items-center gap-1.5">
                        <span className="select-none">{item.icon}</span>
                        <span>{item.name[lang]}</span>
                      </span>
                      <span className="font-mono bg-bistro-gold/20 text-bistro-dark font-bold px-2 py-0.5 rounded-full text-[10px]">
                        {quantity}x ({item.weight * quantity}g)
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-bistro-gold/15 pt-3 flex justify-between items-center text-sm font-bold text-bistro-dark">
                  <span>Ukupno / Total:</span>
                  <span className="text-bistro-gold-dark font-mono font-extrabold text-base">€{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 text-amber-900 text-xs">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">
                    {lang === 'sr' ? 'Pokažite ovaj ekran osoblju' : lang === 'sq' ? 'Tregoni këtë ekran stafit' : 'Show this screen to our staff'}
                  </p>
                  <p className="text-[11px] leading-relaxed mt-0.5 text-amber-950/80">
                    {lang === 'sr' && 'Naše osoblje će odmah pripremiti dasku sa ovim sastojcima za vas u restoranu ili zapakovati za ponijeti!'}
                    {lang === 'en' && 'Our staff will instantly arrange this custom board for you to enjoy here or packed as a takeaway order!'}
                    {lang === 'sq' && 'Stafi ynë do të përgatisë menjëherë pjatën me këta përbërës për ju ose do ta paketojë për t\'u marrë me vete!'}
                  </p>
                </div>
              </div>

              <button
                id="close-meze-instructions-confirm"
                onClick={() => setShowInstructions(false)}
                className="w-full bg-bistro-gold hover:bg-bistro-gold-dark text-bistro-dark font-bold py-3 px-4 rounded-xl mt-5 text-xs transition-colors cursor-pointer"
              >
                {lang === 'sr' ? 'U redu, hvala' : lang === 'sq' ? 'Në rregull, faleminderit' : 'Okay, thank you'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
