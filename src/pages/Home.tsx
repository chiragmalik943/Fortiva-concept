import Hero from '../components/Hero/Hero'
import ClipMaskSection from '../components/ClipMaskSection/ClipMaskSection'
import MissionBand from '../components/MissionBand/MissionBand'
import InsuranceCards from '../components/InsuranceCards/InsuranceCards'
import SplitSection from '../components/SplitSection/SplitSection'
import StackedCards from '../components/StackedCards/StackedCards'
import Resources from '../components/Resources/Resources'
import FAQ from '../components/FAQ/FAQ'
import AvailableStates from '../components/AvailableStates/AvailableStates'
import StayConnected from '../components/StayConnected/StayConnected'

/**
 * Homepage composition.
 *
 * Reading order: who we are → who it's for → what makes us different → how to
 * get covered → learn more → questions → do you serve me → stay in touch.
 *
 * ── Two structural changes from the previous build ──────────────────────────
 * 1. ValuesStack has moved to the About page. The five brand values are an
 *    "about us" statement, and on a homepage that already runs long they were
 *    ~430vh of pinned scrolling competing with StackedCards' ~500vh for the
 *    same job.
 * 2. StackedCards has taken its slot, between the audience cards and the split
 *    section. That's a promotion — the four Fortiva pillars are the page's
 *    actual argument, and they were previously the deepest thing on it.
 *
 * The knock-on: StackedCards used to sit inside `gradient-lower` alongside
 * Resources and FAQ. Its own `bg-cream` is opaque, so it was covering that
 * gradient rather than sitting in it — with it gone, Resources and FAQ get the
 * full sweep of `gradient-lower` to themselves and read as their own tinted
 * band, which is what the gradient was drawn for.
 */
export default function Home() {
  return (
    <>
      <div className="gradient-hero">
        <Hero />
        <ClipMaskSection />
      </div>

      <MissionBand />
      <InsuranceCards />
      <StackedCards />
      <SplitSection />

      <Resources />

      <div className="gradient-lower">
        <FAQ />
      </div>

      <AvailableStates />
      <StayConnected />
    </>
  )
}
