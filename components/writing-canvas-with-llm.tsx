"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
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
  MessageSquare,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import type { Agent, Section } from "@/lib/data"
import { enhanceContent, simulateEnhanceContent } from "@/lib/openai-service"

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
  onTogglePersonalTouchAction: () => void
  isComparing: boolean
  onCloseCompareAction: () => void
  onUpdateSection?: (updatedSection: Section) => void
}

export default function WritingCanvasWithLLM({
  section,
  agent,
  personalTouchMode,
  onTogglePersonalTouchAction,
  isComparing,
  onCloseCompareAction,
  onUpdateSection,
}: WritingCanvasProps) {
  const { toast } = useToast()
  const [content, setContent] = useState(section.content)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [showAttachments, setShowAttachments] = useState(false)
  const [promptDialogOpen, setPromptDialogOpen] = useState(false)
  const [promptInstructions, setPromptInstructions] = useState("")
  const [contentHistory, setContentHistory] = useState<string[]>([])
  const [useSimulation, setUseSimulation] = useState(true) // Default to simulation mode
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load existing content from projects collection
  useEffect(() => {
    const loadExistingContent = async () => {
      if (!section || !section.id) return;
      
      try {
        setIsLoading(true);
        
        // Get the project ID from URL
        let projectId;
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          projectId = urlParams.get('projectId');
          if (!projectId) return;
        }

        console.log(`Loading content for section ${section.id} from project ${projectId}`);

        // Fetch the project from our API
        const response = await fetch(`/api/projects/${projectId}`);
        
        if (response.ok) {
          const projectData = await response.json();
          
          // Check if project has sections
          if (projectData && projectData.sections && Array.isArray(projectData.sections)) {
            // Find the section in the project
            const projectSection = projectData.sections.find(
              (s: any) => s.id === section.id
            );
            
            if (projectSection) {
              console.log('Found existing section in project:', projectSection);
              
              // Update content if it exists and differs from our current content
              if (projectSection.content && projectSection.content !== section.content) {
                setContent(projectSection.content);
                toast({
                  title: "Section loaded",
                  description: `Loaded existing content for ${section.title}`,
                });
              }
            } else {
              console.log('Section not found in project data');
              setContent(section.content);
            }
          } else {
            console.log('No sections found in project data');
            setContent(section.content);
          }
        } else {
          console.log('Failed to load project data');
          setContent(section.content);
        }
      } catch (error) {
        console.error('Error loading project content:', error);
        setContent(section.content);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadExistingContent();
  }, [section]);

  // Update content or attachments when section changes completely
  useEffect(() => {
    // Only update state if the content we're getting is different
    if (section.content !== content) {
      setContent(section.content);
    }
    
    // Reset attachments and history when section changes
    setAttachments([]);
    setShowAttachments(false);
    setContentHistory([]);
  }, [section.id]); // Only run when section ID changes, not on every render

  // Save content to history before generating new content
  const saveToHistory = () => {
    // Only save if content is not empty and different from the last history item
    if (content && (contentHistory.length === 0 || contentHistory[contentHistory.length - 1] !== content)) {
      setContentHistory([...contentHistory, content])
    }
  }

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Get the current selected project ID from the URL or context
      let projectId;
      
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        projectId = urlParams.get('projectId');
      }
      
      if (!projectId) {
        toast({
          title: "Error updating content",
          description: "No project ID found. Please make sure a project is selected.",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }
      
      console.log(`Updating section ${section.id} in project ${projectId}...`);
      
      // Calculate word count - if content is empty, wordCount is 0, otherwise count actual words
      const wordCount = content.trim().length > 0 ? content.split(/\s+/).filter(Boolean).length : 0;
      
      // Prepare section data for the PATCH request
      const updateData = {
        sectionId: section.id,
        title: section.title,
        description: section.description,
        content: content,
        status: content.trim().length > 0 ? "draft" : "not_started",
        wordCount: wordCount
      };
      
      try {
        // Make API call to update the section in the project
        const response = await fetch(`/api/projects/${projectId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });
        
        let responseData;
        try {
          responseData = await response.json();
        } catch (err) {
          throw new Error(`Failed to parse response from server: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
        
        if (!response.ok) {
          console.error('API Error Response:', responseData);
          throw new Error(responseData.error || `Failed to update section (Status: ${response.status})`);
        }
        
        // Update the section in the parent component
        if (onUpdateSection) {
          const updatedSection = {
            ...section,
            content: content,
            wordCount: wordCount,
            status: (content.trim().length > 0 ? "draft" : "not_started") as "not_started" | "draft" | "completed"
          };
          onUpdateSection(updatedSection);
        }
        
        toast({
          title: "Content updated",
          description: "Your content has been updated successfully.",
        });
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        throw new Error(`API request failed: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error updating section:", error);
      toast({
        title: "Error updating content",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Update to simple content change handler without auto-save
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Update wordCount in parent component in real-time
    if (onUpdateSection) {
      // If content is empty, wordCount is 0, otherwise count actual words
      const wordCount = newContent.trim().length > 0 ? newContent.split(/\s+/).filter(Boolean).length : 0;
      
      const updatedSection = {
        ...section,
        content: newContent,
        wordCount: wordCount,
        status: section.status // Preserve the existing status
      };
      onUpdateSection(updatedSection);
    }
  };

  const handleOpenGeneratePrompt = () => {
    // Only open prompt dialog if there's content to enhance
    if (content.trim().length > 0) {
      setPromptDialogOpen(true)
    } else {
      toast({
        title: "Cannot regenerate empty content",
        description: "Please write some content first before using the regenerate feature.",
        variant: "destructive",
      })
    }
  }

  const handleRegenerateWithPrompt = async () => {
    if (!promptInstructions.trim()) {
      toast({
        title: "Instructions required",
        description: "Please provide instructions for the AI to enhance your content.",
        variant: "destructive",
      });
      return;
    }

    setPromptDialogOpen(false);
    setIsGenerating(true);
    saveToHistory(); // Save current content to history

    try {
      let enhancedContent;
      
      if (useSimulation) {
        // Use simulation for testing/development
        enhancedContent = await simulateEnhanceContent(
          content,
          promptInstructions,
          { title: section.title, description: section.description },
          agent
        );
      } else {
        // Use real OpenAI API for production
        enhancedContent = await enhanceContent(
          content,
          promptInstructions,
          { title: section.title, description: section.description },
          agent
        );
      }

      setContent(enhancedContent);
      
      toast({
        title: "Content enhanced",
        description: `Successfully enhanced content with ${agent.name}. Don't forget to save your changes.`,
        action: (
          <Button size="sm" variant="outline" onClick={handleSave}>
            Save Now
          </Button>
        ),
        duration: 8000, // Longer duration to give time to click save
      });
      
    } catch (error) {
      console.error("Error enhancing content:", error);
      toast({
        title: "Error enhancing content",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setPromptInstructions(""); // Reset the prompt for next time
    }
  };

  const handleUndo = () => {
    if (contentHistory.length > 0) {
      // Get the last content from history
      const previousContent = contentHistory[contentHistory.length - 1]
      
      // Update content
      setContent(previousContent)
      
      // Remove the last item from history
      setContentHistory(contentHistory.slice(0, -1))
      
      toast({
        title: "Change undone",
        description: "Reverted to previous version of content.",
      })
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        // Get project ID from URL
        let projectId;
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          projectId = urlParams.get('projectId');
        }
        
        if (!projectId) {
          toast({
            title: "Cannot upload files",
            description: "No project ID found. Please make sure a project is selected.",
            variant: "destructive",
          });
          return;
        }
        
        // Create FormData for the upload
        const formData = new FormData();
        formData.append('projectId', projectId);
        formData.append('sectionId', section.id);
        
        // Add all files to the formData
        Array.from(e.target.files).forEach(file => {
          formData.append('files', file);
        });
        
        // Show loading toast
        toast({
          title: "Uploading files...",
          description: `Uploading ${e.target.files.length} file(s)`,
        });
        
        // Upload files to the server
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Upload failed (Status: ${response.status})`);
        }
        
        const data = await response.json();
        
        // Add the returned files to the attachments state
        if (data.files && data.files.length > 0) {
          setAttachments(prev => [...prev, ...data.files]);
          setShowAttachments(true);
          
          toast({
            title: "Files uploaded successfully",
            description: `${data.files.length} file(s) uploaded`,
          });
        }
      } catch (error) {
        console.error("Error uploading files:", error);
        toast({
          title: "Error uploading files",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive",
        });
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      try {
        // Get project ID from URL
        let projectId;
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          projectId = urlParams.get('projectId');
        }
        
        if (!projectId) {
          toast({
            title: "Cannot upload files",
            description: "No project ID found. Please make sure a project is selected.",
            variant: "destructive",
          });
          return;
        }
        
        // Create FormData for the upload
        const formData = new FormData();
        formData.append('projectId', projectId);
        formData.append('sectionId', section.id);
        
        // Add all files to the formData
        Array.from(e.dataTransfer.files).forEach(file => {
          formData.append('files', file);
        });
        
        // Show loading toast
        toast({
          title: "Uploading files...",
          description: `Uploading ${e.dataTransfer.files.length} file(s)`,
        });
        
        // Upload files to the server
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Upload failed (Status: ${response.status})`);
        }
        
        const data = await response.json();
        
        // Add the returned files to the attachments state
        if (data.files && data.files.length > 0) {
          setAttachments(prev => [...prev, ...data.files]);
          setShowAttachments(true);
          
          toast({
            title: "Files uploaded successfully",
            description: `${data.files.length} file(s) uploaded`,
          });
        }
      } catch (error) {
        console.error("Error dropping files:", error);
        toast({
          title: "Error uploading files",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive",
        });
      }
    }
  }

  const removeAttachment = async (id: string) => {
    try {
      // Remove the attachment from the UI state first for fast response
      setAttachments(attachments.filter((attachment) => attachment.id !== id))
      
      // TODO: Implement API endpoint to delete the file on the server
      // This would require a DELETE request to something like /api/upload/{id}
      // For now we just remove it from the UI
      
      toast({
        title: "Attachment removed",
        description: "The file has been removed from this section",
      })
    } catch (error) {
      console.error("Error removing attachment:", error);
      toast({
        title: "Error removing attachment",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
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

  // Check if content is empty
  const isContentEmpty = content.trim().length === 0

  // Toggle API mode (development only, remove in production)
  const toggleApiMode = () => {
    setUseSimulation(!useSimulation);
    toast({
      title: useSimulation ? "Using Real OpenAI API" : "Using Simulation Mode",
      description: useSimulation ? "Now using the real OpenAI API for content enhancement." : "Now using simulation mode for content enhancement.",
    });
  };

  // Handle marking a section as completed
  const handleCompleteSection = async () => {
    if (isContentEmpty) {
      toast({
        title: "Cannot complete empty section",
        description: "Please add content to this section before marking it as complete.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get the current selected project ID from the URL or context
      let projectId;
      
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        projectId = urlParams.get('projectId');
      }
      
      if (!projectId) {
        toast({
          title: "Error completing section",
          description: "No project ID found. Please make sure a project is selected.",
          variant: "destructive",
        });
        return;
      }
      
      // First save the current content
      setIsSaving(true);
      
      // Calculate word count
      const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
      
      // Prepare section data for the PATCH request
      const updateData = {
        sectionId: section.id,
        title: section.title,
        description: section.description,
        content: content,
        status: "completed",
        wordCount: wordCount
      };
      
      // Make API call to update the section status in the project
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update section (Status: ${response.status})`);
      }
      
      // Update the section in the parent component
      if (onUpdateSection) {
        const updatedSection = {
          ...section,
          content: content,
          wordCount: wordCount,
          status: "completed" as "not_started" | "draft" | "completed"
        };
        onUpdateSection(updatedSection);
      }
      
      toast({
        title: "Section completed",
        description: `${section.title} has been marked as completed.`,
      });
    } catch (error) {
      console.error("Error completing section:", error);
      toast({
        title: "Error completing section",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Load attachments for the current section
  useEffect(() => {
    const loadAttachments = async () => {
      try {
        // Get project ID from URL
        let projectId;
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          projectId = urlParams.get('projectId');
        }
        
        if (!projectId || !section.id) return;
        
        // Fetch attachments for this section
        const response = await fetch(`/api/upload?projectId=${projectId}&sectionId=${section.id}`);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.files && data.files.length > 0) {
            setAttachments(data.files);
            setShowAttachments(true);
          } else {
            setAttachments([]);
            setShowAttachments(false);
          }
        }
      } catch (error) {
        console.error("Error loading attachments:", error);
        // Silently fail, no need to show error toast
      }
    };
    
    loadAttachments();
  }, [section.id]);

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
                    <Switch id="personal-touch" checked={personalTouchMode} onCheckedChange={onTogglePersonalTouchAction} />
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

            {/* API Mode Toggle - remove in production */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <Switch id="api-mode" checked={!useSimulation} onCheckedChange={toggleApiMode} />
                    <label
                      htmlFor="api-mode"
                      className="text-sm font-medium cursor-pointer ml-2 flex items-center"
                    >
                      <Sparkles className="h-3.5 w-3.5 mr-1.5 text-purple-500" />
                      {useSimulation ? "Simulation" : "Real API"}
                    </label>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle between simulation and real OpenAI API</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex items-center border rounded-md">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={handleSave} disabled={isSaving || isLoading} className="h-8">
                      {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {isLoading ? <span className="sr-only">Loading...</span> : <span className="sr-only">Update Content</span>}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isLoading ? "Loading Content..." : "Update Content"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8"
                      onClick={handleUndo}
                      disabled={contentHistory.length === 0}
                    >
                      <History className="h-4 w-4" />
                      <span className="sr-only">Undo</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Undo Last Change</TooltipContent>
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
        <AgentComparisonView section={section} currentAgent={agent} onCloseAction={onCloseCompareAction} />
      ) : (
        <ScrollArea className="flex-1 p-4 bg-slate-50 dark:bg-slate-950 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-900 rounded-lg border shadow-sm p-6 mb-4">
              <div className="prose dark:prose-invert max-w-none">
                <textarea
                  className="w-full min-h-[500px] border-0 focus:ring-0 p-0 bg-transparent resize-none"
                  value={content}
                  onChange={handleContentChange}
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
                {content.trim() ? content.trim().split(/\s+/).length : 0} words • Last edited 2 minutes ago
                {attachments.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {attachments.length} attachment{attachments.length !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleOpenGeneratePrompt} 
                  disabled={isGenerating || isContentEmpty}
                >
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 mr-1.5 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4 mr-1.5" />
                  )}
                  Enhance with {agent.name}
                </Button>

                <Button onClick={handleCompleteSection} disabled={isContentEmpty || isSaving}>
                  {isSaving ? (
                    <RefreshCw className="h-4 w-4 mr-1.5 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-1.5" />
                  )}
                  Complete Section
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      )}
      
      {/* Prompt Dialog */}
      <Dialog open={promptDialogOpen} onOpenChange={setPromptDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
              Enhance with {agent.name}
            </DialogTitle>
            <DialogDescription>
              Provide instructions for how you want {agent.name} to enhance your content.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="instructions" className="text-sm font-medium">
                Instructions
              </label>
              <Textarea
                id="instructions"
                placeholder="e.g., 'Make it more technical', 'Add more emphasis on environmental benefits', 'Make it more concise'"
                value={promptInstructions}
                onChange={(e) => setPromptInstructions(e.target.value)}
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Be specific about what aspects of the content you want to enhance or modify.
              </p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800 rounded-md p-3">
              <h4 className="text-sm font-medium mb-1">Selected Agent: {agent.name}</h4>
              <p className="text-xs text-muted-foreground">
                Specialization: {agent.specialization} • Tone: {agent.tone}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPromptDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRegenerateWithPrompt}
              disabled={!promptInstructions.trim()}
              className="gap-1"
            >
              <ArrowRight className="h-4 w-4" />
              Enhance Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface AgentComparisonViewProps {
  section: Section
  currentAgent: Agent
  onCloseAction: () => void
}

function AgentComparisonView({ section, currentAgent, onCloseAction }: AgentComparisonViewProps) {
  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-4">
      <Card className="h-full">
        <CardContent className="p-4 h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Compare Agent Writing Styles</h3>
            <Button variant="ghost" size="sm" onClick={onCloseAction}>
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