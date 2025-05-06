"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Filter, ChevronDown, ChevronUp } from "lucide-react"
import type { Genere } from "@/types/genere"
import type { Platform } from "@/types/platform"


interface SearchFiltersProps {
  genres: Genere[]
  platforms: Platform[]
  currentGenre: string
  currentPlatform: string
  currentOrdering: string
  query: string
}

export default function SearchFilters({
  genres,
  platforms,
  currentGenre,
  currentPlatform,
  currentOrdering,
  query,
}: SearchFiltersProps) {
  const router = useRouter()
  const [showGenres, setShowGenres] = useState(true)
  const [showPlatforms, setShowPlatforms] = useState(true)
  const [showOrdering, setShowOrdering] = useState(true)

  const handleFilterChange = (type: string, value: string) => {
    let url = "/search?"

    // Mantener la consulta de búsqueda
    if (query) {
      url += `query=${encodeURIComponent(query)}&`
    }

    // Actualizar filtros
    if (type === "genre") {
      if (value) url += `genre=${value}&`
      if (currentPlatform) url += `platform=${currentPlatform}&`
      if (currentOrdering) url += `ordering=${currentOrdering}&`
    } else if (type === "platform") {
      if (currentGenre) url += `genre=${currentGenre}&`
      if (value) url += `platform=${value}&`
      if (currentOrdering) url += `ordering=${currentOrdering}&`
    } else if (type === "ordering") {
      if (currentGenre) url += `genre=${currentGenre}&`
      if (currentPlatform) url += `platform=${currentPlatform}&`
      if (value) url += `ordering=${value}&`
    }

    // Eliminar el último & si existe
    url = url.endsWith("&") ? url.slice(0, -1) : url

    router.push(url)
  }

  const clearFilters = () => {
    let url = "/search"
    if (query) {
      url += `?query=${encodeURIComponent(query)}`
    }
    router.push(url)
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filtros
        </h3>
        {(currentGenre || currentPlatform || currentOrdering !== "-rating") && (
          <button onClick={clearFilters} className="text-sm text-orange-500 hover:text-orange-400">
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Ordenar por */}
      <div className="mb-4 border-b border-gray-700 pb-4">
        <button
          onClick={() => setShowOrdering(!showOrdering)}
          className="flex items-center justify-between w-full font-medium mb-2"
        >
          <span>Ordenar por</span>
          {showOrdering ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showOrdering && (
          <div className="space-y-2 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="ordering"
                value="-rating"
                checked={currentOrdering === "-rating"}
                onChange={() => handleFilterChange("ordering", "-rating")}
                className="mr-2"
              />
              <span className="text-sm">Mejor valorados</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="ordering"
                value="-released"
                checked={currentOrdering === "-released"}
                onChange={() => handleFilterChange("ordering", "-released")}
                className="mr-2"
              />
              <span className="text-sm">Más recientes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="ordering"
                value="name"
                checked={currentOrdering === "name"}
                onChange={() => handleFilterChange("ordering", "name")}
                className="mr-2"
              />
              <span className="text-sm">Alfabético (A-Z)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="ordering"
                value="-name"
                checked={currentOrdering === "-name"}
                onChange={() => handleFilterChange("ordering", "-name")}
                className="mr-2"
              />
              <span className="text-sm">Alfabético (Z-A)</span>
            </label>
          </div>
        )}
      </div>

      {/* Géneros */}
      <div className="mb-4 border-b border-gray-700 pb-4">
        <button
          onClick={() => setShowGenres(!showGenres)}
          className="flex items-center justify-between w-full font-medium mb-2"
        >
          <span>Géneros</span>
          {showGenres ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showGenres && (
          <div className="space-y-2 mt-2 max-h-60 overflow-y-auto pr-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="genre"
                value=""
                checked={!currentGenre}
                onChange={() => handleFilterChange("genre", "")}
                className="mr-2"
              />
              <span className="text-sm">Todos los géneros</span>
            </label>
            {genres.map((genre) => (
              <label key={genre.id} className="flex items-center">
                <input
                  type="radio"
                  name="genre"
                  value={genre.id}
                  checked={currentGenre === genre.id.toString()}
                  onChange={() => handleFilterChange("genre", genre.id.toString())}
                  className="mr-2"
                />
                <span className="text-sm">{genre.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Plataformas */}
      <div className="mb-4">
        <button
          onClick={() => setShowPlatforms(!showPlatforms)}
          className="flex items-center justify-between w-full font-medium mb-2"
        >
          <span>Plataformas</span>
          {showPlatforms ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showPlatforms && (
          <div className="space-y-2 mt-2 max-h-60 overflow-y-auto pr-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="platform"
                value=""
                checked={!currentPlatform}
                onChange={() => handleFilterChange("platform", "")}
                className="mr-2"
              />
              <span className="text-sm">Todas las plataformas</span>
            </label>
            {platforms.map((platform) => (
              <label key={platform.id} className="flex items-center">
                <input
                  type="radio"
                  name="platform"
                  value={platform.id}
                  checked={currentPlatform === platform.id.toString()}
                  onChange={() => handleFilterChange("platform", platform.id.toString())}
                  className="mr-2"
                />
                <span className="text-sm">{platform.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}