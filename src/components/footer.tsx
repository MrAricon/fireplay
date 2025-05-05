import Link from "next/link"
import { Facebook, Twitter, Instagram, GitlabIcon as GitHub } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-gray-800 border-t border-gray-700">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                            FIREPLAY
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Tu destino para descubrir y comprar los mejores videojuegos al mejor precio.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-medium mb-4">Enlaces</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link href="/games" className="text-gray-400 hover:text-white transition-colors">
                                    Juegos
                                </Link>
                            </li>
                            <li>
                                <Link href="/search" className="text-gray-400 hover:text-white transition-colors">
                                    Buscar
                                </Link>
                            </li>
                            <li>
                                <Link href="/info" className="text-gray-400 hover:text-white transition-colors">
                                    Información
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-medium mb-4">Cuenta</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                                    Iniciar sesión
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" className="text-gray-400 hover:text-white transition-colors">
                                    Registrarse
                                </Link>
                            </li>
                            <li>
                                <Link href="/favorites" className="text-gray-400 hover:text-white transition-colors">
                                    Favoritos
                                </Link>
                            </li>
                            <li>
                                <Link href="/cart" className="text-gray-400 hover:text-white transition-colors">
                                    Carrito
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-medium mb-4">Contacto</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                                    Formulario de contacto
                                </Link>
                            </li>
                            <li className="text-gray-400">soporte@fireplay.com</li>
                            <li>
                                <div className="flex space-x-4 mt-4">
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        <GitHub className="w-5 h-5" />
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Fireplay. Todos los derechos reservados.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                            Privacidad
                        </Link>
                        <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                            Términos
                        </Link>
                        <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}