import { useState } from 'react';
import { FISH } from './data.js';
import { sounds } from './sounds.js';
import { TopBar, ResultScreen, SeaCreatureImg } from './components.jsx';

export default function MemoryGame({ onBack, difficulty = 1 }) {
  const pairCount = difficulty >= 3 ? 6 : difficulty >= 2 ? 4 : 3;
  const makeBoard = () => {
    const picks = [...FISH].sort(() => Math.random() - 0.5).slice(0, pairCount);
    return [...picks, ...picks]
      .sort(() => Math.random() - 0.5)
      .map((f, i) => ({ ...f, id: i, open: false, matched: false }));
  };

  const [cards, setCards] = useState(makeBoard);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);
  const [locked, setLocked] = useState(false);

  const flip = (id) => {
    if (locked) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.open || card.matched) return;
    sounds.flip();
    const newFlipped = [...flipped, id];
    setCards(prev => prev.map(c => c.id === id ? { ...c, open: true } : c));
    if (newFlipped.length === 2) {
      setLocked(true);
      setMoves(m => m + 1);
      const [a, b] = newFlipped.map(fid => cards.find(c => c.id === fid));
      if (a.name === b.name) {
        sounds.match();
        setTimeout(() => {
          setCards(prev => {
            const next = prev.map(c => newFlipped.includes(c.id) ? { ...c, matched: true, open: true } : c);
            if (next.every(c => c.matched)) { sounds.clear(); setDone(true); }
            return next;
          });
          setFlipped([]); setLocked(false);
        }, 600);
      } else {
        setTimeout(() => {
          sounds.wrong();
          setCards(prev => prev.map(c => newFlipped.includes(c.id) ? { ...c, open: false } : c));
          setFlipped([]); setLocked(false);
        }, 900);
      }
    } else {
      setFlipped(newFlipped);
    }
  };

  if (done) return (
    <ResultScreen
      title={`クリア！ ${moves}かいで できたよ！🎉`}
      items={[]} onBack={onBack}
      onRetry={() => { setCards(makeBoard()); setFlipped([]); setMoves(0); setDone(false); setLocked(false); }}
    />
  );

  return (
    <div style={{ width: '100%', maxWidth: 400, padding: '0 16px', textAlign: 'center' }}>
      <TopBar label={`タップ: ${moves}かい`} onBack={onBack} />
      <p style={{ color: '#E1F5FE', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>おなじさかなを みつけよう！</p>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${pairCount >= 5 ? 4 : pairCount >= 4 ? 4 : 3}, 1fr)`, gap: 10 }}>
        {cards.map(card => (
          <div key={card.id} onClick={() => flip(card.id)} style={{
            aspectRatio: '1', borderRadius: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: card.open || card.matched
              ? card.matched ? 'rgba(102,187,106,0.4)' : 'rgba(255,255,255,0.25)'
              : 'rgba(255,255,255,0.15)',
            border: `2px solid ${card.matched ? '#66BB6A' : 'rgba(255,255,255,0.3)'}`,
            transition: 'all 0.3s ease', backdropFilter: 'blur(8px)',
            boxShadow: card.open ? '0 4px 15px rgba(0,0,0,0.2)' : 'none',
            overflow: 'hidden',
          }}>
            {card.open || card.matched
              ? <SeaCreatureImg item={card} size={76} style={{ borderRadius: 14 }} />
              : <span style={{ fontSize: 36 }}>❓</span>
            }
          </div>
        ))}
      </div>
    </div>
  );
}
