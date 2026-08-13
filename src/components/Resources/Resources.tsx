import { images } from '../../assets/images'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'
import Button from '../Button'
import { Link } from '../../router/router'

// Ships as Resources rather than Blog because the copy doc supplies no article
// titles — but it does supply written copy and a button for each of these three.
// Same card component and same three photographs as the approved blog grid, so
// converting back to a real article grid later is a copy swap, not a rebuild.
// `components/Blog/Blog.tsx` is intentionally left in place for that.
const resources = [
  {
    image: images.blogPost1,
    label: 'Videos',
    title: 'Watch and learn',
    body: 'Watch videos to help you learn more about everything Fortiva has to offer.',
    cta: 'Watch videos',
    href: '/members/resources#videos',
  },
  {
    image: images.blogPost2,
    label: 'Plan details',
    title: 'Plan details anytime',
    body: 'Coverage limits, benefits and deductibles, all in one place and available whenever you need them.',
    cta: 'Learn more',
    href: '/plans',
  },
  {
    image: images.blogPost3,
    label: 'Blog',
    title: 'Insights, stories and updates',
    body: 'Get expert insights, member stories and the latest updates on health care trends.',
    cta: 'Read more',
    href: '/blog',
  },
]

function ResourceCard({ item, delay }: { item: (typeof resources)[number]; delay: number }) {
  const ref = useScrollReveal<HTMLDivElement>({ y: 36, delay })

  return (
    <div ref={ref}>
      <Link href={item.href} className="group block">
        <div className="corner-smooth relative aspect-[4/3] overflow-hidden rounded-card">
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition-[filter] duration-700 ease-out group-hover:blur-md"
          />
          <div className="absolute inset-0 bg-navy-900/0 transition-colors duration-700 group-hover:bg-navy-900/25" />

          <span className="absolute left-5 top-5 rounded-full bg-navy-800 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-white opacity-100 transition-opacity duration-500 group-hover:opacity-0">
            {item.label}
          </span>

          <div className="absolute inset-0 flex scale-95 items-center justify-center opacity-0 transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100">
            <span className="corner-smooth inline-flex items-center gap-3 rounded-[16px] bg-cream-soft px-6 py-2.5 text-[15px] font-semibold text-navy-800 shadow-sm">
              {item.cta}
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <span className="rounded-full bg-navy-800 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-white">
            {item.label}
          </span>
        </div>
        <h3 className="mt-3 max-w-sm text-[17px] font-semibold leading-snug text-navy-800">
          {item.title}
        </h3>
        <p className="mt-2 max-w-sm text-[14.5px] leading-relaxed text-navy-800/60">{item.body}</p>
      </Link>
    </div>
  )
}

export default function Resources() {
  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const introRef = useScrollReveal<HTMLParagraphElement>({ y: 20, delay: 0.1 })

  return (
    <section className="bg-white px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-container">
        <h2
          ref={headingRef}
          className="max-w-xl text-[28px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[34px]"
        >
          Meeting you where you are with{' '}
          <span className="text-gold-dark">quality resources</span>
        </h2>
        <p
          ref={introRef}
          className="mt-5 max-w-lg text-[15.5px] leading-relaxed text-navy-800/60 opacity-0"
        >
          Stay informed, stay healthy. Explore Fortiva&rsquo;s curated resources designed to
          help you make the most of your coverage and live your healthiest life.
        </p>

        <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((item, i) => (
            <ResourceCard key={item.label} item={item} delay={i * 0.12} />
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Button variant="ghost" href="/members/resources">
            All resources
          </Button>
        </div>
      </div>
    </section>
  )
}
