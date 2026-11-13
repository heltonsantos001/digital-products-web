import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../../services/auth.service';
import { getErrorMessage } from '../../services/api';
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';

const forgotSchema = z.object({
  email: z.string().email('Informe um e-mail válido'),
});

type ForgotData = z.infer<typeof forgotSchema>;

export const AdminForgotPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotData) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await authService.forgotPassword(data.email.trim());
      setSent(true);
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
          <div className="w-12 h-12 rounded-2xl bg-brand-purple-light text-brand-purple flex items-center justify-center mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-brand-navy">Recuperar Senha</h1>
          <p className="text-xs text-slate-500 font-semibold">
            Informe seu e-mail para receber as instruções de redefinição
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {sent ? (
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="font-extrabold text-sm text-emerald-900">Solicitação Registrada</h3>
            <p className="text-xs text-emerald-800 font-medium leading-relaxed">
              Se o e-mail estiver cadastrado como administrador, as instruções com o token de redefinição foram despachadas.
            </p>
            <div className="pt-2">
              <Link
                to="/admin/reset-password"
                className="text-xs font-bold text-brand-navy underline"
              >
                Já possui o token? Clique aqui para redefinir
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                E-mail Cadastrado
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register('email')}
                  placeholder="admin@platform.com"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-pink/50 text-sm font-semibold"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-4 top-3.5" />
              </div>
              {errors.email && (
                <p className="text-rose-600 text-xs font-bold mt-1">{errors.email.message}</p>
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
                  <span>Enviando...</span>
                </>
              ) : (
                <span>Enviar Instruções</span>
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
