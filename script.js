(function(){
  const C = window.CONFIG;

  const titleEl = document.getElementById("title");
  const subtitleEl = document.getElementById("subtitle");
  const contentEl = document.getElementById("content");

  // Music
  const musicBar = document.getElementById("musicBar");
  const musicBtn = document.getElementById("musicBtn");
  let audio = null;
  let musicOn = false;

  function setupMusic(){
    if(!C.music?.enabled) return;
    musicBar.hidden = false;

    audio = new Audio(C.music.musicUrl);
    audio.loop = true;
    audio.volume = C.music.volume ?? 0.5;

    musicBtn.textContent = C.music.startText || "🎵 Play Music";

    musicBtn.addEventListener("click", async () => {
      try{
        if(!musicOn){
          await audio.play();
          musicOn = true;
          musicBtn.textContent = C.music.stopText || "🔇 Stop Music";
        } else {
          audio.pause();
          musicOn = false;
          musicBtn.textContent = C.music.startText || "🎵 Play Music";
        }
      }catch(e){
        // Autoplay blocked until user gesture — button click is a gesture,
        // but some browsers still block if not allowed.
        alert("Tap again if music doesn't start (browser autoplay rules). 💖");
        console.error(e);
      }
    });

    // Attempt autoplay (may be blocked — normal)
    if(C.music.autoplay){
      audio.play().then(()=>{
        musicOn = true;
        musicBtn.textContent = C.music.stopText || "🔇 Stop Music";
      }).catch(()=>{ /* ignore */ });
    }
  }

  // Floating emojis
  function spawnFloat(){
    const emojiSets = [...(C.floatingEmojis.hearts||[]), ...(C.floatingEmojis.bears||[])];
    if(!emojiSets.length) return;

    const el = document.createElement("div");
    el.className = "float";
    el.textContent = emojiSets[Math.floor(Math.random()*emojiSets.length)];
    el.style.left = Math.random()*100 + "vw";
    el.style.setProperty("--floatDur", C.animations.floatDuration || "15s");
    const dist = (Math.random() * 2 - 1) * (parseInt(C.animations.floatDistance||"50") || 50);
    el.style.setProperty("--floatDist", dist + "px");
    el.style.fontSize = (20 + Math.random()*18) + "px";
    document.body.appendChild(el);

    el.addEventListener("animationend", ()=> el.remove());
  }

  // Screens
  function renderQ1(){
    titleEl.textContent = `${C.valentineName}`;
    subtitleEl.textContent = C.questions.first.text;

    contentEl.innerHTML = `
      <div class="row">
        <button class="btn" id="q1yes">${C.questions.first.yesBtn}</button>
        <button class="btn" id="q1no">${C.questions.first.noBtn}</button>
      </div>
      <p id="secret" style="margin:14px 0 0; opacity:0.9;"></p>
    `;

    const secret = document.getElementById("secret");
    const noBtn = document.getElementById("q1no");

    noBtn.addEventListener("mouseenter", () => {
      secret.textContent = C.questions.first.secretAnswer;
    });
    noBtn.addEventListener("mouseleave", () => {
      secret.textContent = "";
    });

    document.getElementById("q1yes").onclick = renderQ2;
    document.getElementById("q1no").onclick = renderQ2;
  }

  function renderQ2(){
    subtitleEl.textContent = C.questions.second.text;

    contentEl.innerHTML = `
      <div class="progress-wrap">
        <div class="big"><span id="meterText">${C.questions.second.startText}</span>
          <span id="pct">100%</span>
        </div>
        <input id="range" type="range" min="100" max="5000" value="100" />
        <div style="margin-top:12px;">
          <button class="btn" id="q2next">${C.questions.second.nextBtn}</button>
        </div>
        <p id="msg" style="margin:12px 0 0; opacity:0.9;"></p>
      </div>
    `;

    const range = document.getElementById("range");
    const pct = document.getElementById("pct");
    const msg = document.getElementById("msg");

    function update(){
      const v = Number(range.value);
      pct.textContent = `${v}%`;
      if(v >= 5000) msg.textContent = C.loveMessages.extreme;
      else if(v >= 1000) msg.textContent = C.loveMessages.high;
      else if(v > 100) msg.textContent = C.loveMessages.normal;
      else msg.textContent = "";
    }
    range.addEventListener("input", update);
    update();

    document.getElementById("q2next").onclick = renderQ3;
  }

  // ✅ FINAL QUESTION with your special NO logic
  function renderQ3(){
    subtitleEl.textContent = C.questions.third.text;

    contentEl.innerHTML = `
      <div class="row">
        <button class="btn btn-yes" id="q3yes">${C.questions.third.yesBtn}</button>
        <button class="btn btn-no" id="q3no">${C.questions.third.noBtn}</button>
      </div>
    `;

    const yesBtn = document.getElementById("q3yes");
    const noBtn  = document.getElementById("q3no");

    // Add NO->phrases and YES->grow behavior
    const phrases = C.questions.third.noPhrases || [];
    const step = C.questions.third.yesGrowStep ?? 0.18;
    const maxScale = C.questions.third.yesMaxScale ?? 2.2;

    let i = 0;
    let scale = 1;

    noBtn.addEventListener("click", () => {
      // Change NO text
      if(i < phrases.length){
        noBtn.textContent = phrases[i];
        i++;
      }

      // Grow YES only while phrases are still changing
      if(i <= phrases.length){
        scale = Math.min(maxScale, scale + step);
        yesBtn.style.transform = `scale(${scale})`;
      }

      // Shake NO for fun
      noBtn.classList.remove("shake");
      void noBtn.offsetWidth;
      noBtn.classList.add("shake");
    });

    yesBtn.addEventListener("click", renderCelebrate);
  }

  function renderCelebrate(){
    subtitleEl.textContent = C.celebration.title;
    contentEl.innerHTML = `
      <div class="celebrate">
        <p>${C.celebration.message}</p>
        <p style="font-size:26px; margin:10px 0 0;">${C.celebration.emojis}</p>
      </div>
    `;
  }

  // Boot
  setupMusic();
  renderQ1();
  setInterval(spawnFloat, 450);
})();
