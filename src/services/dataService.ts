import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import db from "../firebase/firestore";

const dataService = {
  async fetchData(force = false) {
    try {
      let vendors = [];
      let drivers = [];

      // FETCH FROM LOCAL STATIC CONTACTS FILE
      console.log("📂 Loading contacts from static file...");
      const response = await fetch("/contacts.json");
      const contactData = await response.json();
      
      if (contactData && contactData.vendors && contactData.drivers) {
        console.log(`✅ Loaded ${contactData.vendors.length} vendors and ${contactData.drivers.length} drivers from contacts.json`);
        vendors = contactData.vendors || [];
        drivers = contactData.drivers || [];
      } else {
        console.warn("⚠️ Could not load contacts from file");
      }
      
      // Fetch Firebase data (community posts, complaints, etc.)
      const vendorsSnapshot = await getDocs(collection(db, "vendors"));
      const driversSnapshot = await getDocs(collection(db, "drivers"));
      const communityPostsSnapshot = await getDocs(collection(db, "communityPosts"));
      const routeFaresSnapshot = await getDocs(collection(db, "routeFares"));
      const essentialServicesSnapshot = await getDocs(collection(db, "essentialServices"));

      // Merge with Firebase vendors (student-added contacts)
      const fbVendors = vendorsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const fbDrivers = driversSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        vendors: [...vendors, ...fbVendors],
        drivers: [...drivers, ...fbDrivers],
        communityPosts: communityPostsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        routeFares: routeFaresSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        essentialServices: essentialServicesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      // Return empty arrays if file fetch fails
      return {
        vendors: [],
        drivers: [],
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

  // Add student-referred contact
  async addStudentContact(data: any) {
    try {
      const newContact = await addDoc(collection(db, "vendors"), {
        name: data.name,
        category: data.category,
        phone: data.phone,
        whatsapp: data.phone,
        description: data.description,
        isVerified: false,
        image: '',
        addedBy: data.userName,
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