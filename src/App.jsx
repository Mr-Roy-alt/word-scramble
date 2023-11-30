// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import GamePage from './pages/GamePage'
import SignIn from './pages/SignIn'
import AuthRequired from './component/AuthRequired'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />

          <Route element={<AuthRequired />}>
            <Route path="/game" element={<GamePage />} />
          </Route>

          <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
