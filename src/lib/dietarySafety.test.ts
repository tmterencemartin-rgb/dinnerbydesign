import { describe, it, expect } from 'vitest';
import { passesDietaryRule, passesHardConstraints, passesPortionConstraints } from './dietarySafety';
import { Recipe, ReadyMeal, SavedRecipe } from '../types';

describe('Portion and Hard Constraints Safety Layer', () => {
  const baseRecipe: Recipe = {
    title: 'Vegetable Pasta',
    description: 'A delicious pasta with veggies',
    ingredients: ['Pasta', 'Tomato', 'Basil'],
    instructions: [],
    cuisine: 'Italian',
    totalTime: 30,
    saladType: 'none',
    isVegetarian: true,
    isPescatarian: true,
    isVegan: true,
    dietFlagsVerified: true,
    calories: 800,
    caloriesPerPortion: 400,
    costPerPortion: '£2.50',
    totalServings: 2
  };

  describe('passesPortionConstraints', () => {
    it('should respect calorie ceiling on per-portion basis', () => {
      const prefs = { calorieCeiling: 500, budgetLimit: null };
      expect(passesPortionConstraints(baseRecipe, prefs)).toBe(true);
      
      const highCal = { ...baseRecipe, caloriesPerPortion: 600 };
      expect(passesPortionConstraints(highCal, prefs)).toBe(false);
    });

    it('should respect budget limit on per-portion basis', () => {
      const prefs = { calorieCeiling: null, budgetLimit: 3 };
      expect(passesPortionConstraints(baseRecipe, prefs)).toBe(true);
      
      const expensive = { ...baseRecipe, costPerPortion: '£4.50' };
      expect(passesPortionConstraints(expensive, prefs)).toBe(false);
    });

    it('should handle ready meal price strings', () => {
      const meal: ReadyMeal = {
        title: 'Ready Meal',
        description: 'Meal',
        retailer: 'Tesco',
        cuisine: 'British',
        totalTime: 5,
        saladType: 'none',
        price: '£4.00',
        calories: 350,
        isVegetarian: true,
        isPescatarian: true,
        isVegan: true,
        dietFlagsVerified: true
      };
      
      expect(passesPortionConstraints(meal, { calorieCeiling: null, budgetLimit: 5 })).toBe(true);
      expect(passesPortionConstraints(meal, { calorieCeiling: null, budgetLimit: 3 })).toBe(false);
    });
  });

  describe('passesHardConstraints', () => {
    const prefs = {
      dietaryRule: 'vegetarian' as const,
      allergies: ['nuts'],
      exclusions: ['olives'],
      religiousEthical: [],
      calorieCeiling: 500,
      budgetLimit: 5
    };

    it('should pass matching recipe', () => {
      expect(passesHardConstraints(baseRecipe, prefs)).toBe(true);
    });

    it('should block if dietary rule fails', () => {
      const meatPasta = { ...baseRecipe, title: 'Meat Pasta', isVegetarian: false };
      expect(passesHardConstraints(meatPasta, prefs)).toBe(false);
    });

    it('should block if allergy keyword is found', () => {
      const nutty = { ...baseRecipe, ingredients: ['Pasta', 'Peanuts'] };
      const prefsWithPeanuts = { ...prefs, allergies: ['Peanut'] };
      expect(passesHardConstraints(nutty, prefsWithPeanuts)).toBe(false);
    });

    it('should block if portion constraints fail', () => {
      const expensive = { ...baseRecipe, costPerPortion: '£6.00' };
      expect(passesHardConstraints(expensive, prefs)).toBe(false);
    });
  });
});

