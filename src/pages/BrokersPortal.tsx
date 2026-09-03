import { ClipboardCheck, FileDown, Megaphone } from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import PortalShowcase, { type PortalItem } from '../components/PortalShowcase/PortalShowcase'
import ImageBand from '../components/ImageBand/ImageBand'
import CtaBand from '../components/CtaBand/CtaBand'
import Button from '../components/Button'
import ActionButton from '../components/ActionButton'
import { externalTargets } from '../content/site'
import { images } from '../assets/images'

/**
 * For Brokers → Broker Portal.
 *
 * Copy is FTVA_Web Copy.odt's "Broker Portal — Sub Navigation":
 *
 *   H1 + H2 + intro         → PageHero
 *   What is the Broker Portal? (three items) → PortalShowcase
 *   “It’s more than a dashboard”             → the ImageBand under it
 *   Your success starts here + two buttons   → CtaBand
 *
 * The same set-piece as the Member Portal page, deliberately: the two portals are
 * the same product for two audiences, and a broker who has seen the member page
 * should recognise the shape. See PortalShowcase.tsx — the section pins, each
 * screenshot slides out to the left as the next arrives, and the tab underneath
 * lights up as it lands.
 *
 * Three sections here against the member portal's six, which costs the component
 * nothing: a tablist reads correctly at any length, and the pin is three steps
 * long instead of six.
 */

// The doc's three, verbatim: bolded phrase, then its sentence.
const portalItems: PortalItem[] = [
  {
    title: 'Quote and enroll clients',
    body: 'Get instant quotes and complete enrollments in just a few clicks.',
    icon: ClipboardCheck,
    screen: images.brokerPortalScreens[0],
  },
  {
    title: 'Access plan documents',
    body: 'Download the latest plan summaries, compliance guides and member materials.',
    icon: FileDown,
    screen: images.brokerPortalScreens[1],
  },
  {
    title: 'Stay informed',
    body: 'Receive updates, training resources and marketing tools to grow your business.',
    icon: Megaphone,
    screen: images.brokerPortalScreens[2],
  },
]

export default function BrokersPortal() {
  return (
    <>
      {/* The doc's own H1 and H2, in that order: "The Fortiva Broker Portal" is
          the title and "Your all-in-one platform for managing your Fortiva
          business" is the line under it. Running the H2 as the headline pushed it
          to three lines and buried the name of the thing. */}
      <PageHero
        tone="dark"
        eyebrow="BROKER PORTAL"
        titleTop="The Fortiva"
        titleBottom="Broker Portal."
        lede={
          <>
            Your all-in-one platform for managing your Fortiva business &mdash; designed to
            make your job easier, faster and more profitable.
          </>
        }
        actions={
          <>
            <ActionButton variant="gold" icon="arrow" size="lg" href={externalTargets.brokerPortal}>
              Log in to your Portal
            </ActionButton>
            <Button variant="white" size="lg" href="/contact">
              Request access
            </Button>
          </>
        }
      />

      <PortalShowcase
        eyebrow="INSIDE THE PORTAL"
        heading={
          <>
            A secure hub <span className="text-gold-dark">where you can</span>
          </>
        }
        intro="The Broker Portal is a secure, online hub for the three things that take up most of a broker’s week."
        items={portalItems}
        action={
          <ActionButton variant="gold" icon="arrow" href={externalTargets.brokerPortal}>
            Log in to your Portal
          </ActionButton>
        }
      />

      {/* ── More than a dashboard ─────────────────────────────────────────
          The doc's own phrase, given the band it deserves. This is also where the
          page answers the question the showcase raises — what it is like to work
          in day to day — with a photograph rather than another screen. */}
      <ImageBand
        eyebrow="YOUR COMMAND CENTER"
        heading={
          <>
            More than a dashboard, <span className="text-gold-dark">start to finish</span>
          </>
        }
        body={
          <p>
            Quote in the morning, enroll by lunch and pull the plan summary a client asked
            for without opening a second tab. Everything Fortiva asks you to do lives behind
            one login, and everything it gives you back lives there too.
          </p>
        }
        points={[
          'One login for quoting, enrollment, documents and updates.',
          'The current version of every plan and compliance document.',
          'Training and marketing material as it is released.',
        ]}
        image={images.brokerPortalPhoto}
        imageAlt="A Fortiva broker working in the portal"
        imageSide="left"
        action={
          <Button variant="gold" icon="arrow" href="/brokers/resources">
            Browse broker resources
          </Button>
        }
      />

      <CtaBand
        tone="gold"
        heading={
          <>
            Your success <span className="text-navy-800">starts here.</span>
          </>
        }
        body="Already appointed? Sign in. Not yet? Request access and the broker team will get you set up."
        actions={
          <>
            <ActionButton
              variant="light"
              icon="arrow"
              size="lg"
              href={externalTargets.brokerPortal}
            >
              Log in to your Portal
            </ActionButton>
            <Button variant="ghost" size="lg" href="/contact">
              Request access
            </Button>
          </>
        }
      />
    </>
  )
}
