export default function Loading() {
  return (
    <div className="flex flex-col w-full h-full p-8 space-y-4">
      <div className="h-12 w-1/3 bg-gray-200 animate-pulse rounded-md"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-4">
            <div className="h-6 w-1/3 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-5 bg-gray-200 animate-pulse rounded-md"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
