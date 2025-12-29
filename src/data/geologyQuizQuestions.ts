// Comprehensive Geology Quiz Questions covering all 23 Core courses
// Based on Odisha State Higher Education Council BSc Geology Curriculum (NEP-2020)

export type Difficulty = "easy" | "medium" | "hard";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-3)
  topic: string;
  course: string;
  difficulty: Difficulty;
  explanation?: string;
}

export const geologyQuizQuestions: QuizQuestion[] = [
  // Core I: General Geology (Origin of Earth, Its Evolution and Landforms)
  {
    id: "gg-001",
    question: "What is the approximate age of the Earth?",
    options: ["3.5 billion years", "4.5 billion years", "5.5 billion years", "6.5 billion years"],
    correctAnswer: 1,
    topic: "Earth as a Planet",
    course: "General Geology",
    difficulty: "easy",
    explanation: "The Earth is approximately 4.5 billion years old, determined through radioactive dating of meteorites and Earth's oldest rocks."
  },
  {
    id: "gg-002",
    question: "Which type of planets are also known as gas giants?",
    options: ["Terrestrial planets", "Jovian planets", "Dwarf planets", "Inner planets"],
    correctAnswer: 1,
    topic: "Solar System",
    course: "General Geology",
    difficulty: "easy",
    explanation: "Jovian planets (Jupiter, Saturn, Uranus, Neptune) are called gas giants due to their large size and gaseous composition."
  },
  {
    id: "gg-003",
    question: "What is the primary source of seismic waves used to study Earth's internal structure?",
    options: ["Volcanic eruptions", "Ocean currents", "Earthquakes", "Wind patterns"],
    correctAnswer: 2,
    topic: "Internal Structure of Earth",
    course: "General Geology",
    difficulty: "easy"
  },
  {
    id: "gg-004",
    question: "Which layer of the Earth is primarily composed of iron and nickel?",
    options: ["Crust", "Mantle", "Outer core", "Inner core"],
    correctAnswer: 3,
    topic: "Internal Structure of Earth",
    course: "General Geology",
    difficulty: "medium"
  },
  {
    id: "gg-005",
    question: "What type of volcano has gentle slopes and is built from fluid lava flows?",
    options: ["Stratovolcano", "Shield volcano", "Cinder cone", "Composite volcano"],
    correctAnswer: 1,
    topic: "Volcanoes",
    course: "General Geology",
    difficulty: "medium"
  },
  {
    id: "gg-006",
    question: "U-shaped valleys are characteristic landforms created by:",
    options: ["River erosion", "Wind erosion", "Glacial erosion", "Wave erosion"],
    correctAnswer: 2,
    topic: "Geological Action of Glaciers",
    course: "General Geology",
    difficulty: "easy"
  },
  {
    id: "gg-007",
    question: "Which drainage pattern develops on uniformly resistant rock with no structural control?",
    options: ["Trellis", "Dendritic", "Radial", "Rectangular"],
    correctAnswer: 1,
    topic: "Drainage Patterns",
    course: "General Geology",
    difficulty: "medium"
  },
  {
    id: "gg-008",
    question: "What is the process of physical and chemical breakdown of rocks at Earth's surface called?",
    options: ["Erosion", "Weathering", "Deposition", "Lithification"],
    correctAnswer: 1,
    topic: "Denudation",
    course: "General Geology",
    difficulty: "easy"
  },

  // Core II: Historical Geology
  {
    id: "hg-001",
    question: "Who proposed the theory of continental drift?",
    options: ["Harry Hess", "Alfred Wegener", "J. Tuzo Wilson", "Arthur Holmes"],
    correctAnswer: 1,
    topic: "Plate Tectonics",
    course: "Historical Geology",
    difficulty: "easy",
    explanation: "Alfred Wegener proposed the continental drift theory in 1912, suggesting that continents were once joined together."
  },
  {
    id: "hg-002",
    question: "What is the term for the supercontinent that existed about 300 million years ago?",
    options: ["Gondwana", "Laurasia", "Pangaea", "Rodinia"],
    correctAnswer: 2,
    topic: "Continental Drift",
    course: "Historical Geology",
    difficulty: "easy"
  },
  {
    id: "hg-003",
    question: "Mid-oceanic ridges are examples of which type of plate boundary?",
    options: ["Convergent", "Divergent", "Transform", "Conservative"],
    correctAnswer: 1,
    topic: "Plate Tectonics",
    course: "Historical Geology",
    difficulty: "medium"
  },
  {
    id: "hg-004",
    question: "What is the principle that states 'the present is the key to the past'?",
    options: ["Superposition", "Uniformitarianism", "Original horizontality", "Cross-cutting relations"],
    correctAnswer: 1,
    topic: "Principles of Stratigraphy",
    course: "Historical Geology",
    difficulty: "medium"
  },
  {
    id: "hg-005",
    question: "Fossils that are used to correlate rocks of the same age are called:",
    options: ["Trace fossils", "Index fossils", "Body fossils", "Living fossils"],
    correctAnswer: 1,
    topic: "Fossils",
    course: "Historical Geology",
    difficulty: "easy"
  },
  {
    id: "hg-006",
    question: "Which process describes the vertical movement of the Earth's crust?",
    options: ["Orogeny", "Epeirogeny", "Isostasy", "Subduction"],
    correctAnswer: 1,
    topic: "Crustal Processes",
    course: "Historical Geology",
    difficulty: "hard"
  },

  // Core III: Crystallography
  {
    id: "cr-001",
    question: "How many crystal systems are there in crystallography?",
    options: ["4", "5", "6", "7"],
    correctAnswer: 3,
    topic: "Crystal Systems",
    course: "Crystallography",
    difficulty: "easy",
    explanation: "There are 7 crystal systems: Isometric, Tetragonal, Hexagonal, Trigonal, Orthorhombic, Monoclinic, and Triclinic."
  },
  {
    id: "cr-002",
    question: "Which crystal system has all three axes equal in length and at right angles?",
    options: ["Tetragonal", "Isometric", "Orthorhombic", "Hexagonal"],
    correctAnswer: 1,
    topic: "Crystal Systems",
    course: "Crystallography",
    difficulty: "medium"
  },
  {
    id: "cr-003",
    question: "What is the phenomenon where two crystals grow together in a specific relationship called?",
    options: ["Polymorphism", "Isomorphism", "Twinning", "Pseudomorphism"],
    correctAnswer: 2,
    topic: "Crystal Forms",
    course: "Crystallography",
    difficulty: "medium"
  },
  {
    id: "cr-004",
    question: "The Miller indices (100) represent a plane that:",
    options: ["Intercepts all three axes equally", "Is parallel to two axes", "Passes through the origin", "Never exists in crystals"],
    correctAnswer: 1,
    topic: "Miller Indices",
    course: "Crystallography",
    difficulty: "hard"
  },
  {
    id: "cr-005",
    question: "How many Bravais lattices are there?",
    options: ["7", "14", "32", "230"],
    correctAnswer: 1,
    topic: "Bravais Lattice",
    course: "Crystallography",
    difficulty: "hard"
  },

  // Core IV: Mineralogy and Mineral Optics
  {
    id: "mm-001",
    question: "What is the hardness of quartz on the Mohs scale?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 2,
    topic: "Physical Properties",
    course: "Mineralogy",
    difficulty: "easy",
    explanation: "Quartz has a hardness of 7 on the Mohs hardness scale."
  },
  {
    id: "mm-002",
    question: "Which mineral group has the basic structural unit (SiO4)4-?",
    options: ["Carbonates", "Silicates", "Sulfides", "Oxides"],
    correctAnswer: 1,
    topic: "Silicate Structure",
    course: "Mineralogy",
    difficulty: "easy"
  },
  {
    id: "mm-003",
    question: "What is the property where a mineral breaks along smooth, flat planes?",
    options: ["Fracture", "Cleavage", "Parting", "Tenacity"],
    correctAnswer: 1,
    topic: "Physical Properties",
    course: "Mineralogy",
    difficulty: "easy"
  },
  {
    id: "mm-004",
    question: "Which optical property refers to the apparent change in position of an object due to different refractive indices?",
    options: ["Pleochroism", "Birefringence", "Relief", "Extinction"],
    correctAnswer: 2,
    topic: "Mineral Optics",
    course: "Mineralogy",
    difficulty: "hard"
  },
  {
    id: "mm-005",
    question: "What is the phenomenon where minerals show different colors in different directions?",
    options: ["Iridescence", "Pleochroism", "Fluorescence", "Opalescence"],
    correctAnswer: 1,
    topic: "Optical Properties",
    course: "Mineralogy",
    difficulty: "medium"
  },
  {
    id: "mm-006",
    question: "Olivine is an example of which silicate structure type?",
    options: ["Framework silicate", "Chain silicate", "Sheet silicate", "Nesosilicate (Isolated)"],
    correctAnswer: 3,
    topic: "Silicate Classification",
    course: "Mineralogy",
    difficulty: "hard"
  },

  // Core V: Geochemistry and Elementary Petrology
  {
    id: "gc-001",
    question: "Which element is most abundant in the Earth's crust by weight?",
    options: ["Silicon", "Oxygen", "Aluminum", "Iron"],
    correctAnswer: 1,
    topic: "Cosmic Abundance",
    course: "Geochemistry",
    difficulty: "easy",
    explanation: "Oxygen is the most abundant element in Earth's crust, making up about 46% by weight."
  },
  {
    id: "gc-002",
    question: "According to Goldschmidt's classification, siderophile elements have affinity for:",
    options: ["Oxygen", "Sulfur", "Iron", "Silicate"],
    correctAnswer: 2,
    topic: "Geochemical Classification",
    course: "Geochemistry",
    difficulty: "hard"
  },
  {
    id: "gc-003",
    question: "The three main types of rocks are igneous, sedimentary, and:",
    options: ["Volcanic", "Plutonic", "Metamorphic", "Clastic"],
    correctAnswer: 2,
    topic: "Elementary Petrology",
    course: "Geochemistry",
    difficulty: "easy"
  },
  {
    id: "gc-004",
    question: "What is the process of one atom replacing another of similar size and charge in a crystal structure?",
    options: ["Isomorphism", "Polymorphism", "Ionic substitution", "Diadochy"],
    correctAnswer: 3,
    topic: "Atomic Substitution",
    course: "Geochemistry",
    difficulty: "hard"
  },

  // Core VI: Elementary Economic Geology
  {
    id: "eg-001",
    question: "What is the minimum concentration of a metal required for profitable extraction called?",
    options: ["Tenor", "Grade", "Cut-off grade", "Ore reserve"],
    correctAnswer: 2,
    topic: "Ore Deposits",
    course: "Economic Geology",
    difficulty: "medium",
    explanation: "Cut-off grade is the minimum grade or quality of ore that can be profitably mined."
  },
  {
    id: "eg-002",
    question: "Which type of ore deposit is formed by the action of hot aqueous solutions?",
    options: ["Placer deposit", "Hydrothermal deposit", "Residual deposit", "Sedimentary deposit"],
    correctAnswer: 1,
    topic: "Ore Genesis",
    course: "Economic Geology",
    difficulty: "medium"
  },
  {
    id: "eg-003",
    question: "Bauxite is the primary ore of which metal?",
    options: ["Iron", "Copper", "Aluminum", "Zinc"],
    correctAnswer: 2,
    topic: "Metallic Ores",
    course: "Economic Geology",
    difficulty: "easy"
  },
  {
    id: "eg-004",
    question: "Which process concentrates heavy minerals by the action of flowing water?",
    options: ["Leaching", "Placer concentration", "Supergene enrichment", "Contact metasomatism"],
    correctAnswer: 1,
    topic: "Ore Formation",
    course: "Economic Geology",
    difficulty: "medium"
  },

  // Core VII: Paleontology
  {
    id: "pl-001",
    question: "Which era is known as the 'Age of Reptiles'?",
    options: ["Paleozoic", "Mesozoic", "Cenozoic", "Precambrian"],
    correctAnswer: 1,
    topic: "Geological Eras",
    course: "Paleontology",
    difficulty: "easy",
    explanation: "The Mesozoic Era (252-66 million years ago) is called the Age of Reptiles due to dinosaur dominance."
  },
  {
    id: "pl-002",
    question: "The study of fossil plants is called:",
    options: ["Palynology", "Paleobotany", "Micropaleontology", "Paleoecology"],
    correctAnswer: 1,
    topic: "Paleontology Branches",
    course: "Paleontology",
    difficulty: "medium"
  },
  {
    id: "pl-003",
    question: "Which type of fossil preserves the actual remains of an organism?",
    options: ["Cast", "Mold", "Body fossil", "Trace fossil"],
    correctAnswer: 2,
    topic: "Fossil Types",
    course: "Paleontology",
    difficulty: "easy"
  },
  {
    id: "pl-004",
    question: "Trilobites are characteristic fossils of which era?",
    options: ["Precambrian", "Paleozoic", "Mesozoic", "Cenozoic"],
    correctAnswer: 1,
    topic: "Index Fossils",
    course: "Paleontology",
    difficulty: "medium"
  },
  {
    id: "pl-005",
    question: "What process turns organic remains into fossils?",
    options: ["Metamorphism", "Fossilization", "Diagenesis", "Weathering"],
    correctAnswer: 1,
    topic: "Fossil Formation",
    course: "Paleontology",
    difficulty: "easy"
  },

  // Core VIII: Stratigraphy
  {
    id: "st-001",
    question: "The Gondwana rocks of India are famous for:",
    options: ["Marine fossils", "Coal deposits", "Volcanic rocks", "Metallic ores"],
    correctAnswer: 1,
    topic: "Indian Stratigraphy",
    course: "Stratigraphy",
    difficulty: "easy",
    explanation: "Gondwana rocks (Permian to Jurassic) contain major coal deposits of India."
  },
  {
    id: "st-002",
    question: "The principle of superposition states that:",
    options: ["Older rocks are on top", "Younger rocks are at the bottom", "Older rocks are at the bottom", "All rocks are of same age"],
    correctAnswer: 2,
    topic: "Principles of Stratigraphy",
    course: "Stratigraphy",
    difficulty: "easy"
  },
  {
    id: "st-003",
    question: "Which is the largest eon in the geological time scale?",
    options: ["Phanerozoic", "Proterozoic", "Archean", "Hadean"],
    correctAnswer: 1,
    topic: "Geological Time Scale",
    course: "Stratigraphy",
    difficulty: "hard"
  },
  {
    id: "st-004",
    question: "The Deccan Traps of India were formed during which period?",
    options: ["Jurassic", "Cretaceous-Paleogene", "Triassic", "Permian"],
    correctAnswer: 1,
    topic: "Indian Stratigraphy",
    course: "Stratigraphy",
    difficulty: "medium"
  },
  {
    id: "st-005",
    question: "Siwalik rocks are known for fossils of:",
    options: ["Dinosaurs", "Trilobites", "Mammals", "Ammonites"],
    correctAnswer: 2,
    topic: "Cenozoic Stratigraphy",
    course: "Stratigraphy",
    difficulty: "medium"
  },

  // Core IX: Igneous Petrology
  {
    id: "ip-001",
    question: "Granite is an example of which type of igneous rock?",
    options: ["Volcanic", "Hypabyssal", "Plutonic", "Pyroclastic"],
    correctAnswer: 2,
    topic: "Igneous Rock Classification",
    course: "Igneous Petrology",
    difficulty: "easy",
    explanation: "Granite is a coarse-grained plutonic (intrusive) igneous rock formed deep within the Earth."
  },
  {
    id: "ip-002",
    question: "What texture is characterized by large crystals surrounded by fine-grained groundmass?",
    options: ["Granular", "Porphyritic", "Glassy", "Vesicular"],
    correctAnswer: 1,
    topic: "Igneous Textures",
    course: "Igneous Petrology",
    difficulty: "medium"
  },
  {
    id: "ip-003",
    question: "According to Bowen's Reaction Series, which mineral crystallizes first from a mafic magma?",
    options: ["Quartz", "Orthoclase", "Olivine", "Muscovite"],
    correctAnswer: 2,
    topic: "Bowen's Reaction Series",
    course: "Igneous Petrology",
    difficulty: "medium"
  },
  {
    id: "ip-004",
    question: "Basalt is the volcanic equivalent of which plutonic rock?",
    options: ["Granite", "Diorite", "Gabbro", "Syenite"],
    correctAnswer: 2,
    topic: "Igneous Rock Pairs",
    course: "Igneous Petrology",
    difficulty: "medium"
  },
  {
    id: "ip-005",
    question: "What is the process where magma composition changes due to fractional crystallization?",
    options: ["Assimilation", "Magmatic differentiation", "Hybridization", "Anatexis"],
    correctAnswer: 1,
    topic: "Magmatic Processes",
    course: "Igneous Petrology",
    difficulty: "hard"
  },

  // Core X: Sedimentary Petrology
  {
    id: "sp-001",
    question: "What is the most abundant sedimentary rock?",
    options: ["Sandstone", "Shale", "Limestone", "Conglomerate"],
    correctAnswer: 1,
    topic: "Sedimentary Rocks",
    course: "Sedimentary Petrology",
    difficulty: "medium",
    explanation: "Shale makes up about 70% of all sedimentary rocks."
  },
  {
    id: "sp-002",
    question: "Cross-bedding in sandstones indicates:",
    options: ["Quiet water deposition", "Current direction", "Deep marine environment", "Glacial origin"],
    correctAnswer: 1,
    topic: "Sedimentary Structures",
    course: "Sedimentary Petrology",
    difficulty: "medium"
  },
  {
    id: "sp-003",
    question: "What type of sedimentary rock forms from evaporation of seawater?",
    options: ["Clastic", "Chemical", "Organic", "Evaporite"],
    correctAnswer: 3,
    topic: "Sedimentary Rock Types",
    course: "Sedimentary Petrology",
    difficulty: "easy"
  },
  {
    id: "sp-004",
    question: "The process of converting loose sediments into solid rock is called:",
    options: ["Weathering", "Lithification", "Metamorphism", "Crystallization"],
    correctAnswer: 1,
    topic: "Sedimentary Processes",
    course: "Sedimentary Petrology",
    difficulty: "easy"
  },
  {
    id: "sp-005",
    question: "Ripple marks are formed by:",
    options: ["Mud cracks", "Water or wind action", "Organic activity", "Chemical precipitation"],
    correctAnswer: 1,
    topic: "Sedimentary Structures",
    course: "Sedimentary Petrology",
    difficulty: "easy"
  },

  // Core XI: Metamorphic Petrology
  {
    id: "mp-001",
    question: "What are the three main agents of metamorphism?",
    options: ["Water, wind, ice", "Heat, pressure, chemically active fluids", "Magma, lava, ash", "Erosion, deposition, compaction"],
    correctAnswer: 1,
    topic: "Metamorphism Factors",
    course: "Metamorphic Petrology",
    difficulty: "easy",
    explanation: "Heat, pressure, and chemically active fluids are the three main agents that cause metamorphism."
  },
  {
    id: "mp-002",
    question: "Which metamorphic rock forms from limestone?",
    options: ["Slate", "Quartzite", "Marble", "Schist"],
    correctAnswer: 2,
    topic: "Metamorphic Rocks",
    course: "Metamorphic Petrology",
    difficulty: "easy"
  },
  {
    id: "mp-003",
    question: "Foliation in metamorphic rocks is caused by:",
    options: ["Rapid cooling", "High temperature only", "Directed pressure", "Chemical weathering"],
    correctAnswer: 2,
    topic: "Metamorphic Textures",
    course: "Metamorphic Petrology",
    difficulty: "medium"
  },
  {
    id: "mp-004",
    question: "Which mineral is an index mineral for the garnet zone of metamorphism?",
    options: ["Chlorite", "Biotite", "Garnet", "Sillimanite"],
    correctAnswer: 2,
    topic: "Metamorphic Zones",
    course: "Metamorphic Petrology",
    difficulty: "medium"
  },
  {
    id: "mp-005",
    question: "Charnockite is a characteristic rock of which facies?",
    options: ["Greenschist", "Amphibolite", "Granulite", "Blueschist"],
    correctAnswer: 2,
    topic: "Metamorphic Facies",
    course: "Metamorphic Petrology",
    difficulty: "hard"
  },

  // Core XII: Remote Sensing and GIS
  {
    id: "rs-001",
    question: "What does NDVI stand for in remote sensing?",
    options: ["Normal Digital Value Index", "Normalized Difference Vegetation Index", "Near Distance Visual Imaging", "National Data Vector Index"],
    correctAnswer: 1,
    topic: "Remote Sensing Indices",
    course: "Remote Sensing and GIS",
    difficulty: "medium"
  },
  {
    id: "rs-002",
    question: "Which satellite series is India's primary Earth observation satellite?",
    options: ["LANDSAT", "SPOT", "IRS", "ASTER"],
    correctAnswer: 2,
    topic: "Satellites",
    course: "Remote Sensing and GIS",
    difficulty: "easy"
  },
  {
    id: "rs-003",
    question: "GIS stands for:",
    options: ["Geological Information System", "Geographic Information System", "Global Image System", "Ground Investigation Survey"],
    correctAnswer: 1,
    topic: "GIS Fundamentals",
    course: "Remote Sensing and GIS",
    difficulty: "easy"
  },
  {
    id: "rs-004",
    question: "Which type of resolution refers to the ability to distinguish between objects?",
    options: ["Temporal", "Spectral", "Spatial", "Radiometric"],
    correctAnswer: 2,
    topic: "Remote Sensing Resolution",
    course: "Remote Sensing and GIS",
    difficulty: "medium"
  },

  // Core XIII: Structural Geology & Tectonics
  {
    id: "sg-001",
    question: "What type of fold has the oldest rocks in the center?",
    options: ["Syncline", "Anticline", "Monocline", "Isoclinal fold"],
    correctAnswer: 1,
    topic: "Folds",
    course: "Structural Geology",
    difficulty: "medium",
    explanation: "An anticline is an upward-arching fold with the oldest rocks in the core."
  },
  {
    id: "sg-002",
    question: "A normal fault is caused by what type of stress?",
    options: ["Compressional", "Tensional", "Shear", "Hydrostatic"],
    correctAnswer: 1,
    topic: "Faults",
    course: "Structural Geology",
    difficulty: "medium"
  },
  {
    id: "sg-003",
    question: "Strike is measured in which direction?",
    options: ["Vertical", "Down the slope", "Horizontal along the bed", "Perpendicular to bedding"],
    correctAnswer: 2,
    topic: "Attitude of Beds",
    course: "Structural Geology",
    difficulty: "easy"
  },
  {
    id: "sg-004",
    question: "An outlier is:",
    options: ["Younger rock surrounded by older rocks", "Older rock surrounded by younger rocks", "A fault feature", "A fold axis"],
    correctAnswer: 0,
    topic: "Structural Features",
    course: "Structural Geology",
    difficulty: "hard"
  },
  {
    id: "sg-005",
    question: "Which type of unconformity separates parallel beds?",
    options: ["Angular unconformity", "Disconformity", "Nonconformity", "Paraconformity"],
    correctAnswer: 1,
    topic: "Unconformities",
    course: "Structural Geology",
    difficulty: "hard"
  },

  // Core XIV: Engineering Geology & Rock Mechanics
  {
    id: "en-001",
    question: "RQD stands for:",
    options: ["Rock Quality Designation", "Rock Quantity Determination", "Rock Quarry Depth", "Rock Qualification Data"],
    correctAnswer: 0,
    topic: "Rock Mass Classification",
    course: "Engineering Geology",
    difficulty: "easy",
    explanation: "RQD is a measure of rock quality based on the percentage of intact core pieces longer than 10 cm."
  },
  {
    id: "en-002",
    question: "Which type of dam is suitable for narrow V-shaped valleys?",
    options: ["Earth dam", "Arch dam", "Gravity dam", "Buttress dam"],
    correctAnswer: 1,
    topic: "Dam Engineering",
    course: "Engineering Geology",
    difficulty: "medium"
  },
  {
    id: "en-003",
    question: "Landslides are most common in:",
    options: ["Flat terrain", "Steep slopes with water saturation", "Desert regions", "Coastal plains"],
    correctAnswer: 1,
    topic: "Slope Stability",
    course: "Engineering Geology",
    difficulty: "easy"
  },
  {
    id: "en-004",
    question: "The Mohr circle is used to determine:",
    options: ["Rock age", "Stress conditions at failure", "Mineral composition", "Porosity"],
    correctAnswer: 1,
    topic: "Rock Mechanics",
    course: "Engineering Geology",
    difficulty: "hard"
  },

  // Core XV: Hydrogeology
  {
    id: "hy-001",
    question: "An aquifer is defined as:",
    options: ["Impermeable rock layer", "Rock that stores and transmits water", "Underground cave", "Surface water body"],
    correctAnswer: 1,
    topic: "Groundwater Basics",
    course: "Hydrogeology",
    difficulty: "easy",
    explanation: "An aquifer is a geological formation that can store and transmit groundwater in usable quantities."
  },
  {
    id: "hy-002",
    question: "Darcy's Law relates to:",
    options: ["Surface runoff", "Groundwater flow", "Evaporation", "Precipitation"],
    correctAnswer: 1,
    topic: "Groundwater Flow",
    course: "Hydrogeology",
    difficulty: "medium"
  },
  {
    id: "hy-003",
    question: "The water table is:",
    options: ["Always horizontal", "The upper surface of the saturated zone", "Only in deserts", "A man-made structure"],
    correctAnswer: 1,
    topic: "Groundwater Zones",
    course: "Hydrogeology",
    difficulty: "easy"
  },
  {
    id: "hy-004",
    question: "Which property indicates the ability of rock to transmit water?",
    options: ["Porosity", "Permeability", "Specific yield", "Storage coefficient"],
    correctAnswer: 1,
    topic: "Aquifer Properties",
    course: "Hydrogeology",
    difficulty: "medium"
  },

  // Core XVI: Exploration and Mining Geology
  {
    id: "em-001",
    question: "Which geophysical method detects magnetic minerals?",
    options: ["Gravity survey", "Magnetic survey", "Seismic survey", "Electrical resistivity"],
    correctAnswer: 1,
    topic: "Mineral Exploration",
    course: "Exploration Geology",
    difficulty: "easy"
  },
  {
    id: "em-002",
    question: "Open-cast mining is suitable for:",
    options: ["Deep deposits", "Near-surface deposits", "Underwater deposits", "Volcanic ores"],
    correctAnswer: 1,
    topic: "Mining Methods",
    course: "Exploration Geology",
    difficulty: "easy"
  },
  {
    id: "em-003",
    question: "Froth flotation is a method of:",
    options: ["Drilling", "Mineral beneficiation", "Geological mapping", "Geochemical sampling"],
    correctAnswer: 1,
    topic: "Mineral Processing",
    course: "Exploration Geology",
    difficulty: "medium"
  },

  // Core XVII: Economic Minerals of India
  {
    id: "ei-001",
    question: "Which state is the largest producer of iron ore in India?",
    options: ["Jharkhand", "Karnataka", "Odisha", "Goa"],
    correctAnswer: 2,
    topic: "Indian Minerals",
    course: "Economic Minerals of India",
    difficulty: "easy",
    explanation: "Odisha is India's largest iron ore producing state, with major deposits in Keonjhar and Sundargarh districts."
  },
  {
    id: "ei-002",
    question: "Sukinda Valley in Odisha is famous for which mineral?",
    options: ["Iron ore", "Chromite", "Bauxite", "Manganese"],
    correctAnswer: 1,
    topic: "Odisha Minerals",
    course: "Economic Minerals of India",
    difficulty: "medium"
  },
  {
    id: "ei-003",
    question: "Kolar Gold Fields are located in which state?",
    options: ["Maharashtra", "Rajasthan", "Karnataka", "Andhra Pradesh"],
    correctAnswer: 2,
    topic: "Indian Mineral Deposits",
    course: "Economic Minerals of India",
    difficulty: "medium"
  },
  {
    id: "ei-004",
    question: "Which mineral is called 'Black Gold'?",
    options: ["Iron", "Manganese", "Coal", "Graphite"],
    correctAnswer: 2,
    topic: "Fuel Minerals",
    course: "Economic Minerals of India",
    difficulty: "easy"
  },

  // Core XVIII: Laboratory Instrumentation
  {
    id: "li-001",
    question: "XRD is used to determine:",
    options: ["Chemical composition", "Crystal structure", "Age of rocks", "Porosity"],
    correctAnswer: 1,
    topic: "X-Ray Diffraction",
    course: "Laboratory Instrumentation",
    difficulty: "medium",
    explanation: "X-Ray Diffraction (XRD) is used to identify mineral crystal structures and compositions."
  },
  {
    id: "li-002",
    question: "Atomic Absorption Spectroscopy is used for:",
    options: ["Age dating", "Elemental analysis", "Texture study", "Fossil identification"],
    correctAnswer: 1,
    topic: "Analytical Methods",
    course: "Laboratory Instrumentation",
    difficulty: "medium"
  },
  {
    id: "li-003",
    question: "Mass spectrometry measures:",
    options: ["Mass-to-charge ratio of ions", "Light absorption", "X-ray emission", "Magnetic properties"],
    correctAnswer: 0,
    topic: "Mass Spectrometry",
    course: "Laboratory Instrumentation",
    difficulty: "hard"
  },

  // Core XIX: Geology of Odisha
  {
    id: "go-001",
    question: "The Eastern Ghats Supergroup of Odisha is primarily composed of:",
    options: ["Sedimentary rocks", "Volcanic rocks", "High-grade metamorphic rocks", "Fossil-bearing strata"],
    correctAnswer: 2,
    topic: "Odisha Stratigraphy",
    course: "Geology of Odisha",
    difficulty: "medium"
  },
  {
    id: "go-002",
    question: "Chilika Lake is what type of water body?",
    options: ["Freshwater lake", "Brackish water lagoon", "Salt lake", "Crater lake"],
    correctAnswer: 1,
    topic: "Odisha Geomorphology",
    course: "Geology of Odisha",
    difficulty: "easy"
  },
  {
    id: "go-003",
    question: "The Iron Ore Supergroup of Odisha is found in:",
    options: ["Coastal areas", "Singhbhum-Keonjhar-Bonai region", "Chilika area", "Western Odisha"],
    correctAnswer: 1,
    topic: "Odisha Geology",
    course: "Geology of Odisha",
    difficulty: "hard"
  },

  // Core XX: Fuel Geology
  {
    id: "fg-001",
    question: "Coal is formed from:",
    options: ["Marine organisms", "Plant remains", "Animal remains", "Volcanic material"],
    correctAnswer: 1,
    topic: "Coal Formation",
    course: "Fuel Geology",
    difficulty: "easy",
    explanation: "Coal forms from the accumulation and preservation of plant material in swampy environments over millions of years."
  },
  {
    id: "fg-002",
    question: "Which type of coal has the highest carbon content?",
    options: ["Peat", "Lignite", "Bituminous", "Anthracite"],
    correctAnswer: 3,
    topic: "Coal Classification",
    course: "Fuel Geology",
    difficulty: "medium"
  },
  {
    id: "fg-003",
    question: "Petroleum is primarily composed of:",
    options: ["Silicates", "Carbonates", "Hydrocarbons", "Sulfides"],
    correctAnswer: 2,
    topic: "Petroleum Composition",
    course: "Fuel Geology",
    difficulty: "easy"
  },
  {
    id: "fg-004",
    question: "A petroleum trap requires which essential elements?",
    options: ["Volcano and earthquake", "Source rock, reservoir, seal, and trap", "River and lake", "Mountain and valley"],
    correctAnswer: 1,
    topic: "Petroleum System",
    course: "Fuel Geology",
    difficulty: "hard"
  },
  {
    id: "fg-005",
    question: "Talcher and Ib Valley are famous coal fields in which state?",
    options: ["West Bengal", "Jharkhand", "Odisha", "Madhya Pradesh"],
    correctAnswer: 2,
    topic: "Indian Coal Fields",
    course: "Fuel Geology",
    difficulty: "easy"
  },

  // Core XXI: Environmental Geology
  {
    id: "ev-001",
    question: "Which gas is the primary contributor to global warming?",
    options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Helium"],
    correctAnswer: 2,
    topic: "Climate Change",
    course: "Environmental Geology",
    difficulty: "easy"
  },
  {
    id: "ev-002",
    question: "Tsunami waves are typically generated by:",
    options: ["Strong winds", "Undersea earthquakes", "Heavy rainfall", "Volcanic ash"],
    correctAnswer: 1,
    topic: "Natural Disasters",
    course: "Environmental Geology",
    difficulty: "easy"
  },
  {
    id: "ev-003",
    question: "The ozone layer is located in which atmospheric layer?",
    options: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"],
    correctAnswer: 1,
    topic: "Atmosphere",
    course: "Environmental Geology",
    difficulty: "medium"
  },

  // Core XXII: Ore Microscopy
  {
    id: "om-001",
    question: "Ore microscopy uses which type of light?",
    options: ["Transmitted light only", "Reflected light only", "Ultraviolet light", "X-rays"],
    correctAnswer: 1,
    topic: "Ore Microscopy Basics",
    course: "Ore Microscopy",
    difficulty: "medium",
    explanation: "Ore minerals are opaque and studied using reflected light in ore microscopy."
  },
  {
    id: "om-002",
    question: "Pyrite has a characteristic color in reflected light of:",
    options: ["Red", "Blue", "Pale yellow", "Green"],
    correctAnswer: 2,
    topic: "Ore Mineral Identification",
    course: "Ore Microscopy",
    difficulty: "medium"
  },
  {
    id: "om-003",
    question: "Polished sections are used for studying:",
    options: ["Transparent minerals", "Opaque minerals", "Fossils", "Sedimentary structures"],
    correctAnswer: 1,
    topic: "Sample Preparation",
    course: "Ore Microscopy",
    difficulty: "easy"
  },

  // Core XXIII: Introduction to Geostatistics
  {
    id: "gs-001",
    question: "Kriging is a method of:",
    options: ["Rock dating", "Spatial interpolation", "Mineral processing", "Seismic analysis"],
    correctAnswer: 1,
    topic: "Geostatistics Methods",
    course: "Geostatistics",
    difficulty: "hard",
    explanation: "Kriging is a geostatistical interpolation method used to estimate values at unsampled locations."
  },
  {
    id: "gs-002",
    question: "A variogram is used to measure:",
    options: ["Rock hardness", "Spatial continuity", "Chemical composition", "Age of rocks"],
    correctAnswer: 1,
    topic: "Variogram Analysis",
    course: "Geostatistics",
    difficulty: "hard"
  },
  {
    id: "gs-003",
    question: "The range in a variogram represents:",
    options: ["Maximum variance", "Distance of spatial correlation", "Minimum value", "Sample size"],
    correctAnswer: 1,
    topic: "Variogram Parameters",
    course: "Geostatistics",
    difficulty: "hard"
  },

  // Additional questions for variety
  {
    id: "add-001",
    question: "What is the difference between magma and lava?",
    options: ["Temperature difference", "Location - underground vs surface", "Chemical composition", "Age of formation"],
    correctAnswer: 1,
    topic: "Igneous Processes",
    course: "Igneous Petrology",
    difficulty: "easy"
  },
  {
    id: "add-002",
    question: "Which mineral is the hardest on the Mohs scale?",
    options: ["Corundum", "Topaz", "Diamond", "Quartz"],
    correctAnswer: 2,
    topic: "Mineral Properties",
    course: "Mineralogy",
    difficulty: "easy"
  },
  {
    id: "add-003",
    question: "The San Andreas Fault is an example of:",
    options: ["Normal fault", "Reverse fault", "Transform fault", "Thrust fault"],
    correctAnswer: 2,
    topic: "Plate Boundaries",
    course: "Structural Geology",
    difficulty: "medium"
  },
  {
    id: "add-004",
    question: "What percentage of Earth's surface is covered by water?",
    options: ["About 50%", "About 60%", "About 71%", "About 80%"],
    correctAnswer: 2,
    topic: "Earth's Surface",
    course: "General Geology",
    difficulty: "easy"
  },
  {
    id: "add-005",
    question: "The Richter scale measures:",
    options: ["Earthquake intensity", "Earthquake magnitude", "Volcanic explosivity", "Tsunami height"],
    correctAnswer: 1,
    topic: "Earthquakes",
    course: "General Geology",
    difficulty: "easy"
  },
  {
    id: "add-006",
    question: "What is the most common mineral in Earth's crust?",
    options: ["Quartz", "Feldspar", "Mica", "Calcite"],
    correctAnswer: 1,
    topic: "Crustal Composition",
    course: "Mineralogy",
    difficulty: "medium"
  },
  {
    id: "add-007",
    question: "Loess is a type of deposit formed by:",
    options: ["Rivers", "Glaciers", "Wind", "Ocean waves"],
    correctAnswer: 2,
    topic: "Aeolian Deposits",
    course: "General Geology",
    difficulty: "medium"
  },
  {
    id: "add-008",
    question: "Which rock type is characterized by banding of light and dark minerals?",
    options: ["Granite", "Gneiss", "Basalt", "Sandstone"],
    correctAnswer: 1,
    topic: "Metamorphic Rocks",
    course: "Metamorphic Petrology",
    difficulty: "medium"
  },
  {
    id: "add-009",
    question: "The K-T boundary marks the extinction of:",
    options: ["Trilobites", "Ammonites", "Dinosaurs", "Mammoths"],
    correctAnswer: 2,
    topic: "Mass Extinctions",
    course: "Historical Geology",
    difficulty: "medium"
  },
  {
    id: "add-010",
    question: "What is the primary mineral in limestone?",
    options: ["Quartz", "Dolomite", "Calcite", "Gypsum"],
    correctAnswer: 2,
    topic: "Sedimentary Rocks",
    course: "Sedimentary Petrology",
    difficulty: "easy"
  }
];

