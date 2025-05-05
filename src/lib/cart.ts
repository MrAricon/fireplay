"use client"

import { doc, setDoc, getDoc, deleteDoc, collection, getDocs } from "firebase/firestore"
import { db } from "@/firebase/firebase"
import type { Game } from "@/types/game"

// Tipo para los elementos del carrito
export interface CartItem {
    id: number
    name: string
    slug: string
    background_image: string
    price: number
    quantity: number
}

// Función para añadir un juego al carrito (Firestore)
export async function addToCartFirestore(userId: string, game: Game, price: number): Promise<void> {
    try {
        const cartRef = doc(db, "users", userId, "cart", game.id.toString())
        const docSnap = await getDoc(cartRef)

        if (docSnap.exists()) {
            // Si ya existe, incrementar la cantidad
            const currentItem = docSnap.data() as CartItem
            await setDoc(cartRef, {
                ...currentItem,
                quantity: currentItem.quantity + 1,
            })
        } else {
            // Si no existe, crear nuevo item
            await setDoc(cartRef, {
                id: game.id,
                name: game.name,
                slug: game.slug,
                background_image: game.background_image,
                price: price,
                quantity: 1,
            })
        }
    } catch (error) {
        console.error("Error adding to cart:", error)
        throw error
    }
}

// Función para eliminar un juego del carrito (Firestore)
export async function removeFromCartFirestore(userId: string, gameId: number): Promise<void> {
    try {
        const cartRef = doc(db, "users", userId, "cart", gameId.toString())
        await deleteDoc(cartRef)
    } catch (error) {
        console.error("Error removing from cart:", error)
        throw error
    }
}

// Función para obtener el carrito (Firestore)
export async function getCartFirestore(userId: string): Promise<CartItem[]> {
    try {
        const cartRef = collection(db, "users", userId, "cart")
        const querySnapshot = await getDocs(cartRef)

        const cartItems: CartItem[] = []
        querySnapshot.forEach((doc) => {
            cartItems.push(doc.data() as CartItem)
        })

        return cartItems
    } catch (error) {
        console.error("Error getting cart:", error)
        return []
    }
}

// Función para actualizar la cantidad de un item en el carrito (Firestore)
export async function updateCartItemQuantityFirestore(userId: string, gameId: number, quantity: number): Promise<void> {
    try {
        if (quantity <= 0) {
            await removeFromCartFirestore(userId, gameId)
            return
        }

        const cartRef = doc(db, "users", userId, "cart", gameId.toString())
        const docSnap = await getDoc(cartRef)

        if (docSnap.exists()) {
            const currentItem = docSnap.data() as CartItem
            await setDoc(cartRef, {
                ...currentItem,
                quantity: quantity,
            })
        }
    } catch (error) {
        console.error("Error updating cart item quantity:", error)
        throw error
    }
}

// Funciones para LocalStorage (cuando el usuario no está autenticado)

// Función para añadir un juego al carrito (LocalStorage)
export function addToCartLocalStorage(game: Game, price: number): void {
    try {
        // Obtener el carrito actual
        const cartJSON = localStorage.getItem("cart")
        const cart: CartItem[] = cartJSON ? JSON.parse(cartJSON) : []

        // Buscar si el juego ya está en el carrito
        const existingItemIndex = cart.findIndex((item) => item.id === game.id)

        if (existingItemIndex !== -1) {
            // Si ya existe, incrementar la cantidad
            cart[existingItemIndex].quantity += 1
        } else {
            // Si no existe, añadir nuevo item
            cart.push({
                id: game.id,
                name: game.name,
                slug: game.slug,
                background_image: game.background_image,
                price: price,
                quantity: 1,
            })
        }

        // Guardar el carrito actualizado
        localStorage.setItem("cart", JSON.stringify(cart))
    } catch (error) {
        console.error("Error adding to cart in localStorage:", error)
    }
}

// Función para eliminar un juego del carrito (LocalStorage)
export function removeFromCartLocalStorage(gameId: number): void {
    try {
        // Obtener el carrito actual
        const cartJSON = localStorage.getItem("cart")
        if (!cartJSON) return

        const cart: CartItem[] = JSON.parse(cartJSON)

        // Filtrar el juego a eliminar
        const updatedCart = cart.filter((item) => item.id !== gameId)

        // Guardar el carrito actualizado
        localStorage.setItem("cart", JSON.stringify(updatedCart))
    } catch (error) {
        console.error("Error removing from cart in localStorage:", error)
    }
}

// Función para obtener el carrito (LocalStorage)
export function getCartLocalStorage(): CartItem[] {
    try {
        // Obtener el carrito actual
        const cartJSON = localStorage.getItem("cart")
        return cartJSON ? JSON.parse(cartJSON) : []
    } catch (error) {
        console.error("Error getting cart from localStorage:", error)
        return []
    }
}

// Función para actualizar la cantidad de un item en el carrito (LocalStorage)
export function updateCartItemQuantityLocalStorage(gameId: number, quantity: number): void {
    try {
        if (quantity <= 0) {
            removeFromCartLocalStorage(gameId)
            return
        }

        // Obtener el carrito actual
        const cartJSON = localStorage.getItem("cart")
        if (!cartJSON) return

        const cart: CartItem[] = JSON.parse(cartJSON)

        // Buscar el item a actualizar
        const itemIndex = cart.findIndex((item) => item.id === gameId)

        if (itemIndex !== -1) {
            // Actualizar la cantidad
            cart[itemIndex].quantity = quantity

            // Guardar el carrito actualizado
            localStorage.setItem("cart", JSON.stringify(cart))
        }
    } catch (error) {
        console.error("Error updating cart item quantity in localStorage:", error)
    }
}