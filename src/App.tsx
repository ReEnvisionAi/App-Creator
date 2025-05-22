import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthProvider } from '@/lib/auth'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { NotificationProvider } from '@/components/notification'

const Home = lazy(() => import('@/app/(main)/page'))
const Chat = lazy(() => import('@/app/(main)/chats/[id]/page'))
const Share = lazy(() => import('@/app/share/v2/[messageId]/page'))
const Login = lazy(() => import('@/app/(auth)/login/page'))

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 antialiased">
      <AuthProvider>
        <NotificationProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/share/v2/:messageId" element={<Share />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chats/:id"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </NotificationProvider>
      </AuthProvider>
    </div>
  )
}

export default App