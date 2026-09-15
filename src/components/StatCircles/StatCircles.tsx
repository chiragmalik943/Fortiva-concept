import { ReactNode, useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../animations/gsap'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'

export interface CircleStat {
  /** The number itself, counted up to once its circle is open. */
  value: number
  /** Appended once the count finishes — '%' for all three of these. */
  suffix?: string
  body: ReactNode
  /** Marker tying this stat to a footnote below, e.g. '*'. */
  marker?: string
  /** The photograph inside the disc. */
  image?: string
}

interface StatCirclesProps {
  heading: ReactNode
  intro?: ReactNode
  stats: CircleStat[]
  /** Sources. Every claim on this band is somebody else's research. */
  footnotes?: ReactNode[]
}

/**
 * Three numbers, each inside a photographic disc, on navy.
 *
 * ── The photographs arrive finished, and the code no longer touches them ────
 * The discs were built to MAKE their pictures duotone: a teal field with the
 * photograph over it at `mix-blend-luminosity`, plus a gradient to hold the type
 * off its lights. The delivered assets already carry all of it — circular,
 * cropped, toned, and dark enough under the numbers — so every one of those
 * layers has come off. Stacking the treatment on an asset that already has it
 * only doubles the tint and buries the picture.
 *
 * Which changes what these slots expect. They are no longer ordinary
 * photographs: a replacement has to arrive with the same circular crop and the
 * same blue tone, or it will be the only untinted disc in the row. See
 * `virtualCareStats` in assets/images.ts.
 *
 * ── The animation is a sequence, not three reveals ──────────────────────────
 * One ScrollTrigger on the row, and a timeline per disc offset by `STAGGER`.
 * Each disc scales up from nothing IN PLACE, and only once it has finished does
 * its number and its sentence arrive — the number counting from zero as it fades
 * in. So the three read left to right as one movement rather than as three things
 * that happened to animate at once.
 *
 * The grid cell is what holds the row's shape, not the disc: the disc scales
 * inside a cell that is already its full size, so nothing reflows as the sequence
 * runs and the two discs still to come leave their space empty rather than
 * letting their neighbours spread into it.
 *
 * `once: true` — this plays on arrival and stays played. A sequence this long
 * that replayed every time the section came back into view would re-empty a
 * section the visitor had already read.
 *
 * Under `prefers-reduced-motion` everything is drawn open, with the numbers
 * written straight in. The count-up writes to `textContent` from a tween on a
 * plain proxy rather than through React state, for the reason recorded in
 * StatBand.tsx: a counter that re-rendered per frame would re-render the whole
 * band about sixty times a second for no benefit.
 */

/** How far apart the three discs start, in seconds. */
const STAGGER = 0.5

export default function StatCircles({ heading, intro, stats, footnotes }: StatCirclesProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const discRefs = useRef<(HTMLDivElement | null)[]>([])
  const copyRefs = useRef<(HTMLDivElement | null)[]>([])
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([])

  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const introRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.12 })
  const notesRef = useScrollReveal<HTMLDivElement>({ y: 16, delay: 0.1 })

  useEffect(() => {
    const write = (el: HTMLSpanElement | null, n: number) => {
      if (el) el.textContent = String(Math.round(n))
    }

    if (prefersReducedMotion) {
      stats.forEach((stat, i) => {
        write(valueRefs.current[i], stat.value)
        gsap.set([discRefs.current[i], copyRefs.current[i]], { autoAlpha: 1, scale: 1, y: 0 })
      })
      return
    }

    const ctx = gsap.context(() => {
      stats.forEach((stat, i) => {
        const disc = discRefs.current[i]
        const copy = copyRefs.current[i]
        if (!disc || !copy) return

        // Set before the trigger exists, so nothing is ever painted at full
        // size and then yanked back to nothing on the first frame.
        gsap.set(disc, { scale: 0.05, autoAlpha: 0, transformOrigin: 'center center' })
        gsap.set(copy, { autoAlpha: 0, y: 12 })

        const proxy = { n: 0 }
        gsap
          .timeline({
            delay: i * STAGGER,
            scrollTrigger: { trigger: gridRef.current, start: 'top 78%', once: true },
          })
          .to(disc, { scale: 1, autoAlpha: 1, duration: 0.75, ease: 'back.out(1.35)' })
          .to(copy, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' })
          .to(
            proxy,
            {
              n: stat.value,
              duration: 1.1,
              ease: 'power2.out',
              onUpdate: () => write(valueRefs.current[i], proxy.n),
            },
            '<',
          )
      })
    }, gridRef)

    return () => ctx.revert()
  }, [stats])

  return (
    <section className="bg-navy-800 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-container">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            ref={headingRef}
            className="text-[30px] font-semibold leading-tight text-white opacity-0 sm:text-[38px]"
          >
            {heading}
          </h2>
          {intro && (
            <div ref={introRef} className="opacity-0">
              <p className="mt-6 text-[16px] leading-relaxed text-white/70 sm:text-[17px]">
                {intro}
              </p>
            </div>
          )}
        </div>

        {/* One column on a phone, three from `sm`. The discs are capped at 340px
            so the row does not turn into three enormous circles on a wide
            window, and centred in their cells so the caps read as spacing. */}
        <div
          ref={gridRef}
          className="mt-16 grid justify-items-center gap-12 sm:mt-20 sm:grid-cols-3 sm:gap-6 lg:gap-10"
        >
          {stats.map((stat, i) => (
            <div key={i} className="w-full max-w-[340px]">
              <div
                ref={(el) => (discRefs.current[i] = el)}
                /* No field colour behind the picture. A tinted disc under an
                   asset whose own circle is a pixel short would show as a ring
                   around it, and there is nothing left for it to stand in for. */
                className="relative aspect-square overflow-hidden rounded-full opacity-0"
              >
                {stat.image && (
                  <img
                    src={stat.image}
                    alt=""
                    aria-hidden="true"
                    /* These slots ship before the photographs do, and a missing
                       file would draw the browser's broken-image glyph in the
                       middle of the disc. Hidden, the teal field is the disc. */
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                    className="absolute inset-0 h-full w-full select-none object-cover"
                  />
                )}

                <div
                  ref={(el) => (copyRefs.current[i] = el)}
                  className="absolute inset-0 flex flex-col items-center justify-center px-9 text-center opacity-0 sm:px-7 lg:px-9"
                >
                  <p className="flex items-start text-[56px] font-bold leading-none text-gold sm:text-[52px] lg:text-[64px]">
                    {/* `tabular-nums` matters more than it looks: without it the
                        digits have different widths, so a number counting from 0
                        to 95 visibly jitters sideways the whole way up. */}
                    <span ref={(el) => (valueRefs.current[i] = el)} className="tabular-nums">
                      0
                    </span>
                    {stat.suffix && <span>{stat.suffix}</span>}
                    {stat.marker && (
                      <span className="ml-0.5 mt-1 text-[18px] font-normal text-gold/80">
                        {stat.marker}
                      </span>
                    )}
                  </p>
                  <p className="mt-4 max-w-[230px] text-[13.5px] leading-relaxed text-white/90 sm:text-[13px] lg:text-[14px]">
                    {stat.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {footnotes && footnotes.length > 0 && (
          <div ref={notesRef} className="mt-16 flex flex-col items-center gap-2 opacity-0">
            {footnotes.map((note, i) => (
              <p key={i} className="max-w-3xl text-center text-[12.5px] leading-relaxed text-white/45">
                {note}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
