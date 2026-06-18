import type { GenerationResult } from '@/lib/types';

interface ShareCardProps {
  data: GenerationResult;
  inputText: string;
}

export default function ShareCard({ data, inputText }: ShareCardProps) {
  const colors = ['#f59e0b', '#34d399', '#a78bfa'];

  return (
    <div
      id="share-card"
      className="fixed"
      style={{
        left: '-9999px',
        top: 0,
        width: '800px',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        color: 'white',
        fontFamily: '"Noto Serif SC", serif',
        padding: '48px',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <h1 style={{ fontSize: '36px', fontWeight: 700, textAlign: 'center', marginBottom: '8px', letterSpacing: '2px' }}>
        平行人生模拟器
      </h1>
      <p style={{ fontSize: '16px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>
        如果「{inputText.slice(0, 50)}{inputText.length > 50 ? '...' : ''}」
      </p>

      {/* Three columns */}
      <div style={{ display: 'flex', gap: '20px' }}>
        {data.storylines.map((s, i) => (
          <div
            key={s.id}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '16px',
              padding: '24px',
              borderTop: `3px solid ${colors[i]}`,
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: colors[i] }}>
              {s.title}
            </h2>

            {s.events.slice(0, 3).map((e, j) => (
              <div key={j} style={{ marginBottom: '10px', fontSize: '13px', lineHeight: '1.6' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', marginRight: '8px', fontSize: '11px' }}>
                  {e.year}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.8)' }}>{e.description}</span>
              </div>
            ))}

            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', marginTop: '16px', lineHeight: '1.6' }}>
              「{s.summary}」
            </p>
          </div>
        ))}
      </div>

      {/* Footer watermark */}
      <p style={{ fontSize: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', marginTop: '32px' }}>
        平行人生模拟器 · parallel-life.vercel.app
      </p>
    </div>
  );
}
