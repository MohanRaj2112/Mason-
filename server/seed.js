const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Admin = require('./models/Admin');
const Service = require('./models/Service');
const Project = require('./models/Project');
const Tool = require('./models/Tool');
const Booking = require('./models/Booking');
const Transaction = require('./models/Transaction');
const Estimate = require('./models/Estimate');
const Contact = require('./models/Contact');
const Review = require('./models/Review');

const initialServices = [
    {
        serviceId: 'turnkey-construction',
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
        buttonText: 'Get Construction Quote →',
        status: 'Active'
    },
    {
        serviceId: 'master-masons',
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
        buttonText: 'Hire Certified Masons →',
        status: 'Active'
    },
    {
        serviceId: 'tool-rentals',
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
        buttonText: 'Explore Rental Catalog →',
        status: 'Active'
    },
    {
        serviceId: 'renovation-remodeling',
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
        buttonText: 'Book Remodeling Visit →',
        status: 'Active'
    },
    {
        serviceId: 'plumbing-electrical',
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
        buttonText: 'Book Technical Team →',
        status: 'Active'
    },
    {
        serviceId: 'architectural-design',
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
        buttonText: 'Schedule Consultation →',
        status: 'Active'
    }
];

const initialProjects = [
    {
        projectId: 'proj-1',
        title: 'Contemporary 4BHK Duplex Villa',
        category: 'Turnkey Build',
        tag: 'Turnkey Build',
        specs: '3,200 Sq.Ft | 8 Months Build Time',
        description: '3,200 Sq.Ft luxury residence featuring earthquake-resistant framing, cantilever balconies, and rainwater harvesting cistern.',
        location: 'Fairlands, Salem',
        image: '/src/assets/images/project_luxury_villa_1790694687569.jpg',
        status: 'Completed'
    },
    {
        projectId: 'proj-2',
        title: 'G+2 Residential Apartment Complex',
        category: 'Structural RCC',
        tag: 'Structural RCC',
        specs: '5,800 Sq.Ft | 6 Months Structural Phase',
        description: 'Precision column casting, grade 53 slab reinforcement, and AAC lightweight block masonry completed in record 6 months.',
        location: 'RS Puram, Coimbatore',
        image: '/src/assets/images/hero_construction_site_1790694659406.jpg',
        status: 'Completed'
    },
    {
        projectId: 'proj-3',
        title: 'Chettinad Styled Courtyard Home',
        category: 'Heritage Masonry',
        tag: 'Heritage Masonry',
        specs: '2,600 Sq.Ft | Custom Teak & Athangudi',
        description: 'Intricate pillar installations, exposed kiln-burnt clay brick finish, and polished handmade Athangudi floor tiles.',
        location: 'Suramangalam, Salem',
        image: '/src/assets/images/service_masonry_work_1790694699452.jpg',
        status: 'Completed'
    },
    {
        projectId: 'proj-4',
        title: 'Commercial Complex Remodeling',
        category: 'Renovation',
        tag: 'Renovation',
        specs: '4,100 Sq.Ft | Structural Retrofitting',
        description: 'Reinforced beam retrofitting, double-glazed curtain wall facade masonry, and full waterproof terrace screeding.',
        location: 'Gandhipuram, Coimbatore',
        image: '/src/assets/images/footer_architecture_bg_1790694673575.jpg',
        status: 'Completed'
    },
    {
        projectId: 'proj-5',
        title: 'Sustainable 2BHK Eco Farmhouse',
        category: 'Eco-Friendly',
        tag: 'Eco-Friendly',
        specs: '1,800 Sq.Ft | Solar & Thermal Insulated',
        description: 'Hollow interlock compressed earth brickwork, solar-ready roof slab, and thermal insulated exterior lime plastering.',
        location: 'Yercaud Foothills, Salem',
        image: '/src/assets/images/project_luxury_villa_1790694687569.jpg',
        status: 'Completed'
    },
    {
        projectId: 'proj-6',
        title: 'Minimalist Lakeview Luxury Villa',
        category: 'Turnkey Luxury',
        tag: 'Turnkey Luxury',
        specs: '3,900 Sq.Ft | Italian Marble & Teak',
        description: 'Cantilevered infinity deck, Italian Statuario marble masonry, smart home conduit integration, and landscaped terrace.',
        location: 'Singanallur, Coimbatore',
        image: '/src/assets/images/equipment_rental_fleet_1790694712199.jpg',
        status: 'Completed'
    }
];

