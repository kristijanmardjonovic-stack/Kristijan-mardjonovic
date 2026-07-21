import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, ArrowUpDown, Check, X } from 'lucide-react';
import { DISHES, DICTIONARY, DIETARY_LABELS } from '../data';
import { Dish, Category, Language } from '../types';
import DishCard from './DishCard';

interface MenuGridProps {
  lang: Language;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onOpenDetails: (dish: Dish) => void;
}

export default function MenuGrid({
  lang,
  favorites,
  onToggleFavorite,
  onOpenDetails,
}: MenuGridProps) {
  // Filters & Sorting state
  const [search, setSearch] = useState('');
  const [superCategory, setSuperCategory] = useState<'all' | 'food' | 'drinks'>('all');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedDietary, setSelectedDietary] = useState<('veg' | 'vegan' | 'gf' | 'spicy')[]>([]);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'time' | 'calories'>('price_asc');
  const [showFilters, setShowFilters] = useState(false);

  // Groupings of categories
  const FOOD_CATEGORIES = [Category.BREAKFAST, Category.FOOD, Category.PIZZA, Category.DESSERTS];
  const DRINKS_CATEGORIES = [
    Category.HOT_DRINKS,
    Category.NON_ALCOHOLIC,
    Category.BEERS,
    Category.WINES,
    Category.ALCOHOL,
    Category.COCKTAILS,
  ];

  const CATEGORY_ORDER = [
    Category.BREAKFAST,
    Category.FOOD,
    Category.PIZZA,
    Category.DESSERTS,
    Category.HOT_DRINKS,
    Category.NON_ALCOHOLIC,
    Category.BEERS,
    Category.WINES,
    Category.ALCOHOL,
    Category.COCKTAILS,
  ];

  const visibleCategories = useMemo(() => {
    let cats = Object.values(Category);
    if (superCategory === 'food') cats = FOOD_CATEGORIES;
    else if (superCategory === 'drinks') cats = DRINKS_CATEGORIES;
    
    // Maintain a consistent, beautifully-ordered category listing
    return CATEGORY_ORDER.filter((cat) => cats.includes(cat));
  }, [superCategory]);

  const superCategoryLabels = {
    all: { sr: 'Sve jela', en: 'All Dishes', sq: 'Të gjitha' },
    food: { sr: 'Hrana 🍔', en: 'Food 🍔', sq: 'Ushqim 🍔' },
    drinks: { sr: 'Sokovi i pića 🍹', en: 'Drinks & Juices 🍹', sq: 'Lëngje & Pije 🍹' }
  };

  // Toggle dietary tag filter
  const handleToggleDietary = (tag: 'veg' | 'vegan' | 'gf' | 'spicy') => {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setSuperCategory('all');
    setSelectedCategory('all');
    setSelectedDietary([]);
    setSortBy('price_asc');
  };

  // Perform filtering & sorting in memory
  const filteredDishes = useMemo(() => {
    let result = [...DISHES];

    // 0. Super Category Division (Food vs Drinks)
    if (superCategory === 'food') {
      result = result.filter((dish) => FOOD_CATEGORIES.includes(dish.category));
    } else if (superCategory === 'drinks') {
      result = result.filter((dish) => DRINKS_CATEGORIES.includes(dish.category));
    }

    // 1. Search Query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (dish) =>
          dish.name[lang].toLowerCase().includes(q) ||
          dish.description[lang].toLowerCase().includes(q) ||
          dish.ingredients[lang].some((ing) => ing.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter((dish) => dish.category === selectedCategory);
    }

    // 3. Multi-dietary Filter
    if (selectedDietary.length > 0) {
      result = result.filter((dish) =>
        selectedDietary.every((dietTag) => dish.dietary.includes(dietTag))
      );
    }

    // 4. Sorting
    result.sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'time') return a.prepTime - b.prepTime;
      if (sortBy === 'calories') return a.calories - b.calories;
      return 0;
    });

    return result;
  }, [search, superCategory, selectedCategory, selectedDietary, sortBy, lang]);

  // Count items per category (for badges)
  const categoryCounts = useMemo(() => {
    let baseDishes = DISHES;
    if (superCategory === 'food') {
      baseDishes = DISHES.filter((d) => FOOD_CATEGORIES.includes(d.category));
    } else if (superCategory === 'drinks') {
      baseDishes = DISHES.filter((d) => DRINKS_CATEGORIES.includes(d.category));
    }

    const counts: Record<string, number> = { all: baseDishes.length };
    Object.values(Category).forEach((cat) => {
      counts[cat] = DISHES.filter((d) => d.category === cat).length;
    });
    return counts;
  }, [superCategory]);

  const categoryIcons: Record<Category, string> = {
    [Category.BREAKFAST]: '🍳',
    [Category.FOOD]: '🍔',
    [Category.PIZZA]: '🍕',
    [Category.HOT_DRINKS]: '☕',
    [Category.NON_ALCOHOLIC]: '🥤',
    [Category.BEERS]: '🍺',
    [Category.WINES]: '🍷',
    [Category.ALCOHOL]: '🥃',
    [Category.COCKTAILS]: '🍹',
    [Category.DESSERTS]: '🍰',
  };

  // Group the filtered dishes by category
  const groupedDishes = useMemo(() => {
    const groups: Record<Category, Dish[]> = {} as Record<Category, Dish[]>;
    Object.values(Category).forEach((cat) => {
      groups[cat] = [];
    });
    filteredDishes.forEach((dish) => {
      if (groups[dish.category]) {
        groups[dish.category].push(dish);
      }
    });
    return groups;
  }, [filteredDishes]);

  // Which categories to render (only those with dishes and part of current filters)
  const activeCategoriesToRender = useMemo(() => {
    return CATEGORY_ORDER.filter((cat) => {
      const isInSuper = superCategory === 'all' || 
        (superCategory === 'food' && FOOD_CATEGORIES.includes(cat)) ||
        (superCategory === 'drinks' && DRINKS_CATEGORIES.includes(cat));
      
      const hasDishes = groupedDishes[cat] && groupedDishes[cat].length > 0;
      
      return isInSuper && hasDishes;
    });
  }, [groupedDishes, superCategory]);

  return (
    <div id="menu-grid-workspace" className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Super Category Switcher - Segment Control */}
      <div className="w-full grid grid-cols-3 gap-1 p-1 bg-bistro-sand rounded-2xl max-w-lg mx-auto border border-bistro-gold/10 shadow-xs">
        {(['all', 'food', 'drinks'] as const).map((sc) => {
          const active = superCategory === sc;
          return (
            <button
              key={sc}
              id={`super-cat-tab-${sc}`}
              onClick={() => {
                setSuperCategory(sc);
                setSelectedCategory('all');
              }}
              className={`py-2 px-1 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center text-center leading-tight ${
                active
                  ? 'bg-bistro-dark text-bistro-cream shadow-sm font-extrabold'
                  : 'text-bistro-charcoal hover:bg-white/40'
              }`}
            >
              {superCategoryLabels[sc][lang]}
            </button>
          );
        })}
      </div>

      {/* Search & Category tabs container */}
      <div className="space-y-4 w-full max-w-full overflow-hidden">
        {/* Search Input and Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-bistro-muted" />
            <input
              id="menu-search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={DICTIONARY.searchPlaceholder[lang]}
              className="w-full pl-10 pr-4 py-3 bg-white border border-bistro-gold/15 focus:border-bistro-gold outline-none rounded-xl text-sm transition-all shadow-xs"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-bistro-muted hover:text-bistro-dark cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            id="toggle-filters-btn"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 border rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              showFilters || selectedDietary.length > 0
                ? 'bg-bistro-gold text-bistro-dark border-bistro-gold-dark shadow-sm'
                : 'bg-white border-bistro-gold/15 hover:border-bistro-gold/30 text-bistro-charcoal'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{DICTIONARY.dietaryFilter[lang]}</span>
            {selectedDietary.length > 0 && (
              <span className="bg-bistro-dark text-bistro-cream font-bold text-xxs w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {selectedDietary.length}
              </span>
            )}
          </button>
        </div>

        {/* Expandable Dietary Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              id="expandable-filters-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white border border-bistro-gold/10 p-4 rounded-xl shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-1">
                {/* Dietary Tags Selectors */}
                <div className="sm:col-span-2 lg:col-span-3 space-y-2">
                  <span className="text-xxs uppercase tracking-wider font-bold text-bistro-muted block mb-1">
                    🌱 {DICTIONARY.dietaryFilter[lang]}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(DIETARY_LABELS).map(([tag, value]) => {
                      const isActive = selectedDietary.includes(tag as any);
                      return (
                        <button
                          key={tag}
                          id={`dietary-filter-${tag}`}
                          onClick={() => handleToggleDietary(tag as any)}
                          className={`text-xs px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition-all cursor-pointer ${
                            isActive
                              ? `${value.color} scale-102 border-current ring-1 ring-bistro-gold/30`
                              : 'bg-bistro-cream text-bistro-muted border-bistro-gold/10 hover:border-bistro-gold/35'
                          }`}
                        >
                          <span>{value.icon}</span>
                          <span>{value.label[lang]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sorting Selectors */}
                <div>
                  <label
                    htmlFor="sort-menu-by"
                    className="text-xxs uppercase tracking-wider font-bold text-bistro-muted block mb-1"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 inline mr-1 text-bistro-gold" />
                    {DICTIONARY.sortBy[lang]}
                  </label>
                  <select
                    id="sort-menu-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full text-xs bg-bistro-cream border border-bistro-gold/15 focus:border-bistro-gold outline-none p-2 rounded-lg font-medium text-bistro-dark transition-all"
                  >
                    <option value="price_asc">{DICTIONARY.priceAsc[lang]}</option>
                    <option value="price_desc">{DICTIONARY.priceDesc[lang]}</option>
                    <option value="time">{DICTIONARY.timeAsc[lang]}</option>
                    <option value="calories">{DICTIONARY.caloriesAsc[lang]}</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category animated selector row - wrapped in overflow-x protection */}
        <div className="w-full max-w-full overflow-hidden">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
            {/* ALL Category button */}
            <button
              id="cat-tab-all"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 snap-center shrink-0 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-bistro-dark text-bistro-cream font-bold shadow-sm'
                  : 'bg-white hover:bg-bistro-sand border border-bistro-gold/10 text-bistro-charcoal'
              }`}
            >
              {DICTIONARY.allCategories[lang]}
              <span className={`text-[10px] ml-1.5 px-1.5 py-0.5 rounded-full ${
                selectedCategory === 'all' ? 'bg-bistro-gold text-bistro-dark' : 'bg-bistro-sand text-bistro-muted'
              }`}>
                {categoryCounts.all}
              </span>
            </button>

            {/* Individual categories */}
            {visibleCategories.map((cat) => {
              const count = categoryCounts[cat];
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`cat-tab-${cat}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 snap-center shrink-0 cursor-pointer ${
                    active
                      ? 'bg-bistro-dark text-bistro-cream font-bold shadow-sm'
                      : 'bg-white hover:bg-bistro-sand border border-bistro-gold/10 text-bistro-charcoal'
                  }`}
                >
                  {DICTIONARY[cat] ? DICTIONARY[cat][lang] : cat}
                  <span className={`text-[10px] ml-1.5 px-1.5 py-0.5 rounded-full ${
                    active ? 'bg-bistro-gold text-bistro-dark' : 'bg-bistro-sand text-bistro-muted'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid rendering */}
      <AnimatePresence mode="popLayout">
        {filteredDishes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white border border-bistro-gold/10 rounded-2xl p-6"
          >
            <span className="text-4xl block mb-2 select-none">🧐</span>
            <p className="text-sm font-semibold text-bistro-charcoal">
              {lang === 'sr' ? 'Nije pronađeno nijedno jelo sa izabranim filterima.' : 'No dishes matched your selected criteria.'}
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 text-xs font-bold text-bistro-gold-dark hover:underline cursor-pointer"
            >
              {lang === 'sr' ? 'Resetujte sve filtere' : 'Reset all filters'}
            </button>
          </motion.div>
        ) : (
          <motion.div
            id="dishes-container"
            layout
            className="space-y-12"
          >
            {selectedCategory !== 'all' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    lang={lang}
                    isFavorite={favorites.includes(dish.id)}
                    onToggleFavorite={onToggleFavorite}
                    onOpenDetails={onOpenDetails}
                  />
                ))}
              </div>
            ) : (
              activeCategoriesToRender.map((cat) => {
                const catDishes = groupedDishes[cat];
                return (
                  <div key={cat} id={`category-section-${cat}`} className="space-y-6 pt-4 first:pt-0">
                    <div className="flex items-center gap-2 border-b border-bistro-gold/15 pb-2">
                      <span className="text-xl select-none">{categoryIcons[cat]}</span>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-bistro-dark tracking-wide uppercase">
                        {DICTIONARY[cat] ? DICTIONARY[cat][lang] : cat}
                      </h3>
                      <span className="text-xxs px-2 py-0.5 rounded-full bg-bistro-sand font-mono text-bistro-muted font-bold ml-1">
                        {catDishes.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {catDishes.map((dish) => (
                        <DishCard
                          key={dish.id}
                          dish={dish}
                          lang={lang}
                          isFavorite={favorites.includes(dish.id)}
                          onToggleFavorite={onToggleFavorite}
                          onOpenDetails={onOpenDetails}
                        />
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
