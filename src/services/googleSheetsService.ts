// Google Sheets integration service
// Convert Google Sheet to CSV format and fetch data

const SHEET_ID = '1bIrYNa-MbLAT3PGMlQn6IHqjLsWZyK7y';

interface SheetContact {
  name: string;
  category: string;
  phone: string;
  whatsapp: string;
  description?: string;
  verified?: boolean;
  ownerName?: string;
  businessName?: string;
}

// Utility functions for name and phone parsing
const parseContactName = (fullName: string): { displayName: string; ownerName?: string; businessName?: string } => {
  // Try to identify if it's a business name or personal name
  const commonBusinessSuffixes = ['Store', 'Shop', 'Point', 'Service', 'Salon', 'Pharmacy', 'Dhaba', 'Palace', 'Pro', 'King', 'Studio', 'Autos', 'Cab'];
  const commonOwnersIndicators = ['Raj', 'Sharma', 'Singh', 'Patel', 'Gupta', 'Kumar', 'Khan'];
  
  let businessName = fullName;
  let ownerName = '';
  
  // Check if name contains a common business suffix
  for (const suffix of commonBusinessSuffixes) {
    if (fullName.includes(suffix)) {
      businessName = fullName;
      ownerName = fullName.split(suffix)[0].trim();
      break;
    }
  }
  
  // If no owner name extracted yet, try to find initials or common personal names
  if (!ownerName && fullName.split(' ').length === 2) {
    const parts = fullName.split(' ');
    const firstName = parts[0];
    if (commonOwnersIndicators.includes(firstName)) {
      ownerName = firstName;
      businessName = fullName;
    }
  }
  
  return {
    displayName: fullName,
    ownerName: ownerName || undefined,
    businessName: businessName || undefined
  };
};

const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If it's already in +91 format, return as is
  if (phone.startsWith('+91')) {
    return phone;
  }
  
  // If it's a 10-digit number, add +91
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  
  // If it's 12 digits and starts with 91, add +
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  
  // Take last 10 digits and format
  const lastTen = digits.slice(-10);
  return `+91${lastTen}`;
};

