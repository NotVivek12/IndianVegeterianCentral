import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App'
import './style.css'

const PUBLISHABLE_KEY = (import.meta as any).env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      signInUrl="/login"
      signUpUrl="/register"
      afterSignOutUrl="/login"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
      appearance={{
        elements: {
          rootBox: "mx-auto"
        }
      }}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)
