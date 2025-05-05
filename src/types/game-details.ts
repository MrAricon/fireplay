export interface GameDetails {
    id: number
    slug: string
    name: string
    name_original?: string
    description: string
    description_raw?: string
    metacritic?: number
    released?: string
    background_image: string
    background_image_additional?: string
    website?: string
    rating: number
    rating_top?: number
    ratings?: {
        id: number
        title: string
        count: number
        percent: number
    }[]
    playtime?: number
    screenshots_count?: number
    platforms?: {
        platform: {
            id: number
            name: string
            slug: string
        }
        released_at?: string
        requirements?: {
            minimum?: string
            recommended?: string
        }
    }[]
    developers?: {
        id: number
        name: string
        slug: string
    }[]
    genres?: {
        id: number
        name: string
        slug: string
    }[]
    tags?: {
        id: number
        name: string
        slug: string
    }[]
    publishers?: {
        id: number
        name: string
        slug: string
    }[]
    esrb_rating?: {
        id: number
        name: string
        slug: string
    }
}