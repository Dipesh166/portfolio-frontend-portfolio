import { useEffect } from 'react'
import { cn } from 'cn'
import { useTypewriter } from '../hooks/useTypewriter'

type TypedLineProps = {
  text: string
  speed?: number
  startDelay?: number
  startTyping?: boolean
  showCaret?: boolean
  className?: string
  onDone?: () => void
}

export function TypedLine({
  text,
  speed,
  startDelay,
  startTyping = true,
  showCaret = true,
  className,
  onDone,
}: TypedLineProps) {
  const { display, done } = useTypewriter(text, { speed, startDelay, startTyping })

  useEffect(() => {
    if (done) onDone?.()
  }, [done, onDone])

  return (
    <span className={cn('inline-block', className)}>
      {display}
      {showCaret && !done ? (
        <span
          aria-hidden="true"
          className="caret ml-1 inline-block h-[0.9em] w-[0.5ch] translate-y-[0.14em] rounded-[1px] bg-current align-baseline"
        />
      ) : null}
    </span>
  )
}