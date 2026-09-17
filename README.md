# SantiFi

> De forms para prompts. Seu controle financeiro com inteligência artificial.

![SantiFi Banner](./docs/santifi-banner.png)

**SantiFi** é a evolução do meu antigo finance_control_santiago. Um sistema de controle financeiro pessoal que está migrando de CRUD tradicional para arquitetura agêntica.

**Stack:** Django + React + Vite + Pydantic AI

### ✨ Features

- [x] Cadastro de Contas com saldo inicial e ordenação
- [x] Novo Movimento (Receita/Despesa) com vínculo de Conta e Categoria
- [x] UI dark moderna em React + Vite
- [x] API REST em Django
- [ ] **WIP: AI Agent com Pydantic AI - transformando forms em linguagem natural**
- [ ] Dashboard analítico

#### Preview

| Novo Movimento | Nova Conta |
| :---: | :---: |
| Form com toggle Despesa/Receita e validação completa | Cadastro de contas bancárias |

### ⚙️ Instalação

``bash
# Clone
git clone https://github.com/AdsonSantiago/SantiFi.git
cd SantiFi

# Backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend (em outro terminal)
cd frontend
npm install
npm run dev

### Fluxo Principal

Planejamento criado
        ↓
Status = Pendente
        ↓
Usuário marca como Pago
        ├─► Cria um Movimento
        ├─► Atualiza Status = Pago
        ├─► Se recorrente → cria próximo planejamento
        └─► Se parcelado → cria próxima parcela

### Próxima Evolução: AI Agent

### Stack

###Autor

### MIT

![image](container:///mnt/data/django_react_ai_agent_santifi_cover.webp)










