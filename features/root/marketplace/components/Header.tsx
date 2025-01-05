'use client'

import Link from "next/link"
import { useState } from "react"
import { Search, ShoppingCart, Heart, Menu, Phone, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import styles from '@/app/(root)/marketplace/Marketplace.module.css'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className={`border-b ${styles.marketplaceHeader}`}>
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Phone className="h-4 w-4" />
            <span>+94 77 981 7275</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Sri Fitness Store
          </Link>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <div className="relative flex-1">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:block mt-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Equipment</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4">
                    <Link href="/category/treadmills">Treadmills</Link>
                    <Link href="/category/exercise-bikes">Exercise Bikes</Link>
                    <Link href="/category/weights">Weights & Dumbbells</Link>
                    <Link href="/category/accessories">Accessories</Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Supplements</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4">
                    <Link href="/category/protein">Protein</Link>
                    <Link href="/category/pre-workout">Pre-Workout</Link>
                    <Link href="/category/vitamins">Vitamins & Minerals</Link>
                    <Link href="/category/weight-gain">Weight Gainers</Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/brands" legacyBehavior passHref>
                  <NavigationMenuLink>Brands</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/offers" legacyBehavior passHref>
                  <NavigationMenuLink>Special Offers</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
      </div>
    </header>
  )
}