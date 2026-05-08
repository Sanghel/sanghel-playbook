import styles from './Welcome.module.css'

export function Welcome() {
  return (
    <div className={styles.container}>
      <div className={styles.badge}>Sanghel Playbook</div>
      <h1 className={styles.title}>Welcome to Sanghel React + Vite Template</h1>
      <p className={styles.subtitle}>
        Your project is ready. Start building with a solid foundation.
      </p>
      <div className={styles.grid}>
        <a
          className={styles.card}
          href="https://sanghel-playbook.vercel.app/docs/getting-started"
          target="_blank"
          rel="noreferrer"
        >
          <h2>Docs →</h2>
          <p>Patterns, components and architectural decisions.</p>
        </a>
        <a
          className={styles.card}
          href="https://github.com/Sanghel/sanghel-playbook"
          target="_blank"
          rel="noreferrer"
        >
          <h2>Playbook →</h2>
          <p>Browse the catalog and add more patterns.</p>
        </a>
        <div className={styles.card}>
          <h2>Structure</h2>
          <pre className={styles.tree}>{`src/
├── components/
├── hooks/
└── App.tsx`}</pre>
        </div>
        <div className={styles.card}>
          <h2>Add patterns</h2>
          <pre className={styles.tree}>npx sanghel-playbook</pre>
        </div>
      </div>
    </div>
  )
}
