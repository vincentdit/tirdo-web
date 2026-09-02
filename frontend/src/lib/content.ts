// -----------------------------------------------------------------------
// Fallback content. The site renders from these values whenever Strapi is
// unreachable or not yet seeded, so the UI is never blank. Once Strapi is
// running and populated, lib/strapi.ts returns live data instead.
// -----------------------------------------------------------------------

export type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  category: string;
  date: string;
  image?: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  department: string;
  status: "Ongoing" | "Completed" | "Featured";
  image?: string;
};

export type Publication = {
  slug: string;
  title: string;
  type: "Report" | "Journal" | "Policy Brief" | "Guideline";
  year: number;
  fileUrl?: string;
};

export type ServiceItem = {
  slug: string;
  title: string;
  description: string;
  icon: string;
};

export type StatItem = { label: string; value: number; suffix?: string };
export type Slide = { title: string; subtitle: string; cta: string; href: string };
export type Leader = { name: string; role: string; photo?: string };

export const heroSlides: Slide[] = [
  {
    title: "Ideas engineered for Tanzania's industry.",
    subtitle: "We turn research, technology and innovation into sustainable industrial growth.",
    cta: "Discover TIRDO",
    href: "/about",
  },
  {
    title: "From the laboratory to industry.",
    subtitle:
      "Contract research, energy auditing, feasibility studies and consultancy for a competitive industrial sector.",
    cta: "Our services",
    href: "/services",
  },
  {
    title: "Powering industrial innovation.",
    subtitle:
      "T-Hub incubates startups and commercializes home-grown technologies for value addition and jobs.",
    cta: "Visit T-Hub",
    href: "/t-hub",
  },
];

export const stats: StatItem[] = [
  { label: "Years of Service", value: 46, suffix: "+" },
  { label: "Research Projects", value: 320, suffix: "+" },
  { label: "Industry Clients", value: 180, suffix: "+" },
  { label: "Publications", value: 540, suffix: "+" },
];

export const coreActivities = [
  {
    title: "Industrial Research",
    description:
      "Applied and adaptive research that solves real problems facing Tanzanian industry and adds value to local raw materials.",
    icon: "FlaskConical",
  },
  {
    title: "Industrial Engineering",
    description:
      "Design, fabrication and development of appropriate technologies, plant and equipment for the manufacturing sector.",
    icon: "Cog",
  },
  {
    title: "ICT & Technology Transfer",
    description:
      "Digital solutions, instrumentation and the transfer of proven technologies from the lab into commercial production.",
    icon: "Cpu",
  },
  {
    title: "Technology Forecasting",
    description:
      "Industrial information services, technology foresight and advisory support for evidence-based decisions.",
    icon: "LineChart",
  },
];

export const services: ServiceItem[] = [
  { slug: "research", title: "Contract Research", description: "Custom applied research for industry, government and development partners.", icon: "FlaskConical" },
  { slug: "energy-auditing", title: "Energy Auditing", description: "Certified energy audits that cut costs and emissions across industrial plants.", icon: "Zap" },
  { slug: "feasibility-studies", title: "Feasibility Studies", description: "Technical and economic feasibility for new industrial ventures and expansions.", icon: "ClipboardCheck" },
  { slug: "consultancy", title: "Consultancy", description: "Expert advisory in engineering, environment, materials and process improvement.", icon: "Users" },
  { slug: "laboratory", title: "Laboratory & Testing", description: "Accredited testing of materials, food, water, textiles and industrial products.", icon: "TestTube" },
  { slug: "training", title: "Training", description: "Tailored short courses and capacity building for industry professionals.", icon: "GraduationCap" },
];

