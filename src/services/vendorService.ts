import { collection, getDocs } from "firebase/firestore";
import db from "../firebase/firestore";

export const getVendors = async () => {
  const querySnapshot = await getDocs(collection(db, "vendors"));

  const vendors: any[] = [];

  querySnapshot.forEach((doc) => {
    vendors.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return vendors;
};