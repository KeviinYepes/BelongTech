"use client";

import { useEffect, useState } from "react";
import { getApiUrl } from "./dashboard-api";
import {
    DataTitle,
    EmptyState,
    ErrorBanner,
    Field,
    FormTitle,
    Input,
    PanelShell,
    PrimaryButton,
    RowCell,
    Select,
    SecondaryButton,
    SuccessBanner,
    Table,
    Textarea,
} from "./dashboard-ui";

type Device = {
    id: number;
    name: string;
    serial: string;
    model: string | null;
    description: string | null;
    purchaseDate: string;
    assignedAt: string;
    brandId: number;
    categoryId: number;
    placeId: number;
    userId: number | null;
    code: string | null;
    enum: string;
    brand: {
        id: number;
        name: string;
    };
    category: {
        id: number;
        name: string;
    };
    place: {
        id: number;
        name: string;
    };
    user: {
        id: number;
        name: string | null;
        email: string;
    } | null;
};

type OptionItem = {
    id: number;
    name: string;
};

type UserOption = {
    id: number;
    name: string | null;
    email: string;
};

type DeviceForm = {
    name: string;
    serial: string;
    model: string;
    description: string;
    purchaseDate: string;
    assignedAt: string;
    brandId: string;
    categoryId: string;
    placeId: string;
    userId: string;
    code: string;
    enum: string;
};

const initialForm: DeviceForm = {
    name: "",
    serial: "",
    model: "",
    description: "",
    purchaseDate: "",
    assignedAt: "",
    brandId: "1",
    categoryId: "1",
    placeId: "1",
    userId: "",
    code: "",
    enum: "AVAILABLE",
};