export const departments = [
  { slug: "environment", title: "Environment", group: "Industry & Research", blurb: "Environmental monitoring, pollution control and cleaner production." },
  { slug: "food-biotechnology", title: "Food & Biotechnology", group: "Industry & Research", blurb: "Food processing, preservation, value addition and bioprocess research." },
  { slug: "industrial-chemistry", title: "Industrial Chemistry", group: "Industry & Research", blurb: "Chemical analysis, formulation and process chemistry for industry." },
  { slug: "energy", title: "Energy", group: "Engineering Development", blurb: "Renewable energy, energy efficiency and industrial energy systems." },
  { slug: "materials", title: "Material Science & Technology", group: "Engineering Development", blurb: "Materials testing, characterization and development of local materials." },
  { slug: "textile-leather", title: "Textile & Leather", group: "Engineering Development", blurb: "Textile, leather and garment technology and quality improvement." },
  { slug: "ict", title: "ICT", group: "ICT & Technology Development", blurb: "Software systems, digitalization and industrial ICT solutions." },
  { slug: "instrumentation", title: "Instrumentation", group: "ICT & Technology Development", blurb: "Design, calibration and maintenance of scientific instruments." },
  { slug: "technology-transfer", title: "Technology Transfer", group: "ICT & Technology Development", blurb: "Commercialization and diffusion of proven technologies to industry." },
];

export const news: NewsItem[] = [
  {
    slug: "tirdo-launches-biomass-briquette-line",
    title: "TIRDO commissions improved biomass briquette production line",
    excerpt:
      "A new briquetting line turns agricultural residues into clean cooking fuel, cutting deforestation and creating rural jobs.",
    category: "Research",
    date: "2026-08-18",
  },
  {
    slug: "essential-oils-value-addition",
    title: "Essential oils project boosts value addition for local farmers",
    excerpt:
      "TIRDO's essential-oils research links smallholder growers to industrial buyers through improved extraction technology.",
    category: "Innovation",
    date: "2026-07-30",
  },
  {
    slug: "energy-audit-partnership",
    title: "TIRDO signs energy-auditing partnership with manufacturers",
    excerpt:
      "The agreement will see certified energy audits rolled out across dozens of factories in the Dar es Salaam industrial belt.",
    category: "Partnership",
    date: "2026-07-12",
  },
  {
    slug: "t-hub-cohort-graduation",
    title: "T-Hub graduates its third cohort of industrial startups",
    excerpt:
      "Six ventures completed the incubation programme, with technologies spanning food processing, ICT and clean energy.",
    category: "T-Hub",
    date: "2026-06-25",
  },
];

export const projects: Project[] = [
  { slug: "essential-oils", title: "Essential Oils Extraction", summary: "Improved steam-distillation technology for high-value essential oils from local botanicals.", department: "Food & Biotechnology", status: "Featured" },
  { slug: "biomass-briquettes", title: "Biomass Briquettes", summary: "Converting agro-waste into affordable, clean-burning fuel briquettes.", department: "Energy", status: "Featured" },
  { slug: "leather-finishing", title: "Local Leather Finishing", summary: "Upgrading Tanzanian leather quality for the export garment and footwear industry.", department: "Textile & Leather", status: "Ongoing" },
  { slug: "water-quality-sensors", title: "Low-cost Water-Quality Sensors", summary: "Instrumentation for real-time monitoring of industrial effluent and drinking water.", department: "Instrumentation", status: "Ongoing" },
];

export const publications: Publication[] = [
  { slug: "annual-report-2025", title: "TIRDO Annual Report 2025", type: "Report", year: 2025 },
  { slug: "cleaner-production-guideline", title: "Guideline on Cleaner Production for SMEs", type: "Guideline", year: 2025 },
  { slug: "industrial-energy-brief", title: "Policy Brief: Industrial Energy Efficiency", type: "Policy Brief", year: 2024 },
  { slug: "materials-journal-v12", title: "Journal of Industrial Research, Vol. 12", type: "Journal", year: 2024 },
];

export const leaders: Leader[] = [
  { name: "Director General", role: "Chief Executive" },
  { name: "Director of Research & Consultancy", role: "Directorate" },
  { name: "Director of Engineering Development", role: "Directorate" },
  { name: "Director of Corporate Services", role: "Directorate" },
];

export const eservices = [
  { title: "Industrial Information Centre", anchor: "iic", description: "Search technical reports, standards and industrial data.", href: "/publications" },
  { title: "Client Service Portal", anchor: "portal", description: "Request research, testing and consultancy services online.", href: "/contact" },
  { title: "Staff e-Office", anchor: "eoffice", description: "Internal document management and correspondence system.", href: "#" },
];

export const partners = [
  "COMSATS", "COSTECH", "CTI", "TIC", "TBS", "SIDO", "UDSM", "NEMC",
];
