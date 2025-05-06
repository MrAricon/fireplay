import type { Game } from "@/types/game"

export interface Genere {
    id: number,
    name: string,
    slug: string,
    games_count: number,
    image_background: string,
    games: Game[]
};