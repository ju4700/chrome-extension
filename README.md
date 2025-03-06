# Musafir Chrome Extension

## Overview

**Musafir** is a powerful, tamper-proof Chrome extension designed to protect users from adult haram (forbidden) content on the web. Once activated for a specified period, the extension cannot be disabled until the timer expires, ensuring a committed and uninterrupted focus on maintaining digital purity. Built with a modern, minimalistic design and a halal vibe, Musafir leverages an extensive keyword-based filtering system to block and blur adult content across all tabs and sites.

- **Version**: 1.1
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

### How to Install the Musafir Extension on Chrome Using a .crx File

Here’s how you can install it using the `musafir.crx` file—no tech skills needed, I promise! Just follow these steps:

#### Steps to Install
1. **Grab the .crx File**:  
   - Download `musafir.crx` from my official support page: [https://ju4700.github.io/chrome-extension/downloads/musafir.crx](https://ju4700.github.io/chrome-extension/downloads/musafir.crx). It’s a safe link, so no worries!

2. **Turn On Developer Mode in Chrome**:  
   - Open Chrome and type `chrome://extensions/` in the address bar, then hit Enter.  
   - In the top-right corner, you’ll see a toggle for **Developer mode**. Flip it to **on**. This lets you install extensions manually.

3. **Add the .crx File to Chrome**:  
   - Find the `musafir.crx` file you downloaded (probably in your Downloads folder).  
   - Drag the file and drop it onto the `chrome://extensions/` page in Chrome.  
   - A pop-up will ask, “Add ‘Musafir’?” with two buttons: **Add extension** or **Cancel**. Click **Add extension**, and you’re good to go!

4. **Check That It Worked**:  
   - You’ll see Musafir listed on the `chrome://extensions/` page with its own ID.  
   - Look for the Musafir icon in your Chrome toolbar (it might be under the puzzle piece icon—click it and pin Musafir to make it easier to find).  
   - Give it a quick test: open the extension, set a timer, and try visiting a blocked site (like *.porn or *.xxx). It should redirect you to a safe page.

#### A Few Things to Know
- **Heads-Up on Security**:  
   Chrome might show a warning like, “This extension isn’t from the Chrome Web Store and may have been added without your knowledge.” Don’t worry—it’s just Chrome being cautious since I haven’t published it on the Web Store yet. You’re safe since you got it straight from me!
  
- **Updates**:  
   Since this is a manual install, Musafir won’t auto-update. If I release a new version, I’ll let you know, and you’ll just need to download the updated `.crx` file and repeat these steps.

- **Keep Developer Mode On**:  
   For Musafir to work, you’ll need to leave Developer mode turned on in Chrome. If you turn it off, Chrome might disable the extension. Alternatively, I’m working on getting it onto the Chrome Web Store for a smoother experience soon!

Let me know if you run into any issues—I’m here to help! You can reach out via the support page at [https://ju4700.github.io/musafir-extension/](https://ju4700.github.io/musafir-extension/) or email me at `jalal.dev.design@gmail.com`. Enjoy safer browsing with Musafir! 😊

---

### Notes on the Rewrite
- **Tone**: Kept it professional but friendly with phrases like “Hey friends!” and “I promise!” to make it approachable for your friends.
- **Clarity**: Simplified the steps while keeping all necessary details (e.g., enabling Developer mode, drag-and-drop process).
- **Reassurance**: Addressed the security warning in a casual way to ease concerns, emphasizing trust in your source.
- **Call to Action**: Encouraged testing and provided support options, making it easy for your friends to reach out.

Let me know if you’d like further adjustments or need help with anything else!
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
