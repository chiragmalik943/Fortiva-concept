import PageHero from '../components/PageHero/PageHero'
import FaqAccordion, { type AccordionFaq } from '../components/FaqAccordion/FaqAccordion'
import CtaBand from '../components/CtaBand/CtaBand'
import Button from '../components/Button'

/**
 * For Brokers → FAQs.
 *
 * All six questions and every word of their answers are FTVA_Web Copy.odt's
 * "FAQs — Sub Navigation" under For Brokers, unabridged. The four bolded items
 * inside "Why should I work with Fortiva?" are the doc's own list, kept as a list
 * rather than flattened into the paragraph, and the "Become a Fortiva Broker"
 * button is attached to the question the doc attaches it to.
 *
 * ── Six questions, so not FaqExplorer ───────────────────────────────────────
 * The For Members FAQ page uses FaqExplorer: a category rail, a scroll-spy and a
 * search across the answers. All three are there because that page has forty
 * questions. Six fit on one screen, and navigation aids for six are furniture —
 * see the note at the top of FaqAccordion.tsx, which is the same content type
 * built for the other end of the scale.
 */
const brokerFaqs: AccordionFaq[] = [
  {
    id: 'what-is-fortiva',
    q: 'What is Fortiva?',
    a: [
      'Fortiva is a health insurance company built to disrupt the status quo. Our mission is simple: put people — not premiums — at the center of care. We offer affordable, value-based coverage designed to make health insurance transparent, flexible and member-focused.',
    ],
  },
  {
    id: 'why-work-with-fortiva',
    q: 'Why should I work with Fortiva?',
    a: ['We make it easy for brokers to succeed. By partnering with Fortiva, you’ll gain access to:'],
    points: [
      {
        label: 'Competitive commissions',
        body: 'attractive incentives tied to retention and growth.',
      },
      {
        label: 'Flexible plan options',
        body: 'multi-tiered coverage for individuals and small businesses.',
      },
      {
        label: 'Technology-driven tools',
        body: 'streamlined quoting and enrollment powered by innovation.',
      },
      {
        label: 'Dedicated support',
        body: 'our broker team is here to help every step of the way.',
      },
    ],
  },
  {
    id: 'what-makes-fortiva-different',
    q: 'What makes Fortiva different from other carriers?',
    a: [
      'Our approach combines innovation and humanity to deliver health coverage that’s simple, fair and empowering. Every decision starts and ends with the member in mind.',
    ],
  },
  {
    id: 'what-plans',
    q: 'What types of plans does Fortiva offer?',
    a: [
      'Fortiva provides affordable, multi-tier plans designed for real-life budgets. Our plans prioritize preventive care, transparency and flexibility for individuals and small businesses.',
    ],
    action: (
      <Button variant="ghost" href="/plans">
        Explore the plans
      </Button>
    ),
  },
  {
    id: 'how-to-get-started',
    q: 'How do I get started with Fortiva?',
    a: [
      'Getting started is simple. Complete our online application and our team will guide you through the onboarding process.',
    ],
    action: (
      <Button variant="gold" icon="arrow" href="/contact">
        Become a Fortiva broker
      </Button>
    ),
  },
  {
    id: 'who-to-contact',
    q: 'Who can I contact for support?',
    a: [
      'Our broker support team is ready to assist you. Contact us for help with enrollment, commissions or any questions you have.',
    ],
    action: (
      <Button variant="ghost" href="/contact">
        Contact broker support
      </Button>
    ),
  },
]

export default function BrokersFaqs() {
  return (
    <>
      <PageHero
        tone="dark"
        eyebrow="BROKER FAQS"
        titleTop="Six questions, before"
        titleBottom="you write a policy."
        lede={
          <>
            What Fortiva is, what you&rsquo;d be selling, how partnering works and who picks
            up the phone. Answered in full, in the order brokers ask them.
          </>
        }
        actions={
          <>
            <Button variant="gold" icon="arrow" size="lg" href="/contact">
              Become a Fortiva broker
            </Button>
            <Button variant="white" size="lg" href="/brokers">
              Why partner with us
            </Button>
          </>
        }
      />

      <FaqAccordion
        eyebrow="BROKER FAQS"
        heading={
          <>
            The questions we get <span className="text-gold-dark">most often</span>
          </>
        }
        intro="Commissions, plan types, onboarding and support. If yours isn’t here, the broker team answers it directly."
        action={
          <Button variant="gold" icon="arrow" href="/contact">
            Ask us instead
          </Button>
        }
        faqs={brokerFaqs}
      />

      <CtaBand
        tone="gold"
        heading={
          <>
            Answered? <span className="text-navy-800">Let’s get you appointed.</span>
          </>
        }
        body="Complete the online application and our broker team will guide you through onboarding from there."
        actions={
          <>
            <Button variant="light" icon="arrow" size="lg" href="/contact">
              Become a Fortiva broker
            </Button>
            <Button variant="ghost" size="lg" href="/brokers/resources">
              Broker resources
            </Button>
          </>
        }
      />
    </>
  )
}
