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
sleep_long()   { sleep 1.2; }

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
printf "  ${GREEN}▶ ${BOLD}React + Vite${RESET}\n"
printf "       ${DIM}Welcome module · components/ · hooks/ · useLocalStorage${RESET}\n"
printf "     Next.js (create-next-app)\n"
printf "     Astro\n"
printf "\n"
printf "  ${DIM}↑↓ navegar  enter confirmar  esc volver${RESET}\n"
sleep_long

# ── Screen 3: Project Name ───────────────────────────────────────────
clear_screen
printf "\n"
printf "  ${BOLD}${CYAN}Nuevo proyecto — nombre del proyecto${RESET}\n"
printf "\n"
printf "  ${DIM}> ${RESET}${BOLD}my-awesome-app${GREEN}█${RESET}\n"
printf "\n"
printf "  ${DIM}enter confirmar  esc volver${RESET}\n"
sleep_long

# ── Screen 4: Loading extras ─────────────────────────────────────────
clear_screen
printf "\n"
printf "  ${CYAN}Cargando extras del catálogo...${RESET}\n"
sleep 0.8

# ── Screen 5: Extra Select ────────────────────────────────────────────
clear_screen
printf "\n"
printf "  ${BOLD}${CYAN}Extras para react-vite — \"my-awesome-app\"${RESET}\n"
printf "\n"
printf "  ${GREEN}▶ ${BOLD}[✓] GitHub Flow${RESET}\n"
printf "       ${DIM}Flujo de trabajo con Git y GitHub${RESET}\n"
printf "     [ ] Deploy Guide (Vercel)\n"
printf "\n"
printf "  ${DIM}↑↓ navegar  espacio seleccionar  enter instalar  esc volver${RESET}\n"
printf "  ${YELLOW}1 item(s) seleccionado(s)${RESET}\n"
sleep_long

# ── Screen 6: Scaffold running ────────────────────────────────────────
clear_screen
printf "\n"
printf "  ${CYAN}Creando proyecto con Vite...${RESET}\n"
sleep 0.4
printf "\n"
printf "  ${DIM}Scaffolding project in my-awesome-app...${RESET}\n"
sleep 0.5
printf "  ${DIM}Done. Now run:${RESET}\n"
printf "\n"
printf "  ${DIM}  cd my-awesome-app${RESET}\n"
printf "  ${DIM}  npm install${RESET}\n"
printf "  ${DIM}  npm run dev${RESET}\n"
sleep 0.8

# ── Screen 7: Template overlay ────────────────────────────────────────
printf "\n"
printf "  ${CYAN}Aplicando template Sanghel...${RESET}\n"
sleep 0.4
printf "  ${GREEN}✓${RESET} src/components/Welcome/Welcome.tsx\n"
sleep 0.2
printf "  ${GREEN}✓${RESET} src/components/Welcome/Welcome.module.css\n"
sleep 0.2
printf "  ${GREEN}✓${RESET} src/hooks/useLocalStorage.ts\n"
sleep 0.2
printf "  ${GREEN}✓${RESET} src/App.tsx\n"
sleep 0.6

# ── Screen 8: Installing extras ───────────────────────────────────────
printf "\n"
printf "  ${CYAN}Instalando extras...${RESET}\n"
sleep 0.4
printf "  ${GREEN}✓${RESET} rules/github-flow.md\n"
sleep 0.6

# ── Screen 9: Done ────────────────────────────────────────────────────
printf "\n"
printf "  ${BOLD}${GREEN}✓ Proyecto \"my-awesome-app\" listo.${RESET}\n"
printf "  ${DIM}Entra al directorio: cd my-awesome-app${RESET}\n"
printf "\n"
sleep_long
