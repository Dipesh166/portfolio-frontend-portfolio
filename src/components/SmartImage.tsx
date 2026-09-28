import { useState, type ComponentProps, type ReactNode } from 'react'
import { cn } from 'cn'
import { Skeleton } from './ui/skeleton'

type SmartImageProps = Omit<ComponentProps<'img'>, 'src'> & {
  src?: string | null
  containerClassName?: string
  fallback?: ReactNode
  showTexture?: boolean
}

export function SmartImage({
  src,
  alt = '',
  className,
  containerClassName,
  fallback,
  showTexture = false,
  ...props
}: SmartImageProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  const loaded = loadedSrc === src
  const failed = failedSrc === src
  const pending = Boolean(src) && !loaded && !failed
  const showFallback = !src || failed

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      {showFallback ? (
        fallback ?? <div className="h-full w-full bg-gradient-to-b from-primary/15 via-primary/5 to-transparent" />
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoadedSrc(src ?? null)}
          onError={() => setFailedSrc(src ?? null)}
          className={cn(
            'h-full w-full transition-[opacity,filter,transform] duration-700 ease-out',
            loaded ? 'scale-100 opacity-100 blur-0' : 'scale-[1.06] opacity-0 blur-xl',
            className,
          )}
          {...props}
        />
      )}

      {pending ? <Skeleton className="absolute inset-0 h-full w-full rounded-none" /> : null}

      {showTexture && loaded ? (
        <span
          aria-hidden="true"
          className="dot-dense pointer-events-none absolute inset-0 opacity-15 mix-blend-multiply dark:mix-blend-screen"
        />
      ) : null}
    </div>
  )
}
