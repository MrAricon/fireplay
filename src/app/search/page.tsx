import { searchGames, getGenres, getPlatforms } from "@/lib/api"
import GameCard from "@/components/game-card"
import Pagination from "@/components/pagination"
import SearchAutocomplete from "@/components/search-autocomplete"
import SearchFilters from "@/components/search-filters"
import type { Game } from "@/types/game"

export default async function SearchPage({
    searchParams,
}: {
    searchParams: { query?: string; page?: string; genre?: string; platform?: string; ordering?: string }
}) {
    const query = searchParams.query || ""
    const currentPage = searchParams.page ? Number.parseInt(searchParams.page) : 1
    const genreFilter = searchParams.genre || ""
    const platformFilter = searchParams.platform || ""
    const orderingFilter = searchParams.ordering || "-rating"
    const pageSize = 20

    // Obtener datos para los filtros
    const genres = await getGenres()
    const platforms = await getPlatforms()

    // Realizar búsqueda con filtros
    const { games, count } = await searchGames(query, currentPage, pageSize)
    const totalPages = Math.ceil(count / pageSize)

    return (
        <div className="container mx-auto px-4 py-24">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Búsqueda de juegos</h1>
                {query ? (
                    <p className="text-gray-400">
                        Resultados para: <span className="text-white font-medium">"{query}"</span>
                    </p>
                ) : (
                    <p className="text-gray-400">Utiliza la barra de búsqueda para encontrar juegos</p>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filtros */}
                <div className="lg:col-span-1">
                    <SearchFilters
                        genres={genres}
                        platforms={platforms}
                        currentGenre={genreFilter}
                        currentPlatform={platformFilter}
                        currentOrdering={orderingFilter}
                        query={query}
                    />
                </div>

                {/* Resultados */}
                <div className="lg:col-span-3">
                    <div className="mb-6">
                        <SearchAutocomplete />
                    </div>

                    {query && games.length === 0 && (
                        <div className="text-center py-12 bg-gray-800 rounded-lg">
                            <p className="text-xl text-gray-400">No se encontraron resultados para "{query}"</p>
                            <p className="mt-2 text-gray-500">Intenta con otra búsqueda o ajusta los filtros</p>
                        </div>
                    )}

                    {query && games.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {games.map((game: Game) => (
                                    <GameCard key={game.id} game={game} />
                                ))}
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                baseUrl={`/search?query=${query}${genreFilter ? `&genre=${genreFilter}` : ""}${platformFilter ? `&platform=${platformFilter}` : ""}${orderingFilter ? `&ordering=${orderingFilter}` : ""}`}
                            />
                        </>
                    )}

                    {!query && (
                        <div className="text-center py-12 bg-gray-800 rounded-lg">
                            <p className="text-xl text-gray-400 mb-4">Busca tus juegos favoritos</p>
                            <p className="text-gray-500 mb-6">Utiliza la barra de búsqueda y los filtros para encontrar juegos</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}