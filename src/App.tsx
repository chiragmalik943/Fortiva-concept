import { useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home'
import About from './pages/About'
import ComingSoon from './pages/ComingSoon'
import { Router, useRoute } from './router/router'
import { ScrollTrigger } from './animations/gsap'
import { useLenis, scrollPageToTop } from './hooks/useLenis'

/**
 * Route table. Only the two built pages are listed; everything else in the IA
 * falls through to ComingSoon, which is deliberate — the nav and footer link
 * the whole of content/site.ts, and a route that isn't here yet should land
 * somewhere honest rather than 404.
 */
const routes: Record<string, () => JSX.Element> = {
  '/': Home,
  '/about': About,
}

function Site() {
  const route = useRoute()
  const Page = routes[route]

  useLenis()

  /* ── every navigation starts at the top ─────────────────────────────────
     Two things have to happen in order, and the order is the whole point:

     1. Scroll to 0 BEFORE the browser paints the new page, otherwise the
        visitor sees the incoming page already scrolled to wherever they left
        the last one. useLayoutEffect would be the usual tool, but Lenis owns
        the scroll position, so it's `scrollPageToTop()` rather than
        `window.scrollTo` — see hooks/useLenis.ts.

     2. Refresh ScrollTrigger AFTER layout settles. Both pages pin sections
        hundreds of vh tall; their triggers are created in the new page's own
        effects, but the start/end offsets those triggers measured were taken
        against a document whose height was still the OLD page's. Refreshing on
        the next frame re-measures everything against the page that's actually
        on screen. Without it, a pinned section can start or release hundreds
        of pixels off. */
  useEffect(() => {
    scrollPageToTop()
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(frame)
  }, [route])

  return (
    <div className="relative">
      <Navbar />
      {Page ? <Page /> : <ComingSoon path={route} />}
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Site />
    </Router>
  )
}
