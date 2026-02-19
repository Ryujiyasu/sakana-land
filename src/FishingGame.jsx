import { useState, useEffect, useRef } from 'react';
import { FISH } from './data.js';
import { sounds } from './sounds.js';
import { TopBar, ResultScreen, SeaCreatureImg } from './components.jsx';

let uidCount = 0;

export default function FishingGame({ onBack }) {
  const [fishList, setFishList] = useState([]);
  const [caught, setCaught] = useState([]);
  const [bigEffect, setBigEffect] = useState(null);
  const [hookPos, setHookPos] = useState(null);
  const [casting, setCasting] = useState(false);
  const [done, setDone] = useState(false);
  const hookRef = useRef({});

  const spawnFish = () => {
    const f = FISH[Math.floor(Math.random() * FISH.length)];
    const fromLeft = Math.random() > 0.5;
    return { ...f, uid: uidCount++, x: fromLeft ? -12 : 112, y: 35 + Math.random() * 50, dir: fromLeft ? 1 : -1, speed: 0.5 + Math.random() * 0.4 };
  };

  useEffect(() => {
    setFishList([spawnFish(), spawnFish(), spawnFish()]);
    const id = setInterval(() => setFishList(p => p.length < 5 ? [...p, spawnFish()] : p), 2500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (done) return;
    let frame;
    const tick = () => {
      setFishList(p => p.map(f => ({ ...f, x: f.x + f.dir * f.speed })).filter(f => f.x > -15 && f.x < 115));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [done]);

  const cast = (e) => {
    if (casting || done) return;
    e.preventDefault();
    sounds.cast();
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const px = ((clientX - rect.left) / rect.width) * 100;
    setCasting(true);
    setHookPos({ x: px, y: 10 });
    hookRef.current = { x: px };
    let y = 10;
    const fall = setInterval(() => {
      y += 2.5;
      setHookPos({ x: px, y });
      let hitFish = null;
      setFishList(prev => {
        const remaining = prev.filter(f => {
          if (Math.abs(f.x - hookRef.current.x) < 12 && Math.abs(f.y - y) < 12) { hitFish = f; return false; }
          return true;
        });
        return hitFish ? remaining : prev;
      });
      if (hitFish) {
        clearInterval(fall);
        sounds.catch();
        setCaught(c => {
          const next = [...c, hitFish];
          if (next.length >= 5) { sounds.clear(); setTimeout(() => setDone(true), 1200); }
          return next;
        });
        setBigEffect(hitFish);
        setTimeout(() => setBigEffect(null), 1200);
        setCasting(false); setHookPos(null); return;
      }
      if (y >= 96) { clearInterval(fall); setCasting(false); setHookPos(null); }
    }, 35);
  };

  if (done) return (
    <ResultScreen
      title={`さかなを ${caught.length}ひき つったよ！🎉`}
      items={caught} onBack={onBack}
      onRetry={() => { setCaught([]); setDone(false); setFishList([spawnFish(), spawnFish(), spawnFish()]); }}
    />
  );

  return (
    <div style={{ width: '100%', maxWidth: 480, padding: '0 12px' }}>
      <TopBar label={`つったさかな：${caught.length} / 5 🐟`} onBack={onBack} />
      <div onClick={cast} onTouchStart={cast} style={{
        position: 'relative', width: '100%', paddingBottom: '72%',
        background: 'linear-gradient(180deg,rgba(255,255,255,0.06) 0%,rgba(1,60,120,0.7) 100%)',
        borderRadius: 24, border: '3px solid rgba(255,255,255,0.3)',
        cursor: 'crosshair', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
      }}>
        <div style={{ position: 'absolute', top: '18%', left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.4)' }} />
        {hookPos && <>
          <div style={{ position: 'absolute', left: `${hookPos.x}%`, top: '5%', width: 2, height: `${hookPos.y - 5}%`, background: 'rgba(255,255,255,0.6)' }} />
          <div style={{ position: 'absolute', left: `calc(${hookPos.x}% - 14px)`, top: `${hookPos.y}%`, fontSize: 28, pointerEvents: 'none' }}>🪝</div>
        </>}
        {fishList.map(f => (
          <div key={f.uid} style={{
            position: 'absolute', left: `${f.x}%`, top: `${f.y}%`,
            transform: f.dir < 0 ? 'scaleX(-1)' : 'none',
            animation: 'swim 2s ease-in-out infinite', animationDelay: `${f.uid % 5 * 0.5}s`,
            pointerEvents: 'none',
          }}>
            <SeaCreatureImg item={f} size={80} style={{ borderRadius: 14 }} />
          </div>
        ))}
        <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 700 }}>タップして つろう！</div>
      </div>
      {caught.length > 0 && (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 10, flexWrap: 'wrap' }}>
          {caught.map((f, i) => <SeaCreatureImg key={i} item={f} size={56} style={{ animation: 'pop 0.4s ease', borderRadius: 10 }} />)}
        </div>
      )}
      {bigEffect && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', animation: 'pop 0.5s ease', pointerEvents: 'none', zIndex: 100 }}>
          <SeaCreatureImg item={bigEffect} size={160} style={{ borderRadius: 24 }} />
          <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', textShadow: '2px 2px 0 #01579B', marginTop: 8 }}>{bigEffect.name}を つったよ！🎉</div>
        </div>
      )}
    </div>
  );
}
