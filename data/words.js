/*
 * ひらがなパズル — 単語データ
 * =========================================================
 * ■ 単語の追加方法
 *   1. 下の rows から追加したい行（例: か行 = id:"ka"）を探す
 *   2. その行の words 配列に { } を1つ足す
 *      例:  { id: "ka-01", text: "かめ", length: 2, emoji: "🐢", illustration: "カメ" },
 *
 * ■ 各項目の意味
 *   id          … かぶらない名前。「行のid - 連番」で付ける（例: ka-01）
 *   text        … 単語そのもの（ひらがな）
 *   length      … 文字数（text の文字数をそのまま。あり→2, いちご→3）
 *   emoji       … 今のイラスト代わり。あとで本物の画像に差し替え予定
 *   illustration… いらすとや等で画像を探すときの検索キーワード
 *
 * ■ あとで本物の画像にするとき
 *   emoji の代わりに image: "img/ari.png" のように image を足せば、
 *   アプリは自動で画像を優先表示します（emoji は予備になります）。
 * =========================================================
 */
window.HIRAGANA_DATA = {
  rows: [
    {
      id: "a",
      label: "あ行",
      kana: ["あ", "い", "う", "え", "お"],
      words: [
        { id: "a-01", text: "あり",   length: 2, emoji: "🐜", illustration: "あり 虫" },
        { id: "a-02", text: "いぬ",   length: 2, emoji: "🐶", illustration: "犬" },
        { id: "a-03", text: "いか",   length: 2, emoji: "🦑", illustration: "イカ" },
        { id: "a-04", text: "うし",   length: 2, emoji: "🐮", illustration: "牛" },
        { id: "a-05", text: "うみ",   length: 2, emoji: "🌊", illustration: "海" },
        { id: "a-06", text: "えび",   length: 2, emoji: "🦐", illustration: "エビ" },
        { id: "a-07", text: "おに",   length: 2, emoji: "👹", illustration: "鬼" },

        { id: "a-08", text: "あひる", length: 3, emoji: "🦆", illustration: "アヒル" },
        { id: "a-09", text: "いちご", length: 3, emoji: "🍓", illustration: "イチゴ" },
        { id: "a-10", text: "いるか", length: 3, emoji: "🐬", illustration: "イルカ" },
        { id: "a-11", text: "うさぎ", length: 3, emoji: "🐰", illustration: "ウサギ" },
        { id: "a-12", text: "えほん", length: 3, emoji: "📖", illustration: "絵本" },
        { id: "a-13", text: "おかし", length: 3, emoji: "🍬", illustration: "お菓子" },
        { id: "a-14", text: "おもち", length: 3, emoji: "🍡", illustration: "お餅" },

        { id: "a-15", text: "あさがお", length: 4, emoji: "🌸", illustration: "朝顔" },
        { id: "a-16", text: "いのしし", length: 4, emoji: "🐗", illustration: "イノシシ" },
        { id: "a-17", text: "えんぴつ", length: 4, emoji: "✏️", illustration: "鉛筆" },
        { id: "a-18", text: "おにぎり", length: 4, emoji: "🍙", illustration: "おにぎり" },

        { id: "a-19", text: "おばあさん",   length: 5, emoji: "👵", illustration: "おばあさん" },
        { id: "a-20", text: "おじいさん",   length: 5, emoji: "👴", illustration: "おじいさん" },
        { id: "a-21", text: "うちゅうじん", length: 6, emoji: "👽", illustration: "宇宙人" }
      ]
    },
    { id: "ka", label: "か行", kana: ["か", "き", "く", "け", "こ"], words: [] },
    { id: "sa", label: "さ行", kana: ["さ", "し", "す", "せ", "そ"], words: [] },
    { id: "ta", label: "た行", kana: ["た", "ち", "つ", "て", "と"], words: [] },
    { id: "na", label: "な行", kana: ["な", "に", "ぬ", "ね", "の"], words: [] },
    { id: "ha", label: "は行", kana: ["は", "ひ", "ふ", "へ", "ほ"], words: [] },
    { id: "ma", label: "ま行", kana: ["ま", "み", "む", "め", "も"], words: [] },
    { id: "ya", label: "や行", kana: ["や", "ゆ", "よ"],            words: [] },
    { id: "ra", label: "ら行", kana: ["ら", "り", "る", "れ", "ろ"], words: [] },
    { id: "wa", label: "わ行", kana: ["わ", "を", "ん"],            words: [] }
  ]
};
