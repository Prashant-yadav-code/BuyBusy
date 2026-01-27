import data from "./data";
import {
  doc,
  writeBatch,
  query,
  where,
  getDocs,
  collection,
  getDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Add data to the products collection only once
const addDataToCollection = async () => {
  try {
    const batch = writeBatch(db);
    data.forEach((product) => {
      const docRef = doc(db, "products", product.id.toString());
      batch.set(docRef, product);
    });

    // Removed unused variable 'res'
    await batch.commit();
  } catch (error) {
    console.log(error);
  }
};

// Fetch products from Firestore based on their ids
const getProductsUsingProductIds = async (cart) => {
  const productIds = Object.keys(cart).map(Number);
  if (!productIds.length) return false;

  const productsRef = collection(db, "products");
  const productsSnapshot = await getDocs(
    query(productsRef, where("id", "in", productIds))
  );

  return productsSnapshot.docs.map((doc) => ({
    ...doc.data(),
    date: cart?.date,
    quantity: cart[doc.data().id],
  }));
};

// Fetch user's cart products
const getUserCartProducts = async (uid) => {
  const docRef = doc(db, "usersCarts", uid);
  const docSnap = await getDoc(docRef);
  return { docRef, data: docSnap.data() };
};

// Simple function to format date
const convertDate = (date) => new Date(date).toISOString().split("T")[0];

export {
  addDataToCollection,
  getProductsUsingProductIds,
  getUserCartProducts,
  convertDate,
};
