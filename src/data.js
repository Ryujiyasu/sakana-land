export const FISH = [
  { emoji: '🐟', name: 'マダイ',         color: '#4FC3F7', img: '/マダイ.jpeg' },
  { emoji: '🐠', name: 'カクレクマノミ', color: '#FF7043', img: '/カクレクマノミ.jpeg' },
  { emoji: '🐡', name: 'トラフグ',       color: '#9C27B0', img: '/トラフグ.jpeg' },
  { emoji: '🐬', name: 'バンドウイルカ', color: '#29B6F6', img: '/バンドウイルカ.jpeg' },
  { emoji: '🦀', name: 'ズワイガニ',     color: '#EF5350', img: '/ズワイガニ.jpeg' },
  { emoji: '🐙', name: 'マダコ',         color: '#EC407A', img: '/マダコ.jpeg' },
  { emoji: '🦑', name: 'ダイオウイカ',   color: '#7E57C2', img: '/ダイオウイカ.jpeg' },
  { emoji: '🐳', name: 'マッコウクジラ', color: '#42A5F5', img: '/マッコウクジラ.jpeg' },
  { emoji: '🐢', name: 'アオウミガメ',   color: '#66BB6A', img: '/アオウミガメ.jpeg' },
  { emoji: '🦐', name: 'イセエビ',       color: '#FF7043', img: '/イセエビ.jpeg' },
  { emoji: '🐍', name: 'ウツボ',         color: '#8D6E63', img: '/ウツボ.jpeg' },
  { emoji: '🩻', name: 'エイ',           color: '#78909C', img: '/エイ.jpeg' },
  { emoji: '🐡', name: 'オコゼ',         color: '#A1887F', img: '/オコゼ.jpeg' },
  { emoji: '🪼', name: 'クラゲ',         color: '#CE93D8', img: '/クラゲ.jpeg' },
  { emoji: '🦀', name: 'ケガニ',         color: '#FF8A65', img: '/ケガニ.jpeg' },
];

export const COLORS = [
  { label: 'あか',     bg: '#EF5350', emoji: '🔴' },
  { label: 'あお',     bg: '#42A5F5', emoji: '🔵' },
  { label: 'きいろ',   bg: '#FFD54F', emoji: '🟡' },
  { label: 'みどり',   bg: '#66BB6A', emoji: '🟢' },
  { label: 'むらさき', bg: '#AB47BC', emoji: '🟣' },
  { label: 'オレンジ', bg: '#FFA726', emoji: '🟠' },
];

export const FISH_LEARN = [
  { emoji: '🐟', name: 'マダイ',         furigana: 'まだい',         fun: 'おめでたいさかなとよばれるよ！',           img: '/マダイ.jpeg' },
  { emoji: '🐠', name: 'カクレクマノミ', furigana: 'かくれくまのみ', fun: 'イソギンチャクにかくれてすむよ！',         img: '/カクレクマノミ.jpeg' },
  { emoji: '🐡', name: 'トラフグ',       furigana: 'とらふぐ',       fun: 'からだにどくをもっているよ！',             img: '/トラフグ.jpeg' },
  { emoji: '🐬', name: 'バンドウイルカ', furigana: 'ばんどういるか', fun: 'すいぞくかんのにんきものだよ！',           img: '/バンドウイルカ.jpeg' },
  { emoji: '🦀', name: 'ズワイガニ',     furigana: 'ずわいがに',     fun: 'つめたいうみにすんでいるよ！',             img: '/ズワイガニ.jpeg' },
  { emoji: '🐙', name: 'マダコ',         furigana: 'まだこ',         fun: 'からだのいろをかえられるよ！',             img: '/マダコ.jpeg' },
  { emoji: '🦑', name: 'ダイオウイカ',   furigana: 'だいおういか',   fun: 'せかいでいちばんおおきいイカだよ！',       img: '/ダイオウイカ.jpeg' },
  { emoji: '🐳', name: 'マッコウクジラ', furigana: 'まっこうくじら', fun: 'ふかいうみにもぐるのがとくいだよ！',       img: '/マッコウクジラ.jpeg' },
  { emoji: '🐢', name: 'アオウミガメ',   furigana: 'あおうみがめ',   fun: 'うみを ながい きょりを およぐよ！',       img: '/アオウミガメ.jpeg' },
  { emoji: '🦐', name: 'イセエビ',       furigana: 'いせえび',       fun: 'おいわいの りょうりに つかわれるよ！',     img: '/イセエビ.jpeg' },
  { emoji: '🐍', name: 'ウツボ',         furigana: 'うつぼ',         fun: 'いわの すきまに かくれて すんでいるよ！', img: '/ウツボ.jpeg' },
  { emoji: '🩻', name: 'エイ',           furigana: 'えい',           fun: 'ひらたい からだで うみの そこを およぐよ！', img: '/エイ.jpeg' },
  { emoji: '🐡', name: 'オコゼ',         furigana: 'おこぜ',         fun: 'せびれに どくの とげが あるよ！',         img: '/オコゼ.jpeg' },
  { emoji: '🪼', name: 'クラゲ',         furigana: 'くらげ',         fun: 'からだの ほとんどが みずで できているよ！', img: '/クラゲ.jpeg' },
  { emoji: '🦀', name: 'ケガニ',         furigana: 'けがに',         fun: 'からだに けが たくさん はえているよ！',   img: '/ケガニ.jpeg' },
];

