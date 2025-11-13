# Environments

Este diretório contém os arquivos de configuração de ambiente do projeto.

## Arquivos

- `environment.ts` - Ambiente de desenvolvimento (padrão)
- `environment.prod.ts` - Ambiente de produção
- `environment.staging.ts` - Ambiente de staging/testes
- `environment.interface.ts` - Interface TypeScript para type-safety

## Como usar

### Importar o environment

```typescript
import { environment } from '../environments/environment';

// Usar as configurações
const apiUrl = environment.apiUrl;
const isProduction = environment.production;
```

### Exemplo de uso em um serviço

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getData() {
    return this.http.get(`${this.apiUrl}/data`);
  }
}
```

### Verificar feature flags

```typescript
import { environment } from '../environments/environment';

if (environment.features.enableAdmin) {
  // Código específico do admin
}
```

## Builds

### Desenvolvimento (padrão)
```bash
ng serve
# ou
ng serve --configuration=development
```

### Staging
```bash
ng serve --configuration=staging
# ou
ng build --configuration=staging
```

### Produção
```bash
ng build --configuration=production
# ou
ng build
```

## Configurações

As configurações são substituídas automaticamente durante o build através do `angular.json`:

- **Development**: Usa `environment.ts` (sem substituição)
- **Staging**: Substitui `environment.ts` por `environment.staging.ts`
- **Production**: Substitui `environment.ts` por `environment.prod.ts`

