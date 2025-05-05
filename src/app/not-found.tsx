"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Home, Search } from "lucide-react"
import { AnimatedButton } from "@/components/motion"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gray-900">
      <div className="max-w-md w-full text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Animated 404 Text */}
          <motion.h1
            className="text-9xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 200,
              damping: 10,
            }}
          >
            404
          </motion.h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <h2 className="text-3xl font-bold mt-4 mb-2 text-white">Página no encontrada</h2>
            <p className="text-gray-400 mb-8">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
          </motion.div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <AnimatedButton className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center">
              <Link href="/" className="flex items-center">
                <Home className="w-5 h-5 mr-2" />
                Volver al inicio
              </Link>
            </AnimatedButton>

            <AnimatedButton className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 border border-gray-700 flex items-center justify-center">
              <Link href="/search" className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Buscar juegos
              </Link>
            </AnimatedButton>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
