import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../animations/gsap'
import { images } from '../../assets/images'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const steps = [
  {
    n: '01',
    title: 'Understand your needs',
    body: "We start with you—not a policy.",
  },
  {
    n: '02',
    title: 'Compare your options',
    body: 'We help you make sense of coverage, benefits, and costs.',
  },
  {
    n: '03',
    title: 'Choose with confidence',
    body: 'Clear guidance helps you decide what works for you.',
  },
  {
    n: '04',
    title: 'Stay supported',
    body: "As life changes, we're here to help your coverage change with it.",
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
    <section className="bg-cream">
      {/* full-bleed, edge to edge, full viewport height; 50/50 columns,
          reversed on mobile (text first, then image) with a dedicated
          mobile image */}
      <div className="grid sm:h-screen sm:grid-cols-2">
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
            Building a future with{' '}
            <span className="text-gold">simple &amp; fair health Insurance</span>
          </h2>

          <ul ref={listRef} className="mt-10 flex flex-col">
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
        </div>
      </div>
    </section>
  )
}
