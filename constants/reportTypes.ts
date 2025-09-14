export interface IncidentType {
  id: string;
  category: string;
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
    id: 'vehicle_theft', 
    category: 'Vehicle Theft',
    description: 'Theft of cars, motorcycles, bicycles',
    icon: 'car-outline', 
    color: '#dc2626',
    requiresItem: true,
    itemType: 'vehicle'
  },
  { 
    id: 'bag_snatch', 
    category: 'Bag Snatching',
    description: 'Theft of bags, purses, wallets',
    icon: 'bag-outline', 
    color: '#f97316',
    requiresItem: true,
    itemType: 'bag'
  },
  { 
    id: 'robbery', 
    category: 'Street Robbery',
    description: 'Armed robbery or mugging',
    icon: 'warning-outline', 
    color: '#b91c1c',
    requiresItem: false,
    itemType: 'other'
  },
  { 
    id: 'harassment', 
    category: 'Harassment',
    description: 'Street harassment or threats',
    icon: 'chatbubble-ellipses-outline', 
    color: '#ea580c',
    requiresItem: false,
    itemType: null
  },
];
