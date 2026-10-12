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
  researchArea?: string;
  year?: number;
  funder?: string;
};

export type Publication = {
  slug: string;
  title: string;
  type: string;
  year: number;
  fileUrl?: string;
  abstract?: string;
  authors?: string;
  keywords?: string[];
  doi?: string;
  citation?: string;
};

export type ServiceItem = { slug: string; title: string; description: string; icon: string; body?: string[] };
export type StatItem = { label: string; value: number; suffix?: string };
export type Slide = { title: string; subtitle: string; cta: string; href: string; image: string };
export type Leader = { name: string; role: string; photo?: string };

// Local assets served from frontend/public/media (downloaded from tirdo.or.tz
// via scripts/fetch-tirdo-assets.ps1).
const CI = "/media/carousel-items";
const RES = "/media/resources";
const NEWS = "/media/news";
const PUB = "/media/publications";

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
export type DeptPoint = { label: string; text?: string; items?: string[] };
export type DeptFocus = { title: string; intro?: string; paragraphs?: string[]; items?: string[]; note?: string; points?: DeptPoint[] };
export type Department = {
  slug: string;
  title: string;
  group: string;
  blurb: string;
  head?: string;
  headRole?: string;
  headPhoto?: string;
  body: string[];
  sections?: DeptSection[];
  focus?: DeptFocus[];
  panels?: DeptFocus[];
  achievements?: string[];
};

