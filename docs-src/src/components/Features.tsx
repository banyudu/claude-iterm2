import { motion } from 'framer-motion'

const features = [
  {
    icon: '🎨',
    title: 'Tab Colors',
    description: 'Four distinct colors instantly show agent state — blue, yellow, green, red.',
    color: 'var(--color-working)',
  },
  {
    icon: '🏷️',
    title: 'Badge Text',
    description: 'Watermark overlay shows status text right on the terminal background.',
    color: 'var(--accent-purple)',
  },
  {
    icon: '🌊',
    title: 'Gradient Animation',
    description: 'Smooth yellow-to-orange gradient pulses while waiting for your input.',
    color: 'var(--color-waiting)',
  },
  {
    icon: '🔔',
    title: 'Desktop Notifications',
    description: 'Get notified when tasks complete — even if iTerm2 is in the background.',
    color: 'var(--color-done)',
  },
  {
    icon: '🔊',
    title: 'Sound Effects',
    description: 'System sounds (Tink, Pop, Funk) for audio feedback on state changes.',
    color: 'var(--accent-cyan)',
  },
  {
    icon: '⏱️',
    title: 'Auto-Transition',
    description: 'Done state automatically transitions to waiting after a configurable delay.',
    color: 'var(--accent-blue)',
  },
  {
    icon: '📐',
    title: 'Grid Layout',
    description: 'Split iTerm2 into organized panes with a single command — 2x2, 3x3, custom.',
    color: 'var(--accent-purple)',
  },
  {
    icon: '🎨',
    title: 'Background Tint',
    description: 'Subtle color fill across the entire terminal background for ambient status.',
    color: 'var(--color-error)',
  },
]

export function Features() {
  return (
    <section className="section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-title">Everything You Need</h2>
        <p className="section-subtitle">
          Every feature is independently configurable — enable only what you want.
        </p>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '16px',
      }}>
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            style={{
              padding: '24px',
              background: 'var(--bg-card)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 'var(--radius)',
              cursor: 'default',
            }}
          >
            <div style={{
              fontSize: '1.5rem',
              marginBottom: '12px',
            }}>
              {feature.icon}
            </div>
            <div style={{
              fontWeight: 600,
              fontSize: '1rem',
              marginBottom: '8px',
              color: feature.color,
            }}>
              {feature.title}
            </div>
            <div style={{
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              lineHeight: 1.5,
            }}>
              {feature.description}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
