import { images } from '../assets/images'

interface LogoProps {
  /**
   * Which surface the logo sits on, named after the ink it needs:
   *   'dark'  — dark ink for LIGHT surfaces (the top nav) → logo-color.svg
   *   'light' — light ink for DARK surfaces (the footer)  → logo.svg
   */
  variant?: 'dark' | 'light'
  className?: string
}

/**
 * Each logo file ships in its own colours and is rendered untouched.
 *
 * This used to be one file (logo.svg) painted navy or cream through a CSS
 * mask. A mask discards the source's fills by definition — it only reads the
 * alpha channel — so the moment the mark became four colours (#0074A6 teal,
 * #46545A grey, #D5AC67 gold, #12284B navy) that approach could no longer
 * represent it. logo-color.svg carries those fills in an internal `<style>`
 * block, which renders correctly in an `<img>` and would have been thrown away
 * by a mask.
 *
 * So there is no colour in this component at all now, and none should be added:
 * to change how the logo looks on either surface, edit the SVG.
 */
export default function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const src = variant === 'dark' ? images.logoColor : images.logo

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
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="block h-auto w-[200px] min-w-[200px]"
      />
      <span className="sr-only">Fortiva — Health, Life, Wellness</span>
    </span>
  )
}
