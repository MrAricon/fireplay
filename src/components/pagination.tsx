import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
    currentPage: number
    totalPages: number
    baseUrl: string
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
    // Función para generar el rango de páginas a mostrar
    const getPageRange = () => {
        const range = []
        const maxPagesToShow = 5

        if (totalPages <= maxPagesToShow) {
            // Si hay menos páginas que el máximo a mostrar, mostrar todas
            for (let i = 1; i <= totalPages; i++) {
                range.push(i)
            }
        } else {
            // Siempre mostrar la primera página
            range.push(1)

            // Calcular el rango central
            let start = Math.max(2, currentPage - 1)
            let end = Math.min(totalPages - 1, currentPage + 1)

            // Ajustar si estamos cerca del inicio o final
            if (currentPage <= 3) {
                end = 4
            } else if (currentPage >= totalPages - 2) {
                start = totalPages - 3
            }

            // Añadir elipsis si es necesario
            if (start > 2) {
                range.push(-1) // -1 representa elipsis
            }

            // Añadir páginas del rango central
            for (let i = start; i <= end; i++) {
                range.push(i)
            }

            // Añadir elipsis si es necesario
            if (end < totalPages - 1) {
                range.push(-2) // -2 representa elipsis
            }

            // Siempre mostrar la última página
            range.push(totalPages)
        }

        return range
    }

    const pageRange = getPageRange()

    return (
        <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-1">
                {/* Botón Anterior */}
                {currentPage > 1 ? (
                    <Link
                        href={`${baseUrl}?page=${currentPage - 1}`}
                        className="px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
                        aria-label="Página anterior"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                ) : (
                    <button
                        disabled
                        className="px-3 py-2 rounded-md bg-gray-800 opacity-50 cursor-not-allowed"
                        aria-label="Página anterior"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                )}

                {/* Números de página */}
                {pageRange.map((page, index) => {
                    // Si es elipsis
                    if (page < 0) {
                        return (
                            <span key={`ellipsis-${index}`} className="px-3 py-2">
                                ...
                            </span>
                        )
                    }

                    // Si es la página actual
                    if (page === currentPage) {
                        return (
                            <span
                                key={page}
                                className="px-3 py-2 rounded-md bg-orange-600 text-white font-medium"
                                aria-current="page"
                            >
                                {page}
                            </span>
                        )
                    }

                    // Si es otra página
                    return (
                        <Link
                            key={page}
                            href={`${baseUrl}?page=${page}`}
                            className="px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        >
                            {page}
                        </Link>
                    )
                })}

                {/* Botón Siguiente */}
                {currentPage < totalPages ? (
                    <Link
                        href={`${baseUrl}?page=${currentPage + 1}`}
                        className="px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
                        aria-label="Página siguiente"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                ) : (
                    <button
                        disabled
                        className="px-3 py-2 rounded-md bg-gray-800 opacity-50 cursor-not-allowed"
                        aria-label="Página siguiente"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    )
}