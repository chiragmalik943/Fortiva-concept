import { Wallet, Eye, SlidersHorizontal, Sparkles, Headphones } from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import FeatureReveal, { type Feature } from '../components/FeatureReveal/FeatureReveal'
import ListBand from '../components/ListBand/ListBand'
import Button from '../components/Button'
import { images } from '../assets/images'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useSplitReveal } from '../hooks/useSplitReveal'

/**
 * Plans → Individuals & Families.
 *
 * Copy is FTVA_Web Copy.odt's "Individuals & Families — Sub Navigation"
 * section, unabridged and in its own order:
 *
 *   H1 + intro        → PageHero
 *   FOR individuals   → FeatureReveal, the scroll-in card band (dark)
 *   FOR families      → <ListBand />, the inset photograph + numbered list
 *   Our promise       → the closing plate
 *
 * The doc writes each "FOR individuals" item as a bolded phrase plus a
 * sentence, which is exactly FeatureReveal's shape — the split below is on the
 * doc's own line breaks, so no wording was changed to fit the cards. Icons are
 * the one addition; the doc names none.
 */
const individualFeatures: Feature[] = [
  {
    title: 'Affordable multi-tiered plans',
    body: 'Flexible options that fit your budget without sacrificing quality care.',
    icon: Wallet,
  },
  {
    title: 'Transparent pricing',
    body: 'No hidden fees. No surprises. Just clarity and confidence in your coverage.',
    icon: Eye,
  },
  {
    title: 'Personalized coverage',
    body: 'Choose from tiers and add supplemental benefits like critical illness and AD&D for extra protection.',
    icon: SlidersHorizontal,
  },
  {
    title: 'Technology-driven convenience',
    body: 'Enrollment and claims made easy with our intuitive tools and proactive care powered by Agentic AI.',
    icon: Sparkles,
  },
  {
    title: 'Member-first support',
    body: 'Real people, real answers — because your health deserves more.',
    icon: Headphones,
  },
]

const familyPoints = [
  'Flexible tiers to fit your household’s needs.',
  'Supplemental options for added security.',
  'Transparent pricing so you can plan with confidence.',
]

export default function PlansIndividuals() {
  const promiseRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const promiseBodyRef = useScrollReveal<HTMLParagraphElement>({ y: 24, delay: 0.12 })
  const promiseTailRef = useScrollReveal<HTMLParagraphElement>({ y: 24, delay: 0.22 })
  const promiseCtaRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.32 })

  return (
    <>
      <PageHero
        tone="teal"
        eyebrow="INDIVIDUALS & FAMILIES"
        titleTop="Health coverage that works"
        titleBottom="for real life."
        lede={
          <>
            At Fortiva, we believe health insurance should be simple, fair and empowering.
            That&rsquo;s why our plans are designed <em className="not-italic font-semibold">for you</em> &mdash;
            whether you&rsquo;re an individual looking for affordable coverage or a family
            seeking peace of mind.
          </>
        }
        actions={
          <>
            <Button variant="gold" icon="arrow" size="lg" href="/contact">
              Get a Quote
            </Button>
            <Button variant="white" size="lg" href="/plans">
              See all plans
            </Button>
          </>
        }
      />

      {/* ── FOR individuals ───────────────────────────────────────────────
          The doc's five-item list, in FeatureReveal rather than a plain grid:
          the copy on the left is all that's on screen when you arrive, and the
          five cards rise into their slots one at a time as you scroll past.
          See FeatureReveal.tsx for why the section isn't pinned. */}
      <FeatureReveal
        tone="dark"
        eyebrow="FOR INDIVIDUALS"
        heading={
          <>
            Coverage built around <span className="text-gold">one person</span>
          </>
        }
        intro={
          <>
            Whichever tier you choose, these five things come with it &mdash; and none of them
            are the kind of detail you find out about later.
          </>
        }
        features={individualFeatures}
        image={images.featureIndividuals}
        action={
          <Button variant="gold" icon="arrow" href="/contact">
            Get a Quote
          </Button>
        }
      />

      {/* ── FOR families ──────────────────────────────────────────────────
          The doc gives this section one lead sentence and three short bullets —
          far too little to hold a full-width plate on its own — so it is paired
          with a photograph. That pairing is now <ListBand />, shared with "What
          employers believe" on Plans → Employers: the two pages are meant to read
          as a matched pair, and this is the shape they have in common.

          Two things moved when it became a component. The photograph is INSET
          rather than bleeding to the window edge, and the surface is a navy→teal
          ramp rather than flat navy-800 — see ListBand.tsx for both, including
          what the inset frame now asks of the asset.

          The photograph is plan-family.png, not img-4.png. It is its own key in
          assets/images.ts rather than a repoint of `insuranceFamily`, because
          img-4 is also the family card on the homepage. */}
      <ListBand
        heading={
          <>
            <span className="text-gold">FOR</span> families
          </>
        }
        intro={<>Your family&rsquo;s health matters most. Our family plans offer:</>}
        items={familyPoints}
        image={images.planFamily}
        imageAlt="A Fortiva family plan member"
        action={
          <Button variant="gold" icon="arrow" href="/contact">
            Get a Quote
          </Button>
        }
      />

      {/* ── Our promise ───────────────────────────────────────────────────
          Two sentences, set large and centred. The doc's second line ("No
          jargon. No confusion…") is the payoff, so it drops to a smaller size
          under the promise rather than running on inside it. */}
      <section className="bg-white px-6 py-24 text-center sm:py-32">
        <div className="mx-auto max-w-3xl">
          <h2
            ref={promiseRef}
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/50 opacity-0"
          >
            Our <span className="text-gold-dark">promise</span>
          </h2>
          <p
            ref={promiseBodyRef}
            className="mt-7 text-[24px] leading-[1.4] text-navy-800 opacity-0 sm:text-[32px]"
          >
            We put members first &mdash; always. Guided by humanity, driven by technology and
            committed to disrupting the status quo for better outcomes.
          </p>
          <p
            ref={promiseTailRef}
            className="mt-6 text-[17px] italic leading-relaxed text-navy-800/60 opacity-0 sm:text-[19px]"
          >
            No jargon. No confusion. Just health insurance you can trust.
          </p>

          <div ref={promiseCtaRef} className="mt-10 flex flex-wrap justify-center gap-3 opacity-0">
            <Button variant="gold" icon="arrow" size="lg" href="/contact">
              Get a Quote
            </Button>
            <Button variant="ghost" size="lg" href="/plans/employers">
              Covering a team?
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
