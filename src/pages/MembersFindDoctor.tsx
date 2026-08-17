import { ArrowRight, Building2, ClipboardList, Route, Search, ShieldCheck, Stethoscope, Users, Wallet } from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import ScrollSpyList, { type SpyItem } from '../components/ScrollSpyList/ScrollSpyList'
import CtaBand from '../components/CtaBand/CtaBand'
import Button from '../components/Button'
import ActionButton from '../components/ActionButton'
import { externalTargets, isPlaceholderHref } from '../content/site'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useSplitReveal } from '../hooks/useSplitReveal'

/**
 * For Members → Find a Doctor.
 *
 * Copy is FTVA_Web Copy.odt's "Find a Doctor — Sub Navigation":
 *
 *   H1 + intro + button          → PageHero
 *   (the search itself)          → the navy entry band
 *   Why choose an in-network …   → ScrollSpyList, the three reasons
 *   Tips for talking to your …   → PLACEHOLDER, see the note on that section
 *
 * ── No photographs on any For Members page ──────────────────────────────────
 * Six pages arrived at once with no new image assets, and README.md records that
 * no image on this site is reused anywhere. Quietly repurposing the hero or the
 * insurance-card photos across six new pages would have broken that on the first
 * page and made the claim untrue everywhere. So these pages are built from type,
 * tinted surfaces, the Fortiva mark and purpose-drawn interface mockups instead —
 * which is a coherent look rather than a compromise, and leaves an obvious slot
 * for real photography when it exists.
 */

// Doc's "Why choose an in-network doctor?" — the three bolded labels and their
// sentences, verbatim. Icons are ours; the doc names none.
const reasons: SpyItem[] = [
  {
    title: 'Cost savings',
    body: 'In-network doctors have agreed to lower rates, which means you pay less out-of-pocket.',
    icon: Wallet,
  },
  {
    title: 'Quality care',
    body: 'Our network includes highly qualified professionals who meet our rigorous standards.',
    icon: ShieldCheck,
  },
  {
    title: 'Seamless experience',
    body: "In-network providers are familiar with Fortiva's processes, making your visits smoother and hassle-free.",
    icon: Route,
  },
]

// The three kinds of provider named on the app page ("in-network doctors,
// specialists and facilities"), reused here because they describe this network.
const networkKinds = [
  { label: 'Primary care', icon: Stethoscope },
  { label: 'Specialists', icon: Users },
  { label: 'Facilities', icon: Building2 },
]

/* ─────────────────────────────────────────────────────────────────────────────
   PLACEHOLDER — TODO(client)

   The copy doc has the heading "Tips for talking to your doctor" and then
   nothing underneath it: no tips, no list, no sentence. Every other word on this
   page is the client's own.

   Leaving the heading with an empty section under it would have shipped a
   visible hole, and writing Fortiva-voiced advice would have put claims in the
   client's mouth. So what's below is deliberately the least inventive thing that
   still fills the section: six questions any patient can ask any clinician, and
   three things to have with you. Nothing here asserts anything about Fortiva,
   its plans or its network, and none of it is medical advice — so it can be
   replaced wholesale by the client's real copy without anything else on the page
   needing to change.
   ───────────────────────────────────────────────────────────────────────────── */
const askPrompts = [
  'What is this test or treatment for, and what happens after it?',
  'Are there other options, and which would you choose?',
  'Which of my current medications should I keep taking?',
  'Is everything you are ordering today in network?',
  'What should make me call you before my next visit?',
  'Can you write the plan down so I can read it at home?',
]

const bringWithYou = [
  {
    title: 'Your medication list',
    body: 'Everything you take, including anything over the counter.',
    icon: ClipboardList,
  },
  {
    title: 'Your questions, written down',
    body: 'Appointments are short. A list means the important one gets asked.',
    icon: Search,
  },
  {
    title: 'Your digital ID card',
    body: 'It lives in the Fortiva app, so there is nothing to remember to pack.',
    icon: ShieldCheck,
  },
]

