import {
  HeartPulse,
  Umbrella,
  Receipt,
  CalendarClock,
  Users,
  Briefcase,
  Building2,
  FileText,
  Wallet,
  Layers,
  MonitorSmartphone,
} from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import PlanCatalog, { type PlanProduct } from '../components/PlanCatalog/PlanCatalog'
import FeatureReveal from '../components/FeatureReveal/FeatureReveal'
import StepFlow, { type Step } from '../components/StepFlow/StepFlow'
import CtaBand from '../components/CtaBand/CtaBand'
import Button from '../components/Button'
import { type Feature } from '../components/featureTypes'
import { Link } from '../router/router'
import { REACH_PHONE } from '../content/site'
import { scrollPageTo } from '../hooks/useLenis'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useSplitReveal } from '../hooks/useSplitReveal'

/**
 * Plans — the section index.
 *
 * Copy is FTVA_Web Copy.odt's final section, headed simply "Plans". Its seven
 * headings map to this page one-for-one:
 *
 *   H1 + the two intro paragraphs   → PageHero + the opening band
 *   Fortiva Critical Illness    ─┐
 *   Fortiva Accident Protection  │→ <PlanCatalog />, the sticky rail + four panels
 *   Fortiva Fixed Indemnity      │
 *   Fortiva Short-Term Medical  ─┘
 *   Designed for individuals, families and small businesses → the three-card band
 *   Enrollment made simple         → <StepFlow />
 *   Why Fortiva plans are different → <FeatureReveal />, the scroll-in cards
 *   the closing sentence            → <CtaBand tone="gold" />
 *
 * ── Where this page sits ────────────────────────────────────────────────────
 * `/plans` is the parent of two pages that were built first, and the three have
 * to divide the work rather than repeat it. Individuals & Families and Employers
 * are AUDIENCE pages: who Fortiva is for and what it promises them, both opening
 * on `teal`. This one is the PRODUCT page — the only place on the site that names
 * the four plans and says what each pays for — and it opens on `dark`, so the
 * descent from the section index to either child reads as navy → teal rather than
 * as three variations of the same surface.
 *
 * ── No photograph on it ─────────────────────────────────────────────────────
 * Deliberately, and for the reason recorded in README.md under "No photographs on
 * any of them": no image on this site is reused anywhere, and this page arrived
 * with no assets of its own. Borrowing one from Individuals & Families or the
 * homepage would break that on the first section. So the page is built from type,
 * the grey plate, the navy FeatureReveal and the gold close — which is the same
 * palette the six For Members pages run on, and leaves an obvious slot when real
 * photography exists. `FeatureReveal`'s `image` prop is optional; passing nothing
 * gives it a flat navy surface and centres the copy column, which is the layout
 * it was built to fall back to.
 */

/* ── The four products ──────────────────────────────────────────────────────
   Every field below is the copy doc's, in its own order: the H2 becomes `name`,
   the "Subhead:" line becomes `subhead`, the paragraph becomes `body`, and the
   two lists are reproduced item for item.

   `bestFor` is the one condensed field, and it is a shortening rather than an
   addition — each of the four paragraphs opens by naming its own audience, so
   that clause is lifted to the top of the card where someone scanning four plans
   can use it. `railLabel` exists because all four names begin "Fortiva", which in
   a four-row rail is the word you read four times and the one that tells you
   nothing.

   `icon` is the only thing here the doc does not supply — the same convention
   every other `Feature` list on the site follows. */
