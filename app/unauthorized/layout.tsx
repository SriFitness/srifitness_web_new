import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Unauthorized Access",
  description: "You do not have permission to access this page.",
}

export default function UnauthorizedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}

