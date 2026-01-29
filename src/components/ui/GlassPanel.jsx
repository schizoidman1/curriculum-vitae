import { forwardRef } from 'react'

/**
 * Base glass morphism panel using SVG-filter distortion.
 *
 * Structure (for default / elevated):
 *   <div .liquid-glass[-elevated]>   ← outer shell, isolation: isolate
 *     ::before                       ← tint + inner shadow (z-index: 0)
 *     ::after                        ← backdrop-blur + SVG distortion (z-index: -1)
 *     <div .liquid-glass-content>    ← children wrapper (z-index: 10)
 *       {children}
 *     </div>
 *   </div>
 *
 * The subtle variant uses a simpler single-layer approach (no pseudo-element
 * layers, no content wrapper needed) since it's used on small inline elements.
 *
 * @param {'default'|'elevated'|'subtle'} variant - Glass intensity
 * @param {boolean} interactive - Adds hover/press effects
 * @param {boolean} pulse - Adds pulsing glow animation
 * @param {string} className - Additional CSS classes applied to outer shell
 * @param {React.ReactNode} children
 */
const GlassPanel = forwardRef(function GlassPanel(
  { variant = 'default', interactive = false, pulse = false, className = '', contentClassName = '', children, ...props },
  ref
) {
  const variantClass = {
    default: 'liquid-glass',
    elevated: 'liquid-glass-elevated',
    subtle: 'liquid-glass-subtle',
  }[variant]

  const outerClasses = [
    variantClass,
    interactive && 'liquid-glass-interactive',
    pulse && 'liquid-glass-pulse',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  // Subtle variant: single-layer, no content wrapper needed
  if (variant === 'subtle') {
    return (
      <div ref={ref} className={outerClasses} {...props}>
        {children}
      </div>
    )
  }

  const contentClasses = ['liquid-glass-content', contentClassName]
    .filter(Boolean)
    .join(' ')

  // Default / Elevated: 3-layer with content wrapper
  return (
    <div ref={ref} className={outerClasses} {...props}>
      <div className={contentClasses}>
        {children}
      </div>
    </div>
  )
})

export default GlassPanel
