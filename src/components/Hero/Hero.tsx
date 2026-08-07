import { useSplitReveal } from '../../hooks/useSplitReveal'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import Button from '../Button'

export default function Hero() {
  // The client's H1 is three sentences: "Health Insurance Made Simple. Powered
  // by Innovation. Guided by Humanity." All three live inside the <h1> so the
  // document outline and SEO get the full headline, but only the first carries
  // the display size — running all three at 68px would swamp the viewport.
  // The split reveal is scoped to that first line for the same reason: SplitType
  // rewrites the DOM of whatever it's handed, so keeping it off the wrapper
  // leaves the second line's own styling untouched.
  //
  // The <br> in the first line is a deliberate break, not a wrap — the headline
  // is meant to read "Health Insurance / Made Simple." at every width. It's safe
  // inside the split target: SplitType walks child nodes and only rewrites text
  // ones, so the <br> survives and lands between the "Insurance" and "Made" word
  // spans, keeping the stagger continuous across both lines. `text-wrap: balance`
  // from index.css still applies within each segment, so a viewport too narrow
  // for "Health Insurance" degrades to a sensible three-line wrap.
  const headingRef = useSplitReveal<HTMLSpanElement>({
    type: 'words',
    immediate: true,
    delay: 0.15,
  })
  const taglineRef = useScrollReveal<HTMLSpanElement>({ y: 14, duration: 0.7, delay: 0.5, start: 'top 95%' })
  const subRef = useScrollReveal<HTMLDivElement>({ y: 18, duration: 0.8, delay: 0.7, start: 'top 95%' })

  return (
    <section id="home" className="relative flex min-h-screen flex-col items-center justify-center px-6 py-28 text-center sm:py-32">
      <h1 className="max-w-4xl">
        <span
          ref={headingRef}
          className="block text-[42px] font-semibold leading-[1.08] tracking-tight text-navy-800 opacity-0 sm:text-[56px] lg:text-[68px]"
        >
          Health Insurance <br /> Made Simple.
        </span>
        <span
          ref={taglineRef}
          className="mt-5 block text-[17px] font-medium tracking-tight text-navy-800/55 opacity-0 sm:text-[21px]"
        >
          Powered by Innovation. Guided by Humanity.
        </span>
      </h1>

      <div ref={subRef} className="mt-7 max-w-xl text-[15.5px] leading-relaxed text-navy-800/60 opacity-0">
        <p>
          Welcome to Fortiva, where health coverage works for real life. We&rsquo;re here to
          rewrite the rules of health insurance &mdash; putting people, not premiums, at
          the center.
        </p>
        <p className="mt-3">
          Whether you&rsquo;re an individual, a family or a small business, our plans are
          designed to give you clarity, choice and confidence.
        </p>
      </div>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Button variant="light" icon="arrow" size="lg" href="/plans">
          Explore Plans
        </Button>
        <Button variant="ghost" size="lg" href="/contact">
          Get a Quote
        </Button>
      </div>
    </section>
  )
}
