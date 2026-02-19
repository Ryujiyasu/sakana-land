// 年齢に応じた難易度設定
// 生年月日: 2022年11月26日

const BIRTHDAY = new Date(2022, 10, 26); // month is 0-indexed

export function getAgeMonths() {
  const now = new Date();
  return (now.getFullYear() - BIRTHDAY.getFullYear()) * 12 + (now.getMonth() - BIRTHDAY.getMonth());
}

// 難易度レベル: 1 (かんたん) / 2 (ふつう) / 3 (むずかしい)
// 年齢に応じた推奨難易度を返す
export function getRecommendedDifficulty() {
  const months = getAgeMonths();
  if (months < 42) return 1;       // ～3歳半: かんたん
  if (months < 54) return 1;       // ～4歳半: かんたん
  if (months < 66) return 2;       // ～5歳半: ふつう
  return 3;                        // 5歳半～: むずかしい（受験本番レベル）
}

export function getAgeLabel() {
  const months = getAgeMonths();
  const y = Math.floor(months / 12);
  const m = months % 12;
  return `${y}さい${m}かげつ`;
}

export function getDifficultyLabel(d) {
  if (d === 1) return '⭐ かんたん';
  if (d === 2) return '⭐⭐ ふつう';
  return '⭐⭐⭐ むずかしい';
}

// 各ゲームの難易度パラメータ
export function getDifficultyParams(difficulty) {
  return {
    // かずゲーム: 最大いくつまで数えるか
    countMax: [3, 5, 8][difficulty - 1],
    countOpts: [2, 3, 4][difficulty - 1],
    // きおくゲーム: カードのペア数
    memoryPairs: [3, 4, 6][difficulty - 1],
    // 図形: パターンの複雑さ
    shapeLevels: difficulty,
    // お話: 文章の長さ
    storyLength: difficulty,
    // ならびかた: パターンの複雑さ
    patternComplexity: difficulty,
  };
}
