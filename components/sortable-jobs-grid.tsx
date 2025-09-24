"use client"

import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from "@dnd-kit/sortable"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { SortableJobCard } from "./sortable-job-card"
import { toast } from "sonner"
import type { Job } from "@/lib/db"

interface SortableJobsGridProps {
  jobs: Job[]
  onArchive: (id: number, archived: boolean) => void
  onEdit: (job: Job) => void
}

export function SortableJobsGrid({ jobs, onArchive, onEdit }: SortableJobsGridProps) {
  const [activeId, setActiveId] = useState<number | null>(null)
  const [localJobs, setLocalJobs] = useState(jobs)
  const queryClient = useQueryClient()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const reorderMutation = useMutation({
    mutationFn: async ({ jobId, newOrder }: { jobId: number; newOrder: number }) => {
      const response = await fetch(`/api/jobs/${jobId}/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newOrder }),
      })

      if (!response.ok) {
        throw new Error("Failed to reorder job")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      toast.success("Job order updated successfully!")
    },
    onError: (error, variables) => {
      console.error("Reorder failed:", error)

      // Rollback optimistic update
      setLocalJobs(jobs)

      toast.error("Failed to reorder job. Changes have been reverted.", {
        action: {
          label: "Retry",
          onClick: () => {
            reorderMutation.mutate(variables)
          },
        },
      })
    },
  })

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = localJobs.findIndex((job) => job.id === active.id)
    const newIndex = localJobs.findIndex((job) => job.id === over.id)

    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    // Optimistic update
    const newJobs = arrayMove(localJobs, oldIndex, newIndex)
    setLocalJobs(newJobs)

    // Update server
    const jobId = active.id as number
    const newOrder = newIndex + 1
    reorderMutation.mutate({ jobId, newOrder })
  }

  const activeJob = activeId ? localJobs.find((job) => job.id === activeId) : null

  // Update local jobs when props change
  if (jobs !== localJobs && !reorderMutation.isPending) {
    setLocalJobs(jobs)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={localJobs.map((job) => job.id!)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localJobs.map((job) => (
            <SortableJobCard
              key={job.id}
              job={job}
              onArchive={onArchive}
              onEdit={onEdit}
              isDragging={job.id === activeId}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeJob ? (
          <div className="transform rotate-2 scale-105">
            <SortableJobCard job={activeJob} onArchive={onArchive} onEdit={onEdit} isDragging={true} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
