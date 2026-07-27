import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Logo from '../Logo'
import Button from '../Button'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Plans', href: '#' },
  { label: 'Resources', href: '#', dropdown: true },
  { label: 'Contact Us', href: '#footer' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:px-6">
      <nav
        className={`flex w-full max-w-container items-center justify-between rounded-[24px] corner-smooth px-4 py-2.5 transition-all duration-500 sm:px-5 ${
          scrolled
            ? 'bg-cream-soft/70 shadow-soft backdrop-blur-[28px]'
            : 'bg-transparent'
        }`}
      >
        <a href="#home" aria-label="Fortiva home">
          <Logo />
        </a>

        <ul className="hidden items-center gap-9 text-[14.5px] font-medium text-navy-800/90 md:flex">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="flex items-center gap-1 transition-colors hover:text-navy-800"
              >
                {link.label}
                {link.dropdown && <ChevronDown size={14} strokeWidth={2.25} />}
              </a>
            </li>
          ))}
        </ul>

        <Button variant="gold" icon="arrow" className="!py-1.5 !text-[14px]">
          Talk to Us
        </Button>
      </nav>
    </header>
  )
}
