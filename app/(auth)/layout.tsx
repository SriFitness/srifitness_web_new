import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Log in with Sri Fitness account",
        description: "Manage your account with Sri Fitness Auth Portal",
    };
}
export default async function AuthLayout({
                                             children,
                                         }: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            {children}
        </div>
    )
}