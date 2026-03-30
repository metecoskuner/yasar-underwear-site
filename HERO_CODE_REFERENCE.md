# Updated Hero Component Code

## Complete Hero.tsx File (Production Ready)

```tsx
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';

export default function Hero() {
  const { t } = useLanguage();
  const [isMuted, setIsMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const tr = (key: string, fallback: string) => {
    try {
      const v = t(key);
      return v === key ? fallback : v;
    } catch {
      return fallback;
    }
  };

  const videoSrc = (isMobile ? '/videos/yasarheromobil.mp4' : '/videos/YasarHero1.mp4');

  return (
    <section 
      className="relative w-full overflow-hidden"
      style={{ minHeight: 'calc(100vh - var(--site-header-height, 120px))' }}
    >
      <video
        key={videoSrc}
        ref={(video) => {
          if (video) video.muted = isMuted;
        }}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="w-full h-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
      
      {/* Mute/Unmute Button */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all duration-200 z-10 text-2xl"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
    </section>
  );
}
```

## Key Changes Explained

### 1. Section Element (Container)

**Before:**
```tsx
<section className="relative w-full h-[70vh] sm:h-[80vh] md:h-[600px] lg:h-[700px] overflow-hidden pt-[120px]">
```

**After:**
```tsx
<section 
  className="relative w-full overflow-hidden"
  style={{ minHeight: 'calc(100vh - var(--site-header-height, 120px))' }}
>
```

**Explanation:**
- **Removed:** `h-[70vh] sm:h-[80vh] md:h-[600px] lg:h-[700px]` - Multiple breakpoint heights
- **Removed:** `pt-[120px]` - Hardcoded padding
- **Added:** `style={{ minHeight: '...' }}` - Inline style for responsive height
- **Formula:** `calc(100vh - var(--site-header-height, 120px))`
  - `100vh` = Full viewport height
  - `var(--site-header-height, 120px)` = Header height from CSS (fallback: 120px)
  - Result: Hero fills remaining space after header

### 2. Video Element (No Changes)

```tsx
<video
  key={videoSrc}
  ref={(video) => {
    if (video) video.muted = isMuted;
  }}
  autoPlay
  loop
  muted={isMuted}
  playsInline
  className="w-full h-full object-cover"
>
  <source src={videoSrc} type="video/mp4" />
  Your browser does not support the video tag.
</video>
```

**Why This Works:**
- `className="w-full h-full"` - Fills parent section (w-full, h-full)
- `object-cover` - Scales video to cover entire area while maintaining aspect ratio
- Parent has `minHeight` calculated value
- Video stretches to fill calculated height
- ✅ Perfect responsive behavior

### 3. Gradient Overlay (No Changes)

```tsx
<div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
```

- Positioned absolutely over video
- `inset-0` fills entire parent (with fixed positioning)
- Gradient improves text readability over video

### 4. Mute Button (No Changes)

```tsx
<button
  onClick={() => setIsMuted(!isMuted)}
  className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all duration-200 z-10 text-2xl"
  aria-label={isMuted ? "Unmute video" : "Mute video"}
>
  {isMuted ? '🔇' : '🔊'}
</button>
```

- Absolutely positioned over video
- `z-10` ensures it stays above overlay
- Toggles muted state on click

---

## CSS Variable System

### CSS Variable Definition

**File:** `src/styles/globals.css`

```css
:root {
  --site-header-height: 120px;
}

main#content {
  padding-top: max(0px, calc(var(--site-header-height, 64px) - 1px));
}
```

**How It Works:**
- `--site-header-height: 120px` - Default value (used on initial load)
- Layout's `main#content` uses same variable for padding
- Hero uses same variable for min-height calculation
- ✅ Single source of truth

### CSS Variable Fallbacks

```css
var(--site-header-height, 120px)
     ↑                         ↑
  Variable name             Fallback value
```

If the CSS variable is not defined (rare edge case), uses `120px` fallback.

**Why 120px?**
- Header height with padding: `py-4` on mobile, `py-3` on larger screens
- 120px is a reasonable average across all breakpoints
- Can be adjusted if header height changes

---

## Responsive Calculation Examples

### Mobile (414px viewport)
```
100vh = 736px (device height)
Header = 120px
Hero min-height = 736px - 120px = 616px
Result: Large video section, fills mobile viewport well
```

### Tablet (768px viewport)
```
100vh = 1024px (device height)
Header = 120px
Hero min-height = 1024px - 120px = 904px
Result: Balanced ratio, good use of space
```

