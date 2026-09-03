import { useState } from 'react'
import { CheckCircle2, ChevronDown } from 'lucide-react'
import { referralSources } from '../../content/site'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSplitReveal } from '../../hooks/useSplitReveal'
import Button from '../Button'

// "Stay connected with Fortiva" — the lead-gen form specified in the copy doc's
// Contact section, given its own band before the footer.
//
// ─────────────────────────────────────────────────────────────────────────────
// TODO(backend): there is no submit target. This repo has no server, so
// `handleSubmit` validates, shows the success state and logs the payload — it
// does NOT send anything anywhere. Point `submitLead` at the CRM / form
// endpoint and the rest of this component stays as-is.
//
// Also unresolved: whether collecting this alongside health-insurance intent
// needs explicit consent copy and a privacy link next to the submit button.
// ─────────────────────────────────────────────────────────────────────────────

interface FormState {
  firstName: string
  lastName: string
  phone: string
  email: string
  referral: string
}

const EMPTY: FormState = { firstName: '', lastName: '', phone: '', email: '', referral: '' }

type FieldErrors = Partial<Record<keyof FormState, string>>

async function submitLead(payload: FormState) {
  // eslint-disable-next-line no-console
  console.info('[Fortiva] lead captured (not yet sent anywhere):', payload)
}

const inputClasses =
  'corner-smooth w-full rounded-[12px] border border-navy-800/15 bg-white px-4 py-3 text-[15px] text-navy-800 transition-colors placeholder:text-navy-800/35 focus:border-navy-800/40 focus:outline-none focus-visible:outline-none'

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-medium text-navy-800/70">
      {children}
    </label>
  )
}

