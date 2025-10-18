export interface GeologicalSite {
  id: string;
  name: string;
  location: {
    state: string;
    district?: string;
    latitude: number;
    longitude: number;
  };
  rockTypes: string[];
  formations: string[];
  description: string;
  significance: string;
  image: string;
  accessibility: "Easy" | "Moderate" | "Difficult";
  bestTimeToVisit: string;
}

export const mockSites: GeologicalSite[] = [
  {
    id: "1",
    name: "Simlipal National Park",
    location: {
      state: "Odisha",
      district: "Mayurbhanj",
      latitude: 21.7303,
      longitude: 86.2347,
    },
    rockTypes: ["Granite", "Gneiss", "Laterite"],
    formations: ["Precambrian formations", "Weathered granite exposures"],
    description: "A rich biodiversity hotspot with significant geological features including ancient granite formations and laterite deposits.",
    significance: "Important for studying Precambrian geology and laterite formation processes in tropical environments.",
    image: "/placeholder.svg",
    accessibility: "Moderate",
    bestTimeToVisit: "October to March",
  },
  {
    id: "2",
    name: "Chilika Lake Region",
    location: {
      state: "Odisha",
      district: "Puri",
      latitude: 19.7043,
      longitude: 85.3206,
    },
    rockTypes: ["Sandstone", "Alluvial deposits", "Marine sediments"],
    formations: ["Quaternary alluvial deposits", "Recent marine formations"],
    description: "Asia's largest brackish water lagoon featuring unique sedimentary formations and ongoing depositional processes.",
    significance: "Critical site for studying coastal geology, sediment transport, and lagoon formation.",
    image: "/placeholder.svg",
    accessibility: "Easy",
    bestTimeToVisit: "November to February",
  },
  {
    id: "3",
    name: "Dhauli Hills",
    location: {
      state: "Odisha",
      district: "Khordha",
      latitude: 20.2042,
      longitude: 85.7850,
    },
    rockTypes: ["Khondalite", "Charnockite"],
    formations: ["Eastern Ghats Mobile Belt formations"],
    description: "Historical site with exposed high-grade metamorphic rocks of the Eastern Ghats.",
    significance: "Important for understanding Eastern Ghats metamorphic evolution and ancient crustal processes.",
    image: "/placeholder.svg",
    accessibility: "Easy",
    bestTimeToVisit: "Year-round",
  },
  {
    id: "4",
    name: "Udayagiri Caves",
    location: {
      state: "Odisha",
      district: "Bhubaneswar",
      latitude: 20.2735,
      longitude: 85.7803,
    },
    rockTypes: ["Sandstone", "Laterite"],
    formations: ["Ancient sandstone formations with cave systems"],
    description: "Ancient rock-cut caves carved into sandstone formations, showcasing geological and archaeological significance.",
    significance: "Demonstrates weathering patterns and cave formation processes in sandstone.",
    image: "/placeholder.svg",
    accessibility: "Easy",
    bestTimeToVisit: "October to March",
  },
  {
    id: "5",
    name: "Gopalpur Beach",
    location: {
      state: "Odisha",
      district: "Ganjam",
      latitude: 19.2583,
      longitude: 84.9167,
    },
    rockTypes: ["Marine sediments", "Beach sand"],
    formations: ["Coastal formations", "Active beach deposits"],
    description: "Coastal site with active sediment deposition and coastal geomorphological features.",
    significance: "Ideal for studying coastal processes, wave action, and beach formation.",
    image: "/placeholder.svg",
    accessibility: "Easy",
    bestTimeToVisit: "October to March",
  },
  {
    id: "6",
    name: "Khandadhar Waterfall",
    location: {
      state: "Odisha",
      district: "Sundargarh",
      latitude: 22.0167,
      longitude: 85.1333,
    },
    rockTypes: ["Basalt", "Iron ore deposits"],
    formations: ["Deccan Trap formations", "Banded iron formations"],
    description: "One of India's highest waterfalls cascading over basalt and iron-rich rock formations.",
    significance: "Important site for studying volcanic rock formations and iron ore geology.",
    image: "/placeholder.svg",
    accessibility: "Difficult",
    bestTimeToVisit: "July to October (monsoon for waterfall)",
  },
];
