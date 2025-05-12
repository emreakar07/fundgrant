"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X } from "lucide-react"

export function RolesPermissionsGuide() {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="border rounded-lg">
      <Accordion
        type="single"
        collapsible
        defaultValue={expanded ? "roles" : undefined}
        onValueChange={(value) => setExpanded(!!value)}
      >
        <AccordionItem value="roles">
          <AccordionTrigger className="px-4">
            <h3 className="text-lg font-medium">Roles & Permissions Guide</h3>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Below is a detailed breakdown of the permissions and capabilities for each role in the system.
              </p>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Permission / Capability</TableHead>
                      <TableHead className="text-center">Company Admin</TableHead>
                      <TableHead className="text-center">Team Member</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">View and write project applications</TableCell>
                      <TableCell className="text-center">
                        <Check className="h-5 w-5 mx-auto text-green-600" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Check className="h-5 w-5 mx-auto text-green-600" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Analyze companies/projects</TableCell>
                      <TableCell className="text-center">
                        <Check className="h-5 w-5 mx-auto text-green-600" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Check className="h-5 w-5 mx-auto text-green-600" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Initiate project writing</TableCell>
                      <TableCell className="text-center">
                        <Check className="h-5 w-5 mx-auto text-green-600" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Check className="h-5 w-5 mx-auto text-green-600" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Manage users and assign roles</TableCell>
                      <TableCell className="text-center">
                        <Check className="h-5 w-5 mx-auto text-green-600" />
                      </TableCell>
                      <TableCell className="text-center">
                        <X className="h-5 w-5 mx-auto text-red-600" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Approve and submit completed projects</TableCell>
                      <TableCell className="text-center">
                        <Check className="h-5 w-5 mx-auto text-green-600" />
                      </TableCell>
                      <TableCell className="text-center">
                        <X className="h-5 w-5 mx-auto text-red-600" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Update submission outcomes</TableCell>
                      <TableCell className="text-center">
                        <Check className="h-5 w-5 mx-auto text-green-600" />
                      </TableCell>
                      <TableCell className="text-center">
                        <X className="h-5 w-5 mx-auto text-red-600" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
                <h4 className="font-medium mb-2">Additional Notes:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>
                    Company assignment is optional. If unassigned, users can still view eligible companies based on
                    their own initiative (e.g., analysis or matching).
                  </li>
                  <li>Projects are tracked and credited based on the Team Member who completes them.</li>
                  <li>Company Admins have full platform access and can manage all aspects of the system.</li>
                  <li>
                    Team Members focus on content creation and analysis but cannot perform administrative functions.
                  </li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
