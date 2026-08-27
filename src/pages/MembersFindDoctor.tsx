import { ArrowRight, Building2, FileText, Route, Search, ShieldCheck, Stethoscope, Users, Wallet } from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import DissolvePhoto from '../components/DissolvePhoto/DissolvePhoto'
import ScrollSpyList, { type SpyItem } from '../components/ScrollSpyList/ScrollSpyList'
import CtaBand from '../components/CtaBand/CtaBand'
import Button from '../components/Button'
import ActionButton from '../components/ActionButton'
import { externalTargets, isPlaceholderHref } from '../content/site'
import { images } from '../assets/images'
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
 * ── The one photograph on this page ─────────────────────────────────────────
 * The For Members pages arrived with no image assets of their own, and README.md
 * records that no image on this site is reused anywhere — so rather than
 * repurpose the hero or the insurance-card shots, they were built from type,
 * tinted surfaces, the Fortiva mark and purpose-drawn interface mockups. That is
 * still true of everything above "Before you go in", which now has a slot of its
 * own (`images.doctorTipsPortrait`). The file is not in the repo yet; the section
 * lays out correctly without it and the photograph drops in with no code change.
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
  'What is this test or treatment for, and what’s next?',
  'Are there other options, and which would you choose?',
  'Which of my current medications should I keep taking?',
  'Is everything you are ordering today in network?',
  'What should make me call you before my next visit?',
]

/**
 * Three labels, no sentences. Each of these used to carry a line of explanation
 * and sit in a navy panel with a "Get the app" button under it; the panel was
 * doing the job of a second column, and once the photograph took that side of the
 * section there was no second column to fill. A row of three labels says the same
 * thing in a strip, and the page already ends on a CTA band — the button was the
 * third call to the app on one screen.
 */
const bringWithYou = [
  { label: 'Your full medical history', icon: FileText },
  { label: 'Your questions, written down', icon: Search },
  { label: 'Your digital ID card', icon: ShieldCheck },
]

