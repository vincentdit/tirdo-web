'use strict';

// Real TIRDO content (sourced from tirdo.or.tz) seeded on first boot.
const CI = 'https://www.tirdo.or.tz/storage/carousel-items';
const RES = 'https://www.tirdo.or.tz/storage/resources';
const NEWS = 'https://www.tirdo.or.tz/storage/news';
const PUB = 'https://www.tirdo.or.tz/storage/publications';

module.exports = {
  'api::service.service': [
    { title: 'Research', slug: 'research', icon: 'FlaskConical', description: 'Applied and contract industrial research for industry, government and development partners.' },
    { title: 'Energy Auditing', slug: 'energy-auditing', icon: 'Zap', description: 'Certified industrial energy audits that cut costs and emissions across plants.' },
    { title: 'Feasibility Studies', slug: 'feasibility-studies', icon: 'ClipboardCheck', description: 'Technical and economic feasibility for new industrial ventures and expansions.' },
    { title: 'Consultancy & Technical Services', slug: 'consultancy', icon: 'Users', description: 'Expert advisory in engineering, environment, materials and process improvement.' },
    { title: 'Laboratory Analytical Services', slug: 'laboratory', icon: 'TestTube', description: 'Accredited testing and analysis of materials, food, water, textiles and industrial products.' },
    { title: 'Training & Skill Development', slug: 'training', icon: 'GraduationCap', description: 'Tailored short courses and capacity building for industry professionals.' },
  ],

  'api::department.department': [
    { title: 'Environment', slug: 'environment', group: 'Industry & Research', blurb: 'Environmental monitoring, pollution control and cleaner production.' },
    { title: 'Food & Biotechnology', slug: 'food-biotechnology', group: 'Industry & Research', blurb: 'Food processing, preservation, value addition and bioprocess research.' },
    { title: 'Industrial Chemistry', slug: 'industrial-chemistry', group: 'Industry & Research', blurb: 'Chemical analysis, formulation and process chemistry for industry.' },
    { title: 'Energy', slug: 'energy', group: 'Engineering Development', blurb: 'Renewable energy, energy efficiency and industrial energy systems.' },
    { title: 'Material Science & Technology', slug: 'materials', group: 'Engineering Development', blurb: 'Materials testing, characterization and development of local materials.' },
    { title: 'Textile & Leather Technologies', slug: 'textile-leather', group: 'Engineering Development', blurb: 'Textile, leather and garment technology and quality improvement.' },
    { title: 'ICT', slug: 'ict', group: 'ICT & Technology Development', blurb: 'Software systems, cybersecurity, networks and industrial ICT solutions.' },
    { title: 'Instrumentation', slug: 'instrumentation', group: 'ICT & Technology Development', blurb: 'Design, calibration and maintenance of scientific instruments.' },
    { title: 'Technology Transfer', slug: 'technology-transfer', group: 'ICT & Technology Development', blurb: 'Commercialization and diffusion of proven technologies to industry.' },
  ],

  'api::project.project': [
    { title: 'Essential Oils Production', slug: 'essential-oils', department: 'Food & Biotechnology', status: 'Featured', summary: 'Improved extraction technology to produce high-value essential oils from local botanicals, linking farmers to industrial buyers.', imageUrl: `${RES}/feHRWQMR9OJXOpyL21RzVcnWNQ9xzn2ATG2RKDLj.jpg` },
    { title: 'Biomass Briquette Production', slug: 'biomass-briquettes', department: 'Energy', status: 'Featured', summary: 'Converting agricultural residues into affordable, clean-burning briquettes as an alternative to charcoal.', imageUrl: `${RES}/H1D6ScYYF7ZdoRK9q5V8fxut6gRVKKVeSQaTWjKU.png` },
    { title: 'Industrial Mapping Project', slug: 'industrial-mapping', department: 'Technology Transfer', status: 'Ongoing', summary: "Mapping Tanzania's industries to identify opportunities, gaps and priorities for industrial development.", imageUrl: `${RES}/rulXDuQQtR41OMCyxi0UpFChGCupyDdXYHxHEfZz.png` },
    { title: 'Industrial Energy Efficiency Action Plan', slug: 'energy-efficiency-action-plan', department: 'Energy', status: 'Ongoing', summary: 'EU-supported project developing energy-efficiency action plans to cut costs and emissions in Tanzanian industry.', imageUrl: `${RES}/oE73KEynZEZ2mPY8pm9YD39qgwsjTVgtHrC44f7q.png` },
  ],

  'api::publication.publication': [
    { title: 'TIRDO Financial Statements for the Year Ended 30th June 2025', slug: 'financial-statements-2025', type: 'Financial Report', year: 2025, fileUrl: `${PUB}/eQoyhgUlJc8U0uHefva0m7HnoJNfbnGQR4Xt8Y1K.pdf` },
    { title: 'Cleaner Cooking Solutions: Optimizing Biomass Briquettes to Replace Charcoal and Mitigate Climate Change in Tanzania', slug: 'cleaner-cooking-briquettes', type: 'Research Publication', year: 2025, fileUrl: `${PUB}/kgkHrHRHmlgiGpaliNrZMxskiHS5YGw3xdfb49LE.pdf` },
    { title: 'Biomass Briquettes Production Handbook', slug: 'briquettes-production-handbook', type: 'Technical Handbook', year: 2024, fileUrl: `${PUB}/lE59YikFaoV4aaS21uVayYUuhMfere0HrxalV3bP.pdf` },
    { title: 'Climate Change Adaptation and Mitigation: Profile of Biomass Briquette Producers in Tanzania', slug: 'briquette-producers-profile', type: 'Research Study', year: 2024, fileUrl: `${PUB}/pwagpql6HXK1HkwFEWp331n4DaEdBzFEd1AyKGiq.pdf` },
    { title: 'Climate Change Adaptation and Mitigation: Factors Influencing the Adoption of Biomass Briquettes in Tanzania', slug: 'briquette-adoption-factors', type: 'Research Study', year: 2024, fileUrl: `${PUB}/Tlu2YWpLr1LWpnEUIStuV7Sq8rv2bsJHcfict0S4.pdf` },
    { title: 'TIRDO Profile', slug: 'tirdo-profile', type: 'Organizational Profile', year: 2024, fileUrl: `${PUB}/nvZj843NupUupmJT8zklTIGLloyomwPdZx7zaQ00.pdf` },
    { title: 'TIRDO Financial Statements for the Year Ended 30th June 2024', slug: 'financial-statements-2024', type: 'Financial Report', year: 2024, fileUrl: `${PUB}/GlJkkH6ITUnN4puxePVw9KkYKKFlKWcJdirJ9m08.pdf` },
    { title: 'TIRDO Financial Statements for the Year Ended 30th June 2023', slug: 'financial-statements-2023', type: 'Financial Report', year: 2023, fileUrl: `${PUB}/TIWzfCpIR5FViS8j2huHhAsXcaIcfvxNAQywQ5Px.pdf` },
    { title: 'The Tanzania Industrial Research and Development Organization Act, 1979', slug: 'tirdo-act-1979', type: 'Legislation', year: 1979, fileUrl: `${PUB}/Z00lhvaYrG94XYwS3hDUQBGdMZn6VbTPrcGIWeKr.pdf` },
  ],

  'api::article.article': [
    { title: 'TIRDO and STAMICO sign agreement for strategic minerals research', slug: 'tirdo-stamico-minerals-research-agreement', category: 'Research Collaboration', date: '2025-11-12', excerpt: "TIRDO and the State Mining Corporation (STAMICO) have signed a research collaboration agreement on strategic minerals, strengthening value addition and beneficiation of Tanzania's mineral resources.", body: 'TIRDO and STAMICO signed a collaboration agreement to jointly undertake research on strategic minerals and support value addition and beneficiation of Tanzania’s mineral resources.', imageUrl: `${NEWS}/eS05a9Ewg0Zp9bxOaIbmJpkipvJVRhpzToa8Pz1u.jpg`, sourceUrl: 'https://www.tirdo.or.tz/newsapp/en/article_details/15' },
    { title: 'Hands-on training in alternative charcoal production', slug: 'hands-on-training-alternative-charcoal-production', category: 'Training', date: '2025-10-10', excerpt: 'TIRDO conducted practical training on producing alternative charcoal (biomass briquettes) as a cleaner cooking fuel, supporting jobs and reducing pressure on forests.', body: 'The training equipped participants with practical skills to produce biomass briquettes as a cleaner alternative to wood charcoal.', imageUrl: `${NEWS}/q2cMG2Q6dwvZqhDC5vXf8vJTzX6LT4DBgJKj1OEd.jpg`, sourceUrl: 'https://www.tirdo.or.tz/newsapp/en/article_details/14' },
    { title: 'Alternative charcoal: a pathway to environmental conservation', slug: 'alternative-charcoal-environmental-conservation', category: 'Innovation', date: '2024-10-08', excerpt: "Alternative charcoal is a saviour for the environment. TIRDO's biomass briquette technology offers a sustainable substitute for wood charcoal and helps mitigate climate change.", body: 'TIRDO’s biomass briquette technology provides a sustainable substitute for wood charcoal, conserving forests and mitigating climate change.', imageUrl: `${NEWS}/2KFt3PRz9DRWIww6TBbfl0IcDvKXWfxOAXYHHGah.jpg`, sourceUrl: 'https://www.tirdo.or.tz/newsapp/en/article_details/12' },
    { title: 'Hon. Dr. Selemani Jafo visits TIRDO and directs completion of the industrial opportunities system', slug: 'hon-dr-selemani-jafo-visits-tirdo', category: 'Announcement', date: '2024-07-22', excerpt: 'During a visit to TIRDO, Hon. Dr. Selemani Jafo (MP) directed the completion of the national system for identifying industrial opportunities.', body: 'The Minister toured TIRDO facilities and directed the completion of the national industrial opportunities identification system to better guide investment and value addition.', imageUrl: `${NEWS}/Bi9KLvoqbRxTjvSEKZnmGtp9DcH41MmFbkdOLFuV.jpg`, sourceUrl: 'https://www.tirdo.or.tz/newsapp/en/article_details/11' },
  ],

  'api::page.page': [
    { title: 'Mission & Vision', slug: 'mission-vision', body: 'Vision: To be a centre of excellence in provision of innovative solutions for a competitive industrial sector. Mission: To support the development of competitive and sustainable industries through quality research and professional technical services.' },
  ],
};
