"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
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
  Send,
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
    const rating = (Math.random() * 1.5 + 3.5).toFixed(1)
    const avatar = avatars[Math.floor(Math.random() * avatars.length)]

    const daysAgo = Math.floor(Math.random() * 60)
    const appliedDate = new Date()
    appliedDate.setDate(appliedDate.getDate() - daysAgo)

    const timeline = [
      {
        status: "Applied",
        date: appliedDate.toISOString().split("T")[0],
        note: "Application submitted successfully",
      },
    ]

    if (status !== "Applied") {
      const screeningDate = new Date(appliedDate)
      screeningDate.setDate(screeningDate.getDate() + Math.floor(Math.random() * 5) + 1)
      timeline.push({
        status: "Screening",
        date: screeningDate.toISOString().split("T")[0],
        note: "Initial screening completed",
      })
    }

    if (status === "Interview" || status === "Offer") {
      const interviewDate = new Date(appliedDate)
      interviewDate.setDate(interviewDate.getDate() + Math.floor(Math.random() * 10) + 5)
      timeline.push({
        status: "Interview",
        date: interviewDate.toISOString().split("T")[0],
        note: "Technical interview scheduled",
      })
    }

    if (status === "Offer") {
      const offerDate = new Date(appliedDate)
      offerDate.setDate(offerDate.getDate() + Math.floor(Math.random() * 15) + 10)
      timeline.push({
        status: "Offer",
        date: offerDate.toISOString().split("T")[0],
        note: "Offer extended",
      })
    }

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
      timeline,
      notes: [],
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

const teamMembers = [
  { id: 1, name: "John Smith", role: "Hiring Manager" },
  { id: 2, name: "Sarah Johnson", role: "Technical Lead" },
  { id: 3, name: "Mike Chen", role: "HR Specialist" },
  { id: 4, name: "Emily Davis", role: "Team Lead" },
  { id: 5, name: "Alex Rodriguez", role: "Senior Developer" },
]

export default function CandidateDetailPage() {
  const params = useParams()
  const candidateId = Number.parseInt(params.id as string)
  const candidate = candidatesData.find((c) => c.id === candidateId)

  const [newNote, setNewNote] = useState("")
  const [showMentions, setShowMentions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState("")
  const [notes, setNotes] = useState(candidate?.notes || [])

  if (!candidate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Candidate Not Found</h1>
          <p className="text-muted-foreground mb-4">The candidate you're looking for doesn't exist.</p>
          <Link href="/candidates">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Candidates
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleNoteChange = (value: string) => {
    setNewNote(value)
    const lastAtIndex = value.lastIndexOf("@")
    if (lastAtIndex !== -1 && lastAtIndex === value.length - 1) {
      setShowMentions(true)
      setMentionQuery("")
    } else if (lastAtIndex !== -1) {
      const query = value.slice(lastAtIndex + 1)
      if (query.includes(" ")) {
        setShowMentions(false)
      } else {
        setShowMentions(true)
        setMentionQuery(query)
      }
    } else {
      setShowMentions(false)
    }
  }

  const addMention = (member: (typeof teamMembers)[0]) => {
    const lastAtIndex = newNote.lastIndexOf("@")
    const beforeAt = newNote.slice(0, lastAtIndex)
    const afterQuery = newNote.slice(lastAtIndex + 1 + mentionQuery.length)
    setNewNote(`${beforeAt}@${member.name}${afterQuery}`)
    setShowMentions(false)
  }

  const addNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        content: newNote,
        author: "Current User",
        timestamp: new Date().toISOString(),
      }
      setNotes([...notes, note])
      setNewNote("")
    }
  }

  const filteredMembers = teamMembers.filter((member) => member.name.toLowerCase().includes(mentionQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/candidates">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Candidates
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">{candidate.name}</h1>
                <p className="text-sm text-muted-foreground">{candidate.position}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
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
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-6">
                  <img
                    src={candidate.avatar || "/placeholder.svg"}
                    alt={candidate.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{candidate.name}</h2>
                    <p className="text-lg text-muted-foreground mb-3">{candidate.position}</p>
                    <div className="flex items-center space-x-4 mb-4">
                      <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{candidate.rating}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{candidate.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{candidate.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{candidate.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Applied {new Date(candidate.appliedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Professional Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Experienced {candidate.position.toLowerCase()} with a proven track record of delivering high-quality
                  solutions. Strong technical skills combined with excellent communication abilities. Passionate about
                  innovation and continuous learning. Looking to contribute to a dynamic team environment and drive
                  meaningful impact.
                </p>
              </CardContent>
            </Card>

            {/* Experience */}
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
                    Led development of key features, mentored junior developers, and improved system performance by 40%.
                  </p>
                </div>
                <div className="border-l-2 border-muted pl-4">
                  <h4 className="font-semibold">Software Engineer</h4>
                  <p className="text-sm text-muted-foreground">StartupXYZ • 2019 - 2021</p>
                  <p className="text-sm mt-2">
                    Developed full-stack applications using modern technologies and collaborated with cross-functional
                    teams.
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

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <h4 className="font-semibold">Bachelor of Science in Computer Science</h4>
                  <p className="text-sm text-muted-foreground">University of Technology • 2014 - 2018</p>
                  <p className="text-sm">GPA: 3.8/4.0 • Magna Cum Laude</p>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
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

          {/* Right Column - Timeline & Notes */}
          <div className="space-y-6">
            {/* Application Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Application Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidate.timeline.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full mt-1 ${
                          event.status === candidate.status ? "bg-primary" : "bg-muted"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p className="font-medium">{event.status}</p>
                        <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground mt-1">{event.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes Section */}
            <Card>
              <CardHeader>
                <CardTitle>Notes & Comments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Note */}
                <div className="relative">
                  <Textarea
                    placeholder="Add a note... Use @ to mention team members"
                    value={newNote}
                    onChange={(e) => handleNoteChange(e.target.value)}
                    className="min-h-[100px]"
                  />
                  {showMentions && (
                    <div className="absolute top-full left-0 right-0 bg-background border rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                      {filteredMembers.map((member) => (
                        <button
                          key={member.id}
                          onClick={() => addMention(member)}
                          className="w-full text-left px-3 py-2 hover:bg-muted flex items-center space-x-2"
                        >
                          <User className="h-4 w-4" />
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  <Button onClick={addNote} size="sm" className="mt-2">
                    <Send className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                </div>

                {/* Notes List */}
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div key={note.id} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{note.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(note.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{note.content}</p>
                    </div>
                  ))}
                  {notes.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No notes yet. Add the first note above.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
