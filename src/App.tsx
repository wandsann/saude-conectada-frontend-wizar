import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RecoverPassword from "./pages/RecoverPassword";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recuperar-senha" element={<RecoverPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/appointments" element={<div>Consultas (Em Breve)</div>} />
        <Route path="/profile" element={<div>Perfil (Em Breve)</div>} />
      </Routes>
    </Router>
  );
}

export default App;
