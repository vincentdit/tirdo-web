// -----------------------------------------------------------------------
// Real TIRDO content sourced from tirdo.or.tz. Used to render the site and
// as the fallback when the CMS is unreachable. Images are served from
// tirdo.or.tz.
// -----------------------------------------------------------------------

export type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  category: string;
  date: string;
  image?: string;
  sourceUrl?: string;
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
  type: string;
  year: number;
  fileUrl?: string;
};

export type ServiceItem = { slug: string; title: string; description: string; icon: string };
export type StatItem = { label: string; value: number; suffix?: string };
export type Slide = { title: string; subtitle: string; cta: string; href: string; image: string };
export type Leader = { name: string; role: string; photo?: string };

const CI = "https://www.tirdo.or.tz/storage/carousel-items";
const RES = "https://www.tirdo.or.tz/storage/resources";
const NEWS = "https://www.tirdo.or.tz/storage/news";
const PUB = "https://www.tirdo.or.tz/storage/publications";

export const heroSlides: Slide[] = [
  {
    title: "Ideas engineered for Tanzania's industry.",
    subtitle: "We turn research, technology and innovation into sustainable industrial growth.",
    cta: "Discover TIRDO",
    href: "/about",
    image: `${CI}/fRbUBRaWLBHYVw8U8yG1aRENYr39KbRrvArOp5kQ.jpg`,
  },
  {
    title: "From the laboratory to industry.",
    subtitle:
      "Contract research, energy auditing, feasibility studies and consultancy for a competitive industrial sector.",
    cta: "Our services",
    href: "/services",
    image: `${CI}/uNKy6HRLTxyTlnOfqZlMhXIR8nA6SaMGCDNzTmrq.jpg`,
  },
  {
    title: "Research that adds value.",
    subtitle:
      "Non-destructive testing, materials science and instrumentation serving Tanzanian industry.",
    cta: "Our research",
    href: "/projects",
    image: `${CI}/cCiap7vvzT3PcCrqVYJe99reAp4pnPJVZ5SnDDBV.jpg`,
  },
];

export const stats: StatItem[] = [
  { label: "Years of Service", value: 46, suffix: "+" },
  { label: "Research Projects", value: 320, suffix: "+" },
  { label: "Industry Clients", value: 180, suffix: "+" },
  { label: "Publications", value: 60, suffix: "+" },
];

export const coreActivities = [
  {
    title: "Industrial Research",
    description: "Conducting research to advance industrial processes and add value to national resources.",
    icon: "FlaskConical",
  },
  {
    title: "Industrial Engineering",
    description: "Ensuring optimization of industrial systems, plant and processes.",
    icon: "Cog",
  },
  {
    title: "ICT & Technology Transfer",
    description: "Enabling technology transfer, digital solutions and innovation for enterprise.",
    icon: "Cpu",
  },
  {
    title: "Technology Forecasting",
    description: "Industrial information and foresight that help industry anticipate and prepare for change.",
    icon: "LineChart",
  },
];

export const services: ServiceItem[] = [
  { slug: "research", title: "Research", description: "Applied and contract industrial research for industry, government and development partners.", icon: "FlaskConical" },
  { slug: "energy-auditing", title: "Energy Auditing", description: "Certified industrial energy audits that cut costs and emissions across plants.", icon: "Zap" },
  { slug: "feasibility-studies", title: "Feasibility Studies", description: "Technical and economic feasibility for new industrial ventures and expansions.", icon: "ClipboardCheck" },
  { slug: "consultancy", title: "Consultancy & Technical Services", description: "Expert advisory in engineering, environment, materials and process improvement.", icon: "Users" },
  { slug: "laboratory", title: "Laboratory Analytical Services", description: "Accredited testing and analysis of materials, food, water, textiles and industrial products.", icon: "TestTube" },
  { slug: "training", title: "Training & Skill Development", description: "Tailored short courses and capacity building for industry professionals.", icon: "GraduationCap" },
];

export const departments = [
  { slug: "environment", title: "Environment", group: "Industry & Research", blurb: "Environmental monitoring, pollution control and cleaner production." },
  { slug: "food-biotechnology", title: "Food & Biotechnology", group: "Industry & Research", blurb: "Food processing, preservation, value addition and bioprocess research." },
  { slug: "industrial-chemistry", title: "Industrial Chemistry", group: "Industry & Research", blurb: "Chemical analysis, formulation and process chemistry for industry." },
  { slug: "energy", title: "Energy", group: "Engineering Development", blurb: "Renewable energy, energy efficiency and industrial energy systems." },
  { slug: "materials", title: "Material Science & Technology", group: "Engineering Development", blurb: "Materials testing, characterization and development of local materials." },
  { slug: "textile-leather", title: "Textile & Leather Technologies", group: "Engineering Development", blurb: "Textile, leather and garment technology and quality improvement." },
  { slug: "ict", title: "ICT", group: "ICT & Technology Development", blurb: "Software systems, cybersecurity, networks and industrial ICT solutions." },
  { slug: "instrumentation", title: "Instrumentation", group: "ICT & Technology Development", blurb: "Design, calibration and maintenance of scientific instruments." },
  { slug: "technology-transfer", title: "Technology Transfer", group: "ICT & Technology Development", blurb: "Commercialization and diffusion of proven technologies to industry." },
];

