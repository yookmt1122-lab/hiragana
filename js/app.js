/* ============================================================
   ひらがなパズル — アプリ本体（バニラJS）
   画面: profile（だれが） → home（行えらび） → puzzle → stampbook
   ============================================================ */
(function () {
  "use strict";

  var DATA = window.HIRAGANA_DATA;
  var ICONS = ["🐱", "🐶", "🐰", "🐻", "🦁", "🐸", "🐼", "🦊"];
  var SEIKAI_IMGS = ["img/seikai_inu.png", "img/seikai_kuma.png", "img/seikai_neko.png", "img/seikai_usagi.png"];
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
    },
    session: function (pid, rowId) {
      try { return JSON.parse(localStorage.getItem("hp_sess_" + pid + "_" + rowId)) || null; }
      catch (e) { return null; }
    },
    saveSession: function (pid, rowId, data) {
      localStorage.setItem("hp_sess_" + pid + "_" + rowId, JSON.stringify(data));
    },
    clearSession: function (pid, rowId) {
      localStorage.removeItem("hp_sess_" + pid + "_" + rowId);
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
    // パズル画面から離れるとき、途中なら進捗を保存
    var activeScreen = document.querySelector(".screen--active");
    if (activeScreen && activeScreen.dataset.screen === "puzzle" && name !== "puzzle") {
      if (state.profileId && state.rowId && state.queue.length > 0 && state.index < state.queue.length) {
        Store.saveSession(state.profileId, state.rowId, {
          queueIds: state.queue.map(function (w) { return w.id; }),
          index: state.index
        });
      }
    }
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
      var unlocked = row.id === "a" || row.id === "ka" || row.id === "sa";
      var card = el("button", "row-card" + (unlocked ? "" : " row-card--locked"));
      card.textContent = row.label;

      if (unlocked) {
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

    // 前回の続きがあれば再開
    var saved = Store.session(state.profileId, rowId);
    if (saved && saved.queueIds && saved.index < saved.queueIds.length) {
      var wordMap = {};
      row.words.forEach(function (w) { wordMap[w.id] = w; });
      var restoredQueue = saved.queueIds.map(function (id) { return wordMap[id]; }).filter(Boolean);
      if (restoredQueue.length > 0 && saved.index < restoredQueue.length) {
        state.queue = restoredQueue;
        state.index = saved.index;
        show("puzzle");
        loadWord();
        return;
      }
    }

    // 最初から（みじかい単語から順に・同じ長さはシャッフル）
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
    if (state.index >= state.queue.length) {
      Store.clearSession(state.profileId, state.rowId);
      show("home");
      return;
    }

    var word = state.queue[state.index];
    state.word = word;
    state.target = word.text.split("");

    // ピース（固有idつき）。slot=null はトレイ、数値はそのマスに入っている
    state.pieces = shuffle(state.target.slice()).map(function (ch, i) {
      return { pid: i, ch: ch, slot: null };
    });

    // イラスト（今は絵文字。image があれば画像を優先）
    var img = $("#pictureImg");
    if (word.image) img.innerHTML = '<img src="' + word.image + '" alt="' + word.text + '">';
    else img.textContent = word.emoji || "🖼️";

    $("#puzzleProgress").textContent = (state.index + 1) + " / " + state.queue.length;

    renderBoard();
    setTimeout(function () { playWord(word); }, 350);
  }

  // ---- ピース取り出しヘルパー ----
  function pieceInSlot(i) {
    for (var k = 0; k < state.pieces.length; k++) if (state.pieces[k].slot === i) return state.pieces[k];
    return null;
  }
  function slotsFull() {
    for (var i = 0; i < state.target.length; i++) if (!pieceInSlot(i)) return false;
    return true;
  }

  function renderBoard() {
    // マス
    var box = $("#slots");
    box.innerHTML = "";
    for (var i = 0; i < state.target.length; i++) {
      var p = pieceInSlot(i);
      var s = el("div", "slot" + (p ? " slot--filled" : ""));
      s.dataset.index = i;
      if (p) {
        s.textContent = p.ch;
        attachDrag(s, p);
      }
      box.appendChild(s);
    }
    // トレイ（まだ置いていないピース）
    var tray = $("#tray");
    tray.innerHTML = "";
    state.pieces.forEach(function (p) {
      if (p.slot !== null) return;
      var b = el("button", "piece");
      b.textContent = p.ch;
      attachDrag(b, p);
      tray.appendChild(b);
    });
  }

  // ============================================================
  //  ドラッグ＆ドロップ（マウス／タッチ共通の Pointer Events）
  //  ・軽くタップしただけ → トレイのピースは先頭の空きマスへ自動で入る
  //  ・スロットのピースを軽くタップ → トレイに戻る
  // ============================================================
  var drag = null;

  function attachDrag(node, piece) {
    node.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      var rect = node.getBoundingClientRect();
      var ghost = el("div", "piece piece--ghost");
      ghost.textContent = piece.ch;
      ghost.style.width = rect.width + "px";
      ghost.style.height = rect.height + "px";
      document.body.appendChild(ghost);

      drag = {
        piece: piece, node: node, ghost: ghost,
        startX: e.clientX, startY: e.clientY, moved: false
      };
      node.classList.add("piece--dragging");
      moveGhost(e.clientX, e.clientY);
      document.addEventListener("pointermove", onDragMove);
      document.addEventListener("pointerup", onDragUp);
    });
  }

  function moveGhost(x, y) {
    if (!drag) return;
    drag.ghost.style.left = x + "px";
    drag.ghost.style.top = y + "px";
  }

  function onDragMove(e) {
    if (!drag) return;
    if (Math.abs(e.clientX - drag.startX) > 6 || Math.abs(e.clientY - drag.startY) > 6) drag.moved = true;
    moveGhost(e.clientX, e.clientY);
  }

  function onDragUp(e) {
    if (!drag) return;
    document.removeEventListener("pointermove", onDragMove);
    document.removeEventListener("pointerup", onDragUp);

    var d = drag;
    drag = null;
    if (d.ghost.parentNode) d.ghost.parentNode.removeChild(d.ghost);
    d.node.classList.remove("piece--dragging");

    if (!d.moved) {
      // 軽いタップ＝ドラッグしていない → 自動で配置／戻し
      if (d.piece.slot === null) {
        var empty = firstEmptySlot();
        if (empty !== -1) dropToSlot(d.piece, empty);
      } else {
        d.piece.slot = null;
        finishDrop();
      }
      return;
    }

    // ドラッグした → 指の位置の真下を調べる
    var el2 = document.elementFromPoint(e.clientX, e.clientY);
    var slotEl = el2 && el2.closest ? el2.closest(".slot") : null;
    if (slotEl) {
      dropToSlot(d.piece, parseInt(slotEl.dataset.index, 10));
    } else {
      // マス以外（トレイなど）に落とした → トレイへ戻す
      d.piece.slot = null;
      finishDrop();
    }
  }

  function firstEmptySlot() {
    for (var i = 0; i < state.target.length; i++) if (!pieceInSlot(i)) return i;
    return -1;
  }

  function dropToSlot(piece, index) {
    var occupant = pieceInSlot(index);
    if (occupant && occupant !== piece) {
      occupant.slot = piece.slot; // もといた場所へ入れ替え（null=トレイ）
    }
    piece.slot = index;
    speak(piece.ch);
    finishDrop();
  }

  function finishDrop() {
    renderBoard();
    if (slotsFull()) checkAnswer();
  }

  function checkAnswer() {
    var allCorrect = true;
    var slotNodes = $("#slots").children;
    for (var i = 0; i < state.target.length; i++) {
      var p = pieceInSlot(i);
      if (p && p.ch === state.target[i]) {
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
          var p = pieceInSlot(i);
          if (p && p.ch !== state.target[i]) p.slot = null;
        }
        renderBoard();
      }, 600);
    }
  }

  // ============================================================
  //  せいかい → スタンプ
  // ============================================================
  function success() {
    var rand = SEIKAI_IMGS[Math.floor(Math.random() * SEIKAI_IMGS.length)];
    $("#celebrateChar").src = rand;
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
        if (done) {
          var si = el("img", "stamp-cell__stamp");
          si.src = w.image || "img/stamp.png";
          si.alt = w.text;
          cell.appendChild(si);
        } else {
          cell.textContent = "・";
        }
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
