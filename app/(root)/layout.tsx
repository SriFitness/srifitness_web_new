import Navbar from "@/features/root/components/Navbar"
import Footer from "@/features/root/components/Footer"
import CustomScrollbar from "@/features/root/components/CustomScrollbar"

export default async function HomeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <Navbar />
            <CustomScrollbar />
            <div>
                {children}
            </div>
            <Footer />
        </div>
    )
}