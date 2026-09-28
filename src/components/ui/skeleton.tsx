import { cn } from "cn"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("skeleton rounded-md", className)}
      {...props}
    />
  )
}

const LINE_WIDTHS = [
  "w-full",
  "w-11/12",
  "w-4/5",
  "w-full",
  "w-2/3",
  "w-5/6",
  "w-full",
  "w-3/4",
] as const

function SkeletonText({
  lines = 3,
  className,
  lineClassName,
}: {
  lines?: number
  className?: string
  lineClassName?: string
}) {
  return (
    <div data-slot="skeleton-text" className={cn("space-y-2.5", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-3.5", LINE_WIDTHS[i % LINE_WIDTHS.length], lineClassName)}
        />
      ))}
    </div>
  )
}

export { Skeleton, SkeletonText }
