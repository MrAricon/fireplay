export interface Game {
    id: number
    slug: string
    name: string
    released?: string
    background_image: string
    rating: number
    genres?: { id: number; name: string; slug: string }[]
    platforms?: { platform: { id: number; name: string; slug: string } }[]
}  