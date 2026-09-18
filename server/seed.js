const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Admin = require('./models/Admin');
const Service = require('./models/Service');
const Project = require('./models/Project');
const Tool = require('./models/Tool');
const Booking = require('./models/Booking');
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
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
        status: 'Completed'
    }
];

const initialTools = [
    {
        toolId: 'tool_1',
        name: 'Heavy-Duty Rotary Hammer Drill (SDS-Plus)',
        category: 'power-tools',
        pricePerDay: 450,
        price: 450,
        period: 'Per Day',
        icon: '🔨',
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80',
        availability: true,
        available: true,
        availabilityStatus: 'Available',
        quantity: 5,
        contactOption: 'Site Delivery',
        rating: 4.9,
        featured: true,
        specs: '800W motor, 3-mode (drilling, hammer, chiseling), SDS-Plus chuck, anti-vibration handle',
        description: 'Professional 800W rotary hammer drill with 3-mode operation for reinforced concrete, granite coring, and brick channelling.'
    },
    {
        toolId: 'tool_2',
        name: 'Commercial Cement Mixer Drum (200L Diesel)',
        category: 'mixing',
        pricePerDay: 850,
        price: 850,
        period: 'Per Day',
        icon: '🪣',
        image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=80',
        availability: true,
        available: true,
        availabilityStatus: 'Available',
        quantity: 3,
        contactOption: 'Site Delivery',
        rating: 4.8,
        featured: true,
        specs: '200 Litre batch volume, 6HP Greaves diesel engine, heavy cast-iron ring gear, towable chassis',
        description: 'Heavy gauge steel drum mixer with 6HP diesel engine, capable of continuous mortar, screed, and RCC batch mixing.'
    },
    {
        toolId: 'tool_3',
        name: 'Heavy Steel Scaffolding Set (50 Sq.Ft Unit)',
        category: 'roofing',
        pricePerDay: 600,
        price: 600,
        period: 'Per Day',
        icon: '🏗️',
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=600&q=80',
        availability: true,
        available: true,
        availabilityStatus: 'Available',
        quantity: 8,
        contactOption: 'Site Delivery',
        rating: 4.9,
        featured: true,
        specs: 'Heavy 40mm GI pipes, 4 cross braces, 2 anti-slip walking planks, 4 adjustable leveling jacks',
        description: 'Modular tubular scaffolding frames with cross-braces, joint pins, and non-slip metal walking planks for exterior plastering.'
    },
    {
        toolId: 'tool_4',
        name: 'Vibratory Concrete Needle Compactor (2HP)',
        category: 'power-tools',
        pricePerDay: 500,
        price: 500,
        period: 'Per Day',
        icon: '⚡',
        image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80',
        availability: true,
        available: true,
        availabilityStatus: 'Available',
        quantity: 4,
        contactOption: 'Site Delivery',
        rating: 4.7,
        featured: false,
        specs: '2HP 2800 RPM motor, 6-meter flexible poker hose, 35mm diameter needle head',
        description: 'High-frequency flexible poker needle vibrator for eliminating air voids during foundation, column, and roof slab RCC pouring.'
    },
    {
        toolId: 'tool_5',
        name: 'Safety Helmet & Full Body Harness Kit',
        category: 'safety',
        pricePerDay: 150,
        price: 150,
        period: 'Per Day',
        icon: '🦺',
        image: 'https://images.unsplash.com/photo-1535732820275-9ffd998cac22?auto=format&fit=crop&w=600&q=80',
        availability: true,
        available: true,
        availabilityStatus: 'Available',
        quantity: 15,
        contactOption: 'Pickup from Yard',
        rating: 5.0,
        featured: false,
        specs: 'ISI certified Class C helmet with ratchet adjust, full-body safety belt with shock lanyard, fluorescent safety vest',
        description: 'ISI marked industrial safety helmets and CE-certified fall-arrest harnesses with shock-absorbing lanyards for high-elevation works.'
    },
    {
        toolId: 'tool_6',
        name: 'High Pressure Hydraulic Pipe Bender (1/2" - 2")',
        category: 'plumbing',
        pricePerDay: 350,
        price: 350,
        period: 'Per Day',
        icon: '🔧',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
        availability: true,
        available: true,
        availabilityStatus: 'Available',
        quantity: 2,
        contactOption: 'Pickup from Yard',
        rating: 4.8,
        featured: false,
        specs: '12-Ton hydraulic ram capacity, 6 heavy-duty bending dies (1/2", 3/4", 1", 1-1/4", 1-1/2", 2")',
        description: 'Heavy-duty manual hydraulic pipe bender with 6 bending formers for clean conduit and plumbing line bends without kinking.'
    },
    {
        toolId: 'tool_7',
        name: 'Submersible Sludge De-Watering Pump (3HP)',
        category: 'plumbing',
        pricePerDay: 550,
        price: 550,
        period: 'Per Day',
        icon: '🌊',
        image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
        availability: true,
        available: true,
        availabilityStatus: 'Available',
        quantity: 3,
        contactOption: 'Site Delivery',
        rating: 4.6,
        featured: false,
        specs: '3HP 415V 3-phase motor, 500 LPM discharge rate, cast iron non-clog vortex impeller',
        description: 'Heavy-duty non-clogging submersible pump with 2-inch outlet for foundation excavation and basement rain de-watering.'
    },
    {
        toolId: 'tool_8',
        name: 'Industrial Tile & Marble Laser Cutter Table',
        category: 'power-tools',
        pricePerDay: 700,
        price: 700,
        period: 'Per Day',
        icon: '📐',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        availability: true,
        available: true,
        availabilityStatus: 'Available',
        quantity: 2,
        contactOption: 'Site Delivery',
        rating: 4.9,
        featured: true,
        specs: '1200mm cutting length, 250mm diamond blade, built-in laser guide line, submersible cooling pump',
        description: '1200mm wet tile cutting machine with diamond blade, laser alignment guide, and water circulation pump for zero-chipping tile cuts.'
    },
    {
        toolId: 'tool_9',
        name: 'Heavy-Duty 16kg Demolition Jackhammer',
        category: 'power-tools',
        pricePerDay: 650,
        price: 650,
        period: 'Per Day',
        icon: '⛏️',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        availability: true,
        available: true,
        availabilityStatus: 'Available',
        quantity: 3,
        contactOption: 'Site Delivery',
        rating: 4.9,
        featured: false,
        specs: '1800W motor, 45 Joules impact energy, HEX 30mm chuck with bull point and flat chisel bits',
        description: 'Heavy-duty 16kg demolition breaker for breaking structural RCC footings, columns, and thick tarmac with maximum impact energy.'
    }
];

const initialBookings = [
    {
        bookingId: 'MM-883921',
        userId: 'USER-1001',
        customerName: 'Santhosh Kumar',
        phone: '+91 9159687408',
        email: 'santhosh@example.com',
        bookingType: 'construction',
        service: 'Turnkey House Construction',
        startDate: '2026-08-20',
        duration: '6-9 Months',
        workers: 4,
        paymentMode: 'UPI',
        amount: 107940,
        estimatedAmount: 107940,
        status: 'Confirmed',
        location: 'Fairlands, Salem',
        notes: '2400 sq.ft residential villa foundation stage.'
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
        paymentMode: 'Card',
        amount: 99875,
        estimatedAmount: 99875,
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
        service: 'Tool & Equipment Rental',
        tool: 'Heavy-Duty Rotary Hammer Drill (SDS-Plus)',
        startDate: '2026-08-18',
        duration: '3 Days',
        workers: 1,
        paymentMode: 'Cash on Visit',
        amount: 1500,
        estimatedAmount: 1500,
        status: 'In Progress',
        location: 'Suramangalam, Salem',
        notes: 'Rotary hammer drill + needle vibrator for 3 days.'
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
    initialContacts,
    initialEstimates,
    initialReviews
};
