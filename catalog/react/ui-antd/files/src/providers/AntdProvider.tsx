import { ConfigProvider } from 'antd'
import type { ReactNode } from 'react'
import { antdTheme } from '../theme/antdTheme'

export function AntdProvider({ children }: { children: ReactNode }) {
  return <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>
}
