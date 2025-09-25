"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Moon, Sun, ArrowLeft, Edit, Archive, Trash2, MapPin, Building, Calendar, Users } from "lucide-react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Job } from "@/types/job"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function JobDetailPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const jobId = params.jobId as string

  useEffect(() => {
    const savedJobs = localStorage.getItem("talentflow-jobs")
    if (savedJobs) {
      const jobs: Job[] = JSON.parse(savedJobs)
      const foundJob = jobs.find((j) => j.id === jobId)
      if (foundJob) {
        setJob(foundJob)
      } else {
        toast({ title: "Job not found", variant: "destructive" })
        router.push("/jobs")
      }
    } else {
      toast({ title: "No jobs data found", variant: "destructive" })
      router.push("/jobs")
    }
    setLoading(false)
  }, [jobId, router, toast])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const toggleArchiveJob = () => {
    if (!job) return

    const savedJobs = localStorage.getItem("talentflow-jobs")
    if (savedJobs) {
      const jobs: Job[] = JSON.parse(savedJobs)
      const updatedJobs = jobs.map((j) =>
        j.id === job.id ? { ...j, status: j.status === "archived" ? "draft" : ("archived" as const) } : j,
      )
      localStorage.setItem("talentflow-jobs", JSON.stringify(updatedJobs))
      setJob((prev) => (prev ? { ...prev, status: prev.status === "archived" ? "draft" : "archived" } : null))
      toast({ title: job.status === "archived" ? "Job unarchived!" : "Job archived!" })
    }
  }

  const deleteJob = () => {
    if (!job) return

    const savedJobs = localStorage.getItem("talentflow-jobs")
    if (savedJobs) {
      const jobs: Job[] = JSON.parse(savedJobs)
      const updatedJobs = jobs.filter((j) => j.id !== job.id)
      localStorage.setItem("talentflow-jobs", JSON.stringify(updatedJobs))
      toast({ title: "Job deleted successfully!" })
      router.push("/jobs")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return null
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
            <nav className="flex items-center space-x-1">
              <Link href="/">
                <Button variant="ghost" size="sm" className="rounded-full">
                  Dashboard
                </Button>
              </Link>
              <Link href="/jobs">
                <Button variant="ghost" size="sm" className="rounded-full">
                  Jobs
                </Button>
              </Link>
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
      <main className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/jobs">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>

        {/* Job Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <Badge
                variant={job.status === "published" ? "default" : job.status === "draft" ? "secondary" : "outline"}
              >
                {job.status}
              </Badge>
              <span className="text-sm text-muted-foreground">#{job.id}</span>
            </div>

            <h1 className="text-4xl font-bold mb-4 text-balance">{job.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4" />
                <span>{job.department}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Posted {job.createdAt}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>{job.applicants} applicants</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit Job
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleArchiveJob}>
                <Archive className="h-4 w-4 mr-2" />
                {job.status === "archived" ? "Unarchive" : "Archive"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={deleteJob} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• 3+ years of experience in relevant field</li>
                    <li>• Strong communication and collaboration skills</li>
                    <li>• Experience with modern development tools and practices</li>
                    <li>• Bachelor's degree or equivalent experience</li>
                    <li>• Ability to work in a fast-paced environment</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Competitive salary and equity package</li>
                    <li>• Comprehensive health, dental, and vision insurance</li>
                    <li>• Flexible work arrangements and remote options</li>
                    <li>• Professional development opportunities</li>
                    <li>• Generous PTO and parental leave policies</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Job Type</h4>
                  <p className="text-sm text-muted-foreground capitalize">{job.type.replace("-", " ")}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Department</h4>
                  <p className="text-sm text-muted-foreground">{job.department}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Location</h4>
                  <p className="text-sm text-muted-foreground">{job.location}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Status</h4>
                  <Badge
                    variant={job.status === "published" ? "default" : job.status === "draft" ? "secondary" : "outline"}
                  >
                    {job.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Total Applications</h4>
                  <p className="text-2xl font-bold">{job.applicants}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">New This Week</h4>
                  <p className="text-2xl font-bold text-green-600">+{Math.floor(job.applicants * 0.3)}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">In Review</h4>
                  <p className="text-2xl font-bold text-blue-600">{Math.floor(job.applicants * 0.4)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" size="sm">
                  View Applications
                </Button>
                <Button variant="outline" className="w-full bg-transparent" size="sm">
                  Share Job
                </Button>
                <Button variant="outline" className="w-full bg-transparent" size="sm">
                  Duplicate Job
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
