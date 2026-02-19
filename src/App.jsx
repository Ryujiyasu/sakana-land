import { globalCSS } from './styles.js';
import AiueoChart from './AiueoChart.jsx';

export default function App() {
  return (
    <div style={{
      fontFamily: "'Noto Sans JP', sans-serif",
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #87CEEB 0%, #29B6F6 40%, #0277BD 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', userSelect: 'none',
    }}>
      <style>{globalCSS}</style>
      <AiueoChart />
    </div>
  );
}
