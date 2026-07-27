import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../animations/gsap'
import { images } from '../../assets/images'

export default function HeroImage() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (prefersReducedMotion) {
      gsap.set(wrapRef.current, { scale: 0.85, borderRadius: '2rem' })
      return
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapRef.current,
        { scale: 0.72, borderRadius: '2.75rem' },
        {
          scale: 1,
          borderRadius: '0rem',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'bottom 25%',
            scrub: 0.6,
          },
        },
      )

      // subtle parallax drift on the photo itself, independent of the scale
      gsap.fromTo(
        imgRef.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} className="relative w-full">
      <div
        ref={wrapRef}
        className="relative mx-auto aspect-[16/10] w-screen origin-center overflow-hidden sm:aspect-[16/8]"
      >
        <img
          ref={imgRef}
          src={images.hero}
          alt="Fortiva health insurance — powered by innovation, guided by humanity"
          className="h-[130%] w-full -translate-y-[15%] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/15 via-transparent to-transparent" />
      </div>
    </div>
  )
}
