import { http, HttpResponse } from "msw"

// Mock jobs data
const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    slug: "senior-frontend-developer",
    status: "active",
    tags: ["React", "TypeScript", "Next.js"],
    order: 1,
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "We're looking for a senior frontend developer to join our team...",
    requirements: ["5+ years React experience", "TypeScript proficiency", "Next.js knowledge"],
    postedDate: "2024-01-15",
    applicants: 24,
  },
  {
    id: 2,
    title: "Product Manager",
    slug: "product-manager",
    status: "active",
    tags: ["Strategy", "Analytics", "Leadership"],
    order: 2,
    department: "Product",
    location: "Remote",
    type: "Full-time",
    description: "Join our product team to drive strategic initiatives...",
    requirements: ["3+ years PM experience", "Data-driven mindset", "Leadership skills"],
    postedDate: "2024-01-12",
    applicants: 18,
  },
  {
    id: 3,
    title: "UX Designer",
    slug: "ux-designer",
    status: "archived",
    tags: ["Design", "Figma", "User Research"],
    order: 3,
    department: "Design",
    location: "New York, NY",
    type: "Full-time",
    description: "Create exceptional user experiences for our products...",
    requirements: ["Portfolio required", "Figma expertise", "User research experience"],
    postedDate: "2024-01-08",
    applicants: 31,
  },
  {
    id: 4,
    title: "Backend Engineer",
    slug: "backend-engineer",
    status: "active",
    tags: ["Node.js", "PostgreSQL", "AWS"],
    order: 4,
    department: "Engineering",
    location: "Austin, TX",
    type: "Full-time",
    description: "Build scalable backend systems and APIs...",
    requirements: ["4+ years backend experience", "Database design", "Cloud platforms"],
    postedDate: "2024-01-20",
    applicants: 15,
  },
  {
    id: 5,
    title: "DevOps Engineer",
    slug: "devops-engineer",
    status: "draft",
    tags: ["Docker", "Kubernetes", "CI/CD"],
    order: 5,
    department: "Engineering",
    location: "Seattle, WA",
    type: "Full-time",
    description: "Manage infrastructure and deployment pipelines...",
    requirements: ["Container orchestration", "Infrastructure as code", "Monitoring"],
    postedDate: "2024-01-25",
    applicants: 0,
  },
  {
    id: 6,
    title: "Data Scientist",
    slug: "data-scientist",
    status: "active",
    tags: ["Python", "Machine Learning", "SQL"],
    order: 6,
    department: "Data",
    location: "Boston, MA",
    type: "Full-time",
    description: "Analyze data and build predictive models...",
    requirements: ["Statistics background", "Python/R proficiency", "ML frameworks"],
    postedDate: "2024-01-18",
    applicants: 22,
  },
  {
    id: 7,
    title: "Marketing Manager",
    slug: "marketing-manager",
    status: "active",
    tags: ["Digital Marketing", "SEO", "Analytics"],
    order: 7,
    department: "Marketing",
    location: "Los Angeles, CA",
    type: "Full-time",
    description: "Drive marketing campaigns and growth initiatives...",
    requirements: ["Marketing experience", "Campaign management", "Analytics tools"],
    postedDate: "2024-01-22",
    applicants: 12,
  },
  {
    id: 8,
    title: "Sales Representative",
    slug: "sales-representative",
    status: "archived",
    tags: ["B2B Sales", "CRM", "Communication"],
    order: 8,
    department: "Sales",
    location: "Chicago, IL",
    type: "Full-time",
    description: "Generate leads and close deals with enterprise clients...",
    requirements: ["Sales experience", "CRM proficiency", "Communication skills"],
    postedDate: "2024-01-05",
    applicants: 28,
  },
  {
    id: 9,
    title: "QA Engineer",
    slug: "qa-engineer",
    status: "active",
    tags: ["Testing", "Automation", "Selenium"],
    order: 9,
    department: "Engineering",
    location: "Denver, CO",
    type: "Full-time",
    description: "Ensure product quality through comprehensive testing...",
    requirements: ["Testing frameworks", "Automation tools", "Bug tracking"],
    postedDate: "2024-01-19",
    applicants: 9,
  },
  {
    id: 10,
    title: "Content Writer",
    slug: "content-writer",
    status: "draft",
    tags: ["Writing", "SEO", "Content Strategy"],
    order: 10,
    department: "Marketing",
    location: "Remote",
    type: "Contract",
    description: "Create engaging content for various marketing channels...",
    requirements: ["Writing portfolio", "SEO knowledge", "Content management"],
    postedDate: "2024-01-26",
    applicants: 0,
  },
  {
    id: 11,
    title: "Mobile Developer",
    slug: "mobile-developer",
    status: "active",
    tags: ["React Native", "iOS", "Android"],
    order: 11,
    department: "Engineering",
    location: "Miami, FL",
    type: "Full-time",
    description: "Develop cross-platform mobile applications...",
    requirements: ["Mobile development", "React Native", "App store deployment"],
    postedDate: "2024-01-21",
    applicants: 16,
  },
  {
    id: 12,
    title: "HR Specialist",
    slug: "hr-specialist",
    status: "active",
    tags: ["Recruiting", "HR Policies", "Employee Relations"],
    order: 12,
    department: "Human Resources",
    location: "Phoenix, AZ",
    type: "Full-time",
    description: "Support HR operations and employee lifecycle management...",
    requirements: ["HR experience", "Recruiting skills", "Policy knowledge"],
    postedDate: "2024-01-17",
    applicants: 14,
  },
  {
    id: 13,
    title: "Financial Analyst",
    slug: "financial-analyst",
    status: "archived",
    tags: ["Finance", "Excel", "Modeling"],
    order: 13,
    department: "Finance",
    location: "Atlanta, GA",
    type: "Full-time",
    description: "Analyze financial data and create forecasting models...",
    requirements: ["Finance degree", "Excel expertise", "Financial modeling"],
    postedDate: "2024-01-03",
    applicants: 35,
  },
  {
    id: 14,
    title: "Customer Success Manager",
    slug: "customer-success-manager",
    status: "active",
    tags: ["Customer Relations", "SaaS", "Account Management"],
    order: 14,
    department: "Customer Success",
    location: "Portland, OR",
    type: "Full-time",
    description: "Ensure customer satisfaction and drive retention...",
    requirements: ["Customer success experience", "SaaS background", "Communication"],
    postedDate: "2024-01-23",
    applicants: 11,
  },
  {
    id: 15,
    title: "Security Engineer",
    slug: "security-engineer",
    status: "draft",
    tags: ["Cybersecurity", "Penetration Testing", "Compliance"],
    order: 15,
    department: "Security",
    location: "Washington, DC",
    type: "Full-time",
    description: "Protect systems and data from security threats...",
    requirements: ["Security certifications", "Penetration testing", "Compliance knowledge"],
    postedDate: "2024-01-27",
    applicants: 0,
  },
  {
    id: 16,
    title: "Business Analyst",
    slug: "business-analyst",
    status: "active",
    tags: ["Analysis", "Requirements", "Process Improvement"],
    order: 16,
    department: "Operations",
    location: "Dallas, TX",
    type: "Full-time",
    description: "Analyze business processes and identify improvements...",
    requirements: ["Business analysis", "Requirements gathering", "Process mapping"],
    postedDate: "2024-01-16",
    applicants: 19,
  },
  {
    id: 17,
    title: "Graphic Designer",
    slug: "graphic-designer",
    status: "active",
    tags: ["Adobe Creative", "Branding", "Visual Design"],
    order: 17,
    department: "Design",
    location: "Nashville, TN",
    type: "Part-time",
    description: "Create visual designs for marketing and product materials...",
    requirements: ["Design portfolio", "Adobe Creative Suite", "Brand guidelines"],
    postedDate: "2024-01-24",
    applicants: 8,
  },
  {
    id: 18,
    title: "Operations Manager",
    slug: "operations-manager",
    status: "archived",
    tags: ["Operations", "Process Management", "Leadership"],
    order: 18,
    department: "Operations",
    location: "Minneapolis, MN",
    type: "Full-time",
    description: "Oversee daily operations and optimize processes...",
    requirements: ["Operations experience", "Process improvement", "Team management"],
    postedDate: "2024-01-01",
    applicants: 42,
  },
  {
    id: 19,
    title: "Technical Writer",
    slug: "technical-writer",
    status: "active",
    tags: ["Documentation", "API Docs", "Technical Communication"],
    order: 19,
    department: "Engineering",
    location: "San Diego, CA",
    type: "Contract",
    description: "Create technical documentation and API guides...",
    requirements: ["Technical writing", "API documentation", "Developer tools"],
    postedDate: "2024-01-20",
    applicants: 7,
  },
  {
    id: 20,
    title: "Social Media Manager",
    slug: "social-media-manager",
    status: "draft",
    tags: ["Social Media", "Content Creation", "Community Management"],
    order: 20,
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    description: "Manage social media presence and community engagement...",
    requirements: ["Social media experience", "Content creation", "Analytics"],
    postedDate: "2024-01-28",
    applicants: 0,
  },
  {
    id: 21,
    title: "Machine Learning Engineer",
    slug: "machine-learning-engineer",
    status: "active",
    tags: ["ML", "TensorFlow", "Python"],
    order: 21,
    department: "Data",
    location: "Palo Alto, CA",
    type: "Full-time",
    description: "Build and deploy machine learning models at scale...",
    requirements: ["ML frameworks", "Model deployment", "Python expertise"],
    postedDate: "2024-01-14",
    applicants: 26,
  },
  {
    id: 22,
    title: "Legal Counsel",
    slug: "legal-counsel",
    status: "archived",
    tags: ["Legal", "Contracts", "Compliance"],
    order: 22,
    department: "Legal",
    location: "New York, NY",
    type: "Full-time",
    description: "Provide legal guidance and contract review...",
    requirements: ["Law degree", "Contract law", "Corporate experience"],
    postedDate: "2023-12-28",
    applicants: 18,
  },
  {
    id: 23,
    title: "Product Designer",
    slug: "product-designer",
    status: "active",
    tags: ["Product Design", "Prototyping", "User Testing"],
    order: 23,
    department: "Design",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "Design intuitive product experiences and interfaces...",
    requirements: ["Product design portfolio", "Prototyping tools", "User research"],
    postedDate: "2024-01-13",
    applicants: 33,
  },
  {
    id: 24,
    title: "Account Executive",
    slug: "account-executive",
    status: "active",
    tags: ["Enterprise Sales", "Relationship Management", "Negotiation"],
    order: 24,
    department: "Sales",
    location: "Boston, MA",
    type: "Full-time",
    description: "Manage enterprise accounts and drive revenue growth...",
    requirements: ["Enterprise sales", "Account management", "Negotiation skills"],
    postedDate: "2024-01-11",
    applicants: 21,
  },
  {
    id: 25,
    title: "IT Support Specialist",
    slug: "it-support-specialist",
    status: "draft",
    tags: ["IT Support", "Troubleshooting", "Help Desk"],
    order: 25,
    department: "IT",
    location: "Remote",
    type: "Full-time",
    description: "Provide technical support and troubleshoot IT issues...",
    requirements: ["IT support experience", "Troubleshooting skills", "Help desk tools"],
    postedDate: "2024-01-29",
    applicants: 0,
  },
]

