'use client'

import { useState } from 'react'
import { login, signup } from '@/app/actions/auth'
import { Terminal } from 'lucide-react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Explicitly pass the action type ('login' or 'signup') on button click
  const handleAuth = async (e: React.MouseEvent<HTMLButtonElement>, actionType: 'login' | 'signup') => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    // Grab the closest form element manually to ensure clean FormData extraction
    const form = e.currentTarget.closest('form')
    if (!form) return

    const formData = new FormData(form)
    
    // Fire the matching Server Action
    const result = actionType === 'login' ? await login(formData) : await signup(formData)

    setLoading(false)
    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setMessage(result.success)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="p-3 bg-zinc-800 rounded-lg text-emerald-400">
            <Terminal className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-semibold text-zinc-100">Welcome to DevCommand</h1>
          <p className="text-xs text-zinc-400">Sign in or create your developer profile</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-400">Email Address</label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-400">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 p-2 rounded">{error}</p>}
          {message && <p className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 p-2 rounded">{message}</p>}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={(e) => handleAuth(e, 'login')}
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-zinc-100 font-medium py-2 rounded-lg text-sm transition-colors"
            >
              Log In
            </button>
            <button
              type="button"
              onClick={(e) => handleAuth(e, 'signup')}
              disabled={loading}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 text-zinc-300 font-medium py-2 rounded-lg text-sm border border-zinc-700 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
