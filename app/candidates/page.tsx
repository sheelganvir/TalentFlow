"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Settings, Moon, Sun, Search, Filter, MoreVertical, Mail, Phone, MapPin, Calendar, Star } from "lucide-react"

const generateCandidatesData = () => {
  const firstNames = [
    "Sarah",
    "Michael",
    "Emily",
    "David",
    "Lisa",
    "James",
    "Jessica",
    "Robert",
    "Ashley",
    "Christopher",
    "Amanda",
    "Matthew",
    "Jennifer",
    "Daniel",
    "Michelle",
    "Andrew",
    "Stephanie",
    "Joshua",
    "Angela",
    "Brian",
    "Nicole",
    "Kevin",
    "Elizabeth",
    "Ryan",
    "Heather",
    "Jacob",
    "Amy",
    "Nicholas",
    "Rebecca",
    "Tyler",
    "Samantha",
    "Jonathan",
    "Rachel",
    "Brandon",
    "Laura",
    "Zachary",
    "Kimberly",
    "Anthony",
    "Megan",
    "William",
    "Kayla",
    "Justin",
    "Brittany",
    "Jason",
    "Danielle",
    "Aaron",
    "Christina",
    "Jose",
    "Marie",
    "Adam",
    "Janet",
    "Nathan",
    "Catherine",
    "Evan",
    "Frances",
    "Noah",
    "Christine",
    "Carlos",
    "Deborah",
    "Alex",
    "Rachel",
    "Jordan",
    "Emma",
    "Kyle",
    "Olivia",
    "Sean",
    "Hannah",
    "Luke",
    "Grace",
    "Mason",
    "Victoria",
    "Hunter",
    "Sophia",
    "Connor",
    "Isabella",
    "Owen",
    "Mia",
    "Aiden",
    "Charlotte",
    "Lucas",
    "Abigail",
    "Jackson",
    "Emily",
    "Logan",
    "Harper",
    "Caleb",
    "Amelia",
    "Noah",
    "Evelyn",
    "Ethan",
    "Elizabeth",
    "Sebastian",
    "Sofia",
    "Oliver",
    "Avery",
    "Elijah",
    "Ella",
    "Liam",
    "Scarlett",
    "Benjamin",
  ]

  const lastNames = [
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
    "Lee",
    "Perez",
    "Thompson",
    "White",
    "Harris",
    "Sanchez",
    "Clark",
    "Ramirez",
    "Lewis",
    "Robinson",
    "Walker",
    "Young",
    "Allen",
    "King",
    "Wright",
    "Scott",
    "Torres",
    "Nguyen",
    "Hill",
    "Flores",
    "Green",
    "Adams",
    "Nelson",
    "Baker",
    "Hall",
    "Rivera",
    "Campbell",
    "Mitchell",
    "Carter",
    "Roberts",
    "Gomez",
    "Phillips",
    "Evans",
    "Turner",
    "Diaz",
    "Parker",
    "Cruz",
    "Edwards",
    "Collins",
    "Reyes",
    "Stewart",
    "Morris",
    "Morales",
    "Murphy",
    "Cook",
    "Rogers",
    "Gutierrez",
    "Ortiz",
    "Morgan",
    "Cooper",
    "Peterson",
    "Bailey",
    "Reed",
    "Kelly",
    "Howard",
    "Ramos",
    "Kim",
    "Cox",
    "Ward",
    "Richardson",
    "Watson",
    "Brooks",
    "Chavez",
    "Wood",
    "James",
    "Bennett",
    "Gray",
    "Mendoza",
    "Ruiz",
    "Hughes",
    "Price",
    "Alvarez",
    "Castillo",
    "Sanders",
    "Patel",
    "Myers",
    "Long",
    "Ross",
    "Foster",
    "Jimenez",
    "Powell",
  ]

  const cities = [
    "San Francisco, CA",
    "New York, NY",
    "Austin, TX",
    "Seattle, WA",
    "Boston, MA",
    "Chicago, IL",
    "Los Angeles, CA",
    "Denver, CO",
    "Atlanta, GA",
    "Miami, FL",
    "Portland, OR",
    "Nashville, TN",
    "Phoenix, AZ",
    "Dallas, TX",
    "Houston, TX",
    "Philadelphia, PA",
    "San Diego, CA",
    "Minneapolis, MN",
    "Detroit, MI",
    "Tampa, FL",
    "Orlando, FL",
    "Charlotte, NC",
    "Raleigh, NC",
    "Salt Lake City, UT",
    "Las Vegas, NV",
    "Kansas City, MO",
    "Columbus, OH",
    "Indianapolis, IN",
    "San Antonio, TX",
    "Jacksonville, FL",
  ]

  const jobTitles = [
    "Senior Frontend Developer",
    "Product Manager",
    "UX Designer",
    "Marketing Intern",
    "Backend Engineer",
    "Data Scientist",
    "DevOps Engineer",
    "Content Strategist",
    "Customer Support Specialist",
    "QA Engineer",
    "Human Resources Manager",
    "Junior Graphic Designer",
    "Sales Development Representative",
    "IT Support Technician",
    "Mobile Developer",
    "Financial Analyst",
    "Copywriter",
    "Scrum Master",
    "Social Media Manager",
    "Solutions Architect",
    "Business Analyst",
    "Recruiter",
    "UI Designer",
    "Security Engineer",
    "Technical Writer",
  ]

  const statuses = ["Applied", "Screening", "Interview", "Offer"]
  const avatars = [
    "/professional-woman-diverse.png",
    "/professional-man.jpg",
    "/professional-woman-designer.png",
    "/professional-engineer.png",
    "/professional-woman-manager.png",
    "/professional-man-developer.png",
  ]

  const candidates = []

  for (let i = 1; i <= 987; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const name = `${firstName} ${lastName}`
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`
    const phone = `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
    const location = cities[Math.floor(Math.random() * cities.length)]
    const position = jobTitles[Math.floor(Math.random() * jobTitles.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const rating = (Math.random() * 1.5 + 3.5).toFixed(1) // Rating between 3.5 and 5.0
    const avatar = avatars[Math.floor(Math.random() * avatars.length)]

    // Generate random application date within the last 60 days
    const daysAgo = Math.floor(Math.random() * 60)
    const appliedDate = new Date()
    appliedDate.setDate(appliedDate.getDate() - daysAgo)

    candidates.push({
      id: i,
      name,
      email,
      phone,
      location,
      position,
      status,
      rating: Number.parseFloat(rating),
      appliedDate: appliedDate.toISOString().split("T")[0],
      avatar,
    })
  }

  return candidates
}

const candidatesData = generateCandidatesData()

const getStatusColor = (status: string) => {
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

export default function CandidatesPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const filteredCandidates = candidatesData.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || candidate.status === statusFilter
    return matchesSearch && matchesStatus
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
              <Button variant="default" size="sm" className="rounded-full">
                Candidates
              </Button>
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
          <h1 className="text-3xl font-bold text-balance">Candidates</h1>
          <p className="text-muted-foreground mt-2">Manage and review candidate applications</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search candidates by name, position, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="All">All Status</option>
              <option value="Applied">Applied</option>
              <option value="Screening">Screening</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={candidate.avatar || "/placeholder.svg"}
                      alt={candidate.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">{candidate.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{candidate.position}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status and Rating */}
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{candidate.rating}</span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{candidate.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{candidate.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{candidate.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Applied {new Date(candidate.appliedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" className="flex-1">
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Schedule Interview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No candidates found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>
    </div>
  )
}