export default function StayConnected() {
  const [values, setValues] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const bodyRef = useScrollReveal<HTMLParagraphElement>({ y: 20, delay: 0.1 })
  const cardRef = useScrollReveal<HTMLDivElement>({ y: 32, delay: 0.15 })

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    // Clear this field's error as soon as the user starts fixing it, rather
    // than making them submit again to find out.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }

  const validate = (v: FormState): FieldErrors => {
    const next: FieldErrors = {}
    if (!v.firstName.trim()) next.firstName = 'Please enter your first name.'
    if (!v.lastName.trim()) next.lastName = 'Please enter your last name.'
    if (!v.email.trim()) next.email = 'Please enter your email address.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
      next.email = 'Please enter a valid email address.'
    return next
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      // Move focus to the first problem so keyboard and screen-reader users
      // aren't left guessing what failed.
      const firstBad = Object.keys(found)[0]
      document.getElementById(`sc-${firstBad}`)?.focus()
      return
    }
    await submitLead(values)
    setSubmitted(true)
    setValues(EMPTY)
  }

  /* ── Gold, not navy ────────────────────────────────────────────────────────
     This band used to be navy-800, which is also the footer's colour — with the
     footer's own closing CTA directly underneath it, the two read as one
     enormous dark block and the form lost its status as a separate ask. Gold is
     the brand's third surface and already carries a section on the homepage
     (StackedCards), so it separates the form from the footer without
     introducing a colour the page hasn't earned.
     The knock-on is contrast, and it does not resolve the obvious way: white
     type on gold measures 2.1:1, which fails even the 3:1 that display sizes
     need, so "Fortiva" cannot simply become white. Gold's luminance is 0.443 and
     navy-800's is 0.023, so the emphasis inverts instead — the accent word takes
     FULL navy and the rest of the line is held back to 70%. Body copy sits at
     80% for 4.7:1. The card's shadow also steps down to
     `card-soft` — a navy shadow at 0.35 opacity reads as a grey smudge against
     a saturated background, which is the same reason StackedCards' cards use
     the lighter one. See tailwind.config.js. */
  return (
    <section id="stay-connected" className="bg-gold px-6 py-24 sm:py-28">
      <div className="mx-auto grid max-w-container items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2
            ref={headingRef}
            className="max-w-md text-[30px] font-semibold leading-tight text-navy-800/70 opacity-0 sm:text-[38px]"
          >
            Stay connected with <span className="text-navy-800">Fortiva</span>
          </h2>
          <p
            ref={bodyRef}
            className="mt-6 max-w-md text-[15.5px] leading-relaxed text-navy-800/80 opacity-0"
          >
            Be the first to hear as Fortiva expands across the southeast, and get plan
            updates and member resources as they land.
          </p>
        </div>

        <div ref={cardRef} className="opacity-0">
          <div className="corner-smooth rounded-card bg-white p-7 shadow-card-soft sm:p-9">
            {submitted ? (
              <div role="status" aria-live="polite" className="flex flex-col items-start gap-4 py-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold">
                  <CheckCircle2 size={22} className="text-navy-800" strokeWidth={2} />
                </span>
                <div>
                  <h3 className="text-[20px] font-semibold text-navy-800">You&rsquo;re on the list</h3>
                  <p className="mt-2 max-w-sm text-[14.5px] leading-relaxed text-navy-800/60">
                    Thanks for getting in touch. We&rsquo;ll be in contact as soon as there&rsquo;s
                    something worth telling you.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-[14px] font-semibold text-navy-800 underline underline-offset-4 transition-opacity hover:opacity-70"
                >
                  Submit another response
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="sc-firstName">First name</FieldLabel>
                    <input
                      id="sc-firstName"
                      name="firstName"
                      autoComplete="given-name"
                      value={values.firstName}
                      onChange={set('firstName')}
                      aria-invalid={Boolean(errors.firstName)}
                      aria-describedby={errors.firstName ? 'sc-firstName-error' : undefined}
                      className={inputClasses}
                      placeholder="Jordan"
                    />
                    {errors.firstName && (
                      <p id="sc-firstName-error" className="mt-1.5 text-[12.5px] text-red-700">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <FieldLabel htmlFor="sc-lastName">Last name</FieldLabel>
                    <input
                      id="sc-lastName"
                      name="lastName"
                      autoComplete="family-name"
                      value={values.lastName}
                      onChange={set('lastName')}
                      aria-invalid={Boolean(errors.lastName)}
                      aria-describedby={errors.lastName ? 'sc-lastName-error' : undefined}
                      className={inputClasses}
                      placeholder="Ellis"
                    />
                    {errors.lastName && (
                      <p id="sc-lastName-error" className="mt-1.5 text-[12.5px] text-red-700">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <FieldLabel htmlFor="sc-phone">
                    Phone number <span className="text-navy-800/40">(optional)</span>
                  </FieldLabel>
                  <input
                    id="sc-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={values.phone}
                    onChange={set('phone')}
                    className={inputClasses}
                    placeholder="(704) 555-0142"
                  />
                </div>

                <div className="mt-4">
                  <FieldLabel htmlFor="sc-email">Email</FieldLabel>
                  <input
                    id="sc-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={set('email')}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'sc-email-error' : undefined}
                    className={inputClasses}
                    placeholder="jordan@example.com"
                  />
                  {errors.email && (
                    <p id="sc-email-error" className="mt-1.5 text-[12.5px] text-red-700">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <FieldLabel htmlFor="sc-referral">How did you hear about us?</FieldLabel>
                  <div className="relative">
                    <select
                      id="sc-referral"
                      name="referral"
                      value={values.referral}
                      onChange={set('referral')}
                      className={`${inputClasses} appearance-none pr-11`}
                    >
                      <option value="">Select an option</option>
                      {referralSources.map((source) => (
                        <option key={source} value={source}>
                          {source}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={17}
                      strokeWidth={2.25}
                      aria-hidden="true"
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-navy-800/45"
                    />
                  </div>
                </div>

                <div className="mt-7">
                  <Button variant="gold" icon="arrow" type="submit">
                    Stay connected
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
