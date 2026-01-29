/**
 * Subtle film grain / noise overlay.
 *
 * Uses an SVG feTurbulence filter rendered to a full-screen
 * div at very low opacity for a cinematic texture.
 */
export default function NoiseOverlay() {
  return (
    <>
      {/* Inline SVG filter for noise generation */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id="noise-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          filter: 'url(#noise-filter)',
          opacity: 0.03,
          mixBlendMode: 'overlay',
        }}
        aria-hidden="true"
      />
    </>
  )
}
