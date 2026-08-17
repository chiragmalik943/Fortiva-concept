import { ReactNode, useEffect, useRef, useState } from 'react'
import { type LucideIcon } from 'lucide-react'
import { ScrollTrigger, prefersReducedMotion } from '../../animations/gsap'
import { images } from '../../assets/images'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'

/** Which abstract screen a feature draws. One per feature, no repeats. */
export type ScreenShape = 'card' | 'map' | 'chart' | 'id' | 'chat'

export interface AppFeature {
  title: string
  body: string
  icon: LucideIcon
  shape: ScreenShape
}

interface PhoneShowcaseProps {
  eyebrow?: string
  heading: ReactNode
  intro?: ReactNode
  features: AppFeature[]
  action?: ReactNode
}

/**
 * A phone that stays put while the feature list scrolls past it, changing screen
 * to match whichever feature is being read.
 *
 * ── The screens are abstract on purpose ──────────────────────────────────────
 * Not one of them contains a number, a name, a balance or a claim status. A
 * mockup that showed "$1,240 remaining" or "Claim #48213 — approved" would be
 * inventing member data on a page whose entire subject is what the app shows
 * you, and a reviewer would have to work out which parts of the screenshot were
 * real product decisions and which were filler. So each screen is built from
 * blocks, bars and pins in the brand palette: it communicates the SHAPE of the
 * screen — a summary card, a map, a bar chart, an ID card, a conversation —
 * without asserting anything about its contents.
 *
 * Five features, five different shapes, so scrolling the list visibly changes
 * the phone rather than swapping one grey rectangle for another.
 *
 * The tracking is the same discrete pattern as ScrollSpyList: one ScrollTrigger
 * per feature reporting when it's the one in the reading band, and a single index
 * in state. Under `lg` there is nothing to track — the phone sits above the list
 * showing the first screen, because a sticky phone on a 390px viewport would
 * leave no room for the list it exists to illustrate.
 */
