//root/app/admin/layout.tsx

import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/features/admin/components/dashboard-sidebar"
import { DashboardHeader } from "@/features/admin/components/dashboard-header"

export default function DashboardLayout({
                                            children,
                                        }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden bg-background">
                <DashboardSidebar />
                <div className="flex flex-col flex-1 w-full">
                    <DashboardHeader />
                    <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}

