import { useEffect, useState } from "react"

export function useCountUp(target: number, duration = 800): number {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (target === 0) {
      setValue(0)
      return
    }

    let frameId: number
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))

      if (progress < 1) {
        frameId = requestAnimationFrame(tick)
      } else {
        setValue(target) // garantizar convergencia exacta
      }
    }

    frameId = requestAnimationFrame(tick)

    return () => {
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [target, duration])

  return value
}
