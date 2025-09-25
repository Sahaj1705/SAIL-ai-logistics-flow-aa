"use client"

import type React from "react"

import { motion, type MotionProps } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface MotionWrapperProps extends MotionProps {
  children: React.ReactNode
  className?: string
  fallback?: React.ComponentType<{ children: React.ReactNode; className?: string }>
}

export function MotionWrapper({ children, className, fallback: Fallback = "div", ...motionProps }: MotionWrapperProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <Fallback className={className}>{children}</Fallback>
  }

  return (
    <motion.div className={className} {...motionProps}>
      {children}
    </motion.div>
  )
}
