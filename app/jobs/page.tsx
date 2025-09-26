"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import {
  Settings,
  Moon,
  Sun,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Archive,
  Trash2,
  GripVertical,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { useToast } from "@/hooks/use-toast"
import type { Job } from "@/types/job"

const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
  type: z.enum(["full-time", "part-time", "contract", "internship"]),
  status: z.enum(["draft", "published", "archived"]),
  tags: z.string(),
})

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    slug: "senior-frontend-developer",
    description: "We're looking for an experienced frontend developer to join our team.",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "full-time",
    status: "published",
    tags: ["React", "TypeScript", "Next.js"],
    applicants: 24,
    createdAt: "2024-01-15",
    order: 1,
  },
  {
    id: "2",
    title: "Product Manager",
    slug: "product-manager",
    description: "Lead product strategy and development for our core platform.",
    department: "Product",
    location: "Remote",
    type: "full-time",
    status: "published",
    tags: ["Strategy", "Analytics", "Leadership"],
    applicants: 18,
    createdAt: "2024-01-12",
    order: 2,
  },
  {
    id: "3",
    title: "UX Designer",
    slug: "ux-designer",
    description: "Create beautiful and intuitive user experiences.",
    department: "Design",
    location: "New York, NY",
    type: "full-time",
    status: "draft",
    tags: ["Figma", "User Research", "Prototyping"],
    applicants: 12,
    createdAt: "2024-01-10",
    order: 3,
  },
  {
    id: "4",
    title: "Marketing Intern",
    slug: "marketing-intern",
    description: "Support our marketing team with campaigns and content creation.",
    department: "Marketing",
    location: "Los Angeles, CA",
    type: "internship",
    status: "archived",
    tags: ["Content", "Social Media", "Analytics"],
    applicants: 8,
    createdAt: "2024-01-08",
    order: 4,
  },
  {
    id: "5",
    title: "Backend Engineer",
    slug: "backend-engineer",
    description: "Develop and maintain our server-side logic.",
    department: "Engineering",
    location: "Austin, TX",
    type: "full-time",
    status: "published",
    tags: ["Node.js", "PostgreSQL", "GraphQL"],
    applicants: 31,
    createdAt: "2024-01-20",
    order: 5,
  },
  {
    id: "6",
    title: "Data Scientist",
    slug: "data-scientist",
    description: "Analyze large datasets to extract meaningful insights.",
    department: "Data Science",
    location: "Remote",
    type: "full-time",
    status: "published",
    tags: ["Python", "Machine Learning", "SQL"],
    applicants: 22,
    createdAt: "2024-01-18",
    order: 6,
  },
  {
    id: "7",
    title: "DevOps Engineer",
    slug: "devops-engineer",
    description: "Manage our cloud infrastructure and deployment pipelines.",
    department: "Engineering",
    location: "Seattle, WA",
    type: "full-time",
    status: "draft",
    tags: ["AWS", "Kubernetes", "Terraform"],
    applicants: 15,
    createdAt: "2024-01-16",
    order: 7,
  },
  {
    id: "8",
    title: "Content Strategist",
    slug: "content-strategist",
    description: "Develop and execute a comprehensive content strategy.",
    department: "Marketing",
    location: "New York, NY",
    type: "full-time",
    status: "published",
    tags: ["SEO", "Content Marketing", "Storytelling"],
    applicants: 10,
    createdAt: "2024-01-14",
    order: 8,
  },
  {
    id: "9",
    title: "Customer Support Specialist",
    slug: "customer-support-specialist",
    description: "Provide top-notch support to our customers.",
    department: "Customer Success",
    location: "Remote",
    type: "part-time",
    status: "published",
    tags: ["Communication", "Problem Solving", "Zendesk"],
    applicants: 45,
    createdAt: "2024-01-13",
    order: 9,
  },
  {
    id: "10",
    title: "QA Engineer",
    slug: "qa-engineer",
    description: "Ensure the quality of our products through manual and automated testing.",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "full-time",
    status: "archived",
    tags: ["Cypress", "Selenium", "Jira"],
    applicants: 19,
    createdAt: "2024-01-11",
    order: 10,
  },
  {
    id: "11",
    title: "Human Resources Manager",
    slug: "human-resources-manager",
    description: "Oversee all aspects of human resources practices and processes.",
    department: "HR",
    location: "Chicago, IL",
    type: "full-time",
    status: "published",
    tags: ["Recruiting", "Employee Relations", "Onboarding"],
    applicants: 9,
    createdAt: "2024-01-09",
    order: 11,
  },
  {
    id: "12",
    title: "Junior Graphic Designer",
    slug: "junior-graphic-designer",
    description: "Assist the design team with visual assets for marketing and product.",
    department: "Design",
    location: "Remote",
    type: "internship",
    status: "draft",
    tags: ["Adobe Creative Suite", "Illustration", "Branding"],
    applicants: 25,
    createdAt: "2024-01-07",
    order: 12,
  },
  {
    id: "13",
    title: "Sales Development Representative",
    slug: "sales-development-representative",
    description: "Generate and qualify new leads for the sales team.",
    department: "Sales",
    location: "Boston, MA",
    type: "full-time",
    status: "published",
    tags: ["Lead Generation", "Salesforce", "Cold Calling"],
    applicants: 35,
    createdAt: "2024-01-06",
    order: 13,
  },
  {
    id: "14",
    title: "IT Support Technician",
    slug: "it-support-technician",
    description: "Provide technical assistance and support to our employees.",
    department: "IT",
    location: "Austin, TX",
    type: "full-time",
    status: "published",
    tags: ["Troubleshooting", "Hardware", "Networking"],
    applicants: 14,
    createdAt: "2024-01-05",
    order: 14,
  },
  {
    id: "15",
    title: "Mobile Developer",
    slug: "mobile-developer",
    description: "Build and maintain our iOS and Android applications.",
    department: "Engineering",
    location: "Remote",
    type: "full-time",
    status: "draft",
    tags: ["Swift", "Kotlin", "React Native"],
    applicants: 28,
    createdAt: "2024-01-04",
    order: 15,
  },
  {
    id: "16",
    title: "Financial Analyst",
    slug: "financial-analyst",
    description: "Analyze financial data and create financial models for decision support.",
    department: "Finance",
    location: "New York, NY",
    type: "full-time",
    status: "published",
    tags: ["Excel", "Financial Modeling", "Forecasting"],
    applicants: 11,
    createdAt: "2024-01-03",
    order: 16,
  },
  {
    id: "17",
    title: "Copywriter",
    slug: "copywriter",
    description: "Write clear, compelling copy for various mediums.",
    department: "Marketing",
    location: "Remote",
    type: "contract",
    status: "archived",
    tags: ["Copywriting", "Editing", "Content Strategy"],
    applicants: 7,
    createdAt: "2024-01-02",
    order: 17,
  },
  {
    id: "18",
    title: "Scrum Master",
    slug: "scrum-master",
    description: "Facilitate agile development processes and remove impediments for the team.",
    department: "Product",
    location: "San Francisco, CA",
    type: "full-time",
    status: "published",
    tags: ["Agile", "Scrum", "Jira"],
    applicants: 16,
    createdAt: "2024-01-01",
    order: 18,
  },
  {
    id: "19",
    title: "Social Media Manager",
    slug: "social-media-manager",
    description: "Manage our social media presence and engagement.",
    department: "Marketing",
    location: "Los Angeles, CA",
    type: "full-time",
    status: "published",
    tags: ["Social Media Marketing", "Community Management", "Hootsuite"],
    applicants: 20,
    createdAt: "2023-12-31",
    order: 19,
  },
  {
    id: "20",
    title: "Solutions Architect",
    slug: "solutions-architect",
    description: "Design and implement complex software solutions for our clients.",
    department: "Engineering",
    location: "Chicago, IL",
    type: "full-time",
    status: "draft",
    tags: ["Cloud Architecture", "Microservices", "Solution Design"],
    applicants: 13,
    createdAt: "2023-12-30",
    order: 20,
  },
  {
    id: "21",
    title: "Business Analyst",
    slug: "business-analyst",
    description: "Bridge the gap between IT and the business using data analytics.",
    department: "Product",
    location: "Boston, MA",
    type: "full-time",
    status: "published",
    tags: ["Requirements Gathering", "Data Analysis", "SQL"],
    applicants: 21,
    createdAt: "2023-12-29",
    order: 21,
  },
  {
    id: "22",
    title: "Recruiter",
    slug: "recruiter",
    description: "Find and attract top talent to join our company.",
    department: "HR",
    location: "Remote",
    type: "full-time",
    status: "published",
    tags: ["Sourcing", "Interviewing", "Applicant Tracking Systems"],
    applicants: 29,
    createdAt: "2023-12-28",
    order: 22,
  },
  {
    id: "23",
    title: "UI Designer",
    slug: "ui-designer",
    description: "Design and iterate on user interfaces that are both beautiful and functional.",
    department: "Design",
    location: "New York, NY",
    type: "full-time",
    status: "draft",
    tags: ["UI Design", "Visual Design", "Sketch"],
    applicants: 17,
    createdAt: "2023-12-27",
    order: 23,
  },
  {
    id: "24",
    title: "Security Engineer",
    slug: "security-engineer",
    description: "Protect our systems and data from security threats.",
    department: "Engineering",
    location: "Seattle, WA",
    type: "full-time",
    status: "published",
    tags: ["Cybersecurity", "Penetration Testing", "Compliance"],
    applicants: 8,
    createdAt: "2023-12-26",
    order: 24,
  },
  {
    id: "25",
    title: "Technical Writer",
    slug: "technical-writer",
    description: "Create clear and concise documentation for our products.",
    department: "Product",
    location: "Remote",
    type: "contract",
    status: "published",
    tags: ["Documentation", "API Docs", "Markdown"],
    applicants: 6,
    createdAt: "2023-12-25",
    order: 25,
  },
]

