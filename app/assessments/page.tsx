"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Settings,
  Moon,
  Sun,
  Search,
  Filter,
  Plus,
  FileText,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { assessmentsApi, type Assessment } from "@/lib/api/assessments"
import { useToast } from "@/hooks/use-toast"

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "Draft":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    case "Paused":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "Archived":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "Technical":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "Behavioral":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    case "Case Study":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
    case "Portfolio":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
    case "Coding":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active":
      return <CheckCircle className="h-4 w-4" />
    case "Draft":
      return <FileText className="h-4 w-4" />
    case "Paused":
      return <AlertCircle className="h-4 w-4" />
    case "Archived":
      return <XCircle className="h-4 w-4" />
    default:
      return <FileText className="h-4 w-4" />
  }
}

export default function AssessmentsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { toast } = useToast()

  const fetchAssessments = async () => {
    try {
      setLoading(true)
      const data = await assessmentsApi.getAssessments()
      setAssessments(data)
    } catch (error) {
      console.error("Failed to fetch assessments:", error)
      toast({ title: "Failed to load assessments", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssessments()
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch =
      assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "All" || assessment.type === typeFilter
    const matchesStatus = statusFilter === "All" || assessment.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const handleDeleteAssessment = async (assessmentId: number, assessmentTitle: string) => {
    try {
      setDeletingId(assessmentId)
      await assessmentsApi.deleteAssessment(assessmentId)

      // Remove from local state
      setAssessments((prev) => prev.filter((assessment) => assessment.id !== assessmentId))

      toast({
        title: "Assessment deleted",
        description: `"${assessmentTitle}" has been successfully deleted.`,
      })
    } catch (error) {
      console.error("Failed to delete assessment:", error)
      toast({
        title: "Failed to delete assessment",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading assessments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
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

            {/* Navigation */}
            <nav className="flex items-center space-x-4">
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
              <Button variant="default" size="sm" className="rounded-full">
                Assessments
              </Button>
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
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-balance text-primary">Assessments</h1>
            <p className="text-muted-foreground mt-2">Create and manage candidate assessments</p>
          </div>
          <Link href="/assessments/builder/new">
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Assessment</span>
            </Button>
          </Link>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assessments by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="All">All Types</option>
              <option value="Technical">Technical</option>
              <option value="Behavioral">Behavioral</option>
              <option value="Case Study">Case Study</option>
              <option value="Portfolio">Portfolio</option>
              <option value="Coding">Coding</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Paused">Paused</option>
              <option value="Archived">Archived</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Assessments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssessments.map((assessment) => (
            <Card key={assessment.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-1 mb-2">
                      <Badge className={`text-xs ${getTypeColor(assessment.type)}`}>{assessment.type}</Badge>
                      <Badge className={`text-xs ${getStatusColor(assessment.status)}`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(assessment.status)}
                          <span>{assessment.status}</span>
                        </div>
                      </Badge>
                    </div>
                    <CardTitle className="text-base mb-1 line-clamp-2">{assessment.title}</CardTitle>
                    <p className="text-xs text-muted-foreground line-clamp-2">{assessment.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Assessment Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-1 text-xs">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>{assessment.duration}m</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    <span>{assessment.questions}q</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span>{assessment.candidates}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs">
                    <CheckCircle className="h-3 w-3 text-muted-foreground" />
                    <span>{assessment.completionRate}%</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Completion</span>
                    <span>{assessment.completionRate}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${assessment.completionRate}%` }}
                    ></div>
                  </div>
                </div>

                {/* Created Date */}
                <p className="text-xs text-muted-foreground">{new Date(assessment.createdDate).toLocaleDateString()}</p>

                {/* Action Buttons */}
                <div className="flex space-x-1 pt-1">
                  <Button
                    size="sm"
                    className="flex-1 text-xs h-7 bg-[#00CE97] hover:bg-[#00CE97]/90 text-white border-[#00CE97]"
                  >
                    Results
                  </Button>
                  <Link href={`/assessments/builder/${assessment.id}`}>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent text-xs h-7">
                      Edit
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-2 text-red-600 hover:text-white hover:bg-red-600 border-red-200 hover:border-red-600 bg-transparent h-7"
                        disabled={deletingId === assessment.id}
                      >
                        {deletingId === assessment.id ? (
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Assessment</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{assessment.title}"? This action cannot be undone and will
                          permanently remove the assessment and all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteAssessment(assessment.id, assessment.title)}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          Delete Assessment
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredAssessments.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No assessments found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
            <Link href="/assessments/builder/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Assessment
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
