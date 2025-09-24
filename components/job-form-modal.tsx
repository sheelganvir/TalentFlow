"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { X, Plus, Check, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Job } from "@/lib/db"

interface JobFormModalProps {
  isOpen: boolean
  onClose: () => void
  job?: Job | null
  mode: "create" | "edit"
}

interface JobFormData {
  title: string
  team: string
  location: string
  openings: number
  description: string
  tags: string[]
  status: "Active" | "Archived"
  slug: string
}

const TEAMS = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Customer Success",
  "Data",
  "Security",
  "Operations",
  "Human Resources",
  "Finance",
  "Legal",
  "Documentation",
]

const LOCATIONS = [
  "Remote",
  "San Francisco, CA",
  "New York, NY",
  "Austin, TX",
  "Seattle, WA",
  "Denver, CO",
  "Los Angeles, CA",
  "Chicago, IL",
  "Boston, MA",
  "Miami, FL",
  "Washington, DC",
  "Atlanta, GA",
  "Portland, OR",
  "Phoenix, AZ",
  "Dallas, TX",
  "Minneapolis, MN",
]

const COMMON_TAGS = [
  "React",
  "TypeScript",
  "Next.js",
  "Node.js",
  "Python",
  "PostgreSQL",
  "AWS",
  "Docker",
  "Kubernetes",
  "Machine Learning",
  "Figma",
  "User Research",
  "Product Strategy",
  "Analytics",
  "Digital Marketing",
  "B2B Sales",
  "Customer Relations",
  "Quality Assurance",
  "Cybersecurity",
  "Project Management",
]

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function JobFormModal({ isOpen, onClose, job, mode }: JobFormModalProps) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    team: "",
    location: "",
    openings: 1,
    description: "",
    tags: [],
    status: "Active",
    slug: "",
  })
  const [newTag, setNewTag] = useState("")
  const [slugError, setSlugError] = useState("")
  const [isCheckingSlug, setIsCheckingSlug] = useState(false)

  // Initialize form data when job changes
  useEffect(() => {
    if (job && mode === "edit") {
      setFormData({
        title: job.title,
        team: job.team,
        location: job.location,
        openings: job.openings,
        description: job.description,
        tags: [...job.tags],
        status: job.status,
        slug: job.slug,
      })
    } else {
      setFormData({
        title: "",
        team: "",
        location: "",
        openings: 1,
        description: "",
        tags: [],
        status: "Active",
        slug: "",
      })
    }
    setSlugError("")
  }, [job, mode, isOpen])

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && mode === "create") {
      const newSlug = generateSlug(formData.title)
      setFormData((prev) => ({ ...prev, slug: newSlug }))
    }
  }, [formData.title, mode])

  // Check slug uniqueness
  const checkSlugUniqueness = async (slug: string) => {
    if (!slug || (mode === "edit" && slug === job?.slug)) {
      setSlugError("")
      return
    }

    setIsCheckingSlug(true)
    try {
      const response = await fetch(`/api/jobs?search=${slug}`)
      const data = await response.json()
      const existingJob = data.jobs.find((j: Job) => j.slug === slug)

      if (existingJob) {
        setSlugError("A job with this slug already exists")
      } else {
        setSlugError("")
      }
    } catch (error) {
      console.error("Error checking slug:", error)
    } finally {
      setIsCheckingSlug(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.slug) {
        checkSlugUniqueness(formData.slug)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [formData.slug])

  const createJobMutation = useMutation({
    mutationFn: async (data: JobFormData) => {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          applicantsTrend: [0],
          createdAt: new Date(),
          updatedAt: new Date(),
          order: 0,
        }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create job")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      toast.success("Job created successfully!")
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const updateJobMutation = useMutation({
    mutationFn: async (data: JobFormData) => {
      const response = await fetch(`/api/jobs/${job!.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update job")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      toast.success("Job updated successfully!")
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (slugError) {
      toast.error("Please fix the slug error before submitting")
      return
    }

    if (mode === "create") {
      createJobMutation.mutate(formData)
    } else {
      updateJobMutation.mutate(formData)
    }
  }

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }))
    }
    setNewTag("")
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const isLoading = createJobMutation.isPending || updateJobMutation.isPending
  const isFormValid = formData.title && formData.team && formData.location && formData.slug && !slugError

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {mode === "create" ? "Create New Job" : "Edit Job"}
            </DialogTitle>
            <DialogDescription>
              {mode === "create" ? "Fill in the details to create a new job posting." : "Update the job details below."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Senior Frontend Developer"
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <div className="relative">
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="e.g. senior-frontend-developer"
                  className={slugError ? "border-destructive" : ""}
                  required
                />
                {isCheckingSlug && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
                {!isCheckingSlug && formData.slug && !slugError && (
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
                {slugError && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
                )}
              </div>
              {slugError && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {slugError}
                </p>
              )}
              <p className="text-xs text-muted-foreground">This will be used in the job URL: /jobs/{formData.slug}</p>
            </div>

            {/* Team and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="team">Team *</Label>
                <Select
                  value={formData.team}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, team: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAMS.map((team) => (
                      <SelectItem key={team} value={team}>
                        {team}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, location: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Openings and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="openings">Number of Openings</Label>
                <Input
                  id="openings"
                  type="number"
                  min="1"
                  value={formData.openings}
                  onChange={(e) => setFormData((prev) => ({ ...prev, openings: Number.parseInt(e.target.value) || 1 }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="status"
                    checked={formData.status === "Active"}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, status: checked ? "Active" : "Archived" }))
                    }
                  />
                  <Label htmlFor="status" className="text-sm">
                    {formData.status === "Active" ? "Active" : "Archived"}
                  </Label>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the role, responsibilities, and requirements..."
                rows={4}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Skills & Tags</Label>
              <div className="space-y-3">
                {/* Add new tag */}
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a skill or tag..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag(newTag)
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={() => addTag(newTag)} disabled={!newTag.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Common tags */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Common tags:</p>
                  <div className="flex flex-wrap gap-1">
                    {COMMON_TAGS.filter((tag) => !formData.tags.includes(tag))
                      .slice(0, 10)
                      .map((tag) => (
                        <Button
                          key={tag}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-6 text-xs bg-transparent"
                          onClick={() => addTag(tag)}
                        >
                          {tag}
                        </Button>
                      ))}
                  </div>
                </div>

                {/* Selected tags */}
                {formData.tags.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Selected tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 hover:bg-transparent"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isFormValid || isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {mode === "create" ? "Create Job" : "Update Job"}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
