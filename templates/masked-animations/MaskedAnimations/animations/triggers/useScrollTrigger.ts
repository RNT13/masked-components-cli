import { useInView } from '@/hooks/useInView'

export function useScrollTrigger(threshold?: number, once?: boolean) {
  const { ref, isVisible } = useInView<HTMLDivElement>(threshold, once)

  return { ref, active: isVisible }
}
