import { motion } from 'framer-motion'

const stages = [
  {
    label: 'Claude Event',
    icon: '⚡',
    description: '8 hook events from Claude Code',
    items: ['PromptSubmit', 'ToolUse', 'Stop', 'Error'],
  },
  {
    label: 'Hook Handler',
    icon: '🔗',
    description: 'TypeScript hooks intercept events',
    items: ['hooks.json', 'hook.ts'],
  },
  {
    label: 'Status Logic',
    icon: '🧠',
    description: 'Maps events to visual states',
    items: ['working', 'waiting', 'done', 'error'],
  },
  {
    label: 'iTerm2 Output',
    icon: '🎨',
    description: 'Escape sequences change terminal',
    items: ['Tab color', 'Badge', 'Notify', 'Sound'],
  },
]

export function HookPipeline() {
  return (
    <section className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            From Claude Code event to visual feedback — fully automatic, zero config.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          position: 'relative',
        }}>
          {/* Connection lines */}
          <svg
            style={{
              position: 'absolute',
              top: '50px',
              left: '12.5%',
              width: '75%',
              height: '4px',
              zIndex: 0,
            }}
          >
            <motion.line
              x1="0" y1="2" x2="100%" y2="2"
              stroke="rgba(96, 165, 250, 0.2)"
              strokeWidth="2"
              strokeDasharray="6 4"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </svg>

          {/* Animated particle */}
          <motion.div
            initial={{ left: '10%', opacity: 0 }}
            whileInView={{
              left: ['10%', '90%'],
              opacity: [0, 1, 1, 0],
            }}
            viewport={{ once: true }}
            transition={{
              duration: 2,
              delay: 0.8,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            style={{
              position: 'absolute',
              top: '47px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'var(--accent-blue)',
              boxShadow: '0 0 12px var(--accent-blue)',
              zIndex: 1,
            }}
          />

          {stages.map((stage, i) => (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 'var(--radius)',
                padding: '24px 16px',
                textAlign: 'center',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{stage.icon}</div>
              <div style={{
                fontWeight: 600,
                fontSize: '0.95rem',
                marginBottom: '6px',
              }}>
                {stage.label}
              </div>
              <div style={{
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                marginBottom: '14px',
              }}>
                {stage.description}
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}>
                {stage.items.map((item, j) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + j * 0.08 + 0.3 }}
                    style={{
                      fontSize: '0.75rem',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.04)',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <style>{`
          @media (max-width: 768px) {
            .section div[style*="grid-template-columns: repeat(4"] {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 480px) {
            .section div[style*="grid-template-columns: repeat(4"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </section>
  )
}
