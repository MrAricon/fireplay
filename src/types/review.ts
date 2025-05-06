import type { Like } from "@/types/like"

export interface Review {
    id?: string
    gameId: number
    userId: string
    userName: string
    userEmail?: string
    rating: number
    content: string
    date: string
    likes: Like
}