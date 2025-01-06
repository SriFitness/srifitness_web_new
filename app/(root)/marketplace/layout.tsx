import { Header } from "@/features/root/marketplace/components/Header"
import styles from './Marketplace.module.css'

export default async function HomeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className={`container mx-auto py-10 mt-24 ${styles.marketplaceContainer}`}>
            <Header />
            {children}
        </div>
    )
}