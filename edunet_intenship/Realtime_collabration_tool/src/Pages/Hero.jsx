import React from 'react'
import './Hero.css'
import hero from '../Components/assets/heroimg.jpeg'


const Hero = () => {
  return (
    <div className='Hero_container'>
      <div className="Hero_content">
        <h2>Collaborate and Create — Your Documents, Your Way!</h2>
        <p>Empower your team to write, edit, and collaborate in real time. Experience document collaboration like never before!</p>
      </div>
      <div className="Hero_img">
        <img src={hero} alt="hero" />
      </div>
    </div>
  )
}

export default Hero
