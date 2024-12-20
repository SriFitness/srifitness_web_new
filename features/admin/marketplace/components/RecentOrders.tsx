import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const recentOrders = [
  {
    id: "1",
    customer: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "$1,999.00",
    status: "Shipped",
  },
  {
    id: "2",
    customer: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "$39.00",
    status: "Pending",
  },
  {
    id: "3",
    customer: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "$299.00",
    status: "Processing",
  },
  {
    id: "4",
    customer: "William Kim",
    email: "will@email.com",
    amount: "$99.00",
    status: "Delivered",
  },
  {
    id: "5",
    customer: "Sofia Davis",
    email: "sofia.davis@email.com",
    amount: "$39.00",
    status: "Shipped",
  },
]

export function RecentOrders() {
  return (
    <div className="space-y-8">
      {recentOrders.map((order) => (
        <div key={order.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://avatar.vercel.sh/${order.email}`} alt={order.customer} />
            <AvatarFallback>{order.customer.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{order.customer}</p>
            <p className="text-sm text-muted-foreground">{order.email}</p>
          </div>
          <div className="ml-auto font-medium">
            {order.amount}
            <span className={`ml-2 text-xs ${getStatusColor(order.status)}`}>{order.status}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function getStatusColor(status: string) {
  switch (status) {
    case "Shipped":
      return "text-green-500"
    case "Processing":
      return "text-yellow-500"
    case "Pending":
      return "text-orange-500"
    case "Delivered":
      return "text-blue-500"
    default:
      return "text-gray-500"
  }
}

