import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import LoginPage from './pages/LoginPage'
import SavedPage from './pages/SavedPage'
import TriedPage from './pages/TriedPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/saved" element={
          <ProtectedRoute><SavedPage /></ProtectedRoute>
        } />
        <Route path="/tried" element={
          <ProtectedRoute><TriedPage /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/saved" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