const initialTools = [
    {
        toolId: 'tool_1',
        name: 'Heavy-Duty Construction Hammer Set',
        category: 'hand-tools',
        pricePerDay: 120,
        price: 120,
        period: 'Per Day',
        icon: '🔨',
        image: '/src/assets/images/service_masonry_work_1790694699452.jpg',
        availability: true,
        available: true,
        availabilityStatus: 'Available',
        quantity: 10,
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
        description: 'Heavy-duty construction claw and sledge hammer set engineered for formwork, masonry chiseling, and structural demolition.'
    },
    {
        toolId: 'tool_2',
        name: 'Rotary Hammer Drill (SDS-Plus 800W)',
        category: 'power-tools',
        pricePerDay: 450,
        price: 450,
        period: 'Per Day',
        icon: '⚡',
        image: '/src/assets/images/equipment_rental_fleet_1790694712199.jpg',
        availability: true,
        available: true,
        availabilityStatus: 'Available',
        quantity: 5,
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
        description: 'High-impact rotary hammer drill for reinforced concrete anchoring, granite coring, and electrical wall channelling.'
    },
    {
        toolId: 'tool_3',
        name: 'Commercial Cement Mixer (200L Diesel)',
        category: 'mixing',
        pricePerDay: 850,
        price: 850,
        period: 'Per Day',
        icon: '🪣',
        image: '/src/assets/images/equipment_rental_fleet_1790694712199.jpg',
        availability: true,
        available: true,
        availabilityStatus: 'Available',
        quantity: 3,
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
        description: 'Heavy-gauge tilting drum concrete mixer for continuous RCC slab casting, foundation concrete, and mortar preparation.'
    },
    {
        toolId: 'tool_4',
        name: 'Industrial Tile, Marble & Rebar Cutting Machine',
        category: 'power-tools',
        pricePerDay: 650,
        price: 650,
        period: 'Per Day',
        icon: '⚙️',
        image: '/src/assets/images/service_masonry_work_1790694699452.jpg',
        availability: true,
        available: true,
        availabilityStatus: 'Available',
        quantity: 4,
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
        description: 'Precision wet and dry cutting machine for vitrified tiles, granite slabs, and Fe550D TMT steel reinforcement bars.'
    },
    {
        toolId: 'tool_5',
        name: 'Heavy-Duty Aluminum Extension Ladder (24 Ft)',
        category: 'roofing',
        pricePerDay: 300,
        price: 300,
        period: 'Per Day',
        icon: '🪜',
        image: '/src/assets/images/hero_construction_site_1790694659406.jpg',
        availability: true,
        available: true,
        availabilityStatus: 'Available',
        quantity: 6,
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
        description: 'Industrial dual-section extension ladder with slip-resistant D-rungs for exterior painting, plastering, and electrical work.'
    },
    {
        toolId: 'tool_6',
        name: 'Tempered Steel Shovel & Excavation Spade Kit',
        category: 'hand-tools',
        pricePerDay: 100,
        price: 100,
        period: 'Per Day',
        icon: '⛏️',
        image: '/src/assets/images/hero_construction_site_1790694659406.jpg',
        availability: true,
        available: true,
        availabilityStatus: 'Available',
        quantity: 12,
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
        description: 'Heavy-duty square and round-mouth construction shovels for sand aggregate mixing, trenching, and foundation earthwork.'
    },
    {
        toolId: 'tool_7',
        name: 'Heavy-Duty Steel Construction Wheelbarrow',
        category: 'hand-tools',
        pricePerDay: 200,
        price: 200,
        period: 'Per Day',
        icon: '🛒',
        image: '/src/assets/images/equipment_rental_fleet_1790694712199.jpg',
        availability: true,
        available: true,
        availabilityStatus: 'Available',
        quantity: 8,
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
        description: 'Balanced single-wheel contractor barrow for effortless on-site transport of wet concrete, bricks, and debris.'
    },
    {
        toolId: 'tool_8',
        name: 'Laser Distance Meter & Spirit Level Kit',
        category: 'measuring',
        pricePerDay: 350,
        price: 350,
        period: 'Per Day',
        icon: '📐',
        image: '/src/assets/images/footer_architecture_bg_1790694673575.jpg',
        availability: true,
        available: true,
        availabilityStatus: 'Available',
        quantity: 4,
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
        description: 'Complete civil engineering layout and leveling kit for column alignment, floor slope checks, and boundary measurement.'
    },
    {
        toolId: 'tool_9',
        name: 'ISI Safety Helmet, Boots & Full Body Harness Kit',
        category: 'safety',
        pricePerDay: 180,
        price: 180,
        period: 'Per Day',
        icon: '🦺',
        image: '/src/assets/images/hero_construction_site_1790694659406.jpg',
        availability: true,
        available: true,
        availabilityStatus: 'Available',
        quantity: 15,
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
        description: 'Certified site safety PPE kit engineered for high-elevation scaffolding, roofing, and structural erection teams.'
    },
    {
        toolId: 'tool_10',
        name: 'Roofing Sheet Crimper & Tubular Scaffolding Set',
        category: 'roofing',
        pricePerDay: 600,
        price: 600,
        period: 'Per Day',
        icon: '🏗️',
        image: '/src/assets/images/hero_construction_site_1790694659406.jpg',
        availability: true,
        available: true,
        availabilityStatus: 'Available',
        quantity: 6,
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
        description: 'Complete roofing and elevation work package including modular steel scaffolding frames and truss fastener tools.'
    },
    {
        toolId: 'tool_11',
        name: 'Vibratory Concrete Needle Compactor (2HP)',
        category: 'mixing',
        pricePerDay: 500,
        price: 500,
        period: 'Per Day',
        icon: '⚡',
        image: '/src/assets/images/equipment_rental_fleet_1790694712199.jpg',
        availability: true,
        available: true,
        availabilityStatus: 'Available',
        quantity: 4,
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
        description: 'Essential RCC concrete vibrator for eliminating honeycombing and air pockets during column, beam, and slab pouring.'
    },
    {
        toolId: 'tool_12',
        name: 'Submersible Sludge De-Watering Pump (3HP)',
        category: 'plumbing',
        pricePerDay: 550,
        price: 550,
        period: 'Per Day',
        icon: '🔧',
        image: '/src/assets/images/footer_architecture_bg_1790694673575.jpg',
        availability: true,
        available: true,
        availabilityStatus: 'Available',
        quantity: 3,
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
        description: 'High-discharge submersible pump for rapid de-watering of waterlogged foundation pits, sumps, and basement excavations.'
    }
];