const planProducts: PlanProduct[] = [
  {
    id: 'critical-illness',
    name: 'Fortiva Critical Illness',
    railLabel: 'Critical Illness',
    subhead: 'Support for major health events',
    body: 'Fortiva Critical Illness is ideal for individuals and families who want protection against the financial impact of serious diagnoses, particularly those without comprehensive major medical coverage or those who are self-employed or working as 1099 contractors. The plan pays a lump-sum benefit after a first-ever diagnosis or qualifying procedure, helping cover everyday expenses while you focus on recovery.',
    coverage: [
      'Cancer',
      'Heart attack and stroke',
      'Major organ transplant',
      'Kidney failure, paralysis, coma and severe burns',
      'Vision and hearing loss related to critical illness',
    ],
    whyItMatters: [
      'Helps cover everyday expenses while recovering',
      'Benefits are paid directly to the insured',
      'Reduces financial stress during major health events',
    ],
    bestFor:
      'Individuals and families without comprehensive major medical coverage, and anyone self-employed or working as a 1099 contractor.',
    icon: HeartPulse,
  },
  {
    id: 'accident-protection',
    name: 'Fortiva Accident Protection',
    railLabel: 'Accident Protection',
    subhead: 'Support when accidents disrupt life',
    body: 'Fortiva Accident Protection is designed for people who want added financial protection when the unexpected happens. It’s a strong fit for working owners, independent contractors and families who want extra coverage beyond traditional medical insurance, especially when high deductibles or limited plans leave gaps. Benefits are paid directly to the covered person to help manage out-of-pocket costs and income disruption after an accident.',
    coverage: [
      'Accidental death and dismemberment benefits',
      'Covered losses involving life, limb, sight, speech and hearing',
      'Accident-related medical expenses',
      'Short-term income protection for total disability',
    ],
    whyItMatters: [
      'Provides financial protection when accidents impact work and income',
      'Designed to complement high-deductible or limited medical coverage',
      'Simple structure with predictable payouts',
    ],
    bestFor:
      'Working owners, independent contractors and families whose high-deductible or limited medical plan leaves a gap.',
    icon: Umbrella,
  },
  {
    id: 'fixed-indemnity',
    name: 'Fortiva Fixed Indemnity',
    railLabel: 'Fixed Indemnity',
    subhead: 'Predictable benefits for everyday care',
    body: 'Fortiva Fixed Indemnity works well for people who want cost certainty and straightforward benefits, including working owners with high deductibles, seasonal or hourly workers and individuals looking to supplement limited or catastrophic coverage. The plan provides cash benefits tied to specific health care services, regardless of other insurance, so members know what to expect when care happens.',
    coverage: [
      'Hospital confinement and ICU stays',
      'Inpatient and outpatient surgery',
      'Emergency room and ambulance services',
      'Mental health and substance use treatment',
      'Preventive, rehabilitative and diagnostic services',
    ],
    whyItMatters: [
      'Predictable daily or per-service benefits',
      'Can supplement limited or catastrophic coverage',
      'Broad support across many types of care',
    ],
    bestFor:
      'Working owners with high deductibles, seasonal and hourly workers, and anyone supplementing limited or catastrophic coverage.',
    icon: Receipt,
  },
  {
    id: 'short-term-medical',
    name: 'Fortiva Short-Term Medical',
    railLabel: 'Short-Term Medical',
    subhead: 'Temporary coverage when you need it most',
    body: 'Fortiva Short-Term Medical is built for people in transition, such as individuals between jobs, early retirees or workers waiting for employer or alternative coverage. It offers temporary medical coverage outside traditional insurance timelines, helping protect against large, unexpected medical expenses during coverage gaps.',
    coverage: [
      'Inpatient hospital care',
      'Surgical services',
      'Emergency and urgent care',
      'Physician visits and outpatient treatment',
      'Diagnostic and preventive services',
    ],
    whyItMatters: [
      'Flexible coverage durations',
      'Supports temporary or transitional coverage needs',
      'Helps manage large, unexpected medical expenses',
    ],
    bestFor:
      'People in transition — between jobs, early retired, or waiting on employer or alternative coverage to begin.',
    icon: CalendarClock,
  },
]

/* "Designed for individuals, families and small businesses" — the doc's three
   bullets, each given the one-line gloss its own bullet already contains. */
const audiences = [
  {
    title: 'Individuals and families',
    body: 'Seeking affordable alternatives to traditional health insurance, with clear pricing and defined benefits.',
    icon: Users,
    href: '/plans/individuals-and-families',
    linkLabel: 'Individuals & Families',
  },
  {
    title: 'Gig workers and the self-employed',
    body: 'Freelancers, 1099 contractors and self-employed professionals buying their own cover.',
    icon: Briefcase,
    /* Same destination as the card above it, and that is correct rather than a
       copy-paste: Individuals & Families is the page for anyone buying their own
       cover, whether they are a household or a sole trader. It is a text link
       rather than a button for exactly that reason — two identical pill buttons
       side by side read as a mistake, where two small "where this goes" links
       read as what they are. */
    href: '/plans/individuals-and-families',
    linkLabel: 'Individuals & Families',
  },
  {
    title: 'Small businesses',
    body: 'Looking to offer cost-effective health benefits that scale with the size of the team.',
    icon: Building2,
    href: '/plans/employers',
    linkLabel: 'Employers',
  },
]

/* "Enrollment made simple". The doc gives two paragraphs rather than a numbered
   list, and these three steps are its own sentence — "explore, compare and enroll
   in coverage" — set out as the sequence it describes. The human-guidance
   paragraph becomes the note under the rail rather than a fourth step, because
   support runs alongside all three rather than after them. */
const enrollmentSteps: Step[] = [
  {
    title: 'Explore',
    body: 'Review the four plans and what each one pays for, online and at your own pace.',
  },
  {
    title: 'Compare',
    body: 'Weigh the options side by side — coverage, cost and how each fits the gap you have.',
  },
  {
    title: 'Enroll',
    body: 'Choose your cover and complete enrollment, with support available at every step.',
  },
]

/* "Why Fortiva plans are different" — the doc's four bullets, verbatim, with the
   one-line gloss each already carries. */
