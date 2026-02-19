import { useState } from 'react';
import { sounds } from './sounds.js';
import { cardStyle, baseBtn } from './styles.js';
import { TopBar, useCelebration, CelebrationOverlay } from './components.jsx';

// きせつゲーム - 季節・常識の知識
// 海の生き物＋季節の行事・食べ物を組み合わせ

const SEASON_ITEMS = [
  // 春
  { emoji: '🌸', name: 'さくら', season: 'はる', hint: 'はるに さくよ！' },
  { emoji: '🎎', name: 'ひなまつり', season: 'はる', hint: '３がつの おまつりだよ！' },
  { emoji: '🐝', name: 'みつばち', season: 'はる', hint: 'はるに おはなの みつを あつめるよ！' },
  { emoji: '🎏', name: 'こいのぼり', season: 'はる', hint: '５がつに およぐよ！' },
  // 夏
  { emoji: '🍉', name: 'すいか', season: 'なつ', hint: 'なつに たべると おいしいよ！' },
  { emoji: '🎆', name: 'はなび', season: 'なつ', hint: 'なつの よるに きれいだよ！' },
  { emoji: '🏊', name: 'すいえい', season: 'なつ', hint: 'なつに プールで およぐよ！' },
  { emoji: '🐚', name: 'うみのかい', season: 'なつ', hint: 'なつの うみで ひろえるよ！' },
  // 秋
  { emoji: '🍁', name: 'もみじ', season: 'あき', hint: 'あきに あかくなるよ！' },
  { emoji: '🌰', name: 'くり', season: 'あき', hint: 'あきの みだよ！' },
  { emoji: '🎑', name: 'おつきみ', season: 'あき', hint: 'あきの まんげつを みるよ！' },
  { emoji: '🍠', name: 'さつまいも', season: 'あき', hint: 'あきに やきいもに するよ！' },
  // 冬
  { emoji: '⛄', name: 'ゆきだるま', season: 'ふゆ', hint: 'ふゆに ゆきで つくるよ！' },
  { emoji: '🎄', name: 'クリスマス', season: 'ふゆ', hint: '12がつの イベントだよ！' },
  { emoji: '🎍', name: 'おしょうがつ', season: 'ふゆ', hint: '１がつの おまつりだよ！' },
  { emoji: '🍊', name: 'みかん', season: 'ふゆ', hint: 'ふゆに こたつで たべるよ！' },
];

const SEASONS = [
  { label: 'はる', emoji: '🌸', color: '#F48FB1' },
  { label: 'なつ', emoji: '☀️', color: '#FFB74D' },
  { label: 'あき', emoji: '🍁', color: '#FF8A65' },
  { label: 'ふゆ', emoji: '❄️', color: '#81D4FA' },
];

function makeRound() {
  const item = SEASON_ITEMS[Math.floor(Math.random() * SEASON_ITEMS.length)];
  return {
    item,
    opts: SEASONS,
    answer: item.season,
  };
}

export default function SeasonGame({ onBack }) {
  const [round, setRound] = useState(makeRound);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const celebration = useCelebration(score);

  const pick = (label) => {
    if (selected !== null) return;
    setSelected(label);
    const ok = label === round.answer;
    setCorrect(ok);
    ok ? sounds.correct() : sounds.wrong();
    if (ok) setScore(s => s + 1);
    setTimeout(() => { setRound(makeRound()); setSelected(null); setCorrect(null); setShowHint(false); }, 1800);
  };

  return (
    <div style={{ width: '100%', maxWidth: 420, padding: '0 16px', textAlign: 'center' }}>
      <CelebrationOverlay celebration={celebration} />
      <TopBar label={`⭐ ${score} てん`} onBack={onBack} />
      <div style={{ ...cardStyle, padding: 28 }}>
        <p style={{ color: '#E1F5FE', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          🗓️ どの きせつ かな？
        </p>

        <div style={{
          fontSize: 80, marginBottom: 8, animation: 'float 2s ease-in-out infinite',
        }}>
          {round.item.emoji}
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 6, letterSpacing: 3 }}>
          {round.item.name}
        </div>

        {!showHint && selected === null && (
          <button onClick={() => { sounds.tap(); setShowHint(true); }} style={{
            ...baseBtn, background: 'rgba(255,255,255,0.12)', padding: '6px 16px',
            fontSize: 13, borderRadius: 14, border: '1px solid rgba(255,255,255,0.2)',
            marginBottom: 16,
          }}>💡 ヒントをみる</button>
        )}
        {showHint && selected === null && (
          <div style={{ color: '#B2EBF2', fontSize: 14, marginBottom: 16, animation: 'pop 0.3s ease' }}>
            💡 {round.item.hint}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
          {round.opts.map(s => {
            const isAnswer = s.label === round.answer;
            const isSelected = s.label === selected;
            return (
              <button key={s.label} onClick={() => pick(s.label)} style={{
                ...baseBtn, padding: '18px 12px', borderRadius: 20,
                fontSize: 18,
                background: selected === null ? `${s.color}44`
                  : isAnswer ? 'linear-gradient(135deg,#66BB6A,#2E7D32)'
                  : isSelected ? 'linear-gradient(135deg,#EF5350,#B71C1C)'
                  : `${s.color}22`,
                border: `3px solid ${selected === null ? `${s.color}88` : isAnswer ? '#66BB6A' : isSelected ? '#EF5350' : 'rgba(255,255,255,0.1)'}`,
                transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                transition: 'all 0.3s',
                opacity: selected && !isAnswer && !isSelected ? 0.4 : 1,
              }}>
                <div style={{ fontSize: 32, marginBottom: 4 }}>{s.emoji}</div>
                {s.label}
              </button>
            );
          })}
        </div>

        {correct !== null && (
          <div style={{ marginTop: 18, fontSize: 22, fontWeight: 900, color: correct ? '#A5D6A7' : '#EF9A9A', animation: 'pop 0.4s ease' }}>
            {correct ? '🎉 せいかい！' : `😊 こたえは「${round.answer}」だよ！`}
          </div>
        )}
      </div>
    </div>
  );
}
