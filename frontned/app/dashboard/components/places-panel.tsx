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
    SuccessBanner,
    Table,
} from "./dashboard-ui";

type Place = {
    id: number;
    name: string;
    address: string;
};

export default function PlacesPanel() {
    const [places, setPlaces] = useState<Place[]>([]);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        void loadPlaces();
    }, []);

    async function loadPlaces() {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${getApiUrl()}/places`);
            const data = await response.json();

            if (!response.ok) {
                setError("No fue posible cargar las sedes.");
                return;
            }

            setPlaces(data);
        } catch {
            setError("Error de conexion con el backend.");
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        setName("");
        setAddress("");
        setEditingId(null);
    }

    function handleEdit(place: Place) {
        setEditingId(place.id);
        setName(place.name);
        setAddress(place.address);
        setError("");
        setSuccess("");
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!name.trim() || !address.trim()) {
            setError("Nombre y direccion son obligatorios.");
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch(
                editingId
                    ? `${getApiUrl()}/places/${editingId}`
                    : `${getApiUrl()}/places`,
                {
                    method: editingId ? "PATCH" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: name.trim(),
                        address: address.trim(),
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message ?? "No fue posible guardar la sede.");
                return;
            }

            setSuccess(
                editingId
                    ? "La sede se actualizo correctamente."
                    : "La sede se creo correctamente.",
            );
            resetForm();
            await loadPlaces();
        } catch {
            setError("Error de conexion con el backend.");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id: number) {
        const confirmed = window.confirm(
            "Estas seguro de que quieres eliminar esta sede?",
        );

        if (!confirmed) return;

        setError("");
        setSuccess("");

        try {
            const response = await fetch(`${getApiUrl()}/places/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message ?? "No fue posible eliminar la sede.");
                return;
            }

            setSuccess("La sede se elimino correctamente.");
            if (editingId === id) resetForm();
            await loadPlaces();
        } catch {
            setError("Error de conexion con el backend.");
        }
    }

    return (
        <PanelShell
            eyebrow="Modulo CRUD"
            title="Sedes"
            description="Este modulo ya trabaja con dos campos y es una buena practica para entender formularios controlados."
        >
            {error && <ErrorBanner message={error} />}
            {success && <SuccessBanner message={success} />}

            <CrudGrid
                form={
                    <>
                        <FormTitle
                            title={editingId ? "Editar sede" : "Nueva sede"}
                            description="Cada input modifica su estado y luego se empaqueta en el body del fetch."
                        />

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Field label="Nombre">
                                <Input
                                    type="text"
                                    placeholder="Ej: Sede Norte"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                />
                            </Field>

                            <Field label="Direccion">
                                <Input
                                    type="text"
                                    placeholder="Ej: Calle 45 # 12-20"
                                    value={address}
                                    onChange={(event) => setAddress(event.target.value)}
                                />
                            </Field>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <PrimaryButton type="submit" disabled={submitting}>
                                    {submitting
                                        ? "Guardando..."
                                        : editingId
                                          ? "Actualizar sede"
                                          : "Crear sede"}
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
                            title="Listado de sedes"
                            description="Aqui ya puedes validar como el frontend renderiza informacion de ubicaciones reales."
                        />

                        {loading ? (
                            <EmptyState
                                title="Cargando sedes..."
                                description="Estamos consultando GET /places."
                            />
                        ) : places.length === 0 ? (
                            <EmptyState
                                title="No hay sedes registradas"
                                description="Crea la primera sede desde el formulario."
                            />
                        ) : (
                            <Table headers={["Nombre", "Direccion", "Acciones"]}>
                                {places.map((place) => (
                                    <tr key={place.id}>
                                        <RowCell>{place.name}</RowCell>
                                        <RowCell>{place.address}</RowCell>
                                        <RowCell>
                                            <div className="flex gap-2">
                                                <SecondaryButton
                                                    type="button"
                                                    onClick={() => handleEdit(place)}
                                                    className="px-3 py-2"
                                                >
                                                    Editar
                                                </SecondaryButton>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(place.id)}
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
