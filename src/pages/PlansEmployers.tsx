import { Layers, LineChart, MonitorSmartphone, HeartPulse, ScrollText } from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import FeatureReveal, { type Feature } from '../components/FeatureReveal/FeatureReveal'
import Button from '../components/Button'
import { images } from '../assets/images'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useSplitReveal } from '../hooks/useSplitReveal'

/**
 * Plans → Employers.
 *
 * Copy is FTVA_Web Copy.odt's "Employers — Sub Navigation" section:
 *
 *   H1 + intro              → PageHero
 *   What employers believe  → the navy beliefs plate
 *   What we deliver         → FeatureReveal, the scroll-in card band (white)
 *   Why Fortiva?            → the closing split
 *
 * Structurally the mirror of Individuals & Families — beliefs where that page
 * has features, features where it has the family band — so the two read as a
 * pair when someone tabs between them from the Plans menu, without either
 * being a copy of the other.
 */
const beliefs = [
  'Health benefits should empower growth, not drain resources.',
  'Predictability and transparency matter — no hidden costs, no surprises.',
  'Flexibility is key to meeting diverse employee needs.',
]

const deliverables: Feature[] = [
  {
    title: 'Cost-effective group plans',
    body: 'Multi-tier options that scale with your business size.',
    icon: Layers,
  },
  {
    title: 'Predictable pricing models',
    body: 'Transparent, compliance-backed solutions for budget control.',
    icon: LineChart,
  },
  {
    title: 'Digital onboarding and management tools',
    body: 'Powered by Fortiva, supported by AI for frictionless administration.',
    icon: MonitorSmartphone,
  },
  {
    title: 'Value-based care',
    body: 'Plans that prioritize employee well-being and better outcomes.',
    icon: HeartPulse,
  },
  {
    title: 'Compliance and regulatory support',
    body: 'Peace of mind for every employer and employee.',
    icon: ScrollText,
  },
]

export default function PlansEmployers() {
  const beliefsHeadingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const beliefsListRef = useScrollReveal<HTMLOListElement>({ y: 26, delay: 0.12 })

  const whyHeadingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const whyBodyRef = useScrollReveal<HTMLParagraphElement>({ y: 24, delay: 0.1 })
  const whyTailRef = useScrollReveal<HTMLParagraphElement>({ y: 24, delay: 0.2 })
  const whyCtaRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.3 })
  const whyImageRef = useScrollReveal<HTMLDivElement>({ y: 40, scale: 0.96 })

  return (
    <>
      <PageHero
        eyebrow="EMPLOYERS"
        titleTop="Health coverage that works"
        titleBottom="for your business."
        lede={
          <>
            At Fortiva, we know that employee benefits aren&rsquo;t just perks &mdash;
            they&rsquo;re a strategic advantage. That&rsquo;s why we&rsquo;ve designed
            solutions for small and mid-sized businesses that help attract and retain talent
            without breaking the budget.
          </>
        }
        actions={
          <>
            <Button variant="gold" icon="arrow" size="lg" href="/contact">
              Get a Quote
            </Button>
            <Button variant="ghost" size="lg" href="/plans/individuals-and-families">
              Covering yourself?
            </Button>
          </>
        }
      />

      {/* ── What employers believe ────────────────────────────────────────
          Three convictions, numbered and set large on navy. The doc gives no
          supporting sentence under any of them, so anything card-shaped would
          have been three-quarters empty box — a numbered editorial list is the
          treatment that doesn't need copy it hasn't got. */}
      <section className="bg-navy-800 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-container">
          <h2
            ref={beliefsHeadingRef}
            className="max-w-2xl text-[30px] font-semibold leading-tight text-white opacity-0 sm:text-[38px]"
          >
            What <span className="text-gold">employers believe</span>
          </h2>

          <ol ref={beliefsListRef} className="mt-14 grid gap-10 opacity-0 lg:grid-cols-3 lg:gap-12">
            {beliefs.map((belief, i) => (
              <li key={belief} className="border-t border-white/15 pt-7">
                <span className="text-[13px] font-semibold tracking-[0.14em] text-gold">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-4 text-[20px] leading-[1.45] text-white/85 sm:text-[22px]">
                  {belief}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── What we deliver ───────────────────────────────────────────────
          Same treatment as Individuals & Families' five benefits, so the two
          pages still read as a matched pair — copy holds the left, the five
          cards arrive from below one at a time. See FeatureReveal.tsx. */}
      <FeatureReveal
        eyebrow="WHAT WE DELIVER"
        heading={
          <>
            Benefits your team feels, <span className="text-gold-dark">and your budget can hold</span>
          </>
        }
        intro={
          <>
            Five things a Fortiva group plan puts on the table, whatever size your team is
            today and whatever size it is next year.
          </>
        }
        features={deliverables}
        action={
          <Button variant="gold" icon="arrow" href="/contact">
            Talk to our team
          </Button>
        }
      />

      {/* ── Why Fortiva? ──────────────────────────────────────────────────
          Closes on the corporate photograph already in the asset set, so the
          page ends on people rather than on another block of type. */}
      <div className="gradient-lower">
        <section className="px-6 py-24 sm:py-32">
          <div className="mx-auto grid max-w-container items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2
                ref={whyHeadingRef}
                className="text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px]"
              >
                Why <span className="text-gold-dark">Fortiva?</span>
              </h2>
              <p
                ref={whyBodyRef}
                className="mt-7 max-w-xl text-[19px] leading-[1.5] text-navy-800/85 opacity-0 sm:text-[21px]"
              >
                We&rsquo;re not just another carrier &mdash; we&rsquo;re your partner in
                innovation. Our approach combines affordability, flexibility and technology
                to make health insurance simple, fair and empowering for every employee.
              </p>
              <p
                ref={whyTailRef}
                className="mt-5 max-w-xl text-[16px] leading-relaxed text-navy-800/65 opacity-0 sm:text-[17px]"
              >
                With Fortiva, you get confidence in cost, clarity in coverage and a
                commitment to better care.
              </p>

              <div ref={whyCtaRef} className="mt-9 flex flex-wrap gap-3 opacity-0">
                <Button variant="gold" icon="arrow" href="/contact">
                  Get a Quote
                </Button>
                <Button variant="ghost" href="/brokers">
                  For brokers
                </Button>
              </div>
            </div>

            <div ref={whyImageRef} className="opacity-0">
              <div className="corner-smooth relative aspect-[4/3] overflow-hidden rounded-card shadow-card-soft">
                <img
                  src={images.insuranceCorporate}
                  alt="A Fortiva group plan member at work"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
