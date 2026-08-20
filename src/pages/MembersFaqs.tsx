import PageHero from '../components/PageHero/PageHero'
import FaqExplorer from '../components/FaqExplorer/FaqExplorer'
import CtaBand from '../components/CtaBand/CtaBand'
import Button from '../components/Button'
import { REACH_PHONE, faqCategories, memberFaqs } from '../content/site'

/**
 * For Members → FAQs.
 *
 * Forty questions in four categories — Plans & coverage, Enrolling & eligibility,
 * Costs & claims, Using your plan — ten each.
 *
 * Eight of those forty are the copy doc's own "FAQs — Sub Navigation", unabridged,
 * including the three-paragraph answer to "How do I enroll" that the homepage band
 * shortens to its first paragraph. The other thirty-two are lorem ipsum, marked
 * `PLACEHOLDER — TODO(client)` in content/site.ts and deletable in one line. They
 * exist because a category rail and a scroll-spy cannot be judged on eight
 * questions: at eight the grouping is decoration, and at forty it's the only way
 * the page is navigable.
 *
 * Both the copy and the category list live in content/site.ts so the homepage band
 * and this page cannot disagree; see FaqExplorer for the rail, the spy and the
 * search.
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
            Forty questions in four groups, answered in full. Jump to a group from the
            list, or search &mdash; the search covers the answers as well as the questions,
            so if a word appears anywhere in one, you&rsquo;ll find it.
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
        intro="Coverage, plans, enrolment, claims and who handles what behind the scenes — sorted into four groups so you can start where your question is."
        faqs={memberFaqs}
        categories={faqCategories}
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
