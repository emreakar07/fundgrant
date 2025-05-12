"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Sparkles,
  RefreshCw,
  Save,
  History,
  Download,
  User,
  Wand2,
  Paperclip,
  X,
  FileText,
  ImageIcon,
  FileSpreadsheet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { Agent, Section } from "@/lib/data"

interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url: string
}

interface WritingCanvasProps {
  section: Section
  agent: Agent
  personalTouchMode: boolean
  onTogglePersonalTouch: () => void
  isComparing: boolean
  onCloseCompare: () => void
}

export default function WritingCanvas({
  section,
  agent,
  personalTouchMode,
  onTogglePersonalTouch,
  isComparing,
  onCloseCompare,
}: WritingCanvasProps) {
  const [content, setContent] = useState(section.content)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [showAttachments, setShowAttachments] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update content when section changes
  useEffect(() => {
    setContent(section.content)
    // Reset attachments when section changes
    setAttachments([])
    setShowAttachments(false)
  }, [section])

  const handleRegenerateContent = () => {
    setIsGenerating(true)

    // Simulate content generation
    setTimeout(() => {
      setContent(
        section.content +
          " " +
          agent.name +
          " has regenerated this content with a " +
          agent.tone +
          " tone, focusing on " +
          agent.specialization +
          ".",
      )
      setIsGenerating(false)
    }, 2000)
  }

  const handleSave = () => {
    setIsSaving(true)

    // Simulate saving
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      }))

      setAttachments((prev) => [...prev, ...newFiles])
      setShowAttachments(true)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      }))

      setAttachments((prev) => [...prev, ...newFiles])
      setShowAttachments(true)
    }
  }

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter((attachment) => attachment.id !== id))
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (type.includes("spreadsheet") || type.includes("excel")) return <FileSpreadsheet className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-white dark:bg-slate-900 p-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">{section.title}</h1>
            <p className="text-sm text-muted-foreground">{section.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <Switch id="personal-touch" checked={personalTouchMode} onCheckedChange={onTogglePersonalTouch} />
                    <label
                      htmlFor="personal-touch"
                      className="text-sm font-medium cursor-pointer ml-2 flex items-center"
                    >
                      <User className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                      Personal Touch
                    </label>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add a human touch to AI-generated content</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex items-center border rounded-md">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={handleSave} disabled={isSaving} className="h-8">
                      {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      <span className="sr-only">Save Draft</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save Draft</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8">
                      <History className="h-4 w-4" />
                      <span className="sr-only">History</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Version History</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Export</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                        <DropdownMenuItem>Export as Word</DropdownMenuItem>
                        <DropdownMenuItem>Export as Markdown</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TooltipTrigger>
                  <TooltipContent>Export</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 relative"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="h-4 w-4" />
                      {attachments.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          {attachments.length}
                        </span>
                      )}
                      <span className="sr-only">Attachments</span>
                      <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileUpload} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add Attachments</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      {isComparing ? (
        <AgentComparisonView section={section} currentAgent={agent} onClose={onCloseCompare} />
      ) : (
        <ScrollArea className="flex-1 p-4 bg-slate-50 dark:bg-slate-950 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-900 rounded-lg border shadow-sm p-6 mb-4">
              <div className="prose dark:prose-invert max-w-none">
                <textarea
                  className="w-full min-h-[500px] border-0 focus:ring-0 p-0 bg-transparent resize-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing or use AI to generate content..."
                />
              </div>
            </div>

            {/* Attachments area */}
            {(showAttachments || attachments.length > 0) && (
              <div
                className="bg-white dark:bg-slate-900 rounded-lg border shadow-sm p-4 mb-4"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium flex items-center">
                    <Paperclip className="h-4 w-4 mr-1.5" />
                    Section Attachments
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Add Files
                  </Button>
                </div>

                {attachments.length === 0 ? (
                  <div
                    className="border-2 border-dashed rounded-md p-6 text-center text-muted-foreground"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <Paperclip className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm mb-1">Drag and drop files here or click to browse</p>
                    <p className="text-xs">Support for images, documents, spreadsheets, and more</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {attachments.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded p-2"
                      >
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center mr-2">
                            {getFileIcon(file.type)}
                          </div>
                          <div>
                            <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => removeAttachment(file.id)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {content.split(" ").length} words • Last edited 2 minutes ago
                {attachments.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {attachments.length} attachment{attachments.length !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleRegenerateContent} disabled={isGenerating}>
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 mr-1.5 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4 mr-1.5" />
                  )}
                  Regenerate with {agent.name}
                </Button>

                <Button>
                  <Sparkles className="h-4 w-4 mr-1.5" />
                  Complete Section
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

interface AgentComparisonViewProps {
  section: Section
  currentAgent: Agent
  onClose: () => void
}

function AgentComparisonView({ section, currentAgent, onClose }: AgentComparisonViewProps) {
  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-4">
      <Card className="h-full">
        <CardContent className="p-4 h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Compare Agent Writing Styles</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close Comparison
            </Button>
          </div>

          <Tabs defaultValue="split" className="h-[calc(100%-40px)]">
            <TabsList className="mb-4">
              <TabsTrigger value="split">Split View</TabsTrigger>
              <TabsTrigger value="diff">Difference View</TabsTrigger>
            </TabsList>

            <TabsContent value="split" className="h-full">
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="border rounded-md p-4 bg-white dark:bg-slate-900 overflow-auto">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                    <div className="h-8 w-8 rounded-full overflow-hidden">
                      <img
                        src={`/abstract-geometric-shapes.png?height=100&width=100&query=${currentAgent.name} avatar`}
                        alt={currentAgent.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{currentAgent.name}</div>
                      <div className="text-xs text-muted-foreground">{currentAgent.tone}</div>
                    </div>
                  </div>
                  <div className="prose dark:prose-invert max-w-none text-sm">{section.content}</div>
                </div>

                <div className="border rounded-md p-4 bg-white dark:bg-slate-900 overflow-auto">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                    <div className="h-8 w-8 rounded-full overflow-hidden">
                      <img
                        src={`/placeholder.svg?height=100&width=100&query=Formal EU Style avatar`}
                        alt="Formal EU Style"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">Formal EU Style</div>
                      <div className="text-xs text-muted-foreground">Formal</div>
                    </div>
                  </div>
                  <div className="prose dark:prose-invert max-w-none text-sm">
                    {section.content
                      .replace("Our company", "The applicant organization")
                      .replace("We believe", "It is evident that")}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="diff" className="h-full">
              <div className="border rounded-md p-4 bg-white dark:bg-slate-900 h-full overflow-auto">
                <div className="prose dark:prose-invert max-w-none">
                  <p>This view shows the differences between writing styles:</p>
                  <div className="mt-4 space-y-2">
                    <div className="bg-red-50 dark:bg-red-950/30 p-2 rounded">
                      <span className="text-red-600 dark:text-red-400 font-medium">- Our company</span>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950/30 p-2 rounded">
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        + The applicant organization
                      </span>
                    </div>

                    <div className="bg-red-50 dark:bg-red-950/30 p-2 rounded mt-4">
                      <span className="text-red-600 dark:text-red-400 font-medium">- We believe</span>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950/30 p-2 rounded">
                      <span className="text-green-600 dark:text-green-400 font-medium">+ It is evident that</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
