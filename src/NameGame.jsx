import { useState } from 'react';
import { FISH_LEARN } from './data.js';
import { sounds } from './sounds.js';
import { cardStyle, baseBtn } from './styles.js';
import { TopBar, ResultScreen, SeaCreatureImg } from './components.jsx';

export default function NameGame({ onBack }) {
  const [mode, setMode] = useState('learn');
  const [learnIdx, setLearnIdx] = useState(0);
  const [showName, setShowName] = useState(false);
  const [quizRound, setQuizRound] = useState(null);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCount, setQuizCount] = useState(0);

  const makeQuizRound = () => {
    const answer = FISH_LEARN[Math.floor(Math.random() * FISH_LEARN.length)];
    const others = FISH_LEARN.filter(f => f.name !== answer.name).sort(() => Math.random() - 0.5).slice(0, 2);
    return { answer, opts: [answer, ...others].sort(() => Math.random() - 0.5) };
  };

  const startQuiz = () => {
    sounds.tap();
    setMode('quiz');
    setQuizRound(makeQuizRound());
    setScore(0); setQuizCount(0); setSelected(null); setCorrect(null);
  };

  const pickAnswer = (name) => {
    if (selected !== null) return;
    setSelected(name);
    const ok = name === quizRound.answer.name;
    setCorrect(ok);
    ok ? sounds.correct() : sounds.wrong();
    if (ok) setScore(s => s + 1);
    const nextCount = quizCount + 1;
    setQuizCount(nextCount);
    setTimeout(() => {
      if (nextCount >= 8) { sounds.clear(); setMode('result'); }
      else { setQuizRound(makeQuizRound()); setSelected(null); setCorrect(null); }
    }, 1400);
  };

  if (mode === 'learn') {
    const fish = FISH_LEARN[learnIdx];
    return (
      <div style={{ width: '100%', maxWidth: 420, padding: '0 16px', textAlign: 'center' }}>
        <TopBar label={`${learnIdx + 1} / ${FISH_LEARN.length}`} onBack={onBack} />
        <p style={{ color: '#E1F5FE', fontSize: 17, fontWeight: 700, marginBottom: 14 }}>さかなのなまえを おぼえよう！👀</p>
        <div style={{ ...cardStyle, padding: 28, marginBottom: 16, cursor: 'pointer' }}
          onClick={() => { sounds.flip(); setShowName(true); }}>
          <div style={{ animation: 'swim 2s ease-in-out infinite', marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
            <SeaCreatureImg item={fish} size={180} style={{ borderRadius: 24 }} />
          </div>
          {showName ? (
            <>
              <div style={{ fontSize: 42, fontWeight: 900, color: '#fff', letterSpacing: 4, textShadow: '2px 2px 0 #006064', animation: 'pop 0.4s ease' }}>{fish.name}</div>
              <div style={{ fontSize: 16, color: '#B2EBF2', marginTop: 6 }}>{fish.furigana}</div>
              <div style={{ marginTop: 14, fontSize: 15, color: '#E0F7FA', background: 'rgba(255,255,255,0.12)', borderRadius: 14, padding: '10px 16px' }}>💡 {fish.fun}</div>
            </>
          ) : (
            <div style={{ fontSize: 20, color: '#B2EBF2', fontWeight: 700, animation: 'bounce 1.5s ease-in-out infinite' }}>タップして なまえをみよう！</div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 16 }}>
          <button onClick={() => { sounds.tap(); setLearnIdx(i => Math.max(0, i - 1)); setShowName(false); }} disabled={learnIdx === 0}
            style={{ ...baseBtn, background: learnIdx === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.25)', padding: '12px 24px', fontSize: 20, borderRadius: 20, border: '2px solid rgba(255,255,255,0.3)', opacity: learnIdx === 0 ? 0.4 : 1 }}>◀ まえ</button>
          <button onClick={() => { sounds.tap(); if (learnIdx < FISH_LEARN.length - 1) { setLearnIdx(i => i + 1); setShowName(false); } }} disabled={learnIdx === FISH_LEARN.length - 1}
            style={{ ...baseBtn, background: learnIdx === FISH_LEARN.length - 1 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.25)', padding: '12px 24px', fontSize: 20, borderRadius: 20, border: '2px solid rgba(255,255,255,0.3)', opacity: learnIdx === FISH_LEARN.length - 1 ? 0.4 : 1 }}>つぎ ▶</button>
        </div>
        <button onClick={startQuiz} style={{ ...baseBtn, background: 'linear-gradient(135deg,#FFD54F,#FF8F00)', padding: '14px 36px', fontSize: 20, borderRadius: 50, boxShadow: '0 6px 0 #E65100', animation: 'bounce 2s ease-in-out infinite' }}>
          クイズに チャレンジ！🎯
        </button>
      </div>
    );
  }

  if (mode === 'result') return (
    <ResultScreen title={`8もん中 ${score}もん せいかい！🎉`} items={[]} onBack={onBack}
      onRetry={() => { setMode('learn'); setLearnIdx(0); setShowName(false); }} />
  );

  return (
    <div style={{ width: '100%', maxWidth: 420, padding: '0 16px', textAlign: 'center' }}>
      <TopBar label={`⭐ ${score}てん  ${quizCount + 1}/8もん`} onBack={onBack} />
      <div style={{ ...cardStyle, padding: 28 }}>
        <p style={{ color: '#E1F5FE', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>このさかなの なまえは？</p>
        <div style={{ animation: 'swim 2s ease-in-out infinite', marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
          <SeaCreatureImg item={quizRound?.answer} size={150} style={{ borderRadius: 22 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {quizRound?.opts.map(o => (
            <button key={o.name} onClick={() => pickAnswer(o.name)} style={{
              ...baseBtn, padding: '14px 20px', fontSize: 20, borderRadius: 20,
              background: selected === null ? 'rgba(255,255,255,0.2)'
                : o.name === quizRound.answer.name ? 'linear-gradient(135deg,#66BB6A,#2E7D32)'
                : o.name === selected ? 'linear-gradient(135deg,#EF5350,#B71C1C)'
                : 'rgba(255,255,255,0.08)',
              border: '2px solid rgba(255,255,255,0.35)',
              transform: selected === o.name ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s', letterSpacing: 3,
              opacity: selected && o.name !== quizRound.answer.name && o.name !== selected ? 0.45 : 1,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <SeaCreatureImg item={o} size={50} style={{ borderRadius: 10, flexShrink: 0 }} />
              <span>{o.name}</span>
            </button>
          ))}
        </div>
        {correct !== null && (
          <div style={{ marginTop: 16, fontSize: 22, fontWeight: 900, color: correct ? '#A5D6A7' : '#EF9A9A', animation: 'pop 0.4s ease' }}>
            {correct ? '🎉 せいかい！' : `😊 「${quizRound.answer.name}」だよ！`}
          </div>
        )}
      </div>
    </div>
  );
}
