#!/usr/bin/env bash
# Simulates the Sanghel Playbook TUI for vhs recording.
# Run: vhs demo.tape

# ── Colors ──────────────────────────────────────────────────────────
RESET="\033[0m"
BOLD="\033[1m"
DIM="\033[2m"
CYAN="\033[36m"
GREEN="\033[32m"
YELLOW="\033[33m"

clear_screen() { printf "\033[2J\033[H"; }
sleep_short()  { sleep 0.6; }
sleep_long()   { sleep 1.1; }

# ── Screen 1: Main Menu ──────────────────────────────────────────────
clear_screen
printf "\n"
printf "  ${BOLD}${CYAN}Sanghel Playbook${RESET}\n"
printf "\n"
printf "  ${GREEN}▶ Crear nuevo proyecto${RESET}\n"
printf "    Añadir a proyecto existente\n"
printf "\n"
printf "  ${DIM}↑↓ navegar  enter confirmar${RESET}\n"
sleep_long

# ── Screen 2: Stack Menu ─────────────────────────────────────────────
clear_screen
printf "\n"
printf "  ${BOLD}${CYAN}Nuevo proyecto — elige el stack base${RESET}\n"
printf "\n"
printf "  ${GREEN}▶ ${BOLD}Next.js${RESET}\n"
printf "       ${DIM}App Router · TypeScript · Tailwind CSS${RESET}\n"
printf "     React + Vite\n"
printf "     Astro\n"
printf "\n"
printf "  ${DIM}↑↓ navegar  enter confirmar  esc volver${RESET}\n"
sleep_long

# ── Screen 3: Package Manager ────────────────────────────────────────
clear_screen
printf "\n"
printf "  ${BOLD}${CYAN}Next.js — gestor de paquetes${RESET}\n"
printf "\n"
printf "  ${GREEN}▶ ${BOLD}pnpm${RESET}\n"
printf "       ${DIM}Recomendado · rápido y eficiente en disco${RESET}\n"
printf "     npm\n"
printf "     yarn\n"
printf "\n"
printf "  ${DIM}↑↓ navegar  enter confirmar  esc volver${RESET}\n"
sleep_long

# ── Screen 4: Project Name ───────────────────────────────────────────
clear_screen
printf "\n"
printf "  ${BOLD}${CYAN}Next.js · pnpm — nombre del proyecto${RESET}\n"
printf "\n"
printf "  ${DIM}> ${RESET}${BOLD}mi-proyecto${GREEN}█${RESET}\n"
printf "\n"
printf "  ${DIM}enter confirmar  esc volver${RESET}\n"
sleep_long

# ── Screen 5: Loading integrations ───────────────────────────────────
clear_screen
printf "\n"
printf "  ${CYAN}Cargando integraciones del catálogo...${RESET}\n"
sleep 0.7

# ── Screen 6: Integrations Multi-Select ──────────────────────────────
clear_screen
printf "\n"
printf "  ${BOLD}${CYAN}Integraciones para Next.js${RESET}\n"
printf "\n"
printf "  ${GREEN}▶ ${BOLD}[✓] NextAuth v5${RESET}\n"
printf "       ${DIM}Autenticación completa con sesiones y Credentials provider${RESET}\n"
printf "     [✓] React Query\n"
printf "     [ ] React Hook Form\n"
printf "     [ ] Ant Design\n"
printf "     [✓] i18next\n"
printf "     [✓] Zustand\n"
printf "     [ ] Redux Toolkit\n"
printf "     [ ] Day.js\n"
printf "     [ ] Currency utils\n"
printf "\n"
printf "  ${DIM}↑↓ navegar  espacio marcar  enter instalar  esc volver${RESET}\n"
printf "  ${YELLOW}4 seleccionadas${RESET}\n"
sleep_long

# ── Screen 7: Scaffold running ────────────────────────────────────────
clear_screen
printf "\n"
printf "  ${CYAN}Creando proyecto Next.js con pnpm...${RESET}\n"
sleep 0.5
printf "\n"
printf "  ${DIM}Scaffolding project in mi-proyecto...${RESET}\n"
sleep 0.5
printf "  ${DIM}Installing dependencies with pnpm...${RESET}\n"
sleep 0.7

# ── Screen 8: Template overlay ────────────────────────────────────────
printf "\n"
printf "  ${CYAN}Aplicando template base...${RESET}\n"
sleep 0.3
printf "  ${GREEN}✓${RESET} src/app/layout.tsx\n"
sleep 0.15
printf "  ${GREEN}✓${RESET} src/app/page.tsx\n"
sleep 0.15
printf "  ${GREEN}✓${RESET} src/app/globals.css\n"
sleep 0.15
printf "  ${GREEN}✓${RESET} tailwind.config.ts\n"
sleep 0.5

# ── Screen 9: Installing integrations ────────────────────────────────
printf "\n"
printf "  ${CYAN}Instalando integración: NextAuth v5...${RESET}\n"
sleep 0.3
printf "  ${GREEN}✓${RESET} src/auth.ts\n"
sleep 0.15
printf "  ${GREEN}✓${RESET} src/app/api/auth/[...nextauth]/route.ts\n"
sleep 0.15
printf "  ${DIM}patch:${RESET} src/app/layout.tsx\n"
sleep 0.4

printf "\n"
printf "  ${CYAN}Instalando integración: React Query...${RESET}\n"
sleep 0.3
printf "  ${GREEN}✓${RESET} src/lib/queryClient.ts\n"
sleep 0.15
printf "  ${GREEN}✓${RESET} src/hooks/useQueryHooks.ts\n"
sleep 0.15
printf "  ${DIM}patch:${RESET} src/app/layout.tsx\n"
sleep 0.4

printf "\n"
printf "  ${CYAN}Instalando integración: i18next...${RESET}\n"
sleep 0.3
printf "  ${GREEN}✓${RESET} src/i18n/config.ts\n"
sleep 0.15
printf "  ${GREEN}✓${RESET} src/i18n/locales/es.json\n"
sleep 0.15
printf "  ${GREEN}✓${RESET} src/i18n/locales/en.json\n"
sleep 0.4

printf "\n"
printf "  ${CYAN}Instalando integración: Zustand...${RESET}\n"
sleep 0.3
printf "  ${GREEN}✓${RESET} src/store/useAppStore.ts\n"
sleep 0.5

# ── Screen 10: Done ───────────────────────────────────────────────────
printf "\n"
printf "  ${BOLD}${GREEN}✓ Proyecto \"mi-proyecto\" listo.${RESET}\n"
printf "  ${DIM}cd mi-proyecto && pnpm dev${RESET}\n"
printf "\n"
sleep_long
