import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../animations/gsap'
import {
  MOBILE_QUERY,
  PIN_QUERY,
  UNPINNED_QUERY,
  pinDistance,
} from '../../animations/pinnedSequence'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'

export interface Step {
  title: string
  body: string
  /**
   * An illustration for this step, revealed as the rail's fill reaches its dot.
   * Optional: a caller that passes none for any step gets the section exactly as
   * it was. See the note on the reveal in the render.
   */
  image?: string
}

interface StepFlowProps {
  heading: ReactNode
  intro?: ReactNode
  steps: Step[]
  action?: ReactNode
  /** Controls the section fill AND the ring that punches the rail out behind
      each numbered dot — they have to be the same colour, so they're one knob. */
  surface?: 'white' | 'cream'
}

/* `cream` is the page's one opt-in grey plate — the `cream` tokens are white
   now (see tailwind.config.js), so the grey is written literally here. Two pages
   ask for it (Providers → Overview, Members → Virtual Care) and it is the only
   tinted section on either.

   `white`'s idle dot could not follow the token to white: an unlit dot on a
   white section would be invisible, and the dots are how the section reads as a
   sequence before it is scrolled. A 15% navy tint is the same "not yet" as the
   old grey against a surface that is now white. */
const SURFACES = {
  white: { section: 'bg-white', ring: 'ring-white', dotIdle: 'bg-navy-800/15' },
  cream: { section: 'bg-[#CCD0D2]', ring: 'ring-[#CCD0D2]', dotIdle: 'bg-white' },
} as const

/**
 * A numbered process, laid out as a horizontal rail on desktop and a plain
 * vertical list on mobile. The rail's gold fill is drawn by scrolling, and each
 * numbered dot lights as the fill reaches it — so the section performs the
 * sequence rather than just numbering it.
 *
 * ── The one interesting decision ─────────────────────────────────────────────
 * The fill is written by GSAP (continuous, 60fps, no React involved) but the
 * dots are React state, and the state only ever holds an integer: how many dots
 * the fill has passed. `onUpdate` fires on every scroll frame, so it derives that
 * integer and returns the previous value unchanged when it hasn't moved, which
 * makes React bail out of the re-render. A four-step flow therefore re-renders
 * four times across its whole scroll range instead of a few hundred.
 *
 * ── A section WITH illustrations pins itself; one without does not ──────────
 * Unillustrated, this is a rail that fills as it goes past — it wants no more
 * scroll than its own passage through the viewport, and `Plans` and `Providers →
 * Overview` still get exactly that.
 *
 * Illustrated, that passage is far too short. The whole sequence ran across the
 * ~410px between `top 78%` and `top 32%`, so by the time the fourth picture
 * arrived the section was most of the way off the top of the screen and nobody
 * had seen it. So when any step carries an image the section PINS: it holds still
 * at the top of the viewport while `pinDistance` worth of scroll drives the fill,
 * and it releases once the rail is full. Every step gets `PX_PER_STEP` to itself
 * — including the last, which is the beat where all four pictures are up and
 * nothing is still arriving — and only then does the page carry on.
 *
 * The `pin:` variants throughout are what make that possible: pinning an element
 * taller than the viewport clips its bottom, so they trim the section to the
 * screen it is about to occupy. All of them are inert on a window too short to
 * pin, where the section keeps the unpinned behaviour above.
 *
 * Mobile drops the rail entirely rather than rotating it: a vertical rail has to
 * thread between items whose heights vary with their copy, which means measuring
 * them, and the numbers already carry the sequence on a narrow screen.
 *
 * ── The illustrations, and why they MOUNT rather than fade ──────────────────
 * Each step can carry one, and it appears as its dot lights. The obvious way to
 * do that is to draw it at `opacity-0` and transition to 1 — which is wrong here,
 * because these are GIFs. A GIF starts playing the moment it is decoded, so one
 * drawn transparent from the top of the page has already run by the time anyone
 * sees it, and the two that were exported without a loop flag have run ONCE and
 * stopped on their last frame.
 *
 * So the `<img>` is not rendered at all until its step is reached, and mounting
 * it is what starts its animation — the reveal and the illustration's own first
 * frame are the same moment. The files are fetched on mount by `preload` below,
 * so the mount comes out of cache rather than off the network.
 *
 * The wrapper around it is what fades and rises, so the box is already the right
 * size and nothing in the row reflows as each one arrives.
 *
 * KNOWN, and it needs an asset rather than code: under `prefers-reduced-motion`
 * every step is lit at once, so every GIF mounts and plays. There is no way to
 * hold a GIF on one frame from here. If that matters, the fix is a still export
 * per step and a second slot to point at it.
 *
 * ── The illustrations sit ABOVE the rail, not under the copy ───────────────
 * Which is why they are not inside the list items: a picture inside each `<li>`
 * would push its dot down, and the rail is positioned against the top of the
 * element it is drawn in. They are their own row above `railRef` instead, in a
 * flex row with the same gaps the steps use, so the columns line up without the
 * rail's own arithmetic knowing anything about them.
 *
 * The row is a fixed HEIGHT with the pictures sitting on its baseline, so four
 * illustrations of four different widths hang from one line — which is what the
 * drawn design does, and what a fixed width would not give.
 *
 * Below `lg` there is no rail and the steps are a plain vertical list, so there
 * the picture goes back inside its own item, above the number. Two render sites,
 * one element built by `Illustration` — the file is the same URL either way, so
 * the browser fetches it once.
 *
 * ── The assets are DERIVED, and this is the part to read before replacing ──
 * The delivered GIFs could not be drawn without a background. They declare a
 * transparency index, but it points at pure green and nothing uses it: the field
 * is opaque BLACK, flattened out of what looks like a chroma-key export. Drawn on
 * these sections — the grey plate on Virtual Care, white on the App page — each
 * one was a black rectangle, and no blend mode fixes it: every mode that drops
 * black on a light background drops the dark line work with it.
 *
 * So the files in `public/` that this draws are WebP, built from those GIFs by
 * ramping alpha in over the first 60 levels of luminance — the field goes fully
 * transparent, the anti-aliased edges keep their softness instead of leaving a
 * fringe, and nothing in the artwork is dark enough to be touched. They also loop
 * now, which two of the GIFs did not. See the note in assets/images.ts.
 *
 * The originals are still in `public/` beside them. A re-export from the source
 * with real alpha is better than a derived file and should replace these; the
 * only thing it has to be is transparent.
 */
