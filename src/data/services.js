export const servicesData = [
  {
    id: 'turnkey-construction',
    title: 'Turnkey House Construction',
    category: 'construction',
    icon: '🏗️',
    tag: 'All-Inclusive',
    description: 'Complete end-to-end residential construction from soil testing, structural RCC framing, red-brick masonry to custom architectural finishes.',
    features: [
      'Architectural 2D/3D floor plans & structural drawings',
      'Fe550D TMT steel & Grade 53 high-strength cement',
      'Daily WhatsApp site logs & milestone progress updates',
      '10-Year structural stability warranty guarantee'
    ],
    priceRange: '₹1,750 – ₹2,650 / Sq.Ft',
    link: '/booking?type=construction',
    buttonText: 'Get Construction Quote →'
  },
  {
    id: 'master-masons',
    title: 'Hire Master Masons',
    category: 'workforce',
    icon: '👷',
    tag: 'Verified Workforce',
    description: 'Book trade-tested, background-verified master masons (mistris) and skilled helpers on a daily wage or milestone contract basis.',
    features: [
      'Precision Flemish & English bond brick & AAC block work',
      'Smooth internal/external plastering & ceiling POP',
      'Zero-lip Italian marble, granite & tile cladding',
      'Rapid on-site deployment within 24 hours'
    ],
    priceRange: '₹650 – ₹1,150 / Day',
    link: '/booking?type=mason',
    buttonText: 'Hire Certified Masons →'
  },
  {
    id: 'tool-rentals',
    title: 'Tools & Equipment Rental',
    category: 'rentals',
    icon: '🔨',
    tag: 'Site Delivery',
    description: 'Commercial-grade concrete mixers, demolition rotary hammers, needle vibrators, and modular scaffolding delivered directly to your site.',
    features: [
      'Daily serviced, calibrated & safety-tested machinery',
      'Flexible daily, weekly, and monthly commercial rates',
      'Express 2-hour job site delivery across Salem & Kovai',
      'On-site operator support & mechanical assistance'
    ],
    priceRange: 'From ₹150 / Day',
    link: '/products',
    buttonText: 'Explore Rental Catalog →'
  },
  {
    id: 'renovation-remodeling',
    title: 'Renovation & Remodeling',
    category: 'construction',
    icon: '🏠',
    tag: 'Civil Retrofit',
    description: 'Comprehensive structural remodeling, beam retrofitting, second-floor vertical expansions, and modern bathroom and kitchen makeovers.',
    features: [
      'RCC structural beam reinforcement & load analysis',
      'Full waterproofing screeds & seepage elimination',
      'Modular kitchen civil works & premium tile upgrades',
      'Minimal disturbance with clean site dust protection'
    ],
    priceRange: 'From ₹850 / Sq.Ft',
    link: '/booking?type=renovation',
    buttonText: 'Book Remodeling Visit →'
  },
  {
    id: 'plumbing-electrical',
    title: 'Plumbing & Electrical Fitting',
    category: 'services',
    icon: '⚡',
    tag: 'Concealed Systems',
    description: 'Certified civil plumbers and electricians for concealed CPVC/UPVC pipelines, sanitary installations, and copper modular wiring.',
    features: [
      'High-pressure concealed CPVC line testing',
      'Jaquar / Kohler sanitaryware & diverter fittings',
      'FRLS fire-resistant copper wiring & MCB distribution',
      'Earth pit grounding & lightning arrestor setup'
    ],
    priceRange: 'From ₹600 / Day',
    link: '/booking?type=plumbing',
    buttonText: 'Book Technical Team →'
  },
  {
    id: 'architectural-design',
    title: 'Architectural & 3D Elevation',
    category: 'design',
    icon: '📐',
    tag: '100% Vastu',
    description: 'Customized floor plans aligned with 100% Vastu Shastra principles, 3D photorealistic elevations, and municipal approval liaisons.',
    features: [
      '100% Vastu-compliant residential floor layouts',
      'Photorealistic 3D exterior elevation renders',
      'Structural column & beam reinforcement schedules',
      'Salem / Coimbatore local DTCP planning approval support'
    ],
    priceRange: 'Free with Build Plans',
    link: '/booking',
    buttonText: 'Schedule Consultation →'
  }
];

