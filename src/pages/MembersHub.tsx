import { HelpCircle, LayoutDashboard, Smartphone, Stethoscope, Video, BookOpen } from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import CtaBand from '../components/CtaBand/CtaBand'
import Button from '../components/Button'
import { Link } from '../router/router'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useSplitReveal } from '../hooks/useSplitReveal'
import { navigation } from '../content/site'

/**
 * For Members — the section index.
 *
 * `/members` is a real destination even though the nav renders it as a
 * dropdown trigger rather than a link: the footer links it directly, and so does
 * anyone who deletes a path segment from the URL bar. With all six child pages
 * built, leaving it on the ComingSoon fallback would have been the one broken
 * link in a finished section.
 *
 * The six cards are derived from `navigation` rather than re-listed, so adding a
 * seventh For Members page updates this page by itself. Only the one-line
 * summaries live here — the nav has no room for them.
 */
const summaries: Record<string, { body: string; icon: typeof Video }> = {
  '/members/find-a-doctor': {
    body: 'Search the network by name, specialty or location, and see who is in network before you book.',
    icon: Stethoscope,
  },
  '/members/virtual-care': {
    body: 'See a licensed provider by video through MyLiveDoc — usually the same day, without leaving home.',
    icon: Video,
  },
  '/members/resources': {
    body: 'Plan details, the video library and eight free calculators and screenings from outside health bodies.',
    icon: BookOpen,
  },
  '/members/faqs': {
    body: 'The eight questions we are asked most, answered in full — and searchable by what is in the answers.',
    icon: HelpCircle,
  },
  '/members/app': {
    body: 'Your cover, your claims and your digital ID card, on your phone. iPhone, iPad and Android.',
    icon: Smartphone,
  },
  '/members/portal': {
    body: 'The secure hub for your plan: benefits, claim status, ID cards, your details and support.',
    icon: LayoutDashboard,
  },
}

const memberPages = (navigation.find((item) => item.href === '/members')?.children ?? []).map(
  (child) => ({ ...child, ...summaries[child.href] }),
)

function MemberCard({
  label,
  href,
  body,
  icon: Icon,
  delay,
}: (typeof memberPages)[number] & { delay: number }) {
  const ref = useScrollReveal<HTMLDivElement>({ y: 30, delay })

  return (
    <div ref={ref} className="opacity-0">
      <Link
        href={href}
        className="group corner-smooth flex h-full flex-col rounded-card bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-soft sm:p-8"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold transition-transform duration-300 group-hover:scale-105">
          {Icon && <Icon size={21} strokeWidth={1.75} className="text-navy-800" />}
        </span>
        <h3 className="mt-7 text-[20px] font-semibold leading-snug text-navy-800 sm:text-[22px]">
          {label}
        </h3>
        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-navy-800/65">{body}</p>
        <span className="mt-6 text-[14px] font-semibold text-gold-dark">
          Open
          <span
            aria-hidden="true"
            className="ml-1.5 inline-block transition-transform duration-300 group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </span>
      </Link>
    </div>
  )
}

export default function MembersHub() {
  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })

  return (
    <>
      <PageHero
        eyebrow="FOR MEMBERS"
        titleTop="Everything your plan does,"
        titleBottom="in one place."
        lede={
          <>
            Find care, see a doctor online, manage your coverage and get answers. Six places to
            go, and none of them need a phone call first.
          </>
        }
        actions={
          <>
            <Button variant="gold" icon="arrow" size="lg" href="/members/portal">
              Member Portal
            </Button>
            <Button variant="ghost" size="lg" href="/members/faqs">
              Read the FAQs
            </Button>
          </>
        }
      />

      <section className="bg-cream-soft px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-container">
          <h2
            ref={headingRef}
            className="max-w-2xl text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px]"
          >
            Start <span className="text-gold-dark">wherever you are</span>
          </h2>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {memberPages.map((page, i) => (
              <MemberCard key={page.href} {...page} delay={i * 0.07} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        tone="gold"
        heading={
          <>
            Can&rsquo;t find what you need? <span className="text-navy-800">Ask us.</span>
          </>
        }
        body="Our member-first support team handles plan details, claims and anything else — real people, real answers."
        actions={
          <>
            <Button variant="light" icon="arrow" size="lg" href="/contact">
              Contact us
            </Button>
            <Button variant="ghost" size="lg" href="/plans">
              Explore Plans
            </Button>
          </>
        }
      />
    </>
  )
}
