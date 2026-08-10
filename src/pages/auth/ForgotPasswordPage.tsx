import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle2, Heart } from 'lucide-react';
import { cn } from '../../lib/cn';
import { toastSuccess } from '../../lib/toast';

const forgotSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (data: ForgotFormData) => {
    setSubmittedEmail(data.email);
    setSent(true);
    toastSuccess('Reset link sent', 'If an account exists, you will receive an email shortly.');
  };

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-br from-blue-50 to-violet-50 p-7 border-b border-slate-100">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 mb-5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-lg leading-tight">MediWave HMS</p>
                <p className="text-xs text-slate-500 leading-tight">Account recovery</p>
              </div>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-1">Reset your password</h1>
            <p className="text-sm text-slate-500">
              Enter your email and we'll send you a secure reset link.
            </p>
          </div>

          <div className="p-7">
            {sent ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">Check your inbox</h2>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  If <span className="font-medium text-slate-700">{submittedEmail}</span> is linked
                  to a MediWave account, we've emailed a password reset link. The link will expire
                  in 1 hour.
                </p>
                <div className="space-y-2.5">
                  <button
                    onClick={() => navigate('/auth/login')}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
                  >
                    Return to sign in
                  </button>
                  <button
                    onClick={() => {
                      setSent(false);
                      setSubmittedEmail('');
                    }}
                    className="w-full text-sm font-medium text-slate-600 hover:text-slate-900 py-2"
                  >
                    Didn't receive it? Try again
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Work email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@hospital.com"
                      className={cn(
                        'w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm outline-none transition-all',
                        errors.email
                          ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                          : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                      )}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5">
                  <p className="text-xs text-amber-800 leading-relaxed">
                    <span className="font-semibold">For this demo:</span> password resets are
                    simulated. Use one of the demo accounts on the sign-in page to continue.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-60 transition-colors"
                >
                  {isSubmitting ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-white/60">
          © {new Date().getFullYear()} MediWave HMS — demo environment
        </p>
      </div>
    </div>
  );
}
