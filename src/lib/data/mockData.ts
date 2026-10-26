export interface Service {
  id: string
  slug: string
  title: string
  subtitle: string
  summary: string
  description: string
  priceFrom: number
  durationMin: number
  imagePath: string
  features: string[]
  published: boolean
  sortOrder: number
}

export interface TeamMember {
  id: string
  name: string
  title: string
  role: string
  bio: string
  education: string
  photoPath: string
  specialties: string[]
  published: boolean
  sortOrder: number
}

export interface GalleryCase {
  id: string
  title: string
  treatment: string
  duration: string
  doctor: string
  beforePath: string
  afterPath: string
  description: string
  category: 'Veneers' | 'Implants' | 'Invisalign' | 'Whitening'
  published: boolean
}

export interface Review {
  id: string
  author: string
  rating: number
  body: string
  treatment: string
  date: string
  verified: boolean
  published: boolean
}

export interface Appointment {
  id: string
  patientName: string
  patientPhone: string
  patientEmail: string
  serviceId: string
  serviceName: string
  doctor: string
  requestedAt: string
  timeSlot: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  message?: string
  source: string
  createdAt: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  author: string
  readTime: string
  category: string
  coverPath: string
  publishedAt: string
}

export const CLINIC_SERVICES: Service[] = [
  {
    id: "srv-01",
    slug: "porcelain-veneers",
    title: "Porcelain Veneers & Smile Design",
    subtitle: "Artisan Ceramic Sculpting",
    summary: "Hand-layered feldspathic porcelain laminates calibrated for micro-translucency and organic light reflection.",
    description: "Our bespoke smile design combines 3D facial biometric scans with artisanal master ceramist craftsmanship. Ultra-thin porcelain veneers conserve your natural tooth structure while perfecting contour, shade balance, and proportion.",
    priceFrom: 1450,
    durationMin: 90,
    imagePath: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Custom 3D Digital Smile Design Simulation",
      "Minimal or zero tooth reduction protocol",
      "Master ceramist handmade layering",
      "Stain-resistant high durability bond",
      "10-Year Clinical Warranty"
    ],
    published: true,
    sortOrder: 1
  },
  {
    id: "srv-02",
    slug: "dental-implants",
    title: "Guided Dental Implants",
    subtitle: "Permanent Bio-Integrated Restorations",
    summary: "Computer-guided titanium & zirconia fixture placement for seamless masticatory function and bone preservation.",
    description: "Replace lost teeth with lifetime titanium or ceramic implants positioned using sub-millimeter surgical guides. Experience zero downtime, immediate loading options, and restoration indistinguishable from natural dentition.",
    priceFrom: 2200,
    durationMin: 75,
    imagePath: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80",
    features: [
      "CBCT 3D Cone Beam Computed Tomography",
      "CAD/CAM surgical precision guide",
      "Swiss Grade-4 biocompatible titanium",
      "Immediate temporary crown installation",
      "Lifetime osseointegration guarantee"
    ],
    published: true,
    sortOrder: 2
  },
  {
    id: "srv-03",
    slug: "invisalign-aligners",
    title: "Invisalign® Clear Orthodontics",
    subtitle: "Discreet Precision Realignment",
    summary: "Transparent medical-grade aligners mapped with smart-force algorithms to align smiles comfortably.",
    description: "Align your smile without brackets or metallic archwires. Using iTero 5D digital impression scanners, each set of aligners applies calibrated gentle vectors for accelerated and discreet orthodontic transformation.",
    priceFrom: 3100,
    durationMin: 45,
    imagePath: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
    features: [
      "iTero Element 5D digital scan (no putty)",
      "Outcome Simulator preview in 3 minutes",
      "SmartTrack® patented material for comfort",
      "Removable for dining and effortless hygiene",
      "Virtual weekly monitoring option"
    ],
    published: true,
    sortOrder: 3
  },
  {
    id: "srv-04",
    slug: "laser-whitening",
    title: "Atelier Laser Teeth Whitening",
    subtitle: "Enamel-Safe Brightening",
    summary: "Cold-light photo-activation formula that lifts internal chromophores without thermal dentin sensitivity.",
    description: "Awaken your smile's pristine luminescence. Our clinical laser-activated procedure lifts wine, coffee, and age pigmentation by up to 8 shades in a single relaxing 60-minute session equipped with desensitizing minerals.",
    priceFrom: 480,
    durationMin: 60,
    imagePath: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Up to 8 shades whiter in 60 minutes",
      "Zero heat diode wavelength illumination",
      "Potassium nitrate desensitization shield",
      "Includes tailored take-home maintenance kit",
      "Enamel remineralization paste finish"
    ],
    published: true,
    sortOrder: 4
  },
  {
    id: "srv-05",
    slug: "biological-periodontics",
    title: "Bio-Regenerative Periodontics",
    subtitle: "Cellular Gum Longevity",
    summary: "Ultrasonic piezo therapy and platelet-rich fibrin to reverse inflammation and sculpt harmonious gum contours.",
    description: "A healthy foundation makes an iconic smile. We employ microscopic deep scaling and guided tissue regeneration to preserve bone integrity, eliminate pockets, and balance your gum-to-tooth ratio.",
    priceFrom: 650,
    durationMin: 60,
    imagePath: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Microscopic gentle ultrasonic scaling",
      "PRP / PRF biological healing factors",
      "Aesthetic gum depigmentation and contouring",
      "Microbial microbiome DNA assessment",
      "Comfort nitrous oxide sedation available"
    ],
    published: true,
    sortOrder: 5
  },
  {
    id: "srv-06",
    slug: "full-mouth-reconstruction",
    title: "Full Mouth Architectural Rehabilitation",
    subtitle: "Neuromuscular Smile Mastery",
    summary: "Comprehensive restoration of bite biomechanics, TMJ alignment, and full arch aesthetics.",
    description: "Engineered for complex wear, trauma, or collapsed occlusions. We re-establish proper jaw kinematics, muscular relaxation, and breathtaking facial aesthetics through a unified multidisciplinary approach.",
    priceFrom: 6800,
    durationMin: 120,
    imagePath: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Comprehensive TMJ joint & kinesiograph analysis",
      "Full digital occlusal wax-up",
      "Precision porcelain crowns and onlays",
      "Postural and facial profile harmonic balance",
      "Phased multi-visit bespoke protocol"
    ],
    published: true,
    sortOrder: 6
  }
]

