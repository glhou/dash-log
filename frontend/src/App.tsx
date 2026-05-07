import { Routes, Route } from 'react-router-dom'
import './App.css'
import Error from './errors/ErrorCode.tsx'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import RootLayout from './layouts/RootLayout.tsx'

function App() {

  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/ui/" element={<Home />} />
        <Route path="/ui/dashboard" element={<Dashboard />} />
        <Route path="/ui/*" element={<Error statusCode={404} />} />
      </Route>
    </Routes>
  )
}

export default App
