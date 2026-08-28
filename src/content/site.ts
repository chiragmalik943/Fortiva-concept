// Single source of truth for the site's information architecture and contact
// details — same convention as `assets/images.ts`, so changing a phone number
// or a nav label is a one-line edit here rather than a hunt through components.
//
// ─────────────────────────────────────────────────────────────────────────────
// TODO(client): every value marked PLACEHOLDER below ships as "[Insert …]" in
// FTVA_Web Copy.odt — the copy doc never supplies the real values. They render
// verbatim on the page on purpose, so the gap is impossible to miss in review.
// The ONE real number anywhere in the doc is REACH_PHONE (enrollment support).
// ─────────────────────────────────────────────────────────────────────────────

export interface NavChild {
  label: string
  href: string
}

export interface NavItem {
  label: string
  href: string
  children?: NavChild[]
}

/**
 * Top-level IA, taken from the copy doc's own page structure.
 *
 * Note on "Partner with Us": the doc presents it as a top-level page, but its
 * copy is entirely provider-facing ("As a provider, partnering with us means
 * joining a movement…", "H2: FOR providers"), so it nests under For Providers.
 * That keeps the nav at five items, which fits the approved pill — seven
 * would not have.
 */
export const navigation: NavItem[] = [
  { label: 'About', href: '/about' },
  {
    label: 'Plans',
    href: '/plans',
    children: [
      { label: 'Individuals & Families', href: '/plans/individuals-and-families' },
      { label: 'Employers', href: '/plans/employers' },
    ],
  },
  {
    label: 'For Members',
    href: '/members',
    children: [
      { label: 'Find a Doctor', href: '/members/find-a-doctor' },
      { label: 'Virtual Care', href: '/members/virtual-care' },
      { label: 'Resources', href: '/members/resources' },
      { label: 'FAQs', href: '/members/faqs' },
      { label: 'Download the App', href: '/members/app' },
      { label: 'Member Portal', href: '/members/portal' },
    ],
  },
  {
    label: 'For Brokers',
    href: '/brokers',
    children: [
      { label: 'Broker Overview', href: '/brokers' },
      { label: 'Resources', href: '/brokers/resources' },
      { label: 'FAQs', href: '/brokers/faqs' },
      { label: 'Broker Portal', href: '/brokers/portal' },
    ],
  },
  {
    label: 'For Providers',
    href: '/providers',
    children: [
      { label: 'Provider Overview', href: '/providers' },
      { label: 'Provider Portal', href: '/providers/portal' },
      { label: 'Partner with Us', href: '/providers/partner-with-us' },
    ],
  },
]

