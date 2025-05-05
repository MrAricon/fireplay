"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getPopularGames } from "@/lib/api"
import type { Game } from "@/types/game"
import GameCard from "@/components/game-card"

export default function FeaturedGames() {
    const [games, setGames] = useState<Game[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const data = await getPopularGames()
                setGames(data.games.slice(0, 6))
                setLoading(false)
            } catch (error) {
                console.error("Error fetching games:", error)
                setLoading(false)
            }
        }

        fetchGames()
    }, [])

    return (
        <section className="py-16 bg-gray-800/50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">Juegos destacados</h2>
                    <Link href="/games" className="text-orange-500 hover:text-orange-400 font-medium flex items-center">
                        Ver todos
                        <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-gray-700 rounded-lg overflow-hidden shadow-lg h-80 animate-pulse">
                                <div className="h-48 bg-gray-600"></div>
                                <div className="p-4">
                                    <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {games.map((game) => (
                            <GameCard key={game.id} game={game} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}