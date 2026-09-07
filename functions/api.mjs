/**
 * INDIA JOB SCANNER — complete backend in one file.
 *
 * Everything the scanner needs lives here: the company list, the scoring model,
 * the portal readers and the API. It is deliberately a single self-contained
 * file with no imports and no dependencies, so it runs anywhere — a Netlify
 * drag-and-drop deploy, a Git deploy, or your own machine — with no build step.
 *
 * THE TWO THINGS YOU ARE LIKELY TO EDIT:
 *   1. COMPANIES   — add or remove employers            (Section 1, below)
 *   2. ROLE_FAMILIES / scoreJob — tune the ranking      (Section 2)
 *
 * After editing: re-upload this folder to Netlify, or restart your local server.
 */

/* ══════════════════════════════════════════════════════════════════════════
   SECTION 1 — COMPANY MASTER
   The employers this bot knows about. Add your own here.
   ══════════════════════════════════════════════════════════════════════════ */
/**
 * COMPANY MASTER — top employers in India, industry-wise.
 *
 * Fields
 *  name      Display name
 *  industry  One of INDUSTRIES below
 *  tier      1 = marquee / most sought-after, 2 = major, 3 = notable
 *  careers   Public careers portal (always works — used by Coverage view)
 *  ats       Optional live connector: { type, token }
 *              type: 'greenhouse' | 'lever' | 'ashby' | 'smartrecruiters' | 'workable' | 'recruitee'
 *            Connectors that 404 or error are dropped silently at runtime.
 *            The Connector Health panel in the UI shows exactly which are live.
 *  verified  true = connector confirmed returning live jobs at build time
 *
 * ADDING A COMPANY: copy any row, change the fields, save, redeploy. No other edits needed.
 */

const INDUSTRIES = [
  'Banking & Financial Services',
  'NBFC & Fintech',
  'Investment Banking & Capital Markets',
  'Management Consulting',
  'Professional Services (Big 4)',
  'IT Services & Consulting',
  'Product & SaaS',
  'E-commerce & Consumer Internet',
  'FMCG & Retail',
  'Manufacturing & Automotive',
  'Energy, Infra & Conglomerates',
  'Pharma & Healthcare',
  'Telecom & Media',
  'Aviation, Travel & Logistics',
];

