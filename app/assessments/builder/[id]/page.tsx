"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { AlertCircle } from "lucide-react"
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  Save,
  Settings,
  Type,
  List,
  CheckSquare,
  Hash,
  Upload,
  AlignLeft,
} from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { getAssessmentById } from "@/data/assessments"
import { assessmentsApi } from "@/lib/api/assessments"
import { useTheme } from "next-themes"

// Question types
const QUESTION_TYPES = [
  { id: "single-choice", label: "Single Choice", icon: List, description: "Radio buttons - one answer" },
  { id: "multi-choice", label: "Multi Choice", icon: CheckSquare, description: "Checkboxes - multiple answers" },
  { id: "short-text", label: "Short Text", icon: Type, description: "Single line text input" },
  { id: "long-text", label: "Long Text", icon: AlignLeft, description: "Multi-line text area" },
  { id: "numeric", label: "Numeric", icon: Hash, description: "Number input with range" },
  { id: "file-upload", label: "File Upload", icon: Upload, description: "File attachment (stub)" },
]

// Default question structure
const createDefaultQuestion = (type: string, sectionId: string) => ({
  id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  sectionId,
  type,
  title: "",
  description: "",
  required: false,
  options: type === "single-choice" || type === "multi-choice" ? ["Option 1", "Option 2"] : [],
  validation: {
    minLength: type === "short-text" || type === "long-text" ? 0 : undefined,
    maxLength: type === "short-text" ? 100 : type === "long-text" ? 1000 : undefined,
    min: type === "numeric" ? 0 : undefined,
    max: type === "numeric" ? 100 : undefined,
  },
  conditional: {
    enabled: false,
    dependsOn: "",
    condition: "equals",
    value: "",
  },
})

