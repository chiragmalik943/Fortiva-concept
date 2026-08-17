import { ReactNode, useEffect, useRef, useState } from 'react'
import { type LucideIcon } from 'lucide-react'
import { ScrollTrigger, prefersReducedMotion } from '../../animations/gsap'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'

export interface SpyItem {
  title: string
  body: string
  icon: LucideIcon
}

interface ScrollSpyListProps {
  eyebrow?: string
  heading: ReactNode
  intro?: ReactNode
  items: SpyItem[]
  action?: ReactNode
  className?: string
}

/**
 * A sticky heading on the left and a column of large panels on the right, where
 * exactly one panel is lit at a time — whichever is passing through the middle
 * of the viewport. The left column names it, so the pair reads as a single
 * moving focus rather than as a heading next to a list.
 *
 * ── Why the active item is state and not a scrub ─────────────────────────────
 * Everything else scroll-driven on this site interpolates continuously. This one
 * is discrete on purpose: a panel is either the one you are reading or it isn't,
 * and cross-fading four panels at once produces a middle where all of them are
 * half-lit and none reads as chosen. So each panel owns a ScrollTrigger whose
 * only job is to report "I am the one in the band now", and the styling is plain
 * CSS transitions off a single index. That also keeps re-renders to one per
 * panel crossed rather than one per scroll frame.
 *
 * Under `lg` the sticky column becomes a normal heading above the list and every
 * panel is lit — a spy list needs a viewport tall enough to hold the heading and
 * the item at once, and a phone isn't.
 */
export default function ScrollSpyList({
  eyebrow,
  heading,
  intro,
  items,
  action,
  className = 'bg-cream-soft',
}: ScrollSpyListProps) {
  const [active, setActive] = useState(0)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const introRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.12 })

  useEffect(() => {
    // Below lg every panel is lit, so there is nothing to track.
    const desktop = window.matchMedia('(min-width: 1024px)')
    if (!desktop.matches) return

    const triggers = itemRefs.current.map((el, i) =>
      el
        ? ScrollTrigger.create({
            trigger: el,
            start: 'top 62%',
            end: 'bottom 38%',
            onToggle: (self) => {
              if (self.isActive) setActive(i)
            },
          })
        : null,
    )

    return () => triggers.forEach((t) => t?.kill())
  }, [items.length])

  // Reduced motion, or any viewport under lg, shows everything at full strength.
  const allLit = prefersReducedMotion

  return (
    <section className={`px-6 py-24 sm:py-28 ${className}`}>
      <div className="mx-auto grid max-w-container gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          {eyebrow && (
            <span className="inline-block rounded-full bg-navy-800/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-navy-800/70">
              {eyebrow}
            </span>
          )}
          <h2
            ref={headingRef}
            className={`max-w-md text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px] ${
              eyebrow ? 'mt-5' : ''
            }`}
          >
            {heading}
          </h2>

          <div ref={introRef} className="opacity-0">
            {intro && (
              <p className="mt-6 max-w-sm text-[16px] leading-relaxed text-navy-800/65">{intro}</p>
            )}

            {/* Reads out which panel is lit — the counter is what makes the
                sticky column feel connected to the scrolling one. Hidden under
                lg, where nothing is being tracked. */}
            <div className="mt-9 hidden items-center gap-3 lg:flex">
              <span className="text-[34px] font-semibold leading-none text-navy-800">
                {String(active + 1).padStart(2, '0')}
              </span>
              <span className="text-[14px] text-navy-800/40">/ {String(items.length).padStart(2, '0')}</span>
              <span className="ml-2 h-[2px] w-16 overflow-hidden rounded-full bg-navy-800/10">
                <span
                  className="block h-full rounded-full bg-gold transition-[width] duration-500 ease-out"
                  style={{ width: `${((active + 1) / items.length) * 100}%` }}
                />
              </span>
            </div>

            {action && <div className="mt-9 flex flex-wrap gap-3">{action}</div>}
          </div>
        </div>

        <ul className="flex flex-col gap-4">
          {items.map((item, i) => {
            const Icon = item.icon
            const lit = allLit || i === active
            return (
              <li
                key={item.title}
                ref={(el) => (itemRefs.current[i] = el)}
                className={`corner-smooth rounded-card border p-7 transition-all duration-500 sm:p-9 lg:opacity-60 ${
                  lit
                    ? 'border-navy-800/10 bg-white shadow-card-soft lg:!opacity-100'
                    : 'border-transparent bg-white/45'
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
                    <h3 className="text-[19px] font-semibold leading-snug text-navy-800 sm:text-[21px]">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-navy-800/65 sm:text-[15.5px]">
                      {item.body}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
