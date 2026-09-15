import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { gsap, prefersReducedMotion } from '../../animations/gsap'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'

export interface CarouselCard {
  title: string
  body: string
  /** The line icon at the top of the card. See `portalCardIcons` in images.ts. */
  icon: string
}

interface PortalCarouselProps {
  heading: ReactNode
  intro?: ReactNode
  cards: CarouselCard[]
  className?: string
  /**
   * The `from-*` half of the left-edge fade. Must match the section's own
   * surface — see the note on that fade in the render.
   */
  fadeFrom?: string
}

/**
 * A row of cards that drifts left on its own, with arrows to push it either way.
 *
 * It replaces the pinned screenshot window this section used to be (see
 * PortalShowcase.tsx, which still runs the Broker and Provider portals). The
 * window needed a real capture of every screen to say anything; this says the
 * same six things with the client's own icons and no screenshots at all, which
 * is also why it can show six cards in the space the window gave one.
 *
 * ── The three rules this layout has to keep ─────────────────────────────────
 *
 * 1. THREE CARDS AND A SLIVER. The partial fourth is the whole reason a visitor
 *    knows the row continues — a row that ends flush reads as four items, not as
 *    a carousel. So the card width is MEASURED rather than set: `CARDS_VISIBLE`
 *    says how many fit at each breakpoint, always ending in a fraction, and the
 *    cards are sized from the viewport's real width every time it changes. A CSS
 *    percentage cannot do this, because a flex item's `%` resolves against the
 *    track — which is several times wider than the window.
 *
 * 2. THE ROW RUNS OFF THE WINDOW. The left column sits on the page's container
 *    gutter and the track carries on past the right edge, so the sliver is cut by
 *    the window rather than by a margin. That is the `pl-[max(...)]` on the grid:
 *    the container's own left gutter, written out, with no right gutter to match
 *    it.
 *
 * 3. THE LOOP IS SEAMLESS. The cards are rendered TWICE and the track wraps at
 *    half its width, so the join is always off-screen. The duplicate set is
 *    `aria-hidden` — it is the same six cards, and a screen reader that met all
 *    twelve would have no way to know that.
 *
 * ── Why the motion is hand-rolled and not a tween ───────────────────────────
 * Two things move this row and they have to compose: a constant drift, and the
 * arrows. A looping tween owns its own playhead, so an arrow press would have to
 * fight it — seek it, or layer a second transform on top. Instead one number
 * (`offset`) is the truth, and each frame adds the drift and eases off whatever
 * an arrow has queued in `pending`. Pressing an arrow mid-drift, or three times
 * quickly, just adds to that queue; nothing has to be cancelled or resynced.
 *
 * Hovering the row stops the drift, because reading a card while it slides away
 * is the one thing this section must not do to someone.
 *
 * Under `prefers-reduced-motion` the drift never runs. The arrows still do, and
 * they jump rather than glide (`EASE` of 1), so the row stays usable without
 * anything moving on its own.
 */

/** Gap between cards, in px. Matches the `gap-4` the track would otherwise use. */
const GAP = 16

/**
 * The card's own proportion, as drawn: 113 x 172 in the reference. Set as a
 * ratio rather than a height so the row keeps its shape at every breakpoint, and
 * so a card whose title wraps to two lines is the same size as one whose doesn't
 * — six cards of six heights is the one thing a row of cards must not be.
 */
const CARD_RATIO = '113 / 172' 

/** Drift speed, in px per second. Slow enough to read a card as it passes. */
const SPEED = 26

/** How much of an arrow press is consumed per frame. 1 = jump, no glide. */
const EASE = 0.12

/**
 * Cards across the viewport at each breakpoint, always ending in a fraction so
 * the last one is visibly cut. Keys are the min-widths in tailwind.config.js.
 */
const CARDS_VISIBLE: [minWidth: number, count: number][] = [
  [1024, 3.35],
  [640, 2.35],
  [0, 1.25],
]

function cardsFor(width: number) {
  return (CARDS_VISIBLE.find(([min]) => width >= min) ?? CARDS_VISIBLE[2])[1]
}

