import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { AuthMode, UserProfile } from '../types/auth';

interface AuthViewProps {
  onSuccessLogin: (user: UserProfile) => void;
  initialMode?: AuthMode;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccessLogin, initialMode = 'login' }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(true);

  // UI helpers
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handler para inicio de sesión clásico (Email / Password)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setErrorMsg('Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (mode === 'register') {
      const trimmedName = name.trim();
      if (!trimmedName) {
        setErrorMsg('Por favor ingresa tu nombre completo.');
        return;
      }

      if (password !== confirmPassword) {
        setErrorMsg('Las contraseñas no coinciden. Verifícalas.');
        return;
      }

      if (!acceptTerms) {
        setErrorMsg('Debes aceptar los términos y condiciones para continuar.');
        return;
      }

      // Simulación de registro
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const newUser: UserProfile = {
          id: `usr-${Date.now()}`,
          name: trimmedName,
          email: trimmedEmail,
          provider: 'email',
          createdAt: Date.now(),
        };
        onSuccessLogin(newUser);
      }, 700);
      return;
    }

    // Modo Login
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const loggedUser: UserProfile = {
        id: `usr-demo-${Date.now()}`,
        name: trimmedEmail.split('@')[0].replace(/[._]/g, ' '),
        email: trimmedEmail,
        provider: 'email',
        createdAt: Date.now(),
      };
      onSuccessLogin(loggedUser);
    }, 700);
  };

  // Handler para "Continuar con Google"
  const handleGoogleAuth = () => {
    setIsLoading(true);
    setErrorMsg(null);

    // Simulación de flujo OAuth Google listo para vincular con backend (Laravel Socialite)
    setTimeout(() => {
      setIsLoading(false);
      const googleUser: UserProfile = {
        id: `usr-google-${Date.now()}`,
        name: 'Usuario Google',
        email: 'usuario.google@gmail.com',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        provider: 'google',
        createdAt: Date.now(),
      };
      onSuccessLogin(googleUser);
    }, 800);
  };

  // Acceso Demo Rápido
  const handleQuickDemo = () => {
    onSuccessLogin({
      id: 'usr-demo-invitado',
      name: 'Yorman Pinto',
      email: 'demo.finanzas@empresa.com',
      provider: 'email',
      createdAt: Date.now(),
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col justify-center items-center p-4 antialiased">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden flex flex-col">
        {/* Cabecera visual de la App */}
        <div className="p-6 pb-4 bg-gradient-to-b from-slate-900 to-slate-950 text-white text-center relative">
          {/* Mini Semáforo estilizado en la cabecera */}
          <div className="inline-flex items-center gap-1.5 bg-slate-800/90 px-3 py-1 rounded-full border border-slate-700/80 mb-3 shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-[11px] font-mono text-slate-300 ml-1 font-semibold">
              Semáforo Presupuesto
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {mode === 'login' ? 'Bienvenido de Nuevo' : 'Crea tu Cuenta'}
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            {mode === 'login'
              ? 'Ingresa para monitorear tus compras y el estado de tu semáforo financiero'
              : 'Empieza a controlar tus gastos mensuales con alertas inteligentes'}
          </p>
        </div>

        {/* Switch Segmentado: Iniciar Sesión / Registrarse */}
        <div className="px-6 pt-5">
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Iniciar Sesión
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Registrarse
            </button>
          </div>
        </div>

        <div className="p-6 pt-4 space-y-4">
          {/* BOTÓN GOOGLE OAUTH */}
          <div>
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogleAuth}
              className="w-full py-3 px-4 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors flex items-center justify-center gap-3 text-xs font-bold text-slate-800 shadow-xs cursor-pointer disabled:opacity-60"
            >
              {/* SVG Oficial de Google */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuar con Google</span>
            </button>
          </div>

          {/* Divisor con texto */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] uppercase tracking-wider font-semibold text-slate-400 absolute">
              o con tu correo
            </span>
          </div>

          {/* Mensaje de Error si existe */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 animate-in fade-in">
              {errorMsg}
            </div>
          )}

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Campo Nombre (solo en Register) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carlos Mendoza"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Campo Correo Electrónico */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Campo Confirmar Contraseña (solo en Register) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Repite tu contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Opciones auxiliares: Recordarme / Olvidé mi contraseña (Login) */}
            {mode === 'login' && (
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Recordar sesión</span>
                </label>

                <button
                  type="button"
                  onClick={() =>
                    alert(
                      'Enlace de recuperación: Puedes conectar este flujo a la ruta de restablecimiento de contraseña de tu backend Laravel (/forgot-password).'
                    )
                  }
                  className="font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            {/* Términos y Condiciones (Register) */}
            {mode === 'register' && (
              <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer select-none pt-0.5">
                <input
                  type="checkbox"
                  required
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 mt-0.5"
                />
                <span>
                  Acepto los términos de servicio y las políticas de privacidad financiera.
                </span>
              </label>
            )}

            {/* BOTÓN PRINCIPAL DE ACCIÓN */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta Gratuita'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Switch de modo al pie */}
          <div className="text-center pt-2 text-xs text-slate-500">
            {mode === 'login' ? (
              <p>
                ¿No tienes cuenta aún?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg(null);
                  }}
                  className="font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                >
                  Regístrate aquí
                </button>
              </p>
            ) : (
              <p>
                ¿Ya tienes una cuenta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                  }}
                  className="font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                >
                  Inicia sesión aquí
                </button>
              </p>
            )}
          </div>

          {/* Acceso Rápido Demo (Ideal para probar la app sin rellenar campos) */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200/80 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Acceder directamente como Invitado / Demo</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Footer de Seguridad y Conexión Laravel */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Vistas de autenticación listas para enlazar con Laravel API</span>
        </div>
      </div>
    </div>
  );
};
