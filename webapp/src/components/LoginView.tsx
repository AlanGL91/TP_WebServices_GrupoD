import React, { useState } from 'react';
import { Lock, Mail, KeyRound, AlertCircle, ShieldCheck, UserCheck, Car, ArrowRight } from 'lucide-react';
import { UserSession } from '../types';

interface LoginViewProps {
  onLoginSuccess: (user: UserSession) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Credenciales inválidas');
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div id="login-container" className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-900 to-slate-950 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="flex justify-center">
          <div id="login-brand-icon" className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 border border-blue-400/30">
            <Car className="w-9 h-9" />
          </div>
        </div>
        <h1 id="login-title" className="mt-5 text-center text-3xl font-extrabold tracking-tight text-white">
          Rentar
        </h1>
        <p className="mt-2 text-center text-sm text-slate-400">
          Sistema Web de Alquiler de Vehículos · UNLa Grupo D
        </p>
        <div className="mt-1 flex justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/60">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            Módulo de Autenticación Spring Security
          </span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-100">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Iniciar Sesión</h2>
            <p className="text-xs text-slate-500 mt-1">
              Ingrese sus credenciales registradas para acceder al módulo según su perfil asignado.
            </p>
          </div>

          {error && (
            <div
              id="login-error-alert"
              className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2.5 animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <div>
                <span className="font-semibold block">Error de autenticación:</span>
                {error}
              </div>
            </div>
          )}

          <form id="login-form" className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700 mb-1">
                Correo Electrónico (Usuario)
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@rentar.com"
                  className="block w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 text-slate-900 placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700 mb-1">
                Contraseña
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 text-slate-900 placeholder-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              id="btn-submit-login"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-colors cursor-pointer"
            >
              {loading ? (
                <span>Validando credenciales...</span>
              ) : (
                <>
                  <span>Ingresar al Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Perfiles de prueba precargados */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-3 text-center">
              Seleccionar perfil de prueba rápido
            </span>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                id="btn-demo-admin"
                onClick={() => handleQuickLogin('admin@rentar.com', 'Admin123*')}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                      Administrador (ROLE_ADMIN)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      admin@rentar.com · Acceso total y ABM
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-blue-600 px-2 py-1 rounded bg-blue-50">
                  Cargar
                </span>
              </button>

              <button
                type="button"
                id="btn-demo-cliente"
                onClick={() => handleQuickLogin('juan.perez@example.com', 'Cliente123*')}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                      Cliente (ROLE_CLIENTE)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      juan.perez@example.com · Catálogo y Reservas
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 px-2 py-1 rounded bg-emerald-50">
                  Cargar
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-slate-400">
            Simulación de Sesión y Control de Acceso por Roles según Spring Security Spec
          </p>
        </div>
      </div>
    </div>
  );
};
