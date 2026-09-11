import { Heart, Zap, ShieldCheck, KeyRound, Lightbulb } from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import FeatureReveal from '../components/FeatureReveal/FeatureReveal'
import CtaBand from '../components/CtaBand/CtaBand'
import Button from '../components/Button'
import ActionButton from '../components/ActionButton'
import { type Feature } from '../components/featureTypes'
import { externalTargets } from '../content/site'
import { images } from '../assets/images'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useSplitReveal } from '../hooks/useSplitReveal'

/**
 * Careers — a footer destination.
 *
 * Copy is FTVA_Web Copy.odt's "Careers — Footer". Its four headings map to this
 * page one-for-one:
 *
 *   H1 + the opening paragraph → PageHero
 *   Our core values            → <FeatureReveal />, the five values as cards
 *   Join the movement          → the two-column narrative band
 *   Your health. Your power. Our revolution. → <CtaBand tone="gold" />
 *
 * ── The five values appear twice on this site, and not in the same shape ────
 * About → "Powered by values" runs `ValuesStack`: the same five values as a pinned
 * stack of cards that arrive one at a time beside a photograph. This page could
 * have mounted that component and been finished in a line, and deliberately does
 * not, for two reasons.
 *
 * The first is the asset. `ValuesStack` draws `about-value.png`, and no image on
 * this site is reused anywhere (see assets/images.ts) — mounting it here would
 * put that photograph on two pages, which is the one rule the image set has.
 *
 * The second is that the doc's Careers wording is NOT the About wording. Three of
 * the five are rewritten into the passive, company-facing voice a careers page
 * uses — "The status quo is challenged", "Members are given clarity" — where
 * About addresses the member directly. Both are reproduced as written, each on
 * its own page.
 *
 * So the values run through `FeatureReveal` here instead: the same five, in the
 * site's other established treatment for a list of five, with no photograph. It
 * also means the two pages perform the same content differently, which is what
 * you want from a value set that appears in two places rather than two builds of
 * one set-piece.
 *
 * ── The tone ────────────────────────────────────────────────────────────────
 * `teal`, the logo's own #0074A6. About is gold and this page is next to it in
 * the footer nav; a careers page that opened on the same field would read as a
 * second About.
 */

/* The doc's "Our core values" — five titles, five sentences, verbatim. `icon` is
   the only field the doc does not supply, and these are the same five glyphs
   ValuesStack picked for the same five values on About: a visitor who has seen
   both should recognise them as one set. */
const values: Feature[] = [
  {
    title: 'Member-first',
    body: 'Every decision starts and ends with the member in mind.',
    icon: Heart,
  },
  {
    title: 'Disrupt to improve',
    body: 'The status quo is challenged to create better, fairer outcomes for the people Fortiva serves.',
    icon: Zap,
  },
  {
    title: 'Lead with integrity',
    body: 'Transparency, honesty and accountability are expected in every interaction.',
    icon: ShieldCheck,
  },
  {
    title: 'Empowerment',
    body: 'Members are given clarity, confidence and choice to take control of their health coverage.',
    icon: KeyRound,
  },
  {
    title: 'Innovation',
    body: 'Technology and bold thinking are harnessed to transform how health insurance works.',
    icon: Lightbulb,
  },
]

