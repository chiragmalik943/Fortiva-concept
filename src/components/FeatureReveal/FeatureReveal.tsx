import { ReactNode, useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../animations/gsap'
import {
  MOBILE_QUERY,
  PIN_QUERY,
  UNPINNED_QUERY,
  pinDistance,
} from '../../animations/pinnedSequence'
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
  /**
   * Full-bleed background photograph, dissolving into the section's surface
   * before it reaches the copy. Optional: without it the section is the plain
   * plate it used to be, which is what every instance looked like before the
   * photographs were commissioned.
   *
   * Decorative — it is rendered `alt=""` and `aria-hidden`. Nothing this section
   * says is in the picture, and an empty alt is also what keeps the layout quiet
   * while the image files are still to come: a missing photograph with alt text
   * paints that text across the section.
   */
  image?: string
  /**
   * Which surface the section is drawn on.
   *
   *   'light' — white plate, navy type. The default, and what the section was.
   *   'dark'  — navy plate, light type. THE CARDS DO NOT CHANGE.
   *
   * That last part is the whole design of the dark variant: the eyebrow, the
   * heading and the lead invert, and the five cards stay cream-soft with gold
   * badges and navy type exactly as they are on white. They are the section's
   * figure — the thing that arrives — and inverting them too would have left a
   * dark section with dark cards on it and nothing to arrive at. See TONES.
   */
  tone?: 'light' | 'dark'
  /**
   * Background utility for the section, overriding the tone's own surface. For a
   * caller that needs a gradient or a tint rather than a flat plate; the type
   * colours still come from `tone`, so a light gradient wants `tone: 'light'`.
   */
  className?: string
}

/**
 * Copy on the left, cards on the right — and the cards are not there when you
 * arrive. They fly up from below the fold into their slots, one after another,
 * as you scroll past.
 *
 * ── The section pins, and that took a viewport to make possible ─────────────
 * On a window with room for it the section sticks to the top of the viewport and
 * holds the page still while the five cards arrive one at a time, then releases
 * and the page carries on. `start: 'top top'` on a `100vh` section means the pin
 * begins at the exact moment the whole section is on screen, so nothing animates
 * before the visitor can see all of it.
 *
 * This was tried and abandoned once before, and the reason it failed is worth
 * keeping: pinning an element taller than the viewport clips its bottom, and a
 * heading, a lead, a button and five two-column cards measured ~830px in a 915px
 * section — taller than most laptop windows. Pinning was only possible after the
 * section was trimmed to fit one: the `pin:` Tailwind variants below cut the
 * vertical padding, tighten the card grid and shrink the type, taking the content
 * from 640px to 521px, and the section is `pin:h-screen` so the pin can never be
 * handed something taller than the space it has. `pin:overflow-hidden` is part of
 * that too — the cards start their travel below their slots, and inside a pinned
 * section that has to be clipped by the section's own edge rather than painted
 * over what comes next.
 *
 * `pin:pt-24` rather than symmetric padding, because the nav pill floats over the
 * page: centring the content in the full viewport put the eyebrow underneath it on
 * shorter windows.
 *
 * The trimming and the pinning are gated on the SAME query. If CSS trimmed at one
 * threshold and JS pinned at another, a section would either pin while still too
 * tall (clipped) or trim itself while scrolling normally (needlessly cramped);
 * see animations/pinnedSequence.ts, which owns the query both read.
 *
 * ── The two fallbacks are the behaviour this section used to have ────────────
 * UNPINNED (`lg` but a window under 760px tall): no pin. The cards scrub against
 * a window that starts on the copy column and ends on the section's own bottom
 * edge — see `END_AT`. The start has to be the copy column: it is vertically
 * centred, so its heading sits well below the section's top edge, and a window
 * anchored to the section runs while the heading is still under the fold. The end
 * has to be the section, because the copy column says nothing about where the
 * cards finish.
 *
 * MOBILE (under `lg`): the cards stack into one or two columns and the section is
 * ~1200px tall, so one shared window would place cards still far below the fold —
 * a visitor would scroll down and find them already sitting there. Each card gets
 * its own trigger and rises 48px as it enters instead: the same "arriving from
 * below" read at a scale that fits the screen.
 *
 * `gsap.matchMedia` owns all three, so resizing across either threshold builds
 * the right one and reverts the others.
 */