const COMPANIES = [
  // ── Banking & Financial Services ─────────────────────────────────────────
  { name: 'HDFC Bank', industry: 'Banking & Financial Services', tier: 1, careers: 'https://www.hdfcbank.com/personal/about-us/careers' },
  { name: 'ICICI Bank', industry: 'Banking & Financial Services', tier: 1, careers: 'https://www.icicicareers.com/' },
  { name: 'Axis Bank', industry: 'Banking & Financial Services', tier: 1, careers: 'https://www.axisbank.com/careers' },
  { name: 'Kotak Mahindra Bank', industry: 'Banking & Financial Services', tier: 1, careers: 'https://www.kotak.com/en/careers.html' },
  { name: 'State Bank of India', industry: 'Banking & Financial Services', tier: 1, careers: 'https://bank.sbi/web/careers' },
  { name: 'IndusInd Bank', industry: 'Banking & Financial Services', tier: 2, careers: 'https://www.indusind.com/in/en/personal/careers.html' },
  { name: 'IDFC FIRST Bank', industry: 'Banking & Financial Services', tier: 2, careers: 'https://www.idfcfirstbank.com/careers' },
  { name: 'Yes Bank', industry: 'Banking & Financial Services', tier: 2, careers: 'https://www.yesbank.in/careers' },
  { name: 'HSBC India', industry: 'Banking & Financial Services', tier: 1, careers: 'https://www.hsbc.com/careers' },
  { name: 'Standard Chartered India', industry: 'Banking & Financial Services', tier: 1, careers: 'https://www.sc.com/en/careers/' },
  { name: 'Citi India', industry: 'Banking & Financial Services', tier: 1, careers: 'https://jobs.citi.com/' },
  { name: 'Deutsche Bank India', industry: 'Banking & Financial Services', tier: 1, careers: 'https://careers.db.com/' },
  { name: 'Barclays India', industry: 'Banking & Financial Services', tier: 1, careers: 'https://home.barclays/careers/' },
  { name: 'DBS Bank India', industry: 'Banking & Financial Services', tier: 2, careers: 'https://www.dbs.com/careers/default.page' },
  { name: 'Federal Bank', industry: 'Banking & Financial Services', tier: 3, careers: 'https://www.federalbank.co.in/careers' },
  { name: 'Bandhan Bank', industry: 'Banking & Financial Services', tier: 3, careers: 'https://bandhanbank.com/career' },
  { name: 'AU Small Finance Bank', industry: 'Banking & Financial Services', tier: 3, careers: 'https://www.aubank.in/careers' },

  // ── NBFC & Fintech ───────────────────────────────────────────────────────
  { name: 'Bajaj Finserv', industry: 'NBFC & Fintech', tier: 1, careers: 'https://www.bajajfinserv.in/careers' },
  { name: 'Shriram Finance', industry: 'NBFC & Fintech', tier: 2, careers: 'https://www.shriramfinance.in/careers' },
  { name: 'Cholamandalam Investment & Finance', industry: 'NBFC & Fintech', tier: 2, careers: 'https://www.cholamandalam.com/careers.aspx' },
  { name: 'Muthoot Finance', industry: 'NBFC & Fintech', tier: 2, careers: 'https://www.muthootfinance.com/careers' },
  { name: 'L&T Finance', industry: 'NBFC & Fintech', tier: 2, careers: 'https://www.ltfs.com/careers.html' },
  { name: 'Piramal Finance', industry: 'NBFC & Fintech', tier: 2, careers: 'https://www.piramalfinance.com/careers/' },
  { name: 'Poonawalla Fincorp', industry: 'NBFC & Fintech', tier: 3, careers: 'https://poonawallafincorp.com/careers.php' },
  { name: 'Satin Creditcare Network', industry: 'NBFC & Fintech', tier: 3, careers: 'https://satincreditcare.com/careers/' },
  { name: 'CreditAccess Grameen', industry: 'NBFC & Fintech', tier: 3, careers: 'https://www.creditaccessgrameen.in/careers/' },
  { name: 'Five Star Business Finance', industry: 'NBFC & Fintech', tier: 3, careers: 'https://fivestargroup.in/careers/' },
  { name: 'Razorpay', industry: 'NBFC & Fintech', tier: 1, careers: 'https://razorpay.com/jobs/', ats: { type: 'greenhouse', token: 'razorpaysoftwareprivatelimited' }, verified: true },
  { name: 'Groww', industry: 'NBFC & Fintech', tier: 1, careers: 'https://groww.in/careers', ats: { type: 'greenhouse', token: 'groww' }, verified: true },
  { name: 'PhonePe', industry: 'NBFC & Fintech', tier: 1, careers: 'https://www.phonepe.com/careers/', ats: { type: 'greenhouse', token: 'phonepe' } },
  { name: 'Paytm', industry: 'NBFC & Fintech', tier: 1, careers: 'https://paytm.com/careers' },
  { name: 'CRED', industry: 'NBFC & Fintech', tier: 1, careers: 'https://careers.cred.club/', ats: { type: 'lever', token: 'cred' } },
  { name: 'Zerodha', industry: 'NBFC & Fintech', tier: 1, careers: 'https://zerodha.com/careers/' },
  { name: 'Navi', industry: 'NBFC & Fintech', tier: 2, careers: 'https://navi.com/careers', ats: { type: 'greenhouse', token: 'navi' } },
  { name: 'Upstox', industry: 'NBFC & Fintech', tier: 2, careers: 'https://upstox.com/careers/', ats: { type: 'lever', token: 'upstox' } },
  { name: 'Jupiter', industry: 'NBFC & Fintech', tier: 3, careers: 'https://jupiter.money/careers/', ats: { type: 'lever', token: 'jupiter' } },
  { name: 'Slice', industry: 'NBFC & Fintech', tier: 3, careers: 'https://www.sliceit.com/careers', ats: { type: 'greenhouse', token: 'slice' } },
  { name: 'Pine Labs', industry: 'NBFC & Fintech', tier: 2, careers: 'https://www.pinelabs.com/careers' },
  { name: 'Zeta', industry: 'NBFC & Fintech', tier: 3, careers: 'https://www.zeta.tech/careers/' },
  { name: 'PolicyBazaar', industry: 'NBFC & Fintech', tier: 2, careers: 'https://careers.policybazaar.com/' },
  { name: 'Angel One', industry: 'NBFC & Fintech', tier: 2, careers: 'https://www.angelone.in/careers' },

  // ── Investment Banking & Capital Markets ─────────────────────────────────
  { name: 'Goldman Sachs India', industry: 'Investment Banking & Capital Markets', tier: 1, careers: 'https://www.goldmansachs.com/careers/' },
  { name: 'J.P. Morgan India', industry: 'Investment Banking & Capital Markets', tier: 1, careers: 'https://careers.jpmorgan.com/' },
  { name: 'Morgan Stanley India', industry: 'Investment Banking & Capital Markets', tier: 1, careers: 'https://www.morganstanley.com/careers' },
  { name: 'Nomura India', industry: 'Investment Banking & Capital Markets', tier: 1, careers: 'https://www.nomura.com/careers/' },
  { name: 'Avendus Capital', industry: 'Investment Banking & Capital Markets', tier: 1, careers: 'https://www.avendus.com/india/careers' },
  { name: 'Kotak Investment Banking', industry: 'Investment Banking & Capital Markets', tier: 1, careers: 'https://www.kotak.com/en/careers.html' },
  { name: 'ICICI Securities', industry: 'Investment Banking & Capital Markets', tier: 2, careers: 'https://www.icicisecurities.com/careers' },
  { name: 'JM Financial', industry: 'Investment Banking & Capital Markets', tier: 2, careers: 'https://www.jmfl.com/careers' },
  { name: 'Edelweiss Financial Services', industry: 'Investment Banking & Capital Markets', tier: 2, careers: 'https://www.edelweissfin.com/careers/' },
  { name: 'Motilal Oswal', industry: 'Investment Banking & Capital Markets', tier: 2, careers: 'https://www.motilaloswalgroup.com/Careers' },
  { name: 'Ambit Capital', industry: 'Investment Banking & Capital Markets', tier: 2, careers: 'https://www.ambit.co/careers' },
  { name: 'Jefferies India', industry: 'Investment Banking & Capital Markets', tier: 2, careers: 'https://www.jefferies.com/careers/' },
  { name: 'Blackstone India', industry: 'Investment Banking & Capital Markets', tier: 1, careers: 'https://www.blackstone.com/careers/' },
  { name: 'KKR India', industry: 'Investment Banking & Capital Markets', tier: 1, careers: 'https://www.kkr.com/careers' },
  { name: 'ChrysCapital', industry: 'Investment Banking & Capital Markets', tier: 1, careers: 'https://www.chryscapital.com/careers/' },
  { name: 'Sequoia / Peak XV Partners', industry: 'Investment Banking & Capital Markets', tier: 1, careers: 'https://www.peakxv.com/careers/' },

  // ── Management Consulting ────────────────────────────────────────────────
  { name: 'McKinsey & Company India', industry: 'Management Consulting', tier: 1, careers: 'https://www.mckinsey.com/careers/search-jobs' },
  { name: 'Boston Consulting Group India', industry: 'Management Consulting', tier: 1, careers: 'https://careers.bcg.com/' },
  { name: 'Bain & Company India', industry: 'Management Consulting', tier: 1, careers: 'https://www.bain.com/careers/' },
  { name: 'Kearney India', industry: 'Management Consulting', tier: 2, careers: 'https://www.kearney.com/careers' },
  { name: 'Oliver Wyman India', industry: 'Management Consulting', tier: 2, careers: 'https://www.oliverwyman.com/careers.html' },
  { name: 'Accenture Strategy India', industry: 'Management Consulting', tier: 1, careers: 'https://www.accenture.com/in-en/careers' },
  { name: 'ZS Associates', industry: 'Management Consulting', tier: 2, careers: 'https://www.zs.com/careers' },
  { name: 'Alvarez & Marsal India', industry: 'Management Consulting', tier: 2, careers: 'https://www.alvarezandmarsal.com/careers' },

  // ── Professional Services (Big 4) ────────────────────────────────────────
  { name: 'Deloitte India', industry: 'Professional Services (Big 4)', tier: 1, careers: 'https://www2.deloitte.com/in/en/careers.html' },
  { name: 'PwC India', industry: 'Professional Services (Big 4)', tier: 1, careers: 'https://www.pwc.in/careers.html' },
  { name: 'EY India', industry: 'Professional Services (Big 4)', tier: 1, careers: 'https://www.ey.com/en_in/careers' },
  { name: 'KPMG India', industry: 'Professional Services (Big 4)', tier: 1, careers: 'https://kpmg.com/in/en/careers.html' },
  { name: 'Grant Thornton Bharat', industry: 'Professional Services (Big 4)', tier: 2, careers: 'https://www.grantthornton.in/careers/' },
  { name: 'BDO India', industry: 'Professional Services (Big 4)', tier: 2, careers: 'https://www.bdo.in/en-gb/careers' },
  { name: 'CRISIL', industry: 'Professional Services (Big 4)', tier: 2, careers: 'https://www.crisil.com/en/home/careers.html' },
  { name: 'ICRA', industry: 'Professional Services (Big 4)', tier: 3, careers: 'https://www.icra.in/Career' },
  { name: 'CARE Ratings', industry: 'Professional Services (Big 4)', tier: 3, careers: 'https://www.careratings.com/careers' },

  // ── IT Services & Consulting ─────────────────────────────────────────────
  { name: 'Tata Consultancy Services', industry: 'IT Services & Consulting', tier: 1, careers: 'https://www.tcs.com/careers' },
  { name: 'Infosys', industry: 'IT Services & Consulting', tier: 1, careers: 'https://www.infosys.com/careers/' },
  { name: 'Wipro', industry: 'IT Services & Consulting', tier: 1, careers: 'https://careers.wipro.com/' },
  { name: 'HCLTech', industry: 'IT Services & Consulting', tier: 1, careers: 'https://www.hcltech.com/careers' },
  { name: 'Tech Mahindra', industry: 'IT Services & Consulting', tier: 2, careers: 'https://careers.techmahindra.com/' },
  { name: 'LTIMindtree', industry: 'IT Services & Consulting', tier: 2, careers: 'https://www.ltimindtree.com/careers/' },
  { name: 'Cognizant India', industry: 'IT Services & Consulting', tier: 1, careers: 'https://careers.cognizant.com/global/en' },
  { name: 'Capgemini India', industry: 'IT Services & Consulting', tier: 2, careers: 'https://www.capgemini.com/in-en/careers/' },
  { name: 'Genpact', industry: 'IT Services & Consulting', tier: 2, careers: 'https://www.genpact.com/careers' },
  { name: 'Mphasis', industry: 'IT Services & Consulting', tier: 3, careers: 'https://careers.mphasis.com/' },
  { name: 'Persistent Systems', industry: 'IT Services & Consulting', tier: 3, careers: 'https://www.persistent.com/careers/' },
  { name: 'Coforge', industry: 'IT Services & Consulting', tier: 3, careers: 'https://www.coforge.com/careers' },
  { name: 'IBM India', industry: 'IT Services & Consulting', tier: 1, careers: 'https://www.ibm.com/careers/search' },
  { name: 'Oracle India', industry: 'IT Services & Consulting', tier: 1, careers: 'https://careers.oracle.com/' },
  { name: 'SAP India', industry: 'IT Services & Consulting', tier: 2, careers: 'https://jobs.sap.com/' },

  // ── Product & SaaS ───────────────────────────────────────────────────────
  { name: 'Google India', industry: 'Product & SaaS', tier: 1, careers: 'https://www.google.com/about/careers/applications/jobs/results/?location=India' },
  { name: 'Microsoft India', industry: 'Product & SaaS', tier: 1, careers: 'https://jobs.careers.microsoft.com/global/en/search' },
  { name: 'Amazon India', industry: 'Product & SaaS', tier: 1, careers: 'https://www.amazon.jobs/en/locations/india' },
  { name: 'Adobe India', industry: 'Product & SaaS', tier: 1, careers: 'https://careers.adobe.com/us/en/search-results' },
  { name: 'Salesforce India', industry: 'Product & SaaS', tier: 1, careers: 'https://careers.salesforce.com/en/jobs/' },
  { name: 'Uber India', industry: 'Product & SaaS', tier: 1, careers: 'https://www.uber.com/us/en/careers/list/' },
  { name: 'Atlassian India', industry: 'Product & SaaS', tier: 1, careers: 'https://www.atlassian.com/company/careers/all-jobs', ats: { type: 'greenhouse', token: 'atlassian' } },
  { name: 'Zoho', industry: 'Product & SaaS', tier: 2, careers: 'https://www.zoho.com/careers/' },
  { name: 'Freshworks', industry: 'Product & SaaS', tier: 2, careers: 'https://www.freshworks.com/company/careers/', ats: { type: 'greenhouse', token: 'freshworks' } },
  { name: 'Postman', industry: 'Product & SaaS', tier: 2, careers: 'https://www.postman.com/company/careers/', ats: { type: 'greenhouse', token: 'postman' }, verified: true },
  { name: 'Druva', industry: 'Product & SaaS', tier: 3, careers: 'https://www.druva.com/about/careers', ats: { type: 'greenhouse', token: 'druva' }, verified: true },
  { name: 'BrowserStack', industry: 'Product & SaaS', tier: 3, careers: 'https://www.browserstack.com/careers', ats: { type: 'greenhouse', token: 'browserstack' } },
  { name: 'Sprinklr India', industry: 'Product & SaaS', tier: 3, careers: 'https://www.sprinklr.com/careers/', ats: { type: 'greenhouse', token: 'sprinklr' } },
  { name: 'Chargebee', industry: 'Product & SaaS', tier: 3, careers: 'https://www.chargebee.com/careers/' },
  { name: 'Darwinbox', industry: 'Product & SaaS', tier: 3, careers: 'https://darwinbox.com/careers' },
  { name: 'Innovaccer', industry: 'Product & SaaS', tier: 3, careers: 'https://innovaccer.com/careers' },
  { name: 'Nvidia India', industry: 'Product & SaaS', tier: 1, careers: 'https://www.nvidia.com/en-in/about-nvidia/careers/' },
  { name: 'Qualcomm India', industry: 'Product & SaaS', tier: 2, careers: 'https://careers.qualcomm.com/careers' },
  { name: 'Intuit India', industry: 'Product & SaaS', tier: 2, careers: 'https://www.intuit.com/careers/' },
  { name: 'Walmart Global Tech India', industry: 'Product & SaaS', tier: 2, careers: 'https://careers.walmart.com/technology' },

  // ── E-commerce & Consumer Internet ───────────────────────────────────────
  { name: 'Flipkart', industry: 'E-commerce & Consumer Internet', tier: 1, careers: 'https://www.flipkartcareers.com/', ats: { type: 'greenhouse', token: 'flipkart' } },
  { name: 'Zomato', industry: 'E-commerce & Consumer Internet', tier: 1, careers: 'https://www.zomato.com/careers', ats: { type: 'lever', token: 'zomato' } },
  { name: 'Swiggy', industry: 'E-commerce & Consumer Internet', tier: 1, careers: 'https://careers.swiggy.com/', ats: { type: 'lever', token: 'swiggy' } },
  { name: 'Meesho', industry: 'E-commerce & Consumer Internet', tier: 2, careers: 'https://www.meesho.io/jobs', ats: { type: 'greenhouse', token: 'meesho' } },
  { name: 'Zepto', industry: 'E-commerce & Consumer Internet', tier: 2, careers: 'https://www.zeptonow.com/careers', ats: { type: 'greenhouse', token: 'zeptonow' } },
  { name: 'Nykaa', industry: 'E-commerce & Consumer Internet', tier: 2, careers: 'https://www.nykaa.com/careers' },
  { name: 'Myntra', industry: 'E-commerce & Consumer Internet', tier: 2, careers: 'https://careers.myntra.com/' },
  { name: 'Ola', industry: 'E-commerce & Consumer Internet', tier: 2, careers: 'https://www.olacabs.com/careers' },
  { name: 'Dream11', industry: 'E-commerce & Consumer Internet', tier: 2, careers: 'https://www.dreamsports.group/careers/' },
  { name: 'Urban Company', industry: 'E-commerce & Consumer Internet', tier: 3, careers: 'https://www.urbancompany.com/careers', ats: { type: 'greenhouse', token: 'urbancompany' } },
  { name: 'ShareChat', industry: 'E-commerce & Consumer Internet', tier: 3, careers: 'https://sharechat.com/careers', ats: { type: 'lever', token: 'sharechat' } },
  { name: 'MakeMyTrip', industry: 'E-commerce & Consumer Internet', tier: 2, careers: 'https://careers.makemytrip.com/' },
  { name: 'BookMyShow', industry: 'E-commerce & Consumer Internet', tier: 3, careers: 'https://careers.bookmyshow.com/' },
  { name: 'Lenskart', industry: 'E-commerce & Consumer Internet', tier: 2, careers: 'https://www.lenskart.com/careers' },

  // ── FMCG & Retail ────────────────────────────────────────────────────────
  { name: 'Hindustan Unilever', industry: 'FMCG & Retail', tier: 1, careers: 'https://www.hul.co.in/careers/' },
  { name: 'ITC Limited', industry: 'FMCG & Retail', tier: 1, careers: 'https://www.itcportal.com/careers/' },
  { name: 'Nestlé India', industry: 'FMCG & Retail', tier: 1, careers: 'https://www.nestle.in/jobs' },
  { name: 'Procter & Gamble India', industry: 'FMCG & Retail', tier: 1, careers: 'https://www.pgcareers.com/' },
  { name: 'Britannia Industries', industry: 'FMCG & Retail', tier: 2, careers: 'https://www.britannia.co.in/careers' },
  { name: 'Dabur India', industry: 'FMCG & Retail', tier: 2, careers: 'https://www.dabur.com/careers' },
  { name: 'Marico', industry: 'FMCG & Retail', tier: 2, careers: 'https://marico.com/india/careers' },
  { name: 'Godrej Consumer Products', industry: 'FMCG & Retail', tier: 2, careers: 'https://www.godrejcp.com/careers' },
  { name: 'Reliance Retail', industry: 'FMCG & Retail', tier: 1, careers: 'https://relianceretail.com/careers.html' },
  { name: 'Tata Consumer Products', industry: 'FMCG & Retail', tier: 2, careers: 'https://www.tataconsumer.com/careers' },
  { name: 'Coca-Cola India', industry: 'FMCG & Retail', tier: 2, careers: 'https://www.coca-colacompany.com/careers' },
  { name: 'PepsiCo India', industry: 'FMCG & Retail', tier: 2, careers: 'https://www.pepsicojobs.com/' },
  { name: 'Titan Company', industry: 'FMCG & Retail', tier: 2, careers: 'https://www.titancompany.in/careers' },

  // ── Manufacturing & Automotive ───────────────────────────────────────────
  { name: 'Tata Motors', industry: 'Manufacturing & Automotive', tier: 1, careers: 'https://www.tatamotors.com/careers/' },
  { name: 'Mahindra & Mahindra', industry: 'Manufacturing & Automotive', tier: 1, careers: 'https://www.mahindra.com/careers' },
  { name: 'Maruti Suzuki', industry: 'Manufacturing & Automotive', tier: 1, careers: 'https://www.marutisuzuki.com/corporate/careers' },
  { name: 'Bajaj Auto', industry: 'Manufacturing & Automotive', tier: 2, careers: 'https://www.bajajauto.com/careers' },
  { name: 'Hero MotoCorp', industry: 'Manufacturing & Automotive', tier: 2, careers: 'https://www.heromotocorp.com/en-in/careers.html' },
  { name: 'TVS Motor Company', industry: 'Manufacturing & Automotive', tier: 2, careers: 'https://www.tvsmotor.com/careers' },
  { name: 'Ashok Leyland', industry: 'Manufacturing & Automotive', tier: 3, careers: 'https://www.ashokleyland.com/in/en/careers' },
  { name: 'Larsen & Toubro', industry: 'Manufacturing & Automotive', tier: 1, careers: 'https://www.larsentoubro.com/corporate/careers/' },
  { name: 'Siemens India', industry: 'Manufacturing & Automotive', tier: 2, careers: 'https://jobs.siemens.com/' },
  { name: 'Bosch India', industry: 'Manufacturing & Automotive', tier: 2, careers: 'https://www.bosch.in/careers/' },
  { name: 'Ola Electric', industry: 'Manufacturing & Automotive', tier: 3, careers: 'https://olaelectric.com/careers' },
  { name: 'Ather Energy', industry: 'Manufacturing & Automotive', tier: 3, careers: 'https://www.atherenergy.com/careers' },

  // ── Energy, Infra & Conglomerates ────────────────────────────────────────
  { name: 'Reliance Industries', industry: 'Energy, Infra & Conglomerates', tier: 1, careers: 'https://careers.ril.com/' },
  { name: 'Adani Group', industry: 'Energy, Infra & Conglomerates', tier: 1, careers: 'https://www.adani.com/careers' },
  { name: 'Tata Group (Tata Sons)', industry: 'Energy, Infra & Conglomerates', tier: 1, careers: 'https://www.tata.com/careers' },
  { name: 'Aditya Birla Group', industry: 'Energy, Infra & Conglomerates', tier: 1, careers: 'https://www.adityabirla.com/careers/' },
  { name: 'JSW Group', industry: 'Energy, Infra & Conglomerates', tier: 2, careers: 'https://www.jsw.in/careers' },
  { name: 'Vedanta Resources', industry: 'Energy, Infra & Conglomerates', tier: 2, careers: 'https://www.vedantalimited.com/careers' },
  { name: 'Indian Oil Corporation', industry: 'Energy, Infra & Conglomerates', tier: 2, careers: 'https://iocl.com/careers' },
  { name: 'NTPC', industry: 'Energy, Infra & Conglomerates', tier: 2, careers: 'https://careers.ntpc.co.in/' },
  { name: 'ONGC', industry: 'Energy, Infra & Conglomerates', tier: 2, careers: 'https://ongcindia.com/web/eng/career' },
  { name: 'Tata Power', industry: 'Energy, Infra & Conglomerates', tier: 2, careers: 'https://www.tatapower.com/careers' },
  { name: 'UltraTech Cement', industry: 'Energy, Infra & Conglomerates', tier: 2, careers: 'https://www.ultratechcement.com/careers' },

  // ── Pharma & Healthcare ──────────────────────────────────────────────────
  { name: 'Sun Pharmaceutical', industry: 'Pharma & Healthcare', tier: 1, careers: 'https://sunpharma.com/careers/' },
  { name: "Dr. Reddy's Laboratories", industry: 'Pharma & Healthcare', tier: 1, careers: 'https://careers.drreddys.com/' },
  { name: 'Cipla', industry: 'Pharma & Healthcare', tier: 1, careers: 'https://www.cipla.com/careers' },
  { name: 'Lupin', industry: 'Pharma & Healthcare', tier: 2, careers: 'https://www.lupin.com/careers/' },
  { name: 'Biocon', industry: 'Pharma & Healthcare', tier: 2, careers: 'https://www.biocon.com/careers/' },
  { name: 'Torrent Pharmaceuticals', industry: 'Pharma & Healthcare', tier: 3, careers: 'https://www.torrentpharma.com/careers' },
  { name: 'Apollo Hospitals', industry: 'Pharma & Healthcare', tier: 2, careers: 'https://www.apollohospitals.com/careers' },
  { name: 'Fortis Healthcare', industry: 'Pharma & Healthcare', tier: 3, careers: 'https://www.fortishealthcare.com/careers' },
  { name: 'Max Healthcare', industry: 'Pharma & Healthcare', tier: 3, careers: 'https://www.maxhealthcare.in/careers' },
  { name: 'Novartis India', industry: 'Pharma & Healthcare', tier: 2, careers: 'https://www.novartis.com/careers' },

  // ── Telecom & Media ──────────────────────────────────────────────────────
  { name: 'Reliance Jio', industry: 'Telecom & Media', tier: 1, careers: 'https://careers.jio.com/' },
  { name: 'Bharti Airtel', industry: 'Telecom & Media', tier: 1, careers: 'https://www.airtel.in/careers' },
  { name: 'Vodafone Idea', industry: 'Telecom & Media', tier: 2, careers: 'https://www.myvi.in/about-us/careers' },
  { name: 'Times Internet', industry: 'Telecom & Media', tier: 3, careers: 'https://www.timesinternet.in/careers' },
  { name: 'Zee Entertainment', industry: 'Telecom & Media', tier: 3, careers: 'https://www.zee.com/careers/' },
  { name: 'Sony Pictures Networks India', industry: 'Telecom & Media', tier: 3, careers: 'https://www.sonypicturesnetworks.com/careers' },
  { name: 'Disney Star India', industry: 'Telecom & Media', tier: 2, careers: 'https://jobs.disneycareers.com/' },

  // ── Aviation, Travel & Logistics ─────────────────────────────────────────
  { name: 'IndiGo (InterGlobe Aviation)', industry: 'Aviation, Travel & Logistics', tier: 1, careers: 'https://careers.goindigo.in/' },
  { name: 'Air India', industry: 'Aviation, Travel & Logistics', tier: 1, careers: 'https://www.airindia.com/in/en/about-us/careers.html' },
  { name: 'Delhivery', industry: 'Aviation, Travel & Logistics', tier: 2, careers: 'https://www.delhivery.com/careers/' },
  { name: 'Blue Dart', industry: 'Aviation, Travel & Logistics', tier: 3, careers: 'https://www.bluedart.com/careers' },
  { name: 'DHL India', industry: 'Aviation, Travel & Logistics', tier: 3, careers: 'https://careers.dhl.com/' },
  { name: 'Rivigo / Mahindra Logistics', industry: 'Aviation, Travel & Logistics', tier: 3, careers: 'https://mahindralogistics.com/careers/' },
];