export const CLINIC_TEAM: TeamMember[] = [
  {
    id: "doc-01",
    name: "Dr. Osman Ratib, DDS, FICOI",
    title: "Founder & Lead Aesthetic Surgeon",
    role: "Cosmetic & Implant Reconstruction Specialist",
    bio: "Pioneering the intersection of quiet luxury and clinical mastery for over 16 years. Dr. Ratib holds fellowships with the International Congress of Oral Implantologists and has lectured internationally on biomimetic ceramic restorations.",
    education: "Columbia University College of Dental Medicine | Harvard Implantology Fellowship",
    photoPath: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
    specialties: ["Veneer Architecture", "Computer-Guided Implants", "Smile Kinematics"],
    published: true,
    sortOrder: 1
  },
  {
    id: "doc-02",
    name: "Dr. Eleanor Vance, DMD, MS",
    title: "Director of Orthodontics",
    role: "Invisalign® Diamond Plus Provider",
    bio: "Dr. Vance transforms complex malocclusions with algorithmic elegance. Known for her gentle demeanor and mathematical eye for facial symmetry, she designs orthodontic plans that accentuate cheekbone structure and lip support.",
    education: "University of Pennsylvania School of Dental Medicine | MS in Orthodontics",
    photoPath: "https://images.unsplash.com/photo-1594824813637-27e1f13b1f13?auto=format&fit=crop&w=800&q=80",
    specialties: ["Clear Aligner Therapy", "Accelerated Orthodontics", "Interceptive Smiles"],
    published: true,
    sortOrder: 2
  },
  {
    id: "doc-03",
    name: "Dr. Julian Thorne, BDS, MSc",
    title: "Endodontic & Micro-Surgical Specialist",
    role: "Painless Microscopic Specialist",
    bio: "Dedicated to saving natural dentition using high-magnification surgical operating microscopes. Dr. Thorne turns traditionally feared procedures into soothing, pain-free clinical experiences.",
    education: "King's College London Dental Institute | Eastman Dental Hospital Residency",
    photoPath: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80",
    specialties: ["Microscopic Endodontics", "Regenerative Pulpal Therapy", "Painless Techniques"],
    published: true,
    sortOrder: 3
  },
  {
    id: "doc-04",
    name: "Dr. Sophia Sterling, DDS",
    title: "Head of Preventive & Bio-Aesthetics",
    role: "Holistic Oral Health Strategist",
    bio: "Dr. Sterling champions preventive wellness and microbiome restoration, integrating non-toxic biological protocols with laser tissue therapy to ensure smiles thrive for decades.",
    education: "UCLA School of Dentistry | Master of Oral Biology",
    photoPath: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
    specialties: ["Laser Periodontics", "Biological Dentistry", "Air-Flow Polishing"],
    published: true,
    sortOrder: 4
  }
]

