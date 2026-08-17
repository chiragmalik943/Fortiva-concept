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
 * Smooth-scroll to an in-page target.
 *
 * A plain `href="#id"` cannot be used for this while Lenis is running: the
 * browser sets the real scroll position, Lenis overwrites it from its own
 * animated value on the next frame, and the page springs back. Lenis has to be
 * asked. The default offset clears the fixed nav pill, which is ~96px tall
 * including its top margin, so a jumped-to heading isn't hidden underneath it.
 *
 * Falls back to `scrollIntoView` when Lenis isn't running, which is the
 * reduced-motion case — where `scroll-behavior: auto` makes it an instant jump.
 */
export function scrollPageTo(target: string | HTMLElement, offset = -96) {
  if (instance) {
    instance.scrollTo(target, { offset, duration: 0.9 })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  el?.scrollIntoView({ block: 'start' })
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
