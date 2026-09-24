import { Clock, Lock, RefreshCw, Timer, Wallet } from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import StepFlow, { type Step } from '../components/StepFlow/StepFlow'
import StatCircles, { type CircleStat } from '../components/StatCircles/StatCircles'
import FeatureReveal from '../components/FeatureReveal/FeatureReveal'
import { type Feature } from '../components/featureTypes'
import CtaBand from '../components/CtaBand/CtaBand'
import Button from '../components/Button'
import ActionButton from '../components/ActionButton'
import { externalTargets } from '../content/site'
import { images } from '../assets/images'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useSplitReveal } from '../hooks/useSplitReveal'

/**
 * For Members → Virtual Care.
 *
 * Copy is FTVA_Web Copy.odt's "Virtual Care — Sub Navigation", complete:
 *
 *   H1                        → PageHero
 *   Virtual care made simple  → the photo band, copy held in its right half
 *   MyLiveDoc                 → the short logo band under it
 *   MyLiveDoc + How It Works  → StepFlow
 *   Why virtual care? + stats → StatCircles, footnotes included
 *   Key benefits              → FeatureReveal, the scroll-in card band
 *   Get started               → CtaBand
 *
 * ── The footnotes ship with the numbers ─────────────────────────────────────
 * All three figures are other people's published research and the doc cites each
 * one. Those citations are in StatCircles, in the same section as the numbers, with
 * live links — a "95% satisfaction" claim with the source dropped for layout
 * reasons is a different claim from the one the client actually made.
 */
const howItWorks: Step[] = [
  {
    title: 'Sign in',
    body: 'Access MyLiveDoc through your Fortiva member portal.',
    image: images.virtualCareSteps[0],
  },
  {
    title: 'Choose your visit',
    body: 'Select the type of care you need.',
    image: images.virtualCareSteps[1],
  },
  {
    title: 'Connect with a provider',
    body: 'Meet virtually via video call for personalized care.',
    image: images.virtualCareSteps[2],
  },
  {
    title: 'Get care',
    body: 'Receive prescriptions, treatment advice and follow-up instructions directly through the platform.',
    image: images.virtualCareSteps[3],
  },
]

const benefits: Feature[] = [
  { title: '24/7 access', body: 'Connect with a provider anytime, anywhere.', icon: Clock },
  {
    title: 'Cost saving',
    body: 'Lower out-of-pocket costs compared to urgent care or ER visits.',
    icon: Wallet,
  },
  { title: 'Faster appointments', body: 'Same-day visits for common conditions.', icon: Timer },
  {
    title: 'Secure platform',
    body: 'HIPAA-compliant technology ensures your privacy.',
    icon: Lock,
  },
  {
    title: 'Continuity of care',
    body: 'Follow-up messaging and prescriptions handled online.',
    icon: RefreshCw,
  },
]

const stats: CircleStat[] = [
  {
    value: 80,
    suffix: '%',
    image: images.virtualCareStats[0],
    body: (
      <>
        According to the{' '}
        <a
          href="https://www.americantelemed.org/in-the-news/nine-health-systems-show-telehealth-replaces-not-adds-medicare-visits/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-gold"
        >
          American Telemedicine Association
        </a>
        , up to 80% of primary care visits can be handled virtually.
      </>
    ),
  },
  {
    value: 30,
    suffix: '%',
    marker: '*',
    image: images.virtualCareStats[1],
    body: 'Virtual care visits can reduce ER visit lengths of stays by up to 30%, saving patients hundreds of dollars.',
  },
  {
    value: 95,
    suffix: '%',
    marker: '**',
    image: images.virtualCareStats[2],
    body: 'Patients report a 95% satisfaction rate when they use virtual care.',
  },
]

const footnoteLink =
  'text-white/60 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white'

