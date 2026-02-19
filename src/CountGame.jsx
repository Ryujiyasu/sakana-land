import { useState } from 'react';
import { FISH } from './data.js';
import { sounds } from './sounds.js';
import { cardStyle, baseBtn } from './styles.js';
import { TopBar, SeaCreatureImg, useCelebration, CelebrationOverlay } from './components.jsx';

export default function CountGame({ onBack, difficulty = 1 }) {
  const makeRound = () => {
    const maxCount = difficulty >= 3 ? 8 : difficulty >= 2 ? 5 : 3;
    const numOpts = difficulty >= 3 ? 4 : 3;
    const count = 1 + Math.floor(Math.random() * maxCount);
    const fish = FISH[Math.floor(Math.random() * FISH.length)];
    const items = Array.from({ length: count }, () => fish);
    const pool = [count];
    while (pool.length < numOpts) {
      const r = 1 + Math.floor(Math.random() * maxCount);
      if (!pool.includes(r)) pool.push(r);
    }
    return { items, answer: count, opts: pool.sort(() => Math.random() - 0.5) };
  };

  const [round, setRound] = useState(makeRound);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const celebration = useCelebration(score);

  const pick = (o) => {
    if (selected !== null) return;
    setSelected(o);
    const ok = o === round.answer;
    setCorrect(ok);
    ok ? sounds.correct() : sounds.wrong();
    if (ok) setScore(s => s + 1);
    setTimeout(() => { setRound(makeRound()); setSelected(null); setCorrect(null); }, 1500);
  };

  return (
    <div style={{ width: '100%', maxWidth: 420, padding: '0 16px', textAlign: 'center' }}>
      <CelebrationOverlay celebration={celebration} />
      <TopBar label={`⭐ ${score} てん`} onBack={onBack} />
      <div style={{ ...cardStyle, padding: 28, marginBottom: 16 }}>
        <p style={{ color: '#E1F5FE', fontSize: 20, fontWeight: 700, marginBottom: 16 }}>なんびき いるかな？</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 24, minHeight: 80 }}>
          {round.items.map((f, i) => (
            <div key={i} style={{ animation: 'swim 2s ease-in-out infinite', animationDelay: `${i * 0.3}s` }}>
              <SeaCreatureImg item={f} size={80} style={{ borderRadius: 14 }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          {round.opts.map(o => (
            <button key={o} onClick={() => pick(o)} style={{
              ...baseBtn, width: 76, height: 76, borderRadius: '50%', fontSize: 32,
              background: selected === null ? 'rgba(255,255,255,0.25)'
                : o === round.answer ? 'linear-gradient(135deg,#66BB6A,#2E7D32)'
                : o === selected ? 'linear-gradient(135deg,#EF5350,#B71C1C)'
                : 'rgba(255,255,255,0.1)',
              border: '3px solid rgba(255,255,255,0.4)',
              transform: selected === o ? 'scale(1.2)' : 'scale(1)',
              transition: 'all 0.3s', boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
            }}>{o}</button>
          ))}
        </div>
        {correct !== null && (
          <div style={{ marginTop: 18, fontSize: 24, fontWeight: 900, color: correct ? '#A5D6A7' : '#EF9A9A', animation: 'pop 0.4s ease' }}>
            {correct ? '🎉 せいかい！' : `😊 ${round.answer} だよ！`}
          </div>
        )}
      </div>
    </div>
  );
}
