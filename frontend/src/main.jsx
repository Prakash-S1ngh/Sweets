
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { StrictMode } from 'react'
import SweetProvider from './Context/ContextProvider.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  
    <SweetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SweetProvider>
  );