const COMPANY_BY_NAME = new Map(COMPANIES.map((c) => [c.name.toLowerCase(), c]));

/** Companies that expose a machine-readable job feed we can scan directly. */
const LIVE_COMPANIES = COMPANIES.filter((c) => c.ats);


/* ══════════════════════════════════════════════════════════════════════════
   SECTION 2 — SCORING MODEL
   How each opening is scored out of 100 and gated for eligibility.
   ══════════════════════════════════════════════════════════════════════════ */
/**
 * ELIGIBILITY SCORING ENGINE
 * Pure functions, no network, no AI. Same code runs in the serverless function
 * and can be re-run in the browser for instant re-ranking.
 *
 * Total 100 points:
 *   Role match        40
 *   Experience fit    25
 *   Location fit      20
 *   Background fit    15
 *
 * A job is "perfectly eligible" only when it clears the HARD GATES:
 *   experience band overlaps, location acceptable, role match >= 50%.
 * Eligible jobs always sort above non-eligible ones, whatever the raw score.
 */

// ─── Role families: expands what the user types into related search terms ────
const ROLE_FAMILIES = {
  'Finance & Accounting': ['finance', 'accounting', 'accountant', 'controller', 'fp&a', 'financial planning', 'audit', 'taxation', 'treasury', 'ap', 'ar', 'reconciliation', 'ifrs', 'gaap', 'ca', 'chartered accountant', 'acca', 'cfa', 'budgeting', 'costing', 'mis'],
  'Investment Banking & PE/VC': ['investment banking', 'private equity', 'venture capital', 'ib', 'm&a', 'mergers', 'acquisitions', 'valuation', 'due diligence', 'deal', 'capital markets', 'equity research', 'coverage', 'leveraged finance', 'dcm', 'ecm'],
  'Consulting & Strategy': ['consultant', 'consulting', 'strategy', 'business analyst', 'associate consultant', 'engagement', 'transformation', 'advisory', 'corporate strategy'],
  'Data & Analytics': ['data analyst', 'data scientist', 'analytics', 'business intelligence', 'bi', 'sql', 'python', 'tableau', 'power bi', 'machine learning', 'data engineer'],
  'Software Engineering': ['software engineer', 'developer', 'backend', 'frontend', 'full stack', 'sde', 'engineer', 'java', 'python', 'react', 'node', 'devops', 'platform'],
  'Product Management': ['product manager', 'product owner', 'apm', 'product analyst', 'group product manager', 'pm'],
  'Sales & Business Development': ['sales', 'business development', 'bd', 'account executive', 'account manager', 'relationship manager', 'key account', 'inside sales', 'partnerships'],
  'Marketing & Growth': ['marketing', 'growth', 'brand', 'digital marketing', 'performance marketing', 'seo', 'content', 'social media', 'crm'],
  'Operations & Supply Chain': ['operations', 'supply chain', 'logistics', 'procurement', 'sourcing', 'warehouse', 'process excellence', 'six sigma'],
  'Human Resources': ['hr', 'human resources', 'talent acquisition', 'recruiter', 'hrbp', 'people', 'compensation', 'learning and development'],
  'Legal, Risk & Compliance': ['legal', 'compliance', 'risk', 'regulatory', 'aml', 'kyc', 'governance', 'company secretary', 'counsel'],
  'Credit & Underwriting': ['credit', 'underwriting', 'credit analyst', 'credit risk', 'collections', 'portfolio', 'npa', 'lending', 'disbursement'],
  'Chief of Staff & EA': ['chief of staff', 'executive assistant', 'ea to', 'business manager', 'strategy office', 'special projects'],
};

