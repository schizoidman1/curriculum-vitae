import { forwardRef } from 'react'
import GlassPanel from '../ui/GlassPanel'

/**
 * Content card with liquid glass styling.
 *
 * Wraps GlassPanel with a consistent padding/sizing pattern
 * and optional header/footer slots.
 *
 * @param {string} title - Card heading
 * @param {string} subtitle - Secondary text
 * @param {React.ReactNode} children - Card body
 * @param {React.ReactNode} footer - Optional footer content
 * @param {boolean} expandable - Whether clicking expands the card
 * @param {string} className - Additional CSS classes
 */
const GlassCard = forwardRef(function GlassCard(
  { title, subtitle, children, footer, expandable = false, className = '', ...props },
  ref
) {
  return (
    <GlassPanel
      ref={ref}
      variant="elevated"
      interactive={expandable}
      className={className}
      {...props}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-5">
          {title && (
            <h3 className="liquid-glass-text text-2xl md:text-3xl font-semibold mb-2">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-base text-white/50">{subtitle}</p>
          )}
        </div>
      )}

      {/* Body */}
      <div className="text-white/80 leading-relaxed text-base">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="mt-6 pt-5 pb-2 border-t border-white/10">{footer}</div>
      )}
    </GlassPanel>
  )
})

export default GlassCard
