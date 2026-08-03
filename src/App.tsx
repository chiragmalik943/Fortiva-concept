import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import ClipMaskSection from './components/ClipMaskSection/ClipMaskSection'
import InsuranceCards from './components/InsuranceCards/InsuranceCards'
import ValuesStack from './components/ValuesStack/ValuesStack'
import SplitSection from './components/SplitSection/SplitSection'
import FAQ from './components/FAQ/FAQ'
import Blog from './components/Blog/Blog'
import StackedCards from './components/StackedCards/StackedCards'
import Footer from './components/Footer/Footer'
import { useLenis } from './hooks/useLenis'

export default function App() {
  useLenis()

  return (
    <div className="relative">
      <Navbar />

      <div className="gradient-hero">
        <Hero />
        <ClipMaskSection />
      </div>

      <InsuranceCards />
      <ValuesStack />
      <SplitSection />

      <div className="gradient-lower">
        <Blog />
        <StackedCards />
        <FAQ />
      </div>

      <Footer />
    </div>
  )
}
