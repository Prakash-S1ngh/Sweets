import { useState } from 'react'
import './index.css'
import Layout from './components/Layout'
import SweetCard from './components/SweetCard'

function App() {
  const [sweets] = useState([
    { id: 1, name: 'Gulab Jamun', category: 'Indian', price: 2, quantity: 10 },
    { id: 2, name: 'Baklava', category: 'Middle-Eastern', price: 3, quantity: 5 },
  ])

  const handleBuy = (sweet) => {
    alert(`Buy ${sweet.name} — not wired yet`)
  }

  return (
    <Layout>
      <div className="card">
        <h2 className="text-xl font-bold mb-2">Available Sweets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sweets.map((s) => (
            <SweetCard key={s.id} sweet={s} onBuy={handleBuy} />
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default App
