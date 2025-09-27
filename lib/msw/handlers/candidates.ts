import { http, HttpResponse } from "msw"
import { candidatesData } from "../../../data/candidates"

// Use the existing candidates data
const candidates = [...candidatesData]

export const candidateHandlers = [
  // GET /api/candidates
  http.get("/api/candidates", ({ request }) => {
    console.log("[v0] MSW intercepted GET /api/candidates request")
    console.log("[v0] Total candidates in data:", candidates.length)
    console.log(
      "[v0] Sample candidate statuses:",
      candidates.slice(0, 5).map((c) => ({ name: c.name, status: c.status })),
    )

    const url = new URL(request.url)
    const search = url.searchParams.get("search") || ""
    const stage = url.searchParams.get("stage") || ""
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const pageSize = Number.parseInt(url.searchParams.get("pageSize") || "10")

    console.log("[v0] Request params:", { search, stage, page, pageSize })

    let filteredCandidates = [...candidates]

    // Apply search filter
    if (search) {
      filteredCandidates = filteredCandidates.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(search.toLowerCase()) ||
          candidate.email.toLowerCase().includes(search.toLowerCase()) ||
          candidate.position.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Apply stage filter
    if (stage) {
      console.log("[v0] Filtering by stage:", stage)
      filteredCandidates = filteredCandidates.filter(
        (candidate) => candidate.status.toLowerCase() === stage.toLowerCase(),
      )
      console.log("[v0] Candidates after stage filter:", filteredCandidates.length)
    }

    // Apply pagination
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex)

    const response = {
      candidates: paginatedCandidates,
      total: filteredCandidates.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredCandidates.length / pageSize),
    }

    console.log("[v0] MSW returning response:", {
      candidatesCount: response.candidates.length,
      total: response.total,
      page: response.page,
    })

    return HttpResponse.json(response)
  }),

  // POST /api/candidates
  http.post("/api/candidates", async ({ request }) => {
    const newCandidate = (await request.json()) as any
    const candidate = {
      id: Math.max(...candidates.map((c) => c.id)) + 1,
      ...newCandidate,
      appliedDate: new Date().toISOString().split("T")[0],
      rating: 0,
      avatar: "/professional-woman-diverse.png",
      timeline: [
        {
          status: newCandidate.stage || "applied",
          date: new Date().toISOString().split("T")[0],
          note: "Application submitted",
        },
      ],
      notes: [],
    }
    candidates.push(candidate)
    return HttpResponse.json(candidate, { status: 201 })
  }),

  // PATCH /api/candidates/:id
  http.patch("/api/candidates/:id", async ({ params, request }) => {
    const id = Number.parseInt(params.id as string)
    const updates = (await request.json()) as any
    const candidateIndex = candidates.findIndex((c) => c.id === id)

    if (candidateIndex === -1) {
      return HttpResponse.json({ error: "Candidate not found" }, { status: 404 })
    }

    const candidate = candidates[candidateIndex]

    // If stage is being updated, add to timeline
    if (updates.status && updates.status !== candidate.status) {
      candidate.timeline.push({
        status: updates.status,
        date: new Date().toISOString().split("T")[0],
        note: `Status changed to ${updates.status}`,
      })
    }

    candidates[candidateIndex] = { ...candidate, ...updates }
    return HttpResponse.json(candidates[candidateIndex])
  }),

  // GET /api/candidates/:id/timeline
  http.get("/api/candidates/:id/timeline", ({ params }) => {
    const id = Number.parseInt(params.id as string)
    const candidate = candidates.find((c) => c.id === id)

    if (!candidate) {
      return HttpResponse.json({ error: "Candidate not found" }, { status: 404 })
    }

    return HttpResponse.json(candidate.timeline)
  }),
]
