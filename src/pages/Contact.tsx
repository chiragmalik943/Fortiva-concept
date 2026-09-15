import { type ReactNode } from 'react'
import { Phone, Mail, Smartphone, ArrowUpRight, type LucideIcon } from 'lucide-react'
import PageHero from '../components/PageHero/PageHero'
import StayConnected from '../components/StayConnected/StayConnected'
import Button from '../components/Button'
import { Link } from '../router/router'
import { contactAudiences, type ContactAudience } from '../content/site'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useSplitReveal } from '../hooks/useSplitReveal'

/**
 * Contact — a footer destination.
 *
 * Copy is FTVA_Web Copy.odt's "Contact — Footer", and the doc structures it by
 * AUDIENCE rather than by channel: three near-identical blocks, one each for
 * members, brokers and providers, every one of them a blurb, a phone number, an
 * email address and one or two buttons.
 *
 *   H1                        → PageHero
 *   FOR members / brokers / providers → the three columns below
 *   the "Fortiva App" line under members → that column's third row
 *   Stay connected with Fortiva + the lead-gen form → <StayConnected />
 *
 * ── Nothing here is a second copy of the footer ─────────────────────────────
 * The footer already renders those three audiences, from `contactAudiences` in
 * content/site.ts, and so does this page — the same array, not a duplicate of it.
 * That matters more here than anywhere else on the site: six of the seven values
 * in it are still "[Insert …]" placeholders, and the day the real numbers land
 * they have to appear in both places or the site contradicts itself. One array,
 * one edit.
 *
 * `ContactValue` below is the footer's own placeholder handling, ported to light
 * type: a value the doc never supplied renders as plain text rather than as a
 * `tel:` link that cannot work, and becomes a live link by itself the moment a
 * real value replaces it. The two implementations differ only in colour, which is
 * why it is twelve lines rather than a shared component — extracting it would
 * mean a component whose only job is to be two colour schemes.
 *
 * ── The tone ────────────────────────────────────────────────────────────────
 * `mist`, the site's neutral. Every other tone belongs to somebody: teal to
 * Plans, sky to For Members, dark to For Brokers, gold to About. This page serves
 * all three audiences at once and should not look like it belongs to one of them.
 */

const isPlaceholder = (value: string) => value.trim().startsWith('[')

function ContactValue({ value, kind }: { value: string; kind: 'tel' | 'email' }) {
  if (isPlaceholder(value)) {
    return <span className="font-medium text-navy-800/45">{value}</span>
  }
  const href = kind === 'tel' ? `tel:${value.replace(/[^\d+]/g, '')}` : `mailto:${value}`
  return (
    <a
      href={href}
      className="font-medium text-navy-800 underline underline-offset-4 transition-colors hover:text-gold-dark"
    >
      {value}
    </a>
  )
}

