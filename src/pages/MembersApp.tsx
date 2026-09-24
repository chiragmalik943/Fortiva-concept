import { Apple, Smartphone } from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import PhoneShowcase, { type AppFeature } from '../components/PhoneShowcase/PhoneShowcase'
import StepFlow, { type Step } from '../components/StepFlow/StepFlow'
import CtaBand from '../components/CtaBand/CtaBand'
import Button from '../components/Button'
import ActionButton from '../components/ActionButton'
import { images } from '../assets/images'
import { externalTargets, isPlaceholderHref } from '../content/site'
import { useScrollReveal } from '../hooks/useScrollReveal'

/**
 * For Members → Download the Fortiva App.
 *
 * Copy is FTVA_Web Copy.odt's "Download the Fortiva App — Sub Navigation":
 *
 *   H1 + intro              → PageHero
 *   The five "here's what you can" bullets → PhoneShowcase
 *   Getting started is easy → StepFlow, with the two store buttons attached
 *   "Life moves fast…"      → CtaBand
 *
 * The doc's five bullets are the page's whole substance, so they get the
 * set-piece rather than a list: a phone that changes screen as you read down
 * them. The screens are the real app captures in `public/app-scr-1..5.png`,
 * paired to the bullets in order — see images.ts for the export ratio the device
 * aperture expects. The bullets carry no icons: the redesigned section marks the
 * active one with a gold segment on a rail instead, and an icon beside that was
 * two things saying the same thing.
 *
 * There is no download button on that section. The page already carries the same
 * call three times — the hero, the two store buttons under "Getting started", and
 * the closing band — and a fourth in the middle of a section whose whole job is
 * to show what the app does was the one that had least to say.
 */
const features: AppFeature[] = [
  {
    title: 'View your plan details',
    body: 'Check your coverage, benefits and deductible anytime.',
    screen: images.appScreens[0],
  },
  {
    title: 'Find care fast',
    body: 'Locate in-network doctors, specialists and facilities near you.',
    screen: images.appScreens[1],
  },
  {
    title: 'Track claims and spending',
    body: 'Stay on top of claims and monitor your out-of-pocket costs.',
    screen: images.appScreens[2],
  },
  {
    title: 'Access digital ID cards',
    body: 'No more digging for your card — your ID is always with you.',
    screen: images.appScreens[3],
  },
  {
    title: 'Get support instantly',
    body: 'Chat with a Fortiva representative or access FAQs for quick answers.',
    screen: images.appScreens[4],
  },
]

// The doc's "Getting started is easy" paragraph, broken into the three things it
// actually asks you to do. No step was added; the sentence just contained three.
const gettingStarted: Step[] = [
  {
    title: 'Open your store',
    body: 'Apple users go to the App Store, Android users to Google Play.',
    image: images.appSteps[0],
  },
  {
    title: 'Search “Fortiva”',
    body: 'Download the app and it will be ready the moment it finishes installing.',
    image: images.appSteps[1],
  },
  {
    title: 'Log in or sign up',
    body: 'Use your member credentials to reach your personalized health insurance dashboard.',
    image: images.appSteps[2],
  },
]

const stores = [
  { label: 'Apple App Store', sub: 'iPhone & iPad', href: externalTargets.appStore, icon: Apple },
  {
    label: 'Google Play Store',
    sub: 'Android Devices',
    href: externalTargets.playStore,
    icon: Smartphone,
  },
]

/**
 * One store button, and the SAME one in both places it appears on this page —
 * the hero and "Getting started is easy". They used to be a navy pair in the
 * second section and a generic "Download now" pill in the hero, which meant the
 * page asked for the download twice in two different shapes.
 *
 * Navy is the hero's own primary ink (`tone: 'sky'` pairs a dark primary with a
 * white secondary — see heroTone.tsx), so a pair of navy store buttons is the
 * hero's primary control twice rather than a primary and a secondary. That is
 * the intent: there is no second thing being asked for here, only two stores.
 *
 * `pending` is the not-yet-live case. Neither listing exists, so the button is
 * drawn as normal, says so on hover and does nothing on click — see
 * `isPlaceholderHref` in content/site.ts.
 */
