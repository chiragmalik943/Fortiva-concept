import { Cpu, HeartHandshake, Layers } from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import ImageBand from '../components/ImageBand/ImageBand'
import ForSequence, { type ForStage } from '../components/ForSequence/ForSequence'
import ScrollSpyList, { type SpyItem } from '../components/ScrollSpyList/ScrollSpyList'
import QuoteBand from '../components/QuoteBand/QuoteBand'
import Button from '../components/Button'
import { images } from '../assets/images'

/**
 * For Brokers → Broker Overview.
 *
 * Every word below is from FTVA_Web Copy.odt's "Broker Overview — Sub
 * Navigation". Its five headings map to this page one-for-one:
 *
 *   H1: Your Partner in Health Insurance      → PageHero
 *   FOR you. FOR your clients. FOR change.    → ForSequence, one stage each
 *   Why work with us?                         → ScrollSpyList, the three offers
 *   FOR the future of health insurance        → the second ImageBand
 *   Fortiva’s promise                         → QuoteBand
 *   Button: Partner with us                   → the action on QuoteBand
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

/* ── The three FOR stages ───────────────────────────────────────────────────
   The doc gives this section ONE heading — "FOR you. FOR your clients. FOR
   change." — and one paragraph under it, the mission paragraph. Split into three
   stages, that paragraph belongs to the third: it is about what Fortiva is
   changing, and it is reproduced here word for word.

   DRAFTED, NOT CLIENT COPY: the paragraphs on stages one and two. Both are
   assembled from phrases the doc already uses elsewhere on this page — "Your
   partner in health insurance" and the three bolded offers under "Why work with
   us?" ("Affordable, multi-tier plans", "Flexible options for real-life
   budgets", "Member-first experience", "Transparent pricing, personalized
   solutions and no surprises", "Technology-driven tools"), plus its
   "underserviced individuals and small businesses" — so nothing here asserts
   anything the client has not already said in writing. They are short on purpose:
   they can be replaced wholesale with the client's own two paragraphs without
   anything else in the section needing to change.

   Stage order is the order the line names them, which is also the order of
   `brokerForStages` in assets/images.ts. */
const forStages: ForStage[] = [
  {
    word: 'you.',
    body: (
      <>
        Your partner in health insurance, not one more carrier on the sheet. Affordable,
        multi-tier plans, transparent pricing and technology-driven tools &mdash; so quoting,
        enrolment and everything that follows is easier to place.
      </>
    ),
    image: images.brokerForStages[0],
    imageAlt: 'A Fortiva broker at work',
  },
  {
    word: 'your clients.',
    body: (
      <>
        A member-first experience: transparent pricing, personalized solutions and no
        surprises. Flexible options for real-life budgets, built for the individuals and small
        businesses this market has underserved.
      </>
    ),
    image: images.brokerForStages[1],
    imageAlt: 'A Fortiva member at work in their business',
  },
  {
    word: 'change.',
    body: (
      <>
        At Fortiva, we&rsquo;re rewriting the rules of health insurance. Our mission is simple
        yet bold: to put people &mdash; not premiums &mdash; at the center of care. We exist to
        disrupt an industry built on complexity and cost, delivering transparent, affordable
        coverage rooted in value-based care.
      </>
    ),
    image: images.brokerForStages[2],
    imageAlt: 'A family covered by a Fortiva plan',
  },
]

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
    body: 'Seamless quoting, enrolment and proactive care.',
    icon: Cpu,
  },
]

export default function BrokersOverview() {
  return (
    <>
      <PageHero
        eyebrow="Broker Overview"
        tone="dark"
        markClassName="bg-gold"
        titleTop="Your partner in"
        titleBottom="health insurance."
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

      {/* ── FOR you. FOR your clients. FOR change. ───────────────────────
          The page's opening line, given a stage per audience. It was one
          ImageBand — a single photograph and the mission paragraph beside it —
          which meant a heading naming three readers was illustrated by one
          picture and answered by one paragraph about the third of them. See
          ForSequence.tsx for how the three are walked, and `forStages` above for
          which paragraph is the client's and which two are drafted. */}
      <ForSequence
        stages={forStages}
        action={
          <Button variant="gold" icon="arrow" href="/plans">
            See the plans you&rsquo;d be selling
          </Button>
        }
      />

      {/* ── Why work with us? ─────────────────────────────────────────────
          The doc's market sentence is the intro and its three bolded phrases are
          the items. No surface is passed, so it takes ScrollSpyList's own
          default — WHITE now, where it used to be a tinted plate between the two
          white image bands. The page's rhythm comes from those bands alternating
          their photograph left and right; if this ever needs to be a plate again,
          pass `className="bg-[#CCD0D2]"` the way Find a Doctor does. */}
      <ScrollSpyList
        heading={
          <>
            <span className="text-gold-dark">Why</span> work with us?
          </>
        }
        intro="Fortiva is designed for today’s market realities: rising Affordable Care Act premiums, and underserviced individuals and small businesses seeking flexibility. By partnering with us, you’ll offer:"
        items={offers}
        /* No counter and no button. The section is the doc's three offers and
           nothing else now: a readout counting three statements implied a
           sequence to walk, and the button was a third call to a different page
           on a screen that already has the hero's two. */
        counter={false}
      />

      {/* ── FOR the future of health insurance ────────────────────────────
          Photograph on the LEFT, which used to be about mirroring the ImageBand
          above it. That band is the pinned FOR sequence now and this is the
          page's only one — so the side is simply the side that does not repeat
          the sequence's own composition, where the card sits left over a
          full-bleed picture. */}
      <ImageBand
        heading={
          <>
            <span className="text-gold-dark">FOR</span> the future of health insurance
          </>
        }
        /* The doc runs this as one paragraph opening on its sharpest sentence,
           which then had three more sentences leaning on it. Lifted out as the
           section's subheading it is the claim, and what follows is the support
           for it — the same sentence doing more work in the same words. */
        subheading={<>We&rsquo;re not just another carrier &mdash; we&rsquo;re a trusted disruptor.</>}
        body={
          <p>
            Our approach combines innovation and humanity to create health coverage
            that&rsquo;s simple, fair and empowering. With Fortiva, you&rsquo;ll be part of a
            movement that prioritizes clarity, care and confidence.
          </p>
        }
        imageSide="left"
        image={images.brokerFuture}
        imageAlt="Fortiva colleagues at work"
      />

      {/* ── Fortiva’s promise ─────────────────────────────────────────────
          GOLD now, not the dark plate it shipped as, with the flourish above and
          below the words and the page's own call inside the frame.

          The quotation marks are gone. A line set inside an ornamental frame is
          already presented as a quotation; the marks on top of that were the
          same idea said twice.

          This is now the page's closing band — the cream CtaBand that used to
          run below it ("Ready to write Fortiva? Partner with us.") has been
          removed, since it duplicated this band's own "Partner with us" call to
          /contact about 200px apart. */}
      <QuoteBand
        tone="gold"
        label="Fortiva’s promise"
        quote={
          <>
            FOR the member. <span className="text-white">Always.</span>
          </>
        }
        body="Every decision starts and ends with the member in mind. We challenge legacy norms, lead with integrity and innovate relentlessly — so you can deliver better outcomes for every client."
        action={
          <Button variant="white" icon="arrow" size="lg" href="/contact">
            Partner with us
          </Button>
        }
      />
    </>
  )
}
