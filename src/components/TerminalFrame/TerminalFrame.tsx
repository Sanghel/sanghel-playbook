import styles from './TerminalFrame.module.css'

interface Props {
  children: React.ReactNode
}

export function TerminalFrame({ children }: Props) {
  return (
    <div className={styles.window}>
      <div className={styles.body}>{children}</div>
    </div>
  )
}

export function TerminalFramePlaceholder({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.window}>
      <div className={styles.placeholder}>
        <div className={styles.placeholderTitlebar}>
          <div className={styles.dots}>
            <span className={`${styles.dot} ${styles.dotRed}`} />
            <span className={`${styles.dot} ${styles.dotYellow}`} />
            <span className={`${styles.dot} ${styles.dotGreen}`} />
          </div>
          <span className={styles.placeholderTitle}>sanghel-playbook — bash</span>
        </div>
        <div className={styles.placeholderContent}>{children}</div>
      </div>
    </div>
  )
}
