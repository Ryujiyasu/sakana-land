export const baseBtn = {
  border: 'none', borderRadius: 50, cursor: 'pointer',
  fontWeight: 900, color: '#fff',
  fontFamily: "'Noto Sans JP', sans-serif",
};

export const cardStyle = {
  background: 'rgba(255,255,255,0.18)',
  backdropFilter: 'blur(12px)',
  borderRadius: 28,
  border: '2px solid rgba(255,255,255,0.35)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
};

export const globalCSS = `
  @keyframes float  { 0%,100%{transform:translateY(0)}    50%{transform:translateY(-10px)} }
  @keyframes pop    { 0%{transform:scale(0.5);opacity:0}  60%{transform:scale(1.3)} 100%{transform:scale(1);opacity:1} }
  @keyframes bounce { 0%,100%{transform:scale(1)}         50%{transform:scale(1.1)} }
  @keyframes swim   { 0%,100%{transform:translateY(0px)}  50%{transform:translateY(-6px)} }
  * { box-sizing: border-box; }
  body { margin: 0; }
  *::-webkit-scrollbar { display: none; }
  * { -ms-overflow-style: none; scrollbar-width: none; }
`;
