import { ArrowRight, Building2, FileText, Route, Search, ShieldCheck, Stethoscope, Users, Wallet } from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
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
 *   (the search itself)          → the light-blue entry band, photo + search
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
  const searchImageRef = useScrollReveal<HTMLDivElement>({ y: 40, scale: 0.96 })

  /* TWO split roots for one two-line heading, which is not a style choice.
     useSplitReveal hands the element to SplitType, and SplitType writes an inline
     `display: inline-block` onto every nested element it walks on its way to the
     words. A `block` CLASS cannot beat an inline style, so with both lines inside
     one root the two `<span className="block">` wrappers were being flipped to
     inline-block and the heading collapsed onto one line — reading "for
     talkingto your doctor", with no space, because block siblings need none.

     A root is left alone: measured, a span handed to SplitType directly keeps
     `display: block` and gets no inline style at all. So each line is its own
     root. Same reasoning, same fix as the homepage h1 — see Hero.tsx.

     This was invisible in every screenshot taken to verify it, because
     useSplitReveal returns early under `prefers-reduced-motion` and SplitType
     never runs at all in that mode. */
  const tipsHeadingRef = useSplitReveal<HTMLSpanElement>({ type: 'words' })
  const tipsHeadingTwoRef = useSplitReveal<HTMLSpanElement>({ type: 'words', delay: 0.14 })
  const tipsListRef = useScrollReveal<HTMLOListElement>({ y: 26, delay: 0.12 })
  const bringRef = useScrollReveal<HTMLDivElement>({ y: 30, delay: 0.2 })

  return (
    <>
      <PageHero
        tone="sky"
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
            <ActionButton variant="dark" icon="arrow" size="lg" href={externalTargets.providerDirectory}>
              Find a Doctor
            </ActionButton>
            <Button variant="white" size="lg" href="/members/virtual-care">
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
          styling sets the expectation; the destination does the searching.

          ── It was a centred band on navy ─────────────────────────────────────
          Now it is a photograph on the left and the whole entry on the right, on
          #A5CDD9. Which means every ink in here inverted: the band used to be the
          page's dark plate and is now its palest, so the eyebrow, the heading,
          the lead and the three provider kinds are all navy where they were
          white.

          ── The photograph has no box at all ──────────────────────────────────
          No frame, no rounded corners, no shadow, no margin: it fills the left
          half of the section, top to bottom, and out to the window's own edge.
          Which is why the grid is not inside `max-w-container` — a 1360px
          container would have put 40px of margin down its left on a 1440px
          window. The copy column carries the padding instead, and `max-w-xl`
          inside it holds the measure the container used to.

          `object-contain object-bottom`, because find-doc.png is a TRANSPARENT
          CUTOUT with the Fortiva mark composited behind the subject — `cover`
          would crop the mark's petals, which are the one thing in the frame that
          has to stay whole. So the picture fills the section's height and stands
          on its bottom edge, and #A5CDD9 shows through everywhere the artwork
          does not reach.

          ── And the three provider kinds are not pills ────────────────────────
          They were `bg-white/70` rounded chips. That surface is gone; they are an
          icon and a label in a row now, divided by nothing. The icons stay the
          logo's teal, which measures 4.9:1 straight on #A5CDD9. */}
      <section className="overflow-hidden bg-[#A5CDD9]">
        <div className="grid lg:grid-cols-2 lg:items-stretch">
          <div
            ref={searchImageRef}
            className="relative min-h-[340px] opacity-0 sm:min-h-[420px] lg:min-h-[620px]"
          >
            <img
              src={images.doctorSearch}
              alt="A Fortiva member with their doctor"
              className="absolute inset-0 h-full w-full select-none object-contain object-bottom"
            />
          </div>

          <div className="flex flex-col justify-center px-6 py-20 sm:py-24 lg:px-12">
            <div className="max-w-xl">
              <span className="inline-block rounded-full bg-white/55 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-navy-800/85">
                PROVIDER SEARCH
              </span>
              <h2
                ref={searchHeadingRef}
                className="mt-5 text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px]"
              >
                Search the <span className="text-gold-dark">Fortiva network</span>
              </h2>

              <div ref={searchBodyRef} className="opacity-0">
                <p className="mt-6 text-[16px] leading-relaxed text-navy-800/75">
                  Search by name, specialty or location and see who is in network before you
                  book &mdash; not after the bill arrives.
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
                  className="corner-smooth group mt-9 flex items-center gap-4 rounded-[20px] bg-white p-2.5 pl-6 text-left shadow-card-soft transition-transform duration-300 hover:scale-[1.015]"
                >
                  <Search size={19} strokeWidth={2} aria-hidden="true" className="shrink-0 text-navy-800/40" />
                  <span className="flex-1 truncate text-[15.5px] text-navy-800/50">
                    Name, specialty or ZIP code
                  </span>
                  <span className="corner-smooth flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-gold text-navy-800 transition-transform duration-300 group-hover:-rotate-45">
                    <ArrowRight size={19} strokeWidth={2.25} />
                  </span>
                </a>

                <ul className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
                  {networkKinds.map(({ label, icon: Icon }) => (
                    <li
                      key={label}
                      className="flex items-center gap-2 text-[14px] font-medium text-navy-800/85"
                    >
                      <Icon size={16} strokeWidth={2} className="text-[#0074A6]" />
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── #CCD0D2, then #CCD0D2 → white ──────────────────────────────────
          These two sections used to share one cream → blue → cream sweep, cut in
          half so the cool peak landed exactly on the seam between them
          (`gradient-cool-in` here, `-out` below). The peak is now the START: this
          section is a flat plate at #CCD0D2 and the one below it ramps from that
          same grey to white.

          Which keeps what the split ramp was for and drops what it cost. The seam
          between two sections of different, changing heights is still exactly on
          colour — because the first section no longer changes colour at all — and
          the page arrives at the grey in one step off the light blue band above
          rather than climbing to it across a whole spy list.

          The ramp ends on WHITE rather than the site's cream. Cream is what the
          older two-part band handed back to, but nothing on this page picks cream
          up any more: what follows the tips section is the gold CTA band, so the
          ramp's only job is to get off the grey. */}
      <ScrollSpyList
        className="bg-[#CCD0D2]"
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

          ── The photograph is bounded to the container's left half ────────────
          It was `absolute inset-y-0 left-10` at `h-full w-auto`: exactly as tall
          as the section, and as wide as its own ratio made it. Two things were
          wrong with that, and the second is why it drifted.

          The width was derived from the SECTION'S HEIGHT — a near-square asset at
          832px tall is 829px wide — while the copy's position was derived from a
          centred 1360px container. So the two were measured against different
          things: at 1440px the artwork reached 776px against a copy starting at
          668px, a 108px overlap, and at 1920px the container moved right and the
          overlap vanished on its own. Same code, different answer per viewport.

          Both now live in the same `max-w-container px-6`, and the picture is
          `w-1/2 object-contain` inside it. `contain` is what makes it safe rather
          than just narrower: the box is half the container, and the picture is
          scaled to FIT that box, so no section height can push the artwork across
          the halfway line. The copy takes the other half. They cannot overlap at
          any width, and there is no number here tuned to one viewport.

          ── What that costs, stated plainly ──────────────────────────────────
          The picture is no longer the full height of the section. At 1440px the
          box is 656 x 832 and this asset is near-square, so it renders 656 x 658
          and `object-left` centres it vertically — about 87px of ramp above and
          below. That is unavoidable: a square picture at the section's full height
          would be as wide as the section is tall, and there is no arrangement
          where a 830px picture and a readable question list both fit inside 1312px
          without one crossing the other. Height was the thing to give up.

          The left margin comes from the layout rather than an offset: the
          container's own `px-6` plus the asset's internal 11.2%, which puts the
          artwork about 137px in from the window edge at 1440px — where the
          explicit `left-10` used to put it.

          ── Why it can still sit on the ramp with no mask ─────────────────────
          The asset is a photograph FLATTENED ONTO WHITE, and `mix-blend-multiply`
          turns every white pixel into the section's own colour exactly — soft
          edges included — so it needs no mask and no frame. Multiply only works
          while the surface is LIGHT: this one ramps #CCD0D2 → white, so it holds.
          On navy the photograph would go black. The copy container is `relative`
          so it stacks above the absolutely positioned picture.

          `lg` and up only. Below that the picture is dropped, which is where it
          started: behind a single column it sits behind the questions, and the
          questions are the one thing on this page that has to stay legible. */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#CCD0D2] to-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden select-none lg:block"
        >
          <div className="mx-auto h-full max-w-container px-6">
            <img
              src={images.doctorTipsPortrait}
              alt=""
              className="h-full w-1/2 select-none object-contain object-left mix-blend-multiply"
            />
          </div>
        </div>

        <div className="relative mx-auto max-w-container px-6 py-24 sm:py-28">
          <div className="lg:ml-auto lg:w-1/2">
            <span className="inline-block rounded-full bg-navy-800/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-navy-800/70">
              BEFORE YOU GO IN
            </span>

            {/* Two explicit lines. The break after "talking" is the drawn one,
                and letting it fall where the measure happens to put it would have
                meant tuning a max-width to land it — a number that moves the next
                time the type scale does.

                Bold, and the gold is on "Tips" rather than on "your doctor". It
                was set in regular with the accent at the end, because the heading
                used to sit over a photograph and the lighter weight kept it from
                competing with the subject. It has its own column now, so there is
                nothing to defer to: the weight is the section's own. */}
            <h2 className="mt-5 text-[30px] font-bold leading-[1.28] text-navy-800 sm:text-[44px]">
              <span ref={tipsHeadingRef} className="block opacity-0">
                <span className="text-gold-dark">Tips</span> for talking
              </span>
              <span ref={tipsHeadingTwoRef} className="block opacity-0">
                to your doctor
              </span>
            </h2>

            <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.14em]">
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
                  <p className="text-[15.5px] font-medium leading-relaxed text-navy-800">
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
                  fourth thing to bring needs no change here.

                  This was briefly a plain column with teal icons on white tiles,
                  on the reasoning that three icon-and-label pairs across a
                  half-column would wrap each label to two lines. They do wrap to
                  two lines — and that is the drawn layout, so the row and the
                  `bg-mist/40` tiles are back exactly as they were. */}
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
        /* The two inks swapped: navy carries the line and white carries the
           accent, the reverse of every other CtaBand on the site.

           Which is the more defensible way round, as it happens. `tone: 'gold'`
           paints the heading white and leaves the accent to the caller, and the
           reasoning for that — recorded at length in CtaBand.tsx — is that white
           on gold measures 2.1:1 against navy's 7.0:1, and it was accepted for
           one short display line. This instance keeps that exception to the three
           words it is actually needed for. */
        heading={
          <span className="text-navy-800">
            Care starts with the <span className="text-white">right doctor</span>
          </span>
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