export default function MembersFindDoctor() {
  const searchHeadingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const searchBodyRef = useScrollReveal<HTMLDivElement>({ y: 24, delay: 0.12 })

  const tipsHeadingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const tipsListRef = useScrollReveal<HTMLUListElement>({ y: 26, delay: 0.12 })
  const bringRef = useScrollReveal<HTMLDivElement>({ y: 30, delay: 0.2 })

  return (
    <>
      <PageHero
        eyebrow="FIND A DOCTOR"
        titleTop={<>It&rsquo;s now simpler than ever to</>}
        titleBottom="find a doctor."
        lede={
          <>
            Find a doctor who can help guide you on your health journey. Choosing an
            in-network provider helps you receive quality care at the lowest possible cost.
          </>
        }
        actions={
          <>
            <ActionButton variant="gold" icon="arrow" size="lg" href={externalTargets.providerDirectory}>
              Find a Doctor
            </ActionButton>
            <Button variant="ghost" size="lg" href="/members/virtual-care">
              Or see a doctor online
            </Button>
          </>
        }
      />

      {/* ── the search entry ───────────────────────────────────────────────
          A link that looks like the field it leads to, NOT a form. There is no
          directory behind this repo, so a real input would collect a query and
          then have nowhere to send it — the visitor would type, press enter and
          watch nothing happen, which is worse than an honest doorway. The
          styling sets the expectation; the destination does the searching. */}
      <section className="bg-navy-800 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-white/70">
            PROVIDER SEARCH
          </span>
          <h2
            ref={searchHeadingRef}
            className="mt-5 text-[30px] font-semibold leading-tight text-white opacity-0 sm:text-[38px]"
          >
            Search the <span className="text-gold">Fortiva network</span>
          </h2>

          <div ref={searchBodyRef} className="opacity-0">
            <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-white/65">
              Search by name, specialty or location and see who is in network before you book
              &mdash; not after the bill arrives.
            </p>

            <a
              href={externalTargets.providerDirectory}
              onClick={(e) => {
                if (isPlaceholderHref(externalTargets.providerDirectory)) e.preventDefault()
              }}
              target={isPlaceholderHref(externalTargets.providerDirectory) ? undefined : '_blank'}
              rel="noopener noreferrer"
              title={
                isPlaceholderHref(externalTargets.providerDirectory)
                  ? 'Not connected yet — awaiting the live directory URL'
                  : undefined
              }
              className="corner-smooth group mx-auto mt-10 flex max-w-xl items-center gap-4 rounded-[20px] bg-white p-2.5 pl-6 text-left shadow-card-soft transition-transform duration-300 hover:scale-[1.015]"
            >
              <Search size={19} strokeWidth={2} aria-hidden="true" className="shrink-0 text-navy-800/40" />
              <span className="flex-1 truncate text-[15.5px] text-navy-800/50">
                Name, specialty or ZIP code
              </span>
              <span className="corner-smooth flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-gold text-navy-800 transition-transform duration-300 group-hover:-rotate-45">
                <ArrowRight size={19} strokeWidth={2.25} />
              </span>
            </a>

            <ul className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
              {networkKinds.map(({ label, icon: Icon }) => (
                <li
                  key={label}
                  className="corner-smooth flex items-center gap-2 rounded-[12px] bg-white/8 px-4 py-2 text-[14px] font-medium text-white/75"
                >
                  <Icon size={15} strokeWidth={2} className="text-gold" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ScrollSpyList
        eyebrow="WHY IN-NETWORK"
        heading={
          <>
            Why choose an <span className="text-gold-dark">in-network doctor?</span>
          </>
        }
        intro="Three things change the moment a provider is inside the network — what you pay, who you see, and how much of the admin lands on you."
        items={reasons}
        action={
          <ActionButton variant="gold" icon="arrow" href={externalTargets.providerDirectory}>
            Check a provider
          </ActionButton>
        }
      />

      {/* ── Tips for talking to your doctor ────────────────────────────────
          See the PLACEHOLDER note above `askPrompts`. */}
      <section className="bg-white px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-container">
          <span className="inline-block rounded-full bg-navy-800/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-navy-800/70">
            BEFORE YOU GO IN
          </span>
          <h2
            ref={tipsHeadingRef}
            className="mt-5 max-w-2xl text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px]"
          >
            Tips for talking to <span className="text-gold-dark">your doctor</span>
          </h2>

          <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-16">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/45">
                Worth asking
              </p>
              <ul ref={tipsListRef} className="mt-6 grid gap-4 opacity-0 sm:grid-cols-2">
                {askPrompts.map((prompt, i) => (
                  <li
                    key={prompt}
                    className="corner-smooth relative rounded-card rounded-tl-md bg-cream-soft p-6"
                  >
                    <span className="text-[13px] font-semibold text-gold-dark">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="mt-2.5 text-[15.5px] leading-relaxed text-navy-800">
                      &ldquo;{prompt}&rdquo;
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div ref={bringRef} className="opacity-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/45">
                Worth bringing
              </p>
              <div className="corner-smooth mt-6 rounded-card bg-navy-800 p-7 sm:p-8">
                <ul className="flex flex-col">
                  {bringWithYou.map(({ title, body, icon: Icon }) => (
                    <li key={title} className="border-b border-white/10 py-5 first:pt-0 last:border-b-0 last:pb-0">
                      <div className="flex items-start gap-4">
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-white/10">
                          <Icon size={17} strokeWidth={1.9} className="text-gold" />
                        </span>
                        <div>
                          <h3 className="text-[16px] font-semibold text-white">{title}</h3>
                          <p className="mt-1.5 text-[14px] leading-relaxed text-white/60">{body}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <Button variant="gold" icon="arrow" href="/members/app">
                    Get the app
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        tone="gold"
        heading={
          <>
            Care starts with the <span className="text-navy-800">right doctor</span>
          </>
        }
        body="Search the network, or bring a question to the team and we'll help you find someone."
        actions={
          <>
            <ActionButton variant="light" icon="arrow" size="lg" href={externalTargets.providerDirectory}>
              Find a Doctor
            </ActionButton>
            <Button variant="ghost" size="lg" href="/contact">
              Contact us
            </Button>
          </>
        }
      />
    </>
  )
}
