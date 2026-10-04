"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Lock, Mail, User } from "lucide-react";
import { apiPost } from "@/lib/api-client";
import { useT } from "@/lib/i18n-client";

function Field({
  name,
  type,
  placeholder,
  icon,
  value,
  onChange,
}: {
  name: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <span className="absolute start-4 top-1/2 -translate-y-1/2 text-mist">{icon}</span>
      <input
        name={name}
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field !ps-11"
      />
    </div>
  );
}

function ErrorBox({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
      <AlertCircle size={16} />
      {message}
    </div>
  );
}

function useAuthSubmit(endpoint: string, next: string) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(payload: Record<string, string>) {
    setPending(true);
    setError("");
    const result = await apiPost(endpoint, { ...payload, next });
    if (!result.ok) {
      setError(result.error ?? "Error");
      setPending(false);
      return;
    }
    router.push(result.target ?? "/");
    router.refresh();
  }

  return { error, pending, submit };
}

export function LoginForm({ next }: { next: string }) {
  const { t } = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, pending, submit } = useAuthSubmit("/api/auth/login", next);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await submit({ email, password });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <ErrorBox message={error} />
      <Field name="email" type="email" placeholder={t("auth.email")} icon={<Mail size={16} />} value={email} onChange={setEmail} />
      <Field name="password" type="password" placeholder={t("auth.password")} icon={<Lock size={16} />} value={password} onChange={setPassword} />
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? <Loader2 size={17} className="animate-spin" /> : t("auth.signIn")}
      </button>
      <p className="text-center text-sm text-mist">
        {t("auth.noAccount")}{" "}
        <Link href="/register" className="font-extrabold text-brand hover:underline">
          {t("auth.createFree")}
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm({ next }: { next: string }) {
  const { t } = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, pending, submit } = useAuthSubmit("/api/auth/register", next);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await submit({ name, email, password });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <ErrorBox message={error} />
      <Field name="name" type="text" placeholder={t("auth.name")} icon={<User size={16} />} value={name} onChange={setName} />
      <Field name="email" type="email" placeholder={t("auth.email")} icon={<Mail size={16} />} value={email} onChange={setEmail} />
      <Field name="password" type="password" placeholder={t("auth.passRule")} icon={<Lock size={16} />} value={password} onChange={setPassword} />
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? <Loader2 size={17} className="animate-spin" /> : t("auth.signUp")}
      </button>
      <p className="text-center text-sm text-mist">
        {t("auth.haveAccount")}{" "}
        <Link href="/login" className="font-extrabold text-brand hover:underline">
          {t("auth.signInNow")}
        </Link>
      </p>
      <p className="text-center text-[11px] leading-5 text-mist/80">{t("auth.terms")}</p>
    </form>
  );
}
