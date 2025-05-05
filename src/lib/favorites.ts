"use client"

import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/firebase/firebase"
import type { Game } from "@/types/game"

// Función para añadir un juego a favoritos
export async function addToFavorites(userId: string, game: Game): Promise<void> {
    try {
        const favoriteRef = doc(db, "users", userId, "favorites", game.id.toString())
        await setDoc(favoriteRef, {
            id: game.id,
            name: game.name,
            slug: game.slug,
            background_image: game.background_image,
            rating: game.rating,
            added: new Date().toISOString(),
        })
    } catch (error) {
        console.error("Error adding to favorites:", error)
        throw error
    }
}

// Función para eliminar un juego de favoritos
export async function removeFromFavorites(userId: string, gameId: number): Promise<void> {
    try {
        const favoriteRef = doc(db, "users", userId, "favorites", gameId.toString())
        await deleteDoc(favoriteRef)
    } catch (error) {
        console.error("Error removing from favorites:", error)
        throw error
    }
}

// Función para comprobar si un juego está en favoritos
export async function checkIsFavorite(userId: string, gameId: number): Promise<boolean> {
    try {
        const favoriteRef = doc(db, "users", userId, "favorites", gameId.toString())
        const docSnap = await getDoc(favoriteRef)
        return docSnap.exists()
    } catch (error) {
        console.error("Error checking favorite status:", error)
        return false
    }
}

// Función para alternar el estado de favorito
export async function toggleFavorite(userId: string, game: Game): Promise<boolean> {
    try {
        const isFavorite = await checkIsFavorite(userId, game.id)

        if (isFavorite) {
            await removeFromFavorites(userId, game.id)
            return false
        } else {
            await addToFavorites(userId, game)
            return true
        }
    } catch (error) {
        console.error("Error toggling favorite:", error)
        throw error
    }
}