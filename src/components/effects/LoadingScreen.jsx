import { useState, useEffect } from 'react'

/**
 * Themed loading screen with ocean/bubble animation.
 * Shows while app is initially loading.
 */
export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        // Non-linear progress for more realistic feel
        const increment = Math.random() * 15 + 5
        return Math.min(prev + increment, 100)
      })
    }, 150)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        setIsExiting(true)
        setTimeout(() => {
          onComplete?.()
        }, 800)
      }, 500)
    }
  }, [progress, onComplete])

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-800 ${
        isExiting ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'linear-gradient(180deg, #0a1628 0%, #0d2847 100%)',
      }}
    >
      {/* Animated bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-float"
            style={{
              width: `${Math.random() * 40 + 10}px`,
              height: `${Math.random() * 40 + 10}px`,
              left: `${Math.random() * 100}%`,
              bottom: `-${Math.random() * 20}%`,
              animationDuration: `${Math.random() * 5 + 5}s`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Central loader */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated logo/bubble */}
        <div className="relative w-32 h-32 mb-8">
          {/* Outer ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.83} 283`}
              className="transition-all duration-300"
            />
          </svg>

          {/* Inner bubble */}
          <div
            className="absolute inset-4 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 50%, transparent 70%)',
              boxShadow: '0 0 40px rgba(255,255,255,0.1), inset 0 0 30px rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <span className="text-2xl font-bold text-white/80">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-white/60 text-sm tracking-widest uppercase">
          Carregando
          <span className="inline-flex ml-1">
            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
          </span>
        </div>
      </div>

      {/* Wave animation at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        <svg
          className="absolute bottom-0 w-full"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(255,255,255,0.05)"
            className="animate-wave"
            d="M0,64 C320,120 420,0 740,64 C1060,128 1380,0 1440,64 L1440,120 L0,120 Z"
          />
          <path
            fill="rgba(255,255,255,0.03)"
            className="animate-wave-slow"
            d="M0,80 C360,40 560,120 880,80 C1200,40 1320,120 1440,80 L1440,120 L0,120 Z"
          />
        </svg>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateY(90vh) scale(1);
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-20vh) scale(0.5);
            opacity: 0;
          }
        }

        @keyframes wave {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-25%);
          }
        }

        @keyframes wave-slow {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(25%);
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-wave {
          animation: wave 8s ease-in-out infinite;
        }

        .animate-wave-slow {
          animation: wave-slow 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
