import { Routes, Route } from 'react-router-dom'
import Modelo1View from './pages/Modelo1View'
import WhatsApp7View from './pages/WhatsApp7View'

function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: '#1a1917', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#555', fontFamily: 'Nunito Sans, sans-serif', fontSize: '0.9rem' }}>404</div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/modelo-1" element={<Modelo1View />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/whatsapp-7" element={<WhatsApp7View />} />
    </Routes>
  )
}
