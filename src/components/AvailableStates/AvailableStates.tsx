import { PointerEvent, useState } from 'react'
import { Check } from 'lucide-react'
import { availabilityStates } from '../../content/site'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'
import StateMap from './StateMap'

// Copy doc, "Available States — Footer". Worth a homepage slot because it's a
// qualification signal as much as a trust one: a visitor needs to know within
// seconds whether Fortiva serves them at all, and nothing else on the page says.
//
// The chips and the map are two views of one list (`availabilityStates`) and
// one piece of state (`active`), so pointing at either side lights up both.
export default function AvailableStates() {
  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const bodyRef = useScrollReveal<HTMLDivElement>({ y: 24, delay: 0.1 })
  const mapRef = useScrollReveal<HTMLDivElement>({ y: 32, scale: 0.97, delay: 0.15 })

  // One highlight, two ways to set it. `pinned` records whether the current
  // highlight came from a click or tap: pinned highlights survive the pointer
  // leaving, hover ones don't. That's what makes the section work on touch,
  // where there is no hover at all and a tap has to both set and clear.
  const [active, setActive] = useState<string | null>(null)
  const [pinned, setPinned] = useState(false)

  // Outlives `active` going null so the tooltip fades out where it was instead
  // of sliding back to the middle of the map on the way out.
  const [resting, setResting] = useState<string | null>(null)

  const show = (code: string) => {
    setActive(code)
    setPinned(false)
    setResting(code)
  }
  const hide = () => {
    if (!pinned) setActive(null)
  }
  const toggle = (code: string) => {
    setResting(code)
    if (active === code && pinned) {
      setActive(null)
      setPinned(false)
    } else {
      setActive(code)
      setPinned(true)
    }
  }

  const live = availabilityStates.filter((s) => s.status === 'live')
  const comingSoon = availabilityStates.filter((s) => s.status === 'coming-soon')

  // Touch fires pointerenter on every tap, which would re-arm the highlight a
  // beat before the click meant to turn it off — so pointer entry is for real
  // pointers only and taps go through onClick alone. Focus is wired up too, so
  // tabbing through the chips drives the map exactly like hovering does.
  const chipProps = (code: string) => ({
    type: 'button' as const,
    'data-active': active === code ? 'true' : 'false',
    'aria-pressed': pinned && active === code,
    onPointerEnter: (e: PointerEvent<HTMLButtonElement>) => {
      if (e.pointerType !== 'touch') show(code)
    },
    onPointerLeave: hide,
    onFocus: () => show(code),
    onBlur: hide,
    onClick: () => toggle(code),
  })

  return (
    <section className="bg-cream px-6 py-24 sm:py-28">
      {/* The map gets the larger share of the row. It used to sit in a padded
          card at exactly half the width, which left the six states Fortiva
          actually names about 137px across — the section's whole subject, at
          thumbnail size. Dropping the card and shifting the split gives it ~22%
          more room, permanently, rather than only while someone is hovering. */}
      <div className="mx-auto grid max-w-container items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="inline-block rounded-full bg-navy-800/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-navy-800/70">
            AVAILABILITY
          </span>
          <h2
            ref={headingRef}
            className="mt-5 text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px]"
          >
            Where we&rsquo;re available
          </h2>

          <div ref={bodyRef} className="opacity-0">
            <p className="mt-6 max-w-md text-[15.5px] leading-relaxed text-navy-800/60">
              Fortiva is starting strong in North Carolina, with plans to expand across the
              southeast and eventually nationwide. Our goal is simple: bring affordable,
              member-first health coverage to communities that need it most.
            </p>

            <div className="fchips mt-9" data-focus={active ? 'true' : 'false'}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/50">
                Current coverage
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {live.map((state) => (
                  <li key={state.code}>
                    <button
                      {...chipProps(state.code)}
                      className="fchip fchip--live corner-smooth flex items-center gap-2 rounded-[12px] bg-gold px-4 py-2 text-[14px] font-semibold text-navy-800"
                    >
                      <Check size={15} strokeWidth={2.5} />
                      {state.name}
                    </button>
                  </li>
                ))}
              </ul>

              <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/50">
                Coming soon
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {comingSoon.map((state) => (
                  <li key={state.code}>
                    <button
                      {...chipProps(state.code)}
                      className="fchip fchip--soon corner-smooth flex items-center gap-1.5 rounded-[12px] border border-navy-800/10 bg-cream-soft px-4 py-2 text-[14px] font-medium text-navy-800/65"
                    >
                      <span className="fchip-swatch h-[6px] w-[6px] shrink-0 rounded-full" />
                      {state.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div ref={mapRef} className="opacity-0">
          <StateMap
            states={availabilityStates}
            active={active}
            onShow={show}
            onHide={hide}
            onToggle={toggle}
            resting={resting}
          />
          <p className="mt-2 text-center text-[12.5px] text-navy-800/40">
            <span className="hidden sm:inline">Hover</span>
            <span className="sm:hidden">Tap</span> a state or a name to see its status.
          </p>
        </div>
      </div>
    </section>
  )
}
