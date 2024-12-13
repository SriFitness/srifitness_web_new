"use client"

import { Users, LayoutDashboard, UserPlus, Dumbbell, CreditCard, Store, Radio, LogOut, User } from 'lucide-react'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from 'next/link'
import { useAuth } from '@/components/auth-provider'

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    { icon: UserPlus, label: "Register", href: "/admin/register" },
    { icon: Dumbbell, label: "Workout", href: "/admin/workout" },
    { icon: Users, label: "Users", href: "/admin/users" },
    { icon: CreditCard, label: "Payments", href: "/admin/payments" },
    { icon: Store, label: "Marketplace", href: "/admin/marketplace" },
    { icon: Radio, label: "Indoor", href: "/admin/indoor" },
]



export function DashboardSidebar() {

    const auth = useAuth();

    const loginEmail = () => {
        auth?.loginEmail()
            .then(() => {
                console.log("logged in!");
            })
            .catch(() => {
                console.log("Something went wrong");
            })
    };

    const logout = () => {
        auth?.loginEmail()
            .then(() => {
                console.log("logged out!");
            })
            .catch(() => {
                console.log("Something went wrong");
            })
    };

    return (
        <Sidebar collapsible="icon" className="hidden md:flex h-screen flex-shrink-0">
            <SidebarHeader className="flex items-center justify-center h-16 px-4">
                <h1 className="text-2xl font-bold group-data-[collapsible=icon]:hidden">Admin</h1>
                <span className="text-2xl font-bold hidden group-data-[collapsible=icon]:block">A</span>
            </SidebarHeader>
            <SidebarContent className="flex-1">
                <SidebarGroup>
                    <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden px-4">Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <SidebarMenuButton asChild>
                                                    <Link href={item.href} className="flex items-center gap-3 px-4 py-2">
                                                        <item.icon className="h-5 w-5 flex-shrink-0" />
                                                        <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="group-data-[state=expanded]:hidden">
                                                {item.label}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <SidebarMenuButton asChild>
                                        <div className="flex items-center gap-3 px-4 py-2 w-full">
                                            <User className="h-5 w-5 flex-shrink-0" />
                                            <span className="group-data-[collapsible=icon]:hidden text-sm truncate">
                                                {auth?.currentUser?.displayName}
                                            </span>
                                        </div>
                                    </SidebarMenuButton>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="group-data-[state=expanded]:hidden">
                                    {auth?.currentUser?.displayName}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <SidebarMenuButton asChild>
                                        <button onClick={() => console.log('Logout clicked')} className="flex items-center gap-3 px-4 py-2 w-full">
                                            <LogOut className="h-5 w-5 flex-shrink-0" />
                                            <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                                        </button>
                                    </SidebarMenuButton>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="group-data-[state=expanded]:hidden">
                                    Logout
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

