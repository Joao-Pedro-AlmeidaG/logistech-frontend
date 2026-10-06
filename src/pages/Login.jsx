import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import useForm from "../hooks/useForm";
import { ErrorMessage } from "../components/Feedback";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [modo, setModo] = useState("entrar");
  const [f, bind] = useForm({ nome: "", email: "", senha: "", perfil: "MOTORISTA" });
  const [erro, setErro] = useState("");
  const [busy, setBusy] = useState(false);
  const cadastro = modo === "cadastro";

  const enviar = async (e) => {
    e.preventDefault();
    setErro("");
    setBusy(true);
    try {
      if (cadastro) await api("/auth/register", { method: "POST", body: f });
      await login(f.email, f.senha);
      navigate("/", { replace: true });
    } catch (err) {
      setErro(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="login">
      <form className="panel" onSubmit={enviar}>
        <h1>{cadastro ? "Criar conta" : "Entrar no LogisTech"}</h1>
        <p className="note">Gestão de frotas e entregas.</p>
        {cadastro && <label>Nome<input required autoComplete="name" {...bind("nome")} /></label>}
        <label>E-mail<input type="email" required autoComplete="email" {...bind("email")} /></label>
        <label>
          Senha
          <input type="password" required autoComplete={cadastro ? "new-password" : "current-password"} {...bind("senha")} />
        </label>
        {cadastro && (
          <label>
            Perfil
            <select {...bind("perfil")}>
              <option value="MOTORISTA">Motorista</option>
              <option value="GESTOR">Gestor</option>
            </select>
          </label>
        )}
        {erro && <ErrorMessage message={erro} />}
        <button className="btn" disabled={busy}>
          {busy ? "Aguarde..." : cadastro ? "Criar conta e entrar" : "Entrar"}
        </button>
        <button type="button" className="link" onClick={() => setModo(cadastro ? "entrar" : "cadastro")}>
          {cadastro ? "Já tenho conta" : "Ainda não tenho conta"}
        </button>
        <Link to="/rastreio">Rastrear uma entrega sem entrar</Link>
      </form>
    </div>
  );
}
