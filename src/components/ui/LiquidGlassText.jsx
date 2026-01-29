import { forwardRef } from 'react'

/**
 * Text rendered with the liquid glass aesthetic.
 * Uses text-shadow and backdrop blur for a glass-embedded feel.
 *
 * @param {'h1'|'h2'|'h3'|'p'|'span'} as - HTML element to render
 * @param {string} className - Additional CSS classes
 * @param {React.ReactNode} children
 */
const LiquidGlassText = forwardRef(function LiquidGlassText(
  { as: Tag = 'span', className = '', children, ...props },
  ref
) {
  return (
    <Tag
      ref={ref}
      className={`liquid-glass-text ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
})

export default LiquidGlassText
