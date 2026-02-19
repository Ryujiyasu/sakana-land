import { useState, useEffect, useRef } from 'react';
import { sounds } from './sounds.js';
import { cardStyle, baseBtn } from './styles.js';
import { TopBar, ResultScreen } from './components.jsx';

// お話の記憶ゲーム - 海の生き物の短いお話を聞いて（読んで）質問に答える

const STORIES = [
  {
    title: 'うみの おさんぽ',
    text: 'ある はれた ひ、カメさんは うみの そこを おさんぽ しました。さいしょに あかい サンゴを みつけました。つぎに あおい ヒトデを ３つ みつけました。さいごに おおきな カイを みつけて、おうちに もって かえりました。',
    emoji: '🐢',
    questions: [
      { q: 'カメさんが さいしょに みつけたのは？', opts: ['あかい サンゴ', 'あおい ヒトデ', 'おおきな カイ'], answer: 'あかい サンゴ' },
      { q: 'ヒトデは いくつ あった？', opts: ['２つ', '３つ', '５つ'], answer: '３つ' },
      { q: 'カメさんが おうちに もって かえったのは？', opts: ['サンゴ', 'ヒトデ', 'カイ'], answer: 'カイ' },
    ],
  },
  {
    title: 'イルカの たんじょうび',
    text: 'きょうは イルカさんの たんじょうび です。タコさんが ケーキを つくりました。カニさんは あかい ぼうしを プレゼント しました。クジラさんは おおきな こえで「おめでとう！」と いいました。イルカさんは とても うれしくて、たかく ジャンプ しました。',
    emoji: '🐬',
    questions: [
      { q: 'ケーキを つくったのは だれ？', opts: ['カニさん', 'タコさん', 'クジラさん'], answer: 'タコさん' },
      { q: 'カニさんの プレゼントは？', opts: ['ケーキ', 'あかい ぼうし', 'おもちゃ'], answer: 'あかい ぼうし' },
      { q: 'イルカさんは なにを した？', opts: ['うたった', 'たかく ジャンプした', 'ないた'], answer: 'たかく ジャンプした' },
    ],
  },
  {
    title: 'さかなの がっこう',
    text: 'うみの なかに さかなの がっこうが あります。せんせいは フグさん です。きょうは えを かく じゅぎょう でした。クマノミさんは サンゴの え を かきました。タツノオトシゴさんは にじの え を かきました。フグせんせいは「みんな じょうずだね！」と いいました。',
    emoji: '🐡',
    questions: [
      { q: 'せんせいは だれ？', opts: ['クマノミさん', 'タツノオトシゴさん', 'フグさん'], answer: 'フグさん' },
      { q: 'きょうの じゅぎょうは？', opts: ['さんすう', 'えを かく', 'たいいく'], answer: 'えを かく' },
      { q: 'クマノミさんは なにの えを かいた？', opts: ['にじ', 'サンゴ', 'おさかな'], answer: 'サンゴ' },
    ],
  },
  {
    title: 'たからさがし',
    text: 'カニさんと エビさんは たからさがしに でかけました。ちずには「きいろい いわの よこ」と かいて ありました。ふたりは およいで いくと、まず みどりの いわを みつけました。つぎに きいろい いわを みつけて、その よこを ほると、きれいな しんじゅが でてきました。',
    emoji: '🦀',
    questions: [
      { q: 'たからさがしに いったのは？', opts: ['カニさんと タコさん', 'カニさんと エビさん', 'エビさんと イカさん'], answer: 'カニさんと エビさん' },
      { q: 'さいしょに みつけた いわの いろは？', opts: ['きいろ', 'みどり', 'あか'], answer: 'みどり' },
      { q: 'たからは なんだった？', opts: ['きんか', 'しんじゅ', 'ダイヤモンド'], answer: 'しんじゅ' },
    ],
  },
  {
    title: 'うみの うんどうかい',
    text: 'きょうは うみの うんどうかい です。かけっこでは イルカさんが いちばん でした。つなひきは タコさんの チームが かちました。さいごの たまいれでは、あかチームが ５こ、しろチームが ３こ いれて、あかチームが かちました。',
    emoji: '🐙',
    questions: [
      { q: 'かけっこで いちばんだったのは？', opts: ['タコさん', 'イルカさん', 'カニさん'], answer: 'イルカさん' },
      { q: 'つなひきで かったのは？', opts: ['イルカさんのチーム', 'タコさんのチーム', 'カニさんのチーム'], answer: 'タコさんのチーム' },
      { q: 'たまいれで かったのは？', opts: ['しろチーム', 'あかチーム', 'あおチーム'], answer: 'あかチーム' },
    ],
  },
];

