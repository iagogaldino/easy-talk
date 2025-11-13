# Guia de Personalização de Tema

A aplicação foi configurada para facilitar mudanças de tema usando variáveis CSS do Material Design.

## Variáveis de Tema Personalizáveis

As variáveis de tema estão definidas em `src/styles.scss`:

```scss
:root {
  --app-background-gradient-start: var(--mat-sys-surface-container-lowest);
  --app-background-gradient-end: var(--mat-sys-surface-container-low);
  --app-surface-color: var(--mat-sys-surface);
  --app-on-surface-color: var(--mat-sys-on-surface);
}
```

## Como Mudar o Tema

### 1. Tema Claro/Escuro

Para alternar entre tema claro e escuro, altere em `src/styles.scss`:

```scss
body {
  color-scheme: light; // ou 'dark' para tema escuro
}
```

### 2. Cores do Gradiente de Fundo

Para personalizar o gradiente de fundo, altere as variáveis em `src/styles.scss`:

```scss
:root {
  --app-background-gradient-start: #f5f5f5; // Cor inicial do gradiente
  --app-background-gradient-end: #e0e0e0;   // Cor final do gradiente
}
```

### 3. Cores Primárias e Terciárias

Para mudar as cores primárias e terciárias, altere em `src/styles.scss`:

```scss
html {
  @include mat.theme((
    color: (
      primary: mat.$azure-palette,    // Mude para outra paleta
      tertiary: mat.$blue-palette,    // Mude para outra paleta
    ),
    // ...
  ));
}
```

### 4. Efeitos de Gradiente Radial

Para ajustar os efeitos de gradiente radial no fundo, altere em `src/app/app.scss`:

```scss
.app-shell::before {
  background: radial-gradient(
    circle at 20% 50%, 
    rgba(37, 99, 235, 0.03) 0%,  // Ajuste a cor e opacidade
    transparent 50%
  ),
  radial-gradient(
    circle at 80% 80%, 
    rgba(59, 130, 246, 0.03) 0%,  // Ajuste a cor e opacidade
    transparent 50%
  );
}
```

## Paletas Disponíveis do Material Design

- `mat.$red-palette`
- `mat.$pink-palette`
- `mat.$purple-palette`
- `mat.$deep-purple-palette`
- `mat.$indigo-palette`
- `mat.$blue-palette`
- `mat.$light-blue-palette`
- `mat.$cyan-palette`
- `mat.$teal-palette`
- `mat.$green-palette`
- `mat.$light-green-palette`
- `mat.$lime-palette`
- `mat.$yellow-palette`
- `mat.$amber-palette`
- `mat.$orange-palette`
- `mat.$deep-orange-palette`
- `mat.$brown-palette`
- `mat.$grey-palette`
- `mat.$blue-grey-palette`
- `mat.$azure-palette` (atual)

## Exemplo: Tema Escuro

Para aplicar um tema escuro, altere:

```scss
body {
  color-scheme: dark;
}

:root {
  --app-background-gradient-start: #121212;
  --app-background-gradient-end: #1e1e1e;
}
```

## Exemplo: Tema Personalizado com Cores Diferentes

```scss
html {
  @include mat.theme((
    color: (
      primary: mat.$purple-palette,
      tertiary: mat.$pink-palette,
    ),
    // ...
  ));
}

:root {
  --app-background-gradient-start: #f3e5f5;
  --app-background-gradient-end: #e1bee7;
}
```

