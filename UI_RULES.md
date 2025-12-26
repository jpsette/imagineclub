# UI_RULES — Imagine.club (MUST FOLLOW)

This file is the single source of truth for UI. Do not invent styles.

## Brand / Aesthetic
- Clean, premium editorial aesthetic
- Subtle personality (culture pop vibe) without visual noise
- Generous whitespace; modern, minimal, readable

## Layout
- Max width: 1200px
- Desktop padding: 24px
- Mobile padding: 16px
- Spacing scale: multiples of 8px only

## Typography
- Font: Inter
- Base body: 16px
- Weights: 400 / 500 / 600 / 700
- Clear hierarchy from 12px caption to 48px headline

## Colors (HEX)
- Background: #FAFAFA
- Surface: #FFFFFF
- Text primary: #1A1A1A
- Primary accent (indigo): #6366F1
- Secondary accent (amber): #F59E0B
- Include semantic: success / warning / danger (consistent)

## Shape / Effects
- Border radius: 8px–24px range (cards/buttons rounded)
- Shadows: soft only (no harsh drop shadows)
- Hover/focus: smooth transitions, accessible focus states

## Components to implement (required)
Public:
- Header (logo + nav + PT/EN switch + search)
- Button (Primary / Secondary / Ghost) + sizes
- Input (Text/Search) w/ icon support + error states
- ArticleCard (featured badge, hover)
- CreatorCard (cover, verification badge, stats)
- Badge/Tag (Primary/Secondary/Success/Warning/Danger/Neutral)
- Pagination (with ellipsis)
- LoadMore (infinite trigger)
- Skeleton loaders

Admin:
- AdminSidebar (collapsible, badges, user profile)
- AdminTable (sortable)
- Modal (4 sizes)
- Toast (4 types)

## Non-negotiables
- Keep UI consistent across public + admin
- Accessibility: keyboard navigation, focus rings, ARIA for modals/toasts
- Do not add new colors, fonts, spacing rules without updating docs
