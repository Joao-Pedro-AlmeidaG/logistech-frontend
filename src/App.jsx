import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Protected from "./components/Protected";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Veiculos from "./pages/Veiculos";
import Entregas from "./pages/Entregas";
import Rastreio from "./pages/Rastreio";

export default function App() {
  const { usuario, isGestor } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={usuario ? <Navigate to="/" replace /> : <Login />} />
      <Route element={<Layout />}>
        <Route path="/rastreio" element={<Rastreio />} />
        <Route element={<Protected />}>
          <Route path="/" element={<Navigate to={isGestor ? "/painel" : "/entregas"} replace />} />
          <Route path="/veiculos" element={<Veiculos />} />
          <Route path="/entregas" element={<Entregas />} />
        </Route>
        <Route element={<Protected roles={["GESTOR"]} />}>
          <Route path="/painel" element={<Dashboard />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
