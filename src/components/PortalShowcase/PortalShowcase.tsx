import { ReactNode } from 'react'
import { type LucideIcon } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useScrollSpyIndex } from '../../hooks/useScrollSpyIndex'
import { useSplitReveal } from '../../hooks/useSplitReveal'

export interface PortalItem {
  title: string
  body: string
  icon: LucideIcon
  /**
   * The screenshot this section shows in the window's content area. Comes from
   * `images.portalScreens` — see assets/images.ts, which is the only place a
   * filename appears, and which carries the export note for the aperture.
   */
  screen: string
}

interface PortalShowcaseProps {
  eyebrow?: string
  heading: ReactNode
  intro?: ReactNode
  items: PortalItem[]
  /** Rendered under the intro, inside the centred column. */
  action?: ReactNode
  /**
   * One image of the whole portal — chrome, sidebar and content together — for
   * the mobile layout, which shows a picture and a list instead of a window with
   * a moving part.
   */
  overview: string
}

/**
 * The portal, drawn as the portal: a browser window with the six things the copy
 * doc lists down its sidebar, and a content area that changes as you read.
 *
 * == Scrolled, not clicked ==================================================
 * This section used to be the one interactive set-piece on the For Members pages
 * that wasn't driven by scroll position — you picked a sidebar item and the panel
 * beside it changed. The argument was that choosing is what a portal IS, so a
 * section that makes the visitor choose says it better than a paragraph does.
 *
 * It is scroll-driven now, matching the app showcase on the sibling page, and the
 * reason is worth keeping: a click target that looks exactly like a real portal
 * nav sets an expectation the page cannot meet — six items that respond to a
 * click, in a window with a working URL bar, invite the visitor to try to USE the
 * thing. The scroll version shows the same six screens without pretending to be
 * the application. The two pages now also behave the same way, which is what the
 * pair was always meant to do.
 *
 * `useScrollSpyIndex` is shared with PhoneShowcase and ScrollSpyList: pinned, the
 * section holds still while the scroll walks the index; unpinned — a window too
 * short to hold the section — the index comes from the section's own passage
 * through the viewport.
 *
 * == The window is one fixed rectangle ======================================
 * It has an aspect ratio and nothing inside it can change that. This matters more
 * than it sounds: the previous version drew a different abstract panel per
 * section — a table, a form, a chat thread — and each one was a different height,
 * so the whole window grew and shrank as you moved down the list. A browser window
 * that resizes itself while you read is the one thing a browser window never does,
 * and it made the section feel unstable in a way that was hard to name.
 *
 * So: `aspect-[16/10]`, sized by height while pinned (the same technique the
 * phone uses — the room the section has left, with the ratio giving the width) and
 * by width when it isn't. The screens inside are absolutely positioned and
 * cross-fade; none of them can push on the frame.
 *
 * == What is centred, and why the copy sits under the window ================
 * Heading block centred above, window centred below. That is a change from the
 * left-aligned column this had, and it follows from the window being SMALLER: a
 * ~700px window left-aligned in a 1360px container puts half the section's width
 * on the right doing nothing.
 *
 * The active section's own sentence goes UNDER the window rather than inside it.
 * There is nowhere in a fixed-size window for a line of copy that changes length
 * — the content area is a screenshot and the sidebar is a nav — and the sentences
 * are the client's own words, so dropping them was not an option. The slot has a
 * reserved height so a one-line and a two-line sentence don't move the disclaimer
 * under it.
 *
 * == Mobile is a picture and a list ========================================
 * Below `lg` the window, its sidebar and the tracking are all gone, replaced by
 * one image of the whole portal and the six sections written out underneath. The
 * tracking would not have run down there anyway (`useScrollSpyIndex` doesn't
 * track under `lg`), which would have left a window with all six items lit and
 * one screen showing — a set-piece with its mechanism switched off. A picture and
 * a list is an honest version of the same information.
 */
