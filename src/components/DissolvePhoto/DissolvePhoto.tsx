interface DissolvePhotoProps {
  src: string
  /** 'cover' fills the box and crops; 'contain' fits the whole image inside it. */
  fit?: 'cover' | 'contain'
  /** `object-position`, as a Tailwind arbitrary value. */
  position?: string
  /**
   * Which edges dissolve into the page.
   *
   *  'all'    — top, bottom and both sides. For a rectangular photograph.
   *  'bottom' — the foot of the frame only. For a transparent cutout, which has
   *             no side or top edges to hide; fading its top would ghost the
   *             subject's head.
   *  'none'   — none. For an asset that already carries its own dissolve, which
   *             every Fortiva photograph now does.
   */
  edges?: 'all' | 'bottom' | 'none'
  /**
   * Set `'right'` when the box runs off the right edge of the viewport. That edge
   * then keeps its photograph instead of dissolving: a fade there would stop the
   * picture ~100px short of the window and read as a mistake rather than as a
   * dissolve. Only meaningful with `edges: 'all'`.
   */
  bleed?: 'none' | 'right'
  /**
   * Multiply the photograph into the surface behind it, which is how a photo
   * FLATTENED ONTO WHITE sits on a coloured background without showing its white.
   *
   * Multiply leaves white alone — white x anything is that anything — so every
   * pixel the retoucher faded to white takes the section's own colour exactly,
   * including the soft edges a mask could only approximate. The photograph itself
   * darkens by however dark the background is, which on the light end of this
   * palette is a few percent.
   *
   * Only for white-flattened assets on a non-white surface. On white it is an
   * identity operation (harmless but pointless), and on a dark surface it would
   * black the photograph out.
   */
  blend?: boolean
  className?: string
}

/**
 * A photograph that dissolves into whatever surface it sits on.
 *
 * == The dissolve is a mask, not a scrim ====================================
 * The obvious way to fade a photo into a page is a gradient overlay in the
 * page's colour. That only works while you know the colour, and the two sections
 * using this sit on different ones - white, and a cream-to-blue ramp. A white
 * overlay on the ramp reads as a pale smear across it. `mask-image` has no colour
 * in it at all: it removes the photograph and lets the section's own background
 * through, whatever that background is. One component, any surface, no colour
 * prop.
 *
 * Two linear ramps, intersected, rather than one elliptical vignette. A
 * `radial-gradient` sized to fall off inside the box has to be expressed in
 * percentages of the box, and the boxes here have different aspect ratios - the
 * same ellipse that dissolved one edge left the other solid. Two axis-aligned
 * ramps land where they say they land at any aspect ratio. `mask-composite:
 * intersect` is the standard spelling, `-webkit-mask-composite: source-in` the
 * WebKit one; both are set because Safari still reads the prefixed pair.
 *
 * == There is no mark drawn here any more ===================================
 * This used to paint the Fortiva lotus over every photograph it rendered, because
 * the layouts were drawn with the mark washed across the subject and there were
 * no photographs yet to carry it. The delivered assets have the mark composited
 * in - correctly, with each petal's own alpha, so the overlaps double up the way
 * the artwork intends and a single `<img>` at one opacity never could. Drawing a
 * second one on top would have put two lotuses on every photo.
 *
 * == The photograph is decorative ===========================================
 * `alt=""` and `aria-hidden`. Neither section's meaning is in its picture - the
 * heading, the cards and the list say all of it - and a photograph that sits
 * behind and beside copy as atmosphere is exactly what an empty alt is for.
 */
export default function DissolvePhoto({
  src,
  fit = 'cover',
  position = 'object-center',
  edges = 'all',
  bleed = 'none',
  blend = false,
  className = '',
}: DissolvePhotoProps) {
  const mask =
    edges === 'none'
      ? undefined
      : edges === 'bottom'
        ? CUTOUT_FADE
        : [VERTICAL_FADE, bleed === 'right' ? BLEED_RIGHT_FADE : HORIZONTAL_FADE].join(', ')

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className={`h-full w-full select-none ${
          fit === 'contain' ? 'object-contain' : 'object-cover'
        } ${position} ${blend ? 'mix-blend-multiply' : ''}`}
        style={
          mask
            ? {
                maskImage: mask,
                WebkitMaskImage: mask,
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in',
              }
            : undefined
        }
      />
    </div>
  )
}

/** Soft at the top, solid through the middle, gone at the foot of the frame. */
const VERTICAL_FADE = 'linear-gradient(180deg, transparent 0%, #000 11%, #000 72%, transparent 100%)'

/** Both sides dissolve - for a photograph sitting inside the page. */
const HORIZONTAL_FADE =
  'linear-gradient(90deg, transparent 0%, #000 16%, #000 84%, transparent 100%)'

/** Leading edge dissolves, trailing edge keeps its picture to the window. */
const BLEED_RIGHT_FADE = 'linear-gradient(90deg, transparent 0%, #000 18%, #000 100%)'

/**
 * A cutout only needs its feet taken off, and these stops are set against the
 * PICTURE rather than against the section — which is only true because the one
 * caller gives its box the asset's own aspect ratio, so `contain` fills it
 * exactly. (Give a `contain` image a box of a different shape and the mask's
 * percentages measure the box while the picture floats inside it, and the fade
 * lands somewhere other than where it reads.)
 *
 * Transparent by 90% because the delivered cutout's subjects stop dead at about
 * 85% of its height — the artwork has no taper of its own, so the whole dissolve
 * is here.
 */
const CUTOUT_FADE = 'linear-gradient(180deg, #000 0%, #000 62%, transparent 90%)'
