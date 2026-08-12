import {
  AnchorHTMLAttributes,
  ReactNode,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useState,
} from 'react'

/**
 * A ~100-line router built on the History API.
 *
 * Why not react-router: the project's node_modules is checked out on the
 * client's machine and adding a dependency would mean an `npm install` before
 * the site would boot again. Everything this site needs from a router is
 * "swap the page component, keep the URL honest" — no nested routes, no
 * loaders, no data APIs — so a dependency would buy nothing that isn't below.
 *
 * ── The base-path problem ───────────────────────────────────────────────────
 * vite.config.ts sets `base: '/Fortiva-concept/'` for the GitHub Pages deploy,
 * so the site lives at a sub-path in production and at `/` in dev. Every
 * `href` written in a component is authored WITHOUT that prefix ('/about'),
 * and `Link` adds it on the way out while the router strips it on the way in.
 * So the same source works under either base and there is exactly one place
 * that knows about the prefix.
 *
 * ── Deep links on GitHub Pages ──────────────────────────────────────────────
 * Pages has no SPA rewrite, so a hard load of /Fortiva-concept/about would 404.
 * scripts/spa-fallback.mjs copies dist/index.html to dist/404.html after the
 * build, which Pages serves for any unmatched path — the URL is preserved, so
 * the router below reads the right route and renders it. Vite's dev server
 * already does its own SPA fallback, so dev needs nothing.
 */

const BASE = import.meta.env.BASE_URL // '/Fortiva-concept/' in prod, '/' in dev
const BASE_NO_SLASH = BASE.replace(/\/$/, '')

/** An href this router should handle: site-relative, not protocol-relative. */
export function isInternalHref(href?: string): href is string {
  return typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')
}

/** '/about' → '/Fortiva-concept/about' — for anything that lands in the DOM. */
export function withBase(path: string): string {
  return isInternalHref(path) ? BASE_NO_SLASH + path : path
}

/** '/Fortiva-concept/about/' → '/about' — normalised, no trailing slash. */
export function stripBase(pathname: string): string {
  let path = pathname
  if (BASE_NO_SLASH && path.startsWith(BASE_NO_SLASH)) {
    path = path.slice(BASE_NO_SLASH.length)
  }
  if (!path.startsWith('/')) path = `/${path}`
  return path.length > 1 ? path.replace(/\/+$/, '') : '/'
}

const RouteContext = createContext<string>('/')

/** Current route, base-stripped and without the hash — e.g. '/about'. */
export const useRoute = () => useContext(RouteContext)

/**
 * Programmatic navigation. Dispatching a synthetic popstate is what lets the
 * single listener in `Router` cover both pushState and the browser's own back
 * and forward buttons, rather than maintaining two paths that can drift.
 */
export function navigate(href: string, { replace = false } = {}) {
  const url = withBase(href)
  if (url === window.location.pathname + window.location.hash) return
  window.history[replace ? 'replaceState' : 'pushState']({}, '', url)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function Router({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => stripBase(window.location.pathname))

  useEffect(() => {
    const sync = () => setPath(stripBase(window.location.pathname))
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  return <RouteContext.Provider value={path}>{children}</RouteContext.Provider>
}

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}

/**
 * Drop-in for `<a>`. Renders a real, correct, copyable href — so middle-click,
 * "open in new tab" and crawlers all behave — and only hijacks the plain
 * left-click that would otherwise cost a full page reload.
 *
 * forwardRef because InsuranceCards animates its cards by holding a
 * `HTMLAnchorElement` ref per card; a Link that swallowed the ref would break
 * that silently rather than loudly.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, onClick, ...rest },
  ref,
) {
  const internal = isInternalHref(href)

  return (
    <a
      {...rest}
      ref={ref}
      href={internal ? withBase(href) : href}
      onClick={(e) => {
        onClick?.(e)
        if (!internal || e.defaultPrevented) return
        // Let the browser own modified clicks: they mean "somewhere else",
        // not "here".
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        if (rest.target && rest.target !== '_self') return
        e.preventDefault()
        navigate(href)
      }}
    />
  )
})
