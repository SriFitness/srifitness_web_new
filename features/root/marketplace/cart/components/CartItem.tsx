import React from 'react'
import Image from 'next/image'
import { useCart, CartItem as CartItemType } from '@/components/providers/CartContext'
import { Button } from '@/components/ui/button'
import { Minus, Plus, X } from 'lucide-react'

interface CartItemProps {                                                // CartItemProps interface for the CartItem component
  item: CartItemType
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart()

  return (
    <div className="flex items-center py-4 border-b">
      <Image src={item.image} alt={item.name} width={50} height={50} className="rounded-md mr-4" />
      <div className="flex-grow">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center">
        <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
          <Minus className="h-4 w-4" />
        </Button>
        <span className="mx-2">{item.quantity}</span>
        <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="ml-2">
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

