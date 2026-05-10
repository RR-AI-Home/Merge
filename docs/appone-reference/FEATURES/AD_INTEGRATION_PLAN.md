# Ad Integration Plan - Cricket Rivals

> **Status:** UI Placeholders Implemented  
> **Phase:** Phase 3 (Post-Launch)  
> **Last Updated:** 2026-04-23

---

## Overview

Ad integration designed to be non-intrusive and part of the UI from the start. Premium subscribers ($4.99/month) see no ads.

---

## Ad Positions

### 1. Dashboard Footer Banner ✅ IMPLEMENTED
**File:** `mobile_cricket_rivals/src/screens/DashboardScreen.js`
**Component:** `AdBanner` from `mobile_cricket_rivals/src/components/AdBanner.js`

**Position:** Fixed banner at bottom of Dashboard scroll view, below "Recent Performance" section

**Specs:**
- Size: 320x50 or adaptive banner
- Type: Static banner (AdMob, AppLovin, or similar)
- Frequency: Always visible on Dashboard
- User Impact: Low - below the fold, doesn't block primary actions

**Visual:**
```
┌─────────────────────────────┐
│  Recent Performance         │
│  ┌─────────────────────┐    │
│  │ Match 1: WON        │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │ Match 2: LOST       │    │
│  └─────────────────────┘    │
├─────────────────────────────┤
│  🏷️ Sponsored              │ ← Ad Banner
│  ┌─────────────────────┐    │
│  │    [Ad Space]       │    │
│  │ Premium = No Ads    │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

---

### 2. League Table Inline Banner ✅ IMPLEMENTED
**File:** `mobile_cricket_rivals/src/screens/LeagueScreen.js`
**Component:** `InlineAd` from `mobile_cricket_rivals/src/components/AdBanner.js`

**Position:** Between positions 4 and 5 in league standings table

**Specs:**
- Size: Inline banner matching table row height
- Type: Native-style banner blending with table design
- Frequency: Always visible between promotion/relegation zones
- User Impact: Medium - contextually relevant, breaks promotion zone visually

**Visual:**
```
┌─────────────────────────────┐
│  #1  Team A      85%       │ ← Promotion Zone
│  #2  Team B      72%       │
│  #3  Team C      68%       │
│  #4  Team D      65%       │
├─────────────────────────────┤
│ 🏷️ │   [Ad Space]         │ ← Ad Row (orange left border)
├─────────────────────────────┤
│  #5  Team E      58%       │ ← Relegation Zone
│  #6  Team F      52%       │
└─────────────────────────────┘
```

---

## Technical Implementation

### Components Created

**`mobile_cricket_rivals/src/components/AdBanner.js`**
- `AdBanner` - Standard banner component
- `InlineAd` - Inline ad for lists/tables
- Placeholder styling ready for SDK integration

### Integration Points

```javascript
// DashboardScreen.js
<AdBanner position="footer" />

// LeagueScreen.js  
{row.position === 5 && <InlineAd />}
```

---

## Future Ad SDK Integration

### Recommended SDKs
1. **Google AdMob** - Industry standard, good fill rates
2. **AppLovin MAX** - Good eCPM, mediation support
3. **Unity Ads** - Good for rewarded videos

### Implementation Steps

1. **Install SDK:**
   ```bash
   npx expo install react-native-google-mobile-ads
   ```

2. **Configure App IDs:**
   ```javascript
   // app.json
   {
     "react-native-google-mobile-ads": {
       "android_app_id": "ca-app-pub-xxx",
       "ios_app_id": "ca-app-pub-xxx"
     }
   }
   ```

3. **Replace Placeholders:**
   ```javascript
   // AdBanner.js
   import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
   
   const AdBanner = ({ position }) => {
     return (
       <BannerAd
         unitId={position === 'footer' ? BANNER_ID : INLINE_ID}
         size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
       />
     );
   };
   ```

4. **Add Premium Check:**
   ```javascript
   const { isPremium } = useSubscription();
   
   if (isPremium) return null; // No ads for premium
   ```

---

## Revenue Model

### Free Tier (with Ads)
- Banner ads on Dashboard
- Inline ad in League table
- Optional: Interstitial after every 3 matches
- Optional: Rewarded video for bonus coins

### Premium Tier ($4.99/month)
- No ads anywhere
- +5 Squad slots (20 total)
- Advanced stats dashboard
- Priority support
- Exclusive badge

### Revenue Projections
- **Banner eCPM:** $1-3
- **Interstitial eCPM:** $5-15
- **Rewarded eCPM:** $10-30
- **Premium conversion:** 2-5% of DAU

---

## UX Guidelines

### Do's ✅
- Place ads below primary content
- Use consistent styling (dark theme)
- Clearly label as "Sponsored"
- Respect premium subscribers
- Test ad loading states

### Don'ts ❌
- Block user actions with ads
- Show interstitials during gameplay
- Auto-play video ads with sound
- Place ads over interactive elements
- Show too many ads (max 2 per screen)

---

## Testing Checklist

- [ ] Ad banner visible on Dashboard
- [ ] Inline ad between positions 4/5 in League
- [ ] Premium users see no ads
- [ ] Ad placeholders don't break layout
- [ ] Scroll performance not impacted
- [ ] Dark theme consistent with app

---

**Next Steps:**
1. Launch with placeholders (Phase 1)
2. Integrate real ad SDK (Phase 3)
3. A/B test positions and frequency
4. Monitor user retention/ad revenue balance
