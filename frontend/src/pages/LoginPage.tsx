import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { authApi } from '../api/auth'
import { useAuthStore } from '../store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      const res =
        mode === 'login'
          ? await authApi.login(email, password)
          : await authApi.register(email, username, password)
      setAuth(res.user, res.api_key)
      navigate('/saved')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 422) {
          setError('Please enter a valid email address.')
        } else {
          const detail = err.response?.data?.detail
          setError(typeof detail === 'string' ? detail : 'Something went wrong')
        }
      } else {
        setError('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-cream flex flex-col'>
      {/* Hero */}
      <div className='bg-brown-dark px-6 pt-16 pb-12 flex flex-col items-center text-center'>
        <h1 className='font-serif text-4xl font-bold text-cream mb-2'>
          Crum<span className='text-terracotta-light'>bs</span>
        </h1>
        <p className='text-cream/60 text-sm'>Your personal restaurant diary</p>
      </div>

      {/* Form */}
      <div className='flex-1 px-6 py-8 max-w-md mx-auto w-full'>
        {/* Tabs */}
        <div className='flex bg-cream-dark rounded-full p-1 mb-8'>
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${
              mode === 'login'
                ? 'bg-white text-brown-dark shadow-sm'
                : 'text-brown-light'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${
              mode === 'register'
                ? 'bg-white text-brown-dark shadow-sm'
                : 'text-brown-light'
            }`}
          >
            Register
          </button>
        </div>

        {/* Fields */}
        <div className='flex flex-col gap-4'>
          <div>
            <label className='text-xs font-semibold uppercase tracking-wide text-brown-light mb-1.5 block'>
              Email
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='you@example.com'
              className='w-full px-4 py-3 rounded-xl border border-[#E8E2DA] bg-white text-brown-dark placeholder-brown-light/60 text-sm outline-none focus:border-terracotta transition-colors'
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className='text-xs font-semibold uppercase tracking-wide text-brown-light mb-1.5 block'>
                Username
              </label>
              <input
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='yourname'
                className='w-full px-4 py-3 rounded-xl border border-[#E8E2DA] bg-white text-brown-dark placeholder-brown-light/60 text-sm outline-none focus:border-terracotta transition-colors'
              />
            </div>
          )}

          <div>
            <label className='text-xs font-semibold uppercase tracking-wide text-brown-light mb-1.5 block'>
              Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='••••••••'
              className='w-full px-4 py-3 rounded-xl border border-[#E8E2DA] bg-white text-brown-dark placeholder-brown-light/60 text-sm outline-none focus:border-terracotta transition-colors'
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            {mode === 'login' && (
              <div className='flex justify-end mt-1.5'>
                <Link to='/forgot-password' className='text-xs text-brown-light hover:text-brown-dark transition-colors'>
                  Forgot password?
                </Link>
              </div>
            )}
          </div>

          {error && (
            <p className='text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg'>
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className='w-full py-3 rounded-full bg-terracotta text-white font-semibold text-sm mt-2 disabled:opacity-60 transition-opacity'
          >
            {loading
              ? 'Please wait...'
              : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  )
}
