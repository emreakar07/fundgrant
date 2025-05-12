"use client"

import { ArrowRight, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Company {
  id: string
  name: string
  sector: string
  contactPerson: {
    name: string
    email: string
  }
  projectCount: number
  logo?: string
}

interface RecentCompaniesProps {
  companies: Company[]
}

export function RecentCompanies({ companies }: RecentCompaniesProps) {
  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Card className="border shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Recent Companies</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {companies.map((company) => (
            <div key={company.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="h-8 w-8">
                  {company.logo ? (
                    <AvatarImage src={company.logo || "/placeholder.svg"} alt={company.name} />
                  ) : (
                    <AvatarFallback>{getInitials(company.name)}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="font-medium">{company.name}</h3>
                  <p className="text-xs text-muted-foreground">{company.sector}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-muted-foreground">
                  <User className="h-3.5 w-3.5 mr-1.5" />
                  <span>{company.contactPerson.name}</span>
                </div>

                <Badge variant="outline" className="text-xs">
                  {company.projectCount} {company.projectCount === 1 ? "project" : "projects"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <Button variant="ghost" size="sm" className="ml-auto text-xs">
          View All Companies <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
