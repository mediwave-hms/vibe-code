import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Compass } from 'lucide-react';

export default function Page404() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center max-w-lg">
        <div className="relative inline-block mb-8">
          <div
            className="text-[120px] sm:text-[160px] font-black leading-none tracking-tighter bg-gradient-to-br from-slate-900 via-blue-600 to-violet-600 bg-clip-text text-transparent select-none"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            404
          </div>
          <div className="absolute -top-4 -right-8 sm:-right-12 w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-blue-200 to-violet-200 blur-3xl opacity-60 -z-10" />
          <div className="absolute -bottom-4 -left-8 sm:-left-12 w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-emerald-200 to-sky-200 blur-3xl opacity-60 -z-10" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-3">
          <Compass className="w-5 h-5 text-slate-400" />
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Page not found
          </p>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
          We couldn't find that page
        </h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          The link may be broken, or the page may have been moved. Let's get you back to somewhere
          useful.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
