import { ReactNode } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useScrollSpyIndex } from '../../hooks/useScrollSpyIndex'
import { useSplitReveal } from '../../hooks/useSplitReveal'

export interface AppFeature {
  title: string
  body: string
  /**
   * The app screenshot this feature shows, full-bleed inside the bezel. Comes
   * from `images.appScreens` — see assets/images.ts, which is the only place a
   * filename appears.
   */
  screen: string
}

interface PhoneShowcaseProps {
  eyebrow?: string
  heading: ReactNode
  intro?: ReactNode
  features: AppFeature[]
}

/**
 * A phone that stays put while the feature list scrolls past it, changing screen
 * to match whichever feature is being read.
 *
 * ── Built from a measured design, not an impression of one ───────────────────
 * The device's proportions are sampled off the design mock rather than guessed,
 * and they are written down because several are unusual enough that a later
 * tidy-up would quietly undo them:
 *
 *   device aspect      630 : 1266  — 2.01, so ~9:18.1, NOT the 9:19 it was
 *   bezel              3.5% of the device width, uniform on all four sides
 *   corner radius      ~10.6% of the device width
 *   side buttons       #1F3357, three of them, protruding ~1.5% of the width:
 *                      left at 21.2% (5.7% tall) and 29.7% (13.5% tall),
 *                      right at 25.0% (10.6% tall)
 *
 * The bezel is a percentage rather than a fixed 10px because the device is no
 * longer a fixed size (see below), and a fixed bezel on a device that changes
 * width by half reads as a chunky border at one size and a hairline at another.
 *
 * The screen aperture that leaves is ~9:18.8 rather than a phone's usual 9:19.5,
 * so `object-cover` trims a few percent off a stock capture's top and bottom.
 * assets/images.ts carries the export note.
 *
 * ── The heading sits INSIDE the right column, and that is the whole trick ────
 * Measuring the mock turned up something easy to miss: the eyebrow, the heading
 * and the intro all start at the same x as the list's rail, while the device runs
 * from just under the eyebrow down to past the last list item. The device is not
 * beside the LIST — it is beside the entire right-hand column.
 *
 * That is why the mock's phone looks so much bigger than a heading-above-the-grid
 * layout can make it: it has the full height of the section to occupy rather than
 * just the list's share of it. Reproducing that is explicit grid placement — the
 * device in column 1 spanning both rows, the heading in column 2 row 1, the list
 * in column 2 row 2.
 *
 * Below the pin threshold the placement classes drop away and the same three
 * children stack in source order — heading, device, list — which is exactly the
 * layout this section already had on a phone. The `lg:` classes in between put
 * the heading back above a two-column device/list row, which is what the unpinned
 * desktop fallback used to look like.
 *
 * ── Why the text column is capped and the pair is centred ───────────────────
 * The first attempt gave the right-hand column `minmax(0,1fr)` — all the width
 * left over. That looks fine until you notice where the slack goes: the column
 * was ~1000px wide while its text measures ~550px, so every spare pixel piled up
 * on the RIGHT of the section and the device and the copy both hugged the left
 * edge. The container was centred; its contents were not.
 *
 * So the text column is capped at its own measure (`36rem`) rather than taking
 * what's left, the device column stays `auto`, and `justify-center` centres the
 * two tracks together. Nothing has slack inside it any more, so the leftover
 * width becomes equal margins either side — measured within 6px of each other at
 * 1280, 1440 and 1680 wide. `gap-x-40` is what the mock has between the device
 * and the rail; a wide gap is part of the design rather than incidental spacing,
 * and with the pair centred it reads as deliberate rather than as a hole.
 *
 * `36rem` and not less because of a height interaction that is easy to miss: at
 * `34rem` the longest description wrapped to two lines, which added 23px to the
 * list and pushed the whole section 9px past a 760px window. The measure and the
 * pin threshold are coupled through the list's height, so a copy change long
 * enough to re-wrap a row is a change to whether this section still fits.
 *
 * ── The device is sized in vh, not pixels ───────────────────────────────────
 * In the mock the device is 633px tall in an 885px frame — 72% of the viewport —
 * and no fixed pixel width reproduces that across window sizes: 240px looks right
 * at 760px tall and postage-stamp-ish at 1200px. So it is `pin:h-[72vh]`, with
 * `aspect-ratio` deriving the width from that. At a 900px window that lands the
 * device at 322px wide against the mock's 315px, and it stays in proportion
 * everywhere else. The `max-h` cap stops it crowding the list on a very tall
 * display, where 72vh would otherwise be wider than the column beside it.
 *
 * The right column's own natural height — heading block plus five list rows,
 * about 596px — is the floor. On a short window that floor is taller than 72vh
 * and it, not the device, sets the section height. The verification pass reports
 * both against the viewport for exactly this reason.
 *
 * ── The list is a rail, not a stack of cards ─────────────────────────────────
 * Cards, icons and a lit background are all gone. In their place: a hairline rail
 * down the left with a 2px gold segment marking the active item, a number, a
 * title and a line of body. It says "you are on three of five" far more quietly,
 * and leaves the device as the only loud thing in the section.
 *
 * The gold marker is per-item and absolutely positioned inside it, rather than
 * one bar that slides on a transform. A sliding bar has to assume every item is
 * exactly the same height, and the moment one description wraps to two lines it
 * is out of register with everything below it. Per-item, each marker is exactly
 * as tall as the item it belongs to, whatever the copy does. Both states are
 * always rendered and cross-fade, so switching is a fade rather than a pop.
 *
 * ── Tracking ────────────────────────────────────────────────────────────────
 * `useScrollSpyIndex`, shared with ScrollSpyList: pinned, the section holds still
 * while the scroll walks the index; unpinned — a window too short to hold it —
 * the index comes from the section's own passage through the viewport. Under `lg`
 * nothing tracks and every item is lit, because a sticky phone on a 390px
 * viewport would leave no room for the list it exists to illustrate.
 */
