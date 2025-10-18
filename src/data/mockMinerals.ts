export interface Mineral {
  id: string;
  name: string;
  formula: string;
  hardness: number;
  luster: string;
  color: string[];
  streak: string;
  cleavage: string;
  fracture: string;
  crystalSystem: string;
  uses: string[];
  image: string;
  description: string;
}

export const mockMinerals: Mineral[] = [
  {
    id: "1",
    name: "Quartz",
    formula: "SiO₂",
    hardness: 7,
    luster: "Vitreous",
    color: ["Clear", "White", "Purple", "Pink", "Yellow"],
    streak: "White",
    cleavage: "None",
    fracture: "Conchoidal",
    crystalSystem: "Hexagonal",
    uses: ["Jewelry", "Glass manufacturing", "Electronics"],
    image: "/placeholder.svg",
    description: "Quartz is one of the most common minerals on Earth. It occurs in various forms and colors."
  },
  {
    id: "2",
    name: "Feldspar",
    formula: "KAlSi₃O₈",
    hardness: 6,
    luster: "Vitreous to pearly",
    color: ["White", "Pink", "Gray"],
    streak: "White",
    cleavage: "Perfect in two directions",
    fracture: "Uneven",
    crystalSystem: "Monoclinic/Triclinic",
    uses: ["Ceramics", "Glass", "Abrasives"],
    image: "/placeholder.svg",
    description: "Feldspar is the most abundant mineral group in the Earth's crust, making up about 60% of it."
  },
  {
    id: "3",
    name: "Calcite",
    formula: "CaCO₃",
    hardness: 3,
    luster: "Vitreous",
    color: ["White", "Yellow", "Orange", "Blue"],
    streak: "White",
    cleavage: "Perfect in three directions",
    fracture: "Conchoidal",
    crystalSystem: "Trigonal",
    uses: ["Cement", "Lime", "Fertilizer"],
    image: "/placeholder.svg",
    description: "Calcite is a carbonate mineral and the most stable polymorph of calcium carbonate."
  },
  {
    id: "4",
    name: "Pyrite",
    formula: "FeS₂",
    hardness: 6,
    luster: "Metallic",
    color: ["Brass-yellow"],
    streak: "Greenish-black",
    cleavage: "Indistinct",
    fracture: "Conchoidal to uneven",
    crystalSystem: "Cubic",
    uses: ["Sulfur production", "Historic source of sulfur"],
    image: "/placeholder.svg",
    description: "Pyrite, also known as fool's gold, is an iron sulfide mineral with a brassy-yellow metallic appearance."
  },
  {
    id: "5",
    name: "Mica",
    formula: "KAl₂(AlSi₃O₁₀)(OH)₂",
    hardness: 2.5,
    luster: "Pearly",
    color: ["Silver", "Black", "Brown"],
    streak: "White",
    cleavage: "Perfect basal",
    fracture: "Flaky",
    crystalSystem: "Monoclinic",
    uses: ["Electrical insulation", "Cosmetics", "Paint"],
    image: "/placeholder.svg",
    description: "Mica minerals are characterized by perfect basal cleavage, meaning they split easily into thin, flexible sheets."
  },
  {
    id: "6",
    name: "Halite",
    formula: "NaCl",
    hardness: 2.5,
    luster: "Vitreous",
    color: ["Colorless", "White", "Blue", "Pink"],
    streak: "White",
    cleavage: "Perfect cubic",
    fracture: "Conchoidal",
    crystalSystem: "Cubic",
    uses: ["Table salt", "De-icing", "Chemical production"],
    image: "/placeholder.svg",
    description: "Halite, commonly known as rock salt, is the mineral form of sodium chloride (NaCl)."
  }
];
