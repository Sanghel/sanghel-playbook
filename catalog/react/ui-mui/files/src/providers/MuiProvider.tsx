import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from '../theme/muiTheme'

export function MuiProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
