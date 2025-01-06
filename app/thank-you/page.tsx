import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ThankYouPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Thank You for Your Order!</h1>
      <p className="text-xl mb-8">Your order has been successfully placed and is being processed.</p>
      <Button asChild>
        <Link href="/marketplace">Continue Shopping</Link>
      </Button>
    </div>
  )
}

