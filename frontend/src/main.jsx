import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/context/ThemeContext'
import App from './App.jsx'
import './index.css'

const queryClient = new QueryClient()

async function applyDynamicFavicon() {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || '/api'
    const res = await fetch(`${apiUrl}/settings`)
    const json = await res.json()
    const faviconUrl = json?.data?.favicon?.url
    if (faviconUrl) {
      const link = document.getElementById('dynamic-favicon')
        || document.querySelector("link[rel~='icon']")
      if (link) {
        link.href = faviconUrl
        link.type = 'image/png'
      }
    }
  } catch {
    // silently fall back to the static favicon in index.html
  }
}

applyDynamicFavicon()
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
)
