import {
  BookOpen,
  Briefcase,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LifeBuoy,
  LineChart,
  Users,
} from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import VideoLibrary, { type VideoItem } from '../components/VideoLibrary/VideoLibrary'
import DocumentShelf, { type DocumentGroup } from '../components/DocumentShelf/DocumentShelf'
import ImageBand from '../components/ImageBand/ImageBand'
import CtaBand from '../components/CtaBand/CtaBand'
import Button from '../components/Button'
import { images } from '../assets/images'

/**
 * For Brokers → Resources.
 *
 * Copy is FTVA_Web Copy.odt's "Resources — Sub Navigation" under For Brokers:
 *
 *   H1 + intro     → PageHero
 *   Videos         → VideoLibrary (PLACEHOLDER DATA, see below)
 *   Plan Documents → DocumentShelf (PLACEHOLDER DATA, see below)
 *   Need help?     → the support ImageBand, then CtaBand
 *
 * The doc's own words are the H1, the intro and the three section lines. Both
 * catalogues under them are ours, and both say so below.
 */

/* ─────────────────────────────────────────────────────────────────────────────
   PLACEHOLDER — TODO(client)

   The doc asks for a broker video library and gives the one line above it
   ("Get up to speed fast with our broker video library") and nothing else: no
   titles, no URLs, no durations. The four entries below are invented — plausible
   broker-onboarding topics in Fortiva's voice — and wired to the same public
   sample clips the For Members resources page uses, so the player genuinely
   plays and the interaction can be judged.

   What changes when the real library lands: `SAMPLE` goes away and each `src`
   becomes a real file or stream URL; `duration` is authored here and does NOT
   match the sample clips' run times; titles, blurbs, descriptions, categories
   and tags all need signing off or replacing. VideoLibrary itself needs no edit.
   ───────────────────────────────────────────────────────────────────────────── */
const SAMPLE = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample'

const videoLibrary: VideoItem[] = [
  {
    id: 'broker-start-here',
    title: 'Getting appointed with Fortiva',
    category: 'Start here',
    blurb: 'Appointment, licensing and your first login, end to end.',
    description:
      'What the appointment process asks for, how long each step takes and who to chase if one stalls. Ends with your Broker Portal credentials in hand.',
    duration: '5:12',
    tags: ['Onboarding', 'Appointment'],
    src: `${SAMPLE}/BigBuckBunny.mp4`,
    icon: GraduationCap,
    cta: { label: 'Open the Broker Portal', href: '/brokers/portal' },
  },
  {
    id: 'broker-quoting',
    title: 'Quoting and enrolling in the portal',
    category: 'Portal',
    blurb: 'From a client’s details to a completed enrollment.',
    description:
      'A run through the quoting flow: entering a household, comparing tiers side by side, adding supplemental cover and submitting the enrollment without leaving the screen.',
    duration: '7:44',
    tags: ['Quoting', 'Enrollment'],
    src: `${SAMPLE}/ElephantsDream.mp4`,
    icon: ClipboardCheck,
    cta: { label: 'See the portal', href: '/brokers/portal' },
  },
  {
    id: 'broker-plan-tiers',
    title: 'Explaining the plan tiers to a client',
    category: 'Selling',
    blurb: 'The differences that actually change a client’s decision.',
    description:
      'How the multi-tier plans differ where it matters — deductible, network and the supplemental add-ons — and how to frame that for an individual, a family and a small business.',
    duration: '6:05',
    tags: ['Plans', 'Client conversations'],
    src: `${SAMPLE}/ForBiggerBlazes.mp4`,
    icon: Users,
    cta: { label: 'Compare the plans', href: '/plans' },
  },
  {
    id: 'broker-renewals',
    title: 'Renewals and retention',
    category: 'Growing your book',
    blurb: 'Keeping the business you have written.',
    description:
      'What the renewal window looks like from the portal, which accounts are worth a call before it opens, and how commissions tied to retention are calculated.',
    duration: '4:51',
    tags: ['Renewals', 'Commissions'],
    src: `${SAMPLE}/ForBiggerEscapes.mp4`,
    icon: LineChart,
  },
  {
    id: 'broker-small-business',
    title: 'Writing small business groups',
    category: 'Selling',
    blurb: 'What changes when the client is an employer.',
    description:
      'Group eligibility, contribution rules and the questions an owner will ask before they sign. Includes the enrollment window and what you need from them before it opens.',
    duration: '8:20',
    tags: ['Small business', 'Groups'],
    src: `${SAMPLE}/ForBiggerJoyrides.mp4`,
    icon: Briefcase,
    cta: { label: 'See the employer plans', href: '/plans/employers' },
  },
  {
    id: 'broker-support',
    title: 'Getting help fast',
    category: 'Support',
    blurb: 'Who to contact, and what to have ready.',
    description:
      'The three routes into broker support, which one is quickest for which kind of question, and the details that turn a two-day back-and-forth into a single reply.',
    duration: '3:26',
    tags: ['Support', 'Escalation'],
    src: `${SAMPLE}/ForBiggerMeltdowns.mp4`,
    icon: LifeBuoy,
    cta: { label: 'Contact broker support', href: '/contact' },
  },
]

