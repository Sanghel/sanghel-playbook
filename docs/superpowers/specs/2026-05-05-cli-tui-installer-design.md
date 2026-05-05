# Design: sanghel-playbook CLI/TUI Installer

## Context

`sanghel-playbook` es actualmente un site de documentación Next.js con patrones de React, Next.js y Astro. El objetivo es transformarlo en algo de mayor alcance: un **CLI/TUI público** que cualquier desarrollador pueda usar para instalar patrones, configuraciones y reglas en sus proyectos — o para arrancar proyectos nuevos desde cero con esas convenciones ya aplicadas. El repo existente se convierte en la fuente de verdad del catálogo Y en el site de documentación del CLI.

---

## Arquitectura: Monorepo ligero

```
sanghel-playbook/
├── packages/
│   └── cli/                        # Paquete npm publicable
│       ├── src/
│       │   ├── index.tsx           # Entry point (npx sanghel-playbook)
│       │   ├── ui/                 # Componentes Ink (pantallas TUI)
│       │   │   ├── MainMenu.tsx    # ¿Crear proyecto / Añadir a existente?
│       │   │   ├── CategoryMenu.tsx
│       │   │   ├── ItemSelect.tsx  # Multi-select con espacio
│       │   │   └── InstallProgress.tsx
│       │   ├── commands/
│       │   │   ├── create.ts       # Modo crear nuevo proyecto
│       │   │   └── add.ts          # Modo añadir a proyecto existente
│       │   └── lib/
│       │       ├── fetcher.ts      # Fetch a GitHub raw
│       │       ├── installer.ts    # Copy de archivos al cwd del usuario
│       │       ├── package-manager.ts  # Detecta pnpm/yarn/npm
│       │       └── scaffolder.ts   # Corre create-next-app, create vite, etc.
│       ├── package.json            # name: "sanghel-playbook", bin entry
│       └── tsconfig.json
│
├── catalog/                        # Contenido instalable
│   ├── index.json                  # Lista de categorías
│   ├── react/
│   │   ├── index.json              # Items disponibles en React
│   │   ├── zod-form/
│   │   │   ├── manifest.json
│   │   │   └── files/
│   │   └── controller-hook/
│   │       ├── manifest.json
│   │       └── files/
│   ├── nextjs/
│   ├── astro/
│   └── rules/
│       ├── github-flow/
│       └── deploy-guide/
│
├── src/                            # Site de documentación (sin cambios estructurales)
│   └── content/docs/
│       ├── getting-started.mdx     # Actualizado: explica el CLI
│       ├── catalog/                # Nueva sección: uno por item instalable
│       ├── react/
│       ├── nextjs/
│       └── astro/
│
└── package.json                    # workspaces: ["packages/*"]
```

---

## Catálogo: Formato de datos

### `catalog/index.json`
```json
{
  "categories": [
    { "id": "react", "label": "React", "indexUrl": "catalog/react/index.json" },
    { "id": "nextjs", "label": "Next.js", "indexUrl": "catalog/nextjs/index.json" },
    { "id": "astro", "label": "Astro", "indexUrl": "catalog/astro/index.json" },
    { "id": "rules", "label": "Rules & Guides", "indexUrl": "catalog/rules/index.json" }
  ]
}
```

### `catalog/react/index.json`
```json
{
  "category": "react",
  "label": "React",
  "items": ["zod-form", "controller-hook", "compound-component"]
}
```

### `catalog/react/zod-form/manifest.json`
```json
{
  "id": "zod-form",
  "name": "Zod Form Pattern",
  "description": "Schema de validación con Zod + React Hook Form con manejo de errores tipado",
  "category": "react",
  "tags": ["forms", "validation", "zod"],
  "deps": {
    "dependencies": ["zod", "react-hook-form"],
    "devDependencies": []
  },
  "files": [
    { "src": "files/useZodForm.ts", "dest": "src/hooks/useZodForm.ts" },
    { "src": "files/FormField.tsx", "dest": "src/components/FormField.tsx" }
  ],
  "docsUrl": "https://sanghel-playbook.vercel.app/docs/catalog/react/zod-form"
}
```

---

## TUI: Flujo de navegación

