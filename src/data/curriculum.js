/**
 * Curriculum data — Lucca de Bragança Quintas
 */
const curriculum = {
  personal: {
    name: 'Lucca Quintas',
    title: 'Bacharel em Ciência da Computação',
    location: 'Vitória, ES',
    email: 'luccaquintas@gmail.com',
    phone: '(27) 9607-7566',
    website: null,
    avatar: '/avatar.png',
    bio: 'Bacharel em Ciência da Computação pela Universidade Vila Velha. Experiência com desenvolvimento frontend, automação de processos, análise de dados e criação de aplicações web e jogos. Atualmente sócio e líder de desenvolvimento frontend na Web Horizon.',
    social: {
      github: 'https://github.com/schizoidman1',
      linkedin: 'https://www.linkedin.com/in/lucca-quintas-b51224217/',
      instagram: 'https://www.instagram.com/luccaqnts/',
    },
  },

  experience: [
    {
      id: 'exp-1',
      role: 'Estagiário de Tecnologia',
      company: 'ArcelorMittal',
      year: '2024',
      period: '1 ano e 4 meses',
      description:
        'Desenvolvimento de dashboards e relatórios analíticos utilizando PowerBI. Automação de processos e análise de dados com Python. Desenvolvimento de aplicação web gamificada para treinamento de segurança (WCM).',
      technologies: ['PowerBI', 'Python', 'JavaScript'],
      current: false,
    },
    {
      id: 'exp-2',
      role: 'Desenvolvedor Frontend & Sócio',
      company: 'Web Horizon',
      year: '2025',
      period: 'Atual',
      description:
        'Liderança do desenvolvimento frontend de sistema ERP completo para Casas Franklin. Trabalho em equipe multidisciplinar com gestão de projeto ágil.',
      technologies: ['React', 'TypeScript', 'PostgreSQL', 'Docker'],
      current: true,
    },
  ],

  skills: [
    { name: 'JavaScript', level: 90, category: 'frontend' },
    { name: 'TypeScript', level: 85, category: 'frontend' },
    { name: 'React Native', level: 80, category: 'frontend' },
    { name: 'Angular', level: 75, category: 'frontend' },
    { name: 'Python', level: 85, category: 'backend' },
    { name: 'Java', level: 70, category: 'backend' },
    { name: 'C#', level: 70, category: 'backend' },
    { name: 'C++', level: 65, category: 'backend' },
    { name: 'Node.js', level: 80, category: 'backend' },
    { name: 'Spring', level: 65, category: 'backend' },
    { name: 'Express', level: 75, category: 'backend' },
    { name: 'SQL', level: 75, category: 'backend' },
    { name: 'PostgreSQL', level: 75, category: 'backend' },
    { name: 'MongoDB', level: 75, category: 'backend' },
    { name: 'Git', level: 85, category: 'devops' },
    { name: 'Docker', level: 65, category: 'devops' },
    { name: 'PowerBI', level: 80, category: 'tools' },
    { name: 'Unity', level: 70, category: 'tools' },
  ],

  projects: [
    {
      id: 'proj-1',
      title: 'BasedChat',
      description:
        'Aplicativo de mensagens instantâneas desenvolvido com MEAN Stack.',
      technologies: ['MongoDB', 'Express', 'Angular', 'Node.js'],
      link: 'https://github.com/schizoidman1/BasedChat',
      image: null,
    },
    {
      id: 'proj-2',
      title: 'Compilador C (Fork JISON)',
      description:
        'Implementação de analisador léxico e semântico para linguagem C usando JISON.',
      technologies: ['JavaScript', 'JISON'],
      link: 'https://github.com/schizoidman1/jison',
      image: null,
    },
    {
      id: 'proj-3',
      title: 'Visualizador Dijkstra',
      description:
        'Interface interativa para visualização do algoritmo de Dijkstra com Python, Matplotlib e NetworkX.',
      technologies: ['Python', 'Matplotlib', 'NetworkX'],
      link: 'https://github.com/schizoidman1/dijkstra_ui',
      image: null,
    },
    {
      id: 'proj-4',
      title: 'ARMT WCM Game',
      description:
        'Jogo web educativo desenvolvido para evento de segurança da ArcelorMittal.',
      technologies: ['JavaScript', 'HTML', 'CSS'],
      link: 'https://github.com/schizoidman1/ARMT-WCM-GAME',
      image: null,
    },
    {
      id: 'proj-5',
      title: 'Tower of Sorrow',
      description:
        'Jogo boss rush plataforma feito em Unity + CorgiEngine.',
      technologies: ['Unity', 'C#', 'CorgiEngine'],
      link: 'https://github.com/Pedro-Brando/Tower-of-Sorrow',
      image: null,
    },
    {
      id: 'proj-6',
      title: 'ERP Casas Franklin',
      description:
        'ERP completo para Casas Franklin.',
      technologies: ['React', 'Typescript', 'Docker', 'PostgreSQL'],
      link: 'https://painel.franklinhomedecor.com/',
      image: null,
    },
  ],

  education: [
    {
      degree: 'Bacharelado em Ciência da Computação',
      institution: 'Universidade Vila Velha',
      period: '2025',
    },
  ],

  /** Affiliations displayed as glass bubbles in the About section */
  affiliations: [
    {
      id: 'aff-1',
      name: 'Universidade Vila Velha',
      image: '/affiliations/uvv.png',
      link: 'https://uvv.br',
    },
    {
      id: 'aff-2',
      name: 'Web Horizon',
      image: '/affiliations/webhorizon.png',
      link: 'https://webhorizon.com.br',
    },
  ],
}

export default curriculum
