import { ReactNode, useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../../animations/gsap'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'

export interface Step {
  title: string
  body: string
}

interface StepFlowProps {
  eyebrow?: string
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
 * The fill is a GSAP scrub (continuous, 60fps, no React involved) but the dots
 * are React state, and the state only ever holds an integer: how many dots the
 * fill has passed. `onUpdate` fires on every scroll frame, so it derives that
 * integer and returns the previous value unchanged when it hasn't moved, which
 * makes React bail out of the re-render. A four-step flow therefore re-renders
 * four times across its whole scroll range instead of a few hundred.
 *
 * Mobile drops the rail entirely rather than rotating it: a vertical rail has to
 * thread between items whose heights vary with their copy, which means measuring
 * them, and the numbers already carry the sequence on a narrow screen.
 */
export default function StepFlow({
  eyebrow,
  heading,
  intro,
  steps,
  action,
  surface = 'white',
}: StepFlowProps) {
  const s = SURFACES[surface]
  const railRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const [reached, setReached] = useState(0)

  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const introRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.12 })

  useEffect(() => {
    if (prefersReducedMotion) {
      setReached(steps.length)
      gsap.set(fillRef.current, { scaleX: 1 })
      return
    }

    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      gsap.fromTo(
        fillRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: railRef.current,
            start: 'top 78%',
            end: 'top 32%',
            scrub: 0.4,
            onUpdate: (self) => {
              const next = Math.min(steps.length, Math.ceil(self.progress * steps.length))
              setReached((prev) => (prev === next ? prev : next))
            },
          },
        },
      )
    })

    // No rail below lg, so every dot is simply lit.
    mm.add('(max-width: 1023.98px)', () => {
      setReached(steps.length)
    })

    return () => mm.revert()
  }, [steps.length])

  return (
    <section className={`px-6 py-24 sm:py-28 ${s.section}`}>
      <div className="mx-auto max-w-container">
        {eyebrow && (
          <span className="inline-block rounded-full bg-navy-800/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-navy-800/70">
            {eyebrow}
          </span>
        )}
        <h2
          ref={headingRef}
          className={`max-w-2xl text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px] ${
            eyebrow ? 'mt-5' : ''
          }`}
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

        <div ref={railRef} className="relative mt-16">
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

        {action && <div className="mt-14 flex flex-wrap gap-3">{action}</div>}
      </div>
    </section>
  )
}
