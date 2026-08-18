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
npm run audit -- --config argos.config.ci.json
```

ou especificar o nome do arquivo json

```bash
npm run audit -- --config argos.config.ci.json --out relatorio/meu-relatorio.json
```

### Adicionando na pipeline:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      /** demais steps **/

      - name: Install Argos
        run: npm install argos-avaliador-acessibilidade --prefix argos

      - name: Install Playwright browsers
        run: npx playwright install chromium --with-deps
        working-directory: argos/node_modules/argos-avaliador-acessibilidade

      - name: Run accessibility audit against deployed site
        env:
          SITE_URL: https://<url-do-site-deployado>
        run: |
          mkdir -p reports
          npm run audit --prefix argos/node_modules/argos-avaliador-acessibilidade -- \
            --config "$GITHUB_WORKSPACE/audit.config.ci.json" \
            --out "$GITHUB_WORKSPACE/reports/report.json" \
            "$SITE_URL"
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
