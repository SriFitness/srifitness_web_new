"use client";

import React from 'react';
import { useCart } from '@/components/providers/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { CartItem } from './CartItem';
import { useRouter } from 'next/navigation';

export const Cart: React.FC = () => {                                                           // Cart function component for the Cart component
  const { cart, isCartOpen, setIsCartOpen, clearCart } = useCart();
  const router = useRouter();

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-grow mt-4 overflow-y-auto"> {/* Allow scrolling */}
          {cart.length === 0 ? (
            <div className="text-center">Your cart is empty.</div>
          ) : (
            cart.map(item => (
              <CartItem key={item.id} item={item} />
            ))
          )}
        </ScrollArea>
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-lg font-semibold">${totalPrice.toFixed(2)}</span>
          </div>
          <Button onClick={handleCheckout} className="w-full mb-2">Checkout</Button>
          <Button onClick={clearCart} variant="outline" className="w-full">Clear Cart</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
