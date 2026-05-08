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

type User = {
    id: number;
    email: string;
    name: string | null;
    passwordHash: string;
    code: string | null;
    isActive: boolean;
};

type UserForm = {
    email: string;
    name: string;
    passwordHash: string;
    code: string;
    isActive: boolean;
};

const initialForm: UserForm = {
    email: "",
    name: "",
    passwordHash: "",
    code: "",
    isActive: true,
};

export default function UsersPanel() {
    const [users, setUsers] = useState<User[]>([]);
    const [form, setForm] = useState<UserForm>(initialForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        void loadUsers();
    }, []);

    async function loadUsers() {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${getApiUrl()}/users`);
            const data = await response.json();

            if (!response.ok) {
                setError("No fue posible cargar los usuarios.");
                return;
            }

            setUsers(data);
        } catch {
            setError("Error de conexion con el backend.");
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        setForm(initialForm);
        setEditingId(null);
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, type, checked } = event.target;

        setForm((current) => ({
            ...current,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function handleEdit(user: User) {
        setEditingId(user.id);
        setForm({
            email: user.email,
            name: user.name ?? "",
            passwordHash: user.passwordHash,
            code: user.code ?? "",
            isActive: user.isActive,
        });
        setError("");
        setSuccess("");
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!form.email.trim() || !form.passwordHash.trim()) {
            setError("Email y passwordHash son obligatorios.");
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch(
                editingId
                    ? `${getApiUrl()}/users/${editingId}`
                    : `${getApiUrl()}/users`,
                {
                    method: editingId ? "PATCH" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: form.email.trim(),
                        name: form.name.trim() || undefined,
                        passwordHash: form.passwordHash.trim(),
                        code: form.code.trim() || undefined,
                        isActive: form.isActive,
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message ?? "No fue posible guardar el usuario.");
                return;
            }

            setSuccess(
                editingId
                    ? "El usuario se actualizo correctamente."
                    : "El usuario se creo correctamente.",
            );
            resetForm();
            await loadUsers();
        } catch {
            setError("Error de conexion con el backend.");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id: number) {
        const confirmed = window.confirm(
            "Estas seguro de que quieres eliminar este usuario?",
        );

        if (!confirmed) return;

        setError("");
        setSuccess("");

        try {
            const response = await fetch(`${getApiUrl()}/users/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message ?? "No fue posible eliminar el usuario.");
                return;
            }

            setSuccess("El usuario se elimino correctamente.");
            if (editingId === id) resetForm();
            await loadUsers();
        } catch {
            setError("Error de conexion con el backend.");
        }
    }

    return (
        <PanelShell
            eyebrow="Modulo CRUD"
            title="Empleados"
            description="Este panel ya conecta el CRUD base de usuarios. Por ahora usa passwordHash como texto para acompanar el aprendizaje del flujo."
        >
            {error && <ErrorBanner message={error} />}
            {success && <SuccessBanner message={success} />}

            <CrudGrid
                form={
                    <>
                        <FormTitle
                            title={editingId ? "Editar usuario" : "Nuevo usuario"}
                            description="Aqui usamos un objeto form porque ya son varios campos relacionados."
                        />

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Field label="Email">
                                <Input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </Field>

                            <Field label="Nombre">
                                <Input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                />
                            </Field>

                            <Field label="Password Hash">
                                <Input
                                    type="text"
                                    name="passwordHash"
                                    value={form.passwordHash}
                                    onChange={handleChange}
                                />
                            </Field>

                            <Field label="Codigo">
                                <Input
                                    type="text"
                                    name="code"
                                    value={form.code}
                                    onChange={handleChange}
                                />
                            </Field>

                            <label className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={form.isActive}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-slate-300"
                                />
                                Usuario activo
                            </label>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <PrimaryButton type="submit" disabled={submitting}>
                                    {submitting
                                        ? "Guardando..."
                                        : editingId
                                          ? "Actualizar usuario"
                                          : "Crear usuario"}
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
                            title="Listado de empleados"
                            description="Aqui puedes practicar como el frontend refresca datos despues de cada cambio."
                        />

                        {loading ? (
                            <EmptyState
                                title="Cargando empleados..."
                                description="Estamos consultando GET /users."
                            />
                        ) : users.length === 0 ? (
                            <EmptyState
                                title="No hay empleados registrados"
                                description="Crea el primer usuario desde el formulario."
                            />
                        ) : (
                            <Table headers={["Nombre", "Email", "Estado", "Acciones"]}>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <RowCell>{user.name ?? "-"}</RowCell>
                                        <RowCell>{user.email}</RowCell>
                                        <RowCell>
                                            <StatusBadge active={user.isActive} />
                                        </RowCell>
                                        <RowCell>
                                            <div className="flex gap-2">
                                                <SecondaryButton
                                                    type="button"
                                                    onClick={() => handleEdit(user)}
                                                    className="px-3 py-2"
                                                >
                                                    Editar
                                                </SecondaryButton>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(user.id)}
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
