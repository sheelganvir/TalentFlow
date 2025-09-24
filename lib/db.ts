import Dexie, { type Table } from "dexie"

export interface Job {
  id?: number
  title: string
  team: string
  location: string
  openings: number
  description: string
  tags: string[]
  status: "Active" | "Archived"
  createdAt: Date
  updatedAt: Date
  applicantsTrend: number[]
  order: number
  slug: string
}

export class JobsDatabase extends Dexie {
  jobs!: Table<Job>

  constructor() {
    super("JobsDatabase")
    this.version(1).stores({
      jobs: "++id, title, team, location, status, createdAt, order, slug",
    })
  }
}

export const db = new JobsDatabase()

// Seed data for jobs
const seedJobs: Omit<Job, "id">[] = [
  {
    title: "Senior Frontend Developer",
    team: "Engineering",
    location: "San Francisco, CA",
    openings: 2,
    description: "We are looking for a senior frontend developer to join our engineering team.",
    tags: ["React", "TypeScript", "Next.js"],
    status: "Active",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    applicantsTrend: [12, 15, 18, 22, 25, 28],
    order: 1,
    slug: "senior-frontend-developer",
  },
  {
    title: "Product Manager",
    team: "Product",
    location: "New York, NY",
    openings: 1,
    description: "Join our product team to drive innovation and user experience.",
    tags: ["Product Strategy", "Analytics", "User Research"],
    status: "Active",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    applicantsTrend: [8, 12, 16, 20, 18, 22],
    order: 2,
    slug: "product-manager",
  },
  {
    title: "UX Designer",
    team: "Design",
    location: "Remote",
    openings: 1,
    description: "Create beautiful and intuitive user experiences for our platform.",
    tags: ["Figma", "User Research", "Prototyping"],
    status: "Active",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
    applicantsTrend: [10, 14, 12, 16, 19, 24],
    order: 3,
    slug: "ux-designer",
  },
  {
    title: "Backend Engineer",
    team: "Engineering",
    location: "Austin, TX",
    openings: 3,
    description: "Build scalable backend systems and APIs.",
    tags: ["Node.js", "PostgreSQL", "AWS"],
    status: "Active",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
    applicantsTrend: [15, 18, 21, 19, 23, 26],
    order: 4,
    slug: "backend-engineer",
  },
  {
    title: "Data Scientist",
    team: "Data",
    location: "Seattle, WA",
    openings: 2,
    description: "Analyze data to drive business insights and machine learning models.",
    tags: ["Python", "Machine Learning", "SQL"],
    status: "Active",
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-05"),
    applicantsTrend: [6, 9, 12, 15, 18, 21],
    order: 5,
    slug: "data-scientist",
  },
  {
    title: "DevOps Engineer",
    team: "Engineering",
    location: "Denver, CO",
    openings: 1,
    description: "Manage infrastructure and deployment pipelines.",
    tags: ["Docker", "Kubernetes", "CI/CD"],
    status: "Active",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
    applicantsTrend: [4, 7, 10, 13, 16, 19],
    order: 6,
    slug: "devops-engineer",
  },
  {
    title: "Marketing Manager",
    team: "Marketing",
    location: "Los Angeles, CA",
    openings: 1,
    description: "Lead marketing campaigns and brand strategy.",
    tags: ["Digital Marketing", "Content Strategy", "Analytics"],
    status: "Active",
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
    applicantsTrend: [8, 11, 14, 17, 20, 23],
    order: 7,
    slug: "marketing-manager",
  },
  {
    title: "Sales Representative",
    team: "Sales",
    location: "Chicago, IL",
    openings: 4,
    description: "Drive revenue growth through client acquisition.",
    tags: ["B2B Sales", "CRM", "Lead Generation"],
    status: "Active",
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-02-20"),
    applicantsTrend: [12, 16, 20, 24, 28, 32],
    order: 8,
    slug: "sales-representative",
  },
  {
    title: "Customer Success Manager",
    team: "Customer Success",
    location: "Remote",
    openings: 2,
    description: "Ensure customer satisfaction and retention.",
    tags: ["Customer Relations", "Account Management", "Support"],
    status: "Active",
    createdAt: new Date("2024-02-25"),
    updatedAt: new Date("2024-02-25"),
    applicantsTrend: [7, 10, 13, 16, 19, 22],
    order: 9,
    slug: "customer-success-manager",
  },
  {
    title: "QA Engineer",
    team: "Engineering",
    location: "Boston, MA",
    openings: 2,
    description: "Ensure product quality through comprehensive testing.",
    tags: ["Test Automation", "Selenium", "Quality Assurance"],
    status: "Active",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
    applicantsTrend: [5, 8, 11, 14, 17, 20],
    order: 10,
    slug: "qa-engineer",
  },
  {
    title: "HR Specialist",
    team: "Human Resources",
    location: "Miami, FL",
    openings: 1,
    description: "Support talent acquisition and employee relations.",
    tags: ["Recruiting", "Employee Relations", "HR Policies"],
    status: "Archived",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-03-05"),
    applicantsTrend: [3, 6, 9, 12, 15, 18],
    order: 11,
    slug: "hr-specialist",
  },
  {
    title: "Financial Analyst",
    team: "Finance",
    location: "New York, NY",
    openings: 1,
    description: "Analyze financial data and support business decisions.",
    tags: ["Financial Modeling", "Excel", "Budgeting"],
    status: "Active",
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-10"),
    applicantsTrend: [4, 7, 10, 13, 16, 19],
    order: 12,
    slug: "financial-analyst",
  },
  {
    title: "Content Writer",
    team: "Marketing",
    location: "Remote",
    openings: 2,
    description: "Create engaging content for various marketing channels.",
    tags: ["Content Creation", "SEO", "Copywriting"],
    status: "Active",
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-15"),
    applicantsTrend: [6, 9, 12, 15, 18, 21],
    order: 13,
    slug: "content-writer",
  },
  {
    title: "Mobile Developer",
    team: "Engineering",
    location: "San Francisco, CA",
    openings: 2,
    description: "Develop mobile applications for iOS and Android.",
    tags: ["React Native", "iOS", "Android"],
    status: "Active",
    createdAt: new Date("2024-03-20"),
    updatedAt: new Date("2024-03-20"),
    applicantsTrend: [8, 11, 14, 17, 20, 23],
    order: 14,
    slug: "mobile-developer",
  },
  {
    title: "Security Engineer",
    team: "Security",
    location: "Washington, DC",
    openings: 1,
    description: "Protect our systems and data from security threats.",
    tags: ["Cybersecurity", "Penetration Testing", "Security Audits"],
    status: "Active",
    createdAt: new Date("2024-03-25"),
    updatedAt: new Date("2024-03-25"),
    applicantsTrend: [3, 6, 9, 12, 15, 18],
    order: 15,
    slug: "security-engineer",
  },
  {
    title: "Business Analyst",
    team: "Operations",
    location: "Atlanta, GA",
    openings: 1,
    description: "Analyze business processes and recommend improvements.",
    tags: ["Process Analysis", "Requirements Gathering", "Documentation"],
    status: "Active",
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-04-01"),
    applicantsTrend: [5, 8, 11, 14, 17, 20],
    order: 16,
    slug: "business-analyst",
  },
  {
    title: "Technical Writer",
    team: "Documentation",
    location: "Remote",
    openings: 1,
    description: "Create technical documentation and user guides.",
    tags: ["Technical Writing", "Documentation", "API Docs"],
    status: "Archived",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-04-05"),
    applicantsTrend: [2, 5, 8, 11, 14, 17],
    order: 17,
    slug: "technical-writer",
  },
  {
    title: "UI Developer",
    team: "Design",
    location: "Portland, OR",
    openings: 1,
    description: "Implement user interface designs with pixel-perfect precision.",
    tags: ["HTML", "CSS", "JavaScript", "Design Systems"],
    status: "Active",
    createdAt: new Date("2024-04-10"),
    updatedAt: new Date("2024-04-10"),
    applicantsTrend: [7, 10, 13, 16, 19, 22],
    order: 18,
    slug: "ui-developer",
  },
  {
    title: "Project Manager",
    team: "Operations",
    location: "Phoenix, AZ",
    openings: 2,
    description: "Lead cross-functional teams to deliver projects on time.",
    tags: ["Project Management", "Agile", "Scrum"],
    status: "Active",
    createdAt: new Date("2024-04-15"),
    updatedAt: new Date("2024-04-15"),
    applicantsTrend: [9, 12, 15, 18, 21, 24],
    order: 19,
    slug: "project-manager",
  },
  {
    title: "Machine Learning Engineer",
    team: "Data",
    location: "San Francisco, CA",
    openings: 1,
    description: "Build and deploy machine learning models at scale.",
    tags: ["Python", "TensorFlow", "MLOps"],
    status: "Active",
    createdAt: new Date("2024-04-20"),
    updatedAt: new Date("2024-04-20"),
    applicantsTrend: [4, 7, 10, 13, 16, 19],
    order: 20,
    slug: "machine-learning-engineer",
  },
  {
    title: "Legal Counsel",
    team: "Legal",
    location: "New York, NY",
    openings: 1,
    description: "Provide legal guidance and support for business operations.",
    tags: ["Corporate Law", "Contracts", "Compliance"],
    status: "Active",
    createdAt: new Date("2024-04-25"),
    updatedAt: new Date("2024-04-25"),
    applicantsTrend: [2, 4, 6, 8, 10, 12],
    order: 21,
    slug: "legal-counsel",
  },
  {
    title: "Operations Manager",
    team: "Operations",
    location: "Dallas, TX",
    openings: 1,
    description: "Oversee daily operations and process improvements.",
    tags: ["Operations", "Process Improvement", "Team Management"],
    status: "Active",
    createdAt: new Date("2024-05-01"),
    updatedAt: new Date("2024-05-01"),
    applicantsTrend: [6, 9, 12, 15, 18, 21],
    order: 22,
    slug: "operations-manager",
  },
  {
    title: "Brand Designer",
    team: "Design",
    location: "Los Angeles, CA",
    openings: 1,
    description: "Develop and maintain brand identity across all touchpoints.",
    tags: ["Brand Design", "Visual Identity", "Creative Direction"],
    status: "Active",
    createdAt: new Date("2024-05-05"),
    updatedAt: new Date("2024-05-05"),
    applicantsTrend: [5, 8, 11, 14, 17, 20],
    order: 23,
    slug: "brand-designer",
  },
  {
    title: "Database Administrator",
    team: "Engineering",
    location: "Minneapolis, MN",
    openings: 1,
    description: "Manage and optimize database systems for performance.",
    tags: ["PostgreSQL", "Database Optimization", "Backup & Recovery"],
    status: "Active",
    createdAt: new Date("2024-05-10"),
    updatedAt: new Date("2024-05-10"),
    applicantsTrend: [3, 6, 9, 12, 15, 18],
    order: 24,
    slug: "database-administrator",
  },
  {
    title: "Social Media Manager",
    team: "Marketing",
    location: "Remote",
    openings: 1,
    description: "Manage social media presence and community engagement.",
    tags: ["Social Media", "Community Management", "Content Planning"],
    status: "Archived",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-05-15"),
    applicantsTrend: [8, 11, 14, 17, 20, 23],
    order: 25,
    slug: "social-media-manager",
  },
]

