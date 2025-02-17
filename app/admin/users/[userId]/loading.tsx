import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="w-64 h-10 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Skeleton className="w-full h-64" />
          </div>
          <div className="md:col-span-2 space-y-8">
            <Skeleton className="w-full h-96" />
            <Skeleton className="w-full h-96" />
          </div>
        </div>
      </div>
    )
  }
  