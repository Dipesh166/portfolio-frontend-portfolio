import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, FileDown } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../components/ui/button'
import { SmartImage } from '../components/SmartImage'
import { TypedLine } from '../components/Typed'
import { usePortfolio } from '../hooks/usePortfolio'
import { resolveUrl } from '../lib/api'
import { containerStagger, itemFadeUp, scaleFade } from '../lib/motion'

export function Hero() {
  const { data } = usePortfolio()
  const profile = data?.profile
  const socials = data?.social_links ?? []

  const name = profile?.name ?? ''
  const headline = profile?.headline ?? ''
  const bio = profile?.short_bio ?? ''
  const resumeHref = profile?.resume_url || profile?.resume?.url
  const imageUrl = profile?.profile_image?.url

  const [headlineDone, setHeadlineDone] = useState(false)
  const [grayscale, setGrayscale] = useState(false)

  const { scrollY } = useScroll()
  const cardY = useTransform(scrollY, [0, 700], [0, -44])

  return (
    <section id="top" className="relative flex min-h-[88vh] items-center overflow-hidden">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:py-24">
        <motion.div
          variants={containerStagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start gap-6"
        >
          <motion.p
            variants={itemFadeUp}
            className="flex items-center gap-2 font-mono text-xs font-bold tracking-[0.3em] text-muted-foreground uppercase"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" aria-hidden="true" />
            // greeting_sys
          </motion.p>

          <motion.h1
            variants={itemFadeUp}
            className="text-4xl leading-[0.95] font-black tracking-tight sm:text-6xl"
          >
            <span className="block text-foreground/80">hello.</span>
            <span className="mt-2 block">
              <span className="text-foreground/60">i'm </span>
              <span className="relative inline-block text-primary drop-shadow-[0_0_20px_currentColor]">
                {name ? name.split(' ')[0].toLowerCase() : 'here'}
                <motion.span
                  className="absolute -bottom-1.5 left-0 h-1 w-full origin-left rounded-full bg-primary sm:h-1.5"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7, duration: 0.6, ease: 'easeOut' }}
                />
              </span>
              <span
                className="caret ml-2 inline-block h-[0.9em] w-[0.5ch] translate-y-[0.12em] rounded-[2px] bg-primary"
                aria-hidden="true"
              />
            </span>
          </motion.h1>

          {headline ? (
            <motion.p
              variants={itemFadeUp}
              className="max-w-md font-dot text-2xl leading-none font-black text-primary uppercase sm:text-4xl"
            >
              <span className="text-foreground/40">&gt;</span>{' '}
              <TypedLine
                text={headline}
                speed={34}
                startDelay={450}
                onDone={() => setHeadlineDone(true)}
              />
            </motion.p>
          ) : null}

          {bio ? (
            <motion.p
              variants={itemFadeUp}
              className="max-w-xl font-mono text-sm leading-relaxed text-muted-foreground sm:text-base"
            >
              <TypedLine
                text={bio}
                speed={16}
                startDelay={120}
                startTyping={headline ? headlineDone : true}
              />
            </motion.p>
          ) : null}

          <motion.div variants={itemFadeUp} className="flex flex-wrap items-center gap-3">
            {resumeHref ? (
              <Button asChild className="gap-2 rounded-xl font-mono">
                <a href={resolveUrl(resumeHref)} target="_blank" rel="noreferrer">
                  <FileDown aria-hidden="true" />
                  download_resume
                </a>
              </Button>
            ) : null}
            <Button asChild variant="outline" className="gap-2 rounded-xl font-mono">
              <a href="#contact">
                get_in_touch
                <ArrowDown aria-hidden="true" />
              </a>
            </Button>
          </motion.div>

          {socials.length > 0 ? (
            <motion.div variants={itemFadeUp} className="flex flex-wrap items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  title={social.platform}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/70 px-3 py-1.5 font-mono text-xs font-semibold text-muted-foreground backdrop-blur transition-colors hover:border-primary/50 hover:text-primary"
                >
                  {social.icon ? (
                    <SmartImage
                      src={resolveUrl(social.icon)}
                      alt=""
                      containerClassName="h-3.5 w-3.5 shrink-0 rounded"
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-[10px] font-black uppercase">
                      {social.platform.charAt(0)}
                    </span>
                  )}
                  <span>{social.platform}</span>
                </a>
              ))}
            </motion.div>
          ) : null}
        </motion.div>

        <motion.div
          style={{ y: cardY }}
          className="relative mx-auto w-full max-w-[320px] sm:max-w-[360px]"
        >
          <motion.div
            variants={scaleFade}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[2.5rem] border border-dashed border-primary/40" aria-hidden="true" />
            <span className="absolute -top-1 -left-1 z-10 h-5 w-5 border-t-2 border-l-2 border-primary" aria-hidden="true" />
            <span className="absolute -top-1 -right-1 z-10 h-5 w-5 border-t-2 border-r-2 border-primary" aria-hidden="true" />
            <span className="absolute -bottom-1 -left-1 z-10 h-5 w-5 border-b-2 border-l-2 border-primary" aria-hidden="true" />
            <span className="absolute -bottom-1 -right-1 z-10 h-5 w-5 border-b-2 border-r-2 border-primary" aria-hidden="true" />

            <div className="group relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-foreground/10">
              <motion.div
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="will-change-transform"
                >
                  {imageUrl ? (
                    <SmartImage
                      src={resolveUrl(imageUrl)}
                      alt={profile?.profile_image?.alt || name || 'Profile'}
                      onClick={() => setGrayscale((v) => !v)}
                      containerClassName="aspect-square w-full cursor-pointer"
                      className={`object-cover object-top brightness-[1.05] transition-[filter,transform] duration-700 group-hover:scale-[1.03] ${grayscale ? 'grayscale saturate-0' : 'saturate-[0.95]'}`}
                    />
                  ) : (
                    <div className="grid aspect-square w-full place-items-center bg-gradient-to-b from-primary/25 via-primary/5 to-transparent">
                      <span className="font-mono text-8xl font-black text-primary/40">
                        {name.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                </motion.div>

                <div className="dot-dense pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply dark:mix-blend-screen" aria-hidden="true" />

                <div className="pointer-events-none absolute inset-y-3 left-1.5 sm:left-2" aria-hidden="true">
                  <motion.div
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 1.1, ease: 'easeInOut' }}
                    className="flex h-full items-center rounded-lg bg-black/40 px-1.5 backdrop-blur-[2px]"
                  >
                    <motion.span
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                      className="font-sans text-3xl font-black tracking-[0.3em] text-white uppercase [text-shadow:0_2px_10px_rgba(0,0,0,0.85)] [writing-mode:vertical-rl] sm:text-4xl"
                    >
                      destiny
                    </motion.span>
                  </motion.div>
                </div>

                <div className="pointer-events-none absolute right-2.5 bottom-2.5 sm:right-3 sm:bottom-3" aria-hidden="true">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.55, ease: 'easeOut' }}
                  >
                    <motion.div
                      animate={{ x: [0, 6, 0], y: [0, -3, 0] }}
                      transition={{
                        x: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
                        y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
                      }}
                      className="relative inline-flex items-center overflow-hidden rounded-md border border-primary/60 bg-primary/90 px-2 py-0.5 shadow-[0_0_12px] shadow-primary/60 backdrop-blur-sm"
                    >
                      <motion.span
                        animate={{ x: ['-140%', '340%'] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.3 }}
                        className="absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                      />
                      <motion.span
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.75, duration: 0.5, ease: 'easeOut' }}
                        className="relative font-sans text-[8px] font-black tracking-[0.3em] text-white uppercase [text-shadow:0_0_8px_rgba(255,255,255,0.6)]"
                      >
                        diabolical
                      </motion.span>
                      <span
                        className="caret relative ml-1 inline-block h-[0.7em] w-[0.4ch] rounded-[1px] bg-white"
                        aria-hidden="true"
                      />
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>

              <div className="animate-spin-slower absolute -bottom-10 -left-12 h-28 w-28 rounded-full border-2 border-dashed border-primary/40" aria-hidden="true" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] tracking-[0.35em] text-muted-foreground uppercase lg:flex"
      >
        scroll
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="block h-6 w-px bg-primary"
        />
      </a>
    </section>
  )
}