export const GALLERY_CASES: GalleryCase[] = [
  {
    id: "case-01",
    title: "Upper Arch Feldspathic Veneers",
    treatment: "10 Hand-Layered Porcelain Veneers",
    duration: "2 Sessions (3 Weeks)",
    doctor: "Dr. Osman Ratib",
    beforePath: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=900&q=80",
    afterPath: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=900&q=80",
    description: "Restored worn incisal edges, addressed tetracycline discoloration, and perfected the natural buccal corridor curve.",
    category: "Veneers",
    published: true
  },
  {
    id: "case-02",
    title: "Comprehensive Anterior Realignment",
    treatment: "Invisalign® SmartTrack + Edge Bonding",
    duration: "7 Months",
    doctor: "Dr. Eleanor Vance",
    beforePath: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80",
    afterPath: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80",
    description: "Corrected severe anterior crowding, leveled the occlusal plane, and preserved natural enamel through micro-composite contouring.",
    category: "Invisalign",
    published: true
  },
  {
    id: "case-03",
    title: "Guided Dual Central Implants",
    treatment: "Bio-Titanium Implants with Zirconia Abutments",
    duration: "4 Months",
    doctor: "Dr. Osman Ratib",
    beforePath: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80",
    afterPath: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=900&q=80",
    description: "Replaced traumatically lost central incisors with computer-guided surgical implants and harmonious soft tissue emergence.",
    category: "Implants",
    published: true
  },
  {
    id: "case-04",
    title: "Cold-Light Diode Laser Rejuvenation",
    treatment: "Atelier Triple-Cycle Whitening",
    duration: "60 Minutes",
    doctor: "Dr. Sophia Sterling",
    beforePath: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=900&q=80",
    afterPath: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=900&q=80",
    description: "Neutralized 7 shades of extrinsic staining from coffee and vintage wine without producing tooth sensitivity.",
    category: "Whitening",
    published: true
  }
]

