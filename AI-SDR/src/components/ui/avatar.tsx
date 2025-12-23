"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type ImageLoadingStatus = "idle" | "loading" | "loaded" | "error"

type AvatarContextValue = {
  imageLoadingStatus: ImageLoadingStatus
  setImageLoadingStatus: (status: ImageLoadingStatus) => void
}

const AvatarContext = React.createContext<AvatarContextValue | null>(null)

function useAvatarContext() {
  const ctx = React.useContext(AvatarContext)
  if (!ctx) {
    throw new Error("Avatar components must be used within <Avatar />")
  }
  return ctx
}

const Avatar = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => {
    const [imageLoadingStatus, setImageLoadingStatus] =
      React.useState<ImageLoadingStatus>("idle")

    return (
      <AvatarContext.Provider value={{ imageLoadingStatus, setImageLoadingStatus }}>
        <div
          ref={ref}
          data-slot="avatar"
          className={cn(
            "relative flex size-8 shrink-0 overflow-hidden rounded-full",
            className
          )}
          {...props}
        />
      </AvatarContext.Provider>
    )
  }
)
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ComponentPropsWithoutRef<"img">
>(({ className, src, onLoad, onError, ...props }, ref) => {
  const { setImageLoadingStatus } = useAvatarContext()

  React.useEffect(() => {
    if (!src) {
      setImageLoadingStatus("error")
      return
    }
    setImageLoadingStatus("loading")
  }, [src, setImageLoadingStatus])

  return (
    <img
      ref={ref}
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      src={src}
      onLoad={(e) => {
        setImageLoadingStatus("loaded")
        onLoad?.(e)
      }}
      onError={(e) => {
        setImageLoadingStatus("error")
        onError?.(e)
      }}
      {...props}
    />
  )
})
AvatarImage.displayName = "AvatarImage"

type AvatarFallbackProps = React.ComponentPropsWithoutRef<"div"> & {
  delayMs?: number
}

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, delayMs, ...props }, ref) => {
    const { imageLoadingStatus } = useAvatarContext()
    const [canRender, setCanRender] = React.useState(delayMs ? false : true)

    React.useEffect(() => {
      if (!delayMs) return
      setCanRender(false)
      const id = window.setTimeout(() => setCanRender(true), delayMs)
      return () => window.clearTimeout(id)
    }, [delayMs])

    if (imageLoadingStatus === "loaded") return null
    if (!canRender) return null

    return (
      <div
        ref={ref}
        data-slot="avatar-fallback"
        className={cn(
          "bg-muted flex size-full items-center justify-center rounded-full",
          className
        )}
        {...props}
      />
    )
  }
)
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
