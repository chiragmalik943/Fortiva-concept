import { ReactNode, useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../animations/gsap'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'
import { type Feature } from '../featureTypes'

export type { Feature }

interface FeatureRevealProps {
  eyebrow?: string
  heading: ReactNode
  /** Short lead under the heading. Optional — the column reads fine without it. */
  intro?: ReactNode
  features: Feature[]
  /** Buttons, rendered at the foot of the left column. */
  action?: ReactNode
  /** Background utility for the section. Defaults to white. */
  className?: string
}

/**
 * Copy on the left, cards on the right — and the cards are not there when you
 * arrive. They fly up from below the fold into their slots, one after another,
 * as you scroll past.
 *
 * ── How the timing works ────────────────────────────────────────────────────
 * The section is NOT pinned. An earlier version was: a tall section with a
 * sticky 100vh viewport, the same shape as ValuesStack. It was abandoned because
 * the content genuinely does not fit — a heading, a lead, a button and five
 * two-column cards measure ~830px, so on any laptop shorter than about 900px
 * the bottom card was clipped, and there is no way to know a visitor's viewport
 * height at authoring time. Pinning also costs ~110vh of extra scrolling on a
 * page that already runs long, on both Plans pages.
 *
 * So the cards animate against a FIXED 60vh scroll window instead, which is
 * independent of both the section's height and the viewport's: every card is in
 * place after 60vh of scrolling no matter what the copy measures, which is what
 * "it shouldn't take too long to see all the cards" actually requires.
 * `power2.out` puts most of each card's travel in the first third of its tween,
 * so a card is near its slot almost immediately and only spends a moment as a
 * translucent shape below the fold.
 *
 * ── The window is measured from the COPY column, not the section ─────────────
 * That detail is the difference between the effect working and not. The left
 * column is vertically centred, so its heading sits ~600px below the section's
 * top edge — meaning a window anchored to the section runs while the heading is
 * still below the fold, and by the time a visitor can actually read it every card
 * has already landed. Anchoring to the copy column instead ties the animation to
 * the thing being read: as the copy comes into view the slots beside it are
 * empty, and they fill as it settles. It also stops depending on the section's
 * height, which differs between the two Plans pages.
 *
 * ── Mobile is a different animation, not a scaled-down one ──────────────────
 * Below `lg` the cards stack into one or two columns and the section is ~1200px
 * tall, so a single shared 60vh window would place cards that are still far
 * below the fold — a visitor would scroll down to find them already sitting
 * there. Under `lg` each card therefore gets its own trigger and rises 48px as
 * it enters, which is the same "arriving from below" read at a scale that fits
 * the screen. `gsap.matchMedia` owns the switch, so resizing across the
 * breakpoint rebuilds the right one and reverts the other.
 */

/**
 * Card surfaces, cycled. The reference layout this section is modelled on used
 * four saturated pastels; those aren't in Fortiva's palette, so the variety comes
 * from the five tints the palette does have — two warm, two cool, one gold wash.
 * Every one is pale enough to keep a solid gold badge legible on top of it, which
 * is the constraint that ruled out anything stronger.
 */
const TINTS = ['bg-cream-soft', 'bg-navy-50', 'bg-mist/45', 'bg-cream', 'bg-gold/15']

/** How far below its slot a card starts, as a fraction of the viewport. */
const TRAVEL = 0.42

/** Timeline offset between consecutive cards; each tween lasts 1. */
const STEP = 0.5

export default function FeatureReveal({
  eyebrow,
  heading,
  intro,
  features,
  action,
  className = 'bg-white',
}: FeatureRevealProps) {
  const copyRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const ruleRef = useScrollReveal<HTMLDivElement>({ y: 0, scale: 0.6, delay: 0.28, duration: 0.7 })
  const introRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.16 })

  useEffect(() => {
    const cards = cardRefs.current.filter((el): el is HTMLDivElement => Boolean(el))
    if (cards.length === 0) return

    if (prefersReducedMotion) {
      gsap.set(cards, { opacity: 1, y: 0, scale: 1 })
      return
    }

    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: copyRef.current,
          start: 'top 82%',
          end: 'top 22%',
          scrub: 0.55,
          // The start offset is a fraction of the viewport, so it has to be
          // re-read after a resize rather than baked in at build time.
          invalidateOnRefresh: true,
        },
      })

      cards.forEach((card, i) => {
        tl.fromTo(
          card,
          { opacity: 0, y: () => window.innerHeight * TRAVEL, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power2.out' },
          i * STEP,
        )
      })
    })

    mm.add('(max-width: 1023.98px)', () => {
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 48, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            // Two cards can share a row here; the odd one lags so they land
            // in sequence rather than together.
            delay: (i % 2) * 0.1,
            scrollTrigger: { trigger: card, start: 'top 90%', once: true },
          },
        )
      })
    })

    return () => mm.revert()
  }, [features.length])

  return (
    <section className={`px-6 py-24 sm:py-28 ${className}`}>
      <div className="mx-auto grid max-w-container items-center gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        {/* ── the half that is there when you arrive ─────────────────────── */}
        <div ref={copyRef}>
          {eyebrow && (
            <span className="inline-block rounded-full bg-navy-800/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-navy-800/70">
              {eyebrow}
            </span>
          )}
          <h2
            ref={headingRef}
            className={`max-w-xl text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px] ${
              eyebrow ? 'mt-5' : ''
            }`}
          >
            {heading}
          </h2>

          {/* Hand-drawn underline, in gold. Scales up from 60% width rather
              than fading in, so it reads as being drawn under the heading. */}
          <div ref={ruleRef} className="mt-5 origin-left opacity-0">
            <svg
              aria-hidden="true"
              viewBox="0 0 180 16"
              fill="none"
              className="h-[14px] w-[132px] text-gold"
            >
              <path
                d="M3 11.5C24 3.5 41 3 58 8.5s33 5.5 50-.5 34-5.5 69 3"
                stroke="currentColor"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {(intro || action) && (
            <div ref={introRef} className="opacity-0">
              {intro && (
                <p className="mt-7 max-w-lg text-[16px] leading-relaxed text-navy-800/70 sm:text-[17px]">
                  {intro}
                </p>
              )}
              {action && <div className="mt-9 flex flex-wrap items-center gap-3">{action}</div>}
            </div>
          )}
        </div>

        {/* ── the half that arrives ──────────────────────────────────────────
            `items-start` is load-bearing: stretched cards would all take their
            row's height, which flattens the masonry back into a plain grid.
            Every card in the second column carries the offset as a MARGIN, not a
            transform: a transform is what the reveal animation is already
            driving, and margin participates in layout, so the row simply grows
            to fit rather than the offset card overlapping the one below it. */}
        <div className="grid items-start gap-5 sm:grid-cols-2">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                ref={(el) => (cardRefs.current[i] = el)}
                className={`corner-smooth flex flex-col rounded-card p-6 opacity-0 shadow-card-soft sm:p-7 ${
                  TINTS[i % TINTS.length]
                } ${i % 2 === 1 ? 'sm:mt-14' : ''}`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold">
                  <Icon size={20} className="text-navy-800" strokeWidth={1.75} />
                </div>
                <h3 className="mt-6 text-[18px] font-semibold leading-snug text-navy-800 sm:text-[19px]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-navy-800/65">{feature.body}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
