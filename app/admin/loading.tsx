import { SidebarSkeleton } from "@/features/admin/components/sidebar-skeleton"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminLoading() {
  return (
    <SidebarProvider>
      <SidebarSkeleton />
      <div className="flex-1 p-8">
        <Skeleton className="h-[200px] w-[300px]" />
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
    </SidebarProvider>
  )
}

