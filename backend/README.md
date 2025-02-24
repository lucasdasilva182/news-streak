### **Backend**

1. Clone o repositório:
   ```bash
   git clone https://github.com/lucasdasilva182/the-news-streak.git
   ```
2. Instale as dependências:
   ```bash
   cd the-news-streak/backend
   npm install
   ```
3. Banco de dados Crie um banco de dados Postgresql com a estrutura mostrada em
   [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados) na raiz. (Recomendado Docker)

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
