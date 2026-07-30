import { useEffect, useRef } from 'react'
import { UserCheck, MapPin, ClipboardCheck, Headphones, type LucideIcon } from 'lucide-react'
import { gsap, prefersReducedMotion } from '../../animations/gsap'
import { useSplitReveal } from '../../hooks/useSplitReveal'
import { images } from '../../assets/images'

interface CardConfig {
  id: string
  kicker: string
  title: string
  body: string
  icon: LucideIcon
  bg: string
  fg: string
}

const CARDS: CardConfig[] = [
  {
    id: 'personalized',
    kicker: 'PERSONALIZED PLANS',
    title: 'Coverage built around you',
    body: 'A short conversation about your health, budget and goals is all it takes to find a plan that actually fits — not a generic, one-size-fits-all policy.',
    icon: UserCheck,
    bg: images.cardOneBg,
    fg: images.cardOne,
  },
  {
    id: 'network',
    kicker: 'NATIONWIDE NETWORK',
    title: 'Care wherever life takes you',
    body: 'Access thousands of trusted providers across the country, so a new city or a new job never means starting your coverage over.',
    icon: MapPin,
    bg: images.cardTwoBg,
    fg: images.cardTwo,
  },
  {
    id: 'claims',
    kicker: 'SIMPLE CLAIMS',
    title: 'Claims without the headache',
    body: 'Submit, track and resolve claims in minutes through a process built to be transparent from the very first step.',
    icon: ClipboardCheck,
    bg: images.cardThreeBg,
    fg: images.cardThree,
  },
  {
    id: 'support',
    kicker: 'ALWAYS-ON SUPPORT',
    title: 'Support that stays with you',
    body: 'Real advisors are a call away whenever your circumstances change, so your plan keeps up with your life.',
    icon: Headphones,
    bg: images.cardFourBg,
    fg: images.cardFour,
  },
]

// Slight, alternating starting rotations (deg) — cards 2 and 4 lean the
// opposite way from cards 1 and 3, all comfortably inside the -7..7 range.
const ROTATIONS = [-6, 5, -5, 6]

// How much bigger the layered photo is the instant a card arrives, before
// it settles down to its resting scale of 1. Calibrated against the
// reference screenshot: the entrance state overflows the top of the frame
// by ~26% of the frame's height, and a bottom-anchored scale of 1.25
// reproduces that almost exactly (overflow == scale - 1).
const ENTER_SCALE = 1.25

// NOTE: positions below are on a deliberate 0-100 "percent of scroll" scale,
// same convention as ClipMaskSection — every tween gets an explicit
// duration in that same unit system so the whole sequence is easy to retime.
const HOLD_START = 7 // H2 sits still and centered before anything moves
const CARD_SPAN = 22 // each card's full entrance, start to settled
const HOLD_END = 100 - HOLD_START - CARD_SPAN * CARDS.length // brief pause once stacked
const TOTAL_UNITS = HOLD_START + CARD_SPAN * CARDS.length + HOLD_END // == 100, kept explicit for clarity

// 5vh of real scroll per timeline unit — about 110vh per card, in the same
// ballpark as ValuesStack's ~117vh per reveal.
const SECTION_HEIGHT_VH = TOTAL_UNITS * 5

// Explicit per-corner classes so a responsive override never leaves a
// corner rounded that should be square: rounded-t-*/rounded-l-* etc. only
// ever touch the corners they name, they don't reset one another across
// breakpoints, so every corner is set at every breakpoint used here.
const CONTENT_CORNERS_A =
  'rounded-tl-none rounded-tr-none rounded-bl-card rounded-br-card sm:rounded-tl-card sm:rounded-tr-none sm:rounded-bl-card sm:rounded-br-none'
const CONTENT_CORNERS_B =
  'rounded-tl-none rounded-tr-none rounded-bl-card rounded-br-card sm:rounded-tl-none sm:rounded-tr-card sm:rounded-bl-none sm:rounded-br-card'
const VISUAL_CORNERS_A =
  'rounded-tl-card rounded-tr-card rounded-bl-none rounded-br-none sm:rounded-tl-none sm:rounded-tr-card sm:rounded-bl-none sm:rounded-br-card'
const VISUAL_CORNERS_B =
  'rounded-tl-card rounded-tr-card rounded-bl-none rounded-br-none sm:rounded-tl-card sm:rounded-tr-none sm:rounded-bl-card sm:rounded-br-none'

interface CardVisualProps {
  card: CardConfig
  reversed: boolean
  bgScaleRef?: (el: HTMLDivElement | null) => void
  fgScaleRef?: (el: HTMLDivElement | null) => void
}

