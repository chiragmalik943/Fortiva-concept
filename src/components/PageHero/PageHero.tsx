import { ReactNode } from 'react'
import { useSplitReveal } from '../../hooks/useSplitReveal'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { images } from '../../assets/images'
import { HERO_TONES, type HeroTone, useDeclareHeroTone } from './heroTone'

export type { HeroTone }

interface PageHeroProps {
  /** A small uppercase kicker label rendered above the headline, naming the page's own topic. */
  eyebrow?: ReactNode
  /** Set in regular; the setup half of the headline. */
  titleTop: ReactNode
  /** Set in bold; the payoff half. Rendered on its own line. */
  titleBottom: ReactNode
  lede?: ReactNode
  /** Buttons or links, rendered under the lede. */
  actions?: ReactNode
  /** Small print rendered after the actions — footnotes, disclaimers, "how to get started" copy. */
  note?: ReactNode
  /**
   * Which surface the page opens on. Defaults to `mist`, the treatment this
   * section shipped with.
   *
   * A tone is a complete set: backdrop, the surface it dissolves into, the mark's
   * ink, both halves of the headline, the lede, and the
   * floating nav's own logo and link ink. See HERO_TONES in heroTone.tsx.
   *
   * The one thing it does NOT own is the buttons, because those are passed in as
   * `actions`. Every tone pairs a `gold` or `dark` primary with a `white`
   * secondary — the table in heroTone.tsx says which — and a call site states
   * both. Wiring them here would mean cloning arbitrary children to override a
   * prop, which breaks the moment an ActionButton or a plain link is passed
   * instead of a Button.
   */
  tone?: HeroTone
  /**
   * Overrides the tone's own mark colour (`HERO_TONES[tone].mark`) for this
   * hero only — a Tailwind background utility such as `'bg-gold'`, used the same
   * way the mask in this file already uses the tone's own mark class. Lets a
   * handful of pages repaint the mark without forking the whole tone, which
   * would also touch the surface, nav ink and everything else the tone owns.
   */
  markClassName?: string
}

/* ── There is no backdrop mask any more, and that was the point ──────────────
   Every hero used to fade its backdrop out across the bottom third of the
   section — `linear-gradient(180deg, #000 0%, #000 48%, rgba(0,0,0,0.5) 74%,
   transparent 100%)` as a mask, plus a cream wash over the top on `mist` — so the
   section dissolved into whatever came next instead of ending.

   Both are gone. The backdrop is painted flat, corner to corner, and the hero
   ends on a hard edge against the section below it. Two consequences to keep in
   mind if either is ever added back:

   • Each tone's `surface` is now only a fallback colour behind the image, so it
     is flat and matches the backdrop's field. A ramp there would be invisible.
   • The backdrops have to carry their own low contrast, because nothing is
     lifting the type off them any more. See the note on `heroBgGold` and friends
     in assets/images.ts. */

/** ftva-icn.svg's own aspect ratio, 69 x 88, at the two sizes the mark is drawn. */
const MARK_SIZE = 'h-16 w-[50px] sm:h-[84px] sm:w-[66px]'

/**
 * The interior-page counterpart to the homepage Hero: same backdrop treatment,
 * same mark, same two-weight headline, ~70vh instead of a full screen so an
 * inner page gets to its content faster.
 *
 * Extracted as a component rather than copied into the About page because the
 * remaining pages in the IA all open the same way — this is the one place their
 * hero treatment should live, which is also what made the four-tone pass a change
 * to one file rather than to nineteen.
 */
