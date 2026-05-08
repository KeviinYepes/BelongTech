"use client";

// Este helper evita hardcodear localhost en cada componente.
// Si mas adelante defines NEXT_PUBLIC_API_URL, todos los paneles lo usaran.
export function getApiUrl() {
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }

    if (typeof window === "undefined") {
        return "http://localhost:3001";
    }

    return `http://${window.location.hostname}:3001`;
}
