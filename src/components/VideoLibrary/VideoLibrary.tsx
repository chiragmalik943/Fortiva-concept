import {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { Clock, Play, X, type LucideIcon } from 'lucide-react'
import { gsap, prefersReducedMotion, ScrollTrigger } from '../../animations/gsap'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'
import Button from '../Button'

export interface VideoItem {
  /** Stable key, and the anchor for the panel's aria wiring. */
  id: string
  title: string
  /** One line, on the card. */
  blurb: string
  /** The longer version, in the detail row. */
  description: string
  /** Small label above the title — the shelf this video sits on. */
  category: string
  /** Authored, as `m:ss`. */
  duration: string
  tags: string[]
  /** Playable source for the <video> element. */
  src: string
  icon: LucideIcon
  /** Optional follow-on link in the detail row. */
  cta?: { label: string; href: string }
}

interface VideoLibraryProps {
  eyebrow?: string
  heading: ReactNode
  intro?: ReactNode
  videos: VideoItem[]
  /** Anchor id for the section, so the nav can link straight to it. */
  id?: string
  /** Background utility for the section. Defaults to white. */
  className?: string
}

/**
 * A grid of videos where the selected one opens IN PLACE — a full-width row
 * that slides in directly beneath the row the card sits in, player on the left
 * and everything written about the video on the right. The card that is playing
 * stays in the grid, ringed in gold and badged "Now playing", so the thing you
 * clicked never scrolls out of the story.
 *
 * ── Why the panel is placed by row, and how ─────────────────────────────────
 * "Under the video row" is the whole point of the interaction: a panel pinned
 * to the bottom of the grid separates the player from the card by up to two
 * rows of thumbnails, and the visitor loses track of what they clicked. So the
 * panel is inserted after the LAST CARD OF THE SELECTED CARD'S ROW and spans
 * every column.
 *
 * That index cannot be derived from CSS — it depends on how many columns the
 * grid currently has, which is a breakpoint fact the DOM knows and JS does not.
 * Hence `cols`, tracked off the same two media queries the grid's own
 * `sm:`/`lg:` prefixes compile to. Get this wrong and the panel appears mid-row,
 * which in a `grid` silently pushes a card into the next row. The queries are
 * the source of truth for both, so they can't drift apart.
 *
 * `cols` starts at 3 and is corrected on mount. Nothing is open on first paint,
 * so there is no wrong-place flash to see — the value is only ever read after a
 * click.
 *
 * ── Opening and switching are different animations ──────────────────────────
 * Opening from closed animates height 0 → auto, because the row genuinely isn't
 * there yet and the surrounding grid has to make space for it. Switching from
 * one video to another while the panel is already open does NOT: the panel is
 * already the right size, so collapsing it to zero and re-expanding would be a
 * flinch. The contents cross-fade instead, and the panel only moves if the new
 * card is in a different row. `wasOpen` is what tells the two apart.
 *
 * Closing has to animate before React unmounts the element, so the collapse
 * runs first and clears the selection in its `onComplete`.
 *
 * Every one of those paths ends in `ScrollTrigger.refresh()`. Inserting or
 * removing a row changes the height of the document, which invalidates the
 * start/end offsets of every scroll animation below this section — the two
 * cards and the link hub underneath would otherwise reveal at the wrong moment
 * (or, if the panel opened past them, never).
 */

/** Thumbnail washes, cycled. Abstract by design — see the note in the card. */
const WASHES = [
  'from-navy-600 via-navy-800 to-navy-900',
  'from-navy-800 via-navy-600 to-navy-900',
  'from-navy-700 via-navy-800 to-navy-600',
]

export default function VideoLibrary({
  eyebrow,
  heading,
  intro,
  videos,
  id,
  className = 'bg-white',
}: VideoLibraryProps) {
  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const introRef = useScrollReveal<HTMLParagraphElement>({ y: 20, delay: 0.1 })

  const [openId, setOpenId] = useState<string | null>(null)
  const [cols, setCols] = useState(3)

  const panelRef = useRef<HTMLDivElement>(null)
  const panelBodyRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const wasOpen = useRef(false)

  // Mirrors the grid's own `sm:grid-cols-2 lg:grid-cols-3`. Both must change
  // together — see the docblock.
  useEffect(() => {
    const twoUp = window.matchMedia('(min-width: 640px)')
    const threeUp = window.matchMedia('(min-width: 1024px)')
    const read = () => setCols(threeUp.matches ? 3 : twoUp.matches ? 2 : 1)

    read()
    twoUp.addEventListener('change', read)
    threeUp.addEventListener('change', read)
    return () => {
      twoUp.removeEventListener('change', read)
      threeUp.removeEventListener('change', read)
    }
  }, [])

  const openIndex = openId ? videos.findIndex((v) => v.id === openId) : -1
  const openVideo = openIndex >= 0 ? videos[openIndex] : null

  // Last card of the open card's row, clamped for a ragged final row.
  const insertAfter =
    openIndex < 0
      ? -1
      : Math.min(videos.length - 1, Math.floor(openIndex / cols) * cols + cols - 1)

  const close = useCallback(() => {
    const panel = panelRef.current
    if (!panel || prefersReducedMotion) {
      setOpenId(null)
      wasOpen.current = false
      ScrollTrigger.refresh()
      return
    }

    gsap.to(panel, {
      height: 0,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      overwrite: true,
      onStart: () => gsap.set(panel, { overflow: 'hidden' }),
      onComplete: () => {
        wasOpen.current = false
        setOpenId(null)
        ScrollTrigger.refresh()
      },
    })
  }, [])

  const toggle = useCallback(
    (nextId: string) => {
      if (openId === nextId) close()
      else setOpenId(nextId)
    },
    [close, openId],
  )

  useLayoutEffect(() => {
    const panel = panelRef.current
    if (!panel || !openId) return

    // The click that opened this is still inside the user-activation window, so
    // a play() here is usually allowed. `catch` because "usually" is the
    // strongest promise any browser makes about it, and a blocked autoplay is
    // not an error worth surfacing — the controls are right there.
    videoRef.current?.play().catch(() => {})

    if (prefersReducedMotion) {
      wasOpen.current = true
      ScrollTrigger.refresh()
      return
    }

    if (wasOpen.current) {
      gsap.fromTo(
        panelBodyRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
      )
      ScrollTrigger.refresh()
    } else {
      gsap.fromTo(
        panel,
        { height: 0, opacity: 0, overflow: 'hidden' },
        {
          height: 'auto',
          opacity: 1,
          duration: 0.55,
          ease: 'power2.out',
          clearProps: 'height,opacity,overflow',
          onComplete: () => ScrollTrigger.refresh(),
        },
      )
    }

    wasOpen.current = true
  }, [openId])

  return (
    <section id={id} className={`scroll-mt-32 px-6 py-24 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-container">
        {eyebrow && (
          <span className="inline-block rounded-full bg-navy-800/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-navy-800/70">
            {eyebrow}
          </span>
        )}
        <h2
          ref={headingRef}
          className={`max-w-2xl text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px] ${
            eyebrow ? 'mt-5' : ''
          }`}
        >
          {heading}
        </h2>
        {intro && (
          <p
            ref={introRef}
            className="mt-6 max-w-xl text-[16px] leading-relaxed text-navy-800/65 opacity-0 sm:text-[17px]"
          >
            {intro}
          </p>
        )}

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, i) => (
            <Fragment key={video.id}>
              <VideoCard
                video={video}
                index={i}
                isOpen={video.id === openId}
                panelId={`video-panel-${video.id}`}
                onToggle={toggle}
              />

              {i === insertAfter && openVideo && (
                <div
                  ref={panelRef}
                  id={`video-panel-${openVideo.id}`}
                  role="region"
                  aria-label={`${openVideo.title} — now playing`}
                  className="col-span-full"
                >
                  <div
                    ref={panelBodyRef}
                    className="corner-smooth overflow-hidden rounded-card bg-navy-800 shadow-card"
                  >
                    <div className="grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                      <div className="relative aspect-[16/9] w-full bg-navy-900">
                        <video
                          key={openVideo.id}
                          ref={videoRef}
                          src={openVideo.src}
                          controls
                          playsInline
                          preload="metadata"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>

                      <div className="relative flex flex-col p-7 sm:p-9">
                        <button
                          type="button"
                          onClick={close}
                          aria-label="Close video"
                          className="corner-smooth absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-[12px] bg-white/10 text-white/70 transition-colors duration-300 hover:bg-white/20 hover:text-white"
                        >
                          <X size={16} strokeWidth={2.25} />
                        </button>

                        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
                          {openVideo.category}
                        </span>
                        <h3 className="mt-4 max-w-sm pr-10 text-[22px] font-semibold leading-snug text-white sm:text-[26px]">
                          {openVideo.title}
                        </h3>
                        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
                          {openVideo.description}
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-2">
                          <span className="corner-smooth flex items-center gap-1.5 rounded-[12px] bg-white/10 px-3 py-1.5 text-[12.5px] font-semibold tabular-nums text-white/80">
                            <Clock size={13} strokeWidth={2.25} />
                            {openVideo.duration}
                          </span>
                          {openVideo.tags.map((tag) => (
                            <span
                              key={tag}
                              className="corner-smooth rounded-[12px] border border-white/15 px-3 py-1.5 text-[12.5px] font-medium text-white/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {openVideo.cta && (
                          <div className="mt-auto pt-8">
                            <Button variant="light" icon="arrow" href={openVideo.cta.href}>
                              {openVideo.cta.label}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * One thumbnail. The reveal lives on a WRAPPER rather than on the button
 * itself: `useScrollReveal` finishes by writing an inline `transform`, and an
 * inline transform beats Tailwind's `hover:-translate-y-*` class, so a card
 * that animates in can't also lift on hover unless the two live on different
 * elements.
 *
 * The artwork is a gradient, two blurred washes and the video's own glyph — not
 * a photograph and not a frame grab. Every image in this build is a real
 * commissioned asset used exactly once (see assets/images.ts), and there are no
 * real stills for these videos, so an abstract plate is the honest thumbnail:
 * it reads as "video" without pretending to be footage.
 */
function VideoCard({
  video,
  index,
  isOpen,
  panelId,
  onToggle,
}: {
  video: VideoItem
  index: number
  isOpen: boolean
  panelId: string
  onToggle: (id: string) => void
}) {
  const ref = useScrollReveal<HTMLDivElement>({ y: 28, delay: (index % 3) * 0.07 })
  const Icon = video.icon

  return (
    <div ref={ref} className="flex opacity-0">
      <button
        type="button"
        onClick={() => onToggle(video.id)}
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        className={`corner-smooth group flex h-full w-full flex-col overflow-hidden rounded-card text-left transition-all duration-300 ease-out ${
          isOpen
            ? 'bg-white shadow-card ring-2 ring-gold'
            : 'bg-white ring-1 ring-navy-800/[0.08] shadow-card-soft hover:-translate-y-1 hover:shadow-card'
        }`}
      >
        <span className="relative block aspect-[16/9] w-full overflow-hidden">
          <span
            className={`absolute inset-0 bg-gradient-to-br ${WASHES[index % WASHES.length]}`}
          />
          <span className="absolute -left-10 top-1/4 h-40 w-40 rounded-full bg-gold/15 blur-2xl" />
          <span className="absolute -bottom-10 -right-8 h-36 w-36 rounded-full bg-mist/15 blur-2xl" />

          {isOpen ? (
            <span className="absolute left-4 top-4 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-navy-800">
              Now playing
            </span>
          ) : (
            <Icon
              size={30}
              strokeWidth={1.4}
              className="absolute left-5 top-5 text-white/25 transition-colors duration-300 group-hover:text-white/40"
            />
          )}

          <span
            className={`absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-300 ${
              isOpen
                ? 'bg-gold'
                : 'bg-white/90 group-hover:scale-110 group-hover:bg-white'
            }`}
          >
            <Play size={17} fill="currentColor" strokeWidth={0} className="ml-0.5 text-navy-800" />
          </span>

          <span className="absolute bottom-3 right-3 rounded-full bg-navy-900/70 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-white/90">
            {video.duration}
          </span>
        </span>

        <span className="flex flex-1 flex-col p-5 sm:p-6">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-navy-800/45">
            {video.category}
          </span>
          <span className="mt-2.5 text-[16.5px] font-semibold leading-snug text-navy-800">
            {video.title}
          </span>
          <span className="mt-2 text-[13.5px] leading-relaxed text-navy-800/60">{video.blurb}</span>
        </span>
      </button>
    </div>
  )
}
