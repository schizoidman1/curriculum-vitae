import useMagnetic from '../../hooks/useMagnetic'

/**
 * Wrapper that applies magnetic cursor attraction.
 *
 * @param {React.ReactNode} children
 * @param {string} className
 * @param {number} strength - Pull strength (default 0.35)
 */
export default function MagneticIcon({ children, className = '', strength = 0.35, ...props }) {
  const ref = useMagnetic(strength)

  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  )
}
