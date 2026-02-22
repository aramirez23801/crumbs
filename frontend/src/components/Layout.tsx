import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bookmark, CheckSquare, Plus, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'

interface LayoutProps {
  children: React.ReactNode
  onAddClick?: () => void
}

export default function Layout({ children, onAddClick }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Top Nav */}
      <nav className="bg-cream border-b border-[#E8E2DA] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link to="/saved" className="font-serif text-xl font-bold text-brown-dark">
            Crum<span className="text-terracotta">bs</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden sm:flex items-center gap-1">
            <Link
              to="/saved"
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                isActive('/saved')
                  ? 'bg-terracotta-pale text-brown-dark font-semibold'
                  : 'text-brown-light hover:text-brown-dark'
              }`}
            >
              Saved
            </Link>
            <Link
              to="/tried"
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                isActive('/tried')
                  ? 'bg-terracotta-pale text-brown-dark font-semibold'
                  : 'text-brown-light hover:text-brown-dark'
              }`}
            >
              Tried
            </Link>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-8 h-8 rounded-full bg-terracotta flex items-center justify-center text-white text-sm font-semibold cursor-pointer"
            >
              {user?.username?.[0]?.toUpperCase() ?? <User size={14} />}
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-[#E8E2DA] py-1 w-40 z-20">
                <div className="px-4 py-2 text-xs text-brown-light border-b border-[#E8E2DA]">
                  {user?.username}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm text-left text-brown-mid hover:bg-cream flex items-center gap-2"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 pb-24 sm:pb-6">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E2DA] px-6 py-2 flex justify-around z-10">
        <Link
          to="/saved"
          className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all ${
            isActive('/saved') ? 'text-terracotta' : 'text-brown-light'
          }`}
        >
          <Bookmark size={20} strokeWidth={isActive('/saved') ? 2.5 : 1.5} />
          <span className="text-[10px] font-medium">Saved</span>
        </Link>
        <Link
          to="/tried"
          className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all ${
            isActive('/tried') ? 'text-terracotta' : 'text-brown-light'
          }`}
        >
          <CheckSquare size={20} strokeWidth={isActive('/tried') ? 2.5 : 1.5} />
          <span className="text-[10px] font-medium">Tried</span>
        </Link>
        <button
          onClick={onAddClick}
          className="flex flex-col items-center gap-1 px-4 py-1 rounded-xl text-brown-light"
        >
          <Plus size={20} strokeWidth={1.5} />
          <span className="text-[10px] font-medium">Add</span>
        </button>
      </div>
    </div>
  )
}
