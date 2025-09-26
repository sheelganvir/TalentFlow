"use client"

import { useState } from "react"
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
} from "lucide-react"

const assessmentsData = [
  {
    id: 1,
    title: "Frontend Developer Technical Assessment",
    description: "Comprehensive evaluation covering React, JavaScript, and CSS fundamentals",
    type: "Technical",
    duration: 90,
    questions: 25,
    candidates: 12,
    status: "Active",
    createdDate: "2024-01-10",
    completionRate: 85,
  },
  {
    id: 2,
    title: "UX Designer Portfolio Review",
    description: "Design thinking and portfolio assessment for UX positions",
    type: "Portfolio",
    duration: 60,
    questions: 8,
    candidates: 6,
    status: "Draft",
    createdDate: "2024-01-15",
    completionRate: 0,
  },
  {
    id: 3,
    title: "Product Manager Case Study",
    description: "Strategic thinking and product management scenario analysis",
    type: "Case Study",
    duration: 120,
    questions: 5,
    candidates: 8,
    status: "Active",
    createdDate: "2024-01-08",
    completionRate: 92,
  },
  {
    id: 4,
    title: "Backend Developer Coding Challenge",
    description: "Algorithm and system design problems for backend roles",
    type: "Coding",
    duration: 180,
    questions: 15,
    candidates: 18,
    status: "Active",
    createdDate: "2024-01-05",
    completionRate: 78,
  },
  {
    id: 5,
    title: "Sales Representative Simulation",
    description: "Role-playing scenarios and communication skills assessment",
    type: "Behavioral",
    duration: 45,
    questions: 12,
    candidates: 4,
    status: "Paused",
    createdDate: "2024-01-12",
    completionRate: 67,
  },
  {
    id: 6,
    title: "Data Analyst SQL Assessment",
    description: "Database querying and data analysis skills evaluation",
    type: "Technical",
    duration: 75,
    questions: 20,
    candidates: 9,
    status: "Active",
    createdDate: "2024-01-14",
    completionRate: 89,
  },
]

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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const filteredAssessments = assessmentsData.filter((assessment) => {
    const matchesSearch =
      assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "All" || assessment.type === typeFilter
    const matchesStatus = statusFilter === "All" || assessment.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
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
            <h1 className="text-3xl font-bold text-balance">Assessments</h1>
            <p className="text-muted-foreground mt-2">Create and manage candidate assessments</p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create Assessment</span>
          </Button>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAssessments.map((assessment) => (
            <Card key={assessment.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getTypeColor(assessment.type)}>{assessment.type}</Badge>
                      <Badge className={getStatusColor(assessment.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(assessment.status)}
                          <span>{assessment.status}</span>
                        </div>
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mb-2">{assessment.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{assessment.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Assessment Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{assessment.duration} minutes</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{assessment.questions} questions</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{assessment.candidates} candidates</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span>{assessment.completionRate}% completion</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completion Rate</span>
                    <span>{assessment.completionRate}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${assessment.completionRate}%` }}
                    ></div>
                  </div>
                </div>

                {/* Created Date */}
                <p className="text-xs text-muted-foreground">
                  Created on {new Date(assessment.createdDate).toLocaleDateString()}
                </p>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" className="flex-1">
                    View Results
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Edit Assessment
                  </Button>
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Assessment
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
