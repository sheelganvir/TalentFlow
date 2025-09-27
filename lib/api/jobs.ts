export interface Job {
  id: number
  title: string
  slug: string
  status: "active" | "archived" | "draft"
  tags: string[]
  order: number
  department: string
  location: string
  type: string
  description: string
  requirements?: string[]
  postedDate: string
  applicants: number
}

export interface JobsResponse {
  jobs: Job[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export const jobsApi = {
  async getJobs(
    params: {
      search?: string
      status?: string
      page?: number
      pageSize?: number
      sort?: string
    } = {},
  ): Promise<JobsResponse> {
    const searchParams = new URLSearchParams()

    if (params.search) searchParams.set("search", params.search)
    if (params.status) searchParams.set("status", params.status)
    if (params.page) searchParams.set("page", params.page.toString())
    if (params.pageSize) searchParams.set("pageSize", params.pageSize.toString())
    if (params.sort) searchParams.set("sort", params.sort)

    const response = await fetch(`/api/jobs?${searchParams}`)
    if (!response.ok) {
      throw new Error("Failed to fetch jobs")
    }
    return response.json()
  },

  async createJob(job: Omit<Job, "id" | "postedDate" | "applicants">): Promise<Job> {
    const response = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    })
    if (!response.ok) {
      throw new Error("Failed to create job")
    }
    return response.json()
  },

  async updateJob(id: number, updates: Partial<Job>): Promise<Job> {
    const response = await fetch(`/api/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!response.ok) {
      throw new Error("Failed to update job")
    }
    return response.json()
  },

  async reorderJob(id: number, fromOrder: number, toOrder: number): Promise<void> {
    const response = await fetch(`/api/jobs/${id}/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromOrder, toOrder }),
    })
    if (!response.ok) {
      throw new Error("Failed to reorder job")
    }
  },
}