export default function JobsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { toast } = useToast()

  const jobsPerPage = 6

  useEffect(() => {
    const savedJobs = localStorage.getItem("talentflow-jobs")
    if (savedJobs) {
      const parsedJobs = JSON.parse(savedJobs)
      setJobs(parsedJobs)
      setFilteredJobs(parsedJobs)
    } else {
      setJobs(mockJobs)
      setFilteredJobs(mockJobs)
      localStorage.setItem("talentflow-jobs", JSON.stringify(mockJobs))
    }
  }, [])

  useEffect(() => {
    const filtered = jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = statusFilter === "all" || job.status === statusFilter
      return matchesSearch && matchesStatus
    })

    // Sort by order
    filtered.sort((a, b) => a.order - b.order)
    setFilteredJobs(filtered)
    setCurrentPage(1)
  }, [jobs, searchTerm, statusFilter])

  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      department: "",
      location: "",
      type: "full-time",
      status: "draft",
      tags: "",
    },
  })

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const isSlugUnique = (slug: string, excludeId?: string) => {
    return !jobs.some((job) => job.slug === slug && job.id !== excludeId)
  }

  const onCreateSubmit = (values: z.infer<typeof jobSchema>) => {
    const slug = generateSlug(values.title)
    if (!isSlugUnique(slug)) {
      form.setError("title", { message: "A job with this title already exists" })
      return
    }

    const newJob: Job = {
      id: Date.now().toString(),
      ...values,
      slug,
      tags: values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      applicants: 0,
      createdAt: new Date().toISOString().split("T")[0],
      order: jobs.length + 1,
    }

    const updatedJobs = [...jobs, newJob]
    setJobs(updatedJobs)
    localStorage.setItem("talentflow-jobs", JSON.stringify(updatedJobs))
    setIsCreateModalOpen(false)
    form.reset()
    toast({ title: "Job created successfully!" })
  }

  const onEditSubmit = (values: z.infer<typeof jobSchema>) => {
    if (!editingJob) return

    const slug = generateSlug(values.title)
    if (!isSlugUnique(slug, editingJob.id)) {
      form.setError("title", { message: "A job with this title already exists" })
      return
    }

    const updatedJobs = jobs.map((job) =>
      job.id === editingJob.id
        ? {
            ...job,
            ...values,
            slug,
            tags: values.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
          }
        : job,
    )
    setJobs(updatedJobs)
    localStorage.setItem("talentflow-jobs", JSON.stringify(updatedJobs))
    setIsEditModalOpen(false)
    setEditingJob(null)
    form.reset()
    toast({ title: "Job updated successfully!" })
  }

  const toggleArchiveJob = (jobId: string) => {
    const updatedJobs = jobs.map((job) => {
      const jobToToggle = job.id === jobId ? job : null
      return jobToToggle
        ? { ...jobToToggle, status: jobToToggle.status === "archived" ? "draft" : ("archived" as const) }
        : job
    })
    setJobs(updatedJobs)
    localStorage.setItem("talentflow-jobs", JSON.stringify(updatedJobs))
    const jobToNotify = jobs.find((job) => job.id === jobId)
    toast({ title: jobToNotify?.status === "archived" ? "Job unarchived!" : "Job archived!" })
  }

  const deleteJob = (jobId: string) => {
    const updatedJobs = jobs.filter((job) => job.id !== jobId)
    setJobs(updatedJobs)
    localStorage.setItem("talentflow-jobs", JSON.stringify(updatedJobs))
    toast({ title: "Job deleted successfully!" })
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(filteredJobs)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order numbers
    const reorderedItems = items.map((item, index) => ({
      ...item,
      order: index + 1,
    }))

    // Optimistic update
    setFilteredJobs(reorderedItems)

    // Update the main jobs array
    const updatedJobs = jobs.map((job) => {
      const reorderedJob = reorderedItems.find((item) => item.id === job.id)
      return reorderedJob || job
    })

    try {
      setJobs(updatedJobs)
      localStorage.setItem("talentflow-jobs", JSON.stringify(updatedJobs))
      toast({ title: "Job order updated!" })
    } catch (error) {
      // Rollback on failure
      setFilteredJobs(filteredJobs)
      toast({ title: "Failed to update order", variant: "destructive" })
    }
  }

  const openEditModal = (job: Job) => {
    setEditingJob(job)
    form.reset({
      title: job.title,
      slug: job.slug,
      description: job.description,
      department: job.department,
      location: job.location,
      type: job.type,
      status: job.status,
      tags: job.tags.join(", "),
    })
    setIsEditModalOpen(true)
  }

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)
  const startIndex = (currentPage - 1) * jobsPerPage
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full"></div>
              <span className="text-xl font-bold">TALENTFLOW</span>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-1">
              <Link href="/">
                <Button variant="ghost" size="sm" className="rounded-full">
                  Dashboard
                </Button>
              </Link>
              <Button variant="default" size="sm" className="rounded-full">
                Jobs
              </Button>
              <Link href="/candidates">
                <Button variant="ghost" size="sm" className="rounded-full">
                  Candidates
                </Button>
              </Link>
              <Link href="/assessments">
                <Button variant="ghost" size="sm" className="rounded-full">
                  Assessments
                </Button>
              </Link>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 pl-16">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Jobs</h1>
            <p className="text-muted-foreground">Manage your job postings and track applications</p>
          </div>

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Job</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onCreateSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Senior Frontend Developer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Engineering" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. San Francisco, CA" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select job type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="full-time">Full Time</SelectItem>
                              <SelectItem value="part-time">Part Time</SelectItem>
                              <SelectItem value="contract">Contract</SelectItem>
                              <SelectItem value="internship">Internship</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Job description..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="published">Published</SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <FormControl>
                            <Input placeholder="React, TypeScript, Remote" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Job</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Jobs Grid with Drag and Drop */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="jobs">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              >
                {paginatedJobs.map((job, index) => (
                  <Draggable key={job.id} draggableId={job.id} index={index}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`transition-all duration-200 ${snapshot.isDragging ? "shadow-lg rotate-2" : ""}`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <div {...provided.dragHandleProps}>
                                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                </div>
                                <Badge
                                  variant={
                                    job.status === "published"
                                      ? "default"
                                      : job.status === "draft"
                                        ? "secondary"
                                        : "outline"
                                  }
                                >
                                  {job.status}
                                </Badge>
                              </div>
                              <CardTitle className="text-lg leading-tight">
                                <Link href={`/jobs/${job.id}`} className="hover:underline">
                                  {job.title}
                                </Link>
                              </CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                {job.department} • {job.location}
                              </p>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditModal(job)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toggleArchiveJob(job.id)}>
                                  <Archive className="h-4 w-4 mr-2" />
                                  {job.status === "archived" ? "Unarchive" : "Archive"}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => deleteJob(job.id)} className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>

                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {job.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{job.applicants} applicants</span>
                            <span>{job.createdAt}</span>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Job</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4">
                {/* Same form fields as create modal */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Senior Frontend Developer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Engineering" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. San Francisco, CA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="full-time">Full Time</SelectItem>
                            <SelectItem value="part-time">Part Time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="internship">Internship</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Job description..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input placeholder="React, TypeScript, Remote" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Job</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
