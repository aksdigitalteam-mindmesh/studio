
export type Meal = {
  name: string;
  description: string;
  recipe: {
    ingredients: string[];
    instructions: string[];
  };
  calories: number;
  macros: {
    protein: string;
    carbs: string;
    fat: string;
  };
};

export type Recipe = {
  slug: string;
  title: string;
  category: string;
  image?: string;
  hint?: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  calories: number;
  macros: {
    protein: string;
    carbs: string;
    fat: string;
  };
};
