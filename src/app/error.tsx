"use client"

import { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, RefreshCw } from "lucide-react"
import { AnimatedButton } from "@/components/motion"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gray-900">
            <div className="max-w-md w-full text-center">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    {/* Animated Error Icon */}
                    <motion.div
                        className="mx-auto mb-6 bg-red-500/10 w-24 h-24 rounded-full flex items-center justify-center"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{
                            duration: 0.5,
                            type: "spring",
                            stiffness: 200,
                            damping: 10,
                        }}
                    >
                        <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
                        <h2 className="text-3xl font-bold mt-4 mb-2 text-white">Algo salió mal</h2>
                        <p className="text-gray-400 mb-8">
                            Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta de nuevo más tarde.
                        </p>
                    </motion.div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <AnimatedButton
                            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
                            onClick={() => reset()}
                        >
                            <RefreshCw className="w-5 h-5 mr-2" />
                            Intentar de nuevo
                        </AnimatedButton>

                        <AnimatedButton className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 border border-gray-700 flex items-center justify-center">
                            <Link href="/" className="flex items-center">
                                <Home className="w-5 h-5 mr-2" />
                                Volver al inicio
                            </Link>
                        </AnimatedButton>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}