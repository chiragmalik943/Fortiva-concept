import { ReactNode } from 'react'
import { useSplitReveal } from '../../hooks/useSplitReveal'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { images } from '../../assets/images'

interface PageHeroProps {
  /** Small caps label above the mark — usually the page's own nav label. */
  eyebrow?: string
  /** Set in regular; the setup half of the headline. */
  titleTop: ReactNode
  /** Set in bold; the payoff half. Rendered on its own line. */
  titleBottom: ReactNode
  lede?: ReactNode
  /** Buttons or links, rendered under the lede. */
  actions?: ReactNode
}

/**
 * The interior-page counterpart to the homepage Hero: same backdrop, same
 * mark, same two-weight headline, ~70vh instead of a full screen so an inner
 * page gets to its content faster.
 *
 * Extracted as a component rather than copied into the About page because the
 * remaining pages in the IA (Plans, For Members, For Brokers, For Providers,
 * Careers, Contact) all open the same way — this is the one place their hero
 * treatment should live.
 */
export default function PageHero({ eyebrow, titleTop, titleBottom, lede, actions }: PageHeroProps) {
  const lineOneRef = useSplitReveal<HTMLSpanElement>({ type: 'words', immediate: true, delay: 0.2 })
  const lineTwoRef = useSplitReveal<HTMLSpanElement>({ type: 'words', immediate: true, delay: 0.36 })
  const markRef = useScrollReveal<HTMLDivElement>({ y: 16, duration: 0.7, delay: 0.05, start: 'top 95%' })
  const ledeRef = useScrollReveal<HTMLDivElement>({ y: 18, duration: 0.8, delay: 0.58, start: 'top 95%' })

  return (
    <section className="relative flex min-h-[72vh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-mist via-[#D8DFE1] to-cream px-6 pb-24 pt-36 text-center sm:pb-28 sm:pt-40">
      {/* Same backdrop and same dissolve as the homepage hero — see Hero.tsx
          for why the image is masked out rather than scrimmed. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
        <img
          src={images.heroBg}
          alt=""
          className="h-full w-full object-cover object-[center_35%]"
          style={{
            maskImage: 'linear-gradient(180deg, #000 0%, #000 48%, rgba(0,0,0,0.5) 74%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(180deg, #000 0%, #000 48%, rgba(0,0,0,0.5) 74%, transparent 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/10 via-cream/25 to-transparent" />
      </div>

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center">
        <div ref={markRef} className="flex flex-col items-center opacity-0">
          {/* Plain <img>, untinted — ftva-icn.svg owns its own colour. See the
              same note in Hero.tsx. */}
          <img
            src={images.icon}
            alt=""
            aria-hidden="true"
            className="block h-16 w-auto sm:h-[84px]"
          />
          {eyebrow && (
            <span className="mt-5 inline-block rounded-full bg-navy-800/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-navy-800/70">
              {eyebrow}
            </span>
          )}
        </div>

        <h1 className="mt-6 max-w-4xl sm:mt-7">
          <span
            ref={lineOneRef}
            className="block text-[36px] font-normal leading-[1.4] tracking-tight text-navy-800/80 opacity-0 sm:text-[48px] lg:text-[58px]"
          >
            {titleTop}
          </span>
          <span
            ref={lineTwoRef}
            className="block text-[36px] font-bold leading-[1.4] tracking-tight text-navy-800 opacity-0 sm:text-[48px] lg:text-[58px]"
          >
            {titleBottom}
          </span>
        </h1>

        {(lede || actions) && (
          <div ref={ledeRef} className="opacity-0">
            {lede && (
              <p className="mx-auto mt-7 max-w-3xl text-[15.5px] leading-relaxed text-navy-800 sm:text-[17px]">
                {lede}
              </p>
            )}
            {actions && (
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">{actions}</div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
