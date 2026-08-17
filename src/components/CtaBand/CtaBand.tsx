import { ReactNode } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'

interface CtaBandProps {
  eyebrow?: string
  heading: ReactNode
  body?: ReactNode
  actions?: ReactNode
  /** Small print under the buttons — footnotes, disclaimers, hours. */
  note?: ReactNode
  tone?: 'navy' | 'gold' | 'cream'
}

/**
 * The closing plate every For Members page ends on. Six pages landed at once and
 * all six needed the same shape — a short heading, a line of copy and one or two
 * buttons — so it is a component rather than six near-identical copies that
 * would drift apart on the first edit.
 *
 * ── One hard rule about `tone` ──────────────────────────────────────────────
 * The LAST band on a page is never `navy`, because the footer is navy-800 and the
 * footer opens with a closing CTA of its own. Two navy CTA blocks stacked with no
 * seam between them read as one enormous dark slab and the page's own ask
 * disappears into the site chrome — which is exactly why the homepage's contact
 * form moved off navy onto gold. So every For Members page closes on gold, which
 * makes light → gold → navy the site's closing signature rather than an accident.
 *
 * `navy` and `cream` are for mid-page bands, where whatever sits below them
 * provides the seam.
 */
const TONES = {
  navy: {
    section: 'bg-navy-800',
    heading: 'text-white',
    accent: 'text-gold',
    body: 'text-white/65',
    note: 'text-white/40',
  },
  /* Nothing on gold is white, and that is a contrast decision rather than a
     stylistic one. Gold's relative luminance is 0.443, so white type on it
     measures 2.1:1 — under the 3:1 that even large text needs. Navy-800 on the
     same gold is 6.8:1, so the emphasis runs the other way here: the accent is
     FULL navy and the rest of the heading is held back to 70% (3.8:1, which
     clears 3:1 for display sizes). Body copy sits at 80% for 4.7:1, since
     paragraph text needs the full 4.5:1. */
  gold: {
    section: 'bg-gold',
    heading: 'text-navy-800/70',
    accent: 'text-navy-800',
    body: 'text-navy-800/80',
    note: 'text-navy-800/80',
  },
  cream: {
    section: 'bg-cream-soft',
    heading: 'text-navy-800',
    accent: 'text-gold-dark',
    body: 'text-navy-800/65',
    note: 'text-navy-800/45',
  },
} as const

export default function CtaBand({
  eyebrow,
  heading,
  body,
  actions,
  note,
  tone = 'navy',
}: CtaBandProps) {
  const t = TONES[tone]
  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const restRef = useScrollReveal<HTMLDivElement>({ y: 22, delay: 0.14 })

  return (
    <section className={`px-6 py-24 text-center sm:py-28 ${t.section}`}>
      <div className="mx-auto max-w-3xl">
        {eyebrow && (
          <span
            className={`inline-block rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] ${
              tone === 'navy' ? 'bg-white/10 text-white/70' : 'bg-navy-800/8 text-navy-800/85'
            }`}
          >
            {eyebrow}
          </span>
        )}
        <h2
          ref={headingRef}
          className={`text-[30px] font-semibold leading-tight opacity-0 sm:text-[38px] ${t.heading} ${
            eyebrow ? 'mt-5' : ''
          }`}
        >
          {heading}
        </h2>

        <div ref={restRef} className="opacity-0">
          {body && (
            <p className={`mx-auto mt-6 max-w-xl text-[16px] leading-relaxed sm:text-[17px] ${t.body}`}>
              {body}
            </p>
          )}
          {actions && (
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">{actions}</div>
          )}
          {note && <p className={`mt-7 text-[13px] leading-relaxed ${t.note}`}>{note}</p>}
        </div>
      </div>
    </section>
  )
}

/** Exported so a caller can tint an inline accent to match its band. */
export const ctaAccent = (tone: keyof typeof TONES) => TONES[tone].accent
