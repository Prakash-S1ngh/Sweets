import React from 'react'

export default function SweetCard({ sweet, onBuy }){
  return (
    <div className="p-4 border rounded-md flex justify-between items-center bg-card">
      <div>
        <div className="font-semibold">{sweet.name}</div>
        <div className="text-muted text-sm">{sweet.category} • ${sweet.price}</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="muted">{sweet.quantity}</div>
        <button className="classic-btn" disabled={sweet.quantity === 0} onClick={()=>onBuy?.(sweet)}>Buy</button>
      </div>
    </div>
  )
}
