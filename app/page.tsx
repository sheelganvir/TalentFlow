"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Moon, Sun, Plus, Briefcase, Users, UserCheck, FileText, TrendingUp } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"

const candidatesData = [
  { week: "Week 1", candidates: 45 },
  { week: "Week 2", candidates: 52 },
  { week: "Week 3", candidates: 48 },
  { week: "Week 4", candidates: 61 },
  { week: "Week 5", candidates: 55 },
  { week: "Week 6", candidates: 67 },
  { week: "Week 8", candidates: 73 },
]

const pipelineData = [
  { name: "Applied", value: 45, color: "#8884d8" },
  { name: "Screening", value: 32, color: "#82ca9d" },
  { name: "Interview", value: 28, color: "#ffc658" },
  { name: "Offer", value: 15, color: "#ff7300" },
  { name: "Hired", value: 12, color: "#00ff00" },
]

const jobOpeningsData = [
  { month: "Jan", openings: 18 },
  { month: "Feb", openings: 22 },
  { month: "Mar", openings: 19 },
  { month: "Apr", openings: 25 },
  { month: "May", openings: 28 },
  { month: "Jun", openings: 24 },
]

const recentJobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    department: "Engineering",
    status: "published",
    createdAt: "2024-01-15",
    applicants: 24,
  },
  {
    id: "5",
    title: "Backend Engineer",
    department: "Engineering",
    status: "published",
    createdAt: "2024-01-20",
    applicants: 31,
  },
  {
    id: "7",
    title: "DevOps Engineer",
    department: "Engineering",
    status: "draft",
    createdAt: "2024-01-16",
    applicants: 15,
  },
  {
    id: "3",
    title: "UX Designer",
    department: "Design",
    status: "draft",
    createdAt: "2024-01-10",
    applicants: 12,
  },
  {
    id: "8",
    title: "Content Strategist",
    department: "Marketing",
    status: "published",
    createdAt: "2024-01-14",
    applicants: 10,
  },
]

const recentCandidates = [
  {
    id: 4,
    name: "David Kim",
    position: "DevOps Engineer",
    status: "Applied",
    appliedDate: "2024-01-20",
    avatar: "/professional-engineer.png",
  },
  {
    id: 6,
    name: "James Wilson",
    position: "Backend Developer",
    status: "Screening",
    appliedDate: "2024-01-19",
    avatar: "/professional-man-developer.png",
  },
  {
    id: 1,
    name: "Sarah Johnson",
    position: "Senior Frontend Developer",
    status: "Interview",
    appliedDate: "2024-01-15",
    avatar: "/professional-woman-diverse.png",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    position: "Product Manager",
    status: "Interview",
    appliedDate: "2024-01-16",
    avatar: "/professional-woman-manager.png",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    position: "UX Designer",
    status: "Offer",
    appliedDate: "2024-01-12",
    avatar: "/professional-woman-designer.png",
  },
]

const recentAssessments = [
  {
    id: 2,
    title: "UX Designer Portfolio Review",
    type: "Portfolio",
    status: "Draft",
    createdDate: "2024-01-15",
    candidates: 6,
  },
  {
    id: 6,
    title: "Data Analyst SQL Assessment",
    type: "Technical",
    status: "Active",
    createdDate: "2024-01-14",
    candidates: 9,
  },
  {
    id: 5,
    title: "Sales Representative Simulation",
    type: "Behavioral",
    status: "Paused",
    createdDate: "2024-01-12",
    candidates: 4,
  },
  {
    id: 1,
    title: "Frontend Developer Technical Assessment",
    type: "Technical",
    status: "Active",
    createdDate: "2024-01-10",
    candidates: 12,
  },
  {
    id: 3,
    title: "Product Manager Case Study",
    type: "Case Study",
    status: "Active",
    createdDate: "2024-01-08",
    candidates: 8,
  },
]

const getJobStatusColor = (status: string) => {
  switch (status) {
    case "published":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "draft":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "archived":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

const getCandidateStatusColor = (status: string) => {
  switch (status) {
    case "Applied":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "Screening":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "Interview":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    case "Offer":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

const getAssessmentStatusColor = (status: string) => {
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

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className={`min-h-screen bg-background transition-colors duration-300`}>
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
              <Button variant="default" size="sm" className="rounded-full">
                Dashboard
              </Button>
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
      <main className="container mx-auto px-6 py-8 pl-16">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance">TalentFlow Dashboard</h1>
          <p className="text-muted-foreground mt-2">Overview of jobs, candidates, and assessments</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12%
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Candidates in Pipeline</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8%
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hires this Month</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +25%
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assessments Created</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">38</div>
              <p className="text-xs text-red-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                -5%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pipeline Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Distribution</CardTitle>
              <p className="text-sm text-muted-foreground">Candidates by hiring stage</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pipelineData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Applied: 45</span>
                  <span>Screening: 32</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Interview: 28</span>
                  <span>Offer: 15</span>
                </div>
                <div className="text-sm">
                  <span>Hired: 12</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Candidates Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Candidates Over Time</CardTitle>
              <p className="text-sm text-muted-foreground">Weekly candidate growth</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={candidatesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="candidates" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Job Openings Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Job Openings Trend</CardTitle>
              <p className="text-sm text-muted-foreground">Monthly job postings</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={jobOpeningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="openings" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Jobs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Jobs
                <Link href="/jobs">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </CardTitle>
              <p className="text-sm text-muted-foreground">Latest job postings</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{job.title}</h4>
                    <p className="text-xs text-muted-foreground">{job.department}</p>
                    <p className="text-xs text-muted-foreground">{job.applicants} applicants</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge className={getJobStatusColor(job.status)} variant="secondary">
                      {job.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{job.createdAt}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Candidates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Candidates
                <Link href="/candidates">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </CardTitle>
              <p className="text-sm text-muted-foreground">Latest candidate applications</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentCandidates.map((candidate) => (
                <div key={candidate.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <img
                      src={candidate.avatar || "/placeholder.svg"}
                      alt={candidate.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-sm">{candidate.name}</h4>
                      <p className="text-xs text-muted-foreground">{candidate.position}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge className={getCandidateStatusColor(candidate.status)} variant="secondary">
                      {candidate.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{candidate.appliedDate}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Assessments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Assessments
                <Link href="/assessments">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </CardTitle>
              <p className="text-sm text-muted-foreground">Latest assessment activities</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAssessments.map((assessment) => (
                <div key={assessment.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{assessment.title}</h4>
                    <p className="text-xs text-muted-foreground">{assessment.type}</p>
                    <p className="text-xs text-muted-foreground">{assessment.candidates} candidates</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge className={getAssessmentStatusColor(assessment.status)} variant="secondary">
                      {assessment.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{assessment.createdDate}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Floating Action Button */}
      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 animate-bounce"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}
