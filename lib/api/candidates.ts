export interface Candidate {
  id: number
  name: string
  email: string
  phone?: string
  location?: string
  position?: string
  status: "applied" | "screen" | "tech" | "offer" | "hired" | "rejected"
  rating?: number
  appliedDate: string
  avatar?: string
  timeline: Array<{
    status: string
    date: string
    note: string
  }>
  notes?: string[]
}

export interface CandidatesResponse {
  candidates: Candidate[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export const candidatesApi = {
  async getCandidates(
    params: {
      search?: string
      stage?: string
      page?: number
      pageSize?: number
    } = {},
  ): Promise<CandidatesResponse> {
    const searchParams = new URLSearchParams()

    if (params.search) searchParams.set("search", params.search)
    if (params.stage) searchParams.set("stage", params.stage)
    if (params.page) searchParams.set("page", params.page.toString())
    if (params.pageSize) searchParams.set("pageSize", params.pageSize.toString())

    const response = await fetch(`/api/candidates?${searchParams}`)
    if (!response.ok) {
      throw new Error("Failed to fetch candidates")
    }
    return response.json()
  },

  async createCandidate(candidate: Omit<Candidate, "id" | "appliedDate" | "timeline" | "notes">): Promise<Candidate> {
    const response = await fetch("/api/candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(candidate),
    })
    if (!response.ok) {
      throw new Error("Failed to create candidate")
    }
    return response.json()
  },

  async updateCandidate(id: number, updates: Partial<Candidate>): Promise<Candidate> {
    const response = await fetch(`/api/candidates/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!response.ok) {
      throw new Error("Failed to update candidate")
    }
    return response.json()
  },

  async getCandidateTimeline(id: number): Promise<Candidate["timeline"]> {
    const response = await fetch(`/api/candidates/${id}/timeline`)
    if (!response.ok) {
      throw new Error("Failed to fetch candidate timeline")
    }
    return response.json()
  },
}
