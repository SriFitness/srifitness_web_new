import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/features/admin/components/dashboard-sidebar"
import { DashboardHeader } from "@/features/admin/components/dashboard-header"

import { cookies } from "next/headers";
import { DecodedIdToken } from "firebase-admin/auth";
import { auth } from "@/firebase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // const cookieStore = cookies();
  // const authToken = (await cookieStore).get("firebaseIdToken")?.value;

  // if (!authToken || !auth) {
  //   redirect("/sign-in");
  // }

  // let user: DecodedIdToken | null = null;
  // try {
  //   user = await auth.verifyIdToken(authToken);
  // } catch (error) {
  //   console.error("Error verifying token:", error);
  //   redirect("/sign-in");
  // }

  // if (!user) {
  //   redirect("/sign-in");
  // }

  // const isAdmin = user.role === "admin";

  // if (!isAdmin) {
  //   redirect("/unauthorized");
  // }

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

