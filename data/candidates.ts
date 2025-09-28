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

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const generateCandidatesData = () => {
  const candidates = []

  for (let i = 1; i <= 987; i++) {
    const seed = i * 12345 // Use candidate ID as seed base

    const firstName = firstNames[Math.floor(seededRandom(seed + 1) * firstNames.length)]
    const lastName = lastNames[Math.floor(seededRandom(seed + 2) * lastNames.length)]
    const name = `${firstName} ${lastName}`
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`
    const phone = `+1 (${Math.floor(seededRandom(seed + 3) * 900) + 100}) ${Math.floor(seededRandom(seed + 4) * 900) + 100}-${Math.floor(seededRandom(seed + 5) * 9000) + 1000}`
    const location = cities[Math.floor(seededRandom(seed + 6) * cities.length)]
    const position = jobTitles[Math.floor(seededRandom(seed + 7) * jobTitles.length)]
    const status = statuses[Math.floor(seededRandom(seed + 8) * statuses.length)]
    const rating = (seededRandom(seed + 9) * 1.5 + 3.5).toFixed(1)
    const avatar = avatars[Math.floor(seededRandom(seed + 10) * avatars.length)]

    const baseDate = new Date("2025-09-21")
    const randomDays = Math.floor(seededRandom(seed + 11) * 8) // 0-7 days from Sept 21
    const appliedDate = new Date(baseDate)
    appliedDate.setDate(baseDate.getDate() + randomDays)

    // Generate timeline based on status
    const timeline = [
      {
        status: "Applied",
        date: appliedDate.toISOString().split("T")[0],
        note: "Application submitted successfully",
      },
    ]

    if (status !== "Applied") {
      const screeningDate = new Date(appliedDate)
      const screeningDaysToAdd = Math.min(Math.floor(seededRandom(seed + 12) * 5) + 1, 28 - appliedDate.getDate())
      screeningDate.setDate(screeningDate.getDate() + screeningDaysToAdd)
      timeline.push({
        status: "Screening",
        date: screeningDate.toISOString().split("T")[0],
        note: "Initial screening completed",
      })
    }

    if (status === "Interview" || status === "Offer") {
      const interviewDate = new Date(appliedDate)
      const interviewDaysToAdd = Math.min(Math.floor(seededRandom(seed + 13) * 10) + 5, 28 - appliedDate.getDate())
      interviewDate.setDate(interviewDate.getDate() + interviewDaysToAdd)
      timeline.push({
        status: "Interview",
        date: interviewDate.toISOString().split("T")[0],
        note: "Technical interview scheduled",
      })
    }

    if (status === "Offer") {
      const offerDate = new Date(appliedDate)
      const offerDaysToAdd = Math.min(Math.floor(seededRandom(seed + 14) * 15) + 10, 28 - appliedDate.getDate())
      offerDate.setDate(offerDate.getDate() + offerDaysToAdd)
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

export const candidatesData = generateCandidatesData()

export type Candidate = (typeof candidatesData)[0]
