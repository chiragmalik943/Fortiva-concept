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
import BrokersOverview from './pages/BrokersOverview'
import BrokersResources from './pages/BrokersResources'
import BrokersFaqs from './pages/BrokersFaqs'
import BrokersPortal from './pages/BrokersPortal'
import ProvidersOverview from './pages/ProvidersOverview'
import ProvidersPortal from './pages/ProvidersPortal'
import ProvidersPartnerWithUs from './pages/ProvidersPartnerWithUs'
import ComingSoon from './pages/ComingSoon'
import NotFound from './pages/NotFound'
import { Router, useRoute } from './router/router'
import { pages, disabledFallback, type PageConfig, type PageKey } from './config/pages'
import { ScrollTrigger } from './animations/gsap'
import { useLenis, scrollPageTo, scrollPageToTop } from './hooks/useLenis'

/**
 * Which built page serves each key in config/pages.ts.
 *
 * This map answers "what renders it", never "is it live" — that lives in the
 * config and nowhere else. Keys are `PageKey`s, so it cannot name a page the
 * config doesn't declare: a typo is a build error rather than a route that
 * silently never matches.
 *
 * `Partial` on purpose. A route may be switched on before its page exists —
 * several routes in the IA still have no page — and those land on the fallback
 * below, exactly as they did before this config existed.
 *
 * Every component stays imported whether its route is enabled or not: switching
 * a page off is a config edit, never a deletion, so switching it back on needs
 * nothing here.
 */
const pageComponents: Partial<Record<PageKey, () => JSX.Element>> = {
  home: Home,
  about: About,
  plansIndividuals: PlansIndividuals,
  plansEmployers: PlansEmployers,

  // For Members — the whole section, including /members itself. The nav renders
  // that one as a dropdown trigger rather than a link, but the footer links it
  // and so does anyone who trims the URL, so it gets a real index page.
  members: MembersHub,
  membersFindDoctor: MembersFindDoctor,
  membersVirtualCare: MembersVirtualCare,
  membersResources: MembersResources,
  membersFaqs: MembersFaqs,
  membersApp: MembersApp,
  membersPortal: MembersPortal,

  // For Brokers — the whole section, including /brokers itself. The nav renders
  // that one as a dropdown trigger rather than a link, but the footer links it
  // and so does anyone who trims the URL, so it gets a real overview page.
  brokers: BrokersOverview,
  brokersResources: BrokersResources,
  brokersFaqs: BrokersFaqs,
  brokersPortal: BrokersPortal,

  // For Providers — all three, including `/providers` itself, which is the
  // Provider Overview rather than a hub of cards: content/site.ts lists
  // "Provider Overview" at that route, the same way "Broker Overview" sits at
  // `/brokers`.
  providers: ProvidersOverview,
  providersPortal: ProvidersPortal,
  providersPartnerWithUs: ProvidersPartnerWithUs,
}

/**
 * Route table, derived from the config once at module load rather than on every
 * navigation.
 *
 * `routes` holds only the live pages. `knownRoutes` holds every route the config
 * declares, on or off — which is what separates "a page that exists but isn't
 * switched on" from "a URL that was never a page at all", and lets the two get
 * different answers below.
 */
const routes: Record<string, () => JSX.Element> = {}
const knownRoutes = new Set<string>()

for (const [key, page] of Object.entries(pages) as [PageKey, PageConfig][]) {
  knownRoutes.add(page.route)
  const Page = pageComponents[key]
  if (page.enabled && Page) routes[page.route] = Page
}

function Site() {
  const route = useRoute()
  const Page = routes[route]

  /* A route with no live page falls back rather than rendering an empty shell:
     a route the config knows — switched off, or switched on but not built yet —
     gets whichever page `disabledFallback` names, while anything the config
     has never heard of is a 404. The config is the complete list of pages that
     exist, so a URL outside it is a typo or a stale link, not a promise. */
  const Fallback = disabledFallback === 'coming-soon' && knownRoutes.has(route) ? ComingSoon : NotFound

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
      {Page ? <Page /> : <Fallback path={route} />}
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
