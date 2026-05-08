# Deploy Guide — Vercel

## Arquitectura

```
main → Deploy producción (sanghel-playbook.vercel.app)
develop / feature/* → Deploy preview
```

Vercel detecta Next.js automáticamente y deployea en cada push.

---

## Pre-deploy checklist

```bash
pnpm install
pnpm build   # debe pasar sin errores
pnpm lint
npx tsc --noEmit
```

- [ ] Build local limpio
- [ ] `.env` no commiteado (verificar `.gitignore`)
- [ ] PR mergeado a `main`

---

## Primera vez (setup en Vercel)

1. Dashboard → **Add New Project** → importar `sanghel-playbook`
2. Framework: Next.js (auto-detectado)
3. Build: `pnpm build` · Install: `pnpm install`
4. Deploy

**Variables de entorno:** Settings → Environment Variables → agregar por scope (Production / Preview).

---

## Deploy manual (CLI)

```bash
npm install -g vercel
vercel login
vercel --prod   # producción
vercel          # preview
```

---

## Rollback

```bash
vercel rollback
# o en el dashboard: Deployments → deployment anterior → "Promote to Production"
```

---

## Post-deploy checklist

- [ ] Página carga en producción
- [ ] Rutas de docs funcionan (`/docs/[slug]`)
- [ ] Tema light/dark activo
- [ ] Sin errores en consola del navegador
- [ ] Responsive en móvil
