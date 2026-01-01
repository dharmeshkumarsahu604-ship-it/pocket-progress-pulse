import { Lightbulb, Target, BookOpen, Beaker, Mountain, Gem, MapPin, Compass } from 'lucide-react';

export type LearningCategory = 'rock' | 'mineral' | 'site' | 'compass' | 'general' | 'exam';

export interface LearningTip {
  id: string;
  category: LearningCategory;
  title: string;
  content: string;
  iconType: 'lightbulb' | 'target' | 'book' | 'beaker' | 'mountain' | 'gem' | 'mappin' | 'compass';
}

export const getIconForType = (iconType: LearningTip['iconType']) => {
  switch (iconType) {
    case 'lightbulb': return Lightbulb;
    case 'target': return Target;
    case 'book': return BookOpen;
    case 'beaker': return Beaker;
    case 'mountain': return Mountain;
    case 'gem': return Gem;
    case 'mappin': return MapPin;
    case 'compass': return Compass;
    default: return Lightbulb;
  }
};

// ============= ROCK TIPS & FACTS =============
export const rockTips: LearningTip[] = [
  { id: 'r1', category: 'rock', title: 'Rock Fact', content: 'Granite is the most abundant rock in Earth\'s continental crust, making up about 70-80% of it.', iconType: 'mountain' },
  { id: 'r2', category: 'rock', title: 'Did You Know?', content: 'Obsidian forms so rapidly that crystals don\'t have time to grow, making it naturally glassy.', iconType: 'lightbulb' },
  { id: 'r3', category: 'rock', title: 'Field Tip', content: 'Basalt has tiny pores from escaping gas bubbles. Count them to estimate eruption speed!', iconType: 'target' },
  { id: 'r4', category: 'rock', title: 'Rock Cycle', content: 'Any rock type can transform into any other given enough time, heat, and pressure.', iconType: 'book' },
  { id: 'r5', category: 'rock', title: 'Fun Fact', content: 'Pumice is the only rock that floats on water due to its numerous air-filled vesicles.', iconType: 'lightbulb' },
  { id: 'r6', category: 'rock', title: 'Identification Tip', content: 'Scratch test: Igneous rocks are typically harder than sedimentary rocks of similar composition.', iconType: 'target' },
  { id: 'r7', category: 'rock', title: 'Did You Know?', content: 'Marble is metamorphosed limestone - the same material, transformed by heat and pressure.', iconType: 'lightbulb' },
  { id: 'r8', category: 'rock', title: 'Field Tip', content: 'Look for ripple marks and mud cracks to identify ancient sedimentary environments.', iconType: 'target' },
  { id: 'r9', category: 'rock', title: 'Rock Fact', content: 'Sandstone grains are typically well-rounded because wind and water smooth them over time.', iconType: 'mountain' },
  { id: 'r10', category: 'rock', title: 'Geology Secret', content: 'Schist gets its name from the Greek "schízein" meaning to split - it breaks into thin sheets.', iconType: 'book' },
  { id: 'r11', category: 'rock', title: 'Amazing Fact', content: 'The oldest known rocks are 4.28 billion years old, found in Quebec, Canada.', iconType: 'lightbulb' },
  { id: 'r12', category: 'rock', title: 'Pro Tip', content: 'Gneiss shows alternating light and dark bands - look for this foliation pattern.', iconType: 'target' },
  { id: 'r13', category: 'rock', title: 'Did You Know?', content: 'Rhyolite is the volcanic equivalent of granite - same composition, different cooling rate.', iconType: 'lightbulb' },
  { id: 'r14', category: 'rock', title: 'Field Tip', content: 'Conglomerate rocks tell stories - their rounded pebbles indicate water transport.', iconType: 'target' },
  { id: 'r15', category: 'rock', title: 'Rock Fact', content: 'Slate was once shale - gentle metamorphism gives it the ability to split into thin sheets.', iconType: 'mountain' },
];

