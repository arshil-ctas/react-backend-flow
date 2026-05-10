import Link from 'next/link';

export default function Home() {
  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      background: '#09090b',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(to right, #18181b 1px, transparent 1px), linear-gradient(to bottom, #18181b 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Glow */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: 600, height: 600,
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      <main style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px', maxWidth: 640 }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          border: '1px solid rgba(99,102,241,0.25)',
          background: 'rgba(99,102,241,0.08)',
          borderRadius: 999, padding: '4px 14px',
          fontSize: 11, color: '#818cf8', marginBottom: 32,
          letterSpacing: '0.04em',
        }}>
          Visual Backend Builder · MVP
        </div>

        <h1 style={{
          color: '#f4f4f5', fontSize: 'clamp(36px, 6vw, 72px)',
          fontWeight: 800, letterSpacing: '-0.04em',
          lineHeight: 1.05, marginBottom: 24,
        }}>
          Build backends<br />
          <span style={{
            background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            without the boilerplate.
          </span>
        </h1>

        <p style={{
          color: '#71717a', fontSize: 16, lineHeight: 1.7,
          marginBottom: 40, maxWidth: 480, margin: '0 auto 40px',
        }}>
          Design Mongoose schemas, wire hooks, map CSV/Excel columns, and generate
          production-ready TypeScript — all from a visual canvas.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/editor" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            height: 48, padding: '0 28px', borderRadius: 12,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            color: 'white', fontSize: 13, fontWeight: 700,
            textDecoration: 'none', letterSpacing: '-0.01em',
            boxShadow: '0 0 32px rgba(99,102,241,0.35)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}>
            Open Editor →
          </Link>
        </div>

        {/* Feature pills */}
        <div style={{ marginTop: 48, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {[
            { label: 'Mongoose Schemas', color: '#6366f1' },
            { label: 'pre/post Hooks', color: '#f59e0b' },
            { label: 'CSV / XLSX Upload', color: '#34d399' },
            { label: 'Control Flow', color: '#f472b6' },
            { label: 'Auto-Increment', color: '#fb923c' },
            { label: 'Bulk Operations', color: '#38bdf8' },
            { label: 'Code Generation', color: '#a78bfa' },
            { label: 'Relation Edges', color: '#818cf8' },
          ].map((f) => (
            <span key={f.label} style={{
              fontSize: 11, padding: '5px 12px', borderRadius: 8,
              border: `1px solid ${f.color}25`,
              background: `${f.color}0d`,
              color: f.color,
            }}>
              {f.label}
            </span>
          ))}
        </div>
      </main>
    </div>
  );
}