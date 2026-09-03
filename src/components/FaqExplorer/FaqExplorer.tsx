import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Search, X } from 'lucide-react'
import { type FaqCategory, type MemberFaq } from '../../content/site'
import { NAV_OFFSET, scrollPageTo } from '../../hooks/useLenis'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'
import Button from '../Button'

interface FaqExplorerProps {
  eyebrow?: string
  heading: ReactNode
  intro?: ReactNode
  faqs: MemberFaq[]
  /** Rail order and group order. Categories with no questions are skipped. */
  categories: FaqCategory[]
  /** Rendered when a search matches nothing. */
  emptyAction?: ReactNode
}

/**
 * Forty questions, sorted into four groups, with a category rail beside them.
 *
 * ── The rail lists categories, not questions ────────────────────────────────
 * It used to list every question. That works at eight and collapses at forty: a
 * forty-item rail is taller than the viewport, so it scrolls independently of
 * the answers it is meant to index, and "on this page" stops being a map and
 * becomes a second copy of the list. Four categories fit on any screen, hold
 * still, and tell a visitor what kind of question this page answers before they
 * read a single one.
 *
 * Clicking one scrolls to its group rather than filtering to it, so the whole
 * list stays reachable by scrolling past — the rail is a table of contents, and a
 * visitor who lands in the wrong group can just keep going.
 *
 * ── The spy measures, it doesn't listen for crossings ───────────────────────
 * Two obvious implementations were tried and both are wrong here.
 *
 * A ScrollTrigger per group caches its trigger's pixel offsets at creation and
 * has to be told when they move. Opening an answer animates a height, which moves
 * every group below it, so the spy would need a `ScrollTrigger.refresh()` on
 * every accordion toggle — and refreshes mid-animation are what make a sticky
 * rail jitter.
 *
 * An IntersectionObserver reads live geometry, which fixes that, but it only
 * fires when an element CROSSES its threshold. Anything that changes the scroll
 * position without crossings — a restored scroll position on reload, a deep link,
 * a programmatic jump — leaves the rail showing whatever was last true. Which is
 * the one case where a wrong answer is most visible: first paint.
 *
 * So the rail is computed, not subscribed. On every scroll frame (rAF-throttled,
 * four `getBoundingClientRect` calls) the active category is the LAST group whose
 * top has passed a reading line ~22% down the viewport, or the first group if
 * none has. That rule is correct by construction at any scroll position, however
 * it was arrived at, and at any group height — which matters, because at forty
 * questions one group can be several screens tall.
 *
 * ── The reading line has to sit below where a jump lands ─────────────────────
 * This is the part that made the rail look broken, and it is a relationship
 * between two numbers rather than a bug in either. Clicking the rail scrolls the
 * group's heading to `NAV_OFFSET` (96px, clearing the nav pill). The reading line
 * was `0.22 * innerHeight`. On an 800px-tall viewport that is 176px — comfortably
 * below 96, fine. But `scroll-mt-32` on the group meant the jump was actually
 * landing at 224px (see `scrollPageTo`, now fixed), which is BELOW the line: so
 * the heading you had just navigated to had not "passed" it, the rail kept showing
 * the previous category, and the tail of the previous group was still on screen to
 * make it look deliberate. Exactly the "it glitched out" reading.
 *
 * Both halves are fixed. `scrollPageTo` lands on `NAV_OFFSET` exactly, and the
 * line is now `max(NAV_OFFSET + SPY_CLEARANCE, 0.22 * innerHeight)` — so it can
 * never creep back above a landing point, on any viewport height. A short laptop
 * window used to be the other way this broke: at 600px tall, `0.22 *` gives 132px,
 * and a heading at 128px was one pixel from flipping the rail.
 *
 * ── A jump sets the rail; measuring doesn't fight it ─────────────────────────
 * Clicking a category also locks the spy for the length of the tween. Without the
 * lock the rail is technically correct the whole way and still feels wrong: a jump
 * from group 1 to group 4 sweeps the reading line through 2 and 3, so the rail
 * strobes through both before settling. The lock means the rail shows where you
 * asked to go, immediately, and starts measuring again when you arrive. Any real
 * scroll input — wheel, touch, key — releases it at once, because at that point
 * the visitor is driving and the measurement is the honest answer again.
 *
 * ── The bottom of the page is its own case ──────────────────────────────────
 * The last group can sit close enough to the end of the document that its heading
 * cannot reach `NAV_OFFSET` — the scroll runs out first. Measuring then reports
 * the second-to-last group forever, which is the same wrong-feeling result by a
 * different route. So at max scroll the last group wins outright.
 *
 * ── Search still spans all forty ────────────────────────────────────────────
 * The filter searches ANSWERS as well as questions, which is the thing a plain
 * accordion can't do. Filtering hides groups that match nothing rather than
 * showing an empty heading, and the rail greys those categories out and reports
 * the per-category count, so the shape of a result set is legible from the rail
 * alone.
 *
 * ── Open state is keyed by id ───────────────────────────────────────────────
 * Not by index — filtering reorders the list, and an index would leave "3" open
 * and silently reveal whichever question shuffled into third place. Not by
 * question text either, now that thirty-two of them are lorem ipsum and could
 * collide.
 *
 * The rail is `lg`-only. It's a navigational luxury that needs a viewport wide
 * enough to sit beside the answers; on a phone the group headings are the index.
 */
