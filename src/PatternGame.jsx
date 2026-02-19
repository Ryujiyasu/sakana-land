import { useState } from 'react';
import { FISH } from './data.js';
import { sounds } from './sounds.js';
import { cardStyle, baseBtn } from './styles.js';
import { TopBar, SeaCreatureImg, useCelebration, CelebrationOverlay } from './components.jsx';

// ならびかたゲーム - 法則性・推理
// 海の生き物の並びパターンを見つけて、次にくるものを当てる

function makeABPattern(difficulty) {
  const picks = [...FISH].sort(() => Math.random() - 0.5).slice(0, 3);
  const repeatLen = difficulty >= 2 ? 3 : 2;
  const base = picks.slice(0, repeatLen);
  const seq = [];
  const fullRepeats = difficulty >= 2 ? 2 : 3;
  for (let i = 0; i < fullRepeats; i++) seq.push(...base);
  seq.push(...base.slice(0, base.length - 1));
  const answer = base[base.length - 1];
  const others = FISH.filter(s => s.name !== answer.name).sort(() => Math.random() - 0.5).slice(0, 2);
  return {
    seq,
    answer,
    opts: [answer, ...others].sort(() => Math.random() - 0.5),
    hint: 'くりかえしの パターンだよ！',
  };
}

function makeGrowPattern(difficulty) {
  const item = FISH[Math.floor(Math.random() * FISH.length)];
  const steps = difficulty >= 2 ? 4 : 3;
  const seq = [];
  for (let i = 1; i <= steps; i++) {
    for (let j = 0; j < i; j++) seq.push(item);
    if (i < steps) seq.push({ emoji: '│', name: 'sep', isSep: true });
  }
  seq.push({ emoji: '│', name: 'sep', isSep: true });
  const answerCount = steps + 1;
  const opts = [answerCount];
  while (opts.length < 3) {
    const r = 1 + Math.floor(Math.random() * 6);
    if (!opts.includes(r)) opts.push(r);
  }
  return {
    seq,
    answer: { emoji: String(answerCount), name: String(answerCount) },
    opts: opts.sort(() => Math.random() - 0.5).map(n => ({ emoji: String(n), name: String(n) })),
    hint: 'かずが ふえていくよ！',
    isNumberAnswer: true,
  };
}

function makeOddOneOut(difficulty) {
  const groups = [
    { items: ['/マダイ.jpeg', '/カクレクマノミ.jpeg', '/トラフグ.jpeg'], odd: { name: 'ズワイガニ', img: '/ズワイガニ.jpeg', emoji: '🦀' }, reason: 'さかな じゃないのは？' },
    { items: ['/ズワイガニ.jpeg', '/ケガニ.jpeg', '/イセエビ.jpeg'], odd: { name: 'マダコ', img: '/マダコ.jpeg', emoji: '🐙' }, reason: 'こうらが あるよ！ ないのは？' },
    { items: ['/バンドウイルカ.jpeg', '/マッコウクジラ.jpeg'], odd: { name: 'マダイ', img: '/マダイ.jpeg', emoji: '🐟' }, reason: 'ほにゅうるい じゃないのは？' },
    { items: ['/マダコ.jpeg', '/ダイオウイカ.jpeg'], odd: { name: 'ズワイガニ', img: '/ズワイガニ.jpeg', emoji: '🦀' }, reason: 'あしが やわらかいのは？ かたいのは？' },
  ];
  const group = groups[Math.floor(Math.random() * groups.length)];
  const displayItems = group.items.slice(0, difficulty >= 2 ? group.items.length : 2).map(imgPath => {
    const fish = FISH.find(f => f.img === imgPath);
    return fish || { emoji: '🐟', name: 'さかな', img: imgPath };
  });
  const display = [...displayItems, group.odd].sort(() => Math.random() - 0.5);
  return {
    seq: display,
    answer: group.odd,
    opts: display,
    hint: group.reason,
    isOddOneOut: true,
  };
}

const ROUND_MAKERS = [makeABPattern, makeGrowPattern, makeOddOneOut];

