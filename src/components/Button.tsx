import { ReactNode, MouseEventHandler } from 'react'
import { ArrowRight, ArrowUpRight, Plus } from 'lucide-react'

interface ButtonProps {
  children: ReactNode
  variant?: 'light' | 'gold' | 'dark' | 'ghost'
  icon?: 'arrow' | 'arrowUpRight' | 'plus' | 'none'
  /** 'lg' is the 56px hero size; everywhere else uses the default. */
  size?: 'default' | 'lg'
  className?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const iconMap = { arrow: ArrowRight, arrowUpRight: ArrowUpRight, plus: Plus }

// "primary" style variants: on hover the button flips to a navy fill with
// white text, and the icon swaps to the leading edge and rotates -45deg.
const PRIMARY_VARIANTS: ButtonProps['variant'][] = ['light', 'gold']

const baseColors: Record<NonNullable<ButtonProps['variant']>, string> = {
  light: 'bg-cream-soft text-navy-800 shadow-sm',
  gold: 'bg-gold text-navy-800',
  dark: 'bg-navy-800 text-cream-soft hover:bg-navy-700',
  ghost: 'bg-black/5 text-navy-800 hover:bg-navy-800 hover:text-cream-soft',
}

// badge = the little circle the icon sits in on primary-style buttons.
// "light" keeps a gold badge in both states (it reads fine on white or navy).
// "gold" starts navy (so it doesn't disappear into the gold button) and
// flips to gold on hover, once the button itself has gone navy.
const badgeColors: Record<string, string> = {
  light: 'bg-gold text-navy-800',
  gold: 'bg-navy-800 text-white group-hover:bg-gold group-hover:text-navy-800',
}

export default function Button({
  children,
  variant = 'light',
  icon = 'none',
  size = 'default',
  className = '',
  onClick,
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

  return (
    <button
      onClick={onClick}
      className={`group corner-smooth inline-flex items-center gap-3 ${buttonRadius} ${textSize} font-semibold transition-all duration-300 ease-out hover:scale-[1.03] active:scale-[0.98] ${paddingClasses} ${hoverPaddingSwap} ${
        isPrimary ? 'hover:flex-row-reverse hover:bg-navy-800 hover:text-white' : ''
      } ${baseColors[variant]} ${className}`}
    >
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
    </button>
  )
}
