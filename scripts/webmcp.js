/** @format */

// WebMCP tools for https://mahdis24.github.io/
// Include in index.html with: <script src="webmcp.js" defer></script>

;(function () {
  if (!('modelContext' in navigator)) return

  const SITE_URL = 'https://mahdis24.github.io/'

  const OVERVIEW = {
    name: 'Mahdi Salek',
    role: 'Front-End Developer',
    summary:
      'Front-end developer focused on the Vue and Nuxt ecosystem. Builds fast, feature-rich applications with an emphasis on clean architecture, SSR, maintainability and production quality.',
    work: 'Dashboards, admin tools, data-heavy views and feature-rich web applications.',
    focus: [
      'Vue, Nuxt & Vuetify (including SSR)',
      'Clean, scalable architecture',
      'Production-minded tooling, builds and polish'
    ],
    url: SITE_URL
  }

  const SKILLS = {
    frontend: [
      'Vue',
      'Nuxt',
      'Vuetify',
      'TypeScript',
      'JavaScript',
      'Pinia',
      'i18n',
      'VueUse',
      'Vue Router'
    ],
    ui_styling: [
      'HTML',
      'CSS',
      'Sass',
      'Responsive design',
      'Material Design Icons',
      'LTR/RTL',
      'Light/Dark'
    ],
    tooling: [
      'Git',
      'GitHub Actions',
      'Docker',
      'npm',
      'bun',
      'Webpack',
      'ESLint',
      'Prettier'
    ]
  }

  const PROJECTS = [
    {
      name: 'IDEX Platform',
      description:
        'A complete platform for safety, compliance and a safe work environment in industry, construction and the public sector.',
      url: 'https://idex.se/'
    },
    {
      name: 'Procycons',
      description:
        'Combines digital solutions with ecological sustainability, creating a bridge between technology and environmental protection.',
      url: 'https://procycons.com/'
    }
  ]

  const CONTACT = {
    email: 'mahdi.6n@gmail.com',
    portfolio: SITE_URL,
    linkedin: 'https://linkedin.com/in/mahdi-s24/',
    github: 'https://github.com/mahdis24',
    stackoverflow: 'https://stackoverflow.com/users/6419842/mahdi',
    x: 'https://x.com/mahdi_s24/',
    telegram: 'https://t.me/mahdi_s24/',
    whatsapp: 'https://wa.me/+37495157451'
  }

  const SECTIONS = {
    home: '#top',
    about: '#about',
    skills: '#skills',
    projects: '#projects',
    contact: '#contact',
    resume: 'assets/Mahdi Salek (Resume).pdf'
  }

  const reply = (value) => ({
    content: [
      {
        type: 'text',
        text: typeof value === 'string' ? value : JSON.stringify(value, null, 2)
      }
    ]
  })

  navigator.modelContext.registerTool({
    name: 'get_portfolio_overview',
    description:
      "Returns the portfolio owner's professional overview and primary development focus.",
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false
    },
    annotations: { readOnlyHint: true },
    async execute() {
      return reply(OVERVIEW)
    }
  })

  navigator.modelContext.registerTool({
    name: 'get_technical_skills',
    description:
      'Returns the technologies and engineering practices listed in the portfolio.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          enum: ['all', 'frontend', 'ui_styling', 'tooling'],
          description: 'Optional skill category to retrieve.'
        }
      },
      additionalProperties: false
    },
    annotations: { readOnlyHint: true },
    async execute({ category = 'all' } = {}) {
      if (category === 'all') return reply(SKILLS)
      if (!(category in SKILLS)) return reply(`Unknown category: ${category}`)
      return reply({ [category]: SKILLS[category] })
    }
  })

  navigator.modelContext.registerTool({
    name: 'list_projects',
    description:
      'Lists projects featured on the portfolio, with available URLs and concise descriptions.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'Optional keyword to filter projects by name or description.'
        }
      },
      additionalProperties: false
    },
    annotations: { readOnlyHint: true },
    async execute({ query } = {}) {
      const q = (query || '').trim().toLowerCase()
      const results =
        q ?
          PROJECTS.filter((p) =>
            `${p.name} ${p.description}`.toLowerCase().includes(q)
          )
        : PROJECTS
      return reply(results.length ? results : 'No projects matched that query.')
    }
  })

  navigator.modelContext.registerTool({
    name: 'get_contact_information',
    description:
      'Returns the public contact details and portfolio URL published by the owner.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false
    },
    annotations: { readOnlyHint: true },
    async execute() {
      return reply(CONTACT)
    }
  })

  navigator.modelContext.registerTool({
    name: 'open_portfolio_section',
    description:
      'Navigates the current page to a supported portfolio section or the resume PDF.',
    inputSchema: {
      type: 'object',
      properties: {
        section: {
          type: 'string',
          enum: ['home', 'about', 'skills', 'projects', 'contact', 'resume'],
          description: 'The portfolio section to open.'
        }
      },
      required: ['section'],
      additionalProperties: false
    },
    annotations: { readOnlyHint: false },
    async execute({ section }) {
      if (!(section in SECTIONS))
        return reply(`Unsupported section: ${section}`)
      const target = SECTIONS[section]
      if (target.startsWith('#')) {
        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
        history.replaceState(null, '', target)
      } else {
        window.open(encodeURI(target), '_blank', 'noopener')
      }
      return reply(`Opened ${section}`)
    }
  })
})()
