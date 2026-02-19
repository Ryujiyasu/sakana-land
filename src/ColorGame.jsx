import { useState } from 'react';
import { FISH, COLORS } from './data.js';
import { sounds } from './sounds.js';
import { cardStyle, baseBtn } from './styles.js';
import { TopBar, SeaCreatureImg, useCelebration, CelebrationOverlay } from './components.jsx';

export default function ColorGame({ onBack }) {
  const makeRound = () => {
    const correct = COLORS[Math.floor(Math.random() * COLORS.length)];
    const fish = FISH[Math.floor(Math.random() * FISH.length)];
    const others = COLORS.filter(c => c.label !== correct.label).sort(() => Math.random() - 0.5).slice(0, 2);
    return { correct, fish, opts: [correct, ...others].sort(() => Math.random() - 0.5) };
  };

  const [round, setRound] = useState(makeRound);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const celebration = useCelebration(score);

  const pick = (label) => {
    if (selected !== null) return;
    setSelected(label);
    const ok = label === round.correct.label;
    setCorrect(ok);
    ok ? sounds.correct() : sounds.wrong();
    if (ok) setScore(s => s + 1);
    setTimeout(() => { setRound(makeRound()); setSelected(null); setCorrect(null); }, 1500);
  };

  return (
    <div style={{ width: '100%', maxWidth: 400, padding: '0 16px', textAlign: 'center' }}>
      <CelebrationOverlay celebration={celebration} />
      <TopBar label={`⭐ ${score} てん`} onBack={onBack} />
      <div style={{ ...cardStyle, padding: 28 }}>
        <p style={{ color: '#E1F5FE', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>この さかなは なにいろ？</p>
        <div style={{
          marginBottom: 20,
          filter: `drop-shadow(0 4px 12px ${round.correct.bg}88)`,
          animation: 'swim 2s ease-in-out infinite',
          display: 'flex', justifyContent: 'center',
        }}>
          <div style={{
            borderRadius: 20, overflow: 'hidden',
            border: `4px solid ${round.correct.bg}`,
            boxShadow: `0 0 20px ${round.correct.bg}66`,
          }}>
            <SeaCreatureImg item={round.fish} size={150} style={{ borderRadius: 20 }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          {round.opts.map(o => (
            <button key={o.label} onClick={() => pick(o.label)} style={{
              ...baseBtn, padding: '14px 18px', fontSize: 18, borderRadius: 20,
              background: selected === null ? o.bg
                : o.label === round.correct.label ? 'linear-gradient(135deg,#66BB6A,#2E7D32)'
                : o.label === selected ? 'linear-gradient(135deg,#EF5350,#B71C1C)'
                : o.bg + '88',
              border: '3px solid rgba(255,255,255,0.4)',
              transform: selected === o.label ? 'scale(1.15)' : 'scale(1)',
              transition: 'all 0.3s', boxShadow: '0 5px 0 rgba(0,0,0,0.2)',
              opacity: selected && o.label !== round.correct.label && o.label !== selected ? 0.5 : 1,
            }}>
              {o.emoji}<br />{o.label}
            </button>
          ))}
        </div>
        {correct !== null && (
          <div style={{ marginTop: 18, fontSize: 22, fontWeight: 900, color: correct ? '#A5D6A7' : '#EF9A9A', animation: 'pop 0.4s ease' }}>
            {correct ? '🎉 せいかい！' : `😊 ${round.correct.label} だよ！`}
          </div>
        )}
      </div>
    </div>
  );
}
