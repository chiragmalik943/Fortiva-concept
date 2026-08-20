import { ReactNode } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'
import { type Feature } from '../featureTypes'

export type { Feature }

interface FeatureGridProps {
  eyebrow?: string
  heading: ReactNode
  intro?: ReactNode
  features: Feature[]
  /** Background utility for the section. Defaults to white. */
  className?: string
}

/**
 * The copy doc's recurring shape: a heading, then a labelled list where each
 * item is a bolded phrase followed by a sentence ("Transparent pricing — No
 * hidden fees…"). It appears on Individuals & Families, Employers, Brokers and
 * Providers, so it lives here rather than being written out per page.
 *
 * Deliberately NOT the StackedCards treatment: that one is a pinned,
 * scroll-driven set-piece and earns its ~500vh because it carries the
 * homepage's central argument. These are supporting detail — a plain grid
 * reads faster and doesn't ask the visitor to scroll through an animation to
 * find out what's in it.
 *
 * ── This or FeatureReveal? ──────────────────────────────────────────────────
 * FeatureReveal renders the same `Feature[]`, but as a split band whose cards
 * fly in as you scroll. Use that one where the list IS the section — the two
 * Plans pages, where five benefits are the whole argument. Use this one for a
 * supporting list on a page that already has a set-piece of its own, so a page
 * never asks a visitor to sit through two scroll animations to read two lists.
 */
export default function FeatureGrid({
  eyebrow,
  heading,
  intro,
  features,
  className = 'bg-white',
}: FeatureGridProps) {
  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const introRef = useScrollReveal<HTMLParagraphElement>({ y: 20, delay: 0.1 })

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
          <p
            ref={introRef}
            className="mt-5 max-w-2xl text-[16px] leading-relaxed text-navy-800/70 opacity-0 sm:text-[17px]"
          >
            {intro}
          </p>
        )}

        {/* Six columns, two per card — so a three-up grid can also close a
            ragged last row. Both plans pages list five items, which in a plain
            three-column grid leaves an empty third cell hanging off the second
            row; `orphans` widens the final two cards to three columns each so
            the row fills. Only the 3n+2 case needs it: 3n is already square,
            and 3n+1 would mean one full-width card, which looks like a mistake
            rather than a resolution.

            auto-rows-fr so a card with two lines of body is the same height as
            one with four — otherwise the gold badges stop lining up across a
            row, which is the first thing the eye notices in a grid. */}
        <div className="mt-14 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {features.map((feature, i) => {
            const orphans = features.length % 3 === 2 && i >= features.length - 2
            return (
              <FeatureCard
                key={feature.title}
                feature={feature}
                delay={i * 0.06}
                className={orphans ? 'lg:col-span-3' : 'lg:col-span-2'}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  feature,
  delay,
  className = '',
}: {
  feature: Feature
  delay: number
  className?: string
}) {
  const ref = useScrollReveal<HTMLDivElement>({ y: 28, delay })
  const Icon = feature.icon

  return (
    <div
      ref={ref}
      className={`corner-smooth flex flex-col rounded-card bg-cream-soft p-8 opacity-0 shadow-card-soft ${className}`}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold">
        <Icon size={20} className="text-navy-800" strokeWidth={1.75} />
      </div>
      <h3 className="mt-6 text-[19px] font-semibold leading-snug text-navy-800">{feature.title}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-navy-800/65">{feature.body}</p>
    </div>
  )
}
