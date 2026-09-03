import { ReactNode, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'

export interface AccordionFaq {
  /** Stable key. */
  id: string
  q: string
  /** One entry per paragraph. */
  a: string[]
  /** A short list inside the answer, rendered after the paragraphs. */
  points?: { label: string; body: string }[]
  action?: ReactNode
}

interface FaqAccordionProps {
  eyebrow?: string
  heading: ReactNode
  intro?: ReactNode
  /** Rendered under the intro in the sticky column. */
  action?: ReactNode
  faqs: AccordionFaq[]
  className?: string
}

/**
 * A short FAQ: a heading that stays put on the left, the questions on the right,
 * one open at a time.
 *
 * == Why this exists next to FaqExplorer ====================================
 * FaqExplorer — the For Members one — is built for forty questions in four
 * categories: it has a category rail, a scroll-spy and a search across the
 * answers. All three of those are navigation aids, and navigation aids for six
 * questions are furniture. Six fit on one screen; the visitor's problem is not
 * finding the question, it is reading the answer.
 *
 * So this is the same content type at a different scale, not a duplicate. The
 * split is the number of questions: past roughly a dozen, reach for FaqExplorer.
 *
 * == One open at a time =====================================================
 * `openId` is a single value rather than a set. With six questions the whole list
 * is one screen tall, and letting several stand open pushes the ones below off it
 * — the visitor opens a second question and the first answer scrolls away under
 * their cursor. One at a time keeps every question reachable without scrolling
 * back. (FaqExplorer makes the opposite choice for the opposite reason: with a
 * category filter already narrowing the list, comparing two answers is the whole
 * point.)
 *
 * The panels are always mounted and collapsed with `grid-template-rows: 0fr →
 * 1fr`, which is the one CSS way to animate to a height nobody has measured. The
 * inner `overflow-hidden` is what makes the clip happen; without it the row
 * collapses and the content spills.
 */
export default function FaqAccordion({
  eyebrow,
  heading,
  intro,
  action,
  faqs,
  className = 'bg-white',
}: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null)

  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const introRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.12 })
  const listRef = useScrollReveal<HTMLDivElement>({ y: 28, delay: 0.18 })

  return (
    <section className={`px-6 py-24 sm:py-28 ${className}`}>
      <div className="mx-auto grid max-w-container gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          {eyebrow && (
            <span className="inline-block rounded-full bg-navy-800/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-navy-800/70">
              {eyebrow}
            </span>
          )}
          <h2
            ref={headingRef}
            className={`max-w-md text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px] ${
              eyebrow ? 'mt-5' : ''
            }`}
          >
            {heading}
          </h2>
          {(intro || action) && (
            <div ref={introRef} className="opacity-0">
              {intro && (
                <p className="mt-6 max-w-md text-[16px] leading-relaxed text-navy-800/65 sm:text-[17px]">
                  {intro}
                </p>
              )}
              {action && <div className="mt-8 flex flex-wrap gap-3">{action}</div>}
            </div>
          )}
        </div>

        <div ref={listRef} className="opacity-0">
          <ul className="flex flex-col">
            {faqs.map((faq) => {
              const open = faq.id === openId
              return (
                <li key={faq.id} className="border-b border-navy-800/[0.12] first:border-t">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={`faq-panel-${faq.id}`}
                      onClick={() => setOpenId(open ? null : faq.id)}
                      className="group flex w-full items-start gap-5 py-6 text-left"
                    >
                      <span
                        className={`flex-1 text-[17.5px] font-semibold leading-snug transition-colors duration-300 sm:text-[19px] ${
                          open ? 'text-navy-800' : 'text-navy-800/75 group-hover:text-navy-800'
                        }`}
                      >
                        {faq.q}
                      </span>
                      {/* Two icons cross-fading rather than one rotating: a plus
                          rotated 45 degrees is a cross, not a minus, and the
                          difference is visible at this size. */}
                      <span
                        aria-hidden="true"
                        className={`corner-smooth relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] transition-colors duration-300 ${
                          open ? 'bg-gold text-navy-800' : 'bg-navy-800/5 text-navy-800/55'
                        }`}
                      >
                        <Plus
                          size={16}
                          strokeWidth={2.2}
                          className={`absolute transition-opacity duration-200 ${
                            open ? 'opacity-0' : 'opacity-100'
                          }`}
                        />
                        <Minus
                          size={16}
                          strokeWidth={2.2}
                          className={`absolute transition-opacity duration-200 ${
                            open ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={`faq-panel-${faq.id}`}
                    role="region"
                    className="grid transition-[grid-template-rows] duration-500 ease-out"
                    style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={`pb-7 pr-12 transition-opacity duration-300 ${
                          open ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        {faq.a.map((para) => (
                          <p
                            key={para}
                            className="mt-0 text-[15.5px] leading-relaxed text-navy-800/70 [&+p]:mt-4"
                          >
                            {para}
                          </p>
                        ))}

                        {faq.points && (
                          <ul className="mt-5 flex flex-col gap-3">
                            {faq.points.map((point) => (
                              <li key={point.label} className="flex items-start gap-3.5">
                                <span
                                  aria-hidden="true"
                                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                                />
                                <span className="text-[15.5px] leading-relaxed text-navy-800/70">
                                  <span className="font-semibold text-navy-800">
                                    {point.label}
                                  </span>{' '}
                                  &mdash; {point.body}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {faq.action && <div className="mt-7 flex flex-wrap gap-3">{faq.action}</div>}
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
