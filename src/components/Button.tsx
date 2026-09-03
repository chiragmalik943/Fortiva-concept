import { ReactNode, MouseEventHandler } from 'react'
import { ArrowRight, ArrowUpRight, Plus } from 'lucide-react'
import { Link, isInternalHref } from '../router/router'

interface ButtonProps {
  children: ReactNode
  variant?: 'light' | 'white' | 'gold' | 'dark' | 'ghost'
  icon?: 'arrow' | 'arrowUpRight' | 'plus' | 'none'
  /** 'lg' is the 56px hero size; everywhere else uses the default. */
  size?: 'default' | 'lg'
  /** When set, renders an <a> instead of a <button> — same styling either way. */
  href?: string
  /** Only meaningful alongside `href`. */
  target?: string
  type?: 'button' | 'submit'
  className?: string
  onClick?: MouseEventHandler<HTMLElement>
  /** Native tooltip. Used by ActionButton to explain a not-yet-live link. */
  title?: string
}

const iconMap = { arrow: ArrowRight, arrowUpRight: ArrowUpRight, plus: Plus }

// "primary" style variants: on hover the button flips to a navy fill with
// white text, and the icon swaps to the leading edge and rotates -45deg.
//
// `dark` is in here even though it is ALREADY navy, so the fill half of that flip
// is a no-op on it. The rest of the flip is not: the badge goes white → gold and
// the icon crosses to the leading edge, which is the same gesture every other
// primary button on the site makes. Without it, the navy hero button was the only
// primary control that did nothing on hover.
const PRIMARY_VARIANTS: ButtonProps['variant'][] = ['light', 'white', 'gold', 'dark']

const baseColors: Record<NonNullable<ButtonProps['variant']>, string> = {
  // Both `light` and `white` are white fills now, and the difference between
  // them is the RING. `light` was #F3F5EE and then #CCD0D2 — a grey button, which
  // is what it was doing on white sections. White with a navy hairline is the
  // same control without the grey: on a white page the ring is the only thing
  // giving the button an edge, and 10% navy is enough to draw one without
  // reading as an outlined button.
  light: 'bg-white text-navy-800 shadow-sm ring-1 ring-inset ring-navy-800/10',
  // `white` keeps NO ring, and that is the whole reason the two still coexist:
  // it is for the gold, teal, navy and sky surfaces, where the saturated field
  // supplies the edge and a navy hairline just muddies it. `light` on light
  // sections, `white` on saturated ones — neither is a substitute for the other.
  white: 'bg-white text-navy-800 shadow-sm',
  gold: 'bg-gold text-navy-800',
  // No `hover:bg-navy-700` any more: `dark` is a primary variant now, and the
  // primary block below sets `hover:bg-navy-800`. Two hover backgrounds on one
  // element resolve by stylesheet order rather than by the order they are
  // written here, so the pair was a coin toss.
  dark: 'bg-navy-800 text-white',
  // TRANSPARENT, not white — the one variant that must not carry a fill.
  // It was `bg-black/5`, which on a white page renders as a grey pill, and on
  // gold as a dirty patch of gold. Transparent plus a navy hairline is the same
  // secondary control on every surface it is actually used on: the mist hero,
  // white sections, and the gold closing band (where it pairs with a white
  // `light` button — a white ghost there would have made the pair two identical
  // white buttons). Filling it white instead would break exactly that pairing.
  ghost:
    'bg-transparent text-navy-800 ring-1 ring-inset ring-navy-800/20 hover:bg-navy-800 hover:text-white hover:ring-navy-800',
}

// badge = the little circle the icon sits in on primary-style buttons.
// "light" and "white" keep a gold badge in both states (it reads fine on either
// fill, and on the navy the button flips to).
// "gold" starts navy (so it doesn't disappear into the gold button) and
// flips to gold on hover, once the button itself has gone navy.
// "dark" is the mirror of "gold": white on the navy fill, going gold on hover.
const badgeColors: Record<string, string> = {
  light: 'bg-gold text-navy-800',
  white: 'bg-gold text-navy-800',
  gold: 'bg-navy-800 text-white group-hover:bg-gold group-hover:text-navy-800',
  dark: 'bg-white text-navy-800 group-hover:bg-gold group-hover:text-navy-800',
}

export default function Button({
  children,
  variant = 'light',
  icon = 'none',
  size = 'default',
  href,
  target,
  type = 'button',
  className = '',
  onClick,
  title,
}: ButtonProps) {
  const Icon = icon !== 'none' ? iconMap[icon] : null
  const isPrimary = PRIMARY_VARIANTS.includes(variant)
  const isBadged = isPrimary && icon !== 'none'
  const isLg = size === 'lg'

  const paddingClasses =
    icon === 'none'
      ? isLg
        ? 'px-7 py-4'
        : 'px-6 py-2.5'
      : isLg
        ? 'pl-7 pr-2 py-2'
        : 'pl-6 pr-2 py-2'

  const hoverPaddingSwap = isBadged ? (isLg ? 'hover:pl-2 hover:pr-7' : 'hover:pl-2 hover:pr-6') : ''

  const badgeSize = isLg ? 'h-10 w-10' : 'h-8 w-8'
  const badgeIconSize = isLg ? 19 : 15
  const plainIconSize = isLg ? 19 : 16
  const textSize = isLg ? 'text-base' : 'text-[15px]'
  const buttonRadius = isLg ? 'rounded-[20px]' : 'rounded-[16px]'
  const badgeRadius = 'rounded-[8px]'

  const classes = `group corner-smooth inline-flex items-center gap-3 ${buttonRadius} ${textSize} font-semibold transition-all duration-300 ease-out hover:scale-[1.03] active:scale-[0.98] ${paddingClasses} ${hoverPaddingSwap} ${
    isPrimary ? 'hover:flex-row-reverse hover:bg-navy-800 hover:text-white' : ''
  } ${baseColors[variant]} ${className}`

  const inner = (
    <>
      <span>{children}</span>
      {Icon && isBadged && (
        <span
          className={`flex ${badgeSize} ${badgeRadius} shrink-0 items-center justify-center transition-colors duration-300 ${badgeColors[variant] ?? badgeColors.light}`}
        >
          <Icon
            size={badgeIconSize}
            strokeWidth={2.25}
            className="transition-transform duration-300 group-hover:-rotate-45"
          />
        </span>
      )}
      {Icon && !isBadged && (
        <Icon
          size={plainIconSize}
          strokeWidth={2.25}
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </>
  )

  if (href) {
    // Site-relative hrefs go through the router (which also applies the
    // deploy's base path); anything with a scheme — mailto:, tel:, an external
    // site — stays a plain anchor.
    if (isInternalHref(href)) {
      return (
        <Link href={href} target={target} title={title} className={classes} onClick={onClick}>
          {inner}
        </Link>
      )
    }
    return (
      <a href={href} target={target} title={title} className={classes} onClick={onClick}>
        {inner}
      </a>
    )
  }

  return (
    <button type={type} title={title} onClick={onClick} className={classes}>
      {inner}
    </button>
  )
}