export const turnkeyPackages = [
  {
    id: 'standard',
    title: 'Standard Package',
    tag: 'ECONOMY & RELIABLE',
    isPopular: false,
    rate: '₹1,750',
    unit: '/ Sq.Ft',
    description: 'Ideal for budget-conscious independent houses and rental units without compromising structural strength.',
    features: [
      'Fe550D TMT Steel (Meenakshi / ARS)',
      'Grade 53 Cement (Dalmia / Chettinad)',
      'Country Red Bricks or Solid Concrete Blocks',
      '2x2 Vitrified Tiles (₹45/sq.ft value)',
      'Standard Teakwood Main Door Frame',
      'Asian Paints Tractor Emulsion',
      'Parryware Sanitaryware & CP Fittings',
      '5-Year Structural Stability Guarantee'
    ],
    buttonText: 'Select Standard Plan →',
    link: '/booking?plan=standard'
  },
  {
    id: 'premium',
    title: 'Premium Package',
    tag: '⭐ MOST POPULAR',
    isPopular: true,
    rate: '₹2,150',
    unit: '/ Sq.Ft',
    description: 'Our best-selling choice for luxury family homes with designer fittings, granite flooring, and modular wiring.',
    features: [
      'Tata Tiscon / JSW Neosteel TMT Steel',
      'Ultratech / Ramco Supergrade 53 Cement',
      'Wire-Cut Kiln Burnt Red Bricks',
      '4x2 Double Charged Vitrified Tiles & Granite',
      '1st Quality Teakwood Entrance Door & Pooja Room',
      'Asian Paints Apex Weatherproof Exterior',
      'Jaquar / Kohler Concealed Plumbing & Fittings',
      '10-Year Full Structural Stability Warranty'
    ],
    buttonText: 'Select Premium Plan →',
    link: '/booking?plan=premium'
  },
  {
    id: 'luxury',
    title: 'Architectural Luxury',
    tag: 'LUXURY VILLA',
    isPopular: false,
    rate: '₹2,650',
    unit: '/ Sq.Ft',
    description: 'Bespoke architectural execution with Italian marble, customized elevation, smart home automation, and landscaping.',
    features: [
      'Tata Tiscon Super Ductile SD TMT Steel',
      'Coromandel / Ultratech Premium Cement',
      'Flyash Thermal AAC Lightweight Blocks',
      'Italian Marble Flooring & Hardwood Decks',
      'Complete Burma Teak Woodwork',
      'Asian Paints Royale Luxury Interior Finishes',
      'Grohe / Toto Concealed Wall-Hung Fixtures',
      '15-Year Comprehensive Structural Guarantee'
    ],
    buttonText: 'Select Luxury Plan →',
    link: '/booking?plan=luxury'
  }
];

export const masterMasonsData = [
  {
    id: 'mistri',
    roleKey: 'mistri',
    name: 'Master Mason / Lead Mistri',
    avatar: '👷',
    spec: 'Structural Layout & Brick Alignment',
    description: '12+ years experience in foundational layout, level-checking, beam centering, and supervising on-site masons.',
    rate: '₹1,100 / Day',
    bookingLink: '/booking?type=mason&role=mistri',
    buttonText: 'Hire Mistri'
  },
  {
    id: 'brick-mason',
    roleKey: 'brick-mason',
    name: 'Stone & Brick Mason',
    avatar: '🧱',
    spec: 'Red Brick, Flyash & AAC Blocks',
    description: 'Expert in precision Flemish and English bond brickwork, joint mortar consistency, and plumb-line accuracy.',
    rate: '₹950 / Day',
    bookingLink: '/booking?type=mason&role=brick-mason',
    buttonText: 'Hire Mason'
  },
  {
    id: 'plasterer',
    roleKey: 'plasterer',
    name: 'Plastering & Stucco Specialist',
    avatar: '🎨',
    spec: 'Internal / External Sponge & POP',
    description: 'Smooth interior wall plastering, ceiling finish, exterior waterproof rendering, and crack-preventive mesh laying.',
    rate: '₹1,000 / Day',
    bookingLink: '/booking?type=mason&role=plasterer',
    buttonText: 'Hire Specialist'
  },
  {
    id: 'tiler',
    roleKey: 'tiler',
    name: 'Tile & Granite Cladding Expert',
    avatar: '📐',
    spec: 'Large Format Porcelain & Marble',
    description: 'Zero-lip tile leveling, epoxy grouting, kitchen granite counter cutting, and bathroom slope waterproofing.',
    rate: '₹1,150 / Day',
    bookingLink: '/booking?type=mason&role=tiler',
    buttonText: 'Hire Tiler'
  },
  {
    id: 'barbender',
    roleKey: 'barbender',
    name: 'RCC Barbender & Shuttering Tech',
    avatar: '⚡',
    spec: 'Steel Reinforcement & Formwork',
    description: 'Column ring binding, footing mesh fabrication, beam cage assembly, and waterproof ply centering.',
    rate: '₹900 / Day',
    bookingLink: '/booking?type=mason&role=barbender',
    buttonText: 'Hire Barbender'
  },
  {
    id: 'helper',
    roleKey: 'helper',
    name: 'Helper / Construction Labor',
    avatar: '🪣',
    spec: 'Mortar Mixing, Curing & Hauling',
    description: 'Dedicated labor for cement mixing, brick wetting, site material handling, and daily curing management.',
    rate: '₹650 / Day',
    bookingLink: '/booking?type=mason&role=helper',
    buttonText: 'Hire Helper'
  }
];
