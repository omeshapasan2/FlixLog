import { useState, useEffect } from 'react'
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
import PreLoader from './components/PreLoader'
import Profile from './pages/Profile'
import { Analytics } from "@vercel/analytics/react"

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <PreLoader />;
  }

  return (
      <>
        <Analytics/>
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
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </AuthProvider>
      </>
  )
}

export default App
