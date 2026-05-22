# Mobile navigation & production milestones (Phases 1–3)

This doc is the reference for conventions implemented in **Phase 1 (navigation)** through **Phase 3 (production hardening)**.

## Architecture (tabs → stacks → screens)

```text
RootNavigator [ header hidden ]
├── AuthFlow           [ header hidden · Login / Register ]
└── SignedInTabs       [ bottom tabs · header hidden on tab shell ]
    ├── HomeStack      [ native headers on push ]
    ├── ApplicationsStack
    ├── QuickAddStack
    ├── RemindersStack
    └── MoreStack      [ hub + Settings + parity routes ]
```

- **Discover / Improve / Account parity** routes live under **`More`** (hub), except **Jobs** stays on **Home → Jobs** to match emphasis with the dashboard card.
- **Settings** (`More → Settings`) holds **profile, appearance, session, developer gallery (__DEV__)** only.

## Phase 1, Stack chrome & safe area

- **Native stack headers** are enabled via `useTabStackScreenOptions()` (`src/navigation/useTabStackScreenOptions.ts`): themed background, tinted controls, **`headerBackTitleVisible: false`**, **`contentStyle`** background.
- **Tab stack roots** (Home dashboard, Applications list, Quick add, Reminders overview, More hub): **`headerShown: false`** so we don’t stack a slim nav title above the screen’s own hero, use **`edges={['top','left','right','bottom']}`** on `Screen` so the notch/status area is still respected.
- **Pushed routes** inside the same stacks keep **`headerShown: true`** (defaults from `screenOptions`): back affordance only where depth > 1. Their `Screen` children use **`edges={['left','right','bottom']}`** (no duplicate top inset under the native header).
- **Auth** screens keep full-screen safe areas (`edges` including top/bottom).
- **Dynamic titles:** `ApplicationDetail` sets header title from company/role (`useLayoutEffect`). `ResumeDetail` sets header from filename.
- **Back navigation:** Provided by OS (iOS back chevron / Android toolbar back). Explicit `navigation.goBack()` remains for destructive flows (e.g. delete success).

## Phase 2, Information architecture (“More” vs “Settings”)

| Area | Screen | Purpose |
|------|--------|--------|
| **More hub** | `MoreHub` | Discover & improve shortcuts + billing/calendar placeholders; link into **Account → Settings**. |
| **Account** | `Settings` | Web **Settings** parity: profile snapshot, appearance, logout. |
| **Resume** | `ResumeOverview`, `ResumeDetail` | Nested from More hub. |

Tab bar fifth item: **`More`** (icon: menu), **not** “Settings” alone—reduces burying Discover under account.

## Phase 3, Production hardening

| Item | Implementation |
|------|-------------------|
| **Auth bypass** | `UI_SCAFFOLD_BYPASS_AUTHENTICATION` requires **`__DEV__` _and_** `EXPO_PUBLIC_UI_SCAFFOLD_AUTH_SKIP=1`. Release builds (`__DEV__ === false`) **never** skip auth regardless of `.env`. |
| **Retries** | `QueryClient` default query **`retry: 2`**. |
| **Offline cue** | `ConnectivityBanner` uses `@react-native-community/netinfo` (absolute banner under status bar). |
| **Render errors** | `AppErrorBoundary` wraps `RootNavigator` inside `NavigationContainer`. |

Further store-readiness (privacy URL, account deletion link, ATS labels) is covered in **`docs/MOBILE_STORE_SUBMISSION.md`** and the **Privacy legal** flow under **More → Settings**.

## Phase 4, Accessibility & polish

| Area | Implementation |
|------|----------------|
| **Dynamic Type** | `Typography` caps scaling via `TEXT_MAX_FONT_SCALE_MULTIPLIER` (`src/theme/accessibility.ts`). |
| **Contrast / headings** | Theme tokens documented in **`docs/MOBILE_ACCESSIBILITY_POLISH.md`**; tab-root heroes use `accessibilityRole="header"` where updated. |
| **VoiceOver / TalkBack** | Tab **`tabBarAccessibilityHint`** (`FloatingBottomTabBar`); **`ApplicationCard`** summaries; shared **`HubNavRow`** for hub/settings/legal lists. |
| **Keyboard / haptics** | **`Screen`** `keyboardAvoiding` + scroll **`keyboardDismissMode`**; **`Button`** `hapticOnPress` + **`expo-haptics`** on auth / jobs search / quick add. |

Localization guidance (future multi-locale) lives in **`docs/MOBILE_LOCALIZATION_STRATEGY.md`**, UI strings remain English inline for now.

## Phase 5, Store submission package

| Area | Implementation |
|------|----------------|
| **Privacy / terms / support / deletion** | Env-driven URLs (`src/constants/legal-env.ts`) + **`LegalInformation`** screen (+ Settings entry). |
| **Nutrition labels / Data safety** | Checklist aligned to actual SDK usage in **`docs/MOBILE_STORE_SUBMISSION.md`**. |
| **Display name** | **`app.json`** `expo.name` → **JobTrackr** (slug unchanged). |
| **Versioning / screenshots** | EAS **`remote`** version source + **`assets/store/README.md`** workflow notes. |

## Conventions checklist (for future PRs)

1. **Tab roots:** `headerShown: false` + full `edges` incl. `top`. **Pushes:** declare `Stack.Screen` **title**, **omit top** inset on inner `Screen` so the native header owns the upper safe inset.
2. **Cross-tab jumps:** use `openMoreScreen()` from `navigation-helpers.ts` when opening More-stack routes from other tabs so **MoreHub stays in the back stack** and back navigation works.
3. **Tab re-tap:** `FloatingBottomTabBar` pops to each tab's root when the tab is already focused and the nested stack depth is &gt; 0 (standard iOS pattern).
4. **Back labels:** tab roots set human `title` values (e.g. **More**, not `MoreHub`); pushed screens use `nestedStackScreenOptions()` for consistent back titles.
5. **No duplicate heroes:** pushed screens rely on the native header; avoid a second large in-screen title on the same page.
6. **No scaffold** in staging/production EAS profiles—omit `EXPO_PUBLIC_UI_SCAFFOLD_AUTH_SKIP` or leave unset outside local dev.