// Default section structure
const createDefaultSection = () => ({
  id: `s_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  title: "New Section",
  description: "",
  questions: [],
})

export default function AssessmentBuilderPage() {
  const params = useParams()
  const router = useRouter()
  const assessmentId = params.id as string
  const { theme } = useTheme()

  const [assessment, setAssessment] = useState({
    id: assessmentId,
    title: "New Assessment",
    description: "",
    type: "Technical",
    estimatedDuration: 60,
    sections: [createDefaultSection()],
  })

  const [activeView, setActiveView] = useState<"builder" | "preview">("builder")
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [previewResponses, setPreviewResponses] = useState<Record<string, any>>({})
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  useEffect(() => {
    if (assessmentId !== "new") {
      const existingAssessment = getAssessmentById(Number(assessmentId))
      if (existingAssessment) {
        const builderAssessment = {
          id: assessmentId,
          title: existingAssessment.title,
          description: existingAssessment.description,
          type: existingAssessment.type,
          estimatedDuration: existingAssessment.duration,
          sections: existingAssessment.sections.map((section) => ({
            ...section,
            questions: section.questions.map((question) => ({
              ...question,
              sectionId: section.id,
              conditional: {
                enabled: !!question.conditionalLogic,
                dependsOn: question.conditionalLogic?.showIf.questionId || "",
                condition: question.conditionalLogic?.showIf.operator || "equals",
                value: question.conditionalLogic?.showIf.value || "",
              },
            })),
          })),
        }
        setAssessment(builderAssessment)
        return
      }
    }

    const saved = localStorage.getItem(`assessment_${assessmentId}`)
    if (saved) {
      try {
        setAssessment(JSON.parse(saved))
      } catch (error) {
        console.error("Failed to load assessment:", error)
      }
    }
  }, [assessmentId])

  useEffect(() => {
    localStorage.setItem(`assessment_${assessmentId}`, JSON.stringify(assessment))
  }, [assessment, assessmentId])

  const addSection = () => {
    setAssessment((prev) => ({
      ...prev,
      sections: [...prev.sections, createDefaultSection()],
    }))
  }

  const deleteSection = (sectionId: string) => {
    setAssessment((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== sectionId),
    }))
  }

  const updateSection = (sectionId: string, updates: any) => {
    setAssessment((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === sectionId ? { ...s, ...updates } : s)),
    }))
  }

  const addQuestion = (sectionId: string, type: string) => {
    const newQuestion = createDefaultQuestion(type, sectionId)
    setAssessment((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === sectionId ? { ...s, questions: [...s.questions, newQuestion] } : s)),
    }))
    setSelectedQuestion(newQuestion.id)
  }

  const deleteQuestion = (questionId: string) => {
    setAssessment((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => ({
        ...s,
        questions: s.questions.filter((q) => q.id !== questionId),
      })),
    }))
    if (selectedQuestion === questionId) {
      setSelectedQuestion(null)
    }
  }

  const updateQuestion = (questionId: string, updates: any) => {
    setAssessment((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => ({
        ...s,
        questions: s.questions.map((q) => (q.id === questionId ? { ...q, ...updates } : q)),
      })),
    }))
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result
    const sourceSectionId = source.droppableId
    const destSectionId = destination.droppableId

    setAssessment((prev) => {
      const newSections = [...prev.sections]
      const sourceSection = newSections.find((s) => s.id === sourceSectionId)
      const destSection = newSections.find((s) => s.id === destSectionId)

      if (!sourceSection || !destSection) return prev

      const [movedQuestion] = sourceSection.questions.splice(source.index, 1)
      movedQuestion.sectionId = destSectionId
      destSection.questions.splice(destination.index, 0, movedQuestion)

      return { ...prev, sections: newSections }
    })
  }

  const getSelectedQuestion = () => {
    if (!selectedQuestion) return null
    for (const section of assessment.sections) {
      const question = section.questions.find((q) => q.id === selectedQuestion)
      if (question) return question
    }
    return null
  }

  const validateQuestion = (question: any, value: any): string | null => {
    if (question.required) {
      if (!value || (Array.isArray(value) && value.length === 0) || value === "") {
        return "This field is required"
      }
    }

    if (!value || (Array.isArray(value) && value.length === 0) || value === "") {
      return null
    }

    if (question.type === "short-text" || question.type === "long-text") {
      const textValue = String(value)
      if (question.validation.minLength && textValue.length < question.validation.minLength) {
        return `Minimum ${question.validation.minLength} characters required`
      }
      if (question.validation.maxLength && textValue.length > question.validation.maxLength) {
        return `Maximum ${question.validation.maxLength} characters allowed`
      }
    }

    if (question.type === "numeric") {
      const numValue = Number(value)
      if (isNaN(numValue)) {
        return "Please enter a valid number"
      }
      if (question.validation.min !== undefined && numValue < question.validation.min) {
        return `Value must be at least ${question.validation.min}`
      }
      if (question.validation.max !== undefined && numValue > question.validation.max) {
        return `Value must be at most ${question.validation.max}`
      }
    }

    return null
  }

  const renderPreviewQuestion = (question: any) => {
    const value = previewResponses[question.id] || ""
    const error = validationErrors[question.id]

    const updateResponse = (newValue: any) => {
      setPreviewResponses((prev) => ({
        ...prev,
        [question.id]: newValue,
      }))

      const validationError = validateQuestion(question, newValue)
      setValidationErrors((prev) => ({
        ...prev,
        [question.id]: validationError || "",
      }))
    }

    if (question.conditional.enabled && question.conditional.dependsOn) {
      const dependentValue = previewResponses[question.conditional.dependsOn]
      const shouldShow = dependentValue === question.conditional.value
      if (!shouldShow) return null
    }

    return (
      <div key={question.id} className="space-y-3">
        <div>
          <Label className="text-base font-medium">
            {question.title}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {question.description && <p className="text-sm text-muted-foreground mt-1">{question.description}</p>}
        </div>

        {question.type === "single-choice" && (
          <div className="space-y-2">
            {question.options.map((option: string, index: number) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => updateResponse(e.target.value)}
                  className="w-4 h-4"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === "multi-choice" && (
          <div className="space-y-2">
            {question.options.map((option: string, index: number) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : []
                    if (e.target.checked) {
                      updateResponse([...currentValues, option])
                    } else {
                      updateResponse(currentValues.filter((v: string) => v !== option))
                    }
                  }}
                  className="w-4 h-4"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === "short-text" && (
          <div>
            <Input
              value={value}
              onChange={(e) => updateResponse(e.target.value)}
              placeholder="Enter your answer..."
              maxLength={question.validation.maxLength}
              className={error ? "border-red-500" : ""}
            />
            {question.validation.maxLength && (
              <p className="text-xs text-muted-foreground mt-1">
                {String(value).length}/{question.validation.maxLength} characters
              </p>
            )}
          </div>
        )}

        {question.type === "long-text" && (
          <div>
            <Textarea
              value={value}
              onChange={(e) => updateResponse(e.target.value)}
              placeholder="Enter your detailed answer..."
              rows={4}
              maxLength={question.validation.maxLength}
              className={error ? "border-red-500" : ""}
            />
            {question.validation.maxLength && (
              <p className="text-xs text-muted-foreground mt-1">
                {String(value).length}/{question.validation.maxLength} characters
              </p>
            )}
          </div>
        )}

        {question.type === "numeric" && (
          <div>
            <Input
              type="number"
              value={value}
              onChange={(e) => updateResponse(Number(e.target.value))}
              placeholder="Enter a number..."
              min={question.validation.min}
              max={question.validation.max}
              className={error ? "border-red-500" : ""}
            />
            {(question.validation.min !== undefined || question.validation.max !== undefined) && (
              <p className="text-xs text-muted-foreground mt-1">
                Range: {question.validation.min ?? "No minimum"} - {question.validation.max ?? "No maximum"}
              </p>
            )}
          </div>
        )}

        {question.type === "file-upload" && (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground mt-1">File upload functionality (stub)</p>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500 flex items-center space-x-1">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </p>
        )}
      </div>
    )
  }

  const handleSubmitAssessment = () => {
    const allQuestions = assessment.sections.flatMap((s) => s.questions)
    const errors: Record<string, string> = {}

    allQuestions.forEach((question) => {
      if (question.conditional.enabled && question.conditional.dependsOn) {
        const dependentValue = previewResponses[question.conditional.dependsOn]
        const shouldShow = dependentValue === question.conditional.value
        if (!shouldShow) return
      }

      const value = previewResponses[question.id]
      const error = validateQuestion(question, value)
      if (error) {
        errors[question.id] = error
      }
    })

    setValidationErrors(errors)

    if (Object.keys(errors).length === 0) {
      alert("Assessment submitted successfully!")
      console.log("Assessment responses:", previewResponses)
    } else {
      const firstErrorElement = document.querySelector(".border-red-500")
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }

  const handleSaveAssessment = async () => {
    setIsSaving(true)
    setSaveMessage("")

    try {
      const apiAssessment = {
        id: assessmentId === "new" ? Date.now() : Number(assessmentId),
        title: assessment.title,
        description: assessment.description,
        type: assessment.type,
        duration: assessment.estimatedDuration,
        questions: assessment.sections.reduce((total, section) => total + section.questions.length, 0),
        candidates: 0,
        status: "Draft",
        createdDate: new Date().toISOString().split("T")[0],
        completionRate: 0,
        sections: assessment.sections.map((section) => ({
          ...section,
          questions: section.questions.map((question) => ({
            ...question,
            conditionalLogic: question.conditional.enabled
              ? {
                  showIf: {
                    questionId: question.conditional.dependsOn,
                    operator: question.conditional.condition,
                    value: question.conditional.value,
                  },
                }
              : undefined,
          })),
        })),
      }

      await assessmentsApi.saveAssessment(1, apiAssessment)

      setSaveMessage("Assessment saved successfully!")

      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      console.error("Failed to save assessment:", error)
      setSaveMessage("Failed to save assessment. Please try again.")

      setTimeout(() => setSaveMessage(""), 5000)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/talentflow-logo-4TjqXtXrX6vfXNMoAPnDMg8xsE4ggh.png"
                alt="TalentFlow logo"
                className="w-8 h-8"
                width={32}
                height={32}
                decoding="async"
              />
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className={`text-xl font-semibold ${theme === "dark" ? "text-primary" : "text-primary"}`}>
                  {assessment.title}
                </h1>
                <p className="text-sm text-muted-foreground">Assessment Builder</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-muted rounded-lg p-1">
                <Button
                  variant={activeView === "builder" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveView("builder")}
                  className="rounded-md"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Builder
                </Button>
                <Button
                  variant={activeView === "preview" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveView("preview")}
                  className="rounded-md"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button onClick={handleSaveAssessment} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Assessment"}
                </Button>
                {saveMessage && (
                  <span className={`text-sm ${saveMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>
                    {saveMessage}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6 pl-16">
        {activeView === "builder" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Assessment Title</Label>
                    <Input
                      id="title"
                      value={assessment.title}
                      onChange={(e) => setAssessment((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter assessment title..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={assessment.description}
                      onChange={(e) => setAssessment((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this assessment evaluates..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Assessment Type</Label>
                      <select
                        id="type"
                        value={assessment.type}
                        onChange={(e) => setAssessment((prev) => ({ ...prev, type: e.target.value }))}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      >
                        <option value="Technical">Technical</option>
                        <option value="Behavioral">Behavioral</option>
                        <option value="Case Study">Case Study</option>
                        <option value="Portfolio">Portfolio</option>
                        <option value="Coding">Coding</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={assessment.estimatedDuration}
                        onChange={(e) =>
                          setAssessment((prev) => ({ ...prev, estimatedDuration: Number(e.target.value) }))
                        }
                        min="1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <DragDropContext onDragEnd={handleDragEnd}>
                {assessment.sections.map((section, sectionIndex) => (
                  <Card key={section.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <Input
                            value={section.title}
                            onChange={(e) => updateSection(section.id, { title: e.target.value })}
                            className="text-lg font-semibold border-none p-0 h-auto bg-transparent"
                            placeholder="Section title..."
                          />
                          <Textarea
                            value={section.description}
                            onChange={(e) => updateSection(section.id, { description: e.target.value })}
                            placeholder="Section description (optional)..."
                            className="mt-2 border-none p-0 bg-transparent resize-none"
                            rows={1}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{section.questions.length} questions</Badge>
                          {assessment.sections.length > 1 && (
                            <Button variant="ghost" size="sm" onClick={() => deleteSection(section.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Droppable droppableId={section.id}>
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                            {section.questions.map((question, questionIndex) => (
                              <Draggable key={question.id} draggableId={question.id} index={questionIndex}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                      selectedQuestion === question.id
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/50"
                                    } ${snapshot.isDragging ? "shadow-lg" : ""}`}
                                    onClick={() => setSelectedQuestion(question.id)}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div {...provided.dragHandleProps}>
                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                          <Badge variant="secondary" className="text-xs">
                                            {QUESTION_TYPES.find((t) => t.id === question.type)?.label}
                                          </Badge>
                                          {question.required && (
                                            <Badge variant="destructive" className="text-xs">
                                              Required
                                            </Badge>
                                          )}
                                          {question.conditional.enabled && (
                                            <Badge variant="outline" className="text-xs">
                                              Conditional
                                            </Badge>
                                          )}
                                        </div>
                                        <p className="font-medium mt-1">{question.title || "Untitled Question"}</p>
                                        {question.description && (
                                          <p className="text-sm text-muted-foreground">{question.description}</p>
                                        )}
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          deleteQuestion(question.id)
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {QUESTION_TYPES.map((type) => {
                            const Icon = type.icon
                            return (
                              <Button
                                key={type.id}
                                variant="outline"
                                size="sm"
                                onClick={() => addQuestion(section.id, type.id)}
                                className="justify-start"
                              >
                                <Icon className="h-4 w-4 mr-2" />
                                {type.label}
                              </Button>
                            )
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </DragDropContext>

              <Button variant="outline" onClick={addSection} className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>

            <div className="space-y-6">
              {selectedQuestion ? (
                <QuestionEditor
                  question={getSelectedQuestion()}
                  onUpdate={(updates) => updateQuestion(selectedQuestion, updates)}
                  allQuestions={assessment.sections.flatMap((s) => s.questions)}
                />
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Settings className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground">Select a question to edit its properties</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{assessment.title}</CardTitle>
                {assessment.description && <p className="text-muted-foreground">{assessment.description}</p>}
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Estimated time: {assessment.estimatedDuration} minutes</span>
                  <span>•</span>
                  <span>{assessment.sections.reduce((acc, s) => acc + s.questions.length, 0)} questions</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {assessment.sections.map((section) => (
                  <div key={section.id}>
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold">{section.title}</h3>
                      {section.description && <p className="text-muted-foreground mt-1">{section.description}</p>}
                    </div>
                    <div className="space-y-6">
                      {section.questions.map((question) => renderPreviewQuestion(question))}
                    </div>
                    {section !== assessment.sections[assessment.sections.length - 1] && <Separator className="mt-8" />}
                  </div>
                ))}
                <div className="pt-6">
                  <Button className="w-full" size="lg" onClick={handleSubmitAssessment}>
                    Submit Assessment
                  </Button>
                  {Object.keys(validationErrors).length > 0 && (
                    <p className="text-sm text-red-500 text-center mt-2">
                      Please fix the errors above before submitting
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

function QuestionEditor({ question, onUpdate, allQuestions }: any) {
  if (!question) return null

  const questionType = QUESTION_TYPES.find((t) => t.id === question.type)

  const addOption = () => {
    const newOptions = [...question.options, `Option ${question.options.length + 1}`]
    onUpdate({ options: newOptions })
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...question.options]
    newOptions[index] = value
    onUpdate({ options: newOptions })
  }

  const removeOption = (index: number) => {
    if (question.options.length > 2) {
      const newOptions = question.options.filter((_: any, i: number) => i !== index)
      onUpdate({ options: newOptions })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {questionType && <questionType.icon className="h-5 w-5" />}
          <span>Question Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="question-title">Question Title</Label>
          <Input
            id="question-title"
            value={question.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Enter your question..."
          />
        </div>

        <div>
          <Label htmlFor="question-description">Description (optional)</Label>
          <Textarea
            id="question-description"
            value={question.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Additional context or instructions..."
            rows={2}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="required"
            checked={question.required}
            onCheckedChange={(checked) => onUpdate({ required: checked })}
          />
          <Label htmlFor="required">Required question</Label>
        </div>

        {(question.type === "single-choice" || question.type === "multi-choice") && (
          <div>
            <Label>Answer Options</Label>
            <div className="space-y-2 mt-2">
              {question.options.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  {question.options.length > 2 && (
                    <Button variant="ghost" size="sm" onClick={() => removeOption(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addOption}>
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
          </div>
        )}

        {(question.type === "short-text" || question.type === "long-text") && (
          <div className="space-y-3">
            <Label>Text Validation</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="min-length" className="text-sm">
                  Min Length
                </Label>
                <Input
                  id="min-length"
                  type="number"
                  value={question.validation.minLength || ""}
                  onChange={(e) =>
                    onUpdate({
                      validation: { ...question.validation, minLength: Number(e.target.value) || 0 },
                    })
                  }
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="max-length" className="text-sm">
                  Max Length
                </Label>
                <Input
                  id="max-length"
                  type="number"
                  value={question.validation.maxLength || ""}
                  onChange={(e) =>
                    onUpdate({
                      validation: { ...question.validation, maxLength: Number(e.target.value) || undefined },
                    })
                  }
                  min="1"
                />
              </div>
            </div>
          </div>
        )}

        {question.type === "numeric" && (
          <div className="space-y-3">
            <Label>Numeric Range</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="min-value" className="text-sm">
                  Minimum Value
                </Label>
                <Input
                  id="min-value"
                  type="number"
                  value={question.validation.min || ""}
                  onChange={(e) =>
                    onUpdate({
                      validation: { ...question.validation, min: Number(e.target.value) || undefined },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="max-value" className="text-sm">
                  Maximum Value
                </Label>
                <Input
                  id="max-value"
                  type="number"
                  value={question.validation.max || ""}
                  onChange={(e) =>
                    onUpdate({
                      validation: { ...question.validation, max: Number(e.target.value) || undefined },
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        <Separator />
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="conditional"
              checked={question.conditional.enabled}
              onCheckedChange={(checked) =>
                onUpdate({
                  conditional: { ...question.conditional, enabled: checked },
                })
              }
            />
            <Label htmlFor="conditional">Conditional Question</Label>
          </div>

          {question.conditional.enabled && (
            <div className="space-y-3 pl-6 border-l-2 border-muted">
              <div>
                <Label htmlFor="depends-on" className="text-sm">
                  Show this question only if:
                </Label>
                <select
                  id="depends-on"
                  value={question.conditional.dependsOn}
                  onChange={(e) =>
                    onUpdate({
                      conditional: { ...question.conditional, dependsOn: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm mt-1"
                >
                  <option value="">Select a question...</option>
                  {allQuestions
                    .filter((q: any) => q.id !== question.id && q.sectionId === question.sectionId)
                    .map((q: any) => (
                      <option key={q.id} value={q.id}>
                        {q.title || "Untitled Question"}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <Label htmlFor="condition-value" className="text-sm">
                  Equals:
                </Label>
                <Input
                  id="condition-value"
                  value={question.conditional.value}
                  onChange={(e) =>
                    onUpdate({
                      conditional: { ...question.conditional, value: e.target.value },
                    })
                  }
                  placeholder="Enter the expected answer..."
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
