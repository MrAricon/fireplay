"use client"

import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/motion"

export default function HowItWorks() {
    return (
        <section className="py-16 bg-gray-800/50">
            <div className="container mx-auto px-4">
                <AnimatedSection direction="up" className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Cómo funciona</h2>
                    <p className="text-gray-400 text-lg">
                        Comprar en Fireplay es rápido, seguro y sencillo. Sigue estos pasos para comenzar tu aventura.
                    </p>
                </AnimatedSection>

                <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <StaggerItem>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-white">1</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Crea tu cuenta</h3>
                            <p className="text-gray-400">
                                Regístrate en nuestra plataforma para acceder a todas las funcionalidades.
                            </p>
                        </div>
                    </StaggerItem>

                    <StaggerItem>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-white">2</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Explora el catálogo</h3>
                            <p className="text-gray-400">Navega por nuestro extenso catálogo y encuentra tus juegos favoritos.</p>
                        </div>
                    </StaggerItem>

                    <StaggerItem>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-white">3</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Añade al carrito</h3>
                            <p className="text-gray-400">Selecciona los juegos que deseas comprar y añádelos a tu carrito.</p>
                        </div>
                    </StaggerItem>

                    <StaggerItem>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-white">4</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Disfruta jugando</h3>
                            <p className="text-gray-400">Recibe tu clave al instante y comienza a jugar inmediatamente.</p>
                        </div>
                    </StaggerItem>
                </StaggerContainer>
            </div>
        </section>
    )
}