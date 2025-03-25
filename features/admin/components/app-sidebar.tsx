"use client"

//root/features/admin/components/app-sidebar.tsx



import * as React from "react"
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Users,
  LayoutDashboard,
  UserPlus,
  Dumbbell,
  CreditCard,
  Store,
  Radio,
  QrCode,
} from "lucide-react"

import { NavMain } from "@/features/admin/components/nav-main"
import { NavProjects } from "@/features/admin/components/nav-projects"
import { NavUser } from "@/features/admin/components/nav-user"
import { TeamSwitcher } from "@/features/admin/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { useAuth } from "@/components/providers/auth-provider"
import { title } from "process"

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "History",
          url: "/admin/dashboard",
        },
      ],
    },
    {
      title: "Register",
      url: "#",
      icon: UserPlus,
      items: [
        {
          title: "Customers",
          url: "/admin/register/customers",
        },
        {
          title: "Employees",
          url: "/admin/register/employees",
        },
      ],
    },
    {
      title: "Workout",
      url: "/admin/workout",
      icon: Dumbbell,
      items: [
        {
          title: "Add new workouts",
          url: "/admin/workout/create",
        },
        {
          title: "Get Started",
          url: "/admin/workout/get-started",
        },
      ],
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
      items: [
        {
          title: "General",
          url: "/admin/users",
        },
      ],
    },
    {
      title: "Payments",
      url: "/admin/payments",
      icon: CreditCard,
      items: [
        {
          title: "General",
          url: "/admin/payments",
        },
      ],
    },
    {
      title: "Marketplace",
      url: "/admin/marketplace",
      icon: Store,
      items: [
        {
          title: "Dashboard",
          url: "/admin/marketplace",
        }, {
          title: "Products",
          url: "/admin/marketplace/products"
        }
      ],
    },
    {
      title: "Indoor",
      url: "/admin/indoor",
      icon: Radio,
      items: [
        {
          title: "Dashboard",
          url: "/admin/indoor",
        },
        {
          title: "Details",
          url: "/admin/indoor/details",
        },
      ],
    },
    {
      title: "Attendance",
      url: "/admin/attendance",
      icon: QrCode,
      items: [
        {
          title: "QR",
          url: "/admin/users/attendance",
        },
      ],
    }
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const auth = useAuth();


  let user = {
    name: "shadcn",
    email: "dummy",
    avatar: "/avatars/shadcn.jpg",
  }

  if (auth) {
    if (auth.currentUser) {
      if (auth.currentUser.email) {
        user.email = auth.currentUser.email;
      }
    }
  }


  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
