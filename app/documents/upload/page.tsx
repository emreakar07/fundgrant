"use client"

import { useState } from "react"
import { Upload, Plus, ArrowLeft, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { documentCategories } from "@/lib/documents-data"

export default function UploadDocumentPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleAddTag = () => {
    if (!newTag.trim()) return
    
    const trimmedTag = newTag.trim()
    
    // Don't add duplicate tags
    if (tags.includes(trimmedTag)) {
      setNewTag("")
      return
    }
    
    setTags([...tags, trimmedTag])
    setNewTag("")
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError("Please enter a document title")
      return
    }
    
    try {
      setUploading(true)
      setError("")
      
      // In a real application, you would upload the file to a storage service
      // and get a URL back. For this example, we'll mock that process.
      
      const fileUrl = file ? `/documents/${file.name}` : undefined
      
      // Create the document object
      const newDocument = {
        title: title.trim(),
        description: description.trim() || undefined,
        category: category && category !== "uncategorized" ? category : undefined,
        tags: tags.length > 0 ? tags : undefined,
        uploadDate: new Date().toISOString(),
        status: 'active',
        fileUrl,
        fileType: file?.type,
        fileSize: file?.size,
        uploadedBy: "Current User" // In a real app, this would be the current user
      }
      
      // Save the document via API
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDocument)
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to create document')
      }
      
      const createdDocument = await response.json()
      console.log('Document created:', createdDocument)
      
      // Redirect to the document detail page
      router.push(`/documents/${createdDocument.id}`)
    } catch (error) {
      console.error('Error creating document:', error)
      setError(error instanceof Error ? error.message : 'Failed to upload document. Please try again.')
      setUploading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => router.push('/documents')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Documents
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Upload className="h-5 w-5 mr-2 text-blue-600" />
            Upload Document
          </CardTitle>
          <CardDescription>
            Add a new reference document or template to your library
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="block mb-2">
                  Document Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter document title"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="block mb-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a description of this document..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category" className="block mb-2">
                    Category
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uncategorized">Uncategorized</SelectItem>
                      {documentCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="block mb-2">
                    Tags
                  </Label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2 min-h-[38px]">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleRemoveTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddTag()
                          }
                        }}
                      />
                      <Button type="button" size="sm" onClick={handleAddTag}>Add</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="file" className="block mb-2">
                  Document File
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  {file ? (
                    <div className="flex flex-col items-center">
                      <FileText className="h-8 w-8 text-blue-500 mb-2" />
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={() => setFile(null)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-lg font-medium">Drag and drop your file here, or</p>
                      <div className="mt-2">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Button type="button" variant="secondary" size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Browse files
                          </Button>
                          <Input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Supported file types: PDF, DOCX, XLSX, PPTX, etc.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <CardFooter className="flex justify-end gap-2 px-0 pt-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => router.push('/documents')}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={uploading || !title.trim()}
              >
                {uploading ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-b-0 border-white rounded-full"></div>
                    Uploading...
                  </div>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 