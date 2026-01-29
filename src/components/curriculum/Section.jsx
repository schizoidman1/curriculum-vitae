import { forwardRef } from 'react'

/**
 * A single section within the horizontal scroll layout.
 *
 * Each section takes up the full viewport width/height
 * and is placed side-by-side in the scroll container.
 *
 * @param {string} id - Section identifier (used for navigation)
 * @param {string} className - Additional CSS classes
 * @param {React.ReactNode} children
 */
const Section = forwardRef(function Section(
  { id, className = '', children, ...props },
  ref
) {
  return (
    <section
      ref={ref}
      id={id}
      className={`flex-shrink-0 w-screen h-screen flex items-center justify-center px-8 md:px-16 lg:px-24 ${className}`}
      role="region"
      aria-label={id}
      {...props}
    >
      <div className="w-full max-w-5xl">{children}</div>
    </section>
  )
})

export default Section
