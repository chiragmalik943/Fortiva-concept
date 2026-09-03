import { useEffect } from 'react'
import PageHero from '../components/PageHero/PageHero'
import Button from '../components/Button'
import { Link } from '../router/router'
import { navigation } from '../content/site'

/**
 * 404. Reached when a URL doesn't appear in `config/pages.ts` at all — a typo, a
 * stale external link, or a route that was retired.
 *
 * Deliberately distinct from ComingSoon: that page promises a page which is
 * genuinely on the way, and saying that about a mistyped URL would be a claim
 * the visitor can't act on. Which of the two a switched-off route gets is
 * `disabledFallback` in config/pages.ts.
 *
 * On the GitHub Pages deploy, a hard load of an unmatched path is served by
 * `dist/404.html` — the same bundle, under a real HTTP 404 status (see
 * scripts/spa-fallback.mjs) — so a deep link to a dead URL is a 404 to crawlers
 * as well as to people. The `noindex` below covers the in-site case, where the
 * page change never touches the network.
 */
export default function NotFound({ path }: { path: string }) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Page not found — Fortiva'

    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)

    return () => {
      document.title = previousTitle
      meta.remove()
    }
  }, [])

  return (
    <>
      <PageHero
        eyebrow="404"
        titleTop={<>We couldn&rsquo;t find</>}
        titleBottom="that page."
        lede={
          <>
            Nothing lives at <span className="font-semibold">{path}</span>. The link may be
            out of date, or the address may have picked up a typo along the way.
          </>
        }
        actions={
          <>
            <Button variant="light" icon="arrow" size="lg" href="/">
              Back to home
            </Button>
            <Button variant="ghost" size="lg" href="/about">
              About Fortiva
            </Button>
          </>
        }
      />

      {/* Same "Elsewhere on the site" rail as ComingSoon — a dead end should
          still offer the way back into the IA. */}
      <section className="bg-white px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-container">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/50">
            Elsewhere on the site
          </h2>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {navigation.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="corner-smooth inline-block rounded-[14px] bg-navy-800/5 px-4 py-2.5 text-[14.5px] font-medium text-navy-800/75 transition-colors hover:bg-navy-800 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
