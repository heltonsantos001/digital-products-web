import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../../services/auth.service';
import { getErrorMessage } from '../../services/api';
import { KeyRound, Lock, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const resetSchema = z.object({
  token: z.string().min(10, 'Informe o token recebido'),
  password: z.string().min(8, 'A nova senha deve ter no mínimo 8 caracteres'),
  confirmPassword: z.string().min(8, 'Confirme a nova senha'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type ResetData = z.infer<typeof resetSchema>;

export const AdminResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetData) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await authService.resetPassword(data.token.trim(), data.password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/login');
      }, 3000);
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-pink-light text-brand-pink flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-brand-navy">Redefinir Senha</h1>
          <p className="text-xs text-slate-500 font-semibold">
            Insira o token de verificação e defina sua nova senha
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {success ? (
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="font-extrabold text-sm text-emerald-900">Senha Alterada com Sucesso!</h3>
            <p className="text-xs text-emerald-800 font-medium">
              Redirecionando para a tela de login em alguns instantes...
            </p>
            <Link
              to="/admin/login"
              className="inline-block mt-2 text-xs font-bold text-brand-navy underline"
            >
              Fazer login agora
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Token de Recuperação
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register('token')}
                  placeholder="Cole o token recebido"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-pink/50 text-sm font-semibold font-mono"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-4 top-3.5" />
              </div>
              {errors.token && (
                <p className="text-rose-600 text-xs font-bold mt-1">{errors.token.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nova Senha (mínimo 8 caracteres)
              </label>
              <div className="relative">
                <input
                  type="password"
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-pink/50 text-sm font-semibold"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-4 top-3.5" />
              </div>
              {errors.password && (
                <p className="text-rose-600 text-xs font-bold mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                {...register('confirmPassword')}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-pink/50 text-sm font-semibold"
              />
              {errors.confirmPassword && (
                <p className="text-rose-600 text-xs font-bold mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="candy-button w-full bg-brand-yellow hover:bg-brand-yellow-hover text-brand-navy font-black text-sm py-3.5 rounded-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Atualizando senha...</span>
                </>
              ) : (
                <span>Atualizar Senha</span>
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-navy transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao login</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