// The layered bg/fg photo. Both images sit in the exact same spot at the
// exact same size, so the only thing that ever separates them is which one
// clips at the top edge. When ref setters are passed in (the animated,
// motion-enabled render path) the foreground gets the special clip-path
// that stays flush on three sides but leaves the top open, so it can break
// out of frame as its shared scale tween runs past 1. Without refs (the
// reduced-motion static render) there's nothing to scale — the frame is
// simply clipped on all four sides, since a resting scale of 1 never
// overflows in the first place.
function CardVisual({ card, reversed, bgScaleRef, fgScaleRef }: CardVisualProps) {
  const motionEnabled = Boolean(bgScaleRef && fgScaleRef)

  return (
    <div
      className={`relative aspect-[4/3] w-full sm:aspect-auto sm:h-full ${
        reversed ? 'order-1 sm:order-1' : 'order-1 sm:order-2'
      }`}
    >
      <div className={`corner-smooth relative h-full w-full ${reversed ? VISUAL_CORNERS_B : VISUAL_CORNERS_A} overflow-hidden`}>
        <div
          className={motionEnabled ? 'absolute inset-0 origin-bottom will-change-transform' : 'absolute inset-0'}
          ref={bgScaleRef}
        >
          <img src={card.bg} alt={card.title} className="h-full w-full object-cover object-bottom" />
        </div>
      </div>

      {motionEnabled ? (
        <div
          className={`stacked-card-fg-clip pointer-events-none absolute inset-0 ${
            reversed ? 'stacked-card-fg-clip--visual-left' : 'stacked-card-fg-clip--visual-right'
          }`}
        >
          <div className="absolute inset-0 origin-bottom will-change-transform" ref={fgScaleRef}>
            <img src={card.fg} alt="" aria-hidden="true" className="h-full w-full object-cover object-bottom" />
          </div>
        </div>
      ) : (
        <div
          className={`corner-smooth pointer-events-none absolute inset-0 ${
            reversed ? VISUAL_CORNERS_B : VISUAL_CORNERS_A
          } overflow-hidden`}
        >
          <img src={card.fg} alt="" aria-hidden="true" className="h-full w-full object-cover object-bottom" />
        </div>
      )}
    </div>
  )
}

interface CardBodyProps {
  card: CardConfig
  reversed: boolean
  bgScaleRef?: (el: HTMLDivElement | null) => void
  fgScaleRef?: (el: HTMLDivElement | null) => void
}

function CardBody({ card, reversed, bgScaleRef, fgScaleRef }: CardBodyProps) {
  const Icon = card.icon
  return (
    <div className="relative grid grid-cols-1 shadow-card sm:grid-cols-2 sm:h-[64vh] sm:max-h-[580px] sm:min-h-[440px]">
      <div
        className={`corner-smooth relative flex flex-col justify-center gap-4 bg-cream-soft px-8 py-10 sm:px-10 sm:py-12 lg:px-14 ${
          reversed ? 'order-2 sm:order-2' : 'order-2 sm:order-1'
        } ${reversed ? CONTENT_CORNERS_B : CONTENT_CORNERS_A}`}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold">
          <Icon size={20} className="text-navy-800" strokeWidth={1.75} />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/50">{card.kicker}</p>
          <h3 className="mt-3 text-[22px] font-semibold leading-snug text-navy-800 sm:text-[26px]">{card.title}</h3>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-navy-800/60">{card.body}</p>
        </div>
      </div>

      <CardVisual card={card} reversed={reversed} bgScaleRef={bgScaleRef} fgScaleRef={fgScaleRef} />
    </div>
  )
}

export default function StackedCards() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingWrapRef = useRef<HTMLDivElement>(null)
  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const bgScaleRefs = useRef<(HTMLDivElement | null)[]>([])
  const fgScaleRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      const cards = cardRefs.current
      const bgLayers = bgScaleRefs.current
      const fgLayers = fgScaleRefs.current

      cards.forEach((card, i) => {
        // A vh-based offset (not yPercent) so the card fully clears the
        // viewport regardless of its own height — CardBody's height is
        // clamped to a fixed px range (sm:max-h-[580px]), so on a tall
        // screen it can be a much smaller fraction of the viewport than
        // 64vh, and yPercent's "130% of the card's own size" would then
        // fall short of 100vh, leaving the card peeking up from the bottom.
        gsap.set(card, { y: '130vh', rotate: ROTATIONS[i] })
      })
      gsap.set([...bgLayers, ...fgLayers], { scale: ENTER_SCALE })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
        },
      })

      // H2 dissolves as card 1 closes in, timed to finish exactly as the
      // card lands so it reads as the card covering the heading.
      tl.to(headingWrapRef.current, { autoAlpha: 0, duration: CARD_SPAN, ease: 'power1.inOut' }, HOLD_START)

      cards.forEach((card, i) => {
        const start = HOLD_START + i * CARD_SPAN
        tl.to(card, { y: 0, rotate: 0, duration: CARD_SPAN, ease: 'power2.out' }, start)
        tl.to([bgLayers[i], fgLayers[i]], { scale: 1, duration: CARD_SPAN, ease: 'power2.out' }, start)
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  if (prefersReducedMotion) {
    return (
      <section className="bg-cream px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-container">
          <h2 className="mx-auto max-w-2xl text-balance text-center text-[30px] font-semibold leading-tight text-navy-800 sm:text-[38px]">
            Coverage designed around <span className="text-gold">your life</span>
          </h2>
          <div className="mt-14 flex flex-col gap-10">
            {CARDS.map((card, i) => (
              <CardBody key={card.id} card={card} reversed={i % 2 === 1} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="relative bg-cream" style={{ height: `${SECTION_HEIGHT_VH}vh` }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-4 sm:px-6">
        <div ref={headingWrapRef} className="absolute inset-0 z-0 flex items-center justify-center px-6">
          <h2
            ref={headingRef}
            className="max-w-2xl text-balance text-center text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px]"
          >
            Coverage designed around <span className="text-gold">your life</span>
          </h2>
        </div>

        {CARDS.map((card, i) => (
          <div
            key={card.id}
            className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 sm:px-6"
            style={{ zIndex: i + 1 }}
          >
            <div ref={(el) => (cardRefs.current[i] = el)} className="pointer-events-auto w-full max-w-container will-change-transform">
              <CardBody
                card={card}
                reversed={i % 2 === 1}
                bgScaleRef={(el) => (bgScaleRefs.current[i] = el)}
                fgScaleRef={(el) => (fgScaleRefs.current[i] = el)}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