// Initialize database with seed data
export async function initializeDatabase() {
  // Check if already initialized in this session
  if (typeof window !== "undefined" && window.sessionStorage.getItem("db-initialized")) {
    return
  }

  const count = await db.jobs.count()
  if (count === 0) {
    // Use only first 8 jobs for faster seeding
    const quickSeedJobs = seedJobs.slice(0, 8)
    await db.jobs.bulkAdd(quickSeedJobs)
    console.log("Database seeded with", quickSeedJobs.length, "jobs")
  }

  // Mark as initialized for this session
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem("db-initialized", "true")
  }
}

// Helper functions
export async function getAllJobs() {
  return await db.jobs.orderBy("order").toArray()
}

export async function getJobById(id: number) {
  return await db.jobs.get(id)
}

export async function getJobBySlug(slug: string) {
  return await db.jobs.where("slug").equals(slug).first()
}

export async function createJob(job: Omit<Job, "id">) {
  return await db.jobs.add(job)
}

export async function updateJob(id: number, updates: Partial<Job>) {
  return await db.jobs.update(id, { ...updates, updatedAt: new Date() })
}

export async function deleteJob(id: number) {
  return await db.jobs.delete(id)
}

export async function reorderJobs(jobs: Job[]) {
  const updates = jobs.map((job, index) => ({
    id: job.id!,
    order: index + 1,
    updatedAt: new Date(),
  }))

  await db.transaction("rw", db.jobs, async () => {
    for (const update of updates) {
      await db.jobs.update(update.id, { order: update.order, updatedAt: update.updatedAt })
    }
  })
}
