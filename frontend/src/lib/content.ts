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

export type ServiceItem = { slug: string; title: string; description: string; icon: string; body?: string[] };
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
  {
    slug: "research",
    title: "Research",
    description: "Applied and contract industrial research for industry, government and development partners.",
    icon: "FlaskConical",
    body: [
      "TIRDO provides applied research focused on local material utilization — evaluating, developing and integrating locally available materials into industrial processes. This covers material evaluation to assess suitability for different industries, optimization of material properties for specific applications, and experimentation to test incorporation into existing or new manufacturing processes.",
      "The organization also researches industrial techniques and technologies to advise government and industry on adopting domestic and foreign approaches within Tanzania's context — bridging scientific knowledge with practical industrial application to strengthen local industries and support economic development.",
    ],
  },
  {
    slug: "energy-auditing",
    title: "Energy Auditing",
    description: "Certified industrial energy audits that cut costs and emissions across plants.",
    icon: "Zap",
    body: [
      "TIRDO delivers energy auditing as a systematic inspection and analysis service that identifies consumption patterns and efficiency opportunities. Its certified auditors follow ASHRAE and ISO standards, backed by state-of-the-art laboratory facilities, serving industries, commercial buildings and households across Tanzania and the East African Community.",
      "The service helps organisations determine their carbon footprint, set reduction targets and evaluate renewable-energy alternatives. Beyond standard audits, the laboratory performs performance testing on ovens, boilers, solar dryers and cook stoves — helping businesses cut costs and strengthen their environmental, social and governance foundations.",
    ],
  },
  {
    slug: "feasibility-studies",
    title: "Feasibility Studies",
    description: "Technical and economic feasibility for new industrial ventures and expansions.",
    icon: "ClipboardCheck",
    body: [
      "TIRDO conducts comprehensive feasibility studies for establishing new ventures or expanding operations — covering project definition and scope, market-demand analysis, technical evaluation of resources and infrastructure, financial cost projections, and risk identification. It also assesses resource availability for raw materials and labour and performs environmental and social impact assessments.",
      "By providing thorough pre-project analysis and detailed recommendations on viability, TIRDO helps businesses make well-informed investment decisions, minimise financial risk and optimise resource allocation before significant capital is committed.",
    ],
  },
  {
    slug: "consultancy",
    title: "Consultancy & Technical Services",
    description: "Expert advisory in engineering, environment, materials and process improvement.",
    icon: "Users",
    body: [
      "TIRDO offers comprehensive technical support across sectors: quality assurance using non-destructive testing (NDT) for welded vessels and pipelines, energy-efficiency audits and performance testing, coal materials analysis, food microbiological testing, environmental monitoring, and chemical analytical services for raw materials and industrial products.",
      "Its clients span manufacturing facilities, commercial centres and households — food producers, chemical processors, environmental consultants and energy-focused enterprises — supported through accredited laboratories. TIRDO also assists industrial establishments during process development and factory set-up as a multidisciplinary technical partner.",
    ],
  },
  {
    slug: "laboratory",
    title: "Laboratory Analytical Services",
    description: "Accredited testing and analysis of materials, food, water, textiles and industrial products.",
    icon: "TestTube",
    body: [
      "TIRDO operates specialised, accredited laboratories across food and microbiology, industrial chemistry, materials, energy and environment. Services include physicochemical and microbiological testing of food and water, heavy-metal and micronutrient analysis, coal quality assessment, and destructive and non-destructive testing of materials.",
      "Industries, government institutions, SMEs and the public rely on these laboratories for reliable, standards-based results that support quality assurance, regulatory compliance and product development.",
    ],
  },
  {
    slug: "training",
    title: "Training & Skill Development",
    description: "Tailored short courses and capacity building for industry professionals.",
    icon: "GraduationCap",
    body: [
      "TIRDO delivers tailored short courses and capacity-building programmes for industrialists, SMEs and the public — spanning food processing, packaging and safety (GMP, GHP, HACCP), energy efficiency and clean-technology production, non-destructive testing, and leather, spinning and weaving technologies.",
      "Training combines TIRDO's laboratory capability with field experience, equipping participants with practical skills that improve productivity, quality and safety across Tanzanian industry.",
    ],
  },
];

export type DeptSection = { name: string; items?: string[] };
export type Department = {
  slug: string;
  title: string;
  group: string;
  blurb: string;
  head?: string;
  body: string[];
  sections?: DeptSection[];
};

