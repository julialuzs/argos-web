# Argos

### Como rodar localmente:
1. `npm install`
2. `ng serve`
3. Acesse `http://localhost:4200/`
4. Subir API 
```bash
dotnet run
```

### Rodando o argos-avaliador-acessibilidade localmente
1. Rodar projeto web normalmente
2. Subir API 
3. Conferir se a url da API está correta no argos.config.ci.json
4. No projeto do avaliador, rodar:
```bash
npm run audit -- https://localhost:4200  --config ../argos-web/argos.config.ci.json --out reports/report-argos-web.json
```

### Libs:
- TailwindCSS
- PrimeNG

## Estrutura:
```
src/
├── app/
│   ├── core/
│   │   ├── auth/
│   │   ├── interceptors/
│   │   └── services/
│   │
│   ├── features/
│   │   ├── dashboard/
│   │   └── produtos/
│   │       └── produtos.component.ts
│   │   
│   ├── shared/
│   │   ├── components/
│   │   ├── directives/
│   │   └── pipes/ 
│   │
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
│
├── assets/
├── styles/
├── index.html 
└── main.ts
```