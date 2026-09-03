import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { images } from '../../assets/images'

/**
 * Which surface an interior page opens on.
 *
 *   mist — the brand's pale blue-grey. Navy ink.
 *   gold — the brand gold. Navy ink, white mark.
 *   dark — the brand navy. Light ink.
 *   sky  — the pale blue. Navy ink, white mark.
 *   teal — the logo's own #0074A6. Light ink, gold mark.
 */
export type HeroTone = 'mist' | 'gold' | 'dark' | 'sky' | 'teal'

export interface HeroToneTokens {
  /**
   * The section's surface, and it is FLAT on every tone.
   *
   * It used to be a ramp from the backdrop's colour down to whatever the next
   * section was, because the backdrop was masked away across the bottom third and
   * this is what showed through. There is no mask any more (see PageHero.tsx), so
   * the backdrop covers the section corner to corner and this is only the colour
   * behind it — a fallback for the frame before the image decodes, and the colour
   * of any sliver `object-cover` cannot reach. It is set to each backdrop's own
   * field colour so that fallback is invisible rather than a flash of cream.
   */
  surface: string
  backdrop: string
  /**
   * ONE colour for the whole H1, no alpha.
   *
   * Both halves of the headline used to be tinted separately — the setup line at
   * 70-80% and the payoff at full strength — so the weight change was reinforced
   * by a tone change. The tone change is gone: the two spans still differ in
   * weight (regular, then bold) and now share this one solid value, because a
   * headline set in two strengths of the same hue reads as one line that faded
   * rather than as two.
   */
  title: string
  lede: string
  /**
   * How the mark above the headline is painted.
   *
   * `null` draws ftva-icn.svg untouched, in its own gold — right on mist, and
   * invisible on gold. Anything else is a Tailwind background utility, and the
   * artwork is used as a MASK instead: ftva-icn.svg is single-colour, so its
   * alpha channel is all a mask needs and the fill can be anything. (The same
   * trick is not available to the four-colour logo; see Logo.tsx.)
   */
  mark: string | null
  eyebrow: string
  /** Which Logo the floating nav needs while it is still transparent. */
  navLogo: 'dark' | 'light' | 'ink'
  /** Nav link ink while transparent, and its hover. */
  navInk: string
  navInkHover: string
  /** Full-strength nav ink — the current page's own link. */
  navInkStrong: string
  /** The hamburger's surface while the nav is transparent. */
  navToggle: string
  /** The nav's own "Get a Quote" button while the pill is transparent. */
  navCta: 'gold' | 'dark' | 'light'
}

