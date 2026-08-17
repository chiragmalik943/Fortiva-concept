import { type LucideIcon } from 'lucide-react'

/**
 * The copy doc's most repeated shape: a bolded phrase followed by one sentence
 * ("Transparent pricing — No hidden fees. No surprises."). It turns up on
 * Individuals & Families, Employers, Brokers, Providers and half the For
 * Members pages, and TWO components render it — FeatureReveal (the scroll-in
 * split band) and FeatureGrid (the plain grid) — so the type lives here rather
 * than in whichever of them happened to be written first.
 *
 * `icon` is the one thing the doc never supplies; every call site picks its own
 * from lucide-react.
 */
export interface Feature {
  title: string
  body: string
  icon: LucideIcon
}
