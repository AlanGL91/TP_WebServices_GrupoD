import React, { useState } from 'react';
import {
  Lock,
  Mail,
  KeyRound,
  AlertCircle,
  ShieldCheck,
  UserCheck,
  Car,
  ArrowRight,
  ArrowLeft,
  UserPlus,
  RotateCcw,
  CheckCircle2,
  User,
  Phone,
  FileText,
} from 'lucide-react';
import { UserSession } from '../types';

interface LoginViewProps {
  onLoginSuccess: (user: UserSession) => void;
}

type AuthMode = 'login' | 'register' | 'cambiar-password';

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');

  // Campos comunes y de login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Campos de alta / registro
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [documento, setDocumento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rolRegistro, setRolRegistro] = useState<'CLIENTE' | 'ADMIN'>('CLIENTE');

  // Campos de cambio de contraseña
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [confirmPasswordNueva, setConfirmPasswordNueva] = useState('');

  // Estados de interfaz
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // 1. INICIAR SESIÓN
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
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

  // 2. DAR DE ALTA USUARIO
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 4) {
      setError('La contraseña debe contener al menos 4 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          nombre,
          apellido,
          documento,
          telefono,
          rol: rolRegistro,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'No se pudo completar el registro');
      }

      setSuccess('¡Usuario registrado con éxito! Iniciando sesión...');
      setTimeout(() => {
        onLoginSuccess(data.user);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Error al dar de alta el usuario');
    } finally {
      setLoading(false);
    }
  };

  // 3. CAMBIAR CONTRASEÑA
  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (passwordNueva !== confirmPasswordNueva) {
      setError('La nueva contraseña y su confirmación no coinciden.');
      return;
    }

    if (passwordNueva.length < 4) {
      setError('La nueva contraseña debe tener al menos 4 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/cambiar-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          passwordActual,
          passwordNueva,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'No se pudo cambiar la contraseña');
      }

      setSuccess('¡Contraseña cambiada exitosamente! Ya puede iniciar sesión con su nueva clave.');
      setPassword(passwordNueva);
      setPasswordActual('');
      setPasswordNueva('');
      setConfirmPasswordNueva('');
      setTimeout(() => {
        setMode('login');
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    resetMessages();
    setMode('login');
  };

  return (
    <div id="login-container" className="min-h-screen bg-slate-900 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-900 to-slate-950 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="flex justify-center">
          <div id="login-brand-icon" className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 border border-blue-400/30">
            <Car className="w-8 h-8" />
          </div>
        </div>
        <h1 id="login-title" className="mt-4 text-center text-2xl font-extrabold tracking-tight text-white">
          Rentar
        </h1>
        <p className="mt-1 text-center text-xs text-slate-400">
          Sistema de Alquiler de Vehículos · UNLa Grupo D
        </p>
        <div className="mt-2 flex justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/60">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            Módulo de Autenticación y Cuentas (BCrypt)
          </span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white py-6 px-6 shadow-2xl rounded-2xl sm:px-8 border border-slate-100">

          {/* Mensajes de error / éxito */}
          {error && (
            <div
              id="auth-error-alert"
              className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2.5 animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <div>
                <span className="font-semibold block">Aviso:</span>
                {error}
              </div>
            </div>
          )}

          {success && (
            <div
              id="auth-success-alert"
              className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2.5 animate-in fade-in"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <div>
                <span className="font-semibold block">Operación exitosa:</span>
                {success}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VISTA PRINCIPAL: INICIAR SESIÓN                           */}
          {/* ======================================================== */}
          {mode === 'login' && (
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-900">Iniciar Sesión</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ingrese con sus credenciales registradas en el sistema.
                </p>
              </div>

              <form id="login-form" className="space-y-3.5" onSubmit={handleLoginSubmit}>
                <div>
                  <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700 mb-1">
                    Correo Electrónico
                  </label>
                  <div className="relative rounded-lg">
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
                      className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700">
                      Contraseña
                    </label>
                    <button
                      type="button"
                      id="link-olvidaste-password"
                      onClick={() => {
                        setMode('cambiar-password');
                        resetMessages();
                      }}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      ¿Olvidaste o querés cambiar tu contraseña?
                    </button>
                  </div>
                  <div className="relative rounded-lg">
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
                      className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="btn-submit-login"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 mt-2 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-colors cursor-pointer"
                >
                  {loading ? (
                    <span>Verificando credenciales...</span>
                  ) : (
                    <>
                      <span>Iniciar Sesión</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Botón para dar de alta / registro */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600">¿No posee una cuenta registrada?</span>
                <button
                  type="button"
                  id="btn-switch-register"
                  onClick={() => {
                    setMode('register');
                    resetMessages();
                  }}
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Crear una cuenta
                </button>
              </div>

              {/* Perfiles de prueba precargados */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-2 text-center">
                  Perfiles rápidos de prueba
                </span>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    id="btn-demo-admin"
                    onClick={() => handleQuickLogin('admin@rentar.com', 'Admin123*')}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                          Administrador (ROLE_ADMIN)
                        </div>
                        <div className="text-[11px] text-slate-500">
                          admin@rentar.com
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-600 px-2 py-0.5 rounded bg-blue-50">
                      Cargar
                    </span>
                  </button>

                  <button
                    type="button"
                    id="btn-demo-cliente"
                    onClick={() => handleQuickLogin('juan.perez@example.com', 'Cliente123*')}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                          Cliente (ROLE_CLIENTE)
                        </div>
                        <div className="text-[11px] text-slate-500">
                          juan.perez@example.com
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 px-2 py-0.5 rounded bg-emerald-50">
                      Cargar
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODO: ALTA DE USUARIO                                    */}
          {/* ======================================================== */}
          {mode === 'register' && (
            <div>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  resetMessages();
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 mb-3 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Volver a Iniciar Sesión
              </button>

              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-900">Crear una Cuenta</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete los datos personales para registrar su usuario en el sistema.
                </p>
              </div>

              <form id="register-form" className="space-y-3" onSubmit={handleRegisterSubmit}>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="reg-nombre" className="block text-xs font-semibold text-slate-700 mb-1">
                      Nombre
                    </label>
                    <div className="relative rounded-lg">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <input
                        id="reg-nombre"
                        type="text"
                        required
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Juan"
                        className="block w-full pl-8 pr-2 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="reg-apellido" className="block text-xs font-semibold text-slate-700 mb-1">
                      Apellido
                    </label>
                    <input
                      id="reg-apellido"
                      type="text"
                      required
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      placeholder="Pérez"
                      className="block w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="reg-doc" className="block text-xs font-semibold text-slate-700 mb-1">
                      DNI / Documento
                    </label>
                    <div className="relative rounded-lg">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                        <FileText className="h-3.5 w-3.5" />
                      </div>
                      <input
                        id="reg-doc"
                        type="text"
                        value={documento}
                        onChange={(e) => setDocumento(e.target.value)}
                        placeholder="35123456"
                        className="block w-full pl-8 pr-2 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="reg-tel" className="block text-xs font-semibold text-slate-700 mb-1">
                      Teléfono
                    </label>
                    <div className="relative rounded-lg">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="h-3.5 w-3.5" />
                      </div>
                      <input
                        id="reg-tel"
                        type="text"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="11-4567-8900"
                        className="block w-full pl-8 pr-2 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-700 mb-1">
                    Correo Electrónico (desc_email)
                  </label>
                  <div className="relative rounded-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="reg-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nuevo.usuario@rentar.com"
                      className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-700 mb-1">
                      Contraseña
                    </label>
                    <input
                      id="reg-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-confirm-password" className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirmar
                    </label>
                    <input
                      id="reg-confirm-password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rol Asignado
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRolRegistro('CLIENTE')}
                      className={`p-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer ${
                        rolRegistro === 'CLIENTE'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      CLIENTE
                    </button>
                    <button
                      type="button"
                      onClick={() => setRolRegistro('ADMIN')}
                      className={`p-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer ${
                        rolRegistro === 'ADMIN'
                          ? 'border-blue-500 bg-blue-50 text-blue-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      ADMIN
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  id="btn-submit-register"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 mt-3 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-colors cursor-pointer"
                >
                  {loading ? (
                    <span>Registrando usuario...</span>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Registrar Cuenta</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    resetMessages();
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700 hover:underline cursor-pointer"
                >
                  ¿Ya posee una cuenta registrada? Iniciar sesión
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODO: CAMBIAR CONTRASEÑA                                 */}
          {/* ======================================================== */}
          {mode === 'cambiar-password' && (
            <div>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  resetMessages();
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 mb-3 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Volver a Iniciar Sesión
              </button>

              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-900">Cambiar Contraseña</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ingrese su correo y la nueva contraseña para actualizar su credencial.
                </p>
              </div>

              <form id="password-form" className="space-y-3.5" onSubmit={handlePasswordChangeSubmit}>
                <div>
                  <label htmlFor="pwd-email" className="block text-xs font-semibold text-slate-700 mb-1">
                    Correo Electrónico del Usuario
                  </label>
                  <div className="relative rounded-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="pwd-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="usuario@rentar.com"
                      className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="pwd-actual" className="block text-xs font-semibold text-slate-700 mb-1">
                    Contraseña Actual (opcional si es blanqueo)
                  </label>
                  <div className="relative rounded-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="pwd-actual"
                      type="password"
                      value={passwordActual}
                      onChange={(e) => setPasswordActual(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="pwd-nueva" className="block text-xs font-semibold text-slate-700 mb-1">
                    Nueva Contraseña
                  </label>
                  <div className="relative rounded-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <input
                      id="pwd-nueva"
                      type="password"
                      required
                      value={passwordNueva}
                      onChange={(e) => setPasswordNueva(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="pwd-confirm-nueva" className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirmar Nueva Contraseña
                  </label>
                  <div className="relative rounded-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <input
                      id="pwd-confirm-nueva"
                      type="password"
                      required
                      value={confirmPasswordNueva}
                      onChange={(e) => setConfirmPasswordNueva(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="btn-submit-change-password"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 mt-2 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-colors cursor-pointer"
                >
                  {loading ? (
                    <span>Actualizando contraseña...</span>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      <span>Actualizar Contraseña</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    resetMessages();
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700 hover:underline cursor-pointer"
                >
                  Volver al inicio de sesión
                </button>
              </div>
            </div>
          )}

        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-slate-400">
            Compatible con Spring Security BCrypt · UNLa Rentar 2026
          </p>
        </div>
      </div>
    </div>
  );
};
