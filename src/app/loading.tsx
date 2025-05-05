"use client"

import { motion } from "framer-motion"

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gray-900">
            <div className="text-center">
                <motion.div
                    className="inline-block"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                    }}
                >
                    <svg className="w-16 h-16 text-orange-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                </motion.div>
                <h2 className="text-2xl font-bold mt-6 mb-2 text-white">Cargando...</h2>
                <p className="text-gray-400">Estamos preparando todo para ti</p>
            </div>
        </div>
    )
}