const differences: Feature[] = [
  {
    title: 'Clear, upfront plan details',
    body: 'What is covered is stated before care is needed, not discovered after it.',
    icon: FileText,
  },
  {
    title: 'Affordable options designed for real budgets',
    body: 'Priced for the households and businesses these plans are actually for.',
    icon: Wallet,
  },
  {
    title: 'Flexible coverage with optional supplemental benefits',
    body: 'Start with the cover you need and add protection where the gaps are.',
    icon: Layers,
  },
  {
    title: 'Technology-driven tools paired with human-first support',
    body: 'Enroll and manage your plan online, and reach a person whenever you would rather.',
    icon: MonitorSmartphone,
  },
]

export default function Plans() {
  const openingHeadingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const openingBodyRef = useScrollReveal<HTMLParagraphElement>({ y: 24, delay: 0.1 })
  const openingTailRef = useScrollReveal<HTMLDivElement>({ y: 24, delay: 0.2 })

  const audienceHeadingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const audienceTailRef = useScrollReveal<HTMLParagraphElement>({ y: 22, delay: 0.15 })

  return (
    <>
      <PageHero
        tone="dark"
        eyebrow="PLANS"
        titleTop="Plans built"
        titleBottom="for real life."
        lede={
          <>
            Fortiva offers affordable health coverage designed for individuals, families and
            small businesses who want simpler options and more control over their health care
            decisions.
          </>
        }
        actions={
          <>
            {/* An in-page jump, and it goes through `scrollPageTo` rather than
                a bare `href="#critical-illness"`. Lenis owns the scroll position,
                so a native fragment jump is overwritten on the next frame — and
                it would land the panel behind the floating nav pill, which
                scrollPageTo's NAV_OFFSET accounts for. */}
            <Button
              variant="gold"
              icon="arrow"
              size="lg"
              onClick={() => scrollPageTo('#critical-illness')}
            >
              See the four plans
            </Button>
            <Button variant="white" size="lg" href="/contact">
              Get a Quote
            </Button>
          </>
        }
      />

      {/* ── The opening band ──────────────────────────────────────────────
          The doc's two intro paragraphs, and they are not the same kind of
          sentence: the first says who the plans are for, the second says what
          shape they take. So the second gets the gold rule and the larger size
          that About's "What we do" column uses for exactly the same job — a claim
          the page wants read rather than skimmed — instead of both sitting at body
          size in one column. */}
      <section className="bg-white px-6 py-24 sm:py-32">
        <div className="mx-auto grid max-w-container items-start gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2
              ref={openingHeadingRef}
              className="max-w-lg text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px]"
            >
              Coverage for people the market{' '}
              <span className="text-gold-dark">keeps missing</span>
            </h2>
            <p
              ref={openingBodyRef}
              className="mt-7 max-w-xl text-[19px] leading-[1.5] text-navy-800/85 opacity-0 sm:text-[21px]"
            >
              Fortiva plans are created for people who may not qualify for Affordable Care Act
              subsidies, or who are looking for alternatives that better align with their needs
              and budget.
            </p>
          </div>

          <div ref={openingTailRef} className="opacity-0 lg:pt-14">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/50">
              What that <span className="text-gold-dark">looks like</span>
            </h3>
            <p className="mt-5 border-l-2 border-gold pl-6 text-[20px] leading-[1.5] text-navy-800/80 sm:text-[22px]">
              Instead of one-size-fits-all coverage, Fortiva provides multi-tiered plans with
              clear pricing, defined benefits and the option to add supplemental coverage for
              extra protection.
            </p>
          </div>
        </div>
      </section>

      <PlanCatalog
        eyebrow="THE PLANS"
        heading={
          <>
            Four plans, and what <span className="text-gold-dark">each one covers</span>
          </>
        }
        intro="Each is a standalone plan rather than a tier of one product, so the question is which gap you are closing — not how much of the same plan to buy."
        plans={planProducts}
        action={
          <>
            <Button variant="dark" icon="arrow" href="/contact">
              Get a Quote
            </Button>
            <Button variant="ghost" href="/members/faqs">
              Read the FAQs
            </Button>
          </>
        }
      />

      {/* ── Designed for individuals, families and small businesses ───────
          The doc's three bullets as three cards, on white with a hairline rather
          than on a second grey plate — PlanCatalog above is already grey, and two
          tinted sections running together would read as one long band with a seam
          in it. Each card links on to whichever of the two audience pages covers
          it, which is the only place on this page those two are reachable from
          other than the nav. */}
      <section className="bg-white px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-container">
          <h2
            ref={audienceHeadingRef}
            className="max-w-2xl text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px]"
          >
            Designed for <span className="text-gold-dark">individuals, families</span> and small
            businesses
          </h2>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {audiences.map((audience, i) => (
              <AudienceCard key={audience.title} {...audience} delay={i * 0.08} />
            ))}
          </div>

          <p
            ref={audienceTailRef}
            className="mt-12 max-w-2xl text-[17px] leading-relaxed text-navy-800/65 opacity-0 sm:text-[18px]"
          >
            Each plan is designed to balance affordability with clarity, helping members
            understand what&rsquo;s covered before care is needed.
          </p>
        </div>
      </section>

      {/* ── Enrollment made simple ────────────────────────────────────────
          The same rail Virtual Care's "How it works" runs on, and on the same
          `cream` (#CCD0D2) surface, so the two read as one site explaining two
          processes rather than as two pages that each invented a numbered list.

          The REACH number is the ONE real contact detail the copy doc supplies
          anywhere, and it is scoped to enrollment guidance — see the note on
          REACH_PHONE in content/site.ts. It belongs here and nowhere else. */}
      <StepFlow
        surface="cream"
        eyebrow="ENROLLMENT"
        heading={
          <>
            Enrollment made <span className="text-gold-dark">simple</span>
          </>
        }
        intro="Fortiva makes it easy to explore, compare and enroll in coverage. Members can review plan options online and receive support throughout the process."
        steps={enrollmentSteps}
        action={
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="dark" icon="arrow" href="/contact">
                Get a Quote
              </Button>
              <Button variant="light" href="/members/faqs">
                How enrollment works
              </Button>
            </div>
            <p className="max-w-xl text-[14.5px] leading-relaxed text-navy-800/65">
              Prefer to talk it through? Fortiva works with trusted enrollment support partners
              for licensed, personalized assistance &mdash; REACH is reachable on{' '}
              <a
                href={`tel:${REACH_PHONE.replace(/[^\d+]/g, '')}`}
                className="font-semibold text-navy-800 underline underline-offset-4 transition-colors hover:text-gold-dark"
              >
                {REACH_PHONE}
              </a>
              .
            </p>
          </div>
        }
      />

      {/* ── Why Fortiva plans are different ───────────────────────────────
          The site's signature card reveal, in its navy `dark` tone and with no
          photograph — see the note at the top of this file. Four cards rather than
          the five the other three instances carry, which the component handles by
          itself: the timeline is built from `features.length`. */}
      <FeatureReveal
        tone="dark"
        eyebrow="WHY FORTIVA"
        heading={
          <>
            Why Fortiva plans are <span className="text-gold">different</span>
          </>
        }
        intro="Four things that are true of every plan above, whichever one closes the gap you have."
        features={differences}
        action={
          <Button variant="gold" icon="arrow" href="/contact">
            Talk to our team
          </Button>
        }
      />

      <CtaBand
        tone="gold"
        heading={
          <>
            Built around <span className="text-navy-800">real people</span>, not paperwork.
          </>
        }
        body="Fortiva believes health coverage should be understandable, accessible and built around real people. Tell us what you need and we will point you at the plan that covers it."
        actions={
          <>
            <Button variant="light" icon="arrow" size="lg" href="/contact">
              Get a Quote
            </Button>
            <Button variant="ghost" size="lg" href="/plans/employers">
              Covering a team?
            </Button>
          </>
        }
      />
    </>
  )
}

