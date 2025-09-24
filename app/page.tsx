"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Plus,
  Users,
  Briefcase,
  UserCheck,
  FileText,
  TrendingUp,
  TrendingDown,
  Sun,
  Moon,
  Settings,
} from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

// Mock data for the dashboard
const kpiData = [
  {
    title: "Active Jobs",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: Briefcase,
    sparklineData: [{ value: 18 }, { value: 20 }, { value: 19 }, { value: 22 }, { value: 21 }, { value: 24 }],
  },
  {
    title: "Candidates in Pipeline",
    value: "156",
    change: "+8%",
    trend: "up",
    icon: Users,
    sparklineData: [{ value: 140 }, { value: 145 }, { value: 150 }, { value: 148 }, { value: 152 }, { value: 156 }],
  },
  {
    title: "Hires this Month",
    value: "12",
    change: "+25%",
    trend: "up",
    icon: UserCheck,
    sparklineData: [{ value: 8 }, { value: 9 }, { value: 10 }, { value: 11 }, { value: 10 }, { value: 12 }],
  },
  {
    title: "Assessments Created",
    value: "38",
    change: "-5%",
    trend: "down",
    icon: FileText,
    sparklineData: [{ value: 42 }, { value: 40 }, { value: 39 }, { value: 41 }, { value: 40 }, { value: 38 }],
  },
]

const pipelineData = [
  { name: "Applied", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Screening", value: 32, color: "hsl(var(--chart-2))" },
  { name: "Interview", value: 28, color: "hsl(var(--chart-3))" },
  { name: "Offer", value: 15, color: "hsl(var(--chart-4))" },
  { name: "Hired", value: 12, color: "hsl(var(--chart-5))" },
]

const candidatesOverTimeData = [
  { week: "Week 1", candidates: 120 },
  { week: "Week 2", candidates: 135 },
  { week: "Week 3", candidates: 128 },
  { week: "Week 4", candidates: 142 },
  { week: "Week 5", candidates: 156 },
  { week: "Week 6", candidates: 148 },
  { week: "Week 7", candidates: 162 },
  { week: "Week 8", candidates: 156 },
]

const jobOpeningsData = [
  { month: "Jan", openings: 18 },
  { month: "Feb", openings: 22 },
  { month: "Mar", openings: 20 },
  { month: "Apr", openings: 24 },
  { month: "May", openings: 28 },
  { month: "Jun", openings: 24 },
]

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")

    if (savedTheme === "dark") {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
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

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background border-b border-border"
      >
        <div className="container mx-auto py-[22px] leading-4 px-[19px]">
          <div className="text-center mb-6"></div>

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
            <Button className="bg-foreground text-background hover:bg-foreground/90 px-6 py-2 rounded-full">
              Dashboard
            </Button>
            <Link href="/jobs">
              <Button
                variant="outline"
                className="bg-background border-border text-foreground hover:bg-muted px-6 py-2 rounded-full"
              >
                Jobs
              </Button>
            </Link>
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
        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {kpiData.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <kpi.icon className="h-5 w-5 text-muted-foreground" />
                    <div
                      className={`flex items-center text-sm ${kpi.trend === "up" ? "text-green-500" : "text-red-500"}`}
                    >
                      {kpi.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {kpi.change}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                    <div className="text-sm text-muted-foreground">{kpi.title}</div>
                    <div className="h-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={kpi.sparklineData}>
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {/* Pipeline Distribution */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <CardHeader>
                <CardTitle className="text-foreground">Pipeline Distribution</CardTitle>
                <CardDescription>Candidates by hiring stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pipelineData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pipelineData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--foreground))",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {pipelineData.map((item, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">
                        {item.name}: {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Candidates Over Time */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <CardHeader>
                <CardTitle className="text-foreground">Candidates Over Time</CardTitle>
                <CardDescription>Weekly candidate growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={candidatesOverTimeData}>
                      <defs>
                        <linearGradient id="candidatesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--foreground))",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="candidates"
                        stroke="hsl(var(--chart-2))"
                        fillOpacity={1}
                        fill="url(#candidatesGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Job Openings Trend */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <CardHeader>
                <CardTitle className="text-foreground">Job Openings Trend</CardTitle>
                <CardDescription>Monthly job postings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={jobOpeningsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--foreground))",
                        }}
                      />
                      <Bar dataKey="openings" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-8 right-8"
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <Button
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
