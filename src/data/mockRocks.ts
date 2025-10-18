export type RockType = "Igneous" | "Sedimentary" | "Metamorphic";

export interface Rock {
  id: string;
  name: string;
  type: RockType;
  composition: string;
  texture: string;
  color: string[];
  formation: string;
  hardness: number;
  image: string;
  description: string;
}

export const mockRocks: Rock[] = [
  {
    id: "1",
    name: "Granite",
    type: "Igneous",
    composition: "Quartz, Feldspar, Mica",
    texture: "Coarse-grained",
    color: ["Pink", "Gray", "White"],
    formation: "Intrusive igneous rock formed from slowly cooled magma",
    hardness: 7,
    image: "/placeholder.svg",
    description: "Granite is a light-colored igneous rock with grains large enough to be visible with the unaided eye. It forms from the slow crystallization of magma below Earth's surface."
  },
  {
    id: "2",
    name: "Basalt",
    type: "Igneous",
    composition: "Plagioclase, Pyroxene, Olivine",
    texture: "Fine-grained",
    color: ["Black", "Dark Gray"],
    formation: "Extrusive igneous rock formed from rapidly cooled lava",
    hardness: 6,
    image: "/placeholder.svg",
    description: "Basalt is a dark-colored, fine-grained volcanic rock. It forms from the rapid cooling of lava at or near Earth's surface."
  },
  {
    id: "3",
    name: "Sandstone",
    type: "Sedimentary",
    composition: "Quartz, Feldspar",
    texture: "Medium-grained",
    color: ["Tan", "Brown", "Red", "Yellow"],
    formation: "Formed from cemented sand particles",
    hardness: 6,
    image: "/placeholder.svg",
    description: "Sandstone is a clastic sedimentary rock composed mainly of sand-sized minerals or rock grains."
  },
  {
    id: "4",
    name: "Limestone",
    type: "Sedimentary",
    composition: "Calcite (Calcium Carbonate)",
    texture: "Fine to coarse-grained",
    color: ["White", "Gray", "Tan"],
    formation: "Formed from marine organisms and chemical precipitation",
    hardness: 3,
    image: "/placeholder.svg",
    description: "Limestone is a sedimentary rock composed mainly of skeletal fragments of marine organisms such as coral, forams and molluscs."
  },
  {
    id: "5",
    name: "Marble",
    type: "Metamorphic",
    composition: "Calcite, Dolomite",
    texture: "Coarse-grained, crystalline",
    color: ["White", "Pink", "Green", "Black"],
    formation: "Metamorphosed limestone under heat and pressure",
    hardness: 3,
    image: "/placeholder.svg",
    description: "Marble is a metamorphic rock formed when limestone is subjected to high heat and pressure, resulting in a crystalline structure."
  },
  {
    id: "6",
    name: "Slate",
    type: "Metamorphic",
    composition: "Clay minerals, Quartz",
    texture: "Fine-grained, foliated",
    color: ["Gray", "Black", "Green", "Purple"],
    formation: "Metamorphosed shale under low-grade conditions",
    hardness: 4,
    image: "/placeholder.svg",
    description: "Slate is a fine-grained, foliated metamorphic rock derived from shale. It splits easily into thin, flat plates."
  }
];
