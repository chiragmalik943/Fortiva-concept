import { MapPin, Compass, Flag } from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import AvailableStates from '../components/AvailableStates/AvailableStates'
import CtaBand from '../components/CtaBand/CtaBand'
import Button from '../components/Button'
import { availability, availabilityStates } from '../content/site'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useSplitReveal } from '../hooks/useSplitReveal'

/**
 * Available States — a footer destination.
 *
 * Copy is FTVA_Web Copy.odt's "Available States — Footer", which is short: an H1,
 * one paragraph, a map and two lists of state names. Four facts in total.
 *
 *   H1 + the paragraph      → PageHero
 *   [Map graphic] + the two lists → <AvailableStates />, already built
 *   nothing                 → the rollout band and the closing CTA below
 *
 * ── The whole page is one component the homepage already has ────────────────
 * `components/AvailableStates` is the map, the chips and the paragraph, and it
 * has been on the homepage since the first build. Rebuilding a second map for the
 * page the footer links to would have meant two components rendering the same six
 * states from the same list, which is exactly the drift `content/site.ts` exists
 * to prevent. So this page mounts that one, unchanged, and adds only what a
 * standalone page needs and a homepage band does not: the hero above it, and
 * somewhere to go underneath.
 *
 * ── What "coming soon" means, and what it deliberately does not say ─────────
 * The doc names five states as coming soon and gives no dates for any of them,
 * so neither does the band below. It says what each status means — which is the
 * question a visitor in South Carolina actually has — and stops there. Nothing on
 * this page commits Fortiva to a quarter.
 *
 * ── The tone ────────────────────────────────────────────────────────────────
 * `sky`. The section under the hero is the map, whose six states are drawn in
 * map.svg's own inks, and every other saturated tone would have put a strongly
 * coloured field directly above artwork with a palette of its own. The pale blue
 * is the quietest surface that still reads as a hero.
 */

const STATUS_NOTES = [
  {
    icon: MapPin,
    label: 'Live now',
    body: 'Plans are open for enrollment, the provider network is in place, and member support is running.',
  },
  {
    icon: Compass,
    label: 'Coming soon',
    body: 'Filed or in progress. These are the states Fortiva expands into next, across the southeast.',
  },
  {
    icon: Flag,
    label: 'The goal',
    body: 'Affordable, member-first coverage nationwide — starting with the communities that need it most.',
  },
]

