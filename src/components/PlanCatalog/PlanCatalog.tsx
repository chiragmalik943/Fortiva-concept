import { ReactNode, useEffect, useRef, useState } from 'react'
import { Check, type LucideIcon } from 'lucide-react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../animations/gsap'
import { scrollPageTo } from '../../hooks/useLenis'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'

export interface PlanProduct {
  /** Anchor id. Doubles as the rail's key and as the panel's `id`. */
  id: string
  /** The doc's own H2 — "Fortiva Critical Illness". */
  name: string
  /** Short label for the sticky rail, where the repeated "Fortiva" is noise. */
  railLabel: string
  /** The doc's own "Subhead:" line. */
  subhead: string
  body: string
  /** The doc's "Coverage for" list, verbatim. */
  coverage: string[]
  /** The doc's "Why it matters" list, verbatim. */
  whyItMatters: string[]
  /**
   * Who the plan is for, condensed from the FIRST CLAUSE of the doc's own body
   * paragraph — every one of the four opens by naming its audience ("ideal for
   * individuals and families who want protection against…"). It is a shortening,
   * not an addition: nothing here says anything the paragraph below it doesn't.
   */
  bestFor: string
  icon: LucideIcon
}

interface PlanCatalogProps {
  heading: ReactNode
  intro?: ReactNode
  plans: PlanProduct[]
  /** Buttons at the foot of the sticky column. */
  action?: ReactNode
  note?: ReactNode
}

/**
 * Plans — the four named products.
 *
 * ── Why this is not ScrollSpyList ───────────────────────────────────────────
 * It is the same idea and deliberately the same silhouette: a sticky column on
 * the left naming what you are reading, tall panels on the right, one of them
 * lit. A visitor arriving here from Find a Doctor should recognise the shape.
 *
 * What it cannot be is that component. `SpyItem` is `{ title, body, icon }` — one
 * sentence — and each of these panels carries a subhead, a paragraph and TWO
 * labelled lists of four to five items each. More to the point, ScrollSpyList
 * PINS itself to the viewport, and pinning is only honest while the section fits
 * inside one: these panels run 420-520px each, four of them, so a pinned version
 * would clip its own bottom. See the "Pinning was only possible after the
 * sections were trimmed" note in README.md — that constraint is exactly why this
 * one sticks rather than pins.
 *
 * ── The rail is clickable, and that is the other difference ─────────────────
 * ScrollSpyList's left column is a readout. This one is navigation: four plan
 * names, one lit, each of them a jump to its panel. A page whose whole job is
 * "which of these four is mine" should let someone go straight to the one they
 * came for, and the doc's four products are genuinely alternatives rather than
 * steps in a sequence.
 *
 * Jumps go through `scrollPageTo` rather than `scrollIntoView` because Lenis owns
 * the scroll position — a native scroll would be overwritten on the next frame.
 *
 * ── The active index is a trigger per panel, not a progress fraction ────────
 * `useScrollSpyIndex` derives its index from one section-wide progress, which is
 * right when items are short, evenly sized and mostly on screen at once (see that
 * hook's docblock). Neither holds here: the panels are half a viewport tall each
 * and differ in height by 100px, so an even four-way split of the section's
 * progress would light panel three while panel two is still under the reading
 * line. One trigger per panel, banded on the middle of the viewport, answers the
 * question the rail is actually asking — which panel am I reading — and at this
 * panel height there is no twitchiness to trade away for it: a whole flick
 * (~360px) does not clear one panel.
 */