/**
 * Where "you are reading here" sits, as a fraction of the viewport height. High
 * enough that a group heading counts as read once it is comfortably on screen,
 * low enough that the rail doesn't flip to the next category while the previous
 * one still fills most of the view.
 */
const SPY_LINE = 0.22

/**
 * ...but never closer than this to where a jump lands. See the docblock: the
 * reading line must stay below `NAV_OFFSET` by a real margin, or a heading that
 * was just scrolled into place reads as not yet reached. 56px is about half a
 * heading, enough that sub-pixel rounding and a fractional device pixel ratio
 * can't put the two on the wrong side of each other.
 */
const SPY_CLEARANCE = 56

/** How long the rail trusts a click over a measurement: the tween plus a frame. */
const JUMP_LOCK_MS = 1000

export default function FaqExplorer({
  eyebrow,
  heading,
  intro,
  faqs,
  categories,
  emptyAction,
}: FaqExplorerProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null)
  const [active, setActive] = useState<string>(categories[0]?.id ?? '')

  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const introRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.12 })

  const groupRefs = useRef<Record<string, HTMLDivElement | null>>({})

  /** Timestamp until which a rail click outranks the scroll measurement. */
  const jumpLock = useRef(0)

  /**
   * Every category with its matching questions, numbered WITHIN the group. Per-
   * group numbering rather than 01–40 because the number sits under a category
   * heading — "07" reads as the seventh question about costs, which is what a
   * visitor scanning one group wants, and 01–40 would make the fourth group open
   * at "31" for no reason a reader can see.
   */
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const hit = (faq: MemberFaq) =>
      !q ||
      faq.q.toLowerCase().includes(q) ||
      faq.a.some((para) => para.toLowerCase().includes(q))

    return categories.map((category) => ({
      category,
      items: faqs
        .filter((faq) => faq.category === category.id)
        .filter(hit)
        .map((faq, i) => ({ faq, n: i + 1 })),
      total: faqs.filter((faq) => faq.category === category.id).length,
    }))
  }, [categories, faqs, query])

  const shown = groups.filter((g) => g.items.length > 0)
  const matchCount = shown.reduce((sum, g) => sum + g.items.length, 0)

  const shownIds = shown.map((g) => g.category.id).join('|')

  useEffect(() => {
    const order = shownIds ? shownIds.split('|') : []
    if (order.length === 0) return

    let frame = 0
    const measure = () => {
      frame = 0
      if (performance.now() < jumpLock.current) return

      // At the very end of the document the last group's heading may never reach
      // the reading line, so nothing below can ever win. Award it the rail.
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      if (window.scrollY >= maxScroll - 2) {
        setActive(order[order.length - 1])
        return
      }

      const line = Math.max(NAV_OFFSET + SPY_CLEARANCE, window.innerHeight * SPY_LINE)
      let current = order[0]
      for (const id of order) {
        const el = groupRefs.current[id]
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      setActive(current)
    }

    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(measure)
    }

    // Real scroll input means the visitor is driving again, so a pending jump
    // stops outranking the measurement — otherwise scrolling away from a
    // just-clicked category would leave the rail behind for up to a second.
    const release = () => {
      jumpLock.current = 0
    }

    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('wheel', release, { passive: true })
    window.addEventListener('touchstart', release, { passive: true })
    window.addEventListener('keydown', release)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('wheel', release)
      window.removeEventListener('touchstart', release)
      window.removeEventListener('keydown', release)
    }
    // Re-measures when the visible groups change (a search) and when an answer
    // opens or closes — that one moves every group below it without any scroll
    // event to notice it, and the 420ms clears framer-motion's height tween.
  }, [shownIds, open])

  useEffect(() => {
    const t = window.setTimeout(() => window.dispatchEvent(new Event('scroll')), 420)
    return () => window.clearTimeout(t)
  }, [open])

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
                className="corner-smooth w-full rounded-[14px] border border-navy-800/20 bg-white py-3 pl-11 pr-11 text-[15px] text-navy-800 transition-colors placeholder:text-navy-800/35 focus:border-navy-800/40 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-navy-800/45 transition-colors hover:bg-navy-800/[0.08] hover:text-navy-800"
                >
                  <X size={15} strokeWidth={2.25} />
                </button>
              )}
            </div>
            <p aria-live="polite" className="text-[14px] text-navy-800/50">
              {matchCount} of {faqs.length} questions
              {query.trim() && shown.length > 0 && (
                <>
                  {' '}
                  in {shown.length} {shown.length === 1 ? 'category' : 'categories'}
                </>
              )}
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,0.52fr)_minmax(0,1.48fr)] lg:gap-16">
          {/* ── category rail ──────────────────────────────────────────────
              Four buttons, not forty. `lg:top-32` clears the fixed nav pill;
              `self-start` is what lets `sticky` work at all inside a grid item,
              which otherwise stretches to the row and has nothing to stick
              within. */}
          <nav
            aria-label="FAQ categories"
            className="hidden lg:sticky lg:top-32 lg:block lg:self-start"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/45">
              On this page
            </p>
            <ul className="mt-5 flex flex-col gap-1.5">
              {groups.map(({ category, items, total }, i) => {
                const empty = items.length === 0
                const isActive = !empty && category.id === active
                return (
                  <li key={category.id}>
                    <button
                      type="button"
                      disabled={empty}
                      onClick={() => {
                        // The rail says where you asked to go for as long as it
                        // takes to get there; see JUMP_LOCK_MS.
                        jumpLock.current = performance.now() + JUMP_LOCK_MS
                        setActive(category.id)
                        scrollPageTo(`#faq-${category.id}`)
                      }}
                      aria-current={isActive ? 'true' : undefined}
                      className={`corner-smooth flex w-full items-center gap-3 rounded-[14px] px-3.5 py-3 text-left transition-colors ${
                        empty
                          ? 'cursor-not-allowed text-navy-800/25'
                          : isActive
                            ? 'bg-navy-800 text-white'
                            : 'text-navy-800/65 hover:bg-navy-800/5 hover:text-navy-800'
                      }`}
                    >
                      <span
                        className={`shrink-0 text-[12px] font-semibold ${
                          empty ? 'text-navy-800/20' : isActive ? 'text-gold' : 'text-navy-800/35'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 text-[15px] font-medium leading-snug">
                        {category.label}
                      </span>
                      <span
                        className={`shrink-0 text-[12px] font-semibold tabular-nums ${
                          empty
                            ? 'text-navy-800/20'
                            : isActive
                              ? 'text-white/60'
                              : 'text-navy-800/35'
                        }`}
                      >
                        {query.trim() ? `${items.length}/${total}` : total}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* ── grouped answers ────────────────────────────────────────────── */}
          <div>
            {shown.length === 0 ? (
              <div className="corner-smooth rounded-card border border-navy-800/[0.08] bg-white p-9 text-center">
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
              <div className="flex flex-col gap-16">
                {shown.map(({ category, items, total }, gi) => (
                  <div
                    key={category.id}
                    id={`faq-${category.id}`}
                    data-faq-group={category.id}
                    ref={(el) => (groupRefs.current[category.id] = el)}
                    className="scroll-mt-32"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-navy-800/10 pb-4">
                      <span className="text-[13px] font-semibold text-gold-dark">
                        {String(gi + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-[21px] font-semibold leading-snug text-navy-800 sm:text-[24px]">
                        {category.label}
                      </h3>
                      <span className="text-[13px] font-medium tabular-nums text-navy-800/40">
                        {query.trim() ? `${items.length} of ${total}` : `${total} questions`}
                      </span>
                    </div>
                    <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-navy-800/55">
                      {category.blurb}
                    </p>

                    <div className="mt-5 flex flex-col">
                      {items.map(({ faq, n }) => {
                        const isOpen = open === faq.id
                        return (
                          <div key={faq.id} className="border-b border-navy-800/10">
                            <button
                              type="button"
                              onClick={() => setOpen(isOpen ? null : faq.id)}
                              aria-expanded={isOpen}
                              className="flex w-full items-start justify-between gap-6 py-5 text-left"
                            >
                              <span className="flex items-start gap-4">
                                <span className="mt-1 text-[13px] font-semibold text-navy-800/35">
                                  {String(n).padStart(2, '0')}
                                </span>
                                <span className="text-[16px] font-medium leading-snug text-navy-800 sm:text-[17.5px]">
                                  {faq.q}
                                </span>
                              </span>
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-navy-800/15 bg-white">
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
                                        <Button
                                          variant="ghost"
                                          icon="arrow"
                                          href={faq.action.href}
                                        >
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
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
