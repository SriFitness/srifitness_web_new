// root/features/admin/components/dashboard-header.tsx

"use client"

import { Bell, User, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/features/admin/components/mode-toggle"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { DashboardSidebar } from "@/features/admin/components/dashboard-sidebar"

export function DashboardHeader() {
    const { state } = useSidebar()

    return (
        <header className="flex items-center justify-between h-16 px-4 border-b md:px-6 w-full">
            <div className="flex items-center gap-4">
                <Sheet>
                    {/* <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger> */}
                    <SheetContent side="left" className="p-0 w-[270px]">
                        <DashboardSidebar />
                    </SheetContent>
                </Sheet>
                <SidebarTrigger className="hidden md:flex" />
                <h2 className={`text-lg font-semibold transition-all duration-300 ease-in-out ${state === "collapsed" ? "md:ml-14" : ""}`}>Dashboard</h2>
            </div>
            <div className="flex items-center gap-4">
                <ModeToggle />
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                </Button>
            </div>
        </header>
    )
}

