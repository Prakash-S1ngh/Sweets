import { useState } from 'react'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = (e) => {
    e.preventDefault()
    alert('Register not wired yet')
  }

  return (
    <div className="container">
      <div className="card max-w-md mx-auto">
        <h3 className="text-lg font-bold mb-2">Register</h3>
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="w-full p-2 border rounded" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <button className="classic-btn w-full">Register</button>
        </form>
      </div>
    </div>
  )
}
