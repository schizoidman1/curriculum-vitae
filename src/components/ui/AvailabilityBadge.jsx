import { useState } from 'react'
import { Briefcase, Clock, X } from 'lucide-react'

/**
 * Availability indicator badge that shows hiring/freelance status.
 * Expandable to show more details.
 */
export default function AvailabilityBadge({
  available = true,
  type = 'freelance', // 'freelance' | 'fulltime' | 'both'
  message = '',
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
        className="fixed top-6 right-6 z-40 liquid-glass-subtle px-4 py-2 rounded-full flex items-center gap-3 hover:scale-105 transition-transform group"
        aria-label="Ver disponibilidade"
      >
        {/* Pulsing dot */}
        <span className="relative flex h-3 w-3">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status.color}`}
          />
          <span
            className={`relative inline-flex rounded-full h-3 w-3 ${status.color}`}
            style={{ boxShadow: `0 0 10px ${status.glowColor}` }}
          />
        </span>

        <span className="text-sm text-white/80 group-hover:text-white transition-colors">
          {status.text}
        </span>
      </button>

      {/* Expanded modal */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setIsExpanded(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal content */}
          <div
            className="relative liquid-glass-elevated rounded-2xl p-8 max-w-md w-full animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>

            {/* Status header */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`w-16 h-16 rounded-full ${status.color} bg-opacity-20 flex items-center justify-center`}
                style={{ boxShadow: `0 0 30px ${status.glowColor}` }}
              >
                <Icon size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white">
                  {status.text}
                </h3>
                <p className="text-white/60">{typeLabels[type]}</p>
              </div>
            </div>

            {/* Message */}
            {message && (
              <p className="text-white/70 leading-relaxed mb-6">{message}</p>
            )}

            {/* CTA */}
            {available && (
              <a
                href="#contact"
                onClick={() => setIsExpanded(false)}
                className="block w-full text-center liquid-glass-subtle px-6 py-3 rounded-full text-white/80 hover:text-white hover:scale-[1.02] transition-all"
              >
                Entre em contato
              </a>
            )}
          </div>
        </div>
      )}
    </>
  )
}
