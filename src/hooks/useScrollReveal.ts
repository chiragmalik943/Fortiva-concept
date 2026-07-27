import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../animations/gsap'

interface Options {
  y?: number
  duration?: number
  delay?: number
  scale?: number
  rotate?: number
  start?: string
}

export function useScrollReveal<T extends HTMLElement>({
  y = 48,
  duration = 0.9,
  delay = 0,
  scale,
  rotate,
  start = 'top 85%',
}: Options = {}) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, y: 0, scale: 1, rotate: 0 })
      return
    }

    const fromVars: gsap.TweenVars = { opacity: 0, y }
    if (scale !== undefined) fromVars.scale = scale
    if (rotate !== undefined) fromVars.rotate = rotate

    const tween = gsap.fromTo(
      el,
      fromVars,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotate: 0,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start,
          once: true,
        },
      },
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ref
}
