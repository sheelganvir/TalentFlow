"use client"

import { useState } from "react"
import Link from "next/link"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Settings,
  Moon,
  Sun,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Download,
  MessageSquare,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Grid3X3,
  List,
} from "lucide-react"

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
  const [jobFilter, setJobFilter] = useState("All")
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list")
  const [candidates, setCandidates] = useState(candidatesData)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const openProfile = (candidate: any) => {
    setSelectedCandidate(candidate)
    setIsProfileOpen(true)
  }

  const closeProfile = () => {
    setIsProfileOpen(false)
    setSelectedCandidate(null)
  }

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || candidate.status === statusFilter
    const matchesJob = jobFilter === "All" || candidate.position === jobFilter
    return matchesSearch && matchesStatus && matchesJob
  })

  const uniqueJobs = Array.from(new Set(candidates.map((candidate) => candidate.position))).sort()

  const candidatesByStatus = {
    Applied: filteredCandidates.filter((c) => c.status === "Applied"),
    Screening: filteredCandidates.filter((c) => c.status === "Screening"),
    Interview: filteredCandidates.filter((c) => c.status === "Interview"),
    Offer: filteredCandidates.filter((c) => c.status === "Offer"),
  }

  const statusColumns = [
    { key: "Applied", title: "Applied", color: "bg-blue-50 border-blue-200" },
    { key: "Screening", title: "Screening", color: "bg-yellow-50 border-yellow-200" },
    { key: "Interview", title: "Interview", color: "bg-purple-50 border-purple-200" },
    { key: "Offer", title: "Offer", color: "bg-green-50 border-green-200" },
  ]

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const candidateId = Number.parseInt(draggableId)
    const candidateIndex = candidates.findIndex((c) => c.id === candidateId)

    if (candidateIndex === -1) return

    const updatedCandidates = [...candidates]
    updatedCandidates[candidateIndex] = {
      ...updatedCandidates[candidateIndex],
      status: destination.droppableId,
    }

    setCandidates(updatedCandidates)

    console.log(`Moved candidate ${updatedCandidates[candidateIndex].name} to ${destination.droppableId}`)
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full"></div>
              <span className="text-xl font-bold">TALENTFLOW</span>
            </div>

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance">Candidates</h1>
          <p className="text-muted-foreground mt-2">Manage and review candidate applications</p>
        </div>

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
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm min-w-[200px]"
            >
              <option value="All">All Jobs</option>
              {uniqueJobs.map((job) => (
                <option key={job} value={job}>
                  {job}
                </option>
              ))}
            </select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-r-none"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "kanban" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("kanban")}
                className="rounded-l-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {viewMode === "list" ? (
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
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{candidate.rating}</span>
                    </div>
                  </div>

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

                  <div className="flex space-x-2 pt-2">
                    <Link href={`/candidates/${candidate.id}`} className="flex-1">
                      <Button size="sm" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Schedule Interview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statusColumns.map((column) => (
                <div key={column.key} className={`rounded-lg border-2 ${column.color} p-4`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">{column.title}</h3>
                    <Badge variant="secondary" className="bg-background">
                      {candidatesByStatus[column.key as keyof typeof candidatesByStatus].length}
                    </Badge>
                  </div>
                  <Droppable droppableId={column.key}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-3 max-h-[600px] overflow-y-auto min-h-[200px] ${
                          snapshot.isDraggingOver ? "bg-muted/20 rounded-lg" : ""
                        }`}
                      >
                        {candidatesByStatus[column.key as keyof typeof candidatesByStatus].map((candidate, index) => (
                          <Draggable key={candidate.id} draggableId={candidate.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`hover:shadow-md transition-shadow duration-200 cursor-pointer ${
                                  snapshot.isDragging ? "shadow-lg rotate-2" : ""
                                }`}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center space-x-3 mb-3">
                                    <img
                                      src={candidate.avatar || "/placeholder.svg"}
                                      alt={candidate.name}
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium truncate">{candidate.name}</p>
                                      <p className="text-sm text-muted-foreground truncate">{candidate.position}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-1">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span className="text-xs font-medium">{candidate.rating}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(candidate.appliedDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="flex space-x-1">
                                    <Link href={`/candidates/${candidate.id}`} className="flex-1">
                                      <Button size="sm" variant="outline" className="w-full text-xs bg-transparent">
                                        View
                                      </Button>
                                    </Link>
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {candidatesByStatus[column.key as keyof typeof candidatesByStatus].length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <p className="text-sm">No candidates in {column.title.toLowerCase()}</p>
                            <p className="text-xs mt-1">Drag candidates here</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        )}

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

      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Candidate Profile</DialogTitle>
          </DialogHeader>

          {selectedCandidate && (
            <div className="space-y-6">
              <div className="flex items-start space-x-6 p-6 bg-muted/50 rounded-lg">
                <img
                  src={selectedCandidate.avatar || "/placeholder.svg"}
                  alt={selectedCandidate.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{selectedCandidate.name}</h2>
                  <p className="text-lg text-muted-foreground mb-2">{selectedCandidate.position}</p>
                  <div className="flex items-center space-x-4 mb-3">
                    <Badge className={getStatusColor(selectedCandidate.status)}>{selectedCandidate.status}</Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{selectedCandidate.rating}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Resume
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{selectedCandidate.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{selectedCandidate.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="font-medium">{selectedCandidate.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Applied Date</p>
                          <p className="font-medium">{new Date(selectedCandidate.appliedDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Briefcase className="h-5 w-5 mr-2" />
                        Professional Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        Experienced {selectedCandidate.position.toLowerCase()} with a proven track record of delivering
                        high-quality solutions. Strong technical skills combined with excellent communication abilities.
                        Passionate about innovation and continuous learning. Looking to contribute to a dynamic team
                        environment and drive meaningful impact.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Award className="h-5 w-5 mr-2" />
                        Skills & Technologies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "JavaScript",
                          "TypeScript",
                          "React",
                          "Node.js",
                          "Python",
                          "AWS",
                          "Docker",
                          "Git",
                          "SQL",
                          "MongoDB",
                          "GraphQL",
                          "REST APIs",
                        ].map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Briefcase className="h-5 w-5 mr-2" />
                        Work Experience
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border-l-2 border-primary pl-4">
                        <h4 className="font-semibold">Senior Software Engineer</h4>
                        <p className="text-sm text-muted-foreground">TechCorp Inc. • 2021 - Present</p>
                        <p className="text-sm mt-2">
                          Led development of key features, mentored junior developers, and improved system performance
                          by 40%.
                        </p>
                      </div>
                      <div className="border-l-2 border-muted pl-4">
                        <h4 className="font-semibold">Software Engineer</h4>
                        <p className="text-sm text-muted-foreground">StartupXYZ • 2019 - 2021</p>
                        <p className="text-sm mt-2">
                          Developed full-stack applications using modern technologies and collaborated with
                          cross-functional teams.
                        </p>
                      </div>
                      <div className="border-l-2 border-muted pl-4">
                        <h4 className="font-semibold">Junior Developer</h4>
                        <p className="text-sm text-muted-foreground">WebSolutions • 2018 - 2019</p>
                        <p className="text-sm mt-2">
                          Built responsive web applications and gained experience in agile development methodologies.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <GraduationCap className="h-5 w-5 mr-2" />
                        Education
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold">Bachelor of Science in Computer Science</h4>
                          <p className="text-sm text-muted-foreground">University of Technology • 2014 - 2018</p>
                          <p className="text-sm">GPA: 3.8/4.0 • Magna Cum Laude</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Application Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <div>
                            <p className="font-medium">Application Submitted</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(selectedCandidate.appliedDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {selectedCandidate.status !== "Applied" && (
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <div>
                              <p className="font-medium">Moved to {selectedCandidate.status}</p>
                              <p className="text-sm text-muted-foreground">2 days ago</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
