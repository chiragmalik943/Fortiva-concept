import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import ClipMaskSection from './components/ClipMaskSection/ClipMaskSection'
import MissionBand from './components/MissionBand/MissionBand'
import InsuranceCards from './components/InsuranceCards/InsuranceCards'
import ValuesStack from './components/ValuesStack/ValuesStack'
import SplitSection from './components/SplitSection/SplitSection'
import StackedCards from './components/StackedCards/StackedCards'
import Resources from './components/Resources/Resources'
import FAQ from './components/FAQ/FAQ'
import AvailableStates from './components/AvailableStates/AvailableStates'
import StayConnected from './components/StayConnected/StayConnected'
import Footer from './components/Footer/Footer'
import { useLenis } from './hooks/useLenis'

/**
 * Homepage composition.
 *
 * Reading order: who we are → who it's for → what we believe → how to get
 * covered → what makes us different → learn more → questions → do you serve
 * me → stay in touch → act.
 *
 * One deliberate ordering change from the approved build: StackedCards (the
 * four Fortiva pillars) and the Resources band swapped places, so the pillars
 * are no longer the deepest thing on the page. It's a swap rather than sliding
 * the pillars further up because ValuesStack (~430vh) and StackedCards (~500vh)
 * are both pinned — putting them adjacent would mean ~940vh of unbroken pinned
 * scrolling. SplitSection stays between them as the breather.
 */
export default function App() {
  useLenis()

  return (
    <div className="relative">
      <Navbar />

      <div className="gradient-hero">
        <Hero />
        <ClipMaskSection />
      </div>

      <MissionBand />
      <InsuranceCards />
      <ValuesStack />
      <SplitSection />

      <div className="gradient-lower">
        <StackedCards />
        <Resources />
        <FAQ />
      </div>

      <AvailableStates />
      <StayConnected />
      <Footer />
    </div>
  )
}
