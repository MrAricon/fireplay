"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Star } from "lucide-react"
import type { GameDetails } from "@/types/game-details"
import { useAuth } from "@/context/auth-context"
import type { GameStore as GameStoreType } from "@/types/game-store"
import { addToCartFirestore, addToCartLocalStorage } from "@/lib/cart"
import { calculateGamePrice, getGameStores } from "@/lib/api"
import ReviewsSection from "@/components/reviews-section"

interface ProductSheetProps {
    game: GameDetails
}

export default function ProductSheet({ game }: ProductSheetProps) {
    const { user } = useAuth()
    const [stores, setStores] = useState<GameStoreType[]>([])

    // Calcular precio de manera determinista
    const { price, hasDiscount, discountPercentage, originalPrice } = calculateGamePrice(game)

    // Obtener tiendas donde está disponible el juego
    useEffect(() => {
        const fetchStores = async () => {
            const storesData = await getGameStores(game.id)
            setStores(storesData)
        }

        fetchStores()
    }, [game.id])

    const handleAddToCart = async () => {
        try {
            if (user) {
                await addToCartFirestore(
                    user.uid,
                    {
                        id: game.id,
                        slug: game.slug,
                        name: game.name,
                        background_image: game.background_image,
                        rating: game.rating,
                    },
                    price,
                )
            } else {
                addToCartLocalStorage(
                    {
                        id: game.id,
                        slug: game.slug,
                        name: game.name,
                        background_image: game.background_image,
                        rating: game.rating,
                    },
                    price,
                )
            }
        } catch (error) {
            console.error("Error adding to cart:", error)
        }
    }

    return (
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Imagen del juego */}
                    <div className="md:w-1/3">
                        <img
                            src={game.background_image || "/placeholder.svg"}
                            alt={game.name}
                            className="w-full h-auto rounded-lg"
                        />
                    </div>

                    {/* Información del juego */}
                    <div className="md:w-2/3">
                        <h1 className="text-2xl font-bold mb-2">{game.name}</h1>

                        <div className="flex items-center mb-4">
                            <div className="flex items-center bg-gray-700 px-2 py-1 rounded mr-2">
                                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                <span className="text-sm font-medium">{game.rating?.toFixed(1) || "N/A"}</span>
                            </div>

                            {game.released && (
                                <div className="text-gray-400 text-sm">Lanzamiento: {new Date(game.released).toLocaleDateString()}</div>
                            )}
                        </div>

                        <div className="mb-6">
                            <h3 className="font-medium mb-2">Ficha técnica</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                {game.genres && game.genres.length > 0 && (
                                    <div>
                                        <span className="text-gray-400">Géneros:</span>{" "}
                                        {game.genres.map((g) => g?.name || "Unknown").join(", ")}
                                    </div>
                                )}

                                {game.platforms && game.platforms.length > 0 && (
                                    <div>
                                        <span className="text-gray-400">Plataformas:</span>{" "}
                                        {game.platforms.map((p) => p.platform?.name || "Unknown").join(", ")}
                                    </div>
                                )}

                                {game.developers && game.developers.length > 0 && (
                                    <div>
                                        <span className="text-gray-400">Desarrollador:</span>{" "}
                                        {game.developers.map((d) => d?.name || "Unknown").join(", ")}
                                    </div>
                                )}

                                {game.publishers && game.publishers.length > 0 && (
                                    <div>
                                        <span className="text-gray-400">Editor:</span>{" "}
                                        {game.publishers.map((p) => p?.name || "Unknown").join(", ")}
                                    </div>
                                )}

                                {game.esrb_rating && (
                                    <div>
                                        <span className="text-gray-400">Clasificación:</span> {game.esrb_rating.name}
                                    </div>
                                )}

                                {game.playtime && (
                                    <div>
                                        <span className="text-gray-400">Tiempo de juego:</span> {game.playtime} horas
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tiendas disponibles */}
                        {stores && stores.length > 0 && (
                            <div className="mb-4">
                                <h3 className="font-medium mb-2">Disponible en:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {stores.map((store) => (
                                        <a
                                            key={store.id}
                                            href={store.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded hover:bg-gray-600 transition-colors"
                                        >
                                            {store.name || "Unknown Store"}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between mb-4">
                            <div>
                                {hasDiscount && (
                                    <span className="text-sm text-gray-400 line-through mr-2">${originalPrice.toFixed(2)}</span>
                                )}
                                <span className="text-2xl font-bold">${price.toFixed(2)}</span>
                                {hasDiscount && (
                                    <span className="ml-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                        -{discountPercentage}%
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
                            >
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                Añadir al carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección de opiniones */}
            <ReviewsSection game={game} />
        </div>
    )
}