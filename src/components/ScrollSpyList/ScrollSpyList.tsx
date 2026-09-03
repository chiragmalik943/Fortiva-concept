import { ReactNode } from 'react'
import { type LucideIcon } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useScrollSpyIndex } from '../../hooks/useScrollSpyIndex'
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
 * ── Why the active item is discrete and not a scrub ──────────────────────────
 * Everything else scroll-driven on this site interpolates continuously. This one
 * is discrete on purpose: a panel is either the one you are reading or it isn't,
 * and cross-fading four panels at once produces a middle where all of them are
 * half-lit and none reads as chosen. So the styling is plain CSS transitions off
 * a single index, and re-renders happen once per panel crossed rather than once
 * per scroll frame.
 *
 * `useScrollSpyIndex` owns that index. It used to be a ScrollTrigger per panel
 * reporting when it was the one in the reading band, which advanced the highlight
 * once per panel PITCH — ~180px, half of one wheel flick, so a single scroll
 * skipped panels. See that hook for why it is measured off the section's own
 * progress through the viewport instead, and what that costs.
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
  className = 'bg-white',
}: ScrollSpyListProps) {
  const { scopeRef, active, tracking } = useScrollSpyIndex(items.length)

  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const introRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.12 })

  // Reduced motion, or any viewport under lg, shows everything at full strength:
  // nothing is following the scroll there, so a single lit panel would leave the
  // rest permanently dimmed with no way to reach them.
  const allLit = !tracking

  return (
    /* `pin:` = wide and tall enough for the section to pin itself to the viewport
       (animations/pinnedSequence.ts owns the query, and useScrollSpyIndex reads
       the same one). These variants trim the section to the viewport it is about
       to occupy, and `pin:static` retires the sticky column: inside a pinned —
       that is, fixed — section there is nothing left for it to stick to, and the
       whole section is already held still. `pin:pt-24` rather than symmetric
       padding, because the nav pill floats over the page and centring in the full
       viewport tucks the eyebrow under it. All of this is inert on a window too
       short to pin, so the fallback keeps exactly the layout this section had. */
    <section
      ref={scopeRef}
      className={`px-6 py-24 sm:py-28 pin:flex pin:h-screen pin:items-center pin:pb-10 pin:pt-24 ${className}`}
    >
      <div className="mx-auto grid w-full max-w-container gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start pin:static pin:self-center">
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

        <ul className="flex flex-col gap-4 pin:gap-3">
          {items.map((item, i) => {
            const Icon = item.icon
            const lit = allLit || i === active
            return (
              <li
                key={item.title}
                className={`corner-smooth rounded-card border p-7 transition-all duration-500 sm:p-9 lg:opacity-60 pin:p-6 ${
                  lit
                    ? 'border-navy-800/15 bg-white shadow-card-soft lg:!opacity-100'
                    : 'border-navy-800/[0.07] bg-white'
                }`}
              >
                <div className="flex items-start gap-5">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-500 ${
                      lit ? 'bg-gold' : 'bg-navy-800/[0.08]'
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
