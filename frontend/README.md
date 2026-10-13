# SantiFi frontend

Interface React + TypeScript + Vite do SantiFi. A configuração completa de ambiente e execução está no [README principal](../README.md).

## Comandos

```powershell
npm ci
npm run dev
npm run build
npm run lint
```

Configure `VITE_API_URL` com a URL base da API terminando em `/api`, e `VITE_GOOGLE_CLIENT_ID` com o client ID usado pelo backend. Em desenvolvimento, esses valores podem ficar em `.env.local`, que não deve ser versionado.
