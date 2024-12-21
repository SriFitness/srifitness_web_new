import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/features/admin/components/theme-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { Toaster as ToasterSooner } from "sonner"
import { Toaster as ToasterShadcn } from "@/components/ui/toaster"
import { Loading } from "@/components/styles/loading"
import { LoadingBar } from "@/components/styles/loading-bar"
import { LoadingProvider } from "@/components/providers/LoadingContext"

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
                <LoadingProvider>
                    <body className={inter.className}>
                        <LoadingBar />
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem
                            disableTransitionOnChange
                        >
                            {children}
                            <ToasterSooner position="top-right" expand={true} richColors />
                            <ToasterShadcn />
                        </ThemeProvider>
                    </body>
                </LoadingProvider>
            </AuthProvider>
        </html>
    )
}

