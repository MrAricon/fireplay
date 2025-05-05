"use client"

import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    query,
    where,
    updateDoc,
    deleteDoc,
    orderBy,
    limit,
} from "firebase/firestore"
import { db } from "@/firebase/firebase"
import type { Review } from "@/types/review"

// Función para añadir una reseña
export async function addReview(review: Omit<Review, "id">): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, "reviews"), review)
        return docRef.id
    } catch (error) {
        console.error("Error adding review:", error)
        throw error
    }
}

// Función para obtener reseñas de un juego
export async function getGameReviews(gameId: number): Promise<Review[]> {
    try {
        const q = query(collection(db, "reviews"), where("gameId", "==", gameId), orderBy("date", "desc"))
        const querySnapshot = await getDocs(q)

        const reviews: Review[] = []
        querySnapshot.forEach((doc) => {
            reviews.push({ id: doc.id, ...doc.data() } as Review)
        })

        return reviews
    } catch (error) {
        console.error(`Error getting reviews for game ${gameId}:`, error)
        return []
    }
}

// Función para obtener reseñas de un usuario
export async function getUserReviews(userId: string): Promise<Review[]> {
    try {
        const q = query(collection(db, "reviews"), where("userId", "==", userId), orderBy("date", "desc"))
        const querySnapshot = await getDocs(q)

        const reviews: Review[] = []
        querySnapshot.forEach((doc) => {
            reviews.push({ id: doc.id, ...doc.data() } as Review)
        })

        return reviews
    } catch (error) {
        console.error(`Error getting reviews for user ${userId}:`, error)
        return []
    }
}

// Función para verificar si un usuario ya ha reseñado un juego
export async function hasUserReviewedGame(userId: string, gameId: number): Promise<boolean> {
    try {
        const q = query(collection(db, "reviews"), where("userId", "==", userId), where("gameId", "==", gameId), limit(1))
        const querySnapshot = await getDocs(q)
        return !querySnapshot.empty
    } catch (error) {
        console.error(`Error checking if user ${userId} has reviewed game ${gameId}:`, error)
        return false
    }
}

// Función para obtener una reseña específica
export async function getReview(reviewId: string): Promise<Review | null> {
    try {
        const docRef = doc(db, "reviews", reviewId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Review
        } else {
            return null
        }
    } catch (error) {
        console.error(`Error getting review ${reviewId}:`, error)
        return null
    }
}

// Función para actualizar una reseña
export async function updateReview(reviewId: string, data: Partial<Review>): Promise<void> {
    try {
        const reviewRef = doc(db, "reviews", reviewId)
        await updateDoc(reviewRef, data)
    } catch (error) {
        console.error(`Error updating review ${reviewId}:`, error)
        throw error
    }
}

// Función para eliminar una reseña
export async function deleteReview(reviewId: string): Promise<void> {
    try {
        const reviewRef = doc(db, "reviews", reviewId)
        await deleteDoc(reviewRef)
    } catch (error) {
        console.error(`Error deleting review ${reviewId}:`, error)
        throw error
    }
}

// Función para dar like a una reseña
export async function likeReview(reviewId: string, userId: string): Promise<void> {
    try {
        const reviewRef = doc(db, "reviews", reviewId)
        const reviewSnap = await getDoc(reviewRef)

        if (reviewSnap.exists()) {
            const reviewData = reviewSnap.data() as Review

            // Verificar si el usuario ya dio like
            const likedBy = reviewData.likedBy || []
            const dislikedBy = reviewData.dislikedBy || []

            // Si ya dio like, quitar el like
            if (likedBy.includes(userId)) {
                await updateDoc(reviewRef, {
                    likes: reviewData.likes - 1,
                    likedBy: likedBy.filter((id) => id !== userId),
                })
            }
            // Si no ha dado like, añadir like y quitar dislike si existe
            else {
                const updates: any = {
                    likes: reviewData.likes + 1,
                    likedBy: [...likedBy, userId],
                }

                // Si había dado dislike, quitarlo
                if (dislikedBy.includes(userId)) {
                    updates.dislikes = reviewData.dislikes - 1
                    updates.dislikedBy = dislikedBy.filter((id) => id !== userId)
                }

                await updateDoc(reviewRef, updates)
            }
        }
    } catch (error) {
        console.error(`Error liking review ${reviewId}:`, error)
        throw error
    }
}

// Función para dar dislike a una reseña
export async function dislikeReview(reviewId: string, userId: string): Promise<void> {
    try {
        const reviewRef = doc(db, "reviews", reviewId)
        const reviewSnap = await getDoc(reviewRef)

        if (reviewSnap.exists()) {
            const reviewData = reviewSnap.data() as Review

            // Verificar si el usuario ya dio dislike
            const likedBy = reviewData.likedBy || []
            const dislikedBy = reviewData.dislikedBy || []

            // Si ya dio dislike, quitar el dislike
            if (dislikedBy.includes(userId)) {
                await updateDoc(reviewRef, {
                    dislikes: reviewData.dislikes - 1,
                    dislikedBy: dislikedBy.filter((id) => id !== userId),
                })
            }
            // Si no ha dado dislike, añadir dislike y quitar like si existe
            else {
                const updates: any = {
                    dislikes: reviewData.dislikes + 1,
                    dislikedBy: [...dislikedBy, userId],
                }

                // Si había dado like, quitarlo
                if (likedBy.includes(userId)) {
                    updates.likes = reviewData.likes - 1
                    updates.likedBy = likedBy.filter((id) => id !== userId)
                }

                await updateDoc(reviewRef, updates)
            }
        }
    } catch (error) {
        console.error(`Error disliking review ${reviewId}:`, error)
        throw error
    }
}

// Función para obtener el rating promedio de un juego
export async function getAverageRating(gameId: number): Promise<{ average: number; count: number }> {
    try {
        const q = query(collection(db, "reviews"), where("gameId", "==", gameId))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
            return { average: 0, count: 0 }
        }

        let totalRating = 0
        let count = 0

        querySnapshot.forEach((doc) => {
            const review = doc.data() as Review
            totalRating += review.rating
            count++
        })

        return {
            average: totalRating / count,
            count,
        }
    } catch (error) {
        console.error(`Error getting average rating for game ${gameId}:`, error)
        return { average: 0, count: 0 }
    }
}