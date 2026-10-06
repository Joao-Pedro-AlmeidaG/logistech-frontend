import { useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import useFetch from "../hooks/useFetch";
import useForm from "../hooks/useForm";
import Modal from "../components/Modal";
import { Empty, ErrorMessage, Loading } from "../components/Feedback";
import { Plate, statusLabel } from "../components/Badge";

const STATUS = ["PENDENTE", "EM_TRANSITO", "ENTREGUE", "PROBLEMA"];

function NovaEntrega({ onClose, onSaved }) {
  const [f, bind] = useForm({ origem: "", destino: "", motoristaId: "", veiculoId: "" });
  const { data: users } = useFetch(() => api("/users"));
  const { data: veiculos } = useFetch(() => api("/vehicles"));
  const motoristas = (users || []).filter((u) => u.perfil === "MOTORISTA");
  const livres = (veiculos || []).filter((v) => v.status !== "EM_MANUTENCAO");

  const salvar = async () => {
    await api("/deliveries", {
      method: "POST",
      body: {
        origem: f.origem,
        destino: f.destino,
        motoristaId: f.motoristaId || undefined,
        veiculoId: f.veiculoId || undefined,
      },
    });
    onSaved();
  };

  return (
    <Modal title="Nova entrega" submitLabel="Criar entrega" onClose={onClose} onSubmit={salvar}>
      <label>Origem<input required {...bind("origem")} /></label>
      <label>Destino<input required {...bind("destino")} /></label>
      <label>
        Motorista
        <select {...bind("motoristaId")}>
          <option value="">Definir depois</option>
          {motoristas.map((u) => <option key={u.id} value={u.id}>{u.nome}</option>)}
        </select>
      </label>
      <label>
        Veículo
        <select {...bind("veiculoId")}>
          <option value="">Definir depois</option>
          {livres.map((v) => <option key={v.id} value={v.id}>{v.placa} - {v.modelo}</option>)}
        </select>
      </label>
      <p className="note">O código de rastreio é gerado automaticamente. Veículos em manutenção não aparecem na lista.</p>
    </Modal>
  );
}

export default function Entregas() {
  const { usuario, isGestor } = useAuth();
  const { data, loading, error, reload } = useFetch(() => api("/deliveries"));
  const [filtro, setFiltro] = useState("");
  const [novo, setNovo] = useState(false);
  const [falha, setFalha] = useState("");

  // Motorista vê apenas as próprias entregas; gestor vê todas.
  const lista = (data || [])
    .filter((d) => isGestor || d.motorista?.id === usuario.id)
    .filter((d) => !filtro || d.status === filtro);

  const mudarStatus = async (d, status) => {
    setFalha("");
    try {
      await api(`/deliveries/${d.id}/status`, { method: "PUT", body: { status } });
      reload();
    } catch (e) {
      setFalha(e.message);
    }
  };

  let corpo;
  if (loading && !data) corpo = <Loading />;
  else if (data && lista.length === 0) corpo = <Empty>Nenhuma entrega encontrada{filtro ? " com esse status" : ""}.</Empty>;
  else if (data)
    corpo = (
      <div className="scroll">
        <table>
          <thead>
            <tr><th>Código</th><th>Trajeto</th><th>Motorista</th><th>Veículo</th><th>Status</th></tr>
          </thead>
          <tbody>
            {lista.map((d) => (
              <tr key={d.id}>
                <td><span className="code">{d.codigoRastreio}</span></td>
                <td>{d.origem} para {d.destino}</td>
                <td>{d.motorista?.nome || "Sem motorista"}</td>
                <td>{d.veiculo ? <Plate>{d.veiculo.placa}</Plate> : "Sem veículo"}</td>
                <td>
                  <select
                    className={`sel st-${d.status}`}
                    value={d.status}
                    onChange={(e) => mudarStatus(d, e.target.value)}
                    aria-label={`Status da entrega ${d.codigoRastreio}`}
                  >
                    {STATUS.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

  return (
    <>
      <header className="head">
        <h1>Entregas</h1>
        <div className="row">
          <select className="sel" value={filtro} onChange={(e) => setFiltro(e.target.value)} aria-label="Filtrar por status">
            <option value="">Todos os status</option>
            {STATUS.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
          </select>
          {isGestor && <button className="btn" onClick={() => setNovo(true)}>Nova entrega</button>}
        </div>
      </header>
      {(error || falha) && <ErrorMessage message={error || falha} onRetry={error ? reload : undefined} />}
      {corpo}
      {novo && <NovaEntrega onClose={() => setNovo(false)} onSaved={reload} />}
    </>
  );
}
