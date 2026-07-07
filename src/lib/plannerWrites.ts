import {
  Firestore,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { ReadyMeal, Recipe, SavedRecipe } from '../types';
import { isSameRecipe } from './recipeUtils';
import { prepareSavedRecipeData } from './savedRecipeData';

export interface PlannerUpdateDecision {
  existingOnDay?: SavedRecipe;
  existingInSaved?: SavedRecipe;
  finalId: string;
  isNew: boolean;
}

export const getPlannerUpdateDecision = ({
  savedRecipes,
  scheduledDate,
  recipe,
  newId,
}: {
  savedRecipes: SavedRecipe[];
  scheduledDate: string;
  recipe: SavedRecipe | Recipe | ReadyMeal;
  newId: string;
}): PlannerUpdateDecision => {
  const existingOnDay = getScheduledRecipeForDay(savedRecipes, scheduledDate);
  const existingInSaved = savedRecipes.find(item => isSameRecipe(item, recipe));
  const finalId = existingInSaved?.id || newId;

  return {
    existingOnDay,
    existingInSaved,
    finalId,
    isNew: !existingInSaved,
  };
};

export const getScheduledRecipeForDay = (
  savedRecipes: SavedRecipe[],
  scheduledDate: string
) => savedRecipes.find(item => item.scheduledDate === scheduledDate);

export const updatePlannerRecipe = async ({
  firestoreDb,
  userId,
  savedRecipes,
  scheduledDate,
  recipe,
}: {
  firestoreDb: Firestore;
  userId: string;
  savedRecipes: SavedRecipe[];
  scheduledDate: string;
  recipe: SavedRecipe | Recipe | ReadyMeal;
}) => {
  const batch = writeBatch(firestoreDb);
  const generatedId = doc(collection(firestoreDb, 'users', userId, 'savedRecipes')).id;
  const decision = getPlannerUpdateDecision({
    savedRecipes,
    scheduledDate,
    recipe,
    newId: generatedId,
  });

  if (decision.existingOnDay?.id) {
    batch.update(doc(firestoreDb, 'users', userId, 'savedRecipes', decision.existingOnDay.id), {
      scheduledDate: null,
      updatedAt: serverTimestamp(),
    });
  }

  const cleanData = prepareSavedRecipeData(recipe, userId, scheduledDate, {
    savedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  batch.set(doc(firestoreDb, 'users', userId, 'savedRecipes', decision.finalId), cleanData, { merge: true });
  await batch.commit();

  return {
    id: decision.finalId,
    wasUnscheduledId: decision.existingOnDay?.id,
    isNew: decision.isNew,
  };
};

export const unschedulePlannerRecipe = async ({
  firestoreDb,
  userId,
  recipeId,
}: {
  firestoreDb: Firestore;
  userId: string;
  recipeId: string;
}) => {
  await updateDoc(doc(firestoreDb, 'users', userId, 'savedRecipes', recipeId), {
    scheduledDate: null,
    updatedAt: serverTimestamp(),
  });
};

export const clearPlannerWeekRecipes = async ({
  firestoreDb,
  userId,
  planner,
}: {
  firestoreDb: Firestore;
  userId: string;
  planner: SavedRecipe[];
}) => {
  const batch = writeBatch(firestoreDb);
  planner.forEach(item => {
    if (item.id) {
      batch.update(doc(firestoreDb, 'users', userId, 'savedRecipes', item.id), {
        scheduledDate: null,
        updatedAt: serverTimestamp(),
      });
    }
  });
  await batch.commit();
};

export const isMissingPlannerRecipeError = (err: any) => (
  err?.code === 'not-found' ||
  !!err?.message?.includes('not-found') ||
  !!err?.message?.includes('No document to update')
);
