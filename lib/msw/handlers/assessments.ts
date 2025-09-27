import { http, HttpResponse } from "msw"
import { assessmentsData } from "../../../data/assessments"

// Use the existing assessments data
const assessments = [...assessmentsData]

// Store assessment responses locally
const assessmentResponses = new Map<string, any>()

export const assessmentHandlers = [
  // GET /api/assessments/:jobId
  http.get("/api/assessments/:jobId", ({ params }) => {
    const jobId = Number.parseInt(params.jobId as string)

    // Filter assessments by job (for now, return all assessments)
    // In a real app, you'd have a job-assessment relationship
    return HttpResponse.json(assessments)
  }),

  // PUT /api/assessments/:jobId
  http.put("/api/assessments/:jobId", async ({ params, request }) => {
    const jobId = Number.parseInt(params.jobId as string)
    const assessmentData = (await request.json()) as any

    // Find existing assessment or create new one
    let assessment = assessments.find((a) => a.id === assessmentData.id)

    if (assessment) {
      // Update existing assessment
      Object.assign(assessment, assessmentData)
    } else {
      // Create new assessment
      assessment = {
        id: Math.max(...assessments.map((a) => a.id)) + 1,
        ...assessmentData,
        candidates: 0,
        completionRate: 0,
        createdDate: new Date().toISOString().split("T")[0],
        status: "Draft",
      }
      assessments.push(assessment)
    }

    return HttpResponse.json(assessment)
  }),

  // POST /api/assessments/:jobId/submit
  http.post("/api/assessments/:jobId/submit", async ({ params, request }) => {
    const jobId = Number.parseInt(params.jobId as string)
    const response = (await request.json()) as any

    // Store response locally with a unique key
    const responseKey = `${jobId}-${response.candidateId || Date.now()}`
    assessmentResponses.set(responseKey, {
      jobId,
      ...response,
      submittedAt: new Date().toISOString(),
      id: responseKey,
    })

    return HttpResponse.json({
      success: true,
      responseId: responseKey,
      message: "Assessment response submitted successfully",
    })
  }),

  // GET /api/assessments (get all assessments)
  http.get("/api/assessments", () => {
    return HttpResponse.json(assessments)
  }),
]