/* ─────────────────────────────────────────────────────────────────────────────
   PLACEHOLDER — TODO(client)

   The doc's line for this section is "Access the latest plan details, compliance
   information and member resources. All in one place." — three categories and no
   files. The three groups below are exactly those three categories, named in the
   Broker Portal page's own wording ("plan summaries, compliance guides and
   member materials"). The individual rows inside them are invented, and the
   section carries a note saying so on the page itself, not just here.
   ───────────────────────────────────────────────────────────────────────────── */
const documentGroups: DocumentGroup[] = [
  {
    title: 'Plan summaries',
    body: 'The current tier line-up, what each one covers and where the limits sit.',
    icon: FileText,
    items: [
      { label: 'Individual & family plan guide', meta: 'PDF' },
      { label: 'Small business plan guide', meta: 'PDF' },
      { label: 'Supplemental benefits overview', meta: 'PDF' },
      { label: 'Summary of benefits and coverage', meta: 'PDF' },
    ],
  },
  {
    title: 'Compliance guides',
    body: 'What you are required to hold, disclose and file, in one place.',
    icon: ClipboardCheck,
    items: [
      { label: 'Broker appointment checklist', meta: 'PDF' },
      { label: 'Licensing and appointment guide', meta: 'PDF' },
      { label: 'Marketing and disclosure rules', meta: 'PDF' },
      { label: 'Commission schedule', meta: 'PDF' },
    ],
  },
  {
    title: 'Member materials',
    body: 'The pieces you hand to a client — leave-behinds and welcome packs.',
    icon: BookOpen,
    items: [
      { label: 'Member welcome pack', meta: 'PDF' },
      { label: 'Digital ID card explainer', meta: 'PDF' },
      { label: 'Enrollment checklist', meta: 'PDF' },
      { label: 'Fortiva plan one-pager', meta: 'PDF' },
    ],
  },
]

export default function BrokersResources() {
  return (
    <>
      <PageHero
        eyebrow="BROKER RESOURCES"
        titleTop="Everything you need"
        titleBottom="to sell Fortiva."
        lede={
          <>
            Your one-stop hub for everything you need to succeed with Fortiva. From
            quick-start videos to detailed plan documents, we&rsquo;ve got you covered.
          </>
        }
        actions={
          <>
            <Button variant="gold" icon="arrow" size="lg" href="/brokers/portal">
              Broker Portal
            </Button>
            <Button variant="ghost" size="lg" href="/contact">
              Contact broker support
            </Button>
          </>
        }
      />

      <VideoLibrary
        id="videos"
        eyebrow="VIDEOS"
        heading={
          <>
            Get up to speed <span className="text-gold-dark">fast</span>
          </>
        }
        intro="Six short walkthroughs covering appointment, quoting, the plan tiers, renewals, group business and support — the things brokers ask about in their first month."
        videos={videoLibrary}
      />

      <DocumentShelf
        eyebrow="PLAN DOCUMENTS"
        heading={
          <>
            The latest paperwork, <span className="text-gold-dark">all in one place</span>
          </>
        }
        intro="Access the latest plan details, compliance information and member resources — the current version of each, so there is never a question of which one you are holding."
        groups={documentGroups}
        action={
          <Button variant="gold" icon="arrow" href="/brokers/portal">
            Find these in the portal
          </Button>
        }
        note="Document names shown are indicative. The live files are issued through the Broker Portal, and this shelf will link straight to them."
        className="bg-white"
      />

      {/* ── Need help? ────────────────────────────────────────────────────
          The doc gives this heading one sentence and a Contact us button. A band
          with a photograph is what stops one sentence reading as a section that
          ran out — and the page still closes on the gold CTA below, so this is a
          hand-off rather than the ask itself. */}
      <ImageBand
        eyebrow="NEED HELP?"
        heading={
          <>
            Our broker support team <span className="text-gold-dark">is here for you</span>
          </>
        }
        body={
          <p>
            Enrollment questions, commission queries, a plan document you can&rsquo;t find
            &mdash; there is a person on the other end of it, and they know your book.
          </p>
        }
        points={[
          'Help with enrollment, from a first quote to a submitted application.',
          'Commission questions answered by the team that calculates them.',
          'Plan and compliance documents sent straight through if the shelf is out of date.',
        ]}
        image={images.brokerSupport}
        imageAlt="A Fortiva broker support specialist at work"
        imageSide="left"
        action={
          <Button variant="gold" icon="arrow" href="/contact">
            Contact us
          </Button>
        }
      />

      <CtaBand
        tone="gold"
        heading={
          <>
            Still have a question? <span className="text-navy-800">Ask the team.</span>
          </>
        }
        body="The broker FAQs cover commissions, plan types and getting started. Anything they don’t, we will."
        actions={
          <>
            <Button variant="light" icon="arrow" size="lg" href="/brokers/faqs">
              Read the broker FAQs
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
