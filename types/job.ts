export type Job = {
  id: string
  title: string
  slug: string
  description: string
  department: string
  location: string
  type: "full-time" | "part-time" | "contract" | "internship"
  status: "draft" | "published" | "archived"
  tags: string[]
  applicants: number
  createdAt: string
  order: number
}
