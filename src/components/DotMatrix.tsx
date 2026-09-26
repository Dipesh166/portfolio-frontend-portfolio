import { motion } from 'framer-motion'

export function DotMatrix() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="dot-grid absolute inset-0" />
      <motion.div
        className="absolute -left-36 -top-36 h-96 w-96 rounded-full bg-primary/15 blur-[130px]"
        animate={{ x: [0, 46, 0], y: [0, 64, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-44 top-1/3 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-[150px]"
        animate={{ x: [0, -54, 0], y: [0, 44, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-44 left-1/3 h-96 w-96 rounded-full bg-primary/10 blur-[130px]"
        animate={{ x: [0, 34, 0], y: [0, -58, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="matrix-vignette absolute inset-0" />
    </div>
  )
}