// ─── Seniority ladder: maps title words to a typical years-of-experience band ─
const SENIORITY = [
  { rx: /\b(intern|internship|trainee|apprentice|summer analyst)\b/i, min: 0, max: 1, label: 'Intern/Trainee' },
  { rx: /\b(graduate|campus|fresher|entry[- ]level|management trainee|gmt)\b/i, min: 0, max: 2, label: 'Graduate' },
  { rx: /\b(junior|jr\.?|analyst i\b|associate i\b)\b/i, min: 0, max: 3, label: 'Junior' },
  { rx: /\b(analyst|associate|executive|officer|specialist|coordinator)\b/i, min: 1, max: 4, label: 'Analyst/Associate' },
  { rx: /\b(senior analyst|senior associate|sr\.? associate|senior executive|senior officer|deputy manager|assistant manager)\b/i, min: 3, max: 6, label: 'Senior Associate' },
  { rx: /\b(senior|sr\.?|specialist ii|consultant)\b/i, min: 3, max: 7, label: 'Senior' },
  { rx: /\b(lead|team lead|manager|engagement manager)\b/i, min: 5, max: 10, label: 'Manager' },
  { rx: /\b(senior manager|principal|staff|architect|group manager|chief manager)\b/i, min: 8, max: 14, label: 'Senior Manager' },
  { rx: /\b(director|head of|avp|vice president|vp|general manager|gm|partner|chief|cxo|cfo|ceo|coo)\b/i, min: 12, max: 30, label: 'Director+' },
];

