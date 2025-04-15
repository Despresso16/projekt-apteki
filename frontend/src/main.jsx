import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Rejestracja from './Rejestracja.jsx'
import LogowanieUser from './LogowanieUser.jsx'
import LogowanieAdm from './LogowanieAdm.jsx'
import Nawigacja from './Nawigacja.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LogowanieAdm />
  </StrictMode>,
)
