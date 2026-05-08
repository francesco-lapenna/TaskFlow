import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="grid place-items-center py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-brand-600">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500">That route doesn't exist (yet).</p>
      <Link to="/" className="btn-primary mt-6">
        Back to dashboard
      </Link>
    </div>
  );
}