// Function to get random unique questions
export function getRandomQuestions(count: number = 10, difficulty?: Difficulty): QuizQuestion[] {
  let filtered = [...geologyQuizQuestions];
  if (difficulty) {
    filtered = filtered.filter(q => q.difficulty === difficulty);
  }
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Function to get questions by topic
export function getQuestionsByTopic(topic: string): QuizQuestion[] {
  return geologyQuizQuestions.filter(q => q.topic === topic);
}

// Function to get questions by course
export function getQuestionsByCourse(course: string, difficulty?: Difficulty): QuizQuestion[] {
  let filtered = geologyQuizQuestions.filter(q => q.course === course);
  if (difficulty) {
    filtered = filtered.filter(q => q.difficulty === difficulty);
  }
  return filtered;
}

// Function to get questions by difficulty
export function getQuestionsByDifficulty(difficulty: Difficulty): QuizQuestion[] {
  return geologyQuizQuestions.filter(q => q.difficulty === difficulty);
}

// Get all unique topics
export function getAllTopics(): string[] {
  return [...new Set(geologyQuizQuestions.map(q => q.topic))];
}

// Get all unique courses
export function getAllCourses(): string[] {
  return [...new Set(geologyQuizQuestions.map(q => q.course))];
}

// Get difficulty counts
export function getDifficultyCounts(): { easy: number; medium: number; hard: number } {
  return {
    easy: geologyQuizQuestions.filter(q => q.difficulty === "easy").length,
    medium: geologyQuizQuestions.filter(q => q.difficulty === "medium").length,
    hard: geologyQuizQuestions.filter(q => q.difficulty === "hard").length
  };
}
