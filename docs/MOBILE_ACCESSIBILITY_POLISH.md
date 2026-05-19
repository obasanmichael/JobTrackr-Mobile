# Accessibility & polish (Phase 4)

## Dynamic Type

- `Typography` applies **`maxFontSizeMultiplier`** via `TEXT_MAX_FONT_SCALE_MULTIPLIER` (`src/theme/accessibility.ts`) so very large system font sizes don’t break dense layouts while still scaling primary reading sizes substantially.

## Contrast

Theme tokens live in **`src/theme/themes.ts`**.

| Pair (light) | Notes |
|----------------|-------|
| `textPrimary` on `background` | High contrast body text |
| `textSecondary` / `textMuted` on `background` | Secondary copy — verify promotional/legal screens still readable |
| `accent` / `onAccent` | Primary buttons |

Validate **dark mode** with the same pairs (`darkColors`). Prefer WCAG AA where feasible for normal-sized text.

## VoiceOver / TalkBack

- **Tab bar**: each tab exposes **`tabBarAccessibilityHint`** (`AppBottomTabsNavigator`, consumed by `FloatingBottomTabBar`).
- **Lists**: **`ApplicationCard`** exposes a summary **`accessibilityLabel`** and hides redundant children from the accessibility tree when wrapped in **`Pressable`**.
- **Hub rows**: **`HubNavRow`** collapses visual chrome under **`accessible={false}`** so the **`Pressable`** owns the spoken label + optional hint.
- **Headers**: primary **`Typography`** heroes on tab roots use **`accessibilityRole="header"`** where added (Applications, Reminders, Jobs, Quick add, Discover hub, Settings, auth).

## Keyboard & haptics

- **`Screen`** supports **`keyboardAvoiding`** (iOS-friendly padding) and sets **`keyboardDismissMode`** on vertical **`ScrollView`**s (`interactive` on iOS, `on-drag` on Android).
- Auth and Quick add flows enable **`keyboardAvoiding`** where forms risk being covered by the keyboard.
- **`Button`** accepts **`hapticOnPress`** using **`expo-haptics`** (`src/lib/haptics.ts`) for lightweight confirmation on primary actions.