export default function PhoneShowcase({
  eyebrow,
  heading,
  intro,
  features,
}: PhoneShowcaseProps) {
  const { scopeRef, active, tracking } = useScrollSpyIndex(features.length)

  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const introRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.12 })
  const phoneRef = useScrollReveal<HTMLDivElement>({ y: 40, scale: 0.96 })

  return (
    /* `pin:` = wide and tall enough for the section to pin itself to the viewport
       (animations/pinnedSequence.ts owns the query, and useScrollSpyIndex reads
       the same one). `pin:pt-24` rather than symmetric padding, because the nav
       pill floats over the page and centring in the full viewport tucks the
       eyebrow underneath it. `pin:static` retires the sticky phone: inside a
       pinned section the whole thing is already held still. All of it is inert on
       a window too short to pin. */
    <section
      ref={scopeRef}
      className="bg-white px-6 py-24 sm:py-28 pin:flex pin:h-screen pin:items-center pin:pb-10 pin:pt-24"
    >
      {/* Three children, placed three ways. Stacked in source order under `lg`
          (heading, device, list); heading across the top of a two-column
          device/list row at `lg`; and at `pin:` the device moves into column one
          spanning BOTH rows, so it stands beside the heading and the list
          together — see the docblock. */}
      <div className="mx-auto grid w-full max-w-container gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-x-20 lg:gap-y-16 pin:grid-cols-[auto_minmax(0,36rem)] pin:justify-center pin:gap-x-40 pin:gap-y-5">
        {/* ── heading block ──────────────────────────────────────────── */}
        <div className="lg:col-span-2 lg:row-start-1 pin:col-span-1 pin:col-start-2 pin:row-start-1 pin:self-end">
          {eyebrow && (
            <span className="inline-block rounded-full bg-navy-800/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-navy-800/70">
              {eyebrow}
            </span>
          )}
          <h2
            ref={headingRef}
            className={`max-w-2xl text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px] pin:text-[34px] ${
              eyebrow ? 'mt-5 pin:mt-3' : ''
            }`}
          >
            {heading}
          </h2>
          {intro && (
            <div ref={introRef} className="opacity-0">
              <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-navy-800/65 sm:text-[17px] pin:mt-3 pin:text-[15px]">
                {intro}
              </p>
            </div>
          )}
        </div>

        {/* ── the device ─────────────────────────────────────────────── */}
        <div
          ref={phoneRef}
          className="flex justify-center opacity-0 lg:col-start-1 lg:row-start-2 lg:sticky lg:top-28 lg:self-start pin:static pin:col-start-1 pin:row-span-2 pin:row-start-1 pin:justify-start pin:self-center"
        >
          <Phone features={features} active={active} />
        </div>

        {/* ── the list that drives it ────────────────────────────────── */}
        <ol className="flex flex-col lg:col-start-2 lg:row-start-2 pin:col-start-2 pin:row-start-2 pin:self-start">
          {features.map((feature, i) => {
            const lit = !tracking || i === active
            return (
              <li
                key={feature.title}
                aria-current={lit && tracking ? 'true' : undefined}
                className="relative border-l border-navy-800/[0.12] py-4 pl-5 sm:pl-6 pin:py-3"
              >
                {/* Exactly as tall as its own item, so a description that wraps
                    cannot put it out of register with the ones below. */}
                <span
                  aria-hidden="true"
                  className={`absolute -left-px top-0 h-full w-[2px] bg-gold transition-opacity duration-500 ease-out ${
                    lit ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                <div className="flex gap-4 sm:gap-5">
                  <span
                    className={`shrink-0 pt-px text-[13.5px] font-semibold tabular-nums transition-colors duration-500 ${
                      lit ? 'text-gold-dark' : 'text-navy-800/30'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3
                      className={`text-[17px] font-semibold leading-snug transition-colors duration-500 sm:text-[18px] ${
                        lit ? 'text-navy-800' : 'text-navy-800/35'
                      }`}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={`mt-1.5 max-w-lg text-[14px] leading-relaxed transition-colors duration-500 sm:text-[14.5px] ${
                        lit ? 'text-navy-800/70' : 'text-navy-800/30'
                      }`}
                    >
                      {feature.body}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/* ── the device ────────────────────────────────────────────────────────────── */

/**
 * Side-button placement, as fractions of the device's own height — measured off
 * the mock. Percentages rather than pixels for the same reason the bezel is one:
 * the device changes size with the viewport while pinned.
 */
const BUTTONS = [
  { side: 'left', top: '21.2%', height: '5.7%' },
  { side: 'left', top: '29.7%', height: '13.5%' },
  { side: 'right', top: '25.0%', height: '10.6%' },
] as const

function Phone({ features, active }: { features: AppFeature[]; active: number }) {
  return (
    /* Sized two different ways from ONE ratio. Unpinned, a fixed width and
       `aspect-ratio` gives the height. Pinned, an explicit height — the room the
       section has left — and `w-auto` lets the same ratio give the width. */
    <div className="relative aspect-[630/1266] w-[272px] shrink-0 sm:w-[300px] pin:h-[72vh] pin:max-h-[760px] pin:w-auto">
      {BUTTONS.map((b, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`absolute w-[1.6%] bg-[#1F3357] ${
            b.side === 'left' ? '-left-[1.5%] rounded-l-full' : '-right-[1.5%] rounded-r-full'
          }`}
          style={{ top: b.top, height: b.height }}
        />
      ))}

      {/* Body, bezel, screen. The screen sits on navy rather than cream so a
          screenshot that hasn't loaded reads as a dark display rather than as a
          hole in the page. */}
      <div className="relative h-full w-full rounded-[34px] bg-navy-900 p-[3.5%] shadow-card pin:rounded-[26px]">
        <div className="relative h-full w-full overflow-hidden rounded-[22px] bg-navy-900 pin:rounded-[18px]">
          {features.map((feature, i) => (
            <img
              key={feature.title}
              src={feature.screen}
              alt={`The Fortiva app: ${feature.title.toLowerCase()}`}
              aria-hidden={i !== active}
              /* The first screen is what everyone sees; the rest are only needed
                 once someone starts scrolling the list. */
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
              className={`absolute inset-0 h-full w-full select-none object-cover transition-opacity duration-500 ease-out ${
                i === active ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
