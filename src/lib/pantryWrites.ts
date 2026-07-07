import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

export const buildPantryItemData = ({
  id,
  name,
  category = 'Other',
  isStaple = false,
  userId,
  lastUsed,
}: {
  id: string;
  name: string;
  category?: string;
  isStaple?: boolean;
  userId: string;
  lastUsed: unknown;
}) => ({
  id,
  name,
  category,
  isStaple,
  userId,
  lastUsed,
});

export const addPantryItemDocument = async ({
  firestoreDb,
  userId,
  name,
  category = 'Other',
  isStaple = false,
}: {
  firestoreDb: Firestore;
  userId: string;
  name: string;
  category?: string;
  isStaple?: boolean;
}) => {
  const docRef = doc(collection(firestoreDb, 'users', userId, 'pantry'));
  await setDoc(docRef, buildPantryItemData({
    id: docRef.id,
    name,
    category,
    isStaple,
    userId,
    lastUsed: serverTimestamp(),
  }));
  return docRef.id;
};

export const removePantryItemDocument = async ({
  firestoreDb,
  userId,
  pantryItemId,
}: {
  firestoreDb: Firestore;
  userId: string;
  pantryItemId: string;
}) => {
  await deleteDoc(doc(firestoreDb, 'users', userId, 'pantry', pantryItemId));
};

export const updatePantryStapleDocument = async ({
  firestoreDb,
  userId,
  pantryItemId,
  isStaple,
}: {
  firestoreDb: Firestore;
  userId: string;
  pantryItemId: string;
  isStaple: boolean;
}) => {
  await updateDoc(doc(firestoreDb, 'users', userId, 'pantry', pantryItemId), { isStaple });
};
