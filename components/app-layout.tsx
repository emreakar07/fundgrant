"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Search,
  FileText,
  Building2,
  FolderArchive,
  ClipboardList,
  FileQuestion,
  Layers,
  PenTool,
  Sparkles,
  Users,
  CreditCard,
  Sliders,
  LogOut,
  ChevronRight,
  SearchCode,
  Clock,
  CheckCircle2,
  Send,
} from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeProvider } from "@/components/theme-provider"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()

  // Function to determine if a route is active
  const isActive = (route: string) => {
    if (route === "/" && pathname === "/") return true
    if (route !== "/" && pathname.startsWith(route)) return true
    return false
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <TooltipProvider>
        <SidebarProvider>
          <div className="flex h-screen">
            <Sidebar variant="sidebar" collapsible="icon">
              <SidebarHeader className="flex flex-col items-center justify-center py-4">
                <div className="flex items-center justify-center w-full">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-semibold">
                      FG
                    </div>
                    <span className="font-semibold text-lg">FundGrant</span>
                  </div>
                </div>
              </SidebarHeader>

              <SidebarContent>
                {/* Main Group */}
                <SidebarGroup>
                  <SidebarGroupLabel>Main</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive("/dashboard")}
                          tooltip="Overview of your projects and activities"
                        >
                          <Link href="/dashboard">
                            <LayoutDashboard />
                            <span>Dashboard</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive("/search")} tooltip="Search across all content">
                          <Link href="/search">
                            <Search />
                            <span>Search</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                {/* Data Management Group */}
                <SidebarGroup>
                  <SidebarGroupLabel>Data Management</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive("/funding-projects")}
                          tooltip="Manage funding opportunities"
                        >
                          <Link href="/funding-projects">
                            <FileText />
                            <span>Funding Projects</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive("/companies")} tooltip="Manage client companies">
                          <Link href="/companies">
                            <Building2 />
                            <span>Companies</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive("/documents")}
                          tooltip="Access all documents and templates"
                        >
                          <Link href="/documents">
                            <FolderArchive />
                            <span>Documents</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                {/* Project Preparation Group */}
                <SidebarGroup>
                  <SidebarGroupLabel>Project Preparation</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive("/analyses")}
                          tooltip="Analyze project requirements"
                        >
                          <Link href="/analyses">
                            <ClipboardList />
                            <span>Analysis</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive("/analysis-questions")}
                          tooltip="Manage analysis question templates"
                        >
                          <Link href="/analysis-questions">
                            <FileQuestion />
                            <span>Analysis Questions</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive("/document-sections")}
                          tooltip="Configure document section templates"
                        >
                          <Link href="/document-sections">
                            <Layers />
                            <span>Document Sections</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                {/* Project Tracking Group - UPDATED */}
                <SidebarGroup>
                  <SidebarGroupLabel>Project Tracking</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive("/in-review-projects")}
                          tooltip="Projects awaiting review by Company Admin"
                        >
                          <Link href="/in-review-projects">
                            <Clock />
                            <span>In Review Projects</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive("/approved-for-submission")}
                          tooltip="Projects approved but not yet submitted"
                        >
                          <Link href="/approved-for-submission">
                            <CheckCircle2 />
                            <span>Approved for Submission</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive("/submitted-projects")}
                          tooltip="Track submitted project applications"
                        >
                          <Link href="/submitted-projects">
                            <Send />
                            <span>Submitted Projects</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                {/* AI Modules Group */}
                <SidebarGroup>
                  <SidebarGroupLabel>AI Modules</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive("/")} tooltip="AI-assisted application writing">
                          <Link href="/">
                            <PenTool />
                            <span>Project Writing</span>
                            {isActive("/") && (
                              <div className="ml-auto bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs px-1.5 py-0.5 rounded">
                                Active
                              </div>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive("/fundai-matching")}
                          tooltip="AI-powered funding opportunity matching"
                        >
                          <Link href="/fundai-matching">
                            <Sparkles />
                            <span>FundAI Matching</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive("/deep-search")}
                          tooltip="AI-powered deep search across documents"
                        >
                          <Link href="/deep-search">
                            <SearchCode />
                            <span>DeepSearch</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                {/* Settings Group */}
                <SidebarGroup>
                  <SidebarGroupLabel>Settings</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive("/team-roles")}
                          tooltip="Manage team members and permissions"
                        >
                          <Link href="/team-roles">
                            <Users />
                            <span>Team & Roles</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive("/billing")}
                          tooltip="Manage subscription and billing"
                        >
                          <Link href="/billing">
                            <CreditCard />
                            <span>Billing / Plan</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive("/ai-preferences")}
                          tooltip="Configure AI behavior and preferences"
                        >
                          <Link href="/ai-preferences">
                            <Sliders />
                            <span>AI Preferences</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>

              <SidebarFooter>
                <div className="p-2">
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Account settings">
                        <Link href="/account" className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src="/abstract-user-icon.png" />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col items-start">
                            <span className="text-sm">John Doe</span>
                            <span className="text-xs text-muted-foreground">Admin</span>
                          </div>
                          <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Sign out">
                        <button>
                          <LogOut />
                          <span>Sign out</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </div>
              </SidebarFooter>
            </Sidebar>

            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
