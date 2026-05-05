# 02 - GUÍA DE DEPLOY

## 🚀 Deploy en Vercel

Esta guía cubre el proceso completo de deploy del proyecto sanghel-playbook.

---

## 📋 Resumen de Arquitectura

```
┌─────────────────────────────────────┐
│  Usuario                             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Frontend (Next.js)                  │
│  Deploy: Vercel                      │
│  URL: sanghel-playbook.vercel.app   │
└─────────────────────────────────────┘
```

---

## PARTE 1: PRE-DEPLOY (Preparación)

### 1.1. Verificar Build Local

Antes de deployar, asegúrate de que todo funciona localmente:

```bash
pnpm install
pnpm build
pnpm start
# Abrir http://localhost:3000
```

**Verificar:**

- ✅ No hay errores de TypeScript
- ✅ No hay errores de build
- ✅ La aplicación se ve correcta
- ✅ Todas las páginas y rutas funcionan

### 1.2. Verificar Variables de Entorno

Si el proyecto requiere variables de entorno, mantener un archivo `.env.local.example`:

```env
# Ejemplo — agregar las variables reales cuando sean necesarias
# NEXT_PUBLIC_SITE_URL=
```

**⚠️ NO incluir valores reales en `.env.local.example`**

### 1.3. Actualizar .gitignore

Asegúrate de que `.gitignore` incluye:

```gitignore
.env
.env.local
.env.*.local
.env.production
.next/
out/
.vercel
```

### 1.4. Push Final a GitHub

```bash
git checkout main
git pull origin main
git status
git push origin main
```

---

## PARTE 2: CONFIGURAR VERCEL

### 2.1. Instalar Vercel CLI (opcional pero recomendado)

```bash
npm install -g vercel
vercel --version
vercel login
```

### 2.2. Importar Proyecto desde GitHub

**Opción A - Vercel Web (Recomendado para primera vez):**

1. En dashboard de Vercel, click **"Add New Project"**
2. Click **"Import Git Repository"**
3. Selecciona `sanghel-playbook`
4. Click **"Import"**

**Opción B - Vercel CLI:**

```bash
cd sanghel-playbook
vercel
# Framework Preset: Next.js (auto-detectado)
# Root Directory: ./
```

### 2.3. Configurar Proyecto en Vercel

Vercel detecta Next.js automáticamente. Si no:

- **Framework Preset**: Next.js
- **Build Command**: `pnpm build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`

---

## PARTE 3: VARIABLES DE ENTORNO EN VERCEL

Si se agregan variables de entorno en el futuro:

1. Settings del proyecto → **"Environment Variables"**
2. Agregar cada variable con su scope (Production / Preview / Development)
3. Click **"Save"** y hacer redeploy

---

## PARTE 4: DEPLOY

### 4.1. Deploy Automático desde GitHub

Vercel deployará automáticamente cuando:

- Hagas push a `main` → deploy de **producción**
- Hagas push a cualquier otra rama → deploy de **preview**
- Abras un PR → deploy de **preview** asociado al PR

### 4.2. Deploy Manual (CLI)

```bash
# Deploy a producción
vercel --prod

# Deploy a preview
vercel
```

### 4.3. Monitorear el Deploy

1. Ve a https://vercel.com/[tu-usuario]/sanghel-playbook
2. Click en el deployment más reciente
3. Estados: **Building** → **Deploying** → **Ready**

### 4.4. Verificar Logs de Build

Si hay errores:

1. Click en el deployment → **"Build Logs"**
2. Errores comunes:
   - TypeScript no compila
   - Dependencia faltante en `package.json`
   - Variable de entorno faltante

---

## PARTE 5: BRANCHES Y DEPLOY

**Configuración recomendada:**

- `main` → Deploy de **Producción**
- `develop` → Deploy de **Preview**
- `feature/*` → Deploy de **Preview**

**Configurar en Vercel:**

1. Settings → **"Git"**
2. **Production Branch**: `main`
3. ✅ **Auto-deploy**: Enabled
4. ✅ **Preview Deployments**: All branches

**Proteger rama main en GitHub:**

1. Settings del repo → **"Branches"** → **"Branch protection rules"**
2. Regla para `main`:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass (Vercel)
3. Save

---

## PARTE 6: DOMINIO CUSTOM (Opcional)

```
Settings → Domains → Add → ingresar tu dominio
```

Configurar DNS con el CNAME o A Record que Vercel indique.

---

## PARTE 7: ROLLBACK

**Opción A - Vercel Dashboard:**

1. Ve a **"Deployments"**
2. Encuentra el deployment anterior funcional
3. Click **"..."** → **"Promote to Production"**

**Opción B - CLI:**

```bash
vercel rollback
```

---

## PARTE 8: VERIFICACIÓN POST-DEPLOY

- [ ] ✅ La página carga correctamente
- [ ] ✅ Las rutas de docs funcionan (`/docs/[slug]`)
- [ ] ✅ El tema (light/dark) funciona
- [ ] ✅ El MDX renderiza correctamente
- [ ] ✅ Syntax highlighting activo
- [ ] ✅ Responsive en móvil
- [ ] ✅ No hay errores en consola del navegador

---

## PARTE 9: MONITOREO

**Vercel Analytics (gratis):**

Activar desde el dashboard del proyecto → **"Analytics"**

- Web Vitals
- Real User Monitoring
- Pageviews

**Logs en tiempo real (CLI):**

```bash
vercel logs --prod
vercel logs --prod | grep "ERROR"
```

---

## 📞 Recursos Útiles

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deploy**: https://nextjs.org/docs/deployment
- **Vercel Status**: https://www.vercel-status.com

---

## 🎉 ¡Deploy Completado!

**URLs Importantes:**

- Frontend: `https://sanghel-playbook.vercel.app`
- GitHub: `https://github.com/Sanghel/sanghel-playbook`