/**
 * One of the three audience cards.
 *
 * Same shape as MembersHub's six section cards — white, gold badge, lifts on
 * hover — because it is doing the same job on the same kind of page: naming a
 * destination and getting you there. The difference is the surface underneath:
 * MembersHub's grid needs a grey plate because those cards carry no border, and
 * this one sits on white, so it takes the navy hairline instead. See the note on
 * white-on-white in tailwind.config.js.
 */
function AudienceCard({
  title,
  body,
  icon: Icon,
  href,
  linkLabel,
  delay,
}: (typeof audiences)[number] & { delay: number }) {
  const ref = useScrollReveal<HTMLDivElement>({ y: 30, delay })

  return (
    <div ref={ref} className="opacity-0">
      <Link
        href={href}
        className="group corner-smooth flex h-full flex-col rounded-card bg-white p-7 ring-1 ring-inset ring-navy-800/[0.08] transition-all duration-300 hover:-translate-y-1 hover:shadow-card-soft sm:p-8"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold transition-transform duration-300 group-hover:scale-105">
          <Icon size={21} strokeWidth={1.75} className="text-navy-800" />
        </span>
        <h3 className="mt-7 text-[20px] font-semibold leading-snug text-navy-800 sm:text-[22px]">
          {title}
        </h3>
        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-navy-800/65">{body}</p>
        <span className="mt-7 text-[14px] font-semibold text-gold-dark">
          {linkLabel}
          <span
            aria-hidden="true"
            className="ml-1.5 inline-block transition-transform duration-300 group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </span>
      </Link>
    </div>
  )
}
