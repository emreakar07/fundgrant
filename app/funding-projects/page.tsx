"use client"

import { useState, useEffect } from "react"
import { FundingProjectsHeader } from "@/components/funding-projects/funding-projects-header"
import { FundingProjectsTable } from "@/components/funding-projects/funding-projects-table"
import type { FundingProject } from "@/lib/funding-projects-data"

export default function FundingProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [projects, setProjects] = useState<FundingProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        console.log('Fetching projects from API...')
        
        const response = await fetch('/api/funding-projects', {
          // Add cache: 'no-store' to prevent caching issues
          cache: 'no-store',
          // Include credentials if needed
          credentials: 'same-origin'
        })
        
        console.log('API response status:', response.status)
        
        if (!response.ok) {
          // Try to get detailed error information
          const errorData = await response.json().catch(() => ({}))
          console.error('API error details:', errorData)
          
          throw new Error(`Failed to fetch funding projects: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log(`Received ${data.length} projects from API`)
        setProjects(data)
      } catch (err) {
        console.error('Error fetching funding projects:', err)
        setError(err instanceof Error ? err.message : 'Failed to load funding projects. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Filter projects based on search query
  const filteredProjects = projects.filter((project) => {
    // Search filter
    return (
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.sector.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="flex flex-col min-h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <FundingProjectsHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="container mx-auto px-4 py-6 pb-16">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
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
          <FundingProjectsTable projects={filteredProjects} />
        )}
      </div>
    </div>
  )
}
