import { useEffect, useRef, useState } from 'react'

type UseTypewriterOptions = {
  speed?: number
  startDelay?: number
  startTyping?: boolean
}

export function useTypewriter(
  text: string,
  { speed = 36, startDelay = 0, startTyping = true }: UseTypewriterOptions = {},
) {
  const [display, setDisplay] = useState('')
  const [done, setDone] = useState(false)
  const timersRef = useRef<number[]>([])

  useEffect(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []

    const timers: number[] = []
    const reset = () => {
      setDisplay('')
      setDone(false)
    }

    if (!startTyping) {
      timers.push(window.setTimeout(reset, 0))
      timersRef.current = timers
      const active = timers
      return () => active.forEach((id) => window.clearTimeout(id))
    }

    timers.push(window.setTimeout(reset, 0))

    if (!text) {
      timers.push(window.setTimeout(() => setDone(true), 0))
      timersRef.current = timers
      const active = timers
      return () => active.forEach((id) => window.clearTimeout(id))
    }

    let index = 0
    const tick = () => {
      index += 1
      setDisplay(text.slice(0, index))
      if (index < text.length) {
        timers.push(window.setTimeout(tick, speed))
      } else {
        setDone(true)
      }
    }

    timers.push(window.setTimeout(tick, startDelay + 10))
    timersRef.current = timers
    const active = timers
    return () => active.forEach((id) => window.clearTimeout(id))
  }, [text, speed, startDelay, startTyping])

  return { display, done }
}