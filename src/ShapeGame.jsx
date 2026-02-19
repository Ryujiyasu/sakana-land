import { useState } from 'react';
import { sounds } from './sounds.js';
import { cardStyle, baseBtn } from './styles.js';
import { TopBar, useCelebration, CelebrationOverlay } from './components.jsx';

// 海の生き物の形を使った図形パターンマッチングゲーム
// SVGで図形を描画

const SHAPES = [
  { name: 'まる', draw: (c, s) => <circle cx={s/2} cy={s/2} r={s*0.4} fill={c} />, },
  { name: 'さんかく', draw: (c, s) => <polygon points={`${s/2},${s*0.1} ${s*0.1},${s*0.9} ${s*0.9},${s*0.9}`} fill={c} />, },
  { name: 'しかく', draw: (c, s) => <rect x={s*0.1} y={s*0.1} width={s*0.8} height={s*0.8} fill={c} />, },
  { name: 'ほし', draw: (c, s) => {
    const cx = s/2, cy = s/2, or_ = s*0.45, ir = s*0.2;
    const pts = Array.from({length:10},(_, i) => {
      const a = Math.PI/2*-1 + i*Math.PI/5;
      const r = i%2===0 ? or_ : ir;
      return `${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`;
    }).join(' ');
    return <polygon points={pts} fill={c} />;
  }},
  { name: 'ひしがた', draw: (c, s) => <polygon points={`${s/2},${s*0.05} ${s*0.95},${s/2} ${s/2},${s*0.95} ${s*0.05},${s/2}`} fill={c} />, },
];

const PALETTE = ['#EF5350','#42A5F5','#66BB6A','#FFA726','#AB47BC','#FFD54F'];

function ShapeSVG({ shape, color, size = 60 }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {shape.draw(color, size)}
    </svg>
  );
}

// 問題タイプ1: 同じ形を選ぶ
function makeSameShapeRound() {
  const targetIdx = Math.floor(Math.random() * SHAPES.length);
  const target = SHAPES[targetIdx];
  const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  const others = SHAPES.filter((_, i) => i !== targetIdx).sort(() => Math.random() - 0.5).slice(0, 2);
  const opts = [target, ...others].sort(() => Math.random() - 0.5);
  return { type: 'same', target, color, opts, answer: target.name, question: 'おなじ かたちは どれ？' };
}

// 問題タイプ2: 回転しても同じ形を選ぶ（色が変わる）
function makeRotatedRound() {
  const targetIdx = Math.floor(Math.random() * SHAPES.length);
  const target = SHAPES[targetIdx];
  const color1 = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  let color2;
  do { color2 = PALETTE[Math.floor(Math.random() * PALETTE.length)]; } while (color2 === color1);
  const others = SHAPES.filter((_, i) => i !== targetIdx).sort(() => Math.random() - 0.5).slice(0, 2);
  const opts = [{ ...target, altColor: color2 }, ...others.map(o => ({ ...o, altColor: PALETTE[Math.floor(Math.random() * PALETTE.length)] }))].sort(() => Math.random() - 0.5);
  return { type: 'rotated', target, color: color1, opts, answer: target.name, question: 'いろが かわっても おなじ かたちは？' };
}

// 問題タイプ3: パターンの続きを当てる
function makePatternRound() {
  const len = 3;
  const pick2 = [...SHAPES].sort(() => Math.random() - 0.5).slice(0, 2);
  const pattern = Array.from({ length: len * 2 + 1 }, (_, i) => pick2[i % 2]);
  const answer = pattern[pattern.length - 1];
  const seq = pattern.slice(0, -1);
  const others = SHAPES.filter(s => s.name !== answer.name).sort(() => Math.random() - 0.5).slice(0, 2);
  const opts = [answer, ...others].sort(() => Math.random() - 0.5);
  const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  return { type: 'pattern', seq, color, opts, answer: answer.name, question: 'つぎに くるのは どれ？' };
}

const ROUND_MAKERS = [makeSameShapeRound, makeRotatedRound, makePatternRound];

export default function ShapeGame({ onBack }) {
  const makeRound = () => ROUND_MAKERS[Math.floor(Math.random() * ROUND_MAKERS.length)]();

  const [round, setRound] = useState(makeRound);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const celebration = useCelebration(score);

  const pick = (name) => {
    if (selected !== null) return;
    setSelected(name);
    const ok = name === round.answer;
    setCorrect(ok);
    ok ? sounds.correct() : sounds.wrong();
    if (ok) setScore(s => s + 1);
    setTimeout(() => { setRound(makeRound()); setSelected(null); setCorrect(null); }, 1500);
  };

  return (
    <div style={{ width: '100%', maxWidth: 420, padding: '0 16px', textAlign: 'center' }}>
      <CelebrationOverlay celebration={celebration} />
      <TopBar label={`⭐ ${score} てん`} onBack={onBack} />
      <div style={{ ...cardStyle, padding: 28 }}>
        <p style={{ color: '#E1F5FE', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          🔷 {round.question}
        </p>

        {/* 問題表示 */}
        {round.type === 'pattern' ? (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
            {round.seq.map((s, i) => (
              <div key={i} style={{ animation: 'pop 0.3s ease', animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}>
                <ShapeSVG shape={s} color={round.color} size={50} />
              </div>
            ))}
            <div style={{ width: 50, height: 50, borderRadius: 12, border: '3px dashed rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: 'rgba(255,255,255,0.5)' }}>？</div>
          </div>
        ) : (
          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 16, display: 'inline-block' }}>
              <ShapeSVG shape={round.target} color={round.color} size={90} />
            </div>
          </div>
        )}

        {/* 選択肢 */}
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
          {round.opts.map((o, idx) => {
            const optColor = round.type === 'rotated' ? (o.altColor || PALETTE[idx]) : round.color;
            const isAnswer = o.name === round.answer;
            const isSelected = o.name === selected;
            return (
              <button key={o.name + idx} onClick={() => pick(o.name)} style={{
                ...baseBtn,
                width: 90, height: 90, borderRadius: 20, padding: 8,
                background: selected === null ? 'rgba(255,255,255,0.15)'
                  : isAnswer ? 'rgba(102,187,106,0.4)'
                  : isSelected ? 'rgba(239,83,80,0.4)'
                  : 'rgba(255,255,255,0.05)',
                border: `3px solid ${selected === null ? 'rgba(255,255,255,0.3)' : isAnswer ? '#66BB6A' : isSelected ? '#EF5350' : 'rgba(255,255,255,0.1)'}`,
                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.3s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ShapeSVG shape={o} color={optColor} size={60} />
              </button>
            );
          })}
        </div>

        {correct !== null && (
          <div style={{ marginTop: 18, fontSize: 22, fontWeight: 900, color: correct ? '#A5D6A7' : '#EF9A9A', animation: 'pop 0.4s ease' }}>
            {correct ? '🎉 せいかい！' : '😊 ざんねん！'}
          </div>
        )}
      </div>
    </div>
  );
}
