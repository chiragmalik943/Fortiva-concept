import { useEffect, useRef, useState } from 'react'
import { ArrowRight, User, Building2, HeartHandshake } from 'lucide-react'
import { gsap, prefersReducedMotion } from '../../animations/gsap'
import { images } from '../../assets/images'
import { useSplitReveal } from '../../hooks/useSplitReveal'
import { Link } from '../../router/router'

// The three audiences the copy doc actually sells to: Individuals and Families
// (Plans sub-nav) plus Employers.
//
// Card ORDER is individuals → employers → families rather than the doc's
// "Individuals & Families / Employers" grouping, so that every photograph stays
// in the exact slot the client approved: img-2 is the individual shot, img-3 the
// corporate one, img-4 the family one. Swapping to individuals → families →
// employers is a two-line change here (trade `insuranceCorporate` and
// `insuranceFamily`) if the grouping matters more than photo positions.
const cards = [
  {
    title: 'Individual Coverage',
    eyebrow: 'FOR individuals',
    description:
      'Affordable multi-tiered plans and transparent pricing that fit your budget without sacrificing quality care.',
    href: '/plans/individuals-and-families',
    image: images.insuranceIndividual,
    icon: User,
  },
  {
    title: 'Business Coverage',
    eyebrow: 'FOR employers',
    description:
      'Cost-effective group plans that scale with your business, with predictable pricing and digital onboarding.',
    href: '/plans/employers',
    image: images.insuranceCorporate,
    icon: Building2,
  },
  {
    title: 'Family Coverage',
    eyebrow: 'FOR families',
    description:
      "Flexible tiers to fit your household's needs, supplemental options for added security and pricing you can plan around.",
    href: '/plans/individuals-and-families',
    image: images.insuranceFamily,
    icon: HeartHandshake,
  },
]

export default function InsuranceCards() {
  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const [hovered, setHovered] = useState<number | null>(null)
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    if (prefersReducedMotion) return
    cardRefs.current.forEach((el, i) => {
      if (!el) return
      const grow = hovered === null ? 1 : hovered === i ? 1.5 : 0.85
      gsap.to(el, { flexGrow: grow, duration: 0.75, ease: 'back.out(1.15)' })
    })
  }, [hovered])

  return (
    <section className="bg-navy-800 px-4 pb-24 pt-24 sm:px-6 sm:pb-28 sm:pt-28">
      <div className="mx-auto max-w-container">
        <h2
          ref={headingRef}
          className="mx-auto max-w-2xl text-balance text-center text-[30px] font-semibold leading-tight text-white opacity-0 sm:text-[38px]"
        >
          Health coverage that works for{' '}
          <span className="text-gold">real life</span>
        </h2>

        <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-stretch">
          {cards.map((card, i) => {
            const Icon = card.icon
            return (
              <Link
                key={card.title}
                href={card.href}
                ref={(el) => (cardRefs.current[i] = el)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                style={{ flexGrow: 1, flexBasis: 0 }}
                className="group corner-smooth relative block min-h-[450px] w-full overflow-hidden rounded-card sm:min-h-[490px]"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/10 to-transparent" />

                <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/90">
                  <Icon size={19} className="text-navy-800" strokeWidth={2} />
                </div>

                <div className="absolute inset-x-5 bottom-5">
                  <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-500 ease-out group-hover:mb-3 group-hover:max-h-32 group-hover:opacity-100 group-focus:mb-3 group-focus:max-h-32 group-focus:opacity-100">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gold">
                      {card.eyebrow}
                    </p>
                    <p className="mt-1.5 text-[13.5px] leading-snug text-white/85">
                      {card.description}
                    </p>
                  </div>

                  <div className="flex items-end justify-between gap-3">
                    <h3 className="text-[19px] font-semibold leading-snug text-white transition-transform duration-500 group-hover:-translate-y-1 sm:text-[22px]">
                      {card.title}
                    </h3>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-all duration-500 group-hover:-rotate-45 group-hover:bg-gold group-hover:text-navy-800">
                      <ArrowRight size={17} className="text-white transition-colors duration-500 group-hover:text-navy-800" strokeWidth={2.25} />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
