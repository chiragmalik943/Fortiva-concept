import {
  BookOpen,
  CalendarCheck,
  FileText,
  Receipt,
  Stethoscope,
  UserPlus,
  Video,
  Wallet,
} from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import LinkHub from '../components/LinkHub/LinkHub'
import VideoLibrary, { type VideoItem } from '../components/VideoLibrary/VideoLibrary'
import CtaBand from '../components/CtaBand/CtaBand'
import Button from '../components/Button'
import { expertResources } from '../content/site'
import { images } from '../assets/images'
import { useScrollReveal } from '../hooks/useScrollReveal'

/**
 * For Members → Resources.
 *
 * Copy is FTVA_Web Copy.odt's "Resources — Sub Navigation":
 *
 *   H1 + intro       → PageHero
 *   Videos           → VideoLibrary (PLACEHOLDER DATA, see below)
 *   Plan details     → the photo band, upper card
 *   Blog             → the photo band, lower card
 *   Expert resources → LinkHub, all eight outbound tools with the doc's own URLs
 *
 * The eight expert-resource links live in content/site.ts. Every URL is the one
 * the doc supplies; none has been shortened or substituted, and each card names
 * the organisation it goes to, because all eight leave the site.
 */

/**
 * PLACEHOLDER — TODO(client). Every field in `videoLibrary` below is invented.
 *
 * The copy doc asks for a video section and gives the intro line, but supplies
 * no videos: no titles, no URLs, no thumbnails, no durations. The previous
 * version of this section was therefore a single empty player frame that said
 * so out loud. That showed the shape but couldn't show the INTERACTION, which
 * is the part being designed — so this replaces it with six plausible member-
 * onboarding topics, wired to Google's public sample clips so the player
 * genuinely plays.
 *
 * What to change when the real library lands:
 *   • `SAMPLE` goes away, and each `src` becomes the real file or stream URL.
 *   • `duration` is authored here and does NOT match the sample clips' actual
 *     run times (those are 15s and 10min stubs). Real files make the two agree
 *     by themselves.
 *   • Titles, blurbs, descriptions, categories and tags are all placeholder
 *     copy in Fortiva's voice, not the client's words. They need signing off
 *     or replacing.
 *   • Nothing else: VideoLibrary takes the array and needs no other edit.
 */
const SAMPLE = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample'