export const news: NewsItem[] = [
  {
    slug: "tirdo-stamico-minerals-research-agreement",
    title: "TIRDO and STAMICO sign agreement for strategic minerals research",
    excerpt:
      "TIRDO and the State Mining Corporation (STAMICO) have signed a research collaboration agreement on strategic minerals, strengthening value addition and beneficiation of Tanzania's mineral resources.",
    category: "Research Collaboration",
    date: "2025-11-12",
    image: `${NEWS}/eS05a9Ewg0Zp9bxOaIbmJpkipvJVRhpzToa8Pz1u.jpg`,
    sourceUrl: "https://www.tirdo.or.tz/newsapp/en/article_details/15",
  },
  {
    slug: "hands-on-training-alternative-charcoal-production",
    title: "Hands-on training in alternative charcoal production",
    excerpt:
      "TIRDO conducted practical training on producing alternative charcoal (biomass briquettes) as a cleaner cooking fuel, supporting jobs and reducing pressure on forests.",
    category: "Training",
    date: "2025-10-10",
    image: `${NEWS}/q2cMG2Q6dwvZqhDC5vXf8vJTzX6LT4DBgJKj1OEd.jpg`,
    sourceUrl: "https://www.tirdo.or.tz/newsapp/en/article_details/14",
  },
  {
    slug: "alternative-charcoal-environmental-conservation",
    title: "Alternative charcoal: a pathway to environmental conservation",
    excerpt:
      "Alternative charcoal is a saviour for the environment. TIRDO's biomass briquette technology offers a sustainable substitute for wood charcoal and helps mitigate climate change.",
    category: "Innovation",
    date: "2024-10-08",
    image: `${NEWS}/2KFt3PRz9DRWIww6TBbfl0IcDvKXWfxOAXYHHGah.jpg`,
    sourceUrl: "https://www.tirdo.or.tz/newsapp/en/article_details/12",
  },
  {
    slug: "hon-dr-selemani-jafo-visits-tirdo",
    title: "Hon. Dr. Selemani Jafo visits TIRDO and directs completion of the industrial opportunities system",
    excerpt:
      "During a visit to TIRDO, Hon. Dr. Selemani Jafo (MP) directed the completion of the national system for identifying industrial opportunities, to better guide investment and value addition.",
    category: "Announcement",
    date: "2024-07-22",
    image: `${NEWS}/Bi9KLvoqbRxTjvSEKZnmGtp9DcH41MmFbkdOLFuV.jpg`,
    sourceUrl: "https://www.tirdo.or.tz/newsapp/en/article_details/11",
  },
];

export const projects: Project[] = [
  {
    slug: "essential-oils",
    title: "Essential Oils Production",
    summary: "TIRDO has implemented improved extraction technology to produce high-value essential oils from local botanicals, linking farmers to industrial buyers.",
    department: "Food & Biotechnology",
    status: "Featured",
    image: `${RES}/feHRWQMR9OJXOpyL21RzVcnWNQ9xzn2ATG2RKDLj.jpg`,
  },
  {
    slug: "biomass-briquettes",
    title: "Biomass Briquette Production",
    summary: "This project converts agricultural residues into affordable, clean-burning briquettes as an alternative to charcoal, reducing deforestation and emissions.",
    department: "Energy",
    status: "Featured",
    image: `${RES}/H1D6ScYYF7ZdoRK9q5V8fxut6gRVKKVeSQaTWjKU.png`,
  },
  {
    slug: "industrial-mapping",
    title: "Industrial Mapping Project",
    summary: "Since 2013, TIRDO has mapped Tanzania's industries to identify opportunities, gaps and priorities for industrial development and investment.",
    department: "Technology Transfer",
    status: "Ongoing",
    image: `${RES}/rulXDuQQtR41OMCyxi0UpFChGCupyDdXYHxHEfZz.png`,
  },
  {
    slug: "energy-efficiency-action-plan",
    title: "Industrial Energy Efficiency Action Plan",
    summary: "Supported by the European Union, this project develops and rolls out energy-efficiency action plans to cut costs and emissions in Tanzanian industry.",
    department: "Energy",
    status: "Ongoing",
    image: `${RES}/oE73KEynZEZ2mPY8pm9YD39qgwsjTVgtHrC44f7q.png`,
  },
];

