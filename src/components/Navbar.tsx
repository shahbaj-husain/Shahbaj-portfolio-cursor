import { Fragment, useEffect, useState } from 'react';
import { PROFILE_INFO } from '../data/portfolioData';

interface NavLinkItem {
  label: string;
  href: string;
  id: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Learning', href: '#learning', id: 'learning' },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 36);
      if (window.scrollY < 260) {
        setActiveSection('');
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = ['about', 'learning', 'skills', 'projects', 'contact'];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-35% 0px -50% 0px', threshold: 0.05 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleNavigate = (href: string) => {
    setIsMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-20 px-5 sm:px-8 py-4 sm:py-5 flex flex-row justify-between items-center transition-colors duration-300 ${
          scrolled && !isMobileMenuOpen ? 'bg-white/85 backdrop-blur-md border-b border-neutral-100' : 'bg-transparent'
        }`}
      >
        <a
          href="#spade-hero"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setIsMobileMenuOpen(false);
          }}
          className="flex flex-row items-center gap-3 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1C2E1E]"
          aria-label="Shahbaj portfolio home"
        >
          <span className="text-[21px] sm:text-[26px] tracking-tight text-black font-medium select-none">
            {PROFILE_INFO.brandName}
          </span>
          <span
            className="text-[25px] sm:text-[30px] text-black select-none tracking-[-0.02em] font-medium leading-none mb-1"
            aria-hidden="true"
          >
            ✱
          </span>
        </a>

        <nav className="hidden md:flex flex-row items-center text-[17px] lg:text-[23px] text-black" aria-label="Primary navigation">
          {NAV_LINKS.map((link, index) => {
            const isActive = activeSection === link.id;
            return (
              <Fragment key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigate(link.href);
                  }}
                  className={`hover:opacity-60 transition-opacity whitespace-nowrap shrink-0 ${
                    isActive ? 'underline underline-offset-4 decoration-[#4D6D47]' : ''
                  }`}
                >
                  {link.label}
                </a>
                {index < NAV_LINKS.length - 1 && (
                  <span className="opacity-40 select-none" aria-hidden="true">
                    ,&nbsp;
                  </span>
                )}
              </Fragment>
            );
          })}
        </nav>

        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate('#contact');
          }}
          className="hidden md:inline-block text-[17px] lg:text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity whitespace-nowrap shrink-0"
        >
          Get in touch
        </a>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="md:hidden flex flex-col justify-center items-center gap-[5px] w-11 h-11 -mr-2 cursor-pointer"
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation-overlay"
        >
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              isMobileMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </header>

      <div
        id="mobile-navigation-overlay"
        className={`md:hidden fixed inset-0 z-[15] bg-white/95 backdrop-blur-sm transition-opacity duration-300 flex flex-col justify-center px-8 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <nav className="flex flex-col gap-6" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              tabIndex={isMobileMenuOpen ? 0 : -1}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate(link.href);
              }}
              className="text-4xl tracking-tight text-black font-normal hover:opacity-60 transition-opacity"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 border-t border-neutral-200">
            <a
              href="#contact"
              tabIndex={isMobileMenuOpen ? 0 : -1}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('#contact');
              }}
              className="text-2xl text-black underline underline-offset-4 hover:opacity-60 transition-opacity"
            >
              Get in touch
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
