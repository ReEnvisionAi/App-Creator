import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Share from './pages/Share'
import { Toaster } from './components/ui/toaster'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 antialiased">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats/:id" element={<Chat />} />
        <Route path="/share/v2/:messageId" element={<Share />} />
      </Routes>
      <Toaster />
    </div>
  )
}