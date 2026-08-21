import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
          Sign in to CortexVault
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Or{' '}
          <Link href="/" className="font-medium text-cyan-400 hover:text-cyan-300">
            request an enterprise demo
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#0F172A] py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-[#1E293B]">
          <form className="space-y-6" action="/dashboard" method="GET">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  defaultValue="demo@northstardynamics.com"
                  className="appearance-none block w-full px-3 py-2 border border-[#334155] rounded-md shadow-sm placeholder-slate-400 bg-[#1E293B] text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  defaultValue="password123"
                  className="appearance-none block w-full px-3 py-2 border border-[#334155] rounded-md shadow-sm placeholder-slate-400 bg-[#1E293B] text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded bg-[#1E293B]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-cyan-400 hover:text-cyan-300">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-[#0F172A] transition-colors"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#334155]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#0F172A] text-slate-400">Or continue with SSO</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <Link href="/dashboard"
                className="w-full inline-flex justify-center py-2.5 px-4 border border-[#334155] rounded-md shadow-sm bg-[#1E293B] text-sm font-medium text-slate-300 hover:bg-[#334155] transition-colors"
              >
                Northstar Dynamics SSO (Demo)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
