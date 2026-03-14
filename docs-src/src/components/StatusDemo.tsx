import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface StatusState {
  name: string
  color: string
  rgb: string
  badge: string
  description: string
  triggers: string[]
}

const statuses: StatusState[] = [
  {
    name: 'Working',
    color: 'var(--color-working)',
    rgb: '59, 130, 246',
    badge: 'Working...',
    description: 'Agent is actively processing your request',
    triggers: ['UserPromptSubmit', 'PreToolUse', 'PostToolUse'],
  },
  {
    name: 'Waiting',
    color: 'var(--color-waiting)',
    rgb: '234, 179, 8',
    badge: 'Input Needed',
    description: 'Agent needs your input or permission',
    triggers: ['AskUserQuestion', 'PermissionRequest', 'Idle prompt'],
  },
  {
    name: 'Done',
    color: 'var(--color-done)',
    rgb: '34, 197, 94',
    badge: 'Done',
    description: 'Task complete — notification sent',
    triggers: ['Stop hook'],
  },
  {
    name: 'Error',
    color: 'var(--color-error)',
    rgb: '239, 68, 68',
    badge: 'Error',
    description: 'Something went wrong during execution',
    triggers: ['PostToolUse (failure)'],
  },
]

export function StatusDemo() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const timer = setInterval(() => setActiveIdx(i => (i + 1) % statuses.length), 3000)
    return () => clearInterval(timer)
  }, [playing])

  const current = statuses[activeIdx]

  return (
    <section className="section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-title">Four States, Instant Feedback</h2>
        <p className="section-subtitle">
          Know exactly what your agent is doing — at a glance, without switching windows.
        </p>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '32px',
        alignItems: 'center',
      }}>
        {/* Terminal preview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="terminal" style={{
            boxShadow: `0 0 40px rgba(${current.rgb}, 0.12)`,
            transition: 'box-shadow 0.8s ease',
          }}>
            <motion.div
              className="terminal-header"
              animate={{
                borderBottomColor: current.color,
              }}
              transition={{ duration: 0.5 }}
              style={{ borderBottom: `2px solid ${current.color}` }}
            >
              <div className="terminal-dot red" />
              <div className="terminal-dot yellow" />
              <div className="terminal-dot green" />
              <div className="terminal-title">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={current.badge}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {current.badge}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>

            <div className="terminal-body" style={{ minHeight: '120px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>
                    <span style={{ color: 'var(--accent-cyan)' }}>~</span> claude "refactor the auth module"
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <motion.div
                      animate={{
                        scale: current.name === 'Working' ? [1, 1.3, 1] : 1,
                        opacity: current.name === 'Working' ? [1, 0.6, 1] : 1,
                      }}
                      transition={{
                        duration: 1,
                        repeat: current.name === 'Working' ? Infinity : 0,
                      }}
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: current.color,
                        boxShadow: `0 0 12px ${current.color}`,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ color: current.color, fontWeight: 600 }}>
                      {current.name}
                    </span>
                  </div>
                  {current.name === 'Working' && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '60%' }}
                      transition={{ duration: 2.5, ease: 'linear' }}
                      style={{
                        height: '2px',
                        background: `linear-gradient(90deg, ${current.color}, transparent)`,
                        marginTop: '12px',
                        borderRadius: '1px',
                      }}
                    />
                  )}
                  {current.name === 'Done' && (
                    <div style={{
                      marginTop: '12px',
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                    }}>
                      ✓ Refactored 3 files in 12s
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Playback controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '16px',
            alignItems: 'center',
          }}>
            <button
              onClick={() => setPlaying(!playing)}
              style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-muted)',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {playing ? '⏸' : '▶'}
            </button>
            {statuses.map((s, i) => (
              <button
                key={s.name}
                onClick={() => { setActiveIdx(i); setPlaying(false) }}
                style={{
                  width: i === activeIdx ? '20px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: i === activeIdx ? s.color : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* State cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {statuses.map((status, i) => (
            <motion.button
              key={status.name}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              onClick={() => { setActiveIdx(i); setPlaying(false) }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '16px',
                background: i === activeIdx ? `rgba(${status.rgb}, 0.08)` : 'var(--bg-card)',
                border: `1px solid ${i === activeIdx ? status.color : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s',
                width: '100%',
                color: 'inherit',
                fontFamily: 'inherit',
              }}
            >
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: status.color,
                boxShadow: i === activeIdx ? `0 0 10px ${status.color}` : 'none',
                flexShrink: 0,
                marginTop: '4px',
              }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>
                  {status.name}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '6px' }}>
                  {status.description}
                </div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '4px',
                }}>
                  {status.triggers.map(t => (
                    <span key={t} style={{
                      fontSize: '0.7rem',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .section > div[style*="grid"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
