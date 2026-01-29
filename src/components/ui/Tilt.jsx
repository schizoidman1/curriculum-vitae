import useTilt from '../../hooks/useTilt'

/**
 * Wrapper that applies 3D perspective tilt on hover.
 *
 * @param {React.ReactNode} children
 * @param {string} className
 * @param {Object} tiltOptions - Options for useTilt (maxTilt, perspective, scale, glare)
 */
export default function Tilt({ children, className = '', ...tiltOptions }) {
  const ref = useTilt(tiltOptions)

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
