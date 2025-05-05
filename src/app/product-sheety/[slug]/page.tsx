import { getGameDetails } from "@/lib/api"
import Link from "next/link"
import { notFound } from "next/navigation"
import ProductSheet from "@/components/product-sheet"

export default async function ProductSheetPage({ params }: { params: { slug: string } }) {
    const game = await getGameDetails(params.slug)

    if (!game) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-24">
            <div className="mb-4">
                <Link href={`/game/${params.slug}`} className="text-orange-500 hover:text-orange-400 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver al juego
                </Link>
            </div>

            <ProductSheet game={game} />
        </div>
    )
}