import { ThemeProvider, CssBaseline } from '@mui/material'
import type { ReactNode } from 'react'
import { theme } from '../theme/muiTheme'

export function MuiProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
