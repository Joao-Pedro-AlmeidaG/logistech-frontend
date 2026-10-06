export const brl = (n) =>
  (Number(n) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// O backend devolve createdAt do GraphQL como timestamp em texto ("1756000000000") ou ISO.
export const dateBR = (v) => {
  if (!v) return "-";
  const d = new Date(/^\d+$/.test(String(v)) ? Number(v) : v);
  return isNaN(d) ? "-" : d.toLocaleDateString("pt-BR");
};
