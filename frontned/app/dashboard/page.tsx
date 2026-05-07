export default function DashboardPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <section className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-lg">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                    Dashboard
                </p>
                <h1 className="mt-3 text-3xl font-bold text-slate-900">
                    Login correcto
                </h1>
                <p className="mt-3 text-slate-600">
                    Esta pagina existe solo para probar la navegacion despues del login.
                </p>
            </section>
        </main>
    );
}
