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

  // Additional General Geology Questions
  {
    id: "gg-009",
    question: "What type of plate boundary is the Himalayan mountain range associated with?",
    options: ["Divergent", "Convergent", "Transform", "Passive"],
    correctAnswer: 1,
    topic: "Plate Tectonics",
    course: "General Geology",
    difficulty: "easy",
    explanation: "The Himalayas formed from the collision of the Indian and Eurasian plates at a convergent boundary."
  },
  {
    id: "gg-010",
    question: "What is the average thickness of oceanic crust?",
    options: ["1-3 km", "5-10 km", "25-35 km", "50-70 km"],
    correctAnswer: 1,
    topic: "Earth's Crust",
    course: "General Geology",
    difficulty: "medium"
  },
  {
    id: "gg-011",
    question: "Which type of seismic waves cannot pass through liquids?",
    options: ["P-waves", "S-waves", "Surface waves", "Love waves"],
    correctAnswer: 1,
    topic: "Seismology",
    course: "General Geology",
    difficulty: "medium",
    explanation: "S-waves (shear waves) cannot propagate through liquids because liquids cannot sustain shear stress."
  },
  {
    id: "gg-012",
    question: "What is the Mohorovičić discontinuity?",
    options: ["Boundary between crust and mantle", "Center of the Earth", "Outer core boundary", "Asthenosphere limit"],
    correctAnswer: 0,
    topic: "Internal Structure of Earth",
    course: "General Geology",
    difficulty: "medium"
  },
  {
    id: "gg-013",
    question: "Cirques, arêtes, and horns are landforms created by:",
    options: ["Rivers", "Wind", "Glaciers", "Waves"],
    correctAnswer: 2,
    topic: "Glacial Landforms",
    course: "General Geology",
    difficulty: "medium"
  },
  {
    id: "gg-014",
    question: "What is the term for the wearing away of rock by friction and impact?",
    options: ["Corrosion", "Abrasion", "Attrition", "Hydraulic action"],
    correctAnswer: 1,
    topic: "Erosion",
    course: "General Geology",
    difficulty: "easy"
  },
  {
    id: "gg-015",
    question: "Which drainage pattern develops around a volcanic cone?",
    options: ["Dendritic", "Trellis", "Radial", "Rectangular"],
    correctAnswer: 2,
    topic: "Drainage Patterns",
    course: "General Geology",
    difficulty: "easy"
  },
  {
    id: "gg-016",
    question: "The asthenosphere is characterized by:",
    options: ["Solid brittle rock", "Partially molten plastic rock", "Liquid iron", "Solid iron"],
    correctAnswer: 1,
    topic: "Earth's Layers",
    course: "General Geology",
    difficulty: "medium"
  },
  {
    id: "gg-017",
    question: "What causes the Earth's magnetic field?",
    options: ["Crustal rocks", "Convection currents in outer core", "Solar wind", "Mantle plumes"],
    correctAnswer: 1,
    topic: "Geomagnetism",
    course: "General Geology",
    difficulty: "hard"
  },
  {
    id: "gg-018",
    question: "An oxbow lake is formed by:",
    options: ["Glacial activity", "River meandering and cutoff", "Volcanic eruption", "Tectonic movement"],
    correctAnswer: 1,
    topic: "Fluvial Landforms",
    course: "General Geology",
    difficulty: "easy"
  },

  // Additional Historical Geology Questions
  {
    id: "hg-007",
    question: "What evidence supported Wegener's continental drift theory?",
    options: ["Ocean currents", "Matching fossils and rock types across continents", "Volcanic activity", "Earthquake patterns"],
    correctAnswer: 1,
    topic: "Continental Drift",
    course: "Historical Geology",
    difficulty: "medium"
  },
  {
    id: "hg-008",
    question: "The Great Oxygenation Event occurred during which eon?",
    options: ["Hadean", "Archean", "Proterozoic", "Phanerozoic"],
    correctAnswer: 2,
    topic: "Earth History",
    course: "Historical Geology",
    difficulty: "hard"
  },
  {
    id: "hg-009",
    question: "What is the name of the ancient ocean that separated Gondwana from Laurasia?",
    options: ["Panthalassa", "Tethys Sea", "Iapetus Ocean", "Rheic Ocean"],
    correctAnswer: 1,
    topic: "Paleogeography",
    course: "Historical Geology",
    difficulty: "hard"
  },
  {
    id: "hg-010",
    question: "Which principle states that rock layers extend laterally in all directions?",
    options: ["Superposition", "Original horizontality", "Lateral continuity", "Cross-cutting relations"],
    correctAnswer: 2,
    topic: "Principles of Stratigraphy",
    course: "Historical Geology",
    difficulty: "medium"
  },
  {
    id: "hg-011",
    question: "Benioff zones are associated with:",
    options: ["Mid-ocean ridges", "Subduction zones", "Transform faults", "Hot spots"],
    correctAnswer: 1,
    topic: "Plate Tectonics",
    course: "Historical Geology",
    difficulty: "hard"
  },
  {
    id: "hg-012",
    question: "The Cambrian Explosion refers to:",
    options: ["Volcanic activity", "Rapid diversification of life", "Asteroid impact", "Ice age"],
    correctAnswer: 1,
    topic: "Evolution of Life",
    course: "Historical Geology",
    difficulty: "medium"
  },
  {
    id: "hg-013",
    question: "What type of rocks form at mid-ocean ridges?",
    options: ["Granite", "Basalt", "Limestone", "Sandstone"],
    correctAnswer: 1,
    topic: "Sea Floor Spreading",
    course: "Historical Geology",
    difficulty: "easy"
  },
  {
    id: "hg-014",
    question: "Paleomagnetism studies reveal:",
    options: ["Fossil locations", "Ancient magnetic pole positions", "Rock age", "Chemical composition"],
    correctAnswer: 1,
    topic: "Paleomagnetism",
    course: "Historical Geology",
    difficulty: "medium"
  },

  // Additional Crystallography Questions
  {
    id: "cr-006",
    question: "Which crystal system has three axes of different lengths, all at right angles?",
    options: ["Isometric", "Tetragonal", "Orthorhombic", "Monoclinic"],
    correctAnswer: 2,
    topic: "Crystal Systems",
    course: "Crystallography",
    difficulty: "medium"
  },
  {
    id: "cr-007",
    question: "What is polymorphism in minerals?",
    options: ["Same composition, different structures", "Different composition, same structure", "Color variation", "Size variation"],
    correctAnswer: 0,
    topic: "Crystal Properties",
    course: "Crystallography",
    difficulty: "medium"
  },
  {
    id: "cr-008",
    question: "Diamond and graphite are examples of:",
    options: ["Isomorphs", "Polymorphs", "Pseudomorphs", "Allotropes"],
    correctAnswer: 1,
    topic: "Polymorphism",
    course: "Crystallography",
    difficulty: "easy",
    explanation: "Diamond and graphite are both pure carbon but have different crystal structures."
  },
  {
    id: "cr-009",
    question: "How many point groups exist in crystallography?",
    options: ["7", "14", "32", "230"],
    correctAnswer: 2,
    topic: "Symmetry",
    course: "Crystallography",
    difficulty: "hard"
  },
  {
    id: "cr-010",
    question: "The hexagonal crystal system has how many axes?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
    topic: "Crystal Systems",
    course: "Crystallography",
    difficulty: "medium",
    explanation: "Hexagonal system has 4 axes: three equal horizontal axes at 120° and one vertical axis."
  },
  {
    id: "cr-011",
    question: "A crystal with a center of symmetry is called:",
    options: ["Hemihedral", "Holohedral", "Centrosymmetric", "Euhedral"],
    correctAnswer: 2,
    topic: "Crystal Symmetry",
    course: "Crystallography",
    difficulty: "hard"
  },
  {
    id: "cr-012",
    question: "Zone axis in crystallography represents:",
    options: ["Crystal color direction", "Common direction to a set of faces", "Twin boundary", "Cleavage direction"],
    correctAnswer: 1,
    topic: "Crystal Geometry",
    course: "Crystallography",
    difficulty: "hard"
  },

  // Additional Mineralogy Questions
  {
    id: "mm-007",
    question: "What is the streak color of hematite?",
    options: ["White", "Black", "Red-brown", "Yellow"],
    correctAnswer: 2,
    topic: "Physical Properties",
    course: "Mineralogy",
    difficulty: "easy"
  },
  {
    id: "mm-008",
    question: "Which mineral fizzes with dilute HCl?",
    options: ["Quartz", "Calcite", "Feldspar", "Pyrite"],
    correctAnswer: 1,
    topic: "Chemical Tests",
    course: "Mineralogy",
    difficulty: "easy",
    explanation: "Calcite reacts with dilute HCl producing CO2 bubbles due to its carbonate composition."
  },
  {
    id: "mm-009",
    question: "Pyroxenes and amphiboles are examples of which silicate structure?",
    options: ["Nesosilicates", "Sorosilicates", "Inosilicates (chain)", "Tectosilicates"],
    correctAnswer: 2,
    topic: "Silicate Classification",
    course: "Mineralogy",
    difficulty: "medium"
  },
  {
    id: "mm-010",
    question: "What type of luster does galena exhibit?",
    options: ["Vitreous", "Metallic", "Pearly", "Silky"],
    correctAnswer: 1,
    topic: "Physical Properties",
    course: "Mineralogy",
    difficulty: "easy"
  },
  {
    id: "mm-011",
    question: "Birefringence in minerals refers to:",
    options: ["Color change with direction", "Double refraction", "Light absorption", "Fluorescence"],
    correctAnswer: 1,
    topic: "Optical Properties",
    course: "Mineralogy",
    difficulty: "hard"
  },
  {
    id: "mm-012",
    question: "Which mineral is used to determine hardness 10 on Mohs scale?",
    options: ["Corundum", "Topaz", "Diamond", "Quartz"],
    correctAnswer: 2,
    topic: "Hardness Scale",
    course: "Mineralogy",
    difficulty: "easy"
  },
  {
    id: "mm-013",
    question: "Micas are examples of which silicate structure?",
    options: ["Chain silicates", "Framework silicates", "Sheet silicates", "Isolated silicates"],
    correctAnswer: 2,
    topic: "Silicate Classification",
    course: "Mineralogy",
    difficulty: "medium"
  },
  {
    id: "mm-014",
    question: "What optical property causes minerals to appear raised or sunken in thin section?",
    options: ["Pleochroism", "Relief", "Extinction", "Interference color"],
    correctAnswer: 1,
    topic: "Mineral Optics",
    course: "Mineralogy",
    difficulty: "medium"
  },
  {
    id: "mm-015",
    question: "Feldspars are the most abundant minerals in:",
    options: ["Ocean floor", "Earth's crust", "Mantle", "Core"],
    correctAnswer: 1,
    topic: "Rock-forming Minerals",
    course: "Mineralogy",
    difficulty: "easy"
  },

  // Additional Geochemistry Questions
  {
    id: "gc-005",
    question: "REE stands for:",
    options: ["Rock Element Enrichment", "Rare Earth Elements", "Rapid Erosion Events", "Regional Earth Evolution"],
    correctAnswer: 1,
    topic: "Trace Elements",
    course: "Geochemistry",
    difficulty: "easy"
  },
  {
    id: "gc-006",
    question: "Which classification divides elements into lithophile, siderophile, chalcophile, and atmophile?",
    options: ["Bowen's classification", "Goldschmidt's classification", "Dana's classification", "Strunz classification"],
    correctAnswer: 1,
    topic: "Geochemical Classification",
    course: "Geochemistry",
    difficulty: "medium"
  },
  {
    id: "gc-007",
    question: "Chalcophile elements have affinity for:",
    options: ["Oxygen", "Sulfur", "Iron", "Silica"],
    correctAnswer: 1,
    topic: "Geochemical Classification",
    course: "Geochemistry",
    difficulty: "medium"
  },
  {
    id: "gc-008",
    question: "The rock cycle describes:",
    options: ["Moon rock formation", "Transformation between rock types", "Rock dating methods", "Rock magnetism"],
    correctAnswer: 1,
    topic: "Elementary Petrology",
    course: "Geochemistry",
    difficulty: "easy"
  },
  {
    id: "gc-009",
    question: "What is the second most abundant element in Earth's crust?",
    options: ["Iron", "Aluminum", "Silicon", "Calcium"],
    correctAnswer: 2,
    topic: "Crustal Composition",
    course: "Geochemistry",
    difficulty: "medium"
  },
  {
    id: "gc-010",
    question: "Isotopes of an element differ in:",
    options: ["Number of protons", "Number of neutrons", "Number of electrons", "Atomic number"],
    correctAnswer: 1,
    topic: "Isotope Geochemistry",
    course: "Geochemistry",
    difficulty: "easy"
  },

  // Additional Economic Geology Questions
  {
    id: "eg-005",
    question: "SEDEX deposits are formed in:",
    options: ["Volcanic settings", "Sedimentary basins", "Contact zones", "Placer environments"],
    correctAnswer: 1,
    topic: "Ore Deposit Types",
    course: "Economic Geology",
    difficulty: "hard"
  },
  {
    id: "eg-006",
    question: "Which mineral is the primary ore of copper?",
    options: ["Galena", "Chalcopyrite", "Sphalerite", "Hematite"],
    correctAnswer: 1,
    topic: "Ore Minerals",
    course: "Economic Geology",
    difficulty: "medium"
  },
  {
    id: "eg-007",
    question: "Supergene enrichment occurs due to:",
    options: ["High temperature fluids", "Weathering and groundwater", "Magmatic processes", "Metamorphism"],
    correctAnswer: 1,
    topic: "Secondary Enrichment",
    course: "Economic Geology",
    difficulty: "hard"
  },
  {
    id: "eg-008",
    question: "Which type of deposit forms by settling of dense minerals in magma?",
    options: ["Hydrothermal", "Magmatic segregation", "Sedimentary", "Metamorphic"],
    correctAnswer: 1,
    topic: "Ore Genesis",
    course: "Economic Geology",
    difficulty: "medium"
  },
  {
    id: "eg-009",
    question: "Skarn deposits form at:",
    options: ["Mid-ocean ridges", "Igneous-carbonate contacts", "River channels", "Desert dunes"],
    correctAnswer: 1,
    topic: "Contact Metamorphic Deposits",
    course: "Economic Geology",
    difficulty: "hard"
  },
  {
    id: "eg-010",
    question: "What is the primary ore of lead?",
    options: ["Sphalerite", "Galena", "Pyrite", "Magnetite"],
    correctAnswer: 1,
    topic: "Ore Minerals",
    course: "Economic Geology",
    difficulty: "easy"
  },

  // Additional Paleontology Questions
  {
    id: "pl-006",
    question: "Which era is known as the 'Age of Mammals'?",
    options: ["Paleozoic", "Mesozoic", "Cenozoic", "Precambrian"],
    correctAnswer: 2,
    topic: "Geological Eras",
    course: "Paleontology",
    difficulty: "easy"
  },
  {
    id: "pl-007",
    question: "Ammonites were marine organisms similar to modern:",
    options: ["Starfish", "Nautilus", "Jellyfish", "Coral"],
    correctAnswer: 1,
    topic: "Invertebrate Fossils",
    course: "Paleontology",
    difficulty: "medium"
  },
  {
    id: "pl-008",
    question: "Trace fossils include:",
    options: ["Bones and shells", "Footprints and burrows", "Leaf impressions", "Petrified wood"],
    correctAnswer: 1,
    topic: "Fossil Types",
    course: "Paleontology",
    difficulty: "easy"
  },
  {
    id: "pl-009",
    question: "The Permian-Triassic extinction event is also called:",
    options: ["The Great Dying", "K-T Extinction", "Ice Age", "Cambrian Explosion"],
    correctAnswer: 0,
    topic: "Mass Extinctions",
    course: "Paleontology",
    difficulty: "medium"
  },
  {
    id: "pl-010",
    question: "Micropaleontology primarily studies:",
    options: ["Dinosaurs", "Foraminifera and other microfossils", "Plant fossils", "Trace fossils"],
    correctAnswer: 1,
    topic: "Paleontology Branches",
    course: "Paleontology",
    difficulty: "medium"
  },
  {
    id: "pl-011",
    question: "Brachiopods are commonly confused with:",
    options: ["Corals", "Bivalves", "Gastropods", "Cephalopods"],
    correctAnswer: 1,
    topic: "Invertebrate Paleontology",
    course: "Paleontology",
    difficulty: "medium"
  },
  {
    id: "pl-012",
    question: "Which fossil group dominated the Paleozoic seas?",
    options: ["Dinosaurs", "Mammals", "Trilobites and brachiopods", "Whales"],
    correctAnswer: 2,
    topic: "Paleozoic Life",
    course: "Paleontology",
    difficulty: "medium"
  },

  // Additional Stratigraphy Questions
  {
    id: "st-006",
    question: "The Vindhyan Supergroup is famous for:",
    options: ["Coal deposits", "Stromatolites", "Dinosaur fossils", "Oil fields"],
    correctAnswer: 1,
    topic: "Indian Stratigraphy",
    course: "Stratigraphy",
    difficulty: "medium"
  },
  {
    id: "st-007",
    question: "An unconformity represents:",
    options: ["Continuous deposition", "A gap in the rock record", "Volcanic activity", "Metamorphism"],
    correctAnswer: 1,
    topic: "Stratigraphic Concepts",
    course: "Stratigraphy",
    difficulty: "easy"
  },
  {
    id: "st-008",
    question: "Lithostratigraphy is based on:",
    options: ["Fossil content", "Rock characteristics", "Absolute age", "Magnetic polarity"],
    correctAnswer: 1,
    topic: "Stratigraphic Methods",
    course: "Stratigraphy",
    difficulty: "medium"
  },
  {
    id: "st-009",
    question: "The Dharwar Supergroup belongs to which eon?",
    options: ["Hadean", "Archean", "Proterozoic", "Phanerozoic"],
    correctAnswer: 1,
    topic: "Indian Stratigraphy",
    course: "Stratigraphy",
    difficulty: "hard"
  },
  {
    id: "st-010",
    question: "Biostratigraphy uses which method for correlation?",
    options: ["Radioactive decay", "Fossil assemblages", "Rock type", "Magnetic polarity"],
    correctAnswer: 1,
    topic: "Stratigraphic Methods",
    course: "Stratigraphy",
    difficulty: "medium"
  },
  {
    id: "st-011",
    question: "The Cuddapah Supergroup is found in which state?",
    options: ["Odisha", "Karnataka", "Andhra Pradesh", "Tamil Nadu"],
    correctAnswer: 2,
    topic: "Indian Stratigraphy",
    course: "Stratigraphy",
    difficulty: "medium"
  },

  // Additional Igneous Petrology Questions
  {
    id: "ip-006",
    question: "What is the SiO2 content of a basic igneous rock?",
    options: ["<45%", "45-52%", "52-66%", ">66%"],
    correctAnswer: 1,
    topic: "Rock Classification",
    course: "Igneous Petrology",
    difficulty: "medium"
  },
  {
    id: "ip-007",
    question: "Pegmatites are characterized by:",
    options: ["Very fine grains", "Very coarse grains", "Glassy texture", "Vesicular texture"],
    correctAnswer: 1,
    topic: "Igneous Textures",
    course: "Igneous Petrology",
    difficulty: "easy"
  },
  {
    id: "ip-008",
    question: "Rhyolite is the volcanic equivalent of:",
    options: ["Gabbro", "Diorite", "Granite", "Peridotite"],
    correctAnswer: 2,
    topic: "Igneous Rock Pairs",
    course: "Igneous Petrology",
    difficulty: "medium"
  },
  {
    id: "ip-009",
    question: "Ophitic texture is characteristic of:",
    options: ["Granite", "Dolerite", "Obsidian", "Pumice"],
    correctAnswer: 1,
    topic: "Igneous Textures",
    course: "Igneous Petrology",
    difficulty: "hard"
  },
  {
    id: "ip-010",
    question: "Which igneous rock has the highest silica content?",
    options: ["Basalt", "Andesite", "Rhyolite", "Komatiite"],
    correctAnswer: 2,
    topic: "Rock Classification",
    course: "Igneous Petrology",
    difficulty: "medium"
  },
  {
    id: "ip-011",
    question: "Assimilation in magma refers to:",
    options: ["Cooling process", "Incorporation of country rock", "Crystal settling", "Volatile loss"],
    correctAnswer: 1,
    topic: "Magmatic Processes",
    course: "Igneous Petrology",
    difficulty: "hard"
  },
  {
    id: "ip-012",
    question: "Komatiites are unique because they indicate:",
    options: ["Cold magma", "Very high temperature magma", "Shallow depth", "High water content"],
    correctAnswer: 1,
    topic: "Ultramafic Rocks",
    course: "Igneous Petrology",
    difficulty: "hard"
  },

  // Additional Sedimentary Petrology Questions
  {
    id: "sp-006",
    question: "Greywacke is a type of:",
    options: ["Limestone", "Sandstone", "Shale", "Conglomerate"],
    correctAnswer: 1,
    topic: "Clastic Rocks",
    course: "Sedimentary Petrology",
    difficulty: "medium"
  },
  {
    id: "sp-007",
    question: "Oolitic limestone forms from:",
    options: ["Shell fragments", "Precipitation around nuclei", "Coral reefs", "Evaporation"],
    correctAnswer: 1,
    topic: "Carbonate Rocks",
    course: "Sedimentary Petrology",
    difficulty: "medium"
  },
  {
    id: "sp-008",
    question: "Mud cracks indicate:",
    options: ["Deep marine environment", "Periods of drying", "High energy environment", "Glacial conditions"],
    correctAnswer: 1,
    topic: "Sedimentary Structures",
    course: "Sedimentary Petrology",
    difficulty: "easy"
  },
  {
    id: "sp-009",
    question: "What is the main cementing material in most sandstones?",
    options: ["Clay", "Silica or calcite", "Salt", "Organic matter"],
    correctAnswer: 1,
    topic: "Diagenesis",
    course: "Sedimentary Petrology",
    difficulty: "medium"
  },
  {
    id: "sp-010",
    question: "Turbidites form from:",
    options: ["Wind deposition", "Submarine density currents", "Chemical precipitation", "Glacial activity"],
    correctAnswer: 1,
    topic: "Deep Marine Sediments",
    course: "Sedimentary Petrology",
    difficulty: "hard"
  },
  {
    id: "sp-011",
    question: "Chert is primarily composed of:",
    options: ["Calcite", "Quartz", "Feldspar", "Clay minerals"],
    correctAnswer: 1,
    topic: "Chemical Sediments",
    course: "Sedimentary Petrology",
    difficulty: "medium"
  },
  {
    id: "sp-012",
    question: "Graded bedding indicates:",
    options: ["Constant current", "Decreasing current velocity", "Wind action", "Chemical precipitation"],
    correctAnswer: 1,
    topic: "Sedimentary Structures",
    course: "Sedimentary Petrology",
    difficulty: "medium"
  },

  // Additional Metamorphic Petrology Questions
  {
    id: "mp-006",
    question: "Slate forms from the metamorphism of:",
    options: ["Sandstone", "Limestone", "Shale", "Granite"],
    correctAnswer: 2,
    topic: "Metamorphic Rocks",
    course: "Metamorphic Petrology",
    difficulty: "easy"
  },
  {
    id: "mp-007",
    question: "What is the sequence of metamorphism from shale to gneiss?",
    options: ["Slate-phyllite-schist-gneiss", "Phyllite-slate-gneiss-schist", "Schist-slate-phyllite-gneiss", "Gneiss-schist-phyllite-slate"],
    correctAnswer: 0,
    topic: "Progressive Metamorphism",
    course: "Metamorphic Petrology",
    difficulty: "medium"
  },
  {
    id: "mp-008",
    question: "Contact metamorphism occurs due to:",
    options: ["Regional stress", "Heat from magma intrusion", "Burial depth", "Tectonic pressure"],
    correctAnswer: 1,
    topic: "Types of Metamorphism",
    course: "Metamorphic Petrology",
    difficulty: "easy"
  },
  {
    id: "mp-009",
    question: "Which mineral is an index mineral for the sillimanite zone?",
    options: ["Chlorite", "Biotite", "Garnet", "Sillimanite"],
    correctAnswer: 3,
    topic: "Metamorphic Zones",
    course: "Metamorphic Petrology",
    difficulty: "medium"
  },
  {
    id: "mp-010",
    question: "Hornfels is typically formed by:",
    options: ["Regional metamorphism", "Contact metamorphism", "Dynamic metamorphism", "Hydrothermal alteration"],
    correctAnswer: 1,
    topic: "Contact Metamorphism",
    course: "Metamorphic Petrology",
    difficulty: "medium"
  },
  {
    id: "mp-011",
    question: "Blueschist facies indicates:",
    options: ["High temperature, low pressure", "Low temperature, high pressure", "High temperature, high pressure", "Low temperature, low pressure"],
    correctAnswer: 1,
    topic: "Metamorphic Facies",
    course: "Metamorphic Petrology",
    difficulty: "hard"
  },
  {
    id: "mp-012",
    question: "Eclogite contains which diagnostic mineral pair?",
    options: ["Quartz and feldspar", "Garnet and omphacite", "Biotite and muscovite", "Olivine and pyroxene"],
    correctAnswer: 1,
    topic: "High-Pressure Metamorphism",
    course: "Metamorphic Petrology",
    difficulty: "hard"
  },

  // Additional Remote Sensing Questions
  {
    id: "rs-005",
    question: "LIDAR uses which type of energy?",
    options: ["Radio waves", "Microwaves", "Laser light", "X-rays"],
    correctAnswer: 2,
    topic: "Active Remote Sensing",
    course: "Remote Sensing and GIS",
    difficulty: "medium"
  },
  {
    id: "rs-006",
    question: "False color composites are used to:",
    options: ["Show true colors", "Enhance specific features", "Reduce file size", "Correct atmospheric errors"],
    correctAnswer: 1,
    topic: "Image Processing",
    course: "Remote Sensing and GIS",
    difficulty: "medium"
  },
  {
    id: "rs-007",
    question: "Electromagnetic spectrum used in thermal remote sensing is:",
    options: ["Visible", "Near-infrared", "Thermal infrared", "Microwave"],
    correctAnswer: 2,
    topic: "Spectral Bands",
    course: "Remote Sensing and GIS",
    difficulty: "medium"
  },
  {
    id: "rs-008",
    question: "Vector data in GIS represents features as:",
    options: ["Pixels", "Points, lines, and polygons", "Raster cells", "Grid squares"],
    correctAnswer: 1,
    topic: "GIS Data Types",
    course: "Remote Sensing and GIS",
    difficulty: "easy"
  },
  {
    id: "rs-009",
    question: "GPS stands for:",
    options: ["Global Positioning System", "Geographical Plotting System", "Ground Position Satellite", "General Purpose Sensor"],
    correctAnswer: 0,
    topic: "Positioning Systems",
    course: "Remote Sensing and GIS",
    difficulty: "easy"
  },
  {
    id: "rs-010",
    question: "Image classification in remote sensing includes:",
    options: ["Supervised and unsupervised methods", "Only visual interpretation", "Only manual digitization", "Only field verification"],
    correctAnswer: 0,
    topic: "Image Analysis",
    course: "Remote Sensing and GIS",
    difficulty: "medium"
  },

  // Additional Structural Geology Questions
  {
    id: "sg-006",
    question: "A graben is formed by:",
    options: ["Compressional forces", "Tensional forces", "Shear forces", "Vertical forces only"],
    correctAnswer: 1,
    topic: "Structural Features",
    course: "Structural Geology",
    difficulty: "medium"
  },
  {
    id: "sg-007",
    question: "Dip is the angle measured from:",
    options: ["Vertical", "Horizontal", "Strike direction", "North"],
    correctAnswer: 1,
    topic: "Attitude of Beds",
    course: "Structural Geology",
    difficulty: "easy"
  },
  {
    id: "sg-008",
    question: "Recumbent folds have an axial plane that is:",
    options: ["Vertical", "Horizontal", "Inclined at 45°", "Undefined"],
    correctAnswer: 1,
    topic: "Fold Types",
    course: "Structural Geology",
    difficulty: "hard"
  },
  {
    id: "sg-009",
    question: "A thrust fault is a type of:",
    options: ["Normal fault", "Reverse fault", "Strike-slip fault", "Transform fault"],
    correctAnswer: 1,
    topic: "Fault Types",
    course: "Structural Geology",
    difficulty: "medium"
  },
  {
    id: "sg-010",
    question: "Slickensides on fault surfaces indicate:",
    options: ["Fault age", "Direction of movement", "Rock type", "Fault depth"],
    correctAnswer: 1,
    topic: "Fault Features",
    course: "Structural Geology",
    difficulty: "medium"
  },
  {
    id: "sg-011",
    question: "An inlier is:",
    options: ["Younger rocks surrounded by older rocks", "Older rocks surrounded by younger rocks", "A type of fault", "A fold structure"],
    correctAnswer: 1,
    topic: "Structural Features",
    course: "Structural Geology",
    difficulty: "hard"
  },
  {
    id: "sg-012",
    question: "Joints differ from faults in that:",
    options: ["Joints show displacement", "Joints show no displacement", "Joints are larger", "Joints are older"],
    correctAnswer: 1,
    topic: "Structural Features",
    course: "Structural Geology",
    difficulty: "easy"
  },

  // Additional Engineering Geology Questions
  {
    id: "en-005",
    question: "Which rock type is most suitable for tunnel construction?",
    options: ["Shale", "Sandstone", "Massive granite", "Loose gravel"],
    correctAnswer: 2,
    topic: "Tunnel Engineering",
    course: "Engineering Geology",
    difficulty: "medium"
  },
  {
    id: "en-006",
    question: "Liquefaction occurs in:",
    options: ["Dry clay", "Saturated loose sand", "Compact granite", "Dry sand"],
    correctAnswer: 1,
    topic: "Seismic Hazards",
    course: "Engineering Geology",
    difficulty: "medium"
  },
  {
    id: "en-007",
    question: "The angle of repose is important for:",
    options: ["Dam design", "Slope stability", "Tunnel lining", "Bridge foundation"],
    correctAnswer: 1,
    topic: "Slope Stability",
    course: "Engineering Geology",
    difficulty: "easy"
  },
  {
    id: "en-008",
    question: "Point load test is used to determine:",
    options: ["Rock age", "Rock strength", "Rock composition", "Rock porosity"],
    correctAnswer: 1,
    topic: "Rock Mechanics",
    course: "Engineering Geology",
    difficulty: "medium"
  },
  {
    id: "en-009",
    question: "Karst topography poses challenges for construction due to:",
    options: ["Hard rock", "Underground cavities", "High temperature", "Magnetic anomalies"],
    correctAnswer: 1,
    topic: "Engineering Problems",
    course: "Engineering Geology",
    difficulty: "medium"
  },
  {
    id: "en-010",
    question: "Which geological investigation is essential before dam construction?",
    options: ["Paleontological survey", "Foundation geology study", "Fossil excavation", "Meteorological study"],
    correctAnswer: 1,
    topic: "Site Investigation",
    course: "Engineering Geology",
    difficulty: "easy"
  },

  // Additional Hydrogeology Questions
  {
    id: "hy-005",
    question: "A confined aquifer is bounded by:",
    options: ["Air above", "Aquitards above and below", "Only permeable layers", "Ocean water"],
    correctAnswer: 1,
    topic: "Aquifer Types",
    course: "Hydrogeology",
    difficulty: "medium"
  },
  {
    id: "hy-006",
    question: "Specific yield represents:",
    options: ["Total water content", "Water released by gravity drainage", "Rate of water flow", "Aquifer thickness"],
    correctAnswer: 1,
    topic: "Aquifer Properties",
    course: "Hydrogeology",
    difficulty: "hard"
  },
  {
    id: "hy-007",
    question: "An artesian well flows because:",
    options: ["Pumping", "Pressure from confined aquifer", "Gravity alone", "Surface water input"],
    correctAnswer: 1,
    topic: "Artesian Systems",
    course: "Hydrogeology",
    difficulty: "medium"
  },
  {
    id: "hy-008",
    question: "Saltwater intrusion is a problem in:",
    options: ["Mountain areas", "Coastal aquifers", "Deep wells", "Volcanic regions"],
    correctAnswer: 1,
    topic: "Groundwater Contamination",
    course: "Hydrogeology",
    difficulty: "easy"
  },
  {
    id: "hy-009",
    question: "Hydraulic conductivity is affected by:",
    options: ["Only grain size", "Grain size and sorting", "Only porosity", "Only rock type"],
    correctAnswer: 1,
    topic: "Aquifer Properties",
    course: "Hydrogeology",
    difficulty: "medium"
  },
  {
    id: "hy-010",
    question: "Springs form where:",
    options: ["Water table intersects surface", "Rivers flow", "Rain falls", "Snow melts"],
    correctAnswer: 0,
    topic: "Groundwater Discharge",
    course: "Hydrogeology",
    difficulty: "easy"
  },

  // Additional Exploration Geology Questions
  {
    id: "em-004",
    question: "Induced Polarization (IP) survey is useful for detecting:",
    options: ["Magnetic minerals", "Sulfide minerals", "Carbonate rocks", "Water"],
    correctAnswer: 1,
    topic: "Geophysical Methods",
    course: "Exploration Geology",
    difficulty: "hard"
  },
  {
    id: "em-005",
    question: "Core drilling provides:",
    options: ["Surface samples only", "Continuous rock samples", "Only water samples", "Soil samples"],
    correctAnswer: 1,
    topic: "Drilling Methods",
    course: "Exploration Geology",
    difficulty: "easy"
  },
  {
    id: "em-006",
    question: "Geochemical anomalies indicate:",
    options: ["Normal background", "Potential ore deposits", "Fossil locations", "Earthquake zones"],
    correctAnswer: 1,
    topic: "Geochemical Exploration",
    course: "Exploration Geology",
    difficulty: "medium"
  },
  {
    id: "em-007",
    question: "Underground mining is preferred when:",
    options: ["Deposit is near surface", "Deposit is deep", "Rock is soft", "Land is flat"],
    correctAnswer: 1,
    topic: "Mining Methods",
    course: "Exploration Geology",
    difficulty: "easy"
  },
  {
    id: "em-008",
    question: "Stripping ratio in open-pit mining refers to:",
    options: ["Ore grade", "Waste to ore ratio", "Pit depth", "Recovery rate"],
    correctAnswer: 1,
    topic: "Mining Economics",
    course: "Exploration Geology",
    difficulty: "medium"
  },

  // Additional Economic Minerals of India Questions
  {
    id: "ei-005",
    question: "The Jharia coalfield is located in:",
    options: ["Odisha", "West Bengal", "Jharkhand", "Madhya Pradesh"],
    correctAnswer: 2,
    topic: "Indian Coal Fields",
    course: "Economic Minerals of India",
    difficulty: "easy"
  },
  {
    id: "ei-006",
    question: "Rajasthan is a major producer of:",
    options: ["Coal", "Marble and zinc", "Iron ore", "Chromite"],
    correctAnswer: 1,
    topic: "State-wise Minerals",
    course: "Economic Minerals of India",
    difficulty: "medium"
  },
  {
    id: "ei-007",
    question: "The Singhbhum district is famous for:",
    options: ["Coal", "Copper and uranium", "Limestone", "Bauxite"],
    correctAnswer: 1,
    topic: "Mineral Belts",
    course: "Economic Minerals of India",
    difficulty: "medium"
  },
  {
    id: "ei-008",
    question: "India's largest mica producing state is:",
    options: ["Bihar", "Jharkhand", "Rajasthan", "Andhra Pradesh"],
    correctAnswer: 3,
    topic: "Industrial Minerals",
    course: "Economic Minerals of India",
    difficulty: "medium"
  },
  {
    id: "ei-009",
    question: "Bailadila iron ore deposit is in which state?",
    options: ["Odisha", "Chhattisgarh", "Karnataka", "Goa"],
    correctAnswer: 1,
    topic: "Iron Ore Deposits",
    course: "Economic Minerals of India",
    difficulty: "medium"
  },
  {
    id: "ei-010",
    question: "Which mineral is Odisha NOT a major producer of?",
    options: ["Iron ore", "Chromite", "Coal", "Petroleum"],
    correctAnswer: 3,
    topic: "Odisha Minerals",
    course: "Economic Minerals of India",
    difficulty: "easy"
  },

  // Additional Laboratory Instrumentation Questions
  {
    id: "li-004",
    question: "SEM stands for:",
    options: ["Simple Electron Microscopy", "Scanning Electron Microscopy", "Standard Element Measurement", "Spectral Energy Meter"],
    correctAnswer: 1,
    topic: "Microscopy",
    course: "Laboratory Instrumentation",
    difficulty: "easy"
  },
  {
    id: "li-005",
    question: "EPMA is used for:",
    options: ["Age dating", "Quantitative elemental analysis", "Crystal structure", "Porosity measurement"],
    correctAnswer: 1,
    topic: "Microprobe Analysis",
    course: "Laboratory Instrumentation",
    difficulty: "hard"
  },
  {
    id: "li-006",
    question: "ICP-MS is commonly used for:",
    options: ["Imaging", "Trace element analysis", "Mineral identification", "Texture study"],
    correctAnswer: 1,
    topic: "Spectroscopic Methods",
    course: "Laboratory Instrumentation",
    difficulty: "medium"
  },
  {
    id: "li-007",
    question: "Thin sections are typically how thick?",
    options: ["0.01 mm", "0.03 mm", "0.1 mm", "1 mm"],
    correctAnswer: 1,
    topic: "Sample Preparation",
    course: "Laboratory Instrumentation",
    difficulty: "medium"
  },
  {
    id: "li-008",
    question: "Carbon-14 dating is used for:",
    options: ["Very old rocks", "Young organic material", "Igneous rocks only", "Metallic ores"],
    correctAnswer: 1,
    topic: "Geochronology",
    course: "Laboratory Instrumentation",
    difficulty: "medium"
  },

  // Additional Geology of Odisha Questions
  {
    id: "go-004",
    question: "The Mahanadi River basin contains which type of deposits?",
    options: ["Marine sediments", "Alluvial and deltaic sediments", "Volcanic rocks", "Glacial deposits"],
    correctAnswer: 1,
    topic: "Odisha Geomorphology",
    course: "Geology of Odisha",
    difficulty: "medium"
  },
  {
    id: "go-005",
    question: "Khondalites are characteristic rocks of:",
    options: ["Western Ghats", "Eastern Ghats", "Himalayas", "Deccan Plateau"],
    correctAnswer: 1,
    topic: "Odisha Rocks",
    course: "Geology of Odisha",
    difficulty: "medium"
  },
  {
    id: "go-006",
    question: "The Similipal massif is composed mainly of:",
    options: ["Sedimentary rocks", "Granite and gneiss", "Volcanic rocks", "Limestone"],
    correctAnswer: 1,
    topic: "Odisha Geology",
    course: "Geology of Odisha",
    difficulty: "hard"
  },
  {
    id: "go-007",
    question: "Odisha's coastline is characterized by:",
    options: ["Rocky cliffs", "Sandy beaches and spits", "Fjords", "Coral reefs"],
    correctAnswer: 1,
    topic: "Coastal Geomorphology",
    course: "Geology of Odisha",
    difficulty: "easy"
  },
  {
    id: "go-008",
    question: "The Talcher coalfield belongs to which geological formation?",
    options: ["Vindhyan", "Gondwana", "Deccan Traps", "Dharwar"],
    correctAnswer: 1,
    topic: "Odisha Stratigraphy",
    course: "Geology of Odisha",
    difficulty: "easy"
  },

  // Additional Fuel Geology Questions
  {
    id: "fg-006",
    question: "The rank of coal increases with:",
    options: ["Decreasing carbon content", "Increasing depth and temperature", "Increasing moisture", "Decreasing age"],
    correctAnswer: 1,
    topic: "Coal Metamorphism",
    course: "Fuel Geology",
    difficulty: "medium"
  },
  {
    id: "fg-007",
    question: "Source rock for petroleum must contain:",
    options: ["High silica", "Organic matter", "Metallic minerals", "Volcanic ash"],
    correctAnswer: 1,
    topic: "Petroleum Geology",
    course: "Fuel Geology",
    difficulty: "easy"
  },
  {
    id: "fg-008",
    question: "Lignite is also known as:",
    options: ["Black coal", "Brown coal", "Anthracite", "Coke"],
    correctAnswer: 1,
    topic: "Coal Types",
    course: "Fuel Geology",
    difficulty: "easy"
  },
  {
    id: "fg-009",
    question: "Bombay High is associated with:",
    options: ["Coal mining", "Offshore oil field", "Iron ore", "Uranium"],
    correctAnswer: 1,
    topic: "Indian Petroleum",
    course: "Fuel Geology",
    difficulty: "easy"
  },
  {
    id: "fg-010",
    question: "Natural gas primarily consists of:",
    options: ["CO2", "CH4 (Methane)", "H2S", "N2"],
    correctAnswer: 1,
    topic: "Natural Gas",
    course: "Fuel Geology",
    difficulty: "easy"
  },
  {
    id: "fg-011",
    question: "Kerogen is:",
    options: ["Mature petroleum", "Immature organic matter in source rock", "A type of coal", "Refined oil"],
    correctAnswer: 1,
    topic: "Petroleum Formation",
    course: "Fuel Geology",
    difficulty: "hard"
  },

  // Additional Environmental Geology Questions
  {
    id: "ev-004",
    question: "Acid rain is primarily caused by:",
    options: ["CO2 emissions", "SO2 and NOx emissions", "Methane", "Oxygen"],
    correctAnswer: 1,
    topic: "Atmospheric Pollution",
    course: "Environmental Geology",
    difficulty: "easy"
  },
  {
    id: "ev-005",
    question: "Desertification is caused by:",
    options: ["Increased rainfall", "Climate change and overgrazing", "Volcanic activity", "Tectonic movement"],
    correctAnswer: 1,
    topic: "Land Degradation",
    course: "Environmental Geology",
    difficulty: "easy"
  },
  {
    id: "ev-006",
    question: "Radon is a geological hazard because:",
    options: ["It's flammable", "It's radioactive and accumulates in buildings", "It causes earthquakes", "It pollutes water"],
    correctAnswer: 1,
    topic: "Geological Hazards",
    course: "Environmental Geology",
    difficulty: "medium"
  },
  {
    id: "ev-007",
    question: "Sea level rise is a concern due to:",
    options: ["Tectonic uplift", "Glacial melting and thermal expansion", "Volcanic activity", "Sedimentation"],
    correctAnswer: 1,
    topic: "Climate Change",
    course: "Environmental Geology",
    difficulty: "easy"
  },
  {
    id: "ev-008",
    question: "Sustainable development in mining includes:",
    options: ["Maximum extraction", "Environmental rehabilitation", "No regulation", "Only profit focus"],
    correctAnswer: 1,
    topic: "Environmental Management",
    course: "Environmental Geology",
    difficulty: "easy"
  },
  {
    id: "ev-009",
    question: "Groundwater contamination often results from:",
    options: ["Tectonic activity", "Industrial and agricultural pollutants", "Solar radiation", "Wind erosion"],
    correctAnswer: 1,
    topic: "Water Pollution",
    course: "Environmental Geology",
    difficulty: "easy"
  },

  // Additional Ore Microscopy Questions
  {
    id: "om-004",
    question: "Chalcopyrite appears in reflected light as:",
    options: ["White", "Brass yellow", "Silver", "Red"],
    correctAnswer: 1,
    topic: "Ore Mineral Colors",
    course: "Ore Microscopy",
    difficulty: "medium"
  },
  {
    id: "om-005",
    question: "Anisotropism in ore minerals refers to:",
    options: ["Color change with rotation", "Hardness variation", "Chemical zoning", "Crystal twinning"],
    correctAnswer: 0,
    topic: "Optical Properties",
    course: "Ore Microscopy",
    difficulty: "hard"
  },
  {
    id: "om-006",
    question: "Colloform texture in ore minerals indicates:",
    options: ["High temperature origin", "Colloidal precipitation", "Igneous crystallization", "Metamorphic growth"],
    correctAnswer: 1,
    topic: "Ore Textures",
    course: "Ore Microscopy",
    difficulty: "hard"
  },
  {
    id: "om-007",
    question: "Magnetite appears in reflected light as:",
    options: ["White", "Yellow", "Gray with brownish tint", "Blue"],
    correctAnswer: 2,
    topic: "Ore Mineral Identification",
    course: "Ore Microscopy",
    difficulty: "medium"
  },
  {
    id: "om-008",
    question: "Reflectance of ore minerals is measured relative to:",
    options: ["Water", "Standard mineral (usually pyrite)", "Air", "Diamond"],
    correctAnswer: 1,
    topic: "Reflectance Measurement",
    course: "Ore Microscopy",
    difficulty: "hard"
  },

  // Additional Geostatistics Questions
  {
    id: "gs-004",
    question: "The nugget effect in a variogram represents:",
    options: ["Maximum variance", "Variance at zero distance", "Mean value", "Range"],
    correctAnswer: 1,
    topic: "Variogram Parameters",
    course: "Geostatistics",
    difficulty: "hard"
  },
  {
    id: "gs-005",
    question: "Inverse Distance Weighting (IDW) is a type of:",
    options: ["Classification method", "Interpolation method", "Sampling technique", "Statistical test"],
    correctAnswer: 1,
    topic: "Spatial Interpolation",
    course: "Geostatistics",
    difficulty: "medium"
  },
  {
    id: "gs-006",
    question: "Semivariogram helps in understanding:",
    options: ["Rock type", "Spatial correlation structure", "Chemical composition", "Age of deposit"],
    correctAnswer: 1,
    topic: "Geostatistical Analysis",
    course: "Geostatistics",
    difficulty: "medium"
  },
  {
    id: "gs-007",
    question: "Block kriging estimates values for:",
    options: ["Points only", "Blocks or areas", "Lines only", "Random locations"],
    correctAnswer: 1,
    topic: "Kriging Methods",
    course: "Geostatistics",
    difficulty: "hard"
  },
  {
    id: "gs-008",
    question: "The sill in a variogram represents:",
    options: ["Zero variance", "Maximum variance", "Mean value", "Sampling error"],
    correctAnswer: 1,
    topic: "Variogram Parameters",
    course: "Geostatistics",
    difficulty: "hard"
  },

  // Additional miscellaneous questions for variety
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
