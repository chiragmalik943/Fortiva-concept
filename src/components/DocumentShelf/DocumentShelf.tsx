import { ReactNode } from 'react'
import { ArrowDownToLine, type LucideIcon } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'

export interface DocumentGroup {
  title: string
  body: string
  icon: LucideIcon
  /** The individual documents. Each is a row inside the group's card. */
  items: { label: string; meta: string }[]
}

interface DocumentShelfProps {
  eyebrow?: string
  heading: ReactNode
  intro?: ReactNode
  groups: DocumentGroup[]
  action?: ReactNode
  /** Small print under the shelf — where the real files will come from. */
  note?: ReactNode
  className?: string
}

/**
 * The plan-documents shelf: three groups of downloads, each a card with its own
 * short list.
 *
 * == Rows that look like files, and do not pretend to be links ==============
 * Every row carries a download glyph and a file type, because that is what tells
 * you at a glance that this is a shelf of documents rather than a list of pages.
 * None of them is an anchor: there are no files behind this site, and a link that
 * looks downloadable and does nothing when clicked is worse than one that never
 * offered. The rows are inert until real URLs land, at which point each becomes an
 * `<a download>` and nothing else here changes.
 *
 * `note` is where a caller says that out loud. It is a prop rather than fixed text
 * so the sentence can go away in one edit when the files arrive.
 */
export default function DocumentShelf({
  eyebrow,
  heading,
  intro,
  groups,
  action,
  note,
  className = 'bg-white',
}: DocumentShelfProps) {
  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const introRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.12 })
  const gridRef = useScrollReveal<HTMLDivElement>({ y: 30, delay: 0.18 })

  return (
    <section className={`px-6 py-24 sm:py-28 ${className}`}>
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
        {intro && (
          <div ref={introRef} className="opacity-0">
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-navy-800/65 sm:text-[17px]">
              {intro}
            </p>
          </div>
        )}

        <div ref={gridRef} className="mt-14 opacity-0">
          <div className="grid gap-5 lg:grid-cols-3">
            {groups.map(({ title, body, icon: Icon, items }) => (
              <div
                key={title}
                className="corner-smooth flex flex-col rounded-card border border-navy-800/[0.08] bg-white p-7 sm:p-8"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold">
                  <Icon size={21} strokeWidth={1.75} className="text-navy-800" />
                </span>
                <h3 className="mt-7 text-[20px] font-semibold leading-snug text-navy-800 sm:text-[21px]">
                  {title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-navy-800/65">{body}</p>

                <ul className="mt-7 flex flex-1 flex-col">
                  {items.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-center gap-4 border-t border-navy-800/10 py-3.5 last:border-b"
                    >
                      <ArrowDownToLine
                        size={16}
                        strokeWidth={1.9}
                        aria-hidden="true"
                        className="shrink-0 text-gold-dark"
                      />
                      <span className="flex-1 text-[14.5px] leading-snug text-navy-800/80">
                        {item.label}
                      </span>
                      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.1em] text-navy-800/35">
                        {item.meta}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {(action || note) && (
            <div className="mt-10 flex flex-col items-start gap-5">
              {action && <div className="flex flex-wrap gap-3">{action}</div>}
              {note && (
                <p className="max-w-2xl text-[13px] leading-relaxed text-navy-800/40">{note}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
