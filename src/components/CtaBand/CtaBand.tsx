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
  /* ── The heading is white on gold, and that is a deliberate exception ──────
     This band used to run the emphasis entirely in navy: the accent at full
     strength and the rest of the heading held back to 70%. That was a contrast
     decision. Gold's relative luminance is 0.446, so white type on it measures
     2.1:1 — under the 3:1 that even display-size text needs — while navy-800 on
     the same gold is 7.0:1.

     White is the client's call, made with the number in front of them: the
     heading reads far better as white with one navy phrase than as two weights of
     navy, and this is one short display line rather than anything anyone has to
     read at length. Recorded here rather than quietly reversed, because the next
     person to look at it will otherwise "fix" it back.

     If it ever has to pass: no gold in the palette carries white at 3:1 (even
     `gold-dark` only reaches 2.8:1). It would take a deeper gold — around
     #A97F42, where white measures 3.6:1 and navy still measures 4.1:1 — so the
     fix is the band's colour, not this line.

     Everything else on gold stays navy. Body copy sits at 80% for 4.7:1, because
     paragraph text needs the full 4.5:1 and there is no display-size exemption
     for it. */
  gold: {
    section: 'bg-gold',
    heading: 'text-white',
    accent: 'text-navy-800',
    body: 'text-navy-800/80',
    note: 'text-navy-800/80',
  },
  /* The `cream` tokens are white now (see tailwind.config.js), so a tinted
     mid-page band writes its grey literally — same value and same reasoning as
     StepFlow's `cream` surface. */
  cream: {
    section: 'bg-[#CCD0D2]',
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
              tone === 'navy' ? 'bg-white/10 text-white/70' : 'bg-navy-800/[0.08] text-navy-800/85'
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
