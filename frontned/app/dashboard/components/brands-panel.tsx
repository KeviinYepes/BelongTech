"use client";

import { useEffect, useState } from "react";
import { getApiUrl } from "./dashboard-api";
import {
    CrudGrid,
    DataTitle,
    EmptyState,
    ErrorBanner,
    Field,
    FormTitle,
    Input,
    PanelShell,
    PrimaryButton,
    RowCell,
    SecondaryButton,
    StatusBadge,
    SuccessBanner,
    Table,
} from "./dashboard-ui";

type Brand = {
    id: number;
    name: string;
    status: boolean;
};

export default function BrandsPanel() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [name, setName] = useState("");
    const [status, setStatus] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        void loadBrands();
    }, []);

    async function loadBrands() {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${getApiUrl()}/brands`);
            const data = await response.json();

            if (!response.ok) {
                setError("No fue posible cargar las marcas.");
                return;
            }

            setBrands(data);
        } catch {
            setError("Error de conexion con el backend.");
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        setName("");
        setStatus(true);
        setEditingId(null);
    }

    function handleEdit(brand: Brand) {
        setEditingId(brand.id);
        setName(brand.name);
        setStatus(brand.status);
        setError("");
        setSuccess("");
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!name.trim()) {
            setError("El nombre de la marca es obligatorio.");
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch(
                editingId
                    ? `${getApiUrl()}/brands/${editingId}`
                    : `${getApiUrl()}/brands`,
                {
                    method: editingId ? "PATCH" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: name.trim(),
                        status,
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message ?? "No fue posible guardar la marca.");
                return;
            }

            setSuccess(
                editingId
                    ? "La marca se actualizo correctamente."
                    : "La marca se creo correctamente.",
            );
            resetForm();
            await loadBrands();
        } catch {
            setError("Error de conexion con el backend.");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id: number) {
        const confirmed = window.confirm(
            "Estas seguro de que quieres eliminar esta marca?",
        );

        if (!confirmed) return;

        setError("");
        setSuccess("");

        try {
            const response = await fetch(`${getApiUrl()}/brands/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message ?? "No fue posible eliminar la marca.");
                return;
            }

            setSuccess("La marca se elimino correctamente.");
            if (editingId === id) resetForm();
            await loadBrands();
        } catch {
            setError("Error de conexion con el backend.");
        }
    }

    return (
        <PanelShell
            eyebrow="Modulo CRUD"
            title="Marcas"
            description="Este panel se conecta con tus endpoints GET, POST, PATCH y DELETE de brands."
        >
            {error && <ErrorBanner message={error} />}
            {success && <SuccessBanner message={success} />}

            <CrudGrid
                form={
                    <>
                        <FormTitle
                            title={editingId ? "Editar marca" : "Nueva marca"}
                            description="El mismo formulario sirve para crear y editar. Si editingId tiene valor, el flujo cambia de POST a PATCH."
                        />

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Field label="Nombre">
                                <Input
                                    type="text"
                                    placeholder="Ej: Lenovo"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                />
                            </Field>

                            <label className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={status}
                                    onChange={(event) => setStatus(event.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300"
                                />
                                Marca activa
                            </label>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <PrimaryButton type="submit" disabled={submitting}>
                                    {submitting
                                        ? "Guardando..."
                                        : editingId
                                          ? "Actualizar marca"
                                          : "Crear marca"}
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
                    </>
                }
                table={
                    <>
                        <DataTitle
                            title="Listado de marcas"
                            description="Aqui se refleja el estado actual del backend despues de cada accion."
                        />

                        {loading ? (
                            <EmptyState
                                title="Cargando marcas..."
                                description="Estamos esperando la respuesta de GET /brands."
                            />
                        ) : brands.length === 0 ? (
                            <EmptyState
                                title="No hay marcas registradas"
                                description="Crea la primera marca desde el formulario."
                            />
                        ) : (
                            <Table headers={["Nombre", "Estado", "Acciones"]}>
                                {brands.map((brand) => (
                                    <tr key={brand.id}>
                                        <RowCell>{brand.name}</RowCell>
                                        <RowCell>
                                            <StatusBadge active={brand.status} />
                                        </RowCell>
                                        <RowCell>
                                            <div className="flex gap-2">
                                                <SecondaryButton
                                                    type="button"
                                                    onClick={() => handleEdit(brand)}
                                                    className="px-3 py-2"
                                                >
                                                    Editar
                                                </SecondaryButton>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(brand.id)}
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
                    </>
                }
            />
        </PanelShell>
    );
}
