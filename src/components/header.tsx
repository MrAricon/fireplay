"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Search, ShoppingCart, Heart, Menu, X } from "lucide-react"
import { getCartFirestore, getCartLocalStorage } from "@/lib/cart"

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const pathname = usePathname()
    const { user, logout } = useAuth()
    const [cartItemCount, setCartItemCount] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                if (user) {
                    const cartItems = await getCartFirestore(user.uid)
                    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
                    setCartItemCount(totalCount)
                } else {
                    const cartItems = getCartLocalStorage()
                    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
                    setCartItemCount(totalCount)
                }
            } catch (error) {
                console.error("Error loading cart items:", error)
            }
        }

        fetchCartItems()
    }, [user])

    const handleLogout = async () => {
        try {
            await logout()
            setIsUserMenuOpen(false)
        } catch (error) {
            console.error("Error al cerrar sesión:", error)
        }
    }

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-gray-900/95 backdrop-blur-md shadow-lg" : "bg-transparent"
                }`}
        >
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                            FIREPLAY
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/games"
                            className={`nav-link text-sm font-medium ${pathname === "/games" ? "text-orange-500" : "text-gray-300 hover:text-white"
                                }`}
                        >
                            Juegos
                        </Link>
                        <Link
                            href="/search"
                            className={`nav-link text-sm font-medium ${pathname === "/search" ? "text-orange-500" : "text-gray-300 hover:text-white"
                                }`}
                        >
                            Buscar
                        </Link>
                        <Link
                            href="/info"
                            className={`nav-link text-sm font-medium ${pathname === "/info" ? "text-orange-500" : "text-gray-300 hover:text-white"
                                }`}
                        >
                            Info
                        </Link>
                        <Link
                            href="/contact"
                            className={`nav-link text-sm font-medium ${pathname === "/contact" ? "text-orange-500" : "text-gray-300 hover:text-white"
                                }`}
                        >
                            Contacto
                        </Link>
                    </nav>

                    {/* User Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="/search" className="p-2 rounded-full hover:bg-gray-800 transition-colors" aria-label="Buscar">
                            <Search className="w-5 h-5" />
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    href="/favorites"
                                    className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                                    aria-label="Favoritos"
                                >
                                    <Heart className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="/cart"
                                    className="p-2 rounded-full hover:bg-gray-800 transition-colors relative"
                                    aria-label="Carrito"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </Link>

                                {/* User Profile */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center space-x-1 p-1 rounded-full hover:bg-gray-800 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                                            <span className="text-sm font-bold">
                                                {user.displayName
                                                    ? user.displayName.charAt(0).toUpperCase()
                                                    : user.email?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </button>

                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                                            <div className="px-4 py-2 border-b border-gray-700">
                                                <p className="text-sm font-medium">{user.displayName || user.email}</p>
                                            </div>
                                            <Link
                                                href="/dashboard"
                                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                Panel de usuario
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                            >
                                                Cerrar sesión
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Iniciar sesión
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-800 shadow-xl">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link
                            href="/games"
                            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Juegos
                        </Link>
                        <Link
                            href="/search"
                            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Buscar
                        </Link>
                        <Link
                            href="/info"
                            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Info
                        </Link>
                        <Link
                            href="/contact"
                            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Contacto
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    href="/favorites"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Favoritos
                                </Link>
                                <Link
                                    href="/cart"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Carrito
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Panel de usuario
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                                >
                                    Cerrar sesión
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="block px-3 py-2 rounded-md text-base font-medium bg-orange-600 text-white hover:bg-orange-700"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Iniciar sesión
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}