// ============= MINERAL TIPS & FACTS =============
export const mineralTips: LearningTip[] = [
  { id: 'm1', category: 'mineral', title: 'Mineral Fact', content: 'Quartz is piezoelectric - it generates electricity when mechanical pressure is applied.', iconType: 'gem' },
  { id: 'm2', category: 'mineral', title: 'Quick Test', content: 'Use dilute HCl acid to test for carbonates - fizzing indicates calcite or dolomite.', iconType: 'beaker' },
  { id: 'm3', category: 'mineral', title: 'Hardness Tip', content: 'Your fingernail has hardness 2.5, a copper coin 3.5, and glass 5.5 - use these in the field!', iconType: 'target' },
  { id: 'm4', category: 'mineral', title: 'Did You Know?', content: 'Diamond and graphite are both pure carbon - different atomic arrangements create different properties.', iconType: 'lightbulb' },
  { id: 'm5', category: 'mineral', title: 'Streak Test', content: 'A mineral\'s streak color is more reliable than its surface color for identification.', iconType: 'beaker' },
  { id: 'm6', category: 'mineral', title: 'Crystal Fact', content: 'Halite (table salt) always forms perfect cubic crystals - this is its crystal habit.', iconType: 'gem' },
  { id: 'm7', category: 'mineral', title: 'Fun Fact', content: 'Magnetite is naturally magnetic - ancient sailors used it as a compass (lodestone).', iconType: 'lightbulb' },
  { id: 'm8', category: 'mineral', title: 'Luster Tip', content: 'Metallic luster means light reflects like metal. Non-metallic can be glassy, waxy, or earthy.', iconType: 'target' },
  { id: 'm9', category: 'mineral', title: 'Did You Know?', content: 'Feldspar is the most abundant mineral group in Earth\'s crust, making up about 60%.', iconType: 'lightbulb' },
  { id: 'm10', category: 'mineral', title: 'Cleavage Fact', content: 'Mica has perfect cleavage in one direction - that\'s why it peels into thin sheets.', iconType: 'gem' },
  { id: 'm11', category: 'mineral', title: 'Safety Tip', content: 'Never taste minerals to identify them - some like arsenopyrite can be toxic!', iconType: 'target' },
  { id: 'm12', category: 'mineral', title: 'Crystal Fact', content: 'Pyrite is called "fool\'s gold" but you can tell it apart - pyrite is harder and brittle.', iconType: 'gem' },
  { id: 'm13', category: 'mineral', title: 'Did You Know?', content: 'Fluorite gave us the word "fluorescence" - it glows under UV light!', iconType: 'lightbulb' },
  { id: 'm14', category: 'mineral', title: 'Quick Test', content: 'Calcite has rhombohedral cleavage (3 directions not at 90°) while halite has cubic (3 at 90°).', iconType: 'beaker' },
  { id: 'm15', category: 'mineral', title: 'Mineral Fact', content: 'Olivine is one of the first minerals to crystallize from magma, common in mantle rocks.', iconType: 'gem' },
];

