import { create } from 'zustand'

/**
 * Animation phases of the experience:
 *   0 - Entry: (unused, kept for compatibility)
 *   1 - Emergence: bubbles rise from bottom (initial phase)
 *   2 - Convergence: bubbles merge toward center
 *   3 - Central Bubble: large bubble with text, awaiting click
 *   4 - Explosion: bubble expands to fill screen, crossfade
 *   5 - Curriculum: horizontal scroll CV layout
 */
export const PHASES = {
  ENTRY: 0,
  EMERGENCE: 1,
  CONVERGENCE: 2,
  CENTRAL_BUBBLE: 3,
  EXPLOSION: 4,
  CURRICULUM: 5,
}

/**
 * Global application state.
 * Controls phase progression, audio, and UI preferences.
 */
const useAppStore = create((set, get) => ({
  // --- Phase management ---
  phase: PHASES.EMERGENCE, // Start immediately at Phase 1
  setPhase: (phase) => set({ phase }),

  /** Advance to the next sequential phase (clamped to max) */
  nextPhase: () => {
    const current = get().phase
    if (current < PHASES.CURRICULUM) {
      set({ phase: current + 1 })
    }
  },

  /** Skip the entire intro and jump straight to the curriculum */
  skipIntro: () => set({ phase: PHASES.CURRICULUM }),

  // --- Audio ---
  audioEnabled: false,
  setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),

  // --- Intro state ---
  introComplete: false,
  setIntroComplete: (complete) => set({ introComplete: complete }),

  // --- Reduced motion preference ---
  prefersReducedMotion: false,
  setPrefersReducedMotion: (value) => set({ prefersReducedMotion: value }),

  // --- Horizontal scroll progress (0 to 1) ---
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
}))

export default useAppStore
