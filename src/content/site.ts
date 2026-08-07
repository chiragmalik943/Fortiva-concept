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
