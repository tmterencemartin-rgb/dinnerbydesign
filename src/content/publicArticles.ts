import { UK_FOOD_COSTS_2026, UK_FOOD_COSTS_2026_PATH } from './seoFoodCostGuides';
import { FIVE_DINNERS_FOR_TWO_UNDER_40, FIVE_DINNERS_FOR_TWO_UNDER_40_PATH } from './seoMealPlans';

export interface PublicArticleLink {
  title: string;
  path: string;
  category: string;
  reviewedAt: string;
  status: 'published' | 'draft' | 'retired';
}

export const PUBLIC_ARTICLES: PublicArticleLink[] = [
  {
    title: UK_FOOD_COSTS_2026.title,
    path: UK_FOOD_COSTS_2026_PATH,
    category: 'Food cost guide',
    reviewedAt: UK_FOOD_COSTS_2026.reviewedAt,
    status: 'published',
  },
  {
    title: FIVE_DINNERS_FOR_TWO_UNDER_40.title,
    path: FIVE_DINNERS_FOR_TWO_UNDER_40_PATH,
    category: 'Dinner plan',
    reviewedAt: FIVE_DINNERS_FOR_TWO_UNDER_40.reviewedAt,
    status: FIVE_DINNERS_FOR_TWO_UNDER_40.status,
  },
];

export const PUBLISHED_ARTICLES = PUBLIC_ARTICLES.filter(article => article.status === 'published');
