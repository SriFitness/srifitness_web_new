//root/app/admin/dashboard/loading.tsx

import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-[200px]" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[100px]" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="h-[300px] col-span-4" />
        <Skeleton className="h-[300px] col-span-3" />
      </div>
      <Skeleton className="h-[400px]" />
    </div>
  )
}

