'use strict';

// Demo content seeded on first boot. Mirrors the frontend fallback so the
// live site and the CMS-backed site look identical out of the box.
module.exports = {
  'api::service.service': [
    { title: 'Contract Research', slug: 'research', icon: 'FlaskConical', description: 'Custom applied research for industry, government and development partners.' },
    { title: 'Energy Auditing', slug: 'energy-auditing', icon: 'Zap', description: 'Certified energy audits that cut costs and emissions across industrial plants.' },
    { title: 'Feasibility Studies', slug: 'feasibility-studies', icon: 'ClipboardCheck', description: 'Technical and economic feasibility for new industrial ventures and expansions.' },
    { title: 'Consultancy', slug: 'consultancy', icon: 'Users', description: 'Expert advisory in engineering, environment, materials and process improvement.' },
    { title: 'Laboratory & Testing', slug: 'laboratory', icon: 'TestTube', description: 'Accredited testing of materials, food, water, textiles and industrial products.' },
    { title: 'Training', slug: 'training', icon: 'GraduationCap', description: 'Tailored short courses and capacity building for industry professionals.' },
  ],

  'api::department.department': [
    { title: 'Environment', slug: 'environment', group: 'Industry & Research', blurb: 'Environmental monitoring, pollution control and cleaner production.' },
    { title: 'Food & Biotechnology', slug: 'food-biotechnology', group: 'Industry & Research', blurb: 'Food processing, preservation, value addition and bioprocess research.' },
    { title: 'Industrial Chemistry', slug: 'industrial-chemistry', group: 'Industry & Research', blurb: 'Chemical analysis, formulation and process chemistry for industry.' },
    { title: 'Energy', slug: 'energy', group: 'Engineering Development', blurb: 'Renewable energy, energy efficiency and industrial energy systems.' },
    { title: 'Material Science & Technology', slug: 'materials', group: 'Engineering Development', blurb: 'Materials testing, characterization and development of local materials.' },
    { title: 'Textile & Leather', slug: 'textile-leather', group: 'Engineering Development', blurb: 'Textile, leather and garment technology and quality improvement.' },
    { title: 'ICT', slug: 'ict', group: 'ICT & Technology Development', blurb: 'Software systems, digitalization and industrial ICT solutions.' },
    { title: 'Instrumentation', slug: 'instrumentation', group: 'ICT & Technology Development', blurb: 'Design, calibration and maintenance of scientific instruments.' },
    { title: 'Technology Transfer', slug: 'technology-transfer', group: 'ICT & Technology Development', blurb: 'Commercialization and diffusion of proven technologies to industry.' },
  ],

  'api::project.project': [
    { title: 'Essential Oils Extraction', slug: 'essential-oils', department: 'Food & Biotechnology', status: 'Featured', summary: 'Improved steam-distillation technology for high-value essential oils from local botanicals.' },
    { title: 'Biomass Briquettes', slug: 'biomass-briquettes', department: 'Energy', status: 'Featured', summary: 'Converting agro-waste into affordable, clean-burning fuel briquettes.' },
    { title: 'Local Leather Finishing', slug: 'leather-finishing', department: 'Textile & Leather', status: 'Ongoing', summary: 'Upgrading Tanzanian leather quality for the export garment and footwear industry.' },
    { title: 'Low-cost Water-Quality Sensors', slug: 'water-quality-sensors', department: 'Instrumentation', status: 'Ongoing', summary: 'Instrumentation for real-time monitoring of industrial effluent and drinking water.' },
  ],

  'api::publication.publication': [
    { title: 'TIRDO Annual Report 2025', slug: 'annual-report-2025', type: 'Report', year: 2025 },
    { title: 'Guideline on Cleaner Production for SMEs', slug: 'cleaner-production-guideline', type: 'Guideline', year: 2025 },
    { title: 'Policy Brief: Industrial Energy Efficiency', slug: 'industrial-energy-brief', type: 'Policy Brief', year: 2024 },
    { title: 'Journal of Industrial Research, Vol. 12', slug: 'materials-journal-v12', type: 'Journal', year: 2024 },
  ],

  'api::article.article': [
    { title: 'TIRDO commissions improved biomass briquette production line', slug: 'tirdo-launches-biomass-briquette-line', category: 'Research', date: '2026-08-18', excerpt: 'A new briquetting line turns agricultural residues into clean cooking fuel, cutting deforestation and creating rural jobs.', body: 'TIRDO has commissioned a new biomass briquetting line as part of its work on clean energy and value addition from agricultural residues.' },
    { title: 'Essential oils project boosts value addition for local farmers', slug: 'essential-oils-value-addition', category: 'Innovation', date: '2026-07-30', excerpt: "TIRDO's essential-oils research links smallholder growers to industrial buyers through improved extraction technology.", body: 'The essential oils programme connects farmers to markets through improved steam distillation technology developed at TIRDO.' },
    { title: 'TIRDO signs energy-auditing partnership with manufacturers', slug: 'energy-audit-partnership', category: 'Partnership', date: '2026-07-12', excerpt: 'The agreement will see certified energy audits rolled out across dozens of factories in the Dar es Salaam industrial belt.', body: 'TIRDO signed an agreement to deliver certified energy audits to manufacturers across the Dar es Salaam industrial belt.' },
    { title: 'T-Hub graduates its third cohort of industrial startups', slug: 't-hub-cohort-graduation', category: 'T-Hub', date: '2026-06-25', excerpt: 'Six ventures completed the incubation programme, with technologies spanning food processing, ICT and clean energy.', body: 'The T-Hub innovation centre graduated six industrial startups in its third cohort.' },
  ],

  'api::page.page': [
    { title: 'Mission & Vision', slug: 'mission-vision', body: 'Vision: To be a centre of excellence in industrial research. Mission: To carry out applied industrial research and provide technological services that add value to national resources.' },
  ],
};
