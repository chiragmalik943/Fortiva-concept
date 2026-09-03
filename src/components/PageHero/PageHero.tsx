import { ReactNode } from 'react'
import { useSplitReveal } from '../../hooks/useSplitReveal'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { images } from '../../assets/images'
import { HERO_TONES, type HeroTone, useDeclareHeroTone } from './heroTone'

export type { HeroTone }

interface PageHeroProps {
  /** Small caps label above the mark — usually the page's own nav label. */
  eyebrow?: string
  /** Set in regular; the setup half of the headline. */
  titleTop: ReactNode
  /** Set in bold; the payoff half. Rendered on its own line. */
  titleBottom: ReactNode
  lede?: ReactNode
  /** Buttons or links, rendered under the lede. */
  actions?: ReactNode
  /**
   * Which surface the page opens on. Defaults to `mist`, the treatment this
   * section shipped with.
   *
   * A tone is a complete set: backdrop, the surface it dissolves into, the mark's
   * ink, the eyebrow chip, both halves of the headline, the lede, and the
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
  tone = 'mist',
}: PageHeroProps) {
  const t = HERO_TONES[tone]

  // Tells the floating nav which ink it needs while it is still transparent.
  // See the note above HeroToneContext in heroTone.tsx.
  useDeclareHeroTone(tone)

  const lineOneRef = useSplitReveal<HTMLSpanElement>({ type: 'words', immediate: true, delay: 0.2 })
  const lineTwoRef = useSplitReveal<HTMLSpanElement>({ type: 'words', immediate: true, delay: 0.36 })
  const markRef = useScrollReveal<HTMLDivElement>({ y: 16, duration: 0.7, delay: 0.05, start: 'top 95%' })
  const ledeRef = useScrollReveal<HTMLDivElement>({ y: 18, duration: 0.8, delay: 0.58, start: 'top 95%' })

  return (
    <section
      className={`relative flex min-h-[72vh] flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-36 text-center sm:pb-28 sm:pt-40 ${t.surface}`}
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
          {t.mark ? (
            <span
              aria-hidden="true"
              className={`block ${MARK_SIZE} ${t.mark}`}
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
          {eyebrow && (
            <span
              className={`mt-5 inline-block rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] ${t.eyebrow}`}
            >
              {eyebrow}
            </span>
          )}
        </div>

        {/* Two spans, two weights, ONE colour. `opacity-0` here is the reveal's
            starting state, not a tint — useSplitReveal animates it to 1 — so the
            headline has no alpha on it once the page has settled. */}
        <h1 className={`mt-6 max-w-4xl sm:mt-7 ${t.title}`}>
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

        {(lede || actions) && (
          <div ref={ledeRef} className="opacity-0">
            {lede && (
              <p className={`mx-auto mt-7 max-w-3xl text-[15.5px] leading-relaxed sm:text-[17px] ${t.lede}`}>
                {lede}
              </p>
            )}
            {actions && (
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">{actions}</div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
