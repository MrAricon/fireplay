"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/firebase/firebase"

export default function ContactPage() {
    const { user } = useAuth()
    const [name, setName] = useState(user?.displayName || "")
    const [email, setEmail] = useState(user?.email || "")
    const [message, setMessage] = useState("")
    const [subject, setSubject] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name || !email || !message) {
            setError("Por favor, completa todos los campos obligatorios")
            return
        }

        try {
            setLoading(true)
            setError("")

            // Guardar mensaje en Firestore
            await addDoc(collection(db, "messages"), {
                name,
                email,
                subject,
                message,
                userId: user?.uid || null,
                createdAt: new Date().toISOString(),
            })

            // Mostrar mensaje de éxito
            setSuccess(true)

            // Limpiar formulario
            if (!user) {
                setName("")
                setEmail("")
            }
            setSubject("")
            setMessage("")

            // Ocultar mensaje de éxito después de 5 segundos
            setTimeout(() => {
                setSuccess(false)
            }, 5000)
        } catch (error) {
            console.error("Error sending message:", error)
            setError("Error al enviar el mensaje. Inténtalo de nuevo más tarde.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-24">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2">Contacto</h1>
                    <p className="text-gray-400">¿Tienes alguna pregunta o sugerencia? Estamos aquí para ayudarte.</p>
                </div>

                {success && (
                    <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-md mb-6">
                        ¡Mensaje enviado con éxito! Nos pondremos en contacto contigo lo antes posible.
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md mb-6">{error}</div>
                )}

                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                                    Nombre <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Tu nombre"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                                Asunto
                            </label>
                            <input
                                id="subject"
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Asunto de tu mensaje"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                                Mensaje <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="message"
                                rows={6}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Escribe tu mensaje aquí..."
                                required
                            ></textarea>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Enviando..." : "Enviar mensaje"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-6 rounded-lg text-center">
                        <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="font-medium mb-2">Email</h3>
                        <p className="text-gray-400">soporte@fireplay.com</p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg text-center">
                        <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                            </svg>
                        </div>
                        <h3 className="font-medium mb-2">Teléfono</h3>
                        <p className="text-gray-400">+34 900 123 456</p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg text-center">
                        <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="font-medium mb-2">Dirección</h3>
                        <p className="text-gray-400">Calle Ejemplo 123, 28001 Madrid</p>
                    </div>
                </div>
            </div>
        </div>
    )
}