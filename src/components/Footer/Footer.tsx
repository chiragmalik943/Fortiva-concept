import { Twitter, Linkedin, Facebook, Instagram } from 'lucide-react'
import Logo from '../Logo'
import Button from '../Button'
import { useSplitReveal } from '../../hooks/useSplitReveal'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const footerLinks = ['Plans', 'Who we are', 'Blogs', 'Careers', 'Team', 'Contact Us', 'FAQ']
const socials = [
  { icon: Twitter, label: 'X' },
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: Facebook, label: 'Facebook' },
  { icon: Instagram, label: 'Instagram' },
]

export default function Footer() {
  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: 'words' })
  const contactRef = useScrollReveal<HTMLDivElement>({ y: 24, delay: 0.1 })

  return (
    <footer id="footer" className="bg-navy-800 px-4 pb-8 pt-20 sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-container">
        <Logo variant="light" />

        <div className="mt-10 flex flex-col justify-between gap-10 sm:flex-row sm:items-end">
          <div>
            <h2
              ref={headingRef}
              className="max-w-lg text-[34px] font-semibold leading-[1.12] text-white opacity-0 sm:text-[46px]"
            >
              Ready to <span className="text-gold">Take Control</span>
              <br />
              of your Insurance?
            </h2>
            <p className="mt-4 max-w-sm text-[15px] text-white/60">
              We look forward to learning about your healthcare needs.
            </p>
            <div className="mt-7">
              <Button variant="gold" icon="arrowUpRight">
                Get a Quote
              </Button>
            </div>
          </div>

          <div ref={contactRef} className="grid grid-cols-2 gap-x-10 gap-y-6 text-[14.5px] sm:justify-items-end sm:text-right">
            <div>
              <div className="text-[11px] font-semibold tracking-[0.14em] text-white/40">
                CONTACT US
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <div className="text-white/50">Our Phone</div>
                  <div className="font-medium text-white">+1 (402) 555-0100</div>
                </div>
                <div>
                  <div className="text-white/50">Our Email</div>
                  <div className="font-medium text-white">hello@fortiva.com</div>
                </div>
              </div>
            </div>
            <div className="mt-[26px] space-y-4">
              <div>
                <div className="text-white/50">Mon&ndash;Fri:</div>
                <div className="font-medium text-white">8:30am&ndash;5:30pm</div>
              </div>
              <div>
                <div className="font-medium text-white">2301 North 117th Ave, Ste 200</div>
                <div className="font-medium text-white">Omaha, NE 68164</div>
              </div>
            </div>
          </div>
        </div>

        <nav className="mt-20 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-y border-white/10 py-7 text-[14.5px] font-medium text-white/75 sm:justify-between">
          {footerLinks.map((link) => (
            <a key={link} href="#" className="transition-colors hover:text-white">
              {link}
            </a>
          ))}
        </nav>

        <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-white/50">
            <span>© 2026 Fortiva, LLC. All Rights Reserved</span>
            <a href="#" className="hover:text-white">Terms &amp; Conditions</a>
            <a href="#" className="hover:text-white">Privacy Policy</a>
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
