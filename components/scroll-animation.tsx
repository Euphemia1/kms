"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ScrollAnimationProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "left" | "right" | "scale"
}

export function ScrollAnimation({ children, className, delay = 0, direction = "up" }: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible")
            }, delay)
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  const getInitialTransform = () => {
    switch (direction) {
      case "left":
        return "translate-x-[-50px]"
      case "right":
        return "translate-x-[50px]"
      case "scale":
        return "scale-95"
      default:
        return "translate-y-[30px]"
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        "opacity-0 transition-all duration-700 ease-out",
        getInitialTransform(),
        "[&.visible]:opacity-100 [&.visible]:translate-x-0 [&.visible]:translate-y-0 [&.visible]:scale-100",
        className,
      )}
    >
      {children}
    </div>
  )
}
