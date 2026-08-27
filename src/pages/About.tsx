import PageHero from '../components/PageHero/PageHero'
import ValuesStack from '../components/ValuesStack/ValuesStack'
import Button from '../components/Button'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useSplitReveal } from '../hooks/useSplitReveal'
import { availability, companyLocation } from '../content/site'
import { images } from '../assets/images'

/**
 * The mission band's artwork is a full-section composition, 1440 x 913: the
 * consulting-room photograph, the lotus lattice panel down its outer edge, and
 * its own dissolve into a flat background on the left and at the foot. So it is
 * rendered full bleed and NOTHING is drawn on top of it — the lattice used to be
 * generated here as an SVG pattern and is now part of the asset.
 *
 * What the mask is still for: the asset's flat background is `#ECEAE1`, the
 * site's cream, and this section is white. Left un-masked, that flat area would
 * read as a cream block against the white. These two ramps take it off — the left
 * one reaches solid at 34%, which is about where the photograph starts, and the
 * bottom one clears the last 12%.
 *
 * A mask rather than a white overlay for the usual reason: it removes the picture
 * and lets the section's own background through, whatever colour that is. See
 * DissolvePhoto.tsx.
 *
 * Two layers, intersected: `mask-composite: intersect` is the standard spelling,
 * `-webkit-mask-composite: source-in` the WebKit one.
 *
 * NOTE for whoever re-exports this image: a rectangular ramp can only cut
 * straight lines across a flat colour, and it leaves a small cream wedge around
 * the photograph's lower left that no ramp can reach. Re-exporting with that flat
 * area as #FFFFFF (or as real transparency) makes the section white edge to edge
 * and this mask unnecessary.
 */
const PRINCIPLES_PHOTO_MASK = [
  'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.35) 16%, #000 34%, #000 100%)',
  'linear-gradient(180deg, #000 0%, #000 88%, transparent 100%)',
].join(', ')

/**
 * About.
 *
 * Every word below is from FTVA_Web Copy.odt's "About — Main Navigation"
 * section. Its five headings map to this page one-for-one:
 *
 *   Who We Are ─┐
 *   What We Do ─┴─→ the two-column "the company" band (white)
 *   Guided by principles → the mission plate (the white disc)
 *   Powered by values → <ValuesStack /> (moved here from the homepage)
 *   FOR a better health insurance experience → the closing narrative
 *
 * The doc gives About no H1 — it opens straight on "Who We Are" — so the hero
 * headline is built from the promise that sentence contains ("put people
 * first, not premiums") rather than invented. Nothing here is new copy.
 *
 * On the shared heading: the closing section's "FOR a better health insurance
 * experience" is also StackedCards' heading on the homepage. That's the doc's
 * own doing — it uses the line in both places — and they never appear on
 * screen together, so it's kept rather than reworded.
 */
