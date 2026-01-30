import { useEffect, useRef } from 'react'

/**
 * Visual effects for Easter eggs.
 *
 * @param {string} activeEgg - Currently active easter egg ('konami' | 'matrix' | 'avatar')
 * @param {boolean} konamiUnlocked - Whether the Konami code has been unlocked (persists)
 */
export default function EasterEggEffects({ activeEgg, konamiUnlocked }) {
  const canvasRef = useRef(null)

  // Matrix rain effect
  useEffect(() => {
    if (activeEgg !== 'matrix' || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Matrix-style characters with Japanese katakana
    const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    const numbers = '0123456789'
    const chars = katakana + numbers

    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops = Array(Math.floor(columns)).fill(1)

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#0f0'
      ctx.font = `${fontSize}px 'Courier New', monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 33)
    return () => clearInterval(interval)
  }, [activeEgg])

  // Konami liquid glass bubbles effect (persists after unlock)
  useEffect(() => {
    if (!konamiUnlocked) return

    const bubbles = []
    const container = document.createElement('div')
    container.className = 'fixed inset-0 pointer-events-none z-[200] overflow-hidden'
    document.body.appendChild(container)

    // Pop effect function
    const createPopEffect = (x, y, size) => {
      const particleCount = 8
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div')
        const angle = (i / particleCount) * Math.PI * 2
        const particleSize = size * 0.15
        particle.style.cssText = `
          position: absolute;
          width: ${particleSize}px;
          height: ${particleSize}px;
          left: ${x}%;
          top: ${y}px;
          border-radius: 50%;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(255, 255, 255, 0.6),
            rgba(255, 255, 255, 0.2)
          );
          pointer-events: none;
          transform: translate(-50%, -50%);
        `
        container.appendChild(particle)

        // Animate particle outward
        const speed = 3 + Math.random() * 2
        const vx = Math.cos(angle) * speed
        const vy = Math.sin(angle) * speed
        let px = 0, py = 0, opacity = 1

        const animateParticle = () => {
          px += vx
          py += vy
          opacity -= 0.05

          if (opacity <= 0) {
            particle.remove()
            return
          }

          particle.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px)) scale(${opacity})`
          particle.style.opacity = opacity
          requestAnimationFrame(animateParticle)
        }
        requestAnimationFrame(animateParticle)
      }

      // Create ring effect
      const ring = document.createElement('div')
      ring.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.5);
        transform: translate(-50%, -50%) scale(1);
        pointer-events: none;
      `
      container.appendChild(ring)

      let ringScale = 1, ringOpacity = 0.5
      const animateRing = () => {
        ringScale += 0.08
        ringOpacity -= 0.03

        if (ringOpacity <= 0) {
          ring.remove()
          return
        }

        ring.style.transform = `translate(-50%, -50%) scale(${ringScale})`
        ring.style.opacity = ringOpacity
        requestAnimationFrame(animateRing)
      }
      requestAnimationFrame(animateRing)
    }

    // Create liquid glass bubbles
    const createBubble = () => {
      const size = Math.random() * 60 + 20
      const bubble = document.createElement('div')
      bubble.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        bottom: -${size}px;
        border-radius: 50%;
        background: radial-gradient(
          ellipse at 30% 30%,
          rgba(255, 255, 255, 0.4) 0%,
          rgba(255, 255, 255, 0.1) 40%,
          rgba(255, 255, 255, 0.05) 60%,
          transparent 100%
        );
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow:
          inset 0 0 20px rgba(255, 255, 255, 0.1),
          0 8px 32px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        transition: transform 0.1s ease-out;
      `
      container.appendChild(bubble)
      return {
        el: bubble,
        x: parseFloat(bubble.style.left),
        y: window.innerHeight + size,
        size,
        speedY: Math.random() * 2 + 1.5,
        wobbleSpeed: Math.random() * 0.03 + 0.02,
        wobbleAmount: Math.random() * 30 + 10,
        wobbleOffset: Math.random() * Math.PI * 2,
        time: 0,
        popping: false,
      }
    }

    // Initial bubbles
    for (let i = 0; i < 40; i++) {
      bubbles.push(createBubble())
    }

    // Animate bubbles rising
    let animationId
    const animate = () => {
      bubbles.forEach((b, index) => {
        if (b.popping) return

        b.time += 1
        b.y -= b.speedY

        // Wobble side to side
        const wobble = Math.sin(b.time * b.wobbleSpeed + b.wobbleOffset) * b.wobbleAmount

        // Slight scale pulsing
        const scalePulse = 1 + Math.sin(b.time * 0.05) * 0.05

        b.el.style.bottom = `${window.innerHeight - b.y}px`
        b.el.style.transform = `translateX(${wobble}px) scale(${scalePulse})`

        // Pop when bubble reaches top
        if (b.y < b.size) {
          b.popping = true
          const rect = b.el.getBoundingClientRect()
          createPopEffect(b.x, rect.top + b.size / 2, b.size)
          b.el.style.transform = `translateX(${wobble}px) scale(1.3)`
          b.el.style.opacity = '0'

          // Remove and create new bubble
          setTimeout(() => {
            b.el.remove()
            bubbles[index] = createBubble()
          }, 100)
        }
      })
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      container.remove()
    }
  }, [konamiUnlocked])

  if (!activeEgg && !konamiUnlocked) return null

  return (
    <>
      {/* Matrix effect canvas */}
      {activeEgg === 'matrix' && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 z-200 pointer-events-none"
          style={{ opacity: 0.8 }}
        />
      )}

      {/* Avatar secret message */}
      {activeEgg === 'avatar' && (
        <div className="fixed inset-0 z-200 flex items-center justify-center pointer-events-none">
          <div
            className="liquid-glass-elevated px-8 py-6 rounded-2xl text-center animate-in fade-in zoom-in duration-300"
            style={{
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <p className="text-2xl mb-2">🎉</p>
            <p className="text-white text-lg font-medium">
              Você descobriu um segredo!
            </p>
            <p className="text-white/60 text-sm mt-2">
              Obrigado por explorar meu portfólio!
            </p>
          </div>
        </div>
      )}

      {/* Konami code celebration message (temporary) */}
      {activeEgg === 'konami' && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-201 pointer-events-none">
          <div
            className="text-center animate-in fade-in zoom-in duration-500"
            style={{
              textShadow: '0 0 20px rgba(255,255,255,0.5)',
            }}
          >
            <img
              src="/affiliations/konami.png"
              alt="Konami"
              className="w-32 h-auto mx-auto mb-4 drop-shadow-[0_0_20px_rgba(255,50,50,0.8)]"
            />
            <p className="text-white text-3xl font-bold tracking-wider">
              KONAMI CODE!
            </p>
            <p className="text-white/60 text-lg mt-2">
              +30 vidas desbloqueadas
            </p>
          </div>
        </div>
      )}

      {/* RPG-style health and mana bars (persist after Konami unlock) */}
      {konamiUnlocked && (
        <div className="fixed top-6 left-6 z-201 pointer-events-none animate-in slide-in-from-left duration-500">
          <div className="flex flex-col gap-2">
            {/* Health bar */}
            <div className="flex items-center gap-2">
              <span className="text-red-400 text-sm font-bold w-8">HP</span>
              <div className="w-48 h-5 bg-black/60 rounded-full overflow-hidden border border-red-500/50">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full"
                  style={{ width: '100%' }}
                />
              </div>
              <span className="text-red-400 text-xs font-mono">999/999</span>
            </div>

            {/* Mana bar */}
            <div className="flex items-center gap-2">
              <span className="text-blue-400 text-sm font-bold w-8">MP</span>
              <div className="w-48 h-5 bg-black/60 rounded-full overflow-hidden border border-blue-500/50">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                  style={{ width: '100%' }}
                />
              </div>
              <span className="text-blue-400 text-xs font-mono">999/999</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
