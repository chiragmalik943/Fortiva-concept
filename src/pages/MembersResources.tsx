import { BookOpen, FileText, PlayCircle, Video } from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import LinkHub from '../components/LinkHub/LinkHub'
import CtaBand from '../components/CtaBand/CtaBand'
import Button from '../components/Button'
import { expertResources } from '../content/site'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useSplitReveal } from '../hooks/useSplitReveal'

/**
 * For Members → Resources.
 *
 * Copy is FTVA_Web Copy.odt's "Resources — Sub Navigation":
 *
 *   H1 + intro       → PageHero
 *   Videos           → the player band (PLACEHOLDER, see below)
 *   Plan details     → the two-up band, left
 *   Blog             → the two-up band, right
 *   Expert resources → LinkHub, all eight outbound tools with the doc's own URLs
 *
 * The eight expert-resource links live in content/site.ts. Every URL is the one
 * the doc supplies; none has been shortened or substituted, and each card names
 * the organisation it goes to, because all eight leave the site.
 */

// The doc's own copy for these two, with the buttons it specifies.
const shelf = [
  {
    label: 'Plan details',
    title: 'Access plan details anytime',
    body: 'Coverage limits, benefits and deductibles, in one place and available whenever you need them.',
    cta: 'Learn more',
    href: '/plans',
    icon: FileText,
  },
  {
    label: 'Blog',
    title: 'Insights, stories and updates',
    body: 'Get expert insights, member stories and the latest updates on health care trends.',
    cta: 'Read more',
    href: '/blog',
    icon: BookOpen,
  },
]

export default function MembersResources() {
  const videoHeadingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const playerRef = useScrollReveal<HTMLDivElement>({ y: 36, scale: 0.97, delay: 0.1 })
  const shelfRef = useScrollReveal<HTMLDivElement>({ y: 28, delay: 0.1 })

  return (
    <>
      <PageHero
        eyebrow="RESOURCES"
        titleTop="Meeting you where you are"
        titleBottom="with quality resources."
        lede={
          <>
            Stay informed, stay healthy. Explore Fortiva&rsquo;s curated resources designed to
            help you make the most of your coverage and live your healthiest life.
          </>
        }
        actions={
          <>
            <Button variant="gold" icon="arrow" size="lg" href="/plans">
              Plan details
            </Button>
            <Button variant="ghost" size="lg" href="/members/faqs">
              Read the FAQs
            </Button>
          </>
        }
      />

      {/* ── Videos ─────────────────────────────────────────────────────────
          PLACEHOLDER — TODO(client). The doc asks for a video section and gives
          the intro line, but supplies no videos: no titles, no URLs, no
          thumbnails, no durations. Three cards with invented titles would read
          as a real library that 404s on click, so this is a single player frame
          with an empty thumbnail strip — it shows the shape a library will take
          and states plainly that it isn't populated. Dropping real videos in
          replaces this block outright. */}
      <section id="videos" className="scroll-mt-32 bg-white px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-container">
          <span className="inline-block rounded-full bg-navy-800/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-navy-800/70">
            VIDEOS
          </span>
          <h2
            ref={videoHeadingRef}
            className="mt-5 max-w-2xl text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px]"
          >
            Watch and learn <span className="text-gold-dark">what your plan can do</span>
          </h2>
          <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-navy-800/65 sm:text-[17px]">
            Watch videos to help you learn more about everything Fortiva has to offer.
          </p>

          {/* Capped at max-w-3xl. At the full 1360px container a 16:9 frame is
              765px tall, and 765px of empty navy is a very loud way to say
              "nothing here yet" — it read as the most important thing on the
              page. Real thumbnails can take the full width. */}
          <div ref={playerRef} className="mx-auto mt-12 max-w-3xl opacity-0">
            <div className="corner-smooth relative aspect-[16/9] w-full overflow-hidden rounded-card bg-navy-800">
              {/* Abstract, not a fake screenshot. Two soft washes and a play
                  badge — enough to read as a player, with nothing pretending to
                  be footage. */}
              <div className="absolute inset-0 bg-gradient-to-br from-navy-600 via-navy-800 to-navy-900" />
              <div className="absolute -left-16 top-1/3 h-64 w-64 rounded-full bg-gold/12 blur-3xl" />
              <div className="absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-mist/12 blur-3xl" />

              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold sm:h-20 sm:w-20">
                  <PlayCircle size={30} strokeWidth={1.6} className="text-navy-800" />
                </span>
                <p className="mt-6 text-[17px] font-semibold text-white sm:text-[20px]">
                  The Fortiva video library is on its way
                </p>
                <p className="mt-2.5 max-w-sm text-[14px] leading-relaxed text-white/55">
                  Short explainers on enrolling, using your benefits and getting care will land
                  here first.
                </p>
              </div>
            </div>

            {/* Empty slots, labelled as empty. */}
            <ul className="mt-4 grid gap-4 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <li
                  key={i}
                  className="corner-smooth flex items-center gap-3 rounded-[18px] border border-dashed border-navy-800/15 bg-cream-soft/60 p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-white">
                    <Video size={17} strokeWidth={1.9} className="text-navy-800/35" />
                  </span>
                  <span className="flex flex-1 flex-col gap-2">
                    <span className="block h-2.5 w-3/4 rounded-full bg-navy-800/10" />
                    <span className="block h-2.5 w-1/2 rounded-full bg-navy-800/6" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Plan details + Blog ────────────────────────────────────────────
          Two of the doc's three H2s, side by side. They're a matched pair —
          heading, one sentence, one button each — so they read better as one
          band than as two near-empty full-width sections. */}
      <section className="bg-cream-soft px-6 py-24 sm:py-28">
        <div ref={shelfRef} className="mx-auto grid max-w-container gap-5 opacity-0 lg:grid-cols-2">
          {shelf.map(({ label, title, body, cta, href, icon: Icon }) => (
            <div
              key={label}
              className="corner-smooth flex flex-col justify-between rounded-card bg-white p-8 sm:p-10"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold">
                    <Icon size={20} strokeWidth={1.75} className="text-navy-800" />
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-800/45">
                    {label}
                  </span>
                </div>
                <h3 className="mt-7 max-w-sm text-[24px] font-semibold leading-snug text-navy-800 sm:text-[28px]">
                  {title}
                </h3>
                <p className="mt-4 max-w-sm text-[15.5px] leading-relaxed text-navy-800/65">
                  {body}
                </p>
              </div>
              <div className="mt-9">
                <Button variant="gold" icon="arrow" href={href}>
                  {cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <LinkHub
        className="bg-white"
        eyebrow="EXPERT RESOURCES"
        heading={
          <>
            Learn more about <span className="text-gold-dark">staying healthy</span>
          </>
        }
        intro="Eight tools published by outside health organisations — calculators, screenings and quit plans. All free, all open in a new tab."
        groups={expertResources}
      />

      <CtaBand
        tone="gold"
        heading={
          <>
            Still looking for <span className="text-navy-800">something?</span>
          </>
        }
        body="The FAQs cover coverage, claims and enrolment. If yours isn't there, the member team will answer it directly."
        actions={
          <>
            <Button variant="light" icon="arrow" size="lg" href="/members/faqs">
              Read the FAQs
            </Button>
            <Button variant="ghost" size="lg" href="/contact">
              Contact us
            </Button>
          </>
        }
      />
    </>
  )
}
