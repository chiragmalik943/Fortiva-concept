import { ReactNode, useState } from 'react'
import { type LucideIcon } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'

/** Which abstract panel an item draws in the window's main area. */
export type PanelShape = 'summary' | 'table' | 'card' | 'search' | 'form' | 'chat'

export interface PortalItem {
  title: string
  body: string
  icon: LucideIcon
  shape: PanelShape
}

interface PortalShowcaseProps {
  eyebrow?: string
  heading: ReactNode
  intro?: ReactNode
  items: PortalItem[]
  action?: ReactNode
}

/**
 * The portal, drawn as the portal: a browser window with the six things the copy
 * doc lists down its sidebar, and a main area that changes when you pick one.
 *
 * ── Clicked, not scrolled ────────────────────────────────────────────────────
 * Deliberately the one interactive set-piece on the For Members pages that isn't
 * driven by scroll position. Everything about a portal is that YOU choose what to
 * look at, and a section that demonstrates that by making the visitor choose says
 * it better than a paragraph does. It also gives a run of six pages a change of
 * pace — four of them already animate on scroll, and a fifth would start to feel
 * like the site was performing at the visitor rather than answering them.
 *
 * Like PhoneShowcase, the panels contain no invented member data — no balances,
 * no claim numbers, no names. They show the shape of each screen and nothing
 * more. See that file for the full reasoning.
 *
 * Below `sm` the sidebar becomes a horizontally scrollable chip row: six labels
 * in a 320px-wide column would wrap to two lines each and take up more of the
 * screen than the panel they're selecting.
 */
export default function PortalShowcase({
  eyebrow,
  heading,
  intro,
  items,
  action,
}: PortalShowcaseProps) {
  const [active, setActive] = useState(0)

  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const introRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.12 })
  const windowRef = useScrollReveal<HTMLDivElement>({ y: 44, scale: 0.97, delay: 0.1 })

  const current = items[active]

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

        <div ref={windowRef} className="mt-14 opacity-0">
          <div className="corner-smooth overflow-hidden rounded-card border border-navy-800/8 bg-white shadow-card-soft">
            {/* ── window chrome ──────────────────────────────────────────── */}
            <div className="flex items-center gap-4 border-b border-navy-800/8 bg-cream-soft/70 px-5 py-3.5">
              <span aria-hidden="true" className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-navy-800/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-navy-800/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-navy-800/15" />
              </span>
              <span className="corner-smooth flex-1 truncate rounded-[10px] bg-white px-3.5 py-1.5 text-[12px] text-navy-800/45">
                fortiva.com/members/portal
              </span>
            </div>

            <div className="sm:flex">
              {/* ── sidebar ──────────────────────────────────────────────── */}
              <div
                data-lenis-prevent
                role="tablist"
                aria-label="Portal sections"
                className="flex gap-1 overflow-x-auto border-b border-navy-800/8 p-3 sm:w-[236px] sm:shrink-0 sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-r sm:p-4 lg:w-[264px]"
              >
                {items.map((item, i) => {
                  const Icon = item.icon
                  const on = i === active
                  return (
                    <button
                      key={item.title}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => setActive(i)}
                      className={`corner-smooth flex shrink-0 items-center gap-3 rounded-[12px] px-3.5 py-3 text-left text-[13.5px] font-medium leading-snug transition-colors sm:w-full sm:shrink ${
                        on
                          ? 'bg-navy-800 text-cream-soft'
                          : 'text-navy-800/60 hover:bg-navy-800/5 hover:text-navy-800'
                      }`}
                    >
                      <Icon
                        size={17}
                        strokeWidth={1.9}
                        className={`shrink-0 ${on ? 'text-gold' : 'text-navy-800/45'}`}
                      />
                      <span className="whitespace-nowrap sm:whitespace-normal">{item.title}</span>
                    </button>
                  )
                })}
              </div>

              {/* ── main area ────────────────────────────────────────────── */}
              <div className="min-w-0 flex-1 bg-white p-6 sm:p-9">
                <h3 className="text-[20px] font-semibold leading-snug text-navy-800 sm:text-[24px]">
                  {current.title}
                </h3>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-navy-800/65 sm:text-[15.5px]">
                  {current.body}
                </p>

                {/* `key` forces a remount per panel so the fade replays on every
                    switch — without it React reuses the DOM and the animation
                    only ever runs once. */}
                <div key={current.title} className="mt-8 animate-[fadeUp_450ms_ease-out]">
                  <Panel shape={current.shape} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {action && <div className="mt-14 flex flex-wrap gap-3">{action}</div>}
      </div>
    </section>
  )
}

/* ── the abstract panels ───────────────────────────────────────────────────── */

const line = (w: string, tone = 'bg-navy-800/10') => (
  <span className={`block h-2.5 rounded-full ${tone}`} style={{ width: w }} />
)

