export interface IncidentType {
  id: string;
  category?: string | null;
  description: string;
  icon: string;
  color: string;
  requiresItem?: boolean;
  itemType?: string | null;
}

export const incidentTypes: IncidentType[] = [
  { 
    id: 'mobile_snatch', 
    category: 'Mobile Snatch',
    description: 'Theft of mobile phones by force',
    icon: 'phone-portrait-outline', 
    color: '#ef4444',
    requiresItem: true,
    itemType: 'phone'
  },
  { 
    id: 'Car', 
    category: 'Car',
    description: 'Theft of cars, ',
    icon: 'car-outline', 
    color: '#dc2626',
    requiresItem: true,
    itemType: 'car'
  },
  { 
    id: 'Bike', 
    category: 'Bike',
    description: 'Theft of , motorcycles, ',
    icon: 'bicycle-outline', 
    color: '#dc2626',
    requiresItem: true,
    itemType: 'bike'
  },
  { 
    id: 'bag_snatch', 
    category: 'Bag Snatching',
    description: 'Theft of bags, purses, wallets',
    icon: 'bag-outline', 
    color: '#f97316',
    requiresItem: true,
    itemType: 'Bag'
  },
  { 
    id: 'other_theft', 
    category: 'Other Theft',
    description: 'Theft of items not listed elsewhere',
    icon: 'alert-circle-outline', 
    color: '#6b7280',
    requiresItem: false,
    itemType: 'other'
  },

];
