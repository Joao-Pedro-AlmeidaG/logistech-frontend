# LogisTech Frontend

React + Vite + Apollo Client para o backend LogisTech.

## Como rodar
1. Suba o backend (`npm run dev` na pasta do backend, porta 3000).
2. Aqui: `npm install` e `npm run dev`, depois abra http://localhost:5173.
3. A URL do backend fica em `.env` (`VITE_API_URL`).

Primeiro acesso: em "Ainda não tenho conta", crie um usuário com perfil **Gestor**.

## Como conversa com o backend
- **GraphQL (Apollo Client):** `dashboardGestor`, usado no Painel da frota (somente gestor).
- **REST (`/api`):** login e cadastro, veículos, manutenções, entregas, usuários e rastreio.
- O JWT é enviado em `Authorization: Bearer` nas duas (`services/apollo.js` e `services/api.js`).

## Telas
Login/cadastro, Painel da frota (gestor), Veículos (gestor cadastra e registra manutenção), Entregas (gestor cria, motorista vê e atualiza as suas) e Rastreio público.
