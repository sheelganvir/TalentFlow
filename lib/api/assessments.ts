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
  sections: Array<{
    id: string
    title: string
    description?: string
    questions: Array<{
      id: string
      type: string
      title: string
      description?: string
      required: boolean
      options?: string[]
      validation?: any
      conditionalLogic?: any
    }>
  }>
}

export const assessmentsApi = {
  async getAssessments(): Promise<Assessment[]> {
    const response = await fetch("/api/assessments")
    if (!response.ok) {
      throw new Error("Failed to fetch assessments")
    }
    return response.json()
  },

  async getAssessmentsByJob(jobId: number): Promise<Assessment[]> {
    const response = await fetch(`/api/assessments/${jobId}`)
    if (!response.ok) {
      throw new Error("Failed to fetch assessments for job")
    }
    return response.json()
  },

  async saveAssessment(jobId: number, assessment: Assessment): Promise<Assessment> {
    const response = await fetch(`/api/assessments/${jobId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assessment),
    })
    if (!response.ok) {
      throw new Error("Failed to save assessment")
    }
    return response.json()
  },

  async submitAssessment(
    jobId: number,
    response: any,
  ): Promise<{ success: boolean; responseId: string; message: string }> {
    const apiResponse = await fetch(`/api/assessments/${jobId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response),
    })
    if (!apiResponse.ok) {
      throw new Error("Failed to submit assessment")
    }
    return apiResponse.json()
  },
}
