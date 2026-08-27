import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../animations/gsap'
import {
  MOBILE_QUERY,
  PIN_QUERY,
  UNPINNED_QUERY,
  pinDistance,
  stepFromProgress,
} from '../animations/pinnedSequence'

/**
 * "Which item in this list am I on" for a sticky-column set-piece, as a single
 * index. Used by ScrollSpyList and PhoneShowcase.
 *
 * There are two ways it gets that index, and which one runs depends on whether
 * the section can be pinned. See animations/pinnedSequence.ts for the queries.
 *
 * ── Pinned (the normal desktop case) ────────────────────────────────────────
 * The section holds still at the top of the viewport while the scroll walks the
 * index from the first item to the last, then releases. Because the section is
 * exactly `100vh`, `start: 'top top'` is both "its top has arrived" and "all of
 * it is on screen", so nothing starts advancing before the visitor can see the
 * whole thing. Each item gets `PX_PER_STEP` of scroll — 600px, well past the
 * ~360px a flick travels — and since the section isn't moving, that dwell costs
 * page length and nothing else.
 *
 * ── Unpinned (a window too short to hold the section) ───────────────────────
 * Pinning an element taller than the viewport clips its bottom, so below the
 * height threshold the old behaviour runs instead: one trigger spanning the
 * section's own passage through the viewport (`top bottom` → `bottom top`) with
 * the index read off progress. That gives each item
 * `(sectionHeight + viewportHeight) / count` — measured at 1440x800, 525px per
 * panel for the three-panel list and 375-400px for the five-item app list.
 *
 * Both are the same shape: a progress from 0 to 1, floored into a step. The only
 * difference is what the progress is measured against.
 *
 * ── Why not a ScrollTrigger per item ────────────────────────────────────────
 * That was the original: each item got a band (`top 60%` → `bottom 40%`) and
 * reported `onToggle` when it became the one in the band. It was over-sensitive,
 * because overlapping bands meant the highlight advanced once per item PITCH —
 * 175-180px, half a flick, so one gesture skipped an item and sometimes two. And
 * it was asymmetric: scrolling back up, the item you were returning to had never
 * left its band, so no toggle fired and the highlight could stay on the item you
 * had just left. Down felt twitchy, up felt sticky.
 *
 * A progress-derived index has neither problem. It is a pure function of scroll
 * position, so up and down are identical and arriving from either direction (or
 * on a restored scroll position) is already correct without anything having had
 * to fire.
 *
 * ── `tracking` ─────────────────────────────────────────────────────────────
 * False under `lg` and under reduced motion, where there is nothing to follow.
 * Callers use it to light every item rather than leaving items 2..n permanently
 * dimmed with no way to reach them, which is what both components did before
 * while their docblocks claimed otherwise.
 *
 * `pinned` is exposed for the same kind of reason: a caller may need to know that
 * the section is currently a fixed, viewport-sized panel rather than a normal
 * block in the flow.
 */
export function useScrollSpyIndex(count: number) {
  const scopeRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [tracking, setTracking] = useState(false)
  const [pinned, setPinned] = useState(false)

  // Guards `setActive` so a scroll frame that doesn't change the index doesn't
  // ask React to re-render the list at all.
  const current = useRef(0)

  /* useLayoutEffect, not useEffect. `pin: true` below wraps the section in a
     `.pin-spacer` — a new parent between it and the one React put it in — and
     that has to be unwrapped BEFORE React removes the section on a route change.
     A `useEffect` cleanup is passive and runs after the nodes are already
     detached, so React threw `removeChild` mid-unmount and blanked the whole
     page. See the same note in components/FeatureReveal/FeatureReveal.tsx and
     the warning in animations/pinnedSequence.ts. */
  useLayoutEffect(() => {
    const el = scopeRef.current
    if (!el || count < 2 || prefersReducedMotion) return

    const report = (progress: number) => {
      const next = stepFromProgress(progress, count)
      if (next !== current.current) {
        current.current = next
        setActive(next)
      }
    }

    const mm = gsap.matchMedia()

    mm.add(PIN_QUERY, () => {
      setTracking(true)
      setPinned(true)

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: `+=${pinDistance(count)}`,
        pin: true,
        // `anticipatePin` pre-applies the pin a frame early, which is what stops
        // the one-frame jump you otherwise get pinning at speed under Lenis.
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => report(self.progress),
      })

      return () => {
        setPinned(false)
        setTracking(false)
        trigger.kill()
      }
    })

    mm.add(UNPINNED_QUERY, () => {
      setTracking(true)

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        invalidateOnRefresh: true,
        onUpdate: (self) => report(self.progress),
      })

      return () => {
        setTracking(false)
        trigger.kill()
      }
    })

    // Nothing to build under lg — `tracking` stays false and the caller lights
    // every item — but the branch is declared so the three queries visibly
    // cover the whole range.
    mm.add(MOBILE_QUERY, () => undefined)

    return () => mm.revert()
  }, [count])

  return { scopeRef, active, tracking, pinned }
}
