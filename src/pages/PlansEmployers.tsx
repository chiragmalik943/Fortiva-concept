import { Layers, LineChart, MonitorSmartphone, HeartPulse, ScrollText } from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import FeatureReveal, { type Feature } from '../components/FeatureReveal/FeatureReveal'
import ListBand from '../components/ListBand/ListBand'
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
 *   What employers believe  → <ListBand />, the inset photograph + numbered list
 *   What we deliver         → FeatureReveal, the scroll-in card band (dark)
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
  const whyHeadingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const whyBodyRef = useScrollReveal<HTMLParagraphElement>({ y: 24, delay: 0.1 })
  const whyTailRef = useScrollReveal<HTMLParagraphElement>({ y: 24, delay: 0.2 })
  const whyCtaRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.3 })
  const whyImageRef = useScrollReveal<HTMLDivElement>({ y: 40, scale: 0.96 })

  return (
    <>
      <PageHero
        tone="teal"
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
            <Button variant="white" size="lg" href="/plans/individuals-and-families">
              Covering yourself?
            </Button>
          </>
        }
      />

      {/* ── What employers believe ────────────────────────────────────────
          Three convictions, and the doc gives no supporting sentence under any of
          them — so anything card-shaped would have been three-quarters empty box.
          It used to be a numbered editorial list across the full width of a navy
          plate, which was the treatment that didn't need copy it hadn't got.

          It is <ListBand /> now, the same component "FOR families" uses on Plans →
          Individuals & Families. These two pages are deliberately a matched pair —
          beliefs where that page has features, features where it has the family
          band — and running the shared shape through one component is what makes
          them read as a pair rather than as two pages that happen to rhyme. The
          photograph is what the full-width version was missing; see
          `employersBeliefs` in assets/images.ts for what that slot expects.

          The surface is where the two pages deliberately differ: Individuals &
          Families runs the component's navy→teal ramp, this one is flat teal. */}
      <ListBand
        /* Flat teal, not ListBand's navy→teal ramp. Which means this band and the
           hero above it are the SAME #0074A6, and with the hero's backdrop no
           longer fading at its foot the two run together as one teal region with
           the nav pill at the top of it and the photograph inset near the bottom.
           That is the composition, not a seam that needs closing — but it is why
           this page has no visible break until the FeatureReveal below goes navy. */
        className="bg-[#0074A6]"
        heading={
          <>
            What <span className="text-gold">employers believe</span>
          </>
        }
        items={beliefs}
        image={images.employersBeliefs}
        imageAlt="A Fortiva group plan member at work"
        action={
          <Button variant="gold" icon="arrow" href="/contact">
            Talk to our team
          </Button>
        }
      />

      {/* ── What we deliver ───────────────────────────────────────────────
          Same treatment as Individuals & Families' five benefits, so the two
          pages still read as a matched pair — copy holds the left, the five
          cards arrive from below one at a time. See FeatureReveal.tsx. */}
      <FeatureReveal
        tone="dark"
        eyebrow="WHAT WE DELIVER"
        heading={
          <>
            Benefits your team feels, <span className="text-gold">and your budget can hold</span>
          </>
        }
        intro={
          <>
            Five things a Fortiva group plan puts on the table, whatever size your team is
            today and whatever size it is next year.
          </>
        }
        features={deliverables}
        image={images.featureEmployers}
        action={
          <Button variant="gold" icon="arrow" href="/contact">
            Talk to our team
          </Button>
        }
      />

      {/* ── Why Fortiva? ──────────────────────────────────────────────────
          Closes on the corporate photograph already in the asset set, so the
          page ends on people rather than on another block of type.

          One way down and hand off, rather than a there-and-back ramp: this is
          the last section on the page, and the footer's navy is what comes next,
          not more page — so a gradient that climbed back to its starting colour
          spent its second half undoing itself.

          The ramp is white → #CCD0D2 now. It was `gradient-cool-in`, cream →
          #C7D2D6, which started on the same cream the section above it ended on;
          the section above is a navy FeatureReveal now, so there is nothing left
          for a cream top stop to continue from and white is the cleaner break
          off it. #CCD0D2 is the same grey About's values band sits on. */}
      <div className="bg-gradient-to-b from-white to-[#CCD0D2]">
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
