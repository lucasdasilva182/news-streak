# **The News Streaks ☕**

Este é um projeto Full-stack que permite o login de usuários para acompanhar suas métricas pessoais.
Se o usuário for um administrador, ele também tem acesso a um painel de análise. A plataforma foi
desenvolvida para monitorar o engajamento de leitores em newsletters, oferecendo insights sobre
streaks, rankings de usuários e estatísticas detalhadas, com filtros por período, tipo de newsletter
e status.

---

## **Índice**

1. [Stacks Utilizadas](#stacks-utilizadas)
2. [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
3. [Desafios Enfrentados](#desafios-enfrentados)
4. [Organização do Projeto](#organização-do-projeto)
5. [Escalabilidade](#escalabilidade)

---

## **Stacks Utilizadas**

- **Frontend**:

  - React + TypeScript
  - Tailwind CSS para estilização
  - Chart.js para gráficos interativos

- **Backend**:

  - Node.js com Express
  - PostgreSQL como banco de dados relacional
  - JWT para autenticação

- **Ferramentas Adicionais**:
  - ngrok para testar webhooks localmente
  - Docker (opcional) para containerização

---

## **Estrutura do Banco de Dados**

O banco de dados foi projetado para ser simples e eficiente:

- **Tabela `users`**:  
  Armazena informações básicas dos usuários:

  ```sql
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_opened DATE,
  current_streak INT DEFAULT 0,
  max_count_streak INT DEFAULT 0,
  is_admin INT DEFAULT 0
  ```

- **Tabela `streaks`**:  
  Registra as interações dos usuários com as newsletters:

  ```sql
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  newsletter_id VARCHAR(255),
  date DATE,
  utm_parameters JSONB
  ```

- **Índices**:  
  Foram criados índices nas colunas `user_id` e `date` para otimizar consultas frequentes.

---

## **Desafios Enfrentados**

1. **Webhook e ngrok**:  
   Um dos grandes desafios foi lidar com a tela de aviso do ngrok no webhook. Para resolver isso,
   criei um proxy reverso personalizado que adiciona o cabeçalho necessário
   (`ngrok-skip-browser-warning`) antes de encaminhar as requisições.

2. **Persistência de Estado**:  
   Outro desafio foi garantir que o estado do usuário persistisse após a atualização da página.
   Resolvi isso validando o token JWT no backend ao carregar a aplicação.
3. **Controle de Rotas para Admin** :  
   Implementar um sistema de controle de rotas para administradores foi um desafio, mas resolvi isso
   criando middlewares no backend para validar as permissões do usuário em cada rota protegida. No
   frontend, também desenvolvi um sistema de menus dinâmicos que ajusta automaticamente os links
   exibidos com base nas permissões do usuário, garantindo que apenas quem tem acesso veja a opção
   para o Dashboard.

4. **Integração de Gráficos Dinâmicos** :  
   Tive alguns desafios ao integrar gráficos dinâmicos com o Chart.js, principalmente na
   renderização em tempo real e no gerenciamento de estado no frontend. Para resolver isso, usei
   `useMemo` para evitar cálculos desnecessários e implementei algumas verificações para lidar com
   dados incompletos ou ausentes.

---

## **Organização do Projeto**

O projeto foi organizado de forma modular para facilitar a manutenção e escalabilidade:

- **Rotas**: Mapeiam as requisições HTTP para os controllers.
- **Controllers**: Processam a lógica de negócios e chamam os repositórios.
- **Repositories**: Interagem diretamente com o banco de dados.

Exemplo de estrutura:

```
/backend
	/src
	  /controllers
	  /db
	  /middleware
	  /repositories
	  /routes
	  /types
	  index.ts
/frontend
	src/
	  /components
	  /contexts
	  /pages
	  /routes
	  /services
	  /types
	  /utils
	  App.tsx
```

---

## **Escalabilidade**

O sistema foi projetado para ser escalável:

- **Banco de Dados**:  
  O PostgreSQL pode ser otimizado com sharding ou replicação conforme o crescimento dos dados.
  Índices foram criados nas colunas mais consultadas.

- **Backend**:  
  O backend pode ser containerizado com Docker e implantado em serviços como AWS ECS ou Kubernetes.

- **Cache**:  
  Redis pode ser implementado facilmente para armazenar resultados de consultas frequentes,
  reduzindo a carga no banco de dados.

---

## **Testes Realizados**

Infelizmente não consegui realizar testes automatizados na aplicação.

---

## **Como Executar o Projeto**

### **Pré-requisitos**

- Node.js instalado
- PostgreSQL configurado
- ngrok instalado (para testes locais de webhook)

1. Clone o repositório:
   ```bash
   git clone https://github.com/lucasdasilva182/the-news-streak.git
   ```

### **Backend**

2. Instale as dependências:
   ```bash
   cd the-news-streak/backend
   npm install
   ```
3. Banco de dados Crie um banco de dados Postgresql com a estrutura mostrada em
   [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados) (recomendado Docker)

4. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:
     ```
       DATABASE_URL=postgresql://{user}:{password}@localhost:5432
     PORT=5000
     JWT_SECRET=
     ```
5. Inicie o servidor:
   ```bash
   npm run dev
   ```
6. O backend estará rodando em `http://localhost:5000`.

### **Frontend**

7. Instale as dependências:
   ```bash
   cd the-news-streak/frontend
   npm install
   ```
8. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:
     ```
     VITE_API_URL=http://localhost:{PORT}/api
     ```
9. Inicie o servidor:
   ```bash
   npm run dev
   ```
10. Acesse o frontend em `http://localhost:3000`.
