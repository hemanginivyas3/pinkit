import fs from 'node:fs';
import path from 'node:path';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBy2LzRTN9EjoRb6L85c-gJv6DVNDdZcso',
  authDomain: 'pinkit-282ac.firebaseapp.com',
  projectId: 'pinkit-282ac',
  storageBucket: 'pinkit-282ac.firebasestorage.app',
  messagingSenderId: '258425294393',
  appId: '1:258425294393:web:1ad445a65f949d6dcb07e8',
  measurementId: 'G-BMYS556B3P',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const normalizePhone = (phone = '') => String(phone).replace(/\D/g, '');
const keyVendor = (v) => `${(v.name || '').trim().toLowerCase()}|${normalizePhone(v.phone)}|${(v.category || '').trim().toLowerCase()}`;
const keyDriver = (d) => `${(d.name || '').trim().toLowerCase()}|${normalizePhone(d.phone)}|${(d.type || '').trim().toLowerCase()}`;

const root = process.cwd();
const contactsPath = path.join(root, 'contacts.json');
const raw = fs.readFileSync(contactsPath, 'utf-8');
const data = JSON.parse(raw);

const run = async () => {
  const email = process.env.FIREBASE_ADMIN_EMAIL;
  const password = process.env.FIREBASE_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('Set FIREBASE_ADMIN_EMAIL and FIREBASE_ADMIN_PASSWORD in the shell before running this script.');
  }

  await signInWithEmailAndPassword(auth, email, password);

  const existingVendorDocs = await getDocs(collection(db, 'vendors'));
  const existingDriverDocs = await getDocs(collection(db, 'drivers'));

  const existingVendorKeys = new Set(existingVendorDocs.docs.map((d) => keyVendor(d.data())));
  const existingDriverKeys = new Set(existingDriverDocs.docs.map((d) => keyDriver(d.data())));

  let addedVendors = 0;
  let skippedVendors = 0;
  let addedDrivers = 0;
  let skippedDrivers = 0;

  for (const v of data.vendors || []) {
    const k = keyVendor(v);
    if (!v.name || !v.phone || !v.category || existingVendorKeys.has(k)) {
      skippedVendors += 1;
      continue;
    }

    await addDoc(collection(db, 'vendors'), {
      name: v.name,
      category: v.category,
      phone: v.phone,
      whatsapp: v.whatsapp || v.phone,
      isVerified: v.isVerified ?? true,
      description: v.notes || '',
      createdAt: new Date().toISOString(),
      source: 'contacts.json',
    });
    existingVendorKeys.add(k);
    addedVendors += 1;
  }

  for (const d of data.drivers || []) {
    const k = keyDriver(d);
    if (!d.name || !d.phone || !d.type || existingDriverKeys.has(k)) {
      skippedDrivers += 1;
      continue;
    }

    await addDoc(collection(db, 'drivers'), {
      name: d.name,
      type: d.type,
      phone: d.phone,
      whatsapp: d.whatsapp || d.phone,
      isVerified: d.isVerified ?? true,
      description: d.notes || '',
      createdAt: new Date().toISOString(),
      source: 'contacts.json',
    });
    existingDriverKeys.add(k);
    addedDrivers += 1;
  }

  console.log(JSON.stringify({
    addedVendors,
    skippedVendors,
    addedDrivers,
    skippedDrivers,
  }, null, 2));
};

run().catch((err) => {
  console.error('Import failed:', err?.message || err);
  process.exit(1);
});
