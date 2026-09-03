import { ReactNode, useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { ScrollTrigger } from '../../animations/gsap'
import { type ExpertResourceGroup } from '../../content/site'
import { scrollPageTo } from '../../hooks/useLenis'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'

interface LinkHubProps {
  eyebrow?: string
  heading: ReactNode
  intro?: ReactNode
  groups: ExpertResourceGroup[]
  className?: string
}

/**
 * Grouped outbound links with a category rail that tracks the group you're in.
 *
 * Every card here leaves the site, so every card says where to — the host is
 * printed on the card and the arrow is the "leaves this page" one, not the
 * in-site arrow. That is the whole reason these aren't rendered as ordinary
 * resource cards: eight links to eight different organisations, presented like
 * Fortiva's own pages, would be a small deception.
 *
 * `rel="noopener noreferrer"` on every one, since they all open in a new tab.
 */
export default function LinkHub({
  eyebrow,
  heading,
  intro,
  groups,
  className = 'bg-cream-soft',
}: LinkHubProps) {
  const [active, setActive] = useState(0)
  const groupRefs = useRef<(HTMLDivElement | null)[]>([])

  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const introRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.12 })

  useEffect(() => {
    if (!window.matchMedia('(min-width: 1024px)').matches) return

    const triggers = groupRefs.current.map((el, i) =>
      el
        ? ScrollTrigger.create({
            trigger: el,
            start: 'top 55%',
            end: 'bottom 45%',
            onToggle: (self) => {
              if (self.isActive) setActive(i)
            },
          })
        : null,
    )
    return () => triggers.forEach((t) => t?.kill())
  }, [groups.length])

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

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1.45fr)] lg:gap-16">
          <nav aria-label="Resource categories" className="hidden lg:sticky lg:top-32 lg:block lg:self-start">
            <ul className="flex flex-col gap-1">
              {groups.map((group, i) => (
                <li key={group.heading}>
                  <a
                    href={`#${slug(group.heading)}`}
                    onClick={(e) => {
                      // Lenis owns the scroll position, so the browser's own
                      // hash jump would be undone on its next frame.
                      e.preventDefault()
                      scrollPageTo(`#${slug(group.heading)}`)
                    }}
                    className={`corner-smooth block rounded-[12px] px-4 py-3 text-[14.5px] leading-snug transition-colors ${
                      i === active
                        ? 'bg-navy-800 font-medium text-white'
                        : 'text-navy-800/55 hover:bg-navy-800/5 hover:text-navy-800'
                    }`}
                  >
                    {group.heading}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 px-4 text-[12.5px] leading-relaxed text-navy-800/40">
              These tools are published by outside health organisations. Each one opens in a
              new tab.
            </p>
          </nav>

          <div className="flex flex-col gap-14">
            {groups.map((group, gi) => (
              <div
                key={group.heading}
                id={slug(group.heading)}
                ref={(el) => (groupRefs.current[gi] = el)}
                className="scroll-mt-32"
              >
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-navy-800/50">
                  {group.heading}
                </h3>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {group.items.map((item) => (
                    <li key={item.title}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group corner-smooth flex h-full flex-col rounded-card border border-navy-800/[0.08] bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-navy-800/15 hover:shadow-card-soft"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="text-[17px] font-semibold leading-snug text-navy-800">
                            {item.title}
                          </h4>
                          <span className="corner-smooth flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-navy-800/5 text-navy-800 transition-colors duration-300 group-hover:bg-gold">
                            <ArrowUpRight size={15} strokeWidth={2.25} />
                          </span>
                        </div>
                        <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-navy-800/65">
                          {item.body}
                        </p>
                        <p className="mt-5 flex items-center gap-2 text-[12.5px] font-medium text-navy-800/45">
                          <span className="font-semibold text-gold-dark">{item.cta}</span>
                          <span aria-hidden="true">&middot;</span>
                          {item.host}
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/** 'Mental health and well-being' → 'mental-health-and-well-being' */
function slug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
