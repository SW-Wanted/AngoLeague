import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const { signInWithEmail, signInWithGithub, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signInWithEmail(email, password);
    setLoading(false);
    if (error) setError(error.message);
    else onSuccess?.();
  }

  async function onGithub() {
    setLoading(true);
    setError(null);
    const { error } = await signInWithGithub();
    setLoading(false);
    if (error) setError(error.message);
    else onSuccess?.();
  }

  async function onReset() {
    if (!email) return setError("Informe seu e-mail para recuperar a senha.");
    setLoading(true);
    setError(null);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) setError(error.message);
    else alert("Enviamos um e-mail para redefinição de senha.");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 bg-white rounded-xl border border-gray-100 p-6"
    >
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          E-mail
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
          placeholder="email@dominio.com"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
          placeholder="••••••••"
          required
        />
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="flex flex-col gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50"
        >
          Entrar
        </button>
        <button
          type="button"
          onClick={onGithub}
          disabled={loading}
          className="px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50"
        >
          Entrar com GitHub
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={loading}
          className="text-sm text-gray-500 hover:text-gray-700 text-left"
        >
          Esqueci minha senha
        </button>
      </div>
    </form>
  );
}
