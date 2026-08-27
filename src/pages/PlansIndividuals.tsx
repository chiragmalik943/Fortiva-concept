import { Wallet, Eye, SlidersHorizontal, Sparkles, Headphones } from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import FeatureReveal, { type Feature } from '../components/FeatureReveal/FeatureReveal'
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
 *   FOR individuals   → FeatureReveal, the scroll-in card band (white)
 *   FOR families      → the split band (navy + photograph)
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
  const familyHeadingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const familyIntroRef = useScrollReveal<HTMLParagraphElement>({ y: 22, delay: 0.1 })
  const familyListRef = useScrollReveal<HTMLUListElement>({ y: 24, delay: 0.2 })
  const familyImageRef = useScrollReveal<HTMLDivElement>({ y: 40, scale: 0.96 })

  const promiseRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const promiseBodyRef = useScrollReveal<HTMLParagraphElement>({ y: 24, delay: 0.12 })
  const promiseTailRef = useScrollReveal<HTMLParagraphElement>({ y: 24, delay: 0.22 })
  const promiseCtaRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.32 })

  return (
    <>
      <PageHero
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
            <Button variant="ghost" size="lg" href="/plans">
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
        eyebrow="FOR INDIVIDUALS"
        heading={
          <>
            Coverage built around <span className="text-gold-dark">one person</span>
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
          Photograph plus navy, the same split shape as the homepage's
          enrollment band — the doc gives this section three short bullets and
          one lead sentence, which is far too little to hold a full-width plate
          on its own. Pairing it with the family photograph already in the
          asset set gives it the weight the copy can't. */}
      <section className="bg-navy-800">
        <div className="grid lg:min-h-[80vh] lg:grid-cols-2">
          <div ref={familyImageRef} className="relative order-2 min-h-[320px] lg:order-1 lg:min-h-0">
            <img
              src={images.insuranceFamily}
              alt="A Fortiva family plan member"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="order-1 flex flex-col justify-center px-8 py-16 lg:order-2 lg:px-16 lg:py-20">
            <h2
              ref={familyHeadingRef}
              className="text-[30px] font-semibold leading-tight text-white opacity-0 sm:text-[38px]"
            >
              <span className="text-gold">FOR</span> families
            </h2>
            <p
              ref={familyIntroRef}
              className="mt-6 max-w-md text-[18px] leading-[1.5] text-white/85 opacity-0 sm:text-[20px]"
            >
              Your family&rsquo;s health matters most. Our family plans offer:
            </p>

            <ul ref={familyListRef} className="mt-8 flex max-w-md flex-col opacity-0">
              {familyPoints.map((point, i) => (
                <li key={point} className="border-t border-white/10 py-5 last:border-b">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[14px] font-semibold text-gold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[16px] leading-relaxed text-white/80">{point}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-9">
              <Button variant="gold" icon="arrow" href="/contact">
                Get a Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

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
