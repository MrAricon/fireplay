import axios from "axios"
import type { Game } from "@/types/game"
import type { GameDetails } from "@/types/game-details"
import type { GameStore } from "@/types/game-store"

const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY
const BASE_URL = "https://api.rawg.io/api"

// Función para obtener juegos populares con paginación
export async function getPopularGames(
    page = 1,
    pageSize = 12,
): Promise<{
    games: Game[]
    count: number
    next: string | null
    previous: string | null
}> {
    try {
        const response = await axios.get(
            `${BASE_URL}/games?key=${API_KEY}&ordering=-rating&page=${page}&page_size=${pageSize}`,
        )
        return {
            games: response.data.results,
            count: response.data.count,
            next: response.data.next,
            previous: response.data.previous,
        }
    } catch (error) {
        console.error("Error fetching popular games:", error)
        return {
            games: [],
            count: 0,
            next: null,
            previous: null,
        }
    }
}

// Función para buscar juegos con paginación
export async function searchGames(
    query: string,
    page = 1,
    pageSize = 20,
): Promise<{
    games: Game[]
    count: number
    next: string | null
    previous: string | null
}> {
    try {
        const response = await axios.get(
            `${BASE_URL}/games?key=${API_KEY}&search=${query}&page=${page}&page_size=${pageSize}`,
        )
        return {
            games: response.data.results,
            count: response.data.count,
            next: response.data.next,
            previous: response.data.previous,
        }
    } catch (error) {
        console.error("Error searching games:", error)
        return {
            games: [],
            count: 0,
            next: null,
            previous: null,
        }
    }
}

// Función para obtener detalles de un juego
export async function getGameDetails(slug: string): Promise<GameDetails | null> {
    try {
        const response = await axios.get(`${BASE_URL}/games/${slug}?key=${API_KEY}`)
        return response.data
    } catch (error) {
        console.error(`Error fetching game details for ${slug}:`, error)
        return null
    }
}

// Función para obtener capturas de pantalla de un juego
export async function getGameScreenshots(id: number): Promise<string[]> {
    try {
        const response = await axios.get(`${BASE_URL}/games/${id}/screenshots?key=${API_KEY}`)
        console.log(response.data.results)
        return response.data.results.map((screenshot: any) => screenshot.image)
    } catch (error) {
        console.error(`Error fetching screenshots for game ${id}:`, error)
        return []
    }
}

// Función para obtener juegos por género con paginación
export async function getGamesByGenre(
    genreId: number,
    page = 1,
    pageSize = 12,
): Promise<{
    games: Game[]
    count: number
    next: string | null
    previous: string | null
}> {
    try {
        const response = await axios.get(
            `${BASE_URL}/games?key=${API_KEY}&genres=${genreId}&page=${page}&page_size=${pageSize}`,
        )
        return {
            games: response.data.results,
            count: response.data.count,
            next: response.data.next,
            previous: response.data.previous,
        }
    } catch (error) {
        console.error(`Error fetching games for genre ${genreId}:`, error)
        return {
            games: [],
            count: 0,
            next: null,
            previous: null,
        }
    }
}

// Función para obtener tiendas donde está disponible el juego
export async function getGameStores(gameId: number): Promise<GameStore[]> {
    try {
        const response = await axios.get(`${BASE_URL}/games/${gameId}/stores?key=${API_KEY}`)
        console.log(response.data.results)
        return response.data.results
    } catch (error) {
        console.error(`Error fetching stores for game ${gameId}:`, error)
        return []
    }
}

// Función para obtener géneros de juegos
export async function getGenres(): Promise<any[]> {
    try {
        const response = await axios.get(`${BASE_URL}/genres?key=${API_KEY}`)
        return response.data.results
    } catch (error) {
        console.error("Error fetching genres:", error)
        return []
    }
}

// Función para obtener plataformas de juegos
export async function getPlatforms(): Promise<any[]> {
    try {
        const response = await axios.get(`${BASE_URL}/platforms?key=${API_KEY}`)
        return response.data.results
    } catch (error) {
        console.error("Error fetching platforms:", error)
        return []
    }
}

// Función para calcular un precio ficticio basado en datos del juego
export function calculateGamePrice(game: Game | GameDetails): {
    price: number
    hasDiscount: boolean
    discountPercentage: number
    originalPrice: number
} {
    // Usar propiedades del juego para generar un precio determinista
    const basePrice = game.rating ? Math.round(game.rating * 10) - (game.id % 5) : 29.99

    // Usar el ID del juego para determinar si hay descuento (30% de probabilidad)
    const hasDiscount = game.id % 10 > 6

    // Calcular porcentaje de descuento basado en el ID (entre 10% y 50%)
    const discountPercentage = hasDiscount ? ((game.id % 5) + 1) * 10 : 0

    // Calcular precio original
    const originalPrice = hasDiscount ? basePrice + (basePrice * discountPercentage) / 100 : basePrice

    return {
        price: basePrice,
        hasDiscount,
        discountPercentage,
        originalPrice,
    }
}