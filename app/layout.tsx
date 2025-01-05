import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/features/admin/components/theme-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { Toaster as ToasterSooner } from "sonner"
import { Toaster as ToasterShadcn } from "@/components/ui/toaster"
import { LoadingBar } from "@/components/styles/loading-bar"
import { LoadingProvider } from "@/components/providers/LoadingContext"
import { Suspense } from "react"
import AppLoading from "./loading"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Sri Fitness",
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
                        <Suspense>
                            <LoadingBar />
                        </Suspense>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem
                            disableTransitionOnChange
                        >
                            <Suspense fallback={<AppLoading />}>
                                {children}
                            </Suspense>
                            <ToasterSooner position="top-right" expand={true} richColors />
                            <ToasterShadcn />
                        </ThemeProvider>
                    </body>
                </LoadingProvider>
            </AuthProvider>
        </html>
    )
}

