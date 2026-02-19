import { useState } from 'react';
import { AIUEO } from './data.js';
import { TopBar, SeaCreatureImg } from './components.jsx';
import { sounds } from './sounds.js';
import { cardStyle } from './styles.js';

export default function AiueoChart({ onBack }) {
  const [selected, setSelected] = useState(null);

  const handleTap = (cell) => {
    if (!cell) return;
    sounds.tap();
    setSelected(cell);
  };

  const closeModal = () => setSelected(null);

  // 行ラベルの色
  const rowColors = [
    '#EF5350', '#FF7043', '#FFA726', '#FFD54F', '#66BB6A',
    '#26A69A', '#42A5F5', '#5C6BC0', '#AB47BC', '#EC407A', '#78909C',
  ];

  return (
    <div style={{ width: '100%', maxWidth: 500, padding: '8px 8px 24px', overflowY: 'auto', maxHeight: '100vh' }}>
      <TopBar label="あいうえおひょう" onBack={onBack} />

      {/* 列ヘッダー（あ段〜お段） */}
      <div style={{ display: 'grid', gridTemplateColumns: '36px repeat(5, 1fr)', gap: 4, marginBottom: 4, paddingLeft: 2 }}>
        <div />
        {['あ', 'い', 'う', 'え', 'お'].map(v => (
          <div key={v} style={{
            textAlign: 'center', color: '#E1F5FE', fontWeight: 900, fontSize: 13, opacity: 0.7,
          }}>{v}だん</div>
        ))}
      </div>

      {/* 各行 */}
      {AIUEO.map((group, gi) => (
        <div key={group.row} style={{
          display: 'grid', gridTemplateColumns: '36px repeat(5, 1fr)', gap: 4, marginBottom: 4,
        }}>
          {/* 行ラベル */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: rowColors[gi % rowColors.length], fontWeight: 900, fontSize: 15,
            writingMode: 'vertical-rl',
          }}>
            {group.row === 'ん' ? '' : group.row + 'ぎょう'}
          </div>

          {/* セル */}
          {group.cells.map((cell, ci) => {
            if (!cell) return <div key={ci} />;

            return (
              <button key={cell.kana} onClick={() => handleTap(cell)} style={{
                ...cardStyle,
                background: 'rgba(255,255,255,0.13)',
                border: '2px solid rgba(255,255,255,0.25)',
                borderRadius: 14,
                padding: '6px 2px',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                color: '#fff', fontFamily: "'Noto Sans JP', sans-serif",
                minHeight: 90,
                transition: 'transform 0.15s',
              }}>
                {/* ひらがな */}
                <div style={{
                  fontSize: 22, fontWeight: 900,
                  color: rowColors[gi % rowColors.length],
                  textShadow: '1px 1px 0 rgba(0,0,0,0.3)',
                  lineHeight: 1,
                }}>{cell.kana}</div>

                {/* イラスト */}
                <SeaCreatureImg item={cell} size={40} />

                {/* 名前（先頭文字をハイライト） */}
                <div style={{ fontSize: 9, fontWeight: 700, lineHeight: 1.2, textAlign: 'center' }}>
                  {cell.special ? (
                    <span dangerouslySetInnerHTML={{
                      __html: cell.special.replace(/「(.+?)」/g, '<span style="color:#FFD54F;font-size:13px">$1</span>'),
                    }} />
                  ) : (
                    <>
                      <span style={{ color: '#FFD54F', fontSize: 12 }}>{cell.name.charAt(0)}</span>
                      <span style={{ opacity: 0.85 }}>{cell.name.slice(1)}</span>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ))}

      {/* タップしたときのモーダル */}
      {selected && (
        <div onClick={closeModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100,
          animation: 'pop 0.3s ease',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            ...cardStyle,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.08))',
            padding: '28px 24px', textAlign: 'center', maxWidth: 320, width: '85%',
          }}>
            <div style={{
              fontSize: 64, fontWeight: 900, color: '#FFD54F',
              textShadow: '3px 3px 0 rgba(0,0,0,0.3)',
            }}>{selected.kana}</div>

            <div style={{ margin: '12px 0' }}>
              <SeaCreatureImg item={selected} size={120} />
            </div>

            <div style={{ color: '#fff', fontSize: 22, fontWeight: 900 }}>
              {selected.special ? (
                <span dangerouslySetInnerHTML={{
                  __html: selected.special.replace(/「(.+?)」/g, '<span style="color:#FFD54F;font-size:32px">$1</span>'),
                }} />
              ) : (
                <>
                  <span style={{ color: '#FFD54F', fontSize: 32 }}>{selected.name.charAt(0)}</span>
                  {selected.name.slice(1)}
                </>
              )}
            </div>

            <button onClick={closeModal} style={{
              marginTop: 20, border: 'none', borderRadius: 50, cursor: 'pointer',
              background: 'linear-gradient(135deg,#42A5F5,#0277BD)',
              color: '#fff', fontWeight: 900, fontSize: 16, padding: '10px 32px',
              fontFamily: "'Noto Sans JP', sans-serif",
              boxShadow: '0 4px 0 #01579B',
            }}>とじる</button>
          </div>
        </div>
      )}
    </div>
  );
}