function ContactRow({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex items-start gap-4 border-t border-navy-800/10 py-4">
      <span className="mt-[2px] flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-navy-800/[0.06]">
        <Icon size={15} strokeWidth={1.9} className="text-navy-800/70" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/45">
          {label}
        </p>
        <div className="mt-1 break-words text-[15px] leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

function AudienceCard({ audience, delay }: { audience: ContactAudience; delay: number }) {
  const ref = useScrollReveal<HTMLDivElement>({ y: 30, delay })

  return (
    <div ref={ref} className="opacity-0">
      <div className="corner-smooth flex h-full flex-col rounded-card bg-white p-7 shadow-card-soft ring-1 ring-inset ring-navy-800/[0.08] sm:p-8">
        {/* The doc writes all three as "FOR members" / "FOR brokers" / "FOR
            providers" — the brand's own hook. The FOR is split out and tinted the
            same way the footer does it, so the device reads as a device rather
            than as a capitalised word. */}
        <h2 className="text-[22px] font-semibold leading-snug text-navy-800 sm:text-[24px]">
          <span className="text-gold-dark">FOR</span>
          {audience.heading.replace(/^FOR/, '')}
        </h2>
        {/* Reserves the tallest blurb's three lines so the Phone / Email rows
            start on the same line across all three columns — the same fix the
            footer's `sm:min-h-[4.25rem]` makes, at this page's larger type. */}
        <p className="mt-3 text-[15px] leading-relaxed text-navy-800/65 lg:min-h-[4.5rem]">
          {audience.blurb}
        </p>

        <div className="mt-6 flex flex-col">
          <ContactRow icon={Phone} label="Phone">
            <ContactValue value={audience.phone} kind="tel" />
          </ContactRow>
          <ContactRow icon={Mail} label="Email">
            <ContactValue value={audience.email} kind="email" />
          </ContactRow>
          {/* The doc gives this line to the members block alone. */}
          {audience.heading === 'FOR members' && (
            <ContactRow icon={Smartphone} label="Fortiva App">
              <Link
                href="/members/app"
                className="font-medium text-navy-800 underline underline-offset-4 transition-colors hover:text-gold-dark"
              >
                Download the app
              </Link>
              <span className="text-navy-800/55">
                {' '}
                for quick access to your plan details and support.
              </span>
            </ContactRow>
          )}
        </div>

        <ul className="mt-auto flex flex-col gap-2.5 border-t border-navy-800/10 pt-6">
          {audience.actions.map((action) => (
            <li key={action.label}>
              <Link
                href={action.href}
                className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-gold-dark transition-colors hover:text-navy-800"
              >
                {action.label}
                <ArrowUpRight
                  size={15}
                  strokeWidth={2.25}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Contact() {
  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const introRef = useScrollReveal<HTMLParagraphElement>({ y: 22, delay: 0.12 })
  const noteRef = useScrollReveal<HTMLParagraphElement>({ y: 20, delay: 0.1 })

  return (
    <>
      <PageHero
        titleTop="Talk to a person."
        titleBottom="Whoever you are."
        lede={
          <>
            Members, brokers and providers each have their own team at Fortiva. Pick the one
            that fits and you will reach someone who already knows what you are asking about.
          </>
        }
        actions={
          <>
            <Button variant="gold" icon="arrow" size="lg" href="/members/portal">
              Member Portal
            </Button>
            <Button variant="white" size="lg" href="/members/faqs">
              Read the FAQs
            </Button>
          </>
        }
      />

      {/* ── The three audiences ───────────────────────────────────────────
          Grey plate, three white cards — the same pairing MembersHub's section
          index uses, for the same reason: white cards on a white page have
          nothing but a hairline to stand on. Three columns from `lg` rather than
          from `md`, because each card carries two or three labelled contact rows
          and a 33% column at 768px wraps every one of them. */}
      <section className="bg-[#CCD0D2] px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-container">
          <h2
            ref={headingRef}
            className="max-w-2xl text-[30px] font-semibold leading-tight text-navy-800 opacity-0 sm:text-[38px]"
          >
            Contact <span className="text-gold-dark">us</span>
          </h2>
          <p
            ref={introRef}
            className="mt-6 max-w-2xl text-[16px] leading-relaxed text-navy-800/65 opacity-0 sm:text-[17px]"
          >
            Three teams, three sets of details. Portals and self-service are linked from each
            one, so you can start wherever suits you.
          </p>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {contactAudiences.map((audience, i) => (
              <AudienceCard key={audience.heading} audience={audience} delay={i * 0.08} />
            ))}
          </div>

          {/* TODO(client): the six "[Insert …]" values above ship exactly as the
              copy doc writes them, and they render as plain text rather than as
              broken links until real ones land in content/site.ts. This line says
              so on the page too, so a reviewer cannot mistake them for a styling
              bug. Delete it with the placeholders. */}
          <p
            ref={noteRef}
            className="mt-10 max-w-2xl text-[13.5px] leading-relaxed text-navy-800/50 opacity-0"
          >
            Direct phone numbers and email addresses are being finalised. In the meantime, the
            form below reaches all three teams.
          </p>
        </div>
      </section>

      {/* "Stay connected with Fortiva" — the doc's own lead-gen form, and the
          component the homepage already ends on. It is gold, which is what closes
          this page correctly: the footer under it is navy, and the site's closing
          signature is light → gold → navy. See the tone rule in CtaBand.tsx.

          There is no separate closing CTA on this page for the same reason — a
          contact page whose last section is a contact form does not need a band
          underneath asking you to get in touch. */}
      <StayConnected />
    </>
  )
}
