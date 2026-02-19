import { useState, useCallback } from 'react';
import { sounds } from './sounds.js';
import { cardStyle, baseBtn } from './styles.js';
import { TopBar, useCelebration, CelebrationOverlay } from './components.jsx';

// しりとりゲーム - 言語力
// 海の生き物でしりとりの次の言葉を当てる

const SHIRITORI_ROUNDS = [
  {
    chain: [
      { emoji: '🐟', word: 'さかな', reading: 'さかな' },
      { emoji: '🥜', word: 'なっとう', reading: 'なっとう' },
    ],
    question: '「う」で はじまるのは？',
    lastChar: 'う',
    opts: [
      { emoji: '🐢', word: 'うみがめ', reading: 'うみがめ' },
      { emoji: '🐙', word: 'たこ', reading: 'たこ' },
      { emoji: '🦀', word: 'かに', reading: 'かに' },
    ],
    answer: 'うみがめ',
  },
  {
    chain: [
      { emoji: '🐬', word: 'いるか', reading: 'いるか' },
      { emoji: '🦀', word: 'かに', reading: 'かに' },
    ],
    question: '「に」で はじまるのは？',
    lastChar: 'に',
    opts: [
      { emoji: '🌈', word: 'にじ', reading: 'にじ' },
      { emoji: '🐟', word: 'さかな', reading: 'さかな' },
      { emoji: '🐳', word: 'くじら', reading: 'くじら' },
    ],
    answer: 'にじ',
  },
  {
    chain: [
      { emoji: '🐙', word: 'たこ', reading: 'たこ' },
      { emoji: '🍚', word: 'こめ', reading: 'こめ' },
    ],
    question: '「め」で はじまるのは？',
    lastChar: 'め',
    opts: [
      { emoji: '🐟', word: 'めだか', reading: 'めだか' },
      { emoji: '🐡', word: 'ふぐ', reading: 'ふぐ' },
      { emoji: '🦑', word: 'いか', reading: 'いか' },
    ],
    answer: 'めだか',
  },
  {
    chain: [
      { emoji: '🐳', word: 'くじら', reading: 'くじら' },
      { emoji: '🦝', word: 'らっこ', reading: 'らっこ' },
    ],
    question: '「こ」で はじまるのは？',
    lastChar: 'こ',
    opts: [
      { emoji: '🐚', word: 'こんぶ', reading: 'こんぶ' },
      { emoji: '🐬', word: 'いるか', reading: 'いるか' },
      { emoji: '🐙', word: 'たこ', reading: 'たこ' },
    ],
    answer: 'こんぶ',
  },
  {
    chain: [
      { emoji: '🦐', word: 'えび', reading: 'えび' },
      { emoji: '🐦', word: 'びわ', reading: 'びわ' },
    ],
    question: '「わ」で はじまるのは？',
    lastChar: 'わ',
    opts: [
      { emoji: '🐊', word: 'わに', reading: 'わに' },
      { emoji: '🐡', word: 'ふぐ', reading: 'ふぐ' },
      { emoji: '🦀', word: 'かに', reading: 'かに' },
    ],
    answer: 'わに',
  },
  {
    chain: [
      { emoji: '🦑', word: 'いか', reading: 'いか' },
      { emoji: '🐸', word: 'かえる', reading: 'かえる' },
    ],
    question: '「る」で はじまるのは？',
    lastChar: 'る',
    opts: [
      { emoji: '🐠', word: 'るりすずめだい', reading: 'るりすずめだい' },
      { emoji: '🐙', word: 'たこ', reading: 'たこ' },
      { emoji: '🐬', word: 'いるか', reading: 'いるか' },
    ],
    answer: 'るりすずめだい',
  },
  {
    chain: [
      { emoji: '🐠', word: 'くまのみ', reading: 'くまのみ' },
      { emoji: '🍊', word: 'みかん', reading: 'みかん' },
    ],
    question: '「ん」がついちゃった！しりとりで「ん」がつくと？',
    lastChar: 'ん',
    opts: [
      { emoji: '❌', word: 'まけ！', reading: 'まけ' },
      { emoji: '⭕', word: 'つづく！', reading: 'つづく' },
      { emoji: '🔄', word: 'やりなおし！', reading: 'やりなおし' },
    ],
    answer: 'まけ！',
    isSpecial: true,
  },
  {
    chain: [
      { emoji: '🐡', word: 'ふぐ', reading: 'ふぐ' },
      { emoji: '🍙', word: 'ぐんかんまき', reading: 'ぐんかんまき' },
    ],
    question: '「き」で はじまるのは？',
    lastChar: 'き',
    opts: [
      { emoji: '🐟', word: 'きんぎょ', reading: 'きんぎょ' },
      { emoji: '🐙', word: 'たこ', reading: 'たこ' },
      { emoji: '🐬', word: 'いるか', reading: 'いるか' },
    ],
    answer: 'きんぎょ',
  },
];

