"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    // useRouter lets us navigate from code after the form is successful.
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        // Prevent the browser from reloading the page on form submit.
        event.preventDefault();

        // Guard clause: stop here if a fake request is already running.
        if (loading) return;

        // Clear old errors before validating again.
        setError("");

        // trim() removes accidental spaces from the beginning/end.
        const normalizedEmail = email.trim();

        if (!normalizedEmail || !password) {
            setError("Debes completar correo y contrasena.");
            return;
        }

        if (!normalizedEmail.includes("@")) {
            setError("Ingresa un correo valido.");
            return;
        }

        // loading=true updates the button UI and disables extra clicks.
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            // push() changes the route programmatically.
            router.push("/dashboard");
        }, 1500);
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#1e293b,_#020617_65%)] px-4 py-10">
            <section className="w-full max-w-md rounded-[28px] border border-white/10 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-sm">
                <div className="space-y-3 text-left">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
                        Inventory Platform
                    </p>
                    <h1 className="text-4xl font-bold tracking-tight text-white">
                        BelongTech
                    </h1>
                    <p className="max-w-sm text-sm leading-6 text-slate-300">
                        Inicia sesion para administrar equipos, usuarios y
                        movimientos del inventario.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-200">
                            Correo
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="correo@empresa.com"
                            autoComplete="email"
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-200">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Tu contrasena"
                            autoComplete="current-password"
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400"
                        />
                    </div>

                    {error && (
                        <p className="text-sm font-medium text-red-400">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Ingresando..." : "Ingresar"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        href="/"
                        className="text-sm font-medium text-slate-300 underline-offset-4 hover:underline"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </section>
        </main>
    );
}
