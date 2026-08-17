import PageHero from '../components/PageHero/PageHero'
import FaqExplorer from '../components/FaqExplorer/FaqExplorer'
import CtaBand from '../components/CtaBand/CtaBand'
import Button from '../components/Button'
import { REACH_PHONE, memberFaqs } from '../content/site'

/**
 * For Members → FAQs.
 *
 * All eight member questions from FTVA_Web Copy.odt, unabridged — including the
 * three-paragraph answer to "How do I enroll", which the homepage band shortens
 * to its first paragraph. The copy itself lives in content/site.ts so the two
 * places that render these questions cannot disagree; see FaqExplorer for the
 * filter and the index rail.
 */
export default function MembersFaqs() {
  return (
    <>
      <PageHero
        eyebrow="FAQS"
        titleTop="Answers, without"
        titleBottom="the fine print."
        lede={
          <>
            The eight questions members ask us most, answered in full. Search the answers as
            well as the questions &mdash; if a word appears anywhere in one, you&rsquo;ll find it.
          </>
        }
        actions={
          <>
            <Button variant="gold" icon="arrow" size="lg" href="/plans">
              Explore Plans
            </Button>
            <Button variant="ghost" size="lg" href="/contact">
              Ask us directly
            </Button>
          </>
        }
      />

      <FaqExplorer
        eyebrow="MEMBER FAQS"
        heading={
          <>
            Everything we get asked, <span className="text-gold-dark">in one place</span>
          </>
        }
        intro="Coverage, plans, enrolment, claims and who handles what behind the scenes."
        faqs={memberFaqs}
        emptyAction={
          <Button variant="gold" icon="arrow" href="/contact">
            Ask us instead
          </Button>
        }
      />

      <CtaBand
        tone="gold"
        heading={
          <>
            Prefer to ask <span className="text-navy-800">a person?</span>
          </>
        }
        body={
          <>
            Our member-first support team handles plan details, claims and anything else you
            need. For help choosing and enrolling, REACH &mdash; Fortiva&rsquo;s enrollment
            support partner &mdash; offers licensed, human-led guidance by phone.
          </>
        }
        actions={
          <>
            <Button variant="light" icon="arrow" size="lg" href="/contact">
              Contact us
            </Button>
            <Button variant="ghost" size="lg" href={`tel:${REACH_PHONE.replace(/[^\d+]/g, '')}`}>
              Call REACH on {REACH_PHONE}
            </Button>
          </>
        }
        note="REACH provides enrollment guidance only. For questions about an existing plan, contact Fortiva member support."
      />
    </>
  )
}
