# Apple Style Reference Design System for ORYNVAI

## 1. Brand Identity & Color Palette
- Brand Name: **ORYNVAI**
- Tagline: Autonomous Revenue Intelligence
- Canvas Background: `#ffffff`
- Alternate Bands: `#f5f5f7`
- Nav Surface: `rgba(255, 255, 255, 0.86)` with backdrop blur
- Text Ink (Primary): `#1d1d1f`
- Text Ink (Muted): `#424245`
- Text Secondary: `#6e6e73`
- Outlines & Borders: `#86868b`
- Hairline Dividers: `#d2d2d7` and `#e6e6e8`
- Interactive Links: `#0066cc`
- Primary Conversion CTA (Book a sales call): `#0071e3` (pill, white text)
- Secondary Conversion CTA (Talk to ORYNVAI): Outline pill with live Vapi WebRTC integration
- Operational Accent: `#248a3d` (Success active pulse)
- Background Texture: Subtle tactile paper noise (`bg-subtle-grain`) and architectural micro-grid (`bg-micro-grid`)

## 2. Typography (Inter configured via next/font with SF Pro Metrics)
- Hero Headline: `clamp(40px, 5.4vw, 72px)`, Semi-bold (600), Line Height: ~1.04, Letter Spacing: `-0.032em`, Text-wrap: `balance`
- Feature / Section Headings: `32px` to `40px`, Semi-bold (600), Letter Spacing: `-0.025em`
- Kickers / Subheads: `12px` font-mono, Semi-bold (600), Uppercase, Tracking: `0.08em`
- Body Text: `16px` to `17px`, Line Height: ~1.5, Letter Spacing: `-0.015em`
- Nav Links: `12px` to `14px`, Medium, Tracking: `-0.01em`

## 3. Radii, Shadows, Spacing & Layout
- Section Spacing: `96px` to `112px`
- Card Radii: `12px` to `16px` precision corners
- Buttons: Rounded pill (`rounded-full`)
- Cards: Flat, crisp architectural borders (`border border-[var(--dividers)]`)
- High contrast, dark mode and light mode complete parity

## 4. Page Structure & Conversion Architecture
1. **Sticky Global Nav (48px)**: ORYNVAI brand mark with indicator dot, How It Works, Capabilities, Cost Comparison, Customer Proof, "Talk to ORYNVAI" (Voice) button, "Book a sales call" (Calendar) button.
2. **Hero (Outcome-Led)**:
   - Headline: "Convert your extra hours into revenue. Close inbound buyers around the clock."
   - Dual Conversion CTAs: "Book a sales call" and "Talk to ORYNVAI".
   - Signature AIOrbFace with 24/7 continuous inbound coverage capsule.
3. **Highlights Band (#how-it-works)**: Preserved 4-stage interactive tab sequence (Conversation, Reasoning, Live Booking, Pipeline Sync).
4. **Editorial Feature Stories (#features)**: Conversational Intelligence, Kinetic Typography Scroll, Pipeline Velocity, Ecosystem Sync.
5. **Cost Comparison (#comparison)**:
   - Replaces conventional subscription pricing.
   - Comprehensive economic comparison: Human sales capacity (40 hrs/wk, salary + benefits + ramp) vs. ORYNVAI autonomous continuous coverage (168 hrs/wk, instant <30s response, zero recruitment lag).
   - Clear client configuration baseline notice.
6. **Customer Proof (#customers)**:
   - 2x2 clean, non-overlapping responsive grid.
   - Verified outcome metrics, quotes, and attribution.
   - Video testimonial extension hook ready for future assets.
7. **Final CTA (#cta)**: Outcome-focused closing headline, AIOrbFace emblem, dual conversion CTAs.
8. **Simplified Footer (#footer)**:
   - Compact brand description, essential links, legal links, copyright, theme toggle.