export const departments: Department[] = [
  {
    slug: "environment",
    title: "Environmental Technologies and Occupational Safety Division",
    group: "Industrial Research",
    blurb: "Environmental monitoring, pollution control and cleaner production.",
    head: "Ms. Kunda Sikazwe",
    headRole: "Head of Environment Section",
    headPhoto: "/media/administration/kunda-sikazwe.png",
    body: [
      "The Environmental Technologies and Occupational Safety Division works on industrial research and development, environmental management, and occupational health and safety on the industrial work floor — supporting improved production and the well-being of industrial staff.",
    ],
    focus: [
      {
        title: "Research and Development",
        intro: "Research and development is the core activity of the division. Research programmes include:",
        items: [
          "Value addition to industrial waste streams.",
          "Conventional wastewater treatment systems.",
          "Onsite wastewater treatment systems.",
          "Cleaner production in leather and textile industries.",
        ],
      },
      {
        title: "Consultancy and technical services to industries",
        paragraphs: [
          "Advice to industries on how to manage their resources for optimum production while ensuring minimal environmental pollution.",
          "The division offers indoor and outdoor environmental quality monitoring for industries, government institutions and individual customers.",
          "Environmental quality monitoring covers air quality (particulate matter and gas emissions), noise level, light intensity, ground vibration, heat, wastewater and potable water quality.",
          "Other services include environmental impact assessment and environmental auditing.",
        ],
      },
    ],
    achievements: [
      "Indoor air quality monitoring for steel and metal, tobacco processing, cement manufacturing industries and mines.",
      "Wastewater monitoring for beverage, tobacco processing, steel and metal industries, breweries and mines.",
      "Noise level monitoring in mines, cement, tobacco processing, and steel and metal industries.",
      "Flue gas monitoring in mines, cement, tobacco processing, and steel and metal industries.",
      "Particulate matter monitoring in mines, cement factories, tobacco processing, and steel and metal industries.",
      "Monitoring of the biological and chemical quality of sludge from wastewater works of some industries.",
    ],
  },
  {
    slug: "food-biotechnology",
    title: "Food and Biotechnology Division",
    group: "Industrial Research",
    blurb: "Food processing, preservation, value addition and bioprocess research.",
    head: "Dr. Ivy Matoju",
    headRole: "Head of Food and Biotechnology Section",
    body: [
      "The Food and Biotechnology Division is under the Industrial Research Department. It has three sections: food processing, microbiology and biotechnology.",
      "The food industry in the country is growing quickly in investment and product development, and needs research, development and analytical services in order to produce quality and safe food. The division carries out that research and development, and acts as a bridge between TIRDO and the food industry.",
    ],
    panels: [
      {
        title: "Role of the division",
        intro: "The division was developed to:",
        items: [
          "Carry out research related to food and biotechnology.",
          "Prepare project proposals on food issues.",
          "Provide food analytical services to industries and the public.",
          "Provide consultancy services related to food and biotechnology.",
          "Produce spawn for mushroom farmers.",
          "Provide training on basic food processing, microbiology and mushroom production to industrialists, small and medium enterprises, establishments and the general public.",
        ],
      },
      {
        title: "Food laboratory",
        paragraphs: [
          "The division's food laboratory was established in 1995 to support research and projects at TIRDO. It also provides food analytical services.",
          "Those services cover chemical, physical and microbiological quality testing of foods of animal and plant origin, including fish and fish products, cereals, legumes, meat and meat products, edible fats and oils, dairy and dairy products, honey, fruits and vegetables. The laboratory also determines water quality. Clients include individuals, industries, hotels and institutions.",
          "The laboratory was accredited in November 2009 for five microbiology parameters. The accreditation scope is based on food samples:",
        ],
        items: [
          "Detection and enumeration of total aerobic count.",
          "Detection and enumeration of Staphylococcus aureus.",
          "Detection and enumeration of total coliforms.",
          "Detection and enumeration of Escherichia coli.",
          "Detection of Salmonella.",
        ],
        note: "Other parameters the laboratory can conduct, though not yet accredited, include detection of Vibrio cholerae, and detection and enumeration of Enterobacteriaceae and faecal coliforms. The laboratory is extending its scope to water samples on the same parameters and other common parameters found in water.",
      },
      {
        title: "Current projects",
        intro: "The division is currently carrying out:",
        items: [
          "Improvement of drying techniques for cassava grits using an improved tunnel solar dryer to produce high-quality cassava flour (HQCF).",
          "Improvement of the palm oil extraction machine and palm oil quality parameters.",
        ],
      },
      {
        title: "Consultancies the division offers",
        intro: "The division offers consultancy to its clients. The main services are:",
        items: [
          "Analytical services for food and water samples for hotels, catering centres, schools, industries and SMEs.",
          "Industrial assessment of production processes, raw-material use, plant set-up, quality-assurance implementation and food-safety programmes.",
          "Training on food processing, food packaging, food safety, Good Manufacturing Practices (GMP), Good Hygienic Practices (GHP) and Hazard Analysis and Critical Control Point (HACCP) for hotels, catering centres, schools, industries, associations and SMEs.",
        ],
      },
    ],
  },
  {
    slug: "industrial-chemistry",
    title: "Agro processing Industrial Chemistry Division",
    group: "Industrial Research",
    blurb: "Chemical analysis, formulation and process chemistry for industry.",
    head: "Ms. Jacqueline Mwendwa",
    headRole: "Head of Industrial Chemistry Section",
    body: [
      "The Agro-Processing Technologies and Industrial Chemistry Division is under the Industrial Research Department. Its sections include medicinal and synthetic chemistry, nanotechnology and new materials, analytical and environmental chemistry, and natural products chemistry.",
      "Tanzania is industrialising rapidly, using raw materials from agricultural produce. Research in green agro-processing and industrial chemistry is needed so that produce and by-products can be turned into industrial and value-added products. The division carries out research and consultancy on the analytical, physical and chemical processes involved.",
    ],
    panels: [
      {
        title: "Role of the division",
        intro: "The division was developed to:",
        items: [
          "Promote the use of local raw materials for industrial production through value addition.",
          "Provide quality, reliable and internationally recognised analytical laboratory services.",
          "Document and share knowledge gained through research.",
          "Improve local technologies so products meet standards and customer specifications.",
          "Share technologies adopted and adapted from other countries that suit industrial development in Tanzania.",
        ],
      },
      {
        title: "Chemistry laboratory and consultancy",
        paragraphs: [
          "The division has a chemistry laboratory equipped for agro-processing and industrial chemistry research and projects.",
          "Consultancy covers physicochemical quality testing of raw materials, industrial products and industrial wastes. This includes proximate analysis of food of plant and animal origin, micronutrient determination in food, fertiliser and salt quality, and heavy-metals analysis in raw materials, industrial products and industrial wastes.",
          "The division also advises industries and SMEs on problems in agro-processing and industrial chemistry.",
        ],
      },
    ],
  },
  {
    slug: "energy",
    title: "Energy Technologies Division",
    group: "Engineering Development",
    blurb: "Renewable energy, energy efficiency and industrial energy systems.",
    head: "Eng. Hossen Iddi Kayumba",
    headRole: "Head of Energy Section",
    headPhoto: "/media/administration/hossen-kayumba.png",
    body: [
      "The Energy Technologies Division develops energy technologies, provides technical services, and builds skills for industry and communities.",
    ],
    panels: [
      {
        title: "Research and innovation",
        points: [
          {
            label: "Research and development",
            text: "The division undertakes research and development to create energy technologies and increase the use of alternative energy sources.",
            items: [
              "Coal characterization for existing coal mines, new coal fields and coal database development.",
              "Coal utilization technologies such as coal briquettes for household and industrial use.",
              "Industrial technologies for the production of biofuels and bio-based chemicals.",
              "Improved cook stoves for rural and peri-urban applications.",
            ],
          },
          {
            label: "Energy generation from local resources",
            text: "It innovates in energy generation technologies that use locally available energy resources.",
            items: [
              "Transforming biomass — especially agricultural waste, forest waste and animal dung — into biofuels.",
              "Production of bioethanol and biogas from organic wastes.",
            ],
          },
          {
            label: "Baseline and market studies",
            text: "It designs and implements baseline and market-potential studies.",
          },
        ],
      },
      {
        title: "Technical services",
        points: [
          {
            label: "Energy resource assessment",
            text: "The division assesses energy-resource quality and maintains a databank of Tanzania's energy resources.",
            items: [
              "Quality assessment of clean and alternative energy sources such as biomass briquettes and coal briquettes.",
              "Performance testing of energy systems and technologies such as ovens, furnaces, solar PV, boilers and cooking stoves, using national and international protocols and standards.",
              "Renewable energy technology development, including solar PV, wind and biogas.",
            ],
          },
          {
            label: "Energy management and auditing",
            text: "It helps industries and organisations monitor, control and optimise energy use so they conserve energy and reduce costs.",
            items: [
              "Support for industries and businesses to adopt an Energy Management System (EnMS) in line with ISO 50001.",
              "Energy audits that identify cost-effective ways to reduce energy use, including measurement and verification while recommendations are implemented.",
            ],
          },
          {
            label: "Community energy applications",
            items: [
              "Solar dryers for rural community applications.",
              "Improved cook stoves to replace traditional stoves in rural communities.",
            ],
          },
          {
            label: "Project management",
            text: "The division manages energy projects from pre-feasibility studies through to commissioning of sustainable energy projects.",
          },
        ],
      },
      {
        title: "Training and skills development",
        items: [
          "Skills development and capacity building for industrialists in energy materials selection.",
          "Capacity building in quality assessment of energy systems and technologies.",
          "Training and awareness for SMEs and industrialists on producing clean energy technologies.",
          "Training and awareness on energy management practices: energy auditing, energy conservation, energy efficiency and renewable energy.",
        ],
      },
    ],
  },
  {
    slug: "materials",
    title: "Material Science and Technologies Division",
    group: "Engineering Development",
    blurb: "Materials testing, characterization and development of local materials.",
    head: "Eng. Liberatus Chizuzu",
    headRole: "Head of Material Science and Technologies Section",
    headPhoto: "/media/administration/liberatus-chizuzu.png",
    body: [
      "The division develops and specifies materials by cost and performance, understands the limits of a material and how its properties change, and creates new materials with better properties. Materials covered include metals, ceramics, polymers, biomaterials and composites.",
    ],
    panels: [
      {
        title: "Research and development",
        points: [
          {
            label: "Metallurgical research",
            items: [
              "Introduction of secondary metallurgy practices in steel rolling mills and foundries.",
              "Development of sponge iron for rolling mills and foundries.",
            ],
          },
          {
            label: "Coke for iron and steel",
            items: [
              "Characterization of coking coal.",
              "Coal blending.",
              "Coal for coke technologies.",
            ],
          },
        ],
      },
      {
        title: "Inspection services and consultancy",
        intro: "The division has portable equipment and instruments for non-destructive testing.",
        points: [
          {
            label: "Destructive testing",
            text: "Destructive testing finds the exact point of failure of materials, components or machines. The tested item is stressed until it deforms or breaks, so tested parts cannot be reused in regular operation.",
            items: [
              "Hardness testing.",
              "Tensile (elongation) testing.",
              "Torsion testing.",
            ],
          },
          {
            label: "Non-destructive testing",
            text: "Non-destructive testing identifies defects and examines material and structural properties without causing damage. Methods in standard use in civil, aeronautical and systems engineering include ultrasonic testing, magnetic particle inspection, liquid penetrant testing, radiographic testing, remote visual inspection and eddy-current testing.",
            items: [
              "Eddy-current testing.",
              "Eddy-current inspection.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "textile-leather",
    title: "Textile and Leather Technologies Division",
    group: "Engineering Development",
    blurb: "Textile, leather and garment technology and quality improvement.",
    head: "Eng. Athanas Ntawanga",
    headRole: "Head of Textile and Leather Technologies Division",
    body: [
      "The Textile and Leather Technologies Division develops cleaner, competitive technologies for textile and leather production, assures quality along the textile and leather value chain, and adds value to leather and textile waste.",
    ],
    panels: [
      {
        title: "Research and development",
        items: [
          "Product development using collagen and natural fibres.",
          "Leather and textile product development.",
          "Non-woven fabric production technologies.",
          "Woven fabric structure design.",
          "Development of organic materials for the textile and leather industries.",
          "Production optimisation for the textile and leather industries.",
        ],
      },
      {
        title: "Consultancies",
        items: [
          "Yarn, fabric and leather quality assurance.",
          "Laboratory services for textile and leather materials.",
          "Research on the latest textile machine technologies.",
          "Training in leather, spinning and weaving production.",
          "Training in the use of semi-leather recycling.",
          "Hand-loom production.",
          "Turn-key consultancy for textile and leather industries, including Karanga Leather Industries.",
        ],
      },
    ],
  },
  {
    slug: "ict",
    title: "Information & Communication Technologies Division",
    group: "ICT & Technology Development",
    blurb: "Software systems, cybersecurity, networks and industrial ICT solutions.",
    head: "Ms. Elizabeth Mtegwa",
    headRole: "Head of ICT Section",
    headPhoto: "/media/administration/elizabeth-mtegwa.jpg",
    body: [
      "The division provides expertise and services on the application of ICT within TIRDO, and technical advice and support to industries and other stakeholders on ICT issues.",
    ],
    panels: [
      {
        title: "Research and development",
        items: [
          "Cybersecurity and forensics.",
          "Sensor applications.",
          "Mobile applications.",
          "E-waste management.",
        ],
      },
      {
        title: "Consultancies",
        items: [
          "Industrial research, innovation and technology databases.",
          "Use of ICT in SME operations.",
          "Advanced computer applications in teaching.",
          "Ideation portal.",
        ],
      },
    ],
  },
  {
    slug: "instrumentation",
    title: "Electronics & Instrumentation Technologies Division",
    group: "ICT & Technology Development",
    blurb: "Design, calibration and maintenance of scientific instruments.",
    head: "Ms. Ester Lazaro",
    headRole: "Head of Electronics and Instrumentation Technology Section",
    headPhoto: "/media/administration/ester-lazaro.png",
    body: [
      "The division develops, controls and transfers technical expertise in electronics and instrumentation to meet the changing needs of industry. Its work covers electronic circuit design, simulation, testing, calibration and maintenance of electronic devices.",
      "Mission: to ensure measurements taken by instruments are accurate and reliable.",
      "Vision: to become a centre of excellence in instrumentation and electronics for industrial research.",
    ],
    panels: [
      {
        title: "What the division does",
        points: [
          {
            label: "Electronics design",
            text: "Circuit design selects and connects physical devices so they meet performance and environmental specifications, including work that supports digital transformation.",
          },
          {
            label: "Calibration",
            text: "Instruments are configured so results stay within an acceptable range, and factors that cause inaccurate measurements are reduced or removed.",
            items: [
              "Mechanical calibration.",
              "Electrical calibration.",
              "Pipette calibration.",
              "Flow calibration.",
              "Temperature calibration.",
              "Pressure calibration.",
            ],
          },
          {
            label: "Installation and maintenance",
            text: "The section installs, maintains and repairs electronic equipment — circuits, components and related systems used in communications, telemetering, power systems, metering and remote control — so laboratory and industrial processes can be maintained, prevented from failing, improved and managed.",
            items: [
              "Analytical instruments, including HPLCs and gas chromatographs.",
              "Dissolution instrumentation and UV-VIS.",
              "Spectrophotometers.",
              "TOC analysers.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "technology-transfer",
    title: "Technology Transfer and Pilot Plants Division",
    group: "ICT & Technology Development",
    blurb: "Commercialization and diffusion of proven technologies to industry.",
    head: "Ms. Martha Mhongole",
    headRole: "Head of Technology Transfer and Pilot Plants Section",
    headPhoto: "/media/administration/martha-mhongole.png",
    body: [
      "The Technology Transfer and Pilot Plants Unit bridges research and practical application. It makes TIRDO's innovations, knowledge and technologies available to users, especially industry, so they can address limits on industrial productivity.",
    ],
    panels: [
      {
        title: "Functions",
        items: [
          "Manage and monitor the technologies, innovations and inventions developed at TIRDO.",
          "Assess the commercial potential of inventions, technologies and research findings.",
          "Identify potential markets, industries and applications for developed technologies and inventions.",
          "Identify and protect intellectual property from research, including patents, copyrights and trademarks.",
          "Conduct market research on the feasibility and demand for new technologies.",
          "Help form start-up companies, with guidance, mentorship and resources for researchers spinning off their innovations.",
          "Foster collaboration between researchers and industry partners.",
          "Train researchers on intellectual property, technology transfer and commercialisation.",
          "Build relationships with partners, investors and industry stakeholders to increase the visibility of TIRDO's innovations.",
        ],
      },
    ],
  },
  {
    slug: "human-resources-administration",
    title: "Human Resources & Admin",
    group: "Human Resources & Admin",
    blurb: "Human resources, administration and estate services that keep TIRDO running.",
    head: "Mr. Emilian S. Bundala",
    headRole: "Director of Human Resource and Administration",
    body: [
      "The Human Resources and Administration Department is led by the Director of Human Resource and Administration. It is organised into the Human Resource Division, the Administration Division and the Estate Division.",
    ],
    sections: [
      { name: "Human Resource Division" },
      { name: "Administration Division" },
      { name: "Estate Division" },
    ],
  },
  {
    slug: "finance",
    title: "Finance",
    group: "Finance",
    blurb: "Financial management, budgeting, accounting and revenue control.",
    head: "Mr. David J. Kisiwa",
    headRole: "Director of Finance",
    body: [
      "The Finance Department provides expertise and services on finance and accounts to the institution.",
    ],
    panels: [
      {
        title: "Functions",
        items: [
          "Coordinate preparation, review and implementation of the Corporate Strategic Plan, action plan and annual budget.",
          "Review management tools such as financial regulations, accounting policy and manuals, and the records, information and data required by public-service policies and regulations.",
          "Develop, examine and evaluate financial and accounting systems and procedures, including financial regulations that keep the system reliable and sound.",
          "Ensure proper accounting and control of revenue and expenditure, and coordinate preparation of the annual financial statements.",
          "Advise on organisational efficiency and business-process improvement, and promote the institution's development programmes and activities.",
          "Provide technical advice on finance and accounts, information and communication technology, estate management and marketing.",
          "Establish and implement a system for managing financial and physical resources.",
          "Ensure proper management of the institution's cash flow.",
          "Coordinate the financial actors around the institution: suppliers, legal and administrative advisers, and tax services.",
          "Ensure cross-cutting issues are addressed in strategic plans and annual work plans.",
        ],
      },
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
  photo: "/media/administration/director.png",
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
    image: `${CI}/cCiap7vvzT3PcCrqVYJe99reAp4pnPJVZ5SnDDBV.jpg`,
  },
];

export type GalleryImage = { src: string; caption: string };
export const galleryImages: GalleryImage[] = [
  { src: `${CI}/fRbUBRaWLBHYVw8U8yG1aRENYr39KbRrvArOp5kQ.jpg`, caption: "Ministry Secretary with the TIRDO Board" },
  { src: `${CI}/uNKy6HRLTxyTlnOfqZlMhXIR8nA6SaMGCDNzTmrq.jpg`, caption: "Deputy Minister's visit to TIRDO" },
  { src: `${CI}/laX5QEVDZMj4dCwh7uxiIy1gerC4jjQOJe3myxs9.jpg`, caption: "Signing of the strategic minerals research agreement" },
  { src: `${NEWS}/Bi9KLvoqbRxTjvSEKZnmGtp9DcH41MmFbkdOLFuV.jpg`, caption: "Hon. Dr. Selemani Jafo visits TIRDO" },
  { src: `${CI}/cCiap7vvzT3PcCrqVYJe99reAp4pnPJVZ5SnDDBV.jpg`, caption: "Non-destructive testing experts at Msalato airport" },
  { src: `${RES}/feHRWQMR9OJXOpyL21RzVcnWNQ9xzn2ATG2RKDLj.jpg`, caption: "Essential oils production research" },
  { src: `${RES}/H1D6ScYYF7ZdoRK9q5V8fxut6gRVKKVeSQaTWjKU.png`, caption: "Biomass briquette production plant" },
  { src: `${RES}/rulXDuQQtR41OMCyxi0UpFChGCupyDdXYHxHEfZz.png`, caption: "Industrial mapping project" },
  { src: `${RES}/oE73KEynZEZ2mPY8pm9YD39qgwsjTVgtHrC44f7q.png`, caption: "Energy efficiency action plan" },
  { src: `${NEWS}/eS05a9Ewg0Zp9bxOaIbmJpkipvJVRhpzToa8Pz1u.jpg`, caption: "TIRDO and STAMICO agreement" },
  { src: `${NEWS}/2KFt3PRz9DRWIww6TBbfl0IcDvKXWfxOAXYHHGah.jpg`, caption: "Alternative charcoal for environmental conservation" },
  { src: "/media/administration/director.png", caption: "Director General, Prof. Mkumbukwa M. A. Mtambo" },
];

// TIRDO management / division heads (from tirdo.or.tz department pages).
export const management: Leader[] = [
  { name: "Prof. Mkumbukwa M. A.", role: "Director General" },
  { name: "Ms. Kunda Sikazwe", role: "Head, Environment & Occupational Safety", photo: "/media/administration/kunda-sikazwe.png" },
  { name: "Dr. Ivy Matoju", role: "Head, Food and Biotechnology" },
  { name: "Ms. Jacqueline Mwendwa", role: "Head, Industrial Chemistry" },
  { name: "Eng. Hossen Iddi Kayumba", role: "Head, Energy Technologies", photo: "/media/administration/hossen-kayumba.png" },
  { name: "Eng. Liberatus Chizuzu", role: "Head, Material Science & Technology", photo: "/media/administration/liberatus-chizuzu.png" },
  { name: "Eng. Athanas Ntawanga", role: "Head, Textile & Leather Technologies" },
  { name: "Ms. Elizabeth Mtegwa", role: "Head, ICT", photo: "/media/administration/elizabeth-mtegwa.jpg" },
  { name: "Ms. Ester Lazaro", role: "Head, Electronics & Instrumentation", photo: "/media/administration/ester-lazaro.png" },
  { name: "Ms. Martha Mhongole", role: "Head, Technology Transfer and Pilot Plants", photo: "/media/administration/martha-mhongole.png" },
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
      name: "ICT & Technology Development Dept.", role: "Director",
      divisions: [
        { name: "Information & Communication Technologies Division", role: "Head" },
        { name: "Electronics & Instrumentation Technologies Division", role: "Head" },
        { name: "Technology Transfer & Pilot Plants Division", role: "Head" },
      ],
    },
    {
      name: "Industrial Research Dept.", role: "Director",
      divisions: [
        { name: "Agro processing Industrial Chemistry Division", role: "Head" },
        { name: "Environmental Technology & Occupational Safety Division", role: "Head" },
        { name: "Food Processing & Biotechnology Division", role: "Head" },
      ],
    },
    {
      name: "Engineering Development Dept.", role: "Director",
      divisions: [
        { name: "Engineering Material Technology Division", role: "Head" },
        { name: "Textile & Leather Technologies Division", role: "Head" },
        { name: "Energy Technology Division", role: "Head" },
      ],
    },
    {
      name: "Human Resources & Admin Dept.", role: "Director",
      divisions: [
        { name: "Human Resource Division", role: "Head", items: ["Personnel", "Training"] },
        { name: "Administration Division", role: "Head", items: ["Office Mgt", "Transport", "Maintenance", "Security"] },
        { name: "Estate Division", role: "Head", items: ["Building & Estate Maintenance", "Carpentry"] },
      ],
    },
    {
      name: "Finance Dept.", role: "Director",
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
export type ManagementUnit = { slug: string; name: string; desc: string; head?: string; photo?: string };
export const managementUnits: ManagementUnit[] = [
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
    { name: "Innovasie", description: "Custom software development, cybersecurity and marketing, building digital products for healthcare, legal and communications across Africa.", logo: "/media/partners/innovasie.png", href: "https://www.tirdo.or.tz/en/innovasie" },
    { name: "Ammacom (AwamuPay)", description: "A creative digital agency offering mobile apps, custom software, digital marketing, web design and mobile-money integration.", logo: "/media/partners/ammacom.png", href: "https://www.tirdo.or.tz/en/awamupay" },
    { name: "Albetus Technologies", description: "ICT solutions provider delivering infrastructure design, software development, cloud solutions and security systems.", logo: "/media/partners/albetus.png", href: "https://www.tirdo.or.tz/en/albetus" },
    { name: "Bivatek Africa", description: "East African technology company behind BIVA CHUO (student loans) and BIVA VOCHA (digital vouchers), plus cybersecurity and web services.", logo: "/media/partners/bivatek.png", href: "https://www.tirdo.or.tz/en/bivatekafrica" },
    { name: "Amani Solar", description: "Manufactures solar-powered household lighting for off-grid communities — a clean alternative to candles and kerosene.", logo: "/media/partners/amani-solar.png", href: "https://www.tirdo.or.tz/en/amanisolar" },
    { name: "Olas", description: "An early-stage venture incubated at TIRDO's T-Hub, developing technology solutions for Tanzanian industry.", href: "https://www.tirdo.or.tz/en/olas" },
  ] as Company[],
};

// -----------------------------------------------------------------------
// Structured taxonomies & content model (research areas, vacancies, tenders)
// -----------------------------------------------------------------------

export type ResearchArea = { slug: string; name: string };

// Research areas used to classify projects and publications.
export const researchAreas: ResearchArea[] = [
  { slug: "energy", name: "Energy" },
  { slug: "environment", name: "Environment & Climate" },
  { slug: "food-biotechnology", name: "Food & Biotechnology" },
  { slug: "materials", name: "Materials & Engineering" },
  { slug: "industrial-chemistry", name: "Industrial Chemistry" },
  { slug: "ict", name: "ICT & Electronics" },
  { slug: "technology-transfer", name: "Technology Transfer" },
];

// Derive a project's research area from its (possibly free-text) department.
export function projectAreaSlug(p: Project): string | undefined {
  if (p.researchArea) return p.researchArea;
  const d = p.department.toLowerCase();
  if (d.includes("energy")) return "energy";
  if (d.includes("environment")) return "environment";
  if (d.includes("food") || d.includes("biotech")) return "food-biotechnology";
  if (d.includes("material")) return "materials";
  if (d.includes("chemistry")) return "industrial-chemistry";
  if (d.includes("information") || d.includes("ict") || d.includes("communication") || d.includes("electronic")) return "ict";
  if (d.includes("transfer")) return "technology-transfer";
  return undefined;
}

export function researchAreaName(slug: string | undefined): string | undefined {
  return researchAreas.find((a) => a.slug === slug)?.name;
}

export type Vacancy = {
  slug: string;
  title: string;
  department: string;
  category: string; // Professional | Technical | Administrative | Internship
  location: string;
  description: string;
  body?: string[];
  postedDate: string;
  closingDate: string;
  applyUrl?: string;
};

export type Tender = {
  slug: string;
  title: string;
  reference: string;
  category: string; // Goods | Works | Services | Consultancy
  description: string;
  postedDate: string;
  closingDate: string;
  documentUrl?: string;
};

// Sample vacancies (replaced by CMS content when available). Closing dates
// drive the open/closed status via isOpen().
export const vacancies: Vacancy[] = [
  {
    slug: "research-officer-energy",
    title: "Research Officer II — Energy Technology",
    department: "Energy Technology Division",
    category: "Professional",
    location: "Dar es Salaam",
    description: "Support applied research on energy efficiency, renewable energy and cleaner production for Tanzanian industry.",
    body: [
      "Conduct laboratory and field research on energy technologies and industrial energy efficiency.",
      "Prepare technical reports, proposals and publications; support consultancy and energy-audit assignments.",
    ],
    postedDate: "2026-08-20",
    closingDate: "2026-09-30",
    applyUrl: "https://portal.ajira.go.tz",
  },
  {
    slug: "laboratory-technician",
    title: "Laboratory Technician II",
    department: "Environmental Technology & Occupational Safety Division",
    category: "Technical",
    location: "Dar es Salaam",
    description: "Carry out sample preparation and analytical testing in TIRDO's accredited laboratories.",
    body: [
      "Prepare samples and operate analytical instruments under quality-assured procedures.",
      "Maintain laboratory records and support accreditation and calibration activities.",
    ],
    postedDate: "2026-08-20",
    closingDate: "2026-09-15",
    applyUrl: "https://portal.ajira.go.tz",
  },
  {
    slug: "ict-officer",
    title: "ICT Officer II",
    department: "Information & Communication Technologies Division",
    category: "Professional",
    location: "Dar es Salaam",
    description: "Support TIRDO's information systems, network infrastructure and digital services.",
    postedDate: "2026-06-01",
    closingDate: "2026-07-15",
    applyUrl: "https://portal.ajira.go.tz",
  },
];

// Sample tenders (replaced by CMS content when available).
export const tenders: Tender[] = [
  {
    slug: "supply-laboratory-reagents-2026",
    title: "Supply and Delivery of Laboratory Reagents and Consumables",
    reference: "PA/023/2026-2027/HQ/G/01",
    category: "Goods",
    description: "Supply and delivery of laboratory reagents and consumables for TIRDO's analytical laboratories for the 2026/2027 financial year.",
    postedDate: "2026-08-25",
    closingDate: "2026-09-25",
  },
  {
    slug: "office-block-renovation-2026",
    title: "Renovation of Administration Office Block",
    reference: "PA/023/2026-2027/HQ/W/03",
    category: "Works",
    description: "Renovation works for the administration office block at the TIRDO Complex, Msasani.",
    postedDate: "2026-08-10",
    closingDate: "2026-09-20",
  },
  {
    slug: "consultancy-energy-audit-2026",
    title: "Consultancy for Institutional Energy Audit",
    reference: "PA/023/2026-2027/HQ/C/02",
    category: "Consultancy",
    description: "Provision of consultancy services for an institutional energy audit and efficiency improvement plan.",
    postedDate: "2026-05-15",
    closingDate: "2026-06-30",
  },
];

// True when a closing date is today or in the future (drives auto-archive of
// vacancies and tenders once their deadline passes).
export function isOpen(closingDate: string, now: Date = new Date()): boolean {
  const d = new Date(closingDate);
  if (isNaN(d.getTime())) return true;
  // Treat the whole closing day as open (end of day).
  d.setHours(23, 59, 59, 999);
  return d.getTime() >= now.getTime();
}

// -----------------------------------------------------------------------
// Technology catalogue (FR-TECH) — proven TIRDO technologies available for
// transfer, licensing and adoption by industry, SMEs and communities.
// -----------------------------------------------------------------------

export type TechSector = { slug: string; name: string };

export const technologySectors: TechSector[] = [
  { slug: "energy", name: "Energy" },
  { slug: "food-biotechnology", name: "Food & Biotechnology" },
  { slug: "materials", name: "Materials & Engineering" },
  { slug: "environment", name: "Environment" },
  { slug: "textile-leather", name: "Textile & Leather" },
  { slug: "ict", name: "ICT & Digital" },
];

export const technologyMaturities = ["Concept", "Pilot", "Commercial", "Mature"] as const;
export type TechMaturity = (typeof technologyMaturities)[number];

export type Technology = {
  slug: string;
  title: string;
  summary: string;
  sector: string; // technologySectors slug
  maturity: TechMaturity;
  body?: string[];
  benefits?: string[];
  applications?: string[];
  image?: string;
  relatedServiceSlug?: string;
};

export const technologies: Technology[] = [
  {
    slug: "biomass-briquettes",
    title: "Biomass Briquette Production",
    summary: "Converts agricultural and forestry residues into affordable, clean-burning briquettes — a direct substitute for wood charcoal.",
    sector: "energy",
    maturity: "Commercial",
    image: `${RES}/H1D6ScYYF7ZdoRK9q5V8fxut6gRVKKVeSQaTWjKU.png`,
    body: [
      "TIRDO's briquetting technology carbonises and compacts biomass waste — rice husks, sawdust, coffee husks, bagasse and charcoal fines — into uniform briquettes with a high, consistent calorific value. The process covers feedstock preparation, carbonisation, binding, compaction and drying, and can be scaled from community groups to SME production lines.",
      "The technology has been packaged with training, a producers' handbook and start-up support, and is being adopted across Tanzania as a cleaner cooking fuel that reduces deforestation and household emissions.",
    ],
    benefits: [
      "Cuts fuel costs and reliance on wood charcoal",
      "Reduces deforestation and greenhouse-gas emissions",
      "Creates income and jobs along the collection–production chain",
      "Uses locally available agricultural residues",
    ],
    applications: ["Household and institutional cooking", "Bakeries, restaurants and food processors", "Community and SME fuel enterprises"],
    relatedServiceSlug: "training",
  },
  {
    slug: "improved-cook-stoves",
    title: "Improved & Institutional Cook Stoves",
    summary: "Fuel-efficient stove designs matched to briquette and biomass fuels for households and institutions.",
    sector: "energy",
    maturity: "Mature",
    body: [
      "TIRDO designs and tests improved cook stoves that raise combustion efficiency and cut fuel use, indoor smoke and cooking time. Designs range from single-pot household stoves to large institutional stoves for schools and canteens, and are performance-tested in TIRDO's energy laboratory.",
      "The stoves pair naturally with the briquette technology to deliver a complete clean-cooking solution.",
    ],
    benefits: ["Lower fuel consumption and cost", "Reduced indoor air pollution", "Faster, safer cooking"],
    applications: ["Households", "Schools, colleges and institutions", "Restaurants and food vendors"],
  },
  {
    slug: "essential-oils",
    title: "Essential Oils Extraction",
    summary: "Improved steam-distillation and extraction technology that turns local botanicals into high-value essential oils.",
    sector: "food-biotechnology",
    maturity: "Commercial",
    image: `${RES}/feHRWQMR9OJXOpyL21RzVcnWNQ9xzn2ATG2RKDLj.jpg`,
    body: [
      "TIRDO has developed and optimised extraction technology for producing essential oils from locally grown botanicals, improving yield and product quality while linking farmers to industrial buyers. The package covers raw-material handling, distillation, quality testing and value-chain linkage.",
    ],
    benefits: ["Adds value to local agricultural crops", "Opens export and cosmetics-industry markets", "Raises farmer incomes"],
    applications: ["Cosmetics and personal care", "Food flavouring and fragrance", "Pharmaceutical inputs"],
  },
  {
    slug: "mushroom-spawn",
    title: "Mushroom Spawn Production",
    summary: "Laboratory production of high-quality mushroom spawn supplied to farmers to support commercial mushroom cultivation.",
    sector: "food-biotechnology",
    maturity: "Commercial",
    body: [
      "TIRDO's biotechnology laboratory produces clean, high-viability mushroom spawn and provides the accompanying cultivation know-how, supporting a growing mushroom-farming sector as a source of nutrition and income.",
    ],
    benefits: ["Reliable, contamination-free spawn supply", "Supports nutrition and household income", "Backed by TIRDO cultivation training"],
    applications: ["Smallholder and commercial mushroom farms", "Agribusiness and food SMEs"],
  },
  {
    slug: "leather-processing",
    title: "Leather Processing & Tanning Technology",
    summary: "Cleaner tanning, finishing and leather-goods techniques that add value to Tanzania's hides and skins.",
    sector: "textile-leather",
    maturity: "Mature",
    body: [
      "TIRDO's textile and leather division develops and transfers cleaner leather-processing and tanning technologies, quality-assurance methods and leather-goods techniques, adding value to hides and skins while reducing the environmental load of the tanning process.",
    ],
    benefits: ["Higher-value finished leather", "Cleaner, lower-effluent processing", "Skills for artisans and SMEs"],
    applications: ["Tanneries and leather-goods makers", "Cottage and SME leather enterprises"],
    relatedServiceSlug: "consultancy",
  },
  {
    slug: "ndt-services",
    title: "Non-Destructive Testing (NDT)",
    summary: "Ultrasonic, radiographic, magnetic-particle and penetrant inspection of welds, pipelines and pressure vessels.",
    sector: "materials",
    maturity: "Commercial",
    image: `${CI}/cCiap7vvzT3PcCrqVYJe99reAp4pnPJVZ5SnDDBV.jpg`,
    body: [
      "TIRDO provides a full suite of non-destructive testing to international standards — ultrasonic, radiographic, magnetic-particle, liquid-penetrant, remote-visual and eddy-current inspection — for welded structures, pipelines, pressure vessels and civil and aeronautical applications.",
      "TIRDO has applied this capability on major national assignments, including quality assurance on tens of kilometres of gas pipeline.",
    ],
    benefits: ["Assures structural integrity and safety", "Standards-based, defensible inspection reports", "Avoids costly failures and downtime"],
    applications: ["Oil, gas and pipeline construction", "Manufacturing and fabrication", "Infrastructure and aviation"],
    relatedServiceSlug: "consultancy",
  },
  {
    slug: "coal-characterization",
    title: "Coal Characterization & Beneficiation",
    summary: "Proximate, ultimate and calorific analysis and beneficiation guidance from the national coal reference laboratory.",
    sector: "materials",
    maturity: "Mature",
    body: [
      "Declared the national backstop reference laboratory for coal-quality assessment, TIRDO characterises coal for proximate, ultimate and heating-value parameters and advises on beneficiation and industrial use, supporting the mining and energy sectors.",
    ],
    benefits: ["Authoritative national reference testing", "Informs coal use, pricing and beneficiation", "Supports mining and energy investment"],
    applications: ["Mining companies", "Cement, steel and power industries", "Regulators and investors"],
    relatedServiceSlug: "laboratory",
  },
  {
    slug: "plastic-recycling",
    title: "Plastic Waste Recycling",
    summary: "Collection, sorting and reprocessing technology that turns plastic waste into usable raw material and products.",
    sector: "environment",
    maturity: "Commercial",
    body: [
      "Developed with UNIDO, TIRDO's plastic-recycling technology covers collection, sorting, washing, shredding and reprocessing of plastic waste into usable material, and has been transferred through training to hundreds of people, creating jobs across the recycling value chain.",
    ],
    benefits: ["Diverts plastic from the environment", "Creates recycling-chain jobs and enterprises", "Supplies low-cost recycled raw material"],
    applications: ["Waste-management enterprises", "Plastic-product manufacturers", "Municipal and community recyclers"],
  },
  {
    slug: "onsite-wastewater-treatment",
    title: "Onsite Wastewater Treatment",
    summary: "Cleaner-production and onsite wastewater-treatment systems for the leather, textile and food industries.",
    sector: "environment",
    maturity: "Pilot",
    body: [
      "TIRDO researches and deploys conventional and onsite wastewater-treatment approaches and cleaner-production methods that add value to industrial waste streams while reducing pollution loads from tanneries, textile mills and food processors.",
    ],
    benefits: ["Meets effluent and environmental standards", "Recovers value from waste streams", "Reduces pollution and compliance risk"],
    applications: ["Tanneries and textile mills", "Food and beverage processors", "Industrial estates"],
    relatedServiceSlug: "laboratory",
  },
  {
    slug: "gs1-traceability",
    title: "GS1 Product Traceability Systems",
    summary: "Barcode-based traceability across agro value chains, from farm to market, underpinning quality and export readiness.",
    sector: "ict",
    maturity: "Commercial",
    body: [
      "TIRDO implemented traceability systems across agricultural value chains — coffee, cashew, tea and seafood — work that led to the establishment of GS1 Tanzania and barcode-based traceability for Tanzanian products, improving quality assurance and export competitiveness.",
    ],
    benefits: ["Farm-to-market traceability", "Improves export readiness and trust", "Supports recalls and quality control"],
    applications: ["Agro-exporters and cooperatives", "Food and beverage manufacturers", "Retail and logistics"],
    relatedServiceSlug: "consultancy",
  },
  {
    slug: "industrial-energy-management",
    title: "Industrial Energy Management (ISO 50001)",
    summary: "Energy-audit and management-system methodology that helps plants cut energy cost and carbon.",
    sector: "energy",
    maturity: "Mature",
    image: `${RES}/oE73KEynZEZ2mPY8pm9YD39qgwsjTVgtHrC44f7q.png`,
    body: [
      "TIRDO helps industry implement energy management aligned to ISO 50001 — baseline audits, performance testing of ovens, boilers, furnaces and solar systems, target-setting and monitoring — cutting energy costs and emissions across Tanzanian industry.",
    ],
    benefits: ["Lower energy cost and carbon footprint", "Certified, standards-based audits", "Actionable efficiency roadmap"],
    applications: ["Manufacturing plants", "Commercial buildings", "Institutions and utilities"],
    relatedServiceSlug: "energy-auditing",
  },
];

export function technologySectorName(slug: string | undefined): string | undefined {
  return technologySectors.find((s) => s.slug === slug)?.name;
}

// -----------------------------------------------------------------------
// Laboratory services (FR-LAB) — accredited testing, with a gateway to the
// National Industrial Laboratory Information Management System (NILIMS).
// -----------------------------------------------------------------------

export type LabGroup = { name: string; tests: string[] };

export const laboratory: {
  intro: string[];
  accreditation: string;
  groups: LabGroup[];
  process: { title: string; text: string }[];
} = {
  intro: [
    "TIRDO operates specialised, standards-based laboratories serving industry, government, SMEs and the public. Testing spans food and microbiology, industrial chemistry, materials, energy and the environment — supporting quality assurance, regulatory compliance and product development.",
    "Samples and results are managed through NILIMS, TIRDO's National Industrial Laboratory Information Management System, which lets clients register samples, track progress and receive results online.",
  ],
  accreditation:
    "TIRDO's food laboratory has operated since 1995 and has been accredited since 2009. Laboratories work to recognised international standards (including ISO/IEC 17025 methods) with quality-assured procedures, calibrated instruments and qualified analysts.",
  groups: [
    { name: "Food & Microbiology", tests: ["Physicochemical testing of food", "Microbiological testing (fish, cereals, legumes, meat, dairy, honey)", "Water-quality determination", "Micronutrient and proximate analysis"] },
    { name: "Industrial & Analytical Chemistry", tests: ["Physicochemical quality of raw materials and products", "Heavy-metals analysis", "Micronutrients in food, fertilizers and salt", "Industrial-waste characterization"] },
    { name: "Materials & Engineering", tests: ["Destructive testing (hardness, tensile, torsion)", "Non-destructive testing (UT, RT, MT, PT, eddy-current)", "Coal proximate, ultimate and calorific analysis"] },
    { name: "Energy", tests: ["Industrial energy audits", "Performance testing of ovens, boilers, furnaces and solar systems", "Fuel and biomass calorific testing"] },
    { name: "Environment & Occupational Safety", tests: ["Air quality (particulates, gases, emissions)", "Noise, light and vibration", "Wastewater and potable-water analysis", "Environmental impact assessment and audit"] },
  ],
  process: [
    { title: "Register the sample", text: "Create a request in NILIMS (or at the TIRDO front desk) describing the sample and tests required." },
    { title: "Submit & pay", text: "Deliver the sample to TIRDO; a job number and cost estimate are issued and tracked in NILIMS." },
    { title: "Analysis", text: "Accredited analysts run the requested tests under quality-assured procedures." },
    { title: "Receive results", text: "Download the test report from NILIMS or collect a certified copy from TIRDO." },
  ],
};

// -----------------------------------------------------------------------
// Consultancy & advisory (FR-CON) — technical advisory service lines, with a
// gateway to CIAP (the Consultancy & Industrial Advisory Portal).
// -----------------------------------------------------------------------

export const consultancy: {
  intro: string[];
  lines: { title: string; description: string; icon: string }[];
  process: { title: string; text: string }[];
} = {
  intro: [
    "TIRDO is a multidisciplinary technical partner to industry, government and development partners — combining accredited laboratories, engineering expertise and decades of field experience to solve real industrial problems.",
    "Consultancy engagements are requested and managed through CIAP, TIRDO's Consultancy & Industrial Advisory Portal, which handles the workflow from client request through proposal, delivery and closure.",
  ],
  lines: [
    { title: "Quality Assurance & NDT", description: "Non-destructive testing and inspection of welds, pipelines and pressure vessels to international standards.", icon: "ShieldCheck" },
    { title: "Energy Audits & Efficiency", description: "Certified industrial energy audits, performance testing and ISO 50001 energy-management support.", icon: "Zap" },
    { title: "Feasibility & Investment Studies", description: "Technical and economic feasibility for new ventures and expansions, with risk and market analysis.", icon: "ClipboardCheck" },
    { title: "Environmental Services", description: "Environmental monitoring, impact assessment and audits, and cleaner-production advice.", icon: "Leaf" },
    { title: "Materials & Process Engineering", description: "Materials selection, characterization and process improvement for manufacturers.", icon: "Cog" },
    { title: "Food Safety & Analysis", description: "Microbiological and physicochemical testing and food-safety systems (GMP, GHP, HACCP).", icon: "TestTube" },
  ],
  process: [
    { title: "Submit a request", text: "Describe your requirement through CIAP or the enquiry form." },
    { title: "Scoping & proposal", text: "TIRDO experts scope the work and issue a technical and cost proposal." },
    { title: "Delivery", text: "A multidisciplinary team delivers the assignment, backed by accredited laboratories." },
    { title: "Report & closure", text: "You receive an actionable technical report; the engagement is closed out in CIAP." },
  ],
};

// -----------------------------------------------------------------------
// Training & skills development (FR-TRN) — short-course catalogue, with a
// gateway to TeLTP (the TIRDO e-Learning & Training Platform).
// -----------------------------------------------------------------------

export type Course = { title: string; area: string; duration: string; mode: string; description: string };

export const training: {
  intro: string[];
  courses: Course[];
  process: { title: string; text: string }[];
} = {
  intro: [
    "TIRDO delivers tailored short courses and capacity-building programmes for industrialists, SMEs and the public, combining laboratory capability with practical field experience to build skills that improve productivity, quality and safety.",
    "Courses are published, and enrolment managed, through TeLTP — the TIRDO e-Learning & Training Platform — which hosts schedules, registration and learning materials.",
  ],
  courses: [
    { title: "Biomass Briquette Production", area: "Energy", duration: "3–5 days", mode: "Hands-on", description: "Producing clean-burning briquettes from agricultural residues as an alternative to charcoal." },
    { title: "Industrial Energy Efficiency", area: "Energy", duration: "3 days", mode: "Classroom + plant", description: "Energy auditing, ISO 50001 concepts and practical efficiency measures for industry." },
    { title: "Food Processing, Safety & HACCP", area: "Food & Biotechnology", duration: "5 days", mode: "Classroom + lab", description: "GMP, GHP and HACCP for safe, compliant food processing and packaging." },
    { title: "Non-Destructive Testing (NDT)", area: "Materials", duration: "5–10 days", mode: "Hands-on", description: "Ultrasonic, radiographic, magnetic-particle and penetrant inspection techniques." },
    { title: "Leather, Spinning & Weaving", area: "Textile & Leather", duration: "5 days", mode: "Hands-on", description: "Leather production, hand-loom spinning and weaving technologies for artisans and SMEs." },
    { title: "Environmental Monitoring & Compliance", area: "Environment", duration: "3 days", mode: "Classroom + field", description: "Air, water and noise monitoring and environmental compliance for industry." },
  ],
  process: [
    { title: "Browse courses", text: "Find scheduled and on-demand short courses on TeLTP." },
    { title: "Register", text: "Enrol and pay online, or request a customised in-house course." },
    { title: "Learn", text: "Attend hands-on and classroom sessions backed by TIRDO's laboratories and experts." },
    { title: "Get certified", text: "Receive a TIRDO certificate of completion and follow-up support." },
  ],
};

// -----------------------------------------------------------------------
// Stakeholder feedback & Customer Service Charter (TIRDO Stakeholders
// Relation Management System). Feedback submissions are stored in the CMS
// 'feedback' type; the charter below is institutional content.
// -----------------------------------------------------------------------

// Service areas a stakeholder can give feedback on (feedback form dropdown).
export const serviceAreas: string[] = [
  "Research",
  "Energy Auditing",
  "Feasibility Studies",
  "Consultancy & Advisory",
  "Laboratory Services",
  "Training & Skills Development",
  "Technology Transfer",
  "Industrial Information Centre",
  "General / Other",
];

export const feedbackTypes = ["Compliment", "Complaint", "Suggestion", "Enquiry"] as const;
export type FeedbackType = (typeof feedbackTypes)[number];

export type CharterStandard = { service: string; standard: string; turnaround: string };

export const serviceCharter: {
  intro: string[];
  standards: CharterStandard[];
  rights: string[];
  responsibilities: string[];
} = {
  intro: [
    "This Customer Service Charter sets out the standards of service that stakeholders — industry, government, SMEs, development partners and the public — can expect from the Tanzania Industrial Research and Development Organization (TIRDO), and how we measure and improve our services through your feedback.",
    "TIRDO is committed to timely, professional and courteous service. Where we fall short of these standards, we want to know — your feedback drives how we improve.",
  ],
  standards: [
    { service: "General enquiries", standard: "Acknowledge every enquiry and respond with the information requested or a clear next step.", turnaround: "Within 3 working days" },
    { service: "Service & consultancy requests", standard: "Acknowledge the request and issue a technical and cost proposal.", turnaround: "Within 7 working days" },
    { service: "Laboratory testing (NILIMS)", standard: "Register the sample, confirm the job and cost, and issue results on completion.", turnaround: "Results within 10–21 working days by test type" },
    { service: "Training enrolment (TeLTP)", standard: "Confirm registration and share the schedule and joining details.", turnaround: "Within 5 working days" },
    { service: "Tender & procurement queries", standard: "Respond to clarifications during the tender window.", turnaround: "Within 3 working days" },
    { service: "Complaints", standard: "Acknowledge the complaint, investigate, and communicate the outcome.", turnaround: "Acknowledge in 2 days; resolve within 14 working days" },
  ],
  rights: [
    "Be served promptly, professionally and with courtesy.",
    "Receive accurate information and a clear explanation of fees and timelines.",
    "Have your work handled confidentially and to recognised standards.",
    "Give feedback or complain without prejudice, and receive a response.",
    "Be served in English or Kiswahili.",
  ],
  responsibilities: [
    "Provide complete and accurate information with your request.",
    "Meet agreed timelines, fees and sample or document requirements.",
    "Treat TIRDO staff with courtesy.",
    "Use the feedback channels to help us improve.",
  ],
};
