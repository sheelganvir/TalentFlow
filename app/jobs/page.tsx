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
import { jobsApi, type Job } from "@/lib/api/jobs"

const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
  type: z.enum(["full-time", "part-time", "contract", "internship"]),
  status: z.enum(["draft", "active", "archived"]),
  tags: z.string(),
})

export default function JobsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const jobsPerPage = 10

// ---------- REPLACE the existing fetchJobs + the "Debounced search" useEffect ----------

const fetchJobs = async (opts?: { page?: number }) => {
  try {
    setLoading(true)
    // fetch from server without search filter (we'll filter client-side)
    const response = await jobsApi.getJobs({
      // keep server paging for initial load / re-loads that rely on server pagination
      page: opts?.page ?? currentPage,
      pageSize: jobsPerPage,
      sort: "order",
      // note: intentionally not passing `search` or `status` here so we can filter locally
    })
    setJobs(response.jobs)
    setFilteredJobs(response.jobs)
    setTotalPages(response.totalPages)
  } catch (error) {
    console.error("Failed to fetch jobs:", error)
    toast({ title: "Failed to load jobs", variant: "destructive" })
  } finally {
    setLoading(false)
  }
}

// Initial load — fetch jobs once when component mounts or when currentPage changes (keeps server pagination)
useEffect(() => {
  fetchJobs({ page: currentPage })
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [currentPage])

// Client-side debounced filtering (mirrors Candidates page behaviour)
// - Filters by title, department, location, tags, and description
// - Debounce so filtering doesn't run on every keystroke immediately
useEffect(() => {
  const lowerSearch = searchTerm.trim().toLowerCase()

  const applyFilter = () => {
    let result = jobs

    // Status filter (client-side)
    if (statusFilter && statusFilter !== "all") {
      result = result.filter((j) => j.status === statusFilter)
    }

    // Search filter (client-side) — check multiple fields
    if (lowerSearch.length > 0) {
      result = result.filter((j) => {
        const inTitle = j.title?.toLowerCase().includes(lowerSearch)
        const inDept = j.department?.toLowerCase().includes(lowerSearch)
        const inLocation = j.location?.toLowerCase().includes(lowerSearch)
        const inDescription = j.description?.toLowerCase().includes(lowerSearch)
        const inTags = j.tags?.some((t: string) => t.toLowerCase().includes(lowerSearch))
        return inTitle || inDept || inLocation || inDescription || inTags
      })
    }

    setFilteredJobs(result)
  }

  const handle = setTimeout(applyFilter, 300) // 300ms debounce to feel snappy

  return () => clearTimeout(handle)
}, [searchTerm, statusFilter, jobs])

// Optional: if you still want a button or action to explicitly refresh from server,
// keep calling fetchJobs() where needed (create/update/delete/reorder currently call it).



  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
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

  const onCreateSubmit = async (values: z.infer<typeof jobSchema>) => {
    try {
      const slug = generateSlug(values.title)
      const newJob = {
        title: values.title,
        slug,
        description: values.description,
        department: values.department,
        location: values.location,
        type: values.type,
        status: values.status as "active" | "archived" | "draft",
        tags: values.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        order: jobs.length + 1,
      }

      await jobsApi.createJob(newJob)
      await fetchJobs() // Refresh the list
      setIsCreateModalOpen(false)
      form.reset()
      toast({ title: "Job created successfully!" })
    } catch (error) {
      console.error("Failed to create job:", error)
      toast({ title: "Failed to create job", variant: "destructive" })
    }
  }

  const onEditSubmit = async (values: z.infer<typeof jobSchema>) => {
    if (!editingJob) return

    try {
      const slug = generateSlug(values.title)
      const updates = {
        title: values.title,
        slug,
        description: values.description,
        department: values.department,
        location: values.location,
        type: values.type,
        status: values.status as "active" | "archived" | "draft",
        tags: values.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }

      await jobsApi.updateJob(editingJob.id, updates)
      await fetchJobs() // Refresh the list
      setIsEditModalOpen(false)
      setEditingJob(null)
      form.reset()
      toast({ title: "Job updated successfully!" })
    } catch (error) {
      console.error("Failed to update job:", error)
      toast({ title: "Failed to update job", variant: "destructive" })
    }
  }

  const toggleArchiveJob = async (jobId: number) => {
    try {
      const job = jobs.find((j) => j.id === jobId)
      if (!job) return

      const newStatus = job.status === "archived" ? "draft" : "archived"
      await jobsApi.updateJob(jobId, { status: newStatus })
      await fetchJobs() // Refresh the list
      toast({ title: job.status === "archived" ? "Job unarchived!" : "Job archived!" })
    } catch (error) {
      console.error("Failed to toggle archive:", error)
      toast({ title: "Failed to update job", variant: "destructive" })
    }
  }

  const deleteJob = async (jobId: number) => {
    try {
      // Note: Delete endpoint not implemented in MSW handlers
      // await jobsApi.deleteJob(jobId)
      await fetchJobs() // Refresh the list
      toast({ title: "Job deleted successfully!" })
    } catch (error) {
      console.error("Failed to delete job:", error)
      toast({ title: "Delete not implemented yet", variant: "destructive" })
    }
  }

  const onDragEnd = async (result: any) => {
    if (!result.destination) return

    const items = Array.from(filteredJobs)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Optimistic update
    setFilteredJobs(items)

    try {
      const fromOrder = reorderedItem.order
      const toOrder = result.destination.index + 1

      await jobsApi.reorderJob(reorderedItem.id, fromOrder, toOrder)
      toast({ title: "Job order updated!" })
      await fetchJobs() // Refresh to get updated order
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
      description: job.description,
      department: job.department,
      location: job.location,
      type: job.type as any,
      status: job.status as any,
      tags: job.tags.join(", "),
    })
    setIsEditModalOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading jobs...</p>
        </div>
      </div>
    )
  }

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
            <nav className="flex items-center space-x-4">
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
                              <SelectItem value="active">Active</SelectItem>
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
              <SelectItem value="active">Active</SelectItem>
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
                {filteredJobs.map((job, index) => (
                  <Draggable key={job.id} draggableId={job.id.toString()} index={index}>
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
                                <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
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
                            <span>{job.postedDate}</span>
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

        {/* Edit Modal - Same structure as create modal */}
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
                            <SelectItem value="active">Active</SelectItem>
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