// ============= SITE & FIELD TIPS =============
export const siteTips: LearningTip[] = [
  { id: 's1', category: 'site', title: 'Site Tip', content: 'Always note GPS coordinates when collecting samples - future you will thank present you!', iconType: 'mappin' },
  { id: 's2', category: 'site', title: 'Safety First', content: 'Never go alone to remote geological sites. Always inform someone of your plans.', iconType: 'target' },
  { id: 's3', category: 'site', title: 'Best Practice', content: 'Photograph outcrops before sampling - capture the geological context in place.', iconType: 'mappin' },
  { id: 's4', category: 'site', title: 'Field Tip', content: 'Early morning and late afternoon light is best for seeing rock textures and structures.', iconType: 'target' },
  { id: 's5', category: 'site', title: 'Did You Know?', content: 'The Deccan Traps in India is one of the largest volcanic provinces on Earth.', iconType: 'lightbulb' },
  { id: 's6', category: 'site', title: 'Site Tip', content: 'Look for road cuts and river banks - they often expose fresh rock surfaces.', iconType: 'mappin' },
  { id: 's7', category: 'site', title: 'India Geology', content: 'The Eastern Ghats contain some of India\'s oldest rocks, over 2.5 billion years old.', iconType: 'lightbulb' },
  { id: 's8', category: 'site', title: 'Best Practice', content: 'Carry a sample bag system: label immediately with site, date, and rock type.', iconType: 'target' },
  { id: 's9', category: 'site', title: 'Site Fact', content: 'Lonar Crater in Maharashtra is one of only four impact craters in basaltic rock on Earth.', iconType: 'mappin' },
  { id: 's10', category: 'site', title: 'Field Tip', content: 'Bring extra water and sun protection - most geological sites offer little shade.', iconType: 'target' },
  { id: 's11', category: 'site', title: 'India Geology', content: 'The Himalayan orogeny started ~50 million years ago when India collided with Asia.', iconType: 'lightbulb' },
  { id: 's12', category: 'site', title: 'Site Tip', content: 'Sketch geological contacts in your field notebook - photos alone miss important details.', iconType: 'mappin' },
  { id: 's13', category: 'site', title: 'Best Practice', content: 'Check local regulations before collecting - some sites prohibit sample removal.', iconType: 'target' },
  { id: 's14', category: 'site', title: 'Site Fact', content: 'The Western Ghats are a UNESCO biodiversity hotspot with unique geological formations.', iconType: 'mappin' },
  { id: 's15', category: 'site', title: 'Field Tip', content: 'Monsoon season exposes fresh rock but can make sites dangerous - plan accordingly.', iconType: 'target' },
];

// ============= COMPASS & MEASUREMENT TIPS =============
export const compassTips: LearningTip[] = [
  { id: 'c1', category: 'compass', title: 'Compass Tip', content: 'The Right-Hand Rule: thumb points dip direction when fingers curl from strike direction.', iconType: 'compass' },
  { id: 'c2', category: 'compass', title: 'Measurement Tip', content: 'Always record strike before dip. Convention is Strike/Dip (e.g., N45°E/30°SE).', iconType: 'target' },
  { id: 'c3', category: 'compass', title: 'Field Practice', content: 'Take 3 measurements at slightly different spots and average them for accuracy.', iconType: 'compass' },
  { id: 'c4', category: 'compass', title: 'Did You Know?', content: 'Magnetic declination in India varies from -2° to +3° depending on location.', iconType: 'lightbulb' },
  { id: 'c5', category: 'compass', title: 'Compass Tip', content: 'For linear features, measure trend and plunge. For planar features, use strike and dip.', iconType: 'compass' },
  { id: 'c6', category: 'compass', title: 'Calibration Tip', content: 'Keep your compass away from metal objects and phones during measurements.', iconType: 'target' },
  { id: 'c7', category: 'compass', title: 'Best Practice', content: 'Use the clinometer for dip by placing compass edge parallel to bedding plane.', iconType: 'compass' },
  { id: 'c8', category: 'compass', title: 'Measurement Tip', content: 'Trend is always measured in the down-plunge direction (0-180°, not 0-360°).', iconType: 'target' },
  { id: 'c9', category: 'compass', title: 'Field Practice', content: 'Find the steepest line on a plane to measure true dip, not apparent dip.', iconType: 'compass' },
  { id: 'c10', category: 'compass', title: 'Did You Know?', content: 'The Brunton compass was invented in 1894 and is still the geologist\'s standard tool.', iconType: 'lightbulb' },
  { id: 'c11', category: 'compass', title: 'Compass Tip', content: 'Dip direction is always 90° clockwise from strike (Right-Hand Rule convention).', iconType: 'compass' },
  { id: 'c12', category: 'compass', title: 'Best Practice', content: 'Record lithology with each measurement - "Sandstone, N30°E/45°SE" is much more useful.', iconType: 'target' },
  { id: 'c13', category: 'compass', title: 'Field Practice', content: 'For accurate strike, use a straight edge or notebook against the rock surface.', iconType: 'compass' },
  { id: 'c14', category: 'compass', title: 'Measurement Tip', content: 'Plunge angle is measured from horizontal, never exceeding 90°.', iconType: 'target' },
  { id: 'c15', category: 'compass', title: 'Compass Tip', content: 'Export your data regularly - a stereonet with 50+ readings reveals structural patterns.', iconType: 'compass' },
];

