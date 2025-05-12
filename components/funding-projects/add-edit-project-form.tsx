"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  FileText,
  Euro,
  CheckCircle2,
  Award,
  ClipboardList,
  FileCheck,
  Target,
  Link2,
  Plus,
  Trash2,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { FundingProject } from "@/lib/funding-projects-data"

interface AddEditProjectFormProps {
  project?: FundingProject
  isEditing?: boolean
}

export function AddEditProjectForm({ project, isEditing = false }: AddEditProjectFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<FundingProject>>(
    project || {
      title: "",
      sector: "",
      deadline: "",
      fundingAmount: 0,
      description: "",
      fundingDetails: {
        totalAmount: 0,
        minGrant: 0,
        maxGrant: 0,
        coFinancing: "",
        paymentStructure: "",
      },
      eligibilityCriteria: [],
      evaluationCriteria: [],
      applicationProcess: {
        steps: [],
        timeline: "",
        submissionMethod: "",
      },
      requiredDocuments: [],
      coveredExpenses: [],
      matchCriteria: {
        targetSectors: [],
        companySize: [],
        requirements: [],
      },
      importantLinks: [],
    },
  )

  // State for form inputs that need special handling
  const [newTag, setNewTag] = useState("")
  const [newEligibilityCriteria, setNewEligibilityCriteria] = useState("")
  const [newCoveredExpense, setNewCoveredExpense] = useState("")
  const [newRequirement, setNewRequirement] = useState("")
  const [newEvaluationCriteria, setNewEvaluationCriteria] = useState({ name: "", weight: 0, description: "" })
  const [newStep, setNewStep] = useState({ name: "", description: "", deadline: "" })
  const [newDocument, setNewDocument] = useState({ name: "", description: "", required: true })
  const [newLink, setNewLink] = useState({ title: "", url: "", description: "" })
  const [newTargetSector, setNewTargetSector] = useState("")
  const [newCompanySize, setNewCompanySize] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Handle nested properties
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof typeof formData],
          [child]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = value === "" ? 0 : Number.parseFloat(value)

    // Handle nested properties
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof typeof formData],
          [child]: numValue,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: numValue,
      })
    }
  }

  // Add tag to sector
  const addTag = () => {
    if (newTag.trim() !== "") {
      setFormData({
        ...formData,
        sector: newTag,
      })
      setNewTag("")
    }
  }

  // Add eligibility criteria
  const addEligibilityCriteria = () => {
    if (newEligibilityCriteria.trim() !== "") {
      setFormData({
        ...formData,
        eligibilityCriteria: [...(formData.eligibilityCriteria || []), newEligibilityCriteria],
      })
      setNewEligibilityCriteria("")
    }
  }

  // Remove eligibility criteria
  const removeEligibilityCriteria = (index: number) => {
    setFormData({
      ...formData,
      eligibilityCriteria: (formData.eligibilityCriteria || []).filter((_, i) => i !== index),
    })
  }

  // Add covered expense
  const addCoveredExpense = () => {
    if (newCoveredExpense.trim() !== "") {
      setFormData({
        ...formData,
        coveredExpenses: [...(formData.coveredExpenses || []), newCoveredExpense],
      })
      setNewCoveredExpense("")
    }
  }

  // Remove covered expense
  const removeCoveredExpense = (index: number) => {
    setFormData({
      ...formData,
      coveredExpenses: (formData.coveredExpenses || []).filter((_, i) => i !== index),
    })
  }

  // Add requirement
  const addRequirement = () => {
    if (newRequirement.trim() !== "") {
      setFormData({
        ...formData,
        matchCriteria: {
          ...(formData.matchCriteria || { targetSectors: [], companySize: [], requirements: [] }),
          requirements: [...(formData.matchCriteria?.requirements || []), newRequirement],
        },
      })
      setNewRequirement("")
    }
  }

  // Remove requirement
  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      matchCriteria: {
        ...(formData.matchCriteria || { targetSectors: [], companySize: [], requirements: [] }),
        requirements: (formData.matchCriteria?.requirements || []).filter((_, i) => i !== index),
      },
    })
  }

  // Add evaluation criteria
  const addEvaluationCriteria = () => {
    if (newEvaluationCriteria.name.trim() !== "") {
      setFormData({
        ...formData,
        evaluationCriteria: [...(formData.evaluationCriteria || []), newEvaluationCriteria],
      })
      setNewEvaluationCriteria({ name: "", weight: 0, description: "" })
    }
  }

  // Remove evaluation criteria
  const removeEvaluationCriteria = (index: number) => {
    setFormData({
      ...formData,
      evaluationCriteria: (formData.evaluationCriteria || []).filter((_, i) => i !== index),
    })
  }

  // Add application step
  const addApplicationStep = () => {
    if (newStep.name.trim() !== "" && newStep.description.trim() !== "") {
      setFormData({
        ...formData,
        applicationProcess: {
          ...(formData.applicationProcess || { steps: [], timeline: "", submissionMethod: "" }),
          steps: [...(formData.applicationProcess?.steps || []), newStep],
        },
      })
      setNewStep({ name: "", description: "", deadline: "" })
    }
  }

  // Remove application step
  const removeApplicationStep = (index: number) => {
    setFormData({
      ...formData,
      applicationProcess: {
        ...(formData.applicationProcess || { steps: [], timeline: "", submissionMethod: "" }),
        steps: (formData.applicationProcess?.steps || []).filter((_, i) => i !== index),
      },
    })
  }

  // Add required document
  const addRequiredDocument = () => {
    if (newDocument.name.trim() !== "") {
      setFormData({
        ...formData,
        requiredDocuments: [...(formData.requiredDocuments || []), newDocument],
      })
      setNewDocument({ name: "", description: "", required: true })
    }
  }

  // Remove required document
  const removeRequiredDocument = (index: number) => {
    setFormData({
      ...formData,
      requiredDocuments: (formData.requiredDocuments || []).filter((_, i) => i !== index),
    })
  }

  // Add important link
  const addImportantLink = () => {
    if (newLink.title.trim() !== "" && newLink.url.trim() !== "") {
      setFormData({
        ...formData,
        importantLinks: [...(formData.importantLinks || []), newLink],
      })
      setNewLink({ title: "", url: "", description: "" })
    }
  }

  // Remove important link
  const removeImportantLink = (index: number) => {
    setFormData({
      ...formData,
      importantLinks: (formData.importantLinks || []).filter((_, i) => i !== index),
    })
  }

  // Add target sector
  const addTargetSector = () => {
    if (newTargetSector.trim() !== "") {
      setFormData({
        ...formData,
        matchCriteria: {
          ...(formData.matchCriteria || { targetSectors: [], companySize: [], requirements: [] }),
          targetSectors: [...(formData.matchCriteria?.targetSectors || []), newTargetSector],
        },
      })
      setNewTargetSector("")
    }
  }

  // Remove target sector
  const removeTargetSector = (index: number) => {
    setFormData({
      ...formData,
      matchCriteria: {
        ...(formData.matchCriteria || { targetSectors: [], companySize: [], requirements: [] }),
        targetSectors: (formData.matchCriteria?.targetSectors || []).filter((_, i) => i !== index),
      },
    })
  }

  // Add company size
  const addCompanySize = () => {
    if (newCompanySize.trim() !== "") {
      setFormData({
        ...formData,
        matchCriteria: {
          ...(formData.matchCriteria || { targetSectors: [], companySize: [], requirements: [] }),
          companySize: [...(formData.matchCriteria?.companySize || []), newCompanySize],
        },
      })
      setNewCompanySize("")
    }
  }

  // Remove company size
  const removeCompanySize = (index: number) => {
    setFormData({
      ...formData,
      matchCriteria: {
        ...(formData.matchCriteria || { targetSectors: [], companySize: [], requirements: [] }),
        companySize: (formData.matchCriteria?.companySize || []).filter((_, i) => i !== index),
      },
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would call an API to save the project
    console.log("Form data:", formData)

    // Navigate back to the projects list
    router.push("/funding-projects")
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-16">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-2xl font-bold">{isEditing ? "Edit Funding Project" : "Add New Funding Project"}</h1>
        <div className="w-[100px]"></div> {/* Spacer for centering */}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-4 md:grid-cols-8 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="funding">Funding Details</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
            <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="match">Match Criteria</TabsTrigger>
            <TabsTrigger value="process">Process & Links</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="title">Project Title</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
                  </div>

                  <div>
                    <Label htmlFor="sector">Sector / Category</Label>
                    <div className="flex gap-2">
                      <Input
                        id="newTag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add sector or category"
                      />
                      <Button type="button" onClick={addTag} size="sm">
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                    {formData.sector && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className="flex items-center gap-1">{formData.sector}</Badge>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input
                      id="deadline"
                      name="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="fundingAmount">Total Funding Amount</Label>
                    <Input
                      id="fundingAmount"
                      name="fundingAmount"
                      type="number"
                      value={formData.fundingAmount || ""}
                      onChange={handleNumberInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fundingDetails.minGrant">Minimum Grant</Label>
                      <Input
                        id="fundingDetails.minGrant"
                        name="fundingDetails.minGrant"
                        type="number"
                        value={formData.fundingDetails?.minGrant || ""}
                        onChange={handleNumberInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fundingDetails.maxGrant">Maximum Grant</Label>
                      <Input
                        id="fundingDetails.maxGrant"
                        name="fundingDetails.maxGrant"
                        type="number"
                        value={formData.fundingDetails?.maxGrant || ""}
                        onChange={handleNumberInputChange}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Description Tab */}
          <TabsContent value="description" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Project Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="min-h-[200px]"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Funding Details Tab */}
          <TabsContent value="funding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Euro className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Funding Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fundingDetails.totalAmount">Total Amount</Label>
                  <Input
                    id="fundingDetails.totalAmount"
                    name="fundingDetails.totalAmount"
                    type="number"
                    value={formData.fundingDetails?.totalAmount || ""}
                    onChange={handleNumberInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="fundingDetails.coFinancing">Co-Financing Requirement</Label>
                  <Input
                    id="fundingDetails.coFinancing"
                    name="fundingDetails.coFinancing"
                    value={formData.fundingDetails?.coFinancing || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="fundingDetails.paymentStructure">Payment Structure</Label>
                  <Input
                    id="fundingDetails.paymentStructure"
                    name="fundingDetails.paymentStructure"
                    value={formData.fundingDetails?.paymentStructure || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Covered Expenses</Label>
                  <div className="flex gap-2">
                    <Input
                      id="newCoveredExpense"
                      value={newCoveredExpense}
                      onChange={(e) => setNewCoveredExpense(e.target.value)}
                      placeholder="Add covered expense"
                    />
                    <Button type="button" onClick={addCoveredExpense} size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.coveredExpenses?.map((expense, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {expense}
                        <button
                          type="button"
                          className="ml-1 hover:text-destructive"
                          onClick={() => removeCoveredExpense(index)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Eligibility Tab */}
          <TabsContent value="eligibility" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Eligibility Criteria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    id="newEligibilityCriteria"
                    value={newEligibilityCriteria}
                    onChange={(e) => setNewEligibilityCriteria(e.target.value)}
                    placeholder="Add eligibility criteria"
                  />
                  <Button type="button" onClick={addEligibilityCriteria} size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>

                <div className="space-y-2">
                  {formData.eligibilityCriteria?.map((criteria, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <span>{criteria}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeEligibilityCriteria(index)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Evaluation Tab */}
          <TabsContent value="evaluation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Award className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Evaluation Criteria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="newEvaluationName">Criteria Name</Label>
                    <Input
                      id="newEvaluationName"
                      value={newEvaluationCriteria.name}
                      onChange={(e) => setNewEvaluationCriteria({ ...newEvaluationCriteria, name: e.target.value })}
                      placeholder="e.g., Innovation Level"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newEvaluationWeight">Weight (%)</Label>
                    <Input
                      id="newEvaluationWeight"
                      type="number"
                      min="0"
                      max="100"
                      value={newEvaluationCriteria.weight || ""}
                      onChange={(e) =>
                        setNewEvaluationCriteria({
                          ...newEvaluationCriteria,
                          weight: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="newEvaluationDescription">Description (Optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="newEvaluationDescription"
                        value={newEvaluationCriteria.description}
                        onChange={(e) =>
                          setNewEvaluationCriteria({ ...newEvaluationCriteria, description: e.target.value })
                        }
                      />
                      <Button type="button" onClick={addEvaluationCriteria} size="sm">
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mt-4">
                  {formData.evaluationCriteria?.map((criteria, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{criteria.name}</div>
                        <div className="flex items-center gap-2">
                          <Badge>{criteria.weight}%</Badge>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEvaluationCriteria(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      {criteria.description && <p className="text-sm text-muted-foreground">{criteria.description}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Required Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="newDocumentName">Document Name</Label>
                    <Input
                      id="newDocumentName"
                      value={newDocument.name}
                      onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                      placeholder="e.g., Technical Description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newDocumentDescription">Description</Label>
                    <Input
                      id="newDocumentDescription"
                      value={newDocument.description}
                      onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newDocumentRequired"
                    checked={newDocument.required}
                    onCheckedChange={(checked) => setNewDocument({ ...newDocument, required: checked === true })}
                  />
                  <Label htmlFor="newDocumentRequired">Required Document</Label>
                </div>

                <Button type="button" onClick={addRequiredDocument} size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Add Document
                </Button>

                <div className="space-y-4 mt-4">
                  {formData.requiredDocuments?.map((doc, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium flex items-center">
                          {doc.name}
                          {doc.required && (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                            >
                              Required
                            </Badge>
                          )}
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeRequiredDocument(index)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      {doc.description && <p className="text-sm text-muted-foreground">{doc.description}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Match Criteria Tab */}
          <TabsContent value="match" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Match Criteria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Target Sectors */}
                <div className="space-y-2">
                  <Label>Target Sectors</Label>
                  <div className="flex gap-2">
                    <Input
                      id="newTargetSector"
                      value={newTargetSector}
                      onChange={(e) => setNewTargetSector(e.target.value)}
                      placeholder="Add target sector"
                    />
                    <Button type="button" onClick={addTargetSector} size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.matchCriteria?.targetSectors?.map((sector, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {sector}
                        <button
                          type="button"
                          className="ml-1 hover:text-destructive"
                          onClick={() => removeTargetSector(index)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Company Size */}
                <div className="space-y-2">
                  <Label>Company Size</Label>
                  <div className="flex gap-2">
                    <Input
                      id="newCompanySize"
                      value={newCompanySize}
                      onChange={(e) => setNewCompanySize(e.target.value)}
                      placeholder="e.g., SME, Large Enterprise"
                    />
                    <Button type="button" onClick={addCompanySize} size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.matchCriteria?.companySize?.map((size, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {size}
                        <button
                          type="button"
                          className="ml-1 hover:text-destructive"
                          onClick={() => removeCompanySize(index)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <Label>Requirements</Label>
                  <div className="flex gap-2">
                    <Input
                      id="newRequirement"
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      placeholder="Add requirement"
                    />
                    <Button type="button" onClick={addRequirement} size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {formData.matchCriteria?.requirements?.map((req, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                        <span>{req}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeRequirement(index)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Process & Links Tab */}
          <TabsContent value="process" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <ClipboardList className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Application Process
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="newStepName">Step Name</Label>
                    <Input
                      id="newStepName"
                      value={newStep.name}
                      onChange={(e) => setNewStep({ ...newStep, name: e.target.value })}
                      placeholder="e.g., Expression of Interest"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newStepDescription">Description</Label>
                    <Input
                      id="newStepDescription"
                      value={newStep.description}
                      onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newStepDeadline">Deadline (Optional)</Label>
                    <Input
                      id="newStepDeadline"
                      type="date"
                      value={newStep.deadline}
                      onChange={(e) => setNewStep({ ...newStep, deadline: e.target.value })}
                    />
                  </div>
                </div>

                <Button type="button" onClick={addApplicationStep} size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Add Step
                </Button>

                <div className="space-y-4 mt-4">
                  {formData.applicationProcess?.steps?.map((step, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{step.name}</div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeApplicationStep(index)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <p className="text-sm">{step.description}</p>
                      {step.deadline && (
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Deadline: {step.deadline}</div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="applicationProcess.timeline">Timeline</Label>
                    <Input
                      id="applicationProcess.timeline"
                      name="applicationProcess.timeline"
                      value={formData.applicationProcess?.timeline || ""}
                      onChange={handleInputChange}
                      placeholder="e.g., Total evaluation period: 3-4 months"
                    />
                  </div>
                  <div>
                    <Label htmlFor="applicationProcess.submissionMethod">Submission Method</Label>
                    <Input
                      id="applicationProcess.submissionMethod"
                      name="applicationProcess.submissionMethod"
                      value={formData.applicationProcess?.submissionMethod || ""}
                      onChange={handleInputChange}
                      placeholder="e.g., Online submission through portal"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Link2 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Important Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="newLinkTitle">Link Title</Label>
                    <Input
                      id="newLinkTitle"
                      value={newLink.title}
                      onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                      placeholder="e.g., Official Website"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newLinkUrl">URL</Label>
                    <Input
                      id="newLinkUrl"
                      value={newLink.url}
                      onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="newLinkDescription">Description</Label>
                    <div className="flex gap-2">
                      <Input
                        id="newLinkDescription"
                        value={newLink.description}
                        onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                      />
                      <Button type="button" onClick={addImportantLink} size="sm">
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mt-4">
                  {formData.importantLinks?.map((link, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-1">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          {link.title}
                        </a>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeImportantLink(index)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                      <div className="text-xs text-muted-foreground mt-1 truncate">{link.url}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Update Project" : "Create Project"}</Button>
        </div>
      </form>
    </div>
  )
}
