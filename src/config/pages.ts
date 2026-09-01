/**
 * Which routes this deployment serves.
 *
 * This file is the single source of truth for the site's routes. `App.tsx`
 * builds its route table from it at module load, so a page is reachable if and
 * only if it appears below with `enabled: true` — nothing else in the codebase
 * gets a vote.
 *
 * Switching a page on or off is a one-word edit here. No component, import or
 * route table is touched, and the page's own file stays exactly where it is, so
 * turning it back on later costs the same one word.
 *
 * ── What `enabled: false` does ───────────────────────────────────────────────
 * The route stays part of the site's IA: the nav and footer still link it and
 * the link is still clickable. What changes is what renders — the real page
 * component is never mounted, and the visitor gets `disabledFallback`'s page
 * instead, whether they clicked a link or typed the URL. Direct URL access is
 * covered because the GitHub Pages deploy serves the same bundle for a deep
 * link as for an in-site click (`scripts/spa-fallback.mjs`), and that bundle
 * resolves every route through this file. There is no path into a disabled
 * page's component.
 *
 * A route that isn't listed here at all is a genuine unknown URL — a typo, or a
 * stale external link — and renders the 404 page rather than a "coming soon"
 * that promises a page nobody is building.
 *
 * ── Route format ────────────────────────────────────────────────────────────
 * Routes are authored WITHOUT the deploy's base path and without a trailing
 * slash, exactly as every `href` in the codebase is written: '/members/faqs',
 * never '/Fortiva-concept/members/faqs/'. `router/router.tsx` owns the base
 * prefix at both ends — see the header comment there.
 */

export interface PageConfig {
  /** true → the real page renders. false → `disabledFallback` renders instead. */
  enabled: boolean
  /** Base-less, no trailing slash. Must match the hrefs that point at it. */
  route: string
}

/**
 * What a disabled route renders.
 *
 * 'coming-soon' — `pages/ComingSoon.tsx`. Names the page and points at what is
 *   live. The honest answer while the IA is public but the pages are still
 *   landing, which is where this site is today.
 * 'not-found'   — `pages/NotFound.tsx`. Treats a disabled route exactly like a
 *   URL that never existed. Switch to this to make a switched-off page
 *   indistinguishable from a 404.
 *
 * Routes missing from `pages` below always get 'not-found', whatever this says.
 */
export const disabledFallback: 'coming-soon' | 'not-found' = 'coming-soon'

/**
 * Every route in the site's information architecture.
 *
 * The `enabled: true` set is exactly the set that has a real page component in
 * `src/pages`. Everything else is linked from the nav or footer (see
 * `content/site.ts`) but has no page yet, so it ships switched off.
 */
export const pages = {
  home: { enabled: true, route: '/' },
  about: { enabled: true, route: '/about' },

  /* Plans — the two audience pages are built; the section index isn't. */
  plans: { enabled: false, route: '/plans' },
  plansIndividuals: { enabled: true, route: '/plans/individuals-and-families' },
  plansEmployers: { enabled: true, route: '/plans/employers' },

  /* For Members — complete, including the section index. */
  members: { enabled: true, route: '/members' },
  membersFindDoctor: { enabled: true, route: '/members/find-a-doctor' },
  membersVirtualCare: { enabled: true, route: '/members/virtual-care' },
  membersResources: { enabled: true, route: '/members/resources' },
  membersFaqs: { enabled: true, route: '/members/faqs' },
  membersApp: { enabled: true, route: '/members/app' },
  membersPortal: { enabled: true, route: '/members/portal' },

  /* For Brokers — complete. */
  brokers: { enabled: true, route: '/brokers' },
  brokersResources: { enabled: true, route: '/brokers/resources' },
  brokersFaqs: { enabled: true, route: '/brokers/faqs' },
  brokersPortal: { enabled: false, route: '/brokers/portal' },

  /* For Providers — not built yet. */
  providers: { enabled: false, route: '/providers' },
  providersPortal: { enabled: false, route: '/providers/portal' },
  providersPartnerWithUs: { enabled: false, route: '/providers/partner-with-us' },

  /* Footer-only and in-page CTA destinations — not built yet. */
  availableStates: { enabled: false, route: '/available-states' },
  careers: { enabled: false, route: '/careers' },
  contact: { enabled: false, route: '/contact' },
  blog: { enabled: false, route: '/blog' },
  terms: { enabled: false, route: '/terms' },
  privacy: { enabled: false, route: '/privacy' },
} satisfies Record<string, PageConfig>

/**
 * The config's own keys, as a union. `App.tsx` keys its component map by this,
 * so a mistyped page name there is a build error rather than a route that
 * silently never matches.
 */
export type PageKey = keyof typeof pages

/**
 * '/members/resources#videos' → '/members/resources', '/about/' → '/about'.
 *
 * Lookups arrive both from hrefs written by hand (which carry fragments —
 * '/providers/portal#submit-a-claim' is one) and from `window.location`, so a
 * fragment, a query string and a stray trailing slash all have to resolve to
 * the same route.
 */
function normaliseRoute(href: string): string {
  const path = href.split(/[?#]/)[0]
  return path.length > 1 ? path.replace(/\/+$/, '') : path
}

const byRoute = new Map<string, PageConfig>(
  (Object.values(pages) as PageConfig[]).map((page) => [normaliseRoute(page.route), page]),
)

/** The config entry for a route or href, or undefined if it isn't a route here. */
export function pageForRoute(href: string): PageConfig | undefined {
  return byRoute.get(normaliseRoute(href))
}

/** Does the config declare this route at all — switched on or off? */
export function isKnownRoute(href: string): boolean {
  return pageForRoute(href) !== undefined
}

/**
 * Is this route live? Unknown routes are not.
 *
 * Nothing calls this today, by design: the nav and footer deliberately keep
 * linking switched-off pages, and those links land on the fallback page. It's
 * here for the day that changes — filtering `navigation` and `footerNav` in
 * `content/site.ts` through it is the whole edit, and every link in the site
 * (in-page CTAs and cards included) is drawn from those two lists or from a
 * hard-coded href that the same helper can guard.
 */
export function isRouteEnabled(href: string): boolean {
  return pageForRoute(href)?.enabled === true
}
