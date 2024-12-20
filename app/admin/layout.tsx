// //root/app/admin/layout.tsx

// import { SidebarProvider } from "@/components/ui/sidebar"
// import { DashboardSidebar } from "@/features/admin/components/dashboard-sidebar"
// import { DashboardHeader } from "@/features/admin/components/dashboard-header"

// export default async function DashboardLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <SidebarProvider>
//       <div className="flex h-screen w-full overflow-hidden bg-background">
//         <DashboardSidebar />
//         <div className="flex flex-col flex-1 w-full">
//           <DashboardHeader />
//           <main className="flex-1 overflow-y-auto p-4 md:p-6">
//             {children}
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   )
// }

//root/app/admin/layout.tsx

import { AppSidebar } from "@/features/admin/components2/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { DynamicBreadcrumb } from "@/features/admin/components2/dynamic-breadcrumb"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumb />
          </div>
        </header>
        <div className="flex flex-col flex-1 w-full">
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