export default function StoryGame({ onBack }) {
  const [phase, setPhase] = useState('intro'); // intro, reading, question, result
  const [storyIdx, setStoryIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [totalQ, setTotalQ] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const timerRef = useRef(null);

  const story = STORIES[storyIdx];
  const question = story.questions[qIdx];

  // テキストを1文字ずつ表示するアニメーション
  useEffect(() => {
    if (phase !== 'reading') return;
    setCharIdx(0);
    timerRef.current = setInterval(() => {
      setCharIdx(prev => {
        if (prev >= story.text.length - 1) {
          clearInterval(timerRef.current);
          return story.text.length;
        }
        return prev + 1;
      });
    }, 80);
    return () => clearInterval(timerRef.current);
  }, [phase, storyIdx]);

  const startReading = () => {
    sounds.tap();
    setPhase('reading');
  };

  const skipToEnd = () => {
    clearInterval(timerRef.current);
    setCharIdx(story.text.length);
  };

  const goToQuestions = () => {
    sounds.tap();
    setPhase('question');
    setQIdx(0);
    setSelected(null);
    setCorrect(null);
  };

  const pickAnswer = (ans) => {
    if (selected !== null) return;
    setSelected(ans);
    const ok = ans === question.answer;
    setCorrect(ok);
    ok ? sounds.correct() : sounds.wrong();
    if (ok) setScore(s => s + 1);
    setTotalQ(t => t + 1);

    setTimeout(() => {
      if (qIdx < story.questions.length - 1) {
        setQIdx(q => q + 1);
        setSelected(null);
        setCorrect(null);
      } else if (storyIdx < STORIES.length - 1) {
        setStoryIdx(s => s + 1);
        setPhase('intro');
        setQIdx(0);
        setSelected(null);
        setCorrect(null);
      } else {
        sounds.clear();
        setPhase('result');
      }
    }, 1400);
  };

  if (phase === 'result') {
    return (
      <ResultScreen
        title={`${totalQ}もん中 ${score}もん せいかい！🎉`}
        items={[]}
        onBack={onBack}
        onRetry={() => { setStoryIdx(0); setQIdx(0); setScore(0); setTotalQ(0); setPhase('intro'); setSelected(null); setCorrect(null); }}
      />
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: 440, padding: '0 16px', textAlign: 'center' }}>
      <TopBar label={`📖 ${storyIdx + 1}/${STORIES.length}`} onBack={onBack} />

      {phase === 'intro' && (
        <div style={{ ...cardStyle, padding: 28 }}>
          <div style={{ fontSize: 80, animation: 'float 2s ease-in-out infinite', marginBottom: 12 }}>{story.emoji}</div>
          <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 900, textShadow: '2px 2px 0 #006064', marginBottom: 8 }}>
            「{story.title}」
          </h2>
          <p style={{ color: '#B2EBF2', fontSize: 15, marginBottom: 20 }}>
            おはなしを よく よんで おぼえてね！
          </p>
          <button onClick={startReading} style={{
            ...baseBtn, background: 'linear-gradient(135deg,#42A5F5,#0277BD)',
            padding: '14px 36px', fontSize: 20, borderRadius: 50, boxShadow: '0 6px 0 #01579B',
            animation: 'bounce 2s ease-in-out infinite',
          }}>
            よみはじめる 📖
          </button>
        </div>
      )}

      {phase === 'reading' && (
        <div style={{ ...cardStyle, padding: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>{story.emoji}</div>
          <h3 style={{ color: '#FFD54F', fontSize: 18, fontWeight: 900, marginBottom: 14 }}>「{story.title}」</h3>
          <div onClick={skipToEnd} style={{
            background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '18px 16px',
            fontSize: 18, lineHeight: 2, color: '#fff', textAlign: 'left', minHeight: 120,
            cursor: 'pointer',
          }}>
            {story.text.slice(0, charIdx + 1)}
            {charIdx < story.text.length - 1 && <span style={{ animation: 'bounce 1s infinite' }}>▍</span>}
          </div>
          {charIdx >= story.text.length - 1 && (
            <button onClick={goToQuestions} style={{
              ...baseBtn, background: 'linear-gradient(135deg,#FFD54F,#FF8F00)',
              padding: '14px 32px', fontSize: 18, borderRadius: 50, boxShadow: '0 6px 0 #E65100',
              marginTop: 16, animation: 'pop 0.4s ease',
            }}>
              もんだいに すすむ ✏️
            </button>
          )}
        </div>
      )}

      {phase === 'question' && (
        <div style={{ ...cardStyle, padding: 24 }}>
          <p style={{ color: '#FFD54F', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
            「{story.title}」の もんだい {qIdx + 1}/{story.questions.length}
          </p>
          <p style={{ color: '#fff', fontSize: 20, fontWeight: 900, marginBottom: 20, lineHeight: 1.6 }}>
            {question.q}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {question.opts.map((o, idx) => {
              const isAnswer = o === question.answer;
              const isSelected = o === selected;
              return (
                <button key={idx} onClick={() => pickAnswer(o)} style={{
                  ...baseBtn, padding: '16px 20px', fontSize: 18, borderRadius: 20, textAlign: 'left',
                  background: selected === null ? 'rgba(255,255,255,0.15)'
                    : isAnswer ? 'linear-gradient(135deg,#66BB6A,#2E7D32)'
                    : isSelected ? 'linear-gradient(135deg,#EF5350,#B71C1C)'
                    : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${selected === null ? 'rgba(255,255,255,0.3)' : isAnswer ? '#66BB6A' : isSelected ? '#EF5350' : 'rgba(255,255,255,0.1)'}`,
                  transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                  transition: 'all 0.3s',
                  opacity: selected && !isAnswer && !isSelected ? 0.4 : 1,
                }}>
                  {o}
                </button>
              );
            })}
          </div>
          {correct !== null && (
            <div style={{ marginTop: 16, fontSize: 22, fontWeight: 900, color: correct ? '#A5D6A7' : '#EF9A9A', animation: 'pop 0.4s ease' }}>
              {correct ? '🎉 せいかい！' : `😊 こたえは「${question.answer}」だよ！`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
