"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Heart } from "lucide-react"
import { motion } from "framer-motion"
import type { Game } from "@/types/game"
import { useAuth } from "@/context/auth-context"
import { checkIsFavorite, toggleFavorite } from "@/lib/favorites"
import { calculateGamePrice } from "@/lib/api"

export default function GameCard({ game }: { game: Game }) {
    const { user } = useAuth()
    const [isFavorite, setIsFavorite] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        const fetchFavoriteStatus = async () => {
          if (!user) return // evitar errores si el usuario no está disponible
          const favorite = await checkIsFavorite(user.uid, game.id)
          setIsFavorite(favorite)
        }
      
        fetchFavoriteStatus()
      }, [user, game])
    
    // Calcular precio de manera determinista
    const { price, hasDiscount, discountPercentage, originalPrice } = calculateGamePrice(game)

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!user) return

        try {
            const newStatus = await toggleFavorite(user.uid, game)
            setIsFavorite(newStatus)
        } catch (error) {
            console.error("Error toggling favorite:", error)
        }
    }

    return (
        <Link href={`/game/${game.slug}`}>
            <motion.div
                className="game-card bg-gray-800 rounded-lg overflow-hidden shadow-lg h-full flex flex-col relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
                <div className="relative">
                    <motion.img
                        src={game.background_image || "/placeholder.svg?height=300&width=400"}
                        alt={game.name}
                        className="w-full h-48 object-cover"
                        animate={{ scale: isHovered ? 1.05 : 1 }}
                        transition={{ duration: 0.3 }}
                    />

                    {user && (
                        <motion.button
                            onClick={handleToggleFavorite}
                            className="absolute top-2 right-2 p-2 bg-gray-900/80 rounded-full hover:bg-gray-800 transition-colors z-10"
                            aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}`} />
                        </motion.button>
                    )}

                    {hasDiscount && (
                        <motion.div
                            className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            -{discountPercentage}%
                        </motion.div>
                    )}
                </div>

                <div className="p-4 flex-grow flex flex-col">
                    <h3 className="font-bold text-lg mb-1 line-clamp-1">{game.name}</h3>

                    <div className="flex items-center mb-2">
                        {game.genres &&
                            game.genres.length > 0 &&
                            game.genres.slice(0, 2).map((genre, index) => (
                                <span key={index} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded mr-1">
                                    {genre?.name || "Unknown"}
                                </span>
                            ))}
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex items-center bg-gray-700 px-2 py-1 rounded">
                                <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-sm font-medium">{game.rating?.toFixed(1) || "N/A"}</span>
                            </div>
                        </div>

                        <div className="text-right">
                            {hasDiscount && (
                                <span className="text-xs text-gray-400 line-through mr-1">${originalPrice.toFixed(2)}</span>
                            )}
                            <span className="font-bold text-white">${price.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}