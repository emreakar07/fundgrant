"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { RecentProjects } from "@/components/dashboard/recent-projects"
import { RecentCompanies } from "@/components/dashboard/recent-companies"
import { RecentSubmissions } from "@/components/dashboard/recent-submissions"
import { ProjectsAwaiting } from "@/components/dashboard/projects-awaiting"
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines"
import { dashboardData } from "@/lib/dashboard-data"

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <DashboardHeader />

      <div className="container mx-auto px-4 py-6 pb-16">
        {/* KPI Cards - 8 cards in 4 columns on large screens */}
        <KpiCards
          totalProjects={dashboardData.kpis.totalProjects}
          totalCompanies={dashboardData.kpis.totalCompanies}
          successRate={dashboardData.kpis.successRate}
          totalAnalyses={dashboardData.kpis.totalAnalyses}
          totalApplicationsSubmitted={dashboardData.kpis.totalApplicationsSubmitted}
          activeApplications={dashboardData.kpis.activeApplications}
          completedProjects={dashboardData.kpis.completedProjects}
          upcomingDeadlines={dashboardData.kpis.upcomingDeadlines}
        />

        {/* First Row - 3 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Recently Submitted Applications */}
          <div className="lg:col-span-1">
            <RecentSubmissions submissions={dashboardData.recentSubmissions} />
          </div>

          {/* Projects Awaiting Action */}
          <div className="lg:col-span-1">
            <ProjectsAwaiting projects={dashboardData.projectsAwaitingAction} />
          </div>

          {/* Upcoming Deadlines */}
          <div className="lg:col-span-1">
            <UpcomingDeadlines deadlines={dashboardData.upcomingDeadlines} />
          </div>
        </div>

        {/* Second Row - 2 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Recent Projects */}
          <RecentProjects projects={dashboardData.recentProjects} />

          {/* Recent Companies */}
          <RecentCompanies companies={dashboardData.recentCompanies} />
        </div>
      </div>
    </div>
  )
}
