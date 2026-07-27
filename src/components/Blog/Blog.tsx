import { images } from '../../assets/images'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'
import Button from '../Button'

const posts = [
  { image: images.blogPost1, tag: 'TAG', title: '5 Questions To Ask Before Choosing A Health Plan' },
  { image: images.blogPost2, tag: 'TAG', title: 'Understanding Your Deductible, Copay, And Out-of-Pocket Max' },
  { image: images.blogPost3, tag: 'TAG', title: 'How To Prepare For Open Enrollment This Year' },
]

function BlogCard({ post, delay }: { post: (typeof posts)[number]; delay: number }) {
  const ref = useScrollReveal<HTMLDivElement>({ y: 36, delay })

  return (
    <div ref={ref}>
      <div className="group corner-smooth relative aspect-[4/3] overflow-hidden rounded-card">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition-[filter] duration-700 ease-out group-hover:blur-md"
        />
        <div className="absolute inset-0 bg-navy-900/0 transition-colors duration-700 group-hover:bg-navy-900/25" />

        <span className="absolute left-5 top-5 rounded-full bg-navy-800 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-white opacity-100 transition-opacity duration-500 group-hover:opacity-0">
          {post.tag}
        </span>

        <div className="absolute inset-0 flex scale-95 items-center justify-center opacity-0 transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100">
          <Button variant="light" icon="arrow">
            Read Article
          </Button>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <span className="rounded-full bg-navy-800 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-white">
          {post.tag}
        </span>
      </div>
      <h3 className="mt-3 max-w-sm text-[17px] font-semibold leading-snug text-navy-800">
        {post.title}
      </h3>
    </div>
  )
}

export default function Blog() {
  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })

  return (
    <section className="px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-container">
        <h2
          ref={headingRef}
          className="max-w-lg text-[28px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[34px]"
        >
          We love insurance so much
          <br />
          We write about it every week
        </h2>

        <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <BlogCard key={i} post={post} delay={i * 0.12} />
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Button variant="ghost">All articles</Button>
        </div>
      </div>
    </section>
  )
}
