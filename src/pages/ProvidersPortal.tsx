import { FileUp, ShieldCheck } from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import Button from '../components/Button'
import ActionButton from '../components/ActionButton'
import { externalTargets } from '../content/site'
import { useScrollReveal } from '../hooks/useScrollReveal'

/**
 * For Providers → Provider Portal.
 *
 * Copy is FTVA_Web Copy.odt's "Provider Portal — Sub Navigation":
 *
 *   H1 + body                               → PageHero
 *   Submit a claim / Check insurance status → the two-up card pair below
 *
 * ── Why this page no longer runs PortalShowcase ─────────────────────────────
 * The member and broker portals still run the pinned screenshot carousel — see
 * PortalShowcase.tsx — but this page asked for its own design, and the carousel
 * had no real screenshot to show here anyway: `images.providerPortalScreens`
 * pointed at `provider-portal-scr-1.png` / `-2.png`, and neither file has ever
 * shipped in `public/`. Two static cards, one per job, replace it: each gets its
 * own heading, its own paragraph and its own button, rather than one shared
 * heading above a carousel and both buttons stacked in a row below it.
 *
 * ── The `#submit-a-claim` anchor is load-bearing ────────────────────────────
 * `contactAudiences` in content/site.ts gives the provider audience a "Submit a
 * Claim" button pointing at `/providers/portal#submit-a-claim`, and the footer
 * renders it on every page of the site. That href predates this page, so the id
 * stays on the section that actually covers claim submission, and App.tsx's
 * fragment handling scrolls to it through Lenis on arrival (see the effect in
 * Site()).
 */

// The doc's two jobs, each now carrying its own heading, paragraph and button
// rather than sharing one heading and one action row.
const portalJobs = [
  {
    title: 'Submit a claim',
    body: 'Submit claims quickly and accurately through our step-by-step portal, then track their progress in real time from submission to payment.',
    icon: FileUp,
    buttonLabel: 'Submit a Claim',
    href: externalTargets.providerClaimSubmission,
  },
  {
    title: 'Check insurance status',
    body: 'Confirm member coverage in seconds with our secure portal. See deductibles, copays and coverage tiers upfront, plus any supplemental benefits.',
    icon: ShieldCheck,
    buttonLabel: 'Check Insurance Status',
    href: externalTargets.providerEligibility,
  },
] as const

export default function ProvidersPortal() {
  const cardsRef = useScrollReveal<HTMLDivElement>({ y: 28, delay: 0.1 })

  return (
    <>
      <PageHero
        eyebrow="Provider Portal"
        titleTop="Welcome to the"
        titleBottom="Fortiva Provider Portal."
        lede={
          <>
            Our portal is designed to make your administrative tasks simple, fast and
            transparent &mdash; so you can focus on delivering care.
          </>
        }
        actions={
          <>
            <ActionButton
              variant="gold"
              icon="arrow"
              size="lg"
              href={externalTargets.providerPortal}
            >
              Log in to the portal
            </ActionButton>
            <Button variant="ghost" size="lg" href="/contact">
              Request access
            </Button>
          </>
        }
      />

      {/* ── the two things the portal is for ──────────────────────────────
          Two equal-weight cards rather than a shared heading over a carousel:
          the doc gives each job its own heading, its own paragraph and its own
          button, and a card each is what lets all three travel together without
          one job's copy crowding the other's.

          Alternating button weight, same as the doc's own pair: the first job
          takes the primary gold button and the second a navy one — two golds
          side by side would read as two identical calls rather than as two
          distinct jobs. */}
      <section id="submit-a-claim" className="bg-white px-6 py-24 sm:py-28">
        <div
          ref={cardsRef}
          className="mx-auto grid max-w-container gap-6 opacity-0 sm:grid-cols-2 sm:gap-8"
        >
          {portalJobs.map(({ title, body, icon: Icon, buttonLabel, href }, i) => (
            <div
              key={title}
              className="corner-smooth flex flex-col rounded-card border border-navy-800/[0.08] bg-mist/30 p-8 shadow-card-soft sm:p-10"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-800">
                <Icon size={24} strokeWidth={1.75} className="text-gold" />
              </span>

              <h2 className="mt-7 text-[26px] font-semibold leading-tight text-navy-800 sm:text-[30px]">
                {title}
              </h2>

              <p className="mt-4 flex-1 text-[16px] leading-relaxed text-navy-800/70 sm:text-[16.5px]">
                {body}
              </p>

              <div className="mt-8">
                <ActionButton variant={i === 0 ? 'gold' : 'dark'} icon="arrow" href={href}>
                  {buttonLabel}
                </ActionButton>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