export default function ShiritoriGame({ onBack }) {
  const [usedIdxs, setUsedIdxs] = useState([]);
  const [roundIdx, setRoundIdx] = useState(() => Math.floor(Math.random() * SHIRITORI_ROUNDS.length));
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const celebration = useCelebration(score);

  const round = SHIRITORI_ROUNDS[roundIdx];

  const nextRound = useCallback(() => {
    const newUsed = [...usedIdxs, roundIdx];
    if (newUsed.length >= SHIRITORI_ROUNDS.length) {
      setUsedIdxs([]);
      setRoundIdx(Math.floor(Math.random() * SHIRITORI_ROUNDS.length));
    } else {
      setUsedIdxs(newUsed);
      const remaining = SHIRITORI_ROUNDS.map((_, i) => i).filter(i => !newUsed.includes(i));
      setRoundIdx(remaining[Math.floor(Math.random() * remaining.length)]);
    }
    setSelected(null);
    setCorrect(null);
  }, [usedIdxs, roundIdx]);

  const pick = (word) => {
    if (selected !== null) return;
    setSelected(word);
    const ok = word === round.answer;
    setCorrect(ok);
    ok ? sounds.correct() : sounds.wrong();
    if (ok) setScore(s => s + 1);
    setTotal(t => t + 1);
    setTimeout(nextRound, 1600);
  };

  return (
    <div style={{ width: '100%', maxWidth: 440, padding: '0 16px', textAlign: 'center' }}>
      <CelebrationOverlay celebration={celebration} />
      <TopBar label={`⭐ ${score} てん`} onBack={onBack} />
      <div style={{ ...cardStyle, padding: 24 }}>
        <p style={{ color: '#E1F5FE', fontSize: 18, fontWeight: 700, marginBottom: 14 }}>
          🔤 しりとり！
        </p>

        {/* しりとりチェーン表示 */}
        <div style={{
          display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center',
          marginBottom: 16, flexWrap: 'wrap',
        }}>
          {round.chain.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {i > 0 && <span style={{ color: '#FFD54F', fontSize: 20, fontWeight: 900 }}>→</span>}
              <div style={{
                background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: '8px 14px',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{ fontSize: 32 }}>{item.emoji}</span>
                <span style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{item.word}</span>
              </div>
            </div>
          ))}
          <span style={{ color: '#FFD54F', fontSize: 20, fontWeight: 900 }}>→</span>
          <div style={{
            width: 60, height: 48, borderRadius: 16,
            border: '3px dashed rgba(255,255,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, color: 'rgba(255,255,255,0.5)',
          }}>？</div>
        </div>

        <p style={{ color: '#FFD54F', fontSize: 17, fontWeight: 900, marginBottom: 16 }}>
          {round.question}
        </p>

        {/* ラストの文字をハイライト */}
        {!round.isSpecial && (
          <div style={{
            display: 'inline-block', background: 'rgba(255,213,79,0.2)', borderRadius: 50,
            padding: '4px 18px', marginBottom: 16, border: '2px solid rgba(255,213,79,0.4)',
          }}>
            <span style={{ color: '#FFD54F', fontSize: 28, fontWeight: 900 }}>「{round.lastChar}」</span>
          </div>
        )}

        {/* 選択肢 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {round.opts.map((o, idx) => {
            const isAnswer = o.word === round.answer;
            const isSelected = o.word === selected;
            return (
              <button key={idx} onClick={() => pick(o.word)} style={{
                ...baseBtn, padding: '14px 18px', fontSize: 18, borderRadius: 20,
                textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
                background: selected === null ? 'rgba(255,255,255,0.15)'
                  : isAnswer ? 'linear-gradient(135deg,#66BB6A,#2E7D32)'
                  : isSelected ? 'linear-gradient(135deg,#EF5350,#B71C1C)'
                  : 'rgba(255,255,255,0.05)',
                border: `2px solid ${selected === null ? 'rgba(255,255,255,0.3)' : isAnswer ? '#66BB6A' : isSelected ? '#EF5350' : 'rgba(255,255,255,0.1)'}`,
                transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                transition: 'all 0.3s',
                opacity: selected && !isAnswer && !isSelected ? 0.4 : 1,
              }}>
                <span style={{ fontSize: 28 }}>{o.emoji}</span>
                <span>{o.word}</span>
              </button>
            );
          })}
        </div>

        {correct !== null && (
          <div style={{ marginTop: 16, fontSize: 22, fontWeight: 900, color: correct ? '#A5D6A7' : '#EF9A9A', animation: 'pop 0.4s ease' }}>
            {correct ? '🎉 せいかい！' : `😊 こたえは「${round.answer}」だよ！`}
          </div>
        )}
      </div>
    </div>
  );
}