export default function PhoneShowcase({
  eyebrow,
  heading,
  intro,
  features,
  action,
}: PhoneShowcaseProps) {
  const [active, setActive] = useState(0)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const introRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.12 })
  const phoneRef = useScrollReveal<HTMLDivElement>({ y: 40, scale: 0.96 })

  useEffect(() => {
    if (!window.matchMedia('(min-width: 1024px)').matches) return

    const triggers = itemRefs.current.map((el, i) =>
      el
        ? ScrollTrigger.create({
            trigger: el,
            start: 'top 60%',
            end: 'bottom 40%',
            onToggle: (self) => {
              if (self.isActive) setActive(i)
            },
          })
        : null,
    )
    return () => triggers.forEach((t) => t?.kill())
  }, [features.length])

  return (
    <section className="bg-cream-soft px-6 py-24 sm:py-28">
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

        <div className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          {/* ── the phone ──────────────────────────────────────────────── */}
          <div
            ref={phoneRef}
            className="flex justify-center opacity-0 lg:sticky lg:top-28 lg:self-start"
          >
            <Phone features={features} active={active} />
          </div>

          {/* ── the list that drives it ────────────────────────────────── */}
          <ul className="flex flex-col gap-3">
            {features.map((feature, i) => {
              const Icon = feature.icon
              const lit = prefersReducedMotion || i === active
              return (
                <li
                  key={feature.title}
                  ref={(el) => (itemRefs.current[i] = el)}
                  className={`corner-smooth rounded-card border p-6 transition-all duration-500 sm:p-8 ${
                    lit
                      ? 'border-navy-800/10 bg-white shadow-card-soft'
                      : 'border-transparent bg-white/40 lg:opacity-65'
                  }`}
                >
                  <div className="flex items-start gap-5">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-500 ${
                        lit ? 'bg-gold' : 'bg-navy-800/8'
                      }`}
                    >
                      <Icon
                        size={20}
                        strokeWidth={1.75}
                        className={lit ? 'text-navy-800' : 'text-navy-800/45'}
                      />
                    </span>
                    <div>
                      <h3 className="text-[18px] font-semibold leading-snug text-navy-800 sm:text-[20px]">
                        {feature.title}
                      </h3>
                      <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-navy-800/65">
                        {feature.body}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {action && <div className="mt-16 flex flex-wrap gap-3">{action}</div>}
      </div>
    </section>
  )
}

/* ── the device ────────────────────────────────────────────────────────────── */

function Phone({ features, active }: { features: AppFeature[]; active: number }) {
  return (
    <div className="relative w-[272px] shrink-0 sm:w-[300px]">
      {/* Body, bezel, then the screen. Three nested radii rather than one, so the
          bezel reads as a real thickness instead of a border. */}
      <div className="relative aspect-[9/19] rounded-[42px] bg-navy-900 p-[10px] shadow-card">
        <div className="relative h-full w-full overflow-hidden rounded-[34px] bg-cream-soft">
          {/* status bar */}
          <div className="flex items-center justify-between px-5 pt-4">
            <span className="h-1.5 w-8 rounded-full bg-navy-800/20" />
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-navy-800/20" />
              <span className="h-1.5 w-1.5 rounded-full bg-navy-800/20" />
              <span className="h-1.5 w-4 rounded-full bg-navy-800/20" />
            </span>
          </div>

          {/* app bar */}
          <div className="mt-4 flex items-center justify-between px-5">
            <img src={images.icon} alt="" aria-hidden="true" className="h-6 w-auto" />
            <span className="h-7 w-7 rounded-full bg-navy-800/8" />
          </div>

          {/* Every screen is mounted and cross-faded, so switching costs an
              opacity change rather than a remount — and nothing reflows. */}
          <div className="relative mt-5 h-[calc(100%-108px)]">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                aria-hidden={i !== active}
                className={`absolute inset-0 px-5 transition-all duration-500 ease-out ${
                  i === active ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
                }`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-navy-800/40">
                  {feature.title}
                </p>
                <div className="mt-3">
                  <ScreenBody shape={feature.shape} />
                </div>
              </div>
            ))}
          </div>

          {/* tab bar */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around border-t border-navy-800/8 bg-white/70 px-6 py-3.5">
            <span className="h-2 w-8 rounded-full bg-gold" />
            <span className="h-2 w-6 rounded-full bg-navy-800/12" />
            <span className="h-2 w-6 rounded-full bg-navy-800/12" />
            <span className="h-2 w-6 rounded-full bg-navy-800/12" />
          </div>
        </div>
      </div>
    </div>
  )
}

const bar = (w: string, tone = 'bg-navy-800/10') => (
  <span className={`block h-2 rounded-full ${tone}`} style={{ width: w }} />
)

function ScreenBody({ shape }: { shape: ScreenShape }) {
  if (shape === 'card') {
    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl bg-navy-800 p-4">
          <span className="block h-2 w-16 rounded-full bg-white/30" />
          <span className="mt-3 block h-3.5 w-28 rounded-full bg-gold" />
          <span className="mt-2.5 block h-2 w-20 rounded-full bg-white/20" />
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl bg-white p-3">
            <span className="h-7 w-7 shrink-0 rounded-lg bg-cream" />
            <span className="flex flex-1 flex-col gap-1.5">
              {bar('70%')}
              {bar('45%', 'bg-navy-800/6')}
            </span>
          </div>
        ))}
      </div>
    )
  }

  if (shape === 'map') {
    return (
      <div className="relative h-[210px] overflow-hidden rounded-2xl bg-white">
        {/* street grid */}
        <div className="absolute inset-0">
          {[18, 42, 66, 88].map((t) => (
            <span key={t} className="absolute left-0 right-0 h-px bg-navy-800/8" style={{ top: `${t}%` }} />
          ))}
          {[20, 48, 74].map((l) => (
            <span key={l} className="absolute bottom-0 top-0 w-px bg-navy-800/8" style={{ left: `${l}%` }} />
          ))}
        </div>
        {[
          { top: '24%', left: '30%', gold: true },
          { top: '52%', left: '62%', gold: false },
          { top: '70%', left: '22%', gold: false },
        ].map((pin) => (
          <span
            key={`${pin.top}${pin.left}`}
            className={`absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ${
              pin.gold ? 'bg-gold ring-gold/25' : 'bg-navy-800 ring-navy-800/12'
            }`}
            style={{ top: pin.top, left: pin.left }}
          />
        ))}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 rounded-xl bg-cream-soft p-3">
          <span className="h-7 w-7 shrink-0 rounded-full bg-gold" />
          <span className="flex flex-1 flex-col gap-1.5">
            {bar('60%')}
            {bar('38%', 'bg-navy-800/6')}
          </span>
        </div>
      </div>
    )
  }

  if (shape === 'chart') {
    const heights = [38, 62, 46, 80, 55, 70]
    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl bg-white p-4">
          <span className="block h-2 w-20 rounded-full bg-navy-800/10" />
          <div className="mt-5 flex h-[104px] items-end gap-2.5">
            {heights.map((h, i) => (
              <span
                key={i}
                className={`flex-1 rounded-t-md ${i === 3 ? 'bg-gold' : 'bg-navy-800/12'}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center justify-between rounded-xl bg-white p-3">
            <span className="flex flex-col gap-1.5">
              {bar('56px')}
              {bar('34px', 'bg-navy-800/6')}
            </span>
            <span className="h-2 w-10 rounded-full bg-navy-800/12" />
          </div>
        ))}
      </div>
    )
  }

  if (shape === 'id') {
    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl bg-gold p-4">
          <span className="block h-2 w-14 rounded-full bg-navy-800/25" />
          <span className="mt-4 block h-3 w-32 rounded-full bg-navy-800/70" />
          <div className="mt-4 flex items-end justify-between">
            <span className="flex flex-col gap-1.5">
              <span className="block h-2 w-20 rounded-full bg-navy-800/25" />
              <span className="block h-2 w-14 rounded-full bg-navy-800/25" />
            </span>
            {/* stand-in for the scannable code, not a real one */}
            <span className="grid h-10 w-10 grid-cols-3 grid-rows-3 gap-0.5">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className={i % 3 === 1 ? 'bg-navy-800/20' : 'bg-navy-800/70'} />
              ))}
            </span>
          </div>
        </div>
        <div className="rounded-xl bg-white p-3">
          <span className="block h-2 w-24 rounded-full bg-navy-800/10" />
          <span className="mt-2.5 block h-2 w-16 rounded-full bg-navy-800/6" />
        </div>
      </div>
    )
  }

  // chat
  return (
    <div className="flex flex-col gap-2.5">
      <div className="max-w-[78%] rounded-2xl rounded-tl-md bg-white p-3.5">
        <span className="block h-2 w-full rounded-full bg-navy-800/10" />
        <span className="mt-2 block h-2 w-2/3 rounded-full bg-navy-800/10" />
      </div>
      <div className="ml-auto max-w-[70%] rounded-2xl rounded-tr-md bg-navy-800 p-3.5">
        <span className="block h-2 w-full rounded-full bg-white/25" />
        <span className="mt-2 block h-2 w-1/2 rounded-full bg-white/25" />
      </div>
      <div className="max-w-[62%] rounded-2xl rounded-tl-md bg-white p-3.5">
        <span className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-gold" />
          <span className="h-2 w-2 rounded-full bg-navy-800/20" />
          <span className="h-2 w-2 rounded-full bg-navy-800/20" />
        </span>
      </div>
      <div className="mt-1 flex items-center gap-2 rounded-full bg-white p-2 pl-4">
        <span className="h-2 flex-1 rounded-full bg-navy-800/8" />
        <span className="h-7 w-7 shrink-0 rounded-full bg-gold" />
      </div>
    </div>
  )
}