/** Pull an explicit "3-5 years" / "5+ years" band out of free text. */
function parseYearsFromText(text = '') {
  const t = String(text).toLowerCase();
  let m = t.match(/(\d{1,2})\s*[-–to]{1,3}\s*(\d{1,2})\s*\+?\s*(?:years|yrs|year)/);
  if (m) return { min: +m[1], max: +m[2], source: 'explicit' };
  m = t.match(/(\d{1,2})\s*\+\s*(?:years|yrs|year)/);
  if (m) return { min: +m[1], max: +m[1] + 8, source: 'explicit' };
  m = t.match(/(?:minimum|min\.?|at least|atleast)\s*(?:of\s*)?(\d{1,2})\s*(?:years|yrs)/);
  if (m) return { min: +m[1], max: +m[1] + 8, source: 'explicit' };
  m = t.match(/\b(\d{1,2})\s*(?:years|yrs)\b/);
  if (m) return { min: Math.max(0, +m[1] - 1), max: +m[1] + 2, source: 'explicit' };
  return null;
}

/** Infer an experience band for a job from its description, then its title. */
function inferExperienceBand(title = '', description = '') {
  const explicit = parseYearsFromText(description) || parseYearsFromText(title);
  if (explicit) return { ...explicit, label: 'Stated in posting' };
  let best = null;
  for (const s of SENIORITY) if (s.rx.test(title)) best = s; // later = more specific
  if (best) return { min: best.min, max: best.max, source: 'title', label: best.label };
  return { min: 0, max: 30, source: 'unknown', label: 'Not specified' };
}

