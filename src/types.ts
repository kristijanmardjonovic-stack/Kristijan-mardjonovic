export enum Category {
  BREAKFAST = 'breakfast',
  FOOD = 'food',
  PIZZA = 'pizza',
  HOT_DRINKS = 'hot_drinks',
  NON_ALCOHOLIC = 'non_alcoholic',
  BEERS = 'beers',
  WINES = 'wines',
  ALCOHOL = 'alcohol',
  COCKTAILS = 'cocktails',
  DESSERTS = 'desserts',
}

export type Language = 'en' | 'sq' | 'sr';

export interface Translation {
  sr: string;
  en: string;
  sq: string;
}

export interface ArrayTranslation {
  sr: string[];
  en: string[];
  sq: string[];
}

export interface Dish {
  id: string;
  name: Translation;
  description: Translation;
  price: number;
  category: Category;
  image: string;
  allergens: string[]; // e.g., 'gluten', 'dairy', 'nuts', 'seafood'
  dietary: ('veg' | 'vegan' | 'gf' | 'spicy')[];
  calories: number;
  prepTime: number; // in minutes
  featured: boolean;
  ingredients: ArrayTranslation;
}

export interface CartItem {
  dish: Dish;
  quantity: number;
  notes?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}
