import { ConfigProvider } from 'antd'
import { antdTheme } from '../theme/antdTheme'

export function AntdProvider({ children }: { children: React.ReactNode }) {
  return <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>
}
