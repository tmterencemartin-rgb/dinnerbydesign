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
import { ShoppingListItem } from '../types';
import { costItemSync, normalizeIngredient } from '../services/groceryService';

export interface ShoppingListSyncPlan {
  staleDbItems: ShoppingListItem[];
  upsertItems: ShoppingListItem[];
}

export const buildShoppingListSyncPlan = (
  dbItems: ShoppingListItem[],
  derivedItems: ShoppingListItem[]
): ShoppingListSyncPlan => {
  const currentInDb = new Map(dbItems.map(item => [item.id, item]));
  const derivedIds = new Set(derivedItems.map(item => item.id));

  const staleDbItems = dbItems.filter(item => !item.isCustom && !derivedIds.has(item.id));
  const upsertItems = derivedItems.filter(item => {
    const existing = currentInDb.get(item.id);
    if (!existing) return true;
    return (
      existing.stateHash !== item.stateHash ||
      existing.checked !== item.checked ||
      existing.name !== item.name ||
      existing.excludedByPantry !== item.excludedByPantry
    );
  });

  return { staleDbItems, upsertItems };
};

export const syncShoppingListDocuments = async ({
  firestoreDb,
  userId,
  dbItems,
  derivedItems,
}: {
  firestoreDb: Firestore;
  userId: string;
  dbItems: ShoppingListItem[];
  derivedItems: ShoppingListItem[];
}) => {
  const plan = buildShoppingListSyncPlan(dbItems, derivedItems);
  if (plan.staleDbItems.length === 0 && plan.upsertItems.length === 0) return false;

  const batch = writeBatch(firestoreDb);

  plan.staleDbItems.forEach(item => {
    batch.delete(doc(firestoreDb, 'users', userId, 'shoppingList', item.id));
  });

  plan.upsertItems.forEach(item => {
    const cleanItem = { ...item };
    if (!cleanItem.generatedAt) {
      (cleanItem as any).generatedAt = serverTimestamp();
    }
    (cleanItem as any).updatedAt = serverTimestamp();
    batch.set(doc(firestoreDb, 'users', userId, 'shoppingList', item.id), cleanItem, { merge: true });
  });

  await batch.commit();
  return true;
};

export const clearDerivedShoppingListDocuments = async ({
  firestoreDb,
  userId,
  dbItems,
}: {
  firestoreDb: Firestore;
  userId: string;
  dbItems: ShoppingListItem[];
}) => {
  const batch = writeBatch(firestoreDb);
  dbItems.forEach(item => {
    if (!item.isCustom) {
      batch.delete(doc(firestoreDb, 'users', userId, 'shoppingList', item.id));
    }
  });
  await batch.commit();
};

export const updateShoppingItemDocument = async ({
  firestoreDb,
  userId,
  itemId,
  updates,
}: {
  firestoreDb: Firestore;
  userId: string;
  itemId: string;
  updates: Partial<ShoppingListItem>;
}) => {
  await updateDoc(doc(firestoreDb, 'users', userId, 'shoppingList', itemId), updates);
};

export const addCustomShoppingItemDocument = async ({
  firestoreDb,
  userId,
  name,
  category = 'Other',
}: {
  firestoreDb: Firestore;
  userId: string;
  name: string;
  category?: string;
}) => {
  const docRef = doc(collection(firestoreDb, 'users', userId, 'shoppingList'));
  const normalized = normalizeIngredient(name);
  const item = costItemSync({
    id: docRef.id,
    name,
    nameRaw: name,
    category,
    checked: false,
    inStock: false,
    isCustom: true,
    userId,
    ...normalized,
    sourceRecipeIds: [],
    sourceDays: [],
    generatedAt: serverTimestamp(),
  } as any);
  await setDoc(docRef, item);
  return docRef.id;
};

export const removeShoppingItemDocument = async ({
  firestoreDb,
  userId,
  itemId,
}: {
  firestoreDb: Firestore;
  userId: string;
  itemId: string;
}) => {
  await deleteDoc(doc(firestoreDb, 'users', userId, 'shoppingList', itemId));
};
