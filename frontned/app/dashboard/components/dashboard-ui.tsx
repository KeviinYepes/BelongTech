"use client";

import { ReactNode } from "react";

export function PanelShell({
    eyebrow,
    title,
    description,
    children,
}: {
    eyebrow: string;
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <div className="min-h-[calc(100vh-3rem)] rounded-[36px] border border-white/60 bg-white/80 p-6 shadow-[0_32px_90px_rgba(15,23,42,0.16)] backdrop-blur lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-700">
                {eyebrow}
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
                {title}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                {description}
            </p>
            <div className="mt-8 space-y-6">{children}</div>
        </div>
    );
}

export function CrudGrid({
    form,
    table,
}: {
    form: ReactNode;
    table: ReactNode;
}) {
    return (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
            <div className="rounded-[30px] border border-slate-200 bg-[#fcfaf6] p-6 shadow-sm">
                {form}
            </div>
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                {table}
            </div>
        </div>
    );
}

export function FormTitle({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Formulario
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-950">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
    );
}

export function DataTitle({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Registros
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">
                {title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
    );
}

export function Field({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
                {label}
            </span>
            {children}
        </label>
    );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={`w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 ${props.className ?? ""}`}
        />
    );
}

export function Textarea(
    props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
    return (
        <textarea
            {...props}
            className={`min-h-[110px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 ${props.className ?? ""}`}
        />
    );
}

export function Select(
    props: React.SelectHTMLAttributes<HTMLSelectElement>,
) {
    return (
        <select
            {...props}
            className={`w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 ${props.className ?? ""}`}
        />
    );
}

export function PrimaryButton({
    children,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={`rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 ${props.className ?? ""}`}
        >
            {children}
        </button>
    );
}

export function SecondaryButton({
    children,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={`rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 ${props.className ?? ""}`}
        >
            {children}
        </button>
    );
}

export function ErrorBanner({ message }: { message: string }) {
    return (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {message}
        </div>
    );
}

export function SuccessBanner({ message }: { message: string }) {
    return (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {message}
        </div>
    );
}

export function EmptyState({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 px-5 py-8 text-center">
            <p className="text-lg font-semibold text-slate-900">{title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
    );
}

export function Table({
    headers,
    children,
}: {
    headers: string[];
    children: ReactNode;
}) {
    return (
        <div className="overflow-hidden rounded-[28px] border border-slate-200">
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead className="bg-slate-950 text-left text-xs uppercase tracking-[0.22em] text-slate-200">
                        <tr>
                            {headers.map((header) => (
                                <th key={header} className="px-4 py-4 font-semibold">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {children}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function RowCell({ children }: { children: ReactNode }) {
    return <td className="px-4 py-4 text-sm text-slate-700">{children}</td>;
}

export function StatusBadge({
    active,
    activeLabel = "Activo",
    inactiveLabel = "Inactivo",
}: {
    active: boolean;
    activeLabel?: string;
    inactiveLabel?: string;
}) {
    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                active
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-200 text-slate-700"
            }`}
        >
            {active ? activeLabel : inactiveLabel}
        </span>
    );
}
