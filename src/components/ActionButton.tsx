import { ComponentProps } from 'react'
import Button from './Button'
import { isPlaceholderHref } from '../content/site'

type ActionButtonProps = ComponentProps<typeof Button> & { href: string }

/**
 * A Button for the five destinations the copy doc asks for but never supplies a
 * URL for — the provider directory, MyLiveDoc, the portal, and the two app
 * stores (see `externalTargets` in content/site.ts).
 *
 * While the href is still '#', the click is swallowed rather than jumping the
 * page to the top, the control announces itself as disabled to assistive tech,
 * and `title` says why. Once a real URL lands in content/site.ts, the same
 * component starts opening it in a new tab and every one of those behaviours
 * switches off by itself — there is no second edit to remember.
 */
export default function ActionButton({ href, onClick, ...rest }: ActionButtonProps) {
  const pending = isPlaceholderHref(href)

  return (
    <Button
      {...rest}
      href={href}
      target={pending ? undefined : '_blank'}
      title={pending ? 'Not connected yet — awaiting the live URL' : undefined}
      onClick={(e) => {
        if (pending) e.preventDefault()
        onClick?.(e)
      }}
      className={`${rest.className ?? ''} ${pending ? 'cursor-not-allowed' : ''}`}
    />
  )
}
