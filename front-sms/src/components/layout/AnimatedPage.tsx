"use client"

import { motion } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import { pageTransition } from "@/lib/animations"
import { cn } from "@/lib/utils"

interface AnimatedPageProps {
  children: React.ReactNode
  routeKey?: string
  className?: string
}

export function AnimatedPage({ children, routeKey, className }: AnimatedPageProps) {
  const shouldReduce = useReducedMotion()

  const variants = shouldReduce
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.05 } },
        exit: { opacity: 0, transition: { duration: 0.05 } },
      }
    : pageTransition

  return (
    <motion.div
      key={routeKey}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn("w-full", className)}
      style={{ pointerEvents: "auto" }}
    >
      {children}
    </motion.div>
  )
}
