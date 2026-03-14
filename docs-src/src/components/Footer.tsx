export function Footer() {
  return (
    <footer style={{
      padding: '40px 24px',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      textAlign: 'center',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        marginBottom: '16px',
        fontSize: '0.9rem',
      }}>
        <a
          href="https://github.com/banyudu/claude-iterm2"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://github.com/banyudu/claude-iterm2/blob/main/README.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          Documentation
        </a>
        <a
          href="https://github.com/banyudu/claude-iterm2/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
        >
          MIT License
        </a>
      </div>
      <div style={{
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
      }}>
        Built by{' '}
        <a
          href="https://github.com/banyudu"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--text-secondary)' }}
        >
          banyudu
        </a>
      </div>
    </footer>
  )
}
