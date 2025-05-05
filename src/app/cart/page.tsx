"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import {
    getCartFirestore,
    getCartLocalStorage,
    updateCartItemQuantityFirestore,
    updateCartItemQuantityLocalStorage,
    removeFromCartFirestore,
    removeFromCartLocalStorage,
    type CartItem,
} from "@/lib/cart"

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        const fetchCart = async () => {
            try {
                let items: CartItem[] = []

                if (user) {
                    // Si el usuario está autenticado, obtener carrito de Firestore
                    items = await getCartFirestore(user.uid)
                } else {
                    // Si no está autenticado, obtener carrito de localStorage
                    items = getCartLocalStorage()
                }

                setCartItems(items)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching cart:", error)
                setLoading(false)
            }
        }

        fetchCart()
    }, [user])

    const handleUpdateQuantity = async (gameId: number, newQuantity: number) => {
        try {
            if (user) {
                // Si el usuario está autenticado, actualizar en Firestore
                await updateCartItemQuantityFirestore(user.uid, gameId, newQuantity)
            } else {
                // Si no está autenticado, actualizar en localStorage
                updateCartItemQuantityLocalStorage(gameId, newQuantity)
            }

            // Actualizar estado local
            if (newQuantity <= 0) {
                setCartItems(cartItems.filter((item) => item.id !== gameId))
            } else {
                setCartItems(cartItems.map((item) => (item.id === gameId ? { ...item, quantity: newQuantity } : item)))
            }
        } catch (error) {
            console.error("Error updating quantity:", error)
        }
    }

    const handleRemoveItem = async (gameId: number) => {
        try {
            if (user) {
                // Si el usuario está autenticado, eliminar de Firestore
                await removeFromCartFirestore(user.uid, gameId)
            } else {
                // Si no está autenticado, eliminar de localStorage
                removeFromCartLocalStorage(gameId)
            }

            // Actualizar estado local
            setCartItems(cartItems.filter((item) => item.id !== gameId))
        } catch (error) {
            console.error("Error removing item:", error)
        }
    }

    // Calcular total
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    const tax = subtotal * 0.21 // IVA 21%
    const total = subtotal + tax

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-24">
                <div className="text-center py-12">
                    <p className="text-xl text-gray-400">Cargando carrito...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-24">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Mi carrito</h1>
                <p className="text-gray-400">Revisa y finaliza tu compra</p>
            </div>

            {cartItems.length === 0 ? (
                <div className="text-center py-12 bg-gray-800 rounded-lg">
                    <div className="flex justify-center mb-4">
                        <ShoppingBag className="w-16 h-16 text-gray-500" />
                    </div>
                    <p className="text-xl text-gray-400 mb-4">Tu carrito está vacío</p>
                    <p className="text-gray-500 mb-6">Añade algunos juegos a tu carrito</p>
                    <Link
                        href="/games"
                        className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                    >
                        Explorar juegos
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Lista de productos */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-800 rounded-lg overflow-hidden">
                            <div className="p-4 border-b border-gray-700">
                                <h2 className="font-medium">Productos ({cartItems.length})</h2>
                            </div>

                            <div className="divide-y divide-gray-700">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="p-4 flex flex-col sm:flex-row">
                                        <div className="sm:w-24 sm:h-24 mb-4 sm:mb-0 flex-shrink-0">
                                            <img
                                                src={item.background_image || "/placeholder.svg?height=100&width=100"}
                                                alt={item.name}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        </div>

                                        <div className="flex-grow sm:ml-4">
                                            <div className="flex justify-between">
                                                <Link
                                                    href={`/game/${item.slug}`}
                                                    className="font-medium hover:text-orange-500 transition-colors"
                                                >
                                                    {item.name}
                                                </Link>
                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                    aria-label="Eliminar"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="mt-2 flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                                                        aria-label="Disminuir cantidad"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="mx-3">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                                                        aria-label="Aumentar cantidad"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                                                    <div className="text-sm text-gray-400">${item.price.toFixed(2)} por unidad</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Resumen de compra */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800 rounded-lg p-6 sticky top-24">
                            <h2 className="font-medium mb-4">Resumen de compra</h2>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">IVA (21%)</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between font-medium">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-md transition-colors">
                                Finalizar compra
                            </button>

                            <div className="mt-4 text-center text-sm text-gray-400">
                                <p>Pago seguro garantizado</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}