import React from 'react'

export default function Footer(){
  return (
    <footer className="bg-site">
      <div className="container py-6 text-center text-muted text-sm">© {new Date().getFullYear()} Sweet Shop. All rights reserved.</div>
    </footer>
  )
}
