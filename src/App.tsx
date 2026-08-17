import { useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home'
import About from './pages/About'
import PlansIndividuals from './pages/PlansIndividuals'
import PlansEmployers from './pages/PlansEmployers'
import MembersHub from './pages/MembersHub'
import MembersFindDoctor from './pages/MembersFindDoctor'
import MembersVirtualCare from './pages/MembersVirtualCare'
import MembersResources from './pages/MembersResources'
import MembersFaqs from './pages/MembersFaqs'
import MembersApp from './pages/MembersApp'
import MembersPortal from './pages/MembersPortal'
import ComingSoon from './pages/ComingSoon'
import { Router, useRoute } from './router/router'
import { ScrollTrigger } from './animations/gsap'
import { useLenis, scrollPageTo, scrollPageToTop } from './hooks/useLenis'

/**
 * Route table. Only the built pages are listed; everything else in the IA
 * falls through to ComingSoon, which is deliberate — the nav and footer link
 * the whole of content/site.ts, and a route that isn't here yet should land
 * somewhere honest rather than 404.
 */
const routes: Record<string, () => JSX.Element> = {
  '/': Home,
  '/about': About,
  '/plans/individuals-and-families': PlansIndividuals,
  '/plans/employers': PlansEmployers,

  // For Members — the whole section, including /members itself. The nav renders
  // that one as a dropdown trigger rather than a link, but the footer links it
  // and so does anyone who trims the URL, so it gets a real index page.
  '/members': MembersHub,
  '/members/find-a-doctor': MembersFindDoctor,
  '/members/virtual-care': MembersVirtualCare,
  '/members/resources': MembersResources,
  '/members/faqs': MembersFaqs,
  '/members/app': MembersApp,
  '/members/portal': MembersPortal,
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
    // A cross-page link can carry a fragment — the homepage's resources card
    // points at /members/resources#videos, and the footer at
    // /providers/portal#submit-a-claim. `useRoute` deliberately excludes the
    // hash (it isn't part of route identity), so it's read off the location
    // here. Lenis owns the scroll position, so the browser's own fragment jump
    // gets overwritten on the next frame and the scroll has to go through
    // Lenis; see scrollPageTo.
    const hash = window.location.hash
    if (!hash) scrollPageToTop()

    let inner = 0
    const outer = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      // Refreshing can change the document's height (pinned sections
      // re-measure), so a fragment target is only worth measuring on the frame
      // after that has settled.
      if (hash) inner = requestAnimationFrame(() => scrollPageTo(hash))
    })

    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
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
