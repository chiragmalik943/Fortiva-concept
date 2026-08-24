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
  },
  {
    title: 'Search “Fortiva”',
    body: 'Download the app and it will be ready the moment it finishes installing.',
  },
  {
    title: 'Log in or sign up',
    body: 'Use your member credentials to reach your personalized health insurance dashboard.',
  },
]

const stores = [
  { label: 'Apple App Store', sub: 'iPhone and iPad', href: externalTargets.appStore, icon: Apple },
  { label: 'Google Play', sub: 'Android', href: externalTargets.playStore, icon: Smartphone },
]

export default function MembersApp() {
  const storeRef = useScrollReveal<HTMLDivElement>({ y: 26, delay: 0.1 })

  return (
    <>
      <PageHero
        eyebrow="FORTIVA APP"
        titleTop="Your health coverage,"
        titleBottom="simplified."
        lede={
          <>
            The Fortiva App puts everything you need to manage your plan right at your
            fingertips &mdash; your cover, your claims, your ID card and a way to reach us.
          </>
        }
        actions={
          <>
            <ActionButton variant="gold" icon="arrow" size="lg" href={externalTargets.appStore}>
              Download now
            </ActionButton>
            <Button variant="ghost" size="lg" href="/members/portal">
              Prefer the browser?
            </Button>
          </>
        }
      />

      <PhoneShowcase
        eyebrow="IN THE APP"
        heading={
          <>
            Five things you can do <span className="text-gold-dark">from your pocket</span>
          </>
        }
        intro="Scroll the list and the screen follows — each one is a real place in the app, not a feature bullet."
        features={features}
      />

      <StepFlow
        surface="white"
        eyebrow="GETTING STARTED"
        heading={
          <>
            Three steps and <span className="text-gold-dark">you&rsquo;re in</span>
          </>
        }
        intro="Getting started is easy. If you already have a Fortiva member login, it's the same one."
        steps={gettingStarted}
        action={
          <div ref={storeRef} className="grid w-full gap-4 opacity-0 sm:max-w-lg sm:grid-cols-2">
            {stores.map(({ label, sub, href, icon: Icon }) => {
              const pending = isPlaceholderHref(href)
              return (
                <a
                  key={label}
                  href={href}
                  target={pending ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  title={pending ? 'Not connected yet — awaiting the store listing' : undefined}
                  onClick={(e) => {
                    if (pending) e.preventDefault()
                  }}
                  className={`corner-smooth flex items-center gap-4 rounded-[16px] bg-navy-800 px-5 py-4 text-left transition-transform duration-300 hover:scale-[1.02] ${
                    pending ? 'cursor-not-allowed' : ''
                  }`}
                >
                  <Icon size={24} strokeWidth={1.7} className="shrink-0 text-gold" />
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-semibold text-white">
                      {label}
                    </span>
                    <span className="block text-[12.5px] text-white/50">{sub}</span>
                  </span>
                </a>
              )
            })}
          </div>
        }
      />

      <CtaBand
        tone="gold"
        heading={
          <>
            Life moves fast. Your health coverage{' '}
            <span className="text-navy-800">should keep up.</span>
          </>
        }
        body="With the Fortiva App you have the tools to make informed decisions about your care, wherever you are."
        actions={
          <>
            <ActionButton variant="light" icon="arrow" size="lg" href={externalTargets.appStore}>
              Download now
            </ActionButton>
            <Button variant="ghost" size="lg" href="/members/portal">
              Member Portal
            </Button>
          </>
        }
        note="Available on iPhone, iPad and Android. Your member credentials work in the app and the portal."
      />
    </>
  )
}