export const jobHandlers = [
  // GET /api/jobs
  http.get("/api/jobs", ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get("search") || ""
    const status = url.searchParams.get("status") || ""
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const pageSize = Number.parseInt(url.searchParams.get("pageSize") || "10")
    const sort = url.searchParams.get("sort") || "order"

    let filteredJobs = [...jobs]

    // Apply search filter
    if (search) {
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())),
      )
    }

    // Apply status filter
    if (status) {
      filteredJobs = filteredJobs.filter((job) => job.status === status)
    }

    // Apply sorting
    filteredJobs.sort((a, b) => {
      switch (sort) {
        case "title":
          return a.title.localeCompare(b.title)
        case "date":
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        case "applicants":
          return b.applicants - a.applicants
        default:
          return a.order - b.order
      }
    })

    // Apply pagination
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex)

    return HttpResponse.json({
      jobs: paginatedJobs,
      total: filteredJobs.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredJobs.length / pageSize),
    })
  }),

  // POST /api/jobs
  http.post("/api/jobs", async ({ request }) => {
    const newJob = (await request.json()) as any
    const job = {
      id: Math.max(...jobs.map((j) => j.id)) + 1,
      ...newJob,
      postedDate: new Date().toISOString().split("T")[0],
      applicants: 0,
    }
    jobs.push(job)
    return HttpResponse.json(job, { status: 201 })
  }),

  // PATCH /api/jobs/:id
  http.patch("/api/jobs/:id", async ({ params, request }) => {
    const id = Number.parseInt(params.id as string)
    const updates = (await request.json()) as any
    const jobIndex = jobs.findIndex((j) => j.id === id)

    if (jobIndex === -1) {
      return HttpResponse.json({ error: "Job not found" }, { status: 404 })
    }

    jobs[jobIndex] = { ...jobs[jobIndex], ...updates }
    return HttpResponse.json(jobs[jobIndex])
  }),

  // PATCH /api/jobs/:id/reorder
  http.patch("/api/jobs/:id/reorder", async ({ params, request }) => {
    // Occasionally return 500 to test rollback
    if (Math.random() < 0.1) {
      return HttpResponse.json({ error: "Server error" }, { status: 500 })
    }

    const id = Number.parseInt(params.id as string)
    const { fromOrder, toOrder } = (await request.json()) as any

    const job = jobs.find((j) => j.id === id)
    if (!job) {
      return HttpResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Update job order
    job.order = toOrder

    // Adjust other jobs' orders
    jobs.forEach((j) => {
      if (j.id !== id) {
        if (fromOrder < toOrder && j.order > fromOrder && j.order <= toOrder) {
          j.order--
        } else if (fromOrder > toOrder && j.order >= toOrder && j.order < fromOrder) {
          j.order++
        }
      }
    })

    return HttpResponse.json({ success: true })
  }),
]
