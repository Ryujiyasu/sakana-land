import { useState, useRef, useCallback, useEffect } from 'react';
import { AIUEO } from './data.js';
import { TopBar } from './components.jsx';
import { sounds } from './sounds.js';
import { cardStyle } from './styles.js';

const ALL_KANA = AIUEO.flatMap(group =>
  group.cells.filter(c => c !== null)
);

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

const imgBase = import.meta.env.BASE_URL;

export default function AiueoChart({ onBack }) {
  const [idx, setIdx] = useState(0);
  const [slideDir, setSlideDir] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [landscape, setLandscape] = useState(window.innerWidth > window.innerHeight);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const touchRef = useRef(null);
  const touchYRef = useRef(null);

  useEffect(() => {
    const onResize = () => setLandscape(window.innerWidth > window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

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

  // 左右スワイプ + 上下で引き出し
  const onTouchStart = (e) => {
    touchRef.current = e.touches[0].clientX;
    touchYRef.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e) => {
    if (touchRef.current === null) return;
    const dx = e.changedTouches[0].clientX - touchRef.current;
    const dy = e.changedTouches[0].clientY - touchYRef.current;
    touchRef.current = null;
    touchYRef.current = null;

    // 上下の方が大きい → 引き出し操作
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 50) {
      if (dy < 0) setDrawerOpen(true);   // 上スワイプ → 開く
      else setDrawerOpen(false);          // 下スワイプ → 閉じる
      return;
    }
    // 左右スワイプ
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  const jumpTo = (i) => {
    sounds.tap();
    setSlideDir(i > idx ? 1 : -1);
    setAnimKey(k => k + 1);
    setIdx(i);
    setDrawerOpen(false);
  };

  const renderName = (cell) => {
    const fs = landscape ? 'clamp(18px, 4vh, 28px)' : 'clamp(22px, 6vw, 32px)';
    const hl = landscape ? 'clamp(24px, 6vh, 38px)' : 'clamp(30px, 8vw, 44px)';
    if (cell.special) {
      const parts = cell.special.split(/[「」]/);
      return (
        <span style={{ fontSize: fs, fontWeight: 900, color: '#fff' }}>
          {parts[0]}<span style={{ color: '#FFD54F', fontSize: hl }}>{parts[1]}</span>{parts[2]}
        </span>
      );
    }
    return (
      <span style={{ fontSize: fs, fontWeight: 900, color: '#fff' }}>
        <span style={{ color: '#FFD54F', fontSize: hl }}>{cell.name.charAt(0)}</span>{cell.name.slice(1)}
      </span>
    );
  };

  const slideAnim = slideDir === 0 ? 'pop' : slideDir > 0 ? 'slideInRight' : 'slideInLeft';

  const navBtn = (dir, pos) => {
    const disabled = dir === -1 ? idx <= 0 : idx >= ALL_KANA.length - 1;
    if (disabled) return null;
    return (
      <button onClick={() => go(dir)} style={{
        position: 'absolute', [pos]: 6, top: '50%', transform: 'translateY(-50%)',
        background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
        width: 44, height: 44, fontSize: 22, color: '#fff', cursor: 'pointer',
        fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900, zIndex: 2,
      }}>{dir === -1 ? '◀' : '▶'}</button>
    );
  };

  // 引き出しパネル（かなバー）
  const drawer = (
    <>
      {/* 背景オーバーレイ */}
      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)', zIndex: 50,
        }} />
      )}
      {/* ドロワー本体 — 閉じたときは完全に隠れる */}
      <div style={{
        position: 'fixed', left: 0, right: 0, bottom: 0,
        transform: drawerOpen ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s ease',
        zIndex: 60,
        background: 'linear-gradient(180deg, rgba(13,71,161,0.95), rgba(1,87,155,0.98))',
        backdropFilter: 'blur(12px)',
        borderRadius: '20px 20px 0 0',
        padding: '0 12px 16px',
        maxHeight: '55vh',
      }}>
        {/* つまみ */}
        <div onClick={() => setDrawerOpen(false)} style={{
          textAlign: 'center', padding: '10px 0 8px', cursor: 'pointer',
        }}>
          <div style={{
            width: 40, height: 4, borderRadius: 2,
            background: 'rgba(255,255,255,0.4)', margin: '0 auto 6px',
          }} />
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 700 }}>
            ▼ とじる
          </span>
        </div>

        {/* かなグリッド */}
        <div style={{
          display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center',
          overflowY: 'auto', maxHeight: 'calc(55vh - 50px)', padding: '4px 0',
        }}>
          {ALL_KANA.map((cell, i) => {
            const isActive = i === idx;
            const c = ROW_COLORS[getRowForKana(cell.kana)] || '#42A5F5';
            return (
              <button key={cell.kana} onClick={() => jumpTo(i)}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: isActive ? c : 'rgba(255,255,255,0.12)',
                  border: isActive ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                  fontSize: 14, fontWeight: 900, cursor: 'pointer',
                  fontFamily: "'Noto Sans JP', sans-serif",
                  transition: 'all 0.15s',
                  transform: isActive ? 'scale(1.15)' : 'scale(1)',
                }}>
                {cell.kana}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );

  // === 横向きレイアウト ===
  if (landscape) {
    return (
      <div style={{
        width: '100%', height: '100vh', display: 'flex', overflow: 'hidden',
        padding: '4px 8px',
      }}
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      >
        <style>{`
          @keyframes slideInRight { from { transform: translateX(60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
          @keyframes slideInLeft  { from { transform: translateX(-60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        `}</style>

        <div key={animKey} style={{
          ...cardStyle, flex: 1,
          background: 'linear-gradient(160deg, rgba(255,255,255,0.18), rgba(255,255,255,0.05))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '8px 56px', gap: 16,
          animation: `${slideAnim} 0.3s ease`,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* イラスト */}
          <div style={{
            flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center',
            animation: 'swim 2.5s ease-in-out infinite', zIndex: 1,
            height: '100%', minWidth: 0,
          }}>
            <img
              src={imgBase + current.img.replace(/^\//, '')}
              alt={current.name}
              style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: 16 }}
            />
          </div>

          {/* ひらがな＋なまえ */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', zIndex: 1, gap: 4, flexShrink: 0,
          }}>
            <div style={{
              fontSize: 'clamp(48px, 14vh, 100px)', fontWeight: 900, lineHeight: 1,
              color: rowColor, textShadow: '3px 3px 0 rgba(0,0,0,0.25)',
            }}>{current.kana}</div>
            {renderName(current)}
            {current.fun && (
              <div style={{
                color: '#E1F5FE', fontSize: 'clamp(11px, 2.5vh, 14px)',
                fontWeight: 700, marginTop: 4, lineHeight: 1.4, maxWidth: 200, textAlign: 'center',
              }}>{current.fun}</div>
            )}
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4 }}>
              {idx + 1} / {ALL_KANA.length}
            </div>
          </div>

          {navBtn(-1, 'left')}
          {navBtn(1, 'right')}
        </div>

        {drawer}
      </div>
    );
  }

  // === 縦向きレイアウト ===
  return (
    <div style={{
      width: '100%', maxWidth: 480, padding: '0 8px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      height: '100vh', overflow: 'hidden',
    }}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
    >
      <style>{`
        @keyframes slideInRight { from { transform: translateX(80px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideInLeft  { from { transform: translateX(-80px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>

      <TopBar label="あいうえお" onBack={onBack} />

      <div key={animKey}
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
        style={{
          ...cardStyle, flex: 1, width: '100%',
          background: 'linear-gradient(160deg, rgba(255,255,255,0.18), rgba(255,255,255,0.05))',
          animation: `${slideAnim} 0.3s ease`,
          position: 'relative', overflow: 'hidden',
          touchAction: 'none',
      }}>
        {/* イラスト — 画面全体に表示 */}
        <div style={{
          position: 'absolute', inset: 0,
          animation: 'swim 2.5s ease-in-out infinite',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: 12, pointerEvents: 'none',
        }}>
          <img
            src={imgBase + current.img.replace(/^\//, '')}
            alt={current.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 12 }}
          />
        </div>

        {/* ひらがな＋なまえ＋解説 — 下部にオーバーレイ */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.6) 30%)',
          padding: '32px 16px 12px',
          textAlign: 'center', pointerEvents: 'none',
        }}>
          <div>
            <span style={{
              fontSize: 'clamp(36px, 10vw, 60px)', fontWeight: 900, lineHeight: 1,
              color: rowColor, textShadow: '2px 2px 0 rgba(0,0,0,0.5)',
              marginRight: 8, verticalAlign: 'middle',
            }}>{current.kana}</span>
            {renderName(current)}
          </div>
          {current.fun && (
            <div style={{
              color: '#E1F5FE', fontSize: 'clamp(12px, 3.5vw, 15px)',
              fontWeight: 700, marginTop: 4, lineHeight: 1.3,
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}>{current.fun}</div>
          )}
        </div>

        {navBtn(-1, 'left')}
        {navBtn(1, 'right')}
      </div>

      {drawer}
    </div>
  );
}
