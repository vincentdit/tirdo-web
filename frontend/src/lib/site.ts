// -----------------------------------------------------------------------
// Central site configuration: identity, navigation (NACTVET-style mega
// menu), quick links and footer. Editing this file re-shapes the whole nav.
// -----------------------------------------------------------------------

export const site = {
  name: "TIRDO",
  longName: "Tanzania Industrial Research and Development Organization",
  tagline: "TIRDO for sustainable industrial development",
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

// Official TIRDO imagery used across the site (served from tirdo.or.tz).
// Served locally from frontend/public/media (see scripts/fetch-tirdo-assets.ps1).
export const assets = {
  emblem: "/media/brand/tz-emblem.png",
  logo: "/media/brand/logo.jpg",
  hero: "/media/carousel-items/fRbUBRaWLBHYVw8U8yG1aRENYr39KbRrvArOp5kQ.jpg",
  director: "/media/administration/director.png",
  newsFeatured: "/media/carousel-items/laX5QEVDZMj4dCwh7uxiIy1gerC4jjQOJe3myxs9.jpg",
};

// `title` is the English source text (fallback / sitemap default); `key` is the
// i18n message key (namespace-relative under "nav") the header and sitemap use
// to render translated labels. Keep both in sync when editing the nav.
export type NavChild = { title: string; key: string; href: string; description?: string };
export type NavItem = {
  title: string;
  key: string;
  href: string;
  children?: NavChild[];
  columns?: { heading: string; headingKey: string; items: NavChild[] }[];
};

// Reusable department columns (shared by "Our Work" and "Departments").
const researchCol = {
  heading: "Industrial Research",
  headingKey: "headings.industrialResearch",
  items: [
    { title: "Environmental Technology & Occupational Safety Division", key: "divisions.environment", href: "/departments/environment" },
    { title: "Food Processing & Biotechnology Division", key: "divisions.foodBiotech", href: "/departments/food-biotechnology" },
    { title: "Agro processing Industrial Chemistry Division", key: "divisions.industrialChemistry", href: "/departments/industrial-chemistry" },
  ],
};
const engineeringCol = {
  heading: "Engineering Development",
  headingKey: "headings.engineeringDevelopment",
  items: [
    { title: "Energy Technology Division", key: "divisions.energy", href: "/departments/energy" },
    { title: "Engineering Material Technology Division", key: "divisions.materials", href: "/departments/materials" },
    { title: "Textile & Leather Technologies Division", key: "divisions.textileLeather", href: "/departments/textile-leather" },
  ],
};
const ictCol = {
  heading: "ICT & Technology Development",
  headingKey: "headings.ictTech",
  items: [
    { title: "Information & Communication Technologies Division", key: "divisions.ict", href: "/departments/ict" },
    { title: "Electronics & Instrumentation Technologies Division", key: "divisions.instrumentation", href: "/departments/instrumentation" },
    { title: "Technology Transfer & Pilot Plants Division", key: "divisions.techTransfer", href: "/departments/technology-transfer" },
  ],
};

// Primary navigation with mega-menu columns (NACTVET information architecture,
// TIRDO content).
export const mainNav: NavItem[] = [
  { title: "Home", key: "home", href: "/" },
  {
    title: "About Us",
    key: "about",
    href: "/about",
    children: [
      { title: "Mission & Vision", key: "aboutMenu.missionVision", href: "/about/mission-vision" },
      { title: "Organization Structure", key: "aboutMenu.structure", href: "/about/structure" },
      { title: "Board of Directors", key: "aboutMenu.board", href: "/about/board" },
      { title: "Administration", key: "aboutMenu.administration", href: "/about/administration" },
      { title: "Success Stories", key: "aboutMenu.successStories", href: "/about/success-stories" },
      { title: "COMSATS Centre", key: "aboutMenu.comsats", href: "/about/comsats" },
    ],
  },
  {
    title: "Our Work",
    key: "ourWork",
    href: "/departments",
    columns: [researchCol, engineeringCol, ictCol],
  },
  {
    title: "Departments",
    key: "departments",
    href: "/departments",
    columns: [
      researchCol,
      engineeringCol,
      ictCol,
      {
        heading: "Finance",
        headingKey: "headings.finance",
        items: [
          { title: "Store Section", key: "finance.store", href: "/departments/finance" },
          { title: "Pre-Audit Section", key: "finance.preAudit", href: "/departments/finance" },
          { title: "Costing & Expenditure Section", key: "finance.costing", href: "/departments/finance" },
          { title: "Revenue Section", key: "finance.revenue", href: "/departments/finance" },
        ],
      },
      {
        heading: "Human Resources & Admin",
        headingKey: "headings.hrAdmin",
        items: [
          { title: "Human Resource Division", key: "hr.humanResource", href: "/departments/human-resources-administration" },
          { title: "Administration Division", key: "hr.administration", href: "/departments/human-resources-administration" },
          { title: "Estate Division", key: "hr.estate", href: "/departments/human-resources-administration" },
        ],
      },
    ],
  },
  {
    title: "Services",
    key: "services",
    href: "/services",
    children: [
      { title: "Research", key: "servicesMenu.research", href: "/services/research" },
      { title: "Energy Auditing", key: "servicesMenu.energyAuditing", href: "/services/energy-auditing" },
      { title: "Feasibility Studies", key: "servicesMenu.feasibility", href: "/services/feasibility-studies" },
      { title: "Consultancy & Technical Services", key: "servicesMenu.consultancy", href: "/services/consultancy" },
      { title: "Laboratory Analytical Services", key: "servicesMenu.laboratory", href: "/services/laboratory" },
      { title: "Training & Skill Development", key: "servicesMenu.training", href: "/services/training" },
    ],
  },
  {
    title: "Research & Innovation",
    key: "research",
    href: "/projects",
    children: [
      { title: "Ongoing Projects", key: "researchMenu.ongoing", href: "/projects" },
      { title: "T-Hub Innovation", key: "researchMenu.tHub", href: "/t-hub" },
      { title: "Industrial Information Centre", key: "researchMenu.iic", href: "/industrial-information-centre" },
      { title: "Research Products", key: "researchMenu.products", href: "/projects#products" },
      { title: "Publications", key: "researchMenu.publications", href: "/publications" },
    ],
  },
  {
    title: "Media Centre",
    key: "media",
    href: "/news",
    children: [
      { title: "News & Announcements", key: "mediaMenu.news", href: "/news" },
      { title: "Events", key: "mediaMenu.events", href: "/events" },
      { title: "Gallery", key: "mediaMenu.gallery", href: "/gallery" },
      { title: "Documents", key: "mediaMenu.documents", href: "/documents" },
    ],
  },
  { title: "Analytics", key: "analytics", href: "/analytics" },
  { title: "Contact Us", key: "contact", href: "/contact" },
];

// Highlighted portal button in the header (gold).
export const portal = { title: "e-Services", key: "eServices", href: "/e-services" };

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
