# Sanghel Playbook — TUI demo
# Install vhs: brew install vhs
# Run: vhs demo.tape  →  genera public/demo.gif

Output public/demo.gif

Set Shell         "bash"
Set FontSize      13
Set FontFamily    "Menlo"
Set Width         760
Set Height        500
Set Theme         "TokyoNight"
Set Padding       20
Set PlaybackSpeed 1.0
Set TypingSpeed   50ms
Set CursorBlink   false
Set WindowBar     Colorful
Set WindowBarSize 28
Set BorderRadius  8
Set LetterSpacing 0

# Pequeña pausa inicial
Sleep 400ms

Type "bash demo-mock.sh"
Sleep 300ms
Enter

# El script controla sus propios tiempos (~12s)
Sleep 13s