```
npx sanghel-playbook
        │
        ▼
┌─────────────────────────────┐
│ ¿Qué quieres hacer?         │
│ ▶ Crear nuevo proyecto      │
│   Añadir a proyecto exist.  │
└─────────────────────────────┘
        │                │
        │ Crear          │ Añadir
        ▼                ▼
┌──────────────┐   ┌──────────────────┐
│ Elige stack: │   │ Elige categoría: │
│ ▶ React+Vite │   │ ▶ React          │
│   Next.js    │   │   Next.js        │
│   Astro      │   │   Astro          │
└──────────────┘   │   Rules & Guides │
        │          └──────────────────┘
        │ (corre                │
        │  scaffolder           │ (entra a categoría)
        │  oficial)             ▼
        │          ┌──────────────────────────┐
        │          │ Multi-select (espacio):  │
        │          │ [✓] Zod Form Pattern     │
        │          │ [ ] Controller Hook      │
        │          │ [ ] Compound Component   │
        │          │ ← volver  enter→instalar │
        │          └──────────────────────────┘
        │                       │
        └───────────────────────┘
                    │ (tras scaffolding: ¿aplicar patrones?)
                    ▼
        ┌─────────────────────────┐
        │ Instalando...           │
        │ ✓ src/hooks/useZodForm  │
        │ ✓ zod instalado         │
        │ ✓ react-hook-form       │
        │                         │
        │ Docs: playbook.dev/...  │
        └─────────────────────────┘
```

---

## CLI Internals

### `lib/fetcher.ts`
- Fetcha desde `https://raw.githubusercontent.com/sanghelgonzalez/sanghel-playbook/main/`
- Estrategia lazy: descarga `catalog/index.json` al inicio, luego `catalog/{cat}/index.json` al entrar a categoría, y manifests + files solo al instalar
- Branch configurable (default `main`) para poder testear desde `develop`

### `lib/installer.ts`
- Resuelve rutas relativas al `process.cwd()` donde el usuario corrió el comando
- Crea directorios intermedios con `fs.mkdirSync({ recursive: true })`
- Si archivo destino existe → pregunta confirmación antes de sobreescribir

### `lib/package-manager.ts`
- Detecta leyendo el directorio raíz:
  - `pnpm-lock.yaml` → `pnpm add`
  - `yarn.lock` → `yarn add`
  - `package-lock.json` → `npm install`
  - Sin lockfile → pregunta al usuario

### `lib/scaffolder.ts`
- Mapeo de stacks a comandos:
  - React + Vite → `npm create vite@latest`
  - Next.js → `npx create-next-app@latest`
  - Astro → `npm create astro@latest`
- Corre con `spawnSync(..., { stdio: 'inherit' })` para que el usuario interactúe directamente con el scaffolder oficial
- Después ofrece aplicar patrones del catálogo encima del proyecto recién creado

### Stack TUI
- **Ink** — React para terminal, componentes reutilizables
- **`@clack/prompts`** — spinners, confirmaciones, progress
- **TypeScript** strict

---

## Evolución del site de documentación

- `getting-started.mdx` → actualizado: explica el CLI, cómo instalarlo y usarlo
- Nueva sección **"Catálogo"** en el sidebar con una página por item instalable
- El `docsUrl` en cada `manifest.json` apunta a esa página
- Workflow para añadir un nuevo item:
  1. `catalog/react/mi-patron/manifest.json` + `files/`
  2. `src/content/docs/catalog/react/mi-patron.mdx`
  3. Un solo PR actualiza catálogo + docs

---

## Archivos críticos a crear/modificar

| Archivo | Acción |
|---|---|
| `package.json` (raíz) | Añadir `workspaces: ["packages/*"]` |
| `packages/cli/package.json` | Nuevo — `name: "sanghel-playbook"`, `bin` entry |
| `packages/cli/src/index.tsx` | Nuevo — entry point Ink |
| `packages/cli/src/ui/*.tsx` | Nuevos — pantallas TUI |
| `packages/cli/src/lib/*.ts` | Nuevos — fetcher, installer, pkg-manager, scaffolder |
| `catalog/index.json` | Nuevo — lista categorías |
| `catalog/*/index.json` | Nuevos — items por categoría |
| `catalog/*/manifest.json` | Nuevos — metadata de cada item |
| `src/content/docs/getting-started.mdx` | Modificar — explica el CLI |
| `src/content/docs/catalog/**` | Nuevas páginas por item |

---

## Limitaciones conocidas (v1)

- Las rutas `dest` en los manifests asumen estructura `src/hooks/`, `src/components/`. Si el proyecto del usuario usa una estructura diferente, deberá mover los archivos manualmente.
- No hay soporte offline — requiere conexión para fetchear el catálogo desde GitHub.

---

## Verificación

1. `cd packages/cli && npm run build` — compila sin errores
2. `node dist/index.js` desde un directorio de prueba — TUI arranca y muestra menú principal
3. Seleccionar un item → archivos aparecen en el directorio correcto
4. Deps instaladas con el package manager detectado
5. Modo crear proyecto → scaffolder oficial se ejecuta correctamente
6. `npx sanghel-playbook` desde un proyecto limpio — flujo completo end-to-end