// あいうえお表データ — 各行は [あ段, い段, う段, え段, お段]
// null は空きマス（yi, ye, wi, we など）
export const AIUEO = [
  { row: 'あ', cells: [
    { kana: 'あ', name: 'アオウミガメ',     emoji: '🐢', img: '/アオウミガメ.jpeg', fun: 'うみを ながい きょりを およぐよ！' },
    { kana: 'い', name: 'イセエビ',         emoji: '🦐', img: '/イセエビ.jpeg',     fun: 'おいわいの りょうりに つかわれるよ！' },
    { kana: 'う', name: 'ウツボ',           emoji: '🐍', img: '/ウツボ.jpeg',       fun: 'いわの すきまに かくれて すんでいるよ！' },
    { kana: 'え', name: 'エイ',             emoji: '🩻', img: '/エイ.jpeg',         fun: 'ひらたい からだで うみの そこを およぐよ！' },
    { kana: 'お', name: 'オコゼ',           emoji: '🐡', img: '/オコゼ.jpeg',       fun: 'せびれに どくの とげが あるよ！' },
  ]},
  { row: 'か', cells: [
    { kana: 'か', name: 'カクレクマノミ',   emoji: '🐠', img: '/カクレクマノミ.jpeg', fun: 'イソギンチャクに かくれて すむよ！' },
    { kana: 'き', name: 'キンメダイ',       emoji: '🐟', img: '/キンメダイ.jpeg',     fun: 'おおきな きんいろの めが とくちょうだよ！' },
    { kana: 'く', name: 'クラゲ',           emoji: '🪼', img: '/クラゲ.jpeg',         fun: 'からだの ほとんどが みずで できているよ！' },
    { kana: 'け', name: 'ケガニ',           emoji: '🦀', img: '/ケガニ.jpeg',         fun: 'からだに けが たくさん はえているよ！' },
    { kana: 'こ', name: 'コバンザメ',       emoji: '🦈', img: '/コバンザメ.jpeg',     fun: 'おおきな さかなに くっついて およぐよ！' },
  ]},
  { row: 'さ', cells: [
    { kana: 'さ', name: 'サケ',             emoji: '🐟', img: '/サケ.jpeg',         fun: 'うまれた かわに かえって くるよ！' },
    { kana: 'し', name: 'シャチ',           emoji: '🐬', img: '/シャチ.jpeg',       fun: 'うみで いちばん つよい どうぶつだよ！' },
    { kana: 'す', name: 'スズキ',           emoji: '🐟', img: '/スズキ.jpeg',       fun: 'おおきく なると なまえが かわるよ！' },
    { kana: 'せ', name: 'セイウチ',         emoji: '🦭', img: '/セイウチ.jpeg',     fun: 'ながい きばが じまんだよ！' },
    { kana: 'そ', name: 'ソデカラッパ',     emoji: '🦀', img: '/ソデカラッパ.jpeg', fun: 'はさみが カラッパの かたちに にているよ！' },
  ]},
  { row: 'た', cells: [
    { kana: 'た', name: 'タツノオトシゴ',   emoji: '🐟', img: '/タツノオトシゴ.jpeg', fun: 'おとうさんの おなかで あかちゃんを そだてるよ！' },
    { kana: 'ち', name: 'チンアナゴ',       emoji: '🐟', img: '/チンアナゴ.jpeg',     fun: 'すなから かおだけ だして ごはんを たべるよ！' },
    { kana: 'つ', name: 'ツノダシ',         emoji: '🐟', img: '/ツノダシ.jpeg',       fun: 'ながい つのみたいな ひれが あるよ！' },
    { kana: 'て', name: 'テッポウエビ',     emoji: '🦐', img: '/テッポウエビ.jpeg',   fun: 'はさみで パチン！と おおきな おとを だすよ！' },
    { kana: 'と', name: 'トラフグ',         emoji: '🐡', img: '/トラフグ.jpeg',       fun: 'からだに どくを もっているよ！' },
  ]},
  { row: 'な', cells: [
    { kana: 'な', name: 'ナマコ',           emoji: '🟤', img: '/ナマコ.jpeg',       fun: 'うみの そうじやさんだよ！' },
    { kana: 'に', name: 'ニジマス',         emoji: '🐟', img: '/ニジマス.jpeg',     fun: 'からだに にじいろの もようが あるよ！' },
    { kana: 'ぬ', name: 'ヌタウナギ',       emoji: '🐟', img: '/ヌタウナギ.jpeg',   fun: 'ネバネバの ぬるぬるを だすよ！' },
    { kana: 'ね', name: 'ネコザメ',         emoji: '🦈', img: '/ネコザメ.jpeg',     fun: 'かおが ネコに にているよ！' },
    { kana: 'の', name: 'ノコギリエイ',     emoji: '🩻', img: '/ノコギリエイ.jpeg', fun: 'はなが ノコギリの かたちを しているよ！' },
  ]},
  { row: 'は', cells: [
    { kana: 'は', name: 'ハリセンボン',     emoji: '🐡', img: '/ハリセンボン.jpeg', fun: 'おこると からだの はりを たてるよ！' },
    { kana: 'ひ', name: 'ヒトデ',           emoji: '⭐', img: '/ヒトデ.jpeg',       fun: 'うでが きれても また はえてくるよ！' },
    { kana: 'ふ', name: 'フグ',             emoji: '🐡', img: '/フグ.jpeg',         fun: 'おこると まるく ふくらむよ！' },
    { kana: 'へ', name: 'ヘコアユ',         emoji: '🐟', img: '/ヘコアユ.jpeg',     fun: 'さかさまに なって およぐよ！' },
    { kana: 'ほ', name: 'ホタテ',           emoji: '🐚', img: '/ホタテ.jpeg',       fun: 'かいがらを パクパク うごかして およぐよ！' },
  ]},
  { row: 'ま', cells: [
    { kana: 'ま', name: 'マンボウ',         emoji: '🐟', img: '/マンボウ.jpeg',         fun: 'うみに ぷかぷか ういて ひなたぼっこするよ！' },
    { kana: 'み', name: 'ミズクラゲ',       emoji: '🪼', img: '/ミズクラゲ.jpeg',       fun: 'とうめいで よつばの クローバーみたいだよ！' },
    { kana: 'む', name: 'ムツゴロウ',       emoji: '🐟', img: '/ムツゴロウ.jpeg',       fun: 'ひがたで ぴょんぴょん はねるよ！' },
    { kana: 'め', name: 'メンダコ',         emoji: '🐙', img: '/メンダコ.jpeg',         fun: 'ふかい うみに すむ かわいい タコだよ！' },
    { kana: 'も', name: 'モンガラカワハギ', emoji: '🐟', img: '/モンガラカワハギ.jpeg', fun: 'カラフルな もようが きれいだよ！' },
  ]},
  { row: 'や', cells: [
    { kana: 'や', name: 'ヤドカリ',         emoji: '🐚', img: '/ヤドカリ.jpeg',     fun: 'かいがらを おうちに しているよ！' },
    null,
    { kana: 'ゆ', name: 'ユメカサゴ',       emoji: '🐟', img: '/ユメカサゴ.jpeg',   fun: 'きれいだけど ひれに どくが あるよ！' },
    null,
    { kana: 'よ', name: 'ヨシキリザメ',     emoji: '🦈', img: '/ヨシキリザメ.jpeg', fun: 'うつくしい あおいろの サメだよ！' },
  ]},
  { row: 'ら', cells: [
    { kana: 'ら', name: 'ラッコ',             emoji: '🦦', img: '/ラッコ.jpeg',             fun: 'いしで かいを わって たべるよ！' },
    { kana: 'り', name: 'リュウグウノツカイ', emoji: '🐟', img: '/リュウグウノツカイ.jpeg', fun: 'ながーい からだの ふしぎな さかなだよ！' },
    { kana: 'る', name: 'ルリスズメダイ',     emoji: '🐟', img: '/ルリスズメダイ.jpeg',     fun: 'あざやかな あおいろが きれいだよ！' },
    { kana: 'れ', name: 'レモンザメ',         emoji: '🦈', img: '/レモンザメ.jpeg',         fun: 'きいろっぽい はだいろの サメだよ！' },
    { kana: 'ろ', name: 'ロブスター',         emoji: '🦞', img: '/ロブスター.jpeg',         fun: 'おおきな はさみが じまんだよ！' },
  ]},
  { row: 'わ', cells: [
    { kana: 'わ', name: 'ワカサギ',   emoji: '🐟', img: '/ワカサギ.jpeg', fun: 'こおった みずうみで つれるよ！' },
    null,
    null,
    null,
    { kana: 'を', name: 'ペンギン',   emoji: '🐧', img: '/ペンギン_およぐ.jpeg', special: 'うみ「を」およぐ', fun: 'とぶのは にがてだけど およぐの だいすき！' },
  ]},
  { row: 'ん', cells: [
    { kana: 'ん', name: 'ペンギン',   emoji: '🐧', img: '/ペンギン.jpeg', special: 'ペンギ「ん」', fun: 'さむい ところで なかまと あつまって くらすよ！' },
    null, null, null, null,
  ]},
];
