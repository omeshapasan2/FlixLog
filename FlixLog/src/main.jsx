import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { MoviesSeriesProvider } from './context/MoviesSeriesContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <MoviesSeriesProvider>
        
          <App />
        
      </MoviesSeriesProvider>
    </BrowserRouter>
  </StrictMode>,
)
