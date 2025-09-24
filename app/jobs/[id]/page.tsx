"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Plus, Sun, Moon, Settings, X } from "lucide-react"
import Link from "next/link"
import { initializeApp, isAppInitialized } from "@/lib/db-init"
import { JobFormModal } from "@/components/job-form-modal"
import { SortableJobsGrid } from "@/components/sortable-jobs-grid"
import { toast } from "sonner"
import type { Job } from "@/lib/db"

interface JobsResponse {
  jobs: Job[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

function JobsFilters({
  search,
  setSearch,
  status,
  setStatus,
  sort,
  setSort,
  activeFilters,
  clearFilter,
}: {
  search: string
  setSearch: (value: string) => void
  status: string
  setStatus: (value: string) => void
  sort: string
  setSort: (value: string) => void
  activeFilters: Array<{ key: string; label: string; value: string }>
  clearFilter: (key: string) => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs, teams, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="most-applicants">Most Applicants</SelectItem>
              <SelectItem value="least-applicants">Least Applicants</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge key={filter.key} variant="secondary" className="gap-1">
              {filter.label}: {filter.value}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => clearFilter(filter.key)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

function JobsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-8 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-14" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default function JobsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [sort, setSort] = useState("newest")
  const [page, setPage] = useState(1)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isJobModalOpen, setIsJobModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const queryClient = useQueryClient()

  useEffect(() => {
    async function initialize() {
      try {
        // Check if already initialized
        if (isAppInitialized()) {
          console.log("[v0] App already initialized")
          setIsInitialized(true)
          return
        }

        console.log("[v0] Starting app initialization...")
        await initializeApp()
        console.log("[v0] App initialization successful")

        await new Promise((resolve) => setTimeout(resolve, 500))

        setIsInitialized(true)
      } catch (error) {
        console.error("[v0] Failed to initialize app:", error)
        toast.error("Failed to initialize app. Please refresh the page.")
        // Retry after a delay
        setTimeout(() => {
          initialize()
        }, 2000)
      }
    }

    initialize()
  }, [])

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    if (newTheme) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  // Fetch jobs
  const { data, isLoading, error } = useQuery<JobsResponse>({
    queryKey: ["jobs", { search, status, sort, page }],
    queryFn: async () => {
      console.log("[v0] Fetching jobs with params:", { search, status, sort, page })

      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: "12",
        ...(search && { search }),
        ...(status !== "all" && { status }),
        ...(sort && { sort }),
      })

      const url = `/api/jobs?${params}`
      console.log("[v0] Making request to:", url)

      const response = await fetch(url)
      console.log("[v0] Jobs API response status:", response.status)
      console.log("[v0] Jobs API response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Jobs API error response:", errorText)
        throw new Error(`Failed to fetch jobs: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log("[v0] Jobs fetched successfully:", result.jobs?.length, "jobs")
      console.log("[v0] First job:", result.jobs?.[0])
      return result
    },
    enabled: isInitialized,
    retry: (failureCount, error) => {
      console.log("[v0] Query retry attempt:", failureCount, "Error:", error)
      // Retry up to 3 times with exponential backoff
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  const handleCreateJob = () => {
    setSelectedJob(null)
    setModalMode("create")
    setIsJobModalOpen(true)
  }

  const handleEditJob = (job: Job) => {
    setSelectedJob(job)
    setModalMode("edit")
    setIsJobModalOpen(true)
  }

  const handleArchive = async (id: number, archived: boolean) => {
    try {
      const response = await fetch(`/api/jobs/${id}/archive`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived }),
      })
      if (!response.ok) throw new Error("Failed to archive job")

      // Optimistic update
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      toast.success(`Job ${archived ? "archived" : "unarchived"} successfully!`)
    } catch (error) {
      console.error("Error archiving job:", error)
      toast.error("Failed to archive job")
    }
  }

  // Active filters for display
  const activeFilters = [
    ...(search ? [{ key: "search", label: "Search", value: search }] : []),
    ...(status !== "all" ? [{ key: "status", label: "Status", value: status }] : []),
    ...(sort !== "newest" ? [{ key: "sort", label: "Sort", value: sort }] : []),
  ]

  const clearFilter = (key: string) => {
    switch (key) {
      case "search":
        setSearch("")
        break
      case "status":
        setStatus("all")
        break
      case "sort":
        setSort("newest")
        break
    }
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background border-b border-border"
      >
        <div className="container mx-auto py-[22px] leading-4 px-[19px]">
          <div className="flex items-center justify-between mb-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-foreground rounded-full"></div>
              </div>
              <h1 className="text-2xl font-bold text-foreground">TALENTFLOW</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="bg-background border-border text-foreground hover:bg-muted px-4 py-2 rounded-full"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-foreground hover:bg-muted">
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex justify-center gap-[25px]">
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="bg-background border-border text-foreground hover:bg-muted px-6 py-2 rounded-full"
              >
                Dashboard
              </Button>
            </Link>
            <Button className="bg-foreground text-background hover:bg-foreground/90 px-6 py-2 rounded-full">
              Jobs
            </Button>
            <Button
              variant="outline"
              className="bg-background border-border text-foreground hover:bg-muted px-6 py-2 rounded-full"
            >
              Candidates
            </Button>
            <Button
              variant="outline"
              className="bg-background border-border text-foreground hover:bg-muted px-6 py-2 rounded-full"
            >
              Assessments
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Jobs</h2>
            <p className="text-muted-foreground">
              {!isInitialized ? "Initializing..." : data ? `${data.pagination.total} total jobs` : "Loading jobs..."}
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleCreateJob}>
            <Plus className="h-4 w-4 mr-2" />
            Create Job
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <JobsFilters
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            sort={sort}
            setSort={setSort}
            activeFilters={activeFilters}
            clearFilter={clearFilter}
          />
        </motion.div>

        {/* Jobs Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {!isInitialized ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Initializing jobs system...</p>
            </div>
          ) : isLoading ? (
            <JobsSkeleton />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">Error loading jobs: {error.message}</p>
              <Button
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => queryClient.invalidateQueries({ queryKey: ["jobs"] })}
              >
                Retry
              </Button>
            </div>
          ) : data?.jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No jobs found matching your criteria.</p>
            </div>
          ) : (
            <SortableJobsGrid jobs={data?.jobs || []} onArchive={handleArchive} onEdit={handleEditJob} />
          )}
        </motion.div>

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mt-8 gap-2"
          >
            <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm text-muted-foreground">
              Page {page} of {data.pagination.totalPages}
            </span>
            <Button variant="outline" disabled={page === data.pagination.totalPages} onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </motion.div>
        )}
      </main>

      {/* Job Form Modal */}
      <JobFormModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        job={selectedJob}
        mode={modalMode}
      />
    </div>
  )
}
