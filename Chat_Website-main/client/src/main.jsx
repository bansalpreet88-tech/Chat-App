import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from './components/ui/sonner.jsx'
import { SocketProvider } from './context/SocketContext.jsx'


createRoot(document.getElementById('root')).render(
  //<react.strictmode>
  <SocketProvider>
    <App />
    <Toaster closeButton/>
  </SocketProvider>
  //<react.strictmode>
);