// ─── Location handling ───────────────────────────────────────────────────────
const CITY_ALIASES = {
  bengaluru: ['bangalore', 'bengaluru', 'blr', 'whitefield', 'koramangala'],
  mumbai: ['mumbai', 'bombay', 'navi mumbai', 'thane', 'bkc', 'andheri', 'powai'],
  delhi: ['delhi', 'new delhi', 'ncr', 'gurgaon', 'gurugram', 'noida', 'faridabad', 'ghaziabad', 'delhi ncr'],
  gurugram: ['gurugram', 'gurgaon', 'ncr', 'delhi ncr'],
  noida: ['noida', 'greater noida', 'ncr', 'delhi ncr'],
  hyderabad: ['hyderabad', 'secunderabad', 'hitec city', 'telangana'],
  pune: ['pune', 'pimpri', 'hinjewadi', 'magarpatta'],
  chennai: ['chennai', 'madras', 'omr'],
  kolkata: ['kolkata', 'calcutta', 'salt lake'],
  ahmedabad: ['ahmedabad', 'gandhinagar', 'gift city'],
  jaipur: ['jaipur'],
  kochi: ['kochi', 'cochin', 'ernakulam'],
  chandigarh: ['chandigarh', 'mohali', 'panchkula'],
  indore: ['indore'],
  remote: ['remote', 'work from home', 'wfh', 'anywhere', 'virtual'],
};

function normaliseCity(raw = '') {
  const t = String(raw).toLowerCase();
  const hits = [];
  for (const [canon, aliases] of Object.entries(CITY_ALIASES)) {
    if (aliases.some((a) => t.includes(a))) hits.push(canon);
  }
  return hits;
}

function isIndiaLocation(raw = '') {
  const t = String(raw).toLowerCase();
  if (!t) return false;
  if (/\b(india|bharat)\b/.test(t)) return true;
  if (normaliseCity(t).some((c) => c !== 'remote')) return true;
  const states = ['karnataka', 'maharashtra', 'telangana', 'tamil nadu', 'haryana', 'uttar pradesh', 'gujarat', 'west bengal', 'kerala', 'rajasthan', 'punjab', 'madhya pradesh', 'andhra pradesh', 'odisha'];
  return states.some((s) => t.includes(s));
}

// ─── Text helpers ────────────────────────────────────────────────────────────
const STOP = new Set(['the', 'and', 'for', 'with', 'a', 'an', 'of', 'in', 'to', 'at', 'on', 'or', 'is', 'are', 'be', 'as', 'by', 'job', 'role', 'position', 'work', 'team']);

