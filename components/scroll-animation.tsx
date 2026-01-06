"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

interface ScrollAnimationProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "left" | "right" | "scale"
}

export function ScrollAnimation({ children, className = '', delay = 0, direction = "up" }: ScrollAnimationProps) {
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

  // Simple inline styles approach to avoid Tailwind utility issues
  const getStyle = () => {
    if (isVisible) {
      return {
        opacity: 1,
        transform: 'translateX(0px) translateY(0px) scale(1)',
        transition: 'all 0.7s ease-out',
      };
    } else {
      switch (direction) {
        case "left":
          return {
            opacity: 0,
            transform: 'translateX(-48px)',
            transition: 'all 0.7s ease-out',
          };
        case "right":
          return {
            opacity: 0,
            transform: 'translateX(48px)',
            transition: 'all 0.7s ease-out',
          };
        case "scale":
          return {
            opacity: 0,
            transform: 'scale(0.95)',
            transition: 'all 0.7s ease-out',
          };
        default: // up
          return {
            opacity: 0,
            transform: 'translateY(28px)',
            transition: 'all 0.7s ease-out',
          };
      }
    }
  };

  return (
    <div
      ref={ref}
      style={getStyle()}
      className={className}
    >
      {children}
    </div>
  )
}
