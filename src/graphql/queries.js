import { gql } from "@apollo/client";

export const DASHBOARD_GESTOR = gql`
  query DashboardGestor {
    dashboardGestor {
      id
      placa
      modelo
      ano
      capacidadeKg
      status
      maintenances { id descricao tipo custo createdAt }
      deliveries { id codigoRastreio origem destino status motorista { id nome } }
    }
  }
`;