export default function MembersFindDoctor() {
  const searchHeadingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const searchBodyRef = useScrollReveal<HTMLDivElement>({ y: 24, delay: 0.12 })

  const tipsHeadingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const tipsListRef = useScrollReveal<HTMLOListElement>({ y: 26, delay: 0.12 })
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

      {/* ── one gradient, two sections ──────────────────────────────────────
          "Why in-network" and "Before you go in" now share a single cream → blue
          → cream sweep, with the cool peak on the seam between them: `-in` here,
          `-out` on the section below. Two halves rather than one wrapper because
          the two sections are never the same height — the spy list grows with its
          items and the tips section doesn't — so a wrapper with a mid-stop would
          put the peak somewhere inside whichever happens to be taller. Each half
          runs its own full height instead, which pins the turnaround to the
          boundary. Same reasoning as `.gradient-band-in/-out`; see index.css. */}
      <ScrollSpyList
        className="gradient-cool-in"
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
          See the PLACEHOLDER note above `askPrompts`.

          One column of type on the left, one photograph on the right, and the
          photograph is absolutely positioned rather than a grid cell: the list is
          ~470px of text in a 1360px container, so a real two-column grid would
          have given the picture a hard edge halfway across an otherwise open
          section. Behind-and-to-the-right lets it run to the viewport edge and
          dissolve, which is what the layout was drawn with.

          `lg` and up. Below that the photo is dropped entirely — under a
          two-column width it would sit behind the questions rather than beside
          them, and questions are the one thing on this page that has to be
          legible. */}
      <section className="gradient-cool-out relative overflow-hidden px-6 py-24 sm:py-28">
        {/* ── the photograph ───────────────────────────────────────────────────
            The mark is in the artwork now, not drawn here — see DissolvePhoto.tsx.

            `blend`, and no mask. The asset is a photograph flattened onto WHITE
            that fades to white on its left and at its foot, and this section is no
            longer white: it is the cool end of the band above. Masking the white
            away would have meant guessing where it starts with straight ramps.
            Multiplying is exact instead — white multiplied by the background IS
            the background, so every pixel the retoucher faded takes the gradient's
            own colour, soft edges included, and the picture needs no mask at all.

            The one thing to know before changing the section's surface: multiply
            only works while that surface is light. On navy this photograph would
            go black.

            68% wide, not the 54% the copy column leaves free, and that is not an
            overlap bug. The asset is 1114 x 933; a 54%-wide box is narrower than
            that aspect needs to cover the section height, so `object-cover` cropped
            ~110px off each side — and the left 110px is the most-faded part of the
            picture, the part doing the blending. Cropping it left a visible vertical
            step where the photo began. At 68% the frame is close enough to the
            asset's own aspect that almost nothing is cropped, and the extra width
            costs nothing: everything it reaches over the list is white in the asset,
            and white multiplied by the background is the background. */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[68%] select-none lg:block">
          <DissolvePhoto
            src={images.doctorTipsPortrait}
            position="object-center"
            edges="none"
            blend
            className="h-full w-full"
          />
        </div>

        <div className="relative mx-auto max-w-container">
          <div className="max-w-[640px]">
            <span className="inline-block rounded-full bg-navy-800/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-navy-800/70">
              BEFORE YOU GO IN
            </span>

            {/* Two explicit lines. The break after "talking" is the drawn one,
                and letting it fall where the measure happens to put it would have
                meant tuning a max-width to land it — a number that moves the next
                time the type scale does. Set in regular, not semibold: this
                heading sits over a photograph rather than on a plate, and the
                lighter weight is what keeps it from competing with the subject. */}
            <h2
              ref={tipsHeadingRef}
              className="mt-5 text-[30px] font-normal leading-[1.28] text-navy-800 opacity-0 sm:text-[44px]"
            >
              <span className="block">Tips for talking</span>
              <span className="block">
                to <span className="text-gold-dark">your doctor</span>
              </span>
            </h2>

            <p className="mt-11 text-[11px] font-semibold uppercase tracking-[0.14em]">
              <span className="text-navy-800/40">Worth </span>
              <span className="text-gold-dark">asking</span>
            </p>

            {/* An `<ol>`, not a `<ul>`: the numbers are painted, so the order has
                to be real. The gold rule replaces the tinted card each of these
                used to sit in — five cards in a two-column grid over a photograph
                was five opaque plates covering it. */}
            <ol ref={tipsListRef} className="mt-6 space-y-4 opacity-0">
              {askPrompts.map((prompt, i) => (
                <li
                  key={prompt}
                  className="flex items-center gap-5 border-l-2 border-gold py-1 pl-5"
                >
                  <span className="text-[13px] font-semibold text-navy-800/75">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-[15.5px] leading-relaxed text-navy-800">
                    &ldquo;{prompt}&rdquo;
                  </p>
                </li>
              ))}
            </ol>

            <div ref={bringRef} className="mt-12 opacity-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                <span className="text-navy-800/40">Worth </span>
                <span className="text-gold-dark">bringing</span>
              </p>

              {/* A row from `sm` up, divided by hairlines rather than boxed. The
                  dividers are `border-l` on every item but the first, so adding a
                  fourth thing to bring needs no change here. */}
              <ul className="mt-5 flex flex-col gap-5 sm:mt-6 sm:flex-row sm:gap-0">
                {bringWithYou.map(({ label, icon: Icon }, i) => (
                  <li
                    key={label}
                    className={`flex items-center gap-4 sm:flex-1 ${
                      i > 0 ? 'sm:border-l sm:border-navy-800/10 sm:pl-6' : ''
                    } ${i < bringWithYou.length - 1 ? 'sm:pr-6' : ''}`}
                  >
                    <span className="corner-smooth flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-mist/40">
                      <Icon size={19} strokeWidth={1.9} className="text-navy-800" />
                    </span>
                    <span className="text-[15px] font-medium leading-snug text-navy-800">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
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
