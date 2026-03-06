import { collection, getDocs, addDoc } from "firebase/firestore";
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
  
  async postCommunityPost(data: any) {
    try {
      await addDoc(collection(db, "communityPosts"), {
        ...data,
        createdAt: new Date().toISOString(),
      });
      return true;
    } catch (err) {
      console.error("Error posting community post:", err);
      throw err;
    }
  },

  async postFeedback(data: any) {
    try {
      await addDoc(collection(db, "feedback"), {
        ...data,
        createdAt: new Date().toISOString(),
      });
      return true;
    } catch (err) {
      console.error("Error posting feedback:", err);
      throw err;
    }
  },

  async postComplaint(data: any) {
    try {
      await addDoc(collection(db, "complaints"), {
        ...data,
        createdAt: new Date().toISOString(),
      });
      return true;
    } catch (err) {
      console.error("Error posting complaint:", err);
      throw err;
    }
  },
};

export default dataService;