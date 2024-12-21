import React from 'react'
import './Navbar.css'

const Navbar = () => {
  return (
    <div className="navbar">
     <div className="logo">
        <h1>Real-Co</h1>
     </div>
     <div className="log">
        <button>Login</button>
        <button>Signup</button>
     </div>
    </div>
  )
}

export default Navbar
