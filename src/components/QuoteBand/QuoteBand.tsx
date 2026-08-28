import { ReactNode } from 'react'
import { images } from '../../assets/images'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'

interface QuoteBandProps {
  eyebrow?: string
  /** The line itself. Rendered at display size, in quotation marks. */
  quote: ReactNode
  /** The sentence or two that unpacks it. */
  body?: ReactNode
  action?: ReactNode
}

/**
 * One sentence, given a whole band.
 *
 * The copy doc hands the broker overview a promise — "FOR the member. Always." —
 * and it is the shortest thing on the page and the most important. A short line
 * inside a normal section reads as a section that ran out of copy, so this gives
 * it the one treatment that makes brevity look deliberate: a dark plate, the mark
 * above it, and nothing else competing for the width.
 *
 * == Navy, and where it is allowed to sit =================================
 * This is the dark plate in the broker section's light / dark / light rhythm, and
 * it can be navy for the same reason CtaBand's mid-page bands can: something light
 * follows it. It must never be the LAST band on a page — the footer is navy-800
 * and opens with a CTA of its own, so two navy blocks with no seam read as one
 * enormous slab. See the note in CtaBand.tsx, which is the same rule.
 *
 * == The quotation marks are typographic, not decorative ==================
 * They are part of the string the caller passes rather than pseudo-elements,
 * because a caller sometimes wants them and sometimes doesn't — the promise is a
 * quotation, "FOR the future of health insurance" is not — and a band that always
 * draws them would need a prop to turn them off.
 */
export default function QuoteBand({ eyebrow, quote, body, action }: QuoteBandProps) {
  const markRef = useScrollReveal<HTMLImageElement>({ y: 14, duration: 0.7 })
  const quoteRef = useSplitReveal<HTMLParagraphElement>({ type: 'words' })
  const restRef = useScrollReveal<HTMLDivElement>({ y: 22, delay: 0.2 })

  return (
    <section className="bg-navy-800 px-6 py-24 text-center sm:py-32">
      <div className="mx-auto flex max-w-3xl flex-col items-center">
        {/* Plain <img>, untinted — ftva-icn.svg owns its own colour. Same note as
            Hero.tsx and PageHero.tsx. */}
        <img
          ref={markRef}
          src={images.icon}
          alt=""
          aria-hidden="true"
          className="block h-12 w-auto opacity-0 sm:h-14"
        />

        {eyebrow && (
          <span className="mt-6 inline-block rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-white/70">
            {eyebrow}
          </span>
        )}

        <p
          ref={quoteRef}
          className="mt-7 text-[28px] font-semibold leading-[1.25] text-white opacity-0 sm:text-[42px]"
        >
          {quote}
        </p>

        {(body || action) && (
          <div ref={restRef} className="opacity-0">
            {body && (
              <p className="mx-auto mt-7 max-w-2xl text-[16px] leading-relaxed text-white/65 sm:text-[17px]">
                {body}
              </p>
            )}
            {action && (
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">{action}</div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
