# SantiFi

Aplicação de controle financeiro pessoal com API REST em Django e interface em React. O sistema oferece cadastro de contas, categorias, movimentos, transferências e planejamentos, além de autenticação por senha e Google.

## Tecnologias

- Backend: Python, Django REST Framework e PostgreSQL.
- Frontend: React, TypeScript e Vite.
- Autenticação da API: JWT.
- Hospedagem configurada: Vercel, com banco PostgreSQL externo.

O preenchimento assistido de rascunhos de movimento com Ollama está disponível em desenvolvimento local. A aplicação ainda exige que a pessoa revise e salve o movimento.

## Requisitos

- Python compatível com o runtime configurado no deploy.
- Node.js e npm compatíveis com as versões do `frontend/package-lock.json`.
- Um banco PostgreSQL de desenvolvimento separado do banco de produção.

## Configuração do backend

Na raiz do projeto, crie um `.env` local com valores de desenvolvimento:

```dotenv
SECRET_KEY=uma-chave-local
DEBUG=1
DATABASE_URL=postgresql://usuario:senha@localhost:5432/santifi_dev
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
OLLAMA_ENABLED=1
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen3.5:0.8b
OLLAMA_TIMEOUT_SECONDS=180
```

`DATABASE_URL` precisa apontar para um banco de desenvolvimento. A configuração do projeto exige SSL para a conexão PostgreSQL; use um banco local com SSL habilitado ou um banco de desenvolvimento remoto com SSL. Nunca execute migrações antes de conferir o endereço do banco.

O preenchimento assistido de movimentos usa uma instalação local do [Ollama](https://ollama.com/download) e, por padrão, o modelo leve `qwen3.5:0.8b`. Inicie o Ollama e baixe-o com `ollama pull qwen3.5:0.8b`. Um modelo maior como `qwen3.5:4b` pode ser configurado se o computador tiver memória e processamento suficientes. O recurso fica desligado por padrão; ative `OLLAMA_ENABLED=1` apenas no ambiente em que o serviço Ollama estiver acessível. A configuração local `127.0.0.1` não funciona no backend publicado na Vercel. Não habilite o recurso em produção sem configurar um serviço de inferência acessível pelo backend.

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Configuração do frontend

Crie `frontend/.env.local`:

```dotenv
VITE_API_URL=https://seu-backend/api
VITE_GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
```

Para desenvolvimento, `VITE_API_URL` deve apontar para o backend local e terminar em `/api`.

```powershell
cd frontend
npm ci
npm run dev
```

## Estrutura

- `apps/authentication`: login, tokens e endpoint do usuário autenticado.
- `apps/usuarios`: cadastro, autenticação Google e dados de usuário.
- `apps/financeiro`: modelos, endpoints, regras e consultas financeiras.
- `financas`: configurações e entrada WSGI/ASGI do Django.
- `frontend/src`: páginas, componentes e serviços da aplicação React.

## Deploy

O backend usa `vercel.json` na raiz e o frontend tem sua própria configuração em `frontend/vercel.json`. Configure as variáveis de ambiente do backend e do frontend no provedor. Em produção, `DEBUG` deve ficar desativado, `SECRET_KEY` deve ser exclusiva e `CORS_ALLOWED_ORIGINS` deve conter a origem exata do frontend.

## Segurança dos dados locais

Não coloque credenciais, bancos locais, backups ou dados financeiros reais no Git. `.env` é ignorado pelo Git. Os arquivos de dados que já estavam versionados precisam ser avaliados separadamente; adicioná-los ao `.gitignore` não os remove do histórico nem do índice do Git.
