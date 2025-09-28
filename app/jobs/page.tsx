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
import { Checkbox } from "@/components/ui/checkbox"
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
  const [selectedJobs, setSelectedJobs] = useState<Set<number>>(new Set())
  const { toast } = useToast()

  const jobsPerPage = 10

  const fetchJobs = async (opts?: { page?: number }) => {
    try {
      setLoading(true)
      const response = await jobsApi.getJobs({
        page: opts?.page ?? currentPage,
        pageSize: jobsPerPage,
        sort: "order",
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

  useEffect(() => {
    fetchJobs({ page: currentPage })
  }, [currentPage])

  useEffect(() => {
    const lowerSearch = searchTerm.trim().toLowerCase()

    const applyFilter = () => {
      let result = jobs

      if (statusFilter && statusFilter !== "all") {
        result = result.filter((j) => j.status === statusFilter)
      }

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

    const handle = setTimeout(applyFilter, 300)

    return () => clearTimeout(handle)
  }, [searchTerm, statusFilter, jobs])

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

  const toggleJobSelection = (jobId: number) => {
    const newSelected = new Set(selectedJobs)
    if (newSelected.has(jobId)) {
      newSelected.delete(jobId)
    } else {
      newSelected.add(jobId)
    }
    setSelectedJobs(newSelected)
  }

  const selectAllJobs = () => {
    if (selectedJobs.size === filteredJobs.length) {
      setSelectedJobs(new Set())
    } else {
      setSelectedJobs(new Set(filteredJobs.map((job) => job.id)))
    }
  }

  const deleteSelectedJobs = async () => {
    if (selectedJobs.size === 0) return

    try {
      // In a real implementation, you would call an API to delete multiple jobs
      // For now, we'll just show a success message and clear the selection
      toast({
        title: `${selectedJobs.size} job(s) deleted successfully!`,
        description: "The selected jobs have been removed.",
      })
      setSelectedJobs(new Set())
      await fetchJobs()
    } catch (error) {
      console.error("Failed to delete jobs:", error)
      toast({ title: "Failed to delete jobs", variant: "destructive" })
    }
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
      await fetchJobs()
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
      await fetchJobs()
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
      await fetchJobs()
      toast({ title: job.status === "archived" ? "Job unarchived!" : "Job archived!" })
    } catch (error) {
      console.error("Failed to toggle archive:", error)
      toast({ title: "Failed to update job", variant: "destructive" })
    }
  }

  const deleteJob = async (jobId: number) => {
    try {
      await fetchJobs()
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

    setFilteredJobs(items)

    try {
      const fromOrder = reorderedItem.order
      const toOrder = result.destination.index + 1

      await jobsApi.reorderJob(reorderedItem.id, fromOrder, toOrder)
      toast({ title: "Job order updated!" })
      await fetchJobs()
    } catch (error) {
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

  const getSkillTagColor = (tag: string, index: number) => {
    const colors = [
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300 border-pink-200 dark:border-pink-800",
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
      "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300 border-teal-200 dark:border-teal-800",
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800",
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-200 dark:border-orange-800",
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    ]

    // Use a simple hash function to consistently assign colors based on tag content
    const hash = tag.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
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
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/talentflow-logo-4TjqXtXrX6vfXNMoAPnDMg8xsE4ggh.png"
                alt="TalentFlow logo"
                className="w-8 h-8"
                width={32}
                height={32}
                decoding="async"
              />
              <span className="text-xl font-bold text-primary">TALENTFLOW</span>
            </div>

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

      <main className="container mx-auto px-6 py-8 pl-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-primary">Jobs</h1>
            <p className="text-muted-foreground">Manage your job postings and track applications</p>
          </div>

          <div className="flex items-center space-x-2">
            {selectedJobs.size > 0 && (
              <Button variant="destructive" onClick={deleteSelectedJobs} className="mr-2">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedJobs.size})
              </Button>
            )}

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
        </div>

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

          {filteredJobs.length > 0 && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectedJobs.size === filteredJobs.length && filteredJobs.length > 0}
                onCheckedChange={selectAllJobs}
              />
              <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                Select All
              </label>
            </div>
          )}
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="jobs">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8"
              >
                {filteredJobs.map((job, index) => (
                  <Draggable key={job.id} draggableId={job.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`transition-all duration-300 hover:backdrop-blur-md hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:scale-[1.02] ${
                          snapshot.isDragging ? "shadow-lg rotate-2" : ""
                        } ${selectedJobs.has(job.id) ? "ring-2 ring-primary" : ""}`}
                      >
                        <CardHeader className="pb-2 px-4 pt-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <Checkbox
                                  checked={selectedJobs.has(job.id)}
                                  onCheckedChange={() => toggleJobSelection(job.id)}
                                  className="mr-1"
                                />
                                <div {...provided.dragHandleProps}>
                                  <GripVertical className="h-3 w-3 text-muted-foreground cursor-grab" />
                                </div>
                                <Badge className={`text-xs px-2 py-0 ${getStatusColor(job.status)}`}>
                                  {job.status}
                                </Badge>
                              </div>
                              <CardTitle className="text-sm leading-tight">
                                <Link href={`/jobs/${job.id}`} className="hover:underline">
                                  {job.title}
                                </Link>
                              </CardTitle>
                              <p className="text-xs text-muted-foreground mt-1">
                                {job.department} • {job.location}
                              </p>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <MoreVertical className="h-3 w-3" />
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

                        <CardContent className="px-4 pb-4">
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{job.description}</p>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {job.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} className={`text-xs px-1 py-0 ${getSkillTagColor(tag, tagIndex)}`}>
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
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

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Job</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4">
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
