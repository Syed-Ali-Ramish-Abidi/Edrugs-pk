import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import ChatbotWidget from './components/ChatbotWidget'
import Home from './pages/Home'

export default function AppSimple() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <ChatbotWidget />
      </CartProvider>
    </BrowserRouter>
  )
}
