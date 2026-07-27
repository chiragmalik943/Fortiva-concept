import { useSplitReveal } from '../../hooks/useSplitReveal'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import Button from '../Button'

export default function Hero() {
  const headingRef = useSplitReveal<HTMLHeadingElement>({
    type: 'chars',
    immediate: true,
    delay: 0.15,
  })
  const subRef = useScrollReveal<HTMLDivElement>({ y: 18, duration: 0.8, delay: 0.55, start: 'top 95%' })

  return (
    <section id="home" className="relative flex flex-col items-center px-6 pb-20 pt-40 text-center sm:pt-48">
      <h1
        ref={headingRef}
        className="max-w-4xl text-[42px] font-semibold leading-[1.08] tracking-tight text-navy-800 opacity-0 sm:text-[56px] lg:text-[68px]"
      >
        Health Insurance
        <br />
        Made Simple.
      </h1>

      <div ref={subRef} className="mt-7 max-w-lg text-[15.5px] leading-relaxed text-navy-800/60 opacity-0">
        <p>Powered by innovation. Guided by humanity.</p>
        <p>
          Whether you're an individual, a family or a small business, our
          plans are designed to give you clarity, choice and confidence.
        </p>
      </div>

      <div className="mt-9 flex items-center gap-3">
        <Button variant="light" icon="arrow" size="lg">
          Talk to Us
        </Button>
        <Button variant="ghost" size="lg">Explore Plans</Button>
      </div>
    </section>
  )
}