export default function PlanCatalog({
  heading,
  intro,
  plans,
  action,
  note,
}: PlanCatalogProps) {
  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const introRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.12 })

  const panelRefs = useRef<(HTMLLIElement | null)[]>([])
  const [active, setActive] = useState(0)
  // No highlight to follow under `lg` (the rail is hidden there) or under
  // reduced motion, where nothing is scroll-driven. Same contract as
  // `tracking` in useScrollSpyIndex: when it is false every rail row reads at
  // full strength rather than leaving rows 2..n permanently dimmed.
  const [tracking, setTracking] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion) return

    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      setTracking(true)

      const triggers = panelRefs.current
        .filter((el): el is HTMLLIElement => Boolean(el))
        .map((el, i) =>
          ScrollTrigger.create({
            trigger: el,
            // The reading band: a panel is "the one you are on" from the moment
            // its top passes the middle of the screen until its bottom does.
            // Deliberately not `top 60% / bottom 40%` — overlapping bands are
            // what made the old per-item spy advance twice per panel.
            start: 'top 50%',
            end: 'bottom 50%',
            invalidateOnRefresh: true,
            onToggle: (self) => {
              if (self.isActive) setActive(i)
            },
          }),
        )

      return () => {
        setTracking(false)
        triggers.forEach((t) => t.kill())
      }
    })

    return () => mm.revert()
  }, [plans.length])

  /* The grey plate is load-bearing, not decoration. Every panel is a white card
     and the page is white (see tailwind.config.js), so on a white section the
     four cards would be four hairlines floating in nothing. This is the same
     answer MembersHub's card grid gives, and the same #CCD0D2. */
  return (
    <section className="bg-[#CCD0D2] px-6 py-24 sm:py-28">
      <div className="mx-auto grid max-w-container gap-12 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-16 xl:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <h2
            ref={headingRef}
            className="max-w-md text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px]"
          >
            {heading}
          </h2>

          <div ref={introRef} className="opacity-0">
            {intro && (
              <p className="mt-6 max-w-sm text-[16px] leading-relaxed text-navy-800/65">{intro}</p>
            )}

            {/* The rail. Hidden below `lg`, where the sticky column is just a
                heading above the panels and a list of four links to things
                already a thumb-flick away would be a second table of contents. */}
            <nav aria-label="Fortiva plans" className="mt-9 hidden lg:block">
              <ul className="flex flex-col">
                {plans.map((plan, i) => {
                  const lit = !tracking || i === active
                  return (
                    <li key={plan.id}>
                      <button
                        type="button"
                        aria-current={tracking && i === active ? 'true' : undefined}
                        onClick={() => scrollPageTo(`#${plan.id}`)}
                        className="group flex w-full items-center gap-4 border-t border-navy-800/15 py-3.5 text-left last:border-b"
                      >
                        <span
                          className={`text-[13px] font-semibold tabular-nums transition-colors duration-500 ${
                            lit ? 'text-gold-dark' : 'text-navy-800/35'
                          }`}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`text-[16px] font-medium transition-colors duration-500 group-hover:text-navy-800 ${
                            lit ? 'text-navy-800' : 'text-navy-800/45'
                          }`}
                        >
                          {plan.railLabel}
                        </span>
                        {/* Marks the lit row without moving anything: an
                            absolutely-free 2px cap at the end of the row, rather
                            than a border that would change the row's height as
                            the highlight travels. */}
                        <span
                          aria-hidden="true"
                          className={`ml-auto h-[2px] rounded-full bg-gold transition-all duration-500 ${
                            tracking && i === active ? 'w-9 opacity-100' : 'w-0 opacity-0'
                          }`}
                        />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {action && <div className="mt-9 flex flex-wrap gap-3">{action}</div>}
            {note && (
              <p className="mt-7 max-w-sm text-[13px] leading-relaxed text-navy-800/50">{note}</p>
            )}
          </div>
        </div>

        <ul className="flex flex-col gap-5">
          {plans.map((plan, i) => (
            <PlanPanel
              key={plan.id}
              plan={plan}
              index={i}
              lit={!tracking || i === active}
              panelRef={(el) => {
                panelRefs.current[i] = el
              }}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}

interface PlanPanelProps {
  plan: PlanProduct
  index: number
  lit: boolean
  /**
   * Named `panelRef` and not `ref` on purpose: `ref` is reserved on a React 18
   * element, so a function component given one gets a console warning and the
   * callback is never invoked — the rail would then track nothing at all.
   */
  panelRef: (el: HTMLLIElement | null) => void
}

/**
 * One product card.
 *
 * The `id` is what the rail jumps to. Nav clearance is not this component's
 * problem: `scrollPageTo` subtracts `NAV_OFFSET` (the height of the floating
 * pill) from every jump it makes, so a panel scrolled to lands under the nav
 * rather than behind it. See hooks/useLenis.ts.
 */
function PlanPanel({ plan, index, lit, panelRef }: PlanPanelProps) {
  const revealRef = useScrollReveal<HTMLDivElement>({ y: 28, delay: 0.05 })
  const Icon = plan.icon

  return (
    <li id={plan.id} ref={panelRef}>
      <div ref={revealRef} className="opacity-0">
        <article
          className={`corner-smooth rounded-card bg-white p-7 transition-shadow duration-500 ring-1 ring-inset sm:p-9 lg:p-10 ${
            lit ? 'shadow-card-soft ring-navy-800/[0.10]' : 'ring-navy-800/[0.06]'
          }`}
        >
          <div className="flex items-start gap-5">
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-500 ${
                lit ? 'bg-gold' : 'bg-navy-800/[0.08]'
              }`}
            >
              <Icon
                size={22}
                strokeWidth={1.75}
                className={lit ? 'text-navy-800' : 'text-navy-800/45'}
              />
            </span>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/40">
                Plan {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-1.5 text-[22px] font-semibold leading-snug text-navy-800 sm:text-[26px]">
                {plan.name}
              </h3>
              <p className="mt-1.5 text-[15.5px] font-semibold text-gold-dark sm:text-[16.5px]">
                {plan.subhead}
              </p>
            </div>
          </div>

          <p className="mt-6 text-[15.5px] leading-relaxed text-navy-800/70 sm:text-[16px]">
            {plan.body}
          </p>

          {/* Two lists, side by side from `sm`. They answer different questions —
              what the plan pays for, and why that is worth having — and stacking
              them made a card that read as one nine-item list with a heading
              halfway down it. */}
          <div className="mt-8 grid gap-8 border-t border-navy-800/10 pt-8 sm:grid-cols-2 sm:gap-10">
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/45">
                Coverage for
              </h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {plan.coverage.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check
                      size={16}
                      strokeWidth={2.5}
                      className="mt-[3px] shrink-0 text-gold-dark"
                      aria-hidden="true"
                    />
                    <span className="text-[15px] leading-relaxed text-navy-800/75">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/45">
                Why it matters
              </h4>
              {/* An `<ol>` where its neighbour is a `<ul>`: these are painted with
                  numbers, so the order has to be real — the same rule ListBand's
                  numbered rows follow. */}
              <ol className="mt-4 flex flex-col gap-2.5">
                {plan.whyItMatters.map((item, i) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-[1px] text-[12px] font-semibold tabular-nums text-navy-800/35">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[15px] leading-relaxed text-navy-800/75">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <p className="corner-smooth mt-8 rounded-[14px] bg-[#CCD0D2]/45 px-5 py-4 text-[14.5px] leading-relaxed text-navy-800/70">
            <span className="font-semibold text-navy-800">Who it&rsquo;s for</span>
            <span className="mx-2 text-navy-800/30">&middot;</span>
            {plan.bestFor}
          </p>
        </article>
      </div>
    </li>
  )
}