export default function PortalShowcase({
  eyebrow,
  heading,
  intro,
  items,
  action,
  overview,
}: PortalShowcaseProps) {
  const { scopeRef, active, tracking } = useScrollSpyIndex(items.length)

  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const introRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.12 })
  const windowRef = useScrollReveal<HTMLDivElement>({ y: 40, scale: 0.97, delay: 0.1 })

  const current = items[active] ?? items[0]

  return (
    /* `pin:` = wide and tall enough for the section to pin itself to the viewport
       (animations/pinnedSequence.ts owns the query, and useScrollSpyIndex reads
       the same one). `pin:pt-24` rather than symmetric padding, because the nav
       pill floats over the page and centring in the full viewport tucks the
       eyebrow underneath it. All of it is inert on a window too short to pin. */
    <section
      ref={scopeRef}
      className="bg-cream-soft px-6 py-24 sm:py-28 pin:flex pin:h-screen pin:items-center pin:pb-10 pin:pt-24"
    >
      <div className="mx-auto w-full max-w-container">
        {/* ── the centred copy block ──────────────────────────────────────── */}
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow && (
            <span className="inline-block rounded-full bg-navy-800/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-navy-800/70">
              {eyebrow}
            </span>
          )}
          <h2
            ref={headingRef}
            className={`text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px] pin:text-[32px] ${
              eyebrow ? 'mt-5 pin:mt-4' : ''
            }`}
          >
            {heading}
          </h2>
          {(intro || action) && (
            <div ref={introRef} className="opacity-0">
              {intro && (
                <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-navy-800/65 sm:text-[17px] pin:mt-3 pin:text-[15.5px]">
                  {intro}
                </p>
              )}
              {action && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 pin:mt-5">
                  {action}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── the window: `lg` and up ─────────────────────────────────────── */}
        <div
          ref={windowRef}
          className="mt-12 hidden opacity-0 lg:block pin:mt-7"
        >
          <div className="corner-smooth mx-auto flex aspect-[16/9] w-full max-w-[820px] flex-col overflow-hidden rounded-card border border-navy-800/8 bg-white shadow-card-soft pin:h-[40vh] pin:max-h-[440px] pin:w-auto pin:max-w-full">
            {/* ── window chrome ────────────────────────────────────────────
                A real address bar on a window nobody can click is a small lie
                worth keeping: it is what tells you at a glance that the thing
                below is a website rather than an app or a diagram. */}
            <div className="flex shrink-0 items-center gap-4 border-b border-navy-800/8 bg-cream-soft/70 px-5 py-3">
              <span aria-hidden="true" className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-navy-800/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-navy-800/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-navy-800/15" />
              </span>
              <span className="corner-smooth flex-1 truncate rounded-[10px] bg-white px-3.5 py-1 text-[12px] text-navy-800/45">
                fortiva.com/members/portal
              </span>
            </div>

            <div className="flex min-h-0 flex-1">
              {/* ── sidebar ──────────────────────────────────────────────────
                  An `<ol>` of six labels, not six buttons. The list is the
                  section's index, and the scroll is what moves it — see the
                  docblock on why this stopped being clickable.

                  ── Six rows that divide the height, not six rows that add up ──
                  `flex-1` on every item, so they share whatever height the window
                  has and the sidebar can never be taller than it. That is not
                  tidiness: sized by their own content the six items measured
                  ~300px (three of the labels wrap to two lines), which fit the
                  360px window a 900px viewport gives and did NOT fit the 304px one
                  at 760px — the last two items were simply cut off by the window's
                  overflow, and on a viewport where the sixth was the active one
                  there was no visible highlight at all.

                  Dividing the height also happens to be what a real portal nav
                  looks like, and `overflow-hidden` on each row means a very short
                  window crops a label rather than bursting the frame. */}
              <ol className="flex w-[200px] shrink-0 flex-col gap-1 border-r border-navy-800/8 p-2.5 xl:w-[228px] xl:p-3">
                {items.map((item, i) => {
                  const Icon = item.icon
                  /* Exactly one item lit, always — including when nothing is
                     tracking, where `active` stays 0. Lighting all six (which is
                     what the sibling rail does when it isn't tracking) would have
                     contradicted the window beside it: the content area can only
                     ever show one screen. Un-lit items are held at 70% rather than
                     dimmed out, so the sidebar reads as a nav with one section
                     selected rather than as five disabled buttons. */
                  const on = i === active
                  return (
                    <li
                      key={item.title}
                      aria-current={on && tracking ? 'true' : undefined}
                      className={`corner-smooth flex min-h-0 flex-1 items-center gap-2.5 overflow-hidden rounded-[10px] px-2.5 text-[12.5px] font-medium leading-snug transition-colors duration-500 ease-out xl:px-3 xl:text-[13px] ${
                        on ? 'bg-navy-800 text-cream-soft' : 'text-navy-800/70'
                      }`}
                    >
                      <Icon
                        size={16}
                        strokeWidth={1.9}
                        className={`shrink-0 transition-colors duration-500 ${
                          on ? 'text-gold' : 'text-navy-800/35'
                        }`}
                      />
                      <span>{item.title}</span>
                    </li>
                  )
                })}
              </ol>

              {/* ── content area ────────────────────────────────────────────
                  Every screen is rendered and they cross-fade, so switching is a
                  dissolve rather than a pop and nothing inside can resize the
                  frame. Navy underneath, so a screenshot that hasn't loaded reads
                  as a dark display rather than as a hole in the page. */}
              <div className="relative min-w-0 flex-1 bg-navy-900">
                {items.map((item, i) => (
                  <img
                    key={item.title}
                    src={item.screen}
                    alt={`The Fortiva Member Portal: ${item.title.toLowerCase()}`}
                    aria-hidden={i !== active}
                    /* The first screen is what everyone sees; the rest are only
                       needed once someone starts scrolling. */
                    loading={i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    draggable={false}
                    /* `object-left-top`: the aperture is a little squarer than a
                       3:2 capture, so something has to go. Cropping the right and
                       bottom edges of a UI screenshot reads as a window revealing
                       part of a page; cropping it symmetrically (which plain
                       `object-cover` does) slices the left edge off the sidebar-side
                       of the content and looks broken. */
                    className={`absolute inset-0 h-full w-full select-none object-cover object-left-top transition-opacity duration-500 ease-out ${
                      i === active ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* The active section's own sentence, and the standing disclaimer. The
              reserved height is what stops a two-line sentence shunting the
              disclaimer down as you scroll. */}
          <div className="mx-auto mt-7 max-w-xl text-center pin:mt-5">
            <p
              key={current.title}
              className="min-h-[3rem] animate-[fadeUp_400ms_ease-out] text-[15.5px] leading-relaxed text-navy-800/70 sm:min-h-[2.5rem]"
            >
              {current.body}
            </p>
            <p className="text-[12.5px] leading-relaxed text-navy-800/40">{DISCLAIMER}</p>
          </div>
        </div>

        {/* ── mobile: a picture and a list ────────────────────────────────── */}
        <div className="mt-12 lg:hidden">
          <div className="corner-smooth overflow-hidden rounded-card border border-navy-800/8 bg-navy-900 shadow-card-soft">
            <img
              src={overview}
              alt="The Fortiva Member Portal"
              draggable={false}
              className="block h-auto w-full select-none"
            />
          </div>
          <p className="mt-4 text-center text-[12.5px] leading-relaxed text-navy-800/40">
            {DISCLAIMER}
          </p>

          <ol className="mt-9 flex flex-col">
            {items.map((item, i) => {
              const Icon = item.icon
              return (
                <li key={item.title} className="flex gap-4 border-t border-navy-800/10 py-5 last:border-b">
                  <span className="corner-smooth mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-navy-800/5">
                    <Icon size={17} strokeWidth={1.9} className="text-gold-dark" />
                  </span>
                  <div>
                    <h3 className="text-[16.5px] font-semibold leading-snug text-navy-800">
                      <span className="mr-2 text-[13px] font-semibold tabular-nums text-gold-dark">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[14.5px] leading-relaxed text-navy-800/65">
                      {item.body}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

/**
 * Said in both layouts, because both of them draw a convincing-looking
 * application and neither one is the real thing. Kept as one constant so the two
 * copies cannot drift into saying different things.
 */
const DISCLAIMER =
  'Shown for representational purposes. The live Member Portal may differ in appearance.'