const videoLibrary: VideoItem[] = [
  {
    id: 'getting-started',
    title: 'Getting started with your Fortiva plan',
    category: 'Start here',
    blurb: 'The five-minute tour of what your coverage includes and where to find it.',
    description:
      'A walk through your first week as a member: activating your account, reading your member ID card, and the three things worth doing before you need care. If you only watch one video, watch this one.',
    duration: '4:38',
    tags: ['New members', 'Coverage basics'],
    src: `${SAMPLE}/BigBuckBunny.mp4`,
    icon: UserPlus,
    cta: { label: 'See what your plan covers', href: '/plans/individuals-and-families' },
  },
  {
    id: 'virtual-care',
    title: 'Your first virtual visit, start to finish',
    category: 'Virtual care',
    blurb: 'What a MyLiveDoc appointment actually looks like, from booking to prescription.',
    description:
      'We record a full virtual visit end to end — choosing the visit type, what the provider asks, and how a prescription reaches your pharmacy afterwards. Useful if you have never had a video appointment and would rather know what to expect first.',
    duration: '6:12',
    tags: ['MyLiveDoc', 'Telehealth', 'Prescriptions'],
    src: `${SAMPLE}/ElephantsDream.mp4`,
    icon: Video,
    cta: { label: 'Read about virtual care', href: '/members/virtual-care' },
  },
  {
    id: 'find-a-doctor',
    title: 'Finding an in-network provider',
    category: 'Using your plan',
    blurb: 'How to search the directory, and how to tell in-network from out.',
    description:
      'Filtering the provider directory by specialty and location, reading a listing, and the one check to make before you book — whether that provider is in network for your specific tier, which is where most surprise bills start.',
    duration: '3:24',
    tags: ['Providers', 'Networks'],
    src: `${SAMPLE}/ForBiggerBlazes.mp4`,
    icon: Stethoscope,
    cta: { label: 'Find a doctor', href: '/members/find-a-doctor' },
  },
  {
    id: 'deductibles',
    title: 'Deductibles, copays and coinsurance',
    category: 'Costs explained',
    blurb: 'Three words that decide what you pay — in plain language, with numbers.',
    description:
      'One worked example, followed all the way through a year: what you pay before the deductible is met, what changes after it, and where the out-of-pocket maximum stops the total. No jargon, and nothing left as an exercise for the viewer.',
    duration: '5:07',
    tags: ['Costs', 'Coverage basics'],
    src: `${SAMPLE}/ForBiggerEscapes.mp4`,
    icon: Wallet,
    cta: { label: 'Compare plan tiers', href: '/plans/individuals-and-families' },
  },
  {
    id: 'claims',
    title: 'Filing and tracking a claim',
    category: 'Using your plan',
    blurb: 'What to submit, what happens next, and how long each stage takes.',
    description:
      'Most claims are filed for you by the provider. This covers the ones that are not: what a receipt needs to show, how to submit it, how to read a status update, and what to do if a claim comes back denied.',
    duration: '4:02',
    tags: ['Claims', 'Reimbursement'],
    src: `${SAMPLE}/ForBiggerJoyrides.mp4`,
    icon: Receipt,
    cta: { label: 'Claims questions in the FAQs', href: '/members/faqs' },
  },
  {
    id: 'open-enrollment',
    title: 'Open enrollment without the guesswork',
    category: 'Enrollment',
    blurb: 'A short checklist for choosing or changing a tier at renewal.',
    description:
      'Renewal is the one window where switching tiers is free, and it closes quietly. We go through what to look at first — last year’s actual spend, any prescriptions you take regularly, and whether your providers are still in network — and what genuinely does not matter.',
    duration: '3:56',
    tags: ['Enrollment', 'Renewal'],
    src: `${SAMPLE}/ForBiggerMeltdowns.mp4`,
    icon: CalendarCheck,
    cta: { label: 'Talk to the member team', href: '/members' },
  },
]

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
  const shelfRef = useScrollReveal<HTMLDivElement>({ y: 28, delay: 0.1 })

  return (
    <>
      <PageHero
        tone="sky"
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
            <Button variant="dark" icon="arrow" size="lg" href="/plans">
              Plan details
            </Button>
            <Button variant="white" size="lg" href="/members/faqs">
              Read the FAQs
            </Button>
          </>
        }
      />

      {/* ── Videos ─────────────────────────────────────────────────────────
          A grid of thumbnails; clicking one opens a full-width row directly
          under its own row — player on the left, everything written about the
          video on the right — and the card stays ringed in gold while it plays.
          See VideoLibrary.tsx for why the panel is placed by row rather than
          appended to the end of the grid, and `videoLibrary` above for what in
          this section is still placeholder data. */}
      <VideoLibrary
        id="videos"
        eyebrow="VIDEOS"
        heading={
          <>
            Watch and learn <span className="text-gold-dark">what your plan can do</span>
          </>
        }
        intro="Watch videos to help you learn more about everything Fortiva has to offer. Pick one and it opens right where it sits."
        videos={videoLibrary}
      />

      {/* ── Plan details + Blog ────────────────────────────────────────────
          Two of the doc's three H2s. They're a matched pair — heading, one
          sentence, one button each — so they read better as one band than as two
          near-empty full-width sections.

          ── Side by side on cream, now stacked on a photograph ───────────────
          The band was two cards in a 2-column grid on `bg-cream-soft`. It is a
          full-bleed photograph with both cards stacked in a column down its right
          half instead, which turns the pair from a row of two panels into a
          composition: the picture holds the left, the two asks hold the right.

          Three things it needs to keep working:

          • A minimum height. The section's height used to come from two cards
            side by side; stacked, they are taller than the photograph needs and
            shorter than it wants on a wide window, so `min-h` gives the picture
            a floor to fill.
          • `object-[28%_center]`. The asset is 1920 x 1080 and its subject is in
            the left third; a tall section crops a 16:9 photograph hard from the
            sides, and centred crops the subject out.
          • The cards stay OPAQUE white. A photograph is the one surface a
            translucent card cannot sit on — every line of body copy would be
            reading against whatever pixel happened to be behind it.

          The cards occupy the right ~34% of the container at `lg` and up, so the
          asset's subject needs to stay clear of that band. */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-28 lg:min-h-[760px]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
          <img
            src={images.resourcesBg}
            alt=""
            className="h-full w-full object-cover object-[28%_center]"
          />
        </div>

        {/* `lg:ml-auto` inside a `max-w-container` rather than a two-column grid
            with an empty first cell: the column is a fixed measure, and pushing it
            to the container's right edge keeps it there at every width above `lg`
            without a phantom cell to keep in step with it.

            ── 460px, and the content inside runs the full width of it ─────────
            The column was 560px and the copy inside each card was capped at
            `max-w-sm` (384px), which is where the dead space came from: 560 minus
            80px of padding leaves 480px of usable width, so every heading and
            paragraph stopped ~96px short of the card's right edge and each card
            read as three-quarters filled.

            Both halves of that are fixed. The column is 460px — 380px of usable
            width — and the caps are gone, so the copy sets to the card's own
            measure. The cards stay wider than tall (~460 x 300), which is the
            proportion they were drawn at; they are just no longer carrying a
            column of blank surface down the right. */}
        <div className="relative mx-auto max-w-container">
          <div
            ref={shelfRef}
            className="flex flex-col gap-5 opacity-0 lg:ml-auto lg:max-w-[460px]"
          >
            {shelf.map(({ label, title, body, cta, href, icon: Icon }) => (
            <div
              key={label}
              className="corner-smooth flex flex-col justify-between rounded-card bg-white p-7 shadow-card sm:p-8"
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
                <h3 className="mt-7 text-[24px] font-semibold leading-snug text-navy-800 sm:text-[27px]">
                  {title}
                </h3>
                <p className="mt-4 text-[15.5px] leading-relaxed text-navy-800/65">
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
