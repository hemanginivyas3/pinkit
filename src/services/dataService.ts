import { collection, getDocs } from "firebase/firestore";
import db from "../firebase/firestore";

const dataService = {
  async fetchData(force = false) {
    const vendorsSnapshot = await getDocs(collection(db, "vendors"));
    const vendors = vendorsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      vendors,
      drivers: [],
      communityPosts: [],
      routeFares: [],
      essentialServices: [],
    };
  },
};

export default dataService;