export default function About() {
  const whoRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const whoBodyRef = useScrollReveal<HTMLParagraphElement>({ y: 24, delay: 0.1 })
  const doRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const doBodyRef = useScrollReveal<HTMLParagraphElement>({ y: 24, delay: 0.15 })
  const factsRef = useScrollReveal<HTMLDListElement>({ y: 24, delay: 0.2 })

  const principlesMarkRef = useScrollReveal<HTMLImageElement>({ y: 14, duration: 0.7 })
  const principlesBodyRef = useSplitReveal<HTMLParagraphElement>({ type: 'words' })

  const closingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const closingOneRef = useScrollReveal<HTMLParagraphElement>({ y: 24, delay: 0.1 })
  const closingTwoRef = useScrollReveal<HTMLParagraphElement>({ y: 24, delay: 0.2 })
  const closingCtaRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.3 })

  return (
    <>
      <PageHero
        eyebrow="ABOUT FORTIVA"
        titleTop="We put people first."
        titleBottom="Not premiums."
        lede={
          <>
            Fortiva is redefining health insurance. We&rsquo;re a North Carolina-based company
            built on a simple promise, and plans designed to be affordable, transparent and
            flexible &mdash; because health coverage should work for real lives, not just
            spreadsheets.
          </>
        }
        actions={
          <>
            <Button variant="gold" icon="arrow" size="lg" href="/plans">
              Explore Plans
            </Button>
            <Button variant="ghost" size="lg" href="/careers">
              Join the Movement
            </Button>
          </>
        }
      />

      {/* ── Who We Are / What We Do ───────────────────────────────────────
          Same white plate and same two-column grid as the homepage's
          MissionBand, deliberately: a visitor arriving here from the homepage
          should recognise the shape. The right column carries the doc's
          "Who We Are" facts as a definition list instead of a third paragraph,
          so the band has something other than prose in it. */}
      <section className="bg-white px-6 py-24 sm:py-32">
        <div className="mx-auto grid max-w-container items-start gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2
              ref={whoRef}
              className="text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[36px]"
            >
              Who <span className="text-gold-dark">we are</span>
            </h2>
            <p
              ref={whoBodyRef}
              className="mt-7 max-w-xl text-[19px] leading-[1.5] text-navy-800/85 opacity-0 sm:text-[21px]"
            >
              Fortiva is redefining health insurance. We&rsquo;re a North Carolina-based
              company built on a simple promise: put people first, not premiums. Our plans
              are designed to be affordable, transparent and flexible because health
              coverage should work for real lives, not just spreadsheets.
            </p>

            <dl
              ref={factsRef}
              className="mt-10 grid gap-x-8 gap-y-6 border-t border-navy-800/10 pt-8 opacity-0 sm:grid-cols-2"
            >
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/45">
                  Headquarters
                </dt>
                <dd className="mt-1.5 text-[15.5px] text-navy-800/75">{companyLocation}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/45">
                  Available in
                </dt>
                <dd className="mt-1.5 text-[15.5px] text-navy-800/75">
                  {availability.live.join(', ')}
                  <span className="text-navy-800/45">
                    {' '}
                    &middot; {availability.comingSoon.length} more coming soon
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:pt-14">
            <h2
              ref={doRef}
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/50 opacity-0"
            >
              What <span className="text-gold-dark">we do</span>
            </h2>
            <p
              ref={doBodyRef}
              className="mt-5 border-l-2 border-gold pl-6 text-[20px] leading-[1.5] text-navy-800/80 opacity-0 sm:text-[22px]"
            >
              We offer multi-tiered plans backed by value-based care and technology that
              makes enrollment and claims simple. Whether you&rsquo;re an individual, family
              or small business, Fortiva gives you clarity, choice and confidence &mdash;
              without the surprises.
            </p>
          </div>
        </div>
      </section>

      {/* ── Guided by principles ──────────────────────────────────────────
          The doc gives this heading a single sentence, and one sentence is the
          whole design problem: any full-width treatment makes it look like a
          section that ran out of copy. It used to be a navy band at quote size.
          Now the sentence is a plate — a white disc holding the mark and the
          mission, with the photograph running out behind it to the right.

          A circle rather than a card because a circle has no reading width to
          fill: the sentence sets its own measure inside one, and the shape reads
          as a seal on the page rather than as an under-filled panel.

          ── Where the heading went ────────────────────────────────────────
          "Guided by principles" is `sr-only`. The plate carries the mark where a
          label would go, which is what the layout was drawn with, and a small-caps
          eyebrow floating above a disc had nothing to align to. The heading stays
          in the document so the page's outline still matches the copy doc's five
          sections — it is just not painted.

          ── The band went from dark to white ──────────────────────────────
          This was the page's one dark plate. White was the client's call, and it
          leaves About running white → white → gradient → gradient with no break:
          the page's contrast now comes from the photographs rather than from a
          colour switch. */}
      <section className="relative overflow-hidden bg-white px-6 py-20 sm:py-24 lg:flex lg:min-h-[820px] lg:items-center">
        {/* The artwork, full bleed, `lg` and up. Below that the plate has the
            section to itself — a photograph behind a full-width disc is a
            texture, not a picture. See PRINCIPLES_PHOTO_MASK. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden select-none lg:block"
        >
          <img
            src={images.principlesPortrait}
            alt=""
            className="h-full w-full object-cover object-[center_35%]"
            style={{
              maskImage: PRINCIPLES_PHOTO_MASK,
              WebkitMaskImage: PRINCIPLES_PHOTO_MASK,
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in',
            }}
          />
        </div>

        <div className="relative mx-auto w-full max-w-container">
          {/* Two things about this disc.

              No `corner-smooth`, unlike every other rounded surface on the site:
              `corner-shape: superellipse(1.6)` and `rounded-full` fight, and the
              superellipse wins — you get a squircle where the layout calls for a
              disc.

              And it is cream below `lg`, white above. White is right where it sits
              over the photograph; below `lg` the photograph is dropped and a white
              disc on a white section is invisible — the plate disappeared and took
              the shape of the section with it. Cream keeps it a plate. */}
          <div className="mx-auto flex aspect-square w-full max-w-[400px] flex-col items-center justify-center rounded-full bg-cream px-9 text-center sm:max-w-[480px] sm:px-12 lg:mx-0 lg:bg-white">
            <img
              ref={principlesMarkRef}
              src={images.icon}
              alt=""
              aria-hidden="true"
              className="h-11 w-auto opacity-0 sm:h-[54px]"
            />
            <h2 className="sr-only">Guided by principles</h2>
            <p
              ref={principlesBodyRef}
              className="mt-6 text-[17px] leading-[1.5] text-navy-800 opacity-0 sm:mt-8 sm:text-[22px]"
            >
              Our mission is to champion a member-first approach to health insurance &mdash;
              transparent, affordable and designed for better outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* Moved here from the homepage. Its own heading is already the doc's
          About wording ("Powered by values"), so it needed no changes. */}
      <ValuesStack />

      {/* ── FOR a better health insurance experience ──────────────────────
          The doc's closing About passage: what went wrong, then what Fortiva
          does about it. Set as two columns so the turn between them is a
          visible pivot rather than a paragraph break. */}
      <div className="gradient-lower">
        <section className="px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-container">
            <h2
              ref={closingRef}
              className="max-w-2xl text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px]"
            >
              <span className="text-gold-dark">FOR</span> a better health insurance experience
            </h2>

            <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
              <p
                ref={closingOneRef}
                className="max-w-xl text-[16px] leading-relaxed text-navy-800/60 opacity-0 sm:text-[17px]"
              >
                Health insurance started as a safety net. Over time, it became tangled in
                complexity, rising costs and outdated systems that put profits before
                people. The result? Frustrated members and a broken experience.
              </p>
              <p
                ref={closingTwoRef}
                className="max-w-xl text-[16px] leading-relaxed text-navy-800/85 opacity-0 sm:text-[17px]"
              >
                Fortiva is here to flip the script. <span className="text-gold-dark">FOR</span>{' '}
                your health. <span className="text-gold-dark">FOR</span> your care.{' '}
                <span className="text-gold-dark">FOR</span> you. We&rsquo;re cutting through
                the clutter with transparent pricing, personalized plans and technology that
                works for you &mdash; not against you.
              </p>
            </div>

            <div ref={closingCtaRef} className="mt-14 flex flex-wrap items-center gap-3 opacity-0">
              <Button variant="gold" icon="arrow" href="/plans">
                Explore Plans
              </Button>
              <Button variant="ghost" href="/contact">
                Get a Quote
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