const googleSheetsService = {
  async fetchContactsFromSheet(): Promise<SheetContact[]> {
    try {
      const allContacts: SheetContact[] = [];
      
      // Try fetching from multiple sheet tabs (gid 0-10)
      for (let gid = 0; gid <= 10; gid++) {
        try {
          const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
          const response = await fetch(CSV_URL, { 
            headers: { 'Accept': 'text/csv' }
          });
          
          if (!response.ok) continue;
          
          const csvText = await response.text();
          if (!csvText || csvText.length < 10) continue; // Skip empty sheets
          
          const lines = csvText.split('\n').map(line => line.trim()).filter(line => line);
          
          if (lines.length < 2) continue; // Need header + at least 1 data row
          
          // Parse header row - try multiple common header patterns
          const headerRow = lines[0].toLowerCase();
          const hasValidHeader = 
            headerRow.includes('name') || 
            headerRow.includes('contact') ||
            headerRow.includes('service') ||
            headerRow.includes('category') ||
            headerRow.includes('phone');
          
          if (!hasValidHeader) continue;
          
          // Detect column positions dynamically
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('contact') || h.includes('service'));
          const categoryIdx = headers.findIndex(h => h.includes('category') || h.includes('type') || h.includes('service'));
          const phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('number') || h.includes('contact'));
          const descIdx = headers.findIndex(h => h.includes('desc') || h.includes('detail') || h.includes('info'));
          
          // Parse data rows
          for (let i = 1; i < lines.length; i++) {
            const fields = lines[i].split(',').map(f => f.trim().replace(/^"|"$/g, ''));
            
            if (fields.length < 2) continue;
            
            const name = nameIdx >= 0 && fields[nameIdx] ? fields[nameIdx].trim() : '';
            const category = categoryIdx >= 0 && fields[categoryIdx] ? fields[categoryIdx].trim() : '';
            const phone = phoneIdx >= 0 && fields[phoneIdx] ? fields[phoneIdx].trim() : '';
            const description = descIdx >= 0 && fields[descIdx] ? fields[descIdx].trim() : '';
            
            if (name && category && phone) {
              const formattedPhone = formatPhoneNumber(phone);
              const parsedName = parseContactName(name);
              
              allContacts.push({
                name: parsedName.displayName,
                category,
                phone: formattedPhone,
                whatsapp: formattedPhone,
                description: description || '',
                verified: true,
                ownerName: parsedName.ownerName,
                businessName: parsedName.businessName
              });
            }
          }
        } catch (err) {
          // Continue to next sheet
          continue;
        }
      }
      
      // Return fetched data or empty array if none found
      return allContacts;
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
        name: 'Sharma Grocery Store',
        category: 'Grocery',
        phone: '+919876543210',
        whatsapp: '+919876543210',
        description: 'Fresh vegetables & daily essentials',
        verified: true,
        ownerName: 'Sharma',
        businessName: 'Sharma Grocery Store'
      },
      {
        name: 'Campus Kirana',
        category: 'Grocery',
        phone: '+919988776655',
        whatsapp: '+919988776655',
        description: 'Door delivery available',
        verified: true,
        businessName: 'Campus Kirana'
      },
      // Dhaba & Street Food
      {
        name: 'Rohit Dhaba',
        category: 'Dhaba',
        phone: '+918765432109',
        whatsapp: '+918765432109',
        description: 'Best parathas & chole bhature',
        verified: true,
        ownerName: 'Rohit',
        businessName: 'Rohit Dhaba'
      },
      {
        name: 'Quick Momos Point',
        category: 'Street Food',
        phone: '+918765432100',
        whatsapp: '+918765432100',
        description: 'Veg & non-veg momos',
        verified: true,
        businessName: 'Quick Momos Point'
      },
      {
        name: 'Pizza Palace',
        category: 'Street Food',
        phone: '+918876543211',
        whatsapp: '+918876543211',
        description: 'Fresh pizza & pasta',
        verified: false,
        businessName: 'Pizza Palace'
      },
      // Transport
      {
        name: 'Quick Auto Service',
        category: 'Auto',
        phone: '+917654321098',
        whatsapp: '+917654321098',
        description: 'Available 24/7, fast service',
        verified: false,
        businessName: 'Quick Auto Service'
      },
      {
        name: 'Rohtak Autos',
        category: 'Auto',
        phone: '+917654321099',
        whatsapp: '+917654321099',
        description: 'AC autos available',
        verified: true,
        businessName: 'Rohtak Autos'
      },
      {
        name: 'City Cab Service',
        category: 'Cab',
        phone: '+917654321088',
        whatsapp: '+917654321088',
        description: 'Budget & premium rides',
        verified: true,
        businessName: 'City Cab Service'
      },
      // Services
      {
        name: 'Raj Salon',
        category: 'Salon',
        phone: '+919123456789',
        whatsapp: '+919123456789',
        description: 'Professional grooming & haircut',
        verified: true,
        ownerName: 'Raj',
        businessName: 'Raj Salon'
      },
      {
        name: 'Quick Pharmacy',
        category: 'Pharmacy',
        phone: '+919234567890',
        whatsapp: '+919234567890',
        description: 'Medicine delivery 24/7',
        verified: true,
        businessName: 'Quick Pharmacy'
      },
      {
        name: 'SMS Tailor',
        category: 'Tailor',
        phone: '+919345678901',
        whatsapp: '+919345678901',
        description: 'Best alterations in town',
        verified: true,
        businessName: 'SMS Tailor'
      },
      {
        name: 'Express Laundry',
        category: 'Laundry',
        phone: '+919456789012',
        whatsapp: '+919456789012',
        description: '24-hour laundry service',
        verified: false,
        businessName: 'Express Laundry'
      },
      {
        name: 'Tech Fix Pro',
        category: 'Tech Repair',
        phone: '+919567890123',
        whatsapp: '+919567890123',
        description: 'Phone & laptop repair',
        verified: true,
        businessName: 'Tech Fix Pro'
      },
      {
        name: 'Parcel King',
        category: 'Parcel',
        phone: '+919678901234',
        whatsapp: '+919678901234',
        description: 'Fast local delivery service',
        verified: true,
        businessName: 'Parcel King'
      },
      {
        name: 'Flower Studio',
        category: 'Flowers',
        phone: '+919789012345',
        whatsapp: '+919789012345',
        description: 'Fresh flowers & decoration',
        verified: false,
        businessName: 'Flower Studio'
      }
    ];
  }
};

export default googleSheetsService;
