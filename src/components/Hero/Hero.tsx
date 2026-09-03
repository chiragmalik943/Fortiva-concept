import { useSplitReveal } from '../../hooks/useSplitReveal'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { images } from '../../assets/images'
import Button from '../Button'

export default function Hero() {
  // The headline is two lines with two different weights: the problem statement
  // in regular, the promise in bold. They live in separate <span>s rather than
  // one string with an inline <strong>, because SplitType rewrites the DOM of
  // whatever it's handed — a nested <strong> would survive the split but its
  // words would land in the same stagger as the light line, so the two halves
  // could no longer be timed independently. Two split targets, two reveals,
  // one <h1> for the document outline.
  //
  // The two spans are `block`, which is the line break the brief's <br> asks
  // for — a real <br> can't carry a different weight for what follows it, and
  // "Health insurance is broken." must always sit on its own line, never wrap
  // into the promise below it.
  const lineOneRef = useSplitReveal<HTMLSpanElement>({
    type: 'words',
    immediate: true,
    delay: 0.2,
  })
  const lineTwoRef = useSplitReveal<HTMLSpanElement>({
    type: 'words',
    immediate: true,
    delay: 0.38,
  })
  const markRef = useScrollReveal<HTMLImageElement>({ y: 16, duration: 0.7, delay: 0.05, start: 'top 95%' })
  const taglineRef = useScrollReveal<HTMLParagraphElement>({ y: 14, duration: 0.7, delay: 0.55, start: 'top 95%' })
  const subRef = useScrollReveal<HTMLDivElement>({ y: 18, duration: 0.8, delay: 0.72, start: 'top 95%' })

  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-28 text-center sm:py-32"
    >
      {/* ── backdrop ───────────────────────────────────────────────────────
          hero-bg.png is 4801x2701 of very low-contrast arc pattern in the
          brand's mist blue, so it needs no scrim to keep navy text legible.

          It used to also FADE. A mask took it to nothing across the bottom
          third and handed off to `.gradient-hero` — the wrapper this section
          shares with ClipMaskSection — mid-dissolve, so the seam was invisible
          at any viewport height. Both that mask and the cream wash that sat
          under the copy block are gone: the backdrop is painted flat, corner to
          corner, and the section ends on a hard edge. Same change as the
          interior heroes; see PageHero.tsx.

          object-cover with a top-biased position keeps the arcs' crossing
          point in frame on short/wide viewports instead of centring on empty
          sky. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
        <img
          src={images.heroBg}
          alt=""
          className="h-full w-full object-cover object-[center_35%]"
        />
      </div>

      {/* ── content ───────────────────────────────────────────────────────
          The block was max-w-4xl on the h1 with the body pinched to max-w-xl
          (576px) below it. It's max-w-6xl now, and the body is max-w-3xl —
          wider on both counts, but not equally: the headline wants the full
          measure, while the paragraph wants to stop around 80 characters or it
          stops being readable. Widening both to the same edge is what would
          have made this look stretched rather than composed. */}
      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center">
        {/* Rendered as a plain <img> on purpose: ftva-icn.svg carries its own
            fills and this component must not restate them. An earlier version
            tinted it navy through mask-image, which meant the colour lived
            here in code — edit the SVG and nothing changed on screen. Now the
            file is the single source of truth for the mark's colour. */}
        <img
          ref={markRef}
          src={images.icon}
          alt=""
          aria-hidden="true"
          className="mb-7 block h-20 w-auto opacity-0 sm:mb-8 sm:h-[104px]"
        />

        {/* max-w-6xl, not the old max-w-4xl: at the lg size the promise line
            ("We're building something better.") measures ~1050px, so a 896px
            measure broke it into two lines and the headline read as three lines
            instead of the two the brief specifies. */}
        <h1 className="max-w-6xl text-navy-800">
          <span
            ref={lineOneRef}
            className="block text-[40px] font-normal leading-[1.4] tracking-tight opacity-0 sm:text-[54px] lg:text-[66px]"
          >
            Health insurance is broken.
          </span>
          <span
            ref={lineTwoRef}
            className="block text-[40px] font-bold leading-[1.4] tracking-tight opacity-0 sm:text-[54px] lg:text-[66px]"
          >
            We&rsquo;re building something better.
          </span>
        </h1>

        {/* The copy doc's H1 is three sentences; the first two lines carry the
            headline and this is the third. It sits OUTSIDE the <h1> because it
            has its own weight and size — inside, `text-wrap: balance` and the
            headline's tracking would apply to it too. Sized between the
            headline and the body (19/22px against the body's 15.5/17px) so it
            reads as a tagline rather than a first paragraph. */}
        <p
          ref={taglineRef}
          className="mt-5 text-[19px] font-normal tracking-tight text-navy-800 opacity-0 sm:text-[22px]"
        >
          Powered by Innovation. Guided by Humanity.
        </p>

        <div
          ref={subRef}
          className="mt-6 max-w-3xl text-[15.5px] leading-relaxed text-navy-800 opacity-0 sm:text-[17px]"
        >
          <p>
            Welcome to Fortiva, where health coverage works for real life. We&rsquo;re here to
            rewrite the rules of health insurance putting people, not premiums, at the
            center. Whether you&rsquo;re an individual, a family or a small business, our
            plans are designed to give you clarity, choice and confidence.
          </p>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button variant="gold" icon="arrow" size="lg" href="/plans">
            Explore Plans
          </Button>
          <Button variant="white" size="lg" href="/contact">
            Get a Quote
          </Button>
        </div>
      </div>
    </section>
  )
}
