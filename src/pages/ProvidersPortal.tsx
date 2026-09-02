import { FileUp, ShieldCheck } from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import PortalShowcase, { type PortalItem } from '../components/PortalShowcase/PortalShowcase'
import ImageBand from '../components/ImageBand/ImageBand'
import CtaBand from '../components/CtaBand/CtaBand'
import Button from '../components/Button'
import ActionButton from '../components/ActionButton'
import { externalTargets } from '../content/site'
import { images } from '../assets/images'

/**
 * For Providers → Provider Portal.
 *
 * Copy is FTVA_Web Copy.odt's "Provider Portal — Sub Navigation":
 *
 *   H1 + body                             → PageHero
 *   Submit a claim / Check insurance status → PortalShowcase, both sections
 *   both of the doc's buttons              → the showcase's own action row
 *   (the closing ask)                      → CtaBand
 *
 * The third instance of the same set-piece, deliberately: the member, broker and
 * provider portals are one product with three front doors, and someone who has
 * seen either of the others should recognise the frame. See PortalShowcase.tsx —
 * the section pins, each screenshot slides out to the left as the next arrives,
 * and the tab underneath lights up as it lands.
 *
 * ── Two sections, against the broker portal's three and the member portal's six ─
 * That is what the doc gives, and it is left at two. The component costs nothing
 * for a short list — two tabs sit at the left of the strip and the pin is one
 * slide long — and a third tab would have meant writing a portal feature the
 * client never approved and shipping it as though they had.
 *
 * ── The `#submit-a-claim` anchor is load-bearing ────────────────────────────
 * `contactAudiences` in content/site.ts gives the provider audience a "Submit a
 * Claim" button pointing at `/providers/portal#submit-a-claim`, and the footer
 * renders it on every page of the site. That href predates this page. The id
 * therefore sits on the showcase — the section that actually covers claim
 * submission — rather than anywhere convenient, and App.tsx's fragment handling
 * scrolls to it through Lenis on arrival (see the effect in Site()).
 */

// The doc's two, verbatim: heading, then its paragraph.
const portalItems: PortalItem[] = [
  {
    title: 'Submit a claim',
    body: 'Submit claims quickly and accurately through our step-by-step portal, then track their progress in real time from submission to payment.',
    icon: FileUp,
    screen: images.providerPortalScreens[0],
  },
  {
    title: 'Check insurance status',
    body: 'Confirm member coverage in seconds with our secure portal. See deductibles, copays and coverage tiers upfront, plus any supplemental benefits.',
    icon: ShieldCheck,
    screen: images.providerPortalScreens[1],
  },
]

export default function ProvidersPortal() {
  return (
    <>
      <PageHero
        eyebrow="PROVIDER PORTAL"
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
          The doc asks for a button under each of its two headings — "Submit a
          Claim" and "Check Insurance Status" — and the showcase presents both
          headings at once, so both buttons sit in its one action row rather than
          being split across two sections that would have to repeat the copy to
          justify themselves.

          `externalTargets` keeps the two apart from the sign-in URL: on a real
          portal these are authenticated routes behind a login page, and pointing
          all three at one placeholder would hide two of the three gaps. Until the
          URLs land, ActionButton renders each as visibly pending rather than as a
          link that silently goes nowhere. */}
      <div id="submit-a-claim">
        <PortalShowcase
          eyebrow="INSIDE THE PORTAL"
          heading={
            <>
              Two jobs, <span className="text-gold-dark">done in one place</span>
            </>
          }
          intro="Claims and eligibility are most of what a practice needs from a carrier, so they are what the portal opens on."
          items={portalItems}
          action={
            <>
              <ActionButton
                variant="gold"
                icon="arrow"
                href={externalTargets.providerClaimSubmission}
              >
                Submit a claim
              </ActionButton>
              <ActionButton variant="ghost" href={externalTargets.providerEligibility}>
                Check insurance status
              </ActionButton>
            </>
          }
        />
      </div>

      {/* ── less paperwork, more patients ─────────────────────────────────
          The band that answers what the showcase raises — what this is like on a
          Tuesday afternoon — with a photograph rather than another screen, which
          is the same job the equivalent band does on the Broker Portal page.

          The doc supplies no copy for a section here; the phrase it is built
          around ("so you spend less time on paperwork and more time on patients")
          is the client's own, from the Partner with Us page, and the three points
          under it restate what the two showcase sections already promise rather
          than adding a capability. Nothing here claims anything the portal
          sections do not. */}
      <ImageBand
        eyebrow="YOUR ADMINISTRATIVE DAY"
        heading={
          <>
            Less time on paperwork, <span className="text-gold-dark">more time on patients</span>
          </>
        }
        body={
          <p>
            Check a patient&rsquo;s coverage while they are still at the desk, file the claim
            the same afternoon and see where it is without calling anyone. One login, and
            the two things a practice needs from a carrier are both behind it.
          </p>
        }
        points={[
          'Eligibility, deductibles, copays and coverage tiers, in seconds.',
          'Step-by-step claim submission, tracked from submission to payment.',
          'A provider team to call when a benefit or a bill needs a person.',
        ]}
        image={images.providerPortalPhoto}
        imageAlt="A practice administrator working in the Fortiva provider portal"
        imageSide="left"
        action={
          <Button variant="gold" icon="arrow" href="/providers">
            What to expect from a Fortiva member
          </Button>
        }
      />

      <CtaBand
        tone="gold"
        heading={
          <>
            Not set up yet? <span className="text-navy-800">Request access.</span>
          </>
        }
        body="Already registered? Sign in. If your practice is new to Fortiva, our provider team will get your access sorted."
        actions={
          <>
            <ActionButton
              variant="light"
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
    </>
  )
}
