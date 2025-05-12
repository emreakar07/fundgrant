export interface ReferenceDocument {
  id: string
  title: string
  description?: string
  fileUrl?: string
  fileType?: string
  fileSize?: number
  category?: string
  tags?: string[]
  uploadDate: string
  lastModified?: string
  uploadedBy?: string
  status?: 'active' | 'archived' | 'draft'
  version?: string
  metadata?: Record<string, any>
}

export const documentCategories = [
  "Grant Guidelines",
  "Application Forms",
  "Research Papers",
  "Case Studies",
  "Technical Specifications",
  "Financial Reports",
  "Legal Documents",
  "Templates",
  "Other"
]

export const mockDocuments: ReferenceDocument[] = [
  {
    id: "doc-1",
    title: "EU Horizon Grant Guidelines 2023",
    description: "Official guidelines for EU Horizon grant applications for the fiscal year 2023",
    fileUrl: "/documents/horizon-guidelines.pdf",
    fileType: "application/pdf",
    fileSize: 2400000,
    category: "Grant Guidelines",
    tags: ["EU", "Horizon", "Guidelines", "2023"],
    uploadDate: "2023-01-15T09:30:00Z",
    lastModified: "2023-01-15T09:30:00Z",
    uploadedBy: "System Admin",
    status: "active"
  },
  {
    id: "doc-2",
    title: "Clean Energy Project Application Template",
    description: "Standard template for clean energy project proposals",
    fileUrl: "/documents/clean-energy-template.docx",
    fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    fileSize: 350000,
    category: "Templates",
    tags: ["Template", "Clean Energy", "Project Proposal"],
    uploadDate: "2023-02-22T14:15:00Z",
    lastModified: "2023-03-10T11:20:00Z",
    uploadedBy: "Grant Manager",
    status: "active"
  }
] 