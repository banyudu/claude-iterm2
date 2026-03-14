import { useState } from 'react'
import { motion } from 'framer-motion'

const configLines = [
  '{',
  '  "tabColor": true,',
  '  "badge": true,',
  '  "bgTint": false,',
  '  "notification": true,',
  '  "sound": true,',
  '  "gradient": true,',
  '  "doneToWaiting": true,',
  '  "gradientDuration": 60,',
  '  "doneToWaitingDelay": 60',
  '}',
]

const toggles = [
  { key: 'tabColor', label: 'Tab Colors', line: 1, env: 'AI_ENABLE_TAB_COLOR' },
  { key: 'badge', label: 'Badge Text', line: 2, env: 'AI_ENABLE_BADGE' },
  { key: 'bgTint', label: 'Background Tint', line: 3, env: 'AI_ENABLE_BG_TINT' },
  { key: 'notification', label: 'Notifications', line: 4, env: 'AI_ENABLE_NOTIFICATION' },
  { key: 'sound', label: 'Sound Effects', line: 5, env: 'AI_DISABLE_SOUND' },
  { key: 'gradient', label: 'Gradient Animation', line: 6, env: 'AI_ENABLE_GRADIENT' },
  { key: 'doneToWaiting', label: 'Auto-Transition', line: 7, env: 'AI_ENABLE_DONE_TO_WAITING' },
]

const defaults: Record<string, boolean> = {
  tabColor: true, badge: true, bgTint: false, notification: true,
  sound: true, gradient: true, doneToWaiting: true,
}

export function Config() {
  const [settings, setSettings] = useState(defaults)

  const toggle = (key: string) => {
    setSettings(s => ({ ...s, [key]: !s[key] }))
  }

  const getDisplayLines = () =>
    configLines.map((line, i) => {
      const t = toggles.find(t => t.line === i)
      if (t) {
        return line.replace(/true|false/, String(settings[t.key]))
      }
      return line
    })

  return (
    <section className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">Fully Configurable</h2>
          <p className="section-subtitle">
            Toggle features on or off. Settings persist in <code style={{
              fontFamily: 'var(--font-mono)',
              background: 'rgba(255,255,255,0.06)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.9em',
            }}>~/.config/claude-iterm2/config.json</code>
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px',
          alignItems: 'start',
        }}>
          {/* Code preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="terminal">
              <div className="terminal-header">
                <div className="terminal-dot red" />
                <div className="terminal-dot yellow" />
                <div className="terminal-dot green" />
                <div className="terminal-title">config.json</div>
              </div>
              <div className="terminal-body">
                {getDisplayLines().map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    style={{
                      lineHeight: 1.6,
                      color: line.includes('true')
                        ? 'var(--color-done)'
                        : line.includes('false')
                          ? 'var(--color-error)'
                          : line.match(/\d+[^"]/)
                            ? 'var(--accent-cyan)'
                            : 'var(--text-primary)',
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)', userSelect: 'none', marginRight: '16px' }}>
                      {String(i + 1).padStart(2)}
                    </span>
                    {line}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Toggle switches */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            {toggles.map((t, i) => (
              <motion.div
                key={t.key}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{t.label}</div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    marginTop: '2px',
                  }}>
                    {t.env}
                  </div>
                </div>
                <button
                  onClick={() => toggle(t.key)}
                  style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '12px',
                    border: 'none',
                    background: settings[t.key] ? 'var(--color-done)' : 'rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 0.2s',
                  }}
                >
                  <motion.div
                    animate={{ x: settings[t.key] ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#fff',
                      position: 'absolute',
                      top: '2px',
                      left: '2px',
                    }}
                  />
                </button>
              </motion.div>
            ))}

            <div style={{
              marginTop: '8px',
              padding: '12px 16px',
              background: 'rgba(96, 165, 250, 0.06)',
              border: '1px solid rgba(96, 165, 250, 0.15)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
            }}>
              Configure via <code style={{
                fontFamily: 'var(--font-mono)',
                background: 'rgba(255,255,255,0.06)',
                padding: '1px 4px',
                borderRadius: '3px',
              }}>/iterm2:config</code> or <code style={{
                fontFamily: 'var(--font-mono)',
                background: 'rgba(255,255,255,0.06)',
                padding: '1px 4px',
                borderRadius: '3px',
              }}>/iterm2:setup</code> commands. Environment variables override saved settings.
            </div>
          </motion.div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .section > div > div[style*="grid-template-columns: 1fr 1fr"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </section>
  )
}
