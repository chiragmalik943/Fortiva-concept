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
        eyebrow="FOR PROVIDERS"
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
        eyebrow="WHO YOUR PATIENTS ARE COVERED BY"
        heading={
          <>
            Value-based plans designed{' '}
            <span className="text-gold-dark">for real lives</span>
          </>
        }
        body={
          <p>
            Our mission is clear: put people &mdash; not premiums &mdash; at the center of
            care. We deliver affordable, value-based plans designed for real lives, powered
            by technology and guided by humanity.
          </p>
        }
        image={images.providerPatients}
        imageAlt="A Fortiva member being seen at their practice"
        action={
          <Button variant="gold" icon="arrow" href="/plans">
            See the plans your patients carry
          </Button>
        }
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
          expect and nobody reviewing it would catch. The tint moved to the
          StepFlow below instead, which needs no photograph at all, and the
          full-bleed picture is what separates this section from the band above
          it. */}
      <FeatureReveal
        eyebrow="OUR COMMITMENT TO PROVIDERS"
        heading={
          <>
            We know <br /><span className="text-gold-dark">your time matters</span>
          </>
        }
        intro={
          <>
            That&rsquo;s why Fortiva is focused on creating frictionless experiences for
            practices and patients alike. When you work with a Fortiva member, you can
            expect:
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
          has. `surface="cream"` makes this the page's tinted plate — see the note
          on the section above for why it is this one and not that one. */}
      <StepFlow
        eyebrow="AT THE FRONT DESK"
        heading={
          <>
            What to know when a <span className="text-gold-dark">Fortiva member visits</span>
          </>
        }
        intro="If a Fortiva member comes to your practice:"
        steps={visitSteps}
        surface="cream"
        action={
          <Button variant="gold" icon="arrow" href="/providers/portal#submit-a-claim">
            Verify coverage or submit a claim
          </Button>
        }
      />

      {/* ── Why Fortiva? ──────────────────────────────────────────────────
          The doc's closing paragraph, and it is two sentences of argument
          followed by one of substance — so the argument is the display line and
          the substance is the body under it. The quotation marks are left off
          deliberately: this is the page speaking, not a quote (see the note in
          QuoteBand.tsx).

          The page's one dark plate, and it is safe here because a gold CtaBand
          follows it — a navy band must never be the last thing before the navy
          footer. */}
      <QuoteBand
        eyebrow="WHY FORTIVA"
        quote={
          <>
            Traditional carriers often prioritize profits over people. Fortiva is different.
          </>
        }
        body="The focus is on delivering health insurance that works for providers, members and patients — improving access to care and creating better outcomes for everyone."
      />

      <CtaBand
        tone="gold"
        heading={
          <>
            Questions about a patient&rsquo;s plan?{' '}
            <span className="text-navy-800">Contact us.</span>
          </>
        }
        body="Our provider team handles eligibility, benefits and billing questions — and can get your practice set up in the portal."
        actions={
          <>
            <Button variant="light" icon="arrow" size="lg" href="/contact">
              Contact us
            </Button>
            <Button variant="ghost" size="lg" href="/providers/partner-with-us">
              Partner with us
            </Button>
          </>
        }
      />
    </>
  )
}