function tokens(s = '') {
  return String(s).toLowerCase().replace(/[^a-z0-9+&#. ]/g, ' ').split(/\s+/).filter((w) => w.length > 1 && !STOP.has(w));
}

const rxEscape = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const SUFFIXES = ['ment', 'tion', 'ing', 'ial', 'ies', 'es', 'al', 's'];

/** Light stemmer so "financial" also matches "finance" and "financing". */
function stem(word) {
  for (const s of SUFFIXES) {
    if (word.length > s.length + 3 && word.endsWith(s)) {
      const root = word.slice(0, -s.length);
      if (root.length >= 4) return root;
    }
  }
  return word;
}

/**
 * Whole-word containment with light stemming. Plain substring matching is unsafe
 * here: short terms like "ca" or "ar" would match inside "location" and "market".
 */
function hasTerm(haystack, term) {
  const t = String(term).toLowerCase().trim();
  if (!t) return false;
  // Multi-word phrases: match as-is, stemming only the final word.
  const parts = t.split(/\s+/);
  const last = parts.pop();
  const root = last.length >= 5 ? stem(last) : last;
  const tail = root === last ? '[a-z]{0,3}' : '[a-z]{0,4}';
  const body = [...parts.map(rxEscape), `${rxEscape(root)}${root.length >= 4 ? tail : ''}`].join('[\\s-]+');
  const rx = new RegExp(`(?:^|[^a-z0-9])${body}(?:[^a-z0-9]|$)`, 'i');
  return rx.test(haystack);
}

function countHits(needles, haystack) {
  const hay = ' ' + String(haystack).toLowerCase() + ' ';
  let hit = 0;
  for (const n of needles) if (hasTerm(hay, n)) hit++;
  return hit;
}

/** Share of the user's own words present — strict, used for title matching. */
function overlapRatio(needles, haystack) {
  if (!needles.length) return 0;
  return countHits(needles, haystack) / needles.length;
}

/** Saturating signal: a handful of family-term hits is already a strong signal. */
function saturate(hits, full = 4) {
  return Math.min(1, hits / full);
}

/** Expand the user's typed role into a term list using the role families. */
function expandRoleTerms(roleText = '', families = []) {
  const terms = new Set(tokens(roleText));
  const phrase = String(roleText).trim().toLowerCase();
  if (phrase) terms.add(phrase);
  for (const f of families) for (const t of ROLE_FAMILIES[f] || []) terms.add(t);
  return [...terms];
}

// ─── The scorer ──────────────────────────────────────────────────────────────
/**
 * @param job     { title, company, location, description, industry, url, postedAt }
 * @param profile { roleText, roleFamilies[], background, skills[], locations[],
 *                  years, openToRemote, targetIndustries[] }
 */
function scoreJob(job, profile) {
  const reasons = [];
  const gaps = [];
  const title = job.title || '';
  const desc = job.description || '';
  const blob = `${title} ${desc}`;

  // 1) ROLE — 40 pts
  const roleTerms = expandRoleTerms(profile.roleText, profile.roleFamilies);
  const userWords = tokens(profile.roleText);
  const titleHit = overlapRatio(userWords, title);
  const exactPhrase = hasTerm(title, String(profile.roleText).trim().toLowerCase());
  const familySignal = saturate(countHits(roleTerms, blob), 4);
  const familyInTitle = saturate(countHits(roleTerms, title), 2);
  const roleRatio = Math.min(1, titleHit * 0.55 + familyInTitle * 0.25 + familySignal * 0.35 + (exactPhrase ? 0.15 : 0));
  const roleScore = Math.round(roleRatio * 40);
  if (exactPhrase) reasons.push(`Title is a direct match for "${profile.roleText}"`);
  else if (titleHit >= 0.5) reasons.push(`Related title in the same function as "${profile.roleText}"`);
  else if (roleRatio >= 0.5) reasons.push('Role sits in your target function');
  if (roleRatio < 0.5) gaps.push('Role is only loosely related to what you entered');

  // 2) EXPERIENCE — 25 pts
  const band = inferExperienceBand(title, desc);
  const y = Number(profile.years ?? 0);
  let expScore, expOk;
  if (band.source === 'unknown') {
    expScore = 15; expOk = true;
    gaps.push('Posting does not state an experience requirement');
  } else if (y >= band.min && y <= band.max) {
    expScore = 25; expOk = true;
    reasons.push(`Your ${y} yr${y === 1 ? '' : 's'} fits the ${band.min}–${band.max} yr requirement`);
  } else if (y < band.min) {
    const short = band.min - y;
    expOk = short <= 1;
    expScore = short <= 1 ? 18 : short <= 2 ? 10 : short <= 4 ? 4 : 0;
    gaps.push(`Wants ${band.min}+ yrs — you are ${short} yr${short === 1 ? '' : 's'} short`);
  } else {
    const over = y - band.max;
    expOk = over <= 2;
    expScore = over <= 2 ? 20 : over <= 5 ? 12 : 6;
    gaps.push(`Pitched below your level (${band.min}–${band.max} yrs)`);
  }

  // 3) LOCATION — 20 pts
  const jobCities = normaliseCity(job.location || '');
  const wantCities = (profile.locations || []).flatMap((l) => normaliseCity(l));
  const isRemote = jobCities.includes('remote') || /remote|work from home/i.test(blob);
  let locScore, locOk;
  if (!wantCities.length) { locScore = 14; locOk = true; }
  else if (jobCities.some((c) => wantCities.includes(c))) {
    locScore = 20; locOk = true;
    reasons.push(`Located in ${job.location}`);
  } else if (isRemote && profile.openToRemote !== false) {
    locScore = 18; locOk = true;
    reasons.push('Remote — location is not a constraint');
  } else if (!job.location) { locScore = 10; locOk = true; gaps.push('Location not stated'); }
  else { locScore = 3; locOk = false; gaps.push(`In ${job.location}, outside your preferred locations`); }

  // 4) BACKGROUND — 15 pts
  const bgTerms = [...new Set([...tokens(profile.background || ''), ...(profile.skills || [])])].filter((t) => t.length > 2);
  const bgSignal = saturate(countHits(bgTerms.slice(0, 40), blob), 5);
  const industryHit = (profile.targetIndustries || []).includes(job.industry) ? 1 : 0;
  const bgScore = Math.round(Math.min(1, bgSignal * 0.65 + industryHit * 0.5) * 15);
  if (industryHit) reasons.push(`${job.industry} is on your target industry list`);
  if (bgSignal >= 0.4) reasons.push('Your background and skills appear in the posting');

  const total = roleScore + expScore + locScore + bgScore;
  const eligible = expOk && locOk && roleRatio >= 0.5;

  let bandLabel, bandClass;
  if (eligible && total >= 78) { bandLabel = 'Perfect fit'; bandClass = 'perfect'; }
  else if (eligible && total >= 60) { bandLabel = 'Strong fit'; bandClass = 'strong'; }
  else if (total >= 45) { bandLabel = 'Stretch'; bandClass = 'stretch'; }
  else { bandLabel = 'Reach'; bandClass = 'reach'; }

  return {
    total, eligible, bandLabel, bandClass,
    breakdown: { role: roleScore, experience: expScore, location: locScore, background: bgScore },
    experienceBand: band,
    reasons: reasons.slice(0, 4),
    gaps: gaps.slice(0, 3),
  };
}

/** Eligible-first, then score, then freshness. */
function rankJobs(jobs, profile) {
  return jobs
    .map((j) => ({ ...j, match: scoreJob(j, profile) }))
    .sort((a, b) => {
      if (a.match.eligible !== b.match.eligible) return a.match.eligible ? -1 : 1;
      if (b.match.total !== a.match.total) return b.match.total - a.match.total;
      return new Date(b.postedAt || 0) - new Date(a.postedAt || 0);
    });
}


/* ══════════════════════════════════════════════════════════════════════════
   SECTION 3 — PORTAL READERS
   Fetches openings from career portals and merges them.
   ══════════════════════════════════════════════════════════════════════════ */
/**
 * SCAN ENGINE — fetches live openings, normalises them, filters to India, ranks.
 * Runs inside the Netlify function (or the local Node server). No AI, no credits.
 */


const UA = 'Mozilla/5.0 (compatible; IndiaJobScanner/1.0)';
const TIMEOUT_MS = 9000;

async function getJSON(url, opts = {}) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), opts.timeout || TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ctl.signal,
      method: opts.method || 'GET',
      headers: { 'User-Agent': UA, Accept: 'application/json', ...(opts.headers || {}) },
      body: opts.body,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

const clean = (html = '') =>
  String(html).replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim().slice(0, 1200);

// ─── Per-ATS adapters. Each returns a normalised job array. ──────────────────
const ADAPTERS = {
  async greenhouse(company) {
    const d = await getJSON(`https://boards-api.greenhouse.io/v1/boards/${company.ats.token}/jobs?content=true`);
    return (d.jobs || []).map((j) => ({
      title: j.title,
      location: j.location?.name || '',
      url: j.absolute_url,
      description: clean(j.content),
      postedAt: j.updated_at || j.first_published || null,
    }));
  },
  async lever(company) {
    const d = await getJSON(`https://api.lever.co/v0/postings/${company.ats.token}?mode=json`);
    return (d || []).map((j) => ({
      title: j.text,
      location: j.categories?.location || '',
      url: j.hostedUrl,
      description: clean(j.descriptionPlain || j.description),
      postedAt: j.createdAt ? new Date(j.createdAt).toISOString() : null,
    }));
  },
  async ashby(company) {
    const d = await getJSON(`https://api.ashbyhq.com/posting-api/job-board/${company.ats.token}?includeCompensation=false`);
    return (d.jobs || []).map((j) => ({
      title: j.title,
      location: j.location || '',
      url: j.jobUrl,
      description: clean(j.descriptionPlain || j.descriptionHtml),
      postedAt: j.publishedAt || null,
    }));
  },
  async smartrecruiters(company) {
    const d = await getJSON(`https://api.smartrecruiters.com/v1/companies/${company.ats.token}/postings?limit=100`);
    return (d.content || []).map((j) => ({
      title: j.name,
      location: [j.location?.city, j.location?.country].filter(Boolean).join(', '),
      url: `https://jobs.smartrecruiters.com/${company.ats.token}/${j.id}`,
      description: '',
      postedAt: j.releasedDate || null,
    }));
  },
  async workable(company) {
    const d = await getJSON(`https://apply.workable.com/api/v1/widget/accounts/${company.ats.token}?details=true`);
    return (d.jobs || []).map((j) => ({
      title: j.title,
      location: [j.city, j.country].filter(Boolean).join(', '),
      url: j.url || j.application_url,
      description: clean(j.description),
      postedAt: j.published_on || null,
    }));
  },
  async recruitee(company) {
    const d = await getJSON(`https://${company.ats.token}.recruitee.com/api/offers/`);
    return (d.offers || []).map((j) => ({
      title: j.title,
      location: [j.city, j.country].filter(Boolean).join(', '),
      url: j.careers_url,
      description: clean(j.description),
      postedAt: j.published_at || null,
    }));
  },
};

/** Scan every configured company board in parallel. Failures are recorded, never thrown. */
async function scanCompanyBoards() {
  const health = [];
  const settled = await Promise.allSettled(
    LIVE_COMPANIES.map(async (company) => {
      const adapter = ADAPTERS[company.ats.type];
      if (!adapter) throw new Error(`no adapter for ${company.ats.type}`);
      const raw = await adapter(company);
      return { company, raw };
    })
  );

  const jobs = [];
  settled.forEach((r, i) => {
    const company = LIVE_COMPANIES[i];
    if (r.status === 'rejected') {
      health.push({ company: company.name, source: company.ats.type, ok: false, count: 0, error: String(r.reason?.message || r.reason).slice(0, 60) });
      return;
    }
    const { raw } = r.value;
    const indian = raw.filter((j) => isIndiaLocation(j.location) || isIndiaLocation(j.description));
    health.push({ company: company.name, source: company.ats.type, ok: true, count: indian.length, total: raw.length });
    for (const j of indian) {
      if (!j.title || !j.url) continue;
      jobs.push({ ...j, company: company.name, industry: company.industry, tier: company.tier, source: `${company.ats.type} · direct portal` });
    }
  });
  return { jobs, health };
}

/**
 * Optional breadth layer: Adzuna India. Covers thousands of employers including
 * the ones with closed career portals (TCS, HDFC, Deloitte...). Free key, optional.
 */
async function scanAdzuna(profile, env) {
  const appId = env.ADZUNA_APP_ID;
  const appKey = env.ADZUNA_APP_KEY;
  if (!appId || !appKey) return { jobs: [], health: [{ company: 'Adzuna India', source: 'aggregator', ok: false, count: 0, error: 'No API key set (optional)' }] };

  const what = encodeURIComponent(profile.roleText || '');
  const where = encodeURIComponent((profile.locations || [])[0] || 'India');
  const pages = [1, 2];
  const out = [];
  let err = null;
  for (const page of pages) {
    try {
      const url = `https://api.adzuna.com/v1/api/jobs/in/search/${page}?app_id=${appId}&app_key=${appKey}&results_per_page=50&what=${what}&where=${where}&content-type=application/json`;
      const d = await getJSON(url, { timeout: 12000 });
      for (const j of d.results || []) {
        const companyName = j.company?.display_name || 'Unknown';
        const known = COMPANY_BY_NAME.get(companyName.toLowerCase());
        out.push({
          title: j.title?.replace(/<[^>]+>/g, '') || '',
          company: companyName,
          industry: known?.industry || j.category?.label || 'Other',
          tier: known?.tier || 4,
          location: j.location?.display_name || '',
          url: j.redirect_url,
          description: clean(j.description),
          postedAt: j.created || null,
          salary: j.salary_min ? `₹${Math.round(j.salary_min).toLocaleString('en-IN')}+` : null,
          source: 'Adzuna India · aggregator',
        });
      }
    } catch (e) {
      err = String(e.message).slice(0, 60);
      break;
    }
  }
  return { jobs: out, health: [{ company: 'Adzuna India', source: 'aggregator', ok: !err, count: out.length, error: err }] };
}

const dedupeKey = (j) => `${(j.company || '').toLowerCase()}|${(j.title || '').toLowerCase().replace(/\s+/g, ' ').trim()}`;

/** Build a pre-filled search link for every company, live feed or not. */
function buildCoverage(profile) {
  const q = encodeURIComponent(profile.roleText || '');
  return COMPANIES.map((c) => ({
    name: c.name,
    industry: c.industry,
    tier: c.tier,
    careers: c.careers,
    live: !!c.ats,
    verified: !!c.verified,
    searchLink: `https://www.google.com/search?q=${encodeURIComponent(`${c.name} careers ${profile.roleText || ''} ${(profile.locations || [])[0] || 'India'}`)}`,
    portalSearch: `${c.careers}${c.careers.includes('?') ? '&' : '?'}q=${q}`,
  }));
}

/** Main entry point used by both the Netlify function and the local server. */
async function runScan(profile, env = {}) {
  const started = Date.now();
  const [boards, adzuna] = await Promise.all([scanCompanyBoards(), scanAdzuna(profile, env)]);

  const seen = new Set();
  const merged = [];
  for (const j of [...boards.jobs, ...adzuna.jobs]) {
    const k = dedupeKey(j);
    if (seen.has(k)) continue;
    seen.add(k);
    merged.push(j);
  }

  const ranked = rankJobs(merged, profile);
  const health = [...boards.health, ...adzuna.health];

  return {
    generatedAt: new Date().toISOString(),
    tookMs: Date.now() - started,
    profile,
    counts: {
      scanned: merged.length,
      companiesLive: health.filter((h) => h.ok && h.count > 0).length,
      connectorsConfigured: health.length,
      perfect: ranked.filter((j) => j.match.bandClass === 'perfect').length,
      strong: ranked.filter((j) => j.match.bandClass === 'strong').length,
      eligible: ranked.filter((j) => j.match.eligible).length,
    },
    jobs: ranked.slice(0, 300),
    health,
    searchTerms: expandRoleTerms(profile.roleText, profile.roleFamilies).slice(0, 25),
  };
}


/* ══════════════════════════════════════════════════════════════════════════
   SECTION 4 — API
   The endpoints the web page calls.
   ══════════════════════════════════════════════════════════════════════════ */
/**
 * Netlify serverless function — the only backend this app needs.
 *
 *   GET  /api/companies   → company master + industries (for the Coverage view)
 *   POST /api/scan        → { profile } → ranked openings + connector health
 *
 * Runs server-side, so it can call company career-portal APIs directly without
 * being blocked by browser CORS. No AI model is called anywhere.
 */


const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'access-control-allow-headers': 'content-type',
      'access-control-allow-methods': 'GET,POST,OPTIONS',
      'cache-control': 'no-store',
    },
  });

