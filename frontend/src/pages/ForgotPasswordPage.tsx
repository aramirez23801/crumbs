import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { authApi } from '../api/auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await authApi.forgotPassword(email)
      setSubmitted(true)
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
        <h2 className='font-serif text-2xl font-bold text-brown-dark mb-2'>
          Forgot password?
        </h2>
        <p className='text-sm text-brown-light mb-8'>
          Enter your email and we'll send you a reset link.
        </p>

        {submitted ? (
          <div className='flex flex-col gap-6'>
            <p className='text-sm text-brown-dark bg-cream-dark px-4 py-3 rounded-xl'>
              If that email is registered, you'll receive a reset link shortly.
            </p>
            <Link
              to='/login'
              className='text-sm text-brown-light hover:text-brown-dark transition-colors text-center'
            >
              ← Back to login
            </Link>
          </div>
        ) : (
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
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
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
              {loading ? 'Please wait...' : 'Send reset link'}
            </button>

            <Link
              to='/login'
              className='text-sm text-brown-light hover:text-brown-dark transition-colors text-center'
            >
              ← Back to login
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
