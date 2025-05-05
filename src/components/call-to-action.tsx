"use client"

import Link from "next/link"
import { AnimatedSection, AnimatedButton } from "@/components/motion"

export default function CallToAction() {
    return (
        <section className="py-16 relative">
            {/* Background with overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: "/image2.webp')",
                    filter: "brightness(0.3)",
                }}
            />

            <div className="container mx-auto px-4 relative z-10">
                <AnimatedSection direction="up" className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para comenzar tu aventura?</h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Únete a miles de jugadores que ya disfrutan de los mejores juegos al mejor precio.
                    </p>
                    <AnimatedButton className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300 text-lg inline-block">
                        <Link href="/games">Explorar juegos</Link>
                    </AnimatedButton>
                </AnimatedSection>
            </div>
        </section>
    )
}