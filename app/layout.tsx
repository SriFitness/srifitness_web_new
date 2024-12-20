import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/features/admin/components/theme-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { Toaster } from "sonner"
import { Loading } from "@/components/styles/loading"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Admin Dashboard",
    description: "Next.js 15 Admin Dashboard",
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <meta name="grammarly-disable-editor" content="true" />
        </head>
            <AuthProvider>
                <body className={inter.className}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                        <Loading size={100} />
                        <Toaster position="top-right" expand={true} richColors/>
                    </ThemeProvider>
                </body>
            </AuthProvider>
        </html>
    )
}

