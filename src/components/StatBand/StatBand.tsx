import { ReactNode, useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../animations/gsap'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'

export interface Stat {
  /** The number itself, counted up to. */
  value: number
  /** Appended once the count finishes — '%' for all three of these. */
  suffix?: string
  body: ReactNode
  /** Marker tying this stat to a footnote below, e.g. '*'. */
  marker?: string
}

interface StatBandProps {
  eyebrow?: string
  heading: ReactNode
  intro?: ReactNode
  stats: Stat[]
  /** Sources. Every claim on this band is somebody else's research. */
  footnotes?: ReactNode[]
}

/**
 * Three numbers, counted up on arrival, on navy.
 *
 * The count-up writes to `textContent` from a GSAP tween on a plain proxy object
 * rather than going through React state — a counter that re-rendered per frame
 * would re-render the whole band about sixty times a second for no benefit, and
 * the number is a leaf node with nothing else depending on it.
 *
 * `tabular-nums` matters more than it looks: without it the digits have
 * different widths, so a number counting from 0 to 95 visibly jitters sideways
 * the whole way up.
 *
 * The footnotes are not decoration. Every figure here is somebody else's
 * published research, and the copy doc cites all of it — so the citations ship
 * with the numbers, in the same section, rather than being dropped because they
 * are inconvenient to lay out.
 */
export default function StatBand({ eyebrow, heading, intro, stats, footnotes }: StatBandProps) {
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([])
  const gridRef = useRef<HTMLDivElement>(null)

  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const introRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.12 })
  const notesRef = useScrollReveal<HTMLDivElement>({ y: 16, delay: 0.1 })

  useEffect(() => {
    const write = (el: HTMLSpanElement | null, n: number) => {
      if (el) el.textContent = String(Math.round(n))
    }

    if (prefersReducedMotion) {
      stats.forEach((stat, i) => write(valueRefs.current[i], stat.value))
      return
    }

    const ctx = gsap.context(() => {
      stats.forEach((stat, i) => {
        const el = valueRefs.current[i]
        if (!el) return
        const proxy = { n: 0 }
        gsap.to(proxy, {
          n: stat.value,
          duration: 1.5,
          delay: i * 0.12,
          ease: 'power2.out',
          onUpdate: () => write(el, proxy.n),
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%', once: true },
        })
      })
    }, gridRef)

    return () => ctx.revert()
  }, [stats])

  return (
    <section className="bg-navy-800 px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-container">
        {eyebrow && (
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-white/70">
            {eyebrow}
          </span>
        )}
        <h2
          ref={headingRef}
          className={`max-w-2xl text-[30px] font-semibold leading-tight text-white opacity-0 sm:text-[38px] ${
            eyebrow ? 'mt-5' : ''
          }`}
        >
          {heading}
        </h2>
        {intro && (
          <div ref={introRef} className="opacity-0">
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-white/65 sm:text-[17px]">
              {intro}
            </p>
          </div>
        )}

        <div ref={gridRef} className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="border-t border-white/15 pt-7">
              <p className="flex items-start text-[54px] font-semibold leading-none text-gold sm:text-[64px]">
                <span ref={(el) => (valueRefs.current[i] = el)} className="tabular-nums">
                  0
                </span>
                {stat.suffix && <span>{stat.suffix}</span>}
                {stat.marker && (
                  <span className="ml-1 mt-1 text-[20px] font-normal text-gold/70">
                    {stat.marker}
                  </span>
                )}
              </p>
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/70">{stat.body}</p>
            </div>
          ))}
        </div>

        {footnotes && footnotes.length > 0 && (
          <div ref={notesRef} className="mt-14 flex flex-col gap-2 opacity-0">
            {footnotes.map((note, i) => (
              <p key={i} className="max-w-3xl text-[12.5px] leading-relaxed text-white/40">
                {note}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
