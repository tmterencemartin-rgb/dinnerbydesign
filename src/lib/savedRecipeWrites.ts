import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { ReadyMeal, Recipe, SavedRecipe } from '../types';
import { isSameRecipe } from './recipeUtils';
import { prepareSavedRecipeData } from './savedRecipeData';

export const findExistingSavedRecipe = (
  savedRecipes: SavedRecipe[],
  item: Recipe | ReadyMeal
) => savedRecipes.find(recipe => isSameRecipe(recipe, item));

export const getUnscheduledSavedRecipes = (savedRecipes: SavedRecipe[]) => (
  savedRecipes.filter(recipe => !recipe.scheduledDate)
);

export const saveRecipeDocument = async ({
  firestoreDb,
  userId,
  savedRecipes,
  item,
}: {
  firestoreDb: Firestore;
  userId: string;
  savedRecipes: SavedRecipe[];
  item: Recipe | ReadyMeal;
}) => {
  const existing = findExistingSavedRecipe(savedRecipes, item);
  if (existing) {
    if (existing.isArchived && existing.id) {
      await updateDoc(doc(firestoreDb, 'users', userId, 'savedRecipes', existing.id), {
        isArchived: false,
        archivedAt: null,
        updatedAt: serverTimestamp(),
      });
    }
    return existing.id;
  }

  const docRef = doc(collection(firestoreDb, 'users', userId, 'savedRecipes'));
  await setDoc(docRef, prepareSavedRecipeData(item, userId, null, {
    savedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }));
  return docRef.id;
};

export const updateRecipeDocument = async ({
  firestoreDb,
  userId,
  recipeId,
  updates,
}: {
  firestoreDb: Firestore;
  userId: string;
  recipeId: string;
  updates: Partial<SavedRecipe>;
}) => {
  await updateDoc(doc(firestoreDb, 'users', userId, 'savedRecipes', recipeId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const removeRecipeDocument = async ({
  firestoreDb,
  userId,
  recipeId,
}: {
  firestoreDb: Firestore;
  userId: string;
  recipeId: string;
}) => {
  await deleteDoc(doc(firestoreDb, 'users', userId, 'savedRecipes', recipeId));
};

export const removeAllUnscheduledSavedRecipes = async ({
  firestoreDb,
  userId,
  savedRecipes,
}: {
  firestoreDb: Firestore;
  userId: string;
  savedRecipes: SavedRecipe[];
}) => {
  const batch = writeBatch(firestoreDb);
  const unscheduled = getUnscheduledSavedRecipes(savedRecipes);

  unscheduled.forEach(recipe => {
    if (recipe.id) {
      batch.delete(doc(firestoreDb, 'users', userId, 'savedRecipes', recipe.id));
    }
  });

  await batch.commit();
  return unscheduled.length;
};
