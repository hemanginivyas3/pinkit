// Google Sheets integration service
// Convert Google Sheet to CSV format and fetch data

const SHEET_ID = '1bIrYNa-MbLAT3PGMlQn6IHqjLsWZyK7y';
const SHEET_NAME = 'Contacts'; // Change to your sheet name if different
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

interface SheetContact {
  name: string;
  category: string;
  phone: string;
  whatsapp: string;
  description?: string;
  verified?: boolean;
}

const googleSheetsService = {
  async fetchContactsFromSheet(): Promise<SheetContact[]> {
    try {
      const response = await fetch(CSV_URL);
      if (!response.ok) throw new Error('Failed to fetch sheet');
      
      const csvText = await response.text();
      const lines = csvText.split('\n');
      
      const contacts: SheetContact[] = [];
      
      // Parse CSV (skip header row)
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const [name, category, phone, whatsapp, description, verified] = lines[i]
          .split(',')
          .map(val => val.trim().replace(/^"|"$/g, ''));
        
        if (name && category && phone) {
          contacts.push({
            name,
            category,
            phone,
            whatsapp: whatsapp || phone,
            description: description || '',
            verified: verified === 'TRUE' || verified === 'true'
          });
        }
      }
      
      return contacts;
    } catch (error) {
      console.error('Error fetching from Google Sheets:', error);
      return [];
    }
  },

  // For local testing - returns sample data structure
  generateSampleContacts(): SheetContact[] {
    return [
      // Grocery
      {
        name: 'Sharma Grocery',
        category: 'Grocery',
        phone: '+919876543210',
        whatsapp: '+919876543210',
        description: 'Fresh vegetables & daily essentials',
        verified: true
      },
      {
        name: 'Campus Kirana Store',
        category: 'Grocery',
        phone: '+919988776655',
        whatsapp: '+919988776655',
        description: 'Door delivery available',
        verified: true
      },
      // Dhaba & Street Food
      {
        name: 'Rohit Dhaba',
        category: 'Dhaba',
        phone: '+918765432109',
        whatsapp: '+918765432109',
        description: 'Best parathas & chole bhature',
        verified: true
      },
      {
        name: 'Quick Momos Point',
        category: 'Street Food',
        phone: '+918765432100',
        whatsapp: '+918765432100',
        description: 'Veg & non-veg momos',
        verified: true
      },
      {
        name: 'Pizza Palace',
        category: 'Street Food',
        phone: '+918876543211',
        whatsapp: '+918876543211',
        description: 'Fresh pizza & pasta',
        verified: false
      },
      // Transport
      {
        name: 'Quick Auto Service',
        category: 'Auto',
        phone: '+917654321098',
        whatsapp: '+917654321098',
        description: 'Available 24/7, fast service',
        verified: false
      },
      {
        name: 'Rohtak Autos',
        category: 'Auto',
        phone: '+917654321099',
        whatsapp: '+917654321099',
        description: 'AC autos available',
        verified: true
      },
      {
        name: 'City Cab Service',
        category: 'Cab',
        phone: '+917654321088',
        whatsapp: '+917654321088',
        description: 'Budget & premium rides',
        verified: true
      },
      // Services
      {
        name: 'Raj Salon',
        category: 'Salon',
        phone: '+919123456789',
        whatsapp: '+919123456789',
        description: 'Professional grooming & haircut',
        verified: true
      },
      {
        name: 'Quick Pharmacy',
        category: 'Pharmacy',
        phone: '+919234567890',
        whatsapp: '+919234567890',
        description: 'Medicine delivery 24/7',
        verified: true
      },
      {
        name: 'SMS Tailor',
        category: 'Tailor',
        phone: '+919345678901',
        whatsapp: '+919345678901',
        description: 'Best alterations in town',
        verified: true
      },
      {
        name: 'Express Laundry',
        category: 'Laundry',
        phone: '+919456789012',
        whatsapp: '+919456789012',
        description: '24-hour laundry service',
        verified: false
      },
      {
        name: 'Tech Fix Pro',
        category: 'Tech Repair',
        phone: '+919567890123',
        whatsapp: '+919567890123',
        description: 'Phone & laptop repair',
        verified: true
      },
      {
        name: 'Parcel King',
        category: 'Parcel',
        phone: '+919678901234',
        whatsapp: '+919678901234',
        description: 'Fast local delivery service',
        verified: true
      },
      {
        name: 'Flower Studio',
        category: 'Flowers',
        phone: '+919789012345',
        whatsapp: '+919789012345',
        description: 'Fresh flowers & decoration',
        verified: false
      }
    ];
  }
};

export default googleSheetsService;