export const CLINIC_REVIEWS: Review[] = [
  {
    id: "rev-01",
    author: "Charlotte Montgomery",
    rating: 5,
    treatment: "Full Veneer Suite",
    date: "October 14, 2026",
    body: "Walking into DentaCare feels more like entering a serene private club than a clinic. Dr. Ratib is an absolute artist; his attention to light reflection and tooth texture gave me a smile that looks breathtakingly organic.",
    verified: true,
    published: true
  },
  {
    id: "rev-02",
    author: "Harrison Blake",
    rating: 5,
    treatment: "Guided Dental Implant",
    date: "September 28, 2026",
    body: "I delayed implant surgery for 3 years out of fear. From the 3D surgical guide planning to the day of placement, there was zero pain. The team's clinical calm and concierge care were exceptional.",
    verified: true,
    published: true
  },
  {
    id: "rev-03",
    author: "Genevieve Moreau",
    rating: 5,
    treatment: "Invisalign® Alignment",
    date: "August 19, 2026",
    body: "Dr. Vance's custom aligner schedule shifted my crossbite in under eight months. The digital scans replaced terrible impressions, and the clinic atmosphere is unhurried and pristine.",
    verified: true,
    published: true
  },
  {
    id: "rev-04",
    author: "Julian Davies",
    rating: 5,
    treatment: "Laser Whitening & Hygiene",
    date: "October 21, 2026",
    body: "The noise-cancelling headphones, warm aromatherapy, and gentle ultrasonic cleaning turned dental hygiene into an hour of absolute tranquility. My teeth are 7 shades brighter with zero sensitivity.",
    verified: true,
    published: true
  }
]

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "post-01",
    slug: "biomimetic-dentistry-explained",
    title: "The Biomimetic Principle: Why Less Tooth Removal Yields Forever Results",
    excerpt: "Exploring the revolutionary science of biological tooth conservation over aggressive traditional crowns.",
    body: "Traditional restorative dentistry often sacrificed healthy tooth enamel to place full-coverage crowns. Biomimetic dentistry honors natural dental biomechanics by treating only damaged tissue with ultra-durable adhesive protocols.",
    author: "Dr. Osman Ratib",
    readTime: "5 min read",
    category: "Science & Craft",
    coverPath: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-10-18T09:00:00Z"
  },
  {
    id: "post-02",
    slug: "modern-smile-design-process",
    title: "Curating Quiet Luxury: The Anatomy of a Custom Smile Design",
    excerpt: "How facial symmetry, phonetics, and optical light permeability dictate timeless cosmetic dentistry.",
    body: "A genuinely luxurious smile never shouts; it quietly elevates the entire face. We explore how micro-texturing, translucency gradients, and incisal edge curvature create restorations that fool even dental professionals.",
    author: "Dr. Eleanor Vance",
    readTime: "4 min read",
    category: "Aesthetics",
    coverPath: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-10-04T11:30:00Z"
  },
  {
    id: "post-03",
    slug: "oral-microbiome-longevity",
    title: "Beyond Brushing: Safeguarding Your Vascular Health via the Oral Microbiome",
    excerpt: "Emerging cardiovascular and cognitive research linking periodontal cellular health to systemic longevity.",
    body: "Your gums are the gateway to your systemic circulatory health. Learn why targeted probiotic rinsing, guided airflow polishing, and pH balancing are modern longevity essentials.",
    author: "Dr. Sophia Sterling",
    readTime: "6 min read",
    category: "Wellness",
    coverPath: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-09-22T14:15:00Z"
  }
]

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-101",
    patientName: "Victoria Sterling",
    patientPhone: "+1 (555) 234-8901",
    patientEmail: "victoria@sterlingholdings.com",
    serviceId: "srv-01",
    serviceName: "Porcelain Veneers & Smile Design",
    doctor: "Dr. Osman Ratib",
    requestedAt: "2026-10-28T10:00:00Z",
    timeSlot: "10:00 AM - 11:30 AM",
    status: "confirmed",
    message: "Interested in upper 8 veneers consultation and 3D preview.",
    source: "website",
    createdAt: "2026-10-25T14:20:00Z"
  },
  {
    id: "apt-102",
    patientName: "Marcus Vance",
    patientPhone: "+1 (555) 890-4321",
    patientEmail: "marcus.vance@techcorp.io",
    serviceId: "srv-02",
    serviceName: "Guided Dental Implants",
    doctor: "Dr. Osman Ratib",
    requestedAt: "2026-10-28T14:00:00Z",
    timeSlot: "02:00 PM - 03:15 PM",
    status: "pending",
    message: "Second opinion on molar replacement options and CBCT scan.",
    source: "website",
    createdAt: "2026-10-26T08:15:00Z"
  },
  {
    id: "apt-103",
    patientName: "Sophia Lin",
    patientPhone: "+1 (555) 765-1234",
    patientEmail: "sophia.lin@designstudio.ny",
    serviceId: "srv-03",
    serviceName: "Invisalign® Clear Orthodontics",
    doctor: "Dr. Eleanor Vance",
    requestedAt: "2026-10-29T11:30:00Z",
    timeSlot: "11:30 AM - 12:15 PM",
    status: "confirmed",
    message: "Would like to see the iTero 5D 3-minute outcome preview.",
    source: "website",
    createdAt: "2026-10-25T19:40:00Z"
  },
  {
    id: "apt-104",
    patientName: "Alexander Hayes",
    patientPhone: "+1 (555) 345-9876",
    patientEmail: "a.hayes@hayescapital.com",
    serviceId: "srv-04",
    serviceName: "Atelier Laser Teeth Whitening",
    doctor: "Dr. Sophia Sterling",
    requestedAt: "2026-10-27T16:00:00Z",
    timeSlot: "04:00 PM - 05:00 PM",
    status: "pending",
    message: "Pre-wedding whitening session for next month.",
    source: "website",
    createdAt: "2026-10-26T11:05:00Z"
  },
  {
    id: "apt-105",
    patientName: "Elena Rostova",
    patientPhone: "+1 (555) 678-2345",
    patientEmail: "elena.r@architects.eu",
    serviceId: "srv-05",
    serviceName: "Bio-Regenerative Periodontics",
    doctor: "Dr. Sophia Sterling",
    requestedAt: "2026-10-24T09:00:00Z",
    timeSlot: "09:00 AM - 10:00 AM",
    status: "completed",
    message: "Routine periodontal maintenance and airflow polish.",
    source: "website",
    createdAt: "2026-10-20T10:11:00Z"
  }
]

export const CLINIC_STATS = {
  yearsExperience: "18+",
  restoredSmiles: "15,000+",
  patientSatisfaction: "99.4%",
  clinicalRating: "4.98★",
  totalTreatmentsCompleted: 24800,
  monthlyBookings: 142,
  mfaStatus: "Enforced (AAL2)",
  ownerEmail: "osmanratib14@gmail.com"
}
