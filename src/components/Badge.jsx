const LABEL = {
  DISPONIVEL: "Disponível",
  EM_ROTA: "Em rota",
  EM_MANUTENCAO: "Em manutenção",
  PENDENTE: "Pendente",
  EM_TRANSITO: "Em trânsito",
  ENTREGUE: "Entregue",
  PROBLEMA: "Problema",
};

export const statusLabel = (s) => LABEL[s] || s;

export const Status = ({ value }) => <span className={`st st-${value}`}>{statusLabel(value)}</span>;

// Placa no formato Mercosul: é o elemento visual de identidade do sistema.
export const Plate = ({ children }) => <span className="plate">{children}</span>;