export default function MembersVirtualCare() {
  const simpleHeadingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const simpleBodyRef = useScrollReveal<HTMLDivElement>({ y: 24, delay: 0.12 })
  const liveDocHeadingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const liveDocBodyRef = useScrollReveal<HTMLDivElement>({ y: 22, delay: 0.12 })
  const liveDocLogoRef = useScrollReveal<HTMLDivElement>({ y: 26, delay: 0.18 })

  return (
    <>
      <PageHero
        eyebrow="Virtual Care"
        tone="sky"
        titleTop="Care that comes"
        titleBottom="to you."
        lede={
          <>
            Virtual care gives you access to licensed providers from the comfort of your home.
            No waiting rooms, no travel &mdash; just care when you need it.
          </>
        }
        actions={
          <>
            <ActionButton variant="dark" icon="arrow" size="lg" href={externalTargets.myLiveDoc}>
              Schedule an appointment
            </ActionButton>
            <Button variant="white" size="lg" href="/members/find-a-doctor">
              Prefer to be seen in person?
            </Button>
          </>
        }
      />

      {/* ── Virtual care made simple ───────────────────────────────────────
          A photograph across the whole section, the copy held in its right half.

          ── What came off, and what that costs ──────────────────────────────
          The right column used to be a card listing the five conditions the doc
          names MyLiveDoc providers as treating ("Allergies, cold and flu
          symptoms, skin rashes, minor infections, medication refills and more").
          The card is gone at the client's request and that list came off the page
          with it — it is the only copy in this section that is not in the two
          paragraphs below, so if it is wanted back it needs a slot of its own
          rather than a smaller version of the same card.

          The emergency carve-out did NOT come off with it. It was the one line in
          that card that was never a layout decision, so it sits under the button
          instead. Still not the client's wording — see the TODO below.

          ── NO SCRIM, and that is what sets the inks ────────────────────────
          The delivered photograph is LIGHT — the subject sits in the left third
          and the right two thirds is a near-white wall with the lotus over it.
          Which means the ramp this section used to carry could not simply be
          deleted: white copy on white wall is not low-contrast, it is invisible.

          So the section inverted instead. It is a light band now — navy heading
          with the dark gold accent, navy body, and `bg-white` as the field behind
          the picture rather than navy. That is the same pair of decisions the
          provider-search band on Find a Doctor makes, and for the same reason:
          the photograph decides which way the ink runs, not the other way round.

          The copy sits in the right half, which is where the wall is. If the
          photograph is ever replaced with a darker one, this has to go back to
          white type and something has to hold it off the picture. */}
      <section className="relative isolate overflow-hidden bg-white px-6 py-28 sm:py-36 lg:min-h-[820px] lg:py-44">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 select-none">
          {/* `onError` kept from when this slot shipped ahead of its
              photograph: without it a missing file draws the browser's
              broken-image glyph in the corner of the section. It costs nothing
              now that the file is here, and it is what the band falls back to if
              the asset is ever swapped for one that 404s. */}
          <img
            src={images.virtualCareSimple}
            alt=""
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="mx-auto flex max-w-container justify-end">
          <div className="w-full lg:max-w-[560px]">
            <h2
              ref={simpleHeadingRef}
              className="text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px]"
            >
              Virtual care made <span className="text-gold-dark">simple</span>
            </h2>
            <div ref={simpleBodyRef} className="opacity-0">
              <p className="mt-7 text-[16.5px] leading-[1.65] text-navy-800/80 sm:text-[17.5px]">
                Virtual care gives you access to licensed providers from the comfort of your
                home. No waiting rooms, no travel. Whether you&rsquo;re managing a minor illness
                or need quick advice, virtual visits through MyLiveDoc make health care more
                convenient and affordable.
              </p>
              <p className="mt-5 text-[16.5px] leading-[1.65] text-navy-800/80 sm:text-[17.5px]">
                MyLiveDoc is a secure, HIPAA-compliant telehealth platform that connects you
                with licensed health care providers. Through easy-to-use video visits, you can
                get care for common conditions, request prescriptions and receive follow-up
                guidance &ndash; all without leaving home.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <ActionButton variant="gold" icon="arrow" href={externalTargets.myLiveDoc}>
                  Start a visit
                </ActionButton>
              </div>

              {/* ADDED — not in the copy doc. TODO(client): a telehealth page
                  without an emergency carve-out is the one omission here worth
                  flagging rather than reproducing, so a plain, unbranded line
                  stands in. Legal should confirm the exact wording. */}
              <p className="mt-9 border-t border-navy-800/15 pt-6 text-[13.5px] leading-relaxed text-navy-800/55">
                Not for emergencies. If it&rsquo;s urgent, call 911 or go to the nearest emergency
                room.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MyLiveDoc ──────────────────────────────────────────────────────
          A short band naming the platform, immediately before the four steps
          that run inside it.

          The paragraph is not new copy: it was the SECOND paragraph of the
          photograph band above, where it sat under a heading about virtual care
          in general and had the partner's name in its first four words with
          nothing to attach it to. It is the whole of this section now and it has
          been taken out of that one, because the same four sentences twice in
          400px is worse than either place on its own.

          Deliberately short — `py-16` against the `py-24`/`py-28` every other
          band on this page runs. It is an introduction to the section under it,
          not a section in its own right, and a full-height band here would
          separate MyLiveDoc from the steps it belongs to.

          The logo is a THIRD PARTY'S MARK: drawn at its own proportions, on
          white, with nothing tinting or masking it. */}
      <section className="bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-container items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20">
          <div>
            <h2
              ref={liveDocHeadingRef}
              className="text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px]"
            >
              {/* One ink, no accent. Every other heading on this site splits
                  its colour, and this one must not: "MyLiveDoc" is a third
                  party's wordmark, and half of it in Fortiva's gold is their
                  name restyled — with their own logo beside it showing what it
                  should look like. */}
              MyLiveDoc
            </h2>
            <div ref={liveDocBodyRef} className="opacity-0">
              <p className="mt-5 max-w-2xl text-[16px] leading-[1.65] text-navy-800/75 sm:text-[17px]">
                MyLiveDoc is a secure, HIPAA-compliant telehealth platform that connects you
                with licensed health care providers. Through easy-to-use video visits, you can
                get care for common conditions, request prescriptions and receive follow-up
                guidance &mdash; all without leaving home.
              </p>
            </div>
          </div>

          <div ref={liveDocLogoRef} className="opacity-0 lg:justify-self-end">
            <img
              src={images.myLiveDocLogo}
              alt="MyLiveDoc"
              className="h-auto w-full max-w-[300px] select-none lg:max-w-[340px]"
            />
          </div>
        </div>
      </section>

      <StepFlow
        heading={<>How it works</>}
        intro="MyLiveDoc runs inside your Fortiva member portal, so there is no separate account to create and nothing new to remember."
        steps={howItWorks}
        action={
          <ActionButton variant="gold" icon="arrow" href={externalTargets.myLiveDoc}>
            Schedule an appointment
          </ActionButton>
        }
      />

      {/* ── Why virtual care? ──────────────────────────────────────────────
          The doc's three figures, in discs rather than in the ruled three-column
          band they used to sit in (StatBand, which this page was the only caller
          of). Same numbers, same sentences, same citations — see StatCircles.tsx
          for how the sequence is built and what the photographs it expects are.

          The footnotes are not decoration. Every figure here is somebody else's
          published research, and the copy doc cites all of it — so the citations
          ship with the numbers, in the same section, rather than being dropped
          because they are inconvenient to lay out. */}
      <StatCircles
        heading={
          <>
            <span className="text-gold">Why</span> virtual care?
          </>
        }
        intro="The world is moving quickly. Virtual care helps you keep up with your health and well-being while keeping up with work, school, family, friends and whatever else life throws your way."
        stats={stats}
        footnotes={[
          <>
            * Sun S, Lu SF, Rui H.{' '}
            <a
              href="https://pubsonline.informs.org/doi/10.1287/isre.2020.0926"
              target="_blank"
              rel="noopener noreferrer"
              className={footnoteLink}
            >
              Does Telemedicine Reduce Emergency Room Congestion? Evidence from New York State
            </a>
            . SSRN Electronic Journal. 2019.
          </>,
          <>
            **{' '}
            <a
              href="https://www.americantelemed.org/wp-content/uploads/2022/12/Telehealth-Utilization-Stats-12.8-Copy.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={footnoteLink}
            >
              American Medical Association and Telehealth Satisfaction Surveys
            </a>
            .
          </>,
        ]}
      />

      {/* ── Key benefits ───────────────────────────────────────────────────
          The doc's five-item benefits list, in FeatureReveal rather than the
          plain grid it used to sit in — the same treatment the two Plans pages
          give their five-item lists, so a member who arrives here from Plans
          meets a shape they already recognise. See FeatureReveal.tsx.

          ADDED — the lead paragraph and the two buttons. The doc gives this
          section a heading and the five items and nothing else, and the split
          layout has a left column to fill; the lead says only what the five
          cards already say (they apply to every visit, at no extra cost) and
          the buttons are the two the rest of the page already uses. */}
      <FeatureReveal
        /* DARK, because the photograph behind this one is dark.
           FeatureReveal draws its backdrop full bleed with no mask and no scrim
           (see the note above the component), so the copy is read straight off
           the picture and the picture is what decides the ink. `img-14.png` has
           no dissolve in its bottom-left corner — which is exactly where the
           heading, the lead and the buttons sit — so on the light tone every one
           of them was navy on a navy sweater.

           Three things move together here, and none of them is optional:
           • the heading's accent is `text-gold` rather than `text-gold-dark`.
             The dark gold was mixed for light plates and measures 2.6:1 on navy.
           • the secondary button is `white`, not `ghost`. Ghost is a navy
             hairline around navy text — invisible on anything dark.
           • below `lg` the photograph is not drawn at all, so the tone's own
             navy surface is what the copy sits on there. That is why this is a
             tone rather than a handful of text-white classes: the mobile layout
             has to stay legible too, and it has no photograph to be legible
             against.

           If the asset is ever re-exported with the dissolve this slot's note in
           assets/images.ts asks for, this goes back to the light tone and all
           three of the above go back with it. */
        tone="dark"
        heading={
          <>
            Key benefits of <span className="text-gold">virtual care</span>
          </>
        }
        intro={
          <>
            Every MyLiveDoc visit comes with all five &mdash; whether it&rsquo;s a rash at 7am,
            a refill you meant to sort out last week or a second opinion on something that has
            been nagging at you. Nothing here is an add-on, and nothing depends on which tier
            you&rsquo;re on.
          </>
        }
        features={benefits}
        image={images.featureVirtualCare}
        action={
          <>
            <ActionButton variant="gold" icon="arrow" href={externalTargets.myLiveDoc}>
              Start a visit
            </ActionButton>
            <Button variant="white" href="/members/faqs">
              Read the FAQs
            </Button>
          </>
        }
      />

      <CtaBand
        tone="gold"
        heading={
          <>
            {/* The inks are the reverse of `tone: 'gold'`'s default, which paints
                the line white and leaves the accent to the caller. White on gold
                measures 2.1:1 against navy's 7.0:1, so the long half takes the
                navy and the product name takes the white — the same exception,
                and the same arithmetic, as the closing bands on Resources and
                Find a Doctor. */}
            <span className="text-navy-800">
              Get started with <span className="text-white">MyLiveDoc.</span>
            </span>
          </>
        }
        body="Sign in to your member portal and pick a time. Most common conditions can be seen the same day."
        actions={
          <>
            <ActionButton variant="light" icon="arrow" size="lg" href={externalTargets.myLiveDoc}>
              Schedule an appointment
            </ActionButton>
          </>
        }
      />
    </>
  )
}
