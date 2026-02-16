/* content.js - v6.0 CLEAN LAYOUT EDITION */

if (typeof window.devstyleLoaded === 'undefined') {
  window.devstyleLoaded = true;

  /* --- State --- */
  var isSidebarVisible = false;
  var selectedEl = null;
  var globalChangeLog = new Map();
  var historyStack = [];
  var redoStack = [];
  var copiedStyles = null;

  /* --- Initialization --- */
  function initSidebar() {
    if (document.getElementById('devstyle-sidebar-container')) return;

    const sidebar = document.createElement('div');
    sidebar.id = 'devstyle-sidebar-container';
    sidebar.innerHTML = `
        <div class="ds-header">
          <div class="ds-header-left">
            <span class="ds-title">Co Designer</span>
            <span class="ds-badge">AI</span>
          </div>
          <div class="ds-header-right">
             <button id="ds-btn-undo" class="ds-icon-btn" title="Undo" disabled>↩</button>
             <button id="ds-btn-redo" class="ds-icon-btn" title="Redo" disabled>↪</button>
             <button class="ds-icon-btn ds-close" title="Close">×</button>
          </div>
        </div>

        <div class="ds-breadcrumbs" id="ds-breadcrumbs">
           <span class="ds-crumb-placeholder">Click any element to start editing</span>
        </div>

        <div class="ds-content">

          <!-- SECTION: LAYOUT -->
          <div class="ds-section">
            <div class="ds-sec-header" data-toggle="ds-panel-layout">
              <span class="ds-sec-title">📐 Layout</span>
              <span class="ds-chevron">▾</span>
            </div>
            <div class="ds-panel" id="ds-panel-layout">
              <div class="ds-row">
                <div class="ds-field">
                  <label class="ds-label">Display</label>
                  <select id="ds-input-display" class="ds-input">
                    <option value="block">Block</option>
                    <option value="flex">Flex</option>
                    <option value="grid">Grid</option>
                    <option value="inline-block">Inline Block</option>
                    <option value="inline">Inline</option>
                    <option value="none">None</option>
                  </select>
                </div>
                <div class="ds-field">
                  <label class="ds-label">Gap</label>
                  <div class="ds-stepper">
                    <input type="text" id="ds-input-gap" class="ds-stepper-input" placeholder="0px">
                    <div class="ds-stepper-btns">
                      <button class="ds-step-btn" data-target="ds-input-gap" data-dir="1">▲</button>
                      <button class="ds-step-btn" data-target="ds-input-gap" data-dir="-1">▼</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Flex Sub-Controls -->
              <div id="ds-sub-flex" class="ds-sub-panel">
                <div class="ds-row">
                  <div class="ds-field">
                    <label class="ds-label">Justify</label>
                    <select id="ds-input-justify" class="ds-input ds-input-sm">
                      <option value="flex-start">Start</option>
                      <option value="center">Center</option>
                      <option value="flex-end">End</option>
                      <option value="space-between">Between</option>
                      <option value="space-around">Around</option>
                      <option value="space-evenly">Evenly</option>
                    </select>
                  </div>
                  <div class="ds-field">
                    <label class="ds-label">Align</label>
                    <select id="ds-input-align" class="ds-input ds-input-sm">
                      <option value="stretch">Stretch</option>
                      <option value="center">Center</option>
                      <option value="flex-start">Start</option>
                      <option value="flex-end">End</option>
                      <option value="baseline">Baseline</option>
                    </select>
                  </div>
                </div>
                <div class="ds-row">
                  <div class="ds-field">
                    <label class="ds-label">Direction</label>
                    <select id="ds-input-direction" class="ds-input ds-input-sm">
                      <option value="row">Row</option>
                      <option value="column">Column</option>
                      <option value="row-reverse">Row Rev</option>
                      <option value="column-reverse">Col Rev</option>
                    </select>
                  </div>
                  <div class="ds-field">
                    <label class="ds-label">Wrap</label>
                    <select id="ds-input-wrap" class="ds-input ds-input-sm">
                      <option value="nowrap">No Wrap</option>
                      <option value="wrap">Wrap</option>
                      <option value="wrap-reverse">Reverse</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION: SPACING -->
          <div class="ds-section">
            <div class="ds-sec-header" data-toggle="ds-panel-spacing">
              <span class="ds-sec-title">📏 Spacing</span>
              <span class="ds-chevron">▾</span>
            </div>
            <div class="ds-panel" id="ds-panel-spacing">
              <div class="ds-row">
                <div class="ds-field">
                  <label class="ds-label">Margin</label>
                  <div class="ds-stepper">
                    <input type="text" id="ds-input-margin" class="ds-stepper-input" placeholder="0px">
                    <div class="ds-stepper-btns">
                      <button class="ds-step-btn" data-target="ds-input-margin" data-dir="1">▲</button>
                      <button class="ds-step-btn" data-target="ds-input-margin" data-dir="-1">▼</button>
                    </div>
                  </div>
                </div>
                <div class="ds-field">
                  <label class="ds-label">Padding</label>
                  <div class="ds-stepper">
                    <input type="text" id="ds-input-padding" class="ds-stepper-input" placeholder="0px">
                    <div class="ds-stepper-btns">
                      <button class="ds-step-btn" data-target="ds-input-padding" data-dir="1">▲</button>
                      <button class="ds-step-btn" data-target="ds-input-padding" data-dir="-1">▼</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="ds-row">
                <div class="ds-field">
                  <label class="ds-label">Width</label>
                  <div class="ds-stepper">
                    <input type="text" id="ds-input-width" class="ds-stepper-input" placeholder="auto">
                    <div class="ds-stepper-btns">
                      <button class="ds-step-btn" data-target="ds-input-width" data-dir="1">▲</button>
                      <button class="ds-step-btn" data-target="ds-input-width" data-dir="-1">▼</button>
                    </div>
                  </div>
                </div>
                <div class="ds-field">
                  <label class="ds-label">Height</label>
                  <div class="ds-stepper">
                    <input type="text" id="ds-input-height" class="ds-stepper-input" placeholder="auto">
                    <div class="ds-stepper-btns">
                      <button class="ds-step-btn" data-target="ds-input-height" data-dir="1">▲</button>
                      <button class="ds-step-btn" data-target="ds-input-height" data-dir="-1">▼</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION: TYPOGRAPHY -->
          <div class="ds-section">
            <div class="ds-sec-header" data-toggle="ds-panel-type">
              <span class="ds-sec-title">🔤 Typography</span>
              <span class="ds-chevron">▾</span>
            </div>
            <div class="ds-panel" id="ds-panel-type">
              <div class="ds-font-selector">
                <div id="ds-font-trigger" class="ds-font-trigger">
                  <span id="ds-font-current">Default Font</span>
                  <span class="ds-font-arrow">▾</span>
                </div>
                <div id="ds-font-dropdown" class="ds-font-dropdown">
                  <div class="ds-font-option" data-font="inherit"><span class="ds-font-name">Default</span><span class="ds-font-preview">Page Default</span></div>
                  <div class="ds-font-option" data-font="'Inter', sans-serif"><span class="ds-font-name">Inter</span><span class="ds-font-preview f-inter">Clean & Modern</span></div>
                  <div class="ds-font-option" data-font="'Poppins', sans-serif"><span class="ds-font-name">Poppins</span><span class="ds-font-preview f-poppins">Friendly Geometric</span></div>
                  <div class="ds-font-option" data-font="'Montserrat', sans-serif"><span class="ds-font-name">Montserrat</span><span class="ds-font-preview f-montserrat">Bold Headlines</span></div>
                  <div class="ds-font-option" data-font="'DM Sans', sans-serif"><span class="ds-font-name">DM Sans</span><span class="ds-font-preview f-dmsans">Minimal Clean</span></div>
                  <div class="ds-font-option" data-font="'Roboto Flex', sans-serif"><span class="ds-font-name">Roboto Flex</span><span class="ds-font-preview f-flex">Google Flexible</span></div>
                  <div class="ds-font-option" data-font="'Space Grotesk', sans-serif"><span class="ds-font-name">Space Grotesk</span><span class="ds-font-preview f-space">Tech Brutalist</span></div>
                  <div class="ds-font-option" data-font="'Outfit', sans-serif"><span class="ds-font-name">Outfit</span><span class="ds-font-preview f-outfit">Geometric Round</span></div>
                  <div class="ds-font-option" data-font="'Lato', sans-serif"><span class="ds-font-name">Lato</span><span class="ds-font-preview f-lato">Warm Humanist</span></div>
                  <div class="ds-font-option" data-font="'Nunito', sans-serif"><span class="ds-font-name">Nunito</span><span class="ds-font-preview f-nunito">Soft Rounded</span></div>
                  <div class="ds-font-option" data-font="'Raleway', sans-serif"><span class="ds-font-name">Raleway</span><span class="ds-font-preview f-raleway">Elegant Thin</span></div>
                  <div class="ds-font-option" data-font="'Playfair Display', serif"><span class="ds-font-name">Playfair Display</span><span class="ds-font-preview f-playfair">Premium Elegant</span></div>
                  <div class="ds-font-option" data-font="'Instrument Serif', serif"><span class="ds-font-name">Instrument Serif</span><span class="ds-font-preview f-instrument">Classic Editorial</span></div>
                  <div class="ds-font-option" data-font="'Merriweather', serif"><span class="ds-font-name">Merriweather</span><span class="ds-font-preview f-merriweather">Readable Serif</span></div>
                  <div class="ds-font-option" data-font="'Lora', serif"><span class="ds-font-name">Lora</span><span class="ds-font-preview f-lora">Contemporary Serif</span></div>
                  <div class="ds-font-option" data-font="'JetBrains Mono', monospace"><span class="ds-font-name">JetBrains Mono</span><span class="ds-font-preview f-jetbrains">Code Monospace</span></div>
                  <div class="ds-font-option" data-font="'Fira Code', monospace"><span class="ds-font-name">Fira Code</span><span class="ds-font-preview f-firacode">Dev Monospace</span></div>
                </div>
              </div>

              <div class="ds-row" style="margin-top:12px;">
                <div class="ds-field">
                  <label class="ds-label">Size</label>
                  <div class="ds-stepper">
                    <input type="text" id="ds-input-size" class="ds-stepper-input" placeholder="16px">
                    <div class="ds-stepper-btns">
                      <button class="ds-step-btn" data-target="ds-input-size" data-dir="1">▲</button>
                      <button class="ds-step-btn" data-target="ds-input-size" data-dir="-1">▼</button>
                    </div>
                  </div>
                </div>
                <div class="ds-field">
                  <label class="ds-label">Weight</label>
                  <select id="ds-input-weight" class="ds-input">
                    <option value="300">Light</option>
                    <option value="400">Regular</option>
                    <option value="500">Medium</option>
                    <option value="600">Semi Bold</option>
                    <option value="700">Bold</option>
                    <option value="900">Black</option>
                  </select>
                </div>
              </div>

              <div class="ds-row" style="margin-top:8px;">
                <div class="ds-field">
                  <label class="ds-label">Line Height</label>
                  <div class="ds-stepper">
                    <input type="text" id="ds-input-lineheight" class="ds-stepper-input" placeholder="1.5">
                    <div class="ds-stepper-btns">
                      <button class="ds-step-btn" data-target="ds-input-lineheight" data-dir="0.1">▲</button>
                      <button class="ds-step-btn" data-target="ds-input-lineheight" data-dir="-0.1">▼</button>
                    </div>
                  </div>
                </div>
                <div class="ds-field">
                  <label class="ds-label">Letter Spacing</label>
                  <div class="ds-stepper">
                    <input type="text" id="ds-input-letterspacing" class="ds-stepper-input" placeholder="0px">
                    <div class="ds-stepper-btns">
                      <button class="ds-step-btn" data-target="ds-input-letterspacing" data-dir="0.1">▲</button>
                      <button class="ds-step-btn" data-target="ds-input-letterspacing" data-dir="-0.1">▼</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="ds-row" style="margin-top:8px;">
                 <div class="ds-field">
                   <label class="ds-label">Align</label>
                   <div class="ds-btn-group">
                      <button class="ds-icon-toggle" data-prop="textAlign" data-val="left" title="Left">L</button>
                      <button class="ds-icon-toggle" data-prop="textAlign" data-val="center" title="Center">C</button>
                      <button class="ds-icon-toggle" data-prop="textAlign" data-val="right" title="Right">R</button>
                      <button class="ds-icon-toggle" data-prop="textAlign" data-val="justify" title="Justify">J</button>
                   </div>
                 </div>
                 <div class="ds-field">
                   <label class="ds-label">Style</label>
                   <div class="ds-btn-group">
                      <button class="ds-icon-toggle" data-prop="fontStyle" data-val="italic" title="Italic"><i>I</i></button>
                      <button class="ds-icon-toggle" data-prop="textTransform" data-val="uppercase" title="Uppercase">TT</button>
                      <button class="ds-icon-toggle" data-prop="textDecoration" data-val="underline" title="Underline">U</button>
                   </div>
                 </div>
              </div>

              <div class="ds-field" style="margin-top:12px;">
                <label class="ds-label">Content</label>
                <textarea id="ds-input-text-content" class="ds-textarea" placeholder="Edit text content..." rows="3"></textarea>
              </div>
            </div>
          </div>

          <!-- SECTION: APPEARANCE -->
          <div class="ds-section">
            <div class="ds-sec-header" data-toggle="ds-panel-appearance">
              <span class="ds-sec-title">🎨 Appearance</span>
              <span class="ds-chevron">▾</span>
            </div>
            <div class="ds-panel" id="ds-panel-appearance">
              <div class="ds-color-row">
                <span class="ds-color-label">Text</span>
                <div class="ds-color-wrapper">
                  <input type="color" id="ds-picker-color" value="#ffffff">
                  <input type="text" id="ds-text-color" class="ds-input-lean" value="#FFFFFF">
                </div>
              </div>
              <div class="ds-color-row">
                <span class="ds-color-label">Background</span>
                <div class="ds-color-wrapper">
                  <input type="color" id="ds-picker-bg" value="#000000">
                  <input type="text" id="ds-text-bg" class="ds-input-lean" value="#000000">
                </div>
              </div>

              <div class="ds-row" style="margin-top:12px;">
                <div class="ds-field">
                  <label class="ds-label">Radius</label>
                  <div class="ds-stepper">
                    <input type="text" id="ds-input-radius" class="ds-stepper-input" placeholder="0px">
                    <div class="ds-stepper-btns">
                      <button class="ds-step-btn" data-target="ds-input-radius" data-dir="1">▲</button>
                      <button class="ds-step-btn" data-target="ds-input-radius" data-dir="-1">▼</button>
                    </div>
                  </div>
                </div>
                <div class="ds-field">
                  <label class="ds-label">Opacity</label>
                  <div class="ds-stepper">
                    <input type="text" id="ds-input-opacity" class="ds-stepper-input" placeholder="1">
                    <div class="ds-stepper-btns">
                      <button class="ds-step-btn" data-target="ds-input-opacity" data-dir="0.1">▲</button>
                      <button class="ds-step-btn" data-target="ds-input-opacity" data-dir="-0.1">▼</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="ds-row" style="margin-top:12px;">
                <div class="ds-field">
                  <label class="ds-label">Border</label>
                  <input type="text" id="ds-input-border-width" class="ds-input ds-input-sm" placeholder="1px solid #fff">
                </div>
                <div class="ds-field">
                  <label class="ds-label">Shadow</label>
                  <select id="ds-shadow-preset" class="ds-input ds-input-sm">
                    <option value="none">None</option>
                    <option value="0 2px 4px rgba(0,0,0,0.1)">Subtle</option>
                    <option value="0 8px 24px rgba(0,0,0,0.15)">Medium</option>
                    <option value="0 20px 40px rgba(0,0,0,0.25)">Large</option>
                    <option value="0 0 20px rgba(59,130,246,0.4)">Glow</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION: IMAGE (conditional) -->
          <div class="ds-section" id="ds-sec-media" style="display:none;">
            <div class="ds-sec-header">
              <span class="ds-sec-title">🖼 Image</span>
            </div>
            <div class="ds-panel">
              <div class="ds-field">
                <label class="ds-label">Source URL</label>
                <input type="text" id="ds-input-src" class="ds-input" placeholder="https://...">
              </div>
              <div class="ds-row" style="margin-top:12px;">
                <div class="ds-field">
                  <label class="ds-label">Fit</label>
                  <select id="ds-input-fit" class="ds-input">
                    <option value="cover">Cover</option>
                    <option value="contain">Contain</option>
                    <option value="fill">Fill</option>
                  </select>
                </div>
                <div class="ds-field">
                  <label class="ds-label">Alt</label>
                  <input type="text" id="ds-input-alt" class="ds-input" placeholder="Description">
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION: ACTIONS -->
          <div class="ds-section">
            <div class="ds-sec-header" data-toggle="ds-panel-actions">
              <span class="ds-sec-title">⚡ Actions</span>
              <span class="ds-chevron">▾</span>
            </div>
            <div class="ds-panel" id="ds-panel-actions">
              <div class="ds-row">
                <button id="ds-btn-copy-style" class="ds-action-btn">📋 Copy Style</button>
                <button id="ds-btn-paste-style" class="ds-action-btn" disabled>📥 Paste Style</button>
              </div>
              <button id="ds-btn-remove" class="ds-action-btn ds-action-danger" style="margin-top:8px; width:100%;">
                🗑 Remove Element
              </button>
            </div>
          </div>

        </div>

        <div class="ds-footer">
          <button id="ds-btn-reset" class="ds-btn-reset" title="Reset">↺</button>
          <button id="ds-btn-generate" class="ds-primary-btn">
            ✨ Generate Prompt
          </button>
        </div>
        `;

    document.body.appendChild(sidebar);
    setupInternalListeners(sidebar);
  }

  function setupInternalListeners(sb) {
    sb.querySelector('.ds-close').onclick = () => toggleSidebar(false);

    // --- Collapsible Sections ---
    sb.querySelectorAll('.ds-sec-header[data-toggle]').forEach(header => {
      header.onclick = () => {
        const panelId = header.dataset.toggle;
        const panel = document.getElementById(panelId);
        const chevron = header.querySelector('.ds-chevron');
        if (panel) {
          panel.classList.toggle('collapsed');
          chevron.classList.toggle('rotated');
        }
      };
    });

    // --- Font Dropdown ---
    const trigger = document.getElementById('ds-font-trigger');
    const dropdown = document.getElementById('ds-font-dropdown');
    trigger.onclick = () => dropdown.classList.toggle('visible');

    document.querySelectorAll('.ds-font-option').forEach(opt => {
      opt.onclick = () => {
        const f = opt.dataset.font;
        document.getElementById('ds-font-current').innerText = opt.querySelector('.ds-font-name').innerText;
        dropdown.classList.remove('visible');
        applyStyle('fontFamily', f);
      };
    });

    // --- Style Bindings ---
    bindStyle('ds-input-size', 'fontSize', 'px');
    bindStyle('ds-input-weight', 'fontWeight');
    bindStyle('ds-input-lineheight', 'lineHeight'); // NEW
    bindStyle('ds-input-letterspacing', 'letterSpacing', 'px'); // NEW
    bindStyle('ds-input-margin', 'margin');
    bindStyle('ds-input-padding', 'padding');
    bindStyle('ds-input-radius', 'borderRadius');
    bindStyle('ds-input-border-width', 'border');
    bindStyle('ds-input-gap', 'gap', 'px');
    bindStyle('ds-input-width', 'width');
    bindStyle('ds-input-height', 'height');
    bindStyle('ds-input-opacity', 'opacity');

    // --- Icon Toggles Logic ---
    sb.querySelectorAll('.ds-icon-toggle').forEach(btn => {
      btn.onclick = () => {
        const prop = btn.dataset.prop;
        const val = btn.dataset.val;

        // Check if already active (toggle off)
        const current = selectedEl.style[prop];
        if (current === val) {
          applyStyle(prop, '');
          btn.classList.remove('active');
        } else {
          applyStyle(prop, val);
          // Update active state in UI
          sb.querySelectorAll(`.ds-icon-toggle[data-prop="${prop}"]`).forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        }
      };
    });

    // Display
    const displaySelect = document.getElementById('ds-input-display');
    displaySelect.onchange = (e) => {
      applyStyle('display', e.target.value);
      const showFlex = (e.target.value === 'flex' || e.target.value === 'inline-flex');
      document.getElementById('ds-sub-flex').style.display = showFlex ? 'block' : 'none';
    };

    // Flex
    bindStyle('ds-input-justify', 'justifyContent');
    bindStyle('ds-input-align', 'alignItems');
    bindStyle('ds-input-direction', 'flexDirection');
    bindStyle('ds-input-wrap', 'flexWrap');

    // Shadow
    document.getElementById('ds-shadow-preset').onchange = (e) => applyStyle('boxShadow', e.target.value);

    // Colors
    bindColors('ds-picker-color', 'ds-text-color', 'color');
    bindColors('ds-picker-bg', 'ds-text-bg', 'backgroundColor');

    // Actions
    document.getElementById('ds-btn-remove').onclick = removeElement;
    document.getElementById('ds-btn-copy-style').onclick = copyStyle;
    document.getElementById('ds-btn-paste-style').onclick = pasteStyle;
    document.getElementById('ds-btn-generate').onclick = generatePrompt;
    document.getElementById('ds-btn-reset').onclick = resetSession;

    // History
    document.getElementById('ds-btn-undo').onclick = undo;
    document.getElementById('ds-btn-redo').onclick = redo;

    // Text Content
    document.getElementById('ds-input-text-content').oninput = (e) => {
      if (selectedEl) {
        const oldText = selectedEl.innerText;
        selectedEl.innerText = e.target.value;
        trackInLog('innerText', oldText, e.target.value);
      }
    };

    // Dragging & Steppers
    makeDraggable(document.getElementById('devstyle-sidebar-container'));
    setupSteppers();
  }

  /* --- Steppers with long-press --- */
  function setupSteppers() {
    document.querySelectorAll('.ds-step-btn').forEach(btn => {
      let intervalId = null;
      let timeoutId = null;

      const step = () => {
        const input = document.getElementById(btn.dataset.target);
        const dir = parseFloat(btn.dataset.dir);
        let currentVal = input.value;
        let num = parseFloat(currentVal);
        let unit = currentVal.replace(/[0-9.-]/g, '') || (Math.abs(dir) < 1 ? '' : 'px');
        if (isNaN(num)) num = 0;
        num = Math.round((num + dir) * 100) / 100; // avoid float drift
        input.value = num + unit;
        input.dispatchEvent(new Event('change'));
      };

      btn.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        step();
        timeoutId = setTimeout(() => { intervalId = setInterval(step, 50); }, 400);
      });
      const stop = () => { clearTimeout(timeoutId); clearInterval(intervalId); };
      btn.addEventListener('mouseup', stop);
      btn.addEventListener('mouseleave', stop);
    });
  }

  /* --- Draggable --- */
  function makeDraggable(el) {
    const header = el.querySelector('.ds-header');
    let isDragging = false, startX, startY, iLeft, iTop;

    header.onmousedown = (e) => {
      if (e.target.closest('button')) return;
      isDragging = true;
      startX = e.clientX; startY = e.clientY;
      const r = el.getBoundingClientRect();
      iLeft = r.left; iTop = r.top;
      el.style.right = 'auto';
      el.style.left = iLeft + 'px';
      el.style.top = iTop + 'px';
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', stop);
      document.body.style.userSelect = 'none';
    };
    const drag = (e) => { if (!isDragging) return; el.style.left = (iLeft + e.clientX - startX) + 'px'; el.style.top = (iTop + e.clientY - startY) + 'px'; };
    const stop = () => { isDragging = false; document.removeEventListener('mousemove', drag); document.removeEventListener('mouseup', stop); document.body.style.userSelect = ''; };
  }

  /* --- Core Logic --- */
  function applyStyle(prop, val) {
    if (!selectedEl) return;
    const old = selectedEl.style[prop];
    selectedEl.style[prop] = val;
    pushHistory({ type: 'style', el: selectedEl, prop, old, new: val });
    trackInLog(prop, old, val);
  }

  function trackInLog(prop, oldV, newV) {
    if (!globalChangeLog.has(selectedEl)) globalChangeLog.set(selectedEl, {});
    const c = globalChangeLog.get(selectedEl);
    if (!c[prop]) c[prop] = { from: oldV || 'initial', to: newV };
    else c[prop].to = newV;
    updateUI();
  }

  function updateUI() {
    const btn = document.getElementById('ds-btn-generate');
    const n = globalChangeLog.size;
    if (btn) {
      btn.innerText = n > 0 ? `✨ Generate Prompt (${n})` : '✨ Generate Prompt';
    }
  }

  function bindStyle(id, prop, unit = '') {
    const el = document.getElementById(id);
    if (!el) return;
    el.onchange = (e) => {
      let val = e.target.value;
      if (unit && !isNaN(val) && val !== '') val += unit;
      applyStyle(prop, val);
    };
  }

  function bindColors(pid, tid, prop) {
    const p = document.getElementById(pid);
    const t = document.getElementById(tid);
    p.oninput = (e) => { t.value = e.target.value; applyStyle(prop, e.target.value); };
    t.onchange = (e) => { p.value = e.target.value; applyStyle(prop, e.target.value); };
  }

  /* --- Select Element --- */
  function selectElement(el) {
    if (selectedEl && selectedEl !== el) selectedEl.classList.remove('ds-selected');
    selectedEl = el;
    selectedEl.classList.add('ds-selected');
    updateBreadcrumbs(el);

    const s = window.getComputedStyle(el);
    const set = (id, v) => { const i = document.getElementById(id); if (i) i.value = v; };

    set('ds-input-size', parseInt(s.fontSize));
    set('ds-input-weight', s.fontWeight);
    set('ds-input-lineheight', s.lineHeight !== 'normal' ? parseFloat(s.lineHeight) : '1.5');
    set('ds-input-letterspacing', s.letterSpacing !== 'normal' ? parseFloat(s.letterSpacing) : '0');

    // Update Toggle Buttons Active State
    document.querySelectorAll('.ds-icon-toggle').forEach(btn => {
      const prop = btn.dataset.prop;
      const val = btn.dataset.val;
      if (s[prop] === val || (prop === 'fontStyle' && s.fontStyle === 'italic') || (prop === 'textDecoration' && s.textDecorationLine.includes('underline'))) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    set('ds-input-margin', s.margin);
    set('ds-input-padding', s.padding);
    set('ds-text-color', rgbToHex(s.color));
    set('ds-text-bg', rgbToHex(s.backgroundColor));
    set('ds-picker-color', rgbToHex(s.color));
    set('ds-picker-bg', rgbToHex(s.backgroundColor));
    set('ds-input-radius', s.borderRadius);
    set('ds-input-opacity', s.opacity);
    set('ds-input-width', s.width);
    set('ds-input-height', s.height);

    // Layout
    set('ds-input-display', s.display);
    const isFlex = (s.display === 'flex' || s.display === 'inline-flex');
    document.getElementById('ds-sub-flex').style.display = isFlex ? 'block' : 'none';
    set('ds-input-justify', s.justifyContent);
    set('ds-input-align', s.alignItems);
    set('ds-input-direction', s.flexDirection);
    set('ds-input-wrap', s.flexWrap);
    set('ds-input-gap', s.gap);

    // Content
    document.getElementById('ds-input-text-content').value = el.innerText;
    document.getElementById('ds-sec-media').style.display = el.tagName === 'IMG' ? 'block' : 'none';
  }

  function updateBreadcrumbs(el) {
    const c = document.getElementById('ds-breadcrumbs');
    c.innerHTML = '';
    let curr = el, path = [];
    while (curr && curr.tagName !== 'BODY' && curr !== document.documentElement && path.length < 4) {
      path.unshift(curr); curr = curr.parentElement;
    }
    path.forEach((node, i) => {
      const span = document.createElement('span');
      span.className = 'ds-crumb-item';
      let name = node.tagName.toLowerCase();
      if (node.id) name += `#${node.id}`;
      else if (node.classList.length > 0) {
        const cls = Array.from(node.classList).filter(x => !x.startsWith('ds-'))[0];
        if (cls) name += `.${cls}`;
      }
      span.innerText = name;
      span.onclick = (e) => { e.preventDefault(); e.stopPropagation(); selectElement(node); };
      c.appendChild(span);
      if (i < path.length - 1) {
        const a = document.createElement('span');
        a.className = 'ds-crumb-sep';
        a.innerText = '›';
        c.appendChild(a);
      }
    });
  }

  /* --- Actions --- */
  function copyStyle() {
    if (!selectedEl) return;
    const s = window.getComputedStyle(selectedEl);
    copiedStyles = { color: s.color, backgroundColor: s.backgroundColor, borderRadius: s.borderRadius, padding: s.padding, fontSize: s.fontSize, boxShadow: s.boxShadow, fontFamily: s.fontFamily };
    document.getElementById('ds-btn-paste-style').disabled = false;
  }

  function pasteStyle() {
    if (!copiedStyles || !selectedEl) return;
    for (const [p, v] of Object.entries(copiedStyles)) applyStyle(p, v);
  }

  function removeElement() {
    if (!selectedEl) return;
    if (!confirm('Remove this element?')) return;
    const el = selectedEl, parent = el.parentNode, sibling = el.nextSibling;
    pushHistory({ type: 'remove', el, parent, sibling });

    if (!globalChangeLog.has(el)) globalChangeLog.set(el, {});
    globalChangeLog.get(el)['__removed'] = { from: 'visible', to: 'removed' };
    updateUI();

    el.remove();
    selectedEl = null;
    document.getElementById('ds-breadcrumbs').innerHTML = '<span class="ds-crumb-placeholder">Element removed</span>';
  }

  /* --- Copilot Prompt --- */
  function generatePrompt() {
    if (globalChangeLog.size === 0) return alert('No changes recorded.');
    const n = globalChangeLog.size;
    let cmd = `Apply ${n} design update${n > 1 ? 's' : ''}: `;
    let parts = [];
    let idx = 1;

    for (const [el, changes] of globalChangeLog.entries()) {
      let sel = el.tagName.toLowerCase();

      // 1. Just ID (Best)
      if (el.id) {
        sel += `#${el.id}`;
      } else {
        // 2. Short Text Content (Very clear for Copilot)
        const txt = el.innerText ? el.innerText.trim().substring(0, 30).replace(/\n/g, ' ') : '';
        if (txt.length > 3 && txt.length < 30) {
          sel += ` containing "${txt}"`;
        } else {
          // 3. Meaningful Class (Skip utility classes)
          const validClasses = Array.from(el.classList).filter(c =>
            !c.startsWith('ds-') &&
            !c.includes(':') &&
            !c.startsWith('tw-') &&
            c.length > 3
          );

          if (validClasses.length > 0) {
            sel += `.${validClasses[0]}`; // Just use the first good class
          } else if (el.parentElement) {
            // 4. Parent Context
            const pTag = el.parentElement.tagName.toLowerCase();
            sel = `${pTag} > ${sel}`;
          }
        }
      }

      let descs = [];
      for (const [prop, val] of Object.entries(changes)) {
        if (prop === '__removed') { descs.push('remove element'); continue; }
        if (prop === 'innerText') { descs.push(`change text to '${val.to.substring(0, 20)}...'`); continue; }
        descs.push(`${prop}: ${val.to}`);
      }
      parts.push(`${idx}. '${sel}': ${descs.join(', ')}`);
      idx++;
    }

    cmd += parts.join('; ');
    navigator.clipboard.writeText(cmd).then(() => {
      alert(`Copied ${n} change${n > 1 ? 's' : ''} as Copilot prompt!`);
    });
  }

  function resetSession() {
    if (!confirm('Reset all changes?')) return;
    globalChangeLog.clear();
    updateUI();
  }

  /* --- History --- */
  function pushHistory(a) {
    historyStack.push(a);
    if (historyStack.length > 50) historyStack.shift();
    redoStack = [];
    updateHistoryBtns();
  }
  function undo() {
    if (!historyStack.length) return;
    const a = historyStack.pop(); redoStack.push(a);
    if (a.type === 'style') a.el.style[a.prop] = a.old;
    if (a.type === 'remove') { if (a.sibling) a.parent.insertBefore(a.el, a.sibling); else a.parent.appendChild(a.el); }
    updateHistoryBtns();
  }
  function redo() {
    if (!redoStack.length) return;
    const a = redoStack.pop(); historyStack.push(a);
    if (a.type === 'style') a.el.style[a.prop] = a.new;
    if (a.type === 'remove') a.el.remove();
    updateHistoryBtns();
  }
  function updateHistoryBtns() {
    document.getElementById('ds-btn-undo').disabled = !historyStack.length;
    document.getElementById('ds-btn-redo').disabled = !redoStack.length;
  }

  function rgbToHex(rgb) {
    if (!rgb) return '#000000';
    if (rgb.startsWith('#')) return rgb;
    const r = rgb.match(/\d+/g);
    if (!r || r.length < 3) return '#000000';
    return '#' + ((1 << 24) + (parseInt(r[0]) << 16) + (parseInt(r[1]) << 8) + parseInt(r[2])).toString(16).slice(1);
  }

  /* --- Toggle --- */
  function toggleSidebar(state) {
    if (!document.getElementById('devstyle-sidebar-container')) initSidebar();
    isSidebarVisible = state;
    const sb = document.getElementById('devstyle-sidebar-container');
    if (state) {
      sb.classList.add('visible');
      document.addEventListener('click', onSelectClick, { capture: true });
      document.addEventListener('mouseover', onSelectHover, { capture: true });
    } else {
      sb.classList.remove('visible');
      document.removeEventListener('click', onSelectClick, { capture: true });
      document.removeEventListener('mouseover', onSelectHover, { capture: true });
      const h = document.querySelector('.ds-highlight');
      if (h) h.classList.remove('ds-highlight');
      if (selectedEl) { selectedEl.classList.remove('ds-selected'); selectedEl = null; }
    }
  }

  function onSelectClick(e) {
    if (e.target.closest('#devstyle-sidebar-container')) return;
    e.preventDefault(); e.stopPropagation();
    selectElement(e.target);
  }

  function onSelectHover(e) {
    if (e.target.closest('#devstyle-sidebar-container')) return;
    const prev = document.querySelector('.ds-highlight');
    if (prev) prev.classList.remove('ds-highlight');
    e.target.classList.add('ds-highlight');
  }

  chrome.runtime.onMessage.addListener((m, sender, sendResponse) => {
    if (m.action === 'ping') { sendResponse({ visible: isSidebarVisible }); return; }
    if (m.action === 'toggleSidebar') {
      if (m.state === 'toggle') toggleSidebar(!isSidebarVisible);
      else toggleSidebar(m.state);
    }
  });
}