/* ── One card surface, not five ──────────────────────────────────────────────
   There used to be a five-tint cycle here (cream-soft / navy-50 / mist / cream /
   gold wash), inherited from a reference layout that used four saturated pastels.
   It was variety for its own sake, and it stopped working the moment the section
   grew a photograph: five different pale tints over a photo read as five
   different degrees of transparency — as if some cards were letting more of the
   picture through than others.

   Every card is `bg-cream-soft` now. The colour in this section comes from the
   photograph and the gold badges; the cards are the quiet part. */

/* ── The two surfaces ────────────────────────────────────────────────────────
   Four tokens each, and there is deliberately no fifth for the cards: see the
   note on `tone` above. `surface` is separate from the other three so a caller
   can override it (`className`) without also having to restate the type colours.

   On navy the accent inside a caller's `heading` should be `text-gold` (#D5AC67)
   rather than `text-gold-dark` (#BD9455) — the dark gold was mixed for light
   plates and measures 2.6:1 on navy-800. The call sites that switched to this
   tone were updated with it. */
const TONES = {
  light: {
    surface: 'bg-white',
    eyebrow: 'bg-navy-800/5 text-navy-800/70',
    heading: 'text-navy-800',
    intro: 'text-navy-800/70',
  },
  dark: {
    surface: 'bg-navy-800',
    eyebrow: 'bg-white/10 text-white/75',
    heading: 'text-white',
    intro: 'text-white/70',
  },
} as const

/** How far below its slot a card starts, as a fraction of the viewport. */
const TRAVEL = 0.42

/**
 * Timeline offset between consecutive cards; each tween lasts 1. At 1 the cards
 * are strictly sequential — one finishes arriving as the next starts — which is
 * what makes each arrival read as its own event. It used to be 0.5, so every card
 * was half-overlapped with its neighbour and three could be mid-flight at once.
 */
const STEP = 1

/**
 * Where the run FINISHES: when the section's bottom edge reaches this fraction of
 * the viewport height. Sensitivity is set here, and it is expressed as a position
 * rather than a scroll budget for a reason worth reading before changing it.
 *
 * ── Why the end can't just be "a bigger number" ─────────────────────────────
 * The obvious way to slow this down is a fixed pixel window — `end: '+=1150'`.
 * That was tried and measured, and it fails on short viewports. This section is
 * NOT pinned (see above), so a longer window means the section travels further up
 * the screen before the last card lands. At 1440x1000 a 1150px run finishes with
 * card five sitting at y=20..229, comfortably in view. At 1440x620 the same 1150px
 * finishes with cards four and five at y=-279 and y=-305 — both settled entirely
 * above the fold. The animation was slower and the visitor never saw it: strictly
 * worse than the fast version it replaced.
 *
 * Anchoring the end to the section's own bottom edge fixes that by construction.
 * The window becomes `sectionHeight + startOffset - END_AT × viewportHeight`, so
 * a short window shortens the run instead of pushing the payoff off-screen, and
 * the last card always settles at the same PLACE on screen rather than after the
 * same number of pixels. It also self-adjusts to the three pages that use this
 * section, whose copy columns are different heights.
 *
 * Measured at 0.55: an 850-950px run across 620px, 800px and 1000px viewports on
 * all three pages, cards arriving 150-200px apart against 80px before, and no
 * card settling off-screen on any of them.
 */
const END_AT = 0.55

/* ── Nothing is drawn over the photograph any more ───────────────────────────
   There was a mask here: one radial ellipse anchored just outside the bottom-left
   corner, opening the corner where the heading, the lead and the button sit,
   thinning through the heading and fully transparent across the right half and
   the whole top where the cards and the subject are. It removed about a third of
   the picture under the copy rather than whitening it, so it worked on any
   surface the section was given.

   It is gone, along with every other generated gradient and overlay in this
   component. The photograph is painted flat, corner to corner, and the copy sits
   directly on it.

   Which moves the whole burden onto the assets, and it is worth being explicit
   about what they now have to do: the bottom-left corner of each one — roughly
   the left 45% below the halfway line — is live type. On `tone: 'light'` that is
   navy at 65-100%, so that corner has to stay pale; on `tone: 'dark'` it is white
   at 70-100%, so it has to stay dark. An asset that is busy or mid-toned there
   will put type on texture, and there is no longer any code between the two.
*/

