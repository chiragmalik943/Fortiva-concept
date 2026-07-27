import { useEffect, useRef } from 'react'
import SplitType from 'split-type'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../animations/gsap'

interface Options {
  /** split by characters (punchy, for short headings) or words (softer, for longer copy) */
  type?: 'chars' | 'words'
  /** animate immediately on mount instead of waiting for scroll (use for above-the-fold text) */
  immediate?: boolean
  delay?: number
  stagger?: number
}

export function useSplitReveal<T extends HTMLElement>({
  type = 'chars',
  immediate = false,
  delay = 0,
  stagger,
}: Options = {}) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1 })
      return
    }

    const split = new SplitType(el, {
      types: type === 'chars' ? 'chars,words' : 'words',
      tagName: 'span',
    })
    const targets = type === 'chars' ? split.chars : split.words
    if (!targets || targets.length === 0) return

    gsap.set(targets, { yPercent: 110, opacity: 0 })
    gsap.set(el, { opacity: 1 })

    const tween = gsap.to(targets, {
      yPercent: 0,
      opacity: 1,
      duration: type === 'chars' ? 0.75 : 0.9,
      ease: 'power3.out',
      stagger: stagger ?? (type === 'chars' ? 0.018 : 0.07),
      delay,
      scrollTrigger: immediate
        ? undefined
        : {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      split.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ref
}
