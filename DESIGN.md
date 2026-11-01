# Apple Style Reference Design System for SandipAI

## 1. Color Palette
- Canvas Background: `#ffffff`
- Alternate Bands & Footer: `#f5f5f7`
- Nav-open Surface: `#fafafc` (with 1px `#e6e6e8` border and 20px blur)
- Text Ink (Primary): `#1d1d1f`
- Text Secondary: `#707070`
- Outlines & Borders: `#86868b`
- Hairline Dividers: `#d6d6d6` (and `#e6e6e8`)
- Interactive Links: `#0066cc`
- Conversion Pills (CTA Buttons): `#0071e3` (12px white text, fully rounded)

## 2. Typography (Inter configured via next/font with SF Pro Metrics)
- Hero Headline: `80px`, Weight: `600` (Semi-bold), Line Height: `84px` (~1.05), Letter Spacing: `-1.2px`
- Feature / Section Headings: `40px`, Weight: `600`, Line Height: `44px`, Letter Spacing: `-0.8px`
- Kickers / Subheads: `21px`, Weight: `600`, Letter Spacing: `-0.3px`
- Anchor Nav: `17px`, Weight: `500`
- Body Text: `17px`, Weight: `400`, Line Height: `1.4705882353`, Letter Spacing: `-0.374px` (-0.022em)
- Nav Links: `12px`, Weight: `400`, Letter Spacing: `-0.01em`
- Product Nav Title: `19px`, Weight: `600`
- Small Pill & Footer Legal: `12px`, Weight: `400` / `500`

## 3. Radii, Shadows, Spacing & Layout
- Cards & Media Frames: `28px` corner radius.
- Buttons / Pills: Fully rounded (`9999px` / `rounded-full`).
- Shadows: **NO box-shadows** anywhere on cards or buttons (flat, crisp Apple aesthetic). Shadows only permitted inside internal component shader visuals (e.g. internal orb specular).
- Section Gap: `90px`.
- Card Padding: `28px`.
- Element Gap: `20px`.
- Gradients: **NO decorative background gradients or rainbow gradient text**. Solid white or `#f5f5f7` surfaces.

## 4. Page Structure & Components
1. **Global Nav (44px)**: White bar, 12px links, SandipAI wordmark, search icon, mobile hamburger.
2. **Local Product Nav**: Sticky under global nav, 19px SandipAI title, outlined Explore pill, filled #0071e3 Get a demo pill.
3. **Hero**: Centered white stage, 21px kicker, 80px headline, body copy, #0066cc links, oversized ai-orb-face, floating 28px pricing capsule with #0071e3 pill.
4. **Anchor Nav**: Horizontal 17px/500 text row (Overview, Conversations, Pipeline, Integrations, Pricing).
5. **Highlights Band (#f5f5f7)**: 40px statements in 28px white cards featuring ai-conversation, ai-message, ai-reasoning, ai-tool-call, ai-task-list, grid-loader, plus translucent playback pill.
6. **Editorial Sections (White)**: 21px kicker, 40px left-aligned statement, 17px body, tilt-card visual frame with siri-orb, kinetic-type-scroll statement divider band in Ink on white.
7. **Customer Stories (#f5f5f7)**: coverflow-carousel with editable placeholder quotes.
8. **Pricing (White)**: Three white 28px cards, no shadows, filled #0071e3 pill only on recommended tier.
9. **Final CTA**: Centered 80px statement, filled #0071e3 pill, siri-orb centerpiece.
10. **Footer (#f5f5f7)**: 12px links in columns, legal text in #707070, theme-toggle.
