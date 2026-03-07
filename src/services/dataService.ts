import { collection, getDocs, addDoc } from "firebase/firestore";
import db from "../firebase/firestore";

const dataService = {
  async fetchData(force = false) {
    let vendors: any[] = [];
    let drivers: any[] = [];

    // Static fallback while migrating all contacts to Firebase.
    try {
      const contactsUrl = `${import.meta.env.BASE_URL}contacts.json`;
      const response = await fetch(contactsUrl);
      const contactData = await response.json();
      if (contactData?.vendors && contactData?.drivers) {
        vendors = contactData.vendors || [];
        drivers = contactData.drivers || [];
      }
    } catch (error) {
      console.error("Error loading contacts.json:", error);
    }

    try {
      const vendorsSnapshot = await getDocs(collection(db, "vendors"));
      const driversSnapshot = await getDocs(collection(db, "drivers"));
      const communityPostsSnapshot = await getDocs(collection(db, "communityPosts"));
      const routeFaresSnapshot = await getDocs(collection(db, "routeFares"));
      const essentialServicesSnapshot = await getDocs(collection(db, "essentialServices"));
      const reviewsSnapshot = await getDocs(collection(db, "reviews"));

      const fbVendors = vendorsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const fbDrivers = driversSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const activeVendors = fbVendors.length > 0 ? fbVendors : vendors;
      const activeDrivers = fbDrivers.length > 0 ? fbDrivers : drivers;

      const reviewStats = new Map<string, { total: number; count: number }>();
      reviewsSnapshot.docs.forEach((doc) => {
        const review = doc.data() as any;
        const targetId = review.targetId;
        const rating = Number(review.rating);
        if (!targetId || Number.isNaN(rating)) return;
        const current = reviewStats.get(targetId) || { total: 0, count: 0 };
        reviewStats.set(targetId, {
          total: current.total + rating,
          count: current.count + 1,
        });
      });

      const withRatings = <T extends { id: string }>(items: T[]) => {
        return items.map((item) => {
          const stat = reviewStats.get(item.id);
          if (!stat) return item;
          return {
            ...item,
            rating: Number((stat.total / stat.count).toFixed(1)),
            reviewCount: stat.count,
          };
        });
      };

      return {
        vendors: withRatings(activeVendors),
        drivers: withRatings(activeDrivers),
        communityPosts: communityPostsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        routeFares: routeFaresSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        essentialServices: essentialServicesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      };
    } catch (error) {
      console.error("Error fetching Firebase data:", error);
      return {
        vendors,
        drivers,
        communityPosts: [],
        routeFares: [],
        essentialServices: [],
      };
    }
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

  async postReview(data: any) {
    try {
      await addDoc(collection(db, "reviews"), {
        ...data,
        createdAt: new Date().toISOString(),
      });
      return true;
    } catch (err) {
      console.error("Error posting review:", err);
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

  async addStudentContact(data: any) {
    try {
      const newContact = await addDoc(collection(db, "vendors"), {
        name: data.name,
        category: data.category,
        phone: data.phone,
        whatsapp: data.phone,
        description: data.description,
        isVerified: false,
        image: "",
        addedBy: data.userName,
        addedByUserId: data.userId,
        createdAt: new Date().toISOString(),
      });
      return newContact.id;
    } catch (err) {
      console.error("Error adding contact:", err);
      throw err;
    }
  },
};

export default dataService;