function Panel({ shape }: { shape: PanelShape }) {
  if (shape === 'summary') {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`corner-smooth rounded-[18px] p-5 ${i === 0 ? 'bg-navy-800' : 'bg-cream-soft'}`}
          >
            {line('44%', i === 0 ? 'bg-white/25' : 'bg-navy-800/12')}
            <span
              className={`mt-4 block h-4 rounded-full ${i === 0 ? 'bg-gold' : 'bg-navy-800/25'}`}
              style={{ width: i === 0 ? '70%' : '55%' }}
            />
            {line('34%', i === 0 ? 'bg-white/15' : 'bg-navy-800/8')}
          </div>
        ))}
      </div>
    )
  }

  if (shape === 'table') {
    return (
      <div className="corner-smooth overflow-hidden rounded-[18px] border border-navy-800/8">
        <div className="flex items-center gap-4 border-b border-navy-800/8 bg-cream-soft px-5 py-3">
          {line('22%', 'bg-navy-800/15')}
          {line('16%', 'bg-navy-800/15')}
          <span className="flex-1" />
          {line('12%', 'bg-navy-800/15')}
        </div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 border-b border-navy-800/6 px-5 py-4 last:border-b-0">
            {line('26%')}
            {line('14%', 'bg-navy-800/6')}
            <span className="flex-1" />
            <span
              className={`h-5 w-16 rounded-full ${i === 0 ? 'bg-gold/70' : 'bg-navy-800/8'}`}
            />
          </div>
        ))}
      </div>
    )
  }

  if (shape === 'card') {
    return (
      <div className="flex flex-wrap gap-5">
        <div className="corner-smooth w-full max-w-[340px] rounded-[18px] bg-gold p-6">
          {line('30%', 'bg-navy-800/25')}
          <span className="mt-5 block h-4 w-2/3 rounded-full bg-navy-800/70" />
          <div className="mt-6 flex items-end justify-between">
            <span className="flex flex-col gap-2">
              {line('90px', 'bg-navy-800/25')}
              {line('64px', 'bg-navy-800/25')}
            </span>
            <span className="grid h-12 w-12 grid-cols-3 grid-rows-3 gap-0.5" aria-hidden="true">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className={i % 4 === 1 ? 'bg-navy-800/20' : 'bg-navy-800/70'} />
              ))}
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-3">
          {['62%', '48%', '54%'].map((w, i) => (
            <span key={i} className="flex items-center gap-3">
              <span className="h-8 w-8 shrink-0 rounded-[10px] bg-cream-soft" />
              {line(w)}
            </span>
          ))}
        </div>
      </div>
    )
  }

  if (shape === 'search') {
    return (
      <div className="flex flex-col gap-4">
        <div className="corner-smooth flex items-center gap-3 rounded-[14px] border border-navy-800/10 bg-cream-soft px-4 py-3.5">
          <span className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-navy-800/25" />
          {line('40%', 'bg-navy-800/12')}
          <span className="ml-auto h-7 w-20 rounded-[10px] bg-gold" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="corner-smooth flex items-center gap-4 rounded-[16px] border border-navy-800/8 p-4"
            >
              <span className="h-10 w-10 shrink-0 rounded-full bg-cream-soft" />
              <span className="flex flex-1 flex-col gap-2">
                {line('72%')}
                {line('48%', 'bg-navy-800/6')}
              </span>
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${i === 0 ? 'bg-gold' : 'bg-navy-800/12'}`} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (shape === 'form') {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={i === 3 ? 'sm:col-span-2' : ''}>
            {line('30%', 'bg-navy-800/12')}
            <div className="corner-smooth mt-2.5 h-11 rounded-[12px] border border-navy-800/10 bg-cream-soft" />
          </div>
        ))}
        <div className="sm:col-span-2">
          <span className="corner-smooth block h-11 w-36 rounded-[12px] bg-gold" />
        </div>
      </div>
    )
  }

  // chat
  return (
    <div className="flex flex-col gap-3">
      <div className="corner-smooth max-w-[76%] rounded-[16px] rounded-tl-sm bg-cream-soft p-4">
        {line('100%')}
        <span className="mt-2 block h-2.5 w-3/5 rounded-full bg-navy-800/10" />
      </div>
      <div className="corner-smooth ml-auto max-w-[68%] rounded-[16px] rounded-tr-sm bg-navy-800 p-4">
        {line('100%', 'bg-white/25')}
        <span className="mt-2 block h-2.5 w-1/2 rounded-full bg-white/25" />
      </div>
      <div className="corner-smooth mt-2 flex items-center gap-3 rounded-[14px] border border-navy-800/10 p-2.5 pl-4">
        {line('40%', 'bg-navy-800/8')}
        <span className="ml-auto h-9 w-9 shrink-0 rounded-[10px] bg-gold" />
      </div>
    </div>
  )
}
