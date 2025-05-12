"use client"

import { useState, useEffect } from "react"
import type { Company } from "@/lib/companies-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface CompaniesTableProps {
  companies: Company[]
  searchQuery: string
  sectorFilter: string | null
  industryFilter: string | null
  sizeFilter: string | null
}

export function CompaniesTable({ 
  companies, 
  searchQuery, 
  sectorFilter, 
  industryFilter, 
  sizeFilter 
}: CompaniesTableProps) {
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter companies based on search and filter criteria
  useEffect(() => {
    let result = [...companies]

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (company) =>
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (company.industry && company.industry.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (company.location && company.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (company.primaryContact && company.primaryContact.name && 
           company.primaryContact.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (company.primaryContact && company.primaryContact.email && 
           company.primaryContact.email.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Apply sector filter
    if (sectorFilter) {
      result = result.filter((company) => company.sector === sectorFilter)
    }

    // Apply industry filter
    if (industryFilter) {
      result = result.filter((company) => company.industry === industryFilter)
    }

    // Apply size filter
    if (sizeFilter) {
      result = result.filter((company) => company.size === sizeFilter)
    }

    setFilteredCompanies(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchQuery, sectorFilter, industryFilter, sizeFilter, companies])

  // Calculate pagination
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + itemsPerPage)

  // Get company size badge color
  const getSizeBadgeColor = (size: string) => {
    switch (size) {
      case "Small":
        return "bg-blue-100 text-blue-800"
      case "Medium":
        return "bg-purple-100 text-purple-800"
      case "Large":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get company initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (companies.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No companies found.</p>
          <Link href="/companies/add">
            <Button>Add your first company</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead>Primary Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCompanies.length > 0 ? (
              paginatedCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={company.logo || "/placeholder.svg"} alt={company.name} />
                        <AvatarFallback>{getInitials(company.name)}</AvatarFallback>
                      </Avatar>
                      <span>{company.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{company.sector}</TableCell>
                  <TableCell>{company.industry || "-"}</TableCell>
                  <TableCell>
                    <Badge className={getSizeBadgeColor(company.size)}>{company.size}</Badge>
                  </TableCell>
                  <TableCell>{company.projectCount || 0}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{company.primaryContact?.name || "-"}</span>
                      <span className="text-xs text-gray-500">{company.primaryContact?.email || ""}</span>
                    </div>
                  </TableCell>
                  <TableCell>{company.location || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/companies/${company.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No companies found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCompanies.length)} of{" "}
            {filteredCompanies.length} companies
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
