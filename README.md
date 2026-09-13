# Argos

### Como rodar localmente:

1. `npm install`
2. `ng serve`
3. Acesse `http://localhost:4200/`
4. Subir API

```bash
dotnet run
```

### Rodando o argos-avaliador-acessibilidade por linha de comando

```bash
npm run audit -- --config argos.config.json
```

ou especificar o nome do arquivo json

```bash
npm run audit -- --config argos.config.json --out relatorio/meu-relatorio.json
```

### Adicionando na pipeline:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest

     - name: Rodar avaliação de acessibilidade
        run: npx --yes argos-avaliador-acessibilidade@1.3.1
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
