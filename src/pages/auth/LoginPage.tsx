import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Heart,
  Activity,
  Stethoscope,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/cn';
import { toastError } from '../../lib/toast';

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const features = [
  {
    icon: Activity,
    title: 'Wave-based operations',
    text: 'Structured care cycles keep every case on track with clear deadlines and milestones.',
  },
  {
    icon: Stethoscope,
    title: 'Smart clinician matching',
    text: 'Case applications and review workflows ensure the right provider takes each case.',
  },
  {
    icon: ShieldCheck,
    title: 'Auditable reviews',
    text: 'Structured peer and patient reviews drive continuous improvement every wave.',
  },
  {
    icon: Heart,
    title: 'Patient-first design',
    text: 'End-to-end visibility from registration through follow-up, for every patient.',
  },
];

const demoCredentials = [
  { email: 'admin@hospital.com', password: 'admin123', role: 'Admin' },
  { email: 'dr.simmons@hospital.com', password: 'doctor123', role: 'Dept Head' },
  { email: 'dr.liu@hospital.com', password: 'doctor123', role: 'Clinician' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setSubmitError(null);
    const result = login(data.email, data.password);
    if (!result.success) {
      setSubmitError(result.message ?? 'Invalid email or password. Please try the demo credentials below.');
      toastError('Login failed', result.message ?? 'Invalid credentials');
      return;
    }
    const cleanRedirect = redirect.startsWith('/auth') ? '/dashboard' : redirect;
    navigate(cleanRedirect, { replace: true });
  };

  const fillDemo = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
    setSubmitError(null);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      <div className="hidden lg:flex relative overflow-hidden gradient-mesh flex-col justify-between p-12 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-lg leading-tight">MediWave HMS</p>
              <p className="text-xs text-white/60 leading-tight">cycle-driven healthcare</p>
            </div>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight mb-4 max-w-xl" style={{ fontFamily: "'Fraunces', serif" }}>
            Cycle-driven healthcare operations.
          </h1>
          <p className="text-white/70 text-lg max-w-lg leading-relaxed">
            Run every program in waves. Assign cases fairly, review outcomes transparently, and
            improve continuously — one structured cycle at a time.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-5 max-w-xl">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl bg-white/5 backdrop-blur border border-white/10 p-4 hover:bg-white/10 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center mb-3">
                <f.icon className="w-5 h-5" />
              </div>
              <p className="font-semibold text-sm mb-1">{f.title}</p>
              <p className="text-xs text-white/60 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>

        <div className="relative z-10 text-xs text-white/40">
          © {new Date().getFullYear()} MediWave HMS. For demonstration purposes only.
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-lg leading-tight">MediWave HMS</p>
              <p className="text-xs text-slate-500 leading-tight">Hospital Management System</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-500 text-sm">
              Sign in to your MediWave account to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="clinician@hospital.com"
                  className={cn(
                    'w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm outline-none transition-all',
                    errors.email || submitError
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50/30'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white'
                  )}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <Link
                  to="/auth/forgot-password"
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={cn(
                    'w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm outline-none transition-all',
                    errors.password || submitError
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50/30'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white'
                  )}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password.message}
                </p>
              )}
            </div>

            <label className="flex items-center gap-2 select-none cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                {...register('remember')}
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900">
                Remember me on this device
              </span>
            </label>

            {submitError && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 flex gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4">
            <p className="text-xs font-semibold text-slate-700 mb-2.5">
              Demo credentials — click to fill:
            </p>
            <div className="space-y-1.5">
              {demoCredentials.map((d) => (
                <button
                  key={d.email}
                  type="button"
                  onClick={() => fillDemo(d.email, d.password)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-slate-800 truncate">{d.email}</p>
                    <p className="text-[11px] text-slate-500">password: {d.password}</p>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md bg-slate-200/70 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700 shrink-0">
                    {d.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Need access?{' '}
            <Link
              to="/auth/forgot-password"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Contact your administrator
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
