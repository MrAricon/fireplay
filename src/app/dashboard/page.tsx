"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/firebase/firebase"
import { useAuth } from "@/context/auth-context"
import type { Game } from "@/types/game"
import type { Message } from "@/types/message"
import type { CartItem } from "@/lib/cart"
import Link from "next/link"
import { User, Settings, Heart, ShoppingCart, MessageCircle, Clock } from 'lucide-react'

export default function DashboardPage() {
    const [favorites, setFavorites] = useState<Game[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("profile");
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Redirigir si no hay usuario autenticado
        if (!user && !loading) {
            router.push("/login");
            return;
        }

        const fetchUserData = async () => {
            if (!user) return;

            try {
                // Obtener favoritos
                const favoritesRef = collection(db, "users", user.uid, "favorites");
                const favoritesSnapshot = await getDocs(favoritesRef);

                const favoritesData: Game[] = [];
                favoritesSnapshot.forEach((doc) => {
                    favoritesData.push(doc.data() as Game);
                });

                setFavorites(favoritesData);

                // Obtener carrito
                const cartRef = collection(db, "users", user.uid, "cart");
                const cartSnapshot = await getDocs(cartRef);

                const cartData: CartItem[] = [];
                cartSnapshot.forEach((doc) => {
                    cartData.push(doc.data() as CartItem);
                });

                setCartItems(cartData);

                // Obtener mensajes
                const messagesRef = collection(db, "messages");
                const messagesSnapshot = await getDocs(messagesRef);

                const messagesData: Message[] = [];
                messagesSnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.userId === user.uid) {
                        messagesData.push({
                            id: doc.id,
                            createdAt: "",
                            email: "",
                            name: "",
                            subject: "",
                            message: "",
                            userId: ""
                        });
                    }
                });

                setMessages(messagesData);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user, router, loading]);

    const handleSaveSettings = () => {
        // Aquí iría la lógica para guardar los ajustes
        alert("Ajustes guardados correctamente");
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-24">
                <div className="text-center py-12">
                    <p className="text-xl text-gray-400">Cargando datos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-24">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Panel de usuario</h1>
                <p className="text-gray-400">Gestiona tu cuenta y revisa tu actividad</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                        <div className="p-6 text-center border-b border-gray-700">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl font-bold">
                                    {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold">{user?.displayName || "Usuario"}</h2>
                            <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
                        </div>

                        <div className="p-4">
                            <nav className="space-y-1">
                                <button
                                    onClick={() => setActiveTab("profile")}
                                    className={`w-full flex items-center px-4 py-2 rounded-md transition-colors ${activeTab === "profile" ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"
                                        }`}
                                >
                                    <User className="w-5 h-5 mr-3" />
                                    <span>Perfil</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab("favorites")}
                                    className={`w-full flex items-center px-4 py-2 rounded-md transition-colors ${activeTab === "favorites" ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"
                                        }`}
                                >
                                    <Heart className="w-5 h-5 mr-3" />
                                    <span>Favoritos</span>
                                    <span className="ml-auto bg-gray-600 text-xs px-2 py-1 rounded-full">{favorites.length}</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab("cart")}
                                    className={`w-full flex items-center px-4 py-2 rounded-md transition-colors ${activeTab === "cart" ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"
                                        }`}
                                >
                                    <ShoppingCart className="w-5 h-5 mr-3" />
                                    <span>Carrito</span>
                                    <span className="ml-auto bg-gray-600 text-xs px-2 py-1 rounded-full">{cartItems.length}</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab("messages")}
                                    className={`w-full flex items-center px-4 py-2 rounded-md transition-colors ${activeTab === "messages" ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"
                                        }`}
                                >
                                    <MessageCircle className="w-5 h-5 mr-3" />
                                    <span>Mensajes</span>
                                    <span className="ml-auto bg-gray-600 text-xs px-2 py-1 rounded-full">{messages.length}</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab("settings")}
                                    className={`w-full flex items-center px-4 py-2 rounded-md transition-colors ${activeTab === "settings" ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"
                                        }`}
                                >
                                    <Settings className="w-5 h-5 mr-3" />
                                    <span>Ajustes</span>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <div>
                                <h2 className="text-xl font-bold mb-6">Información de perfil</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Nombre</label>
                                        <div className="bg-gray-700 px-4 py-2 rounded-md">
                                            {user?.displayName || "No especificado"}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                        <div className="bg-gray-700 px-4 py-2 rounded-md">
                                            {user?.email}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Fecha de registro</label>
                                        <div className="bg-gray-700 px-4 py-2 rounded-md">
                                            {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "No disponible"}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Último inicio de sesión</label>
                                        <div className="bg-gray-700 px-4 py-2 rounded-md">
                                            {user?.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : "No disponible"}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-700 pt-6 mt-6">
                                    <h3 className="font-medium mb-4">Estadísticas de uso</h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="bg-gray-700 p-4 rounded-lg text-center">
                                            <div className="text-2xl font-bold text-orange-500 mb-1">{favorites.length}</div>
                                            <div className="text-sm text-gray-400">Juegos favoritos</div>
                                        </div>

                                        <div className="bg-gray-700 p-4 rounded-lg text-center">
                                            <div className="text-2xl font-bold text-orange-500 mb-1">{cartItems.length}</div>
                                            <div className="text-sm text-gray-400">Juegos en carrito</div>
                                        </div>

                                        <div className="bg-gray-700 p-4 rounded-lg text-center">
                                            <div className="text-2xl font-bold text-orange-500 mb-1">{messages.length}</div>
                                            <div className="text-sm text-gray-400">Mensajes enviados</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Favorites Tab */}
                        {activeTab === "favorites" && (
                            <div>
                                <h2 className="text-xl font-bold mb-6">Mis favoritos</h2>

                                {favorites.length === 0 ? (
                                    <div className="text-center py-8 bg-gray-700 rounded-lg">
                                        <Heart className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                        <p className="text-gray-400 mb-4">No tienes juegos favoritos</p>
                                        <Link
                                            href="/games"
                                            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-md transition-colors inline-block"
                                        >
                                            Explorar juegos
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {favorites.map((game) => (
                                            <Link key={game.id} href={`/game/${game.slug}`}>
                                                <div className="bg-gray-700 rounded-lg overflow-hidden flex hover:bg-gray-600 transition-colors">
                                                    <img
                                                        src={game.background_image || '/placeholder.svg?height=80&width=80'}
                                                        alt={game.name}
                                                        className="w-20 h-20 object-cover"
                                                    />
                                                    <div className="p-3 flex-grow">
                                                        <h3 className="font-medium line-clamp-1">{game.name}</h3>
                                                        <div className="flex items-center mt-1">
                                                            <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                            <span className="text-sm text-gray-400">{game.rating?.toFixed(1) || "N/A"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Cart Tab */}
                        {activeTab === "cart" && (
                            <div>
                                <h2 className="text-xl font-bold mb-6">Mi carrito</h2>

                                {cartItems.length === 0 ? (
                                    <div className="text-center py-8 bg-gray-700 rounded-lg">
                                        <ShoppingCart className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                        <p className="text-gray-400 mb-4">Tu carrito está vacío</p>
                                        <Link
                                            href="/games"
                                            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-md transition-colors inline-block"
                                        >
                                            Explorar juegos
                                        </Link>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="space-y-4 mb-6">
                                            {cartItems.map((item) => (
                                                <div key={item.id} className="bg-gray-700 rounded-lg overflow-hidden flex">
                                                    <img
                                                        src={item.background_image || '/placeholder.svg?height=80&width=80'}
                                                        alt={item.name}
                                                        className="w-20 h-20 object-cover"
                                                    />
                                                    <div className="p-3 flex-grow flex justify-between items-center">
                                                        <div>
                                                            <h3 className="font-medium line-clamp-1">{item.name}</h3>
                                                            <div className="text-sm text-gray-400 mt-1">
                                                                Cantidad: {item.quantity}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                                                            <div className="text-xs text-gray-400">${item.price.toFixed(2)} por unidad</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-gray-700 p-4 rounded-lg">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-400">Subtotal</span>
                                                <span>
                                                    ${cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                                                </span>
                                            </div>

                                            <div className="border-t border-gray-600 pt-2 mt-2 flex justify-between font-medium">
                                                <span>Total</span>
                                                <span>
                                                    ${cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-4 text-center">
                                            <Link
                                                href="/cart"
                                                className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-md transition-colors inline-block"
                                            >
                                                Ver carrito completo
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Messages Tab */}
                        {activeTab === "messages" && (
                            <div>
                                <h2 className="text-xl font-bold mb-6">Mis mensajes</h2>

                                {messages.length === 0 ? (
                                    <div className="text-center py-8 bg-gray-700 rounded-lg">
                                        <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                        <p className="text-gray-400 mb-4">No has enviado ningún mensaje</p>
                                        <Link
                                            href="/contact"
                                            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-md transition-colors inline-block"
                                        >
                                            Contactar
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {messages.map((message) => (
                                            <div key={message.id} className="bg-gray-700 p-4 rounded-lg">
                                                <div className="flex justify-between mb-2">
                                                    <h3 className="font-medium">{message.subject || "Sin asunto"}</h3>
                                                    <div className="text-sm text-gray-400 flex items-center">
                                                        <Clock className="w-4 h-4 mr-1" />
                                                        {new Date(message.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <p className="text-gray-300 text-sm mb-2">{message.message}</p>
                                                <div className="text-xs text-gray-400">
                                                    Enviado desde: {message.email}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === "settings" && (
                            <div>
                                <h2 className="text-xl font-bold mb-6">Ajustes de cuenta</h2>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-medium mb-4">Información personal</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                                                    Nombre
                                                </label>
                                                <input
                                                    id="name"
                                                    type="text"
                                                    defaultValue={user?.displayName || ""}
                                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    placeholder="Tu nombre"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                                                    Email
                                                </label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    defaultValue={user?.email || ""}
                                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    placeholder="tu@email.com"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-700 pt-6">
                                        <h3 className="font-medium mb-4">Cambiar contraseña</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="current-password" className="block text-sm font-medium text-gray-400 mb-1">
                                                    Contraseña actual
                                                </label>
                                                <input
                                                    id="current-password"
                                                    type="password"
                                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    placeholder="••••••••"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="new-password" className="block text-sm font-medium text-gray-400 mb-1">
                                                    Nueva contraseña
                                                </label>
                                                <input
                                                    id="new-password"
                                                    type="password"
                                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-700 pt-6">
                                        <h3 className="font-medium mb-4">Preferencias</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <input
                                                    id="newsletter"
                                                    type="checkbox"
                                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-700 rounded bg-gray-900"
                                                />
                                                <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-400">
                                                    Recibir notificaciones por email
                                                </label>
                                            </div>

                                            <div className="flex items-center">
                                                <input
                                                    id="marketing"
                                                    type="checkbox"
                                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-700 rounded bg-gray-900"
                                                />
                                                <label htmlFor="marketing" className="ml-2 block text-sm text-gray-400">
                                                    Recibir ofertas y promociones
                                                </label>
                                            </div>

                                            <div className="flex items-center">
                                                <input
                                                    id="dark-mode"
                                                    type="checkbox"
                                                    defaultChecked
                                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-700 rounded bg-gray-900"
                                                />
                                                <label htmlFor="dark-mode" className="ml-2 block text-sm text-gray-400">
                                                    Modo oscuro
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-700 pt-6">
                                        <h3 className="font-medium mb-4">Privacidad</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <input
                                                    id="profile-visibility"
                                                    type="checkbox"
                                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-700 rounded bg-gray-900"
                                                />
                                                <label htmlFor="profile-visibility" className="ml-2 block text-sm text-gray-400">
                                                    Perfil público
                                                </label>
                                            </div>

                                            <div className="flex items-center">
                                                <input
                                                    id="activity-visibility"
                                                    type="checkbox"
                                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-700 rounded bg-gray-900"
                                                />
                                                <label htmlFor="activity-visibility" className="ml-2 block text-sm text-gray-400">
                                                    Mostrar actividad reciente
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            onClick={handleSaveSettings}
                                            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                                        >
                                            Guardar cambios
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}