## Planejamento Financeiro com Django

# 📌 Descrição
Este projeto é uma aplicação desenvolvida em Python utilizando o framework Django e a biblioteca dateutil para manipulação de datas.
O objetivo é gerenciar planejamentos financeiros, permitindo marcar pagamentos, criar movimentos e lidar com recorrências e parcelamentos.

## ⚙️ Instalação
# Clonar o repositório
git clone https://github.com/AdsonSantiago/finance_control_santiago.git
cd planejamento-financeiro

# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Instalar dependências
pip install -r requirements.txt

# Executar migrações
python manage.py migrate

# Rodar servidor
python manage.py runserver

## 🚀 Uso
Crie um planejamento financeiro.

Acompanhe o status (Pendente → Pago).

Marque como pago para gerar um movimento.

Se recorrente, o sistema cria automaticamente o próximo planejamento.

Se parcelado, gera a próxima parcela.

## 🔄 Regra de Negócio

# Fluxo principal

Planejamento criado
        │
        ▼
Status = Pendente
        │
        ▼
Chegou o vencimento
        │
        ▼
Usuário marca como Pago
        │
        ├────────► Cria um Movimento
        ├────────► Atualiza Status = Pago
        ├────────► Se recorrente, cria o próximo planejamento
        └────────► Se parcelado, cria a próxima parcela


# Fluxo de Recorrência

Usuário marca o planejamento como pago
            │
            ▼
Cria o Movimento
            │
            ▼
Atualiza Status = Pago
            │
            ▼
Possui recorrência?
      │
   Não ─────────► Finaliza
      │
     Sim
      │
      ▼
Calcula a próxima data
      │
      ▼
Cria um novo Planejamento
      │
      ▼
Status = Pendente

## 🔄 Fluxo de Negócio

![Fluxograma Planejamento Financeiro](https://copilot.microsoft.com/th/id/BCO.9aca33db-3e79-4ea6-b71d-19fa563dd4c5.png)


## 🤝 Contribuição
Abra uma issue para sugerir melhorias ou reportar bugs.

Faça um fork e envie um pull request com suas alterações.

## 📜 Licença
Este projeto está licenciado sob a licença MIT.

## 📬 Contato
Autor: Adson Santiago

Email: adsonsantiago@hotmail.com

GitHub: github.com/AdsonSantiago

