# **News Streaks ☕**

Este é um projeto Full-stack que permite o login de usuários para acompanhar suas métricas pessoais.
Se o usuário for um administrador, ele também tem acesso a um painel de análise. A plataforma foi
desenvolvida para monitorar o engajamento de leitores em newsletters, oferecendo insights sobre
streaks, rankings de usuários e estatísticas detalhadas, com filtros por período, tipo de newsletter
e status.

---

## **Demo**

Sistema demo pode ser acessado através do [link](https://streaks-news.vercel.app/).

Usuário cadastrados no banco para teste:

- **Admin (tem acesso a rota /admin)**:

  - teste1@exemplo.com
  - teste10@exemplo.com

- **Padrão**:
  - teste2@exemplo.com
  - teste2@exemplo.com
  - teste4@exemplo.com
  - teste5@exemplo.com
  - teste6@exemplo.com

**Novo Cadastro** Caso queiram cadastrar um novo usuário ou atualizar um existente, basta fazer o
GET alterando os parâmetros para a seguinte rota:

```bash
https://clownfish-app-2uxru.ondigitalocean.app/?email=teste7@exemplo.com&id=post_2025-02-22&utm_source=&utm_medium=&utm_campaign=&utm_channel=
```

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

Infelizmente não consegui realizar testes automatizados na aplicação.

---

## **Como Executar o Projeto**

### **Pré-requisitos**

- Node.js instalado
- PostgreSQL configurado

1. Clone o repositório:
   ```bash
   git clone https://github.com/lucasdasilva182/news-streak.git
   ```

### **Backend**

2. Instale as dependências:
   ```bash
   cd news-streak/backend
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
   cd news-streak/frontend
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
