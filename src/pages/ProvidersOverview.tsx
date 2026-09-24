import { Cpu, Eye, HeartHandshake, HeartPulse } from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import ImageBand from '../components/ImageBand/ImageBand'
import FeatureReveal from '../components/FeatureReveal/FeatureReveal'
import { type Feature } from '../components/featureTypes'
import StepFlow, { type Step } from '../components/StepFlow/StepFlow'
import QuoteBand from '../components/QuoteBand/QuoteBand'
import CtaBand from '../components/CtaBand/CtaBand'
import Button from '../components/Button'
import { images } from '../assets/images'

/**
 * For Providers → Provider Overview, which is `/providers` itself.
 *
 * The section index and the overview are the same page here, exactly as they are
 * for For Brokers: `content/site.ts` lists "Provider Overview" at `/providers`,
 * the nav renders the parent as a dropdown trigger rather than a link, and the
 * footer links `/providers` directly. A separate hub page of three cards — the
 * shape For Members uses — would have been a doorway in front of a section only
 * three pages deep, and the copy doc writes an overview rather than an index.
 *
 * Every word is from FTVA_Web Copy.odt's "Provider Overview — Sub Navigation".
 * Its four headings map to this page one-for-one:
 *
 *   H1: Here for You and Your Patients        → PageHero
 *   (the mission paragraph)                   → ImageBand
 *   Our commitment to providers               → FeatureReveal, the four expectations
 *   What to know when a Fortiva member visits → StepFlow, the four numbered steps
 *   Why Fortiva?                              → QuoteBand
 *   Button: Contact Us                        → CtaBand
 *
 * ── Where the doc's one body paragraph goes ─────────────────────────────────
 * The doc gives the H1 a single paragraph and no separate lede. Running all of
 * it in the hero left the first scroll with nothing to say, so it is split at
 * its own sentence break: the opening claim is the hero's lede, and the mission
 * it rests on carries the band under it. Nothing is repeated and nothing is
 * added.
 *
 * ── Why this page reads differently from Broker Overview ────────────────────
 * The two are the same job for two audiences and the doc gives them nearly the
 * same headings, so the risk was two pages that scroll identically. They share
 * the shape at the top and bottom — hero, a mission band, a dark plate, a gold
 * close — and diverge in the middle, which is where the copy actually differs: a
 * broker is being asked to sell, so their three offers get ScrollSpyList's one-
 * at-a-time focus, while a provider is being told what to expect at the front
 * desk, so the four expectations arrive together (FeatureReveal) and the visit
 * itself is walked through in order (StepFlow). A practice manager reading both
 * pages should recognise the site, not the template.
 */

// The doc's four, verbatim: bolded phrase, then its line. Icons are ours; the
// doc names none.
const commitments: Feature[] = [
  {
    title: 'Clear coverage details',
    body: 'Transparent pricing and predictable plans — no surprises.',
    icon: Eye,
  },
  {
    title: 'Member-first approach',
    body: 'Every decision starts and ends with the member in mind.',
    icon: HeartHandshake,
  },
  {
    title: 'Technology-driven support',
    body: 'Tools that simplify eligibility checks, claims and communication.',
    icon: Cpu,
  },
  {
    title: 'Value-based care',
    body: 'We prioritize outcomes over premiums, so you can focus on delivering quality care.',
    icon: HeartPulse,
  },
]

// The doc's four numbered items, verbatim. It numbers them itself — "1. Verify
// coverage easily", each with a single indented line under it — which is what
// makes this a StepFlow rather than a fourth card grid: the order is the content.
const visitSteps: Step[] = [
  {
    title: 'Verify coverage easily',
    body: 'Our provider portal makes eligibility checks fast and simple.',
  },
  {
    title: 'Expect affordable plans',
    body: 'Members may have multi-tiered coverage, including supplemental benefits.',
  },
  {
    title: 'Transparent processes',
    body: 'Claims administration is streamlined for speed and accuracy.',
  },
  {
    title: 'Support when you need it',
    body: 'Our team is here to assist with questions about benefits or billing.',
  },
]

