"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BrandsPanel from "./components/brands-panel";
import CategoriesPanel from "./components/categories-panel";
import DevicesPanel from "./components/devices-panel";
import PlacesPanel from "./components/places-panel";
import UsersPanel from "./components/users-panel";
import { PanelShell } from "./components/dashboard-ui";

type AuthUser = {
    id: number;
    email: string;
    name: string | null;
    code: string | null;
};

// El sidebar vive de este arreglo. Cuando agregues un modulo nuevo,
// normalmente lo primero es sumar su nombre aqui.
const sections = [
    "Dispositivos",
    "Categorias",
    "Marcas",
    "Sedes",
    "Empleados",
    "Asignaciones",
    "Mantenimientos",
    "Licencias",
    "Actas de entrega",
    "Reportes",
    "Configuracion",
] as const;

// Este mapa nos deja definir la intencion de los modulos que aun no tienen
// CRUD completo. Asi evitamos que el dashboard se sienta incompleto mientras
// construyes el backend real de cada uno.
const plannedModules = {
    Asignaciones: {
        eyebrow: "Operacion de activos",
        description:
            "Aqui vivira el flujo para entregar o reasignar dispositivos entre empleados, conservando trazabilidad de fecha, responsable y sede.",
        focus: "Mover un activo entre responsables sin perder historial.",
        endpoints: [
            "GET /assignments",
            "POST /assignments",
            "PATCH /assignments/:id",
        ],
        panels: [
            {
                title: "Flujo principal",
                value: "Entrega y reasignacion",
                description:
                    "Seleccion del dispositivo, empleado destino, fecha y observaciones.",
            },
            {
                title: "Dato clave",
                value: "Historial",
                description:
                    "Cada movimiento debe quedar registrado para auditoria.",
            },
            {
                title: "UI sugerida",
                value: "Wizard simple",
                description:
                    "Formulario guiado con confirmacion antes de guardar.",
            },
        ],
    },
    Mantenimientos: {
        eyebrow: "Cuidado del parque tecnologico",
        description:
            "Este modulo te ayudara a registrar mantenimientos preventivos y correctivos por dispositivo, con tecnico responsable y estado del proceso.",
        focus: "Seguir la salud del activo y evitar perdida de contexto tecnico.",
        endpoints: [
            "GET /maintenances",
            "POST /maintenances",
            "PATCH /maintenances/:id",
        ],
        panels: [
            {
                title: "Flujo principal",
                value: "Preventivo / correctivo",
                description:
                    "Clasificacion del mantenimiento y fecha de ejecucion.",
            },
            {
                title: "Dato clave",
                value: "Estado tecnico",
                description:
                    "Pendiente, en proceso, completado o requiere repuesto.",
            },
            {
                title: "UI sugerida",
                value: "Linea de tiempo",
                description:
                    "Ideal para ver avances y observaciones por intervencion.",
            },
        ],
    },
    Licencias: {
        eyebrow: "Control de software",
        description:
            "Aqui podras gestionar licencias por producto, fecha de vencimiento, cantidad disponible y equipo o usuario asociado.",
        focus: "Tener a la vista vencimientos y uso real de cada licencia.",
        endpoints: [
            "GET /licenses",
            "POST /licenses",
            "PATCH /licenses/:id",
        ],
        panels: [
            {
                title: "Flujo principal",
                value: "Asignacion de software",
                description:
                    "Registrar producto, vigencia, cupos y destino de la licencia.",
            },
            {
                title: "Dato clave",
                value: "Vencimiento",
                description:
                    "Conviene destacar fechas proximas y renovaciones pendientes.",
            },
            {
                title: "UI sugerida",
                value: "Tabla con alertas",
                description:
                    "Badges de color para licencias activas, por vencer o vencidas.",
            },
        ],
    },
    "Actas de entrega": {
        eyebrow: "Formalizacion",
        description:
            "Este espacio servira para consolidar la entrega formal de equipos con responsable, fecha, observaciones y evidencia documental.",
        focus: "Transformar una asignacion en un registro formal listo para imprimir o exportar.",
        endpoints: [
            "GET /handover-records",
            "POST /handover-records",
            "GET /handover-records/:id",
        ],
        panels: [
            {
                title: "Flujo principal",
                value: "Documento de entrega",
                description:
                    "Relacionar equipo, empleado, condiciones y firma.",
            },
            {
                title: "Dato clave",
                value: "Evidencia",
                description:
                    "La fuerza del modulo esta en dejar soporte y trazabilidad.",
            },
            {
                title: "UI sugerida",
                value: "Resumen imprimible",
                description:
                    "Vista final tipo acta antes de exportar o aprobar.",
            },
        ],
    },
    Reportes: {
        eyebrow: "Analitica",
        description:
            "Reportes sera la capa de lectura ejecutiva del sistema: inventario por sede, activos por marca, equipos sin asignar y vencimientos proximos.",
        focus: "Convertir tus CRUDs en informacion util para decisiones.",
        endpoints: [
            "GET /reports/inventory-overview",
            "GET /reports/unassigned-devices",
            "GET /reports/licenses-expiring",
        ],
        panels: [
            {
                title: "Flujo principal",
                value: "Lectura ejecutiva",
                description:
                    "Indicadores, tablas resumidas y filtros por sede o categoria.",
            },
            {
                title: "Dato clave",
                value: "Resumen visual",
                description:
                    "Los reportes deben contar la historia del inventario.",
            },
            {
                title: "UI sugerida",
                value: "KPIs + tablas",
                description:
                    "Primero indicadores, luego detalle para profundizar.",
            },
        ],
    },
    Configuracion: {
        eyebrow: "Base del sistema",
        description:
            "Configuracion es el lugar natural para ajustes globales, catálogos secundarios, politicas de uso y preferencias operativas del inventario.",
        focus: "Mantener reglas y parametros fuera de los formularios del dia a dia.",
        endpoints: [
            "GET /settings",
            "PATCH /settings",
            "GET /settings/catalogs",
        ],
        panels: [
            {
                title: "Flujo principal",
                value: "Parametros generales",
                description:
                    "Reglas, textos, prefijos y comportamiento base del sistema.",
            },
            {
                title: "Dato clave",
                value: "Consistencia",
                description:
                    "Un buen panel de configuracion evita hardcodear decisiones.",
            },
            {
                title: "UI sugerida",
                value: "Secciones por tema",
                description:
                    "General, notificaciones, catalogos y permisos.",
            },
        ],
    },
} satisfies Record<
    string,
    {
        eyebrow: string;
        description: string;
        focus: string;
        endpoints: string[];
        panels: Array<{
            title: string;
            value: string;
            description: string;
        }>;
    }
