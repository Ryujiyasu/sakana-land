import { useState, useRef, useCallback } from 'react';
import { AIUEO } from './data.js';
import { TopBar, SeaCreatureImg } from './components.jsx';
import { sounds } from './sounds.js';
import { cardStyle } from './styles.js';

// AIUEO データから null を除いたフラットなリスト
const ALL_KANA = AIUEO.flatMap(group =>
  group.cells.filter(c => c !== null)
);

// 行ごとの色
const ROW_COLORS = {
  'あ': '#EF5350', 'か': '#FF7043', 'さ': '#FFA726', 'た': '#FFD54F', 'な': '#66BB6A',
  'は': '#26A69A', 'ま': '#42A5F5', 'や': '#5C6BC0', 'ら': '#AB47BC', 'わ': '#EC407A', 'ん': '#78909C',
};

function getRowForKana(kana) {
  for (const group of AIUEO) {
    if (group.cells.some(c => c && c.kana === kana)) return group.row;
  }
  return 'あ';
}

export default function AiueoChart({ onBack }) {
  const [idx, setIdx] = useState(0);
  const [slideDir, setSlideDir] = useState(0); // -1 left, 1 right, 0 none
  const [animKey, setAnimKey] = useState(0);
  const touchRef = useRef(null);

  const current = ALL_KANA[idx];
  const rowColor = ROW_COLORS[getRowForKana(current.kana)] || '#42A5F5';

  const go = useCallback((dir) => {
    sounds.tap();
    const next = idx + dir;
    if (next < 0 || next >= ALL_KANA.length) return;
    setSlideDir(dir);
    setAnimKey(k => k + 1);
    setIdx(next);
  }, [idx]);

  // タッチスワイプ
  const onTouchStart = (e) => { touchRef.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchRef.current === null) return;
    const diff = e.changedTouches[0].clientX - touchRef.current;
    touchRef.current = null;
    if (Math.abs(diff) > 50) go(diff < 0 ? 1 : -1);
  };

  // 名前の表示（specialの場合はカッコ内をハイライト）
  const renderName = (cell, size = 'large') => {
    const fontSize = size === 'large' ? 28 : 14;
    const hlSize = size === 'large' ? 36 : 18;
    if (cell.special) {
      const parts = cell.special.split(/[「」]/);
      return (
        <span style={{ fontSize, fontWeight: 900, color: '#fff' }}>
          {parts[0]}
          <span style={{ color: '#FFD54F', fontSize: hlSize }}>{parts[1]}</span>
          {parts[2]}
        </span>
      );
    }
    return (
      <span style={{ fontSize, fontWeight: 900, color: '#fff' }}>
        <span style={{ color: '#FFD54F', fontSize: hlSize }}>{cell.name.charAt(0)}</span>
        {cell.name.slice(1)}
      </span>
    );
  };

  // スライドアニメーション名
  const slideAnim = slideDir === 0 ? 'pop' : slideDir > 0 ? 'slideInRight' : 'slideInLeft';

  return (
    <div style={{
      width: '100%', maxWidth: 480, padding: '8px 12px 24px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      height: '100vh', overflow: 'hidden',
    }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <style>{`
        @keyframes slideInRight { from { transform: translateX(80px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideInLeft  { from { transform: translateX(-80px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>

      <TopBar label="あいうえお" onBack={onBack} />

      {/* メインカード */}
      <div key={animKey} style={{
        ...cardStyle,
        flex: 1, width: '100%', maxHeight: 460,
        background: `linear-gradient(160deg, rgba(255,255,255,0.18), rgba(255,255,255,0.05))`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '20px 16px',
        animation: `${slideAnim} 0.3s ease`,
        position: 'relative',
      }}>
        {/* ひらがな */}
        <div style={{
          fontSize: 100, fontWeight: 900, lineHeight: 1,
          color: rowColor,
          textShadow: `3px 3px 0 rgba(0,0,0,0.25)`,
        }}>
          {current.kana}
        </div>

        {/* イラスト */}
        <div style={{
          margin: '12px 0',
          animation: 'swim 2.5s ease-in-out infinite',
        }}>
          <SeaCreatureImg item={current} size={160} />
        </div>

        {/* なまえ */}
        <div style={{ marginTop: 4 }}>
          {renderName(current)}
        </div>

        {/* ◀ ▶ ボタン */}
        {idx > 0 && (
          <button onClick={() => go(-1)} style={{
            position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
            width: 44, height: 44, fontSize: 22, color: '#fff', cursor: 'pointer',
            fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900,
          }}>◀</button>
        )}
        {idx < ALL_KANA.length - 1 && (
          <button onClick={() => go(1)} style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
            width: 44, height: 44, fontSize: 22, color: '#fff', cursor: 'pointer',
            fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900,
          }}>▶</button>
        )}
      </div>

      {/* 下部：かなバー（スクロール） */}
      <div style={{
        width: '100%', marginTop: 10, overflowX: 'auto',
        display: 'flex', gap: 4, padding: '4px 0',
        justifyContent: 'center', flexWrap: 'wrap',
      }}>
        {ALL_KANA.map((cell, i) => {
          const isActive = i === idx;
          const c = ROW_COLORS[getRowForKana(cell.kana)] || '#42A5F5';
          return (
            <button key={cell.kana} onClick={() => { sounds.tap(); setSlideDir(i > idx ? 1 : -1); setAnimKey(k => k + 1); setIdx(i); }}
              style={{
                width: 28, height: 28, borderRadius: 8,
                background: isActive ? c : 'rgba(255,255,255,0.1)',
                border: isActive ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: 11, fontWeight: 900, cursor: 'pointer',
                fontFamily: "'Noto Sans JP', sans-serif",
                transition: 'all 0.2s',
                transform: isActive ? 'scale(1.2)' : 'scale(1)',
              }}>
              {cell.kana}
            </button>
          );
        })}
      </div>

      {/* 進捗 */}
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4 }}>
        {idx + 1} / {ALL_KANA.length}
      </div>
    </div>
  );
}
