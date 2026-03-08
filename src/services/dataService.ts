import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import db from "../firebase/firestore";

const safeGetCollection = async (name: string) => {
  try {
    const snapshot = await getDocs(collection(db, name));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error(`Error fetching ${name}:`, error);
    return [];
  }
};

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

    const [
      fbVendors,
      fbDrivers,
      communityPosts,
      routeFares,
      essentialServices,
      reviews,
    ] = await Promise.all([
      safeGetCollection("vendors"),
      safeGetCollection("drivers"),
      safeGetCollection("communityPosts"),
      safeGetCollection("routeFares"),
      safeGetCollection("essentialServices"),
      safeGetCollection("reviews"),
    ]);

    const activeVendors = fbVendors.length > 0 ? fbVendors : vendors;
    const activeDrivers = fbDrivers.length > 0 ? fbDrivers : drivers;

    const reviewStats = new Map<string, { total: number; count: number }>();
    reviews.forEach((review: any) => {
      const targetId = review.targetId;
      const rating = Number(review.rating);
      if (!targetId || Number.isNaN(rating)) return;
      const current = reviewStats.get(targetId) || { total: 0, count: 0 };
      reviewStats.set(targetId, { total: current.total + rating, count: current.count + 1 });
    });

    const withRatings = <T extends { id: string }>(items: T[]) =>
      items.map((item) => {
        const stat = reviewStats.get(item.id);
        if (!stat) return item;
        return {
          ...item,
          rating: Number((stat.total / stat.count).toFixed(1)),
          reviewCount: stat.count,
        };
      });

    const sortedPosts = [...communityPosts].sort((a: any, b: any) => {
      const aTime = new Date(a.createdAt || a.time || 0).getTime();
      const bTime = new Date(b.createdAt || b.time || 0).getTime();
      return bTime - aTime;
    });

    return {
      vendors: withRatings(activeVendors),
      drivers: withRatings(activeDrivers),
      communityPosts: sortedPosts,
      routeFares,
      essentialServices,
    };
  },

  async postCommunityPost(data: any) {
    const created = await addDoc(collection(db, "communityPosts"), {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return created.id;
  },

  async deleteCommunityPost(postId: string) {
    await deleteDoc(doc(db, "communityPosts", postId));
  },

  async postReview(data: any) {
    await addDoc(collection(db, "reviews"), {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return true;
  },

  async postFeedback(data: any) {
    await addDoc(collection(db, "feedback"), {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return true;
  },

  async postComplaint(data: any) {
    await addDoc(collection(db, "complaints"), {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return true;
  },

  async addVendor(data: any) {
    const created = await addDoc(collection(db, "vendors"), {
      name: data.name,
      category: data.category,
      phone: data.phone,
      whatsapp: data.whatsapp || data.phone,
      description: data.description || "",
      isVerified: data.isVerified ?? true,
      image: data.image || "",
      createdAt: new Date().toISOString(),
      createdBy: data.userId || "",
    });
    return created.id;
  },

  async addDriver(data: any) {
    const created = await addDoc(collection(db, "drivers"), {
      name: data.name,
      type: data.type,
      phone: data.phone,
      whatsapp: data.whatsapp || data.phone,
      isVerified: data.isVerified ?? true,
      vehicleNumber: data.vehicleNumber || "",
      createdAt: new Date().toISOString(),
      createdBy: data.userId || "",
    });
    return created.id;
  },

  async deleteVendor(vendorId: string) {
    await deleteDoc(doc(db, "vendors", vendorId));
  },

  async deleteDriver(driverId: string) {
    await deleteDoc(doc(db, "drivers", driverId));
  },

  async addStudentContact(data: any) {
    return this.addVendor(data);
  },
};

export default dataService;