/** Flat link list for the footer — the full IA including footer-only pages. */
export const footerNav: NavChild[] = [
  { label: 'About', href: '/about' },
  { label: 'Plans', href: '/plans' },
  { label: 'For Members', href: '/members' },
  { label: 'For Brokers', href: '/brokers' },
  { label: 'For Providers', href: '/providers' },
  { label: 'Partner with Us', href: '/providers/partner-with-us' },
  { label: 'Available States', href: '/available-states' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQs', href: '/members/faqs' },
]

/**
 * REACH is named in FAQ #3 as Fortiva's enrollment support partner. This is
 * deliberately NOT reused as the member-services number — the doc scopes it to
 * enrollment guidance only, so it appears in the enrollment steps and nowhere
 * else.
 */
export const REACH_PHONE = '1-866-886-2030'

export interface ContactAudience {
  /** Heading, kept in the doc's own "FOR …" voice */
  heading: string
  blurb: string
  phone: string
  email: string
  actions: { label: string; href: string }[]
}

export const contactAudiences: ContactAudience[] = [
  {
    heading: 'FOR members',
    blurb: 'Have questions about your coverage or need assistance? We’ve got you covered.',
    phone: '[Insert Member Services Phone Number]', // PLACEHOLDER — from copy doc
    email: '[Insert Member Services Email Address]', // PLACEHOLDER — from copy doc
    actions: [{ label: 'Member Portal', href: '/members/portal' }],
  },
  {
    heading: 'FOR brokers',
    blurb: 'Partnering with Fortiva means having the tools and support to grow your business.',
    phone: '[Insert Broker Support Phone Number]', // PLACEHOLDER — from copy doc
    email: '[Insert Broker Support Email Address]', // PLACEHOLDER — from copy doc
    actions: [{ label: 'Broker Portal', href: '/brokers/portal' }],
  },
  {
    heading: 'FOR providers',
    blurb: 'We value our provider network and make it easy to manage claims and patient coverage.',
    phone: '[Insert Provider Support Phone Number]', // PLACEHOLDER — from copy doc
    email: '[Insert Provider Support Email Address]', // PLACEHOLDER — from copy doc
    actions: [
      { label: 'Provider Portal', href: '/providers/portal' },
      { label: 'Submit a Claim', href: '/providers/portal#submit-a-claim' },
    ],
  },
]

/**
 * The copy doc says only "a North Carolina-based company" — there is no street
 * address anywhere in it. The previous hard-coded Omaha, NE address contradicted
 * the copy outright, so it's gone; this is the most the doc actually supports.
 */
export const companyLocation = 'North Carolina, United States'

/**
 * Availability. Copy doc, "Available States — Footer".
 *
 * `code` is the two-letter postal abbreviation, and it doubles as the join key
 * between this list and the dot map's geometry in
 * components/AvailableStates/mapStates.ts. The map draws a state only if it
 * appears here, so launching in a new one is a single-line edit — provided its
 * dots exist in the artwork (see that file's regeneration note).
 */
export type AvailabilityStatus = 'live' | 'coming-soon'

export interface AvailabilityState {
  code: string
  name: string
  status: AvailabilityStatus
}

export const availabilityStates: AvailabilityState[] = [
  { code: 'NC', name: 'North Carolina', status: 'live' },
  { code: 'SC', name: 'South Carolina', status: 'coming-soon' },
  { code: 'GA', name: 'Georgia', status: 'coming-soon' },
  { code: 'FL', name: 'Florida', status: 'coming-soon' },
  { code: 'AL', name: 'Alabama', status: 'coming-soon' },
  { code: 'TN', name: 'Tennessee', status: 'coming-soon' },
]

/** Names only, for anywhere that wants prose rather than the full records. */
export const availability = {
  live: availabilityStates.filter((s) => s.status === 'live').map((s) => s.name),
  comingSoon: availabilityStates
    .filter((s) => s.status === 'coming-soon')
    .map((s) => s.name),
}

/**
 * Named in member FAQ #6 as the compliance and claims-administration partner.
 * The doc contains no other regulatory language — notably no "not major
 * medical / not ACA-compliant" disclaimer, which limited-medical and
 * short-term-medical products normally require. Nothing has been invented here;
 * see the handover notes.
 */
export const claimsPartnerNote =
  'Claims administration and compliance technology provided by Detego Health.'

/** "How did you hear about us?" — options exactly as listed in the copy doc. */
export const referralSources = [
  'Broker or Agent',
  'Friend or Family',
  'Online',
  'Social Media',
  'TV',
  'Print Ad',
  'Other',
]

/* ═════════════════════════════════════════════════════════════════════════════
   For Members
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * The member FAQs.
 *
 * They live here rather than in a component because TWO places render them: the
 * homepage FAQ band shows four, and For Members → FAQs shows all of them,
 * grouped by category. Before this, the homepage held its own hard-coded copy of
 * four answers, which meant a client edit to an answer had to be made twice or it
 * would silently disagree with itself.
 *
 * `a` is an array because the enrolment answer is genuinely three paragraphs in
 * the doc; the homepage compresses it, the FAQs page doesn't.
 *
 * ── Two sources, kept apart on purpose ──────────────────────────────────────
 * `docFaqs` is the copy doc's "FAQs — Sub Navigation", verbatim and unabridged.
 * `fillerFaqs` is lorem ipsum, added so the four categories carry ten questions
 * each and the grouping, rail and scroll-spy can be judged at real length. The
 * two arrays are concatenated rather than interleaved, so deleting the filler is
 * a one-line change and no client sentence can be lost with it. Within each
 * category the doc's questions therefore always come first.
 *
 * ── Why `id` ────────────────────────────────────────────────────────────────
 * The homepage used to pick its four by array index, which quietly meant
 * "whatever is 1st, 2nd, 3rd and 5th". Adding thirty-two questions and sorting
 * them into groups makes that a trap, so the selection is by id now — reordering
 * or deleting anything can no longer change which four the homepage shows, and a
 * removed id fails loudly instead of silently promoting its neighbour.
 */
export type FaqCategoryId = 'plans' | 'enrolling' | 'costs' | 'using'

export interface FaqCategory {
  id: FaqCategoryId
  /** Rail label and group heading. */
  label: string
  /** One line under the group heading. */
  blurb: string
}

/** Rail order and group order both come from this array — there is one source. */
export const faqCategories: FaqCategory[] = [
  {
    id: 'plans',
    label: 'Plans & coverage',
    blurb: 'What Fortiva is, what the tiers include and what is covered.',
  },
  {
    id: 'enrolling',
    label: 'Enrolling & eligibility',
    blurb: 'Signing up, who qualifies, and when you can join or switch.',
  },
  {
    id: 'costs',
    label: 'Costs & claims',
    blurb: 'Premiums, what you pay at the point of care, and how claims are handled.',
  },
  {
    id: 'using',
    label: 'Using your plan',
    blurb: 'The portal, virtual care, finding a provider and reaching a person.',
  },
]

export interface MemberFaq {
  /** Stable key. Referenced by HOMEPAGE_FAQ_IDS — do not renumber. */
  id: string
  category: FaqCategoryId
  q: string
  a: string[]
  action?: { label: string; href: string }
}

/** The copy doc's own eight, verbatim. */
const docFaqs: MemberFaq[] = [
  {
    id: 'what-is-fortiva',
    category: 'plans',
    q: 'What is Fortiva and what makes it different?',
    a: [
      'Fortiva is a North Carolina-based health insurance company committed to disrupting the traditional market by delivering affordable, value-based coverage that puts people — not premiums — first. Our plans are designed to be flexible, transparent and powered by technology for a simpler, more personalized experience.',
    ],
  },
  {
    id: 'plan-types',
    category: 'plans',
    q: 'What types of plans does Fortiva offer?',
    a: [
      'We provide multi-tiered health insurance options, including limited medical and short-term medical plans, along with supplemental coverage like Critical Illness and Accidental Death & Dismemberment. These plans are tailored for individuals, families and small businesses seeking affordable alternatives to traditional Affordable Care Act plans.',
    ],
    action: { label: 'See all plans', href: '/plans' },
  },
  {
    id: 'how-to-enroll',
    category: 'enrolling',
    q: 'How do I enroll in a Fortiva plan?',
    a: [
      'Getting started with Fortiva is simple and technology-driven. Members can explore plans, compare options and enroll through the Fortiva website.',
      `For additional support, REACH, Fortiva's trusted enrollment support partner, offers licensed, human-led guidance by phone at ${REACH_PHONE} to help individuals navigate their options and enroll with confidence.`,
      "Fortiva's digital tools and member-first support team are available to provide guidance at every step.",
    ],
    action: { label: 'Learn more', href: '/plans' },
  },
  {
    id: 'preventive-care',
    category: 'plans',
    q: 'Does Fortiva cover preventive care?',
    a: [
      'Yes. Our value-based approach prioritizes preventive care and proactive health management to help you stay healthy and avoid costly surprises.',
    ],
  },
  {
    id: 'affordability',
    category: 'costs',
    q: 'How does Fortiva keep costs affordable?',
    a: [
      'We focus on underserved markets and leverage technology to streamline operations, reduce overhead and deliver transparent pricing. Our plans are designed to fit real-life budgets without compromising quality care.',
    ],
  },
  {
    id: 'detego-health',
    category: 'costs',
    q: 'Who is Detego Health and how does it work with Fortiva?',
    a: [
      'Detego Health is a trusted partner that provides advanced technology solutions for compliance and claims administration. By working with Detego Health, Fortiva ensures a seamless, secure and efficient experience for members — from enrollment to claims processing — while maintaining transparency and regulatory compliance.',
    ],
  },
  {
    id: 'manage-online',
    category: 'using',
    q: 'Can I manage my plan online?',
    a: [
      'Absolutely. Our member portal allows you to view your coverage, track claims and access helpful resources anytime, anywhere.',
    ],
    action: { label: 'Access your portal', href: '/members/portal' },
  },
  {
    id: 'need-help',
    category: 'using',
    q: 'What if I have questions or need help?',
    a: [
      'Our member-first support team is available to assist you with plan details, claims and any questions you may have. We’re here to make health insurance simple and stress-free.',
    ],
    action: { label: 'Contact us', href: '/contact' },
  },
]

/**
 * PLACEHOLDER — TODO(client). Everything below this line is lorem ipsum: thirty-
 * two filler questions, eight to nine per category, so each of the four groups
 * on For Members → FAQs holds ten. It exists to prove the grouping, the category
 * rail and the scroll-spy at the length the real list will be, and it is written
 * in Latin precisely so nobody can mistake it for approved copy or ship it by
 * accident.
 *
 * To remove it: delete this block and drop `...fillerFaqs` from `memberFaqs`
 * below. Nothing else references it.
 *
 * Answers are drawn from LOREM_PARAS by position — every third question gets two
 * paragraphs rather than one, so the accordion is exercised at both heights.
 */
const LOREM_PARAS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
  'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
  'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.',
  'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
  'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.',
]

