import { images } from '../assets/images'

interface LogoProps {
  variant?: 'dark' | 'light'
  className?: string
}

// logo.svg already contains the wordmark + tagline, so this component only
// ever renders that one file — no "FORTIVA" text or tagline is coded here.
export default function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const ink = variant === 'dark' ? '#11284B' : '#F3F5EE'

  return (
    <span className={`relative inline-block ${className}`}>
      {/* invisible <img> establishes the correct box from the file's own
          intrinsic aspect ratio (so we never have to hard-code a guess at
          it); the visible mark is a same-size, absolutely-positioned mask so
          it can be tinted navy or white.

          Sized by WIDTH (180px floor) rather than height, because the brief
          specifies a minimum width and the height has to follow from the
          artwork. `h-auto` is what keeps the ratio honest — the <img> reads
          logo.svg's own 221x55 viewBox and derives ~45px of height from it, so
          re-exporting the logo at a different ratio needs no code change here.
          `min-w-[180px]` alongside the fixed width is belt-and-braces: it
          stops a flex parent from compressing the mark below the floor. */}
      <img
        src={images.logo}
        alt=""
        aria-hidden="true"
        className="invisible h-auto w-[180px] min-w-[180px]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundColor: ink,
          maskImage: `url(${images.logo})`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskImage: `url(${images.logo})`,
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
        }}
      />
      <span className="sr-only">Fortiva — Health, Life, Wellness</span>
    </span>
  )
}
