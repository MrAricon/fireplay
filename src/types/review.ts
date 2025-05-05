export interface Review {
    id?: string
    gameId: number
    userId: string
    userName: string
    userEmail?: string
    rating: number
    content: string
    date: string
    likes: number
    dislikes: number
    likedBy?: string[]
    dislikedBy?: string[]
}