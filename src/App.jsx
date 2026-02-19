import { useState } from 'react';
import { sounds } from './sounds.js';
import { baseBtn, globalCSS } from './styles.js';
import { getAgeLabel, getRecommendedDifficulty, getDifficultyLabel } from './difficulty.js';
import FishingGame    from './FishingGame.jsx';
import CountGame      from './CountGame.jsx';
import MemoryGame     from './MemoryGame.jsx';
import ColorGame      from './ColorGame.jsx';
import NameGame       from './NameGame.jsx';
import ShapeGame      from './ShapeGame.jsx';
import StoryGame      from './StoryGame.jsx';
import PatternGame    from './PatternGame.jsx';
import SeasonGame     from './SeasonGame.jsx';
import ShiritoriGame  from './ShiritoriGame.jsx';
import AiueoChart     from './AiueoChart.jsx';

function Menu({ onSelect, difficulty, setDifficulty }) {
  const games = [
    { id: 'fishing',   emoji: '🎣', title: 'つりゲーム',       desc: 'さかなをつろう！',             color: '#0288D1', shadow: '#01579B', skill: 'あそび' },
    { id: 'count',     emoji: '🔢', title: 'かずゲーム',       desc: 'いくつかな？',                 color: '#2E7D32', shadow: '#1B5E20', skill: 'すうりょう' },
    { id: 'shape',     emoji: '🔷', title: 'かたちゲーム',     desc: 'おなじかたちをみつけよう！',   color: '#1565C0', shadow: '#0D47A1', skill: 'ずけい' },
    { id: 'story',     emoji: '📖', title: 'おはなしきおく',   desc: 'おはなしをおぼえよう！',       color: '#6A1B9A', shadow: '#4A148C', skill: 'きおく' },
    { id: 'pattern',   emoji: '🧩', title: 'ならびかたゲーム', desc: 'つぎにくるのはなに？',         color: '#00695C', shadow: '#004D40', skill: 'ほうそく' },
    { id: 'season',    emoji: '🗓️', title: 'きせつゲーム',     desc: 'どのきせつかな？',             color: '#E65100', shadow: '#BF360C', skill: 'じょうしき' },
    { id: 'shiritori', emoji: '🔤', title: 'しりとりゲーム',   desc: 'しりとりであそぼう！',         color: '#AD1457', shadow: '#880E4F', skill: 'ことば' },
    { id: 'memory',    emoji: '🧠', title: 'きおくゲーム',     desc: 'おなじさかなをさがせ！',       color: '#4527A0', shadow: '#311B92', skill: 'きおく' },
    { id: 'color',     emoji: '🎨', title: 'いろゲーム',       desc: 'なにいろかな？',               color: '#F57F17', shadow: '#E65100', skill: 'じょうしき' },
    { id: 'name',      emoji: '🐟', title: 'なまえゲーム',     desc: 'さかなのなまえをおぼえよう！', color: '#00838F', shadow: '#006064', skill: 'ことば' },
    { id: 'aiueo',    emoji: '🔤', title: 'あいうえおひょう', desc: 'うみのいきもので あいうえお！', color: '#00897B', shadow: '#00695C', skill: 'もじ' },
  ];

  return (
    <div style={{ textAlign: 'center', padding: '16px 16px', width: '100%', maxWidth: 480, overflowY: 'auto', maxHeight: '100vh' }}>
      <div style={{ fontSize: 60, animation: 'float 2s ease-in-out infinite' }}>🐟</div>
      <h1 style={{ color: '#fff', fontSize: 'clamp(24px,7vw,40px)', fontWeight: 900, textShadow: '4px 4px 0 #01579B', margin: '4px 0' }}>さかなランド</h1>

      {/* 年齢と難易度 */}
      <div style={{
        background: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: '8px 16px',
        margin: '8px auto 12px', display: 'inline-block', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.2)',
      }}>
        <span style={{ color: '#E1F5FE', fontSize: 13 }}>🎂 {getAgeLabel()}</span>
        <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 8px' }}>|</span>
        <span style={{ color: '#FFD54F', fontSize: 13, fontWeight: 700 }}>{getDifficultyLabel(difficulty)}</span>
      </div>

      {/* 難易度切り替え */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 14 }}>
        {[1, 2, 3].map(d => (
          <button key={d} onClick={() => { sounds.tap(); setDifficulty(d); }} style={{
            ...baseBtn,
            padding: '6px 14px', fontSize: 12, borderRadius: 14,
            background: d === difficulty ? 'rgba(255,213,79,0.3)' : 'rgba(255,255,255,0.08)',
            border: `2px solid ${d === difficulty ? '#FFD54F' : 'rgba(255,255,255,0.15)'}`,
            color: d === difficulty ? '#FFD54F' : '#B2EBF2',
          }}>
            {getDifficultyLabel(d)}
          </button>
        ))}
      </div>

      <p style={{ color: '#E1F5FE', fontSize: 'clamp(13px,3vw,16px)', marginBottom: 14 }}>あそびを えらんでね！</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {games.map((g, idx) => (
          <button key={g.id} onClick={() => { sounds.tap(); onSelect(g.id); }} style={{
            ...baseBtn,
            background: `linear-gradient(135deg, ${g.color}CC, ${g.shadow})`,
            border: '2px solid rgba(255,255,255,0.3)', borderRadius: 20, padding: '14px 8px',
            backdropFilter: 'blur(8px)',
            boxShadow: `0 4px 0 ${g.shadow}, 0 6px 16px rgba(0,0,0,0.3)`,
            animation: 'bounce 2s ease-in-out infinite', animationDelay: `${idx * 0.15}s`,
          }}>
            <div style={{ fontSize: 36 }}>{g.emoji}</div>
            <div style={{ fontSize: 'clamp(13px,3.5vw,17px)', marginTop: 4 }}>{g.title}</div>
            <div style={{ fontSize: 'clamp(10px,2.5vw,12px)', opacity: 0.8, marginTop: 2 }}>{g.desc}</div>
            <div style={{
              fontSize: 10, marginTop: 4, background: 'rgba(255,255,255,0.15)',
              borderRadius: 8, padding: '2px 8px', display: 'inline-block',
            }}>{g.skill}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState('menu');
  const [difficulty, setDifficulty] = useState(getRecommendedDifficulty);

  const back = () => setScreen('menu');

  return (
    <div style={{
      fontFamily: "'Noto Sans JP', sans-serif",
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #87CEEB 0%, #29B6F6 40%, #0277BD 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', userSelect: 'none',
    }}>
      <style>{globalCSS}</style>

      {screen === 'menu'      && <Menu onSelect={setScreen} difficulty={difficulty} setDifficulty={setDifficulty} />}
      {screen === 'fishing'   && <FishingGame    onBack={back} />}
      {screen === 'count'     && <CountGame      onBack={back} difficulty={difficulty} />}
      {screen === 'memory'    && <MemoryGame     onBack={back} difficulty={difficulty} />}
      {screen === 'color'     && <ColorGame      onBack={back} />}
      {screen === 'name'      && <NameGame       onBack={back} />}
      {screen === 'shape'     && <ShapeGame      onBack={back} difficulty={difficulty} />}
      {screen === 'story'     && <StoryGame      onBack={back} difficulty={difficulty} />}
      {screen === 'pattern'   && <PatternGame    onBack={back} difficulty={difficulty} />}
      {screen === 'season'    && <SeasonGame     onBack={back} difficulty={difficulty} />}
      {screen === 'shiritori' && <ShiritoriGame  onBack={back} difficulty={difficulty} />}
      {screen === 'aiueo'    && <AiueoChart     onBack={back} />}
    </div>
  );
}
