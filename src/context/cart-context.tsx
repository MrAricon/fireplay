"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { getCartFirestore, getCartLocalStorage } from "@/lib/cart"
import { CartItem } from "@/lib/cart"
import { useAuth } from "@/context/auth-context"

interface CartContextType {
    cartItems: CartItem[]
    refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const { user } = useAuth()

    const refreshCart = async () => {
        try {
            const items = user
                ? await getCartFirestore(user.uid)
                : getCartLocalStorage()

            setCartItems(items)
        } catch (error) {
            console.error("Error refreshing cart:", error)
        }
    }

    useEffect(() => {
        refreshCart()
    }, [user])

    return (
        <CartContext.Provider value={{ cartItems, refreshCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) throw new Error("useCart must be used within a CartProvider")
    return context
}