export const publications: Publication[] = [
  { slug: "financial-statements-2025", title: "TIRDO Financial Statements for the Year Ended 30th June 2025", type: "Financial Report", year: 2025, fileUrl: `${PUB}/eQoyhgUlJc8U0uHefva0m7HnoJNfbnGQR4Xt8Y1K.pdf` },
  { slug: "cleaner-cooking-briquettes", title: "Cleaner Cooking Solutions: Optimizing Biomass Briquettes to Replace Charcoal and Mitigate Climate Change in Tanzania", type: "Research Publication", year: 2025, fileUrl: `${PUB}/kgkHrHRHmlgiGpaliNrZMxskiHS5YGw3xdfb49LE.pdf` },
  { slug: "briquettes-production-handbook", title: "Biomass Briquettes Production Handbook", type: "Technical Handbook", year: 2024, fileUrl: `${PUB}/lE59YikFaoV4aaS21uVayYUuhMfere0HrxalV3bP.pdf` },
  { slug: "briquette-producers-profile", title: "Climate Change Adaptation and Mitigation: Profile of Biomass Briquette Producers in Tanzania", type: "Research Study", year: 2024, fileUrl: `${PUB}/pwagpql6HXK1HkwFEWp331n4DaEdBzFEd1AyKGiq.pdf` },
  { slug: "briquette-adoption-factors", title: "Climate Change Adaptation and Mitigation: Factors Influencing the Adoption of Biomass Briquettes in Tanzania", type: "Research Study", year: 2024, fileUrl: `${PUB}/Tlu2YWpLr1LWpnEUIStuV7Sq8rv2bsJHcfict0S4.pdf` },
  { slug: "tirdo-profile", title: "TIRDO Profile", type: "Organizational Profile", year: 2024, fileUrl: `${PUB}/nvZj843NupUupmJT8zklTIGLloyomwPdZx7zaQ00.pdf` },
  { slug: "financial-statements-2024", title: "TIRDO Financial Statements for the Year Ended 30th June 2024", type: "Financial Report", year: 2024, fileUrl: `${PUB}/GlJkkH6ITUnN4puxePVw9KkYKKFlKWcJdirJ9m08.pdf` },
  { slug: "financial-statements-2023", title: "TIRDO Financial Statements for the Year Ended 30th June 2023", type: "Financial Report", year: 2023, fileUrl: `${PUB}/TIWzfCpIR5FViS8j2huHhAsXcaIcfvxNAQywQ5Px.pdf` },
  { slug: "tirdo-act-1979", title: "The Tanzania Industrial Research and Development Organization Act, 1979", type: "Legislation", year: 1979, fileUrl: `${PUB}/Z00lhvaYrG94XYwS3hDUQBGdMZn6VbTPrcGIWeKr.pdf` },
];

export const leaders: Leader[] = [
  { name: "Prof. Mkumbukwa M. A.", role: "Director General" },
  { name: "Director of Research & Consultancy", role: "Directorate" },
  { name: "Director of Engineering Development", role: "Directorate" },
  { name: "Director of Corporate Services", role: "Directorate" },
];

// Director General welcome (verbatim from tirdo.or.tz).
export const directorMessage = {
  name: "Prof. Mkumbukwa M. A.",
  role: "Director General",
  photo: "https://www.tirdo.or.tz/uploads/administration/1.%20Prof.%20Mkumbukwa%20M.%20A.%20message.png",
  quote:
    "It is my distinguished pleasure and honour to welcome you to the Tanzania Industrial Research and Development Organization. TIRDO is a national industrial research organization whose mandate is to undertake industrial research, provide technology services, and disseminate research findings that have an impact on socio-economic activities in the country.",
};

// Vision / Mission / Values (verbatim from tirdo.or.tz).
export const mission = {
  vision: "To be a centre of excellence in provision of innovative solutions for a competitive industrial sector.",
  mission: "To support the development of competitive and sustainable industries through quality research and professional technical services.",
  values: [
    { title: "Integrity", text: "Commitment to honesty, impartiality and ethical principles." },
    { title: "Customer Focus", text: "Timely and proactive responsiveness to client needs." },
    { title: "Quality", text: "Excellence in R&D outputs and technical services." },
    { title: "Innovation", text: "Continuous improvement and experimentation." },
    { title: "Partnership", text: "Collaborative commitment to mandate implementation." },
    { title: "Accountability", text: "Responsibility for actions, decisions and outcomes." },
    { title: "Environmental Protection", text: "Consideration of environmental concerns in products and services." },
  ],
};

export const eservices = [
  { title: "Industrial Information Centre", anchor: "iic", description: "Search technical reports, standards and industrial data.", href: "/publications" },
  { title: "Client Service Portal", anchor: "portal", description: "Request research, testing and consultancy services online.", href: "/contact" },
  { title: "Staff e-Office", anchor: "eoffice", description: "Internal document management and correspondence system.", href: "#" },
];

export const partners = [
  "COMSATS", "COSTECH", "CTI", "TBS", "SIDO", "TEMDO", "CAMARTEC", "WAITRO",
  "TIC", "BRELA", "EPZA", "TanTrade",
];
