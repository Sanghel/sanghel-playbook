import styles from './TerminalFrame.module.css'

interface Props {
  children: React.ReactNode
  title?: string
}

export function TerminalFrame({ children, title = 'sanghel-playbook' }: Props) {
  return (
    <div className={styles.window}>
      <div className={styles.titlebar}>
        <div className={styles.dots}>
          <span className={styles.dotRed} />
          <span className={styles.dotYellow} />
          <span className={styles.dotGreen} />
        </div>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  )
}
