import { http, HttpResponse } from "msw"
import { db, type Job } from "./db"

// Simulate network delay
const delay = () => new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 200))

export const jobsHandlers = [
  // GET /api/jobs - Get all jobs with filtering and pagination
  http.get("/api/jobs", async ({ request }) => {
    await delay()

    const url = new URL(request.url)
    const search = url.searchParams.get("search") || ""
    const status = url.searchParams.get("status") || ""
    const team = url.searchParams.get("team") || ""
    const location = url.searchParams.get("location") || ""
    const sort = url.searchParams.get("sort") || "newest"
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const pageSize = Number.parseInt(url.searchParams.get("pageSize") || "10")

    let jobs = await db.jobs.orderBy("order").toArray()

    // Apply filters
    if (search) {
      jobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.team.toLowerCase().includes(search.toLowerCase()) ||
          job.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())),
      )
    }

    if (status) {
      jobs = jobs.filter((job) => job.status === status)
    }

    if (team) {
      jobs = jobs.filter((job) => job.team === team)
    }

    if (location) {
      jobs = jobs.filter((job) => job.location.toLowerCase().includes(location.toLowerCase()))
    }

    // Apply sorting
    switch (sort) {
      case "oldest":
        jobs.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        break
      case "most-applicants":
        jobs.sort(
          (a, b) =>
            (b.applicantsTrend[b.applicantsTrend.length - 1] || 0) -
            (a.applicantsTrend[a.applicantsTrend.length - 1] || 0),
        )
        break
      case "least-applicants":
        jobs.sort(
          (a, b) =>
            (a.applicantsTrend[a.applicantsTrend.length - 1] || 0) -
            (b.applicantsTrend[b.applicantsTrend.length - 1] || 0),
        )
        break
      case "newest":
      default:
        jobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
    }

    // Apply pagination
    const total = jobs.length
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedJobs = jobs.slice(startIndex, endIndex)

    return HttpResponse.json({
      jobs: paginatedJobs,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  }),

  // GET /api/jobs/:id - Get job by ID
  http.get("/api/jobs/:id", async ({ params }) => {
    await delay()

    const id = Number.parseInt(params.id as string)
    const job = await db.jobs.get(id)

    if (!job) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(job)
  }),

  // POST /api/jobs - Create new job
  http.post("/api/jobs", async ({ request }) => {
    await delay()

    const jobData = (await request.json()) as Omit<Job, "id">

    // Simulate slug uniqueness check
    const existingJob = await db.jobs.where("slug").equals(jobData.slug).first()
    if (existingJob) {
      return HttpResponse.json({ error: "A job with this slug already exists" }, { status: 400 })
    }

    const maxOrder = await db.jobs.orderBy("order").reverse().first()
    const newJob = {
      ...jobData,
      order: (maxOrder?.order || 0) + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const id = await db.jobs.add(newJob)
    const createdJob = await db.jobs.get(id)

    return HttpResponse.json(createdJob, { status: 201 })
  }),

  // PATCH /api/jobs/:id - Update job
  http.patch("/api/jobs/:id", async ({ params, request }) => {
    await delay()

    const id = Number.parseInt(params.id as string)
    const updates = (await request.json()) as Partial<Job>

    const existingJob = await db.jobs.get(id)
    if (!existingJob) {
      return new HttpResponse(null, { status: 404 })
    }

    // If slug is being updated, check uniqueness
    if (updates.slug && updates.slug !== existingJob.slug) {
      const slugExists = await db.jobs.where("slug").equals(updates.slug).first()
      if (slugExists) {
        return HttpResponse.json({ error: "A job with this slug already exists" }, { status: 400 })
      }
    }

    await db.jobs.update(id, { ...updates, updatedAt: new Date() })
    const updatedJob = await db.jobs.get(id)

    return HttpResponse.json(updatedJob)
  }),

  // DELETE /api/jobs/:id - Delete job
  http.delete("/api/jobs/:id", async ({ params }) => {
    await delay()

    const id = Number.parseInt(params.id as string)
    const existingJob = await db.jobs.get(id)

    if (!existingJob) {
      return new HttpResponse(null, { status: 404 })
    }

    await db.jobs.delete(id)
    return new HttpResponse(null, { status: 204 })
  }),

  // PATCH /api/jobs/:id/reorder - Reorder jobs
  http.patch("/api/jobs/:id/reorder", async ({ params, request }) => {
    await delay()

    // Simulate occasional server error for testing rollback
    if (Math.random() < 0.1) {
      return new HttpResponse(null, { status: 500 })
    }

    const { newOrder } = (await request.json()) as { newOrder: number }
    const id = Number.parseInt(params.id as string)

    const job = await db.jobs.get(id)
    if (!job) {
      return new HttpResponse(null, { status: 404 })
    }

    await db.jobs.update(id, { order: newOrder, updatedAt: new Date() })
    const updatedJob = await db.jobs.get(id)

    return HttpResponse.json(updatedJob)
  }),

  // PATCH /api/jobs/:id/archive - Archive/unarchive job
  http.patch("/api/jobs/:id/archive", async ({ params, request }) => {
    await delay()

    const id = Number.parseInt(params.id as string)
    const { archived } = (await request.json()) as { archived: boolean }

    const job = await db.jobs.get(id)
    if (!job) {
      return new HttpResponse(null, { status: 404 })
    }

    await db.jobs.update(id, {
      status: archived ? "Archived" : "Active",
      updatedAt: new Date(),
    })

    const updatedJob = await db.jobs.get(id)
    return HttpResponse.json(updatedJob)
  }),
]
