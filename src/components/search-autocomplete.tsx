"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { searchGames } from "@/lib/api"
import type { Game } from "@/types/game"

export default function SearchAutocomplete() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<Game[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    // Manejar clics fuera del componente para cerrar resultados
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    // Búsqueda con debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length >= 2) {
                setIsLoading(true)
                try {
                    const data = await searchGames(query, 1, 5)
                    setResults(data.games)
                    setShowResults(true)
                } catch (error) {
                    console.error("Error searching games:", error)
                } finally {
                    setIsLoading(false)
                }
            } else {
                setResults([])
                setShowResults(false)
            }
        }, 300)

        return () => clearTimeout(delayDebounceFn)
    }, [query])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/search?query=${encodeURIComponent(query.trim())}`)
            setShowResults(false)
        }
    }

    const handleResultClick = (slug: string) => {
        router.push(`/game/${slug}`)
        setShowResults(false)
        setQuery("")
    }

    const clearSearch = () => {
        setQuery("")
        setResults([])
        setShowResults(false)
    }

    return (
        <div className="relative w-full max-w-md" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar juegos..."
                    className="w-full p-3 pl-10 pr-10 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                {query && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </form>

            {/* Resultados de autocompletado */}
            {showResults && results.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <ul className="max-h-80 overflow-y-auto">
                        {results.map((game) => (
                            <li key={game.id} className="border-b border-gray-700 last:border-0">
                                <button
                                    onClick={() => handleResultClick(game.slug)}
                                    className="flex items-center p-3 w-full text-left hover:bg-gray-700 transition-colors"
                                >
                                    {game.background_image ? (
                                        <img
                                            src={game.background_image || "/placeholder.svg"}
                                            alt={game.name}
                                            className="w-12 h-12 object-cover rounded mr-3"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-600 rounded mr-3 flex items-center justify-center">
                                            <Search className="w-6 h-6 text-gray-400" />
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-medium">{game.name}</div>
                                        {game.released && (
                                            <div className="text-sm text-gray-400">{new Date(game.released).getFullYear()}</div>
                                        )}
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="p-2 bg-gray-700">
                        <button
                            onClick={handleSearch}
                            className="w-full text-center text-sm text-orange-500 hover:text-orange-400 py-1"
                        >
                            Ver todos los resultados
                        </button>
                    </div>
                </div>
            )}

            {/* Mensaje de cargando */}
            {isLoading && (
                <div className="absolute z-50 mt-1 w-full bg-gray-800 rounded-lg shadow-lg p-4 text-center">
                    <div className="animate-pulse text-gray-400">Buscando...</div>
                </div>
            )}

            {/* Sin resultados */}
            {showResults && query.length >= 2 && !isLoading && results.length === 0 && (
                <div className="absolute z-50 mt-1 w-full bg-gray-800 rounded-lg shadow-lg p-4 text-center">
                    <div className="text-gray-400">No se encontraron resultados para "{query}"</div>
                </div>
            )}
        </div>
    )
}