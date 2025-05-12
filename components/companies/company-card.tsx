"use client"

import { Building2, User, FileText, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Company } from "@/lib/companies-data"

interface CompanyCardProps {
  company: Company
}

export function CompanyCard({ company }: CompanyCardProps) {
  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Function to get size badge color
  const getSizeColor = (size: string) => {
    switch (size) {
      case "Small":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "Medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "Large":
        return "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300"
    }
  }

  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {company.logo ? (
                <AvatarImage src={company.logo || "/placeholder.svg"} alt={company.name} />
              ) : (
                <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {getInitials(company.name)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="font-medium">{company.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{company.sector}</Badge>
                <Badge variant="outline" className={getSizeColor(company.size)}>
                  {company.size}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              <span className="font-medium">{company.projectCount}</span>{" "}
              {company.projectCount === 1 ? "Project" : "Projects"}
            </span>
          </div>

          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            <div>
              <div>{company.contactPerson.name}</div>
              <div className="text-xs text-muted-foreground">{company.contactPerson.email}</div>
            </div>
          </div>

          {company.address && (
            <div className="flex items-center text-sm">
              <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
              <div className="text-muted-foreground text-xs">{company.address}</div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t p-3 bg-slate-50 dark:bg-slate-800/50">
        <Button variant="ghost" size="sm" className="ml-auto">
          View Details <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
