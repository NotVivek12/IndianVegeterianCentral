export interface Place {
  id: string;
  name: string;
  coords: [number, number];
  distance: number;
  vegScore: number;
  openNow: boolean;
  priceLevel: number;
  tags: string[];
  sampleDishes: string[];
}

export interface Country {
  code: string;
  name: string;
  dishes: Dish[];
  groceryTips: string[];
  pitfalls: string[];
  phrases: { askVeg: string };
}

export interface Dish {
  localName: string;
  englishName: string;
  description: string;
  dietTags: string[];
  commonIngredients: string[];
  caveats: string[];
}

export interface ProductScanResult {
  product: any; // Replace 'any' with a more specific type if possible
  vegScore: number;
  riskFlags: string[];
  explanation: string;
}

export interface MenuParseResult {
  name: string;
  translation: string;
  isVeg: boolean;
  dietTags: string[];
  riskNotes: string[];
}

export interface Recipe {
  title: string;
  time: string;
  ingredients: string[];
  steps: string[];
  substitutions: string[];
  riskNotes: string[];
}
