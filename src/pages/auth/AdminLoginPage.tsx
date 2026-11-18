import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { getErrorMessage } from '../../services/api';
import { Lock, Mail, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

const loginFormSchema = z.object({
  email: z.string().email('Informe um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export const AdminLoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/admin';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await login(data.email.trim(), data.password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy-900 via-brand-navy-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto shadow-candy">
            <img
              src="/logo.png"
              alt="Meu Mundo de Recortes"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <h1 className="text-2xl font-black text-brand-navy tracking-tight">
            Painel Administrativo
          </h1>
          <p className="text-xs text-slate-500 font-semibold">
            Entre com suas credenciais de gestor ou administrador
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              E-mail Administrativo
            </label>
            <div className="relative">
              <input
                type="email"
                {...register('email')}
                placeholder="admin@platform.com"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-pink/50 focus:border-brand-pink text-sm font-semibold transition-all"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute right-4 top-3.5 pointer-events-none" />
            </div>
            {errors.email && (
              <p className="text-rose-600 text-xs font-bold mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Senha
              </label>
              <Link
                to="/admin/forgot-password"
                className="text-xs font-bold text-brand-pink hover:text-brand-pink-accent transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-pink/50 focus:border-brand-pink text-sm font-semibold transition-all"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-4 top-3.5 pointer-events-none" />
            </div>
            {errors.password && (
              <p className="text-rose-600 text-xs font-bold mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="candy-button w-full bg-brand-yellow hover:bg-brand-yellow-hover text-brand-navy font-black text-base py-3.5 rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-float disabled:opacity-50 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <span>ACESSAR O PAINEL</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <Link
            to="/"
            className="text-xs font-bold text-slate-500 hover:text-brand-navy transition-colors"
          >
            ← Voltar para a Loja Pública
          </Link>
        </div>

      </div>
    </div>
  );
};