export default function AvailableStatesPage() {
  const rolloutHeadingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const rolloutIntroRef = useScrollReveal<HTMLParagraphElement>({ y: 22, delay: 0.1 })
  const rolloutListRef = useScrollReveal<HTMLDivElement>({ y: 28, delay: 0.18 })
  const countRef = useScrollReveal<HTMLDListElement>({ y: 24, delay: 0.24 })

  return (
    <>
      <PageHero
        tone="sky"
        eyebrow="AVAILABLE STATES"
        titleTop={<>Where we&rsquo;re</>}
        titleBottom="available."
        lede={
          <>
            Fortiva is starting strong in North Carolina, with plans to expand across the
            southeast and eventually nationwide. Our goal is simple: bring affordable,
            member-first health coverage to communities that need it most.
          </>
        }
        actions={
          <>
            <Button variant="dark" icon="arrow" size="lg" href="/plans">
              Explore Plans
            </Button>
            <Button variant="white" size="lg" href="/contact">
              Get a Quote
            </Button>
          </>
        }
      />

      {/* The homepage's availability band, mounted whole. It sets no background
          of its own by design — on the homepage it sits inside the FAQ →
          Availability gradient — so the surface is this page's to choose, and
          white is what keeps the map's own inks reading as the only colour in the
          section.

          The three copy props are overridden because the hero above has already
          said both of those things: the component's default heading IS this
          page's H1, and its default paragraph IS this page's lede. See the note
          on those props in AvailableStates.tsx. */}
      <div className="bg-white">
        <AvailableStates
          eyebrow="THE MAP"
          heading={
            <>
              Six states, <span className="text-gold-dark">and counting</span>
            </>
          }
          intro="Point at a state or a name to see where it stands. North Carolina is open for enrollment today; the other five are next."
        />
      </div>

      {/* ── What each status means ────────────────────────────────────────
          Three definitions, on the grey plate. The section exists because the map
          above it uses two words — "live" and "coming soon" — that a visitor in
          one of the five has a real question about, and the copy doc answers
          neither. Nothing here names a date. */}
      <section className="bg-[#CCD0D2] px-6 py-24 sm:py-28">
        <div className="mx-auto grid max-w-container items-start gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <div>
            <span className="inline-block rounded-full bg-navy-800/[0.08] px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-navy-800/70">
              THE ROLLOUT
            </span>
            <h2
              ref={rolloutHeadingRef}
              className="mt-5 max-w-md text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px]"
            >
              One state at a time, <span className="text-gold-dark">on purpose</span>
            </h2>
            <p
              ref={rolloutIntroRef}
              className="mt-6 max-w-md text-[16px] leading-relaxed text-navy-800/65 opacity-0"
            >
              A health plan is only as good as the network behind it. Fortiva opens a state
              once the coverage, the providers and the support are all in place &mdash; not
              before.
            </p>

            <dl
              ref={countRef}
              className="mt-10 grid gap-x-8 gap-y-6 border-t border-navy-800/15 pt-8 opacity-0 sm:grid-cols-2"
            >
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/45">
                  Live today
                </dt>
                <dd className="mt-1.5 text-[15.5px] text-navy-800/75">
                  {availability.live.join(', ')}
                </dd>
              </div>
              {/* Not "Headquarters". That is also North Carolina — see
                  `companyLocation` in content/site.ts — so the pair read as one
                  fact printed twice. The count is the thing this column adds
                  that the chips above do not, and it is derived rather than
                  written down, so launching in a sixth state changes it. */}
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/45">
                  In progress
                </dt>
                <dd className="mt-1.5 text-[15.5px] text-navy-800/75">
                  {availability.comingSoon.length} more across the southeast
                </dd>
              </div>
            </dl>
          </div>

          <div ref={rolloutListRef} className="opacity-0">
            <ul className="flex flex-col gap-4">
              {STATUS_NOTES.map((note) => {
                const Icon = note.icon
                return (
                  <li
                    key={note.label}
                    className="corner-smooth rounded-card bg-white p-7 ring-1 ring-inset ring-navy-800/[0.08] sm:p-8"
                  >
                    <div className="flex items-start gap-5">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold">
                        <Icon size={20} strokeWidth={1.75} className="text-navy-800" />
                      </span>
                      <div>
                        <h3 className="text-[19px] font-semibold leading-snug text-navy-800 sm:text-[21px]">
                          {note.label}
                        </h3>
                        <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-navy-800/65 sm:text-[15.5px]">
                          {note.body}
                        </p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            {/* The six states as plain text under the cards, so the page still
                lists them for anyone who never reaches the map — a screen reader
                gets the chips above, but a printed page or a text-only render
                would otherwise carry no state names at all. */}
            <p className="mt-7 text-[14px] leading-relaxed text-navy-800/55">
              {availabilityStates.map((state, i) => (
                <span key={state.code}>
                  {i > 0 && <span className="text-navy-800/30"> &middot; </span>}
                  <span className={state.status === 'live' ? 'font-semibold text-navy-800' : ''}>
                    {state.name}
                  </span>
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        tone="gold"
        heading={
          <>
            Not in your state yet? <span className="text-navy-800">Tell us where you are.</span>
          </>
        }
        body="We expand toward demand. Leave your details and we will let you know the moment Fortiva opens where you live."
        actions={
          <>
            <Button variant="light" icon="arrow" size="lg" href="/contact">
              Stay connected
            </Button>
            <Button variant="ghost" size="lg" href="/plans">
              Explore Plans
            </Button>
          </>
        }
      />
    </>
  )
}
