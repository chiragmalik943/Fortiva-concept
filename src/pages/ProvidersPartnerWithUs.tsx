import { Lightbulb, TrendingUp, Users, Workflow } from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import ImageBand from '../components/ImageBand/ImageBand'
import ScrollSpyList, { type SpyItem } from '../components/ScrollSpyList/ScrollSpyList'
import QuoteBand from '../components/QuoteBand/QuoteBand'
import CtaBand from '../components/CtaBand/CtaBand'
import Button from '../components/Button'
import { images } from '../assets/images'

/**
 * For Providers → Partner with Us.
 *
 * Copy is FTVA_Web Copy.odt's "# Partner with Us" section, which the doc writes
 * as a top-level page. It nests under For Providers here because its copy is
 * entirely provider-facing — "As a provider, partnering with us means…",
 * "H2: FOR providers" — and that decision is recorded where the IA lives; see the
 * note above `navigation` in content/site.ts. The footer still links it directly,
 * so it keeps a top-level entrance as well as its place in the dropdown.
 *
 *   H2: Why Partner with Fortiva? (para 1) → PageHero + ImageBand
 *   (para 2, the platform paragraph)       → the same ImageBand's body
 *   FOR providers (four items)             → ScrollSpyList
 *   "Together, we can rewrite the rules…"  → QuoteBand
 *   Button: Partner with Us                → CtaBand
 *
 * ── The doc gives this page no H1 ───────────────────────────────────────────
 * It opens straight on "H2: Why Partner with Fortiva?", so that question is the
 * headline rather than something new being written to sit above it. Its first
 * sentence becomes the hero's lede and the rest of the paragraph carries the band
 * below, the same split Provider Overview makes with its own single paragraph.
 *
 * ── Why ScrollSpyList here and FeatureReveal on Provider Overview ───────────
 * Both pages carry a four-item list of what a provider gets, and the two lists
 * are genuinely different in kind. Provider Overview's four are expectations at
 * the front desk — simultaneous, none of them ranked — so they arrive together.
 * These four are the case for signing, and a case is read one point at a time,
 * which is what the spy list's single lit panel does: it is the same treatment
 * Broker Overview gives the equivalent argument, so the two "why partner with us"
 * pages match each other across audiences rather than each matching its own
 * section's overview.
 */

// The doc's four H3s, verbatim: heading, then its line. Icons are ours; the doc
// names none.
const gains: SpyItem[] = [
  {
    title: 'Frictionless administration',
    body: 'Streamlined claims and coverage verification.',
    icon: Workflow,
  },
  {
    title: 'Member-first care',
    body: 'Plans built around real needs, not profit margins.',
    icon: Users,
  },
  {
    title: 'Innovation at your fingertips',
    body: 'Technology that simplifies workflows and improves patient experiences.',
    icon: Lightbulb,
  },
  {
    title: 'Growth opportunities',
    body: 'Access to a rapidly expanding network focused on affordability and transparency.',
    icon: TrendingUp,
  },
]

export default function ProvidersPartnerWithUs() {
  return (
    <>
      <PageHero
        eyebrow="PARTNER WITH US"
        titleTop="Why partner"
        titleBottom="with Fortiva?"
        lede={
          <>
            Fortiva is redefining health insurance with a member-first approach that
            prioritizes outcomes over premiums.
          </>
        }
        actions={
          <>
            <Button variant="gold" icon="arrow" size="lg" href="/contact">
              Partner with us
            </Button>
            <Button variant="ghost" size="lg" href="/providers">
              Provider overview
            </Button>
          </>
        }
      />

      {/* ── Why Partner with Fortiva? ─────────────────────────────────────
          The rest of the doc's opening paragraph plus the whole of its second
          one, which together are the page's actual argument: what the network is
          for, and what the platform does about it. Two paragraphs is more than
          the other ImageBands on this site carry, and it is why this one has no
          `points` list under them — the second paragraph is already the specifics.

          Photograph on the RIGHT, which is the first of the two provider-section
          ImageBands to sit that way (the Provider Portal's is on the left), so
          the section reads as its own rather than as the same band again. */}
      <ImageBand
        eyebrow="WHY PARTNER WITH FORTIVA"
        heading={
          <>
            A movement to make care{' '}
            <span className="text-gold-dark">accessible and transparent</span>
          </>
        }
        body={
          <>
            <p>
              As a provider, partnering with us means joining a movement to make care
              accessible, transparent and technology-driven.
            </p>
            <p className="mt-5">
              We offer affordable, multi-tiered plans designed for underserved markets,
              backed by value-based care principles that align with your commitment to
              better health outcomes. Our platform delivers clear pricing,
              compliance-backed processes and real-time tools for eligibility and claims
              &mdash; so you spend less time on paperwork and more time on patients.
            </p>
          </>
        }
        image={images.providerPartnerPhoto}
        imageAlt="Fortiva network clinicians conferring between appointments"
        action={
          <Button variant="gold" icon="arrow" href="/providers/portal">
            See the tools you&rsquo;d be using
          </Button>
        }
      />

      {/* ── FOR providers ─────────────────────────────────────────────────
          The doc's four, one lit at a time. No surface is passed, so it takes
          ScrollSpyList's own default — WHITE now, where it used to be a tinted
          plate between the white band above and the navy one below. The navy band
          is still the break; if this needs to be a plate again, pass
          `className="bg-[#CCD0D2]"` the way Find a Doctor does. */}
      <ScrollSpyList
        eyebrow="FOR PROVIDERS"
        heading={
          <>
            By working with Fortiva, <span className="text-gold-dark">you gain</span>
          </>
        }
        intro="Four things a Fortiva partnership puts behind your practice — on the administrative side and on the clinical one."
        items={gains}
        action={
          <Button variant="gold" icon="arrow" href="/contact">
            Start the conversation
          </Button>
        }
      />

      {/* ── the closing line ──────────────────────────────────────────────
          The doc's last sentence, split at its own dash: the ask is the display
          line and the future it points at is the body. It earns a whole band for
          the same reason the Broker Overview promise does — it is the shortest
          thing on the page and the most important, and a short line inside a
          normal section reads as a section that ran out of copy.

          No quotation marks: this is the page speaking rather than a quote. Navy
          is safe here because a gold CtaBand follows — see the rule in
          CtaBand.tsx about never handing the navy footer a navy band. */}
      <QuoteBand
        eyebrow="TOGETHER"
        quote={<>Together, we can rewrite the rules of health insurance.</>}
        body="Creating a future where care is simple, fair and empowering for everyone."
      />

      <CtaBand
        tone="gold"
        heading={
          <>
            Ready to join the network? <span className="text-navy-800">Partner with us.</span>
          </>
        }
        body="Tell us about your practice and our provider team will take it from there — contracting, credentialing and portal access."
        actions={
          <>
            <Button variant="light" icon="arrow" size="lg" href="/contact">
              Partner with us
            </Button>
            <Button variant="ghost" size="lg" href="/providers/portal">
              Provider Portal
            </Button>
          </>
        }
      />
    </>
  )
}
