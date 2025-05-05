"use client"

import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/motion"

export default function AboutSection() {
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <AnimatedSection direction="up" className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">¿Qué es Fireplay?</h2>
                    <p className="text-gray-400 text-lg">
                        Fireplay es tu nueva plataforma de compra de videojuegos, diseñada para ofrecer la mejor experiencia a los
                        gamers más exigentes.
                    </p>
                </AnimatedSection>

                <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StaggerItem>
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Amplio catálogo</h3>
                            <p className="text-gray-400">
                                Accede a miles de juegos de todas las plataformas y géneros, desde los últimos lanzamientos AAA hasta
                                joyas indie.
                            </p>
                        </div>
                    </StaggerItem>

                    <StaggerItem>
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Mejores precios</h3>
                            <p className="text-gray-400">
                                Ofrecemos los precios más competitivos del mercado, con descuentos exclusivos y ofertas especiales para
                                nuestros usuarios.
                            </p>
                        </div>
                    </StaggerItem>

                    <StaggerItem>
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Entrega instantánea</h3>
                            <p className="text-gray-400">
                                Recibe tus claves de juego al instante después de la compra, sin esperas ni complicaciones.
                            </p>
                        </div>
                    </StaggerItem>
                </StaggerContainer>
            </div>
        </section>
    )
}