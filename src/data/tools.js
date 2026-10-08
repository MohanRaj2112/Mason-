import equipmentImg from '../assets/images/srm_equipment_rental_1791445442334.jpg';
import heroSiteImg from '../assets/images/srm_hero_site_1791445418459.jpg';
import masonryImg from '../assets/images/service_masonry_work_1790694699452.jpg';
import footerArchImg from '../assets/images/srm_footer_bg_1791445429334.jpg';

// Category definitions: minimal, professional, text-only without emojis
export const toolCategories = [
  { id: 'all', label: 'All' },
  { id: 'hand-tools', label: 'Hand Tools' },
  { id: 'power-tools', label: 'Power Tools' },
  { id: 'mixing', label: 'Construction Equipment' },
  { id: 'roofing', label: 'Ladders & Scaffolding' },
  { id: 'measuring', label: 'Measuring Tools' },
  { id: 'safety', label: 'Safety Equipment' },
  { id: 'plumbing', label: 'Pumps & Plumbing' }
];

export const initialToolsData = [
  {
    _id: 'tool_1',
    name: 'Heavy-Duty Construction Hammer Set',
    category: 'hand-tools',
    price: 120,
    pricePerDay: 120,
    period: 'Day',
    image: masonryImg,
    available: true,
    availabilityStatus: 'Available',
    contactOption: 'Site Delivery',
    rating: 4.9,
    featured: true,
    specifications: {
      Material: 'Drop-Forged Carbon Steel',
      Weight: '4 kg (Sledge) + Claw',
      Handle: 'Fiberglass Shock Grip',
      Type: 'Heavy Duty Demolition'
    },
    specs: 'Material: Carbon Steel, Weight: 4 kg + Claw, Grip: Fiberglass Shock-Absorbing, Type: Heavy Duty',
    desc: 'Heavy-duty construction claw and sledge hammer set engineered for formwork, masonry chiseling, and structural demolition. Tempered steel striking face resists chipping during heavy masonry strikes.'
  },
  {
    _id: 'tool_2',
    name: 'Rotary Hammer Drill (SDS-Plus 800W)',
    category: 'power-tools',
    price: 450,
    pricePerDay: 450,
    period: 'Day',
    image: equipmentImg,
    available: true,
    availabilityStatus: 'Available',
    contactOption: 'Site Delivery',
    rating: 4.9,
    featured: true,
    specifications: {
      Power: '800W Motor',
      Chuck: 'SDS-Plus Quick Lock',
      Modes: '3-Mode (Hammer/Drill/Chisel)',
      Type: 'Heavy Duty Impact'
    },
    specs: 'Power: 800W, Chuck: SDS-Plus, Modes: 3-Mode Hammer/Chisel, Type: Heavy Duty',
    desc: 'High-impact rotary hammer drill for reinforced concrete anchoring, granite coring, and electrical wall channelling. Delivers 2.7 Joules of impact energy with anti-vibration damping handle.'
  },
  {
    _id: 'tool_3',
    name: 'Commercial Cement Mixer (200L Diesel)',
    category: 'mixing',
    price: 850,
    pricePerDay: 850,
    period: 'Day',
    image: equipmentImg,
    available: true,
    availabilityStatus: 'Available',
    contactOption: 'Site Delivery',
    rating: 4.9,
    featured: true,
    specifications: {
      Capacity: '200 Litres Batch',
      Engine: '6HP Greaves Diesel',
      Gear: 'Cast-Iron Ring Gear',
      Type: 'Towable Tilting Drum'
    },
    specs: 'Capacity: 200 Litres, Engine: 6HP Diesel, Gear: Cast-Iron Ring, Type: Tilting Drum Mixer',
    desc: 'Heavy-gauge tilting drum concrete mixer for continuous RCC slab casting, foundation concrete, and mortar preparation. Towable chassis allows easy positioning on construction job sites.'
  },
  {
    _id: 'tool_4',
    name: 'Industrial Tile & Rebar Cutting Machine',
    category: 'power-tools',
    price: 650,
    pricePerDay: 650,
    period: 'Day',
    image: masonryImg,
    available: true,
    availabilityStatus: 'Available',
    contactOption: 'Site Delivery',
    rating: 4.8,
    featured: true,
    specifications: {
      Power: '2400W High Torque',
      Blade: '355mm Diamond Wheel',
      Cooling: 'Integrated Water Jet Feed',
      Type: 'Fe550D TMT & Granite Cutter'
    },
    specs: 'Power: 2400W, Blade: 355mm Diamond, Cooling: Wet/Dry Water Feed, Type: TMT & Granite Cutter',
    desc: 'Precision wet and dry cutting machine for vitrified tiles, granite slabs, and Fe550D TMT steel reinforcement bars. Equipped with laser cutting guide and adjustable miter fence.'
  },
  {
    _id: 'tool_5',
    name: 'Heavy-Duty Aluminum Extension Ladder (24 Ft)',
    category: 'roofing',
    price: 300,
    pricePerDay: 300,
    period: 'Day',
    image: heroSiteImg,
    available: true,
    availabilityStatus: 'Available',
    contactOption: 'Site Delivery',
    rating: 4.8,
    featured: true,
    specifications: {
      Material: '6061-T6 Aircraft Aluminum',
      Height: '24 Feet (Dual Section)',
      Capacity: '150 kg Safe Work Load',
      Safety: 'Anti-Skid Swivel Shoes'
    },
    specs: 'Material: 6061 Aluminum, Height: 24 Feet, Capacity: 150 kg, Safety: Anti-Skid Rubber Shoes',
    desc: 'Industrial dual-section extension ladder with slip-resistant D-rungs for exterior painting, plastering, and electrical work. Features gravity-lock rungs and rope-and-pulley lift.'
  },
  {
    _id: 'tool_6',
    name: 'Tempered Steel Shovel & Excavation Spade Kit',
    category: 'hand-tools',
    price: 100,
    pricePerDay: 100,
    period: 'Day',
    image: heroSiteImg,
    available: true,
    availabilityStatus: 'Available',
    contactOption: 'Pickup / Delivery',
    rating: 4.7,
    featured: false,
    specifications: {
      Material: 'Manganese Tempered Steel',
      Handle: 'Ergonomic Hardwood D-Grip',
      Type: 'Square & Round Trenching',
      Finish: 'Anti-Rust Powder Coat'
    },
    specs: 'Material: Tempered Steel, Handle: Hardwood D-Grip, Type: Square & Round Trenching',
    desc: 'Heavy-duty square and round-mouth construction shovels for sand aggregate mixing, trenching, and foundation earthwork. Reinforced collar socket prevents neck bending.'
  },
  {
    _id: 'tool_7',
    name: 'Heavy-Duty Steel Construction Wheelbarrow',
    category: 'hand-tools',
    price: 200,
    pricePerDay: 200,
    period: 'Day',
    image: equipmentImg,
    available: true,
    availabilityStatus: 'Available',
    contactOption: 'Site Delivery',
    rating: 4.8,
    featured: true,
    specifications: {
      Capacity: '110 Litres Volume',
      Weight: '180 kg Load Rating',
      Material: 'Seamless Pressed Steel Tray',
      Tire: 'Puncture-Proof Pneumatic'
    },
    specs: 'Capacity: 110 Litres, Load: 180 kg, Material: Pressed Steel, Tire: Puncture-Proof',
    desc: 'Balanced single-wheel contractor barrow for effortless on-site transport of wet concrete, bricks, and debris. Reinforced leg stabilizers prevent tipping during discharge.'
  },
  {
    _id: 'tool_8',
    name: 'Laser Distance Meter & Spirit Level Kit',
    category: 'measuring',
    price: 350,
    pricePerDay: 350,
    period: 'Day',
    image: footerArchImg,
    available: true,
    availabilityStatus: 'Available',
    contactOption: 'Site Delivery',
    rating: 4.9,
    featured: false,
    specifications: {
      Range: '100 Meters Range',
      Accuracy: '±1.5mm Precision',
      Level: '1200mm Magnetic Spirit Bar',
      Type: 'Civil Layout & Leveling Kit'
    },
    specs: 'Range: 100 Meters, Accuracy: ±1.5mm, Level: 1200mm Magnetic, Type: Civil Engineering Kit',
    desc: 'Complete civil engineering layout and leveling kit for column alignment, floor slope checks, and boundary measurement. Optical lens with multi-unit digital angle readout.'
  },
  {
    _id: 'tool_9',
    name: 'ISI Safety Helmet, Boots & Harness Kit',
    category: 'safety',
    price: 180,
    pricePerDay: 180,
    period: 'Day',
    image: heroSiteImg,
    available: true,
    availabilityStatus: 'Available',
    contactOption: 'Site Delivery',
    rating: 5.0,
    featured: false,
    specifications: {
      Certification: 'ISI Class-C Approved',
      Material: 'High-Impact ABS Shell',
      Harness: 'Dual-Lanyard Fall Arrest',
      Footwear: 'Steel-Toe ISI Grade Boots'
    },
    specs: 'Standard: ISI Class-C, Shell: High-Impact ABS, Harness: Dual-Lanyard Fall Arrest',
    desc: 'Certified site safety PPE kit engineered for high-elevation scaffolding, roofing, and structural erection teams. Shock-absorbing webbing harness conforms to IS 3521 standard.'
  },
  {
    _id: 'tool_10',
    name: 'Roofing Sheet Crimper & Scaffolding Set',
    category: 'roofing',
    price: 600,
    pricePerDay: 600,
    period: 'Day',
    image: heroSiteImg,
    available: true,
    availabilityStatus: 'Available',
    contactOption: 'Site Delivery',
    rating: 4.9,
    featured: false,
    specifications: {
      Frame: '40mm GI Steel H-Frames',
      Walkway: 'Anti-Slip Galvanized Planks',
      Driver: 'Self-Drilling Hex Chuck',
      Type: 'Modular Elevation Set'
    },
    specs: 'Frame: 40mm GI Steel, Walkway: Anti-Slip Planks, Driver: Self-Drilling Hex, Type: Modular Set',
    desc: 'Complete roofing and elevation work package including modular steel scaffolding frames, cross-braces, non-slip work platforms, and sheet seaming fastener tools.'
  },
  {
    _id: 'tool_11',
    name: 'Vibratory Concrete Needle Compactor (2HP)',
    category: 'mixing',
    price: 500,
    pricePerDay: 500,
    period: 'Day',
    image: equipmentImg,
    available: true,
    availabilityStatus: 'Available',
    contactOption: 'Site Delivery',
    rating: 4.8,
    featured: false,
    specifications: {
      Power: '2HP High-Torque Motor',
      Speed: '2800 RPM Vibration',
      Shaft: '6m Flexible Braided Hose',
      Needle: '40mm Hardened Poker'
    },
    specs: 'Power: 2HP Motor, Speed: 2800 RPM, Shaft: 6m Braided Hose, Needle: 40mm Poker',
    desc: 'Essential RCC concrete vibrator for eliminating honeycombing and air pockets during column, beam, and slab pouring. Heavy-duty flexible shaft withstands sharp bending.'
  },
  {
    _id: 'tool_12',
    name: 'Submersible Sludge De-Watering Pump (3HP)',
    category: 'plumbing',
    price: 550,
    pricePerDay: 550,
    period: 'Day',
    image: footerArchImg,
    available: true,
    availabilityStatus: 'Available',
    contactOption: 'Site Delivery',
    rating: 4.7,
    featured: false,
    specifications: {
      Power: '3HP Copper Motor',
      Discharge: '500 LPM High Flow',
      Impeller: 'Non-Clog Cast Iron Vortex',
      Hose: '25m Reinforced Delivery Hose'
    },
    specs: 'Power: 3HP Motor, Discharge: 500 Litres/Min, Impeller: Cast-Iron Non-Clog, Hose: 25m',
    desc: 'High-discharge submersible pump for rapid de-watering of waterlogged foundation pits, sumps, and basement excavations. Handles solids and muddy slurry up to 25mm diameter.'
  }
];
