import { ReactNode, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { type LucideIcon } from 'lucide-react'
import { gsap, prefersReducedMotion } from '../../animations/gsap'
import {
  MOBILE_QUERY,
  PIN_QUERY,
  UNPINNED_QUERY,
  pinDistance,
} from '../../animations/pinnedSequence'
import { scrollPageToY } from '../../hooks/useLenis'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'

export interface PortalItem {
  title: string
  body: string
  /** Drawn in the tab's badge, which is also its selected state. */
  icon: LucideIcon
  /**
   * The screenshot this section shows. Comes from `images.portalScreens` and its
   * siblings — see assets/images.ts, which is the only place a filename appears
   * and which carries the export note for the aperture.
   */
  screen: string
}

interface PortalShowcaseProps {
  eyebrow?: string
  heading: ReactNode
  intro?: ReactNode
  items: PortalItem[]
  /** Rendered under the intro, inside the centred column. */
  action?: ReactNode
}

/**
 * A three-up carousel of portal screenshots — the active one centred, sharp and
 * full size, its neighbours smaller, lower, faint and heavily blurred at the
 * edges of the frame — with a tablist underneath naming each one. On a window
 * with room for it the section pins, and the scroll walks the carousel: the
 * incoming neighbour slides to the middle while it scales up, rises and comes
 * into focus, and the outgoing one slides aside while it shrinks, drops and
 * blurs out. When the last screenshot lands the section releases and the page
 * carries on.
 *
 * All three portal pages render this, so a change here lands on For Members, For
 * Brokers and For Providers at once.
 *
 * ── The slides never overlap, and that is arithmetic rather than luck ───────
 * The hardest constraint in the brief, and the one a hand-tuned carousel gets
 * wrong halfway through a transition. Every slide's position and size are pure
 * functions of one number — `d`, its signed distance from the active position,
 * which runs continuously through fractions as the scroll moves — so the
 * separation between two neighbours can be solved once for every value of `d`
 * rather than eyeballed at rest.
 *
 * A slide at offset `d` is `f(|d|)` of full width, where `f(a) = 1 - min(a,1) *
 * (1 - SIDE_SCALE)`, and its centre sits `PITCH`% of a full slide width away
 * from its neighbour's. So the clear space between the two is
 *
 *     gap(d) = W * ( PITCH/100 - ( f(|d|) + f(|d+1|) ) / 2 )
 *
 * and the term being subtracted has a maximum of `(1 + SIDE_SCALE) / 2` — 0.86
 * at the values below. It reaches that maximum both at rest (one slide at full
 * size beside one at `SIDE_SCALE`) and at the midpoint of a transition (two
 * slides at the same intermediate size), because `f` is linear in `|d|` and the
 * two distances always sum to 1 across a neighbouring pair. With `PITCH` at 96
 * the gap is therefore never smaller than `0.10 * W` — about 75px at a 1440px
 * window — at any moment of any transition. Raising `SIDE_SCALE` or lowering
 * `PITCH` eats into that number, and `PITCH < 86 + SIDE_BLUR`-ish is where the
 * blur haloes start to touch, so those two constants move together or not at all.
 *
 * ── The timeline is not a constant-speed scrub ──────────────────────────────
 * A single linear tween from the first screenshot to the last means that
 * wherever the visitor stops, they are most likely mid-transition. So the
 * timeline alternates: a `DWELL` at rest with one screenshot centred, then a
 * `SLIDE` to the next. Measured across the pin, about two thirds of scroll
 * positions sit on a settled screenshot.
 *
 * That is also why there is no `ScrollTrigger.snap`. Snapping fixes the same
 * problem by taking the scroll away from the visitor and animating it itself,
 * which under Lenis means two things driving one scroll position; shaping the
 * timeline gets the same result and the scroll stays entirely the visitor's.
 *
 * ── One renderer, every branch ──────────────────────────────────────────────
 * `render()` below is the only thing that writes to a slide, and it takes its
 * input from a single mutable number. The pinned scrub, the unpinned scrub and
 * the click-driven tabs all do the same thing — move that number — which is why
 * a tab click behaves identically whether the scroll or the pointer asked for it,
 * and why there is no second code path to keep in step.
 *
 * ── Three branches, mutually exclusive ──────────────────────────────────────
 * The queries come from animations/pinnedSequence.ts, which owns them for every
 * pinned set-piece on the site:
 *
 *   PIN      — wide and tall enough: pin, and the `pin:` Tailwind variants trim
 *              the header so the carousel gets the rest of the viewport.
 *   UNPINNED — wide but too short to hold a pinned section without clipping its
 *              bottom: the same timeline, scrubbed against the section's own
 *              passage through the viewport instead.
 *   MOBILE   — under `lg`, and reduced motion at any size: nothing is
 *              scroll-driven. The tabs are the only way through, which they
 *              already are for a keyboard.
 *
 * ── The tabs are real buttons in every branch ───────────────────────────────
 * Including the pinned one, where the scroll is what normally drives them. A
 * `role="tab"` that cannot be activated is a lie to a keyboard and a
 * disappointment to a mouse, and there is a correct answer available: the pinned
 * ScrollTrigger knows the document positions where its range starts and ends, so
 * "show me tab 4" is a scroll to a computed fraction of that range. See
 * `settleProgress` and `scrollPageToY`.
 */

/* ── the timeline's shape, in abstract units ──────────────────────────────────
   Only their RATIO matters: the whole timeline is normalised onto the pin's
   scroll range, so making both numbers larger changes nothing. At 1:0.6 a
   screenshot is centred and still for about a third of its step and travelling
   for the rest, which reads as a deliberate move rather than a drift. */
const SLIDE = 1
const DWELL = 0.6

/* ── the carousel's geometry ──────────────────────────────────────────────────
   Every one of these is a proportion of a slide's own box rather than a pixel
   count, so the whole arrangement scales with the viewport and the non-overlap
   proof in the docblock holds at every size. See that proof before changing
   PITCH or SIDE_SCALE — they are the two that can make slides touch. */

/** Distance between adjacent slide centres, as a % of one slide's width. */
const PITCH = 96
/** How large a neighbour is next to the centred slide. */
const SIDE_SCALE = 0.72
/** How much lower a neighbour sits, as a % of one slide's height. */
const SIDE_DROP = 5
/** How faint a neighbour is. */
const SIDE_OPACITY = 0.32
/** How hard a neighbour is blurred, in px at full offset. */
const SIDE_BLUR = 14
/**
 * Blur is quantised to this many px before being written.
 *
 * Not fussiness: a changed blur radius forces the compositor to re-rasterise the
 * layer, and a scrubbed carousel would otherwise ask for a fresh radius on every
 * slide on every frame. Rounding to half-pixels turns a continuous ramp into ~20
 * distinct values, so most frames of a transition reuse the previous raster and
 * the ramp still looks continuous.
 */
const BLUR_STEP = 0.5
/** Past this offset a slide is fully transparent — it has left the frame. */
const FADE_OUT = 1.85

/**
 * The curve every APPEARANCE property follows against distance from the centre —
 * size, drop, fade and blur. Position does not: `x` stays linear in `d`, because
 * that is what keeps the spacing between slides even.
 *
 * Smoothstep rather than linear so an arriving slide comes into focus decisively
 * near the end of its travel instead of clearing up at a constant rate the whole
 * way — the difference between a slide that snaps into place and one that drifts.
 *
 * ── It must stay symmetric about (0.5, 0.5) ─────────────────────────────────
 * `ramp(x) + ramp(1 - x) === 1` for smoothstep, exactly as it does for a straight
 * line, and the non-overlap proof in the component docblock depends on it: the two
 * distances across a neighbouring pair always sum to 1, so a symmetric ramp leaves
 * `f(|d|) + f(|d+1|)` at the same constant it had when the ramp was linear. An
 * asymmetric curve — `power2.out`, say — would break that and let slides touch
 * partway through a transition. Any of smoothstep, sine or cubic-in-out is safe.
 */
const ramp = (a: number) => a * a * (3 - 2 * a)

/** Widest a single tab is allowed to get, so two tabs don't span the page. */
const MAX_TAB = 230
/** Narrowest a tab may be squeezed to before the strip starts scrolling. */
const MIN_TAB = 148

/** Total timeline length for `count` screenshots: a dwell, then a slide and a dwell each. */
const timelineUnits = (count: number) => DWELL + (count - 1) * (SLIDE + DWELL)

/**
 * Where in the timeline screenshot `i` is centred and still — the middle of its
 * dwell, as a 0..1 progress. This is what a tab click scrolls to.
 */
const settleProgress = (i: number, count: number) =>
  (i * (SLIDE + DWELL) + DWELL / 2) / timelineUnits(count)

export default function PortalShowcase({
  eyebrow,
  heading,
  intro,
  items,
  action,
}: PortalShowcaseProps) {
  const count = items.length
  const ids = useId()
  const tabId = (i: number) => `${ids}tab-${i}`
  const panelId = (i: number) => `${ids}panel-${i}`

  const sectionRef = useRef<HTMLElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const markerRef = useRef<HTMLSpanElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const [active, setActive] = useState(0)
  /** True while a ScrollTrigger owns the carousel. False under `lg` and reduced motion. */
  const [scrollDriven, setScrollDriven] = useState(false)
  /** Every screen is loaded once the section is near the viewport — see the note at the img. */
  const [warm, setWarm] = useState(false)

  /**
   * The carousel's position, as a continuous index: 0 is the first screenshot
   * centred, 2.5 is halfway between the third and the fourth. A plain mutable
   * object rather than state, because it changes on every scroll frame and
   * nothing in React needs to re-render when it does — `render` writes straight
   * to the DOM and only pushes `active` when the whole number changes.
   */
  const pos = useRef({ v: 0 })
  const activeRef = useRef(0)
  /* Read by the click handler, which must not be re-created on every branch
     change, and by nothing else. */
  const drivenRef = useRef(false)
  const triggerRef = useRef<globalThis.ScrollTrigger | null>(null)

  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const introRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.12 })
  const stageRef = useScrollReveal<HTMLDivElement>({ y: 36, delay: 0.1 })

  const current = items[active] ?? items[0]

  /**
   * Place every slide from `pos.current.v`, and move the rail marker with them.
   *
   * The only thing that writes to a slide, and it writes NOTHING ELSE — in
   * particular it does not publish `active`. That separation is load-bearing and
   * it cost a bug to learn: while this also derived `active` from the position, a
   * tab click set `active` first and then let a tween carry the position to
   * match, so the layout effect that runs on the click's own re-render found the
   * position still at the OLD value and dutifully reset `active` back to it. Every
   * click cancelled itself. Position is the source of truth while a scrub owns the
   * carousel and `active` is the source of truth while the tabs do; whichever one
   * is driving must not be overwritten by the other.
   *
   * Called from the timeline's `onUpdate` while a scrub owns the carousel, from a
   * tween when the tabs do, and once on mount.
   */
  const render = () => {
    const v = pos.current.v

    slideRefs.current.forEach((el, i) => {
      if (!el) return
      const d = i - v
      const a = ramp(Math.min(Math.abs(d), 1))
      const blur = Math.round((a * SIDE_BLUR) / BLUR_STEP) * BLUR_STEP

      gsap.set(el, {
        /* -50 is the horizontal centring the slide would otherwise want from a
           `-translate-x-1/2` class. It lives here because GSAP owns this
           element's transform outright, and two writers on one property is how a
           scrub ends up snapping back to a stale value. */
        xPercent: -50 + d * PITCH,
        yPercent: a * SIDE_DROP,
        scale: 1 - a * (1 - SIDE_SCALE),
        opacity: Math.abs(d) >= FADE_OUT ? 0 : 1 - a * (1 - SIDE_OPACITY),
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
        /* They never overlap, so this decides nothing visually. It is here so
           that a browser resolving a half-pixel seam mid-transition resolves it
           in favour of the slide nearer the middle. */
        zIndex: 100 - Math.round(Math.abs(d) * 10),
      })
    })

    if (markerRef.current) gsap.set(markerRef.current, { xPercent: v * 100 })
  }

  /**
   * Publish which screenshot is centred, from the position. Only the scroll-driven
   * branches call this — see the note above — and only when the whole number
   * changes, so the strip re-renders `count - 1` times across a pin rather than
   * once per scroll frame.
   */
  const reportFromPosition = () => {
    const next = Math.min(count - 1, Math.max(0, Math.round(pos.current.v)))
    if (next !== activeRef.current) {
      activeRef.current = next
      setActive(next)
    }
  }

  /* Lay the carousel out before the browser paints, so the first frame is the
     arrangement rather than `count` slides stacked in the middle. */
  useLayoutEffect(render)

  /* ── the scroll-driven branches ───────────────────────────────────────────
     useLayoutEffect, not useEffect. `pin: true` wraps the section in a
     `.pin-spacer` — a new parent between it and the one React put it in — and
     that has to be unwrapped BEFORE React removes the section on a route change.
     A useEffect cleanup is passive and runs after the nodes are already detached,
     so React threw `removeChild` mid-unmount and blanked the whole page. See the
     warning in animations/pinnedSequence.ts. */
  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || count < 2 || prefersReducedMotion) return

    const setDriven = (on: boolean) => {
      drivenRef.current = on
      setScrollDriven(on)
    }

    const build = (triggerVars: ScrollTrigger.Vars) => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        /* On the TIMELINE, not on the ScrollTrigger. With `scrub` the playhead is
           eased towards the scroll position on GSAP's own ticker, so it keeps
           moving on frames where the scroll did not — a ScrollTrigger `onUpdate`
           would miss exactly the frames that make the transition smooth. */
        onUpdate: () => {
          render()
          reportFromPosition()
        },
        scrollTrigger: { ...triggerVars, scrub: 0.35, invalidateOnRefresh: true },
      })

      // A beat with the first screenshot centred before anything moves.
      tl.to({}, { duration: DWELL })
      for (let i = 1; i < count; i++) {
        tl.to(pos.current, { v: i, duration: SLIDE })
        tl.to({}, { duration: DWELL })
      }

      triggerRef.current = tl.scrollTrigger ?? null
      return tl
    }

    const teardown = (tl: gsap.core.Timeline) => () => {
      setDriven(false)
      triggerRef.current = null
      tl.scrollTrigger?.kill()
      tl.kill()
    }

    const mm = gsap.matchMedia()

    mm.add(PIN_QUERY, () => {
      setDriven(true)
      const tl = build({
        trigger: section,
        start: 'top top',
        end: `+=${pinDistance(count)}`,
        pin: true,
        // Pre-applies the pin a frame early, which is what stops the one-frame
        // jump you otherwise get pinning at speed under Lenis.
        anticipatePin: 1,
      })
      return teardown(tl)
    })

    mm.add(UNPINNED_QUERY, () => {
      setDriven(true)
      const tl = build({ trigger: section, start: 'top bottom', end: 'bottom top' })
      return teardown(tl)
    })

    /* Nothing to build under lg — the tabs drive the carousel instead — but the
       branch is declared so the three queries visibly cover the whole range. An
       overlap would run two timelines over one carousel; a gap would run none. */
    mm.add(MOBILE_QUERY, () => undefined)

    return () => mm.revert()
  }, [count])

  /* ── the click-driven branch ──────────────────────────────────────────────
     The guard reads `drivenRef`, NOT the `scrollDriven` state beside it in the
     dependency list, and the difference is load-bearing. On mount the layout
     effect above runs first and calls `setDriven(true)`, which sets the ref
     synchronously but only QUEUES the state; this passive effect then runs in the
     same commit, while `scrollDriven` is still false. Reading the state here
     therefore ran the tween below exactly once on every mount — and because it
     carries `overwrite: true` on the same target the timeline tweens, it killed
     all of them, leaving a pinned section whose carousel never moved. The ref is
     true by the time this runs, so the branch is skipped. `scrollDriven` stays in
     the deps because a resize across a query still has to re-run this. */
  useEffect(() => {
    if (drivenRef.current) return
    if (prefersReducedMotion) {
      pos.current.v = active
      render()
      return
    }
    const tween = gsap.to(pos.current, {
      v: active,
      duration: 0.6,
      ease: 'power3.out',
      overwrite: true,
      onUpdate: render,
    })
    return () => {
      tween.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, scrollDriven])

  /* Keep the active tab in view when the strip is scrolling horizontally, which
     is what it does under `lg` with more than about two sections. The container
     is scrolled directly rather than through `scrollIntoView`, which would also
     scroll the PAGE and fight Lenis for it. */
  useEffect(() => {
    const strip = stripRef.current
    const tab = tabRefs.current[active]
    if (!strip || !tab || strip.scrollWidth <= strip.clientWidth) return
    strip.scrollTo({
      left: Math.max(0, tab.offsetLeft - (strip.clientWidth - tab.clientWidth) / 2),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }, [active])

  /* Every screenshot is fetched once the section is within 400px of the viewport.
     `loading="lazy"` cannot do this job by itself here: the screens that aren't
     centred are translated a full frame-width out of an `overflow-hidden` box, so
     the browser sees them as off-screen and defers them until the moment they
     move in — which is a blank frame arriving mid-transition. Flipping the
     attribute to `eager` on the approach starts the fetch while there is still
     scroll to spare. */
  useEffect(() => {
    const section = sectionRef.current
    if (!section || warm) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWarm(true)
          io.disconnect()
        }
      },
      { rootMargin: '400px 0px' },
    )
    io.observe(section)
    return () => io.disconnect()
  }, [warm])

  const selectTab = (i: number) => {
    const trigger = triggerRef.current
    if (drivenRef.current && trigger) {
      // Scroll to the point in the trigger's own range where screenshot `i` is
      // centred, and let the scrub take it there — rather than moving the
      // carousel ourselves and having the next scroll frame overwrite it.
      const { start, end } = trigger
      scrollPageToY(start + settleProgress(i, count) * (end - start))
      return
    }
    activeRef.current = i
    setActive(i)
  }

  const onTablistKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step =
      e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : e.key === 'Home' ? -count : e.key === 'End' ? count : 0
    if (!step) return
    e.preventDefault()
    const next = Math.min(count - 1, Math.max(0, active + step))
    selectTab(next)
    // preventScroll, or the browser scrolls the focused tab into view and Lenis
    // spends the next second arguing with it.
    tabRefs.current[next]?.focus({ preventScroll: true })
  }

  return (
    /* `pin:` = wide and tall enough for the section to pin itself
       (animations/pinnedSequence.ts owns the query, tailwind.config.js declares
       the variant). Pinned, the section becomes a viewport-tall flex column:
       header, then the carousel taking whatever is left, then the strip on the
       bottom edge. `pin:pt-28` rather than symmetric padding, for two reasons:
       the floating nav pill ends at y=94 and an eyebrow at the top of a pinned
       section would sit underneath it, and there is no bottom padding to balance
       against anyway — the strip IS the bottom. All of it is inert on a window
       too short to pin, where the section is a normal block and the carousel gets
       a fixed height. */
    <section
      ref={sectionRef}
      className="bg-[#CCD0D2] pt-24 sm:pt-28 pin:flex pin:h-screen pin:flex-col pin:overflow-hidden pin:pt-28"
    >
      {/* ── the centred copy block ──────────────────────────────────────────── */}
      <div className="px-6">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow && (
            <span className="inline-block rounded-full bg-navy-800/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-navy-800/70">
              {eyebrow}
            </span>
          )}
          <h2
            ref={headingRef}
            className={`text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px] pin:text-[32px] ${
              eyebrow ? 'mt-5 pin:mt-4' : ''
            }`}
          >
            {heading}
          </h2>
          {(intro || action) && (
            <div ref={introRef} className="opacity-0">
              {intro && (
                <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-navy-800/65 sm:text-[17px] pin:mt-2.5 pin:text-[15.5px]">
                  {intro}
                </p>
              )}
              {action && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 pin:mt-4">
                  {action}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── the carousel ────────────────────────────────────────────────────
          Full bleed and no horizontal padding, deliberately: the neighbouring
          slides are meant to be cut off by the edges of the window, and a gutter
          would leave them floating short of it. `overflow-hidden` is doing three
          jobs at once — cropping those neighbours at the sides, hiding the
          `CROP`px of every slide that runs behind the strip, and keeping the
          blurred haloes of slides that have left the frame off the page. */}
      <div
        ref={stageRef}
        className="relative h-[174px] overflow-hidden opacity-0 sm:h-[280px] lg:h-[400px] pin:mt-6 pin:h-auto pin:min-h-0 pin:flex-1"
      >
        {items.map((item, i) => (
          <div
            key={item.title}
            ref={(el) => (slideRefs.current[i] = el)}
            role="tabpanel"
            id={panelId(i)}
            aria-labelledby={tabId(i)}
            aria-hidden={i !== active}
            /* ── how a slide is sized, which is the fiddliest thing here ──────
               HEIGHT first, width from the aspect ratio. `100% + n` is the stage's
               height plus the strip's overlap, so a slide is always exactly `n`px
               taller than the box that clips it and the crop is constant while the
               picture scales with the viewport.

               The three values of `n` are paired with the three stage heights on
               the parent, and the pairs have to move together: 40px of crop on a
               174px stage makes a 214px-tall slide, which at 16:10 is 342px wide —
               just inside `max-w-[92vw]` on a 390px phone, so the ratio survives.
               Raise the crop without raising the stage and the width hits that cap
               instead, the explicit height wins, and the frame quietly squares up.

               `left-1/2` with no `-translate-x-1/2`: the centring is folded into
               `render`'s `xPercent`, because GSAP owns this transform outright. */
            className="corner-smooth absolute left-1/2 top-0 aspect-[16/10] h-[calc(100%+40px)] w-auto max-w-[92vw] overflow-hidden rounded-card border border-navy-800/[0.08] bg-navy-900 shadow-card sm:h-[calc(100%+64px)] lg:h-[calc(100%+88px)]"
          >
            <img
              src={item.screen}
              alt={`The Fortiva portal: ${item.title.toLowerCase()}`}
              loading={i === 0 || warm ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
              /* `object-top`: the aperture is wider than a screenshot's own ratio,
                 so something has to go, and the bottom of a portal page is the
                 part that matters least — see the export note in
                 assets/images.ts. */
              className="h-full w-full select-none object-cover object-top"
            />
          </div>
        ))}
      </div>

      {/* ── the strip ───────────────────────────────────────────────────────
          White on the section's grey, flush to its bottom edge, which is what
          makes it read as a bar the carousel is running behind rather than as a
          row of links that happen to be underneath it.

          This is why the section is one of the nine that KEEPS a grey plate now
          that the page is white (see tailwind.config.js): the strip is white and
          the carousel is navy, so both of them are drawn against the section
          rather than against the page. On white the strip would be white on
          white and only its top border would survive. */}
      <div className="shrink-0 border-t border-navy-800/10 bg-white">
        <div className="mx-auto max-w-container px-6">
          {/* The active section's own sentence. The reserved height is what stops a
              two-line sentence shunting the whole strip down as you scroll, and
              `key` is what replays the fade — remounting the paragraph is the
              cheapest honest way to restart a CSS animation. */}
          <p
            key={current.title}
            className="mx-auto min-h-[3.5rem] max-w-2xl animate-[fadeUp_400ms_ease-out] pt-5 text-center text-[15px] leading-relaxed text-navy-800/70 sm:min-h-[3rem] sm:text-[15.5px] pin:min-h-[2.5rem] pin:pt-3"
          >
            {current.body}
          </p>

          {/* ── the tablist ──────────────────────────────────────────────────
              One track holding the tabs and the marker rail, sized
              `clamp(count * MIN_TAB, 100%, count * MAX_TAB)` and centred.
              All three numbers earn their place:

                MAX_TAB stops a short list from spanning the page. Two tabs used
                  to take half the window each, which read as two headings with a
                  gap rather than as a pair of tabs; now they are a 460px group in
                  the middle, and six tabs still fill the width because six times
                  230 is wider than the container.
                MIN_TAB is the floor before the track overflows and the strip
                  scrolls sideways, which is what six tabs do on a phone.
                100% in the middle is what makes the common case — enough tabs to
                  fill the container — align with every other section on the page.

              The rail is inside the same track, so on a phone it scrolls with the
              tabs. A rail that stayed put while the tabs moved would point at the
              wrong one. */}
          <div
            ref={stripRef}
            className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div
              className="mx-auto"
              style={{ width: `clamp(${count * MIN_TAB}px, 100%, ${count * MAX_TAB}px)` }}
            >
              <div
                role="tablist"
                aria-label="Portal sections"
                onKeyDown={onTablistKeyDown}
                className="grid"
                style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
              >
                {items.map((item, i) => {
                  const Icon = item.icon
                  const on = i === active
                  return (
                    <button
                      key={item.title}
                      ref={(el) => (tabRefs.current[i] = el)}
                      type="button"
                      role="tab"
                      id={tabId(i)}
                      aria-selected={on}
                      aria-controls={panelId(i)}
                      /* Roving tabindex: the tablist is one tab stop and the arrow
                         keys move within it, which is what a screen-reader user
                         expects of `role="tablist"` and what saves a keyboard user
                         six presses to get past it. */
                      tabIndex={on ? 0 : -1}
                      onClick={() => selectTab(i)}
                      className="group flex flex-col items-start gap-3 pb-5 pr-4 pt-4 text-left pin:gap-2.5 pin:pb-3 pin:pt-3"
                    >
                      {/* The badge is the selected state, which is why the label
                          below it can stay one weight. Gold on navy is the same
                          icon treatment every card on this site uses, so a lit tab
                          reads as Fortiva rather than as a generic control. */}
                      <span
                        className={`corner-smooth flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] transition-colors duration-300 ${
                          on
                            ? 'bg-gold text-navy-800'
                            : 'bg-navy-800/[0.06] text-navy-800/40 group-hover:bg-navy-800/10 group-hover:text-navy-800/70'
                        }`}
                      >
                        <Icon size={17} strokeWidth={1.9} />
                      </span>
                      {/* `font-semibold` in BOTH states. Switching weight on
                          selection re-measured the label and could push a word onto
                          a second line, which moved every tab's height and the rail
                          with it — a tablist that reflows as you scroll past it.
                          Colour carries the state instead, and it costs no layout. */}
                      <span
                        className={`text-[14px] font-semibold leading-snug transition-colors duration-300 ${
                          on ? 'text-navy-800' : 'text-navy-800/45 group-hover:text-navy-800/75'
                        }`}
                      >
                        {item.title}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* One cell wide, moved a whole cell per screenshot — so it is a tab
                  underline and a progress bar at the same time, and it travels with
                  the carousel rather than jumping when the tab flips. Gold, because
                  gold is what progress is made of everywhere else on this site
                  (StepFlow's rail, ScrollSpyList's counter). */}
              <div className="relative h-[3px] overflow-hidden rounded-full bg-navy-800/10">
                <span
                  ref={markerRef}
                  aria-hidden="true"
                  style={{ width: `${100 / count}%` }}
                  className="absolute inset-y-0 left-0 block rounded-full bg-gold"
                />
              </div>
            </div>
          </div>

          <div className="h-5 pin:h-4" />
        </div>
      </div>
    </section>
  )
}
