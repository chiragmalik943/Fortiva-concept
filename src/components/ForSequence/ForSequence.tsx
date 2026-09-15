import { ReactNode, useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../../animations/gsap'

export interface ForStage {
  /** The word after "FOR", set on its own line in gold. */
  word: ReactNode
  body: ReactNode
  image: string
  /** What the photograph shows. Content, not atmosphere, so it is described. */
  imageAlt: string
}

interface ForSequenceProps {
  stages: ForStage[]
  action?: ReactNode
}

/**
 * Three photographs, one card, and the scroll moving between them.
 *
 * It replaces the ImageBand that used to carry this copy — one photograph and one
 * paragraph for a line that names three audiences — so each of the three gets its
 * own picture and its own sentence instead of sharing one.
 *
 * ── It is the homepage FOR section's mechanism, deliberately ────────────────
 * The two sections are the same idea for two readers, and they now move the same
 * way. Everything below is lifted from ClipMaskSection.tsx:
 *
 *   • A TALL SECTION with a `sticky` child, not a ScrollTrigger pin. The section
 *     is `SCROLL_HEIGHT` tall and the screen-height child sticks to the top of
 *     the viewport while the page scrolls past it. No pin-spacer is inserted, so
 *     the unmount hazard `pin: true` carries — React removing a node whose real
 *     parent has become a spacer — does not exist here at all.
 *   • ONE SCRUBBED TIMELINE on a 0-100 "percent of scroll" scale, every tween
 *     given an explicit duration in that same unit and a no-op spacer padding it
 *     out to exactly 100, so the numbers below read as scroll percentages.
 *   • SNAP POINTS at the middle of each hold, so a half-finished transition
 *     settles onto a stage rather than sitting between two.
 *   • THE PICTURE CHANGES BY FADING THE NEXT ONE IN over the one below it, at
 *     `ease: 'none'` — not a cross-fade, which would show the navy through the
 *     middle of every transition.
 *   • THE WORDS ROLL. The stages are stacked in one grid cell inside an
 *     `overflow-hidden` window and each is moved by a whole multiple of its own
 *     height, so the outgoing copy travels up and out while the incoming arrives
 *     from below — the homepage's odometer, at paragraph size. `power2.inOut`
 *     there and here, against the picture's linear fade, which is what makes the
 *     two read as one gesture rather than as two that coincide.
 *
 * The only thing here the homepage has no counterpart for is the CARD ARRIVING:
 * the section opens on the photograph alone and the card rises into the left half
 * a little way in. A card present on arrival makes the photograph its backdrop; a
 * photograph that lands alone is a photograph.
 *
 * ── Why one grid cell and not three fixed-height blocks ─────────────────────
 * The roll needs all three stages to be exactly the same height, or the copy
 * lands somewhere different each time. Stacking them in a single grid cell gets
 * that for free: the cell is as tall as the tallest stage and every stage
 * stretches to it, so the height is measured off the real copy rather than
 * guessed at — and a longer paragraph next month needs no number changing.
 *
 * ── Two effects, and the order matters ──────────────────────────────────────
 * The first watches the media query and owns `mode`. The second builds the
 * timeline, and only once `mode` is already 'sequence' — because the elements it
 * animates are rendered by that mode, and a matchMedia callback that set the
 * state and built the timeline in one pass would be tweening refs that React had
 * not filled yet. `mode` is also seeded from the query rather than defaulting, so
 * the first paint is already the right layout instead of a stack that reflows.
 *
 * Nothing in here writes a transform or an opacity through React. GSAP owns both
 * outright, which is what lets `active` — which exists only to mark the stages a
 * screen reader should skip — re-render without resetting a tween mid-transition.
 */

/**
 * How much scroll the sequence consumes, as a multiple of the viewport. The
 * homepage spends 380vh on three stages; this one has a shorter opening — a card
 * rising rather than a mask opening — so it spends a little less.
 */
const SCROLL_HEIGHT = '340vh'

/** Wide enough for the split, tall enough for a full-bleed picture. */
const SEQUENCE_QUERY = '(min-width: 1024px) and (min-height: 700px)'

const matchesSequence = () =>
  typeof window !== 'undefined' && window.matchMedia(SEQUENCE_QUERY).matches

export default function ForSequence({ stages, action }: ForSequenceProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const imgRefs = useRef<(HTMLImageElement | null)[]>([])
  const stageRefs = useRef<(HTMLDivElement | null)[]>([])

  const [mode, setMode] = useState<'sequence' | 'stack'>(() =>
    matchesSequence() ? 'sequence' : 'stack',
  )
  /** Drives `aria-hidden` only. The motion is scrubbed, not re-rendered. */
  const [active, setActive] = useState(0)

  useEffect(() => {
    const mql = window.matchMedia(SEQUENCE_QUERY)
    const apply = () => setMode(mql.matches ? 'sequence' : 'stack')
    apply()
    mql.addEventListener('change', apply)
    return () => mql.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (mode !== 'sequence' || !section) return

    const ctx = gsap.context(() => {
      const imgs = imgRefs.current
      const blocks = stageRefs.current

      // The resting state, written by GSAP so that React never owns either
      // property — see the docblock.
      gsap.set(cardRef.current, { opacity: 1, y: 0 })
      imgs.forEach((img, i) => gsap.set(img, { opacity: i === 0 ? 1 : 0 }))
      blocks.forEach((block, i) => gsap.set(block, { yPercent: i * 100 }))

      // Reduced motion stops here: the first photograph, the card already in,
      // and the first stage's words. Nothing moves, and nothing is unreachable.
      if (prefersReducedMotion) return

      gsap.set(cardRef.current, { opacity: 0, y: 34 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
          snap: {
            // The opening beat, then the middle of each stage's hold.
            snapTo: [0, 0.26, 0.61, 0.9],
            duration: { min: 0.2, max: 0.6 },
            delay: 0.1,
            ease: 'power1.inOut',
          },
          // 0.46 and 0.76 are the midpoints of the two transitions, so the
          // label flips while the words are halfway through the window.
          onUpdate: (self) =>
            setActive(self.progress > 0.76 ? 2 : self.progress > 0.46 ? 1 : 0),
        },
        defaults: { ease: 'none' },
      })

      // Intro (0-10): the photograph has the section to itself, then the card
      // rises into it. This is the stretch the homepage spends opening its mask.
      tl.to(cardRef.current, { opacity: 1, y: 0, ease: 'power2.out', duration: 10 }, 0)

      // Stage 1 holds to 42.
      // Transition 1 (42-50): picture and words change together.
      // Stage 2 holds to 72.
      // Transition 2 (72-80). Stage 3 then holds to 100.
      ;[42, 72].forEach((at, step) => {
        tl.to(imgs[step + 1], { opacity: 1, duration: 8 }, at)
        blocks.forEach((block, i) => {
          tl.to(block, { yPercent: (i - (step + 1)) * 100, ease: 'power2.inOut', duration: 8 }, at)
        })
      })

      tl.to({}, { duration: 20 }, 80)
    }, section)

    return () => ctx.revert()
  }, [mode, stages])

  const sequencing = mode === 'sequence'

  return (
    <section
      ref={sectionRef}
      className="relative bg-navy-800"
      style={sequencing ? { height: SCROLL_HEIGHT } : undefined}
    >
      <div className={sequencing ? 'sticky top-0 flex h-screen items-center overflow-hidden' : ''}>
        {/* ── the photographs ──────────────────────────────────────────────
            In `sequence` all three are stacked and GSAP fades the upper ones in;
            in `stack` each one heads its own block. The descending z-index there
            is what keeps a block's card above the NEXT block's photograph, which
            it overlaps by `-mt-16`. */}
        {stages.map((item, i) => (
          <div
            key={i}
            className={sequencing ? 'absolute inset-0' : 'relative'}
            style={sequencing ? undefined : { zIndex: stages.length - i }}
          >
            <div className={sequencing ? 'h-full w-full' : 'relative h-[72vh] min-h-[440px]'}>
              <img
                ref={(el) => (imgRefs.current[i] = el)}
                src={item.image}
                alt={item.imageAlt}
                loading={i === 0 ? undefined : 'lazy'}
                decoding="async"
                className="h-full w-full object-cover object-center"
              />
            </div>

            {/* One card per stage in `stack`, because the stages are separate
                blocks there. In `sequence` there is a single card below this loop
                instead — it stays put while its contents roll, which is the
                difference between a card that persists and three that take
                turns. */}
            {!sequencing && (
              <div className="relative mx-auto -mt-16 max-w-container px-6 pb-16">
                <div className="corner-smooth rounded-card bg-white p-9 shadow-card sm:p-11">
                  <CardBody word={item.word} body={item.body} />
                  {action && i === stages.length - 1 && (
                    <div className="mt-8 flex flex-wrap gap-3">{action}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {sequencing && (
          <div className="relative z-10 mx-auto w-full max-w-container px-6">
            <div ref={cardRef} className="max-w-[560px]">
              <div className="corner-smooth rounded-card bg-white p-9 shadow-card sm:p-11">
                {/* The window the words roll through. One grid cell, three stages
                    stretched to it — see the docblock for why the height is
                    measured rather than set. */}
                <div className="grid overflow-hidden">
                  {stages.map((item, i) => (
                    <div
                      key={i}
                      ref={(el) => (stageRefs.current[i] = el)}
                      aria-hidden={i !== active}
                      style={{ gridArea: '1 / 1' }}
                    >
                      <CardBody word={item.word} body={item.body} />
                    </div>
                  ))}
                </div>

                {/* Outside the window, and drawn once. The call is the same on
                    all three stages, so rolling three identical buttons past the
                    reader would be motion with nothing behind it — and it would
                    leave two copies a screen reader can still reach sitting in
                    the card either side of the live one. */}
                {action && <div className="mt-8 flex flex-wrap gap-3">{action}</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * "FOR" on its own line in navy, the audience under it in gold.
 *
 * The break is drawn rather than left to the measure: the whole line is the
 * page's refrain, and "FOR" landing at the end of a line with its word orphaned
 * below is the one arrangement that does not read as one phrase.
 */
function CardBody({ word, body }: { word: ReactNode; body: ReactNode }) {
  return (
    <>
      <h2 className="text-[38px] font-bold leading-[1.1] tracking-tight text-navy-800 sm:text-[52px]">
        <span className="block">FOR</span>
        <span className="block text-gold-dark">{word}</span>
      </h2>
      <p className="mt-6 text-[15.5px] leading-[1.7] text-navy-800/75 sm:text-[16.5px]">{body}</p>
    </>
  )
}
