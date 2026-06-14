/* ============================================================
   ひらがなパズル — アプリ本体（バニラJS）
   画面: profile（だれが） → home（行えらび） → puzzle → stampbook
   ============================================================ */
(function () {
  "use strict";

  var DATA = window.HIRAGANA_DATA;
  var ICONS = ["🐱", "🐶", "🐰", "🐻", "🦁", "🐸", "🐼", "🦊"];
  var MAX_PROFILES = 5;

  // ---- ちいさなヘルパー ----
  function $(sel) { return document.querySelector(sel); }
  function el(tag, cls) { var n = document.createElement(tag); if (cls) n.className = cls; return n; }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // ============================================================
  //  音声  ※今は読み上げAPI。あとで VOICEVOX の mp3 に差し替える窓口。
  //  word に audio:"audio/xxx.mp3" を足せば、その mp3 を優先再生します。
  // ============================================================
  function speak(text) {
    try {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = "ja-JP";
      u.rate = 0.85;
      u.pitch = 1.2;
      window.speechSynthesis.speak(u);
    } catch (e) { /* 音声が使えない環境では黙って無視 */ }
  }
  function playWord(word) {
    if (word.audio) { try { new Audio(word.audio).play(); return; } catch (e) {} }
    speak(word.text);
  }

  // ============================================================
  //  保存（localStorage）  プロフィールごとに進捗を分けて保存
  // ============================================================
  var Store = {
    profiles: function () {
      try { return JSON.parse(localStorage.getItem("hp_profiles")) || []; }
      catch (e) { return []; }
    },
    saveProfiles: function (list) { localStorage.setItem("hp_profiles", JSON.stringify(list)); },
    progress: function (pid) {
      try { return JSON.parse(localStorage.getItem("hp_prog_" + pid)) || { cleared: [] }; }
      catch (e) { return { cleared: [] }; }
    },
    saveProgress: function (pid, prog) { localStorage.setItem("hp_prog_" + pid, JSON.stringify(prog)); },
    addCleared: function (pid, wordId) {
      var p = this.progress(pid);
      if (p.cleared.indexOf(wordId) === -1) p.cleared.push(wordId);
      this.saveProgress(pid, p);
    }
  };

  // ---- いまの状態 ----
  var state = {
    profileId: null,
    rowId: null,
    queue: [],     // この行で出題する単語の並び
    index: 0,      // 何問目か
    word: null,    // いま出している単語
    target: [],    // 正解の文字ならび
    slots: [],     // 各スロットに入っている文字（null=空）
    newIcon: ICONS[0]
  };

  // ============================================================
  //  画面切り替え
  // ============================================================
  function show(name) {
    var screens = document.querySelectorAll(".screen");
    for (var i = 0; i < screens.length; i++) {
      screens[i].classList.toggle("screen--active", screens[i].dataset.screen === name);
    }
    if (name === "profile") renderProfiles();
    if (name === "home") renderHome();
    if (name === "stampbook") renderStampbook();
  }

  // ============================================================
  //  プロフィール画面
  // ============================================================
  function renderProfiles() {
    var list = $("#profileList");
    list.innerHTML = "";
    var profiles = Store.profiles();

    profiles.forEach(function (p) {
      var li = el("li");
      var card = el("button", "profile-card");
      card.innerHTML = '<span class="profile-card__icon">' + p.icon + '</span>' +
                       '<span class="profile-card__name">' + p.name + '</span>';
      card.addEventListener("click", function () {
        state.profileId = p.id;
        show("home");
      });
      li.appendChild(card);
      list.appendChild(li);
    });

    if (profiles.length < MAX_PROFILES) {
      var li2 = el("li");
      var add = el("button", "profile-card profile-card--add");
      add.innerHTML = '<span class="profile-card__icon">＋</span>' +
                      '<span class="profile-card__name">あたらしく つくる</span>';
      add.addEventListener("click", openCreate);
      li2.appendChild(add);
      list.appendChild(li2);
    }
    $("#profileCreate").hidden = true;
  }

  function openCreate() {
    $("#profileCreate").hidden = false;
    $("#newName").value = "";
    state.newIcon = ICONS[0];
    var grid = $("#iconGrid");
    grid.innerHTML = "";
    ICONS.forEach(function (ic) {
      var b = el("button", "icon-grid__item");
      b.textContent = ic;
      if (ic === state.newIcon) b.classList.add("icon-grid__item--selected");
      b.addEventListener("click", function () {
        state.newIcon = ic;
        var all = grid.querySelectorAll(".icon-grid__item");
        for (var i = 0; i < all.length; i++) all[i].classList.remove("icon-grid__item--selected");
        b.classList.add("icon-grid__item--selected");
      });
      grid.appendChild(b);
    });
  }

  function createProfile() {
    var name = ($("#newName").value || "").trim() || "あなた";
    var profiles = Store.profiles();
    profiles.push({ id: "p" + Date.now(), name: name, icon: state.newIcon });
    Store.saveProfiles(profiles);
    renderProfiles();
  }

  // ============================================================
  //  行えらび画面
  // ============================================================
  function renderHome() {
    var p = findProfile(state.profileId);
    $("#homeWho").textContent = p ? p.icon + " " + p.name : "";

    var list = $("#rowList");
    list.innerHTML = "";
    var prog = Store.progress(state.profileId);

    DATA.rows.forEach(function (row) {
      var li = el("li");
      var hasWords = row.words.length > 0;
      var card = el("button", "row-card" + (hasWords ? "" : " row-card--locked"));
      card.textContent = row.label;

      if (hasWords) {
        var done = row.words.filter(function (w) { return prog.cleared.indexOf(w.id) !== -1; }).length;
        var d = el("span", "row-card__done");
        d.textContent = "⭐️" + done + "/" + row.words.length;
        card.appendChild(d);
        card.addEventListener("click", function () { startRow(row.id); });
      } else {
        var lock = el("span", "row-card__lock");
        lock.textContent = "🔒";
        card.appendChild(lock);
      }
      li.appendChild(card);
      list.appendChild(li);
    });
  }

  function findProfile(id) {
    var list = Store.profiles();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  // ============================================================
  //  パズル開始・出題
  // ============================================================
  function startRow(rowId) {
    state.rowId = rowId;
    var row = DATA.rows.filter(function (r) { return r.id === rowId; })[0];
    // みじかい単語から順に（同じ長さの中はシャッフル）
    var byLen = {};
    row.words.forEach(function (w) { (byLen[w.length] = byLen[w.length] || []).push(w); });
    var queue = [];
    Object.keys(byLen).sort(function (a, b) { return a - b; }).forEach(function (k) {
      queue = queue.concat(shuffle(byLen[k]));
    });
    state.queue = queue;
    state.index = 0;
    show("puzzle");
    loadWord();
  }

  function loadWord() {
    $("#celebrate").hidden = true;
    if (state.index >= state.queue.length) { show("home"); return; }

    var word = state.queue[state.index];
    state.word = word;
    state.target = word.text.split("");
    state.slots = state.target.map(function () { return null; });

    // イラスト（今は絵文字。image があれば画像を優先）
    var img = $("#pictureImg");
    if (word.image) img.innerHTML = '<img src="' + word.image + '" alt="' + word.text + '">';
    else img.textContent = word.emoji || "🖼️";

    $("#puzzleProgress").textContent = (state.index + 1) + " / " + state.queue.length;

    renderSlots();
    renderTray(shuffle(state.target.slice()));
    setTimeout(function () { playWord(word); }, 350);
  }

  function renderSlots() {
    var box = $("#slots");
    box.innerHTML = "";
    state.slots.forEach(function (ch, i) {
      var s = el("div", "slot" + (ch ? " slot--filled" : ""));
      s.textContent = ch || "";
      if (ch) {
        s.addEventListener("click", function () { removeFromSlot(i); });
      }
      box.appendChild(s);
    });
  }

  function renderTray(chars) {
    var tray = $("#tray");
    tray.innerHTML = "";
    // すでにスロットに入っている分を差し引いて、残りをトレイに出す
    var remaining = chars.slice();
    state.slots.forEach(function (ch) {
      if (ch) {
        var idx = remaining.indexOf(ch);
        if (idx !== -1) remaining.splice(idx, 1);
      }
    });
    state._trayChars = chars;
    remaining.forEach(function (ch) {
      var b = el("button", "piece");
      b.textContent = ch;
      b.addEventListener("click", function () { placeChar(ch); });
      tray.appendChild(b);
    });
  }

  function placeChar(ch) {
    var empty = state.slots.indexOf(null);
    if (empty === -1) return;
    state.slots[empty] = ch;
    speak(ch);
    renderSlots();
    renderTray(state._trayChars);
    if (state.slots.indexOf(null) === -1) checkAnswer();
  }

  function removeFromSlot(i) {
    if (!state.slots[i]) return;
    state.slots[i] = null;
    renderSlots();
    renderTray(state._trayChars);
  }

  function checkAnswer() {
    var allCorrect = true;
    var slotNodes = $("#slots").children;
    for (var i = 0; i < state.target.length; i++) {
      if (state.slots[i] === state.target[i]) {
        slotNodes[i].classList.add("slot--correct");
      } else {
        allCorrect = false;
        slotNodes[i].classList.add("slot--wrong");
      }
    }
    if (allCorrect) {
      setTimeout(success, 500);
    } else {
      // まちがえた所だけ もどす（合っている所は残す＝はげまし）
      setTimeout(function () {
        for (var i = 0; i < state.target.length; i++) {
          if (state.slots[i] !== state.target[i]) state.slots[i] = null;
        }
        renderSlots();
        renderTray(state._trayChars);
      }, 600);
    }
  }

  // ============================================================
  //  せいかい → スタンプ
  // ============================================================
  function success() {
    playWord(state.word);
    $("#celebrate").hidden = false;
  }

  function stampIt() {
    Store.addCleared(state.profileId, state.word.id);
    $("#celebrate").hidden = true;
    state.index++;
    loadWord();
  }

  // ============================================================
  //  スタンプちょう
  // ============================================================
  function renderStampbook() {
    var p = findProfile(state.profileId);
    $("#bookWho").textContent = p ? p.icon + " " + p.name : "";

    var prog = Store.progress(state.profileId);
    var book = $("#stampbook");
    book.innerHTML = "";

    // 今あそべる行（単語がある行）をすべて表示
    DATA.rows.filter(function (r) { return r.words.length > 0; }).forEach(function (row) {
      row.words.forEach(function (w) {
        var done = prog.cleared.indexOf(w.id) !== -1;
        var cell = el("div", "stamp-cell " + (done ? "stamp-cell--done" : "stamp-cell--empty"));
        cell.textContent = done ? (w.emoji || "⭐️") : "・";
        var label = el("span", "stamp-cell__word");
        label.textContent = w.text;
        cell.appendChild(label);
        if (done) cell.addEventListener("click", function () { playWord(w); });
        book.appendChild(cell);
      });
    });
  }

  // ============================================================
  //  イベント結線
  // ============================================================
  function bind() {
    // 各画面の「もどる/すすむ」ボタン
    document.querySelectorAll("[data-go]").forEach(function (b) {
      b.addEventListener("click", function () { show(b.dataset.go); });
    });
    $("#createBtn").addEventListener("click", createProfile);
    $("#cancelCreateBtn").addEventListener("click", function () { $("#profileCreate").hidden = true; });
    $("#replayBtn").addEventListener("click", function () { if (state.word) playWord(state.word); });
    $("#picture").addEventListener("click", function () { if (state.word) playWord(state.word); });
    $("#stampBtn").addEventListener("click", stampIt);
  }

  bind();
  show("profile");
})();