const initialBookings = [
    {
        bookingId: 'MM-883921',
        userId: 'USER001',
        customerName: 'Santhosh Kumar',
        phone: '+91 9159687408',
        email: 'santhosh@example.com',
        bookingType: 'construction',
        service: 'Turnkey House Construction',
        startDate: '2026-08-20',
        duration: '6-9 Months',
        workers: 4,
        paymentMode: 'Google Pay',
        paymentMethod: 'Google Pay',
        paymentStatus: 'Paid',
        transactionId: 'TXN-908412',
        paymentOrderId: 'ORD-883921',
        amount: 5000,
        estimatedAmount: 5000,
        status: 'Confirmed',
        location: 'Fairlands, Salem',
        notes: '2400 sq.ft residential villa foundation stage mobilization.'
    },
    {
        bookingId: 'MM-491024',
        userId: 'USER-1002',
        customerName: 'Priya Rajan',
        phone: '+91 9840123456',
        email: 'priya.r@gmail.com',
        bookingType: 'construction',
        service: 'Renovation & Remodeling',
        startDate: '2026-08-25',
        duration: '1-3 Months',
        workers: 2,
        paymentMode: 'Paytm',
        paymentMethod: 'Paytm',
        paymentStatus: 'Pending',
        transactionId: 'TXN-749201',
        paymentOrderId: 'ORD-491024',
        amount: 3500,
        estimatedAmount: 3500,
        status: 'Pending',
        location: 'RS Puram, Coimbatore',
        notes: 'Kitchen & living room structural remodeling.'
    },
    {
        bookingId: 'MM-310948',
        userId: 'USER-1003',
        customerName: 'Karthik Raja',
        phone: '+91 9443210987',
        email: 'karthik.raja@outlook.com',
        bookingType: 'tool_rental',
        service: 'Tool Rental: Rotary Hammer Drill (SDS-Plus 800W)',
        tool: 'Rotary Hammer Drill (SDS-Plus 800W)',
        startDate: '2026-08-18',
        duration: '3 Days',
        workers: 1,
        paymentMode: 'UPI',
        paymentMethod: 'UPI',
        paymentStatus: 'Paid',
        transactionId: 'TXN-652390',
        paymentOrderId: 'ORD-310948',
        amount: 1350,
        estimatedAmount: 1350,
        status: 'Active',
        location: 'Suramangalam, Salem',
        notes: 'Rotary hammer drill rental for 3 days.'
    },
    {
        bookingId: 'MM-209412',
        userId: 'USER-1004',
        customerName: 'Anand Sundaram',
        phone: '+91 9789012345',
        email: 'anand.s@yahoo.com',
        bookingType: 'construction',
        service: 'Hire Master Masons & Specialists',
        startDate: '2026-08-15',
        duration: '3 Days',
        workers: 2,
        paymentMode: 'Google Pay',
        paymentMethod: 'Google Pay',
        paymentStatus: 'Paid',
        transactionId: 'TXN-512094',
        paymentOrderId: 'ORD-209412',
        amount: 5700,
        estimatedAmount: 5700,
        status: 'Completed',
        location: 'Gandhipuram, Coimbatore',
        notes: 'Compound wall & brick partition masonry.'
    }
];

