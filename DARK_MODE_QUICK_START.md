# Dark Mode Quick Start Guide

## 🚀 For New Contributors

### Quick Overview
SaveBook now has a fully implemented dark mode feature. This guide helps you understand and work with it.

---

## 📦 Files You Need to Know About

### Essential Files
1. **`context/theme/ThemeProvider.js`** - Main theme management
2. **`context/theme/themeContext.js`** - Theme hook/API
3. **`components/common/ThemeToggle.js`** - Toggle button
4. **`tailwind.config.js`** - Tailwind dark mode config
5. **`app/globals.css`** - Global dark mode styles

### Already Integrated In
- `app/layout.js` - Wraps app with ThemeProvider
- `components/common/Navbar.js` - Has toggle button

---

## 🎨 How to Add Dark Mode to New Components

### Step 1: Use Tailwind Dark Classes
```jsx
// Light mode | Dark mode
<div className="bg-white dark:bg-gray-900">
    <p className="text-gray-900 dark:text-white">Content</p>
</div>
```

### Step 2: Color Palette Reference
```
Light Mode:
- Background: bg-white, bg-gray-50
- Text: text-gray-900, text-gray-700
- Border: border-gray-300, border-gray-200

Dark Mode (add "dark:" prefix):
- Background: dark:bg-gray-900, dark:bg-gray-800
- Text: dark:text-white, dark:text-gray-300
- Border: dark:border-gray-700, dark:border-gray-600
```

### Step 3: Forms & Inputs
```jsx
<input className="
    bg-white dark:bg-gray-800
    text-gray-900 dark:text-white
    border-gray-300 dark:border-gray-600
    focus:ring-blue-500
    placeholder-gray-500 dark:placeholder-gray-400
" />
```

### Step 4: Testing
- Toggle theme (Moon/Sun button in navbar)
- Verify your component looks good in both modes
- Check contrast with WCAG standards

---

## 🎯 Common Patterns

### Pattern 1: Simple Background & Text
```jsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
    Content here
</div>
```

### Pattern 2: Cards/Containers
```jsx
<div className="
    bg-white dark:bg-gray-800
    border border-gray-200 dark:border-gray-700
    rounded-lg p-4
">
    Card content
</div>
```

### Pattern 3: Buttons
```jsx
<button className="
    bg-blue-600 hover:bg-blue-700
    dark:bg-blue-700 dark:hover:bg-blue-800
    text-white rounded-lg
">
    Click me
</button>
```

### Pattern 4: Modal Overlays
```jsx
<div className="
    fixed inset-0
    bg-black/40 dark:bg-black/60
    flex items-center justify-center
">
    Modal content
</div>
```

---

## ✨ Using the Theme Hook

If you need to access theme state in JavaScript:

```javascript
import { useTheme } from '@/context/theme/themeContext';

export default function MyComponent() {
    const { theme, toggleTheme, setThemeMode } = useTheme();
    
    return (
        <div>
            <p>Current theme: {theme}</p>
            <button onClick={toggleTheme}>Toggle</button>
            <button onClick={() => setThemeMode('light')}>Light</button>
            <button onClick={() => setThemeMode('dark')}>Dark</button>
        </div>
    );
}
```

---

## 🔍 How to Check Your Work

1. **In Development**:
   ```bash
   npm run dev
   ```
   - Click Moon/Sun button to toggle
   - Check if your component looks good in both modes

2. **In Production Build**:
   ```bash
   npm run build
   npm run start
   ```
   - Verify theme persistence (reload page)

3. **Color Contrast**:
   - Use browser DevTools > Lighthouse
   - Check "Accessibility" section
   - Ensure text meets WCAG AA standards

---

## 🎨 Color Reference Card

### Grays (Most Commonly Used)
```
Light Mode                Dark Mode
bg-white                  dark:bg-gray-900 (very dark)
bg-gray-50               dark:bg-gray-800 (dark)
bg-gray-100              dark:bg-gray-700 (medium)
bg-gray-200              dark:border-gray-600
bg-gray-300              dark:border-gray-700

text-gray-900            dark:text-white
text-gray-700            dark:text-gray-300
text-gray-600            dark:text-gray-400
text-gray-500            dark:text-gray-500 (usually not used)
```

### Quick Decision Tree
```
Is it a background?
├─ Large container? → Use white/gray-900
├─ Card/box? → Use gray-50/gray-800
└─ Small element? → Use gray-100/gray-700

Is it text?
├─ Primary text? → Use gray-900/white
├─ Secondary text? → Use gray-700/gray-300
└─ Hint/disabled? → Use gray-500/gray-500

Is it a border?
├─ Light separator? → Use gray-200/gray-700
└─ Input border? → Use gray-300/gray-600
```

---

## ❌ Common Mistakes to Avoid

### ❌ Forgetting Dark Classes
```javascript
// BAD - no dark mode styling
<div className="bg-white text-gray-900">
```

### ❌ Using Wrong Color Combinations
```javascript
// BAD - poor contrast in dark mode
<div className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-600">
```

### ❌ Hard-Coding Colors
```javascript
// BAD - not using Tailwind
<div style={{ backgroundColor: '#ffffff' }}>
```

### ✅ Correct Way
```javascript
// GOOD - proper dark mode support
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

---

## 📊 Component Checklist

When adding a new component, ensure:

- [ ] Light mode styling applied
- [ ] Dark mode styling applied (dark: prefix)
- [ ] Text has sufficient contrast in both modes
- [ ] Forms are readable in both modes
- [ ] Hover states work in both modes
- [ ] Focus states are visible in both modes
- [ ] Tested with theme toggle
- [ ] Tested on mobile

---

## 🆘 Need Help?

### Resources
1. Read `DARK_MODE_DOCUMENTATION.md` for detailed info
2. Check `DARK_MODE_IMPLEMENTATION_REPORT.md` for overview
3. Look at existing components as examples:
   - `components/notes/Notes.js`
   - `components/common/Navbar.js`
   - `app/page.js`

### Example Components
All these have proper dark mode:
- Notes page
- Login page
- Navbar
- Theme toggle button
- Modals

---

## 🎁 Tips & Tricks

### Tip 1: Copy-Paste Patterns
Use these tested patterns as templates:
```jsx
// Copy this pattern for new containers
<div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
```

### Tip 2: Use Tailwind IntelliSense
Install Tailwind CSS IntelliSense extension in VS Code for:
- Auto-completion of dark: classes
- Color preview on hover
- Quick documentation

### Tip 3: Browser DevTools
1. Open DevTools
2. Toggle dark mode at system level
3. Page automatically switches in development

---

## 📝 Commit Message Examples

When committing dark mode changes:

```
feat: add dark mode to ProfileCard component

- Add light/dark mode classes to container
- Update text colors for contrast
- Add hover state styling
- Test in both light and dark modes

Closes #123
```

---

## 🚀 Ready to Code?

1. Pick a component that needs dark mode
2. Review this guide again
3. Apply dark mode classes using patterns above
4. Test with theme toggle
5. Create a pull request! 🎉

---

## 💡 Remember

- **Consistency**: Use the same colors across components
- **Contrast**: Always check readability in both modes
- **Testing**: Toggle between themes while developing
- **Documentation**: Update component comments if needed

---

**Happy coding! 🌙☀️**

*For questions, refer to DARK_MODE_DOCUMENTATION.md*
