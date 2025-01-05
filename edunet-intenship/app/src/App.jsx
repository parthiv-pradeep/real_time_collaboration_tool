import { useState } from 'react'
import { createBrowserRouter,RouterProvider,Navigate }
 from 'react-router-dom'
 import EditorPage from './EditorPage';
 import LoginPage from './Login';
import RegisterPage from './RegisterPage';
import LandingPage from './LandingPage';
function App() {
    const isAuthenticated = !!localStorage.getItem('token');
  const router=createBrowserRouter([
    {
        path:'/login',
        element:    <><LoginPage/></>
      },
      {
        path:'/register',
        element:    <><RegisterPage/></>
      },
      {
        path:'/',
        element:    <><LandingPage/></>
      },
      {
        path:'/document/:id',
        element:    <>{isAuthenticated ? <EditorPage /> : <Navigate to="/login" />}</>
      },
    {
      path:'/document/:id',
      element:    <><EditorPage/></>
    },
    {
        path:'*',
        element:    <><Navigate to={`/document/${Math.random().toString(36).substr(2, 9)}`} /></>
      },
    
  ])
  
  return (
    <>
   

    <RouterProvider router={router} />
    </>
  )
}

export default App
