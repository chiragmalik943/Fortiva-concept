import { useEffect, useRef } from 'react'
import { Heart, Zap, ShieldCheck, KeyRound, Lightbulb, type LucideIcon } from 'lucide-react'
import { gsap, prefersReducedMotion } from '../../animations/gsap'
import { useSplitReveal } from '../../hooks/useSplitReveal'
import DissolvePhoto from '../DissolvePhoto/DissolvePhoto'
import { images } from '../../assets/images'

interface ValueCard {
  title: string
  body: string
  icon: LucideIcon
}

// Fortiva's five brand values, verbatim from the copy doc's About page and
// repeated near-identically on Careers. The four that were here before
// (Integrity / Client Focus / Risk Resilience / Expertise) were placeholders
// written to match the reference screenshot's tone.
const values: ValueCard[] = [
  {
    title: 'Member-first',
    body: 'Every decision starts and ends with the member in mind.',
    icon: Heart,
  },
  {
    title: 'Disrupt to improve',
    body: 'Challenge the status quo to create better outcomes for those we serve.',
    icon: Zap,
  },
  {
    title: 'Lead with integrity',
    body: 'Operate with transparency, honesty and accountability in every interaction.',
    icon: ShieldCheck,
  },
  {
    title: 'Empowerment',
    body: 'Give members control and confidence through clarity and choice.',
    icon: KeyRound,
  },
  {
    title: 'Innovation',
    body: 'Harness technology and bold thinking to transform health coverage.',
    icon: Lightbulb,
  },
]

// px each successive card sits lower than the one before it, so the card
// underneath always shows a slice of itself above the new arrival.
//
// 16, down from 24. The stack now shares its row with a photograph instead of
// having the full width to itself, and four 24px slices put 96px of grey ledge
// above the front card - taller than the card's own heading. 16 keeps the
// "there are more of these underneath" read at a third less height.
const PEEK = 16

// Everything below is DERIVED from values.length rather than hard-coded, so the
// list above is the only thing to edit if a sixth value ever arrives - the
// original version had a fixed 4-entry offset table and two `i < 4` loops, which
// is what made going from four values to five a code change at all.
const rest = values.map((_, i) => ({ x: 0, y: i * PEEK, rotate: 0 }))

// Scroll distance each card's rise gets. 83vh reproduces the approved 4-card
// pacing exactly: that build was 350vh tall with a 100vh sticky viewport, so
// (350 - 100) / 3 transitions is about 83vh per card.
const PER_TRANSITION_VH = 83
const SECTION_HEIGHT_VH = 100 + PER_TRANSITION_VH * (values.length - 1)

// Tallest card is ~260px in the narrower column; the stack adds one PEEK step
// per extra card on top.
const STACK_HEIGHT_PX = 260 + PEEK * (values.length - 1)

// how much darker (navy overlay opacity) a card gets per card stacked on top of it
const DARK_STEP = 0.04

/**
 * About > Powered by values. A photograph on the left, the five values arriving
 * one at a time as a stack of cards on the right, the whole thing held still
 * against the viewport while they arrive.
 *
 * == Why the stack moved off centre =========================================
 * It used to be a centred column: eyebrow, heading and stack down the middle of
 * an otherwise empty cream band. That worked when this section was on the
 * homepage and had a photograph above and below it to sit between. On About it
 * follows a white two-column band and precedes a two-column closing band, and a
 * centred column between them read as a gap in the page rather than as a set
 * piece. The photograph gives the left half something to do and the stack keeps
 * the right half; the `.gradient-lower` sweep underneath is the same one the
 * closing section uses, so the two now read as one run of the page.
 *
 * The photograph is `lg` and up only. Below that the section is a single column
 * and the stack needs all of it - see MarkedPhoto.tsx for the dissolve, which is
 * a mask rather than a scrim precisely so it can sit on this gradient.
 */
