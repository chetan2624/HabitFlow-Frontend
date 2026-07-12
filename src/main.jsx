import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { ClerkProvider } from '@clerk/react'

// Use the env variable, or fallback to the key directly in case the dev server wasn't restarted
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_bGl2aW5nLXdyZW4tOTUuY2xlcmsuYWNjb3VudHMuZGV2JA"

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/home">
      <AuthProvider>
        <App />
      </AuthProvider>
    </ClerkProvider>
  </React.StrictMode>,
)
