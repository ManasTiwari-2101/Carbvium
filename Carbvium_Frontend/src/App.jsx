import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from "./pages/landing";
import Login from "./pages/login";
import Dashboard from './pages/dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
