import { useEffect, useRef } from 'react'
import { Users, Heart, ShieldCheck, Award, type LucideIcon } from 'lucide-react'
import { gsap, prefersReducedMotion } from '../../animations/gsap'
import { useSplitReveal } from '../../hooks/useSplitReveal'

interface ValueCard {
  title: string
  body: string
  icon: LucideIcon
}

const values: ValueCard[] = [
  {
    title: 'Integrity',
    body: 'We uphold the highest ethical standards in every interaction, ensuring transparency and trust.',
    icon: Users,
  },
  {
    title: 'Client Focus',
    body: 'Every plan starts with listening. We shape coverage around your life, not the other way around.',
    icon: Heart,
  },
  {
    title: 'Risk Resilience',
    body: "We plan for what's ahead so you're protected through every stage of life's uncertainty.",
    icon: ShieldCheck,
  },
  {
    title: 'Expertise',
    body: 'Decades of combined experience mean straightforward advice you can actually rely on.',
    icon: Award,
  },
]

// straightened resting offsets for each card in the stack — no rotation
// and no horizontal drift, just an even downward step per card so the
// one underneath always shows a slice of itself above the new arrival
const PEEK = 24 // px each successive card sits lower than the one before it
const rest = [
  { x: 0, y: 0 * PEEK, rotate: 0 },
  { x: 0, y: 1 * PEEK, rotate: 0 },
  { x: 0, y: 2 * PEEK, rotate: 0 },
  { x: 0, y: 3 * PEEK, rotate: 0 },
]

// how much darker (navy overlay opacity) a card gets per card stacked on top of it
const DARK_STEP = 0.04

export default function ValuesStack() {
  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const outerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (prefersReducedMotion) {
      cardRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.set(el, { x: rest[i].x, y: rest[i].y, rotate: rest[i].rotate, opacity: 1 })
        // settled state: card i has (3 - i) cards above it
        gsap.set(overlayRefs.current[i], { opacity: (3 - i) * DARK_STEP })
      })
      return
    }

    const ctx = gsap.context(() => {
      // card 0 sits in place from the start, no darkening yet
      gsap.set(cardRefs.current[0], { x: rest[0].x, y: rest[0].y, rotate: rest[0].rotate })
      gsap.set(overlayRefs.current[0], { opacity: 0 })
      // cards 1-3 start below the viewport, flat, undarkened
      for (let i = 1; i < 4; i++) {
        gsap.set(cardRefs.current[i], { x: rest[i].x, y: '70vh', rotate: 0 })
        gsap.set(overlayRefs.current[i], { opacity: 0 })
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
        },
      })

      for (let i = 1; i < 4; i++) {
        const segmentStart = i - 1

        // reveal card i
        tl.to(
          cardRefs.current[i],
          { y: rest[i].y, rotate: rest[i].rotate, ease: 'power2.out', duration: 1 },
          segmentStart,
        )

        // every earlier card now has one more card stacked on top of it —
        // darken each proportionally to how many cards are now above it
        for (let j = 0; j < i; j++) {
          const cardsAbove = i - j
          tl.to(
            overlayRefs.current[j],
            { opacity: cardsAbove * DARK_STEP, ease: 'power2.out', duration: 1 },
            segmentStart,
          )
        }
      }
    }, outerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={outerRef} className="relative bg-cream" style={{ height: '350vh' }}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        <div className="mb-16 text-center">
          <span className="inline-block rounded-full bg-navy-800/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-navy-800/70">
            OUR VALUES
          </span>
          <h2
            ref={headingRef}
            className="mt-5 text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px]"
          >
            Delivering Clarity,
            <br />
            Choice and Confidence
          </h2>
        </div>

        <div className="relative h-[300px] w-full max-w-[600px]">
          {values.map((value, i) => {
            const Icon = value.icon
            return (
              <div
                key={value.title}
                ref={(el) => (cardRefs.current[i] = el)}
                className="corner-smooth absolute inset-x-6 top-0 overflow-hidden rounded-3xl bg-cream-soft p-8 shadow-card sm:inset-x-10"
                style={{ zIndex: i + 1 }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold">
                  <Icon size={20} className="text-navy-800" strokeWidth={1.75} />
                </div>
                <h3 className="mt-5 font-serif text-2xl italic text-navy-800">{value.title}</h3>
                <p className="mt-3 max-w-sm text-[14.5px] leading-relaxed text-navy-800/55">
                  {value.body}
                </p>

                <div
                  ref={(el) => (overlayRefs.current[i] = el)}
                  className="pointer-events-none absolute inset-0 bg-navy-900"
                  style={{ opacity: 0 }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
