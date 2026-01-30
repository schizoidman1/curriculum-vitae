import { useState } from 'react'
import { Briefcase, Clock, X, Mail, Linkedin, Github } from 'lucide-react'

/**
 * Availability indicator badge that shows hiring/freelance status.
 * Expandable to show more details and contact info.
 */
export default function AvailabilityBadge({
  available = true,
  type = 'freelance', // 'freelance' | 'fulltime' | 'both'
  message = '',
  email = '',
  linkedin = '',
  github = '',
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const statusConfig = {
    available: {
      color: 'bg-emerald-500',
      glowColor: 'rgba(16, 185, 129, 0.5)',
      text: 'Disponível',
      icon: Briefcase,
    },
    unavailable: {
      color: 'bg-amber-500',
      glowColor: 'rgba(245, 158, 11, 0.5)',
      text: 'Indisponível',
      icon: Clock,
    },
  }

  const typeLabels = {
    freelance: 'para Freelance',
    fulltime: 'para CLT/PJ',
    both: 'para Freelance e CLT/PJ',
  }

  const status = available ? statusConfig.available : statusConfig.unavailable
  const Icon = status.icon

  return (
    <>
      {/* Fixed badge */}
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed top-4 right-0 mr-4 md:top-6 md:mr-6 z-[100] liquid-glass-subtle px-3 py-2 md:px-4 rounded-full flex items-center gap-2 md:gap-3 hover:scale-105 active:scale-95 transition-transform group max-w-[calc(100vw-2rem)]"
        style={{ touchAction: 'manipulation' }}
        aria-label="Ver disponibilidade"
      >
        {/* Pulsing dot */}
        <span className="relative flex h-3 w-3 flex-shrink-0">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status.color}`}
          />
          <span
            className={`relative inline-flex rounded-full h-3 w-3 ${status.color}`}
            style={{ boxShadow: `0 0 10px ${status.glowColor}` }}
          />
        </span>

        <span className="text-xs md:text-sm text-white/80 group-hover:text-white transition-colors truncate">
          {status.text}
        </span>
      </button>

      {/* Expanded modal */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4"
          onClick={() => setIsExpanded(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal content */}
          <div
            className="relative liquid-glass-elevated rounded-2xl p-6 md:p-8 max-w-md w-full animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-3 right-3 md:top-4 md:right-4 text-white/40 hover:text-white active:scale-90 transition-all"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>

            {/* Status header */}
            <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
              <div
                className={`w-12 h-12 md:w-16 md:h-16 rounded-full ${status.color} bg-opacity-20 flex items-center justify-center flex-shrink-0`}
                style={{ boxShadow: `0 0 30px ${status.glowColor}` }}
              >
                <Icon size={24} className="text-white md:hidden" />
                <Icon size={28} className="text-white hidden md:block" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-white">
                  {status.text}
                </h3>
                <p className="text-sm md:text-base text-white/60">{typeLabels[type]}</p>
              </div>
            </div>

            {/* Message */}
            {message && (
              <p className="text-sm md:text-base text-white/70 leading-relaxed mb-5 md:mb-6">{message}</p>
            )}

            {/* Contact links */}
            {available && (email || linkedin || github) && (
              <div className="flex flex-col gap-2 md:gap-3">
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 liquid-glass-subtle px-4 py-3 rounded-xl text-white/80 hover:text-white active:scale-[0.98] hover:scale-[1.02] transition-all"
                  >
                    <Mail size={20} className="flex-shrink-0" />
                    <span className="text-sm truncate">{email}</span>
                  </a>
                )}
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 liquid-glass-subtle px-4 py-3 rounded-xl text-white/80 hover:text-white active:scale-[0.98] hover:scale-[1.02] transition-all"
                  >
                    <Linkedin size={20} className="flex-shrink-0" />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                )}
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 liquid-glass-subtle px-4 py-3 rounded-xl text-white/80 hover:text-white active:scale-[0.98] hover:scale-[1.02] transition-all"
                  >
                    <Github size={20} className="flex-shrink-0" />
                    <span className="text-sm">GitHub</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
