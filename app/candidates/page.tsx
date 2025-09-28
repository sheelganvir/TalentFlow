"use client"

import type React from "react"
import { useState, useRef, useMemo } from "react"
import Link from "next/link"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, FilterIcon, MoreVertical, Mail, Star, Upload, FileDown, Plus, Search } from "lucide-react"
import { candidatesData as initialCandidatesData } from "@/data/candidates"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Moon, Sun, Check } from "lucide-react"

type BaseCandidate = (typeof initialCandidatesData)[number]
type Candidate = BaseCandidate & { disqualified?: boolean }

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

const columnAccent: Record<string, string> = {
  applied: "border-l-amber-500 hover:border-l-amber-600 hover:shadow-amber-100/50",
  review: "border-l-teal-500 hover:border-l-teal-600 hover:shadow-teal-100/50",
  interview: "border-l-purple-500 hover:border-l-purple-600 hover:shadow-purple-100/50",
  accepted: "border-l-green-500 hover:border-l-green-600 hover:shadow-green-100/50",
  disqualified: "border-l-red-500 hover:border-l-red-600 hover:shadow-red-100/50",
}

const columnCardColors: Record<string, string> = {
  Applied: "bg-amber-50/50 dark:bg-amber-950/20 border-l-amber-500 hover:border-l-amber-600 hover:shadow-amber-100/50",
  Screening: "bg-teal-50/50 dark:bg-teal-950/20 border-l-teal-500 hover:border-l-teal-600 hover:shadow-teal-100/50",
  Interview:
    "bg-purple-50/50 dark:bg-purple-950/20 border-l-purple-500 hover:border-l-purple-600 hover:shadow-purple-100/50",
  Offer: "bg-green-50/50 dark:bg-green-950/20 border-l-green-500 hover:border-l-green-600 hover:shadow-green-100/50",
}

const columnHeaderColors: Record<string, string> = {
  Applied: "bg-amber-100 dark:bg-amber-900/50 border-amber-200 dark:border-amber-800",
  Screening: "bg-teal-100 dark:bg-teal-900/50 border-teal-200 dark:border-teal-800",
  Interview: "bg-purple-100 dark:bg-purple-900/50 border-purple-200 dark:border-purple-800",
  Offer: "bg-green-100 dark:bg-green-900/50 border-green-200 dark:border-green-800",
}

