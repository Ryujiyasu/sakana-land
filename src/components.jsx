import { useState, useEffect } from 'react';
import { baseBtn } from './styles.js';
import { sounds } from './sounds.js';

export function TopBar({ label, onBack }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 4px', marginBottom: 10 }}>
      <button onClick={() => { sounds.tap(); onBack(); }} style={{
        ...baseBtn, background: 'rgba(255,255,255,0.2)', padding: '8px 16px', fontSize: 16, borderRadius: 20,
        border: '2px solid rgba(255,255,255,0.3)',
      }}>← もどる</button>
      <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>{label}</span>
    </div>
  );
}

// 海の生き物の画像表示コンポーネント（写真があれば写真、なければemoji）
export function SeaCreatureImg({ item, size = 60, style: extraStyle = {} }) {
  if (item.img) {
    return (
      <img
        src={item.img}
        alt={item.name}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          borderRadius: size * 0.2,
          ...extraStyle,
        }}
      />
    );
  }
  return <span style={{ fontSize: size * 0.7, ...extraStyle }}>{item.emoji}</span>;
}

// 10点ごとのお祝い演出
const MILESTONES = [
  { at: 10, emoji: '🌟', msg: 'すごいね！10てん！' },
  { at: 20, emoji: '🏅', msg: 'すばらしい！20てん！' },
  { at: 30, emoji: '👑', msg: 'てんさい！30てん！' },
  { at: 40, emoji: '🎖️', msg: 'かんぺき！40てん！' },
  { at: 50, emoji: '🏆', msg: 'チャンピオン！50てん！' },
];

export function useCelebration(score) {
  const [celebration, setCelebration] = useState(null);

  useEffect(() => {
    if (score === 0) return;
    const m = MILESTONES.find(m => m.at === score);
    if (m) {
      sounds.clear();
      setCelebration(m);
      const timer = setTimeout(() => setCelebration(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [score]);

  return celebration;
}

export function CelebrationOverlay({ celebration }) {
  if (!celebration) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.5)', zIndex: 200, pointerEvents: 'none',
      animation: 'pop 0.5s ease',
    }}>
      <div style={{ fontSize: 120, animation: 'float 1s ease-in-out infinite' }}>{celebration.emoji}</div>
      <div style={{
        fontSize: 36, fontWeight: 900, color: '#FFD54F',
        textShadow: '3px 3px 0 #E65100, -1px -1px 0 #E65100',
        marginTop: 12, animation: 'bounce 1s ease-in-out infinite',
      }}>{celebration.msg}</div>
      <div style={{
        display: 'flex', gap: 8, marginTop: 16,
        animation: 'pop 0.6s ease 0.3s both',
      }}>
        {['🐟','🐬','🐙','🦀','🐳'].map((e, i) => (
          <span key={i} style={{
            fontSize: 36,
            animation: `swim 1.5s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`,
          }}>{e}</span>
        ))}
      </div>
    </div>
  );
}

export function ResultScreen({ title, items, onBack, onRetry }) {
  return (
    <div style={{ textAlign: 'center', padding: 24, maxWidth: 420, width: '100%' }}>
      <div style={{ fontSize: 80, animation: 'float 2s ease-in-out infinite' }}>🏆</div>
      <h2 style={{ color: '#fff', fontSize: 'clamp(22px,6vw,34px)', fontWeight: 900, textShadow: '3px 3px 0 #01579B', margin: '12px 0' }}>{title}</h2>
      {items.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
          {items.map((f, i) => <SeaCreatureImg key={i} item={f} size={64} style={{ borderRadius: 12 }} />)}
        </div>
      )}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
        <button onClick={() => { sounds.tap(); onRetry(); }} style={{
          ...baseBtn, background: 'linear-gradient(135deg,#42A5F5,#0277BD)',
          padding: '14px 28px', fontSize: 20, borderRadius: 50, boxShadow: '0 6px 0 #01579B',
        }}>もう一度！</button>
        <button onClick={() => { sounds.tap(); onBack(); }} style={{
          ...baseBtn, background: 'linear-gradient(135deg,#FFD54F,#FF8F00)',
          padding: '14px 28px', fontSize: 20, borderRadius: 50, boxShadow: '0 6px 0 #E65100',
        }}>メニューへ</button>
      </div>
    </div>
  );
}
