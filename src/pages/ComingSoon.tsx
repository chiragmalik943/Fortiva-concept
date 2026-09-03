import PageHero from '../components/PageHero/PageHero'
import Button from '../components/Button'
import { Link } from '../router/router'
import { navigation } from '../content/site'

/**
 * Placeholder for every route in the IA that hasn't been built yet.
 *
 * The nav, footer and in-page CTAs all link the full information architecture
 * from content/site.ts, and only `/` and `/about` currently have pages. Before
 * the router existed those links were hard navigations that 404'd; this at
 * least keeps a visitor inside the site and tells them the truth. Delete the
 * fallback branch in App.tsx as each real page lands.
 */
export default function ComingSoon({ path }: { path: string }) {
  // Resolve the route back to its nav label so the page can name itself,
  // rather than printing a raw URL at the visitor.
  const label =
    navigation.find((item) => item.href === path)?.label ??
    navigation.flatMap((item) => item.children ?? []).find((child) => child.href === path)?.label ??
    path
      .split('/')
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()) ??
    'This page'

  return (
    <>
      {/* "We're still building / <label>." rather than "<label> is on the
          way" — the labels are a mix of singular and plural ("Plans",
          "Broker Portal"), and only a construction where the label is the
          OBJECT stays grammatical across all of them. */}
      <PageHero
        eyebrow="COMING SOON"
        titleTop={<>We&rsquo;re still building</>}
        titleBottom={`${label}.`}
        lede={
          <>
            This page is still being built. In the meantime, the homepage and About page
            cover who Fortiva is and how our coverage works &mdash; or get in touch and
            we&rsquo;ll answer directly.
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
