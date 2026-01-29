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
  { title, subtitle, children, footer, expandable = false, compact = false, className = '', ...props },
  ref
) {
  return (
    <GlassPanel
      ref={ref}
      variant="elevated"
      interactive={expandable}
      className={className}
      contentClassName={compact ? '!p-5 md:!p-6' : ''}
      {...props}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className={compact ? 'mb-3' : 'mb-5'}>
          {title && (
            <h3 className={`liquid-glass-text font-semibold ${compact ? 'text-lg md:text-xl mb-1' : 'text-2xl md:text-3xl mb-2'}`}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p className={`text-white/50 ${compact ? 'text-sm' : 'text-base'}`}>{subtitle}</p>
          )}
        </div>
      )}

      {/* Body */}
      <div className={`text-white/80 leading-relaxed ${compact ? 'text-sm' : 'text-base'}`}>{children}</div>

      {/* Footer */}
      {footer && (
        <div className={`border-t border-white/10 ${compact ? 'mt-4 pt-3 pb-1' : 'mt-6 pt-5 pb-2'}`}>{footer}</div>
      )}
    </GlassPanel>
  )
})

export default GlassCard
