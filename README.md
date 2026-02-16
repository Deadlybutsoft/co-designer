# Co Designer

**Co Designer** is a Chrome extension that turns your browser into a visual design studio for the GitHub Copilot CLI.

Make visual edits to any webpage — fonts, layout, colors, shadows — and instantly generate the exact `gh copilot suggest` prompt needed to code those changes.

## Features
- **Visual Editor**: Click any element to edit CSS properties in real-time.
- **Copilot Integration**: One click generates a `gh copilot suggest` prompt with all your changes.
- **Advanced Controls**: Flexbox/Grid layouts, Box Shadows, Typography, Spacing.
- **Premium UI**: Dark mode, glassmorphism interface, smooth animations.

## Installation
1. Clone this repo.
2. Open Chrome and go to `chrome://extensions`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select this directory.

## Usage
1. Click the **Co Designer** icon (paintbrush) in your toolbar.
2. The sidebar will appear on the right.
3. **Click on any element** on the page to select it.
4. Use the sidebar controls to modify its style.
5. When happy, click **✨ Generate Prompt**.
6. Paste the generated command into your terminal to get the code via GitHub Copilot CLI.

## Tech Stack
- Vanilla JavaScript (ES6+)
- CSS3 (Glassmorphism, Grid/Flexbox)
- Chrome Extension Manifest V3