export default function ProvidersOverview() {
  return (
    <>
      <PageHero
        eyebrow="Provider Overview"
        titleTop="Here for you"
        titleBottom="and your patients."
        lede={
          <>
            Fortiva is built to make health coverage simpler, fairer and more accessible.
          </>
        }
        actions={
          <>
            <Button variant="gold" icon="arrow" size="lg" href="/providers/portal">
              Provider Portal
            </Button>
            <Button variant="ghost" size="lg" href="/providers/partner-with-us">
              Partner with us
            </Button>
          </>
        }
      />

      {/* ── the mission paragraph ─────────────────────────────────────────
          The same argument the About page and Broker Overview make, to a third
          reader — so it gets the same treatment Broker Overview gives it: a white
          plate and a photograph rather than a pull-quote. What a provider needs
          from this band is not to be sold the idea but to place the company: who
          is behind the card their patient just handed over. */}
      <ImageBand
        heading={<>Our mission is clear:</>}
        subheading={<>Put people at the center of care, not premiums.</>}
        body={
          <p>
            Three things change the moment a provider is inside the network &mdash; what you
            pay, who you see, and how much of the admin lands on you.
          </p>
        }
        image={images.providerPatients}
        imageAlt="A Fortiva member being seen at their practice"
      />

      {/* ── Our commitment to providers ───────────────────────────────────
          Four expectations, arriving together rather than one at a time: they are
          not a sequence and none of them is more important than the others, which
          is the difference between this and the visit flow below.

          White, which is FeatureReveal's default, even though the ImageBand
          above it is white too. Tinting this one was the first instinct and it
          was the wrong one: the section's backdrop photograph has to dissolve
          into whatever surface it lands on, and a cream plate here would have
          made this the ONE asset on the site that fades to cream while its three
          siblings fade to white — a contract nobody commissioning the photo would
          expect and nobody reviewing it would catch. The full-bleed picture is
          what separates this section from the band above it. The StepFlow below
          used to be this page's one cream plate; it's white now too (the client
          asked for it — see the note on it), so nothing on this page is tinted
          any more. */}
      <FeatureReveal
        heading={
          <>
            Our commitment to <span className="text-gold-dark">providers</span>
          </>
        }
        intro={
          <>
            We know your time matters. That&rsquo;s why Fortiva is focused on creating
            frictionless experiences for practices and patients alike. When you work with a
            Fortiva member, you can expect:
          </>
        }
        features={commitments}
        image={images.featureProviderCommitment}
        action={
          <Button variant="gold" icon="arrow" href="/providers/portal">
            Open the Provider Portal
          </Button>
        }
      />

      {/* ── What to know when a Fortiva member visits ─────────────────────
          The doc numbers these itself, so the rail draws the order it already
          has. White now, matching the page's other sections. `pin` holds the
          section at the top of the viewport while its dots light in sequence,
          the way the pinned set-pieces elsewhere on the site do — these steps
          have no illustrations to wait for, so StepFlow doesn't pin them on
          its own; `pin` asks for the same held-in-place dwell anyway (see the
          note in StepFlow.tsx). */}
      <StepFlow
        heading={
          <>
            What to know when a <span className="text-gold-dark">Fortiva member visits</span>
          </>
        }
        intro="If a Fortiva member comes to your practice:"
        steps={visitSteps}
        pin
        action={
          <Button variant="gold" icon="arrow" href="/providers/portal#submit-a-claim">
            Verify coverage or submit a claim
          </Button>
        }
      />

      {/* ── Why Fortiva? ──────────────────────────────────────────────────
          Rebuilt to the client's reference (why-fortiva.png): the gold tone,
          with the flourish ornament framing the words above and below, "Why
          Fortiva?" as the display line and the doc's argument as the body under
          it, and a "Contact us" button closing the frame — see QuoteBand.tsx for
          how the gold tone and the flourish mask work.

          GOLD here, not the dark plate this band used to be — it must not sit
          directly against another gold band with no seam between them, or the
          two merge into one slab. The closing CtaBand below moves to `cream`
          for exactly that reason — see the note on it. */}
      <QuoteBand
        tone="gold"
        quote={
          <>
            Why <span className="text-white underline decoration-2 underline-offset-4">Fortiva</span
            ><span className="text-white">?</span>
          </>
        }
        body={
          <>
            Traditional carriers often prioritize profits over people. Fortiva is
            different. The focus is on delivering health insurance that works for providers,
            members and patients, improving access to care and creating better outcomes for
            everyone.
          </>
        }
        action={
          <Button variant="light" icon="arrow" size="lg" href="/contact">
            Contact us
          </Button>
        }
      />

      {/* ── Cream, not gold ────────────────────────────────────────────────
          The QuoteBand above closes on the brand gold now (see the note on it).
          Two gold bands back to back with no seam between them would read as one
          slab, so this one takes the mid-page `cream` tone instead — the same
          fix Broker Overview makes for the same reason. The accent moves with
          the surface: `cream` paints the heading navy, so the second clause
          takes the dark gold that reads on a light plate. */}
      <CtaBand
        tone="cream"
        heading={
          <>
            Questions about a patient&rsquo;s plan?{' '}
            <span className="text-gold-dark">Contact us.</span>
          </>
        }
        body="Our provider team handles eligibility, benefits and billing questions — and can get your practice set up in the portal."
        actions={
          <>
            <Button variant="light" icon="arrow" size="lg" href="/contact">
              Contact us
            </Button>
            <Button variant="dark" size="lg" href="/providers/partner-with-us">
              Partner with us
            </Button>
          </>
        }
      />
    </>
  )
}
