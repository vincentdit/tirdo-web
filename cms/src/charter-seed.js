'use strict';

// Pre-populated Customer Service Charter content (EN + SW) used to seed the
// 'service-charter' single type on first boot (see index.js bootstrap). After
// seeding, management edits it in the CMS. Kept in sync with the frontend
// fallback (frontend/src/lib/content.ts serviceCharter) and the Kiswahili
// draft (docs/translations/sw-content.md).

module.exports = {
  en: {
    intro: [
      { text: "This Customer Service Charter sets out the standards of service that stakeholders — industry, government, SMEs, development partners and the public — can expect from the Tanzania Industrial Research and Development Organization (TIRDO), and how we measure and improve our services through your feedback." },
      { text: "TIRDO is committed to timely, professional and courteous service. Where we fall short of these standards, we want to know — your feedback drives how we improve." },
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
      { text: "Be served promptly, professionally and with courtesy." },
      { text: "Receive accurate information and a clear explanation of fees and timelines." },
      { text: "Have your work handled confidentially and to recognised standards." },
      { text: "Give feedback or complain without prejudice, and receive a response." },
      { text: "Be served in English or Kiswahili." },
    ],
    responsibilities: [
      { text: "Provide complete and accurate information with your request." },
      { text: "Meet agreed timelines, fees and sample or document requirements." },
      { text: "Treat TIRDO staff with courtesy." },
      { text: "Use the feedback channels to help us improve." },
    ],
  },
  sw: {
    intro: [
      { text: "Mkataba huu wa Huduma kwa Wateja unaainisha viwango vya huduma ambavyo wadau — viwanda, serikali, wajasiriamali wadogo na wa kati, washirika wa maendeleo na umma — wanaweza kutegemea kutoka Shirika la Utafiti na Maendeleo ya Viwanda Tanzania (TIRDO), na jinsi tunavyopima na kuboresha huduma zetu kupitia maoni yenu." },
      { text: "TIRDO imejizatiti kutoa huduma kwa wakati, kwa weledi na kwa heshima. Pale tunaposhindwa kufikia viwango hivi, tunapenda kufahamu — maoni yenu ndiyo msingi wa namna tunavyoboresha." },
    ],
    standards: [
      { service: "Maswali ya jumla", standard: "Kupokea kila ombi na kujibu kwa taarifa iliyoombwa au kueleza hatua inayofuata kwa uwazi.", turnaround: "Ndani ya siku 3 za kazi" },
      { service: "Maombi ya huduma na ushauri", standard: "Kupokea ombi na kutoa andiko la kiufundi pamoja na gharama.", turnaround: "Ndani ya siku 7 za kazi" },
      { service: "Upimaji wa maabara (NILIMS)", standard: "Kusajili sampuli, kuthibitisha kazi na gharama, na kutoa majibu baada ya kukamilika.", turnaround: "Majibu ndani ya siku 10–21 za kazi kulingana na aina ya kipimo" },
      { service: "Usajili wa mafunzo (TeLTP)", standard: "Kuthibitisha usajili na kutoa ratiba na taarifa za kujiunga.", turnaround: "Ndani ya siku 5 za kazi" },
      { service: "Maswali ya zabuni na manunuzi", standard: "Kujibu maombi ya ufafanuzi katika kipindi cha zabuni.", turnaround: "Ndani ya siku 3 za kazi" },
      { service: "Malalamiko", standard: "Kupokea lalamiko, kulifanyia uchunguzi, na kutoa taarifa ya matokeo.", turnaround: "Kupokea ndani ya siku 2; kutatua ndani ya siku 14 za kazi" },
    ],
    rights: [
      { text: "Kuhudumiwa kwa haraka, kwa weledi na kwa heshima." },
      { text: "Kupata taarifa sahihi na maelezo ya wazi kuhusu ada na muda." },
      { text: "Kazi yako kushughulikiwa kwa usiri na kwa kuzingatia viwango vinavyotambulika." },
      { text: "Kutoa maoni au kulalamika bila kuathirika, na kupata majibu." },
      { text: "Kuhudumiwa kwa Kiingereza au Kiswahili." },
    ],
    responsibilities: [
      { text: "Kutoa taarifa kamili na sahihi pamoja na ombi lako." },
      { text: "Kuzingatia muda, ada na mahitaji ya sampuli au nyaraka yaliyokubaliwa." },
      { text: "Kuwaheshimu wafanyakazi wa TIRDO." },
      { text: "Kutumia njia za kutoa maoni ili kutusaidia kuboresha." },
    ],
  },
};
