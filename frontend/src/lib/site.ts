// -----------------------------------------------------------------------
// Central site configuration: identity, navigation (NACTVET-style mega
// menu), quick links and footer. Editing this file re-shapes the whole nav.
// -----------------------------------------------------------------------

export const site = {
  name: "TIRDO",
  longName: "Tanzania Industrial Research and Development Organization",
  tagline: "Industrial Research for National Development",
  established: "Established by Act of Parliament No. 5 of 1979",
  address: "Kimweri Avenue, Msasani, TIRDO Complex, P.O. Box 23235, Dar es Salaam, Tanzania",
  phone: "+255 22 2666034 / +255 22 2668822",
  email: "info@tirdo.or.tz",
  social: {
    facebook: "https://facebook.com/tirdo",
    twitter: "https://twitter.com/tirdo",
    instagram: "https://instagram.com/tirdo",
    linkedin: "https://linkedin.com/company/tirdo",
    youtube: "https://youtube.com/@tirdo",
  },
};

export type NavChild = { title: string; href: string; description?: string };
export type NavItem = {
  title: string;
  href: string;
  children?: NavChild[];
  columns?: { heading: string; items: NavChild[] }[];
};

// Primary navigation with mega-menu columns (NACTVET information architecture,
// TIRDO content).
export const mainNav: NavItem[] = [
  { title: "Home", href: "/" },
  {
    title: "About Us",
    href: "/about",
    children: [
      { title: "Mission & Vision", href: "/about/mission-vision" },
      { title: "Organization Structure", href: "/about/structure" },
      { title: "Board of Directors", href: "/about/board" },
      { title: "Administration", href: "/about/administration" },
      { title: "Success Stories", href: "/about/success-stories" },
      { title: "COMSATS Centre", href: "/about/comsats" },
    ],
  },
  {
    title: "Departments",
    href: "/departments",
    columns: [
      {
        heading: "Industry & Research",
        items: [
          { title: "Environment", href: "/departments/environment" },
          { title: "Food & Biotechnology", href: "/departments/food-biotechnology" },
          { title: "Industrial Chemistry", href: "/departments/industrial-chemistry" },
        ],
      },
      {
        heading: "Engineering Development",
        items: [
          { title: "Energy", href: "/departments/energy" },
          { title: "Material Science & Technology", href: "/departments/materials" },
          { title: "Textile & Leather", href: "/departments/textile-leather" },
        ],
      },
      {
        heading: "ICT & Technology Development",
        items: [
          { title: "ICT", href: "/departments/ict" },
          { title: "Instrumentation", href: "/departments/instrumentation" },
          { title: "Technology Transfer", href: "/departments/technology-transfer" },
        ],
      },
    ],
  },
  {
    title: "Services",
    href: "/services",
    children: [
      { title: "Contract Research", href: "/services/research" },
      { title: "Energy Auditing", href: "/services/energy-auditing" },
      { title: "Feasibility Studies", href: "/services/feasibility-studies" },
      { title: "Consultancy", href: "/services/consultancy" },
      { title: "Laboratory & Testing", href: "/services/laboratory" },
      { title: "Training", href: "/services/training" },
    ],
  },
  {
    title: "Research & Innovation",
    href: "/projects",
    children: [
      { title: "Ongoing Projects", href: "/projects" },
      { title: "T-Hub Innovation", href: "/t-hub" },
      { title: "Research Products", href: "/projects#products" },
      { title: "Publications", href: "/publications" },
    ],
  },
  {
    title: "Media",
    href: "/news",
    children: [
      { title: "News & Announcements", href: "/news" },
      { title: "Events", href: "/events" },
      { title: "Gallery", href: "/gallery" },
      { title: "Downloads", href: "/publications" },
    ],
  },
  {
    title: "e-Services",
    href: "/e-services",
    children: [
      { title: "Industrial Information Centre", href: "/e-services#iic" },
      { title: "Client Portal", href: "/e-services#portal" },
      { title: "Staff e-Office", href: "/e-services#eoffice" },
    ],
  },
  { title: "Contact", href: "/contact" },
];

// Coloured quick-access cards under the hero (NACTVET pattern).
export const quickAccess = [
  { title: "Contract Research", href: "/services/research", icon: "FlaskConical" },
  { title: "Publications", href: "/publications", icon: "BookOpen" },
  { title: "Energy Auditing", href: "/services/energy-auditing", icon: "Zap" },
  { title: "T-Hub Innovation", href: "/t-hub", icon: "Rocket" },
  { title: "e-Services", href: "/e-services", icon: "MonitorSmartphone" },
  { title: "Careers", href: "/careers", icon: "Briefcase" },
];

export const footerLinks = {
  quick: [
    { title: "About TIRDO", href: "/about" },
    { title: "Departments", href: "/departments" },
    { title: "Services", href: "/services" },
    { title: "Publications", href: "/publications" },
    { title: "News & Events", href: "/news" },
    { title: "Careers", href: "/careers" },
  ],
  related: [
    { title: "Ministry of Investment, Industry & Trade", href: "https://www.viwanda.go.tz" },
    { title: "COSTECH", href: "https://www.costech.or.tz" },
    { title: "Confederation of Tanzania Industries (CTI)", href: "https://www.cti.co.tz" },
    { title: "Tanzania Investment Centre", href: "https://www.tic.go.tz" },
    { title: "COMSATS", href: "https://comsats.org" },
  ],
  eservices: [
    { title: "Staff Email", href: "/e-services#eoffice" },
    { title: "e-Office", href: "/e-services#eoffice" },
    { title: "Client Portal", href: "/e-services#portal" },
    { title: "Tenders", href: "/tenders" },
  ],
};
