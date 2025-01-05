import { Header } from "@/features/root/marketplace/components/Header";
import MarketplacePage from "@/features/root/marketplace/components/MarketplacePage";
import styles from './Marketplace.module.css'

export default function Page() {
  return (
    <div className={`container mx-auto py-10 mt-24 ${styles.marketplaceContainer}`}>
      <Header />
      <MarketplacePage />
    </div>
  )
}