export default function FeatureReveal({
  eyebrow,
  heading,
  intro,
  features,
  action,
  image,
  tone = 'light',
  className,
}: FeatureRevealProps) {
  const t = TONES[tone]
  const sectionRef = useRef<HTMLElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const introRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.16 })

  /* ── useLayoutEffect, not useEffect, and it is not a preference ──────────
     `pin: true` makes ScrollTrigger WRAP this section in a `.pin-spacer` div —
     it inserts a new parent between the section and the parent React put it in.
     Reverting the pin unwraps it, and that has to happen before React removes
     the section from the DOM.

     `useEffect` cleanups are PASSIVE: React defers them and runs them after it
     has already detached the nodes. So on a route change React called
     `parent.removeChild(section)` while the pin-spacer was still in between,
     the section was no longer a child of that parent, and the DOM threw
     `NotFoundError: The node to be removed is not a child of this node`. React
     cannot recover from a throw during unmount, so it tore down the whole tree:
     you clicked a link, the URL changed, and the page went blank until reload.

     A layout effect's cleanup is called synchronously during the deletion pass,
     before any node is removed. The pin is gone by the time React touches the
     DOM. This is the documented shape for GSAP in React and the only reason this
     is not a plain `useEffect`; leave it alone. */
  useLayoutEffect(() => {
    const cards = cardRefs.current.filter((el): el is HTMLDivElement => Boolean(el))
    if (cards.length === 0) return

    if (prefersReducedMotion) {
      gsap.set(cards, { opacity: 1, y: 0, scale: 1 })
      return
    }

    /**
     * The card choreography, as a paused timeline. Identical whether it ends up
     * scrubbed by a pin or by the section's passage through the viewport — only
     * what drives it differs — so it is built once here rather than written out
     * in both branches.
     */
    const buildTimeline = () => {
      const tl = gsap.timeline({ paused: true })
      cards.forEach((card, i) => {
        tl.fromTo(
          card,
          { opacity: 0, y: () => window.innerHeight * TRAVEL, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power2.out' },
          i * STEP,
        )
      })
      return tl
    }

    const mm = gsap.matchMedia()

    // ── PINNED ──────────────────────────────────────────────────────────
    mm.add(PIN_QUERY, () => {
      const tl = buildTimeline()

      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${pinDistance(cards.length)}`,
        pin: true,
        // Pre-applies the pin a frame early, which is what stops the one-frame
        // jump you otherwise get pinning at speed under Lenis.
        anticipatePin: 1,
        animation: tl,
        scrub: 0.55,
        invalidateOnRefresh: true,
      })

      return () => {
        trigger.kill()
        tl.kill()
      }
    })

    // ── UNPINNED: a window too short to hold the section ────────────────
    mm.add(UNPINNED_QUERY, () => {
      const tl = buildTimeline()

      const trigger = ScrollTrigger.create({
        trigger: copyRef.current,
        start: 'top 88%',
        endTrigger: sectionRef.current,
        end: `bottom ${END_AT * 100}%`,
        animation: tl,
        scrub: 0.55,
        // Both offsets are fractions of the viewport, so they have to be
        // re-read after a resize rather than baked in at build time.
        invalidateOnRefresh: true,
      })

      return () => {
        trigger.kill()
        tl.kill()
      }
    })

    // ── MOBILE ──────────────────────────────────────────────────────────
    mm.add(MOBILE_QUERY, () => {
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
    /* `pin:` = wide and tall enough to pin (animations/pinnedSequence.ts owns
       the query). Those variants ARE the trimming that lets the pin happen: a
       viewport-tall box, a third of the vertical padding, a tighter card grid,
       and the section's own edge clipping cards that are still travelling up into
       their slots. Every one of them is inert on a window too short to pin, which
       is what keeps the fallback identical to the layout this section had. */
    <section
      ref={sectionRef}
      className={`relative px-6 py-24 sm:py-28 pin:flex pin:h-screen pin:items-center pin:overflow-hidden pin:pb-10 pin:pt-24 ${className ?? t.surface}`}
    >
      {/* ── the photograph ───────────────────────────────────────────────────
          Full bleed and untouched — no mask, no scrim, no overlay. See the note
          above the component for what that asks of the asset.

          Hidden below `lg`. There is no two-column layout to sit behind down
          there — the section is a ~1200px single column, and a photograph
          stretched over that is a smear rather than a backdrop. */}
      {image && (
        <div className="pointer-events-none absolute inset-0 hidden select-none overflow-hidden lg:block">
          <img
            src={image}
            alt=""
            aria-hidden="true"
            className="h-full w-full select-none object-cover object-[center_18%]"
          />
        </div>
      )}

      <div
        className={`relative z-10 mx-auto grid w-full max-w-container gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20 pin:gap-10 ${
          /* With a photograph the copy drops to the foot of its column: the
             subject of every one of these shots is at the top of the frame, and
             a vertically centred heading sat across their face. Without one,
             centred is still right — nothing to avoid. */
          image ? 'items-center lg:items-end' : 'items-center'
        }`}
      >
        {/* ── the half that is there when you arrive ─────────────────────── */}
        <div ref={copyRef}>
          {eyebrow && (
            <span
              className={`inline-block rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] ${t.eyebrow}`}
            >
              {eyebrow}
            </span>
          )}
          <h2
            ref={headingRef}
            className={`max-w-xl text-[30px] font-semibold leading-tight opacity-0 sm:text-[38px] ${t.heading} ${
              eyebrow ? 'mt-5 pin:mt-4' : ''
            }`}
          >
            {heading}
          </h2>

          {(intro || action) && (
            <div ref={introRef} className="opacity-0">
              {intro && (
                <p
                  className={`mt-7 max-w-lg text-[16px] leading-relaxed sm:text-[17px] pin:mt-5 ${t.intro}`}
                >
                  {intro}
                </p>
              )}
              {action && (
                <div className="mt-9 flex flex-wrap items-center gap-3 pin:mt-7">{action}</div>
              )}
            </div>
          )}
        </div>

        {/* ── the half that arrives ──────────────────────────────────────────
            ── One gap value, both axes ─────────────────────────────────────
            The staggered look here costs nothing in spacing, but getting there
            took ruling out the two obvious ways of building it.

            `sm:mt-14` on the odd cards was the first. Margin participates in
            layout, so those 56px went into the FIRST ROW'S HEIGHT: the gap
            between a card and the card under it came out at 56 + 20 = 76px
            against a 20px column gap. Two gaps meant to read as one rhythm,
            off by nearly 4x.

            `items-start` was the second, and subtler. Left to size themselves,
            two cards sharing a row differ in height by however many lines of
            body copy separate them, and ALL of that slack lands in the gap
            below the shorter one — measured at 65px against the same 20px
            column gap, and it moves whenever the copy is edited.

            So: no `items-start` (rows stretch, both cards in a row are the same
            height, and every vertical gap is exactly the row gap), and the
            offset is `relative` + `sm:top-14`, which paints the odd cards lower
            without touching the row boxes. `gap-5` is now the only spacing in
            here, in both directions.

            It has to be `top` rather than `translate-y`, too — the reveal
            animation below owns the transform on these elements, and GSAP
            would overwrite a Tailwind translate on its first tick. */}
        {/* ── Two gap values in the pinned layout, and only one of them is the
            drawn number ──────────────────────────────────────────────────────
            It was `pin:gap-3` — 12px, which read as one block of five rather
            than as five cards. The layout is drawn at 28px in both directions,
            and the column gap is 28px here because a column gap costs nothing:
            it doesn't touch the section's height.

            The ROW gap does, three rows deep, and the pinned height budget is
            genuinely tight. Worth knowing before raising it: at 1024px wide the
            card titles wrap to two lines, and the five cards alone measure ~637px
            against the 624px a 760px-tall window leaves after `pin:pt-24` and
            `pin:pb-10` — so that window is over budget with a gap of ZERO, and has
            been since the section started pinning at 1024. (The fix for that is
            the pin breakpoint's width in animations/pinnedSequence.ts, not this
            value.) 20px keeps the overflow within a few px of where it already
            was there, and reads as the same rhythm as the 28px column gap on the
            windows this layout was drawn for. */}
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-7 pin:gap-x-7 pin:gap-y-5">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                ref={(el) => (cardRefs.current[i] = el)}
                className={`corner-smooth relative flex flex-col rounded-2xl bg-cream-soft p-6 opacity-0 shadow-card-soft sm:p-7 pin:p-4 ${
                  i % 2 === 1 ? 'sm:top-14' : ''
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold">
                  <Icon size={20} className="text-navy-800" strokeWidth={1.75} />
                </div>
                <h3 className="mt-6 text-[18px] font-medium leading-snug text-navy-800 sm:text-[19px] pin:mt-3.5 pin:text-[18px]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-navy-800/65 pin:mt-2 pin:text-[13.5px]">
                  {feature.body}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
