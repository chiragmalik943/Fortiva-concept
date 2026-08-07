import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'

// Sits immediately after the FOR mask section releases its pin. The mask is a
// wordless visual set-piece, so without this the page jumps straight from
// brand statement into product cards; these are the copy doc's mission and
// vision statements ("FOR our members" / "FOR the future"), which have no
// other home on the page.
export default function MissionBand() {
  const missionRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const missionBodyRef = useScrollReveal<HTMLParagraphElement>({ y: 24, delay: 0.1 })
  const futureRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const futureBodyRef = useScrollReveal<HTMLParagraphElement>({ y: 24, delay: 0.1 })

  return (
    <section className="bg-cream px-6 py-24 sm:py-32">
      <div className="mx-auto grid max-w-container gap-14 sm:grid-cols-2 sm:gap-16 lg:gap-24">
        <div>
          <h2
            ref={missionRef}
            className="text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[36px]"
          >
            <span className="text-gold-dark">FOR</span> our members
          </h2>
          <p
            ref={missionBodyRef}
            className="mt-6 max-w-md text-[15.5px] leading-relaxed text-navy-800/60 opacity-0"
          >
            At Fortiva, our mission is simple: to champion a member-first approach to
            health insurance &mdash; transparent, affordable and designed for better
            outcomes. We believe health coverage should empower you, not overwhelm you.
            That&rsquo;s why we combine value-based care, personalized experiences and
            technology-driven simplicity to deliver plans that fit your life.
          </p>
        </div>

        <div className="sm:pt-1">
          <h2
            ref={futureRef}
            className="text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[36px]"
          >
            <span className="text-gold-dark">FOR</span> the future
          </h2>
          <p
            ref={futureBodyRef}
            className="mt-6 max-w-md text-[15.5px] leading-relaxed text-navy-800/60 opacity-0"
          >
            We&rsquo;re building a future where health insurance is simple, fair and
            empowering &mdash; delivering better care at a better price nationwide.
          </p>
        </div>
      </div>
    </section>
  )
}
