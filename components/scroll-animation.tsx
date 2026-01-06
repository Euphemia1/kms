"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ScrollAnimationProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "left" | "right" | "scale"
}

export function ScrollAnimation({ children, className, delay = 0, direction = "up" }: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true)
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
  }, [delay, direction])

  const getInitialTransform = () => {
    switch (direction) {
      case "left":
        return "-translate-x-12"
      case "right":
        return "translate-x-12"
      case "scale":
        return "scale-95"
      default:
        return "translate-y-7"
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible 
          ? "opacity-100 translate-x-0 translate-y-0 scale-100" 
          : `opacity-0 ${getInitialTransform()}`,
        className,
      )}
    >
      {children}
    </div>
  )
}