const initialTransactions = [
    {
        transactionId: 'TXN-908412',
        orderId: 'ORD-883921',
        bookingId: 'MM-883921',
        customerName: 'Santhosh Kumar',
        phone: '+91 9159687408',
        email: 'santhosh@example.com',
        service: 'Turnkey House Construction',
        amount: 5000,
        currency: 'INR',
        paymentMethod: 'Google Pay',
        paymentStatus: 'Paid',
        gatewayReference: 'GPAY-UTR-623098114',
        signatureVerified: true,
        createdAt: new Date('2026-08-20T10:15:00Z')
    },
    {
        transactionId: 'TXN-749201',
        orderId: 'ORD-491024',
        bookingId: 'MM-491024',
        customerName: 'Priya Rajan',
        phone: '+91 9840123456',
        email: 'priya.r@gmail.com',
        service: 'Renovation & Remodeling',
        amount: 3500,
        currency: 'INR',
        paymentMethod: 'Paytm',
        paymentStatus: 'Pending',
        gatewayReference: 'PYTM-ORD-491024',
        signatureVerified: false,
        createdAt: new Date('2026-08-25T14:20:00Z')
    },
    {
        transactionId: 'TXN-652390',
        orderId: 'ORD-310948',
        bookingId: 'MM-310948',
        customerName: 'Karthik Raja',
        phone: '+91 9443210987',
        email: 'karthik.raja@outlook.com',
        service: 'Tool Rental: Rotary Hammer Drill (SDS-Plus 800W)',
        amount: 1350,
        currency: 'INR',
        paymentMethod: 'UPI',
        paymentStatus: 'Paid',
        gatewayReference: 'UPI-UTR-819204451',
        signatureVerified: true,
        createdAt: new Date('2026-08-18T09:05:00Z')
    },
    {
        transactionId: 'TXN-512094',
        orderId: 'ORD-209412',
        bookingId: 'MM-209412',
        customerName: 'Anand Sundaram',
        phone: '+91 9789012345',
        email: 'anand.s@yahoo.com',
        service: 'Hire Master Masons & Specialists',
        amount: 5700,
        currency: 'INR',
        paymentMethod: 'Google Pay',
        paymentStatus: 'Paid',
        gatewayReference: 'GPAY-UTR-550192834',
        signatureVerified: true,
        createdAt: new Date('2026-08-15T11:30:00Z')
    }
];

const initialContacts = [
    {
        contactId: 'CNT-101',
        name: 'Venkatesh Raman',
        phone: '+91 9876543210',
        email: 'venkat.raman@gmail.com',
        service: 'Turnkey Construction',
        subject: 'Residential Villa Brochure Request',
        message: 'Looking to construct a 2200 sq.ft G+1 independent house near Salem Junction. Please provide material package brochure.',
        status: 'New'
    },
    {
        contactId: 'CNT-102',
        name: 'Saravanan M.',
        phone: '+91 9443123456',
        email: 'saravanan.m@yahoo.com',
        service: 'Tool Rentals',
        subject: 'Bulk Equipment Site Booking',
        message: 'Need 2 diesel concrete mixers and 3 needle vibrators delivered to our commercial site in Coimbatore on Monday morning.',
        status: 'Replied'
    },
    {
        contactId: 'CNT-103',
        name: 'Lakshmi Narayanan',
        phone: '+91 9841237890',
        email: 'lakshmi.n@outlook.com',
        service: 'Renovation',
        subject: 'Structural Retrofit Inspection',
        message: 'Need structural remodeling for 30-year-old ancestral house including water-proofing and tile replacement.',
        status: 'Converted'
    }
];

const initialEstimates = [
    {
        estimateId: 'EST-101',
        userId: 'USER-1001',
        customerName: 'Murugan Doss',
        phone: '+91 9123456789',
        email: 'murugan.d@gmail.com',
        projectType: 'Residential Independent Villa',
        service: 'Turnkey Construction',
        location: 'Ammapet, Salem',
        budget: '₹35 Lakhs – ₹50 Lakhs',
        duration: 'Next 1-3 Months',
        description: 'Plot area 1500 sq.ft, ground + first floor construction with car porch.',
        status: 'Pending'
    }
];