export default function PatternGame({ onBack, difficulty = 1 }) {
  const makeRound = () => ROUND_MAKERS[Math.floor(Math.random() * ROUND_MAKERS.length)](difficulty);

  const [round, setRound] = useState(makeRound);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const celebration = useCelebration(score);

  const pick = (name) => {
    if (selected !== null) return;
    setSelected(name);
    const ok = name === round.answer.name;
    setCorrect(ok);
    ok ? sounds.correct() : sounds.wrong();
    if (ok) setScore(s => s + 1);
    setTimeout(() => { setRound(makeRound()); setSelected(null); setCorrect(null); }, 1500);
  };

  return (
    <div style={{ width: '100%', maxWidth: 440, padding: '0 16px', textAlign: 'center' }}>
      <CelebrationOverlay celebration={celebration} />
      <TopBar label={`⭐ ${score} てん`} onBack={onBack} />
      <div style={{ ...cardStyle, padding: 24 }}>
        <p style={{ color: '#E1F5FE', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
          🧩 {round.isOddOneOut ? round.hint : round.isNumberAnswer ? 'つぎは いくつ？' : 'つぎに くるのは？'}
        </p>
        {round.hint && !round.isOddOneOut && (
          <p style={{ color: '#B2EBF2', fontSize: 13, marginBottom: 14 }}>💡 {round.hint}</p>
        )}

        {/* パターン表示 */}
        <div style={{
          display: 'flex', gap: round.isNumberAnswer ? 4 : 6, justifyContent: 'center', alignItems: 'center',
          marginBottom: 20, flexWrap: 'wrap', minHeight: 70,
          background: 'rgba(0,0,0,0.15)', borderRadius: 16, padding: '14px 12px',
        }}>
          {round.isOddOneOut ? (
            round.seq.map((s, i) => (
              <div key={i} style={{ animation: 'swim 2s ease-in-out infinite', animationDelay: `${i * 0.3}s` }}>
                <SeaCreatureImg item={s} size={72} style={{ borderRadius: 12 }} />
              </div>
            ))
          ) : (
            <>
              {round.seq.map((s, i) => (
                s.isSep ? (
                  <span key={i} style={{ color: 'rgba(255,255,255,0.3)', fontSize: 28, margin: '0 2px' }}>│</span>
                ) : (
                  <div key={i} style={{ animation: 'pop 0.3s ease', animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}>
                    <SeaCreatureImg item={s} size={round.isNumberAnswer ? 44 : 58} style={{ borderRadius: 10 }} />
                  </div>
                )
              ))}
              <div style={{
                width: round.isNumberAnswer ? 40 : 48, height: round.isNumberAnswer ? 40 : 48,
                borderRadius: 12, border: '3px dashed rgba(255,255,255,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, color: 'rgba(255,255,255,0.5)', marginLeft: 4,
              }}>？</div>
            </>
          )}
        </div>

        {/* 選択肢 */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {round.opts.map((o, idx) => {
            const isAnswer = o.name === round.answer.name;
            const isSelected = o.name === selected;
            return (
              <button key={idx} onClick={() => pick(o.name)} style={{
                ...baseBtn,
                minWidth: round.isNumberAnswer ? 70 : 80, height: round.isNumberAnswer ? 70 : 80,
                borderRadius: 20, padding: 8,
                fontSize: round.isNumberAnswer ? 32 : 18,
                background: selected === null ? 'rgba(255,255,255,0.15)'
                  : isAnswer ? 'rgba(102,187,106,0.4)'
                  : isSelected ? 'rgba(239,83,80,0.4)'
                  : 'rgba(255,255,255,0.05)',
                border: `3px solid ${selected === null ? 'rgba(255,255,255,0.3)' : isAnswer ? '#66BB6A' : isSelected ? '#EF5350' : 'rgba(255,255,255,0.1)'}`,
                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.3s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {round.isNumberAnswer
                  ? o.emoji
                  : <SeaCreatureImg item={o} size={round.isNumberAnswer ? 50 : 72} style={{ borderRadius: 12 }} />
                }
              </button>
            );
          })}
        </div>

        {correct !== null && (
          <div style={{ marginTop: 16, fontSize: 22, fontWeight: 900, color: correct ? '#A5D6A7' : '#EF9A9A', animation: 'pop 0.4s ease' }}>
            {correct ? '🎉 せいかい！' : '😊 ざんねん！'}
          </div>
        )}
      </div>
    </div>
  );
}
