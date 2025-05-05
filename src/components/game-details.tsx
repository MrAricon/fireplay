"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, ShoppingCart, Globe, Calendar, Star } from "lucide-react"
import type { GameDetails as GameDetailsType } from "@/types/game-details"
import { useAuth } from "@/context/auth-context"
import { toggleFavorite } from "@/lib/favorites"
import { addToCartFirestore, addToCartLocalStorage } from "@/lib/cart"
import { calculateGamePrice, getGameStores } from "@/lib/api"

interface GameDetailsProps {
    game: GameDetailsType
    screenshots: string[]
}

export default function GameDetails({ game, screenshots }: GameDetailsProps) {
    const { user } = useAuth()
    const [isFavorite, setIsFavorite] = useState(false)
    const [activeImage, setActiveImage] = useState(game.background_image)
    const [showFullDescription, setShowFullDescription] = useState(false)
    const [stores, setStores] = useState<any[]>([])

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

    const handleToggleFavorite = async () => {
        if (!user) return

        try {
            const newStatus = await toggleFavorite(user.uid, {
                id: game.id,
                slug: game.slug,
                name: game.name,
                background_image: game.background_image,
                rating: game.rating,
            })
            setIsFavorite(newStatus)
        } catch (error) {
            console.error("Error toggling favorite:", error)
        }
    }

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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6">
                    <div className="mb-4">
                        <img
                            src={activeImage || "/placeholder.svg"}
                            alt={game.name}
                            className="w-full h-[400px] object-cover rounded-lg"
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        {screenshots.slice(0, 4).map((screenshot, index) => (
                            <img
                                key={index}
                                src={screenshot || "/placeholder.svg"}
                                alt={`Screenshot ${index + 1}`}
                                className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setActiveImage(screenshot)}
                            />
                        ))}
                    </div>
                </div>

                {/* Columna derecha: Información */}
                <div className="p-6 bg-gray-700 flex flex-col">
                    <h1 className="text-2xl font-bold mb-2">{game.name}</h1>

                    <div className="flex items-center mb-4">
                        <div className="flex items-center bg-gray-800 px-2 py-1 rounded mr-2">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium">{game.rating?.toFixed(1) || "N/A"}</span>
                        </div>

                        {game.released && (
                            <div className="flex items-center text-gray-400 text-sm">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(game.released).toLocaleDateString()}
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        {game.genres && game.genres.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                                {game.genres.map((genre) => (
                                    <span key={genre.id} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {game.platforms && game.platforms.length > 0 && (
                            <div className="text-sm text-gray-400 mb-2">
                                <span className="font-medium">Plataformas: </span>
                                {game.platforms.map((p) => p.platform?.name || "Unknown").join(", ")}
                            </div>
                        )}

                        {game.developers && game.developers.length > 0 && (
                            <div className="text-sm text-gray-400 mb-2">
                                <span className="font-medium">Desarrollador: </span>
                                {game.developers.map((dev) => dev?.name || "Unknown").join(", ")}
                            </div>
                        )}

                        {game.publishers && game.publishers.length > 0 && (
                            <div className="text-sm text-gray-400 mb-2">
                                <span className="font-medium">Editor: </span>
                                {game.publishers.map((pub) => pub?.name || "Unknown").join(", ")}
                            </div>
                        )}

                        {game.website && (
                            <a
                                href={game.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-orange-500 hover:text-orange-400 flex items-center mt-2"
                            >
                                <Globe className="w-4 h-4 mr-1" />
                                Sitio web oficial
                            </a>
                        )}
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
                                        {store.store?.name || "Unknown Store"}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mb-6">
                        <h3 className="font-medium mb-2">Descripción</h3>
                        <div
                            className={`text-sm text-gray-300 ${showFullDescription ? "" : "line-clamp-4"}`}
                            dangerouslySetInnerHTML={{ __html: game.description }}
                        />
                        <button
                            onClick={() => setShowFullDescription(!showFullDescription)}
                            className="text-sm text-orange-500 hover:text-orange-400 mt-2"
                        >
                            {showFullDescription ? "Mostrar menos" : "Leer más"}
                        </button>
                    </div>

                    <div className="mt-auto">
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

                            {user && (
                                <button
                                    onClick={handleToggleFavorite}
                                    className="p-2 rounded-full hover:bg-gray-600 transition-colors"
                                    aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                                >
                                    <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}`} />
                                </button>
                            )}
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
                        >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Añadir al carrito
                        </button>

                        <Link
                            href={`/product-sheety/${game.slug}`}
                            className="w-full mt-2 bg-gray-600 hover:bg-gray-500 text-white font-medium py-3 px-4 rounded-md transition-colors text-center block"
                        >
                            Ver ficha técnica
                        </Link>
                    </div>
                </div>
            </div>

            {/* Requisitos del sistema */}
            {game.platforms && game.platforms.some((p) => p.requirements?.minimum || p.requirements?.recommended) && (
                <div className="p-6 border-t border-gray-700">
                    <h2 className="text-xl font-bold mb-4">Requisitos del sistema</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {game.platforms
                            .filter((p) => p.requirements?.minimum || p.requirements?.recommended)
                            .map((platform) => (
                                <div key={platform.platform?.id || Math.random()} className="bg-gray-700 p-4 rounded-lg">
                                    <h3 className="font-bold mb-2">{platform.platform?.name || "Unknown Platform"}</h3>

                                    {platform.requirements?.minimum && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-300 mb-1">Mínimos:</h4>
                                            <p
                                                className="text-xs text-gray-400"
                                                dangerouslySetInnerHTML={{ __html: platform.requirements.minimum }}
                                            />
                                        </div>
                                    )}

                                    {platform.requirements?.recommended && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-300 mb-1">Recomendados:</h4>
                                            <p
                                                className="text-xs text-gray-400"
                                                dangerouslySetInnerHTML={{ __html: platform.requirements.recommended }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    )
}