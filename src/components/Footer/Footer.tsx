import { Twitter, Linkedin, Facebook, Instagram, ArrowUpRight } from 'lucide-react'
import Logo from '../Logo'
import Button from '../Button'
import { Link } from '../../router/router'
import { useSplitReveal } from '../../hooks/useSplitReveal'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import {
  claimsPartnerNote,
  companyLocation,
  contactAudiences,
  footerNav,
} from '../../content/site'

const socials = [
  { icon: Twitter, label: 'X' },
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: Facebook, label: 'Facebook' },
  { icon: Instagram, label: 'Instagram' },
]

/**
 * The copy doc ships every contact number and address as "[Insert …]". Rather
 * than wrap those in a `tel:`/`mailto:` that can't work, detect them and render
 * plain text — so the moment real values land in content/site.ts they become
 * live links with no further edit here.
 */
const isPlaceholder = (value: string) => value.trim().startsWith('[')

function ContactValue({ value, kind }: { value: string; kind: 'tel' | 'email' }) {
  if (isPlaceholder(value)) {
    return <span className="font-medium text-white/70">{value}</span>
  }
  const href = kind === 'tel' ? `tel:${value.replace(/[^\d+]/g, '')}` : `mailto:${value}`
  return (
    <a href={href} className="font-medium text-white transition-colors hover:text-gold">
      {value}
    </a>
  )
}

export default function Footer() {
  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const contactRef = useScrollReveal<HTMLDivElement>({ y: 24, delay: 0.1 })

  return (
    <footer id="footer" className="bg-navy-800 px-4 pb-8 pt-20 sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-container">
        <Link href="/" aria-label="Fortiva home" className="inline-block">
          <Logo variant="light" />
        </Link>

        {/* ── closing CTA ─────────────────────────────────────────────── */}
        <div className="mt-10 max-w-xl">
          <h2
            ref={headingRef}
            className="text-[34px] font-semibold leading-[1.12] text-white opacity-0 sm:text-[46px]"
          >
            Ready to <span className="text-gold">take control</span> of your health coverage?
          </h2>
          <p className="mt-4 max-w-sm text-[15px] text-white/60">
            We look forward to learning about your healthcare needs.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Button variant="gold" icon="arrowUpRight" href="/plans">
              Explore Plans
            </Button>
            <Button variant="light" icon="arrow" href="/contact">
              Get a Quote
            </Button>
            <Link
              href="/careers"
              className="text-[15px] font-semibold text-white/75 underline underline-offset-4 transition-colors hover:text-white"
            >
              Join the Movement
            </Link>
          </div>
        </div>

        {/* ── contact, split by audience exactly as the copy doc does ─── */}
        <div
          ref={contactRef}
          className="mt-16 grid gap-10 border-t border-white/10 pt-12 opacity-0 sm:mt-20 sm:grid-cols-3 sm:gap-8"
        >
          {contactAudiences.map((audience) => (
            <div key={audience.heading}>
              <h3 className="text-[17px] font-semibold text-white">
                <span className="text-gold">FOR</span>
                {audience.heading.replace(/^FOR/, '')}
              </h3>
              {/* min-height reserves the tallest blurb's three lines, so the
                  Phone/Email/portal rows stay aligned across all three columns
                  instead of stepping down under the longest one. */}
              <p className="mt-2.5 max-w-xs text-[14px] leading-relaxed text-white/55 sm:min-h-[4.25rem]">
                {audience.blurb}
              </p>

              <dl className="mt-5 space-y-3 text-[14.5px]">
                <div>
                  <dt className="text-white/45">Phone</dt>
                  <dd className="mt-0.5">
                    <ContactValue value={audience.phone} kind="tel" />
                  </dd>
                </div>
                <div>
                  <dt className="text-white/45">Email</dt>
                  <dd className="mt-0.5 break-words">
                    <ContactValue value={audience.email} kind="email" />
                  </dd>
                </div>
              </dl>

              <ul className="mt-5 flex flex-col gap-2.5">
                {audience.actions.map((action) => (
                  <li key={action.label}>
                    <Link
                      href={action.href}
                      className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-gold transition-colors hover:text-gold-light"
                    >
                      {action.label}
                      <ArrowUpRight
                        size={15}
                        strokeWidth={2.25}
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── full IA ─────────────────────────────────────────────────── */}
        <nav
          aria-label="Footer"
          className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 border-y border-white/10 py-7 text-[14.5px] font-medium text-white/75 lg:justify-between"
        >
          {footerNav.map((link) => (
            <Link key={link.label} href={link.href} className="transition-colors hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── legal ───────────────────────────────────────────────────── */}
        <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-white/50">
              <span>© 2026 Fortiva, LLC. All Rights Reserved</span>
              <Link href="/terms" className="hover:text-white">
                Terms &amp; Conditions
              </Link>
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </div>
            <p className="text-center text-[13px] text-white/40 sm:text-left">
              {companyLocation} &middot; {claimsPartnerNote}
            </p>
            {/* TODO(client): limited-medical and short-term-medical products
                normally require "not major medical / not ACA-compliant"
                language here. The copy doc contains no such disclaimer, so
                none has been invented — see the handover notes. */}
          </div>

          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-navy-800 shadow-sm transition-transform hover:scale-105"
              >
                <Icon size={16} strokeWidth={2} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
