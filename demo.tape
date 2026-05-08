# Sanghel Playbook — TUI demo
# Install vhs: brew install vhs
# Run: vhs demo.tape  →  genera public/demo.gif

Output public/demo.gif

Set Shell        "bash"
Set FontSize     14
Set FontFamily   "JetBrains Mono"
Set Width        820
Set Height       480
Set Theme        "Tokyo Night"
Set Padding      24
Set PlaybackSpeed 1.0
Set TypingSpeed  60ms
Set CursorBlink  false

# Pequeña pausa inicial para que la terminal se vea limpia
Sleep 400ms

# Escribir el comando
Type "bash demo-mock.sh"
Sleep 300ms
Enter

# El script controla sus propios tiempos internos
# Solo necesitamos esperar a que termine (~12s)
Sleep 13s