export const departments: Department[] = [
  {
    slug: "environment",
    title: "Environment",
    group: "Industrial Research",
    blurb: "Environmental monitoring, pollution control and cleaner production.",
    head: "Ms. Kunda Sikazwe",
    body: [
      "The Environmental Technologies and Occupational Safety Division carries out industrial research and development, environmental management, and occupational health and safety within industrial settings — minimising pollution while maintaining safe, efficient production.",
      "Its research emphasises value addition to industrial waste, conventional and onsite wastewater treatment, and cleaner production in the leather and textile industries. The division offers environmental monitoring for industry, government and private clients: air quality (particulates, metals, gas emissions), noise and light, wastewater and potable water analysis, environmental impact assessments and audits, and sludge quality — applied across the steel, tobacco, cement, beverage, brewing and mining sectors.",
    ],
  },
  {
    slug: "food-biotechnology",
    title: "Food & Biotechnology",
    group: "Industrial Research",
    blurb: "Food processing, preservation, value addition and bioprocess research.",
    body: [
      "The Food and Biotechnology Division comprises food processing, microbiology and biotechnology sections, delivering research, development and analytical services for a rapidly expanding food industry.",
      "Its accredited food laboratory (established 1995, accredited in 2009) performs chemical, physical and microbiological testing on fish, cereals, legumes, meat, dairy and honey, and water-quality determinations. The division also produces mushroom spawn for farmers and trains industrialists and SMEs on food processing, packaging, safety, GMP, GHP and HACCP.",
    ],
  },
  {
    slug: "industrial-chemistry",
    title: "Industrial Chemistry",
    group: "Industrial Research",
    blurb: "Chemical analysis, formulation and process chemistry for industry.",
    head: "Ms. Jacqueline Mwendwa",
    body: [
      "The Agro-Processing and Industrial Chemistry Division promotes the use of local raw materials for industrial production through value addition, spanning medicinal and synthetic chemistry, nanotechnology and new materials, analytical and environmental chemistry, and natural products.",
      "Its well-equipped laboratory provides physicochemical quality testing of raw materials, products and industrial wastes; proximate analysis of foods; micronutrient determination in food, fertilizers and salt; heavy-metals analysis; and technical problem-solving for agro-processing industries and SMEs.",
    ],
  },
  {
    slug: "energy",
    title: "Energy",
    group: "Engineering Development",
    blurb: "Renewable energy, energy efficiency and industrial energy systems.",
    head: "Eng. Hossen Iddi Kayumba",
    body: [
      "The Energy Technologies Division develops sustainable energy solutions across research, technical services and capacity building — from coal characterization and biofuels to improved cooking and renewable energy systems using biomass and agricultural waste.",
      "It helps organisations implement energy management aligned to ISO 50001, and performs performance testing of energy systems (ovens, furnaces, solar PV, boilers), industrial energy audits, renewable-energy technology development, and skills training, managing projects from feasibility studies through commissioning.",
    ],
  },
  {
    slug: "materials",
    title: "Material Science & Technology",
    group: "Engineering Development",
    blurb: "Materials testing, characterization and development of local materials.",
    head: "Eng. Liberatus Chizuzu",
    body: [
      "The Material Science and Technologies Section develops and specifies materials by cost and performance across metals, ceramics, polymers, biomaterials and composites, including secondary metallurgy for steel rolling mills and foundries, sponge-iron development, and coking-coal characterization.",
      "It provides both destructive testing (hardness, tensile, torsion) and a broad range of non-destructive testing — ultrasonic, magnetic particle, liquid penetrant, radiographic, remote visual and eddy-current inspection — for civil, aeronautical and systems-engineering applications.",
    ],
  },
  {
    slug: "textile-leather",
    title: "Textile & Leather Technologies",
    group: "Engineering Development",
    blurb: "Textile, leather and garment technology and quality improvement.",
    head: "Eng. Athanas Ntawanga",
    body: [
      "The Textile and Leather Technologies Division advances cleaner, competitive production and quality assurance across the textile and leather value chains, while adding value to waste streams. Its R&D covers collagen and natural fibres, non-woven and woven fabric technologies, and organic materials for textiles.",
      "Services include quality assurance for yarn, fabrics and leather; laboratory analysis; training in leather production, spinning and weaving; hand-loom and semi-leather recycling support; and turn-key consulting for manufacturers.",
    ],
  },
  {
    slug: "ict",
    title: "ICT",
    group: "ICT & Technology Development",
    blurb: "Software systems, cybersecurity, networks and industrial ICT solutions.",
    head: "Ms. Elizabeth Mtegwa",
    body: [
      "The Information & Communication Technologies Division applies ICT within the organisation and provides technical advisory support to industry. Its research spans cybersecurity and forensics, sensor and mobile application development, and e-waste management.",
      "On the consultancy side it supports SME ICT operations, industrial research and innovation databases, advanced computing in education, and ideation portals.",
    ],
  },
  {
    slug: "instrumentation",
    title: "Instrumentation",
    group: "ICT & Technology Development",
    blurb: "Design, calibration and maintenance of scientific instruments.",
    head: "Ms. Ester Lazaro",
    body: [
      "The Electronics and Instrumentation Technologies Division develops, controls and transfers expertise in electronics and instrumentation — designing, simulating and testing electronic circuits, and calibrating and maintaining instruments so measurements are accurate and reliable.",
      "It offers mechanical, electrical, pipette, flow, temperature and pressure calibration, and the installation, maintenance and repair of analytical instruments including HPLCs, gas chromatographs and spectrophotometers.",
    ],
  },
  {
    slug: "technology-transfer",
    title: "Technology Transfer",
    group: "ICT & Technology Development",
    blurb: "Commercialization and diffusion of proven technologies to industry.",
    body: [
      "The Technology Transfer and Pilot Plants Unit bridges research and practical application, ensuring TIRDO's innovations reach industry to solve productivity challenges.",
      "It assesses the commercial potential of research, conducts market analysis, protects intellectual property (patents and trademarks), incubates start-ups from TIRDO innovations, and trains researchers on IP, technology transfer and commercialization.",
    ],
  },
  {
    slug: "human-resources-administration",
    title: "Human Resources & Administration",
    group: "Human Resources & Administration",
    blurb: "Human resources, administration and estate services that keep TIRDO running.",
    head: "Mr. Emilian S. Bundala",
    body: [
      "The Human Resources & Administration Department provides the people and support services that enable TIRDO to deliver its mandate — recruitment, staff development and welfare, records and correspondence, transport, security, and the upkeep of TIRDO's buildings and estate.",
      "It develops and implements human-resource policies and administrative systems, supports performance management and training, and ensures a safe, well-run working environment across the organisation.",
    ],
    sections: [
      { name: "Human Resource Division", items: ["Personnel", "Training"] },
      { name: "Administration Division", items: ["Office Management", "Transport", "Maintenance", "Security"] },
      { name: "Estate Division", items: ["Building & Estate Maintenance", "Carpentry"] },
    ],
  },
  {
    slug: "finance",
    title: "Finance",
    group: "Finance",
    blurb: "Financial management, budgeting, accounting and revenue control.",
    head: "Mr. David J. Kisiwa",
    body: [
      "The Finance Department is the institutional hub for financial management and advisory services. It coordinates the preparation and implementation of the Corporate Strategic Plan, Annual Budget and financial regulations, and ensures proper accounting and control of revenue and expenditure alongside the preparation of annual financial statements.",
      "It develops financial systems and procedures, manages organisational cash flow, coordinates with suppliers and tax authorities, and provides technical advice on finance, accounts and business-process optimisation — helping TIRDO operate efficiently and transparently.",
    ],
    sections: [
      { name: "Store Section" },
      { name: "Pre-Audit Section" },
      { name: "Costing & Expenditure Section" },
      { name: "Revenue Section" },
    ],
  },
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

// Director General welcome (verbatim from tirdo.or.tz).
export const directorMessage = {
  name: "Prof. Mkumbukwa M. A. Mtambo",
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
  { title: "Industrial Information Centre", anchor: "iic", description: "Search technical reports, standards and industrial data.", href: "/industrial-information-centre" },
  { title: "Client Service Portal", anchor: "portal", description: "Request research, testing and consultancy services online.", href: "/contact" },
  { title: "Staff e-Office", anchor: "eoffice", description: "Internal document management and correspondence system.", href: "#" },
];

export const partners = [
  "COMSATS", "COSTECH", "CTI", "TBS", "SIDO", "TEMDO", "CAMARTEC", "WAITRO",
  "TIC", "BRELA", "EPZA", "TanTrade",
];

export type EventItem = {
  title: string;
  date: string;
  location: string;
  category: string;
  description: string;
  image?: string;
};

export const events: EventItem[] = [
  {
    title: "Biomass Briquettes Production Training",
    date: "2025-11-15",
    location: "TIRDO Complex, Dar es Salaam",
    category: "Training",
    description: "Hands-on, registration-based training on producing biomass briquettes as a clean cooking-fuel alternative to charcoal.",
    image: `${RES}/H1D6ScYYF7ZdoRK9q5V8fxut6gRVKKVeSQaTWjKU.png`,
  },
  {
    title: "Hands-on Training in Alternative Charcoal Production",
    date: "2025-10-10",
    location: "TIRDO Complex, Dar es Salaam",
    category: "Training",
    description: "Practical training on producing alternative charcoal, supporting jobs and reducing pressure on forests.",
    image: `${NEWS}/q2cMG2Q6dwvZqhDC5vXf8vJTzX6LT4DBgJKj1OEd.jpg`,
  },
  {
    title: "Dar es Salaam International Trade Fair (DITF) 2025",
    date: "2025-07-01",
    location: "Mwalimu J. K. Nyerere Trade Fair Grounds, Dar es Salaam",
    category: "Exhibition",
    description: "TIRDO showcased its research products, laboratories and industrial services at the annual national trade fair.",
    image: `${CI}/llWLlNlWubobDNVa4AKmzeiScT4efKRsoeZA4xRO.jpg`,
  },
];

export type GalleryImage = { src: string; caption: string };
export const galleryImages: GalleryImage[] = [
  { src: `${CI}/fRbUBRaWLBHYVw8U8yG1aRENYr39KbRrvArOp5kQ.jpg`, caption: "Ministry Secretary with the TIRDO Board" },
  { src: `${CI}/uNKy6HRLTxyTlnOfqZlMhXIR8nA6SaMGCDNzTmrq.jpg`, caption: "Deputy Minister's visit to TIRDO" },
  { src: `${CI}/laX5QEVDZMj4dCwh7uxiIy1gerC4jjQOJe3myxs9.jpg`, caption: "Signing of the strategic minerals research agreement" },
  { src: `${CI}/llWLlNlWubobDNVa4AKmzeiScT4efKRsoeZA4xRO.jpg`, caption: "TIRDO at the DITF 2025 exhibition" },
  { src: `${CI}/cCiap7vvzT3PcCrqVYJe99reAp4pnPJVZ5SnDDBV.jpg`, caption: "Non-destructive testing experts at Msalato airport" },
  { src: `${RES}/feHRWQMR9OJXOpyL21RzVcnWNQ9xzn2ATG2RKDLj.jpg`, caption: "Essential oils production research" },
  { src: `${RES}/H1D6ScYYF7ZdoRK9q5V8fxut6gRVKKVeSQaTWjKU.png`, caption: "Biomass briquette production plant" },
  { src: `${RES}/rulXDuQQtR41OMCyxi0UpFChGCupyDdXYHxHEfZz.png`, caption: "Industrial mapping project" },
  { src: `${RES}/oE73KEynZEZ2mPY8pm9YD39qgwsjTVgtHrC44f7q.png`, caption: "Energy efficiency action plan" },
  { src: `${NEWS}/eS05a9Ewg0Zp9bxOaIbmJpkipvJVRhpzToa8Pz1u.jpg`, caption: "TIRDO and STAMICO agreement" },
  { src: `${NEWS}/2KFt3PRz9DRWIww6TBbfl0IcDvKXWfxOAXYHHGah.jpg`, caption: "Alternative charcoal for environmental conservation" },
  { src: "https://www.tirdo.or.tz/uploads/administration/1.%20Prof.%20Mkumbukwa%20M.%20A.%20message.png", caption: "Director General, Prof. Mkumbukwa M. A. Mtambo" },
];

// TIRDO management / division heads (from tirdo.or.tz department pages).
export const management: Leader[] = [
  { name: "Prof. Mkumbukwa M. A.", role: "Director General" },
  { name: "Ms. Kunda Sikazwe", role: "Head, Environment & Occupational Safety" },
  { name: "Ms. Jacqueline Mwendwa", role: "Head, Industrial Chemistry" },
  { name: "Eng. Hossen Iddi Kayumba", role: "Head, Energy Technologies" },
  { name: "Eng. Liberatus Chizuzu", role: "Head, Material Science & Technology" },
  { name: "Eng. Athanas Ntawanga", role: "Head, Textile & Leather Technologies" },
  { name: "Ms. Elizabeth Mtegwa", role: "Head, ICT" },
  { name: "Ms. Ester Lazaro", role: "Head, Electronics & Instrumentation" },
];

export type OrgUnit = { name: string; role?: string; head?: string };
export type OrgDivision = { name: string; role?: string; head?: string; items?: string[] };
export type OrgDept = { name: string; role: string; director?: string; divisions: OrgDivision[] };

export const orgStructure: { intro: string; units: OrgUnit[]; departments: OrgDept[] } = {
  intro:
    "TIRDO is governed by the Council (Board of Directors) and led by the Director General. The Director General is supported by the Internal Auditor, the Procurement Unit, the Corporate Service & Planning Division and the Legal Unit, and oversees five departments — each headed by a Director and made up of divisions and sections headed by a Head.",
  // Supporting units beside the DG. `role` renders as the bracketed tag; `head` is the officer's name.
  units: [
    { name: "Internal Auditor" },
    { name: "Procurement Unit" },
    { name: "Corporate Service & Planning Division", role: "Head" },
    { name: "Legal Unit" },
  ],
  // `role` becomes the bracketed tag, e.g. "(Director)" / "(Head)"; `director`/`head` hold names.
  departments: [
    {
      name: "ICT & Technology Development Dept.", role: "Director", director: "Eng. Vincent J. Maro",
      divisions: [
        { name: "Information & Communication Technologies Division", role: "Head" },
        { name: "Electronics & Instrumentation Technologies Division", role: "Head" },
        { name: "Technology Transfer & Pilot Plants Division", role: "Head" },
      ],
    },
    {
      name: "Industrial Research Dept.", role: "Director", director: "Mr. Humphrey P. Ndossi",
      divisions: [
        { name: "Agro processing Industrial Chemistry Division", role: "Head" },
        { name: "Environmental Technology & Occupational Safety Division", role: "Head" },
        { name: "Food Processing & Biotechnology Division", role: "Head" },
      ],
    },
    {
      name: "Engineering Development Dept.", role: "Director", director: "Eng. Ramson A. Mwilangali",
      divisions: [
        { name: "Engineering Material Technology Division", role: "Head" },
        { name: "Textile & Leather Technologies Division", role: "Head" },
        { name: "Energy Technology Division", role: "Head" },
      ],
    },
    {
      name: "Human Resources & Admin Dept.", role: "Director", director: "Mr. Emilian S. Bundala",
      divisions: [
        { name: "Human Resource Division", role: "Head", items: ["Personnel", "Training"] },
        { name: "Administration Division", role: "Head", items: ["Office Mgt", "Transport", "Maintenance", "Security"] },
        { name: "Estate Division", role: "Head", items: ["Building & Estate Maintenance", "Carpentry"] },
      ],
    },
    {
      name: "Finance Dept.", role: "Director", director: "Mr. David J. Kisiwa",
      divisions: [
        { name: "Store Section" },
        { name: "Pre-Audit Section" },
        { name: "Costing & Expenditure Section" },
        { name: "Revenue Section" },
      ],
    },
  ],
};

// Board of Directors (as provided by TIRDO).
export const board: Leader[] = [
  { name: "Eng. Bashiri Juma Mrindoko", role: "Chairman" },
  { name: "Prof. Mkumbukwa M. A. Mtambo", role: "Director General / Secretary" },
  { name: "Prof. Maulilio John Kipanyula", role: "Member" },
  { name: "Dr. Mwansule Wilson Lugano", role: "Member" },
  { name: "Prof. Sylvester M. Mpanduji", role: "Member" },
  { name: "Dr. Amos Muhunde Nungu", role: "Member" },
  { name: "Dr. Abdulla Rashid Abdulla", role: "Member" },
  { name: "Ms. Rhobi Daniel Satima", role: "Member" },
  { name: "Mr. Peter Alanambula Ilomo", role: "Member" },
];

// Top management / directors (as provided by TIRDO).
export const topManagement: Leader[] = [
  { name: "Prof. Mkumbukwa M. A. Mtambo", role: "Director General" },
  { name: "Mr. Emilian S. Bundala", role: "Director of HR & Administration" },
  { name: "Eng. Vincent J. Maro", role: "Director of ICT & Technology Transfer" },
  { name: "Eng. Ramson A. Mwilangali", role: "Director of Engineering Development" },
  { name: "Mr. Humphrey P. Ndossi", role: "Director of Industrial Research" },
  { name: "Mr. David J. Kisiwa", role: "Director of Finance" },
];

// Supporting units reporting directly to the Director General
// (shown beside the DG in the organization structure — not departments).
export const managementUnits = [
  {
    slug: "internal-audit",
    name: "Internal Auditor",
    desc: "Provides independent assurance and internal audit of TIRDO's operations, risk management and internal controls, reporting to the Council/Board.",
  },
  {
    slug: "procurement",
    name: "Procurement Unit",
    desc: "The Procurement Management Unit responsible for all procurement of goods, works and services in line with the Public Procurement Act and its regulations.",
  },
  {
    slug: "corporate-service-planning",
    name: "Corporate Service & Planning Division",
    desc: "Coordinates corporate planning, monitoring and evaluation, quality management and cross-cutting corporate services across the organisation.",
  },
  {
    slug: "legal",
    name: "Legal Unit",
    desc: "Provides legal advisory services to management, drafts and reviews contracts, agreements and memoranda of understanding, ensures statutory and regulatory compliance, and represents TIRDO in legal matters.",
  },
];

export const comsatsObjectives = [
  "Enhance scientific knowledge of the South on climate change for appropriate climate action and advocacy.",
  "Assess how environmental and climatic changes affect communities' wellbeing and economic performance.",
  "Combat climate change through mitigation and adaptation for sustainable growth and development.",
  "Build public understanding and skills on climate and environmental challenges.",
  "Create comprehensive information databases to support evidence-based decision-making.",
  "Promote regional and global partnerships for effective climate and sustainability action.",
];

export const comsatsActivities = [
  "Research & development — value addition to industrial waste streams, cleaner production technologies, and liquid and solid waste management.",
  "Consultancy & technical services — indoor and outdoor environmental management, air quality monitoring (particulates, pollutant gases, noise, light, heat, ground vibration).",
  "Environmental and social impact assessments (ESIA) and environmental audits for industry.",
];

export const iic = {
  intro: [
    "TIRDO established the Industrial Information Centre to support Tanzania's industrialization agenda by closing gaps in industrial coordination and technology monitoring — providing updated industrial information, industrial clinic services and industrial incubation services for new and existing industries.",
    "The Centre is a comprehensive knowledge repository serving researchers, entrepreneurs, industries and policymakers. It fosters innovation through access to research materials and technical expertise, enhances competitiveness through market insight, and promotes collaboration among academia, industry and government.",
  ],
  objectives: [
    "Act as a repository of up-to-date information on industries, market trends, regulations and technology.",
    "Provide researchers access to scholarly journals, research papers and patents.",
    "Offer businesses insight into emerging opportunities and challenges.",
    "Organize seminars and training sessions to build professional and entrepreneurial skills.",
    "Foster partnerships between academia, industry and government.",
  ],
  activities: [
    "Information collection, cataloguing and curation",
    "Knowledge dissemination via publications, newsletters and events",
    "Research support — journals, databases and research tools",
    "Market intelligence and industry-trend studies",
    "Technical advisory services from subject-matter experts",
    "Networking events and conferences",
    "Industry exhibitions",
    "Capacity-building and entrepreneurship training",
    "Evidence-based policy support",
    "Digital resource access through online platforms",
    "International collaborations for knowledge exchange",
    "Incubation support for startups",
  ],
};

export const successStories = [
  { title: "National reference laboratory for coal", text: "TIRDO's coal laboratory analyses materials for proximate, ultimate and heating-value parameters. Having analysed over 60 coal samples, it was declared the national backstop reference laboratory for coal-quality assessment by the Minister for Energy and Minerals." },
  { title: "Mnazi Bay gas pipeline quality assurance", text: "TIRDO completed non-destructive testing on roughly 31 km of marine and onshore pipelines (5.2 km offshore, 26 km onshore) to ISO standards, from the Msimbati Peninsula to Mtwara." },
  { title: "Establishment of GS1-Tanzania", text: "TIRDO implemented traceability systems across agro value chains from 2004 (coffee, cashew, tea and seafood), leading to GS1-TZ National Ltd (2011) and barcode-based traceability for Tanzanian products." },
  { title: "Plastic waste recycling initiative", text: "In partnership with UNIDO, TIRDO established a recycling facility and trained over 300 people in plastic-recycling technology, creating jobs across collection, distribution and manufacturing." },
  { title: "Industrial energy auditing", text: "The centre has carried out over 60 energy and environmental management assignments for industry across nearly three decades, improving power efficiency and conservation." },
];

export const comsats = [
  "The COMSATS Centre for Climate and Sustainability (CCCS) was established at TIRDO on 10 October 2018. COMSATS is an intergovernmental organisation of developing nations, headquartered in Islamabad, Pakistan, operating a network of International Science and Technology Centres of Excellence — of which TIRDO is one.",
  "The Centre works within the framework of South-South and Triangular Cooperation to plan, fund and tackle climate-change challenges, aligning developing nations' climate actions with their policy frameworks and international commitments in support of the Sustainable Development Goals.",
];

export type Company = { name: string; description: string; logo?: string; href: string };
export const tHub = {
  intro:
    "T-Hub is TIRDO's innovation and IT development initiative, helping businesses balance proven best practice with innovation, software development, speed, efficiency and flexibility. It guides organisations through complex IT environments and incubates home-grown startups.",
  about: [
    "T-Hub has emerged to help businesses balance the benefits of proven best practices, innovation and software development with the need for speed, efficiency and flexibility. It guides organisations through complex IT environments while aligning business objectives with the right technology solutions.",
    "Operating within TIRDO, the hub provides expertise across IT disciplines to enhance operational value and efficiency, and incubates a portfolio of home-grown startups spanning software, telecommunications, renewable energy and innovation.",
  ],
  services: [
    { title: "Software Solutions", text: "Custom software development and design for public and private sectors and individuals." },
    { title: "ICT Consultancy", text: "Technology advisory integrated with finance, tax and legal specialists." },
    { title: "Business Incubation", text: "ICT business incubation for public and private sector and individuals." },
    { title: "Research & Consultancy", text: "Comprehensive business analysis and solution development." },
    { title: "Training & Capacity Building", text: "Skills-development programmes tailored to clients." },
    { title: "Coaching & Facilitation", text: "Business guidance and hands-on support services." },
    { title: "Advisory Services", text: "Strategic business and management consulting." },
    { title: "Security Solutions", text: "Consulting, advanced products and managed services to improve security and efficiency." },
  ],
  why: [
    { title: "Tailored Solutions", text: "We partner with you to understand your goals and build customised strategies — not generic products." },
    { title: "Comprehensive Integration", text: "We understand how organisational facets interconnect, collaborating across professions for integrated solutions." },
    { title: "Trust Through Competence", text: "Reliable delivery and collaborative planning that build long-term, lasting relationships." },
    { title: "Enterprise Security", text: "Proven solutions and managed services for modern threats across cloud, mobile, remote work and suppliers." },
  ],
  companies: [
    { name: "Innovasie", description: "Custom software development, cybersecurity and marketing, building digital products for healthcare, legal and communications across Africa.", logo: "https://www.tirdo.or.tz/uploads/innovasie/innovasie.png", href: "https://www.tirdo.or.tz/en/innovasie" },
    { name: "Ammacom (AwamuPay)", description: "A creative digital agency offering mobile apps, custom software, digital marketing, web design and mobile-money integration.", logo: "https://www.tirdo.or.tz/uploads/icon/AMMACOM.png", href: "https://www.tirdo.or.tz/en/awamupay" },
    { name: "Albetus Technologies", description: "ICT solutions provider delivering infrastructure design, software development, cloud solutions and security systems.", logo: "https://www.tirdo.or.tz/uploads/innovasie/albetus.png", href: "https://www.tirdo.or.tz/en/albetus" },
    { name: "Bivatek Africa", description: "East African technology company behind BIVA CHUO (student loans) and BIVA VOCHA (digital vouchers), plus cybersecurity and web services.", logo: "https://www.tirdo.or.tz/static/uploads/icon/bivatek.png", href: "https://www.tirdo.or.tz/en/bivatekafrica" },
    { name: "Amani Solar", description: "Manufactures solar-powered household lighting for off-grid communities — a clean alternative to candles and kerosene.", logo: "https://www.tirdo.or.tz/static/uploads/icon/AMANI%20SOLAR%20LOGO.png", href: "https://www.tirdo.or.tz/en/amanisolar" },
    { name: "Olas", description: "An early-stage venture incubated at TIRDO's T-Hub, developing technology solutions for Tanzanian industry.", href: "https://www.tirdo.or.tz/en/olas" },
  ] as Company[],
};
