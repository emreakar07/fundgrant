"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Building2,
  FileText,
  Briefcase,
  Mail,
  Globe,
  BarChart,
  Users,
  TrendingUp,
  Leaf,
  Target,
  Edit,
  Check,
  X,
  File,
  FileImage,
  FilePlus,
  FileSpreadsheet,
  FileTextIcon,
  Trash2,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Company } from "@/lib/companies-data"
import { useRouter } from "next/navigation"

// Safe input component to handle null formData
const SafeInput = ({ 
  value, 
  onChange, 
  type = "text",
  ...props 
}: { 
  value: any; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  [key: string]: any;
}) => {
  return (
    <Input
      type={type}
      value={value || ""}
      onChange={onChange}
      {...props}
    />
  );
};

// Type guard for checking if a value is a boolean
const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

interface CompanyDetailViewProps {
  id: string
}

export function CompanyDetailView({ id }: CompanyDetailViewProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [company, setCompany] = useState<Company | null>(null)
  const [formData, setFormData] = useState<Company | null>(null)
  const [attachments, setAttachments] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch company data from API
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true)
        console.log(`Fetching company with ID: ${id}...`)
        
        const response = await fetch(`/api/companies/${id}`, {
          cache: 'no-store',
          credentials: 'same-origin'
        })
        
        console.log('API response status:', response.status)
        
        if (response.status === 404) {
          setCompany(null)
          setError("Company not found")
          return
        }
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('API error details:', errorData)
          
          throw new Error(`Failed to fetch company: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log('Received company data from API:', data)
        setCompany(data)
        setFormData(data)
      } catch (err) {
        console.error('Error fetching company:', err)
        setError(err instanceof Error ? err.message : 'Failed to load company details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCompany()
    }
  }, [id])

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const handleInputChange = (field: string, value: any) => {
    if (!formData) return
    
    setFormData((prev) => {
      if (!prev) return prev
      
      const newData = { ...prev } as Record<string, any>

      // Handle nested fields
      if (field.includes(".")) {
        const [parent, child] = field.split(".")
        newData[parent] = {
          ...((newData[parent] || {}) as Record<string, any>),
          [child]: value,
        }
      } else {
        newData[field] = value
      }

      return newData as Company
    })
  }

  const handleContactPersonChange = (field: string, value: string) => {
    if (!formData || !formData.primaryContact) return
    
    setFormData((prev) => {
      if (!prev) return prev
      
      return {
        ...prev,
        primaryContact: {
          ...prev.primaryContact,
          [field]: value,
        },
      }
    })
  }

  const handleCapabilityChange = (capability: string, checked: boolean) => {
    if (!formData) return
    
    setFormData((prev) => {
      if (!prev) return prev
      
      const capabilities = prev.capabilities || {}
      
      return {
        ...prev,
        capabilities: {
          ...capabilities,
          [capability]: checked,
        },
      }
    })
  }

  const handlePrioritySupportChange = (type: string, checked: boolean) => {
    if (!formData) return
    
    setFormData((prev) => {
      if (!prev) return prev
      
      const currentTypes = prev.prioritySupportTypes || []
      
      if (checked && !currentTypes.includes(type)) {
        return {
          ...prev,
          prioritySupportTypes: [...currentTypes, type]
        }
      } else if (!checked && currentTypes.includes(type)) {
        return {
          ...prev,
          prioritySupportTypes: currentTypes.filter(t => t !== type)
        }
      }
      
      return prev
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setAttachments((prev) => [...prev, ...newFiles])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const deleteExistingAttachment = (id: string) => {
    if (!formData || !formData.attachments) return
    
    setFormData((prev) => {
      if (!prev) return prev
      
      return {
        ...prev,
        attachments: prev.attachments?.filter((att) => att.id !== id) || [],
      }
    })
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />
      case "doc":
      case "docx":
        return <FileTextIcon className="h-4 w-4 text-blue-500" />
      case "xls":
      case "xlsx":
        return <FileSpreadsheet className="h-4 w-4 text-green-500" />
      case "ppt":
      case "pptx":
        return <FilePlus className="h-4 w-4 text-orange-500" />
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FileImage className="h-4 w-4 text-purple-500" />
      default:
        return <File className="h-4 w-4 text-gray-500" />
    }
  }

  const handleSave = async () => {
    if (!formData) return
    
    try {
      // In a real app, you would upload the attachments and get URLs
      const mockAttachments = attachments.map((file, index) => ({
        id: `att-${Date.now()}-${index}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        uploadDate: new Date().toISOString(),
      }))

      const updatedCompany: Company = {
        ...formData,
        attachments: [...(formData.attachments || []), ...mockAttachments],
      }

      // Save to API
      const response = await fetch(`/api/companies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCompany)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update company')
      }
      
      setCompany(updatedCompany)
      setIsEditing(false)
      setAttachments([])
    } catch (error) {
      console.error('Error updating company:', error)
      // Show error notification
    }
  }

  const handleCancel = () => {
    setFormData(company)
    setIsEditing(false)
    setAttachments([])
  }

  // Format currency
  const formatCurrency = (value?: number) => {
    if (value === undefined) return "N/A"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const renderEditForm = () => {
    if (!formData) return null;
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {company?.logo ? (
                <AvatarImage src={company.logo || "/placeholder.svg"} alt={company.name} />
              ) : (
                <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xl">
                  {getInitials(company?.name || "")}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{company?.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge>{company?.sector}</Badge>
                <Badge variant="outline">{company?.industry}</Badge>
                <Badge variant="secondary">{company?.size}</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push('/companies')}>
              Back to Companies
            </Button>
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="mr-1 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Check className="mr-1 h-4 w-4" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="mr-1 h-4 w-4" />
                Edit Company
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Building2 className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Basic Company Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Company Name</Label>
                    {isEditing ? (
                      <SafeInput
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                    ) : (
                      <p>{company?.name}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Tax Number</Label>
                    {isEditing ? (
                      <SafeInput
                        value={formData.taxNumber || ""}
                        onChange={(e) => handleInputChange("taxNumber", e.target.value)}
                      />
                    ) : (
                      <p>{company?.taxNumber || "N/A"}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Year Founded</Label>
                    {isEditing ? (
                      <SafeInput
                        type="number"
                        value={formData.yearFounded || ""}
                        onChange={(e) => handleInputChange("yearFounded", Number.parseInt(e.target.value) || undefined)}
                      />
                    ) : (
                      <p>{company?.yearFounded || "N/A"}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Company Type</Label>
                    {isEditing ? (
                      <SafeInput
                        value={formData.companyType || ""}
                        onChange={(e) => handleInputChange("companyType", e.target.value)}
                      />
                    ) : (
                      <p>{company?.companyType || "N/A"}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    {isEditing ? (
                      <SafeInput
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    ) : (
                      <p>{company?.email || "N/A"}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Phone</Label>
                    {isEditing ? (
                      <SafeInput
                        value={formData.phone || ""}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    ) : (
                      <p>{company?.phone || "N/A"}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Website</Label>
                    {isEditing ? (
                      <SafeInput
                        value={formData.website || ""}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                      />
                    ) : (
                      <p>
                        {company?.website ? (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                          >
                            {company.website}
                            <Globe className="ml-1 h-3 w-3" />
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Address</Label>
                    {isEditing ? (
                      <SafeInput
                        value={formData.address || ""}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                      />
                    ) : (
                      <p>{company?.address || "N/A"}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Activity Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Sector</Label>
                    {isEditing ? (
                      <SafeInput
                        value={formData.sector}
                        onChange={(e) => handleInputChange("sector", e.target.value)}
                      />
                    ) : (
                      <p>{company?.sector}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Industry</Label>
                    {isEditing ? (
                      <SafeInput
                        value={formData.industry}
                        onChange={(e) => handleInputChange("industry", e.target.value)}
                      />
                    ) : (
                      <p>{company?.industry}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">NACE Code</Label>
                    {isEditing ? (
                      <SafeInput
                        value={formData.naceCode || ""}
                        onChange={(e) => handleInputChange("naceCode", e.target.value)}
                      />
                    ) : (
                      <p>{company?.naceCode || "N/A"}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Exports Status</Label>
                    {isEditing ? (
                      <div className="flex items-center h-10">
                        <Checkbox
                          id="exportsStatus"
                          checked={formData.exportsStatus}
                          onCheckedChange={(checked) => handleInputChange("exportsStatus", checked)}
                        />
                        <Label htmlFor="exportsStatus" className="ml-2">
                          Company Exports Products/Services
                        </Label>
                      </div>
                    ) : (
                      <p>{company?.exportsStatus ? "Yes" : "No"}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Contact Person Name</Label>
                    {isEditing ? (
                      <SafeInput
                        value={formData.primaryContact?.name || ""}
                        onChange={(e) => handleContactPersonChange("name", e.target.value)}
                      />
                    ) : (
                      <p>{company?.primaryContact?.name || "N/A"}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Contact Person Email</Label>
                    {isEditing ? (
                      <SafeInput
                        type="email"
                        value={formData.primaryContact?.email || ""}
                        onChange={(e) => handleContactPersonChange("email", e.target.value)}
                      />
                    ) : (
                      <p>{company?.primaryContact?.email || "N/A"}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Contact Person Phone</Label>
                    {isEditing ? (
                      <SafeInput
                        value={formData.primaryContact?.phone || ""}
                        onChange={(e) => handleContactPersonChange("phone", e.target.value)}
                      />
                    ) : (
                      <p>{company?.primaryContact?.phone || "N/A"}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <BarChart className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Financial Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Revenue</Label>
                    {isEditing ? (
                      <SafeInput
                        type="number"
                        value={formData.revenue || ""}
                        onChange={(e) => handleInputChange("revenue", Number.parseInt(e.target.value) || undefined)}
                      />
                    ) : (
                      <p>{formatCurrency(company?.revenue)}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Number of Employees</Label>
                    {isEditing ? (
                      <SafeInput
                        type="number"
                        value={formData.numberOfEmployees || ""}
                        onChange={(e) =>
                          handleInputChange("numberOfEmployees", Number.parseInt(e.target.value) || undefined)
                        }
                      />
                    ) : (
                      <p>{company?.numberOfEmployees || "N/A"}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Financial Rating</Label>
                    {isEditing ? (
                      <SafeInput
                        value={formData.financialRating || ""}
                        onChange={(e) => handleInputChange("financialRating", e.target.value)}
                      />
                    ) : (
                      <p>{company?.financialRating || "N/A"}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sustainability Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Leaf className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Sustainability Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">ESG Rating</Label>
                    {isEditing ? (
                      <SafeInput
                        value={formData.esgRating || ""}
                        onChange={(e) => handleInputChange("esgRating", e.target.value)}
                      />
                    ) : (
                      <p>{company?.esgRating || "N/A"}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Carbon Footprint</Label>
                    {isEditing ? (
                      <SafeInput
                        value={formData.carbonFootprint || ""}
                        onChange={(e) => handleInputChange("carbonFootprint", e.target.value)}
                      />
                    ) : (
                      <p>{company?.carbonFootprint || "N/A"}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Sustainability Initiatives</Label>
                    {isEditing ? (
                      <SafeInput
                        value={formData.sustainabilityInitiatives || ""}
                        onChange={(e) => handleInputChange("sustainabilityInitiatives", e.target.value)}
                      />
                    ) : (
                      <p>{company?.sustainabilityInitiatives || "N/A"}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Capabilities */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Target className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(company?.capabilities || {}).map(([capability, value]) => (
                    <div key={capability} className="flex items-center">
                      {isEditing ? (
                        <>
                          <Checkbox
                            id={capability}
                            checked={Boolean(value)}
                            onCheckedChange={(isChecked) => {
                              if (typeof isChecked === 'boolean') {
                                handleCapabilityChange(capability, isChecked);
                              }
                            }}
                          />
                          <Label htmlFor={capability} className="ml-2">
                            {capability}
                          </Label>
                        </>
                      ) : (
                        <p>
                          {capability}: {value ? "Yes" : "No"}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Priority Support Types */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Priority Support Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray(company?.prioritySupportTypes) 
                    ? company.prioritySupportTypes.map((type) => (
                        <div key={type} className="flex items-center">
                          <p>{type}</p>
                        </div>
                      ))
                    : Object.entries(company?.prioritySupportTypes || {}).map(([type, value]) => (
                        <div key={type} className="flex items-center">
                          {isEditing ? (
                            <>
                              <Checkbox
                                id={type}
                                checked={Boolean(value)}
                                onCheckedChange={(isChecked) => {
                                  if (typeof isChecked === 'boolean') {
                                    handlePrioritySupportChange(type, isChecked);
                                  }
                                }}
                              />
                              <Label htmlFor={type} className="ml-2">
                                {type}
                              </Label>
                            </>
                          ) : (
                            <p>
                              {type}: {value ? "Yes" : "No"}
                            </p>
                          )}
                        </div>
                      ))
                  }
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Attachments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* New Attachments */}
                  {isEditing && (
                    <>
                      <Label htmlFor="attachment" className="text-xs text-muted-foreground">
                        Add New Attachment
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input type="file" id="attachment" multiple onChange={handleFileChange} />
                      </div>
                      {attachments.length > 0 && (
                        <div className="space-y-2">
                          {attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center">
                                {getFileIcon(file.name)}
                                <span className="ml-2">{file.name}</span>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Existing Attachments */}
                  {company?.attachments && company.attachments.length > 0 ? (
                    <div className="space-y-2">
                      {company.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            {getFileIcon(attachment.name)}
                            <a
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 hover:underline"
                            >
                              {attachment.name}
                            </a>
                          </div>
                          {isEditing && (
                            <Button variant="ghost" size="sm" onClick={() => deleteExistingAttachment(attachment.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No attachments available.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <p className="mt-2 text-sm">
            <button 
              className="underline font-medium"
              onClick={() => router.push('/companies')}
            >
              Back to Companies
            </button>
          </p>
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Not Found: </strong>
          <span className="block sm:inline">The requested company could not be found.</span>
          <p className="mt-2 text-sm">
            <button 
              className="underline font-medium"
              onClick={() => router.push('/companies')}
            >
              Back to Companies
            </button>
          </p>
        </div>
      </div>
    )
  }

  // Render component using company data
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            {company.logo ? (
              <AvatarImage src={company.logo} alt={company.name} />
            ) : (
              <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xl">
                {getInitials(company.name)}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{company.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge>{company.sector}</Badge>
              {company.industry && <Badge variant="outline">{company.industry}</Badge>}
              <Badge variant="secondary">{company.size}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push('/companies')}>
            Back to Companies
          </Button>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-1 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Check className="mr-1 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-1 h-4 w-4" />
              Edit Company
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {renderEditForm()}
    </div>
  )
}
