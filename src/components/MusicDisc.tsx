import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Music2, Pause, Play, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { SmartImage } from './SmartImage'
import { resolveUrl } from '../lib/api'
import { usePortfolio } from '../hooks/usePortfolio'
import type { MusicTrack } from '../lib/types'

const EQ_BARS = 16
const MAX_SKIPS = 2

const shuffleIndex = (tracks: MusicTrack[], current?: number) => {
  if (tracks.length <= 1) return 0
  let next = Math.floor(Math.random() * tracks.length)
  while (next === current) next = Math.floor(Math.random() * tracks.length)
  return next
}

export function MusicDisc() {
  const { data } = usePortfolio()
  const tracks = useMemo(
    () => (data?.music ?? []).filter((t) => t.audio && t.enabled),
    [data],
  )

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const eqRefs = useRef<HTMLSpanElement[]>([])
  const analyserRef = useRef<AnalyserNode | null>(null)
  const contextRef = useRef<AudioContext | null>(null)
  const boundElRef = useRef<HTMLAudioElement | null>(null)
  const pendingPlayRef = useRef(false)
  const autoplayAttempted = useRef(false)
  const errorCountRef = useRef(0)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const current = tracks[currentIndex]
  const spinning = isPlaying && current != null
  const titleIsLong = (current?.title ?? '').length > 16

  const resumeContext = useCallback(() => {
    const ctx = contextRef.current
    if (ctx && ctx.state === 'suspended') {
      void ctx.resume().catch(() => undefined)
    }
  }, [])

  // Must run inside a user gesture: Chrome refuses to start an AudioContext that
  // is created before the page has been interacted with.
  const ensureAnalyser = useCallback(
    (el: HTMLAudioElement) => {
      if (boundElRef.current === el && analyserRef.current) {
        resumeContext()
        return
      }

      // The <audio> node was replaced (tracks arrived / StrictMode remount), so
      // the previous graph is bound to a detached element and must be discarded.
      if (contextRef.current) {
        void contextRef.current.close().catch(() => undefined)
        analyserRef.current = null
        contextRef.current = null
        boundElRef.current = null
      }

      try {
        const Ctx =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext
        if (!Ctx) return
        const ctx = new Ctx()
        const source = ctx.createMediaElementSource(el)
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 64
        analyser.smoothingTimeConstant = 0.85
        source.connect(analyser)
        analyser.connect(ctx.destination)
        analyserRef.current = analyser
        contextRef.current = ctx
        boundElRef.current = el
      } catch {
        // Analyser unavailable — equalizer stays idle, element plays directly.
      }

      resumeContext()
    },
    [resumeContext],
  )

  // Load the audio whenever the current track changes.
  useEffect(() => {
    const el = audioRef.current
    const track = tracks[currentIndex]
    if (!el || !track) return
    const url = resolveUrl(track.audio!.url)
    if (el.getAttribute('src') !== url) {
      el.src = url
      el.volume = 0.45
      el.load()
    }
    if (pendingPlayRef.current) {
      pendingPlayRef.current = false
      void el.play().catch(() => undefined)
    }
  }, [currentIndex, tracks])

  // Equalizer animation loop.
  useEffect(() => {
    const analyser = analyserRef.current
    if (!isPlaying || !analyser) return
    const data = new Uint8Array(analyser.frequencyBinCount)
    const bars = eqRefs.current
    let raf = 0

    const tick = () => {
      analyser.getByteFrequencyData(data)
      for (let i = 0; i < EQ_BARS; i++) {
        const node = bars[i]
        if (!node) continue
        const value = data[Math.floor((i / EQ_BARS) * data.length * 0.7)] ?? 0
        node.style.height = `${Math.max(14, 12 + (value / 255) * 100)}%`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      for (let i = 0; i < EQ_BARS; i++) {
        const node = bars[i]
        if (node) node.style.height = '14%'
      }
    }
  }, [isPlaying, currentIndex, ensureAnalyser])

  const playFrom = useCallback(
    (el: HTMLAudioElement | null) => {
      if (!el) return
      pendingPlayRef.current = true
      setHasStarted(true)
    },
    [],
  )

  const attemptPlayback = useCallback(
    (el: HTMLAudioElement, wireAnalyser = false) => {
      if (wireAnalyser) ensureAnalyser(el)
      if (tracks.length > 1) {
        const next = shuffleIndex(tracks, currentIndex)
        const track = tracks[next]
        el.src = resolveUrl(track.audio!.url)
        el.volume = 0.45
        el.load()
        setCurrentIndex(next)
      }
      void el
        .play()
        .then(() => setHasStarted(true))
        .catch(() => setIsPlaying(false))
    },
    [currentIndex, ensureAnalyser, tracks],
  )

  // Try to autoplay as soon as tracks are available (may be blocked by the
  // browser — the first-interaction listener below remains as a fallback).
  useEffect(() => {
    if (tracks.length === 0 || hasStarted || autoplayAttempted.current) return
    autoplayAttempted.current = true
    const el = audioRef.current
    if (!el) return
    attemptPlayback(el)
  }, [tracks, hasStarted, attemptPlayback])

  // Fallback: start playing on the visitor's first interaction.
  useEffect(() => {
    if (tracks.length === 0 || hasStarted) return
    const onInteract = () => {
      if (hasStarted) return
      const el = audioRef.current
      if (!el) return
      attemptPlayback(el, true)
    }
    window.addEventListener('pointerdown', onInteract)
    return () => window.removeEventListener('pointerdown', onInteract)
  }, [tracks, hasStarted, attemptPlayback])

  // Keep a suspended context alive when the tab regains focus / is restored.
  useEffect(() => {
    const wake = () => resumeContext()
    document.addEventListener('visibilitychange', wake)
    window.addEventListener('pageshow', wake)
    return () => {
      document.removeEventListener('visibilitychange', wake)
      window.removeEventListener('pageshow', wake)
    }
  }, [resumeContext])

  const togglePlay = () => {
    const el = audioRef.current
    if (!el || !current) return
    setHasStarted(true)
    if (el.paused) {
      ensureAnalyser(el)
      void el.play().catch(() => setIsPlaying(false))
    } else {
      el.pause()
    }
  }

  const skipTrack = () => {
    const el = audioRef.current
    if (!el || tracks.length === 0) return
    if (tracks.length > 1) {
      setCurrentIndex((prev) => shuffleIndex(tracks, prev))
      playFrom(el)
    } else {
      el.currentTime = 0
      ensureAnalyser(el)
      void el.play().catch(() => setIsPlaying(false))
    }
  }

  const toggleMute = () => {
    const el = audioRef.current
    if (!el) return
    el.muted = !el.muted
    setIsMuted(el.muted)
  }

  if (tracks.length === 0) return null

  const coverUrl = current?.cover_image ? resolveUrl(current.cover_image.url) : null

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
      className="fixed right-0 bottom-24 z-40"
    >
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        preload="auto"
        onPlay={() => {
          errorCountRef.current = 0
          setIsPlaying(true)
          resumeContext()
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          const el = audioRef.current
          if (!el) return
          if (tracks.length > 1) {
            pendingPlayRef.current = true
            setCurrentIndex((prev) => shuffleIndex(tracks, prev))
          } else {
            el.currentTime = 0
            void el.play().catch(() => setIsPlaying(false))
          }
        }}
        onError={() => {
          setIsPlaying(false)
          // A failed load is almost always systemic (offline, CORS, 5xx) rather
          // than one bad track, so stop after a couple of skips instead of
          // cycling the whole playlist.
          errorCountRef.current += 1
          const el = audioRef.current
          if (el && tracks.length > 1 && errorCountRef.current <= MAX_SKIPS) {
            pendingPlayRef.current = true
            setCurrentIndex((prev) => shuffleIndex(tracks, prev))
          } else {
            pendingPlayRef.current = false
          }
        }}
      />

      <div className="pointer-events-none relative h-44 w-44 sm:h-56 sm:w-56 lg:h-72 lg:w-72">
        {/* floating now-playing panel — big devices */}
        <div className="pointer-events-auto absolute right-4 bottom-full z-10 mb-4 hidden items-center overflow-hidden rounded-3xl border border-red-200/70 bg-gradient-to-br from-white via-red-50 to-red-500 px-3 py-2 shadow-xl shadow-red-500/30 backdrop-blur-xl isolate dark:border-red-500/40 dark:from-zinc-950 dark:via-red-950 dark:to-red-800 sm:right-[8rem] sm:bottom-auto sm:top-1/2 sm:mb-0 sm:-translate-y-1/2 sm:flex sm:gap-3 sm:px-4 sm:py-2.5">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-8 -left-6 h-20 w-20 rounded-full bg-red-500/40 blur-2xl dark:bg-red-500/50"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute right-2 -bottom-10 h-16 w-24 rounded-full bg-white/70 blur-xl dark:bg-red-400/25"
          />
          <div className="relative z-10 flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full shadow-lg shadow-red-500/40 ring-2 ring-white/70 dark:ring-red-400/60 sm:h-10 sm:w-10">
              {coverUrl ? (
                <SmartImage
                  src={coverUrl}
                  alt={current?.title ?? 'Track cover'}
                  draggable={false}
                  containerClassName="h-full w-full"
                  className="object-cover"
                  fallback={
                    <div className="grid h-full w-full place-items-center rounded-full bg-gradient-to-br from-red-600 to-red-800">
                      <Music2 className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                    </div>
                  }
                />
              ) : (
                <div className="grid h-full w-full place-items-center rounded-full bg-gradient-to-br from-red-600 to-red-800">
                  <Music2 className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                </div>
              )}
            </div>
            <div className="hidden h-5 w-8 items-end justify-center gap-[3px] sm:flex">
              {Array.from({ length: EQ_BARS }).map((_, i) => (
                <span
                  key={i}
                  ref={(node) => {
                    if (node) eqRefs.current[i] = node
                  }}
                  className="w-[3px] origin-bottom rounded-full bg-red-600/90 dark:bg-red-400/90"
                  style={{ height: '14%' }}
                />
              ))}
            </div>
            <div className="w-24 overflow-hidden sm:w-28">
              <div className={titleIsLong ? 'animate-marquee whitespace-nowrap' : 'truncate'}>
                <p className="bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-[11px] leading-tight font-bold text-transparent dark:from-white dark:via-red-100 dark:to-red-300 sm:text-xs">
                  {current?.title ?? '—'}
                </p>
              </div>
              <p className="truncate text-[10px] font-medium text-red-700/80 dark:text-red-200/90">
                {current?.artist || 'Unknown artist'}
              </p>
            </div>
            <div className="ml-1 flex items-center gap-1">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white shadow-lg shadow-red-600/50 ring-1 ring-white/40 transition-transform duration-150 hover:scale-105 active:scale-95 dark:from-white dark:to-red-200 dark:text-red-600 dark:shadow-red-950/50 dark:ring-red-900/20 sm:h-9 sm:w-9"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 fill-current" />
                ) : (
                  <Play className="h-4 w-4 translate-x-px fill-current" />
                )}
              </button>
              <button
                type="button"
                onClick={skipTrack}
                aria-label="Shuffle to next track"
                className="grid h-7 w-7 place-items-center rounded-full text-red-800/80 transition-all hover:bg-white/70 hover:text-red-700 active:scale-95 dark:text-red-100 dark:hover:bg-black/40 dark:hover:text-white sm:h-8 sm:w-8"
              >
                <SkipForward className="h-4 w-4 fill-current" />
              </button>
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="grid h-7 w-7 place-items-center rounded-full text-red-800/80 transition-all hover:bg-white/70 hover:text-red-700 active:scale-95 dark:text-red-100 dark:hover:bg-black/40 dark:hover:text-white sm:h-8 sm:w-8"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* the vinyl — half off the right edge, spins while playing */}
        <div className="pointer-events-none absolute inset-0">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
            className="pointer-events-auto group absolute top-0 right-0 block h-full w-full translate-x-1/2 cursor-pointer select-none outline-none"
          >
            <div
              className={`absolute inset-0 will-change-transform animate-spin-slow ${
                spinning ? '' : 'animate-spin-slow-paused'
              }`}
            >
              <img
                src="/disc.png"
                alt="Vinyl record"
                draggable={false}
                className="h-full w-full rounded-full object-cover drop-shadow-2xl drop-shadow-black/40 dark:drop-shadow-black/50"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    'conic-gradient(from 210deg, transparent 0deg, rgba(255,255,255,0.28) 40deg, transparent 90deg, transparent 300deg, rgba(255,255,255,0.08) 340deg, transparent 360deg)',
                }}
              />

              {/* small cover in the middle of the disc — rotates together at the same speed */}
              <div className="absolute top-1/2 left-1/2 h-[40%] w-[40%] -translate-x-1/2 -translate-y-1/2">
                <div className="relative grid h-full w-full place-items-center overflow-hidden rounded-full shadow-inner ring-1 ring-black/50 dark:ring-white/25">
                  {coverUrl ? (
                    <SmartImage
                      src={coverUrl}
                      alt={current?.title ?? 'Track cover'}
                      draggable={false}
                      containerClassName="h-full w-full"
                      className="object-cover"
                      fallback={
                        <div className="grid h-full w-full place-items-center rounded-full bg-gradient-to-br from-primary/30 via-background to-background">
                          <Music2 className="h-5 w-5 text-primary" />
                        </div>
                      }
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center rounded-full bg-gradient-to-br from-primary/30 via-background to-background">
                      <Music2 className="h-5 w-5 text-primary" />
                    </div>
                  )}
                </div>
                <span className="pointer-events-none absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow-sm" />
              </div>
            </div>

            {/* hover ring */}
            <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-primary/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>

          {/* ground shadow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-3 right-8 h-4 w-20 rounded-full bg-black/25 blur-md dark:bg-black/45"
          />
        </div>
      </div>
    </motion.div>
  )
}