export default async (req) => {
  if (req.method === 'OPTIONS') return json({ ok: true });

  const url = new URL(req.url);
  const action = url.searchParams.get('action') || (req.method === 'POST' ? 'scan' : 'companies');

  try {
    if (action === 'companies') {
      return json({
        industries: INDUSTRIES,
        roleFamilies: Object.keys(ROLE_FAMILIES),
        companies: COMPANIES.map((c) => ({
          name: c.name, industry: c.industry, tier: c.tier,
          careers: c.careers, live: !!c.ats, verified: !!c.verified,
        })),
      });
    }

    if (action === 'scan') {
      const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
      const profile = {
        roleText: String(body.roleText || '').slice(0, 120),
        roleFamilies: Array.isArray(body.roleFamilies) ? body.roleFamilies.slice(0, 6) : [],
        background: String(body.background || '').slice(0, 600),
        skills: Array.isArray(body.skills) ? body.skills.slice(0, 25) : [],
        locations: Array.isArray(body.locations) ? body.locations.slice(0, 6) : [],
        years: Math.max(0, Math.min(40, Number(body.years) || 0)),
        openToRemote: body.openToRemote !== false,
        targetIndustries: Array.isArray(body.targetIndustries) ? body.targetIndustries.slice(0, 14) : [],
      };

      const env = {
        ADZUNA_APP_ID: process.env.ADZUNA_APP_ID,
        ADZUNA_APP_KEY: process.env.ADZUNA_APP_KEY,
      };

      const result = await runScan(profile, env);
      result.coverage = buildCoverage(profile);
      return json(result);
    }

    return json({ error: `Unknown action "${action}"` }, 400);
  } catch (err) {
    return json({ error: String(err?.message || err), where: 'api' }, 500);
  }
};

export const config = { path: ['/api', '/api/*'] };
