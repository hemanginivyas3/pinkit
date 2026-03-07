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
          console.log(`📥 Fetching sheet tab ${gid} from:', ${CSV_URL}`);
          
          const response = await fetch(CSV_URL, { 
            headers: { 'Accept': 'text/csv' }
          });
          
          if (!response.ok) {
            console.log(`⏭️ Sheet tab ${gid} not found or not accessible (${response.status})`);
            continue;
          }
          
          const csvText = await response.text();
          if (!csvText || csvText.length < 10) {
            console.log(`⏭️ Sheet tab ${gid} is empty`);
            continue;
          }
          
          // Better CSV parsing that handles quoted fields
          const lines = csvText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
          
          if (lines.length < 2) {
            console.log(`⏭️ Sheet tab ${gid} has no data rows`);
            continue;
          }
          
          // Parse header row
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));
          console.log(`📋 Sheet ${gid} headers:`, headers);
          
          const hasValidHeader = 
            headers.some(h => h === 'name' || h.includes('name')) &&
            headers.some(h => h.includes('phone'));
          
          if (!hasValidHeader) {
            console.log(`⏭️ Sheet ${gid} doesn't have required headers (name, phone)`);
            continue;
          }
          
          // Find column indices - prioritize Sub-Category over Category
          const nameIdx = headers.findIndex(h => h === 'name' || h.includes('name'));
          const categoryIdx = headers.findIndex(h => h === 'category' || h.includes('category'));
          const subCategoryIdx = headers.findIndex(h => h === 'sub-category' || h.includes('sub') || h.includes('subcategory'));
          const phoneIdx = headers.findIndex(h => h === 'phone' || h.includes('phone'));
          const whatsappIdx = headers.findIndex(h => h === 'whatsapp' || h.includes('whatsapp'));
          const costIdx = headers.findIndex(h => h === 'cost' || h.includes('cost'));
          const ratingIdx = headers.findIndex(h => h === 'rating' || h.includes('rating'));
          
          console.log(`📍 Column indices: name=${nameIdx}, category=${categoryIdx}, subCategory=${subCategoryIdx}, phone=${phoneIdx}, whatsapp=${whatsappIdx}`);
          
          let sheetCount = 0;
          
          // Parse data rows
          for (let i = 1; i < lines.length; i++) {
            const fields = lines[i].split(',').map(f => f.trim().replace(/^"|"$/g, '').trim());
            
            if (fields.length < 3) continue;
            
            const name = nameIdx >= 0 && fields[nameIdx] ? fields[nameIdx] : '';
            let category = '';
            
            // Priority: Use Sub-Category first, fall back to Category
            if (subCategoryIdx >= 0 && fields[subCategoryIdx]) {
              category = fields[subCategoryIdx];
            } else if (categoryIdx >= 0 && fields[categoryIdx]) {
              category = fields[categoryIdx];
            }
            
            const phone = phoneIdx >= 0 && fields[phoneIdx] ? fields[phoneIdx] : '';
            const whatsapp = whatsappIdx >= 0 && fields[whatsappIdx] ? fields[whatsappIdx] : phone;
            const cost = costIdx >= 0 && fields[costIdx] ? fields[costIdx] : '';
            
            if (!name || !phone) {
              continue;
            }
            
            // Normalize and map category names to app categories
            category = category
              .trim()
              .toLowerCase()
              .replace(/auto/i, 'Auto')
              .replace(/cab/i, 'Cab')
              .replace(/taxi/i, 'Cab')
              .replace(/grocery/i, 'Grocery')
              .replace(/dhaba/i, 'Dhaba')
              .replace(/restaurant/i, 'Dhaba')
              .replace(/street food/i, 'Street Food')
              .replace(/cafe/i, 'Street Food')
              .replace(/food delivery/i, 'Delivery')
              .replace(/delivery/i, 'Delivery')
              .replace(/courier/i, 'Parcel')
              .replace(/parcel/i, 'Parcel')
              .replace(/dessert/i, 'Street Food')
              .replace(/general/i, 'Grocery')
              .replace(/milk/i, 'Delivery');
            
            // Capitalize first letter
            category = category.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            
            if (!category) {
              continue;
            }
            
            try {
              const formattedPhone = formatPhoneNumber(phone);
              const parsedName = parseContactName(name);
              
              allContacts.push({
                name: parsedName.displayName,
                category,
                phone: formattedPhone,
                whatsapp: whatsapp ? formatPhoneNumber(whatsapp) : formattedPhone,
                description: cost || '',
                verified: true,
                ownerName: parsedName.ownerName,
                businessName: parsedName.businessName
              });
              
              sheetCount++;
              if (sheetCount <= 5) {
                console.log(`✅ Row ${i+1}: ${name} (${category}) - Phone: ${formattedPhone}`);
              }
            } catch (parseErr) {
              console.log(`⏭️ Row ${i}: Error parsing - ${parseErr}`);
              continue;
            }
          }
          
          console.log(`✅ Sheet tab ${gid}: Loaded ${sheetCount} contacts`);
        } catch (err) {
          console.log(`❌ Error fetching sheet tab ${gid}:`, err);
          continue;
        }
      }
      
      console.log(`🎉 Total contacts from Google Sheets: ${allContacts.length}`);
      return allContacts;
    } catch (error) {
      console.error('❌ Error fetching from Google Sheets:', error);
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
