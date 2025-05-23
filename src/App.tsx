import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'

const Home = lazy(() => import('../app/(main)/page'))
const Chat = lazy(() => import('../app/(main)/chats/[id]/page'))
const Share = lazy(() => import('../app/share/v2/[messageId]/page'))
const Login = lazy(() => import('../app/(auth)/login/page'))

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 antialiased">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chats/:id" element={<Chat />} />
          <Route path="/share/v2/:messageId" element={<Share />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App