import { useState } from "react";
import { api } from "../services/api";
import { ErrorMessage } from "../components/Feedback";
import { Status, statusLabel } from "../components/Badge";
import { dateBR } from "../utils";

const ETAPAS = ["PENDENTE", "EM_TRANSITO", "ENTREGUE"];

// Página pública: usa a rota GET /api/deliveries/rastreio/:codigo (sem login).
export default function Rastreio() {
  const [codigo, setCodigo] = useState("");
  const [res, setRes] = useState(null);
  const [erro, setErro] = useState("");
  const [busy, setBusy] = useState(false);

  const buscar = async (e) => {
    e.preventDefault();
    setErro("");
    setRes(null);
    setBusy(true);
    try {
      setRes(await api(`/deliveries/rastreio/${encodeURIComponent(codigo.trim().toUpperCase())}`));
    } catch (err) {
      setErro(err.message);
    } finally {
      setBusy(false);
    }
  };

  const etapa = res ? ETAPAS.indexOf(res.status) : -1;

  return (
    <>
      <header className="head"><h1>Rastrear entrega</h1></header>
      <form className="panel search" onSubmit={buscar}>
        <label>
          Código de rastreio
          <input required placeholder="LOG-123456" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
        </label>
        <button className="btn" disabled={busy}>{busy ? "Buscando..." : "Buscar entrega"}</button>
      </form>

      {erro && <ErrorMessage message={erro} />}

      {res && (
        <section className="panel result">
          <h2>{res.codigoRastreio}</h2>
          <p>{res.origem} para {res.destino}</p>
          <p><Status value={res.status} /> <small>Atualizado em {dateBR(res.atualizadoEm)}</small></p>
          <ol className="track">
            {ETAPAS.map((s, i) => (
              <li key={s} className={i <= etapa ? "done" : ""}>{statusLabel(s)}</li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
