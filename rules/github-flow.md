# GitHub Flow

## Estructura de ramas

```
main (producción — solo PRs desde develop)
  ↑
develop (integración — rama por defecto)
  ↑
feature/[issue-number]-[descripcion]
```

---

## Flujo por tarea

```bash
# 1. Crear issue de tarea → anotar #N
gh issue create --title "Descripción" --body "..."

# 2. Rama desde develop actualizado
git checkout develop && git pull origin develop
git checkout -b feature/N-descripcion

# 3. Desarrollar, commit
git add src/archivo.ts
git commit -m "feat: descripción corta"

# 4. Push y PR hacia develop
git push -u origin feature/N-descripcion
gh pr create --base develop --title "..." --body "Closes #N"

# 5. Merge y limpieza
gh pr merge N --squash
git checkout develop && git pull origin develop
git branch -d feature/N-descripcion
```

---

## Fin de fase (develop → main)

```bash
# Verificar build
pnpm build

# PR develop → main
gh pr create --base main --head develop --title "FASE N: ..."

# ⚠️ Detener desarrollo y esperar aprobación
# Después de merge:
git checkout develop && git pull origin develop
```

---

## Conventional commits

| Prefijo | Uso |
|---------|-----|
| `feat:` | nueva funcionalidad |
| `fix:` | corrección de bug |
| `refactor:` | refactorización sin cambio de comportamiento |
| `docs:` | documentación |
| `chore:` | mantenimiento, deps, config |
| `style:` | formato de código |

---

## Troubleshooting

**Conflictos de merge:**
```bash
# Resolver los archivos marcados con <<<<<<<
git add archivo-resuelto.ts
git commit -m "resolve merge conflicts"
```

**Actualizar rama feature con cambios de develop:**
```bash
git fetch origin
git rebase origin/develop
# Si hay conflictos: resolverlos, git add, git rebase --continue
git push --force-with-lease
```

**Commit con mensaje incorrecto (antes de push):**
```bash
git commit --amend -m "mensaje correcto"
```
