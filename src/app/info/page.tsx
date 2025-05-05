export default function InfoPage() {
    return (
        <div className="container mx-auto px-4 py-24">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2">Información del proyecto</h1>
                    <p className="text-gray-400">Todo lo que necesitas saber sobre Fireplay</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
                    <h2 className="text-xl font-bold mb-4">¿Qué es Fireplay?</h2>
                    <p className="text-gray-300 mb-4">
                        Fireplay es una aplicación web moderna que simula una tienda de videojuegos online. Ha sido desarrollada
                        como proyecto educativo para demostrar el uso de tecnologías modernas en el desarrollo web.
                    </p>
                    <p className="text-gray-300">
                        La aplicación permite a los usuarios explorar un catálogo de videojuegos, buscar juegos específicos, ver
                        detalles de cada juego, añadir juegos a favoritos y al carrito de compra, y mucho más.
                    </p>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
                    <h2 className="text-xl font-bold mb-4">Tecnologías utilizadas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h3 className="font-medium mb-2">Frontend</h3>
                            <ul className="list-disc list-inside text-gray-300 space-y-1">
                                <li>Next.js 15</li>
                                <li>React 19</li>
                                <li>Tailwind CSS 4</li>
                                <li>TypeScript</li>
                            </ul>
                        </div>

                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h3 className="font-medium mb-2">Backend</h3>
                            <ul className="list-disc list-inside text-gray-300 space-y-1">
                                <li>Firebase Authentication</li>
                                <li>Firestore Database</li>
                                <li>RAWG API</li>
                                <li>Next.js API Routes</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
                    <h2 className="text-xl font-bold mb-4">Funcionalidades principales</h2>
                    <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start">
                            <svg
                                className="w-5 h-5 text-orange-500 mr-2 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Autenticación de usuarios (registro e inicio de sesión)</span>
                        </li>
                        <li className="flex items-start">
                            <svg
                                className="w-5 h-5 text-orange-500 mr-2 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Catálogo de juegos con información detallada</span>
                        </li>
                        <li className="flex items-start">
                            <svg
                                className="w-5 h-5 text-orange-500 mr-2 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Búsqueda de juegos por nombre</span>
                        </li>
                        <li className="flex items-start">
                            <svg
                                className="w-5 h-5 text-orange-500 mr-2 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Gestión de favoritos (añadir/eliminar)</span>
                        </li>
                        <li className="flex items-start">
                            <svg
                                className="w-5 h-5 text-orange-500 mr-2 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Carrito de compra con persistencia</span>
                        </li>
                        <li className="flex items-start">
                            <svg
                                className="w-5 h-5 text-orange-500 mr-2 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Formulario de contacto</span>
                        </li>
                        <li className="flex items-start">
                            <svg
                                className="w-5 h-5 text-orange-500 mr-2 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Diseño responsive para todos los dispositivos</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Objetivos del proyecto</h2>
                    <p className="text-gray-300 mb-4">
                        El objetivo principal de Fireplay es demostrar la implementación de una aplicación web moderna y funcional
                        utilizando las últimas tecnologías del desarrollo web. Algunos objetivos específicos incluyen:
                    </p>
                    <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start">
                            <svg
                                className="w-5 h-5 text-orange-500 mr-2 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Crear una interfaz de usuario atractiva y fácil de usar</span>
                        </li>
                        <li className="flex items-start">
                            <svg
                                className="w-5 h-5 text-orange-500 mr-2 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Implementar un sistema de autenticación seguro</span>
                        </li>
                        <li className="flex items-start">
                            <svg
                                className="w-5 h-5 text-orange-500 mr-2 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Integrar una API externa para obtener datos reales</span>
                        </li>
                        <li className="flex items-start">
                            <svg
                                className="w-5 h-5 text-orange-500 mr-2 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Desarrollar una aplicación escalable y mantenible</span>
                        </li>
                        <li className="flex items-start">
                            <svg
                                className="w-5 h-5 text-orange-500 mr-2 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Proporcionar una experiencia de usuario fluida y responsive</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}  