// ============= EXAM & STUDY TIPS =============
export const examTips: LearningTip[] = [
  { id: 'e1', category: 'exam', title: 'Exam Prep', content: 'Rock Cycle: Igneous → weathering → Sedimentary → metamorphism → Metamorphic → melting → Igneous.', iconType: 'book' },
  { id: 'e2', category: 'exam', title: 'Memory Trick', content: 'Mohs Scale: "Those Girls Can Flirt And Only Quit To Court Diamonds" (1-10 hardness).', iconType: 'book' },
  { id: 'e3', category: 'exam', title: 'Key Concept', content: 'Bowen\'s Reaction Series explains why olivine crystallizes first and quartz last from magma.', iconType: 'book' },
  { id: 'e4', category: 'exam', title: 'Exam Tip', content: 'Know the difference: Luster is how light reflects, Streak is the powder color.', iconType: 'target' },
  { id: 'e5', category: 'exam', title: 'Quick Review', content: 'Intrusive = slow cooling = large crystals. Extrusive = fast cooling = small/no crystals.', iconType: 'book' },
  { id: 'e6', category: 'exam', title: 'Key Concept', content: 'Metamorphic grade increases: Slate → Phyllite → Schist → Gneiss → Migmatite.', iconType: 'book' },
  { id: 'e7', category: 'exam', title: 'Memory Trick', content: 'Sedimentary structures: Ripples = currents, Mud cracks = drying, Cross-beds = dunes/currents.', iconType: 'book' },
  { id: 'e8', category: 'exam', title: 'Exam Prep', content: 'Felsic rocks are light colored (granite), Mafic rocks are dark (basalt). Think Fe + Mg = Mafic.', iconType: 'target' },
  { id: 'e9', category: 'exam', title: 'Key Concept', content: 'Foliation develops perpendicular to the direction of maximum stress.', iconType: 'book' },
  { id: 'e10', category: 'exam', title: 'Quick Review', content: 'Clastic = broken fragments, Chemical = precipitated, Organic = from organisms.', iconType: 'book' },
  { id: 'e11', category: 'exam', title: 'Exam Tip', content: 'Contact metamorphism = heat only (aureole). Regional metamorphism = heat + pressure (mountain belts).', iconType: 'target' },
  { id: 'e12', category: 'exam', title: 'Memory Trick', content: 'Silicate tetrahedra: Isolated → Chain → Sheet → Framework (increasing silica, decreasing temp).', iconType: 'book' },
  { id: 'e13', category: 'exam', title: 'Key Concept', content: 'Principle of Original Horizontality: Sedimentary layers deposit horizontally - tilting comes later.', iconType: 'book' },
  { id: 'e14', category: 'exam', title: 'Exam Prep', content: 'Law of Superposition: In undisturbed strata, older layers are at the bottom.', iconType: 'target' },
  { id: 'e15', category: 'exam', title: 'Quick Review', content: 'Mineral formula trick: Silicates have SiO₄ tetrahedra, Carbonates have CO₃, Sulfates have SO₄.', iconType: 'book' },
];

