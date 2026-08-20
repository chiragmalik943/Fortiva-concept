import { type LucideIcon } from 'lucide-react'

/**
 * The copy doc's most repeated shape: a bolded phrase followed by one sentence
 * ("Transparent pricing — No hidden fees. No surprises."). It turns up on
 * Individuals & Families, Employers, Brokers, Providers and half the For
 * Members pages. FeatureReveal (the scroll-in split band) is what renders it,
 * on all three pages that currently carry such a list — the type stays in its
 * own module rather than being exported from that component so a second
 * renderer can be added later without every call site re-pointing its import.
 *
 * `icon` is the one thing the doc never supplies; every call site picks its own
 * from lucide-react.
 */
export interface Feature {
  title: string
  body: string
  icon: LucideIcon
}
