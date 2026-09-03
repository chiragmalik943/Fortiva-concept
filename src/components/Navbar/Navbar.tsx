import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import Logo from '../Logo'
import Button from '../Button'
import { HERO_TONES, useHeroTone } from '../PageHero/heroTone'
import { Link, useRoute } from '../../router/router'
import { navigation } from '../../content/site'
import { lockPageScroll, unlockPageScroll } from '../../hooks/useLenis'

// How long a dropdown stays open after the pointer leaves. Without this,
// travelling diagonally from a trigger to its panel dismisses the panel
// mid-journey, which is the single most common way hover menus feel broken.
const HOVER_CLOSE_DELAY = 160

// A panel with more than this many links switches to two columns rather than
// growing into an unreadably tall list. Only "For Members" (6 links) hits it.
const TWO_COLUMN_THRESHOLD = 4

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(null)
  const route = useRoute()
  const heroTone = useHeroTone()

  const headerRef = useRef<HTMLElement>(null)
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([])
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])
  const closeTimer = useRef<number | null>(null)
  // Set when a keypress should move focus into a panel that isn't open yet.
  // Consumed by the effect below rather than a rAF: a closed panel is
  // `visibility: hidden`, and a hidden element cannot take focus, so the focus
  // call has to happen strictly after React has committed the open state.
  const pendingFocus = useRef<'first' | 'last' | null>(null)

  /* ── scroll state ─────────────────────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── hover intent ─────────────────────────────────────────────────────── */
  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  const scheduleClose = useCallback(() => {
    cancelClose()
    closeTimer.current = window.setTimeout(() => setOpenIndex(null), HOVER_CLOSE_DELAY)
  }, [cancelClose])

  useEffect(() => cancelClose, [cancelClose])

  /* ── click outside closes any open panel ──────────────────────────────── */
  useEffect(() => {
    if (openIndex === null) return
    const onPointerDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpenIndex(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [openIndex])

  /* ── mobile panel locks the page ──────────────────────────────────────── */
  useEffect(() => {
    if (!mobileOpen) return
    lockPageScroll()
    return () => unlockPageScroll()
  }, [mobileOpen])

  /* ── Escape closes whichever layer is open ────────────────────────────── */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (mobileOpen) {
        setMobileOpen(false)
      } else if (openIndex !== null) {
        triggerRefs.current[openIndex]?.focus()
        setOpenIndex(null)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen, openIndex])

  /* ── a route change dismisses whatever was open ───────────────────────── */
  useEffect(() => {
    setOpenIndex(null)
    setMobileOpen(false)
    setMobileExpanded(null)
  }, [route])

  /* ── leaving mobile widths tidies up after itself ─────────────────────── */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => {
      if (mq.matches) setMobileOpen(false)
      else setOpenIndex(null)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  /* ── keyboard: disclosure-navigation pattern ──────────────────────────── */
  const focusPanelLink = (index: number, position: number | 'first' | 'last') => {
    const panel = panelRefs.current[index]
    if (!panel) return

    // A `visibility: hidden` element cannot take focus, and the closed panel is
    // exactly that. React commits the class change that reveals it before
    // effects run, but the browser hasn't necessarily recalculated style yet —
    // so focus() would be silently ignored and the trigger would keep focus.
    // Reading a layout property forces the recalc through first.
    void panel.offsetHeight

    const links = panel.querySelectorAll<HTMLAnchorElement>('a[href]')
    if (links.length === 0) return
    const target =
      position === 'first'
        ? 0
        : position === 'last'
          ? links.length - 1
          : (position + links.length) % links.length
    links[target]?.focus()
  }

  const openAndFocus = (index: number, position: 'first' | 'last') => {
    if (openIndex === index) {
      // Already open, so no state change is coming and the effect below would
      // never fire — focus straight away.
      focusPanelLink(index, position)
      return
    }
    pendingFocus.current = position
    setOpenIndex(index)
  }

  const onTriggerKeyDown = (e: React.KeyboardEvent, index: number, hasChildren: boolean) => {
    if (!hasChildren) return
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openAndFocus(index, 'first')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      openAndFocus(index, 'last')
    }
  }

  const onPanelKeyDown = (e: React.KeyboardEvent, index: number) => {
    const links = Array.from(
      panelRefs.current[index]?.querySelectorAll<HTMLAnchorElement>('a[href]') ?? [],
    )
    const current = links.indexOf(document.activeElement as HTMLAnchorElement)

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      focusPanelLink(index, current + 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      focusPanelLink(index, current - 1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      focusPanelLink(index, 'first')
    } else if (e.key === 'End') {
      e.preventDefault()
      focusPanelLink(index, 'last')
    } else if (e.key === 'Tab') {
      // Tabbing past either end of the panel should dismiss it rather than
      // leaving an orphaned panel open behind the focus ring.
      const leaving = e.shiftKey ? current <= 0 : current >= links.length - 1
      if (leaving) setOpenIndex(null)
    }
  }

  /* ── deferred focus-into-panel, once the open state has committed ─────── */
  useEffect(() => {
    if (openIndex === null || !pendingFocus.current) return
    focusPanelLink(openIndex, pendingFocus.current)
    pendingFocus.current = null
    // focusPanelLink only reads refs, so it needs no dependency entry
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex])

  /* ── the nav commits to its solid state whenever a layer is open, so a
        panel never floats over a fully transparent bar ───────────────────── */
  const solid = scrolled || openIndex !== null || mobileOpen

  /* ── The nav's own ink, and why it is not a constant ──────────────────────
     While the pill is transparent the logo and the links sit directly on the
     hero's surface, and that surface is now one of four colours (see
     PageHero/heroTone.tsx). navy-800/90 links and the four-colour mark are
     invisible on the navy hero, and the mark's lotus disappears on the gold one.

     The moment the pill goes solid it is white again, whatever is behind it,
     so `solid` collapses straight back to the mist tokens — the ink follows the
     PILL, not the page. Which also means everything below is a plain colour swap
     on a `transition-colors`, with no state to keep in sync. */
  const t = solid ? HERO_TONES.mist : HERO_TONES[heroTone]

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:px-6"
      onMouseLeave={scheduleClose}
    >
      <div className="w-full max-w-container">
        {/* The pill grew with the logo: a 180px-wide mark is ~45px tall, so
            py-2.5 would have left it almost touching the pill's edges. py-3
            restores the optical breathing room, and the radius steps up with
            the height so the corner curvature reads the same as before. */}
        <nav
          aria-label="Main"
          className={`relative flex items-center justify-between gap-3 rounded-[28px] corner-smooth px-4 py-3 transition-all duration-500 sm:px-5 ${
            solid ? 'bg-white/70 shadow-soft backdrop-blur-[28px]' : 'bg-transparent'
          }`}
        >
          <Link href="/" aria-label="Fortiva home" className="shrink-0">
            <Logo variant={t.navLogo} />
          </Link>

          {/* ── desktop links ─────────────────────────────────────────── */}
          <ul
            className={`hidden items-center gap-7 text-[14.5px] font-medium transition-colors duration-500 lg:flex xl:gap-9 ${t.navInk}`}
          >
            {navigation.map((item, i) => {
              const hasChildren = Boolean(item.children?.length)
              const isOpen = openIndex === i
              const panelId = `nav-panel-${i}`
              const twoColumn = (item.children?.length ?? 0) > TWO_COLUMN_THRESHOLD

              return (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => {
                    cancelClose()
                    setOpenIndex(hasChildren ? i : null)
                  }}
                >
                  {hasChildren ? (
                    <button
                      ref={(el) => (triggerRefs.current[i] = el)}
                      type="button"
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      onKeyDown={(e) => onTriggerKeyDown(e, i, hasChildren)}
                      className={`flex items-center gap-1 py-1 transition-colors ${t.navInkHover}`}
                    >
                      {item.label}
                      <ChevronDown
                        size={14}
                        strokeWidth={2.25}
                        className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={route === item.href ? 'page' : undefined}
                      className={`flex items-center gap-1 py-1 transition-colors ${t.navInkHover} ${
                        route === item.href
                          ? `${t.navInkStrong} underline underline-offset-[6px] decoration-gold decoration-2`
                          : ''
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}

                  {hasChildren && (
                    <div
                      ref={(el) => (panelRefs.current[i] = el)}
                      id={panelId}
                      aria-hidden={!isOpen}
                      onKeyDown={(e) => onPanelKeyDown(e, i)}
                      // Deliberately transitions ONLY opacity and transform.
                      // `transition-all` would include `visibility`, and
                      // because visibility is a discrete property its flip
                      // lands halfway through the transition — so for ~100ms
                      // after opening, the panel is still visibility:hidden and
                      // silently refuses focus. Hiding via opacity +
                      // pointer-events + aria-hidden instead keeps the panel
                      // focusable the instant it opens, and still animates on
                      // the way out (which a visibility swap would cut short).
                      className={`absolute left-1/2 top-full z-10 mt-4 origin-top rounded-[20px] corner-smooth border border-navy-800/10 bg-white/95 p-2 shadow-soft backdrop-blur-[28px] transition-[opacity,transform] duration-200 ${
                        twoColumn ? 'w-[460px]' : 'w-[268px]'
                      } ${
                        isOpen
                          ? '-translate-x-1/2 translate-y-0 scale-100 opacity-100'
                          : 'pointer-events-none -translate-x-1/2 -translate-y-1 scale-[0.98] opacity-0'
                      }`}
                    >
                      <ul className={twoColumn ? 'grid grid-cols-2 gap-1' : 'flex flex-col gap-1'}>
                        {item.children!.map((child) => (
                          <li key={child.label}>
                            <Link
                              href={child.href}
                              tabIndex={isOpen ? 0 : -1}
                              onClick={() => setOpenIndex(null)}
                              className="block rounded-[12px] corner-smooth px-3.5 py-2.5 text-[14px] text-navy-800/75 transition-colors hover:bg-navy-800 hover:text-white"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>

          {/* ── right-hand controls ───────────────────────────────────── */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Hidden below 480px rather than the old 420px: the 180px logo
                eats the width this used to sit in. Nothing is lost — the same
                CTA is pinned to the bottom of the mobile drawer. */}
            <Button
              variant={t.navCta}
              icon="arrow"
              href="/contact"
              className="!py-1.5 !text-[14px] max-[479px]:!hidden"
            >
              Get a Quote
            </Button>

            <button
              type="button"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((v) => !v)}
              className={`flex h-10 w-10 items-center justify-center rounded-[14px] corner-smooth transition-colors duration-500 lg:hidden ${t.navToggle}`}
            >
              {mobileOpen ? <X size={19} strokeWidth={2.25} /> : <Menu size={19} strokeWidth={2.25} />}
            </button>
          </div>
        </nav>

        {/* ── mobile panel ───────────────────────────────────────────── */}
        <div
          id="mobile-nav"
          data-lenis-prevent
          className={`mt-3 origin-top overflow-y-auto rounded-[24px] corner-smooth border border-navy-800/10 bg-white/95 shadow-soft backdrop-blur-[28px] transition-all duration-300 lg:hidden ${
            mobileOpen
              ? 'max-h-[calc(100vh-7.5rem)] scale-100 opacity-100'
              : 'pointer-events-none max-h-0 scale-[0.98] border-transparent opacity-0'
          }`}
        >
          <ul className="flex flex-col p-3">
            {navigation.map((item, i) => {
              const hasChildren = Boolean(item.children?.length)
              const isExpanded = mobileExpanded === i

              return (
                <li key={item.label} className="border-b border-navy-800/5 last:border-b-0">
                  {hasChildren ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        tabIndex={mobileOpen ? 0 : -1}
                        onClick={() => setMobileExpanded(isExpanded ? null : i)}
                        className="flex w-full items-center justify-between gap-4 px-3 py-4 text-left text-[15.5px] font-medium text-navy-800"
                      >
                        {item.label}
                        <ChevronDown
                          size={17}
                          strokeWidth={2.25}
                          className={`shrink-0 text-navy-800/50 transition-transform duration-300 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`grid transition-all duration-300 ${
                          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <ul className="overflow-hidden">
                          {item.children!.map((child) => (
                            <li key={child.label}>
                              <Link
                                href={child.href}
                                tabIndex={mobileOpen && isExpanded ? 0 : -1}
                                onClick={() => setMobileOpen(false)}
                                className="block rounded-[12px] corner-smooth px-3 py-3 pl-6 text-[14.5px] text-navy-800/70 transition-colors hover:bg-navy-800/5"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                          <li aria-hidden="true" className="h-2" />
                        </ul>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      tabIndex={mobileOpen ? 0 : -1}
                      aria-current={route === item.href ? 'page' : undefined}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-4 text-[15.5px] font-medium text-navy-800"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="border-t border-navy-800/5 p-4">
            <Button
              variant="gold"
              icon="arrow"
              href="/contact"
              className="w-full justify-between"
              onClick={() => setMobileOpen(false)}
            >
              Get a Quote
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
