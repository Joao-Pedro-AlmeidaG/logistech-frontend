import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { DASHBOARD_GESTOR } from "../graphql/queries";
import { Empty, ErrorMessage, Loading } from "../components/Feedback";
import { Plate, Status } from "../components/Badge";
import { brl, dateBR } from "../utils";

export default function Dashboard() {
  const { data, loading, error, refetch } = useQuery(DASHBOARD_GESTOR, { fetchPolicy: "cache-and-network" });
  const [aberto, setAberto] = useState(null);
  const frota = useMemo(() => data?.dashboardGestor ?? [], [data]);

  const kpis = useMemo(() => {
    const n = (s) => frota.filter((v) => v.status === s).length;
    const custo = frota.reduce((t, v) => t + (v.maintenances || []).reduce((s, m) => s + (m.custo || 0), 0), 0);
    return [
      ["Veículos na frota", frota.length],
      ["Disponíveis", n("DISPONIVEL")],
      ["Em rota", n("EM_ROTA")],
      ["Em manutenção", n("EM_MANUTENCAO")],
      ["Custo de manutenção", brl(custo)],
    ];
  }, [frota]);

  return (
    <>
      <header className="head">
        <h1>Painel da frota</h1>
        <button className="btn ghost" onClick={() => refetch()}>Atualizar</button>
      </header>

      {error && <ErrorMessage message={error.message} onRetry={() => refetch()} />}
      {loading && !data && <Loading />}

      {data && (
        <>
          <div className="kpis">
            {kpis.map(([label, valor]) => (
              <div className="kpi" key={label}>
                <b>{valor}</b>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {frota.length === 0 && <Empty>Nenhum veículo cadastrado. Cadastre o primeiro em Veículos.</Empty>}

          {frota.map((v) => {
            const entregas = v.deliveries || [];
            const manut = v.maintenances || [];
            const open = aberto === v.id;
            return (
              <section className="lane" key={v.id}>
                <button className="lane-head" aria-expanded={open} onClick={() => setAberto(open ? null : v.id)}>
                  <Plate>{v.placa}</Plate>
                  <span className="grow">
                    <strong>{v.modelo}</strong>
                    <br />
                    <small>{v.ano}, capacidade de {Number(v.capacidadeKg).toLocaleString("pt-BR")} kg</small>
                  </span>
                  <Status value={v.status} />
                  <small>{entregas.length} entregas, {manut.length} manutenções</small>
                  <small>{open ? "Ocultar detalhes" : "Ver detalhes"}</small>
                </button>

                {open && (
                  <div className="lane-body">
                    <div>
                      <h3>Entregas</h3>
                      {entregas.length === 0 && <Empty>Nenhuma entrega alocada a este veículo.</Empty>}
                      {entregas.map((d) => (
                        <p className="item" key={d.id}>
                          <strong>{d.codigoRastreio}</strong> <Status value={d.status} />
                          <br />
                          <small>{d.origem} para {d.destino}. Motorista: {d.motorista?.nome || "não definido"}</small>
                        </p>
                      ))}
                    </div>
                    <div>
                      <h3>Manutenções</h3>
                      {manut.length === 0 && <Empty>Nenhuma manutenção registrada.</Empty>}
                      {manut.map((m) => (
                        <p className="item" key={m.id}>
                          <strong>{m.tipo === "PREVENTIVA" ? "Preventiva" : "Corretiva"}</strong> {brl(m.custo)}
                          <br />
                          <small>{m.descricao}, {dateBR(m.createdAt)}</small>
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </>
      )}
    </>
  );
}