>;

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [activeSection, setActiveSection] = useState<string | null>(null);

    useEffect(() => {
        // Leemos la sesion creada por el login. Como sessionStorage solo
        // existe en navegador, esta lectura debe vivir dentro de useEffect.
        const storedUser = sessionStorage.getItem("auth_user");

        if (!storedUser) {
            router.replace("/login");
            return;
        }

        setUser(JSON.parse(storedUser) as AuthUser);
    }, [router]);

    function handleLogout() {
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
                                Sesion activa
                            </p>
                            <p className="mt-3 text-lg font-semibold text-white">
                                {user?.name ?? "Cargando usuario..."}
                            </p>
                            <p className="mt-1 text-sm text-slate-300">
                                {user?.email ?? "-"}
                            </p>
                            <p className="mt-4 text-xs uppercase tracking-[0.24em] text-cyan-300">
                                Codigo {user?.code ?? "---"}
                            </p>
                        </div>

                        <nav className="mt-8 flex-1 space-y-2">
                            {sections.map((section) => {
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
                            Cerrar sesion
                        </button>
                    </div>
                </aside>

                <section className="flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
                    {!activeSection ? (
                        <WelcomeView userName={user?.name ?? "Usuario"} />
                    ) : (
                        renderActiveSection(activeSection, user?.email ?? "-")
                    )}
                </section>
            </div>
        </main>
    );
}

function WelcomeView({ userName }: { userName: string }) {
    return (
        <div className="relative min-h-[calc(100vh-3rem)] overflow-hidden rounded-[36px] border border-white/60 bg-white/70 p-6 shadow-[0_32px_90px_rgba(15,23,42,0.16)] backdrop-blur lg:p-10">
            <div className="absolute -right-16 top-10 h-44 w-44 rounded-full bg-cyan-300/35 blur-3xl" />
            <div className="absolute bottom-10 left-10 h-56 w-56 rounded-full bg-amber-200/50 blur-3xl" />

            <div className="relative">
                <div className="grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
                    <div className="rounded-[32px] border border-slate-200/70 bg-white/65 p-7 shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-700">
                            Centro de inventario
                        </p>
                        <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                            Controla el ciclo de vida de cada activo desde un
                            solo lugar.
                        </h2>
                        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                            Elige una opcion del sidebar para empezar. Los
                            modulos CRUD de este dashboard ya estan listos para
                            conectarse con tus endpoints sin que la portada se
                            sienta vacia o improvisada.
                        </p>

                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            <MetricStrip
                                value="CRUD"
                                label="Flujo activo en frontend"
                            />
                            <MetricStrip
                                value="API"
                                label="Endpoints listos en NestJS"
                            />
                            <MetricStrip
                                value="UI"
                                label="Paneles visuales por modulo"
                            />
                        </div>
                    </div>

                    <div className="rounded-[32px] border border-cyan-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(240,249,255,0.92))] p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                            Sesion actual
                        </p>
                        <div className="mt-5 rounded-[28px] bg-slate-950 px-5 py-6 text-white shadow-xl">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">
                                        Operador activo
                                    </p>
                                    <p className="mt-3 text-3xl font-semibold leading-tight">
                                        {userName}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
                                    <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">
                                        Stack
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-white">
                                        React + Nest
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <MiniInfo
                                    title="Area"
                                    value="Inventario"
                                />
                                <MiniInfo
                                    title="Estado"
                                    value="En linea"
                                />
                            </div>
                        </div>
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
                                Mapa dinamico del inventario
                            </h3>
                            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
                                La portada te recibe con movimiento y contexto.
                                Cuando elijas una seccion, el panel principal
                                cambiara a su CRUD respectivo.
                            </p>

                            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                <FloatingPanel
                                    title="Dispositivos"
                                    value="CRUD"
                                    tone="cyan"
                                    delay="0s"
                                />
                                <FloatingPanel
                                    title="Usuarios"
                                    value="CRUD"
                                    tone="amber"
                                    delay="0.6s"
                                />
                                <FloatingPanel
                                    title="Sedes"
                                    value="CRUD"
                                    tone="emerald"
                                    delay="1.2s"
                                />
                                <FloatingPanel
                                    title="Marcas"
                                    value="CRUD"
                                    tone="rose"
                                    delay="1.8s"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-[30px] border border-slate-200 bg-white/85 p-6 shadow-lg">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                Ruta sugerida
                            </p>
                            <div className="mt-5 space-y-4">
                                <StepRow
                                    index="01"
                                    title="Empieza por Marcas"
                                    description="Es el CRUD mas simple para practicar React, fetch y formularios."
                                />
                                <StepRow
                                    index="02"
                                    title="Sigue con Categorias y Sedes"
                                    description="Repites el mismo patron y consolidas la logica del frontend."
                                />
                                <StepRow
                                    index="03"
                                    title="Pasa a Dispositivos"
                                    description="Ahi ya practicas fechas, relaciones y un formulario mas completo."
                                />
                            </div>
                        </div>

                        <div className="rounded-[30px] border border-slate-200 bg-[#fcfaf6] p-6 shadow-lg">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                Estado de sesion
                            </p>
                            <p className="mt-4 text-2xl font-semibold text-slate-950">
                                {userName}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Ya puedes navegar entre los modulos del sistema
                                y estudiar como se conectan estado, interfaz y
                                backend.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function renderActiveSection(section: string, userEmail: string) {
    switch (section) {
        case "Dispositivos":
            return <DevicesPanel />;
        case "Categorias":
            return <CategoriesPanel />;
        case "Marcas":
            return <BrandsPanel />;
        case "Sedes":
            return <PlacesPanel />;
        case "Empleados":
            return <UsersPanel />;
        case "Asignaciones":
        case "Mantenimientos":
        case "Licencias":
        case "Actas de entrega":
        case "Reportes":
        case "Configuracion":
            return (
                <FutureModulePanel
                    title={section}
                    userEmail={userEmail}
                    {...plannedModules[section]}
                />
            );
        default:
            return (
                <PanelShell
                    eyebrow="Modulo en construccion"
                    title={section}
                    description="Este espacio ya quedo listo para que luego conectes mas endpoints y pantallas especializadas."
                >
                    <div className="mt-8 grid gap-5 md:grid-cols-3">
                        <InfoBox
                            title="Estado"
                            value="Diseno base listo"
                            description="La navegacion lateral ya controla la vista principal."
                        />
                        <InfoBox
                            title="Siguiente paso"
                            value="Conectar datos"
                            description="Aqui puedes traer informacion real desde NestJS y Prisma."
                        />
                        <InfoBox
                            title="Usuario actual"
                            value={userEmail}
                            description="Tu sesion se mantiene en el navegador mientras trabajas."
                        />
                    </div>
                </PanelShell>
            );
    }
}

function FutureModulePanel({
    eyebrow,
    title,
    description,
    focus,
    endpoints,
    panels,
    userEmail,
}: {
    eyebrow: string;
    title: string;
    description: string;
    focus: string;
    endpoints: string[];
    panels: Array<{
        title: string;
        value: string;
        description: string;
    }>;
    userEmail: string;
}) {
    return (
        <PanelShell eyebrow={eyebrow} title={title} description={description}>
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-6">
                    <div className="rounded-[30px] border border-slate-200 bg-[#fcfaf6] p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                            Enfoque del modulo
                        </p>
                        <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                            {focus}
                        </p>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                            Aunque esta seccion aun no tenga CRUD operativo,
                            ya la presentamos como una parte real del producto.
                            Eso te ayuda a diseñar primero la experiencia y
                            luego conectar el backend con una idea clara.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        {panels.map((panel) => (
                            <InfoBox
                                key={panel.title}
                                title={panel.title}
                                value={panel.value}
                                description={panel.description}
                            />
                        ))}
                    </div>

                    <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                            Endpoints sugeridos
                        </p>
                        <div className="mt-5 grid gap-3">
                            {endpoints.map((endpoint) => (
                                <div
                                    key={endpoint}
                                    className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 font-mono text-sm text-slate-700"
                                >
                                    {endpoint}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-[30px] border border-cyan-100 bg-[linear-gradient(180deg,#ffffff,#eef8ff)] p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                            Siguiente paso de desarrollo
                        </p>
                        <div className="mt-5 space-y-4">
                            <StepRow
                                index="01"
                                title="Modelar entidad"
                                description="Define el modelo en Prisma y sus relaciones con Device, User o Place si aplica."
                            />
                            <StepRow
                                index="02"
                                title="Crear CRUD Nest"
                                description="Genera module, service y controller para dejar listos los endpoints base."
                            />
                            <StepRow
                                index="03"
                                title="Diseñar el panel"
                                description="Conecta el frontend cuando ya sepas que datos necesita ver y editar el usuario."
                            />
                        </div>
                    </div>

                    <div className="rounded-[30px] border border-slate-200 bg-[#08111f] p-6 text-white shadow-xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/75">
                            Contexto actual
                        </p>
                        <p className="mt-4 text-2xl font-semibold">
                            Sesion: {userEmail}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-slate-300">
                            Este bloque deja claro que incluso los modulos en
                            preparacion forman parte del producto, no son solo
                            botones decorativos del sidebar.
                        </p>
                    </div>
                </div>
            </div>
        </PanelShell>
    );
}

function MetricStrip({
    value,
    label,
}: {
    value: string;
    label: string;
}) {
    return (
        <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 px-5 py-4">
            <p className="text-2xl font-semibold tracking-tight text-slate-950">
                {value}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{label}</p>
        </div>
    );
}

function MiniInfo({
    title,
    value,
}: {
    title: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">
                {title}
            </p>
            <p className="mt-2 text-sm font-semibold text-white">{value}</p>
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
    const toneStyles = {
        cyan: "border-cyan-400/20 bg-cyan-400/10 text-cyan-100",
        amber: "border-amber-300/20 bg-amber-300/10 text-amber-100",
        emerald: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
        rose: "border-rose-300/20 bg-rose-300/10 text-rose-100",
    };

    return (
        <div
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
