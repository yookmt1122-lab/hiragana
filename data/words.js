/*
 * ひらがなパズル — 単語データ
 * =========================================================
 * ■ 単語の追加方法
 *   1. 下の rows から追加したい行（例: か行 = id:"ka"）を探す
 *   2. その行の words 配列に { } を1つ足す
 *      例:  { id: "ka-20", text: "かめ", length: 2, emoji: "🐢", illustration: "カメ" },
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

    /* ========== あ行 ========== */
    {
      id: "a", label: "あ行", kana: ["あ", "い", "う", "え", "お"],
      words: [
        { id: "a-01", text: "あり",     length: 2, emoji: "🐜", image: "img/a/ari.png" },
        { id: "a-02", text: "いぬ",     length: 2, emoji: "🐶", image: "img/a/inu.png" },
        { id: "a-03", text: "いか",     length: 2, emoji: "🦑", image: "img/a/ika.png" },
        { id: "a-04", text: "うし",     length: 2, emoji: "🐮", image: "img/a/ushi.png" },
        { id: "a-05", text: "えび",     length: 2, emoji: "🦐", image: "img/a/ebi.png" },
        { id: "a-06", text: "おに",     length: 2, emoji: "👹", image: "img/a/oni.png" },

        { id: "a-07", text: "あひる",   length: 3, emoji: "🦆", image: "img/a/ahiru.png" },
        { id: "a-08", text: "あいす",   length: 3, emoji: "🍦", image: "img/a/aisu.png" },
        { id: "a-09", text: "いちご",   length: 3, emoji: "🍓", image: "img/a/ichigo.png" },
        { id: "a-10", text: "いるか",   length: 3, emoji: "🐬", image: "img/a/iruka.png" },
        { id: "a-11", text: "うなぎ",   length: 3, emoji: "🐟", image: "img/a/unagi.png" },

        { id: "a-12", text: "あさがお", length: 4, emoji: "🌸", image: "img/a/asagao.png" },
        { id: "a-13", text: "いのしし", length: 4, emoji: "🐗", image: "img/a/inoshishi.png" },
        { id: "a-14", text: "えんぴつ", length: 4, emoji: "✏️", image: "img/a/enpitsu.png" },
        { id: "a-15", text: "おだんご", length: 4, emoji: "🍡", image: "img/a/odango.png" },
        { id: "a-16", text: "おにぎり", length: 4, emoji: "🍙", image: "img/a/onigiri.png" },

        { id: "a-17", text: "おべんとう", length: 5, emoji: "🍱", image: "img/a/obentou.png" }
      ]
    },

    /* ========== か行（濁音ガ行含む） ========== */
    {
      id: "ka", label: "か行", kana: ["か", "き", "く", "け", "こ"],
      words: [
        { id: "ka-01", text: "かに",       length: 2, emoji: "🦀", illustration: "カニ" },
        { id: "ka-02", text: "かめ",       length: 2, emoji: "🐢", illustration: "カメ" },
        { id: "ka-03", text: "くつ",       length: 2, emoji: "👟", illustration: "くつ" },
        { id: "ka-04", text: "こい",       length: 2, emoji: "🐟", illustration: "コイ 鯉" },
        { id: "ka-05", text: "こま",       length: 2, emoji: "🪀", illustration: "こま 独楽" },

        { id: "ka-06", text: "かえる",     length: 3, emoji: "🐸", illustration: "カエル" },
        { id: "ka-07", text: "きつね",     length: 3, emoji: "🦊", illustration: "キツネ" },
        { id: "ka-08", text: "きりん",     length: 3, emoji: "🦒", illustration: "キリン" },
        { id: "ka-09", text: "くじら",     length: 3, emoji: "🐳", illustration: "クジラ" },
        { id: "ka-10", text: "くるま",     length: 3, emoji: "🚗", illustration: "車" },
        { id: "ka-11", text: "こたつ",     length: 3, emoji: "🛋️", illustration: "こたつ" },

        { id: "ka-12", text: "かわうそ",   length: 4, emoji: "🦦", illustration: "カワウソ" },
        { id: "ka-13", text: "くだもの",   length: 4, emoji: "🍎", illustration: "果物 くだもの" },
        { id: "ka-14", text: "こうもり",   length: 4, emoji: "🦇", illustration: "コウモリ" },

        { id: "ka-15", text: "かたつむり", length: 5, emoji: "🐌", illustration: "カタツムリ" }
      ]
    },

    /* ========== さ行（濁音ザ行含む） ========== */
    {
      id: "sa", label: "さ行", kana: ["さ", "し", "す", "せ", "そ"],
      words: [
        { id: "sa-01", text: "さる",       length: 2, emoji: "🐒", illustration: "サル 猿" },
        { id: "sa-02", text: "しか",       length: 2, emoji: "🦌", illustration: "シカ 鹿" },
        { id: "sa-03", text: "すし",       length: 2, emoji: "🍣", illustration: "寿司" },
        { id: "sa-04", text: "せみ",       length: 2, emoji: "🦗", illustration: "セミ 蝉" },
        { id: "sa-05", text: "そら",       length: 2, emoji: "🌤️", illustration: "空 青空" },
        { id: "sa-06", text: "さめ",       length: 2, emoji: "🦈", illustration: "サメ 鮫" },

        { id: "sa-07", text: "さかな",     length: 3, emoji: "🐟", illustration: "魚 さかな" },
        { id: "sa-08", text: "さくら",     length: 3, emoji: "🌸", illustration: "桜 さくら" },
        { id: "sa-09", text: "すいか",     length: 3, emoji: "🍉", illustration: "スイカ" },
        { id: "sa-10", text: "すずめ",     length: 3, emoji: "🐦", illustration: "スズメ 雀" },

        { id: "sa-11", text: "しまうま",   length: 4, emoji: "🦓", illustration: "シマウマ" },
        { id: "sa-12", text: "しろくま",   length: 4, emoji: "🐻‍❄️", illustration: "シロクマ 白熊" },
        { id: "sa-13", text: "そうじき",   length: 4, emoji: "🧹", illustration: "掃除機" },

        { id: "sa-14", text: "せんたくき", length: 5, emoji: "🫧", illustration: "洗濯機" }
      ]
    },

    /* ========== た行（濁音ダ行含む） ========== */
    {
      id: "ta", label: "た行", kana: ["た", "ち", "つ", "て", "と"],
      words: [
        { id: "ta-01", text: "たこ",       length: 2, emoji: "🐙", illustration: "タコ 蛸" },
        { id: "ta-02", text: "とり",       length: 2, emoji: "🐦", illustration: "鳥 とり" },
        { id: "ta-03", text: "つき",       length: 2, emoji: "🌙", illustration: "月 つき" },

        { id: "ta-04", text: "たいこ",     length: 3, emoji: "🥁", illustration: "太鼓 たいこ" },
        { id: "ta-05", text: "たぬき",     length: 3, emoji: "🦝", illustration: "タヌキ 狸" },
        { id: "ta-06", text: "つばめ",     length: 3, emoji: "🐦", illustration: "ツバメ 燕" },
        { id: "ta-07", text: "とかげ",     length: 3, emoji: "🦎", illustration: "トカゲ" },
        { id: "ta-08", text: "とまと",     length: 3, emoji: "🍅", illustration: "トマト" },
        { id: "ta-09", text: "とんぼ",     length: 3, emoji: "🪲", illustration: "トンボ 蜻蛉" },

        { id: "ta-10", text: "たこやき",   length: 4, emoji: "🍢", illustration: "たこ焼き" },
        { id: "ta-11", text: "てぶくろ",   length: 4, emoji: "🧤", illustration: "手袋" }
      ]
    },

    /* ========== な行 ========== */
    {
      id: "na", label: "な行", kana: ["な", "に", "ぬ", "ね", "の"],
      words: [
        { id: "na-01", text: "なべ",       length: 2, emoji: "🍲", illustration: "鍋 なべ" },
        { id: "na-02", text: "ねこ",       length: 2, emoji: "🐱", illustration: "猫 ねこ" },
        { id: "na-03", text: "にじ",       length: 2, emoji: "🌈", illustration: "虹 にじ" },

        { id: "na-04", text: "なまず",     length: 3, emoji: "🐟", illustration: "ナマズ" },
        { id: "na-05", text: "ねずみ",     length: 3, emoji: "🐭", illustration: "ネズミ 鼠" },
        { id: "na-06", text: "なすび",     length: 3, emoji: "🍆", illustration: "なす 茄子" },

        { id: "na-07", text: "にんじん",   length: 4, emoji: "🥕", illustration: "ニンジン 人参" },
        { id: "na-08", text: "のりもの",   length: 4, emoji: "🚗", illustration: "乗り物" },

        { id: "na-09", text: "ぬいぐるみ", length: 5, emoji: "🧸", illustration: "ぬいぐるみ" }
      ]
    },

    /* ========== は行（濁音バ行・半濁音パ行含む） ========== */
    {
      id: "ha", label: "は行", kana: ["は", "ひ", "ふ", "へ", "ほ"],
      words: [
        { id: "ha-01", text: "はな",       length: 2, emoji: "🌸", illustration: "花 はな" },
        { id: "ha-02", text: "ふね",       length: 2, emoji: "⛵", illustration: "船 ふね" },
        { id: "ha-03", text: "へび",       length: 2, emoji: "🐍", illustration: "ヘビ 蛇" },
        { id: "ha-04", text: "ほし",       length: 2, emoji: "⭐", illustration: "星 ほし" },
        { id: "ha-05", text: "はと",       length: 2, emoji: "🕊️", illustration: "ハト 鳩" },

        { id: "ha-06", text: "はさみ",     length: 3, emoji: "✂️", illustration: "ハサミ 鋏" },
        { id: "ha-07", text: "はなび",     length: 3, emoji: "🎆", illustration: "花火 はなび" },
        { id: "ha-08", text: "ひつじ",     length: 3, emoji: "🐑", illustration: "ヒツジ 羊" },
        { id: "ha-09", text: "ほたる",     length: 3, emoji: "✨", illustration: "ホタル 蛍" },

        { id: "ha-10", text: "ひこうき",   length: 4, emoji: "✈️", illustration: "飛行機" },
        { id: "ha-11", text: "ふじさん",   length: 4, emoji: "🗻", illustration: "富士山" },
        { id: "ha-12", text: "はくさい",   length: 4, emoji: "🥬", illustration: "白菜 はくさい" },

        { id: "ha-13", text: "はりねずみ", length: 5, emoji: "🦔", illustration: "ハリネズミ" }
      ]
    },

    /* ========== ま行 ========== */
    {
      id: "ma", label: "ま行", kana: ["ま", "み", "む", "め", "も"],
      words: [
        { id: "ma-01", text: "まめ",       length: 2, emoji: "🫘", illustration: "豆 まめ" },
        { id: "ma-02", text: "むし",       length: 2, emoji: "🐛", illustration: "虫 むし" },
        { id: "ma-03", text: "もり",       length: 2, emoji: "🌲", illustration: "森 もり" },

        { id: "ma-04", text: "まくら",     length: 3, emoji: "🛏️", illustration: "枕 まくら" },
        { id: "ma-05", text: "まつり",     length: 3, emoji: "🏮", illustration: "お祭り" },
        { id: "ma-06", text: "みかん",     length: 3, emoji: "🍊", illustration: "みかん 蜜柑" },
        { id: "ma-07", text: "めだか",     length: 3, emoji: "🐟", illustration: "メダカ" },

        { id: "ma-08", text: "ままごと",   length: 4, emoji: "🍳", illustration: "ままごと 子供 遊び" },
        { id: "ma-09", text: "みつばち",   length: 4, emoji: "🐝", illustration: "ミツバチ 蜜蜂" },

        { id: "ma-10", text: "ももたろう", length: 5, emoji: "🍑", illustration: "桃太郎" }
      ]
    },

    /* ========== や行 ========== */
    {
      id: "ya", label: "や行", kana: ["や", "ゆ", "よ"],
      words: [
        { id: "ya-01", text: "やぎ",       length: 2, emoji: "🐐", illustration: "ヤギ 山羊" },
        { id: "ya-02", text: "ゆき",       length: 2, emoji: "❄️", illustration: "雪 ゆき" },
        { id: "ya-03", text: "やま",       length: 2, emoji: "🏔️", illustration: "山 やま" },

        { id: "ya-04", text: "やさい",     length: 3, emoji: "🥦", illustration: "野菜 やさい" },
        { id: "ya-05", text: "やかん",     length: 3, emoji: "🫖", illustration: "やかん 薬缶" },
        { id: "ya-06", text: "ゆびわ",     length: 3, emoji: "💍", illustration: "指輪 ゆびわ" },

        { id: "ya-07", text: "やきとり",   length: 4, emoji: "🍢", illustration: "焼き鳥" },
        { id: "ya-08", text: "ゆうやけ",   length: 4, emoji: "🌅", illustration: "夕焼け ゆうやけ" },

        { id: "ya-09", text: "ゆきだるま", length: 5, emoji: "⛄", illustration: "雪だるま" }
      ]
    },

    /* ========== ら行 ========== */
    {
      id: "ra", label: "ら行", kana: ["ら", "り", "る", "れ", "ろ"],
      words: [
        { id: "ra-01", text: "りす",       length: 2, emoji: "🐿️", illustration: "リス 栗鼠" },
        { id: "ra-02", text: "ろば",       length: 2, emoji: "🐴", illustration: "ロバ" },

        { id: "ra-03", text: "らくだ",     length: 3, emoji: "🐪", illustration: "ラクダ 駱駝" },
        { id: "ra-04", text: "りんご",     length: 3, emoji: "🍎", illustration: "リンゴ 林檎" },

        { id: "ra-05", text: "らいおん",   length: 4, emoji: "🦁", illustration: "ライオン" },
        { id: "ra-06", text: "ろうそく",   length: 4, emoji: "🕯️", illustration: "ろうそく 蝋燭" }
      ]
    },

    /* ========== わ行 ========== */
    {
      id: "wa", label: "わ行", kana: ["わ", "を", "ん"],
      words: [
        { id: "wa-01", text: "わに",       length: 2, emoji: "🐊", illustration: "ワニ 鰐" },
        { id: "wa-02", text: "わし",       length: 2, emoji: "🦅", illustration: "ワシ 鷲" },

        { id: "wa-03", text: "わかめ",     length: 3, emoji: "🌿", illustration: "わかめ 若布" },

        { id: "wa-04", text: "わたあめ",   length: 4, emoji: "🍭", illustration: "綿あめ わたあめ" }
      ]
    }

  ]
};
