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

type Category = {
    id: number;
    name: string;
};

export default function CategoriesPanel() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        void loadCategories();
    }, []);

    async function loadCategories() {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${getApiUrl()}/categories`);
            const data = await response.json();

            if (!response.ok) {
                setError("No fue posible cargar las categorias.");
                return;
            }

            setCategories(data);
        } catch {
            setError("Error de conexion con el backend.");
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        setName("");
        setEditingId(null);
    }

    function handleEdit(category: Category) {
        setEditingId(category.id);
        setName(category.name);
        setError("");
        setSuccess("");
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!name.trim()) {
            setError("El nombre de la categoria es obligatorio.");
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch(
                editingId
                    ? `${getApiUrl()}/categories/${editingId}`
                    : `${getApiUrl()}/categories`,
                {
                    method: editingId ? "PATCH" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: name.trim(),
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message ?? "No fue posible guardar la categoria.");
                return;
            }

            setSuccess(
                editingId
                    ? "La categoria se actualizo correctamente."
                    : "La categoria se creo correctamente.",
            );
            resetForm();
            await loadCategories();
        } catch {
            setError("Error de conexion con el backend.");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id: number) {
        const confirmed = window.confirm(
            "Estas seguro de que quieres eliminar esta categoria?",
        );

        if (!confirmed) return;

        setError("");
        setSuccess("");

        try {
            const response = await fetch(`${getApiUrl()}/categories/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message ?? "No fue posible eliminar la categoria.");
                return;
            }

            setSuccess("La categoria se elimino correctamente.");
            if (editingId === id) resetForm();
            await loadCategories();
        } catch {
            setError("Error de conexion con el backend.");
        }
    }

    return (
        <PanelShell
            eyebrow="Modulo CRUD"
            title="Categorias"
            description="Este recurso es ideal para aprender el patron CRUD mas simple en Next.js."
        >
            {error && <ErrorBanner message={error} />}
            {success && <SuccessBanner message={success} />}

            <CrudGrid
                form={
                    <>
                        <FormTitle
                            title={
                                editingId ? "Editar categoria" : "Nueva categoria"
                            }
                            description="Aqui practicas el mismo flujo de marcas, pero con una entidad aun mas simple."
                        />

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Field label="Nombre">
                                <Input
                                    type="text"
                                    placeholder="Ej: Portatiles"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                />
                            </Field>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <PrimaryButton type="submit" disabled={submitting}>
                                    {submitting
                                        ? "Guardando..."
                                        : editingId
                                          ? "Actualizar categoria"
                                          : "Crear categoria"}
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
                            title="Listado de categorias"
                            description="La tabla se vuelve a cargar despues de cada POST, PATCH o DELETE."
                        />

                        {loading ? (
                            <EmptyState
                                title="Cargando categorias..."
                                description="Estamos consultando GET /categories."
                            />
                        ) : categories.length === 0 ? (
                            <EmptyState
                                title="No hay categorias registradas"
                                description="Crea la primera categoria desde el formulario."
                            />
                        ) : (
                            <Table headers={["Nombre", "Acciones"]}>
                                {categories.map((category) => (
                                    <tr key={category.id}>
                                        <RowCell>{category.name}</RowCell>
                                        <RowCell>
                                            <div className="flex gap-2">
                                                <SecondaryButton
                                                    type="button"
                                                    onClick={() => handleEdit(category)}
                                                    className="px-3 py-2"
                                                >
                                                    Editar
                                                </SecondaryButton>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(category.id)
                                                    }
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
