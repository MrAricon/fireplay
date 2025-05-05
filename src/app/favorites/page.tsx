"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/firebase/firebase"
import { useAuth } from "@/context/auth-context"
import GameCard from "@/components/game-card"
import type { Game } from "@/types/game"

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<Game[]>([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        // Redirigir si no hay usuario autenticado
        if (!user && !loading) {
            router.push("/login")
            return
        }

        const fetchFavorites = async () => {
            if (!user) return

            try {
                const favoritesRef = collection(db, "users", user.uid, "favorites")
                const querySnapshot = await getDocs(favoritesRef)

                const favoritesData: Game[] = []
                querySnapshot.forEach((doc) => {
                    favoritesData.push(doc.data() as Game)
                })

                setFavorites(favoritesData)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching favorites:", error)
                setLoading(false)
            }
        }

        fetchFavorites()
    }, [user, router, loading])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-24">
                <div className="text-center py-12">
                    <p className="text-xl text-gray-400">Cargando favoritos...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-24">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Mis favoritos</h1>
                <p className="text-gray-400">Juegos que has marcado como favoritos</p>
            </div>

            {favorites.length === 0 ? (
                <div className="text-center py-12 bg-gray-800 rounded-lg">
                    <p className="text-xl text-gray-400 mb-4">No tienes juegos favoritos</p>
                    <p className="text-gray-500 mb-6">Explora nuestro catálogo y marca juegos como favoritos</p>
                    <button
                        onClick={() => router.push("/games")}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                    >
                        Explorar juegos
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {favorites.map((game) => (
                        <GameCard key={game.id} game={game} />
                    ))}
                </div>
            )}
        </div>
    )
}