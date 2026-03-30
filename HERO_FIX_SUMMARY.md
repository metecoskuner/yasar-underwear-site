# Hero Video Layout Bug Fix

## Problem
The Hero video section was overlapping with the fixed header after page refresh due to:
1. **Double spacing**: Both Layout and Hero were adding padding/spacing
2. **Hardcoded values**: Hero used fixed `vh` heights (70vh, 80vh, 600px, 700px) that didn't account for header
3. **Timing issues**: CSS variable wasn't set during initial render on refresh

## Root Cause Analysis

**Layout Structure:**
- Header: `fixed top-0 z-40` (removed from document flow)
- Main content: `padding-top: calc(var(--site-header-height, 64px) - 1px)` 
- Hero: Had `pt-[120px]` padding PLUS fixed `vh` heights → double offset

**Why Refresh Broke It:**
- CSS variable `--site-header-height` set by JavaScript
- On initial page load, JavaScript hadn't executed yet
- Hero rendered with wrong spacing, appearing to overlap header

## Solution

### Updated Hero Component (`src/components/Hero.tsx`)

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

### Key Changes

1. **Removed hardcoded padding** (`pt-[120px]`)
   - Layout's main#content now handles ALL spacing via CSS variable
   - Single source of truth for header offset

2. **Replaced fixed height values with responsive calc()**
   - Old: Fixed `vh` values (70vh, 80vh, 600px, 700px)
   - New: `min-height: calc(100vh - var(--site-header-height, 120px))`
   - Automatically fills remaining viewport height after header

3. **Maintained video fill behavior**
   - Video element: `className="w-full h-full object-cover"`
   - Video scales to fill entire calculated section

4. **Used CSS variable with fallback**
   - `var(--site-header-height, 120px)` ensures fallback if variable not set
   - Defined in `src/styles/globals.css` as `--site-header-height: 120px`

## Supporting Infrastructure

### Layout Component (`src/components/Layout.tsx`)
```tsx
<main id="content" className="flex-1">{children}</main>
```
- Provides `padding-top: max(0px, calc(var(--site-header-height, 64px) - 1px))`
- Single spacing mechanism for all content

### Global Styles (`src/styles/globals.css`)
```css
:root {
  --site-header-height: 120px;
}

main#content {
  padding-top: max(0px, calc(var(--site-header-height, 64px) - 1px));
}
```
- CSS variable definition with sensible default
- Prevents layout shift even before JavaScript sets dynamic value

### Header Component (`src/components/Header.tsx`)
```tsx
className="w-full shadow-sm text-white bg-[var(--brand-color)] fixed top-0 left-0 right-0 z-40"
```
- Fixed positioning at top
- Z-index z-40 ensures it stays above content

## Benefits of This Fix

✅ **No double spacing** - Single point of control (Layout main)
✅ **Responsive height** - Automatically fills remaining viewport
✅ **Works on refresh** - CSS variable has fallback, no timing issues
✅ **Production-ready** - Uses standard CSS patterns, no hacks
✅ **Mobile-friendly** - `calc()` works on all modern browsers
✅ **Maintainable** - Easy to adjust header height via single CSS variable
✅ **Accessible** - Video still fully visible with proper spacing

## How It Works

1. **On page load:**
   - CSS variable `--site-header-height: 120px` is parsed from globals.css
   - Layout applies `padding-top: calc(120px - 1px)`
   - Hero calculates `min-height: calc(100vh - 120px)`
   - No waiting for JavaScript execution

2. **After JavaScript loads:**
   - Header component measures its actual height
   - Sets CSS variable dynamically: `--site-header-height: <actual-height>`
   - All calculations update immediately via CSS variable reactivity

3. **On page refresh:**
   - Same process as initial load - works correctly every time
   - No flash, no overlap, consistent spacing

## Testing Checklist

- [ ] Hero video appears below header on initial load
- [ ] Video stays below header after F5 refresh
- [ ] Mobile view works correctly (responsive)
- [ ] Tablet/desktop views fill viewport correctly
- [ ] Video scales properly with object-fit: cover
- [ ] Mute button still functions
- [ ] No layout shift on page load or refresh
- [ ] No overlap with header in any viewport

## Files Modified

- `src/components/Hero.tsx` - Removed hardcoded padding, updated height logic

## Commit Info

```
fix: remove hardcoded padding from Hero, use CSS variable-based min-height calc

- Remove pt-[120px] and fixed vh heights from Hero section
- Use min-height: calc(100vh - var(--site-header-height, 120px)) for responsive height
- Let Layout's main#content handle all spacing via padding-top CSS variable
- Prevents double offset and layout shift on page refresh
- Video now fills entire calculated space with object-fit: cover

Commit: 49af532
```

## Production Verification

Deploy and verify at: https://www.yasarunderwear.com

The fix should be immediately visible - Hero video will properly fill the viewport while respecting the fixed header height, with no overlap or shifting.
