import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../animations/gsap'

/**
 * The single live Lenis instance, kept at module scope so non-React callers
 * (the mobile nav) can pause the smoothed scroll without threading a ref or a
 * context through the tree for one interaction.
 */
let instance: Lenis | null = null

/**
 * Freeze page scrolling behind an overlay (the mobile nav panel).
 *
 * Lenis owns the scroll position, so `overflow: hidden` on its own does nothing
 * — the instance has to be told to stop. When Lenis isn't running at all
 * (reduced-motion short-circuits `useLenis`), fall back to the plain body lock
 * so the behaviour is identical either way.
 */
export function lockPageScroll() {
  if (instance) instance.stop()
  else document.body.style.overflow = 'hidden'
}

export function unlockPageScroll() {
  if (instance) instance.start()
  else document.body.style.overflow = ''
}

/**
 * Jump to the top with no smoothing — for route changes, where easing the
 * scroll would drag the visitor back up through the page they just left.
 *
 * Lenis owns the scroll position while it's running, so `window.scrollTo` on
 * its own gets overwritten on the instance's next frame; it has to be told.
 */
export function scrollPageToTop() {
  if (instance) instance.scrollTo(0, { immediate: true })
  else window.scrollTo(0, 0)
}

/**
 * How much clearance a jumped-to element gets at the top of the viewport. The
 * fixed nav pill is ~96px tall including its top margin, so anything less hides
 * the heading you just navigated to underneath it.
 *
 * Exported because a scroll-spy has to know it: "which section am I reading" is
 * measured against a line further down the viewport, and that line has to sit
 * BELOW where a jump lands, or a section you just jumped to reads as not-yet-
 * reached. Two numbers that must agree, so there is only one of them.
 */
export const NAV_OFFSET = 96

/**
 * Smooth-scroll to an in-page target.
 *
 * A plain `href="#id"` cannot be used for this while Lenis is running: the
 * browser sets the real scroll position, Lenis overwrites it from its own
 * animated value on the next frame, and the page springs back. Lenis has to be
 * asked.
 *
 * ── Why this resolves the element itself instead of handing Lenis a selector ──
 * It used to call `instance.scrollTo(target, { offset: -96 })` and let Lenis find
 * the element. Two things went wrong with that, both of them silently.
 *
 * 1. DOUBLE OFFSET. Lenis honours the target's own `scroll-margin-top`, and every
 *    jump target on this site carries `scroll-mt-32` (128px) so that native anchor
 *    jumps and find-in-page clear the nav too. Lenis subtracted that 128 and then
 *    subtracted our 96 on top, landing every heading 224px down the viewport
 *    instead of 96 — far enough that a scroll-spy reading the upper third of the
 *    screen still reported the PREVIOUS section as current.
 * 2. STALE TARGET. Resolving a selector to a scroll position inside Lenis measured
 *    something other than the element's live document offset: a jump from the top
 *    of the FAQs page to the fourth group stopped ~1080px short, and clicking the
 *    same link a second time (from the new position) went to the right place. A
 *    navigation that only works on the second attempt is worse than one that
 *    doesn't work at all.
 *
 * Computing `getBoundingClientRect().top + scrollY - NAV_OFFSET` here is immune to
 * both: it is the element's true position at the moment of the click, in absolute
 * document coordinates, with the clearance applied exactly once. Lenis is then
 * only asked to animate to a number, which is the one thing it cannot
 * misinterpret. `scroll-mt-32` stays in the markup for the native paths — this
 * function simply no longer depends on it.
 *
 * Falls back to an instant `window.scrollTo` when Lenis isn't running, which is
 * the reduced-motion case — and lands on the same pixel, where the old
 * `scrollIntoView` fallback landed 32px lower than the smooth path.
 */
export function scrollPageTo(target: string | HTMLElement, offset = NAV_OFFSET) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (!el) return

  const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset)

  if (instance) instance.scrollTo(y, { duration: 0.9 })
  else window.scrollTo(0, y)
}

/**
 * Boots a single Lenis instance for the whole app and syncs it with
 * GSAP's ticker + ScrollTrigger so every scroll-driven animation stays
 * perfectly in step with the smoothed scroll position.
 */
export function useLenis() {
  useEffect(() => {
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    })
    instance = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      instance = null
      // If the nav unmounted mid-lock, make sure the fallback lock can't
      // outlive it and leave the page permanently frozen.
      document.body.style.overflow = ''
    }
  }, [])
}