/* ── One rule the five tones share ───────────────────────────────────────────
   The primary hero button is whichever of gold/navy the surface does NOT use,
   and the SECOND button is white with navy text on all of them. That pairing is
   set at the call sites rather than here (see the note on PageHero's `tone`
   prop), but it is the reason `navCta` is the only button token in this file:

     mist → gold + white      gold → navy + white      dark → gold + white
     sky  → navy + white      teal → gold + white
*/
export const HERO_TONES: Record<HeroTone, HeroToneTokens> = {
  mist: {
    surface: 'bg-mist',
    backdrop: images.heroBg,
    title: 'text-navy-800',
    lede: 'text-navy-800',
    mark: null,
    eyebrow: 'bg-navy-800/[0.08] text-navy-800/75',
    navLogo: 'dark',
    navInk: 'text-navy-800/90',
    navInkHover: 'hover:text-navy-800',
    navInkStrong: 'text-navy-800',
    navToggle: 'bg-navy-800/5 text-navy-800 hover:bg-navy-800 hover:text-white',
    navCta: 'gold',
  },

  /* Gold, and the TYPE on it is navy — which is not a preference. Gold's relative
     luminance is 0.446: navy-800 on it measures 7.0:1, white 2.1:1. A hero has a
     lede to read, so it gets the number that passes.

     The MARK is the exception, and deliberately so: it is decorative artwork
     rather than something to read, and white is what the brand wants on a
     saturated field. It has to be masked either way — ftva-icn.svg is #D6AC68 and
     the field is #DDAF69, so drawn untouched it would be a gold mark on gold. */
  gold: {
    surface: 'bg-[#DDAF69]',
    backdrop: images.heroBgGold,
    title: 'text-navy-800',
    lede: 'text-navy-800/90',
    mark: 'bg-white',
    eyebrow: 'bg-navy-800/10 text-navy-800/80',
    /* `ink`, not `dark`. The four-colour logo is 11 gold paths out of 42 — the
       whole lotus — and those go invisible on this field. The monochrome navy
       mark keeps the artwork whole; see Logo.tsx. */
    navLogo: 'ink',
    navInk: 'text-navy-800/90',
    navInkHover: 'hover:text-navy-800',
    navInkStrong: 'text-navy-800',
    navToggle: 'bg-navy-800/10 text-navy-800 hover:bg-navy-800 hover:text-white',
    /* The one tone whose nav CTA is not gold — a gold button on a gold field is
       a shape with no edges. Navy, like everything else on this surface. */
    navCta: 'dark',
  },

  dark: {
    surface: 'bg-navy-800',
    backdrop: images.heroBgDark,
    title: 'text-white',
    lede: 'text-white/80',
    mark: 'bg-white',
    eyebrow: 'bg-white/10 text-white/75',
    navLogo: 'light',
    navInk: 'text-white/85',
    navInkHover: 'hover:text-white',
    navInkStrong: 'text-white',
    navToggle: 'bg-white/10 text-white hover:bg-white hover:text-navy-800',
    navCta: 'gold',
  },

  /* Pale enough that the four-colour nav logo reads on it unchanged — all four of
     its inks are darker than #A9CEDB — so the nav keeps the brand mark as drawn.

     ── The eyebrow chip carries white, and the other four tones do not ─────────
     Every other tone tints its chip with its own INK at 8-10%, which works
     wherever ink and field are far apart. On this one they are not: navy at 8%
     over #A9CEDB lands on #9DC3D0, about a 4% step off the field, and the chip
     was invisible. White at 55% goes the other way to #D2E6EC — a comparable step
     in the opposite direction, so it reads as the same soft pill rather than as a
     harder one. */
  sky: {
    surface: 'bg-[#A9CEDB]',
    backdrop: images.heroBgSky,
    title: 'text-navy-800',
    lede: 'text-navy-800/90',
    mark: 'bg-white',
    eyebrow: 'bg-white/55 text-navy-800/85',
    navLogo: 'dark',
    navInk: 'text-navy-800/90',
    navInkHover: 'hover:text-navy-800',
    navInkStrong: 'text-navy-800',
    navToggle: 'bg-navy-800/[0.08] text-navy-800 hover:bg-navy-800 hover:text-white',
    navCta: 'gold',
  },

  /* The logo's own teal, #0074A6 — relative luminance 0.135, so white type on it
     measures 6.2:1 and the mark can be the brand gold at 3.3:1. This is the one
     tone whose mark is gold AND visible: on `mist` the artwork's own gold is used
     untouched, and on the other three the field is too close to it. */
  teal: {
    surface: 'bg-[#0074A6]',
    backdrop: images.heroBgTeal,
    title: 'text-white',
    lede: 'text-white/85',
    mark: 'bg-gold',
    eyebrow: 'bg-white/15 text-white/80',
    navLogo: 'light',
    navInk: 'text-white/85',
    navInkHover: 'hover:text-white',
    navInkStrong: 'text-white',
    navToggle: 'bg-white/10 text-white hover:bg-white hover:text-navy-800',
    navCta: 'gold',
  },
}

/* ── Why the nav has to be told, and why it is told this way ──────────────────
   The nav pill is transparent until the page scrolls 40px, so on every interior
   page the logo and the links sit directly on the hero's own surface. That was
   free while every hero was mist. It is not free now: navy-800/90 links and the
   four-colour logo are invisible on the navy hero, and the lotus disappears on
   the gold one.

   So the tone is lifted into a context. PageHero declares it on mount and clears
   it on unmount, and Navbar reads it. Two things about the ordering, both of
   which matter:

   • The provider does NOT reset on route change. React flushes every unmounting
     subtree's effect cleanups before it runs the incoming tree's effects, so the
     outgoing PageHero's `set('mist')` lands first and the incoming one's
     `set(tone)` lands second — which is the order that works. A reset in the
     provider's own route effect would run AFTER both (parent effects run last)
     and would wipe the value it had just been given.

   • A page with no PageHero at all — the homepage — therefore inherits nothing:
     the last hero to unmount already cleared the tone back to `mist`, which is
     also what a transparent nav on the homepage's own mist hero wants.

   A `data-` attribute on <html> plus a MutationObserver would do the same job
   with more moving parts and no type safety. A context is 20 lines. */
const HeroToneContext = createContext<HeroTone>('mist')
const SetHeroToneContext = createContext<(tone: HeroTone) => void>(() => {})

export function HeroToneProvider({ children }: { children: ReactNode }) {
  const [tone, setTone] = useState<HeroTone>('mist')

  return (
    <SetHeroToneContext.Provider value={setTone}>
      <HeroToneContext.Provider value={tone}>{children}</HeroToneContext.Provider>
    </SetHeroToneContext.Provider>
  )
}

/** The tone of the hero currently on the page. `mist` when there isn't one. */
export const useHeroTone = () => useContext(HeroToneContext)

/** Called by PageHero. Announces its tone for as long as it is mounted. */
export function useDeclareHeroTone(tone: HeroTone) {
  const setTone = useContext(SetHeroToneContext)

  useEffect(() => {
    setTone(tone)
    return () => setTone('mist')
  }, [tone, setTone])
}
