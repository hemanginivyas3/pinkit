import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import db from "../firebase/firestore";
import googleSheetsService from "./googleSheetsService";

const dataService = {
  async fetchData(force = false) {
    try {
      // Fetch from local contacts.json file first
      let localContacts: any = null;
      try {
        const response = await fetch('/contacts.json');
        if (response.ok) {
          localContacts = await response.json();
          console.log("Loaded contacts from contacts.json:", localContacts);
        }
      } catch (err) {
        console.warn("Could not load contacts.json, falling back to Google Sheets");
      }

      let vendors = [];
      let drivers = [];

      // Use local contacts if available
      if (localContacts && localContacts.vendors && localContacts.drivers) {
        vendors = localContacts.vendors.map((v: any) => ({
          id: v.id,
          name: v.name,
          category: v.category,
          phone: v.phone,
          whatsapp: v.whatsapp || v.phone,
          image: v.image || '',
          isVerified: true,
          description: v.description || '',
          rating: v.rating || 0,
          reviewCount: v.reviewCount || 0,
          delivery: {
            time: v.deliveryTime || '',
            fee: v.deliveryFee || '₹0'
          }
        }));

        drivers = localContacts.drivers.map((d: any) => ({
          id: d.id,
          name: d.name,
          type: d.type as 'Auto' | 'Cab',
          phone: d.phone,
          whatsapp: d.whatsapp || d.phone,
          isVerified: true,
          priceRange: d.priceRange || '',
          rating: d.rating || 0,
          reviewCount: d.reviewCount || 0,
          vehicleNumber: d.vehicleNumber || ''
        }));
      } else {
        // Fallback to Google Sheets if contacts.json not available
        let sheetContacts = await googleSheetsService.fetchContactsFromSheet();
        
        // If Google Sheets fetch failed, use sample data
        if (!sheetContacts || sheetContacts.length === 0) {
          console.warn("Google Sheets data empty, using sample data");
          sheetContacts = googleSheetsService.generateSampleContacts();
        }

        // Convert sheet data to vendor/driver format
        vendors = sheetContacts
          .filter(c => ['Grocery', 'Dhaba', 'Street Food', 'Parcel', 'Pharmacy', 'Hospital', 'Salon', 'Laundry', 'Tailor', 'Flowers', 'Delivery', 'Tech Repair', 'Mobile'].includes(c.category))
          .map((c, idx) => ({
            id: `sheet_vendor_${idx}`,
            name: c.name,
            category: c.category,
            phone: c.phone,
            whatsapp: c.whatsapp || c.phone,
            image: '',
            isVerified: c.verified || false,
            description: c.description,
            ownerName: c.ownerName,
            businessName: c.businessName,
          }));

        drivers = sheetContacts
          .filter(c => ['Auto', 'Cab', 'Bus', 'Taxi'].includes(c.category))
          .map((c, idx) => ({
            id: `sheet_driver_${idx}`,
            name: c.name,
            type: c.category as 'Auto' | 'Cab',
            phone: c.phone,
            whatsapp: c.whatsapp || c.phone,
            isVerified: c.verified || false,
            priceRange: c.description,
            ownerName: c.ownerName,
          }));
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
      // Fallback to sample data
      const sampleContacts = googleSheetsService.generateSampleContacts();
      return {
        vendors: sampleContacts
          .filter(c => !['Auto', 'Cab', 'Bus', 'Taxi'].includes(c.category))
          .map((c, idx) => ({
            id: `sample_${idx}`,
            name: c.name,
            category: c.category,
            phone: c.phone,
            whatsapp: c.whatsapp,
            image: '',
            isVerified: c.verified || false,
            description: c.description,
            ownerName: c.ownerName,
            businessName: c.businessName,
          })),
        drivers: sampleContacts
          .filter(c => ['Auto', 'Cab', 'Bus', 'Taxi'].includes(c.category))
          .map((c, idx) => ({
            id: `sample_driver_${idx}`,
            name: c.name,
            type: c.category as 'Auto' | 'Cab',
            phone: c.phone,
            whatsapp: c.whatsapp,
            isVerified: c.verified || false,
            ownerName: c.ownerName,
          })),
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