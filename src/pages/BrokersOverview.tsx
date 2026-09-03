import { Cpu, HeartHandshake, Layers } from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import ImageBand from '../components/ImageBand/ImageBand'
import ScrollSpyList, { type SpyItem } from '../components/ScrollSpyList/ScrollSpyList'
import QuoteBand from '../components/QuoteBand/QuoteBand'
import CtaBand from '../components/CtaBand/CtaBand'
import Button from '../components/Button'
import { images } from '../assets/images'

/**
 * For Brokers → Broker Overview.
 *
 * Every word below is from FTVA_Web Copy.odt's "Broker Overview — Sub
 * Navigation". Its five headings map to this page one-for-one:
 *
 *   H1: Your Partner in Health Insurance      → PageHero
 *   FOR you. FOR your clients. FOR change.    → the opening ImageBand
 *   Why work with us?                         → ScrollSpyList, the three offers
 *   FOR the future of health insurance        → the second ImageBand
 *   Fortiva’s promise                         → QuoteBand
 *   Button: Partner with us                   → CtaBand
 *
 * ── Two things the doc leaves to the layout ─────────────────────────────────
 * The doc gives the H2s but no lead-in for the hero, so the hero's lede is the
 * doc's own "FOR you. FOR your clients. FOR change." line — the page's second
 * heading doing the job it was already written for — rather than anything new.
 *
 * And "Why work with us?" arrives as a sentence about market conditions followed
 * by three bolded phrases. Those three are the section's substance, so they get
 * ScrollSpyList rather than a grid of cards: the same treatment Find a Doctor
 * gives its three reasons, which is the only other three-item list on the site.
 */

// The doc's three, verbatim: bolded phrase, then its line. Icons are ours; the
// doc names none.
const offers: SpyItem[] = [
  {
    title: 'Affordable, multi-tier plans',
    body: 'Flexible options for real-life budgets.',
    icon: Layers,
  },
  {
    title: 'Member-first experience',
    body: 'Transparent pricing, personalized solutions and no surprises.',
    icon: HeartHandshake,
  },
  {
    title: 'Technology-driven tools',
    body: 'Agentic AI for seamless quoting, enrollment and proactive care.',
    icon: Cpu,
  },
]

export default function BrokersOverview() {
  return (
    <>
      <PageHero
        tone="dark"
        eyebrow="FOR BROKERS"
        titleTop="Your partner in"
        titleBottom="health insurance."
        lede={
          <>
            <span className="text-gold-dark">FOR</span> you.{' '}
            <span className="text-gold-dark">FOR</span> your clients.{' '}
            <span className="text-gold-dark">FOR</span> change.
          </>
        }
        actions={
          <>
            <Button variant="gold" icon="arrow" size="lg" href="/contact">
              Partner with us
            </Button>
            <Button variant="white" size="lg" href="/brokers/portal">
              Broker Portal
            </Button>
          </>
        }
      />

      {/* ── FOR you. FOR your clients. FOR change. ────────────────────────
          The mission paragraph, which is the same argument the About page makes
          to a different reader — so it gets the same white plate About opens on,
          and a photograph rather than the pull-quote treatment About uses. A
          broker arriving here has already been sold the idea; what they need next
          is the sense of a company they would be comfortable representing. */}
      <ImageBand
        eyebrow="WHO YOU’D BE REPRESENTING"
        heading={
          <>
            <span className="text-gold-dark">FOR</span> you.{' '}
            <span className="text-gold-dark">FOR</span> your clients.{' '}
            <span className="text-gold-dark">FOR</span> change.
          </>
        }
        body={
          <p>
            At Fortiva, we&rsquo;re rewriting the rules of health insurance. Our mission is
            simple yet bold: to put people &mdash; not premiums &mdash; at the center of care.
            We exist to disrupt an industry built on complexity and cost, delivering
            transparent, affordable coverage rooted in value-based care.
          </p>
        }
        image={images.brokerPartner}
        imageAlt="A Fortiva broker meeting a client"
        action={
          <Button variant="gold" icon="arrow" href="/plans">
            See the plans you&rsquo;d be selling
          </Button>
        }
      />

      {/* ── Why work with us? ─────────────────────────────────────────────
          The doc's market sentence is the intro and its three bolded phrases are
          the items. `bg-cream-soft` is ScrollSpyList's own default, which puts a
          tinted plate between two white ones. */}
      <ScrollSpyList
        eyebrow="WHY WORK WITH US"
        heading={
          <>
            Built for the market <span className="text-gold-dark">you sell into</span>
          </>
        }
        intro="Fortiva is designed for today’s market realities: rising Affordable Care Act premiums, and underserviced individuals and small businesses seeking flexibility. By partnering with us, you’ll offer:"
        items={offers}
        action={
          <Button variant="gold" icon="arrow" href="/brokers/faqs">
            How partnering works
          </Button>
        }
      />

      {/* ── FOR the future of health insurance ────────────────────────────
          Photograph on the LEFT this time. The two ImageBands on this page mirror
          each other rather than repeating: alternating the picture is what stops
          a page with two of the same section reading as a template. */}
      <ImageBand
        eyebrow="FOR THE FUTURE"
        heading={
          <>
            <span className="text-gold-dark">FOR</span> the future of health insurance
          </>
        }
        body={
          <p>
            We&rsquo;re not just another carrier &mdash; we&rsquo;re a trusted disruptor. Our
            approach combines innovation and humanity to create health coverage that&rsquo;s
            simple, fair and empowering. With Fortiva, you&rsquo;ll be part of a movement that
            prioritizes clarity, care and confidence.
          </p>
        }
        imageSide="left"
        image={images.brokerFuture}
        imageAlt="Fortiva colleagues at work"
      />

      {/* ── Fortiva’s promise ─────────────────────────────────────────────
          The page's one dark plate, and it is safe here because a gold CtaBand
          follows it — see the note in QuoteBand.tsx about never closing a page on
          navy. */}
      <QuoteBand
        eyebrow="FORTIVA’S PROMISE"
        quote={<>&ldquo;FOR the member. Always.&rdquo;</>}
        body="Every decision starts and ends with the member in mind. We challenge legacy norms, lead with integrity and innovate relentlessly — so you can deliver better outcomes for every client."
      />

      <CtaBand
        tone="gold"
        heading={
          <>
            Ready to write Fortiva? <span className="text-navy-800">Partner with us.</span>
          </>
        }
        body="Tell us about your book of business and our broker team will take it from there — appointment, onboarding and your first quote."
        actions={
          <>
            <Button variant="light" icon="arrow" size="lg" href="/contact">
              Partner with us
            </Button>
            <Button variant="ghost" size="lg" href="/brokers/resources">
              Broker resources
            </Button>
          </>
        }
      />
    </>
  )
}