const LOREM_QUESTIONS: [FaqCategoryId, string][] = [
  ['plans', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?'],
  ['plans', 'Quis nostrud exercitation ullamco laboris nisi ut aliquip?'],
  ['plans', 'Excepteur sint occaecat cupidatat non proident sunt in culpa?'],
  ['plans', 'Totam rem aperiam eaque ipsa quae ab illo inventore veritatis?'],
  ['plans', 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur?'],
  ['plans', 'Ut enim ad minima veniam quis nostrum exercitationem?'],
  ['plans', 'Quia consequuntur magni dolores eos qui ratione sequi nesciunt?'],

  ['enrolling', 'Sed do eiusmod tempor incididunt ut labore et dolore magna?'],
  ['enrolling', 'Duis aute irure dolor in reprehenderit in voluptate velit?'],
  ['enrolling', 'Sunt in culpa qui officia deserunt mollit anim id est laborum?'],
  ['enrolling', 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem?'],
  ['enrolling', 'Quasi architecto beatae vitae dicta sunt explicabo?'],
  ['enrolling', 'Neque porro quisquam est qui dolorem ipsum quia dolor?'],
  ['enrolling', 'Adipisci velit sed quia non numquam eius modi tempora?'],
  ['enrolling', 'Quaerat voluptatem ut aliquid ex ea commodi consequatur?'],
  ['enrolling', 'Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?'],

  ['costs', 'Consectetur adipiscing elit sed do eiusmod tempor incididunt?'],
  ['costs', 'Ut labore et dolore magnam aliquam quaerat voluptatem?'],
  ['costs', 'Nisi ut aliquid ex ea commodi consequatur quis autem vel?'],
  ['costs', 'Eum iure reprehenderit qui in ea voluptate velit esse quam?'],
  ['costs', 'Nihil molestiae consequatur vel illum qui dolorem eum fugiat?'],
  ['costs', 'At vero eos et accusamus et iusto odio dignissimos ducimus?'],
  ['costs', 'Blanditiis praesentium voluptatum deleniti atque corrupti?'],
  ['costs', 'Quos dolores et quas molestias excepturi sint occaecati?'],

  ['using', 'Cupiditate non provident similique sunt in culpa qui officia?'],
  ['using', 'Deserunt mollitia animi id est laborum et dolorum fuga?'],
  ['using', 'Et harum quidem rerum facilis est et expedita distinctio?'],
  ['using', 'Nam libero tempore cum soluta nobis est eligendi optio?'],
  ['using', 'Cumque nihil impedit quo minus id quod maxime placeat?'],
  ['using', 'Omnis voluptas assumenda est omnis dolor repellendus?'],
  ['using', 'Temporibus autem quibusdam et aut officiis debitis aut rerum?'],
  ['using', 'Itaque earum rerum hic tenetur a sapiente delectus?'],
]

const fillerFaqs: MemberFaq[] = LOREM_QUESTIONS.map(([category, q], i) => ({
  id: `lorem-${String(i + 1).padStart(2, '0')}`,
  category,
  q,
  a:
    i % 3 === 0
      ? [LOREM_PARAS[i % LOREM_PARAS.length], LOREM_PARAS[(i + 3) % LOREM_PARAS.length]]
      : [LOREM_PARAS[i % LOREM_PARAS.length]],
}))

export const memberFaqs: MemberFaq[] = [...docFaqs, ...fillerFaqs]

/**
 * Which four the homepage band shows, by id rather than by position. Every id
 * here is one of the doc's own eight — the homepage never shows filler.
 */
export const HOMEPAGE_FAQ_IDS = ['what-is-fortiva', 'plan-types', 'how-to-enroll', 'affordability']

/**
 * "Expert resources" on For Members → Resources. Every URL below is one the copy
 * doc supplies verbatim; none has been substituted or shortened, and all of them
 * point off-site, which is why each card announces its host — a visitor should
 * know they are leaving Fortiva before they click, not after.
 */
export interface ExpertResource {
  title: string
  body: string
  cta: string
  href: string
  /** Shown on the card, so leaving the site is never a surprise. */
  host: string
}

export interface ExpertResourceGroup {
  heading: string
  items: ExpertResource[]
}

export const expertResources: ExpertResourceGroup[] = [
  {
    heading: 'Health risk and wellness calculators',
    items: [
      {
        title: 'Body Mass Index calculator',
        body: 'Quickly calculate your Body Mass Index and understand your weight category.',
        cta: 'Calculate',
        href: 'https://diabetes.org/bmi-calculator',
        host: 'diabetes.org',
      },
      {
        title: 'Heart disease risk assessment',
        body: 'Estimate your risk for heart disease and get personalized tips.',
        cta: 'Calculate',
        href: 'https://professional.heart.org/en/guidelines-and-statements/prevent-calculator',
        host: 'professional.heart.org',
      },
      {
        title: 'Diabetes risk assessment',
        body: 'Find out if you’re at risk for type 2 diabetes in just 60 seconds.',
        cta: 'Calculate',
        href: 'https://diabetes.org/diabetes-risk-test',
        host: 'diabetes.org',
      },
    ],
  },
  {
    heading: 'Mental health and well-being',
    items: [
      {
        title: 'Mental health screening',
        body: 'Free, confidential screening tools for anxiety, depression and more.',
        cta: 'Learn more',
        href: 'https://screening.mhanational.org/screening-tools/',
        host: 'screening.mhanational.org',
      },
      {
        title: 'Stress management tips',
        body: 'Learn practical ways to manage stress and improve resilience.',
        cta: 'Learn more',
        href: 'https://www.nimh.nih.gov/health/publications/so-stressed-out-fact-sheet',
        host: 'nimh.nih.gov',
      },
    ],
  },
  {
    heading: 'Nutrition and lifestyle',
    items: [
      {
        title: 'MyPlate Plan',
        body: 'Get a personalized nutrition plan based on your age, sex, height, weight and activity level.',
        cta: 'Get started',
        href: 'https://www.myplate.gov/myplate-plan',
        host: 'myplate.gov',
      },
      {
        title: 'Smoking cessation',
        body: 'Create a personalized quit plan, get text support and access tools to help you stop smoking for good.',
        cta: 'Get started',
        href: 'https://smokefree.gov/build-your-quit-plan',
        host: 'smokefree.gov',
      },
    ],
  },
]

/**
 * Destinations the copy doc names but never gives a URL for.
 *
 * Each of these is a button the doc explicitly asks for — "Find a Doctor",
 * "Schedule an appointment", "Access your Member Portal", "Download now" — on a
 * system that doesn't exist in this repo. They ship as '#' rather than being
 * pointed at a plausible-looking guess, and `isPlaceholderHref` below lets a
 * component render the button in a visibly unfinished state instead of shipping
 * a link that silently goes nowhere.
 *
 * TODO(client): replace all five and the placeholder styling disappears on its
 * own — no component needs editing.
 */
export const externalTargets = {
  providerDirectory: '#', // PLACEHOLDER — provider search
  myLiveDoc: '#', // PLACEHOLDER — telehealth scheduling
  memberPortal: '#', // PLACEHOLDER — portal sign-in
  brokerPortal: '#', // PLACEHOLDER — broker portal sign-in
  appStore: '#', // PLACEHOLDER — Apple App Store listing
  playStore: '#', // PLACEHOLDER — Google Play listing
}

export const isPlaceholderHref = (href: string) => href === '#'