export default function Careers() {
  const joinHeadingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const joinLeadRef = useScrollReveal<HTMLParagraphElement>({ y: 24, delay: 0.1 })
  const joinCtaRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.28 })
  const joinAnswerRef = useScrollReveal<HTMLDivElement>({ y: 24, delay: 0.2 })

  return (
    <>
      <PageHero
        tone="teal"
        eyebrow="CAREERS"
        titleTop="Join the movement."
        titleBottom="Work for Fortiva."
        lede={
          <>
            At Fortiva, we&rsquo;re rewriting the rules of health insurance. Our mission is
            simple: put people, not premiums, at the center of care. We believe health coverage
            should be affordable, transparent and empowering &mdash; and we&rsquo;re building a
            future where that&rsquo;s the norm.
          </>
        }
        actions={
          <>
            {/* No careers system exists in this repo and the copy doc supplies no
                URL for one, so this points at `externalTargets.careersBoard`,
                which ships as '#'. ActionButton swallows the click and marks the
                control unavailable while that is still true, and starts opening
                the real listing by itself the day a URL lands in content/site.ts.
                Same convention as the five destinations on the For Members pages
                — see the note on `externalTargets` there. */}
            <ActionButton
              variant="gold"
              icon="arrowUpRight"
              size="lg"
              href={externalTargets.careersBoard}
            >
              See open roles
            </ActionButton>
            <Button variant="white" size="lg" href="/about">
              About Fortiva
            </Button>
          </>
        }
      />

      {/* ── Our core values ───────────────────────────────────────────────
          The site's card reveal, `light` tone, no photograph — the five cards fly
          up from below one at a time as the section is scrolled past. Five is the
          count this component was measured at on the three Plans and For Members
          pages that already use it, so the pin budget and the two-column stagger
          are exactly the ones documented in README.md. */}
      <FeatureReveal
        eyebrow="OUR CORE VALUES"
        heading={
          <>
            Five values, and every decision{' '}
            <span className="text-gold-dark">starts with one</span>
          </>
        }
        intro="Fortiva is built on a clear set of values that guide every decision, interaction and innovation."
        features={values}
        action={
          <Button variant="dark" icon="arrow" href="/about">
            How we got here
          </Button>
        }
      />

      {/* ── Join the movement ─────────────────────────────────────────────
          Two columns, and the turn between them is the point — the same shape
          About's closing section uses, for the same reason. The left column makes
          the case; the right column is the sentence the page is actually for, set
          larger, centred and framed by the gold flourish.

          The surface is the grey plate. FeatureReveal above it is white and the
          gold CtaBand is below, so this is the one thing separating two light
          sections from a saturated one. */}
      <section className="bg-[#CCD0D2] px-6 py-24 sm:py-32">
        <div className="mx-auto grid max-w-container items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <span className="inline-block rounded-full bg-navy-800/[0.08] px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-navy-800/70">
              WHY FORTIVA
            </span>
            <h2
              ref={joinHeadingRef}
              className="mt-5 max-w-xl text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px]"
            >
              Join the <span className="text-gold-dark">movement</span>
            </h2>

            <p
              ref={joinLeadRef}
              className="mt-8 max-w-xl text-[19px] leading-[1.5] text-navy-800/85 opacity-0 sm:text-[21px]"
            >
              When you join Fortiva, it&rsquo;s more than a job. It&rsquo;s a chance to be part
              of a team that is redefining what health insurance can be.
            </p>

            {/* One button, and deliberately NOT a third "See open roles". The
                hero opens with that call and the gold band closes on it, and all
                three point at the same `careersBoard` placeholder — a page that
                asks three times for a destination that does not exist yet reads
                as a page with nothing else to say. This one goes somewhere that
                works today. */}
            <div ref={joinCtaRef} className="mt-10 flex flex-wrap items-center gap-3 opacity-0">
              <Button variant="dark" icon="arrow" href="/contact">
                Get in touch
              </Button>
            </div>
          </div>

          {/* The doc's two remaining paragraphs. Same flourish framing About's
              closing answer uses — one copy above, one flipped below — at the same
              300px measure, which draws the ribbon at ~18px and makes it a mark
              above the paragraph rather than a rule around it. */}
          <div ref={joinAnswerRef} className="opacity-0">
            <img
              src={images.flourish}
              alt=""
              aria-hidden="true"
              className="mx-auto block h-auto w-full max-w-[300px] select-none"
            />
            <p className="mx-auto my-7 max-w-xl text-center text-[17px] leading-[1.55] text-navy-800/80 sm:my-8 sm:text-[19px]">
              Fortiva challenges legacy norms to make coverage more fair and accessible.
              Decisions are guided by integrity and shaped by a member-first mindset.
              Innovation is used intentionally &mdash; combining technology and human insight
              to create smarter, more personal experiences. Every solution is designed to
              empower people with clarity, choice and confidence in their care.
            </p>
            <p className="mx-auto max-w-xl text-center text-[19px] font-semibold leading-[1.45] text-navy-800 sm:text-[21px]">
              For those driven to improve a complex system and create meaningful impact,
              Fortiva offers the opportunity to lead change with purpose.
            </p>
            <img
              src={images.flourish}
              alt=""
              aria-hidden="true"
              className="mx-auto mt-7 block h-auto w-full max-w-[300px] scale-y-[-1] select-none sm:mt-8"
            />
          </div>
        </div>
      </section>

      <CtaBand
        tone="gold"
        eyebrow="OPEN ROLES"
        heading={
          <>
            Your health. Your power. <span className="text-navy-800">Our revolution.</span>
          </>
        }
        body="Ready to make an impact? Explore opportunities and help us transform health coverage nationwide."
        actions={
          <>
            <ActionButton
              variant="light"
              icon="arrowUpRight"
              size="lg"
              href={externalTargets.careersBoard}
            >
              Explore opportunities
            </ActionButton>
            <Button variant="ghost" size="lg" href="/contact">
              Get in touch
            </Button>
          </>
        }
        note="Roles are posted as they open. If nothing fits today, get in touch — we would still like to hear from you."
      />
    </>
  )
}
