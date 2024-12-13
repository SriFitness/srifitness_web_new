//root/app/admin/dashboard/page.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, ShoppingCart, TrendingUp } from 'lucide-react'

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    icon: DollarSign,
    change: "+20.1% from last month",
  },
  {
    title: "Active Users",
    value: "2,350",
    icon: Users,
    change: "+10.5% from last month",
  },
  {
    title: "Total Orders",
    value: "1,247",
    icon: ShoppingCart,
    change: "+15.3% from last month",
  },
  {
    title: "Growth Rate",
    value: "24.5%",
    icon: TrendingUp,
    change: "+5.2% from last month",
  },
]

export default function DashboardPage() {
  return (
      <div className="h-full space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
          ))}
        </div>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add your recent activity content here */}
            <p>Your recent activity will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
  )
}

