"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation, useInView } from "framer-motion"

interface AnimatedSectionProps {
    children: React.ReactNode
    className?: string
    delay?: number
    direction?: "up" | "down" | "left" | "right" | "none"
    distance?: number
    once?: boolean
    duration?: number
}

export function AnimatedSection({
    children,
    className = "",
    delay = 0,
    direction = "up",
    distance = 50,
    once = true,
    duration = 0.5,
}: AnimatedSectionProps) {
    const controls = useAnimation()
    const ref = useRef(null)
    const inView = useInView(ref, { once })

    useEffect(() => {
        if (inView) {
            controls.start("visible")
        } else if (!once) {
            controls.start("hidden")
        }
    }, [controls, inView, once])

    const getDirectionOffset = () => {
        switch (direction) {
            case "up":
                return { y: distance }
            case "down":
                return { y: -distance }
            case "left":
                return { x: distance }
            case "right":
                return { x: -distance }
            case "none":
                return {}
            default:
                return { y: distance }
        }
    }

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
                hidden: {
                    opacity: 0,
                    ...getDirectionOffset(),
                },
                visible: {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    transition: {
                        duration,
                        delay,
                        ease: [0.25, 0.25, 0.25, 0.75],
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

interface StaggerContainerProps {
    children: React.ReactNode
    className?: string
    delay?: number
    staggerDelay?: number
    once?: boolean
}

export function StaggerContainer({
    children,
    className = "",
    delay = 0,
    staggerDelay = 0.1,
    once = true,
}: StaggerContainerProps) {
    const controls = useAnimation()
    const ref = useRef(null)
    const inView = useInView(ref, { once })

    useEffect(() => {
        if (inView) {
            controls.start("visible")
        } else if (!once) {
            controls.start("hidden")
        }
    }, [controls, inView, once])

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                        delayChildren: delay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

interface StaggerItemProps {
    children: React.ReactNode
    className?: string
    index?: number
    customDelay?: number
}

export function StaggerItem({ children, className = "", customDelay = 0 }: StaggerItemProps) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.5,
                        delay: customDelay,
                        ease: [0.25, 0.25, 0.25, 0.75],
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

interface FadeInProps {
    children: React.ReactNode
    className?: string
    delay?: number
    duration?: number
}

export function FadeIn({ children, className = "", delay = 0, duration = 0.5 }: FadeInProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration, delay }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

interface ScaleInProps {
    children: React.ReactNode
    className?: string
    delay?: number
    duration?: number
}

export function ScaleIn({ children, className = "", delay = 0, duration = 0.5 }: ScaleInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration, delay }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

interface AnimatedButtonProps {
    children: React.ReactNode
    className?: string
    onClick?: () => void
    type?: "button" | "submit" | "reset"
    disabled?: boolean
}

export function AnimatedButton({
    children,
    className = "",
    onClick,
    type = "button",
    disabled = false,
}: AnimatedButtonProps) {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={className}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
        >
            {children}
        </motion.button>
    )
}

interface AnimatedImageProps {
    src: string
    alt: string
    className?: string
    width?: number
    height?: number
}

export function AnimatedImage({ src, alt, className = "", width, height }: AnimatedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false)

    return (
        <motion.img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            onLoad={() => setIsLoaded(true)}
        />
    )
}