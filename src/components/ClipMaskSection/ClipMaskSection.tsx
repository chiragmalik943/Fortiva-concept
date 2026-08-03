import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../animations/gsap'
import { images } from '../../assets/images'

const stages = [
  { label: 'Your Family', image: images.forStageFamily },
  { label: 'Your Employees', image: images.forStageEmployees },
  { label: 'You', image: images.forStageYou },
]

const START_SCALE = 0.85
const MAX_SCALE = 14

type MaskStyle = React.CSSProperties & { '--mask-scale': number }

export default function ClipMaskSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const maskLayerRef = useRef<HTMLDivElement>(null)
  const imgRefs = useRef<(HTMLImageElement | null)[]>([])
  const textStackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion) {
      gsap.set(maskLayerRef.current, { '--mask-scale': MAX_SCALE })
      return
    }

    const ctx = gsap.context(() => {
      // NOTE: positions are on a deliberate 0-100 "percent of scroll" scale.
      // Every tween gets an EXPLICIT duration in that same unit system, and
      // a final no-op spacer tween pads the timeline out to exactly 100, so
      // position numbers map predictably to scroll percentage.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
          snap: {
            snapTo: [0, 0.24, 0.52, 0.80],
            duration: { min: 0.2, max: 0.6 },
            delay: 0.1,
            ease: 'power1.inOut',
          },
        },
        defaults: { ease: 'none' },
      })

      // Intro — the mask window grows; the photo behind it never moves or
      // resizes, only the SVG mask's effective size changes. Shorter now
      // than before since a bigger START_SCALE needs less growth to fill
      // the screen.
      tl.to(maskLayerRef.current, { '--mask-scale': MAX_SCALE, ease: 'power2.inOut', duration: 24 }, 0)

      // Stage 1 hold (24-44): "Your Family" sits, nothing animates.

      // Transition 1 (44-52): image + text change together.
      tl.to(imgRefs.current[1], { opacity: 1, duration: 8 }, 44)
      tl.to(textStackRef.current, { yPercent: -33.333, ease: 'power2.inOut', duration: 8 }, 44)

      // Stage 2 hold (52-72).

      // Transition 2 (72-80): image + text change together again.
      tl.to(imgRefs.current[2], { opacity: 1, duration: 8 }, 72)
      tl.to(textStackRef.current, { yPercent: -66.666, ease: 'power2.inOut', duration: 8 }, 72)

      // Stage 3 hold (80-100), then the pin ends and the page scrolls on naturally.
      tl.to({}, { duration: 20 }, 80)
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const maskStyle: MaskStyle = {
    '--mask-scale': START_SCALE,
    maskImage: `url(${images.forMask})`,
    maskRepeat: 'no-repeat',
    maskPosition: 'center',
    maskSize: 'calc(var(--mask-scale) * 100vw) auto',
    WebkitMaskImage: `url(${images.forMask})`,
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    WebkitMaskSize: 'calc(var(--mask-scale) * 100vw) auto',
  } as MaskStyle

  return (
    <section ref={sectionRef} className="relative bg-gold" style={{ height: '380vh' }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* one mask, one unit: F/O/R live entirely inside a single SVG file
            (public/for-mask.svg — swap that file for the real wordmark).
            The mask's SIZE is what animates; the photo underneath is a
            plain, never-transformed, never-resized object-cover image. */}
        <div ref={maskLayerRef} className="absolute inset-0" style={maskStyle}>
          {stages.map((stage, i) => (
            <img
              key={stage.label}
              ref={(el) => (imgRefs.current[i] = el)}
              src={stage.image}
              alt={i === 0 ? 'For your family, your employees, and you' : ''}
              aria-hidden={i === 0 ? undefined : true}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity: i === 0 ? 1 : 0 }}
            />
          ))}
          <div className="absolute inset-0 bg-navy-900/10" />
        </div>

        {/* label — always centred on the viewport, constant size, mask-wipes between stages */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
          <div
            className="relative overflow-hidden text-[7vw] font-bold leading-none text-white drop-shadow-sm sm:text-[4.5vw] lg:text-[2.75rem]"
            style={{ height: '1.3em' }}
          >
            <div ref={textStackRef} className="flex flex-col items-center text-center">
              {stages.map((stage) => (
                <div key={stage.label} className="flex items-center justify-center" style={{ height: '1.3em' }}>
                  {stage.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2 className="sr-only">For your family. For your employees. For you.</h2>
      </div>
    </section>
  )
}
