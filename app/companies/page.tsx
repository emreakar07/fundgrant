"use client"

import { useState, useEffect } from "react"
import { Suspense } from "react"
import { CompaniesHeader } from "@/components/companies/companies-header"
import { CompaniesTable } from "@/components/companies/companies-table"
import type { Company } from "@/lib/companies-data"

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sectorFilter, setSectorFilter] = useState<string | null>(null)
  const [industryFilter, setIndustryFilter] = useState<string | null>(null)
  const [sizeFilter, setSizeFilter] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch companies data from API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/companies', {
          cache: 'no-store',
          credentials: 'same-origin'
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch companies: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        setCompanies(data)
      } catch (err) {
        console.error('Error fetching companies:', err)
        setError(err instanceof Error ? err.message : 'Failed to load companies. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  // Extract unique sectors, industries, and sizes
  const sectors = Array.from(new Set(companies.map(company => company.sector))).filter(Boolean) as string[]
  const industries = Array.from(new Set(companies.map(company => company.industry))).filter(Boolean) as string[]
  const sizes = Array.from(new Set(companies.map(company => company.size))).filter(Boolean) as string[]

  // Function to handle adding a new company
  const handleAddCompany = () => {
    // You can implement company adding functionality here
    console.log("Add company clicked")
  }

  return (
    <div className="flex flex-col w-full h-full">
      <CompaniesHeader 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sectorFilter={sectorFilter}
        onSectorFilterChange={setSectorFilter}
        industryFilter={industryFilter}
        onIndustryFilterChange={setIndustryFilter}
        sizeFilter={sizeFilter}
        onSizeFilterChange={setSizeFilter}
        sectors={sectors}
        industries={industries}
        sizes={sizes}
        onAddCompany={handleAddCompany}
      />
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <p className="mt-2 text-sm">
            <button 
              className="underline font-medium"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </p>
        </div>
      ) : (
        <CompaniesTable 
          companies={companies}
          searchQuery={searchQuery}
          sectorFilter={sectorFilter}
          industryFilter={industryFilter}
          sizeFilter={sizeFilter}
        />
      )}
    </div>
  )
}
