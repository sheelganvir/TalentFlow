"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Calendar, Archive, Eye, Edit, GripVertical } from "lucide-react"
import Link from "next/link"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import type { Job } from "@/lib/db"

interface SortableJobCardProps {
  job: Job
  onArchive: (id: number, archived: boolean) => void
  onEdit: (job: Job) => void
  isDragging?: boolean
}

export function SortableJobCard({ job, onArchive, onEdit, isDragging }: SortableJobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: job.id! })

  const currentApplicants = job.applicantsTrend[job.applicantsTrend.length - 1] || 0
  const sparklineData = job.applicantsTrend.map((value, index) => ({ value, index }))

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isSortableDragging ? 1000 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: isSortableDragging ? 1.05 : 1,
          rotateZ: isSortableDragging ? 2 : 0,
        }}
        whileHover={{ y: isSortableDragging ? 0 : -4, transition: { duration: 0.2 } }}
        className={`${isSortableDragging ? "cursor-grabbing" : ""}`}
      >
        <Card
          className={`relative overflow-hidden transition-all duration-300 border-border/50 ${
            isSortableDragging
              ? "shadow-2xl shadow-primary/20 bg-card/95 backdrop-blur-sm"
              : "hover:shadow-lg hover:shadow-primary/10"
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {job.title}
                  </CardTitle>
                  <Badge variant={job.status === "Active" ? "default" : "secondary"}>{job.status}</Badge>
                </div>
                <CardDescription className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {job.team}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {job.createdAt.toLocaleDateString()}
                  </span>
                </CardDescription>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 ${isSortableDragging ? "cursor-grabbing" : "cursor-grab"}`}
                  {...attributes}
                  {...listeners}
                >
                  <GripVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{job.openings}</span> opening
                  {job.openings !== 1 ? "s" : ""}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{currentApplicants}</span> applicants
                </div>
              </div>

              {/* Sparkline */}
              <div className="h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData}>
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {job.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {job.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{job.tags.length - 3}
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Link href={`/jobs/${job.id}`}>
                  <Button variant="outline" size="sm" className="h-8 bg-transparent">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="h-8 bg-transparent" onClick={() => onEdit(job)}>
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 bg-transparent"
                  onClick={() => onArchive(job.id!, job.status === "Active")}
                >
                  <Archive className="h-3 w-3 mr-1" />
                  {job.status === "Active" ? "Archive" : "Unarchive"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