describe('passesDietaryRule Deterministic Safety Net', () => {
  const baseRecipe: Recipe = {
    title: 'Vegetable Pasta',
    description: 'A delicious pasta with veggies',
    ingredients: ['Pasta', 'Tomato', 'Basil'],
    instructions: [],
    cuisine: 'Italian',
    totalTime: 30,
    saladType: 'none',
    isVegetarian: true,
    isPescatarian: true,
    isVegan: true,
    dietFlagsVerified: true,
    totalServings: 2
  };

  const baseMeal: ReadyMeal = {
    title: 'Veggie Meal',
    description: 'A quick meal',
    retailer: 'Waitrose',
    price: '£5',
    cuisine: 'British',
    totalTime: 10,
    saladType: 'none',
    isVegetarian: true,
    isPescatarian: true,
    isVegan: true,
    dietFlagsVerified: true,
  };

  it('should fail closed if dietFlagsVerified is false', () => {
    const unverified = { ...baseRecipe, dietFlagsVerified: false };
    expect(passesDietaryRule(unverified, 'vegetarian')).toBe(false);
    expect(passesDietaryRule(unverified, 'pescatarian')).toBe(false);
    expect(passesDietaryRule(unverified, 'vegan')).toBe(false);
  });

  describe('Vegetarian Rules', () => {
    it('should pass valid vegetarian recipes', () => {
      expect(passesDietaryRule(baseRecipe, 'vegetarian')).toBe(true);
    });

    it('should block obvious meat in title', () => {
      const beefPasta = { ...baseRecipe, title: 'Beef Pasta', isVegetarian: true }; // Flagged incorrectly
      expect(passesDietaryRule(beefPasta, 'vegetarian')).toBe(false);
    });

    it('should block hidden meat in ingredients (Bacon)', () => {
      const baconDish = { ...baseRecipe, ingredients: ['Pasta', 'Bacon'], isVegetarian: true };
      expect(passesDietaryRule(baconDish, 'vegetarian')).toBe(false);
    });

    it('should block fish in vegetarian (Anchovy)', () => {
      const anchovyPaste = { ...baseRecipe, title: 'Anchovy Paste', isVegetarian: true };
      expect(passesDietaryRule(anchovyPaste, 'vegetarian')).toBe(false);
    });

    it('should block specific sauces (Fish Sauce)', () => {
      const curry = { ...baseRecipe, ingredients: ['Tofu', 'Fish sauce'], isVegetarian: true };
      expect(passesDietaryRule(curry, 'vegetarian')).toBe(false);
    });

    it('should block spelling variants and plurals', () => {
      const sausages = { ...baseRecipe, title: 'Veggie Sausages', isVegetarian: true }; 
      expect(passesDietaryRule(sausages, 'vegetarian')).toBe(false);
    });

    it('should block gelatin/gelatine', () => {
      const jelly = { ...baseRecipe, ingredients: ['Fruit', 'Gelatine'], isVegetarian: true };
      expect(passesDietaryRule(jelly, 'vegetarian')).toBe(false);
    });

    it('should block animal-based stocks', () => {
      const soup = { ...baseRecipe, description: 'Simmered in chicken stock', isVegetarian: true };
      expect(passesDietaryRule(soup, 'vegetarian')).toBe(false);
    });
  });

  describe('Pescatarian Rules', () => {
    it('should pass recipes with fish', () => {
      const salmon = { ...baseRecipe, title: 'Salmon Steak', isVegetarian: false, isPescatarian: true };
      expect(passesDietaryRule(salmon, 'pescatarian')).toBe(true);
    });

    it('should block meat in pescatarian (Chicken)', () => {
      const chickenFish = { ...baseRecipe, title: 'Chicken and Fish', isPescatarian: true };
      expect(passesDietaryRule(chickenFish, 'pescatarian')).toBe(false);
    });

    it('should block lard/suet in pescatarian', () => {
      const fishPie = { ...baseRecipe, ingredients: ['Fish', 'Lard in crust'], isPescatarian: true };
      expect(passesDietaryRule(fishPie, 'pescatarian')).toBe(false);
    });
  });

  describe('Vegan Rules', () => {
    it('should block dairy (Milk, Cheese)', () => {
      const cheesyPasta = { ...baseRecipe, ingredients: ['Pasta', 'Cheese'], isVegan: true };
      expect(passesDietaryRule(cheesyPasta, 'vegan')).toBe(false);
    });

    it('should block eggs', () => {
      const eggFriedRice = { ...baseRecipe, title: 'Egg Fried Rice', isVegan: true };
      expect(passesDietaryRule(eggFriedRice, 'vegan')).toBe(false);
    });

    it('should block honey', () => {
      const granola = { ...baseRecipe, ingredients: ['Oats', 'Honey'], isVegan: true };
      expect(passesDietaryRule(granola, 'vegan')).toBe(false);
    });

    it('should handle hidden vegan violations (Isinglass, Carmine)', () => {
      const beer = { ...baseRecipe, ingredients: ['Water', 'Hops', 'Isinglass'], isVegan: true };
      expect(passesDietaryRule(beer, 'vegan')).toBe(false);
    });

    it('should block specific cheeses like Parmesan (Rennet)', () => {
      const pasta = { ...baseRecipe, ingredients: ['Pasta', 'Parmesan'], isVegan: true };
      expect(passesDietaryRule(pasta, 'vegan')).toBe(false);
    });
  });

  describe('Retailer Format & Edge Cases', () => {
    it('should handle common retailer allergen brackets', () => {
      const meal = { ...baseMeal, ingredients: ['Pasta', 'Cheese (Milk)', 'Pork'], isVegetarian: true };
      expect(passesDietaryRule(meal, 'vegetarian')).toBe(false);
    });

    it('should handle "CONTAINS" statements', () => {
      const meal = { ...baseMeal, description: 'CONTAINS: CHICKEN, WHEAT', isVegetarian: true };
      expect(passesDietaryRule(meal, 'vegetarian')).toBe(false);
    });

    it('should avoid false positives on words like "eggplant"', () => {
      const eggplantDish = { ...baseRecipe, title: 'Roasted Eggplant', isVegan: true };
      expect(passesDietaryRule(eggplantDish, 'vegan')).toBe(true);
    });

    it('should avoid false positives on words like "honeydew"', () => {
      const melon = { ...baseRecipe, title: 'Honeydew Melon', isVegan: true };
      expect(passesDietaryRule(melon, 'vegan')).toBe(true);
    });
  });
});