function StoreButton({
  label,
  sub,
  href,
  icon: Icon,
  size = 'default',
}: (typeof stores)[number] & { size?: 'default' | 'lg' }) {
  const pending = isPlaceholderHref(href)
  const isLg = size === 'lg'
  return (
    <a
      href={href}
      target={pending ? undefined : '_blank'}
      rel="noopener noreferrer"
      title={pending ? 'Not connected yet — awaiting the store listing' : undefined}
      onClick={(e) => {
        if (pending) e.preventDefault()
      }}
      className={`corner-smooth flex items-center gap-4 bg-navy-800 text-left transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] ${
        isLg ? 'rounded-[20px] px-6 py-3.5' : 'rounded-[16px] px-5 py-4'
      } ${pending ? 'cursor-not-allowed' : ''}`}
    >
      <Icon size={isLg ? 27 : 24} strokeWidth={1.7} className="shrink-0 text-gold" />
      <span className="min-w-0">
        <span
          className={`block truncate font-semibold text-white ${isLg ? 'text-base' : 'text-[15px]'}`}
        >
          {label}
        </span>
        <span className={`block text-white/50 ${isLg ? 'text-[13px]' : 'text-[12.5px]'}`}>
          {sub}
        </span>
      </span>
    </a>
  )
}

export default function MembersApp() {
  const storeRef = useScrollReveal<HTMLDivElement>({ y: 26, delay: 0.1 })

  return (
    <>
      <PageHero
        eyebrow="Download the App"
        tone="sky"
        /* One sentence across two lines, and the weight break is the accent —
           PageHero sets `titleTop` in regular and `titleBottom` in bold, so
           "Fortiva App" carries without needing a second colour. */
        titleTop="Download the"
        titleBottom="Fortiva App"
        lede={
          <>
            Your health coverage, simplified. The Fortiva App puts everything you need to
            manage your plan right at your fingertips.
          </>
        }
        actions={stores.map((store) => (
          <StoreButton key={store.label} {...store} size="lg" />
        ))}
        note={
          <>
            Apple and Android users can go to the Apple App Store or Google Play Store, search
            for &ldquo;Fortiva&rdquo; and download to get started. Once there, log in or create
            an account using your member credentials to access your personalized health
            insurance dashboard.
          </>
        }
      />

      <PhoneShowcase
        heading={
          <>
            Five things you can do <span className="text-gold-dark">from your pocket</span>
          </>
        }
        intro="The Fortiva App is designed to make managing your health coverage effortless. Here’s what you can do."
        features={features}
      />

      <StepFlow
        surface="white"
        heading={
          <>
            Three steps and <span className="text-gold-dark">you&rsquo;re in</span>
          </>
        }
        steps={gettingStarted}
        action={
          <div ref={storeRef} className="grid w-full gap-4 opacity-0 sm:max-w-lg sm:grid-cols-2">
            {stores.map((store) => (
              <StoreButton key={store.label} {...store} />
            ))}
          </div>
        }
      />

      <CtaBand
        tone="gold"
        heading={
          <>
            {/* The break between the two inks is on the SENTENCE boundary. It
                used to fall mid-clause — white through "Your health coverage",
                navy from "should keep up" — which read as a line that had
                changed colour rather than as two statements. */}
            Life moves fast.{' '}
            <span className="text-navy-800">Your health coverage should keep up.</span>
          </>
        }
        body="With the Fortiva App you have the tools to make informed decisions about your care, wherever you are."
        actions={
          <>
            <ActionButton variant="light" icon="arrow" size="lg" href={externalTargets.appStore}>
              Download now
            </ActionButton>
            <Button variant="dark" size="lg" href="/members/portal">
              Member Portal
            </Button>
          </>
        }
        note="Available on iPhone, iPad and Android. Your member credentials work in the app and the portal."
      />
    </>
  )
}
