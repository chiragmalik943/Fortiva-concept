import { ReactNode, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Search, X } from 'lucide-react'
import { type MemberFaq } from '../../content/site'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'
import Button from '../Button'

interface FaqExplorerProps {
  eyebrow?: string
  heading: ReactNode
  intro?: ReactNode
  faqs: MemberFaq[]
  /** Rendered when a search matches nothing. */
  emptyAction?: ReactNode
}

/**
 * The full FAQ list, with a filter and a sticky index beside it.
 *
 * ── Why a filter on eight questions ──────────────────────────────────────────
 * Because it searches the ANSWERS as well as the questions, which is the thing a
 * plain accordion can't do — someone who arrives having heard the name "Detego
 * Health", or wanting to know about "preventive care", finds it by typing rather
 * than by opening eight panels to look. It costs one `useMemo` and no network.
 *
 * ── Why the open item is keyed by question text, not index ───────────────────
 * Filtering reorders the list. With an index, typing a query would leave "3"
 * open and silently reveal whichever question had shuffled into third place;
 * keyed by text, the open answer stays the one the visitor opened, or closes
 * cleanly when it's filtered out.
 *
 * The index rail is `lg`-only. It's a navigational luxury that needs a viewport
 * tall enough to show the whole list beside the answers; on a phone the
 * accordion IS the index.
 */
export default function FaqExplorer({
  eyebrow,
  heading,
  intro,
  faqs,
  emptyAction,
}: FaqExplorerProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<string | null>(faqs[0]?.q ?? null)

  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const introRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.12 })

  // The original position is carried through so numbering stays stable while
  // filtering — question 6 is still labelled 06 when it's the only match.
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    const indexed = faqs.map((faq, i) => ({ faq, n: i + 1 }))
    if (!q) return indexed
    return indexed.filter(
      ({ faq }) =>
        faq.q.toLowerCase().includes(q) ||
        faq.a.some((para) => para.toLowerCase().includes(q)),
    )
  }, [faqs, query])

  return (
    <section className="bg-white px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-container">
        {eyebrow && (
          <span className="inline-block rounded-full bg-navy-800/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-navy-800/70">
            {eyebrow}
          </span>
        )}
        <h2
          ref={headingRef}
          className={`max-w-2xl text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px] ${
            eyebrow ? 'mt-5' : ''
          }`}
        >
          {heading}
        </h2>

        <div ref={introRef} className="opacity-0">
          {intro && (
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-navy-800/65 sm:text-[17px]">
              {intro}
            </p>
          )}

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <div className="relative w-full max-w-sm">
              <Search
                size={17}
                strokeWidth={2}
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy-800/40"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search the questions and answers"
                placeholder="Search questions and answers"
                className="corner-smooth w-full rounded-[14px] border border-navy-800/15 bg-cream-soft py-3 pl-11 pr-11 text-[15px] text-navy-800 transition-colors placeholder:text-navy-800/35 focus:border-navy-800/40 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-navy-800/45 transition-colors hover:bg-navy-800/8 hover:text-navy-800"
                >
                  <X size={15} strokeWidth={2.25} />
                </button>
              )}
            </div>
            <p aria-live="polite" className="text-[14px] text-navy-800/50">
              {matches.length} of {faqs.length} questions
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1.38fr)] lg:gap-16">
          {/* ── index rail ─────────────────────────────────────────────── */}
          <nav aria-label="All questions" className="hidden lg:sticky lg:top-32 lg:block lg:self-start">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/45">
              On this page
            </p>
            <ul className="mt-5 flex flex-col gap-1">
              {matches.map(({ faq, n }) => {
                const isOpen = open === faq.q
                return (
                  <li key={faq.q}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : faq.q)}
                      aria-current={isOpen ? 'true' : undefined}
                      className={`corner-smooth flex w-full items-start gap-3 rounded-[12px] px-3 py-2.5 text-left text-[14px] leading-snug transition-colors ${
                        isOpen
                          ? 'bg-navy-800 text-cream-soft'
                          : 'text-navy-800/60 hover:bg-navy-800/5 hover:text-navy-800'
                      }`}
                    >
                      <span
                        className={`mt-px shrink-0 text-[12px] font-semibold ${
                          isOpen ? 'text-gold' : 'text-navy-800/35'
                        }`}
                      >
                        {String(n).padStart(2, '0')}
                      </span>
                      {faq.q}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* ── answers ────────────────────────────────────────────────── */}
          <div>
            {matches.length === 0 ? (
              <div className="corner-smooth rounded-card bg-cream-soft p-9 text-center">
                <h3 className="text-[20px] font-semibold text-navy-800">
                  Nothing matches &ldquo;{query.trim()}&rdquo;
                </h3>
                <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-navy-800/60">
                  Try a shorter phrase &mdash; or ask us directly and a member of the team will
                  answer.
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <Button variant="ghost" onClick={() => setQuery('')}>
                    Clear search
                  </Button>
                  {emptyAction}
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                {matches.map(({ faq, n }) => {
                  const isOpen = open === faq.q
                  return (
                    <div key={faq.q} className="border-b border-navy-800/10 first:border-t">
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : faq.q)}
                        aria-expanded={isOpen}
                        className="flex w-full items-start justify-between gap-6 py-6 text-left"
                      >
                        <span className="flex items-start gap-4">
                          <span className="mt-1 text-[13px] font-semibold text-gold-dark">
                            {String(n).padStart(2, '0')}
                          </span>
                          <span className="text-[16.5px] font-medium leading-snug text-navy-800 sm:text-[18px]">
                            {faq.q}
                          </span>
                        </span>
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-soft">
                          <Plus
                            size={16}
                            className="text-navy-800 transition-transform duration-300"
                            style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                          />
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="max-w-2xl pb-7 pl-0 sm:pl-9">
                              {faq.a.map((para, pi) => (
                                <p
                                  key={pi}
                                  className="mt-3 text-[15px] leading-relaxed text-navy-800/65 first:mt-0"
                                >
                                  {para}
                                </p>
                              ))}
                              {faq.action && (
                                <div className="mt-6">
                                  <Button variant="ghost" icon="arrow" href={faq.action.href}>
                                    {faq.action.label}
                                  </Button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