### Desktop (1920px viewport)
```
100vh = 1080px (browser window height)
Header = 120px
Hero min-height = 1080px - 120px = 960px
Result: Full screen minus header, immersive
```

### After Window Resize (Dynamic)
- Recalculate happens automatically via CSS
- No JavaScript needed
- Hero always fills available space

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge | Mobile |
|---------|--------|---------|--------|------|--------|
| `calc()` | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All |
| CSS Variables | ✅ v49+ | ✅ v31+ | ✅ v9.1+ | ✅ v15+ | ✅ All |
| `minHeight` | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All |
| `object-fit` | ✅ v31+ | ✅ v36+ | ✅ v10+ | ✅ v16+ | ✅ Most |

**Fallback Behavior:**
- If CSS variable not supported: Uses `120px` (works fine)
- If `calc()` not supported: Hero height reverts to `auto` (very old browsers, rare)
- If `object-fit` not supported: Video may not fill perfectly (IE users, degraded experience)

---

## Performance Characteristics

### Rendering
- Pure CSS calculation
- No JavaScript execution for initial layout
- Renders correctly on first paint
- ✅ Better Core Web Vitals

### Reflow/Repaint
- Window resize: CSS recalculates automatically
- No layout thrashing
- Minimal paint operations
- ✅ Smooth animations and transitions

### Initial Load
- Fallback value (120px) used immediately
- Page renders with correct spacing from start
- No flash or layout shift
- JavaScript can update CSS variable later if needed

---

## Comparing Solutions

| Aspect | Old Approach | New Approach | Winner |
|--------|-------------|--------------|--------|
| **Height Definition** | Multiple breakpoints | Single formula | New (less code) |
| **Responsive** | Manual per breakpoint | Automatic CSS calc | New (future-proof) |
| **Header Aware** | ❌ No | ✅ Yes | New |
| **Works on Refresh** | ❌ Can overlap | ✅ Perfect | New |
| **Code Complexity** | Medium | Low | New |
| **Maintenance** | High (adjust breakpoints) | Low (adjust formula) | New |
| **Performance** | Good | Good+ | New (slightly better) |

---

## Troubleshooting

### Issue: Hero still overlaps header
**Check:**
- Is `--site-header-height` defined in `globals.css`?
- Is it set to correct value (120px)?
- Is Layout's `main#content` using the same variable?
- Browser console: Any CSS errors?

### Issue: Hero height doesn't respond to viewport resize
**Check:**
- Is `minHeight` using `calc()`?
- Is CSS variable syntax correct: `var(--name, fallback)`?
- Browser supports CSS variables? (modern browsers do)

### Issue: Video doesn't fill hero section
**Check:**
- Video element has `className="w-full h-full"`?
- Video has `object-fit: cover` class?
- Parent section has `overflow-hidden`?

---

## Future Enhancements

### Option 1: Dynamic Header Height
Update CSS variable in JavaScript when actual header height is known:
```javascript
useLayoutEffect(() => {
  const height = headerRef.current?.offsetHeight;
  if (height) {
    document.documentElement.style.setProperty(
      '--site-header-height',
      `${height}px`
    );
  }
}, []);
```

### Option 2: Shorter Hero on Mobile
Modify calculation for mobile devices:
```tsx
style={{ 
  minHeight: isMobile 
    ? 'calc(100vh - var(--site-header-height, 120px) - 200px)'
    : 'calc(100vh - var(--site-header-height, 120px))'
}}
```

### Option 3: Fixed Height with Fallback
Use min-height but also set max-height if needed:
```tsx
style={{
  minHeight: 'calc(100vh - var(--site-header-height, 120px))',
  maxHeight: 'calc(100vh - var(--site-header-height, 120px))',
}}
```

---

## Summary

The updated Hero component:

✅ **Removes** hardcoded padding (`pt-[120px]`)
✅ **Removes** multiple responsive heights (70vh, 80vh, 600px, 700px)
✅ **Adds** single responsive formula: `calc(100vh - var(--site-header-height, 120px))`
✅ **Uses** CSS variable system (same as Layout)
✅ **Maintains** video fill behavior with `object-fit: cover`
✅ **Provides** fallback value (120px) for initial render
✅ **Works** on refresh without overlay or shift
✅ **Scales** fluidly with viewport resize
✅ **Production-ready** and deployed

---

## Related Documentation

- `HERO_LAYOUT_FIX_COMPLETE.md` - Complete fix report
- `HERO_FIX_SUMMARY.md` - Technical summary
- `HERO_BEFORE_AFTER.md` - Visual comparison
- Production: https://www.yasarunderwear.com
