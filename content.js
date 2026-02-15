/* content.js - v5.0 ULTIMATE HACKATHON EDITION
   Key Features: Glassmorphism UI, Copilot Integration, Flex/Grid Tools
*/

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
            <span class="ds-title">Visually AI</span>
          </div>
          
          <div class="ds-history-controls">
             <button id="ds-btn-undo" class="ds-icon-btn" title="Undo">↩</button>
             <button id="ds-btn-redo" class="ds-icon-btn" title="Redo">↪</button>
             <button class="ds-icon-btn ds-close" style="margin-left:4px; color:#ef4444;">×</button>
          </div>
        </div>
        
        <div class="ds-breadcrumbs" id="ds-breadcrumbs">
           <span class="ds-crumb-item">Select an element...</span>
        </div>

        <div class="ds-content">
          
          <!-- TRANSFORM / ACTIONS -->
          <div class="ds-section">
            <span class="ds-sec-title">Quick Actions</span>
            <div class="ds-grid-2">
               <button id="ds-btn-copy-style" class="ds-tool-btn">📋 Copy Style</button>
               <button id="ds-btn-paste-style" class="ds-tool-btn" disabled>📥 Paste Style</button>
            </div>
          </div>

          <!-- LAYOUT & FLEXBOX (NEW) -->
          <div class="ds-section">
            <span class="ds-sec-title">Layout & Flexbox</span>
            <div class="ds-grid-2" style="margin-bottom:12px;">
                <select id="ds-input-display" class="ds-input">
                   <option value="block">Block</option>
                   <option value="flex">Flex</option>
                   <option value="grid">Grid</option>
                   <option value="inline-block">Inline-Block</option>
                   <option value="none">Hidden</option>
                </select>
                <div class="ds-stepper">
                    <input type="text" id="ds-input-gap" class="ds-stepper-input" placeholder="Gap">
                    <div class="ds-stepper-btns">
                      <button class="ds-step-btn" data-target="ds-input-gap" data-dir="1">▲</button>
                      <button class="ds-step-btn" data-target="ds-input-gap" data-dir="-1">▼</button>
                    </div>
                </div>
            </div>

            <!-- Flex Controls (Conditional) -->
            <div id="ds-sub-flex" style="display:none; background:rgba(255,255,255,0.03); padding:10px; border-radius:8px;">
                <div style="margin-bottom:8px;">
                    <label class="ds-label-micro" style="font-size:9px; color:#888; text-transform:uppercase;">Justify</label>
                    <select id="ds-input-justify" class="ds-input" style="font-size:11px;">
                        <option value="flex-start">Start</option>
                        <option value="center">Center</option>
                        <option value="flex-end">End</option>
                        <option value="space-between">Space Between</option>
                        <option value="space-around">Space Around</option>
                    </select>
                </div>
                <div>
                     <label class="ds-label-micro" style="font-size:9px; color:#888; text-transform:uppercase;">Align</label>
                     <select id="ds-input-align" class="ds-input" style="font-size:11px;">
                        <option value="stretch">Stretch</option>
                        <option value="center">Center</option>
                        <option value="flex-start">Start</option>
                        <option value="flex-end">End</option>
                     </select>
                </div>
            </div>
          </div>

          <!-- SPACING -->
          <div class="ds-section">
            <span class="ds-sec-title">Spacing</span>
            <div class="ds-grid-2">
               <div class="ds-stepper">
                   <input type="text" id="ds-input-margin" class="ds-stepper-input" placeholder="Margin">
                   <div class="ds-stepper-btns">
                     <button class="ds-step-btn" data-target="ds-input-margin" data-dir="1">▲</button>
                     <button class="ds-step-btn" data-target="ds-input-margin" data-dir="-1">▼</button>
                   </div>
               </div>
               <div class="ds-stepper">
                   <input type="text" id="ds-input-padding" class="ds-stepper-input" placeholder="Padding">
                   <div class="ds-stepper-btns">
                     <button class="ds-step-btn" data-target="ds-input-padding" data-dir="1">▲</button>
                     <button class="ds-step-btn" data-target="ds-input-padding" data-dir="-1">▼</button>
                   </div>
               </div>
            </div>
          </div>

          <!-- TYPOGRAPHY -->
          <div class="ds-section">
            <span class="ds-sec-title">Typography</span>
            <div class="ds-font-selector" style="margin-bottom:12px;">
               <div id="ds-font-trigger" class="ds-font-trigger">
                  <span id="ds-font-current">Select Font</span>
                  <span>▾</span>
               </div>
               <div id="ds-font-dropdown" class="ds-font-dropdown">
                  <div class="ds-font-option" data-font="inherit"><span class="ds-font-name">Default</span><span class="ds-font-preview">Page Default</span></div>
                  <div class="ds-font-option" data-font="'Inter', sans-serif"><span class="ds-font-name">Inter</span><span class="ds-font-preview f-inter">Clean Interface</span></div>
                  <div class="ds-font-option" data-font="'Roboto Flex', sans-serif"><span class="ds-font-name">Roboto Flex</span><span class="ds-font-preview f-flex">Google Flex</span></div>
                  <div class="ds-font-option" data-font="'Instrument Serif', serif"><span class="ds-font-name">Instrument Serif</span><span class="ds-font-preview f-instrument">Classic Serif</span></div>
                  <div class="ds-font-option" data-font="'Space Grotesk', sans-serif"><span class="ds-font-name">Space Grotesk</span><span class="ds-font-preview f-space">Tech Brutalist</span></div>
                  <div class="ds-font-option" data-font="'Outfit', sans-serif"><span class="ds-font-name">Outfit</span><span class="ds-font-preview f-outfit">Geometric Round</span></div>
                  <div class="ds-font-option" data-font="'Playfair Display', serif"><span class="ds-font-name">Playfair</span><span class="ds-font-preview f-playfair">Premium Chic</span></div>
               </div>
            </div>
            
            <div class="ds-grid-2">
               <div class="ds-stepper">
                  <input type="text" id="ds-input-size" class="ds-stepper-input" placeholder="Size (px)">
                  <div class="ds-stepper-btns">
                     <button class="ds-step-btn" data-target="ds-input-size" data-dir="1">▲</button>
                     <button class="ds-step-btn" data-target="ds-input-size" data-dir="-1">▼</button>
                  </div>
               </div>
               <select id="ds-input-weight" class="ds-input">
                 <option value="400">Regular</option>
                 <option value="500">Medium</option>
                 <option value="600">SemiBold</option>
                 <option value="700">Bold</option>
                 <option value="900">Black</option>
               </select>
            </div>
            
            <textarea id="ds-input-text-content" class="ds-textarea" style="margin-top:12px; width:100%; height:80px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px; color:#fff; padding:12px; font-size:13px; resize:vertical; font-family:'Inter', sans-serif;" placeholder="Edit text content..."></textarea>
          </div>

          <!-- APPEARANCE -->
          <div class="ds-section">
            <span class="ds-sec-title">Appearance</span>
            <div class="ds-color-row">
               <span class="ds-color-label">Text Color</span>
               <div class="ds-color-wrapper">
                  <input type="color" id="ds-picker-color">
                  <input type="text" id="ds-text-color" class="ds-input-lean" value="#FFFFFF">
               </div>
            </div>
            <div class="ds-color-row">
               <span class="ds-color-label">Background</span>
               <div class="ds-color-wrapper">
                  <input type="color" id="ds-picker-bg">
                  <input type="text" id="ds-text-bg" class="ds-input-lean" value="#000000">
               </div>
            </div>
            
            <div class="ds-grid-2" style="margin-top:16px;">
               <div class="ds-stepper">
                   <input type="text" id="ds-input-radius" class="ds-stepper-input" placeholder="Radius">
                   <div class="ds-stepper-btns">
                      <button class="ds-step-btn" data-target="ds-input-radius" data-dir="1">▲</button>
                      <button class="ds-step-btn" data-target="ds-input-radius" data-dir="-1">▼</button>
                   </div>
               </div>
               <input type="text" id="ds-input-border-width" class="ds-input" placeholder="Border (1px solid..)">
            </div>

            <!-- Shadow Editor (NEW) -->
            <div style="margin-top:12px;">
                <span class="ds-label-micro" style="font-size:9px; color:#888; text-transform:uppercase; margin-bottom:4px; display:block;">Box Shadow</span>
                <div class="ds-grid-2">
                     <select id="ds-shadow-preset" class="ds-input">
                         <option value="none">None</option>
                         <option value="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)">Subtle</option>
                         <option value="0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)">Medium</option>
                         <option value="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)">Large</option>
                         <option value="0 0 15px rgba(59, 130, 246, 0.5)">Glow (Blue)</option>
                     </select>
                </div>
            </div>
          </div>

          <!-- MEDIA (DYNAMIC) -->
          <div class="ds-section" id="ds-sec-media" style="display:none;">
            <span class="ds-sec-title">Image Properties</span>
            <input type="text" id="ds-input-src" class="ds-input" placeholder="Image URL">
            <div class="ds-grid-2" style="margin-top:12px;">
                <select id="ds-input-fit" class="ds-input">
                    <option value="cover">Cover</option>
                    <option value="contain">Contain</option>
                    <option value="fill">Fill</option>
                </select>
                <input type="text" id="ds-input-alt" class="ds-input" placeholder="Alt Text">
            </div>
          </div>
        </div>

        <div class="ds-footer">
          <div class="ds-footer-grid">
             <button id="ds-btn-reset" class="ds-btn-reset" title="Reset Session">↺</button>
             <button id="ds-btn-generate" class="ds-primary-btn">
               ✨ Generate Copilot Prompt
             </button>
          </div>
        </div>
        `;

        document.body.appendChild(sidebar);
        setupInternalListeners(sidebar);
    }

    function setupInternalListeners(sb) {
        sb.querySelector('.ds-close').onclick = () => toggleSidebar(false);

        // --- Custom Dropdown Logic ---
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

        // --- Binding Styles ---
        bindStyle('ds-input-size', 'fontSize', 'px');
        bindStyle('ds-input-weight', 'fontWeight');
        bindStyle('ds-input-lineheight', 'lineHeight');
        bindStyle('ds-input-margin', 'margin');
        bindStyle('ds-input-padding', 'padding');
        bindStyle('ds-input-radius', 'borderRadius');
        bindStyle('ds-input-border-width', 'border');
        bindStyle('ds-input-gap', 'gap', 'px');

        // Flexbox Logic
        const displaySelect = document.getElementById('ds-input-display');
        displaySelect.onchange = (e) => {
            applyStyle('display', e.target.value);
            document.getElementById('ds-sub-flex').style.display = (e.target.value === 'flex' || e.target.value === 'inline-flex') ? 'block' : 'none';
        };

        bindStyle('ds-input-justify', 'justifyContent');
        bindStyle('ds-input-align', 'alignItems');

        // Shadow Logic
        document.getElementById('ds-shadow-preset').onchange = (e) => {
            applyStyle('boxShadow', e.target.value);
        };

        // Colors
        bindColors('ds-picker-color', 'ds-text-color', 'color');
        bindColors('ds-picker-bg', 'ds-text-bg', 'backgroundColor');

        // Actions
        document.getElementById('ds-btn-copy-style').onclick = copyStyle;
        document.getElementById('ds-btn-paste-style').onclick = pasteStyle;
        document.getElementById('ds-btn-generate').onclick = generatePrompt;
        document.getElementById('ds-btn-reset').onclick = resetSession;

        document.getElementById('ds-btn-undo').onclick = undo;
        document.getElementById('ds-btn-redo').onclick = redo;

        // Content Editable
        document.getElementById('ds-input-text-content').oninput = (e) => {
            if (selectedEl) {
                const oldText = selectedEl.innerText;
                selectedEl.innerText = e.target.value;
                trackInLog('innerText', oldText, e.target.value);
            }
        };

        // --- Draggable Sidebar ---
        makeDraggable(document.getElementById('devstyle-sidebar-container'));

        // --- Stepper Long Press ---
        setupSteppers();
    }

    /* --- Steppers --- */
    function setupSteppers() {
        document.querySelectorAll('.ds-step-btn').forEach(btn => {
            let intervalId = null;
            let timeoutId = null;

            const step = () => {
                const targetId = btn.dataset.target;
                const input = document.getElementById(targetId);
                const dir = parseInt(btn.dataset.dir);

                let currentVal = input.value;
                let num = parseFloat(currentVal);
                let unit = currentVal.replace(/[0-9.-]/g, '') || 'px';

                if (isNaN(num)) num = 0;
                num += dir;

                const newVal = num + unit;
                input.value = newVal;
                input.dispatchEvent(new Event('change'));
            };

            const start = (e) => {
                if (e.button !== 0) return;
                step();
                timeoutId = setTimeout(() => {
                    intervalId = setInterval(step, 40);
                }, 400);
            };

            const stop = () => {
                clearTimeout(timeoutId);
                clearInterval(intervalId);
            };

            btn.addEventListener('mousedown', start);
            btn.addEventListener('mouseup', stop);
            btn.addEventListener('mouseleave', stop);
        });
    }

    /* --- Draggable --- */
    function makeDraggable(el) {
        const header = el.querySelector('.ds-header');
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        header.onmousedown = (e) => {
            if (e.target.closest('button')) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            const rect = el.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;

            el.style.right = 'auto';
            el.style.left = initialLeft + 'px';
            el.style.top = initialTop + 'px';

            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', stopDrag);
            document.body.style.userSelect = 'none';
        };

        const onDrag = (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            el.style.left = (initialLeft + dx) + 'px';
            el.style.top = (initialTop + dy) + 'px';
        };

        const stopDrag = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
            document.body.style.userSelect = '';
        };
    }

    /* --- Logic --- */
    function applyStyle(prop, val) {
        if (!selectedEl) return;
        const old = selectedEl.style[prop];
        selectedEl.style[prop] = val;
        pushHistory({ type: 'style', el: selectedEl, prop: prop, old: old, new: val });
        trackInLog(prop, old, val);
    }

    function trackInLog(prop, oldV, newV) {
        if (!globalChangeLog.has(selectedEl)) globalChangeLog.set(selectedEl, {});
        const changes = globalChangeLog.get(selectedEl);
        if (!changes[prop]) changes[prop] = { from: oldV || 'abc', to: newV };
        else changes[prop].to = newV;
        updateUI();
    }

    function updateUI() {
        // Optional: Update button text or state
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
        p.oninput = (e) => {
            t.value = e.target.value;
            applyStyle(prop, e.target.value);
        };
        t.onchange = (e) => {
            p.value = e.target.value;
            applyStyle(prop, e.target.value);
        };
    }

    function selectElement(el) {
        if (selectedEl && selectedEl !== el) selectedEl.classList.remove('ds-selected');
        selectedEl = el;
        selectedEl.classList.add('ds-selected');

        updateBreadcrumbs(el);

        const s = window.getComputedStyle(el);
        const set = (id, v) => { const i = document.getElementById(id); if (i) i.value = v; };

        // Basic
        set('ds-input-size', parseInt(s.fontSize));
        set('ds-input-margin', s.margin);
        set('ds-input-padding', s.padding);
        set('ds-text-color', rgbToHex(s.color));
        set('ds-text-bg', rgbToHex(s.backgroundColor));
        set('ds-input-radius', s.borderRadius);

        // Flex / Layout
        set('ds-input-display', s.display);
        document.getElementById('ds-sub-flex').style.display = (s.display === 'flex' || s.display === 'inline-flex') ? 'block' : 'none';
        set('ds-input-justify', s.justifyContent);
        set('ds-input-align', s.alignItems);
        set('ds-input-gap', s.gap);

        // Content
        document.getElementById('ds-input-text-content').value = el.innerText;
        document.getElementById('ds-sec-media').style.display = el.tagName === 'IMG' ? 'block' : 'none';
    }

    function updateBreadcrumbs(el) {
        const container = document.getElementById('ds-breadcrumbs');
        container.innerHTML = '';
        let curr = el;
        let path = [];

        while (curr && curr.tagName !== 'BODY' && curr !== document.documentElement && path.length < 5) {
            path.unshift(curr);
            curr = curr.parentElement;
        }

        path.forEach((node, i) => {
            const span = document.createElement('span');
            span.className = 'ds-crumb-item';

            let name = node.tagName.toLowerCase();
            if (node.id) name += `#${node.id}`;
            else if (node.classList.length > 0) name += `.${node.classList[0]}`;

            span.innerText = name;
            span.onclick = (e) => { e.preventDefault(); e.stopPropagation(); selectElement(node); };

            container.appendChild(span);
            if (i < path.length - 1) {
                const arrow = document.createElement('span');
                arrow.className = 'ds-crumb-arrow';
                arrow.innerText = '/';
                container.appendChild(arrow);
            }
        });
    }

    function copyStyle() {
        const s = window.getComputedStyle(selectedEl);
        copiedStyles = { color: s.color, backgroundColor: s.backgroundColor, borderRadius: s.borderRadius, padding: s.padding, fontSize: s.fontSize, boxShadow: s.boxShadow };
        document.getElementById('ds-btn-paste-style').disabled = false;
        alert("Style Copied");
    }

    function pasteStyle() {
        if (!copiedStyles) return;
        for (const [p, v] of Object.entries(copiedStyles)) applyStyle(p, v);
    }

    /* --- Copilot CLI Integration (CORE FEATURE) --- */
    function generatePrompt() {
        if (globalChangeLog.size === 0) return alert("No changes recorded!");

        // Build the command string
        let cmd = `gh copilot suggest "Update the following frontend elements: `;
        let details = [];

        for (const [el, changes] of globalChangeLog.entries()) {
            const cleanClasses = Array.from(el.classList).filter(c => !c.startsWith('ds-'));
            let selector = el.tagName.toLowerCase();
            if (el.id) selector += `#${el.id}`;
            else if (cleanClasses.length) selector += `.${cleanClasses.join('.')}`;

            let changeDesc = [];
            for (const [prop, val] of Object.entries(changes)) {
                if (prop === 'innerText') changeDesc.push(`change text to '${val.to.substring(0, 20)}...'`);
                else changeDesc.push(`set ${prop} to ${val.to}`);
            }
            details.push(`${selector} (${changeDesc.join(', ')})`);
        }

        cmd += details.join('; ') + ` "`;

        // Copy to clipboard
        navigator.clipboard.writeText(cmd).then(() => {
            alert("Copied GitHub Copilot CLI Command!\n\nPaste into terminal: " + cmd);
        });
    }

    function resetSession() {
        if (confirm("Reset everything?")) {
            globalChangeLog.clear();
            alert("Session Reset");
        }
    }

    /* --- Undo/Redo --- */
    function pushHistory(a) {
        historyStack.push(a);
        if (historyStack.length > 30) historyStack.shift();
        redoStack = [];
        updateHistoryBtns();
    }
    function undo() {
        if (!historyStack.length) return;
        const a = historyStack.pop();
        redoStack.push(a);
        if (a.type === 'style') a.el.style[a.prop] = a.old;
        updateHistoryBtns();
    }
    function redo() {
        if (!redoStack.length) return;
        const a = redoStack.pop();
        historyStack.push(a);
        if (a.type === 'style') a.el.style[a.prop] = a.new;
        updateHistoryBtns();
    }
    function updateHistoryBtns() {
        document.getElementById('ds-btn-undo').disabled = !historyStack.length;
        document.getElementById('ds-btn-redo').disabled = !redoStack.length;
    }

    function rgbToHex(rgb) {
        if (!rgb) return '#000000';
        if (rgb.startsWith('#')) return rgb;
        const res = rgb.match(/\d+/g);
        if (!res || res.length < 3) return '#000000';
        return "#" + ((1 << 24) + (parseInt(res[0]) << 16) + (parseInt(res[1]) << 8) + parseInt(res[2])).toString(16).slice(1);
    }

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

            const highlighted = document.querySelector('.ds-highlight');
            if (highlighted) highlighted.classList.remove('ds-highlight');
            if (selectedEl) {
                selectedEl.classList.remove('ds-selected');
                selectedEl = null;
            }
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
