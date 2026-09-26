import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import {
  Briefcase,
  FolderKanban,
  GraduationCap,
  Mail,
  Sparkles,
  User,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from 'cn'
import { ThemeToggle } from './ThemeToggle'

const NAV_LINKS = [
  { id: 'about', label: 'About', index: '01', icon: User },
  { id: 'skills', label: 'Skills', index: '02', icon: Sparkles },
  { id: 'projects', label: 'Projects', index: '03', icon: FolderKanban },
  { id: 'experience', label: 'Experience', index: '04', icon: Briefcase },
  { id: 'education', label: 'Education', index: '05', icon: GraduationCap },
  { id: 'contact', label: 'Contact', index: '06', icon: Mail },
]

export function Dock() {
  const [active, setActive] = useState('')
  const [hovered, setHovered] = useState<string | null>(null)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    )
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-gradient-to-r from-primary via-primary/60 to-primary"
      />

      <motion.nav
        initial={{ y: 64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        aria-label="Section navigation"
        className="fixed bottom-3 left-1/2 z-40 -translate-x-1/2"
      >
        <div className="flex items-center rounded-2xl border border-border/70 bg-card/85 p-1.5 shadow-2xl shadow-foreground/10 backdrop-blur-xl">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id
            const Icon = link.icon
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-label={link.label}
                aria-current={isActive ? 'page' : undefined}
                className="group relative outline-none"
                onMouseEnter={() => setHovered(link.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(link.id)}
                onBlur={() => setHovered(null)}
              >
                <AnimatePresence>
                  {hovered === link.id ? (
                    <motion.span
                      initial={{ opacity: 0, y: 8, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.9 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 font-mono text-[10px] font-bold whitespace-nowrap text-background"
                    >
                      <span className="text-primary">{link.index}.</span> {link.label}
                    </motion.span>
                  ) : null}
                </AnimatePresence>

                <span
                  className={cn(
                    'relative grid h-9 w-9 place-items-center rounded-xl transition-colors duration-200 sm:h-10 sm:w-10',
                    isActive
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground active:scale-95',
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  {isActive ? (
                    <motion.span
                      layoutId="dock-dot"
                      className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary"
                    />
                  ) : null}
                </span>
              </a>
            )
          })}
          <div className="mx-1 h-6 w-px shrink-0 bg-border" aria-hidden="true" />
          <span className="grid h-9 w-9 place-items-center sm:h-10 sm:w-10">
            <ThemeToggle />
          </span>
        </div>
      </motion.nav>
    </>
  )
}