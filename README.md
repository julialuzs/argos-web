# Argos

### Como rodar localmente:
1. `npm install`
2. `ng serve`
3. Acesse `http://localhost:4200/`
4. Subir API

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