export default function ValuesStack() {
  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const outerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (prefersReducedMotion) {
      cardRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.set(el, { x: rest[i].x, y: rest[i].y, rotate: rest[i].rotate, opacity: 1 })
        // settled state: card i has (last - i) cards above it
        gsap.set(overlayRefs.current[i], { opacity: (values.length - 1 - i) * DARK_STEP })
      })
      return
    }

    const ctx = gsap.context(() => {
      // card 0 sits in place from the start, no darkening yet
      gsap.set(cardRefs.current[0], { x: rest[0].x, y: rest[0].y, rotate: rest[0].rotate })
      gsap.set(overlayRefs.current[0], { opacity: 0 })
      // every other card starts below the viewport, flat, undarkened
      for (let i = 1; i < values.length; i++) {
        gsap.set(cardRefs.current[i], { x: rest[i].x, y: '70vh', rotate: 0 })
        gsap.set(overlayRefs.current[i], { opacity: 0 })
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
        },
      })

      for (let i = 1; i < values.length; i++) {
        const segmentStart = i - 1

        // reveal card i
        tl.to(
          cardRefs.current[i],
          { y: rest[i].y, rotate: rest[i].rotate, ease: 'power2.out', duration: 1 },
          segmentStart,
        )

        // every earlier card now has one more card stacked on top of it -
        // darken each proportionally to how many cards are now above it
        for (let j = 0; j < i; j++) {
          const cardsAbove = i - j
          tl.to(
            overlayRefs.current[j],
            { opacity: cardsAbove * DARK_STEP, ease: 'power2.out', duration: 1 },
            segmentStart,
          )
        }
      }
    }, outerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={outerRef}
      className="relative gradient-lower"
      style={{ height: `${SECTION_HEIGHT_VH}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="mx-auto grid h-full max-w-container items-center gap-10 px-6 lg:grid-cols-2 lg:gap-16">
          {/* ── the photograph ───────────────────────────────────────────────
              A transparent cutout of the two clinicians with the Fortiva mark
              already behind them in the artwork, so nothing is drawn over it here
              — see DissolvePhoto.tsx on why the mark this used to paint is gone.

              `contain`, not `cover`: the asset is square and this column is
              portrait, and cover would crop the mark's petals off at the sides —
              the one thing in the frame that has to stay whole.

              `aspect-square` gives the box the asset's own shape, which is what
              lets the bottom fade be expressed against the picture instead of
              against the box — see CUTOUT_FADE in DissolvePhoto.tsx. It costs
              nothing in size (contain was already fitting by width) and it is why
              the dissolve lands on the subjects' feet rather than below them.

              The flex parent centres it, rather than a percentage height on the
              grid item: a percentage height resolves against the row, and one
              indirection makes "centred in the viewport" mean that everywhere
              instead of only where the row happens to be definite. */}
          <div className="hidden h-full items-center lg:flex">
            <DissolvePhoto
              src={images.valuesPortrait}
              fit="contain"
              edges="bottom"
              className="aspect-square w-full"
            />
          </div>

          <div className="flex flex-col items-center">
            <div className="mb-11 text-center">
              <span className="inline-block rounded-full bg-navy-800/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-navy-800/70">
                OUR VALUES
              </span>
              <h2
                ref={headingRef}
                className="mt-5 text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[42px]"
              >
                Powered by values
              </h2>
            </div>

            <div
              className="relative w-full max-w-[560px]"
              style={{ height: `${STACK_HEIGHT_PX}px` }}
            >
              {values.map((value, i) => {
                const Icon = value.icon
                return (
                  <div
                    key={value.title}
                    ref={(el) => (cardRefs.current[i] = el)}
                    className="corner-smooth absolute inset-x-4 top-0 overflow-hidden rounded-3xl bg-cream-soft p-7 shadow-card sm:inset-x-6 sm:p-8"
                    style={{ zIndex: i + 1 }}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold">
                      <Icon size={20} className="text-navy-800" strokeWidth={1.75} />
                    </div>
                    {/* Was `font-serif italic` - a system-serif italic used as a
                        deliberate contrast against Familjen Grotesk, kept as New
                        Hero's own italic once the site went single-typeface. The
                        italic is gone now too: it was the only italic heading on
                        the site, and beside a photograph it read as a pull quote
                        rather than as a card title. */}
                    <h3 className="mt-5 text-[22px] leading-snug text-navy-800 sm:text-2xl">
                      {value.title}
                    </h3>
                    <p className="mt-3 max-w-sm text-[14.5px] leading-relaxed text-navy-800/55">
                      {value.body}
                    </p>

                    <div
                      ref={(el) => (overlayRefs.current[i] = el)}
                      className="pointer-events-none absolute inset-0 bg-navy-900"
                      style={{ opacity: 0 }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