export default function PageHero({
  eyebrow,
  titleTop,
  titleBottom,
  lede,
  actions,
  note,
  tone = 'mist',
  markClassName,
}: PageHeroProps) {
  const t = HERO_TONES[tone]
  const markClass = markClassName ?? t.mark

  // Tells the floating nav which ink it needs while it is still transparent.
  // See the note above HeroToneContext in heroTone.tsx.
  useDeclareHeroTone(tone)

  const lineOneRef = useSplitReveal<HTMLSpanElement>({ type: 'words', immediate: true, delay: 0.2 })
  const lineTwoRef = useSplitReveal<HTMLSpanElement>({ type: 'words', immediate: true, delay: 0.36 })
  const markRef = useScrollReveal<HTMLDivElement>({ y: 16, duration: 0.7, delay: 0.05, start: 'top 95%' })
  const eyebrowRef = useScrollReveal<HTMLParagraphElement>({ y: 12, duration: 0.6, delay: 0.16, start: 'top 95%' })
  const ledeRef = useScrollReveal<HTMLDivElement>({ y: 18, duration: 0.8, delay: 0.58, start: 'top 95%' })

  return (
    <section
      /* FULL VIEWPORT from `lg`, 72vh below it. The interior heroes used to be
         72vh everywhere, on the reasoning that an inner page should reach its
         content sooner than the homepage does — but that left every one of them
         ending a little way up the screen, so the first thing a desktop visitor
         saw was a hero with the top of the next section already pushing into it.
         They are the homepage's height now and the page below them starts below
         the fold, which is the composition the homepage has always had.

         `min-h-screen` rather than `h-screen`: the padding and the content still
         set the height wherever they need more than a screen, so a long lede or a
         wrapped headline grows the section instead of overflowing it. Under `lg`
         it stays 72vh — a phone screen is mostly vertical and a full-height hero
         there is a whole scroll before anything is said. */
      className={`relative flex min-h-[72vh] flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-36 text-center sm:pb-28 sm:pt-40 lg:min-h-screen ${t.surface}`}
    >
      {/* The backdrop, edge to edge. `object-cover` with a top-biased position
          keeps the arcs' crossing point in frame on short, wide viewports rather
          than centring on empty field. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
        <img
          src={t.backdrop}
          alt=""
          className="h-full w-full object-cover object-[center_35%]"
        />
      </div>

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center">
        <div ref={markRef} className="flex flex-col items-center opacity-0">
          {/* Two ways to draw one mark, and which one is used is the tone's call.
              On mist the artwork's own gold is right and it is a plain <img>. On
              the other three it is repainted, which means the SVG is used as a
              mask and the colour comes from a background utility — the artwork is
              single-colour, so nothing is lost. See `mark` in heroTone.tsx. */}
          {markClass ? (
            <span
              aria-hidden="true"
              className={`block ${MARK_SIZE} ${markClass}`}
              style={{
                maskImage: `url(${images.icon})`,
                WebkitMaskImage: `url(${images.icon})`,
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
              }}
            />
          ) : (
            <img
              src={images.icon}
              alt=""
              aria-hidden="true"
              className="block h-16 w-auto sm:h-[84px]"
            />
          )}
        </div>

        {eyebrow && (
          <p
            ref={eyebrowRef}
            className={`mt-6 text-xs font-semibold uppercase tracking-[0.2em] opacity-0 sm:mt-7 sm:text-[13px] ${t.lede}`}
          >
            {eyebrow}
          </p>
        )}

        {/* Two spans, two weights, ONE colour. `opacity-0` here is the reveal's
            starting state, not a tint — useSplitReveal animates it to 1 — so the
            headline has no alpha on it once the page has settled. */}
        <h1 className={`${eyebrow ? 'mt-3' : 'mt-6 sm:mt-7'} max-w-4xl ${t.title}`}>
          <span
            ref={lineOneRef}
            className="block text-[36px] font-normal leading-[1.4] tracking-tight opacity-0 sm:text-[48px] lg:text-[58px]"
          >
            {titleTop}
          </span>
          <span
            ref={lineTwoRef}
            className="block text-[36px] font-bold leading-[1.4] tracking-tight opacity-0 sm:text-[48px] lg:text-[58px]"
          >
            {titleBottom}
          </span>
        </h1>

        {(lede || actions || note) && (
          <div ref={ledeRef} className="opacity-0">
            {lede && (
              <p className={`mx-auto mt-7 max-w-3xl text-[15.5px] leading-relaxed sm:text-[17px] ${t.lede}`}>
                {lede}
              </p>
            )}
            {actions && (
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">{actions}</div>
            )}
            {note && (
              <p className={`mx-auto mt-7 max-w-2xl text-[13.5px] leading-relaxed ${t.lede}`}>{note}</p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
