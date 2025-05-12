"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Paperclip, X, FileText, ImageIcon, FileSpreadsheet, Upload, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url: string
}

export function ProjectAttachments() {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    }
  }

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter((attachment) => attachment.id !== id))
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-5 w-5" />
    if (type.includes("spreadsheet") || type.includes("excel")) return <FileSpreadsheet className="h-5 w-5" />
    if (type.includes("pdf")) return <File className="h-5 w-5" />
    return <FileText className="h-5 w-5" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Paperclip className="h-5 w-5 mr-2" />
          Project Attachments
        </CardTitle>
        <CardDescription>Upload supporting documents for your entire application</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="border-2 border-dashed rounded-md p-8 text-center text-muted-foreground mb-4"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Upload className="h-10 w-10 mx-auto mb-4 opacity-50" />
          <p className="text-sm mb-2">Drag and drop files here or click to browse</p>
          <p className="text-xs mb-4">Support for images, documents, spreadsheets, PDFs, and more</p>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Paperclip className="h-4 w-4 mr-2" />
            Select Files
          </Button>
          <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileUpload} />
        </div>

        {attachments.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Uploaded Files ({attachments.length})</h3>
              <Badge variant="outline">
                {attachments.reduce((acc, file) => acc + file.size, 0) > 1048576
                  ? (attachments.reduce((acc, file) => acc + file.size, 0) / 1048576).toFixed(1) + " MB"
                  : (attachments.reduce((acc, file) => acc + file.size, 0) / 1024).toFixed(1) + " KB"}
              </Badge>
            </div>

            <ScrollArea className="h-[300px] border rounded-md p-2">
              <div className="space-y-2">
                {attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded p-3"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center mr-3">
                        {getFileIcon(file.type)}
                      </div>
                      <div>
                        <p className="text-sm font-medium truncate max-w-[300px]">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => removeAttachment(file.id)}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </CardContent>
    </Card>
  )
}
