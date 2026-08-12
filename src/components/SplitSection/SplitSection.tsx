import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../animations/gsap'
import { images } from '../../assets/images'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { REACH_PHONE } from '../../content/site'
import Button from '../Button'

// The enrollment journey, assembled from "Enrollment made simple" (Plans),
// member FAQ #3 and the Member Portal page. Replaces a generic four-step
// advisory process that had no basis in the copy at all.
const steps = [
  {
    n: '01',
    title: 'Explore plans',
    body: 'Compare multi-tiered options online, with clear pricing and defined benefits upfront.',
  },
  {
    n: '02',
    title: 'Choose your coverage',
    body: 'Add supplemental protection like critical illness or accident coverage where you need it.',
  },
  {
    n: '03',
    title: 'Enroll your way',
    body: `Online in minutes, or with licensed, human-led guidance from REACH at ${REACH_PHONE}.`,
  },
  {
    n: '04',
    title: 'Manage it all in one place',
    body: 'Claims, digital ID cards and support, in the member portal and the Fortiva app.',
  },
]

export default function SplitSection() {
  const imageRef = useScrollReveal<HTMLDivElement>({ y: 40, scale: 0.96 })
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (prefersReducedMotion || !listRef.current) return
    const items = listRef.current.querySelectorAll('li')
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: listRef.current, start: 'top 85%', once: true },
        },
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    // Navy, not cream. The right-hand column was already navy — the wrapper's
    // cream only ever showed as a sliver above/below the photograph on short
    // viewports, which made the band read as two unrelated halves. Navy behind
    // both makes the photo sit IN the section rather than on top of it, and
    // gives the page a dark beat between the gold stacked cards above and the
    // gradient band below.
    <section className="bg-navy-800">
      {/* full-bleed, edge to edge, full viewport height; 50/50 columns,
          reversed on mobile (text first, then image) with a dedicated
          mobile image. min-h rather than h so the added CTA can't clip the
          list on a short viewport. */}
      <div className="grid sm:min-h-screen sm:grid-cols-2">
        <div ref={imageRef} className="relative order-2 min-h-[360px] sm:order-1 sm:min-h-0">
          <picture>
            <source media="(max-width: 639px)" srcSet={images.splitImageMobile} />
            <img
              src={images.splitImage}
              alt="Fortiva — simple and fair health insurance"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>
        </div>

        <div className="order-1 flex flex-col justify-center bg-navy-800 px-10 py-14 sm:order-2 sm:px-16">
          <h2 className="max-w-sm text-[28px] font-semibold leading-tight text-white sm:text-[34px]">
            Enrollment made <span className="text-gold">simple</span>
          </h2>

          <ul ref={listRef} className="mt-8 flex flex-col">
            {steps.map((step) => (
              <li
                key={step.n}
                className="border-t border-white/10 py-5 last:border-b"
              >
                <div className="flex items-baseline gap-2.5 text-[15px] font-semibold text-white">
                  <span className="text-gold">{step.n}</span>
                  <span className="text-white/30">—</span>
                  <span>{step.title}</span>
                </div>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-white/60">{step.body}</p>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Button variant="gold" icon="arrow" href="/contact">
              Get a Quote
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
