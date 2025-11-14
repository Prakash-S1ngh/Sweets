import React from 'react'

export default function Header(){
  return (
    <header className="bg-card border-b border-gray-200">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold">Sweet Shop</div>
          <div className="muted">Classic Selection</div>
        </div>
        <div className="flex items-center gap-3">
          <input placeholder="Search sweets..." className="p-2 border rounded-md" />
          <nav className="space-x-3">
            <a href="#" className="muted">Dashboard</a>
            <a href="#" className="muted">Admin</a>
          </nav>
        </div>
      </div>
    </header>
  )
}
