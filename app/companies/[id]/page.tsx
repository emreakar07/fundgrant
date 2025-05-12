import { Suspense } from "react"
import { CompanyDetailView } from "@/components/companies/company-detail-view"

export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col w-full h-full">
      <Suspense fallback={<div className="p-8">Loading company details...</div>}>
        <CompanyDetailView id={params.id} />
      </Suspense>
    </div>
  )
}
