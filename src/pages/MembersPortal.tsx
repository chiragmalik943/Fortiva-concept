import { LifeBuoy, Lock, Smartphone } from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import PortalCarousel, { type CarouselCard } from '../components/PortalCarousel/PortalCarousel'
import CtaBand from '../components/CtaBand/CtaBand'
import Button from '../components/Button'
import ActionButton from '../components/ActionButton'
import { images } from '../assets/images'
import { externalTargets } from '../content/site'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useSplitReveal } from '../hooks/useSplitReveal'

/**
 * For Members → Member Portal.
 *
 * Copy is FTVA_Web Copy.odt's "Member Portal — Sub Navigation":
 *
 *   H1 + intro                 → PageHero
 *   Your portal (six items)    → PortalCarousel
 *   Why use the Member Portal? → the two-up band
 *   Access your Member Portal  → CtaBand
 *
 * ── All six are back ────────────────────────────────────────────────────────
 * The six items used to be tabs under one large screenshot window
 * (PortalShowcase, which still runs the Broker and Provider portals), and that
 * window needed a real capture per item — so "Update personal information" sat
 * commented out for want of `portal-scr-5.png` and the section shipped five of
 * the doc's six.
 *
 * The carousel needs an icon rather than a screenshot, and all six icons were
 * delivered, so the list below is the copy doc's own again. See PortalCarousel.
 */
// In the doc's order, which is also the order the icons are listed in
// `portalCardIcons` — see the mapping note there, because the delivered file
// numbers are NOT this order.
const portalCards: CarouselCard[] = [
  {
    title: 'View your plan details',
    body: 'Check your benefits, coverage limits and deductible in seconds.',
    icon: images.portalCardIcons[0],
  },
  {
    title: 'Track claims and payments',
    body: 'Monitor claim status and review your payment history with ease.',
    icon: images.portalCardIcons[1],
  },
  {
    title: 'Download digital ID cards',
    body: 'Access your ID card instantly — no more waiting for mail.',
    icon: images.portalCardIcons[2],
  },
  {
    title: 'Find care fast',
    body: 'Search for in-network doctors, specialists and facilities near you.',
    icon: images.portalCardIcons[3],
  },
  {
    title: 'Update personal information',
    body: 'Keep your contact details and preferences up to date.',
    icon: images.portalCardIcons[4],
  },
  {
    title: 'Get support',
    body: 'Message a Fortiva representative or browse FAQs for quick answers.',
    icon: images.portalCardIcons[5],
  },
]

export default function MembersPortal() {
  const whyHeadingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const whyBodyRef = useScrollReveal<HTMLDivElement>({ y: 24, delay: 0.12 })
  const asideRef = useScrollReveal<HTMLDivElement>({ y: 32, delay: 0.18 })

  return (
    <>
      <PageHero
        tone="sky"
        titleTop="Welcome to the"
        titleBottom="Fortiva Member Portal."
        lede={
          <>
            Your health coverage, your way. The Member Portal is your secure online hub for
            managing your plan anytime, anywhere.
          </>
        }
        actions={
          <>
            <ActionButton variant="dark" icon="arrow" size="lg" href={externalTargets.memberPortal}>
              Access your Member Portal
            </ActionButton>
            <Button variant="white" size="lg" href="/members/app">
              Get the app instead
            </Button>
          </>
        }
      />

      <PortalCarousel
        heading={
          <>
            Your <span className="text-gold-dark">portal</span>
          </>
        }
        intro={
          <>
            The portal is designed to give you control and convenience. Here&rsquo;s what
            you&rsquo;ll find:
          </>
        }
        cards={portalCards}
      />

      {/* ── Why use the Member Portal? ─────────────────────────────────────
          The doc's closing paragraph, with the app cross-link beside it. The two
          belong together: they are the same account and the same credentials, and
          a visitor who has just read six portal features is exactly the person
          who wants to know it's also on their phone. */}
      <section className="bg-white px-6 py-24 sm:py-28">
        <div className="mx-auto grid max-w-container items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
          <div>
            <h2
              ref={whyHeadingRef}
              className="max-w-xl text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px]"
            >
              Managing your coverage{' '}
              <span className="text-gold-dark">shouldn&rsquo;t be complicated</span>
            </h2>
            <div ref={whyBodyRef} className="opacity-0">
              <p className="mt-7 max-w-xl text-[16.5px] leading-[1.65] text-navy-800/75 sm:text-[17.5px]">
                With the Fortiva Member Portal, you have everything you need to make informed
                decisions about your care &mdash; all in one place.
              </p>
              <ul className="mt-8 flex max-w-md flex-col">
                {[
                  { icon: Lock, text: 'Secure sign-in, and only you can see what is behind it.' },
                  { icon: Smartphone, text: 'The same account as the Fortiva app, on any device.' },
                  { icon: LifeBuoy, text: 'A real person to message, not just a help article.' },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-4 border-t border-navy-800/10 py-4 last:border-b">
                    <Icon size={17} strokeWidth={1.9} className="shrink-0 text-gold-dark" />
                    <span className="text-[15px] leading-relaxed text-navy-800/70">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div ref={asideRef} className="opacity-0">
            <div className="corner-smooth rounded-card bg-navy-800 p-8 sm:p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold">
                <Smartphone size={22} strokeWidth={1.7} className="text-navy-800" />
              </span>
              <h3 className="mt-7 text-[22px] font-semibold leading-snug text-white sm:text-[25px]">
                Everything here is in the app too
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-white/60">
                Your plan, your claims and your digital ID card travel with you. Same login, no
                second account to set up.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="gold" icon="arrow" href="/members/app">
                  Download the app
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        tone="gold"
        heading={
          <>
            Your coverage, <span className="text-navy-800">on your terms</span>
          </>
        }
        body="Sign in to view your plan, track a claim or download your ID card."
        actions={
          <>
            <ActionButton variant="light" icon="arrow" size="lg" href={externalTargets.memberPortal}>
              Access your Member Portal
            </ActionButton>
            <Button variant="dark" size="lg" href="/members/faqs">
              Read the FAQs
            </Button>
          </>
        }
      />
    </>
  )
}