/**
 * One step's illustration.
 *
 * `lit` does two things at once and they are the same moment: the wrapper fades
 * and rises, and the `<img>` is MOUNTED. Mounting is what starts the animation —
 * an element drawn transparent from the top of the page would have finished
 * before anyone saw it. The wrapper is drawn either way, so the row's height is
 * settled before anything arrives and nothing reflows as each picture lands.
 */
function Illustration({ image, lit }: { image?: string; lit: boolean }) {
  if (!image) return null
  return (
    <div
      className={`h-full transition-all duration-700 ease-out ${
        lit ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      {lit && (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="h-full w-auto max-w-full select-none object-contain object-left-bottom"
        />
      )}
    </div>
  )
}

export default function StepFlow({
  heading,
  intro,
  steps,
  action,
  surface = 'white',
}: StepFlowProps) {
  const s = SURFACES[surface]
  const hasImages = steps.some((step) => step.image)
  const sectionRef = useRef<HTMLElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const [reached, setReached] = useState(0)

  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const introRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.12 })

  // Warm the cache so that the mount described above is instant. Nothing is
  // kept: the browser's image cache is the point, not the objects.
  useEffect(() => {
    steps.forEach((step) => {
      if (!step.image) return
      const img = new Image()
      img.src = step.image
    })
  }, [steps])

  /* ── useLayoutEffect, and it is not a preference ─────────────────────────
     `pin: true` makes ScrollTrigger wrap this section in a `.pin-spacer` — it
     inserts a parent between the section and the parent React put it in. A
     passive `useEffect` cleanup runs after React has already detached nodes, so
     on a route change React calls removeChild on a node whose real parent is now
     the spacer, throws, and takes the whole tree down with it. The note at the
     top of animations/pinnedSequence.ts records that in full; every pinning call
     site on this site uses a layout effect for it. */
  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    if (prefersReducedMotion) {
      setReached(steps.length)
      gsap.set(fillRef.current, { scaleX: 1 })
      return
    }

    /** Draw the rail to `progress` and light however many dots it has passed. */
    const advance = (progress: number) => {
      gsap.set(fillRef.current, { scaleX: progress })
      const next = Math.min(steps.length, Math.ceil(progress * steps.length))
      setReached((prev) => (prev === next ? prev : next))
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // ── PINNED: illustrated, and a window with room to hold the section ──
      if (hasImages) {
        mm.add(PIN_QUERY, () => {
          ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: `+=${pinDistance(steps.length)}`,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => advance(self.progress),
          })

          return () => advance(0)
        })
      }

      // ── UNPINNED: the rail fills as the section goes past ────────────────
      // The behaviour this section shipped with, and still the right one for a
      // caller with no pictures to wait for — or for a window too short to pin,
      // where pinning would clip the section's own foot.
      mm.add(hasImages ? UNPINNED_QUERY : '(min-width: 1024px)', () => {
        /* No `scrub` any more, and nothing is lost by it. The fill used to be a
           tween that ScrollTrigger scrubbed, which smoothed it by 0.4s; it is
           written directly from `progress` now, and Lenis has already smoothed
           the scroll this reads. `matchMedia` kills the trigger itself when the
           query stops matching, so the cleanup only has to put the rail back. */
        ScrollTrigger.create({
          trigger: railRef.current,
          start: 'top 78%',
          end: 'top 32%',
          onUpdate: (self) => advance(self.progress),
        })

        return () => advance(0)
      })

      // No rail below lg, so every dot is simply lit.
      mm.add(MOBILE_QUERY, () => {
        setReached(steps.length)
        gsap.set(fillRef.current, { scaleX: 1 })
      })
    }, section)

    return () => ctx.revert()
  }, [steps.length, hasImages])

  return (
    <section
      ref={sectionRef}
      className={`px-6 py-24 sm:py-28 ${s.section} ${
        hasImages ? 'pin:flex pin:h-screen pin:items-center pin:overflow-hidden pin:pb-10 pin:pt-24' : ''
      }`}
    >
      <div className="mx-auto w-full max-w-container">
        <h2
          ref={headingRef}
          className="max-w-2xl text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px]"
        >
          {heading}
        </h2>
        {intro && (
          <div ref={introRef} className="opacity-0">
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-navy-800/65 sm:text-[17px]">
              {intro}
            </p>
          </div>
        )}

        {hasImages && (
          /* The row the pictures hang from. `items-end` is the baseline; the
             height is fixed so that four pictures of four proportions line up
             along it, and `hidden lg:flex` because below `lg` each one goes back
             inside its own step. */
          <div aria-hidden="true" className="mt-16 hidden h-[170px] gap-8 lg:flex pin:mt-10 pin:h-[150px]">
            {steps.map((step, i) => (
              <div key={step.title} className="flex flex-1 items-end">
                <Illustration image={step.image} lit={i < reached} />
              </div>
            ))}
          </div>
        )}

        <div ref={railRef} className={`relative ${hasImages ? 'mt-10 lg:mt-8 pin:mt-7' : 'mt-16'}`}>
          {/* The rail and its fill sit behind the dots — `top` is half the dot's
              height, so the line meets each dot's centre. */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-[22px] hidden h-[2px] rounded-full bg-navy-800/10 lg:block"
          />
          <div
            ref={fillRef}
            aria-hidden="true"
            className="absolute left-0 right-0 top-[22px] hidden h-[2px] origin-left rounded-full bg-gold lg:block"
            style={{ transform: 'scaleX(0)' }}
          />

          <ol className="flex flex-col gap-10 lg:flex-row lg:gap-8">
            {steps.map((step, i) => {
              const lit = i < reached
              return (
                <li key={step.title} className="relative lg:flex-1">
                  {/* The phone's copy of the picture — see the docblock. */}
                  {step.image && (
                    <div aria-hidden="true" className="mb-6 flex h-[150px] items-end lg:hidden">
                      <Illustration image={step.image} lit={lit} />
                    </div>
                  )}

                  <div className="flex items-center gap-4 lg:block">
                    <span
                      className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold ring-4 transition-colors duration-500 ${s.ring} ${
                        lit ? 'bg-gold text-navy-800' : `${s.dotIdle} text-navy-800/40`
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-[18px] font-semibold leading-snug text-navy-800 lg:mt-6 lg:text-[19px]">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-3 max-w-sm pl-[60px] text-[15px] leading-relaxed text-navy-800/65 lg:pl-0">
                    {step.body}
                  </p>

                </li>
              )
            })}
          </ol>
        </div>

        {action && <div className="mt-14 flex flex-wrap gap-3 pin:mt-9">{action}</div>}
      </div>
    </section>
  )
}
