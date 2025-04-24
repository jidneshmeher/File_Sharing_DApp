import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Storage from './page/Storage';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ContractContextProvider } from './context/ContractContext.jsx';
import Modal from './components/Modal';
import FileUpload from './page/FileUpload';
import Layout from './components/Layout'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContractContextProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout/>}>
            <Route path="/" element={<App />}/>
            <Route path="/upload" element={<FileUpload />}/>
            <Route path="/storage" element={<Storage/>}/>
            {/* <Route path="/share" element={<Modal/>}/> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </ContractContextProvider>
  </StrictMode>,
)
