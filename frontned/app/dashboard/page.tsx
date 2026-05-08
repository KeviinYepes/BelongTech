"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthUser = {
    id: number;
    email: string;
    name: string | null;
    code: string | null;
};

// Este arreglo alimenta el sidebar. Más adelante, cada texto puede
// convertirse en un módulo real o en una ruta independiente.
const sections = [
    "Dispositivos",
    "Categorías",
    "Marcas",
    "Sedes",
    "Empleados",
    "Asignaciones",
    "Mantenimientos",
    "Licencias",
    "Actas de entrega",
    "Reportes",
    "Configuración",
] as const;

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(null);
    // activeSection guarda la opción seleccionada del sidebar.
    // Si es null, mostramos la portada inicial del dashboard.
    const [activeSection, setActiveSection] = useState<string | null>(null);

    useEffect(() => {
        // Leemos la sesión guardada por el login desde sessionStorage.
        // Esto solo existe en el navegador, por eso se hace dentro de useEffect.
        const storedUser = sessionStorage.getItem("auth_user");

        if (!storedUser) {
            // Si no hay sesión, devolvemos al usuario al login.
            router.replace("/login");
            return;
        }

        // Convertimos el texto JSON en un objeto de JavaScript.
        setUser(JSON.parse(storedUser) as AuthUser);
    }, [router]);

    function handleLogout() {
        // Borramos la sesión local y redirigimos al login.
        sessionStorage.removeItem("auth_user");
        router.replace("/login");
    }

    return (
        <main className="min-h-screen bg-[linear-gradient(140deg,#08111f_0%,#0f1d33_48%,#f4efe7_48%,#f7f3ec_100%)] text-slate-900">
            <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col lg:flex-row">
                <aside className="relative overflow-hidden border-b border-white/10 bg-[#07111e] text-white lg:w-[320px] lg:border-r lg:border-b-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.20),_transparent_42%),linear-gradient(180deg,transparent,rgba(8,15,28,0.7))]" />

                    <div className="relative flex h-full flex-col px-6 py-8">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/80">
                                Inventory Core
                            </p>
                            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
                                BelongTech
                            </h1>
                            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-300">
                                Un centro visual para controlar activos,
                                movimientos y responsables sin perder contexto.
                            </p>
                        </div>

                        <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur">
                            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                                Sesión activa
                            </p>
                            <p className="mt-3 text-lg font-semibold text-white">
                                {user?.name ?? "Cargando usuario..."}
                            </p>
                            <p className="mt-1 text-sm text-slate-300">
                                {user?.email ?? "-"}
                            </p>
                            <p className="mt-4 text-xs uppercase tracking-[0.24em] text-cyan-300">
                                Código {user?.code ?? "---"}
                            </p>
                        </div>

                        <nav className="mt-8 flex-1 space-y-2">
                            {sections.map((section) => {
                                // Esto nos ayuda a pintar visualmente el botón activo.
                                const isActive = activeSection === section;

                                return (
                                    <button
                                        key={section}
                                        type="button"
                                        onClick={() => setActiveSection(section)}
                                        className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition ${
                                            isActive
                                                ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-950/20"
                                                : "text-slate-200 hover:bg-white/8 hover:text-white"
                                        }`}
                                    >
                                        <span>{section}</span>
                                        <span
                                            className={`h-2.5 w-2.5 rounded-full ${
                                                isActive
                                                    ? "bg-slate-950"
                                                    : "bg-slate-500"
                                            }`}
                                        />
                                    </button>
                                );
                            })}
                        </nav>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="mt-6 rounded-2xl border border-white/15 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </aside>

                <section className="flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
                    {/* Si todavía no se eligió nada del sidebar, mostramos
                    una pantalla de bienvenida más visual. */}
                    {!activeSection ? (
                        <div className="relative min-h-[calc(100vh-3rem)] overflow-hidden rounded-[36px] border border-white/60 bg-white/70 p-6 shadow-[0_32px_90px_rgba(15,23,42,0.16)] backdrop-blur lg:p-10">
                            <div className="absolute -right-16 top-10 h-44 w-44 rounded-full bg-cyan-300/35 blur-3xl" />
                            <div className="absolute bottom-10 left-10 h-56 w-56 rounded-full bg-amber-200/50 blur-3xl" />

                            <div className="relative">
                                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="max-w-2xl">
                                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-700">
                                            Centro de inventario
                                        </p>
                                        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                                            Controla el ciclo de vida de cada
                                            activo desde un solo lugar.
                                        </h2>
                                        <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                                            Elige una opción del sidebar para
                                            empezar. Mientras tanto, esta
                                            portada funciona como una vista de
                                            bienvenida viva del sistema.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 sm:w-[360px]">
                                        <MetricCard
                                            value="128"
                                            label="Activos registrados"
                                        />
                                        <MetricCard
                                            value="17"
                                            label="Pendientes por revisar"
                                        />
                                        <MetricCard
                                            value="09"
                                            label="Mantenimientos hoy"
                                        />
                                        <MetricCard
                                            value="31"
                                            label="Licencias activas"
                                        />
                                    </div>
                                </div>

                                <div className="mt-10 grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
                                    <div className="relative overflow-hidden rounded-[32px] bg-[#08111f] p-6 text-white shadow-2xl">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.28),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(250,204,21,0.18),_transparent_30%)]" />
                                        <div className="relative">
                                            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">
                                                Vista inicial
                                            </p>
                                            <h3 className="mt-3 text-2xl font-semibold">
                                                Mapa dinámico del inventario 
                                            </h3>
                                            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
                                                Una composición pensada para que
                                                el dashboard no se sienta vacío
                                                antes de entrar a módulos
                                                concretos.
                                            </p>

                                            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                                <FloatingPanel
                                                    title="Equipos en circulación"
                                                    value="74%"
                                                    tone="cyan"
                                                    delay="0s"
                                                />
                                                <FloatingPanel
                                                    title="Cobertura de sedes"
                                                    value="6/7"
                                                    tone="amber"
                                                    delay="0.6s"
                                                />
                                                <FloatingPanel
                                                    title="Asignación al día"
                                                    value="92%"
                                                    tone="emerald"
                                                    delay="1.2s"
                                                />
                                                <FloatingPanel
                                                    title="Historial trazable"
                                                    value="100%"
                                                    tone="rose"
                                                    delay="1.8s"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="rounded-[30px] border border-slate-200 bg-white/85 p-6 shadow-lg">
                                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                                Flujo sugerido
                                            </p>
                                            <div className="mt-5 space-y-4">
                                                <StepRow
                                                    index="01"
                                                    title="Explora activos"
                                                    description="Empieza por Dispositivos para revisar el estado general del inventario."
                                                />
                                                <StepRow
                                                    index="02"
                                                    title="Valida responsables"
                                                    description="Cruza Empleados y Asignaciones para entender a quién pertenece cada recurso."
                                                />
                                                <StepRow
                                                    index="03"
                                                    title="Ordena el sistema"
                                                    description="Usa Marcas, Categorías y Sedes para organizar la operación completa."
                                                />
                                            </div>
                                        </div>

                                        <div className="rounded-[30px] border border-slate-200 bg-[#fcfaf6] p-6 shadow-lg">
                                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                                Estado de sesión
                                            </p>
                                            <p className="mt-4 text-2xl font-semibold text-slate-950">
                                                {user?.name ?? "Usuario"}
                                            </p>
                                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                                Ya puedes navegar los módulos
                                                desde el panel lateral. La vista
                                                principal cambiará cuando
                                                selecciones una sección.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Cuando el usuario hace clic en una opción del sidebar,
                        dejamos de mostrar la portada y renderizamos esta vista. */
                        <div className="min-h-[calc(100vh-3rem)] rounded-[36px] border border-white/60 bg-white/80 p-6 shadow-[0_32px_90px_rgba(15,23,42,0.16)] backdrop-blur lg:p-10">
                            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-700">
                                Módulo activo
                            </p>
                            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
                                {activeSection}
                            </h2>
                            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                                Esta área ya está lista para que después
                                conectemos tablas, formularios, filtros y datos
                                reales del backend.
                            </p>

                            <div className="mt-8 grid gap-5 md:grid-cols-3">
                                <InfoBox
                                    title="Estado"
                                    value="Diseño base listo"
                                    description="La navegación lateral ya controla la vista principal."
                                />
                                <InfoBox
                                    title="Siguiente paso"
                                    value="Conectar datos"
                                    description="Aquí podemos traer información real desde NestJS y Prisma."
                                />
                                <InfoBox
                                    title="Usuario actual"
                                    value={user?.email ?? "-"}
                                    description="Tu sesión ya se mantiene en el navegador mientras trabajas."
                                />
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

function MetricCard({
    value,
    label,
}: {
    value: string;
    label: string;
}) {
    // Componente pequeño reutilizable para mostrar KPIs o métricas.
    return (
        <div className="rounded-[28px] border border-slate-200 bg-white/80 p-5 shadow-sm">
            <p className="text-3xl font-semibold tracking-tight text-slate-950">
                {value}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{label}</p>
        </div>
    );
}

function FloatingPanel({
    title,
    value,
    tone,
    delay,
}: {
    title: string;
    value: string;
    tone: "cyan" | "amber" | "emerald" | "rose";
    delay: string;
}) {
    // tone cambia el color visual de cada tarjeta.
    const toneStyles = {
        cyan: "border-cyan-400/20 bg-cyan-400/10 text-cyan-100",
        amber: "border-amber-300/20 bg-amber-300/10 text-amber-100",
        emerald: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
        rose: "border-rose-300/20 bg-rose-300/10 text-rose-100",
    };

    return (
        <div
            // La animación float está definida en globals.css.
            className={`rounded-[28px] border p-5 backdrop-blur-sm ${toneStyles[tone]} animate-[float_7s_ease-in-out_infinite]`}
            style={{ animationDelay: delay }}
        >
            <p className="text-xs uppercase tracking-[0.3em] opacity-75">
                {title}
            </p>
            <p className="mt-4 text-3xl font-semibold">{value}</p>
        </div>
    );
}

function StepRow({
    index,
    title,
    description,
}: {
    index: string;
    title: string;
    description: string;
}) {
    // Esta fila construye los pasos sugeridos de uso del sistema.
    return (
        <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                {index}
            </div>
            <div>
                <p className="text-base font-semibold text-slate-950">{title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                    {description}
                </p>
            </div>
        </div>
    );
}

function InfoBox({
    title,
    value,
    description,
}: {
    title: string;
    value: string;
    description: string;
}) {
    // Caja simple para reutilizar la misma estructura en la vista de módulo activo.
    return (
        <div className="rounded-[28px] border border-slate-200 bg-[#fcfaf6] p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                {title}
            </p>
            <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                {value}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
    );
}