export default function PortalCarousel({
  heading,
  intro,
  cards,
  className = 'bg-white',
  fadeFrom = 'from-white',
}: PortalCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  /** Set by the arrows, drained a fraction at a time by the ticker. */
  const pendingRef = useRef(0)
  /** True while the pointer is over the row. */
  const pausedRef = useRef(false)
  /** Survives a resize, so the row does not jump back to the start. */
  const offsetRef = useRef(0)

  const [cardWidth, setCardWidth] = useState(0)

  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const introRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.12 })
  const rowRef = useScrollReveal<HTMLDivElement>({ y: 32, delay: 0.1 })

  // Measure, and re-measure. `useLayoutEffect` so the first paint already has a
  // width — cards sized on a later frame would be seen snapping into place.
  useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const measure = () => {
      const width = viewport.clientWidth
      if (!width) return
      const visible = cardsFor(window.innerWidth)
      // The gaps only fall BETWEEN whole cards on screen, hence the floor.
      setCardWidth((width - GAP * Math.floor(visible)) / visible)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track || !cardWidth) return

    // Half the track: one full set of cards. Wrapping here keeps the join,
    // where the duplicate set begins, permanently off-screen.
    const half = (cardWidth + GAP) * cards.length
    const wrap = gsap.utils.wrap(-half, 0)
    let offset = wrap(offsetRef.current)

    const tick = (_time: number, delta: number) => {
      if (!pausedRef.current && !prefersReducedMotion) offset -= (SPEED * delta) / 1000

      const step = pendingRef.current * (prefersReducedMotion ? 1 : EASE)
      pendingRef.current -= step
      offset = wrap(offset + step)

      offsetRef.current = offset
      gsap.set(track, { x: offset })
    }

    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [cardWidth, cards.length])

  const nudge = (direction: -1 | 1) => {
    pendingRef.current += direction * (cardWidth + GAP)
  }

  const rendered = [...cards, ...cards]

  return (
    <section className={`overflow-hidden py-24 sm:py-28 ${className}`}>
      {/* The container's left gutter written out — 24px on a narrow window, and
          whatever centres a 1360px container on a wide one. No gutter on the
          right: that edge is where the row runs off the page. */}
      {/* ── `minmax(0, 1fr)` on BOTH layouts, and the single-column one is not
             optional ────────────────────────────────────────────────────────
          A grid column sized `auto` takes its minimum from its content, and this
          column's content is a flex track of `shrink-0` cards several thousand
          pixels wide. So under `lg` — where the grid was one implicit `auto`
          column — the track widened the column, the column widened the measured
          viewport, the cards were measured off that and widened the track again.
          It ran away: a 390px window measured a card at 26,843,476px and a
          document 33 million pixels tall, in about a second.

          `minmax(0, 1fr)` is the fix at both breakpoints: it gives the column a
          zero minimum, so the track can never push it wider than the window and
          the measurement has nothing to feed back into. The desktop layout had
          this from the start, which is why only the phone broke. */}
      <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-12 pl-[max(1.5rem,calc((100vw-1360px)/2))] lg:grid-cols-[minmax(0,330px)_minmax(0,1fr)] lg:gap-14">
        <div className="pr-6 lg:pr-0">
          <h2
            ref={headingRef}
            className="text-[34px] font-bold leading-tight text-navy-800 opacity-0 sm:text-[42px]"
          >
            {heading}
          </h2>

          <div ref={introRef} className="opacity-0">
            {intro && (
              <p className="mt-5 max-w-sm text-[15.5px] leading-relaxed text-navy-800/70">
                {intro}
              </p>
            )}

            {/* Neutral at rest, gold on hover — the same pair the cards make, so
                the section has one hover colour rather than two. The arrows are
                the only controls here, so they carry real labels: "previous" and
                "next" mean nothing read out on their own. */}
            <div className="mt-9 flex items-center gap-4">
              {([
                ['Show the previous portal features', -1, ArrowLeft],
                ['Show the next portal features', 1, ArrowRight],
              ] as const).map(([label, direction, Icon]) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  onClick={() => nudge(direction as -1 | 1)}
                  className="corner-smooth flex h-12 w-12 items-center justify-center rounded-full bg-navy-800/[0.06] text-navy-800 transition-all duration-300 hover:bg-gold hover:text-navy-800 focus-visible:bg-gold active:scale-95"
                >
                  <Icon size={19} strokeWidth={2.25} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* `overflow-hidden` here and not on the section, because these are the
            edges the row is cut against — and the two edges are cut differently.

            RIGHT is a hard cut, and has to be: the sliver of a fourth card is the
            only thing telling a visitor the row continues, and a sliver that
            faded out would read as the row ending softly.

            LEFT is faded. That edge butts against the heading and the arrows, and
            a card sliced mid-word a few pixels from the copy reads as a collision
            rather than as motion. 56px of the section's own colour is enough to
            turn the cut into a card leaving. It is a `from-*` utility rather than
            a fixed white so a caller on a tinted surface can keep them matched —
            a fade to the wrong colour is more visible than no fade at all. */}
        <div
          ref={rowRef}
          className="relative opacity-0"
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
        >
          <div ref={viewportRef} className="overflow-hidden">
            <div ref={trackRef} className="flex" style={{ gap: GAP }}>
              {rendered.map((card, i) => (
                <article
                  key={i}
                  aria-hidden={i >= cards.length || undefined}
                  style={{ width: cardWidth || undefined, aspectRatio: CARD_RATIO }}
                  className="corner-smooth group flex shrink-0 flex-col justify-end rounded-card bg-[#F1F3F5] px-7 pb-9 pt-8 transition-colors duration-300 hover:bg-gold"
                  /* The card is not a link and has no control in it, so it is an
                     <article> rather than an <a> or a <button>: the hover is a
                     highlight, not an affordance for something that happens. */
                >
                  <div className="flex flex-1 items-center justify-center py-4">
                    <img
                      src={card.icon}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="max-h-full w-auto select-none"
                      style={{ height: 124 }}
                    />
                  </div>
                  <h3 className="text-center text-[16.5px] font-bold leading-snug text-navy-800">
                    {card.title}
                  </h3>
                  <p className="mt-2.5 text-center text-[13.5px] leading-relaxed text-navy-800/70 transition-colors duration-300 group-hover:text-navy-800/80">
                    {card.body}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r to-transparent ${fadeFrom}`}
          />
        </div>
      </div>
    </section>
  )
}
