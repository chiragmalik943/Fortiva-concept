import { ReactNode } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'

interface ListBandProps {
  eyebrow?: string
  heading: ReactNode
  /** One short lead under the heading. Optional — several callers have none. */
  intro?: ReactNode
  /** The numbered rows. Plain strings: these are single sentences, not cards. */
  items: string[]
  /** Buttons, at the foot of the copy column. Optional. */
  action?: ReactNode
  image: string
  /**
   * Real alt text, not `alt=""`. Unlike the dissolved backdrops elsewhere on the
   * site this photograph is a framed, opaque half of a two-column band — it is
   * content in the layout, so it is described.
   */
  imageAlt: string
  /** Which side the photograph takes at `lg` and up. Defaults to the left. */
  imageSide?: 'left' | 'right'
  /**
   * Surface utility. Defaults to `.gradient-navy-teal`; pass one for a caller on
   * a different surface, and pass `tone` with it if that surface is light.
   */
  className?: string
  /**
   * Which way the type runs. 'dark' (the default) is light type for a dark
   * surface; 'light' is navy type, for a caller that overrides `className` with
   * a pale one.
   */
  tone?: 'dark' | 'light'
}

/**
 * A framed photograph on one side, a numbered list on the other.
 *
 * ── Why this is a component ─────────────────────────────────────────────────
 * Plans → Individuals & Families ("FOR families") and Plans → Employers ("What
 * employers believe") are the same section: a short lead, three or four
 * one-sentence convictions with painted numbers, and a photograph. They were
 * built independently — the first as a photo/navy split with the image bleeding
 * to the window edge, the second as a full-width three-column list with no
 * image at all — and the two pages are explicitly meant to read as a matched
 * pair, which two different treatments of one shape actively worked against.
 *
 * ── The photograph is INSET, and that is the change from the first version ──
 * It used to fill half the window, full height, with a straight cut down the
 * middle (the shape ImageBand still uses). It is now a rounded, shadowed frame
 * inside the section's own padding, with margin on all four sides. Two things
 * follow from that and are worth knowing before reverting it:
 *
 *   • The section can no longer be `lg:min-h-[80vh]` with an absolutely
 *     positioned image. Its height comes from its content, and the frame takes
 *     its shape from `aspect-[...]` rather than from the copy beside it — which
 *     is what stops the picture from stretching when a caller passes four items
 *     instead of three.
 *   • The asset contract changed with it. Full bleed hid an asset's edges by
 *     definition; a frame shows all four, so these slots want an ordinary opaque
 *     photograph rather than one of the dissolved or white-flattened assets the
 *     rest of the site uses. See `employersBeliefs` in assets/images.ts.
 *
 * ── The surface is a ramp, not a plate ──────────────────────────────────────
 * `.gradient-navy-teal` — straight down, #12284B held flat to 70%, then turning
 * to #0074A6 by the foot. It was a 135deg `to-br` ramp that started interpolating
 * from its first stop, which had two problems: the light end landed in a corner
 * so it read as a diagonal wash rather than as a colour changing down the band,
 * and the midpoint was already a 50/50 mix of navy and teal — a muddy slate that
 * looked like beige against the navy above it. Holding the navy for the top two
 * thirds keeps the band unambiguously navy and puts the whole turn in the last
 * third. The stops and the reasoning live in index.css.
 *
 * Every ink here is measured against the DARK end: white at 85% on #12284B is
 * 12.6:1, and on the teal end 5.9:1, so the copy passes wherever the ramp
 * happens to be under it.
 */
export default function ListBand({
  eyebrow,
  heading,
  intro,
  items,
  action,
  image,
  imageAlt,
  imageSide = 'left',
  className = 'gradient-navy-teal',
  tone = 'dark',
}: ListBandProps) {
  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const introRef = useScrollReveal<HTMLDivElement>({ y: 22, delay: 0.1 })
  const listRef = useScrollReveal<HTMLOListElement>({ y: 24, delay: 0.2 })
  const imageRef = useScrollReveal<HTMLDivElement>({ y: 40, scale: 0.96 })

  const dark = tone === 'dark'

  return (
    <section className={`px-6 py-20 sm:py-24 ${className}`}>
      <div className="mx-auto grid max-w-container items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Ordered by `order`, not by writing the two halves twice. The copy
            column is always second in the DOM, so a screen reader and a phone
            both get heading-then-picture whichever side the picture takes on a
            wide window. */}
        <div
          ref={imageRef}
          className={`opacity-0 ${imageSide === 'right' ? 'lg:order-2' : 'lg:order-1'}`}
        >
          {/* Landscape on a phone, SQUARE from `lg`. Square is the measured
              answer rather than a preference: the copy column here runs 350-500px
              depending on how many items a caller passes, and at this container
              width a 4:5 frame is ~825px — so a portrait frame left 300px of bare
              surface beside the list every time. Square lands at ~660px, which is
              the closest of the standard ratios, and it still crops a portrait
              asset gently (`object-cover object-center` trims top and bottom
              rather than cutting into the subject's sides).

              Nothing here stretches to the copy's height on purpose: a frame sized
              by its neighbour changes shape whenever the copy is edited. */}
          <div className="corner-smooth relative aspect-[4/3] overflow-hidden rounded-card shadow-card lg:aspect-square">
            <img
              src={image}
              alt={imageAlt}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </div>
        </div>

        <div className={imageSide === 'right' ? 'lg:order-1' : 'lg:order-2'}>
          {eyebrow && (
            <span
              className={`inline-block rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] ${
                dark ? 'bg-white/10 text-white/75' : 'bg-navy-800/5 text-navy-800/70'
              }`}
            >
              {eyebrow}
            </span>
          )}

          <h2
            ref={headingRef}
            className={`text-[30px] font-semibold leading-tight opacity-0 sm:text-[38px] ${
              dark ? 'text-white' : 'text-navy-800'
            } ${eyebrow ? 'mt-5' : ''}`}
          >
            {heading}
          </h2>

          {intro && (
            <div ref={introRef} className="opacity-0">
              <p
                className={`mt-6 max-w-md text-[18px] leading-[1.5] sm:text-[20px] ${
                  dark ? 'text-white/85' : 'text-navy-800/85'
                }`}
              >
                {intro}
              </p>
            </div>
          )}

          {/* An `<ol>`, not a `<ul>`: the numbers are painted, so the order has
              to be real. Same rule the tips list on Find a Doctor follows. */}
          <ol ref={listRef} className="mt-8 flex max-w-lg flex-col opacity-0">
            {items.map((item, i) => (
              <li
                key={item}
                className={`border-t py-5 last:border-b ${
                  dark ? 'border-white/15' : 'border-navy-800/10'
                }`}
              >
                <div className="flex items-baseline gap-4">
                  <span
                    className={`text-[14px] font-semibold ${dark ? 'text-gold' : 'text-gold-dark'}`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`text-[16px] leading-relaxed sm:text-[17px] ${
                      dark ? 'text-white/80' : 'text-navy-800/80'
                    }`}
                  >
                    {item}
                  </span>
                </div>
              </li>
            ))}
          </ol>

          {action && <div className="mt-9 flex flex-wrap gap-3">{action}</div>}
        </div>
      </div>
    </section>
  )
}
