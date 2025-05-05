"use client"

import Link from "next/link"
import { AnimatedSection, StaggerContainer, StaggerItem, AnimatedButton } from "@/components/motion"

export default function HeroSection() {
    return (
        <div className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: "url('https://media-rockstargames-com.akamaized.net/mfe6/prod/__common/img/71d4d17edcd49703a5ea446cc0e588e6.jpg')",
                    backgroundPositionY: "-50px",
                    filter: "brightness(0.4)",
                }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/70 to-gray-900 z-10"></div>

            {/* Content */}
            <div className="container mx-auto px-4 z-20 text-center">
                <StaggerContainer>
                    <StaggerItem>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                            Descubre tu próxima aventura en{" "}
                            <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                                FIREPLAY
                            </span>
                        </h1>
                    </StaggerItem>
                    <StaggerItem>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                            La mejor selección de videojuegos al mejor precio. Explora, compra y juega sin límites.
                        </p>
                    </StaggerItem>
                    <StaggerItem>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <AnimatedButton className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300 text-lg">
                                <Link href="/games">Explorar juegos</Link>
                            </AnimatedButton>
                            <AnimatedButton className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300 text-lg border border-gray-600">
                                <Link href="/register">Crear cuenta</Link>
                            </AnimatedButton>
                        </div>
                    </StaggerItem>
                </StaggerContainer>
            </div>

            {/* Scroll Indicator */}
            <AnimatedSection
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce"
                direction="up"
                delay={1}
            >
                <svg className="w-6 h-6 text-white" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </AnimatedSection>
        </div>
    )
}