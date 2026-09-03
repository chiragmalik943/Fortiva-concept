import { images } from '../assets/images'

interface LogoProps {
  /**
   * Which surface the logo sits on, named after the ink it needs:
   *   'dark'  — dark ink for LIGHT surfaces (the top nav)  → logo-color.svg
   *   'light' — light ink for DARK surfaces (the footer)   → logo.svg
   *   'ink'   — monochrome navy, for a SATURATED surface   → logo.svg, masked
   */
  variant?: 'dark' | 'light' | 'ink'
  className?: string
}

/**
 * Each logo file ships in its own colours and is rendered untouched — with one
 * exception, `ink`, argued below.
 *
 * This used to be one file (logo.svg) painted navy or cream through a CSS
 * mask. A mask discards the source's fills by definition — it only reads the
 * alpha channel — so the moment the mark became four colours (#0074A6 teal,
 * #46545A grey, #D5AC67 gold, #12284B navy) that approach could no longer
 * represent it. logo-color.svg carries those fills in an internal `<style>`
 * block, which renders correctly in an `<img>` and would have been thrown away
 * by a mask.
 *
 * ── Why `ink` exists, and why it is not a step backwards ────────────────────
 * The gold hero brought back the one case a full-colour mark cannot serve: 11 of
 * logo-color.svg's 42 paths are #D5AC67, and the field behind it is #DDAF69.
 * Those paths — the whole lotus — vanish. Neither delivered file works there:
 * the colour one loses its mark, and the white one measures 2.1:1 on gold.
 *
 * So `ink` masks logo.svg, which is a SINGLE-FILL file (`fill="white"`, one
 * path). Masking a monochrome mark throws nothing away, so the objection above
 * doesn't apply to it — and the result is the whole wordmark and the whole lotus
 * in navy at 7.0:1. It is used on the gold hero and nowhere else; `dark` remains
 * the default everywhere the surface is pale enough to carry all four inks.
 */
export default function Logo({ variant = 'dark', className = '' }: LogoProps) {
  return (
    <span className={`relative inline-block ${className}`}>
      {/* Sized by WIDTH (200px floor) rather than height, because the brief
          specifies a minimum width and the height has to follow from the
          artwork. `h-auto` is what keeps the ratio honest — the <img> reads
          each file's own viewBox and derives its height from it, which matters
          more than it looks: the two files are NOT the same ratio (logo.svg is
          221x55, logo-color.svg is 730.2x171.41), so any hard-coded height
          would distort one of them.
          `min-w-[200px]` alongside the fixed width is belt-and-braces: it
          stops a flex parent from compressing the mark below the floor. */}
      {variant === 'ink' ? (
        /* A masked element has no intrinsic size to derive a height from, so
           this is the one place a height IS hard-coded — and it is logo.svg's
           own ratio at the width above, 200 x 55/221 = 49.77px, not a number
           picked to look right. The mask is `contain`, so if the file is ever
           re-exported at a different ratio the artwork letterboxes inside this
           box rather than distorting; recompute the height when that happens. */
        <span
          aria-hidden="true"
          className="block h-[49.77px] w-[200px] min-w-[200px] bg-navy-800"
          style={{
            maskImage: `url(${images.logo})`,
            WebkitMaskImage: `url(${images.logo})`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'left center',
            WebkitMaskPosition: 'left center',
          }}
        />
      ) : (
        <img
          src={variant === 'dark' ? images.logoColor : images.logo}
          alt=""
          aria-hidden="true"
          className="block h-auto w-[200px] min-w-[200px]"
        />
      )}
      <span className="sr-only">Fortiva — Health, Life, Wellness</span>
    </span>
  )
}
