import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Favorites from './pages/Favorites'
import WatchLater from './pages/WatchLater'
import Ongoing from './pages/Ongoing'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NavBar/>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/watch-later" element={<WatchLater />} />
          <Route path="/ongoing" element={<Ongoing />} />
        </Routes>
      </main>
    </>
  )
}

export default App
