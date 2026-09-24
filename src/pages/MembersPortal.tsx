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

  return (
    <>
      <PageHero
        eyebrow="Member Portal"
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
          Rebuilt as a plain centred band — the doc's closing paragraph on its
          own, replacing the two-up layout this section used to carry (an icon
          list plus an "also in the app" aside card). Nothing else is asserted
          here; the app cross-link still lives on this page in the hero
          ("Get the app instead") and in the closing CtaBand below. */}
      <section className="bg-white px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            ref={whyHeadingRef}
            className="text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px]"
          >
            Why use the <span className="text-gold-dark">Member Portal?</span>
          </h2>
          <div ref={whyBodyRef} className="opacity-0">
            <p className="mx-auto mt-6 max-w-xl text-[16.5px] leading-relaxed text-navy-800/75 sm:text-[17.5px]">
              Managing your health coverage shouldn&rsquo;t be complicated. With the Fortiva
              Member Portal, you have everything you need to make informed decisions about
              your care &mdash; all in one place.
            </p>
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
