import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Layout() {
  const { usuario, isGestor, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    isGestor && ["/painel", "Painel da frota"],
    usuario && ["/veiculos", "Veículos"],
    usuario && ["/entregas", "Entregas"],
    ["/rastreio", "Rastrear entrega"],
  ].filter(Boolean);

  const sair = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="shell">
      <aside className="side">
        <div className="brand">LogisTech</div>
        <nav>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "on" : "")}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="who">
          {usuario ? (
            <>
              <strong>{usuario.nome}</strong>
              <small>{isGestor ? "Gestor" : "Motorista"}</small>
              <button className="btn ghost sm" onClick={sair}>Sair</button>
            </>
          ) : (
            <button className="btn sm" onClick={() => navigate("/login")}>Entrar</button>
          )}
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
