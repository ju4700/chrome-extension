# Musafir Chrome Extension

## Overview

**Musafir** is a powerful, tamper-proof Chrome extension designed to protect users from adult haram (forbidden) content on the web. Once activated for a specified period, the extension cannot be disabled until the timer expires, ensuring a committed and uninterrupted focus on maintaining digital purity. Built with a modern, minimalistic design and a halal vibe, Musafir leverages an extensive keyword-based filtering system to block and blur adult content across all tabs and sites.

- **Version**: 5.1
- **Last Updated**: March 05, 2025

### Key Features
- **Adult Content Blocking**: Targets over 100 specific adult-related keywords for robust filtering.
- **Tamper-Proof Design**: Prevents disabling during the active period with reload and re-enable mechanisms.
- **Irreversible Activation**: No unlock option—protection lasts until the set duration ends.
- **Universal Coverage**: Works across all tabs, iframes, and websites.
- **Professional UI**: Modern, minimalistic design with green halal tones and Quranic inspiration.
- **Customizable Settings**: Allows users to add custom domains and regex patterns.

### Halal Vibe
Musafir incorporates a halal aesthetic with:
- Green color palette (#2E7D32, #C8E6C9) symbolizing purity and paradise.
- Quranic ayahs (e.g., Quran 24:30, 2:45) for spiritual guidance.
- Elegant Arabic typography with the "Tajawal" font.

![Screenshot From 2025-03-06 19-24-42](https://github.com/user-attachments/assets/0fde476d-4cc3-4b49-84ac-6e90cf3a8088)
![Screenshot From 2025-03-07 01-42-34](https://github.com/user-attachments/assets/adc09e09-412c-4eb3-bf08-34c8311be219)
---

## Installation

### Prerequisites
- **Google Chrome**: Version 88 or higher (required for Manifest V3).
- **Node.js and npm** (optional, for development and building).

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ju4700/chrome-extension.git
   cd chrome-extension
   ```

2. **Install Dependencies** (if building locally):
   - Ensure `AlQalam.ttf` and `icons/*.png` are in their respective folders.
   - No additional dependencies are required for the base extension, but you can use a linter (e.g., ESLint) for code quality.

3. **Load the Extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable "Developer mode" in the top-right corner.
   - Click "Load unpacked" and select the `musafir` directory.
   - The Musafir icon should appear in your toolbar.

4. **Verify Installation**:
   - Click the Musafir icon to open the popup.
   - Ensure no errors appear in the Chrome console (`Ctrl+Shift+J`).

---

## Usage

### Activation
1. **Open the Popup**:
   - Click the Musafir icon in the Chrome toolbar.
2. **Select a Duration**:
   - Choose a preset: 1 Hour, 24 Hours, 1 Week, or 1 Month.
   - Or enter a custom duration (1–720 hours) in the input field and click "Activate".
3. **Confirmation**:
   - The extension activates immediately and displays the remaining time in the status panel.
   - The control panel hides until the period ends.

### During Activation
- **Blocking**: Adult content (e.g., "pornhub.com") is redirected to a block page and blurred in media.
- **Tamper Resistance**: Attempting to disable the extension triggers a reload or alert.
- **Status**: The popup shows the end time and countdown.

### Deactivation
- The extension automatically deactivates when the timer expires.
- No manual deactivation or unlock option is available.

### Settings
1. **Access Settings**:
   - Click the extensions menu (puzzle piece icon) and select "Musafir Settings".
2. **Configure Profiles**:
   - Switch between "Strict", "Moderate", or "Custom" profiles.
3. **Add Custom Blocks**:
   - Enter domain names (e.g., "badsite.com") or regex patterns (e.g., `.*\\.adult.*`) in the respective textareas.
   - Click "Save Changes" to apply.
4. **View Block Log**:
   - See a log of blocked URLs and timestamps (read-only).
5. **Reset Stats**:
   - Click "Reset Stats" to clear the block log.

### Context Menu
- Right-click on a page and select "Block Site" to add the domain to custom blocks.

---

## Technical Details

### File Structure
```
musafir/
├── manifest.json         # Extension configuration
├── background.js         # Background logic (blocking, timer)
├── content.js            # Content script (media blurring)
├── popup.html            # Popup UI
├── popup.css             # Popup styling
├── options.html          # Settings UI
├── options.js            # Settings logic
├── blocked.html          # Block page
├── styles.css            # Blurring styles
├── fonts/                # Custom fonts (Tajawal-Regular.ttf)
└── icons/                # Extension icons (16.png, 48.png, 128.png)
```

### Manifest V3
- Uses Manifest V3 for modern Chrome compatibility.
- Permissions: `webNavigation`, `storage`, `scripting`, `notifications`, `alarms`, `declarativeNetRequest`, `tabs`, `management`, `contextMenus`.
- Host permissions: `<all_urls>` for universal coverage.

### Keyword System
- **Adult Keywords**: Over 100 terms (e.g., "porn", "xvideos", "camshow") target explicit content.
- **Custom Blocks**: Users can add domains or regex patterns via settings.
- **Blocking Mechanism**: `webNavigation.onBeforeNavigate` and `declarativeNetRequest` redirect matching URLs.

### Tamper Resistance
- **Alarms**: Checks state every 15 seconds, reloads if tampered.
- **Management**: Re-enables the extension if disabled during an active period.

### Timer
- Irreversible once set, managed by `enforceTimer` in `background.js`.
- Syncs with `popup.js` for real-time countdown.

### Blurring
- `content.js` blurs media (images, videos) matching keywords.
- `styles.css` applies a 20px blur with a notification overlay.

---

## Development

### Prerequisites
- **Node.js**: For linting or building (optional).
- **Chrome**: Version 88+ for Manifest V3.

### Building
1. **Install Tools** (optional):
   ```bash
   npm install eslint --save-dev
   ```
2. **Lint Code**:
   ```bash
   npx eslint background.js content.js popup.js options.js
   ```
3. **Manual Build**: No build step required; copy files to the extension directory.

### Contributing
1. **Fork the Repository**:
   ```bash
   git fork https://github.com/yourusername/musafir.git
   ```
2. **Create a Branch**:
   ```bash
   git checkout -b feature/your-feature
   ```
3. **Commit Changes**:
   ```bash
   git commit -m "Add your feature"
   ```
4. **Push and Submit PR**:
   ```bash
   git push origin feature/your-feature
   ```
   - Submit a pull request with a detailed description.

### Coding Standards
- Use consistent indentation (2 spaces).
- Follow JavaScript ES6+ syntax.
- Add comments for complex logic.
- Test changes thoroughly.

### Reporting Issues
- File issues on GitHub with:
  - Steps to reproduce.
  - Expected vs. actual behavior.
  - Console logs (`Ctrl+Shift+J`).

---

## Troubleshooting

### Common Issues
1. **Service Worker Registration Failed (Status Code 15)**:
   - **Cause**: Syntax error or missing file.
   - **Fix**: Check `background.js` for errors, ensure all files are in the root directory, and reload the extension.

2. **Blocking Safe Searches**:
   - **Cause**: Broad keywords (e.g., "sex") triggering false positives.
   - **Fix**: Add specific domains (e.g., "google.com") to custom blocks with a negative regex (e.g., `^(?!.*google\.com)`), or report for whitelist adjustment.

3. **Extension Not Loading**:
   - **Cause**: Manifest misconfiguration.
   - **Fix**: Verify `manifest.json` permissions and file paths, then reload.

4. **Tamper Resistance Not Working**:
   - **Cause**: Chrome policy restrictions.
   - **Fix**: Ensure `management` permission is active; test in a non-incognito window.

### Debugging
- Open Chrome DevTools (`Ctrl+Shift+I` or `Ctrl+Shift+J`).
- Check the "Extensions" tab for errors.
- Enable verbose logging in `background.js` and `content.js` with `console.log`.

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments
- Inspired by the need for digital purity in the modern age.
- Thanks to the xAI community for support and feedback.

---

### Future Enhancements
- **Whitelist Feature**: Allow users to exempt safe sites.
- **Analytics Dashboard**: Track blocking statistics.
- **Multi-Language Support**: Add Arabic UI.
