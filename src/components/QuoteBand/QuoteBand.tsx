import { ReactNode } from 'react'
import { images } from '../../assets/images'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'

interface QuoteBandProps {
  /** The line itself. Rendered at display size. */
  quote: ReactNode
  /** The sentence or two that unpacks it. */
  body?: ReactNode
  action?: ReactNode
  /**
   * Small caps over the line — the section's name, not a sentence. Only the
   * `gold` tone draws it; see the note on the ornament below for why.
   */
  label?: string
  /**
   * `navy` (the default) is the dark plate this band shipped as. `gold` is the
   * brand's gold field with the ornament above and below the words — see the
   * docblock.
   */
  tone?: 'navy' | 'gold'
}

/**
 * One sentence, given a whole band.
 *
 * The copy doc hands the broker overview a promise — "FOR the member. Always." —
 * and it is the shortest thing on the page and the most important. A short line
 * inside a normal section reads as a section that ran out of copy, so this gives
 * it the one treatment that makes brevity look deliberate: a field of its own,
 * and nothing competing for the width.
 *
 * ── Two tones, and they are not interchangeable ─────────────────────────────
 *
 * `navy` — the dark plate, with the Fortiva mark over the line. It can be navy
 * for the same reason CtaBand's mid-page bands can: something light follows it.
 * It must never be the LAST band on a page — the footer is navy-800 and opens
 * with a CTA of its own, so two navy blocks with no seam read as one enormous
 * slab. See the note in CtaBand.tsx, which is the same rule.
 *
 * `gold` — the brand's gold, with the flourish ornament above and below and no
 * mark. The rule it has to keep is the mirror of navy's: the gold CtaBand is the
 * usual way a page closes, so a `gold` QuoteBand must not sit directly against
 * one or the two merge into a single slab with a gap in the middle. Broker
 * Overview re-tones its closing band for exactly that reason.
 *
 * ── The ornament is masked, not drawn ───────────────────────────────────────
 * flourish.svg is a single-colour (#D6AC68) ribbon, which is invisible on gold.
 * It is used as a MASK here and the colour comes from a background utility —
 * the same trick PageHero uses on the mark, and available for the same reason:
 * the artwork is single-colour, so its alpha is all a mask needs.
 *
 * It is 1529 x 91, a 17:1 ribbon, so the width it is given is the only thing
 * setting its weight. At 200px it draws ~12px tall, which is a mark above the
 * line rather than a rule across it. Same reasoning as the pair on About.
 *
 * ── The quotation marks are typographic, not decorative ─────────────────────
 * They are part of the string the caller passes rather than pseudo-elements,
 * because a caller sometimes wants them and sometimes doesn't — and a band that
 * always drew them would need a prop to turn them off.
 */

const TONES = {
  navy: {
    section: 'bg-navy-800',
    quote: 'text-white',
    body: 'text-white/65',
    label: 'text-white/60',
    ornament: 'bg-white/45',
  },
  gold: {
    section: 'bg-gold',
    /* Navy on gold measures 7.0:1 and white 2.1:1, so the LINE carries the navy
       and a caller spends the white on the two or three words that can afford
       it. Same exception, and the same arithmetic, as the gold CtaBand. */
    quote: 'text-navy-800',
    body: 'text-navy-800/85',
    label: 'text-navy-800/85',
    ornament: 'bg-white/85',
  },
} as const

/** The ornament, at the weight described in the docblock. */
function Flourish({ tint, flip = false }: { tint: string; flip?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`block h-3 w-[200px] select-none ${tint} ${flip ? 'scale-y-[-1]' : ''}`}
      style={{
        maskImage: `url(${images.flourish})`,
        WebkitMaskImage: `url(${images.flourish})`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
  )
}

export default function QuoteBand({ quote, body, action, label, tone = 'navy' }: QuoteBandProps) {
  const t = TONES[tone]
  const gold = tone === 'gold'

  const markRef = useScrollReveal<HTMLDivElement>({ y: 14, duration: 0.7 })
  const quoteRef = useSplitReveal<HTMLParagraphElement>({ type: 'words' })
  const restRef = useScrollReveal<HTMLDivElement>({ y: 22, delay: 0.2 })

  return (
    <section className={`px-6 py-24 text-center sm:py-32 ${t.section}`}>
      <div className="mx-auto flex max-w-3xl flex-col items-center">
        <div ref={markRef} className="flex flex-col items-center opacity-0">
          {label && (
            <p className={`text-[11px] font-bold uppercase tracking-[0.22em] ${t.label}`}>
              {label}
            </p>
          )}

          {gold ? (
            <div className={label ? 'mt-6' : ''}>
              <Flourish tint={t.ornament} />
            </div>
          ) : (
            /* Plain <img>, untinted — ftva-icn.svg owns its own colour. Same note
               as Hero.tsx and PageHero.tsx. */
            <img
              src={images.icon}
              alt=""
              aria-hidden="true"
              className="block h-12 w-auto sm:h-14"
            />
          )}
        </div>

        <p
          ref={quoteRef}
          className={`mt-7 text-[28px] font-bold leading-[1.25] opacity-0 sm:text-[42px] ${t.quote}`}
        >
          {quote}
        </p>

        {(body || action) && (
          <div ref={restRef} className="flex flex-col items-center opacity-0">
            {body && (
              <p className={`mx-auto mt-6 max-w-xl text-[16px] leading-relaxed sm:text-[17px] ${t.body}`}>
                {body}
              </p>
            )}

            {/* The closing half of the frame. Only `gold` draws it, and only when
                there is something under it to close off — a lone ornament under
                the last line is a rule, not a frame. */}
            {gold && action && (
              <div className="mt-10">
                <Flourish tint={t.ornament} flip />
              </div>
            )}

            {action && (
              <div className={`flex flex-wrap items-center justify-center gap-3 ${gold ? 'mt-8' : 'mt-9'}`}>
                {action}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
