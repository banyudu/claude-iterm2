import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const states = [
  { name: 'Working', color: 'var(--color-working)', badge: 'Working...', rgb: 'var(--color-working-rgb)' },
  { name: 'Waiting', color: 'var(--color-waiting)', badge: 'Input Needed', rgb: 'var(--color-waiting-rgb)' },
  { name: 'Done', color: 'var(--color-done)', badge: 'Done', rgb: 'var(--color-done-rgb)' },
  { name: 'Error', color: 'var(--color-error)', badge: 'Error', rgb: 'var(--color-error-rgb)' },
] as const

const installCmd = 'claude plugin add banyudu/claude-iterm2'

export function Hero() {
  const [stateIdx, setStateIdx] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setStateIdx(i => (i + 1) % states.length), 2000)
    return () => clearInterval(timer)
  }, [])

  const current = states[stateIdx]

  const handleCopy = async () => {
    await navigator.clipboard.writeText(installCmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse 80% 60% at 50% -20%, rgba(${current.rgb}, 0.15), transparent)`,
        transition: 'background 1s ease',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: '20px',
            background: 'rgba(96, 165, 250, 0.1)',
            border: '1px solid rgba(96, 165, 250, 0.2)',
            fontSize: '0.85rem',
            color: 'var(--accent-blue)',
            marginBottom: '24px',
            fontFamily: 'var(--font-mono)',
          }}
        >
          Claude Code Plugin
        </motion.div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: '20px',
          maxWidth: '700px',
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #fff 30%, var(--accent-blue) 70%, var(--accent-cyan))',
            backgroundSize: '200% 200%',
            animation: 'gradientShift 6s ease infinite',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Visual Status
          </span>
          <br />
          <span style={{ color: 'var(--text-primary)' }}>for iTerm2</span>
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-secondary)',
          maxWidth: '540px',
          margin: '0 auto 40px',
        }}>
          Tab colors, badges, and notifications that reflect your Claude Code agent's state in real time.
        </p>
      </motion.div>

      {/* Animated terminal preview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{
          width: '100%',
          maxWidth: '520px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div className="terminal" style={{
          boxShadow: `0 0 60px rgba(${current.rgb}, 0.15), 0 0 1px rgba(${current.rgb}, 0.3)`,
          transition: 'box-shadow 1s ease',
        }}>
          <div className="terminal-header" style={{
            borderBottom: `2px solid ${current.color}`,
            transition: 'border-color 0.5s ease',
          }}>
            <div className="terminal-dot red" />
            <div className="terminal-dot yellow" />
            <div className="terminal-dot green" />
            <div className="terminal-title">
              <AnimatePresence mode="wait">
                <motion.span
                  key={current.badge}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.3 }}
                >
                  {current.badge}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
          <div className="terminal-body">
            <div style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span style={{ color: 'var(--accent-cyan)' }}>~</span> claude
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={stateIdx}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: current.color,
                    boxShadow: `0 0 8px ${current.color}`,
                    flexShrink: 0,
                  }}
                />
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.span
                  key={current.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                  style={{ color: current.color, fontWeight: 500, transition: 'color 0.5s' }}
                >
                  {current.name}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* State indicator dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '16px',
        }}>
          {states.map((s, i) => (
            <button
              key={s.name}
              onClick={() => setStateIdx(i)}
              style={{
                width: i === stateIdx ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === stateIdx ? s.color : 'var(--bg-card)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Install command */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{ marginTop: '40px', position: 'relative', zIndex: 1 }}
      >
        <button
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 20px',
            background: 'var(--bg-card)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
        >
          <span style={{ color: 'var(--text-muted)' }}>$</span>
          <span>{installCmd}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            {copied ? '✓' : '⎘'}
          </span>
        </button>
      </motion.div>
    </section>
  )
}
