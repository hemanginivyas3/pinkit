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
      {
        name: 'Sharma Grocery',
        category: 'Grocery',
        phone: '+919876543210',
        whatsapp: '+919876543210',
        description: 'Fresh vegetables daily',
        verified: true
      },
      {
        name: 'Rohit Dhaba',
        category: 'Dhaba',
        phone: '+918765432109',
        whatsapp: '+918765432109',
        description: 'Best parathas in town',
        verified: true
      },
      {
        name: 'Quick Auto Service',
        category: 'Auto',
        phone: '+917654321098',
        whatsapp: '+917654321098',
        description: 'Available 24/7',
        verified: false
      }
    ];
  }
};

export default googleSheetsService;
