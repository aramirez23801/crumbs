import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { authApi } from '../api/auth'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await authApi.resetPassword(token!, newPassword)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
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

      {/* Content */}
      <div className='flex-1 px-6 py-8 max-w-md mx-auto w-full'>
        {!token ? (
          <div className='flex flex-col gap-6'>
            <div>
              <h2 className='font-serif text-2xl font-bold text-brown-dark mb-2'>
                Invalid link
              </h2>
              <p className='text-sm text-brown-light'>
                This reset link is missing a token. Please request a new one.
              </p>
            </div>
            <p className='text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg'>
              No reset token found in the URL.
            </p>
            <Link
              to='/forgot-password'
              className='text-sm text-brown-light hover:text-brown-dark transition-colors text-center'
            >
              ← Request a new reset link
            </Link>
          </div>
        ) : success ? (
          <div className='flex flex-col gap-6'>
            <h2 className='font-serif text-2xl font-bold text-brown-dark mb-2'>
              Password reset!
            </h2>
            <p className='text-sm text-brown-dark bg-cream-dark px-4 py-3 rounded-xl'>
              Your password has been updated. Redirecting you to login…
            </p>
          </div>
        ) : (
          <div className='flex flex-col gap-4'>
            <div className='mb-4'>
              <h2 className='font-serif text-2xl font-bold text-brown-dark mb-2'>
                Reset password
              </h2>
              <p className='text-sm text-brown-light'>
                Choose a new password for your account.
              </p>
            </div>

            <div>
              <label className='text-xs font-semibold uppercase tracking-wide text-brown-light mb-1.5 block'>
                New password
              </label>
              <input
                type='password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder='••••••••'
                className='w-full px-4 py-3 rounded-xl border border-[#E8E2DA] bg-white text-brown-dark placeholder-brown-light/60 text-sm outline-none focus:border-terracotta transition-colors'
              />
            </div>

            <div>
              <label className='text-xs font-semibold uppercase tracking-wide text-brown-light mb-1.5 block'>
                Confirm password
              </label>
              <input
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder='••••••••'
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
              {loading ? 'Please wait...' : 'Reset password'}
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
