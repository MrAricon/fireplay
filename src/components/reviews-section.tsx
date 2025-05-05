"use client"

import { useState, useEffect } from "react"
import { Star, ThumbsUp, ThumbsDown, MessageCircle, Trash, Edit, AlertCircle } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import {
    getGameReviews,
    addReview,
    likeReview,
    dislikeReview,
    deleteReview,
    updateReview,
    hasUserReviewedGame,
    getAverageRating,
} from "@/lib/reviews"
import type { Review } from "@/types/review"
import type { GameDetails } from "@/types/game-details"

interface ReviewsSectionProps {
    game: GameDetails
}

export default function ReviewsSection({ game }: ReviewsSectionProps) {
    const { user } = useAuth()
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [userRating, setUserRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [reviewContent, setReviewContent] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [userHasReviewed, setUserHasReviewed] = useState(false)
    const [editingReview, setEditingReview] = useState<string | null>(null)
    const [averageRating, setAverageRating] = useState(0)
    const [reviewCount, setReviewCount] = useState(0)

    // Cargar reseñas al montar el componente
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const reviewsData = await getGameReviews(game.id)
                setReviews(reviewsData)

                // Obtener rating promedio
                const { average, count } = await getAverageRating(game.id)
                setAverageRating(average)
                setReviewCount(count)

                // Verificar si el usuario ya ha reseñado el juego
                if (user) {
                    const hasReviewed = await hasUserReviewedGame(user.uid, game.id)
                    setUserHasReviewed(hasReviewed)

                    // Si el usuario ya ha reseñado, obtener su reseña para edición
                    if (hasReviewed) {
                        const userReview = reviewsData.find((review) => review.userId === user.uid)
                        if (userReview) {
                            setUserRating(userReview.rating)
                            setReviewContent(userReview.content)
                        }
                    }
                }

                setLoading(false)
            } catch (error) {
                console.error("Error fetching reviews:", error)
                setLoading(false)
            }
        }

        fetchReviews()
    }, [game.id, user])

    const handleSubmitReview = async () => {
        if (!user) {
            setError("Debes iniciar sesión para dejar una reseña")
            return
        }

        if (userRating === 0) {
            setError("Por favor, selecciona una calificación")
            return
        }

        if (reviewContent.trim() === "") {
            setError("Por favor, escribe una reseña")
            return
        }

        setError("")
        setSubmitting(true)

        try {
            // Si el usuario ya ha reseñado, actualizar su reseña
            if (userHasReviewed) {
                const userReview = reviews.find((review) => review.userId === user.uid)
                if (userReview && userReview.id) {
                    await updateReview(userReview.id, {
                        rating: userRating,
                        content: reviewContent,
                        date: new Date().toISOString(),
                    })

                    // Actualizar la reseña en el estado local
                    setReviews(
                        reviews.map((review) =>
                            review.id === userReview.id
                                ? { ...review, rating: userRating, content: reviewContent, date: new Date().toISOString() }
                                : review,
                        ),
                    )

                    setSuccess("Tu reseña ha sido actualizada")
                }
            }
            // Si no ha reseñado, crear una nueva reseña
            else {
                const newReview: Omit<Review, "id"> = {
                    gameId: game.id,
                    userId: user.uid,
                    userName: user.displayName || user.email?.split("@")[0] || "Usuario",
                    userEmail: user.email || undefined,
                    rating: userRating,
                    content: reviewContent,
                    date: new Date().toISOString(),
                    likes: 0,
                    dislikes: 0,
                    likedBy: [],
                    dislikedBy: [],
                }

                const reviewId = await addReview(newReview)

                // Añadir la nueva reseña al estado local
                setReviews([{ id: reviewId, ...newReview }, ...reviews])
                setUserHasReviewed(true)

                // Actualizar el rating promedio
                const { average, count } = await getAverageRating(game.id)
                setAverageRating(average)
                setReviewCount(count)

                setSuccess("Tu reseña ha sido publicada")
            }
        } catch (error) {
            console.error("Error submitting review:", error)
            setError("Error al publicar la reseña. Inténtalo de nuevo.")
        } finally {
            setSubmitting(false)

            // Ocultar mensaje de éxito después de 3 segundos
            setTimeout(() => {
                setSuccess("")
            }, 3000)
        }
    }

    const handleDeleteReview = async (reviewId: string) => {
        if (!user) return

        if (confirm("¿Estás seguro de que quieres eliminar esta reseña?")) {
            try {
                await deleteReview(reviewId)

                // Eliminar la reseña del estado local
                setReviews(reviews.filter((review) => review.id !== reviewId))

                // Resetear el estado del formulario
                setUserRating(0)
                setReviewContent("")
                setUserHasReviewed(false)

                // Actualizar el rating promedio
                const { average, count } = await getAverageRating(game.id)
                setAverageRating(average)
                setReviewCount(count)

                setSuccess("Tu reseña ha sido eliminada")

                // Ocultar mensaje de éxito después de 3 segundos
                setTimeout(() => {
                    setSuccess("")
                }, 3000)
            } catch (error) {
                console.error("Error deleting review:", error)
                setError("Error al eliminar la reseña. Inténtalo de nuevo.")
            }
        }
    }

    const handleLikeReview = async (reviewId: string) => {
        if (!user) {
            setError("Debes iniciar sesión para valorar reseñas")
            return
        }

        try {
            await likeReview(reviewId, user.uid)

            // Actualizar el estado local
            setReviews(
                reviews.map((review) => {
                    if (review.id === reviewId) {
                        const likedBy = review.likedBy || []
                        const dislikedBy = review.dislikedBy || []

                        // Si ya dio like, quitar el like
                        if (likedBy.includes(user.uid)) {
                            return {
                                ...review,
                                likes: review.likes - 1,
                                likedBy: likedBy.filter((id) => id !== user.uid),
                            }
                        }
                        // Si no ha dado like, añadir like y quitar dislike si existe
                        else {
                            const updatedReview = {
                                ...review,
                                likes: review.likes + 1,
                                likedBy: [...likedBy, user.uid],
                            }

                            // Si había dado dislike, quitarlo
                            if (dislikedBy.includes(user.uid)) {
                                updatedReview.dislikes = review.dislikes - 1
                                updatedReview.dislikedBy = dislikedBy.filter((id) => id !== user.uid)
                            }

                            return updatedReview
                        }
                    }
                    return review
                }),
            )
        } catch (error) {
            console.error("Error liking review:", error)
        }
    }

    const handleDislikeReview = async (reviewId: string) => {
        if (!user) {
            setError("Debes iniciar sesión para valorar reseñas")
            return
        }

        try {
            await dislikeReview(reviewId, user.uid)

            // Actualizar el estado local
            setReviews(
                reviews.map((review) => {
                    if (review.id === reviewId) {
                        const likedBy = review.likedBy || []
                        const dislikedBy = review.dislikedBy || []

                        // Si ya dio dislike, quitar el dislike
                        if (dislikedBy.includes(user.uid)) {
                            return {
                                ...review,
                                dislikes: review.dislikes - 1,
                                dislikedBy: dislikedBy.filter((id) => id !== user.uid),
                            }
                        }
                        // Si no ha dado dislike, añadir dislike y quitar like si existe
                        else {
                            const updatedReview = {
                                ...review,
                                dislikes: review.dislikes + 1,
                                dislikedBy: [...dislikedBy, user.uid],
                            }

                            // Si había dado like, quitarlo
                            if (likedBy.includes(user.uid)) {
                                updatedReview.likes = review.likes - 1
                                updatedReview.likedBy = likedBy.filter((id) => id !== user.uid)
                            }

                            return updatedReview
                        }
                    }
                    return review
                }),
            )
        } catch (error) {
            console.error("Error disliking review:", error)
        }
    }

    return (
        <div className="p-6 border-t border-gray-700">
            <h2 className="text-xl font-bold mb-4">Opiniones de los usuarios</h2>

            <div className="flex items-center mb-6">
                <div className="flex items-center mr-4">
                    <div className="text-4xl font-bold mr-2">{averageRating.toFixed(1)}</div>
                    <div className="flex flex-col">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= Math.round(averageRating) ? "text-yellow-500 fill-yellow-500" : "text-gray-500"}`}
                                />
                            ))}
                        </div>
                        <div className="text-sm text-gray-400">{reviewCount} opiniones</div>
                    </div>
                </div>
            </div>

            {/* Formulario para añadir opinión */}
            {user ? (
                <div className="mb-8 bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        {userHasReviewed ? "Editar tu opinión" : "Deja tu opinión"}
                    </h3>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-md flex items-center text-red-500">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-500/10 border border-green-500 rounded-md flex items-center text-green-500">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            {success}
                        </div>
                    )}

                    <div className="flex mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setUserRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="text-gray-500 hover:text-yellow-500 focus:outline-none"
                            >
                                <Star
                                    className={`w-6 h-6 ${star <= (hoverRating || userRating) ? "text-yellow-500 fill-yellow-500" : "text-gray-500"
                                        }`}
                                />
                            </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-400">
                            {userRating > 0 ? `${userRating} de 5 estrellas` : "Selecciona una calificación"}
                        </span>
                    </div>

                    <textarea
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        rows={3}
                        placeholder="Escribe tu opinión sobre este juego..."
                    ></textarea>

                    <div className="flex justify-between mt-2">
                        <button
                            onClick={handleSubmitReview}
                            disabled={submitting}
                            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Enviando..." : userHasReviewed ? "Actualizar opinión" : "Enviar opinión"}
                        </button>

                        {userHasReviewed && (
                            <button
                                onClick={() => handleDeleteReview(reviews.find((r) => r.userId === user.uid)?.id || "")}
                                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                            >
                                Eliminar
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="mb-8 bg-gray-700 p-4 rounded-lg text-center">
                    <p className="text-gray-400 mb-2">Inicia sesión para dejar tu opinión</p>
                    <a
                        href="/login"
                        className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                        Iniciar sesión
                    </a>
                </div>
            )}

            {/* Lista de opiniones */}
            {loading ? (
                <div className="text-center py-8">
                    <p className="text-gray-400">Cargando opiniones...</p>
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-8 bg-gray-700 rounded-lg">
                    <p className="text-gray-400">No hay opiniones todavía. ¡Sé el primero en opinar!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-gray-700 p-4 rounded-lg">
                            <div className="flex justify-between mb-2">
                                <div className="font-medium">{review.userName}</div>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-500"}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="text-sm text-gray-300 mb-2">{review.content}</div>
                            <div className="flex items-center justify-between text-xs text-gray-400">
                                <div>{new Date(review.date).toLocaleDateString()}</div>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => handleLikeReview(review.id || "")}
                                        className={`flex items-center hover:text-white transition-colors ${user && review.likedBy?.includes(user.uid) ? "text-green-500" : ""
                                            }`}
                                    >
                                        <ThumbsUp className="w-4 h-4 mr-1" />
                                        {review.likes}
                                    </button>
                                    <button
                                        onClick={() => handleDislikeReview(review.id || "")}
                                        className={`flex items-center hover:text-white transition-colors ${user && review.dislikedBy?.includes(user.uid) ? "text-red-500" : ""
                                            }`}
                                    >
                                        <ThumbsDown className="w-4 h-4 mr-1" />
                                        {review.dislikes}
                                    </button>

                                    {user && review.userId === user.uid && (
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => {
                                                    setUserRating(review.rating)
                                                    setReviewContent(review.content)
                                                    window.scrollTo({ top: 0, behavior: "smooth" })
                                                }}
                                                className="flex items-center hover:text-orange-500 transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteReview(review.id || "")}
                                                className="flex items-center hover:text-red-500 transition-colors"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}