export default function CandidatesPage() {
  const { toast } = useToast()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState<"participant" | "qualified" | "disqualified">("participant")
  const [statusFilter, setStatusFilter] = useState<"All" | "Applied" | "Screening" | "Interview" | "Offer">("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [jobFilter, setJobFilter] = useState<string>("all")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [candidates, setCandidates] = useState<Candidate[]>(() =>
    initialCandidatesData.map((c: any) => ({ ...c, disqualified: c.disqualified ?? false })),
  )

  const totalApplicants = candidates.length
  const qualifiedCount = candidates.filter(
    (c) => !c.disqualified && (c.status === "Interview" || c.status === "Offer"),
  ).length
  const totalRecruitment = candidates.filter((c) => !c.disqualified && c.status === "Offer").length
  const participantCount = candidates.filter((c) => !c.disqualified).length
  const disqualifiedCount = candidates.filter((c) => c.disqualified).length

  const columns = [
    { status: "Applied", title: "Applied Job" },
    { status: "Screening", title: "Review Profile" },
    { status: "Interview", title: "Interview" },
    { status: "Offer", title: "Accepted" },
  ] as const

  const jobOptions = useMemo(() => Array.from(new Set(initialCandidatesData.map((c) => c.position))).sort(), [])

  const filtered = candidates.filter((c) => {
    if (activeTab === "participant" && c.disqualified) return false
    if (activeTab === "qualified" && !(c.status === "Interview" || c.status === "Offer")) return false
    if (activeTab === "disqualified" && !c.disqualified) return false
    if (statusFilter !== "All" && c.status !== statusFilter) return false
    if (jobFilter !== "all" && c.position !== jobFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const hay = `${c.name} ${c.email} ${c.position}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })

  const candidatesByStatus = {
    Applied: filtered.filter((c) => c.status === "Applied"),
    Screening: filtered.filter((c) => c.status === "Screening"),
    Interview: filtered.filter((c) => c.status === "Interview"),
    Offer: filtered.filter((c) => c.status === "Offer"),
  }

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const candidateId = Number.parseInt(draggableId)
    const idx = candidates.findIndex((c) => c.id === candidateId)
    if (idx === -1) return

    const updated = [...candidates]
    updated[idx] = { ...updated[idx], status: destination.droppableId, disqualified: false }
    setCandidates(updated)
    toast({
      title: "Candidate Moved",
      description: `${updated[idx].name} moved to ${destination.droppableId}`,
      variant: "default",
    })
    console.log("[v0] moved:", updated[idx].name, "→", destination.droppableId)
  }

  const tinyMetric = (id: number, salt: number) => ((id * 7 + salt) % 11) + 1

  const toggleDarkMode = () => {
    setIsDarkMode((d) => !d)
    document.documentElement.classList.toggle("dark")
  }

  const handleImportClick = () => fileInputRef.current?.click()

  const parseCSV = (text: string): Candidate[] => {
    const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean)
    const headers = headerLine.split(",").map((h) => h.trim())
    return lines.map((line) => {
      const values = line.split(",")
      const rec: any = {}
      headers.forEach((h, i) => (rec[h] = values[i]?.trim()))
      return {
        id: Number(rec.id) || Math.floor(Date.now() + Math.random() * 1000),
        name: rec.name || "New Candidate",
        email: rec.email || "unknown@example.com",
        position: rec.position || "Unknown",
        status: (rec.status as Candidate["status"]) || "Applied",
        avatar: rec.avatar || "",
        rating: Number(rec.rating) || 3,
        disqualified: rec.disqualified === "true" ? true : false,
      } as Candidate
    })
  }

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    try {
      let imported: Candidate[] = []
      if (file.name.toLowerCase().endsWith(".json")) {
        const json = JSON.parse(text)
        imported = (Array.isArray(json) ? json : []).map((c: any) => ({
          id: Number(c.id) || Math.floor(Date.now() + Math.random() * 1000),
          name: c.name || "New Candidate",
          email: c.email || "unknown@example.com",
          position: c.position || "Unknown",
          status: (c.status as Candidate["status"]) || "Applied",
          avatar: c.avatar || "",
          rating: Number(c.rating) || 3,
          disqualified: !!c.disqualified,
        }))
      } else {
        imported = parseCSV(text)
      }
      setCandidates((prev) => {
        const byId = new Map(prev.map((p) => [p.id, p]))
        for (const c of imported) byId.set(c.id, c)
        return Array.from(byId.values())
      })
      toast({ title: "Import complete", description: `${imported.length} candidates imported` })
    } catch (err: any) {
      toast({ title: "Import failed", description: err?.message || "Could not parse file", variant: "destructive" })
    } finally {
      e.target.value = ""
    }
  }

  const exportAsCSV = () => {
    const headers = ["id", "name", "email", "position", "status", "rating", "disqualified"]
    const rows = candidates.map((c) => [c.id, c.name, c.email, c.position, c.status, c.rating, !!c.disqualified])
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "candidates-report.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({ title: "Exported", description: "Downloaded candidates-report.csv" })
  }

  const addCandidate = (status: Candidate["status"]) => {
    const name = window.prompt("Enter candidate name")
    if (!name) return
    const email = window.prompt("Enter candidate email") || "unknown@example.com"
    const id = Math.floor(Date.now() + Math.random() * 1000)
    setCandidates((prev) => [
      ...prev,
      {
        id,
        name,
        email,
        position: "New Position",
        status,
        avatar: "",
        rating: 3,
        disqualified: false,
      },
    ])
    toast({ title: "Candidate added", description: `${name} added to ${status}` })
  }

  const moveToNext = (id: number) => {
    const order = ["Applied", "Screening", "Interview", "Offer"] as const
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c
        const idx = order.indexOf(c.status)
        const next = order[Math.min(order.length - 1, idx + 1)]
        return { ...c, status: next, disqualified: false }
      }),
    )
    toast({ title: "Stage updated", description: "Moved to next stage" })
  }

  const toggleDisqualified = (id: number) => {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, disqualified: !c.disqualified } : c)))
    toast({ title: "Status updated", description: "Disqualified status toggled" })
  }

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? "dark" : ""}`}>
      <header className="border-b bg-card backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/talentflow-logo-4TjqXtXrX6vfXNMoAPnDMg8xsE4ggh.png"
                alt="TalentFlow logo"
                className="w-8 h-8"
                width={32}
                height={32}
                decoding="async"
              />
              <span className="text-xl font-bold text-primary">TALENTFLOW</span>
            </div>

            <nav className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="rounded-full">
                  Dashboard
                </Button>
              </Link>
              <Link href="/jobs">
                <Button variant="ghost" size="sm" className="rounded-full">
                  Jobs
                </Button>
              </Link>
              <Button variant="default" size="sm" className="rounded-full">
                Candidates
              </Button>
              <Link href="/assessments">
                <Button variant="ghost" size="sm" className="rounded-full">
                  Assessments
                </Button>
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.csv"
                className="sr-only"
                onChange={handleFileChange}
              />
              <Button variant="outline" size="sm" className="rounded-full bg-transparent" onClick={handleImportClick}>
                <Upload className="h-4 w-4 mr-2" /> Import
              </Button>
              <Button size="sm" className="rounded-full" onClick={exportAsCSV}>
                <FileDown className="h-4 w-4 mr-2" /> Export Report
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle theme">
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 pl-16">
        {/* search */}
        <div className="relative w-full md:max-w-xl mb-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates by name, position, or email..."
            className="pl-9 rounded-full"
            aria-label="Search candidates"
          />
        </div>

        {/* tabs */}
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant={activeTab === "participant" ? "default" : "outline"}
            size="sm"
            className={`rounded-full border ${
              activeTab === "participant" ? "bg-[#12b5a0] hover:bg-[#0ea085] text-white border-[#12b5a0]" : ""
            }`}
            onClick={() => setActiveTab("participant")}
          >
            Participant{" "}
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                activeTab === "participant" ? "bg-white text-black" : "bg-background text-foreground"
              }`}
            >
              {participantCount}
            </span>
          </Button>
          <Button
            variant={activeTab === "qualified" ? "default" : "outline"}
            size="sm"
            className={`rounded-full border ${
              activeTab === "qualified" ? "bg-[#12b5a0] hover:bg-[#0ea085] text-white border-[#12b5a0]" : ""
            }`}
            onClick={() => setActiveTab("qualified")}
          >
            Qualified{" "}
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                activeTab === "qualified" ? "bg-white text-black" : "bg-muted text-foreground"
              }`}
            >
              {qualifiedCount}
            </span>
          </Button>
          <Button
            variant={activeTab === "disqualified" ? "default" : "outline"}
            size="sm"
            className={`rounded-full border ${
              activeTab === "disqualified" ? "bg-[#12b5a0] hover:bg-[#0ea085] text-white border-[#12b5a0]" : ""
            }`}
            onClick={() => setActiveTab("disqualified")}
          >
            Disqualified{" "}
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                activeTab === "disqualified" ? "bg-white text-black" : "bg-muted text-foreground"
              }`}
            >
              {disqualifiedCount}
            </span>
          </Button>
        </div>

        {/* job filter + status filter + settings */}
        <div className="flex items-center gap-2 mb-6">
          <Select value={jobFilter} onValueChange={setJobFilter}>
            <SelectTrigger size="sm" className="rounded-full bg-transparent">
              <SelectValue>{jobFilter === "all" ? "All Jobs" : jobFilter}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              {jobOptions.map((title) => (
                <SelectItem key={title} value={title}>
                  {title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* existing status Filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                <FilterIcon className="h-4 w-4 mr-2" /> Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              {(["All", "Applied", "Screening", "Interview", "Offer"] as const).map((s) => (
                <DropdownMenuItem key={s} onSelect={() => setStatusFilter(s)}>
                  <Check className={`mr-2 h-4 w-4 ${statusFilter === s ? "opacity-100" : "opacity-0"}`} />
                  {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* existing settings menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full bg-transparent" aria-label="Settings">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Board</DropdownMenuLabel>
              <DropdownMenuItem
                onSelect={() => toast({ title: "Board settings", description: "Settings panel coming soon." })}
              >
                Board settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setCandidates(initialCandidatesData as any)}>
                Reset board
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setCandidates((prev) => prev.map((c) => ({ ...c, disqualified: false })))}
              >
                Clear disqualified
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-start">
            {columns.map((col) => (
              <Card
                key={col.status}
                className="bg-muted/20 border-2 transition hover:shadow-lg hover:ring-1 hover:ring-primary/20 hover:bg-muted/30 overflow-hidden p-0"
              >
                <CardHeader
                  className={`pb-0 pt-0 px-0 m-0 rounded-t-lg ${columnHeaderColors[col.status] || "bg-muted/40"}`}
                >
                  <div className="flex items-center justify-between p-4">
                    <CardTitle className="text-sm font-semibold">{col.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-background/80 text-foreground">
                        {candidatesByStatus[col.status as keyof typeof candidatesByStatus].length}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => addCandidate(col.status)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 bg-muted/20 p-0">
                  <div className="p-4 pt-2">
                    <Droppable droppableId={col.status} aria-label={`Column ${col.title}`}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`space-y-2 max-h-[70vh] overflow-y-auto rounded-lg scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/30 dark:scrollbar-thumb-muted-foreground/60 hover:scrollbar-thumb-muted-foreground/50 dark:hover:scrollbar-thumb-muted-foreground/80 ${
                            snapshot.isDraggingOver ? "bg-accent/30 ring-2 ring-accent border-accent" : ""
                          }`}
                        >
                          {candidatesByStatus[col.status as keyof typeof candidatesByStatus].map((c, index) => (
                            <Draggable key={c.id} draggableId={c.id.toString()} index={index}>
                              {(dragProvided, dragSnapshot) => (
                                <div
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                  {...dragProvided.dragHandleProps}
                                >
                                  <Card
                                    className={`border-muted transition will-change-transform border-l-4 ${
                                      columnCardColors[col.status] || "border-l-primary/30 hover:border-l-primary"
                                    } ${dragSnapshot.isDragging ? "shadow-md" : "hover:shadow-md hover:-translate-y-0.5 hover:ring-1 hover:ring-primary/30"}`}
                                  >
                                    <CardContent className="p-3">
                                      <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                          <img
                                            src={
                                              c.avatar || "/placeholder.svg?height=32&width=32&query=candidate%20avatar"
                                            }
                                            alt={c.name}
                                            className="w-8 h-8 rounded-full object-cover"
                                          />
                                          <div className="min-w-0">
                                            <p className="font-medium text-sm truncate">{c.name}</p>
                                            <p className="text-[11px] text-muted-foreground truncate">{c.email}</p>
                                          </div>
                                        </div>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="More">
                                              <MoreVertical className="h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                              <Link href={`/candidates/${c.id}`}>View profile</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => moveToNext(c.id)}>
                                              Move to next stage
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onSelect={() => toggleDisqualified(c.id)}>
                                              {c.disqualified ? "Restore from disqualified" : "Disqualify"}
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>

                                      <div className="mt-1.5">
                                        <p className="text-[11px] text-muted-foreground/80 font-medium mb-0.5">
                                          Applied Role:
                                        </p>
                                        <p className="text-[13px] text-foreground font-medium">{c.position}</p>
                                      </div>

                                      <div className="mt-2 flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                                          <span className="inline-flex items-center gap-1">
                                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /> {c.rating}
                                          </span>
                                          <span className="inline-flex items-center gap-1">
                                            <Mail className="h-3 w-3" /> {tinyMetric(c.id, 3)}
                                          </span>
                                        </div>
                                        <span className="text-[11px] text-muted-foreground">
                                          {tinyMetric(c.id, 5)}/{8}
                                        </span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          {candidatesByStatus[col.status as keyof typeof candidatesByStatus].length === 0 && (
                            <div className="text-center py-6 text-muted-foreground text-sm">
                              No candidates in {col.title.toLowerCase()}
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DragDropContext>
      </main>
    </div>
  )
}
