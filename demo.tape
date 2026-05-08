# Sanghel Playbook — TUI demo
# Install vhs: brew install vhs
# Run: vhs demo.tape

Output public/demo.gif

Set Shell "bash"
Set FontSize 15
Set FontFamily "JetBrains Mono"
Set Width 900
Set Height 520
Set Theme "Catppuccin Mocha"
Set Padding 20
Set PlaybackSpeed 1.0
Set TypingSpeed 80ms

# ── Abrir la terminal ───────────────────────────────────────────────
Sleep 500ms
Type "npx sanghel-playbook"
Sleep 200ms
Enter
Sleep 2s

# ── Main Menu: elegir "Crear nuevo proyecto" (primera opción) ───────
Sleep 500ms
Enter
Sleep 800ms

# ── Stack Menu: React + Vite ─────────────────────────────────────────
Sleep 400ms
Enter
Sleep 800ms

# ── ProjectNameInput: escribir nombre ───────────────────────────────
Sleep 300ms
Ctrl+a
Backspace
Sleep 100ms
Type "my-awesome-app"
Sleep 600ms
Enter
Sleep 1500ms

# ── Extra Select: github-flow (espacio para seleccionar) ─────────────
Sleep 400ms
Space
Sleep 400ms
Enter
Sleep 1500ms

# ── El scaffold corre (stdio:inherit — vhs lo captura) ───────────────
Sleep 2s

# ── Volver al menú: mostrar flujo "Añadir a proyecto existente" ──────
Sleep 500ms
Type "npx sanghel-playbook"
Sleep 200ms
Enter
Sleep 2s

# Main menu: bajar a "Añadir a proyecto existente"
Down
Sleep 400ms
Enter
Sleep 2000ms

# Navegar por categorías (Rules & Guides)
Down
Down
Down
Sleep 400ms
Enter
Sleep 2000ms

# Seleccionar deploy-guide
Down
Sleep 300ms
Space
Sleep 400ms
Enter
Sleep 2500ms

Sleep 1s
