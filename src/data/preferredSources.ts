export type PreferredSource = {
  id: string;
  label: string;
  description: string;
};

export const PREFERRED_SOURCES: PreferredSource[] = [
  {
    id: "bbc_good_food",
    label: "BBC Good Food",
    description: "Big, reliable collection of everyday UK recipes with sensible ingredients."
  },
  {
    id: "bbc_food",
    label: "BBC Food",
    description: "Recipes from BBC programmes and chefs, with strong basics and classics."
  },
  {
    id: "tesco_real_food",
    label: "Tesco Real Food",
    description: "Supermarket-friendly recipes with ingredients you can actually buy in UK shops, including diabetes-friendly dishes."
  },
  {
    id: "guardian_feast",
    label: "Guardian Feast",
    description: "More adventurous and global recipes from the Guardian’s food writers."
  },
  {
    id: "mob",
    label: "Mob",
    description: "Younger, fast-moving recipes focused on bold flavour and simple prep."
  },
  {
    id: "delicious_magazine",
    label: "delicious. magazine",
    description: "Polished midweek and weekend recipes with good how-to detail."
  },
  {
    id: "the_happy_foodie",
    label: "The Happy Foodie",
    description: "Cookbook-driven recipes from well-known authors and new releases."
  },
  {
    id: "kitchen_sanctuary",
    label: "Kitchen Sanctuary",
    description: "Tried-and-tested comfort food with clear instructions and videos."
  },
  {
    id: "diabetes_uk",
    label: "Diabetes UK recipes",
    description: "Nutritionally checked recipes designed for people living with diabetes."
  },
  {
    id: "tesco_diabetes",
    label: "Tesco diabetes recipes",
    description: "Diabetes UK-approved recipes using mainstream supermarket ingredients."
  },
  {
    id: "slimming_world_diabetes",
    label: "Slimming World & Diabetes UK",
    description: "Lighter, portion-aware recipes developed with Diabetes UK."
  },
  {
    id: "bbc_low_gi",
    label: "BBC low-GI & diabetes",
    description: "Quick, diabetes-friendly and low-GI ideas from BBC recipe collections."
  }
];
