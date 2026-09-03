import { Clock, Lock, Pill, RefreshCw, Thermometer, Timer, Video, Wallet } from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import StepFlow, { type Step } from '../components/StepFlow/StepFlow'
import StatBand, { type Stat } from '../components/StatBand/StatBand'
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
 *   Virtual care made simple  → the split band, with the treatable-conditions card
 *   MyLiveDoc + How It Works  → StepFlow
 *   Why virtual care? + stats → StatBand, footnotes included
 *   Key benefits              → FeatureReveal, the scroll-in card band
 *   Get started               → CtaBand
 *
 * ── The footnotes ship with the numbers ─────────────────────────────────────
 * All three figures are other people's published research and the doc cites each
 * one. Those citations are in StatBand, in the same section as the numbers, with
 * live links — a "95% satisfaction" claim with the source dropped for layout
 * reasons is a different claim from the one the client actually made.
 */
const howItWorks: Step[] = [
  { title: 'Sign in', body: 'Access MyLiveDoc through your Fortiva member portal.' },
  { title: 'Choose your visit', body: 'Select the type of care you need.' },
  {
    title: 'Connect with a provider',
    body: 'Meet virtually via video call for personalized care.',
  },
  {
    title: 'Get care',
    body: 'Receive prescriptions, treatment advice and follow-up instructions directly through the platform.',
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

// Doc: "MyLiveDoc providers are there to treat allergies, cold and flu symptoms,
// skin rashes, minor infections, handle medication refills and more!"
const treats = [
  'Allergies',
  'Cold and flu symptoms',
  'Skin rashes',
  'Minor infections',
  'Medication refills',
]

const stats: Stat[] = [
  {
    value: 80,
    suffix: '%',
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
    body: 'Virtual care visits can reduce ER visit lengths of stays by up to 30%, saving patients hundreds of dollars.',
  },
  {
    value: 95,
    suffix: '%',
    marker: '**',
    body: 'Patients report a 95% satisfaction rate when they use virtual care.',
  },
]

const footnoteLink =
  'text-white/60 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white'

export default function MembersVirtualCare() {
  const simpleHeadingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const simpleBodyRef = useScrollReveal<HTMLDivElement>({ y: 24, delay: 0.12 })
  const treatsRef = useScrollReveal<HTMLDivElement>({ y: 34, delay: 0.18 })

  return (
    <>
      <PageHero
        tone="sky"
        eyebrow="VIRTUAL CARE"
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
          The doc's two paragraphs on the left; on the right, the conditions it
          names MyLiveDoc providers treat, as a card. Those five things are the
          most concretely useful sentence on the whole page and were buried mid-
          paragraph — pulled out, they answer "is this for what I've got?" at a
          glance. Nothing was added to the list; "and more" is the doc's own. */}
      <section className="bg-white px-6 py-24 sm:py-28">
        <div className="mx-auto grid max-w-container items-start gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
          <div>
            <span className="inline-block rounded-full bg-navy-800/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-navy-800/70">
              HOW IT FEELS
            </span>
            <h2
              ref={simpleHeadingRef}
              className="mt-5 max-w-xl text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px]"
            >
              Virtual care made <span className="text-gold-dark">simple</span>
            </h2>
            <div ref={simpleBodyRef} className="opacity-0">
              <p className="mt-7 max-w-xl text-[16.5px] leading-[1.65] text-navy-800/75 sm:text-[17.5px]">
                Virtual care gives you access to licensed providers from the comfort of your
                home. No waiting rooms, no travel. Whether you&rsquo;re managing a minor illness
                or need quick advice, virtual visits through MyLiveDoc make health care more
                convenient and affordable.
              </p>
              <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-navy-800/60">
                MyLiveDoc is a secure, HIPAA-compliant telehealth platform that connects you
                with licensed health care providers. Through easy-to-use video visits, you can
                get care for common conditions, request prescriptions and receive follow-up
                guidance &mdash; all without leaving home.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <ActionButton variant="gold" icon="arrow" href={externalTargets.myLiveDoc}>
                  Start a visit
                </ActionButton>
              </div>
            </div>
          </div>

          <div ref={treatsRef} className="opacity-0">
            <div className="corner-smooth rounded-card bg-cream-soft p-7 sm:p-9">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold">
                  <Video size={20} strokeWidth={1.75} className="text-navy-800" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-800/45">
                    MyLiveDoc
                  </p>
                  <h3 className="text-[17px] font-semibold text-navy-800">Treated on a video visit</h3>
                </div>
              </div>

              <ul className="mt-7 flex flex-wrap gap-2">
                {treats.map((item) => (
                  <li
                    key={item}
                    className="corner-smooth flex items-center gap-2 rounded-[12px] bg-white px-3.5 py-2 text-[14px] font-medium text-navy-800/80"
                  >
                    <Thermometer size={14} strokeWidth={2} className="text-gold-dark" />
                    {item}
                  </li>
                ))}
                <li className="corner-smooth flex items-center gap-2 rounded-[12px] border border-navy-800/[0.12] px-3.5 py-2 text-[14px] font-medium text-navy-800/55">
                  <Pill size={14} strokeWidth={2} />
                  and more
                </li>
              </ul>

              {/* ADDED — not in the copy doc. TODO(client): a telehealth page
                  without an emergency carve-out is the one omission here worth
                  flagging rather than reproducing, so a plain, unbranded line
                  stands in. Legal should confirm the exact wording. */}
              <p className="mt-7 border-t border-navy-800/10 pt-5 text-[13.5px] leading-relaxed text-navy-800/50">
                Not for emergencies. If it&rsquo;s urgent, call 911 or go to the nearest emergency
                room.
              </p>
            </div>
          </div>
        </div>
      </section>

      <StepFlow
        surface="cream"
        eyebrow="HOW IT WORKS"
        heading={
          <>
            Four steps, <span className="text-gold-dark">start to prescription</span>
          </>
        }
        intro="MyLiveDoc runs inside your Fortiva member portal, so there is no separate account to create and nothing new to remember."
        steps={howItWorks}
        action={
          <ActionButton variant="gold" icon="arrow" href={externalTargets.myLiveDoc}>
            Schedule an appointment
          </ActionButton>
        }
      />

      <StatBand
        eyebrow="WHY VIRTUAL CARE"
        heading={
          <>
            The world is moving quickly. <span className="text-gold">Your care can too.</span>
          </>
        }
        intro="Virtual care helps you keep up with your health and well-being while keeping up with work, school, family, friends and whatever else life throws your way."
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
        eyebrow="KEY BENEFITS"
        heading={
          <>
            What you get from a <span className="text-gold-dark">virtual visit</span>
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
            <Button variant="ghost" href="/members/faqs">
              Read the FAQs
            </Button>
          </>
        }
      />

      <CtaBand
        tone="gold"
        heading={
          <>
            Get started with <span className="text-navy-800">MyLiveDoc</span>
          </>
        }
        body="Sign in to your member portal and pick a time. Most common conditions can be seen the same day."
        actions={
          <>
            <ActionButton variant="light" icon="arrow" size="lg" href={externalTargets.myLiveDoc}>
              Schedule an appointment
            </ActionButton>
            <Button variant="ghost" size="lg" href="/members/portal">
              Member Portal
            </Button>
          </>
        }
      />
    </>
  )
}