const initialReviews = [
    {
        reviewId: 'rev-1',
        name: 'Rajesh Kumar',
        loc: 'Salem',
        rating: 5,
        text: 'Mason Mate completed our 3BHK home on time in 8 months. High quality and weekly progress reports!',
        date: 'January 2026',
        status: 'Approved'
    },
    {
        reviewId: 'rev-2',
        name: 'Priya Sundar',
        loc: 'Coimbatore',
        rating: 5,
        text: 'Rented a drum cement mixer and scaffolding set. Serviced equipment and delivered right on site!',
        date: 'December 2025',
        status: 'Approved'
    },
    {
        reviewId: 'rev-3',
        name: 'Murugan Doss',
        loc: 'Salem',
        rating: 5,
        text: 'Hired 3 master masons for floor tile cladding. Punctual, polite, and skilled professionals.',
        date: 'November 2025',
        status: 'Approved'
    }
];

async function seedDatabase() {
    try {
        console.log('[Seed] Checking database collections in mason_mate...');

        // 1. Seed Admin
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
            const adminPasswordHash = await bcrypt.hash('admin123', 10);
            await Admin.create({
                adminId: 'ADMIN001',
                name: 'Administrator',
                username: 'admin',
                email: 'admin@srmakash.com',
                passwordHash: adminPasswordHash,
                role: 'admin',
                permissions: ['all']
            });
            console.log('[Seed] Default Admin account created (hashed password) ✓');
        }

        // 2. Seed Default Demo User
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            const userPasswordHash = await bcrypt.hash('user123', 10);
            await User.create({
                userId: 'USER001',
                name: 'Santhosh Kumar',
                username: 'santhosh',
                email: 'santhosh@example.com',
                phone: '9159687408',
                mobile: '9159687408',
                passwordHash: userPasswordHash,
                role: 'user'
            });
            console.log('[Seed] Default User account created (hashed password) ✓');
        }

        // 3. Seed Services
        const serviceCount = await Service.countDocuments();
        if (serviceCount === 0) {
            await Service.insertMany(initialServices);
            console.log(`[Seed] ${initialServices.length} Services seeded ✓`);
        }

        // 4. Seed Projects
        const projectCount = await Project.countDocuments();
        if (projectCount === 0) {
            await Project.insertMany(initialProjects);
            console.log(`[Seed] ${initialProjects.length} Projects seeded ✓`);
        }

        // 5. Seed Tools
        const toolCount = await Tool.countDocuments();
        if (toolCount === 0) {
            await Tool.insertMany(initialTools);
            console.log(`[Seed] ${initialTools.length} Tools seeded ✓`);
        }

        // 6. Seed Bookings
        const bookingCount = await Booking.countDocuments();
        if (bookingCount === 0) {
            await Booking.insertMany(initialBookings);
            console.log(`[Seed] ${initialBookings.length} Bookings seeded ✓`);
        }

        // 7. Seed Contacts
        const contactCount = await Contact.countDocuments();
        if (contactCount === 0) {
            await Contact.insertMany(initialContacts);
            console.log(`[Seed] ${initialContacts.length} Contacts seeded ✓`);
        }

        // 8. Seed Estimates
        const estimateCount = await Estimate.countDocuments();
        if (estimateCount === 0) {
            await Estimate.insertMany(initialEstimates);
            console.log(`[Seed] ${initialEstimates.length} Estimates seeded ✓`);
        }

        // 9. Seed Reviews
        const reviewCount = await Review.countDocuments();
        if (reviewCount === 0) {
            await Review.insertMany(initialReviews);
            console.log(`[Seed] ${initialReviews.length} Reviews seeded ✓`);
        }

        // 10. Seed Transactions
        const txCount = await Transaction.countDocuments();
        if (txCount === 0) {
            await Transaction.insertMany(initialTransactions);
            console.log(`[Seed] ${initialTransactions.length} Transactions seeded ✓`);
        }

        console.log('[Seed] Database initialization and verification complete ✓');
    } catch (err) {
        console.warn('[Seed] Notice during seed execution:', err.message);
    }
}

module.exports = {
    seedDatabase,
    initialServices,
    initialProjects,
    initialTools,
    initialBookings,
    initialTransactions,
    initialContacts,
    initialEstimates,
    initialReviews
};
