import { useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import useFetch from "../hooks/useFetch";
import useForm from "../hooks/useForm";
import Modal from "../components/Modal";
import { Empty, ErrorMessage, Loading } from "../components/Feedback";
import { Plate, Status } from "../components/Badge";

function NovoVeiculo({ onClose, onSaved }) {
  const [f, bind] = useForm({ placa: "", modelo: "", ano: new Date().getFullYear(), capacidadeKg: "" });

  const salvar = async () => {
    await api("/vehicles", {
      method: "POST",
      body: { placa: f.placa.trim().toUpperCase(), modelo: f.modelo, ano: Number(f.ano), capacidadeKg: Number(f.capacidadeKg) },
    });
    onSaved();
  };

  return (
    <Modal title="Novo veículo" submitLabel="Salvar veículo" onClose={onClose} onSubmit={salvar}>
      <label>Placa<input required maxLength={8} {...bind("placa")} /></label>
      <label>Modelo<input required {...bind("modelo")} /></label>
      <div className="two">
        <label>Ano<input type="number" required min="1980" {...bind("ano")} /></label>
        <label>Capacidade (kg)<input type="number" required min="1" step="any" {...bind("capacidadeKg")} /></label>
      </div>
    </Modal>
  );
}

function NovaManutencao({ veiculo, onClose, onSaved }) {
  const [f, bind] = useForm({ tipo: "PREVENTIVA", descricao: "", custo: "" });

  const salvar = async () => {
    await api("/maintenances", {
      method: "POST",
      body: { veiculoId: veiculo.id, tipo: f.tipo, descricao: f.descricao, custo: Number(f.custo) || 0 },
    });
    onSaved();
  };

  return (
    <Modal title={`Manutenção do veículo ${veiculo.placa}`} submitLabel="Registrar manutenção" onClose={onClose} onSubmit={salvar}>
      <label>
        Tipo
        <select {...bind("tipo")}>
          <option value="PREVENTIVA">Preventiva</option>
          <option value="CORRETIVA">Corretiva</option>
        </select>
      </label>
      <label>Descrição<input required {...bind("descricao")} /></label>
      <label>Custo (R$)<input type="number" min="0" step="0.01" {...bind("custo")} /></label>
      <p className="note">O veículo passa para “Em manutenção” e não poderá receber novas entregas.</p>
    </Modal>
  );
}

export default function Veiculos() {
  const { isGestor } = useAuth();
  const { data, loading, error, reload } = useFetch(() => api("/vehicles"));
  const [modal, setModal] = useState(null);
  const fechar = () => setModal(null);

  let corpo;
  if (loading && !data) corpo = <Loading />;
  else if (data && data.length === 0) corpo = <Empty>Nenhum veículo cadastrado ainda.</Empty>;
  else if (data)
    corpo = (
      <div className="scroll">
        <table>
          <thead>
            <tr>
              <th>Placa</th><th>Modelo</th><th>Ano</th><th>Capacidade</th><th>Status</th>
              {isGestor && <th />}
            </tr>
          </thead>
          <tbody>
            {data.map((v) => (
              <tr key={v.id}>
                <td><Plate>{v.placa}</Plate></td>
                <td>{v.modelo}</td>
                <td>{v.ano}</td>
                <td>{Number(v.capacidadeKg).toLocaleString("pt-BR")} kg</td>
                <td><Status value={v.status} /></td>
                {isGestor && (
                  <td>
                    <button className="btn ghost sm" onClick={() => setModal({ tipo: "manutencao", veiculo: v })}>
                      Registrar manutenção
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

  return (
    <>
      <header className="head">
        <h1>Veículos</h1>
        {isGestor && <button className="btn" onClick={() => setModal({ tipo: "novo" })}>Novo veículo</button>}
      </header>
      {error && <ErrorMessage message={error} onRetry={reload} />}
      {corpo}
      {modal?.tipo === "novo" && <NovoVeiculo onClose={fechar} onSaved={reload} />}
      {modal?.tipo === "manutencao" && <NovaManutencao veiculo={modal.veiculo} onClose={fechar} onSaved={reload} />}
    </>
  );
}