export default function DevicesPanel() {
    const [devices, setDevices] = useState<Device[]>([]);
    const [brands, setBrands] = useState<OptionItem[]>([]);
    const [categories, setCategories] = useState<OptionItem[]>([]);
    const [places, setPlaces] = useState<OptionItem[]>([]);
    const [users, setUsers] = useState<UserOption[]>([]);
    const [form, setForm] = useState<DeviceForm>(initialForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        void loadDevices();
        void loadRelations();
    }, []);

    async function loadDevices() {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${getApiUrl()}/devices`);
            const data = await response.json();

            if (!response.ok) {
                setError("No fue posible cargar los dispositivos.");
                return;
            }

            setDevices(data);
        } catch {
            setError("Error de conexion con el backend.");
        } finally {
            setLoading(false);
        }
    }

    // Cargamos catalogos auxiliares para que el usuario escoja por nombre
    // y no tenga que memorizar IDs manualmente.
    async function loadRelations() {
        try {
            const [brandsResponse, categoriesResponse, placesResponse, usersResponse] =
                await Promise.all([
                    fetch(`${getApiUrl()}/brands`),
                    fetch(`${getApiUrl()}/categories`),
                    fetch(`${getApiUrl()}/places`),
                    fetch(`${getApiUrl()}/users`),
                ]);

            const [brandsData, categoriesData, placesData, usersData] =
                await Promise.all([
                    brandsResponse.json(),
                    categoriesResponse.json(),
                    placesResponse.json(),
                    usersResponse.json(),
                ]);

            if (brandsResponse.ok) {
                setBrands(brandsData);
                if (brandsData.length > 0) {
                    setForm((current) => ({
                        ...current,
                        brandId:
                            current.brandId && current.brandId !== "1"
                                ? current.brandId
                                : String(brandsData[0].id),
                    }));
                }
            }

            if (categoriesResponse.ok) {
                setCategories(categoriesData);
                if (categoriesData.length > 0) {
                    setForm((current) => ({
                        ...current,
                        categoryId:
                            current.categoryId && current.categoryId !== "1"
                                ? current.categoryId
                                : String(categoriesData[0].id),
                    }));
                }
            }

            if (placesResponse.ok) {
                setPlaces(placesData);
                if (placesData.length > 0) {
                    setForm((current) => ({
                        ...current,
                        placeId:
                            current.placeId && current.placeId !== "1"
                                ? current.placeId
                                : String(placesData[0].id),
                    }));
                }
            }

            if (usersResponse.ok) {
                setUsers(usersData);
            }
        } catch {
            // No frenamos todo el panel si un catalogo auxiliar falla.
        }
    }

    function resetForm() {
        setForm(initialForm);
        setEditingId(null);
    }

    function handleChange(
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    function handleEdit(device: Device) {
        setEditingId(device.id);
        setForm({
            name: device.name,
            serial: device.serial,
            model: device.model ?? "",
            description: device.description ?? "",
            purchaseDate: device.purchaseDate.slice(0, 10),
            assignedAt: device.assignedAt.slice(0, 10),
            brandId: String(device.brandId),
            categoryId: String(device.categoryId),
            placeId: String(device.placeId),
            userId: device.userId ? String(device.userId) : "",
            code: device.code ?? "",
            enum: device.enum,
        });
        setError("");
        setSuccess("");
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (
            !form.name.trim() ||
            !form.serial.trim() ||
            !form.purchaseDate ||
            !form.assignedAt
        ) {
            setError(
                "Nombre, serial, purchaseDate y assignedAt son obligatorios.",
            );
            return;
        }

        setSubmitting(true);

        try {
            const payload = {
                name: form.name.trim(),
                serial: form.serial.trim(),
                model: form.model.trim() || undefined,
                description: form.description.trim() || undefined,
                purchaseDate: new Date(form.purchaseDate).toISOString(),
                assignedAt: new Date(form.assignedAt).toISOString(),
                brandId: Number(form.brandId),
                categoryId: Number(form.categoryId),
                placeId: Number(form.placeId),
                userId: form.userId ? Number(form.userId) : undefined,
                code: form.code.trim() || undefined,
                enum: form.enum.trim() || undefined,
            };

            const response = await fetch(
                editingId
                    ? `${getApiUrl()}/devices/${editingId}`
                    : `${getApiUrl()}/devices`,
                {
                    method: editingId ? "PATCH" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    Array.isArray(data.message)
                        ? data.message.join(", ")
                        : data.message ?? "No fue posible guardar el dispositivo.",
                );
                return;
            }

            setSuccess(
                editingId
                    ? "El dispositivo se actualizo correctamente."
                    : "El dispositivo se creo correctamente.",
            );
            resetForm();
            await loadDevices();
        } catch {
            setError("Error de conexion con el backend.");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id: number) {
        const confirmed = window.confirm(
            "Estas seguro de que quieres eliminar este dispositivo?",
        );

        if (!confirmed) return;

        setError("");
        setSuccess("");

        try {
            const response = await fetch(`${getApiUrl()}/devices/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                setError(
                    data.message ?? "No fue posible eliminar el dispositivo.",
                );
                return;
            }

            setSuccess("El dispositivo se elimino correctamente.");
            if (editingId === id) resetForm();
            await loadDevices();
        } catch {
            setError("Error de conexion con el backend.");
        }
    }

    return (
        <PanelShell
            eyebrow="Modulo CRUD"
            title="Dispositivos"
            description="Este panel combina varios campos y relaciones. Es el ejemplo mas completo de tus CRUDs en Next.js."
        >
            {error && <ErrorBanner message={error} />}
            {success && <SuccessBanner message={success} />}

            <div className="space-y-6">
                <div className="rounded-[32px] border border-slate-200 bg-[#fcfaf6] p-6 shadow-sm lg:p-8">
                    <FormTitle
                        title={editingId ? "Editar dispositivo" : "Nuevo dispositivo"}
                        description="En dispositivos conviene priorizar amplitud antes que apilar todo en una columna angosta. Por eso este formulario ocupa todo el ancho y agrupa los campos por contexto."
                    />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.95fr]">
                            <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Field label="Nombre del dispositivo">
                                        <Input
                                            name="name"
                                            placeholder="Ej: Laptop Lenovo"
                                            value={form.name}
                                            onChange={handleChange}
                                        />
                                    </Field>

                                    <Field label="Serial">
                                        <Input
                                            name="serial"
                                            placeholder="Ej: LEN-001"
                                            value={form.serial}
                                            onChange={handleChange}
                                        />
                                    </Field>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <Field label="Modelo">
                                        <Input
                                            name="model"
                                            placeholder="Ej: ThinkPad T14"
                                            value={form.model}
                                            onChange={handleChange}
                                        />
                                    </Field>

                                    <Field label="Codigo interno">
                                        <Input
                                            name="code"
                                            placeholder="Ej: EQ-2026-01"
                                            value={form.code}
                                            onChange={handleChange}
                                        />
                                    </Field>
                                </div>

                                <div className="rounded-[28px] border border-slate-200 bg-white/75 p-5">
                                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                                        Fechas
                                    </p>
                                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                                        <Field label="Fecha de compra">
                                            <Input
                                                type="date"
                                                name="purchaseDate"
                                                value={form.purchaseDate}
                                                onChange={handleChange}
                                            />
                                        </Field>

                                        <Field label="Fecha de asignacion">
                                            <Input
                                                type="date"
                                                name="assignedAt"
                                                value={form.assignedAt}
                                                onChange={handleChange}
                                            />
                                        </Field>
                                    </div>
                                </div>

                                <div className="rounded-[28px] border border-slate-200 bg-white/75 p-5">
                                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                                        Descripcion operativa
                                    </p>
                                    <div className="mt-4">
                                        <Field label="Descripcion">
                                            <Textarea
                                                name="description"
                                                placeholder="Ej: Equipo entregado al area de desarrollo."
                                                value={form.description}
                                                onChange={handleChange}
                                                className="min-h-[128px]"
                                            />
                                        </Field>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f5f9ff)] p-5">
                                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                                        Relaciones
                                    </p>
                                    <p className="mt-3 text-sm leading-6 text-slate-600">
                                        Aqui el usuario deberia pensar en nombres, no en IDs. Por eso el formulario usa listas de marca, categoria, sede y empleado.
                                    </p>
                                    <div className="mt-5 grid gap-4">
                                        <Field label="Marca">
                                            <Select
                                                name="brandId"
                                                value={form.brandId}
                                                onChange={handleChange}
                                            >
                                                {brands.map((brand) => (
                                                    <option key={brand.id} value={brand.id}>
                                                        {brand.name}
                                                    </option>
                                                ))}
                                            </Select>
                                        </Field>

                                        <Field label="Categoria">
                                            <Select
                                                name="categoryId"
                                                value={form.categoryId}
                                                onChange={handleChange}
                                            >
                                                {categories.map((category) => (
                                                    <option
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </Select>
                                        </Field>

                                        <Field label="Sede">
                                            <Select
                                                name="placeId"
                                                value={form.placeId}
                                                onChange={handleChange}
                                            >
                                                {places.map((place) => (
                                                    <option key={place.id} value={place.id}>
                                                        {place.name}
                                                    </option>
                                                ))}
                                            </Select>
                                        </Field>

                                        <Field label="Empleado responsable">
                                            <Select
                                                name="userId"
                                                value={form.userId}
                                                onChange={handleChange}
                                            >
                                                <option value="">Sin asignar</option>
                                                {users.map((user) => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.name ?? user.email}
                                                    </option>
                                                ))}
                                            </Select>
                                        </Field>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <InfoChip
                                        label="Marcas disponibles"
                                        value={String(brands.length)}
                                    />
                                    <InfoChip
                                        label="Empleados cargados"
                                        value={String(users.length)}
                                    />
                                    <InfoChip
                                        label="Categorias"
                                        value={String(categories.length)}
                                    />
                                    <InfoChip
                                        label="Sedes"
                                        value={String(places.length)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-5">
                            <PrimaryButton type="submit" disabled={submitting}>
                                {submitting
                                    ? "Guardando..."
                                    : editingId
                                      ? "Actualizar dispositivo"
                                      : "Crear dispositivo"}
                            </PrimaryButton>
                            <SecondaryButton
                                type="button"
                                onClick={resetForm}
                                disabled={submitting}
                            >
                                Limpiar
                            </SecondaryButton>
                        </div>
                    </form>
                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
                    <DataTitle
                        title="Listado de dispositivos"
                        description="La tabla queda debajo para que el ojo primero complete el formulario y luego escanee los registros sin pelear contra una columna comprimida."
                    />

                    {loading ? (
                        <EmptyState
                            title="Cargando dispositivos..."
                            description="Estamos consultando GET /devices."
                        />
                    ) : devices.length === 0 ? (
                        <EmptyState
                            title="No hay dispositivos registrados"
                            description="Crea el primero desde el formulario lateral."
                        />
                    ) : (
                        <Table
                            headers={[
                                "Nombre",
                                "Serial",
                                "Modelo",
                                "Marca",
                                "Categoria",
                                "Sede",
                                "Empleado",
                                "Acciones",
                            ]}
                        >
                            {devices.map((device) => (
                                <tr key={device.id}>
                                    <RowCell>{device.name}</RowCell>
                                    <RowCell>{device.serial}</RowCell>
                                    <RowCell>{device.model ?? "-"}</RowCell>
                                    <RowCell>{device.brand.name}</RowCell>
                                    <RowCell>{device.category.name}</RowCell>
                                    <RowCell>{device.place.name}</RowCell>
                                    <RowCell>
                                        {device.user?.name ??
                                            device.user?.email ??
                                            "Sin asignar"}
                                    </RowCell>
                                    <RowCell>
                                        <div className="flex flex-wrap gap-2">
                                            <SecondaryButton
                                                type="button"
                                                onClick={() => handleEdit(device)}
                                                className="px-3 py-2"
                                            >
                                                Editar
                                            </SecondaryButton>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(device.id)}
                                                className="rounded-2xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </RowCell>
                                </tr>
                            ))}
                        </Table>
                    )}
                </div>
            </div>
        </PanelShell>
    );
}

function InfoChip({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-[24px] border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                {label}
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                {value}
            </p>
        </div>
    );
}
