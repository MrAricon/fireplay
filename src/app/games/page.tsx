import { getPopularGames } from "@/lib/api"
import GameCard from "@/components/game-card"
import Pagination from "@/components/pagination"
import type { Game } from "@/types/game"

export default async function GamesPage({
    searchParams,
}: {
    searchParams: { page?: string }
}) {
    const currentPage = searchParams.page ? Number.parseInt(searchParams.page) : 1
    const pageSize = 12

    const { games, count } = await getPopularGames(currentPage, pageSize)
    const totalPages = Math.ceil(count / pageSize)

    return (
        <div className="container mx-auto px-4 py-24">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Catálogo de juegos</h1>
                <p className="text-gray-400">Explora nuestra selección de los mejores videojuegos</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {games.map((game: Game) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/games" />
        </div>
    )
}