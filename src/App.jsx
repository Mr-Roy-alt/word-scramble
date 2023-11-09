// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import GamePage from './pages/GamePage'
import SignIn from './pages/SignIn'
import AuthRequired from './component/AuthRequired'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn isAuthenticatedSetter={setIsAuthenticated} />} />

          <Route element={<AuthRequired isAuthenticatedSetter={() => isAuthenticated} />}>
          </Route>
          <Route path="/game" element={<GamePage />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
