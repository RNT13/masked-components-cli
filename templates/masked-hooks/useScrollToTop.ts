'use client'  
  
import { useEffect } from 'react'  
  
type UseScrollToTopOptions = {  
  trigger?: unknown  
  behavior?: ScrollBehavior  
}  
  
export function useScrollToTop({ trigger, behavior = 'smooth' }: UseScrollToTopOptions = {}) {  
  useEffect(() => {  
    window.scrollTo({ top: 0, behavior })  
  }, [trigger, behavior])  
}