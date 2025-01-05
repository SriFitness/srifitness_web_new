import * as React from "react"
import { cn } from "@/lib/utils"

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface WaveSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const WaveSkeleton = React.forwardRef<HTMLDivElement, WaveSkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("animate-wave bg-gradient-to-r from-transparent via-muted to-transparent bg-[length:200%_100%]", className)}
        {...props}
      />
    )
  }
)
WaveSkeleton.displayName = "WaveSkeleton"

export { WaveSkeleton }

