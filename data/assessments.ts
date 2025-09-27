export interface Question {
  id: string
  type: "single-choice" | "multi-choice" | "short-text" | "long-text" | "numeric" | "file-upload"
  title: string
  description?: string
  required: boolean
  options?: string[]
  validation?: {
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
  }
  conditionalLogic?: {
    showIf: {
      questionId: string
      operator: "equals" | "not-equals" | "contains"
      value: string
    }
  }
}

export interface Section {
  id: string
  title: string
  description?: string
  questions: Question[]
}

export interface Assessment {
  id: number
  title: string
  description: string
  type: string
  duration: number
  questions: number
  candidates: number
  status: string
  createdDate: string
  completionRate: number
  sections: Section[]
}

export const assessmentsData: Assessment[] = [
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
    sections: [
      {
        id: "section-1",
        title: "JavaScript Fundamentals",
        description: "Test your core JavaScript knowledge",
        questions: [
          {
            id: "q1",
            type: "single-choice",
            title: "What is the output of console.log(typeof null)?",
            required: true,
            options: ["null", "undefined", "object", "boolean"],
          },
          {
            id: "q2",
            type: "multi-choice",
            title: "Which of the following are JavaScript data types?",
            required: true,
            options: ["string", "number", "boolean", "array", "object", "symbol"],
          },
          {
            id: "q3",
            type: "short-text",
            title: "Explain the difference between let, const, and var",
            required: true,
            validation: { minLength: 50, maxLength: 200 },
          },
        ],
      },
      {
        id: "section-2",
        title: "React Knowledge",
        description: "Assess React concepts and best practices",
        questions: [
          {
            id: "q4",
            type: "single-choice",
            title: "What is the purpose of useEffect hook?",
            required: true,
            options: ["State management", "Side effects", "Event handling", "Component rendering"],
          },
          {
            id: "q5",
            type: "long-text",
            title: "Describe the React component lifecycle and when you would use each phase",
            required: true,
            validation: { minLength: 100, maxLength: 500 },
          },
          {
            id: "q6",
            type: "single-choice",
            title: "Do you have experience with React hooks?",
            required: true,
            options: ["Yes", "No"],
          },
          {
            id: "q7",
            type: "multi-choice",
            title: "Which React hooks have you used in production?",
            required: false,
            options: ["useState", "useEffect", "useContext", "useReducer", "useMemo", "useCallback"],
            conditionalLogic: {
              showIf: { questionId: "q6", operator: "equals", value: "Yes" },
            },
          },
        ],
      },
      {
        id: "section-3",
        title: "CSS & Styling",
        description: "Evaluate CSS skills and modern styling approaches",
        questions: [
          {
            id: "q8",
            type: "single-choice",
            title: "Which CSS property is used for flexbox?",
            required: true,
            options: ["display: flex", "flex-direction", "justify-content", "All of the above"],
          },
          {
            id: "q9",
            type: "numeric",
            title: "How many years of CSS experience do you have?",
            required: true,
            validation: { min: 0, max: 20 },
          },
        ],
      },
    ],
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
    sections: [
      {
        id: "section-1",
        title: "Design Process",
        description: "Understanding of UX design methodology",
        questions: [
          {
            id: "q1",
            type: "long-text",
            title: "Describe your typical design process from research to final design",
            required: true,
            validation: { minLength: 200, maxLength: 800 },
          },
          {
            id: "q2",
            type: "multi-choice",
            title: "Which design research methods do you regularly use?",
            required: true,
            options: [
              "User interviews",
              "Surveys",
              "Usability testing",
              "A/B testing",
              "Card sorting",
              "Persona development",
            ],
          },
        ],
      },
      {
        id: "section-2",
        title: "Portfolio Submission",
        description: "Share your best work with us",
        questions: [
          {
            id: "q3",
            type: "file-upload",
            title: "Upload your portfolio (PDF format preferred)",
            required: true,
          },
          {
            id: "q4",
            type: "short-text",
            title: "Provide a link to your online portfolio",
            required: false,
            validation: { maxLength: 200 },
          },
        ],
      },
    ],
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
    sections: [
      {
        id: "section-1",
        title: "Product Strategy",
        description: "Evaluate strategic thinking and product vision",
        questions: [
          {
            id: "q1",
            type: "long-text",
            title: "You're launching a new mobile app. Walk us through your go-to-market strategy",
            required: true,
            validation: { minLength: 300, maxLength: 1000 },
          },
          {
            id: "q2",
            type: "single-choice",
            title: "What's the most important metric for a new product launch?",
            required: true,
            options: ["User acquisition", "Revenue", "User engagement", "Market share"],
          },
        ],
      },
      {
        id: "section-2",
        title: "Problem Solving",
        description: "Assess analytical and problem-solving skills",
        questions: [
          {
            id: "q3",
            type: "long-text",
            title: "A key feature has a 20% drop in usage. How would you investigate and address this?",
            required: true,
            validation: { minLength: 200, maxLength: 600 },
          },
        ],
      },
    ],
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
    sections: [
      {
        id: "section-1",
        title: "Programming Fundamentals",
        description: "Core programming concepts and algorithms",
        questions: [
          {
            id: "q1",
            type: "single-choice",
            title: "What is the time complexity of binary search?",
            required: true,
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          },
          {
            id: "q2",
            type: "multi-choice",
            title: "Which programming languages are you proficient in?",
            required: true,
            options: ["Python", "Java", "JavaScript", "Go", "Rust", "C++"],
          },
        ],
      },
      {
        id: "section-2",
        title: "System Design",
        description: "Architecture and scalability concepts",
        questions: [
          {
            id: "q3",
            type: "long-text",
            title: "Design a URL shortening service like bit.ly. Explain your architecture",
            required: true,
            validation: { minLength: 400, maxLength: 1200 },
          },
          {
            id: "q4",
            type: "single-choice",
            title: "Which database would you choose for high-write workloads?",
            required: true,
            options: ["MySQL", "PostgreSQL", "MongoDB", "Cassandra"],
          },
        ],
      },
      {
        id: "section-3",
        title: "Code Submission",
        description: "Submit your coding solution",
        questions: [
          {
            id: "q5",
            type: "file-upload",
            title: "Upload your coding solution",
            required: true,
          },
        ],
      },
    ],
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
    sections: [
      {
        id: "section-1",
        title: "Communication Skills",
        description: "Assess verbal and written communication abilities",
        questions: [
          {
            id: "q1",
            type: "long-text",
            title: "How would you handle an objection from a potential customer?",
            required: true,
            validation: { minLength: 100, maxLength: 400 },
          },
          {
            id: "q2",
            type: "single-choice",
            title: "What's your preferred communication style with clients?",
            required: true,
            options: ["Direct and assertive", "Consultative and collaborative", "Relationship-focused", "Data-driven"],
          },
        ],
      },
      {
        id: "section-2",
        title: "Sales Experience",
        description: "Background and experience in sales",
        questions: [
          {
            id: "q3",
            type: "numeric",
            title: "How many years of sales experience do you have?",
            required: true,
            validation: { min: 0, max: 30 },
          },
          {
            id: "q4",
            type: "single-choice",
            title: "Have you exceeded your sales quota in previous roles?",
            required: true,
            options: ["Always", "Most of the time", "Sometimes", "Never", "No previous sales experience"],
          },
        ],
      },
    ],
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
    sections: [
      {
        id: "section-1",
        title: "SQL Fundamentals",
        description: "Basic SQL querying skills",
        questions: [
          {
            id: "q1",
            type: "single-choice",
            title: "Which SQL clause is used to filter rows?",
            required: true,
            options: ["SELECT", "WHERE", "GROUP BY", "ORDER BY"],
          },
          {
            id: "q2",
            type: "multi-choice",
            title: "Which SQL functions have you used?",
            required: true,
            options: ["COUNT", "SUM", "AVG", "MAX", "MIN", "GROUP_CONCAT"],
          },
        ],
      },
      {
        id: "section-2",
        title: "Data Analysis",
        description: "Analytical thinking and problem-solving with data",
        questions: [
          {
            id: "q3",
            type: "long-text",
            title: "Explain how you would analyze customer churn using SQL",
            required: true,
            validation: { minLength: 150, maxLength: 500 },
          },
          {
            id: "q4",
            type: "numeric",
            title: "How many years of SQL experience do you have?",
            required: true,
            validation: { min: 0, max: 20 },
          },
        ],
      },
    ],
  },
]

export function getAssessmentById(id: number): Assessment | undefined {
  return assessmentsData.find((assessment) => assessment.id === id)
}
