export const dummyReports = [
  { id: "1", location: "Karachi", type: "Theft", time: "10:30 AM" },
  { id: "2", location: "Lahore", type: "Robbery", time: "11:00 AM" },
  { id: "3", location: "Islamabad", type: "Theft", time: "12:15 PM" },
  { id: "4", location: "Karachi", type: "Robbery", time: "01:45 PM" },
  { id: "5", location: "Multan", type: "Robbery", time: "02:10 PM" },
];
// data/dummyRestrictedAreas.ts
type RiskLevel = "HIGH" | "MEDIUM" | "LOW";
export interface RestrictedArea {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  radius: number;
  riskLevel: RiskLevel; // ✅ strongly typed
}
export const dummyAreas : RestrictedArea[]= [
    {
      id: "1",
      name: "Karachi Saddar",
      coordinates: { latitude: 24.8607, longitude: 67.0011 },
      radius: 3000,
      riskLevel: "HIGH",
    },

    {
      id: "2",
      name: "Lahore Liberty",
      coordinates: { latitude: 31.5204, longitude: 74.3587 },
      radius: 2000,
      riskLevel: "MEDIUM",
    },
    {
      id: "3",
      name: "Islamabad F-7",
      coordinates: { latitude: 33.6844, longitude: 73.0479 },
      radius: 1500,
      riskLevel: "LOW",
    },
    {
      id: "4",
      name: "Quetta Center",
      coordinates: { latitude: 30.1798, longitude: 66.975 },
      radius: 2500,
      riskLevel: "HIGH",
    },
    {
      id: "5",
      name: "Gulshan e Ghazali ", 
      coordinates: { latitude: 24.87133506553972,  longitude: 67.17378170184742 },
      radius: 1000,
      riskLevel: "MEDIUM",
    }
  ];

