import { useState, useEffect } from 'react'
import {
  ChevronsDown,
  Github,
  Linkedin,
  Instagram,
  Mail,
  MapPin,
} from 'lucide-react'
import useHorizontalScroll from '../../hooks/useHorizontalScroll'
import useCurriculumSounds from '../../hooks/useCurriculumSounds'
import useAppStore, { PHASES } from '../../stores/appStore'
import GlassCard from './GlassCard'
import GlassPanel from '../ui/GlassPanel'
import LiquidGlassText from '../ui/LiquidGlassText'
import Tilt from '../ui/Tilt'
import MagneticIcon from '../ui/MagneticIcon'
import Timeline from './Timeline'
import curriculum from '../../data/curriculum'

/** Map platform keys to Lucide icon components */
const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
}

/**
 * Phase 5: Curriculum layout.
 *
 * Mobile: Fully vertical scroll
 * Desktop: Hybrid vertical + horizontal pinned scroll
 */
export default function HorizontalScroll() {
  const phase = useAppStore((s) => s.phase)
  const isActive = phase === PHASES.CURRICULUM
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const { wrapperRef, trackRef } = useHorizontalScroll(isActive && !isMobile)
  const { clickSoundProps } = useCurriculumSounds()

  if (!isActive) return null

  const { personal, experience, projects, affiliations } = curriculum

  // ============================================
  // MOBILE LAYOUT - Fully vertical
  // ============================================
  if (isMobile) {
    return (
      <main role="main" aria-label="Currículo" className="pb-24">
        {/* --- HERO --- */}
        <section className="min-h-[85vh] flex items-center justify-center px-5 py-10 relative">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="liquid-glass-bubble w-24 h-24 flex items-center justify-center overflow-hidden">
              {personal.avatar ? (
                <img
                  src={personal.avatar}
                  alt={personal.name}
                  className="w-full h-full object-cover relative z-10 rounded-full"
                />
              ) : (
                <span className="text-3xl opacity-60 relative z-10">
                  {personal.name.charAt(0)}
                </span>
              )}
            </div>

            <LiquidGlassText as="h1" className="text-3xl font-bold tracking-tight">
              {personal.name}
            </LiquidGlassText>

            <LiquidGlassText as="h2" className="text-base font-light">
              {personal.title}
            </LiquidGlassText>

            <p className="text-xs opacity-40 flex items-center gap-1.5">
              <MapPin size={12} />
              {personal.location}
            </p>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
            <ChevronsDown size={20} />
          </div>
        </section>

        {/* --- ABOUT --- */}
        <section className="px-5 py-16">
          <GlassPanel variant="default">
            <p className="text-white/80 leading-relaxed text-sm">
              {personal.bio}
            </p>
          </GlassPanel>

          <div className="flex flex-wrap justify-center gap-5 mt-8">
            {affiliations.map((aff) => (
              <a
                key={aff.id}
                href={aff.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center"
                {...clickSoundProps}
              >
                <div className="liquid-glass-bubble w-14 h-14 mt-8 flex items-center justify-center overflow-hidden">
                  <img
                    src={aff.image}
                    alt={aff.name}
                    className="w-full h-full object-cover relative z-10 rounded-full"
                  />
                </div>
                <p className="text-center text-[10px] text-white/50 mt-1.5">
                  {aff.name}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* --- EXPERIENCE --- */}
        <section className="px-5 py-16">
          <LiquidGlassText as="h2" className="text-3xl font-semibold mb-6 text-center">
            Experiência
          </LiquidGlassText>
          <Timeline items={experience} />
        </section>

        {/* --- PROJECTS --- */}
        <section className="px-5 py-16">
          <LiquidGlassText as="h2" className="text-3xl font-semibold mb-6 text-center">
            Projetos
          </LiquidGlassText>
          <div className="flex flex-col gap-4">
            {projects.map((project) => (
              <a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                {...clickSoundProps}
              >
                <GlassPanel variant="default">
                  <h3 className="liquid-glass-text text-lg font-semibold mb-2">
                    {project.title}
                  </h3>
                  <p className="text-white/70 text-xs mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="liquid-glass-subtle text-[9px] px-1.5 py-0.5 rounded-full text-white/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </GlassPanel>
              </a>
            ))}
          </div>
        </section>

        {/* --- CONTACT --- */}
        <section className="px-5 py-16">
          <LiquidGlassText as="h2" className="text-xl font-semibold mb-6 text-center">
            Contato
          </LiquidGlassText>
          <GlassPanel variant="default">
            <div className="flex flex-col gap-4 items-center">
              {personal.emails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="liquid-glass-subtle px-4 py-2 rounded-full text-white/80 flex items-center gap-2 text-xs"
                  {...clickSoundProps}
                >
                  <Mail size={14} />
                  {email}
                </a>
              ))}

              <div className="flex gap-3">
                {Object.entries(personal.social).map(([platform, url]) => {
                  const Icon = socialIcons[platform]
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="liquid-glass-subtle w-10 h-10 rounded-full flex items-center justify-center text-white/60"
                      aria-label={`Perfil no ${platform}`}
                      {...clickSoundProps}
                    >
                      {Icon ? <Icon size={18} /> : platform.slice(0, 2).toUpperCase()}
                    </a>
                  )
                })}
              </div>
            </div>
          </GlassPanel>
        </section>
      </main>
    )
  }

  // ============================================
  // DESKTOP LAYOUT - Horizontal scroll
  // ============================================
  return (
    <main role="main" aria-label="Currículo">
      {/* --- HERO --- */}
      <section
        id="hero"
        className="relative h-screen flex items-center justify-center px-8"
      >
        <div
          data-anim="hero-content"
          className="flex flex-col items-center text-center gap-6"
        >
          <div className="liquid-glass-bubble w-48 h-48 flex items-center justify-center overflow-hidden">
            {personal.avatar ? (
              <img
                src={personal.avatar}
                alt={personal.name}
                className="w-full h-full object-cover relative z-10 rounded-full"
              />
            ) : (
              <span className="text-6xl opacity-60 relative z-10">
                {personal.name.charAt(0)}
              </span>
            )}
          </div>

          <LiquidGlassText as="h1" className="text-8xl font-bold tracking-tight">
            {personal.name}
          </LiquidGlassText>

          <LiquidGlassText as="h2" className="text-3xl font-light">
            {personal.title}
          </LiquidGlassText>

          <p className="text-base opacity-40 mt-3 flex items-center gap-2">
            <MapPin size={18} />
            {personal.location}
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <ChevronsDown size={28} />
        </div>
      </section>

      {/* --- ABOUT --- */}
      <section
        id="about"
        className="relative min-h-screen flex items-center justify-center px-8 py-24"
      >
        <div data-anim="about-content" className="w-full max-w-4xl mx-auto">
          <Tilt maxTilt={4} scale={1.01}>
            <GlassPanel variant="elevated">
              <p className="text-white/80 leading-relaxed text-xl">
                {personal.bio}
              </p>
            </GlassPanel>
          </Tilt>
        </div>
      </section>

      {/* --- AFFILIATIONS --- */}
      <section
        id="affiliations"
        className="relative min-h-screen flex items-center justify-center px-8 py-24 mb-16"
      >
        <div data-anim="affiliations-content" className="w-full max-w-4xl mx-auto text-center">
          <LiquidGlassText as="h2" className="text-5xl font-semibold mb-16">
            Filiações
          </LiquidGlassText>
          <div className="flex flex-wrap justify-center gap-16">
            {affiliations.map((aff) => (
              <a
                key={aff.id}
                href={aff.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center"
                {...clickSoundProps}
              >
                <Tilt maxTilt={8} scale={1.05}>
                  <div className="liquid-glass-bubble w-32 h-32 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={aff.image}
                      alt={aff.name}
                      className="w-full h-full object-cover relative z-10 rounded-full"
                    />
                  </div>
                </Tilt>
                <p className="text-center text-lg text-white/50 mt-4 group-hover:text-white/80 transition-colors">
                  {aff.name}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* --- HORIZONTAL ZONE --- */}
      <div ref={wrapperRef} className="relative h-screen overflow-hidden">
        <div ref={trackRef} className="flex h-screen will-change-transform">
          {/* EXPERIENCE */}
          <section
            data-h-section
            className="shrink-0 w-screen h-screen flex items-center justify-center px-16 lg:px-24"
            aria-label="Experiência"
          >
            <div className="w-full max-w-6xl">
              <div data-h-heading>
                <LiquidGlassText as="h2" className="text-5xl font-semibold mb-12 text-center">
                  Experiência
                </LiquidGlassText>
              </div>
              <div data-h-item>
                <Timeline items={experience} />
              </div>
            </div>
          </section>

          {/* PROJECTS */}
          <section
            data-h-section
            className="shrink-0 w-screen h-screen flex items-center justify-center px-16 lg:px-24"
            aria-label="Projetos"
          >
            <div className="w-full max-w-6xl">
              <div data-h-heading>
                <LiquidGlassText as="h2" className="text-5xl font-semibold mb-12 text-center">
                  Projetos
                </LiquidGlassText>
              </div>
              <div className="grid grid-cols-2 gap-5">
                {projects.map((project) => (
                  <div key={project.id} data-h-item>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                      {...clickSoundProps}
                    >
                      <Tilt maxTilt={6} scale={1.02}>
                        <GlassCard
                          title={project.title}
                          expandable
                          compact
                          footer={
                            <div className="flex flex-wrap gap-1.5">
                              {project.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className="liquid-glass-subtle text-[11px] px-2 py-1 rounded-full text-white/70"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          }
                        >
                          {project.description}
                        </GlassCard>
                      </Tilt>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CONTACT */}
          <section
            data-h-section
            className="shrink-0 w-screen h-screen flex items-center justify-center px-16 lg:px-24"
            aria-label="Contato"
          >
            <div className="text-center">
              <div data-h-heading>
                <LiquidGlassText as="h2" className="text-3xl font-semibold mb-12">
                  Contato
                </LiquidGlassText>
              </div>

              <div data-h-item>
                <Tilt maxTilt={4} scale={1.01}>
                  <GlassPanel variant="elevated" className="inline-block">
                    <div className="flex flex-col gap-6 items-center">
                      <div className="flex flex-col gap-3">
                        {personal.emails.map((email) => (
                          <a
                            key={email}
                            href={`mailto:${email}`}
                            className="liquid-glass-interactive liquid-glass-subtle px-8 py-4 rounded-full text-white/80 hover:text-white transition-colors flex items-center gap-3 text-lg"
                            {...clickSoundProps}
                          >
                            <Mail size={18} />
                            {email}
                          </a>
                        ))}
                      </div>

                      <div className="flex gap-8 mt-4">
                        {Object.entries(personal.social).map(([platform, url]) => {
                          const Icon = socialIcons[platform]
                          return (
                            <MagneticIcon key={platform} className="inline-block">
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="liquid-glass-subtle liquid-glass-interactive w-16 h-16 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
                                aria-label={`Perfil no ${platform}`}
                                {...clickSoundProps}
                              >
                                {Icon ? <Icon size={26} /> : platform.slice(0, 2).toUpperCase()}
                              </a>
                            </MagneticIcon>
                          )
                        })}
                      </div>
                    </div>
                  </GlassPanel>
                </Tilt>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
