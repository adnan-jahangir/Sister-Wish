/* ============================================================
   BIRTHDAY WEBSITE — JAVASCRIPT
   Confetti · Floating elements · Flip cards · Typewriter
   ============================================================ */

// Wait for the DOM to be ready
document.addEventListener("DOMContentLoaded", () => {

  /* ===========================================================
     1. CONFETTI ANIMATION (runs once on page load)
     =========================================================== */
  const confettiCanvas = document.getElementById("confetti-canvas");
  const ctx = confettiCanvas.getContext("2d");

  // Resize canvas to fill the viewport
  function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Confetti colours (pastel palette)
  const CONFETTI_COLORS = [
    "#FFD1DC", "#E0BBE4", "#C7CEEA",
    "#B5EAD7", "#FFDFD3", "#FFF5BA",
    "#F4A6C1", "#C89FD6"
  ];

  // Array to hold confetti pieces
  let confettiPieces = [];

  // Create a single confetti piece object
  function createConfettiPiece() {
    return {
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height, // start above
      w: Math.random() * 10 + 6,
      h: Math.random() * 6 + 4,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
      speedY: Math.random() * 3 + 2,
      speedX: (Math.random() - 0.5) * 2,
      opacity: 1
    };
  }

  // Spawn initial batch
  const CONFETTI_COUNT = 150;
  for (let i = 0; i < CONFETTI_COUNT; i++) {
    confettiPieces.push(createConfettiPiece());
  }

  // Animate confetti
  let confettiRunning = true;

  function animateConfetti() {
    if (!confettiRunning) {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      return;
    }

    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiPieces.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;
      // Fade out when near bottom
      if (p.y > confettiCanvas.height * 0.75) {
        p.opacity -= 0.015;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(p.opacity, 0);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    // Remove fully faded pieces
    confettiPieces = confettiPieces.filter((p) => p.opacity > 0);

    if (confettiPieces.length === 0) {
      confettiRunning = false;
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      return;
    }

    requestAnimationFrame(animateConfetti);
  }

  requestAnimationFrame(animateConfetti);

  /* ===========================================================
     1b. EMOTIONAL HEARTS CANVAS (memories page background)
     Gentle translucent hearts floating upward
     =========================================================== */
  const heartsCanvas = document.getElementById("hearts-canvas");

  if (heartsCanvas) {
    const hCtx = heartsCanvas.getContext("2d");

    function resizeHeartsCanvas() {
      heartsCanvas.width = window.innerWidth;
      heartsCanvas.height = window.innerHeight;
    }
    resizeHeartsCanvas();
    window.addEventListener("resize", resizeHeartsCanvas);

    const heartParticles = [];
    const HEART_COUNT = 35;

    // Pastel heart colours
    const HEART_COLORS = [
      "rgba(255,209,220,.45)",  // pink
      "rgba(224,187,228,.4)",   // purple
      "rgba(244,166,193,.35)",  // dark pink
      "rgba(199,206,234,.4)",   // lavender
      "rgba(200,159,214,.35)"   // deep purple
    ];

    // Draw a heart shape on canvas
    function drawHeart(ctx, x, y, size, color) {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.4);
      ctx.bezierCurveTo(-size * 0.5, -size, -size, -size * 0.4, 0, size * 0.5);
      ctx.moveTo(0, -size * 0.4);
      ctx.bezierCurveTo(size * 0.5, -size, size, -size * 0.4, 0, size * 0.5);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    }

    function createHeartParticle() {
      return {
        x: Math.random() * heartsCanvas.width,
        y: heartsCanvas.height + Math.random() * 100,
        size: Math.random() * 16 + 8,
        speedY: Math.random() * 0.8 + 0.3,
        speedX: (Math.random() - 0.5) * 0.4,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
        opacity: Math.random() * 0.4 + 0.2
      };
    }

    // Initialise heart particles
    for (let i = 0; i < HEART_COUNT; i++) {
      const p = createHeartParticle();
      p.y = Math.random() * heartsCanvas.height; // spread initially
      heartParticles.push(p);
    }

    function animateHearts() {
      hCtx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);

      heartParticles.forEach((p) => {
        p.y -= p.speedY;
        p.wobble += p.wobbleSpeed;
        p.x += Math.sin(p.wobble) * 0.5 + p.speedX;

        // Reset when off top
        if (p.y < -30) {
          p.y = heartsCanvas.height + 20;
          p.x = Math.random() * heartsCanvas.width;
        }

        hCtx.globalAlpha = p.opacity;
        drawHeart(hCtx, p.x, p.y, p.size, p.color);
      });

      hCtx.globalAlpha = 1;
      requestAnimationFrame(animateHearts);
    }

    requestAnimationFrame(animateHearts);
  }

  /* ===========================================================
     2. FLOATING BACKGROUND ELEMENTS (hearts, stars, balloons)
     =========================================================== */
  const floatingContainer = document.querySelector(".floating-elements");

  // Only run on pages that have the floating-elements container (wish.html)
  if (floatingContainer) {
    // Emojis used for floating decorations – feel free to customise!
    const FLOATING_EMOJIS = ["💖", "🎈", "⭐", "🌸", "✨", "💜", "🎀", "🩷"];

    // Number of floating items
    const FLOATING_COUNT = 20;

    function spawnFloatingItems() {
      for (let i = 0; i < FLOATING_COUNT; i++) {
        const el = document.createElement("span");
        el.classList.add("floating-item");
        el.textContent = FLOATING_EMOJIS[Math.floor(Math.random() * FLOATING_EMOJIS.length)];

        // Randomise position and timing
        el.style.left = Math.random() * 100 + "%";
        el.style.bottom = -(Math.random() * 40) + "px";
        el.style.fontSize = (Math.random() * 1.2 + 1) + "rem";
        el.style.animationDuration = (Math.random() * 8 + 8) + "s";
        el.style.animationDelay = (Math.random() * 10) + "s";

        floatingContainer.appendChild(el);
      }
    }
    spawnFloatingItems();
  }

  /* ===========================================================
     3. FLIP CARDS — 3‑D MEMORY GALLERY (memories.html)
     Hover = quick peek (CSS). Click = hold flipped (JS toggle).
     =========================================================== */
  const cardContainers = document.querySelectorAll(".card-container");

  cardContainers.forEach((container) => {
    container.addEventListener("click", (e) => {
      // Toggle the "flipped" class so the card stays flipped on click
      container.classList.toggle("flipped");

      // Spawn a small heart animation at click position
      spawnClickHeart(e.clientX, e.clientY);
    });
  });

  /* ===========================================================
     5. CLICK-HEART ANIMATION (appears when clicking a card)
     =========================================================== */
  const clickHeartsContainer = document.getElementById("click-hearts");

  function spawnClickHeart(x, y) {
    const HEARTS = ["💖", "💕", "💗", "💓", "🩷"];
    // Spawn a few hearts
    for (let i = 0; i < 5; i++) {
      const heart = document.createElement("span");
      heart.classList.add("click-heart");
      heart.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];

      // Position near the click with slight random offset
      heart.style.left = (x + (Math.random() - 0.5) * 40) + "px";
      heart.style.top = (y + (Math.random() - 0.5) * 30) + "px";
      heart.style.fontSize = (Math.random() * 0.8 + 1.2) + "rem";

      clickHeartsContainer.appendChild(heart);

      // Remove after animation ends
      heart.addEventListener("animationend", () => heart.remove());
    }
  }

  /* ===========================================================
     4. SPECIAL MESSAGE MODAL + TYPEWRITER EFFECT (note.html)
     =========================================================== */
  const readMsgBtn   = document.getElementById("read-message-btn");
  const modal        = document.getElementById("message-modal");
  const closeBtn     = document.getElementById("close-modal-btn");
  const typewriterEl = document.getElementById("typewriter-text");

  // Only run on the note page where these elements exist
  if (readMsgBtn && modal && closeBtn && typewriterEl) {
    // The full message is stored in a data attribute so it's easy to change in HTML.
    const fullMessage  = typewriterEl.getAttribute("data-message");
    let typewriterTimeout = null;

    // Open modal
    readMsgBtn.addEventListener("click", () => {
      modal.classList.add("open");
      startTypewriter();
    });

    // Close modal
    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(); // click outside to close
    });

    function closeModal() {
      modal.classList.remove("open");
      // Reset typewriter so it replays next time
      clearTimeout(typewriterTimeout);
      typewriterEl.textContent = "";
      typewriterEl.classList.remove("done");
    }

    // Typewriter: types one character at a time
    function startTypewriter() {
      typewriterEl.textContent = "";
      typewriterEl.classList.remove("done");
      let index = 0;

      function type() {
        if (index < fullMessage.length) {
          typewriterEl.textContent += fullMessage.charAt(index);
          index++;
          // Slightly variable speed for natural feel
          const delay = Math.random() * 25 + 28;
          typewriterTimeout = setTimeout(type, delay);
        } else {
          // Typing complete – hide cursor
          typewriterEl.classList.add("done");
        }
      }
      type();
    }
  }

  /* ===========================================================
     5. INTERSECTION OBSERVER — FADE-IN ON SCROLL
     =========================================================== */
  const fadeEls = document.querySelectorAll(".fade-in");

  const observerOptions = {
    root: null,       // viewport
    threshold: 0.15   // trigger when 15 % visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // only animate once
      }
    });
  }, observerOptions);

  fadeEls.forEach((el) => observer.observe(el));

  /* ===========================================================
     6. SPARKLE TRAIL — cursor leaves tiny sparkles on move
     =========================================================== */
  const SPARKLES = ["✨", "💖", "⭐", "🌸", "✨"];
  let lastSparkle = 0;

  document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    // Throttle: one sparkle every 120ms for performance
    if (now - lastSparkle < 120) return;
    lastSparkle = now;

    const spark = document.createElement("span");
    spark.classList.add("sparkle");
    spark.textContent = SPARKLES[Math.floor(Math.random() * SPARKLES.length)];
    spark.style.left = (e.clientX + (Math.random() - 0.5) * 20) + "px";
    spark.style.top = (e.clientY + (Math.random() - 0.5) * 20) + "px";
    document.body.appendChild(spark);

    spark.addEventListener("animationend", () => spark.remove());
  });

  /* ===========================================================
     7. EXTRA — RE-TRIGGER CONFETTI ON DEMAND (optional)
     =========================================================== */
  window.launchConfetti = function (count = 100) {
    confettiRunning = true;
    for (let i = 0; i < count; i++) {
      confettiPieces.push(createConfettiPiece());
    }
    requestAnimationFrame(animateConfetti);
  };

  /* ===========================================================
     7b. HAPPY BIRTHDAY MELODY (Web Audio API — no files needed)
     Plays a chime-like "Happy Birthday" tune.
     =========================================================== */
  let audioCtx = null;

  // Note frequencies (Hz)
  const NOTE = {
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
    G4: 392.00, A4: 440.00, Bb4: 466.16, C5: 523.25,
    D5: 587.33, E5: 659.25, F5: 698.46
  };

  // "Happy Birthday" melody: [frequency, duration in beats]
  const BIRTHDAY_MELODY = [
    [NOTE.C4, 0.75], [NOTE.C4, 0.25], [NOTE.D4, 1], [NOTE.C4, 1], [NOTE.F4,  1], [NOTE.E4, 2],   // Happy birthday to you
    [NOTE.C4, 0.75], [NOTE.C4, 0.25], [NOTE.D4, 1], [NOTE.C4, 1], [NOTE.G4,  1], [NOTE.F4, 2],   // Happy birthday to you
    [NOTE.C4, 0.75], [NOTE.C4, 0.25], [NOTE.C5, 1], [NOTE.A4, 1], [NOTE.F4,  1], [NOTE.E4, 1], [NOTE.D4, 2], // Happy birthday dear sis
    [NOTE.Bb4, 0.75],[NOTE.Bb4,0.25], [NOTE.A4, 1], [NOTE.F4, 1], [NOTE.G4,  1], [NOTE.F4, 2],   // Happy birthday to you
  ];

  function playBirthdayMelody() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();

      const tempo = 220; // ms per beat — adjusts speed
      let time = audioCtx.currentTime + 0.05;

      BIRTHDAY_MELODY.forEach(([freq, beats]) => {
        const dur = beats * tempo / 1000;

        // Main tone (soft sine)
        const osc = audioCtx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;

        // Gentle gain envelope
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.18, time + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur * 0.95);

        // Shimmer overtone (one octave up, quieter)
        const osc2 = audioCtx.createOscillator();
        osc2.type = "sine";
        osc2.frequency.value = freq * 2;
        const gain2 = audioCtx.createGain();
        gain2.gain.setValueAtTime(0, time);
        gain2.gain.linearRampToValueAtTime(0.04, time + 0.04);
        gain2.gain.exponentialRampToValueAtTime(0.001, time + dur * 0.7);

        osc.connect(gain).connect(audioCtx.destination);
        osc2.connect(gain2).connect(audioCtx.destination);

        osc.start(time);
        osc.stop(time + dur);
        osc2.start(time);
        osc2.stop(time + dur);

        time += dur;
      });
    } catch (e) {
      // Audio not supported — fail silently
    }
  }

  // Expose globally so other sections can call it
  window.playBirthdayMelody = playBirthdayMelody;

  /* ===========================================================
     8. BALLOON-POP INTRO ANIMATION (wish.html only)
     Cat shoots arrow → balloon pops → wish content reveals
     Arrow is positioned & aimed entirely by JS so it works
     perfectly on every screen size.
     =========================================================== */
  const balloonScene = document.getElementById("balloon-scene");

  if (balloonScene) {
    const baby         = document.getElementById("baby");
    const arrow        = document.getElementById("arrow");
    const balloonGroup = document.getElementById("balloon-group");
    const balloon      = document.getElementById("balloon");
    const popParticles = document.getElementById("pop-particles");
    const scenePrompt  = document.getElementById("scene-prompt");
    const wishContent  = document.getElementById("wish-content");

    let hasShot = false;

    // If animation already played this session, skip straight to wish
    if (sessionStorage.getItem("balloonPopped")) {
      balloonScene.style.display = "none";
      wishContent.style.display = "flex";
      wishContent.classList.add("reveal");
    } else {

    // ── Helpers: get key points in scene-relative coords ──

    function sceneOffset() {
      return balloonScene.getBoundingClientRect();
    }

    // Bow nock point: where the bowstring center is in the cat SVG.
    // Cat SVG viewBox = 0 0 200 240. Bow is at translate(170,90),
    // string midpoint ≈ SVG-space (170, 112).
    function getBowNock() {
      const svg  = baby.querySelector("svg");
      const r    = svg.getBoundingClientRect();
      const s    = sceneOffset();
      const sx   = r.width / 200;          // viewBox scale
      const sy   = r.height / 240;
      return {
        x: r.left + 170 * sx - s.left,
        y: r.top  + 112 * sy - s.top
      };
    }

    function getBalloonCenter() {
      const r = balloon.getBoundingClientRect();
      const s = sceneOffset();
      return {
        x: r.left + r.width  / 2 - s.left,
        y: r.top  + r.height / 2 - s.top
      };
    }

    // ── Position arrow on the bowstring, pointing at the balloon ──

    function aimArrow() {
      const nock   = getBowNock();
      const target = getBalloonCenter();

      const dx    = target.x - nock.x;
      const dy    = target.y - nock.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      const ah = arrow.offsetHeight || 20;

      // Place arrow so its NOCK (left edge) sits at the bowstring,
      // tip points toward the balloon. transform-origin is left center.
      arrow.style.left      = nock.x + "px";
      arrow.style.top       = (nock.y - ah / 2) + "px";
      arrow.style.transform = "rotate(" + angle + "deg)";
    }

    // Initial placement + keep synced on resize
    requestAnimationFrame(aimArrow);          // after layout
    window.addEventListener("resize", () => { if (!hasShot) aimArrow(); });

    // Also re-aim on every bounce frame so arrow tracks the cat
    let aimRaf;
    function trackBounce() {
      if (!hasShot) {
        aimArrow();
        aimRaf = requestAnimationFrame(trackBounce);
      }
    }
    aimRaf = requestAnimationFrame(trackBounce);

    // ── Particles ──

    function spawnParticles() {
      const colors = ["#ff6b9d","#ff9ec4","#ffd1dc","#e74c8b","#f4a6c1",
                      "#ffc107","#e0bbe4","#c7ceea","#b5ead7","#fff5ba"];
      for (let i = 0; i < 24; i++) {
        const p = document.createElement("div");
        p.classList.add("particle");
        const a = (Math.PI * 2 * i) / 24 + (Math.random() - .5) * .4;
        const d = 60 + Math.random() * 80;
        p.style.setProperty("--px", Math.cos(a) * d + "px");
        p.style.setProperty("--py", Math.sin(a) * d + "px");
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        const sz = (6 + Math.random() * 10) + "px";
        p.style.width = sz;
        p.style.height = sz;
        popParticles.appendChild(p);
      }
    }

    // ── Reveal wish ──

    function revealWish() {
      balloonScene.style.transition = "opacity .6s ease";
      balloonScene.style.opacity = "0";
      setTimeout(() => {
        balloonScene.style.display = "none";
        wishContent.style.display = "flex";
        void wishContent.offsetWidth;
        wishContent.classList.add("reveal");
        sessionStorage.setItem("balloonPopped", "1");
        if (window.launchConfetti) window.launchConfetti(200);
        if (window.playBirthdayMelody) window.playBirthdayMelody();
      }, 700);
    }

    // ── Animate arrow flight (JS-driven, pixel-perfect) ──

    function flyArrow() {
      cancelAnimationFrame(aimRaf);  // stop tracking bounce

      const nock   = getBowNock();
      const target = getBalloonCenter();

      const aw = arrow.offsetWidth  || 120;
      const ah = arrow.offsetHeight || 20;

      const angleRad = Math.atan2(target.y - nock.y, target.x - nock.x);
      const angle    = angleRad * (180 / Math.PI);

      // Start pos: nock (left edge) at bowstring
      const sx = nock.x;
      const sy = nock.y - ah / 2;

      // End pos: we want the TIP to land at balloon center.
      // With transform-origin left center, tip is at:
      //   tipX = left + aw*cos(angle), tipY = (top+ah/2) + aw*sin(angle)
      // So left = target.x - aw*cos, top = target.y - aw*sin - ah/2
      const ex = target.x - aw * Math.cos(angleRad);
      const ey = target.y - aw * Math.sin(angleRad) - ah / 2;

      const duration = 450; // ms
      const t0 = performance.now();

      function tick(now) {
        let t = (now - t0) / duration;
        if (t > 1) t = 1;

        // ease-out cubic for natural deceleration
        const e = 1 - Math.pow(1 - t, 3);

        const cx = sx + (ex - sx) * e;
        const cy = sy + (ey - sy) * e;

        arrow.style.left      = cx + "px";
        arrow.style.top       = cy + "px";
        arrow.style.transform = "rotate(" + angle + "deg)";

        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          // Arrow hit! Pop balloon.
          arrow.classList.add("hidden");
          balloonGroup.classList.add("pop");
          spawnParticles();
          setTimeout(revealWish, 800);
        }
      }
      requestAnimationFrame(tick);
    }

    // ── Shoot sequence ──

    function shootArrow() {
      if (hasShot) return;
      hasShot = true;
      cancelAnimationFrame(aimRaf);

      scenePrompt.style.transition = "opacity .3s";
      scenePrompt.style.opacity = "0";

      // Snap-aim one last time
      aimArrow();

      // Brief drawback along arrow axis, then fly
      const nock   = getBowNock();
      const target = getBalloonCenter();
      const rad    = Math.atan2(target.y - nock.y, target.x - nock.x);
      const pullPx = 14;
      const curL   = parseFloat(arrow.style.left);
      const curT   = parseFloat(arrow.style.top);

      arrow.style.transition = "left .1s ease-out, top .1s ease-out";
      arrow.style.left = (curL - Math.cos(rad) * pullPx) + "px";
      arrow.style.top  = (curT - Math.sin(rad) * pullPx) + "px";

      setTimeout(() => {
        arrow.style.transition = "none";
        flyArrow();
      }, 120);
    }

    baby.addEventListener("click", shootArrow);
    baby.addEventListener("touchstart", (e) => {
      e.preventDefault();
      shootArrow();
    }, { passive: false });

    } // end else (animation not yet played)

    // Handle bfcache: if returning via back button with cached page,
    // skip animation and show wish directly
    window.addEventListener("pageshow", (e) => {
      if (e.persisted && sessionStorage.getItem("balloonPopped")) {
        balloonScene.style.display = "none";
        wishContent.style.display = "flex";
        wishContent.classList.add("reveal");
      }
    });
  }

});