// ============= GENERAL GEOLOGY TIPS =============
export const generalTips: LearningTip[] = [
  { id: 'g1', category: 'general', title: 'Earth Fact', content: 'Earth\'s core is as hot as the surface of the Sun - about 5,500°C!', iconType: 'lightbulb' },
  { id: 'g2', category: 'general', title: 'Plate Tectonics', content: 'India moves north about 5 cm per year - that\'s why the Himalayas keep growing.', iconType: 'lightbulb' },
  { id: 'g3', category: 'general', title: 'Time Scale', content: 'If Earth\'s history were 24 hours, humans would appear in the last 1.5 seconds!', iconType: 'book' },
  { id: 'g4', category: 'general', title: 'Geology Fact', content: 'The word "geology" comes from Greek: geo (Earth) + logos (study/discourse).', iconType: 'lightbulb' },
  { id: 'g5', category: 'general', title: 'Earth Structure', content: 'The oceanic crust is only 5-10 km thick, while continental crust is 30-50 km thick.', iconType: 'book' },
  { id: 'g6', category: 'general', title: 'Deep Time', content: 'The first rocks formed 4.4 billion years ago, just 100 million years after Earth formed.', iconType: 'lightbulb' },
  { id: 'g7', category: 'general', title: 'Plate Tectonics', content: 'The Mid-Atlantic Ridge creates 2.5 cm of new ocean floor each year - measurable!', iconType: 'book' },
  { id: 'g8', category: 'general', title: 'Geology Fact', content: 'About 71% of Earth\'s surface is covered by water, but we\'ve mapped more of Mars!', iconType: 'lightbulb' },
  { id: 'g9', category: 'general', title: 'Earth Structure', content: 'The mantle makes up 84% of Earth\'s volume - it\'s mostly solid but flows slowly.', iconType: 'book' },
  { id: 'g10', category: 'general', title: 'Deep Time', content: 'The Precambrian represents 88% of Earth\'s history - before visible life flourished.', iconType: 'lightbulb' },
  { id: 'g11', category: 'general', title: 'Plate Tectonics', content: 'Subduction zones recycle crust - ocean floor rarely survives more than 200 million years.', iconType: 'book' },
  { id: 'g12', category: 'general', title: 'Geology Fact', content: 'James Hutton (1726-1797) is the "Father of Geology" - he proposed uniformitarianism.', iconType: 'lightbulb' },
  { id: 'g13', category: 'general', title: 'Earth Structure', content: 'The lithosphere (crust + upper mantle) "floats" on the asthenosphere below it.', iconType: 'book' },
  { id: 'g14', category: 'general', title: 'Deep Time', content: 'The Cambrian Explosion (541 Ma) saw rapid evolution of complex life - geologically "sudden".', iconType: 'lightbulb' },
  { id: 'g15', category: 'general', title: 'Plate Tectonics', content: 'Transform faults like the San Andreas move sideways - no crust is created or destroyed.', iconType: 'book' },
];

// ============= COMBINED TIPS WITH DAILY ROTATION =============
export const allTips: LearningTip[] = [
  ...rockTips,
  ...mineralTips,
  ...siteTips,
  ...compassTips,
  ...examTips,
  ...generalTips,
];

// Get deterministic "random" index based on date
export function getDailyIndex(max: number, offset: number = 0): number {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate() + offset;
  return seed % max;
}

// Get daily tips for the Quick Learning section (one from each category)
export function getDailyLearningCards(): LearningTip[] {
  const categories = [
    { tips: rockTips, offset: 0 },
    { tips: mineralTips, offset: 1 },
    { tips: siteTips, offset: 2 },
    { tips: compassTips, offset: 3 },
    { tips: examTips, offset: 4 },
    { tips: generalTips, offset: 5 },
  ];

  return categories.map(({ tips, offset }) => {
    const index = getDailyIndex(tips.length, offset);
    return tips[index];
  });
}

// Get a single random tip from a specific category
export function getDailyTipByCategory(category: LearningCategory): LearningTip {
  let tips: LearningTip[];
  switch (category) {
    case 'rock': tips = rockTips; break;
    case 'mineral': tips = mineralTips; break;
    case 'site': tips = siteTips; break;
    case 'compass': tips = compassTips; break;
    case 'exam': tips = examTips; break;
    default: tips = generalTips;
  }
  const index = getDailyIndex(tips.length);
  return tips[index];
}
