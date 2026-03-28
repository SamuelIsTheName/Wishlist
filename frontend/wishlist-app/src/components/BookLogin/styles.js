const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Crimson+Pro:wght@300;400;500&display=swap');

  html, body {
    margin: 0;
    padding: 0;
  }

  /* ============================================================
     ROOT
     ============================================================ */
  .book-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(ellipse at center, #1a1208 0%, #0d0a05 100%);
    font-family: 'Crimson Pro', serif;
  }

  /* ============================================================
     SCENE
     ============================================================ */
  .scene {
    perspective: 1400px;
    perspective-origin: 60% center;
    width: 300px;
    height: 400px;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 1.4s cubic-bezier(0.645, 0.045, 0.355, 1.000);
  }

  .scene.zoomed {
    transform: scale(1.7) translateX(60px);
  }

  /* ============================================================
     PAGES
     ============================================================ */
  .pages {
    position: absolute;
    width: calc(100% - 18px);
    height: 100%;
    left: 18px;
    top: 0;
    background: linear-gradient(to right, #e8dcc8 0%, #f5edd8 40%, #f0e6d0 100%);
    border-radius: 0 8px 8px 0;
    box-shadow: inset -2px 0 4px rgba(0,0,0,0.1), 2px 0 6px rgba(0,0,0,0.15);
    overflow: hidden;
    transform: translateZ(-1px);
    z-index: 10;
  }

  /* ============================================================
     SPINE
     ============================================================ */
  .spine {
    position: absolute;
    left: 0;
    top: 0;
    width: 18px;
    height: 100%;
    background: linear-gradient(to right, #1a0d06, #2e1a0e, #1a0d06);
    border-radius: 3px 0 0 3px;
    box-shadow: -2px 0 6px rgba(0,0,0,0.5), 2px 0 4px rgba(0,0,0,0.3);
    transform: translateZ(2px);
    z-index: 20;
  }

  /* ============================================================
     COVER
     ============================================================ */
  .cover {
    position: absolute;
    width: calc(100% - 18px);
    height: 100%;
    left: 18px;
    top: 0;
    transform-origin: left center;
    transform-style: preserve-3d;
    transform: rotateY(0deg);
    transition: transform 1.6s cubic-bezier(0.645, 0.045, 0.355, 1.000);
    z-index: 5;
  }

  .cover.open {
    transform: rotateY(-175deg);
    pointer-events: none;
  }

  /* Front face */
  .cover-front {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    background: linear-gradient(160deg, #3a1f10 0%, #5a3020 40%, #4a2818 70%, #2e1608 100%);
    border-radius: 0 10px 10px 0;
    box-shadow: 4px 4px 24px rgba(0,0,0,0.55), inset -3px 0 6px rgba(0,0,0,0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 28px 24px;
    overflow: hidden;
  }

  .cover-front::before {
    content: '';
    position: absolute;
    inset: 10px;
    border: 1px solid rgba(200,155,60,0.3);
    border-radius: 0 7px 7px 0;
    pointer-events: none;
  }

  /* Inner face (visible when flipped) */
  .cover-inner {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    transform: rotateY(180deg);
    background: linear-gradient(160deg, #2e1608 0%, #4a2818 60%, #3a1f10 100%);
    border-radius: 0 10px 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ============================================================
     INNER COVER ACTIONS
     Both buttons live outside the 3D scene (crisp text, no blur).

     How the position works:
       The zoomed scene is 510px wide, shifted +102px right of centre.
       Its left edge = 50vw - 255px + 102px = 50vw - 153px.
       The spine is 31px wide, so it ends at  50vw - 153px + 31px = 50vw - 122px.

       We stretch this container from left:0 to right: calc(50vw + 122px).
       That means its right edge always touches the spine, and flexbox
       centres the buttons within whatever width remains — works at any
       viewport size.
     ============================================================ */
  .inner-cover-actions {
    position: fixed;
    /*
      The journal overlay sits at left: calc(50vw - 122px).
      From the DevTools screenshot, the spine's right edge is at ~110px
      and the journal/pages start at ~580px, meaning the journal overlay's
      left value in that viewport = 580px.

      The inner cover region = spine right → journal left.
      We set this container to span that same region using the same
      calc as the journal overlay for its right boundary.

      left: spine right edge ≈ journal-overlay left - 470px... 
      
      Simplest correct approach: mirror the journal overlay.
      Journal: left = calc(50vw - 122px), width = 479px
      Inner cover: right = calc(50vw - 122px), stretch to left: 0
    */
    left: 0;
    right: calc(50vw - 122px);
    top: 50%;
    height: 680px;
    transform: translateY(-50%);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;

    z-index: 101;
    animation: journalFadeIn 0.6s ease forwards;
    pointer-events: none;
  }

  .inner-cover-actions .add-btn,
  .inner-cover-actions .logout-btn {
    pointer-events: all;
  }

  .add-btn,
  .logout-btn {
    width: 160px;
    padding: 10px 0;
    font-family: 'Playfair Display', serif;
    font-size: 12px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    text-align: center;
  }

  .add-btn {
    background: rgba(200,160,80,0.18);
    border: 1px solid rgba(200,160,80,0.55);
    color: #c8a050;
  }

  .add-btn:hover {
    background: rgba(200,160,80,0.30);
    border-color: rgba(200,160,80,0.80);
  }

  .logout-btn {
    background: rgba(200,160,80,0.07);
    border: 1px solid rgba(200,160,80,0.28);
    color: rgba(200,160,80,0.65);
  }

  .logout-btn:hover {
    background: rgba(200,160,80,0.18);
    border-color: rgba(200,160,80,0.55);
    color: #c8a050;
  }

  /* ============================================================
     BOOK TITLE / ORNAMENT / FORM
     ============================================================ */
  .book-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 700;
    color: #c8a050;
    text-align: center;
    letter-spacing: 0.06em;
    line-height: 1.25;
    margin-bottom: 4px;
    text-shadow: 0 1px 4px rgba(0,0,0,0.5);
  }

  .ornament {
    font-size: 16px;
    color: rgba(200,160,80,0.4);
    letter-spacing: 6px;
    margin-bottom: 20px;
  }

  .form-area {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 9px;
  }

  .tab-row {
    display: flex;
    border-bottom: 1px solid rgba(200,160,80,0.2);
    margin-bottom: 2px;
  }

  .tab-btn {
    flex: 1;
    background: none;
    border: none;
    color: rgba(200,160,80,0.4);
    font-family: 'Crimson Pro', serif;
    font-size: 12px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 5px 0;
    cursor: pointer;
    transition: color 0.2s;
    border-bottom: 1px solid transparent;
    margin-bottom: -1px;
  }

  .tab-btn.active {
    color: #c8a050;
    border-bottom-color: #c8a050;
  }

  .book-field {
    background: rgba(0,0,0,0.28);
    border: none;
    border-bottom: 1px solid rgba(200,160,80,0.22);
    color: #e8d0a0;
    font-family: 'Crimson Pro', serif;
    font-size: 14px;
    padding: 7px 6px;
    outline: none;
    transition: border-color 0.2s;
  }

  .book-field::placeholder {
    color: rgba(200,160,80,0.28);
  }

  .book-field:focus {
    border-bottom-color: rgba(200,160,80,0.65);
  }

  .submit-btn {
    width: 100%;
    margin-top: 4px;
    padding: 9px;
    background: rgba(200,160,80,0.12);
    border: 1px solid rgba(200,160,80,0.38);
    color: #c8a050;
    font-family: 'Playfair Display', serif;
    font-size: 12px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }

  .submit-btn:hover:not(:disabled) {
    background: rgba(200,160,80,0.22);
    border-color: rgba(200,160,80,0.65);
  }

  .submit-btn:disabled {
    opacity: 0.5;
    cursor: default;
  }

  .status-msg {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 10px;
    color: rgba(200,160,80,0.45);
    text-align: center;
    min-height: 14px;
  }

  .status-msg.error {
    color: rgba(220, 100, 80, 0.8);
  }

  /* ============================================================
     JOURNAL OVERLAY
     ============================================================ */
  .journal-overlay {
    position: fixed;
    top: 50%;
    left: calc(50vw - 122px);
    transform: translateY(-50%);

    width: 479px;
    height: 680px;

    background: linear-gradient(to right, #e8dcc8 0%, #f5edd8 40%, #f0e6d0 100%);
    border-radius: 0 8px 8px 0;
    box-shadow: inset -2px 0 4px rgba(0,0,0,0.1), 2px 0 6px rgba(0,0,0,0.15);
    overflow-y: auto;

    color: #3d2a14;
    font-family: 'Crimson Pro', serif;

    z-index: 1000;

    animation: journalFadeIn 0.6s ease forwards;
  }

  @keyframes journalFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

export default styles;