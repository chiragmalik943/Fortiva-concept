import { Lightbulb, TrendingUp, Users, Workflow } from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import ImageBand from '../components/ImageBand/ImageBand'
import FeatureReveal, { type Feature } from '../components/FeatureReveal/FeatureReveal'
import QuoteBand from '../components/QuoteBand/QuoteBand'
import Button from '../components/Button'
import { images } from '../assets/images'

/**
 * For Providers → Partner with Us.
 *
 * Copy is FTVA_Web Copy.odt's "# Partner with Us" section, which the doc writes
 * as a top-level page. It nests under For Providers here because its copy is
 * entirely provider-facing — "As a provider, partnering with us means…",
 * "H2: FOR providers" — and that decision is recorded where the IA lives; see the
 * note above `navigation` in content/site.ts. The footer still links it directly,
 * so it keeps a top-level entrance as well as its place in the dropdown.
 *
 *   H2: Why Partner with Fortiva? (para 1) → PageHero + ImageBand
 *   (para 2, the platform paragraph)       → the same ImageBand's body
 *   FOR providers (four items)             → FeatureReveal
 *   "Together, we can rewrite the rules…"  → QuoteBand
 *   Button: Partner with Us                → the action on QuoteBand
 *
 * ── The doc gives this page no H1 ───────────────────────────────────────────
 * It opens straight on "H2: Why Partner with Fortiva?", so that question is the
 * headline rather than something new being written to sit above it. Its first
 * sentence becomes the hero's lede and the rest of the paragraph carries the band
 * below, the same split Provider Overview makes with its own single paragraph.
 *
 * ── FeatureReveal here, not ScrollSpyList ────────────────────────────────────
 * This section shipped as ScrollSpyList — a single lit panel, one point at a
 * time, the same treatment Broker Overview still gives its own "why partner"
 * case. The client asked for FeatureReveal instead, so the four now arrive
 * together: the same contract Provider Overview's own four expectations use.
 * `featureProviderPartner` still needs its photograph — see the note on it in
 * assets/images.ts.
 */

// The doc's four H3s, verbatim: heading, then its line. Icons are ours; the doc
// names none.
const gains: Feature[] = [
  {
    title: 'Frictionless administration',
    body: 'Streamlined claims and coverage verification.',
    icon: Workflow,
  },
  {
    title: 'Member-first care',
    body: 'Plans built around real needs, not profit margins.',
    icon: Users,
  },
  {
    title: 'Innovation at your fingertips',
    body: 'Technology that simplifies workflows and improves patient experiences.',
    icon: Lightbulb,
  },
  {
    title: 'Growth opportunities',
    body: 'Access to a rapidly expanding network focused on affordability and transparency.',
    icon: TrendingUp,
  },
]

export default function ProvidersPartnerWithUs() {
  return (
    <>
      <PageHero
        eyebrow="Partner with Us"
        titleTop="Why partner"
        titleBottom="with Fortiva?"
        lede={
          <>
            Fortiva is redefining health insurance with a member-first approach that
            prioritizes outcomes over premiums. As a provider, partnering with us means
            joining a movement to make care accessible, transparent and technology-driven.
          </>
        }
        actions={
          <>
            <Button variant="gold" icon="arrow" size="lg" href="/contact">
              Partner with us
            </Button>
            <Button variant="ghost" size="lg" href="/providers">
              Provider overview
            </Button>
          </>
        }
      />

      {/* ── Why Partner with Fortiva? ─────────────────────────────────────
          The rest of the doc's opening paragraph plus the whole of its second
          one, which together are the page's actual argument: what the network is
          for, and what the platform does about it. Two paragraphs is more than
          the other ImageBands on this site carry, and it is why this one has no
          `points` list under them — the second paragraph is already the specifics.

          Photograph on the RIGHT, which is the first of the two provider-section
          ImageBands to sit that way (the Provider Portal's is on the left), so
          the section reads as its own rather than as the same band again. */}
      <ImageBand
        heading={<>Care Without <span className="text-gold-dark">Complexity</span></>}
        body={
          <>
            <p>
              We offer affordable, multi-tiered plans designed for underserved markets,
              backed by value-based care principles that align with your commitment to
              better health outcomes.
            </p>
            <p className="mt-5">
              Our platform delivers clear pricing, compliance-backed processes and
              real-time tools for eligibility and claims so you spend less time on
              paperwork and more time on patients.
            </p>
          </>
        }
        image={images.providerPartnerPhoto}
        imageAlt="Fortiva network clinicians conferring between appointments"
        action={
          <Button variant="gold" icon="arrow" href="/providers/portal">
            See the tools you&rsquo;d be using
          </Button>
        }
      />

      {/* ── FOR providers ─────────────────────────────────────────────────
          The doc's four, arriving together rather than one at a time — the same
          FeatureReveal treatment Provider Overview gives its own four
          expectations, rather than ScrollSpyList's single lit panel.

          `tone="dark"` now that the client's photograph has landed: it is a
          navy duotone over the clinicians, dark corner to corner including the
          bottom-left where the heading and lead sit, so the default `light`
          tone's navy type would have all but vanished into it. `dark` inverts
          the heading and lead to white and leaves the five cards exactly as
          they are — see the note on `tone` in FeatureReveal.tsx for why the
          cards don't change. The heading's accent moves from `text-gold-dark`
          to `text-gold` with it, the same swap the file's own TONES comment
          documents: the dark gold reads 2.6:1 on navy and the brand gold is
          the one built for it. */}
      <FeatureReveal
        tone="dark"
        heading={
          <>
            By working with Fortiva, <span className="text-gold">you gain</span>
          </>
        }
        intro="Four things a Fortiva partnership puts behind your practice — on the administrative side and on the clinical one."
        features={gains}
        image={images.featureProviderPartner}
        action={
          <Button variant="gold" icon="arrow" href="/contact">
            Start the conversation
          </Button>
        }
      />

      {/* ── the closing line ──────────────────────────────────────────────
          Rebuilt to the client's reference (partner-with-us.png): the flourish
          ornament framing the words above and below, the whole display line in
          gold rather than white, a white "Partner with us" button closing the
          frame, and now `heroBgDark` behind all of it — the same backdrop the
          `dark` PageHero tone opens the page on — instead of a flat navy field.
          See QuoteBand.tsx's `ornament` and `backdrop` props for how a navy band
          gets the flourish and the photograph without switching tones.

          Still NAVY, matching the reference exactly. Worth flagging rather than
          silently changing: this is now the LAST band on the page, immediately
          before the navy-800 footer, which is the one thing CtaBand.tsx's docblock
          says a closing band must never be — two navy blocks with no seam between
          them read as one slab and the page's own ask disappears into the site
          chrome. The client's copy removed this page's closing CtaBand (see the
          note above), which is what created the seam-less pairing; reintroducing a
          light or gold band between this and the footer would restore the seam if
          that turns out to matter more than matching the reference. */}
      <QuoteBand
        ornament="flourish"
        backdrop={images.heroBgDark}
        quote={
          <span className="text-gold">
            Together, we can rewrite the rules of health insurance
          </span>
        }
        body="Creating a future where care is simple, fair and empowering for everyone."
        action={
          <Button variant="light" icon="arrow" size="lg" href="/contact">
            Partner with us
          </Button>
        }
      />
    </>
  )
}
