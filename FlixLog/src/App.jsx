import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Favorites from './pages/Favorites'
import WatchList from './pages/WatchList'
import Ongoing from './pages/Ongoing'
import Login from './pages/Login'
import Register from './pages/Register'
import { AuthProvider } from './context/AuthContext'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import Details from './pages/Details'

function App() {
  const [count, setCount] = useState(0)

  return (
      <>
        <AuthProvider>
          <NavBar/>
          <ToastContainer />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/watch-list" element={<WatchList />} />
              <Route path="/ongoing" element={<Ongoing />} />
              <Route path="/login" element={<Login/>} />
              <Route path="/register" element={<Register/>} />
              <Route path="/details/:id/:mediaType" element={<Details />} />
            </Routes>
          </main>
        </AuthProvider>
      </>
  )
}

export default App
